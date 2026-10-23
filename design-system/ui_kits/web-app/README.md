# NODS Aula — Web app UI kit

Click-through recreation of a NODS teacher platform, built only from this design system's components (`window.NodsDesignSystem_bde349`). Fictional data; no backend.

**There was no existing NODS app source** — this kit applies the brand rules (white canvas, blue accent, Space Grotesk, hairlines, no shadows) to a typical EdTech teacher dashboard. Treat screens as a reference direction, not a copy of a shipped product.

## Screens
- **Inicio** — greeting header, 4 KPIs with muted deltas, weekly delivery chart (segmented range), upcoming deadlines, students needing attention.
- **Aulas** — underline tabs (Activas/Archivadas), search + level filter, clickable `DataTable`.
- **Detalle de aula** — back link, stat strip, tabs (Todos / Requieren atención), student table with status dots and row actions.
- **Seguimiento** — coordinator table: category filter chips with counts, search, Todos/Con alertas, row-style switch (Cebra / Líneas / Separadas), sortable columns, row alerts, ThresholdValue / DataBar / HeatCell, summary Alert, conditional-format legend.
- **Rendimiento** — compliance card (investment tiles, blue big number + GAP, % ejecutado, Gauge with overflow), Real vs budget table (Semanal/Acumulado, KPI pills, collapsible 2026 row, cumplimiento pills, execution bars, sticky total), weekly BudgetChart with execution rings, two HeatmapGrids (compliance by program × week, diverging; leads by day × hour, sequential with totals), and the program × ISO-week PivotTable (CPL conditional formatting).
- **Funnel** — admissions funnel (6 stages) with drop-% chips and hover tooltip, KPI tiles, drop reasons (palette bars), conversion by stage × channel (4 palette colors); program + period filters.
- **Redes sociales** — Instagram vs Facebook: follower cards with CountUp, wins summary, VersusTable of 9 KPIs (30 / 90 days), leads by week (solid vs pattern), top posts table.
- **Buyer persona** — selector of 3 programs; profile + quote, traits, facts, motivations, objections, channels, age chart, decision journey, messages to use / avoid. All sections enter with Reveal.
- **Contenidos** — segmented type filter, search, `Card` grid.
- **Red regional** — `GeoMap` of the Americas: alumnos activos (blue scale) or estado (pattern categories), region switch (Toda América / Latinoamérica / Sudamérica), click a country for detail, ranking list.
- **Ajustes** — tabs Perfil, Notificaciones and **Apariencia** (Claro / Grafito / Navy / Negro with mini previews). Moon/sun icon in the topbar toggles light ↔ last dark theme.
- **Ajustes (detail)** — Perfil (form) and Notificaciones (switches + checkbox); save shows a success `Alert`.
- **Login** — split layout: form left, rounded image placeholder with a blue big number right. Reach it via the logout icon in the sidebar.
- **Nueva tarea** — `Dialog` from Inicio or Detalle; creating shows a toast.

## Dark mode
`dark-mode.html` shows the app in all 4 themes side by side (switch screen at the top). `index.html?theme=dark-navy&screen=tracking` opens any theme/screen directly without touching saved preferences.

## Files
- `index.html` — router + app state (screen persisted in localStorage).
- `data.js` — mock data (`window.NODS_APP`).
- `shell.app.js` — `Sidebar`, `Topbar`, `PageHeader`, `Panel`.
- `screen-home.app.js`, `screen-classes.app.js`, `screen-misc.app.js`, `screen-reach.app.js`, `screen-tracking.app.js`, `screen-performance.app.js`, `screen-funnel.app.js`, `screen-social.app.js`, `screen-persona.app.js` — screens + `NewTaskDialog`.
- Screen files are JSX loaded via Babel but named `.app.js` so the design-system bundler doesn't compile them as library components.

## App rules on top of the brand
- Topbar carries the animated `TaglineRoll` next to the bell (hidden below 1180px viewport); login uses it (md) above the title.
- Shell: 248px sidebar + 64px topbar, both white and separated by hairlines. Content max 1240px, 32px padding.
- Active nav item = `#EEF2FE` tint + blue icon/text. Hover = `#F9FAFB`.
- KPI values in ink (blue stays reserved for slide-scale big numbers, icons and one highlighted word per page title).
- Status = 8px muted dot + ink label (`StatusDot`). Never filled colored badges.
- Focus = blue border, no glow ring. Dialog scrim `rgba(10,10,10,.4)`, no blur, no shadow.
