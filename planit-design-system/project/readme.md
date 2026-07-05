# 플랜잇 (Planit) — Design System

> **Planit is a login-free itinerary & schedule sharing web app.** Organizers assemble a structured schedule page (basic info · highlights · timetable · places) in minutes and share it with a single link; participants open that link — no login, no install — and instantly get the whole flow plus practical actions (copy address, open Naver/Kakao map, transit guidance). Three role surfaces share one system: **planner** (create/edit dashboard), **viewer** (mobile-first public page), **admin** (operations console).

This design system re-casts the visual discipline of the **Toss Design System (TDS)** reference — single-accent color rule, aggressively rounded ladder, flat surfaces with hairline borders, tabular/proportional numeral split, 해요체 (polite conversational) copy — into Planit's own identity: a **blue accent** (`--blue-500 #6C5CE7`, taken from the product userflow) on a cool near-neutral canvas, with **Pretendard** as the type face.

---

## Sources analysed

- **`uploads/플랜잇 일정 공유 웹 앱_기능명세서_2026-07-05.xlsx`** — full PRD + feature spec (product goal, personas, KPIs, 5 requirement groups with detailed sub-specs). Extracted to `uploads/strings.json`.
- **`uploads/userflow.png`** — the end-to-end user flow diagram (5 lanes: 인증·온보딩 / 일정 생성·편집 / 공유 링크 관리 / 뷰어 열람 경험 / 관리자 콘솔). This is the source of the **blue accent** and the surface inventory.
- **Toss Design System (TDS) reference doc** (provided as reference text; sources: toss.tech, tossmini-docs.toss.im, apps-in-toss branding guide, toss/tossface). Used **only** for visual-language discipline — never for Toss's financial-product concepts or brand. Planit borrows the *grammar* (single accent, round ladder, 해요체, tabular numbers), not the vocabulary.

**Symbol logo** (provided by the user as a temporary mark) lives in `assets/`: `logo-black.png`, `logo-gray.png`, `logo-white.png` (original 4500×square, transparent), plus derived `logo-black-trim.png` and `logo-blue.png` (recolored to `--blue-500`, tight-cropped) for UI use. The mark is an interlocking eclipse/crescent on a horizontal axis line. Pair it with the plain-type `플랜잇` wordmark. No mark was invented — this is the user's asset.

---

## What Planit is (from the PRD)

- **One-line:** 여행·행사·모임의 일정을 하나의 구조화된 페이지로 빠르게 만들고, 링크 하나로 쉽게 공유·열람.
- **Problem:** schedule info is scattered across KakaoTalk, screenshots, Notion, map links, booking mails. Organizers repeat themselves; participants can't find "what's now / where / how to get there."
- **Personas:** A — 주최자/기획자 (trip captain, workshop lead, club admin); B — 참가자/뷰어 (mostly mobile, no login); C — 플랫폼 관리자 (operator).
- **Devices:** 모바일 웹 (viewer-first) + 데스크톱 웹 (planner & admin).
- **Schedule building blocks (drag-and-drop components):** 기본정보 · 하이라이트 · 타임테이블 · 장소.
- **Viewer practical actions:** 주소 복사 · 네이버/카카오 지도 열기 · 지도 임베드 · 대중교통/이동 안내.

---

## CONTENT FUNDAMENTALS

Planit copy inherits Toss's **해요체** voice policy and adapts it to a friendly consumer schedule app.

- **Tone:** a capable friend who's organized the trip for you. Warm, plain, low-friction — never corporate, never salesy.
- **Politeness level:** **해요체** everywhere (`-요` endings). Never 격식체 (`-습니다/-십시오`), never the broadcast declarative `-다`. Even error and empty states stay 해요체.
  - ✅ "링크가 만들어졌어요", "오늘 일정만 모아서 보여드려요", "아직 등록된 장소가 없어요"
  - ❌ "링크가 생성되었습니다", "일정을 등록하십시오"
- **Buttons say what happens** — never directive filler. `공유 링크 만들기`, `다음`, `주소 복사`, `지도로 열기`. Never "여기를 눌러주세요", never ALL CAPS, never `!` in headings.
- **No chatbot tone** ("~해보세요!", "~할까요?") and **no marketing hype** ("혁신적", "최고의", "차세대").
- **Numbers, Korean style:** `1,000원`, `12명`, `5개`, `오후 2:30` — thousands separators, unit glued (no space), percent glued `30%`. Live counts/stats use tabular figures.
- **Two-sentence pattern:** first sentence states the purpose, second says *when you'd use it*. e.g. "링크 하나로 전체 일정을 공유해요. 참가자는 로그인 없이 바로 열어볼 수 있어요."
- **Error = "navigating error":** an error's job is to move the user to the next screen, not to stop them. "일정을 찾을 수 없어요. 링크가 만료됐거나 비공개로 바뀐 것 같아요." + a way forward.
- **Emoji:** not used inline in product copy. Curated flat illustration/emoji assets may anchor empty states and sheet headers, but never as text punctuation.
- **Korean brand name first:** prefer `플랜잇` over `Planit` in product surfaces.

---

## VISUAL FOUNDATIONS

**Overall mood:** a calm near-white canvas carrying softly-rounded cards and buttons, with one vivid **Planit Blue** reserved for the single most important action per screen. Cool, restrained, friendly — closer to a well-made consumer app than a bank, but with the same accent discipline.

