# 플랜잇 (Plan-it)

로그인 없는 여행 일정 공유 웹앱. 기획자가 일정을 만들고 링크로 공유하면, 뷰어는 로그인 없이 본다.
서페이스 3개: `planner`(데스크톱 대시보드) · `viewer`(모바일) · `admin`(KPI 콘솔).

---

## 1. 스택 — 학습 데이터와 다르다

| 항목 | 버전 | 주의 |
|---|---|---|
| Next.js | **16.2.6** | App Router. API·규약·파일 구조가 네가 아는 것과 다를 수 있다 |
| React | 19.2.4 | Server Components 기본 |
| Tailwind | v4 | `@theme inline`. **`tailwind.config.js` 없음** — 토큰은 `app/globals.css`에 |
| TypeScript | 5.x | strict |
| DB | Supabase | MCP로 접근 (`.mcp.json`) |

**Next.js 코드를 쓰기 전에 `node_modules/next/dist/docs/01-app/` 의 해당 가이드를 먼저 읽는다.**
deprecation 경고를 무시하지 않는다. 기억에 의존해서 Next 15 이하 패턴을 쓰지 않는다.

### 디렉터리

```
app/          라우트. (auth) (console) (admin) 그룹 + p/[slug] 공개 뷰어
actions/      Server Actions — DB·비밀 접근은 전부 여기서
components/   ui/ landing/ dashboard/ viewer/ admin/
hooks/        클라이언트 훅
types/        도메인 타입
lib/          유틸
tests/        Playwright E2E
proxy.ts     인증 게이트 (Next 16: middleware → proxy)
planit-design-system/  Claude Design 핸드오프 번들 (원본 — 수정 금지)
docs/         PRD·기능명세·유저플로우·DS 매핑 (git 제외)
```

파일 단위 상세는 `PROJECT_STRUCTURE.md`. **구조를 바꿨으면 이 파일도 같이 고친다.**

---

## 2. 명령어

```bash
npm run dev        # 개발 서버 :3000
npm run build      # 프로덕션 빌드
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run test       # playwright (dev 서버 자동 기동)
npm run test:ui    # playwright UI 모드
```

---

## 3. 도구 트리거

**조건에 해당할 때만 쓴다.** 해당 없으면 그냥 작업한다.

| 상황 | 도구 | 비고 |
|---|---|---|
| "이 기능 어디 있지" / 3개 이상 파일을 뒤져야 함 | `graphify query "<질문>"` | grep 난사 금지. 토큰 절약용 |
| 최초 1회 또는 구조 크게 바뀐 뒤 | `/graphify . --update` | `graphify-out/` 갱신 |
| 새 기능·화면을 **설계**해야 함 | `superpowers:brainstorming` | 코드 쓰기 전 |
| 다단계 작업 계획이 필요 | `superpowers:writing-plans` | |
| 버그·테스트 실패·이상 동작 | `superpowers:systematic-debugging` | 추측으로 고치지 않는다 |
| "다 됐다 / 고쳤다"고 말하기 직전 | `superpowers:verification-before-completion` | 명령 실행 결과 없이 완료 주장 금지 |
| **UI를 건드린 모든 작업 후** | `npx playwright test` + 스크린샷 | 아래 4-3 |
| 새 컴포넌트 설계 / UI 개선·리뷰 | `ui-ux-pro-max` 스킬 | |
| 브랜드 자산·목업·프로토타입 | `planit-design` 스킬 (DS 번들 내) | |
| 모션·인터랙션 컴포넌트 레퍼런스 | 21st.dev Magic MCP | 아래 4-4 |
| DB 스키마·쿼리 | supabase MCP | |

---

## 4. UI/UX 작업

### 4-1. 단일 소스

모든 UI 작업의 기준은 `planit-design-system/`.
착수 전 반드시 읽는다: `planit-design-system/project/readme.md` → 관련 `tokens/` → 관련 `components/`.
현재 포팅 현황은 `docs/design-system-mapping.md`에서 확인 — **이미 포팅된 컴포넌트를 다시 만들지 않는다.**

