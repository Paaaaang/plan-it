# Project Structure (프로젝트 폴더 구조)

이 프로젝트는 **Next.js (App Router)**와 **Tailwind CSS v4**, **TypeScript**를 사용하는 현대적인 웹 애플리케이션입니다.
백엔드는 **Supabase (PostgreSQL + Auth + PostgREST)**, 캐시는 **Redis**, CDN/스토리지는 **Cloudflare**를 사용합니다.
디자인 시스템은 **planit-design-system** (Toss Design System 참고, Pretendard + Planit Blue 컬러)을 기반으로 합니다.

---

## 전체 디렉터리 구조

> **src/ 레이아웃 (2026-10)**: Next 16은 `app`·`pages`·`public`·`src`만 의미 있는 최상위 폴더로 인식한다.
> 라우팅은 `src/app/`로, 나머지 소스는 `src/client/`(브라우저 전용) · `src/server/`(서버 전용) ·
> `src/shared/`(양쪽 다 쓰는 순수 로직·타입)로 나눈다. 가르는 기준 하나: **`'use client'` 컴포넌트에서
> import하면 안 되는 것은 `server/`, Server Component에서 import하면 안 되는 것은 `client/`,
> 둘 다 안전하면 `shared/`.** `proxy.ts`는 Next 요구사항대로 `app/`과 같은 층(`src/`)으로 옮겼다.
> `public/`·`supabase/`·`.github/`·`scripts/`·`tests/`는 Next 컨벤션·도구 설정상 루트에 남는다.

