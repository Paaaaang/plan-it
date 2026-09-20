-- 플랜잇 초기 스키마.
-- 스펙: docs/superpowers/specs/2026-09-20-supabase-store-design.md §3
--
-- 기능명세서 §3.2와 다섯 군데 다르다(§3.1 표 참고). 화면이 진실이다:
--   plan_type은 enum이 아니라 자유 텍스트, party_label 추가, description 없음,
--   transport_info.place_id 추가, expires_at 추가.

create table profiles (
  -- id가 uuid가 아니라 text인 이유는 Step 2 참고. 픽스처 id(s-n1)가 uuid가 아니다.
  id           text primary key default gen_random_uuid()::text,
  display_name text not null,
  -- 2단계에서 auth.users(id) 외래키가 된다.
  role         text not null default 'member' check (role in ('member', 'admin')),
  created_at   timestamptz not null default now()
);

create table plans (
  id              text primary key default gen_random_uuid()::text,
  owner_id        text not null references profiles(id) on delete cascade,
  slug            text not null unique,
  title           text not null,
  plan_type       text not null,
  -- 빈 문자열이 아니라 NULL이 "없음"이다(ViewerPlan.partyLabel과 같은 규약).
  party_label     text,
  start_date      date not null,
  end_date        date not null,
  status          text not null default 'draft' check (status in ('draft', 'public', 'private')),
  -- salt + scrypt. status='private'일 때만 의미가 있다.
  password_hash   text,
  cover_image_url text,
  -- NULL = 무기한. 뷰어의 만료 화면이 이 값을 본다(스펙 §5.1).
  expires_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint plans_range_ok check (start_date <= end_date)
);

create table places (
  id        text primary key default gen_random_uuid()::text,
  plan_id   text not null references plans(id) on delete cascade,
  name      text not null,
  address   text not null default '',
  lat       double precision,
  lng       double precision,
  memo      text,
  tags      text[] not null default '{}',
  is_pinned boolean not null default false
);

create table notices (
  id            text primary key default gen_random_uuid()::text,
  plan_id       text not null references plans(id) on delete cascade,
  title         text not null,
  body          text not null default '',
  display_order int not null
);

create table days (
  id         text primary key default gen_random_uuid()::text,
  plan_id    text not null references plans(id) on delete cascade,
  day_number int not null,
  date       date not null,
  unique (plan_id, day_number)
);

create table schedule_items (
  id            text primary key default gen_random_uuid()::text,
  day_id        text not null references days(id) on delete cascade,
  start_time    time not null,
  duration_min  int,
  activity_name text not null,
  memo          text,
  -- F-EDIT-PLACE-5가 여기 한 줄이 된다: 장소를 지우면 항목의 연결이 끊긴다.
  -- 앱 코드(place-actions.ts::syncEmbedded)가 하던 일을 DB가 지킨다.
  place_id      text references places(id) on delete set null,
  display_order int not null
);

create table transport_info (
  id             text primary key default gen_random_uuid()::text,
  plan_id        text not null references plans(id) on delete cascade,
  place_id       text references places(id) on delete set null,
  mode           text not null,
  from_label     text not null,
  to_label       text not null,
  duration_label text not null,
  note           text,
  display_order  int not null
);

-- 조회 경로에 맞춘 인덱스. slug는 unique가 이미 덮는다.
create index plans_owner_idx          on plans (owner_id);
create index notices_plan_idx         on notices (plan_id, display_order);
create index places_plan_idx          on places (plan_id);
create index days_plan_idx            on days (plan_id, day_number);
create index schedule_items_day_idx   on schedule_items (day_id, display_order);
create index transport_plan_idx       on transport_info (plan_id, display_order);
