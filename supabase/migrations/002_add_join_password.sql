-- Add participant join password to sessions
alter table sessions add column join_password text;

-- Replace create_session to accept join_password
create or replace function create_session(
  p_lab_slug text,
  p_lab_title text,
  p_alias text default null,
  p_passphrase text default null,
  p_join_password text default 'claude_code_wizards'
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