```text
plan-it/
├── src/
│   ├── app/                                 # App Router — 라우팅 및 페이지
│   │   ├── (auth)/                          # 🔓 인증 관련 라우트 그룹
│   │   │   ├── layout.tsx                   #    인증 페이지 공통 레이아웃
│   │   │   └── login/
│   │   │       └── page.tsx                 #    로그인 페이지 (카카오 OAuth)
│   │   │
│   │   ├── auth/callback/
│   │   │   └── route.ts                     # 🔓 OAuth 콜백 — 코드를 세션으로 교환 (proxy matcher 밖)
│   │   │
│   │   ├── (console)/                       # 🖥️ 기획자 콘솔 라우트 그룹 (인증 필요)
│   │   │   ├── layout.tsx                   #    콘솔 공통 레이아웃 (내비게이션 등)
│   │   │   └── dashboard/
│   │   │       ├── page.tsx                 #    대시보드 — 내 일정 목록, 미리보기
│   │   │       └── plans/
│   │   │           └── [id]/
│   │   │               └── edit/
│   │   │                   └── page.tsx     #    편집 페이지 — 섹션 컴포넌트 편집
│   │   │
│   │   ├── (admin)/                         # 🛡️ 관리자 콘솔 라우트 그룹 (admin 권한)
│   │   │   ├── layout.tsx                   #    관리자 공통 레이아웃
│   │   │   └── admin/
│   │   │       ├── page.tsx                 #    관리자 대시보드 — KPI 모니터링
│   │   │       ├── moderation/
│   │   │       │   └── page.tsx             #    콘텐츠 모더레이션 (신고/검토/숨김)
│   │   │       └── announcements/
│   │   │           └── page.tsx             #    공지/업데이트 관리·배포
│   │   │
│   │   ├── p/                               # 🌐 공개 뷰어 (인증 불필요)
│   │   │   └── [slug]/
│   │   │       └── page.tsx                 #    일정 뷰어 — /p/{slug} 공유 링크
│   │   │
│   │   ├── api/                             # 🌐 라우트 핸들러
│   │   │   ├── cover/[slug]/[v]/route.ts    #    업로드된 커버 바이트 ([v]는 캐시 무효화 조각 — 쿼리면 next/image가 막는다)
│   │   │   └── test/
│   │   │       ├── reseed/[slug]/route.ts       #    E2E 픽스처 되돌리기 (프로덕션에선 404)
│   │   │       └── session/[userKey]/route.ts   #    E2E 세션 발급 — owner/other 두 정체성뿐 (프로덕션에선 404)
│   │   │
│   │   ├── globals.css                      # 전역 스타일 — DS 토큰 통합 (색상/타이포/스페이싱/라디우스/모션)
│   │   ├── icon.png                         # 파비콘 이미지
│   │   ├── layout.tsx                       # 루트 레이아웃 (ko lang, Pretendard, SEO 메타)
│   │   └── page.tsx                         # 랜딩페이지 (/)
│   │
│   ├── proxy.ts                             # Next.js Proxy — app/과 같은 층(src/)에 있어야 한다(Next 요구사항)
│   │
│   ├── client/                              # 🧑‍💻 브라우저 전용 — 'use client' 경계 안쪽
│   │   ├── components/                      #    재사용 가능한 컴포넌트 (옛 components/, 그대로 이동)
│   │   │   ├── auth/kakao-button.tsx        #    카카오 OAuth 시작 버튼
│   │   │   ├── ui/                          #    공통 UI 컴포넌트 (badge·bottom-sheet·button·card·chip·
│   │   │   │                                #    date-field·dialog·icon·loader·segmented-control·tabs·
│   │   │   │                                #    text-field·theme-toggle·toast·field-shell)
│   │   │   ├── landing/                     #    랜딩(v8): landing-story(여정·슬롯·만들어 보기·쓰임) · run-story(스크롤 이야기) · story-math(순수 수학) · story-phone · viewer-preview · try-section · case-cards · landing-video(s) · landing.module.css · 미구현 스텁 announcements-banner
│   │   │   ├── dashboard/                   #    대시보드 (plan-list·plan-list-item·split-view·plan-preview·
│   │   │   │                                #    status-badge·share-link·create-plan-button)
│   │   │   ├── editor/                      #    편집기 섹션 컴포넌트 (editor-shell·top-bar·section-shell·
│   │   │   │                                #    sortable-list·basic-info-section·cover-uploader·notice-section·
│   │   │   │                                #    timetable-section·place-section·transport-section·
│   │   │   │                                #    transport-item-form·preview-pane)
│   │   │   ├── viewer/                      #    공개 뷰어 (viewer-shell·cover-header·notice-bar·day-pager·
│   │   │   │                                #    timeline·timeline-item·progress-rail·rail-geometry·place-list·
│   │   │   │                                #    place-sheet·password-gate·status-screen)
│   │   │   └── admin/                       #    관리자 콘솔 (admin-sidebar·kpi-widget·moderation-queue·
│   │   │                                    #    moderation-detail·announcement-list·announcement-form)
│   │   │
│   │   ├── hooks/                           #    ⚡ React 커스텀 훅 (옛 hooks/, 그대로 이동)
│   │   │   ├── use-editor-plan.ts           #    편집기 저장 상태(idle/saving/saved/error)
│   │   │   ├── use-editor-action.ts         #    섹션 액션 → 저장 상태 + 거부 사유 토스트
│   │   │   └── use-now.ts                   #    뷰어 "현재 시각" (마운트 후에만 값, 하이드레이션 안전)
│   │   │
│   │   ├── focus-trap.ts                    #    옛 lib/focus-trap.ts. 'use client' — 다이얼로그/시트가 쓰는 포커스 트랩 훅
│   │   └── supabase/
│   │       └── client.ts                    #    옛 lib/supabase/client.ts. 'use client' 브라우저 Supabase 클라이언트
│   │
│   ├── server/                              # 🔒 서버 전용 — Server Component에서 import하면 안 되는 것은 여기 없다(반대로, 클라이언트에서 import하면 터진다)
│   │   ├── actions/                         #    🚀 Server Actions (옛 actions/, 그대로 이동)
│   │   │   ├── plan-actions.ts              #    기본 정보 저장 · 상태 전환 · 커버
│   │   │   ├── notice-actions.ts            #    공지 CRUD + reorderNotices(ids)
│   │   │   ├── schedule-actions.ts          #    항목 CRUD + reorderItems(ids) + linkPlace
│   │   │   ├── place-actions.ts             #    장소 CRUD + togglePin (참조 사본 동기화)
│   │   │   ├── transport-actions.ts         #    교통 안내 CRUD + reorder (미구현 — lint 가드만 선점)
│   │   │   ├── auth-actions.ts              #    로그인/로그아웃
│   │   │   ├── theme-actions.ts             #    테마 선호 쿠키 저장
│   │   │   ├── viewer-actions.ts            #    뷰어 getBySlug / verifyPassword
│   │   │   ├── analytics-actions.ts         #    KPI 이벤트 로깅 (미구현)
│   │   │   └── admin-actions.ts             #    관리자 전용 (미구현)
│   │   │
│   │   ├── auth/dal.ts                      #    옛 lib/auth/dal.ts. getSessionUserId · verifySession (server-only)
│   │   ├── theme.ts                         #    옛 lib/theme.ts. getTheme() — next/headers cookies() 사용, server-only
│   │   │
│   │   ├── supabase/                        #    환경별 Supabase 클라이언트 중 서버 쪽
│   │   │   ├── server.ts                    #    서버 클라이언트 (Server Component/Action) — RLS가 owner_id를 강제
│   │   │   ├── session.ts                   #    Proxy용 세션 갱신 클라이언트
│   │   │   └── admin.ts                     #    관리자/서비스 롤 클라이언트 (RLS 우회) — eslint 가드 대상
│   │   │
│   │   ├── store/                           #    🗃️ Postgres 경계 — 뷰어·편집기가 DB에 닿는 유일한 자리
│   │   │   ├── plans.ts                     #    일정 행 CRUD + 커버 바이트(아직 메모리)
│   │   │   ├── rows.ts                       #    DB 행(snake_case) → ViewerPlan 조립(assemblePlan)
│   │   │   └── seed-sql.ts                  #    픽스처 → SQL 변환 (상대 경로 + .ts 확장자 — scripts/gen-seed.ts 참고)
│   │   │
│   │   └── viewer/                          #    공개 뷰어 중 서버 전용 부분
│   │       ├── get-plan.ts                  #    getBySlug 요청 단위 캐시 (React cache)
│   │       ├── password.ts                  #    비밀번호 해시(salt+scrypt)·검증(timingSafeEqual) — node:crypto
│   │       └── attempts.ts                  #    비밀번호 시도 카운터
│   │
│   └── shared/                              # 🔁 서버·클라이언트 둘 다 안전 — 순수 함수·타입만
│       ├── types/                           #    📦 TypeScript 타입 정의 (옛 types/, 그대로 이동)
│       │   ├── index.ts                     #    통합 export (현재는 viewer.ts만 재노출)
│       │   ├── viewer.ts                    #    공개 뷰어 DTO (기획자 전용 필드 없음)
│       │   └── editor.ts                    #    ActionResult · 편집기 입력 타입 · PlanStatus
│       │       # plan·notice·schedule·place·transport·user·analytics·moderation·announcement.ts —
│       │       # 전부 0-export 문서 스텁(미구현 기능 설계도). actions/admin·analytics·transport,
│       │       # components/landing/announcements-banner·admin·dashboard, hooks/use-auth·use-plan·use-toast·
│       │       # use-bottom-sheet·use-media-query 와 같은 계열이라 삭제하지 않고 그대로 옮겼다.
│       │
│       ├── editor/validate.ts               #    옛 lib/editor/validate.ts. 입력 검증 — Server Action이 쓰고, 클라이언트도 UX용으로 부를 수 있다
│       ├── fixtures/viewer.ts               #    옛 lib/fixtures/viewer.ts. 뷰어 씨앗 데이터 (상대 경로 + .ts 확장자 유지)
│       ├── fixtures/landing.ts              #    랜딩 예시 일정 (여정·만들어 보기·쓰임 카드가 쓰는 뷰어 DTO)
│       ├── utils/date.ts                    #    옛 lib/utils/date.ts. 날짜 산술 ("YYYY-MM-DD" 더하기·빼기)
│       └── viewer/                          #    공개 뷰어 중 순수 로직
│           ├── rail.ts                      #    항목 상태 계산 (레일 위치는 src/client/components/viewer/rail-geometry.ts가 점을 재서)
│           ├── summary.ts                   #    공지 요약·기간/날짜 문구 (서버 페이지 + 클라이언트 컴포넌트 양쪽이 쓴다)
│           └── links.ts                     #    카카오맵·네이버지도 딥링크
│
├── public/                                  # 정적 리소스 파일 (Next 컨벤션상 루트 고정)
│   └── logos/
│       ├── Logo_Black.png
│       ├── Logo_Gray.png
│       └── Logo_White.png
│
├── docs/                                    # 📄 프로젝트 문서 (gitignore — 로컬 전용)
│   ├── 1_PLAN_IT_PRD.md                     #    제품 요구사항 (PRD)
│   ├── 2_PLAN_IT_기능명세서.md                #    기능명세서
│   ├── 3_PLAN_IT_유저플로우.md                #    유저플로우
│   ├── design-system-mapping.md             #    DS → 프로덕션 코드 포팅 현황
│   └── update/                              #    작업 기록 (날짜별, 로컬 전용)
│
├── tests/                                   # 🧪 Playwright E2E (루트 고정 — playwright.config.ts의 testDir)
│   ├── auth.setup.ts                        #    시드 소유자 세션 저장 (src/server/store/seed-sql.ts를 상대 경로로 import)
│   └── smoke.spec.ts                        #    공개 라우트 렌더 + 콘솔 에러 검사
│
├── planit-design-system/                    # 🎨 Claude Design 핸드오프 번들 (원본 — 수정 금지)
│   ├── README.md
│   └── project/                             #    tokens / components / guidelines / ui_kits / assets
│
├── supabase/                                 # 🗄️ 로컬 Supabase (CLI + Docker, 루트 고정)
│   ├── migrations/                           #    프로덕션 스키마만 (`supabase db push`가 그대로 원격에 적용)
│   │   ├── 20260920000000_initial_schema.sql
│   │   ├── 20260920000001_enable_rls.sql     #    RLS 기본 거부 스위치(정책은 2단계)
│   │   ├── 20260920000002_plans_id_is_slug.sql  #  plans.id = slug 전제를 제약으로 못박는다(1단계 한정)
│   │   ├── 20261004000000_owner_uuid.sql     #    plans.owner_id → uuid (FK auth.users)로 이행
│   │   ├── 20261004000001_profiles_auth_fk.sql  #  profiles.id → auth.users FK + 가입 트리거
│   │   └── 20261004000002_rls_policies.sql   #    owner_id = auth.uid() 정책 7테이블
│   └── seed.sql                              #    생성물. `npm run seed:gen`이 매번 다시 씀 — .gitignore, 커밋 안 함
│
├── scripts/                                   # 🔧 개발용 스크립트 (루트 고정)
│   └── gen-seed.ts                           #    src/shared/fixtures/viewer.ts → supabase/seed.sql.
│                                              #    상대 경로 + .ts 확장자 — `node --experimental-strip-types`가
│                                              #    tsconfig paths(@/*)를 못 풀어서 @/ alias를 쓸 수 없다.
│
├── .github/workflows/playwright.yml         # CI — push/PR 시 E2E 실행
│
├── eslint.config.mjs                        # ESLint 정적 분석 설정 — no-restricted-imports가 src/server/actions/*.ts를 리터럴 경로로 가드
├── next-env.d.ts                             # Next.js 타입 정의
├── next.config.ts                            # Next.js 프레임워크 설정
├── package.json                               # 의존성 패키지 및 스크립트
├── playwright.config.ts                      # E2E 설정 (desktop / mobile 2개 프로젝트, testDir: './tests')
├── postcss.config.mjs                        # CSS 후처리 설정 (Tailwind 연동)
├── tsconfig.json                              # TypeScript 컴파일러 설정 — paths "@/*" → "./src/*"
├── CLAUDE.md                                  # 에이전트 작업 지침 (스택·도구·규칙)
└── PROJECT_STRUCTURE.md                       # 본 폴더 구조 설명 파일
```

