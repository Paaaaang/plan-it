# Project Structure (프로젝트 폴더 구조)

이 프로젝트는 **Next.js (App Router)**와 **Tailwind CSS v4**, **TypeScript**를 사용하는 현대적인 웹 애플리케이션입니다.
백엔드는 **Supabase (PostgreSQL + Auth + PostgREST)**, 캐시는 **Redis**, CDN/스토리지는 **Cloudflare**를 사용합니다.
디자인 시스템은 **planit-design-system** (Toss Design System 참고, Pretendard + Planit Blue 컬러)을 기반으로 합니다.

---

## 전체 디렉터리 구조

```text
plan-it/
├── app/                                    # App Router — 라우팅 및 페이지
│   ├── (auth)/                             # 🔓 인증 관련 라우트 그룹
│   │   ├── layout.tsx                      #    인증 페이지 공통 레이아웃
│   │   ├── login/
│   │   │   └── page.tsx                    #    로그인 페이지
│   │   └── signup/
│   │       └── page.tsx                    #    회원가입 페이지
│   │
│   ├── (console)/                          # 🖥️ 기획자 콘솔 라우트 그룹 (인증 필요)
│   │   ├── layout.tsx                      #    콘솔 공통 레이아웃 (내비게이션 등)
│   │   └── dashboard/
│   │       ├── page.tsx                    #    대시보드 — 내 일정 목록, 미리보기
│   │       └── plans/
│   │           └── [id]/
│   │               └── edit/
│   │                   └── page.tsx        #    편집 페이지 — 섹션 컴포넌트 편집
│   │
│   ├── (admin)/                            # 🛡️ 관리자 콘솔 라우트 그룹 (admin 권한)
│   │   ├── layout.tsx                      #    관리자 공통 레이아웃
│   │   └── admin/
│   │       ├── page.tsx                    #    관리자 대시보드 — KPI 모니터링
│   │       ├── moderation/
│   │       │   └── page.tsx                #    콘텐츠 모더레이션 (신고/검토/숨김)
│   │       └── announcements/
│   │           └── page.tsx                #    공지/업데이트 관리·배포
│   │
│   ├── p/                                  # 🌐 공개 뷰어 (인증 불필요)
│   │   └── [slug]/
│   │       └── page.tsx                    #    일정 뷰어 — /p/{slug} 공유 링크
│   │
│   ├── globals.css                         # 전역 스타일 — DS 토큰 통합 (색상/타이포/스페이싱/라디우스/모션)
│   ├── icon.png                            # 파비콘 이미지
│   ├── layout.tsx                          # 루트 레이아웃 (ko lang, Pretendard, SEO 메타)
│   └── page.tsx                            # 랜딩페이지 (/)
│
├── components/                             # 재사용 가능한 컴포넌트
│   ├── ui/                                 # 🧱 공통 UI 컴포넌트
│   │   ├── badge.tsx                       #    상태 배지 (공개/비공개/임시저장)
│   │   ├── bottom-sheet.tsx                #    모바일 BottomSheet
│   │   ├── button.tsx                      #    버튼
│   │   ├── card.tsx                        #    카드
│   │   ├── icon.tsx                        #    아이콘 (프리셋)
│   │   ├── input.tsx                       #    입력 필드
│   │   ├── modal.tsx                       #    모달 다이얼로그
│   │   └── toast.tsx                       #    토스트 알림
│   │
│   ├── landing/                            # 🏠 랜딩페이지 컴포넌트
│   │   ├── hero.tsx                        #    히어로: 한 줄 정의 + CTA
│   │   ├── features.tsx                    #    가치 제안 · 핵심 기능 소개
│   │   ├── sample-viewer.tsx               #    샘플 뷰어 미리보기
│   │   ├── announcements-banner.tsx        #    배포된 공지/업데이트 노출
│   │   └── cta-section.tsx                 #    하단 CTA 섹션
│   │
│   ├── dashboard/                          # 📋 대시보드 컴포넌트
│   │   ├── plan-list.tsx                   #    일정 목록 컨테이너
│   │   ├── plan-list-item.tsx              #    일정 목록 개별 항목
│   │   ├── split-view.tsx                  #    우측 스플릿뷰 (데스크톱)
│   │   ├── plan-preview.tsx                #    일정 미리보기 렌더링
│   │   ├── status-badge.tsx                #    상태 배지 (공개/비공개/임시)
│   │   ├── share-link.tsx                  #    공유 링크 확인·복사
│   │   └── create-plan-button.tsx          #    새 일정 생성 버튼
│   │
│   ├── editor/                             # ✏️ 편집기 컴포넌트
│   │   ├── editor-shell.tsx                #    편집기 셸 — 상단 바 + 좌우 2단
│   │   ├── top-bar.tsx                     #    상단 바 — 제목·저장 상태·공개 상태·공유
│   │   ├── section-shell.tsx               #    섹션 껍데기 (번호 뱃지 + 제목 + 카운트)
│   │   ├── transport-section.tsx           #    대중교통/이동 안내 섹션
│   │   ├── transport-item-form.tsx         #    교통 항목 폼
│   │   │
│   │   ├── basic-info/                     #    📝 기본 정보 섹션
│   │   │   ├── basic-info-section.tsx      #       제목/기간/설명 편집
│   │   │   └── date-range-picker.tsx       #       날짜 범위 선택기
│   │   │
│   │   ├── notice/                         #    📢 공지 섹션
│   │   │   ├── notice-section.tsx          #       공지 섹션 컨테이너
│   │   │   ├── notice-item.tsx             #       공지 항목 표시
│   │   │   ├── notice-form.tsx             #       공지 생성/수정 폼
│   │   │   └── sortable-notice-list.tsx    #       드래그 순서 변경 리스트
│   │   │
│   │   ├── timetable/                      #    🕐 타임테이블 섹션
│   │   │   ├── timetable-section.tsx       #       타임테이블 섹션 컨테이너
│   │   │   ├── day-tabs.tsx                #       Day 탭/스와이프 전환
│   │   │   ├── schedule-item.tsx           #       일정 항목 표시
│   │   │   ├── schedule-item-form.tsx      #       일정 항목 생성/수정 폼
│   │   │   └── place-linker.tsx            #       장소 연결 선택기
│   │   │
│   │   └── place/                          #    📍 장소 섹션
│   │       ├── place-section.tsx           #       장소 섹션 컨테이너
│   │       ├── place-item.tsx              #       장소 항목 표시
│   │       ├── place-form.tsx              #       장소 등록/수정 폼
│   │       └── map-embed.tsx               #       지도 임베드
│   │
│   ├── viewer/                             # 👁️ 공개 뷰어 컴포넌트
│   │   ├── viewer-shell.tsx                #    셸: 탭·일차·시트 상태 (유일한 클라이언트 경계)
│   │   ├── cover-header.tsx                #    커버: 사진/코랄 그라데이션 + 제목·기간
│   │   ├── notice-bar.tsx                  #    공지 한 줄 바 ↔ 목록 disclosure
│   │   ├── timeline.tsx                    #    타임테이블: 레일 + 항목 목록
│   │   ├── timeline-item.tsx               #    타임라인 항목 한 행 (past/current/future)
│   │   ├── progress-rail.tsx               #    진행 레일 (3px 세로선)
│   │   ├── place-list.tsx                  #    장소 탭 카드 목록 (레일 없음)
│   │   ├── place-sheet.tsx                 #    장소 상세 바텀시트 (액션 3개, 코랄은 길찾기 하나)
│   │   ├── password-gate.tsx               #    비공개 비밀번호 입력 게이트 (서버 검증 · httpOnly 쿠키)
│   │   └── status-screen.tsx               #    막다른 길 껍데기 (게이트·만료·오류 공용, 빨강 금지)
│   │
│   └── admin/                              # 🛡️ 관리자 콘솔 컴포넌트
│       ├── admin-sidebar.tsx               #    관리자 사이드바 내비게이션
│       ├── kpi-widget.tsx                  #    KPI 위젯 (생성수/전환율/조회수/클릭률)
│       ├── moderation-queue.tsx            #    모더레이션 대기열
│       ├── moderation-detail.tsx           #    모더레이션 상세 검토
│       ├── announcement-list.tsx           #    공지/업데이트 목록
│       └── announcement-form.tsx           #    공지/업데이트 작성 폼
│
├── lib/                                    # 라이브러리 및 유틸리티
│   ├── supabase/                           # 🗄️ Supabase 클라이언트
│   │   ├── client.ts                       #    브라우저 클라이언트 (Client Component)
│   │   ├── server.ts                       #    서버 클라이언트 (Server Component/Action)
│   │   ├── session.ts                      #    Proxy용 세션 갱신 클라이언트
│   │   └── admin.ts                        #    관리자/서비스 롤 클라이언트
│   │
│   ├── viewer/                             # 👁️ 공개 뷰어 순수 로직
│   │   ├── rail.ts                         #    레일 진행도·항목 상태 계산
│   │   ├── summary.ts                      #    공지 요약·기간/날짜 문구
│   │   ├── links.ts                        #    카카오맵·네이버지도 딥링크
│   │   └── get-plan.ts                     #    getBySlug 요청 단위 캐시 (React cache)
│   │
│   ├── store/                              # 🗃️ 메모리 스토어 (Supabase 이전 단계)
│   │   └── plans.ts                        #    slug→ViewerPlan · 상태 맵. 뷰어와 편집기의 공통 저장소
│   │
│   ├── editor/                             # ✏️ 편집기 순수 로직
│   │   └── validate.ts                     #    입력 검증 (제목·날짜·시간·태그·순서)
│   │
│   ├── fixtures/                           # 🌱 픽스처
│   │   └── viewer.ts                       #    뷰어 씨앗 데이터 · 잠금/만료 규칙
│   │
│   └── utils/                              # 🔧 유틸리티 함수
│       ├── slug.ts                         #    slug 생성·검증
│       ├── date.ts                         #    날짜 포맷·Day 계산
│       ├── format.ts                       #    텍스트 포맷팅
│       ├── cache.ts                        #    Redis/ISR 캐시 무효화 헬퍼
│       └── validation.ts                   #    입력값 검증 규칙
│
├── hooks/                                  # ⚡ React 커스텀 훅
│   ├── use-plan.ts                         #    일정 데이터 관리 훅
│   ├── use-editor-plan.ts                  #    편집기 저장 상태(idle/saving/saved/error)
│   ├── use-auth.ts                         #    인증 상태 관리 훅
│   ├── use-media-query.ts                  #    반응형 미디어 쿼리 훅
│   ├── use-bottom-sheet.ts                 #    BottomSheet 제어 훅
│   └── use-toast.ts                        #    토스트 알림 훅
│
├── types/                                  # 📦 TypeScript 타입 정의
│   ├── index.ts                            #    통합 export
│   ├── viewer.ts                           #    공개 뷰어 DTO (기획자 전용 필드 없음)
│   ├── editor.ts                           #    ActionResult · 편집기 입력 타입 · PlanStatus
│   ├── plan.ts                             #    Plan (일정) 타입
│   ├── notice.ts                           #    Notice (공지) 타입
│   ├── schedule.ts                         #    Day, ScheduleItem 타입
│   ├── place.ts                            #    Place (장소) 타입
│   ├── transport.ts                        #    TransportInfo 타입
│   ├── user.ts                             #    Profile (사용자) 타입
│   ├── analytics.ts                        #    AnalyticsEvent 타입
│   ├── moderation.ts                       #    ModerationFlag 타입
│   └── announcement.ts                     #    Announcement 타입
│
├── actions/                                # 🚀 Server Actions (서버 액션)
│   ├── plan-actions.ts                     #    기본 정보 저장 · 상태 전환 · 커버
│   ├── notice-actions.ts                   #    공지 CRUD + reorderNotices(ids)
│   ├── schedule-actions.ts                 #    항목 CRUD + reorderItems(ids) + linkPlace
│   ├── place-actions.ts                    #    장소 CRUD + togglePin (참조 사본 동기화)
│   ├── transport-actions.ts                #    교통 안내 CRUD + reorder
│   ├── auth-actions.ts                     #    로그인/로그아웃
│   ├── viewer-actions.ts                   #    뷰어 getBySlug / verifyPassword
│   ├── analytics-actions.ts               #    KPI 이벤트 로깅 (logEvent)
│   └── admin-actions.ts                    #    관리자 전용 (KPI집계/모더레이션/공지)
│
├── public/                                 # 정적 리소스 파일
│   └── logos/
│       ├── Logo_Black.png
│       ├── Logo_Gray.png
│       └── Logo_White.png
│
├── docs/                                   # 📄 프로젝트 문서
│   ├── 1_PLAN_IT_PRD.md                    #    제품 요구사항 (PRD)
│   ├── 2_PLAN_IT_기능명세서.md               #    기능명세서
│   ├── 3_PLAN_IT_유저플로우.md               #    유저플로우
│   ├── design-system-mapping.md            #    DS → 프로덕션 코드 포팅 현황
│   └── update/                             #    작업 기록 (날짜별, 로컬 전용)
│
├── tests/                                  # 🧪 Playwright E2E
│   └── smoke.spec.ts                       #    공개 라우트 렌더 + 콘솔 에러 검사
│
├── planit-design-system/                   # 🎨 Claude Design 핸드오프 번들 (원본 — 수정 금지)
│   ├── README.md
│   └── project/                            #    tokens / components / guidelines / ui_kits / assets
│
├── .github/workflows/playwright.yml        # CI — push/PR 시 E2E 실행
│
├── proxy.ts                                # Next.js Proxy (구 middleware) — 인증/권한 라우팅
├── eslint.config.mjs                       # ESLint 정적 분석 설정
├── next-env.d.ts                           # Next.js 타입 정의
├── next.config.ts                          # Next.js 프레임워크 설정
├── package.json                            # 의존성 패키지 및 스크립트
├── playwright.config.ts                    # E2E 설정 (desktop / mobile 2개 프로젝트)
├── postcss.config.mjs                      # CSS 후처리 설정 (Tailwind 연동)
├── tsconfig.json                           # TypeScript 컴파일러 설정
├── CLAUDE.md                               # 에이전트 작업 지침 (스택·도구·규칙)
└── PROJECT_STRUCTURE.md                    # 본 폴더 구조 설명 파일
```

