-- 소유권을 DB가 지킨다.
--
-- 1단계가 RLS를 켜고 정책을 0개로 뒀다(기본 거부). 여기서 authenticated 롤에만 정책을
-- 연다. anon은 정책이 없어 계속 완전 차단이고, service_role은 RLS를 우회한다 —
-- 공개 뷰어가 그 경로로 남의 일정을 읽는다(로그인이 없어 auth.uid()가 없다).

-- plans: 내 것만.
create policy plans_owner_select on plans for select to authenticated
  using (owner_id = auth.uid());
create policy plans_owner_insert on plans for insert to authenticated
  with check (owner_id = auth.uid());
create policy plans_owner_update on plans for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy plans_owner_delete on plans for delete to authenticated
  using (owner_id = auth.uid());

-- profiles: 자기 행만. insert는 트리거(security definer)가 하므로 정책이 필요 없다.
create policy profiles_self_select on profiles for select to authenticated
  using (id = auth.uid());
create policy profiles_self_update on profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- plan_id로 부모를 보는 자식들.
-- 함수로 빼지 않고 테이블마다 적는다 — Postgres 정책은 인라인 조건이 가장 단순하고,
-- 네 테이블이 같은 모양이라 함수가 벌어 주는 것이 없다.
create policy notices_owner_all on notices for all to authenticated
  using (exists (select 1 from plans p where p.id = plan_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from plans p where p.id = plan_id and p.owner_id = auth.uid()));

create policy places_owner_all on places for all to authenticated
  using (exists (select 1 from plans p where p.id = plan_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from plans p where p.id = plan_id and p.owner_id = auth.uid()));

create policy transport_owner_all on transport_info for all to authenticated
  using (exists (select 1 from plans p where p.id = plan_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from plans p where p.id = plan_id and p.owner_id = auth.uid()));

create policy days_owner_all on days for all to authenticated
  using (exists (select 1 from plans p where p.id = plan_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from plans p where p.id = plan_id and p.owner_id = auth.uid()));

-- schedule_items는 plan_id가 없다 — days를 거쳐 2단이다.
-- 1단계의 scopeIds가 앱 코드에서 다루던 비대칭이 여기로 옮겨 왔다.
create policy items_owner_all on schedule_items for all to authenticated
  using (exists (
    select 1 from days d join plans p on p.id = d.plan_id
    where d.id = day_id and p.owner_id = auth.uid()))
  with check (exists (
    select 1 from days d join plans p on p.id = d.plan_id
    where d.id = day_id and p.owner_id = auth.uid()));
