# Planner UI kit — 기획자 (desktop web)

The organizer's workspace. Left-rail shell + three views wired as an interactive click-through.

## Views (`Screens.jsx` → `window.PlanitPlanner`)
- **Sidebar** — logo, nav (대시보드 / 일정 편집 / 공유·통계), user footer.
- **Dashboard** — 내 일정 grid of schedule cards (cover + status Badge + tabular view count), search + status filter, "새 일정 만들기".
- **Editor** — drag-and-drop component palette (기본 정보 · 하이라이트 · 타임테이블 · 장소, reorderable via native drag) + an inspector panel; top bar shows 자동 저장됨, 미리보기, 공유 링크 발행. The slug is fixed once created.
- **ShareManager** — share-link card with copy/share, 활성화 Switch, 새 링크 발급 (invalidates old), and KPI stat cards (조회수 · 주소 복사 · 지도 열기).

## Run
Open `index.html`: click a schedule → editor → 공유 링크 발행 → share manager. Drag component blocks to reorder; toggle the link switch to see the disabled state.

Composes DS primitives only. Icons via Lucide CDN.