---

## 상세 폴더/파일 설명

### 1. `src/app/` (App Router Core, 옛 `app/`)

Next.js **App Router** 아키텍처의 중심 폴더입니다. **Route Groups**를 사용하여 관심사를 분리합니다.

- **`(auth)/`** — 로그인 페이지. 카카오 통합 로그인이라 가입 페이지가 없다. 중앙 정렬 카드 + 로고 레이아웃. ✅ 구현 완료.
- **`auth/callback/`** — OAuth 콜백 라우트 핸들러. 세션 없이 들어오는 것이 정상이라 proxy matcher 밖에 둔다.
- **`(console)/`** — 기획자 콘솔. 인증된 사용자만 접근. 좌측 사이드바 + 메인 레이아웃. ✅ 보일러플레이트 완료.
- **`(admin)/`** — 관리자 콘솔. `role='admin'`만 접근. 다크 사이드바 + KPI/모더레이션/공지. ✅ 보일러플레이트 완료.
- **`p/[slug]/`** — 공개 뷰어. 모바일 퍼스트 480px. generateMetadata로 OG 태그 지원. ✅ 보일러플레이트 완료.
- **`p/layout.tsx`** — 뷰어 라우트 레이아웃. 화면 높이(`min-h-dvh`)와 `html { scroll-padding-bottom }`을
  여기서 준다. 셸이 문서 전역을 건드리면 3단계 편집기 미리보기가 호스트 화면을 바꾼다. ✅ 구현 완료.
