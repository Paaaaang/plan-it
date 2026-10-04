-- owner_id와 profiles.id만 uuid로 바꾼다.
--
-- 1단계가 모든 id를 text로 둔 이유는 픽스처 id(s-n1·pl-air)가 uuid가 아니라서였다.
-- 이 둘은 거기 해당하지 않는다 — 픽스처 id가 아니고 시드 값이 이미 uuid 문자열이다.
-- text로 두면 auth.users FK가 거부되고 정책의 auth.uid() 비교에 캐스트가 붙는다.
-- 나머지 id 컬럼(plans.id · notices.id · …)은 **그대로 text다.**

alter table plans drop constraint plans_owner_id_fkey;
-- profiles.id의 기본값(gen_random_uuid()::text)이 text형이라 타입 변경 중
-- "cannot be cast automatically to type uuid"로 막힌다. 기본값을 떼고 바꾼 뒤
-- uuid 네이티브로 다시 건다 — 이제 auth.users.id가 신원의 진실이라 사실
-- 이 기본값이 쓰일 일은 없지만(Step 2 트리거가 new.id를 그대로 넣는다),
-- 컬럼 타입과 기본값의 타입을 맞춰 둔다.
alter table profiles alter column id drop default;
alter table profiles alter column id type uuid using id::uuid;
alter table profiles alter column id set default gen_random_uuid();
alter table plans alter column owner_id type uuid using owner_id::uuid;
alter table plans add constraint plans_owner_id_fkey
  foreign key (owner_id) references profiles(id) on delete cascade;
