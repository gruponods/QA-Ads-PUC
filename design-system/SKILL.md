---
name: nods-design
description: Use this skill to generate well-branded interfaces and assets for NODS (Grupo NODS — "Technology for Education"), either for production or throwaway prototypes/mocks/slides. Contains essential design guidelines, colors, type, fonts, assets, and reusable slide + UI components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## The one-paragraph brief
Pure-white canvases, ink-black text, **one accent** (NODS Blue `#1946E3`), **one typeface** (Space Grotesk, weights 300/400/500/700). Flat and clean: rounded corners (12–16px cards, pill tags/buttons), hairline `#E5E7EB` borders, **no shadows ever**. Icons are **Tabler outline** (`<i class="ti ti-…">`). Blue is an accent, not a background — keep it under ~15% of any surface. Generous white space, one idea per slide. Spanish (LatAm), warm and benefit-led; UPPERCASE tracked kickers; never use emoji.

## Where things are
- `styles.css` — link this one file to get tokens, Space Grotesk, and the Tabler icon font.
- `readme.md` — full content + visual foundations, iconography, component and template index.
- `assets/` — the NODS wordmark (blue for light, white for dark).
- `guidelines/` — foundation specimen cards.
- `components/` — reusable React primitives (Icon, Kicker, Tag, Button, Card, Divider, BigNumber, StatDelta, BarChart, StepItem, LogoWall).
- `slides/` — 10 ready slide-template components + `index.html` overview.
- `templates/nods-deck/` — a copyable, editable NODS deck.
- `components/forms|navigation|feedback|display/` — web app primitives (Input, Select, Checkbox, Switch, Tabs, Alert, Dialog, StatusDot, Avatar, ProgressBar, DataTable, IconButton).
- `components/maps/GeoMap` — accurate maps of the Americas (Natural Earth + d3-geo). Never hand-draw geography.
- Tables: `DataTable` (zebra/lines/separated, row alerts, sorting) + `ThresholdValue`, `DataBar`, `HeatCell`, `CategoryChip`.
- KPI dashboards: `Gauge`, `ProgressRing`, `BudgetChart`, `PivotTable`, `HeatmapGrid`, `FunnelChart` (ISO weeks as S35 + date range).
- Comparisons: `VersusTable`. Motion: `Reveal`, `CountUp` (subtle entrances only, respects reduced motion).
- Data viz palette: `--chart-1…8` (vivid categorical, blue first), `--aurora-1…5`, `--div-1…5`, `--funnel-1…6`. UI chrome stays white + one blue.
- Dark mode for web apps: `data-nods-theme="dark" | "dark-navy" | "dark-black"` (tokens/themes.css). Decks stay white.
- `ui_kits/web-app/` — NODS Aula reference web app (sidebar + topbar shell, dashboard, tables, settings, login, dialog). Read its README for app-specific rules.
- `design.md` — compact spec with copy-paste prompts for external UI generators.