- **`page.tsx`** — 공개 랜딩(다크 고정 v8). 헤더·LandingStory·마지막 CTA·푸터. 손글씨 글꼴(next/font) 로드.
- **`layout.tsx`** — 루트 레이아웃. `<html lang="ko">`, Pretendard 폰트 (CSS `@font-face`), 플랜잇 SEO 메타데이터. ✅ 구현 완료.
- **`globals.css`** — **planit-design-system 토큰 통합**: 색상(Brand Blue + Grey + Semantic), 타이포(Pretendard ramp), 스페이싱(4px ladder), 라디우스(xs~full), 엘리베이션(shadow 1~3), 모션(ease/dur). Tailwind v4 `@theme inline` 연동. ✅ 구현 완료.

### 2. `src/client/components/` (재사용 컴포넌트, 옛 `components/`)

기능 영역별로 분류된 컴포넌트 디렉터리입니다.

- **`ui/`** — **planit-design-system 기반 원자적 UI 컴포넌트**. ✅ TypeScript 보일러플레이트 완료:
  - `button.tsx` — 4 variant (primary/secondary/danger/ghost) × 4 size (xl/l/m/s) + loading dot, press overlay
  - `input.tsx` — TextField: single/multiline, focus → white+blue border, error state
  - `card.tsx` — flat hairline or elevated shadow, interactive hover lift
  - `badge.tsx` — 6 tone (neutral/brand/success/danger/warning/info), optional dot
  - `modal.tsx` — Dialog: scrim + radius-2xl + shadow-3, stacked CTAs
  - `bottom-sheet.tsx` — 모바일 시트: grabber handle, slide-up, safe-area padding
  - `toast.tsx` — grey-900 surface, success/danger icon, floating 모드
  - `icon.tsx` — Lucide 래퍼 (lucide-react 설치 후 교체 필요)
