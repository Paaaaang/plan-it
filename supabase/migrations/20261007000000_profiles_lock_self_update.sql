-- I1: profiles_self_update가 "행"만 보고 "컬럼"을 안 본다.
-- id = auth.uid() 인 행이면 어떤 컬럼이든 바꿀 수 있었다 — 즉 자기 role을 admin으로
-- 셀프 승급할 수 있었다(재현: update profiles set role='admin' where id=auth.uid() → UPDATE 1).
--
-- RLS의 with check에 자기 테이블을 다시 읽는 서브쿼리(select role from profiles where id=...)로
-- 막는 방법도 있지만, 같은 문 안에서 그 서브쿼리가 OLD/NEW 중 뭘 보는지가 MVCC 스냅샷에
-- 미묘하게 걸린다. 트리거로 간다 — 트리거는 OLD 레코드를 직접 들고 있어 그 함정이 없고,
-- "자기 자신에 대한 셀프서비스 업데이트"(authenticated 롤)에만 걸어 service_role로 하는
-- 미래의 관리자 승급(2c 이후)은 그대로 통과시킨다.
create or replace function profiles_lock_identity() returns trigger
language plpgsql as $$
begin
  if current_user = 'authenticated' then
    new.id := old.id;
    new.role := old.role;
  end if;
  return new;
end;
$$;

create trigger profiles_lock_identity_before_update
  before update on profiles
  for each row execute function profiles_lock_identity();

-- 이월 minor: handle_new_user()의 표시 이름 폴백이 빈 문자열을 유효한 이름으로 받아들였다.
-- 카카오가 name: ""을 주면 coalesce가 그 빈 문자열에서 멈춰 "기획자" 폴백까지 못 간다.
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name, role)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'name', ''),
      nullif(split_part(new.email, '@', 1), ''),
      '기획자'
    ),
    'member'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- M13 위생: 트리거 함수는 반환형이 trigger라 SQL에서 직접 호출이 불가해 지금도 악용 경로는
-- 없지만, "트리거 전용 함수는 PUBLIC EXECUTE를 안 가진다"를 기본값으로 맞춘다.
revoke execute on function handle_new_user() from public;
revoke execute on function profiles_lock_identity() from public;