---

## 상세 폴더/파일 설명

### 1. `app/` (App Router Core)

Next.js **App Router** 아키텍처의 중심 폴더입니다. **Route Groups**를 사용하여 관심사를 분리합니다.

- **`(auth)/`** — 인증 관련 페이지 (로그인/회원가입). 중앙 정렬 카드 + 로고 레이아웃. ✅ 보일러플레이트 완료.
- **`(console)/`** — 기획자 콘솔. 인증된 사용자만 접근. 좌측 사이드바 + 메인 레이아웃. ✅ 보일러플레이트 완료.
- **`(admin)/`** — 관리자 콘솔. `role='admin'`만 접근. 다크 사이드바 + KPI/모더레이션/공지. ✅ 보일러플레이트 완료.
- **`p/[slug]/`** — 공개 뷰어. 모바일 퍼스트 480px. generateMetadata로 OG 태그 지원. ✅ 보일러플레이트 완료.
- **`p/layout.tsx`** — 뷰어 라우트 레이아웃. 화면 높이(`min-h-dvh`)와 `html { scroll-padding-bottom }`을
  여기서 준다. 셸이 문서 전역을 건드리면 3단계 편집기 미리보기가 호스트 화면을 바꾼다. ✅ 구현 완료.
- **`page.tsx`** — 랜딩페이지. 서비스 소개·가치 제안·CTA.
- **`layout.tsx`** — 루트 레이아웃. `<html lang="ko">`, Pretendard 폰트 (CSS `@font-face`), 플랜잇 SEO 메타데이터. ✅ 구현 완료.
- **`globals.css`** — **planit-design-system 토큰 통합**: 색상(Brand Blue + Grey + Semantic), 타이포(Pretendard ramp), 스페이싱(4px ladder), 라디우스(xs~full), 엘리베이션(shadow 1~3), 모션(ease/dur). Tailwind v4 `@theme inline` 연동. ✅ 구현 완료.