- **`landing/`** — 공개 랜딩(`/`) 전용, 다크 고정 v8. `page.tsx`(서버)가 헤더·마지막 CTA·푸터를 그리고, 클라이언트 경계 `landing-story.tsx` 하나가 여정·폰 슬롯·만들어 보기·쓰임을 묶는다(착지와 쓰임 카드가 서로의 상태를 쓴다). 폰 슬롯은 sticky 무대 밖에 `position: fixed`로 둔 형제 요소다(포털 아님). 스크롤 이야기는 `run-story.ts`의 rAF 루프 하나가 transform·opacity·CSS 변수만 바꾸고, 착지·공지 펼침(S 1.08에 열려 1.92에 닫히는 불리언 — 열림은 NoticeBar 자신의 전환)·'지금' 줄만 React 상태로 올린다. 그 루프가 쓰는 순수 수학(`clamp`·`smooth`·`ease`·`lerp`·`storyPosition`)은 `story-math.ts`에 따로 둔다. 폰 속은 실제 뷰어 부품(`viewer-preview.tsx`, `.theme-dark`). 배경 영상 주소는 `landing-videos.ts` 한 곳(⚠️ Orbis 영상 — 출시 전 교체)이고, `landing-video.tsx`가 화면에 들어올 때만 받아 재생한다(`autoplay` 속성 없음 — `preload="none"` + IntersectionObserver가 보일 때 `play()`, 모션 줄이기면 재생 안 함). `.root`는 `line-height: normal`(시안과 같게). 토큰은 `globals.css`의 `--landing-*`, 예시 데이터는 `src/shared/fixtures/landing.ts`. 명세는 `docs/superpowers/specs/2026-10-20-landing-renewal-design.md`. `announcements-banner.tsx`는 `announcements` 테이블이 생길 때까지 문서 스텁.
- **`dashboard/`** — 대시보드 전용. 일정 목록, 스플릿뷰, 미리보기, 상태 배지, 공유 링크.
- **`editor/`** — 편집기. PRD의 4개 섹션 컴포넌트로 세분화:
  - `basic-info-section.tsx` + `cover-uploader.tsx` — 기본 정보 (제목·기간·유형·인원, 커버 사진)
  - `sortable-list.tsx` — 세 섹션(공지·타임테이블·장소)이 함께 쓰는 순서 변경 목록
  - `notice-section.tsx` — 공지 (인라인 편집·추가·삭제 확인 다이얼로그·순서 변경). 한 파일이다 — 행이 곧 폼이라 따로 뗄 것이 없다
  - `timetable-section.tsx` — 타임테이블 (일차 칩, 항목 인라인 편집, 장소 연결 BottomSheet). 헤더 카운트에 고른 일차가 들어가서 **자기 SectionShell을 직접 그린다**
  - `place-section.tsx` — 장소 (인라인 편집, 고정 토글, 삭제 시 끊기는 연결 수 안내). 드래그 정렬이 없다 — 순서는 고정 여부와 타임테이블이 정한다
  - `preview-pane.tsx` — 참가자가 보는 화면. **뷰어 셸을 그대로 쓴다**(스펙 §5.2). 1024px 미만에서는 셸이 이 판을 BottomSheet로 내린다
