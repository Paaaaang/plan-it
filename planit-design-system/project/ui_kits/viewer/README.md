# Viewer UI kit — 뷰어 열람 경험 (mobile web)

The login-free participant view. A single mobile schedule page (390pt) with three tabs and practical map actions — the flagship Planit surface.

## Screens (`Screens.jsx` → `window.PlanitViewer`)
- **Cover** — blue gradient hero (one of the 3 allowed gradients), title/dates/party, tabular view count.
- **Timetable** — day SegmentedControl + a vertical time rail; the current item is highlighted with `--now-fill` + a "지금" badge. Tapping a row opens the place sheet.
- **Highlights** — 준비물/공지/회비 cards.
- **Places** — ListRow list; each opens the place sheet.
- **PlaceSheet** — BottomSheet with static map, transit info, and the practical actions: 주소 복사 (toast), 네이버 지도, 카카오맵 길찾기.
- **StatusScreen** — "navigating error" state (link expired/private) with a way forward.

## Run
`index.html` is an interactive click-through: switch tabs, open place sheets, trigger toasts, and tap the share icon in the top bar to preview the error/status screen.

Composes DS primitives only (TopBar, SegmentedControl, BottomSheet, Button, Badge, Card, ListRow, Toast, Icon). Icons via Lucide CDN.
