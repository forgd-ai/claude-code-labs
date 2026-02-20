-- Presenter profiles
create table presenters (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text,
  organization text not null default 'forgd',
  photo_url text,
  created_at timestamptz default now()
);

-- Session ↔ Presenter junction
create table session_presenters (
  session_id uuid references sessions(id) on delete cascade,
  presenter_id uuid references presenters(id) on delete cascade,
  sort_order int not null default 0,
  primary key (session_id, presenter_id)
);

-- RLS
alter table presenters enable row level security;
alter table session_presenters enable row level security;

-- Public read (needed for slide rendering without auth)
create policy "public read presenters"
  on presenters for select using (true);

create policy "public read session_presenters"
  on session_presenters for select using (true);

-- Upsert presenter — security definer so writes work without auth for now
-- (auth will be wired to Google Workspace in a future migration)
create or replace function upsert_presenter(
  p_full_name text,
  p_title text default null,
  p_organization text default 'forgd',
  p_photo_url text default null,
  p_id uuid default null
) returns uuid
language plpgsql security definer
as $$
declare
  v_id uuid;
begin
  if p_id is not null then
    update presenters set
      full_name = p_full_name,
      title = p_title,
      organization = p_organization,
      photo_url = p_photo_url
    where id = p_id
    returning id into v_id;
  else
    insert into presenters (full_name, title, organization, photo_url)
    values (p_full_name, p_title, p_organization, p_photo_url)
    returning id into v_id;
  end if;
  return v_id;
end;
$$;

create or replace function delete_presenter(p_id uuid)
returns void
language plpgsql security definer
as $$
begin
  delete from presenters where id = p_id;
end;
$$;

-- Replace the full presenter list for a session
create or replace function set_session_presenters(
  p_session_id uuid,
  p_presenter_ids uuid[]
) returns void
language plpgsql security definer
as $$
declare
  v_id uuid;
  v_order int := 1;
begin
  delete from session_presenters where session_id = p_session_id;
  if p_presenter_ids is not null then
    foreach v_id in array p_presenter_ids loop
      insert into session_presenters (session_id, presenter_id, sort_order)
      values (p_session_id, v_id, v_order);
      v_order := v_order + 1;
    end loop;
  end if;
end;
$$;

-- Get presenters for a session ordered by sort_order
create or replace function get_session_presenters(p_session_id uuid)
returns table(id uuid, full_name text, title text, organization text, photo_url text, sort_order int)
language sql security definer
as $$
  select p.id, p.full_name, p.title, p.organization, p.photo_url, sp.sort_order
  from session_presenters sp
  join presenters p on p.id = sp.presenter_id
  where sp.session_id = p_session_id
  order by sp.sort_order;
$$;