- **`viewer/`** — 공개 뷰어 전용. 셸, 커버, 공지 바(하늘빛 알림판), 일차 페이저(`day-pager.tsx` — 날짜 + 점 + 가로 스냅 + HUD), 타임라인(레일·항목 — `rail-geometry.ts`가 점 중심을 재서 레일을 그린다), 장소 목록·상세 시트, 비밀번호 게이트.
- **`admin/`** — 관리자 콘솔. KPI 위젯, 모더레이션, 공지 관리.

### 3. `src/client/` · `src/server/` · `src/shared/` (옛 `lib/`)

`lib/`은 사라졌다. 파일 하나하나를 다음 기준으로 세 폴더에 흩었다: **`'use client'` 컴포넌트에서
import하면 안 되면 `server/`, Server Component에서 import하면 안 되면 `client/`, 둘 다 안전하면
`shared/`.**

- **`client/supabase/client.ts`** — `'use client'` 브라우저 Supabase 클라이언트(소셜 로그인).
- **`client/focus-trap.ts`** — `'use client'` 포커스 트랩 훅. 다이얼로그/바텀시트가 쓴다.
- **`server/auth/dal.ts`** — `server-only` 임포트가 박힌 인가 단일 지점. `getSessionUserId`(액션용) ·
  `verifySession`(페이지용, 비로그인 `/login` 리다이렉트).
- **`server/theme.ts`** — `getTheme()`이 `next/headers`의 `cookies()`를 직접 읽는다. 시안 스케치엔
  "theme"가 `client/` 예시로 적혀 있었지만, 실제로 쿠키를 읽는 함수라 `'use client'`에서 호출하면
  터진다 — 규칙대로 `server/`에 둔다. `components/ui/theme-toggle.tsx`(클라이언트)가 쓰는 건
  `Theme` **타입**뿐이고(`import type`), 타입 전용 임포트는 컴파일 시 지워지므로 안전하다.
- **`server/supabase/`** — `server.ts`(Server Component/Action, RLS가 owner_id 강제) · `session.ts`
  (Proxy용 세션 갱신) · `admin.ts`(서비스 롤, RLS 우회 — eslint `no-restricted-imports` 가드 대상).
