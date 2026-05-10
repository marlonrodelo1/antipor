-- Antiport: Row Level Security
-- RLS ON en todas las tablas con datos de usuario.
-- blocklist_domains y scriptures son lectura pública; mutaciones solo service_role.

-- ==========================================================================
-- users
-- ==========================================================================
alter table public.users enable row level security;

drop policy if exists users_select_self on public.users;
create policy users_select_self on public.users
  for select using (id = auth.uid());

drop policy if exists users_insert_self on public.users;
create policy users_insert_self on public.users
  for insert with check (id = auth.uid());

drop policy if exists users_delete_self on public.users;
create policy users_delete_self on public.users
  for delete using (id = auth.uid());

-- ==========================================================================
-- user_profile
-- ==========================================================================
alter table public.user_profile enable row level security;

drop policy if exists user_profile_select on public.user_profile;
create policy user_profile_select on public.user_profile
  for select using (user_id = auth.uid());

drop policy if exists user_profile_insert on public.user_profile;
create policy user_profile_insert on public.user_profile
  for insert with check (user_id = auth.uid());

drop policy if exists user_profile_update on public.user_profile;
create policy user_profile_update on public.user_profile
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists user_profile_delete on public.user_profile;
create policy user_profile_delete on public.user_profile
  for delete using (user_id = auth.uid());

-- ==========================================================================
-- user_blocklist_overrides
-- ==========================================================================
alter table public.user_blocklist_overrides enable row level security;

drop policy if exists ublo_select on public.user_blocklist_overrides;
create policy ublo_select on public.user_blocklist_overrides
  for select using (user_id = auth.uid());

drop policy if exists ublo_insert on public.user_blocklist_overrides;
create policy ublo_insert on public.user_blocklist_overrides
  for insert with check (user_id = auth.uid());

drop policy if exists ublo_update on public.user_blocklist_overrides;
create policy ublo_update on public.user_blocklist_overrides
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists ublo_delete on public.user_blocklist_overrides;
create policy ublo_delete on public.user_blocklist_overrides
  for delete using (user_id = auth.uid());

-- ==========================================================================
-- intervention_log
-- ==========================================================================
alter table public.intervention_log enable row level security;

drop policy if exists intervention_log_select on public.intervention_log;
create policy intervention_log_select on public.intervention_log
  for select using (user_id = auth.uid());

drop policy if exists intervention_log_insert on public.intervention_log;
create policy intervention_log_insert on public.intervention_log
  for insert with check (user_id = auth.uid());

drop policy if exists intervention_log_update on public.intervention_log;
create policy intervention_log_update on public.intervention_log
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists intervention_log_delete on public.intervention_log;
create policy intervention_log_delete on public.intervention_log
  for delete using (user_id = auth.uid());

-- ==========================================================================
-- daily_checkins
-- ==========================================================================
alter table public.daily_checkins enable row level security;

drop policy if exists daily_checkins_select on public.daily_checkins;
create policy daily_checkins_select on public.daily_checkins
  for select using (user_id = auth.uid());

drop policy if exists daily_checkins_insert on public.daily_checkins;
create policy daily_checkins_insert on public.daily_checkins
  for insert with check (user_id = auth.uid());

drop policy if exists daily_checkins_update on public.daily_checkins;
create policy daily_checkins_update on public.daily_checkins
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists daily_checkins_delete on public.daily_checkins;
create policy daily_checkins_delete on public.daily_checkins
  for delete using (user_id = auth.uid());

-- ==========================================================================
-- streaks
-- ==========================================================================
alter table public.streaks enable row level security;

drop policy if exists streaks_select on public.streaks;
create policy streaks_select on public.streaks
  for select using (user_id = auth.uid());

drop policy if exists streaks_insert on public.streaks;
create policy streaks_insert on public.streaks
  for insert with check (user_id = auth.uid());

drop policy if exists streaks_update on public.streaks;
create policy streaks_update on public.streaks
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists streaks_delete on public.streaks;
create policy streaks_delete on public.streaks
  for delete using (user_id = auth.uid());

-- ==========================================================================
-- anchors
-- ==========================================================================
alter table public.anchors enable row level security;

drop policy if exists anchors_select on public.anchors;
create policy anchors_select on public.anchors
  for select using (user_id = auth.uid());

drop policy if exists anchors_insert on public.anchors;
create policy anchors_insert on public.anchors
  for insert with check (user_id = auth.uid());

drop policy if exists anchors_update on public.anchors;
create policy anchors_update on public.anchors
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists anchors_delete on public.anchors;
create policy anchors_delete on public.anchors
  for delete using (user_id = auth.uid());

-- ==========================================================================
-- triggers_observed
-- ==========================================================================
alter table public.triggers_observed enable row level security;

drop policy if exists triggers_observed_select on public.triggers_observed;
create policy triggers_observed_select on public.triggers_observed
  for select using (user_id = auth.uid());

drop policy if exists triggers_observed_insert on public.triggers_observed;
create policy triggers_observed_insert on public.triggers_observed
  for insert with check (user_id = auth.uid());

drop policy if exists triggers_observed_update on public.triggers_observed;
create policy triggers_observed_update on public.triggers_observed
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists triggers_observed_delete on public.triggers_observed;
create policy triggers_observed_delete on public.triggers_observed
  for delete using (user_id = auth.uid());

-- ==========================================================================
-- blocklist_domains: SELECT publica (anon + authenticated). Mutaciones service_role.
-- ==========================================================================
alter table public.blocklist_domains enable row level security;

drop policy if exists blocklist_domains_select_public on public.blocklist_domains;
create policy blocklist_domains_select_public on public.blocklist_domains
  for select to anon, authenticated using (true);

-- (Sin policy de insert/update/delete: solo service_role bypass RLS.)

-- ==========================================================================
-- scriptures: SELECT publica. Mutaciones service_role.
-- ==========================================================================
alter table public.scriptures enable row level security;

drop policy if exists scriptures_select_public on public.scriptures;
create policy scriptures_select_public on public.scriptures
  for select to anon, authenticated using (true);
