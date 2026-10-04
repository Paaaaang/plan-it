-- profiles를 auth.users에 묶는다.
--
-- 1단계에서 profiles.id는 그냥 text였다(시드 계정 하나뿐이라 충분했다).
-- 인증이 붙으면 신원의 진실은 auth.users다.
--
-- 트리거로 profiles 행을 만드는 이유: 앱이 만들면 "인증은 됐는데 프로필이 없는" 상태가
-- 로그인 첫 요청이 실패했을 때 남는다. 트리거는 사용자 생성과 같은 트랜잭션에서 돈다.

alter table profiles
  add constraint profiles_id_fk foreign key (id) references auth.users(id) on delete cascade;

create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name, role)
  values (
    new.id,
    -- 카카오는 닉네임을 user_metadata에 넣는다. 없으면 이메일 앞부분으로 떨어진다.
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), '기획자'),
    'member'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