- **`server/store/`** — Postgres 경계. `plans.ts`가 조회(조인 → `rows.ts::assemblePlan`)와 행 단위
  쓰기를 맡고, 커버 이미지 바이트만 아직 프로세스 메모리에 남는다(3단계 Storage 전까지).
  `seed-sql.ts`는 픽스처 → SQL 변환 하나를 seed 생성기(`scripts/gen-seed.ts`)와 reseed 라우트가
  같이 쓰게 한다 — **상대 경로 + `.ts` 확장자**를 그대로 쓴다(아래 3-1 참고).
- **`server/viewer/`** — `get-plan.ts`(React `cache()`로 요청 단위 메모이즈, `'use server'` 액션을
  감싼다) · `password.ts`(salt+scrypt 해시·검증, `node:crypto`) · `attempts.ts`(비밀번호 시도
  카운터 — reseed가 초기화해야 해서 `'use server'` 파일 밖에 둔다).
- **`shared/editor/validate.ts`** — 입력 검증. Server Action이 부르고, 클라이언트도 같은 함수를
  UX용으로 부를 수 있다(서버 검증이 진짜 신뢰 경계).
- **`shared/fixtures/viewer.ts`** — 뷰어 씨앗 데이터. 순수 함수라 양쪽에서 안전 — **상대 경로 +
  `.ts` 확장자** 유지.
- **`shared/utils/date.ts`** — "YYYY-MM-DD" 날짜 산술. `lib/utils/`의 나머지 네 파일
  (`cache.ts`·`format.ts`·`slug.ts`·`validation.ts`)은 0-export 문서 스텁(호출부 없음)이라 이번
  이동에서 **삭제**했다.
- **`shared/viewer/`** — `rail.ts`(항목 상태, 순수 계산) · `summary.ts`(공지 요약·기간
  문구 — `app/p/[slug]/page.tsx`(서버)와 `components/viewer/*`(클라이언트) 양쪽이 쓴다) ·
  `links.ts`(카카오맵·네이버지도 딥링크, 순수 함수).

### 3-1. `supabase/` · `scripts/` (DB · seed, 루트 고정)

- **`supabase/migrations/`** — 프로덕션 스키마만 둔다. `supabase db push`가 이 폴더를 그대로 원격에
  적용하므로, 테스트 전용 코드(예: 임의 SQL을 실행하는 `exec_sql` 함수)는 여기 두지 않는다.
- **`supabase/seed.sql`** — 생성물이다. `npm run seed:gen`(`db:reset`이 먼저 돌린다)이 매번
  `src/shared/fixtures/viewer.ts`를 읽어 다시 쓴다. 날짜가 `dayOffset()`으로 "오늘" 기준 상대값이라
  커밋하면 하루 지나 stale해지므로 `.gitignore` 대상이다.
- **`scripts/gen-seed.ts`** — 픽스처 → `seed.sql` 변환 스크립트. `npm run seed:gen`이
  `node --experimental-strip-types`로 **직접** 실행하므로 `@/` alias(tsconfig paths)를 못 푼다 —
  그래서 이 파일과 `src/shared/fixtures/viewer.ts`·`src/server/store/seed-sql.ts`는 `@/`가 아니라
  **상대 경로 + `.ts` 확장자**로 서로를 가리킨다. `exec_sql` 함수 정의도 여기서 함께 낸다 —
  `db reset`(로컬 전용)에서만 실행되게 해서 프로덕션에 닿을 길을 구조적으로 막는다.

### 4. `src/client/hooks/` (커스텀 훅, 옛 `hooks/`)

React 커스텀 훅 중 실제로 구현된 세 개 — `use-editor-plan.ts`(저장 상태) · `use-editor-action.ts`
(섹션 액션 공용) · `use-now.ts`(뷰어 "현재 시각"). `use-auth.ts`·`use-plan.ts`·`use-toast.ts`·
`use-bottom-sheet.ts`·`use-media-query.ts`는 0-export 문서 스텁(미구현 기능 설계도) —
`components/dashboard/*`·`components/landing/announcements-banner.tsx` 같은 계열이라 삭제하지 않고 그대로 옮겼다.

