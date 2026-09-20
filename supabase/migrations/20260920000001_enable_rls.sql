-- RLS 기본 거부 스위치를 켠다. 정책(policy)은 인증이 붙는 2단계에서 추가한다 —
-- 여기서 막는 건 정책이 아니라 "테이블이 기본 공개"라는 상태 자체다.
--
-- 지금 앱은 예외 없이 adminClient()(service_role)로만 읽고 쓴다(lib/store/plans.ts,
-- lib/supabase/admin.ts). service_role은 RLS를 우회하므로 이 마이그레이션은 앱 동작을
-- 한 톨도 바꾸지 않는다. 바뀌는 건 anon/authenticated 키(둘 다 브라우저에 나갈 수 있는
-- 값이다)로 PostgREST(/rest/v1/...)를 직접 두드렸을 때뿐이다 — 정책이 하나도 없는
-- 상태에서 RLS를 켜면 그 두 역할은 전 테이블에서 0행을 받는다(기본 거부).
--
-- 이걸 미루면 안 되는 이유: 머지되는 산출물은 이 마이그레이션 파일이고, `db push`가
-- 원격에 그대로 적용한다. anon 키는 설계상 공개되는 값이라 "2단계에 정책과 같이
-- 켜기"로 미루는 순간 그 사이 창이 실제 노출 구간이 된다.
alter table profiles       enable row level security;
alter table plans          enable row level security;
alter table notices        enable row level security;
alter table days           enable row level security;
alter table schedule_items enable row level security;
alter table places         enable row level security;
alter table transport_info enable row level security;