### 2. `components/` (재사용 컴포넌트)

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
- **`landing/`** — 랜딩페이지 전용. 히어로, 기능 소개, 샘플 뷰어, CTA.
- **`dashboard/`** — 대시보드 전용. 일정 목록, 스플릿뷰, 미리보기, 상태 배지, 공유 링크.
- **`editor/`** — 편집기. PRD의 4개 섹션 컴포넌트로 세분화:
  - `basic-info/` — 기본 정보 (제목/기간/설명, 날짜 범위 선택)
  - `notice/` — 공지 (CRUD, 드래그 순서 변경)
  - `timetable/` — 타임테이블 (Day 탭, 일정 항목, 장소 연결)
  - `place/` — 장소 (고정/유동, 지도 임베드)
- **`viewer/`** — 공개 뷰어 전용. 셸, 커버, 공지 바, 타임라인(레일·항목), 장소 목록·상세 시트, 비밀번호 게이트.
- **`admin/`** — 관리자 콘솔. KPI 위젯, 모더레이션, 공지 관리.

### 3. `lib/` (라이브러리)

- **`supabase/`** — 환경별 Supabase 클라이언트. Client/Server/Middleware/Admin 분리.
- **`utils/`** — 순수 유틸리티 함수. slug 생성, 날짜 계산, 캐시 무효화, 입력 검증.

