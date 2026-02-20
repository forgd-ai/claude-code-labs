-- Add join password column and a safe boolean for client reads
alter table sessions add column join_password text;
alter table sessions add column has_join_password boolean
  generated always as (join_password is not null) stored;

-- Replace create_session to accept optional join password (no default)
create or replace function create_session(
  p_lab_slug text,
  p_lab_title text,
  p_alias text default null,
  p_passphrase text default null,
  p_join_password text default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_session_id uuid;
  v_hash text;
begin
  if p_passphrase is not null then
    v_hash := crypt(p_passphrase, gen_salt('bf'));
  end if;

  insert into sessions (lab_slug, lab_title, alias, join_password, trainer_passphrase_hash)
  values (p_lab_slug, p_lab_title, p_alias, p_join_password, v_hash)
  returning id into v_session_id;

  return v_session_id;
end;
$$;

-- Server-side join with password validation (security definer bypasses RLS)
create or replace function join_session(
  p_session_id uuid,
  p_name text,
  p_join_password text default null
)
returns json
language plpgsql
security definer
as $$
declare
  v_stored_password text;
  v_participant record;
begin
  select join_password into v_stored_password
  from sessions
  where id = p_session_id;

  if not found then
    raise exception 'Session not found';
  end if;

  if v_stored_password is not null
     and v_stored_password is distinct from p_join_password then
    raise exception 'Incorrect join password';
  end if;

  insert into participants (session_id, name)
  values (p_session_id, p_name)
  on conflict (session_id, name) do update set name = excluded.name
  returning * into v_participant;

  return row_to_json(v_participant);
end;
$$;

-- Lock down direct participant inserts — must go through join_session RPC
drop policy "participants_insert" on participants;
create policy "participants_insert" on participants
  for insert with check (false);