`planit-design-system/` 은 원본 핸드오프 번들이다. **수정하지 않는다.** 프로덕션 코드는 `components/`·`app/globals.css`에만 쓴다.

### 4-2. 토큰

하드코딩 색상·간격·radius·shadow **금지**. 전부 `app/globals.css`의 CSS 변수를 쓴다.

```
색   --blue-500 (Planit Blue #3182F6), --grey-*, --red/green/amber-*
      의미 alias: --fill-* --text-* --border-* --surface-* --overlay-*
타입  --display ~ --caption (15단계), Pretendard Variable
간격  --space-1~20 (4px ladder), --screen-padding --row-gap --pair-gap
곡률  --radius-xs ~ --radius-full (9단계)
그림자 --shadow-1~3, --shadow-toast, --shadow-sheet
모션  --ease --ease-out / --dur-fast(120) --dur-base(200) --dur-slow(320)
```

토큰에 없는 값이 필요하면 → 임의로 만들지 말고 사용자에게 확인한다.

### 4-3. UI 변경 후 검증

UI를 바꿨으면 눈으로 확인하기 전까지 끝난 게 아니다.

1. `npm run dev`
2. Playwright로 해당 화면 접속 → 스크린샷
3. 뷰어 화면은 **모바일 뷰포트**(390×844)로도 확인 — viewer는 모바일이 기본이다
4. DS 프로토타입(`ui_kits/`)과 대조

### 4-4. 모션

1. 먼저 `globals.css`의 `--ease-*` / `--dur-*` 와 기존 keyframes(`planit-dialog-in`, `planit-sheet-in`, `planit-toast-in`, `planit-dot`, `planit-loader`)로 되는지 본다. 대부분 된다.
2. 안 되면 21st.dev Magic MCP로 레퍼런스를 가져와 **토큰에 맞게 고쳐서** 쓴다. 붙여넣기 금지.
3. 그래도 안 되면(제스처·레이아웃 전환) 그때 `motion` 패키지 설치를 제안한다. 미리 깔지 않는다.
4. `prefers-reduced-motion` 존중.

---

## 5. 보안

### 민감 정보
- API 키·토큰·비밀번호를 소스에 하드코딩하지 않는다. `process.env` 참조.
- `.env*`는 `.gitignore`에 있다. `.env.example`엔 더미 값만.
- `console.log`·에러 메시지·커밋 메시지에 비밀을 넣지 않는다.

### 코드
- **입력 검증**: 사용자 입력은 서버(Server Action)에서 타입·길이·형식을 검증한다. 클라이언트 검증은 UX용일 뿐이다.
- **인젝션**: SQL은 파라미터 바인딩. `dangerouslySetInnerHTML` 지양(불가피하면 DOMPurify). 쉘 명령에 사용자 입력 직접 전달 금지.
- **인증 토큰**: `httpOnly` + `secure` 쿠키. `localStorage` 금지.
- **Server/Client 분리**: DB·API 키 접근은 Server Component 또는 `actions/`에서만. `'use client'` 파일에 노출 금지.
- **공개 뷰어(`app/p/[slug]`)**: 로그인 없이 접근되는 경로다. 기획자 전용 데이터가 응답에 섞이지 않는지 매번 확인한다.

### 의존성
- 새 패키지 설치 후 `npm audit`.
- `package-lock.json` 커밋.
- 몇 줄로 되는 일에 패키지를 추가하지 않는다.

---

## 6. 작업 기록

작업이 끝나면 요약 대신 다음을 한다.

1. `docs/update/YYYY-MM-DD.md` (오늘 날짜) — 없으면 만들고, 있으면 그 파일을 연다.
2. **맨 아래에 누적**으로 `## HH:MM — <한 줄 제목>` + 작업 내용을 붙인다. 기존 내용을 지우지 않는다.

`docs/`는 `.gitignore`에 있다 — 이 기록은 **로컬 전용 개인 로그**다. 공유가 필요한 내용은 커밋 메시지에 쓴다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