### 4. `hooks/` (커스텀 훅)

React 커스텀 훅. 일정 데이터 관리, 인증 상태, 반응형, BottomSheet, 토스트 알림 등.

### 5. `types/` (타입 정의)

기능명세서의 데이터 모델(§3)을 기반으로 한 TypeScript 타입. 각 엔티티(Plan, Notice, Day, ScheduleItem, Place, TransportInfo, Profile, AnalyticsEvent, ModerationFlag, Announcement)별 파일 분리.

### 6. `actions/` (Server Actions)

Next.js Server Actions. 기능명세서의 API 개요(§7)를 기반으로 도메인별 분리:
- `plan-actions.ts` — 일정 CRUD, 상태 변경, 비밀번호 설정
- `notice-actions.ts` — 공지 CRUD + 순서 변경
- `schedule-actions.ts` — Day/ScheduleItem CRUD + 장소 연결
- `place-actions.ts` — 장소 CRUD + 고정/유동 토글
- `transport-actions.ts` — 교통 안내 CRUD
- `auth-actions.ts` — Supabase Auth 기반 로그인/로그아웃
- `viewer-actions.ts` — 공개 뷰어 데이터 조회 + 비밀번호 검증
- `analytics-actions.ts` — KPI 이벤트 로깅
- `admin-actions.ts` — 관리자 전용 (KPI 집계, 모더레이션, 공지 배포)

