---
name: planit-design
description: Use this skill to generate well-branded interfaces and assets for 플랜잇 (Planit), the login-free itinerary & schedule sharing web app, either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, logo assets, and UI kit components (planner · viewer · admin) for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Map of this design system
- `styles.css` — the single entry point (link this). It `@import`s everything in `tokens/`.
- `tokens/` — `colors.css` (blue single-accent + cool neutrals + semantic), `typography.css` (Pretendard ramp), `spacing.css`, `radius.css`, `elevation.css`, `fonts.css`, `base.css`.
- `assets/` — symbol logo (black / gray / white / blue / trimmed). Temporary user-provided mark.
- `guidelines/` — foundation specimen cards (colors, type, spacing, radius, effects, brand voice/logo).
- `components/` — reusable React primitives, namespace `window.PlanitDesignSystem_e6392f`:
  - forms: Button, TextField, SearchField, Checkbox, Switch, SegmentedControl
  - display: Card, ListRow, Chip, Badge, Avatar, Icon
  - feedback: Toast, Dialog, BottomSheet, Loader
  - navigation: TopBar, TabBar, BottomCTA
- `ui_kits/` — full-screen recreations: `viewer/` (mobile, login-free), `planner/` (desktop dashboard/editor/share), `admin/` (desktop KPI console).

## Non-negotiables (see readme.md for the full list)
- One saturated accent (blue `--fill-brand`) per screen, reserved for a single primary action.
- Copy is **해요체** — polite, plain, buttons say what happens. No 격식체, no hype, no emoji punctuation.
- Aggressive rounding, flat surfaces, 1px hairline borders. Tabular figures for live data. No skeleton shimmer, no bounce.
- Icons: Lucide (outline, currentColor). Load `https://unpkg.com/lucide@latest` and call `lucide.createIcons()`.
- To mount a component in an HTML file: link `styles.css`, load `_ds_bundle.js`, then `const { Button } = window.PlanitDesignSystem_e6392f`.