- **Color:** single-accent rule. `--fill-brand` (blue-500) is the *only* saturated color on a screen and is reserved for one primary CTA. Everything else is the cool grey ladder. Semantic hues (red/green/amber/blue) appear only for status. Base palette → semantic alias → component intent; product surfaces call semantic aliases (`--fill-brand`, `--text-primary`, `--border-primary`), never raw steps.
- **Type:** Pretendard. Bold 700 displays with tight −1.5 to −2% tracking; **15px / 1.5 line-height body** as the Korean-readability default. Card titles `--title-1` (18/600), card body `--body-2` (15/400). Buttons read like sentences (Bold 700 at XL/L, Semibold at M/S).
- **Numerals:** tabular (`tnum`) for live data — view counts, timetable times, KPI figures; proportional for emphasis display numbers.
- **Spacing:** 4px base ladder (4→80, 12 steps). 24px screen outer padding, 16px between list rows, 8px between tightly-coupled pairs (label+input).
- **Radius:** one of the roundest ladders in production — 4→32px + `full` (999px). Buttons scale radius with size: XL 16 / L 14 / M 12 / S 10. Chips & pills use `full`. **No iOS squircle/blob.**
- **Backgrounds:** flat by default. Gradients are allowed in exactly three documented places: (1) the `white → transparent` protection gradient above a fixed bottom CTA, (2) a faint pressed-blue radial glow inside a loading button, (3) illustration gradients. No texture, no noise, no full-bleed photos in chrome.
- **Borders:** default is a **1px `--border-secondary` (grey-200) hairline**. Focused inputs step up to 1.5px `--border-primary` (blue-500). No 2px decorative borders, no colored left-rail accent cards.
- **Cards:** white surface, `--radius-xl`~`3xl`, 1px hairline border **or** `--shadow-1`/`2` — not both heavy. Flat is the resting state; shadow means "floating/modal".
- **Elevation:** flat baseline; shadows only on menu/tooltip/dialog/toast/sheet, all from a soft blue-tinted ink at 0.04–0.18 alpha. **No inner shadows** — pressed state is a `--overlay-press` (black ~6%) tint over the resting fill, not a shadow.
- **Motion:** `--dur-fast/base/slow` = 120/200/320ms with `--ease` (ease-out-expo). No bounce overshoot, no fade > 320ms, no parallax, **no skeleton shimmer** — loading is a 3-dot pulse.
- **Hover / press:** hover darkens the fill one step (or adds `--shadow-2` on cards); press applies `--overlay-press`; disabled applies `--disabled-opacity` (0.32) to the whole node — never partial greying.
- **Transparency & blur:** scrims (`--overlay-scrim`) behind sheets/dialogs; blur is reserved for native OS sheet contexts, not decorative chrome.
- **Layout:** mobile-first, single column. Viewer is one thumb-reachable column with a fixed bottom action zone honoring `safe-area-inset`. Planner & admin are desktop, still single-column-dominant with a left rail.

---

## ICONOGRAPHY

- **Set:** **Lucide** (24px grid, 1.5px stroke, rounded line caps) — mirrors the TDS reference's stated substitute for the proprietary TDS icon sprite, and is what the userflow's clean outline icons resemble. Loaded from CDN (`lucide@latest`); components take an `icon` name string and render via `<i data-lucide>` or inline SVG.
- **Style:** outline is the workhorse; filled variants only for active tab-bar items. 24px is the default size (16/20/24/32 available). Icons inherit `currentColor` — never inject color directly.
- **Illustrations:** flat friendly spot illustrations anchor empty states, viewer error/status pages, and sheet headers. None were provided; where one is needed we use a simple flat placeholder tile and flag it. **No hand-drawn brand marks.**
- **Emoji:** not used as text punctuation.
- **Substitution flag:** Lucide stands in for a bespoke Planit icon set the source doesn't define. Replace with production icons when available.

---

## Index / manifest

**Root**
- `styles.css` — global entry (import this). `@import`s only.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `fonts.css`, `base.css`.
- `assets/` — wordmark + illustration/placeholder assets.
- `guidelines/` — foundation specimen cards (Design System tab).
- `components/` — reusable React primitives (see below).
- `ui_kits/` — full-screen product recreations.
- `SKILL.md` — Agent-Skill entry point.

**Components** (`components/<group>/`) — `window.PlanitDesignSystem_e6392f.<Name>`
- forms: `Button`, `TextField`, `Checkbox`, `Switch`, `SegmentedControl`, `SearchField`
- display: `Card`, `ListRow`, `Chip`, `Badge`, `Avatar`, `Icon`
- feedback: `Toast`, `Dialog`, `BottomSheet`, `Loader`
- navigation: `TopBar`, `TabBar`, `BottomCTA`

**UI kits** (`ui_kits/`)
- `planner/` — planner dashboard, schedule editor (drag-and-drop components), share-link manager (desktop web).
- `viewer/` — mobile viewer: schedule page, place detail with map actions, status/error page (mobile web).
- `admin/` — operations console: KPI dashboard (desktop web).

### Intentional additions
- **`Avatar`, `Icon`** — thin wrappers not called out as standalone families in the source, added because list rows / posts / KPI widgets need them. Documented here per policy.

### Caveats
- **Font:** Pretendard substitutes for a proprietary reference face and is commercially safe (OFL); no font swap needed. Loaded from jsDelivr CDN.
- **Icons:** Lucide is a substitution for an undefined Planit icon set — replace in production.
- **Symbol logo is a user-provided temporary mark** — swap when final branding lands. No wordmark lockup file was provided; wordmark is set in Pretendard. Illustrations are flat placeholders.