### 5. `src/shared/types/` (타입 정의, 옛 `types/`)

기능명세서의 데이터 모델(§3)을 기반으로 한 TypeScript 타입. 실제로 쓰이는 건 `viewer.ts`·
`editor.ts`·`index.ts`(현재는 viewer만 재노출)뿐이다. `plan.ts`·`notice.ts`·`schedule.ts`·
`place.ts`·`transport.ts`·`user.ts`·`analytics.ts`·`moderation.ts`·`announcement.ts`는 0-export
문서 스텁 — 각 엔티티가 실제로 구현될 미래 커밋을 위한 설계도이고 지금은 아무도 import하지 않는다.

### 6. `src/server/actions/` (Server Actions, 옛 `actions/`)

Next.js Server Actions. 기능명세서의 API 개요(§7)를 기반으로 도메인별 분리:
- `plan-actions.ts` — 일정 CRUD, 상태 변경, 비밀번호 설정
- `notice-actions.ts` — 공지 CRUD + 순서 변경
- `schedule-actions.ts` — Day/ScheduleItem CRUD + 장소 연결
- `place-actions.ts` — 장소 CRUD + 고정/유동 토글
- `transport-actions.ts` — 교통 안내 CRUD (0-export 스텁, 미구현)
- `auth-actions.ts` — 로그아웃 (로그인은 카카오 OAuth라 서버 액션이 아니다)
- `theme-actions.ts` — 테마 선호 쿠키 저장
- `viewer-actions.ts` — 공개 뷰어 데이터 조회 + 비밀번호 검증
- `analytics-actions.ts` — KPI 이벤트 로깅 (0-export 스텁, 미구현)
- `admin-actions.ts` — 관리자 전용 (0-export 스텁, 미구현)

`plan-actions.ts`·`notice-actions.ts`·`place-actions.ts`·`schedule-actions.ts`·
`transport-actions.ts` 다섯 개는 `eslint.config.mjs`의 `no-restricted-imports`가 리터럴 경로로
가드한다(`@/server/supabase/admin` 임포트 금지) — `transport-actions.ts`는 아직 미구현이지만
구현되는 순간 가드가 바로 적용되도록 미리 지정해 뒀다. **경로가 바뀌면 이 가드도 같이 고쳐야
한다** — 안 고치면 글롭이 조용히 매칭을 멈추고 아무도 모른다.

### 7. 주요 설정 파일 (Configuration Files)

- **`src/proxy.ts`** — Next.js Proxy(구 `middleware.ts`, Next 16에서 이름 변경). `app/`이 `src/`로
  옮기면 Proxy도 같은 층(`src/`)에 있어야 한다(Next 공식 문서: "If you're using Proxy, ensure it
  is placed inside the `src` folder"). 인증 체크(콘솔), 관리자 권한 체크(admin), 뷰어 라우팅.
- **`package.json`** — 주요 의존성: `next`, `react`, `tailwindcss v4`, `@supabase/supabase-js`
- **`next.config.ts`** — Next.js 설정. ISR, 이미지 도메인, 환경 변수.
- **`tsconfig.json`** — TypeScript 설정. Path alias `"@/*": ["./src/*"]` — `src/` 이전의 흔적.
- **`eslint.config.mjs`** — ESLint 규칙 설정. `no-restricted-imports` 가드가 `src/server/actions/*.ts`
  5개 파일의 리터럴 경로를 직접 지정한다(위 6번 참고).

### 8. 디자인 시스템 (`planit-design-system/`)

Claude Design에서 생성된 디자인 핸드오프 번들. **참고용 원본이며 직접 import하지 않음**.
프로덕션 코드는 `globals.css`(토큰)과 `components/ui/`(컴포넌트)에 TypeScript로 재구현.

- `project/tokens/` — CSS 커스텀 프로퍼티 원본 (colors, typography, spacing, radius, elevation, fonts, base)
- `project/components/` — JSX 프로토타입 원본 (forms, display, feedback, navigation)
- `project/guidelines/` — 디자인 가이드라인 HTML 카드
- `project/ui_kits/` — 전체 화면 프로토타입 (planner, viewer, admin)
- `project/assets/` — 로고 이미지 파일