### 7. 주요 설정 파일 (Configuration Files)

- **`proxy.ts`** — Next.js Proxy(구 `middleware.ts`, Next 16에서 이름 변경). 인증 체크(콘솔), 관리자 권한 체크(admin), 뷰어 라우팅. ✅ 보일러플레이트 완료.
- **`package.json`** — 주요 의존성: `next`, `react`, `tailwindcss v4`, `@supabase/supabase-js`
- **`next.config.ts`** — Next.js 설정. ISR, 이미지 도메인, 환경 변수.
- **`tsconfig.json`** — TypeScript 설정. Path alias(`@/*`).
- **`eslint.config.mjs`** — ESLint 규칙 설정.

### 8. 디자인 시스템 (`planit-design-system/`)

Claude Design에서 생성된 디자인 핸드오프 번들. **참고용 원본이며 직접 import하지 않음**.
프로덕션 코드는 `globals.css`(토큰)과 `components/ui/`(컴포넌트)에 TypeScript로 재구현.

- `project/tokens/` — CSS 커스텀 프로퍼티 원본 (colors, typography, spacing, radius, elevation, fonts, base)
- `project/components/` — JSX 프로토타입 원본 (forms, display, feedback, navigation)
- `project/guidelines/` — 디자인 가이드라인 HTML 카드
- `project/ui_kits/` — 전체 화면 프로토타입 (planner, viewer, admin)
- `project/assets/` — 로고 이미지 파일
