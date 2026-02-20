-- Presenter profiles (migration 004) replaced the speaker_names text field.
-- Drop the orphaned column and remove it from the create_session RPC.

alter table sessions drop column if exists speaker_names;

-- Re-create create_session without the p_speaker_names parameter
create or replace function create_session(
  p_lab_slug text,
  p_lab_title text,
  p_alias text default null,
  p_passphrase text default null,
  p_join_password text default null,
  p_slide_deck text default null,
  p_event_name text default null,
  p_company_name text default null,
  p_wifi_ssid text default null,
  p_wifi_password text default null,
  p_api_credit_url text default null
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

  insert into sessions (
    lab_slug, lab_title, alias, join_password, trainer_passphrase_hash,
    slide_deck, event_name, company_name,
    wifi_ssid, wifi_password, api_credit_url
  )
  values (
    p_lab_slug, p_lab_title, p_alias, p_join_password, v_hash,
    p_slide_deck, p_event_name, p_company_name,
    p_wifi_ssid, p_wifi_password, p_api_credit_url
  )
  returning id into v_session_id;

  return v_session_id;
end;
$$;
