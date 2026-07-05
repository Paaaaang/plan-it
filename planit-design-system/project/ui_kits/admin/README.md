# Admin UI kit — 플랫폼 관리자 콘솔 (desktop web)

Operations & monitoring surface for the Planit operator.

## Views (`Screens.jsx` → `window.PlanitAdmin`)
- **Sidebar** — 운영 지표 / 일정 관리 / 사용자 관리 / 신고·검토 / 공지 템플릿.
- **Dashboard** — KPI widgets (주간 신규 생성 · 공유 전환율 · 평균 조회 · 실용 액션 클릭률, each with trend delta), a weekly-created **bar chart** following the Planit rule (grey bars, single blue accent bar, **no axis lines**), and a recent-schedule table with report status Badges and a 블라인드 action on reported items.

## Run
Open `index.html`. Static dashboard view (single screen); primary demonstration of KPI widgets + chart + moderation row treatment.

Composes DS primitives only. Icons via Lucide CDN.
