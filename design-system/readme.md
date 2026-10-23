# NODS — Technology for Education · Design System

A high-impact, **premium EdTech presentation system** for **Grupo NODS** ("NODS — Technology for Education"). It is optimized for slide decks and branded documents: pure-white canvases, ink-black type, a single blue accent, and one typeface — Space Grotesk. Flat, calm, and confident.

> **One rule above all:** the background is always white and blue is only an accent. If blue covers more than ~15% of a slide, it is too much.

---

## Sources

This system was built from brand materials supplied by the user; there is no codebase or Figma file behind it.

- `uploads/LOGO NODS AZUL (2).png` — primary wordmark, NODS blue on transparent (→ `assets/logo-nods-blue.png`).
- `uploads/logo nods_blanco (1).png` — reverse wordmark, white on transparent, for dark surfaces (→ `assets/logo-nods-white.png`).
- A written art-direction brief (Spanish) specifying colors, type, layout system, and the slide-template inventory. All numeric values below come from that brief.

The logo is the full lockup **NODS / TECHNOLOGY FOR EDUCATION™**. No standalone icon mark was provided, so none was invented — use the wordmark everywhere a mark is needed.

---

## Company context

**Grupo NODS** is an EdTech company — "Technology for Education." Its materials speak to schools, ministries, and institutional decision-makers about a platform that unifies **content, classroom, and analytics**. The design language is that of a premium agency deck: lots of white space, one idea per slide, and data shown plainly.

---

## Content fundamentals

**Language.** Primary language is **Spanish (LatAm, neutral)**. Keep it that way unless a project asks otherwise.

**Voice.** Warm, direct, and benefit-led — a partner, not a vendor.
- **"Nosotros" + "tu/tu aula"**: inclusive first person plural for NODS, second person for the audience. e.g. *"Llevemos la tecnología a tu aula."*
- Lead with the outcome for the teacher/school, then the capability. *"…para que cada docente enseñe con datos, no con supuestos."*
- Confident, never hyperbolic. Evidence over adjectives (*"Menos supuestos, más evidencia"*).

**Casing & mechanics.**
- Sentence case for titles and body. **Kickers and tags are UPPERCASE** with wide tracking.
- Titles often end in a period for a calm, declarative cadence (*"…funcione."*).
- One blue keyword per headline; never color body copy.
- Numbers are concrete and rounded for impact (*"3.2M alumnos", "+40 países", "128%"*).

**Tone examples (from the templates):**
- Kicker: *"TECNOLOGÍA PARA LA EDUCACIÓN"*
- Cover: *"Tecnología que hace que el aula realmente **funcione**."*
- Section: *"Todo el aula, en una sola **plataforma**."*
- CTA: *"Llevemos la tecnología **a tu aula**."*

**Emoji: never.** Meaning is carried by Tabler outline icons, not emoji.

---

## Visual foundations

**Color.**
- Canvas is **pure white `#FFFFFF`**, always. No dark fills, gradients, or textures — except the 1–2 dedicated dark **section dividers** (ink `#0A0A0A` or deep navy `#0B1B4D`) used to mark chapters and give the deck a breather.
- Default text is **ink `#0A0A0A`**. Muted copy / subtitles are **`#6B7280`**; faint captions **`#9CA3AF`**.
- **NODS Blue `#1946E3`** is the only accent: one keyword in a headline, big numbers, icons, accent lines/bars, a highlighted table column. `#1238B5`/`#0E2B8C` are hover/press; `#EEF2FE` is a faint tint for subtle highlights.
- **Data states are muted and rare** — `--data-up #3E9B6B`, `--data-warn #C6902F`, `--data-down #C0544B` — only for ↑↓ variation next to numbers or in charts. Never as fills, never elsewhere.

**Chart palette (wider, more vivid).** UI stays white + one blue accent, but data viz gets its own palette so dashboards don't read monochrome:
- Categorical `--chart-1…8` — blue #1946E3, coral #FF6B57, cyan #06B6D4, violet #8B5CF6, sun #FFB020, pink #E64980, green #22C55E, navy #0B1B4D.
- Sequential "Aurora" `--aurora-1…5` (cyan → blue → violet) for heat maps; all-blue `--map-1…5` still available.
- Diverging `--div-1…5` coral ↔ gray ↔ blue for values vs a target.
- Funnel `--funnel-1…6` violet → blue → cyan → teal.
- Data states are livelier: up #12A16B, warn #F2A516, down #E5484D (text versions -fg). Category chips use 6 vivid tones (blue, cyan, violet, pink, green, orange).
All have lifted versions in the dark themes.

**Typography.** **Space Grotesk only** (300/400/500/700). Hierarchy comes from weight + size, never a second family — not even for data.
- Display (cover/section) Bold 40–56px · Slide title Bold/Medium 28–34px · Subtitle/bajada Regular 18–20px `#6B7280` · Body Regular 14–16px · Kicker/tag Medium 12–13px UPPERCASE tracking .16em · Big number Bold 64–120px blue.
- Line-height: airy on headlines (~1.3), 1.5–1.6 on body, ~1.02 on big numbers. Slight negative tracking on large display.

**Shape & elevation.** Flat and clean. Corners are **always rounded** — 12–16px on cards, `pill` on tags and buttons, 24px on large panels/photos. **No shadows, ever.** Surfaces separate with **hairline `1px #E5E7EB` borders**.

**Cards.** White background, 16px radius, hairline border, no shadow. A soft-blue rounded chip holds a blue Tabler icon; then title (Medium 20px) and microcopy (`#6B7280`). Interactive cards shift the border to blue on hover.

**Layout.** 12-column grid, generous margins (slide padding 64×88px on a 1280×720 canvas), strict alignment. White space is part of the design — one idea per slide, maximum air. Photos live in rounded containers or partial bleed, treated consistently.

**Motion & states.** Minimal. Hover = a 150ms color/border shift (fill darkens to `#1238B5`, or border turns blue); no bounces, no elevation changes, no scale on press. Buttons are pills with a flat color transition.

**Charts.** Inherit the theme: blue bars, hairline gray axes/gridlines, Space Grotesk labels, no 3D/shadow/gradient. A single bar may take a muted data-state color to flag it. **Multiple series use the vivid chart palette** (`--chart-1…8`: blue, coral, cyan, violet, sun, pink, green, navy) in that order; series 1 is always NODS blue and single-series charts stay blue. Patterns (`tokens/patterns.css`) are an optional second encoding for print, color-blind safety or projected values. Legend via `PatternSwatch`.

---

## Iconography

**One system: [Tabler Icons](https://tabler.io/icons) — the outline (default) set**, a uniform 2px stroke on a 24px grid. It ships with the system as a **webfont** loaded from CDN in `tokens/icons.css` (`@import`ed by `styles.css`).

- Usage: `<i class="ti ti-{name}"></i>` in HTML, or the **`Icon`** component in React (`<Icon name="rocket" />`).
- Keep icons monochrome — ink, muted gray, or blue. Never mix icon libraries, never use emoji, never approximate icons with unicode glyphs.
- Common names in the templates: `books`, `device-laptop`, `chart-dots`, `users-group`, `sparkles`, `shield-check`, `school`, `clipboard-check`, `adjustments`, `trending-up`, `mail`, `world`, `phone`, `check`, `minus`, `arrow-right`, `photo`.

---

## Components

Reusable React primitives (`window.NodsDesignSystem_bde349.*`). Each has a `.jsx`, a `.d.ts` contract, and a `.prompt.md` usage note; `components/*/*.card.html` are the Design-System-tab specimens.

**Core** (`components/core/`)
- **Icon** — Tabler outline glyph wrapper (the one icon system).
- **Kicker** — uppercase, wide-tracked eyebrow with a blue accent tick.
- **Tag** — pill chip; `outline` / `soft` / `solid` / `neutral`.
- **Button** — pill button; `primary` / `secondary` / `ghost`, three sizes, flat hover.
- **Card** — flat rounded (16px) hairline card with a blue icon chip, title, microcopy.
- **Divider** — hairline `rule` or short blue `accent` bar.

**Data** (`components/data/`)
- **BigNumber** — the signature oversized blue metric, with optional delta + label.
- **StatDelta** — muted ↑/↓ trend chip (the only non-blue accent).
- **BarChart** — flat themed bar chart (blue bars, hairline axes, Space Grotesk labels); grouped series differentiated by fill pattern.
- **PatternSwatch** — legend swatch for patterned series (solid, diagonal, dots, cross, horizontal, tint).
- **StepItem** — numbered process/timeline step with connector line (vertical or horizontal).
- **LogoWall** — grayscale client-logo grid.

**App — core addition** (`components/core/`)
- **IconButton** — round icon-only button (ghost / outline / primary) with optional blue notification dot.

**App — forms** (`components/forms/`)
- **Input** — label, leading icon, hint/error; blue border on focus, no ring.
- **Select** — native select styled like Input.
- **Checkbox** — 20px rounded box, blue fill when on.
- **Switch** — 40×24 pill toggle, blue when on.

**App — navigation** (`components/navigation/`)
- **Tabs** — `underline` (blue 2px indicator, optional counts) or `segmented` (pill toggle).

**App — feedback** (`components/feedback/`)
- **Alert** — white hairline message; tone carried by icon color only. Also the toast body.
- **Dialog** — flat scrim + white 16px panel, no shadow; Esc / scrim / × close.
- **StatusDot** — 8px muted dot + ink label for statuses.

**Brand** (`components/brand/`)
- **TaglineRoll** — animated "TECHNOLOGY FOR ___" tagline; words roll faster and land on "education", which lights up (border + tint + shine, no glow). Topbar (sm) and login (md).

**KPI** (`components/kpi/`)
- **Gauge** — flat semicircle gauge vs target; overflow above 100% as a thin muted-red outer arc + caption.
- **ProgressRing** — small ring with value inside; ok / warn / risk bands; dashed when empty (future).
- **BudgetChart** — real vs budget per period: gray outlined budget bar, blue real bar (amber when below budget), hatched future periods, execution rings underneath.
- **FunnelChart** — marketing funnel: centered bars on the funnel ramp, drop-% chips between stages (biggest drop highlighted), hover tooltip with volume, % of total, conversion and drop.
- **HeatmapGrid** — rows × columns heat map: sequential Aurora / blue (volumes) or diverging coral · gray · blue around a target (compliance); row/column hover, dashed empty cells, optional totals, legend.
- **PivotTable** — entity × period (e.g. program × ISO week) with several measures, sticky wrapping first column, zebra, total footer.

**Compare** (`components/compare/`)
- **VersusTable** — head-to-head KPIs (e.g. Instagram vs Facebook): butterfly bars, left solid blue / right blue diagonal pattern, winner bold + advantage %, `lower` for costs, `neutral` for spend.

**Motion** (`components/motion/`)
- **Reveal** — entrance fade + 12px rise on entering the viewport, stagger via `index` (70ms).
- **CountUp** — headline numbers count up (ease-out) and tween on change.
- BarChart, ProgressBar and VersusTable bars grow on mount (`animate`, default true).

**App — maps** (`components/maps/`)
- **DotGlobe** — calm dotted globe from real land geometry (canvas): depth-faded gray dots, hairline outline, gentle sway over the Americas (no spin), pulsing blue city markers; theme-aware, pauses off-screen, static with reduced motion. Used on Login.
- **GeoMap** — countries of the Americas from real Natural Earth boundaries (d3-geo); blue scale or pattern categories, Spanish labels, tooltip, selection. Exports `AMERICAS_ES` (ISO numeric id → Spanish name).

**App — display** (`components/display/`)
- **Avatar** — photo or initials on the blue tint.
- **ProgressBar** — gray pill track, blue fill.
- **DataTable** — rows always clearly distinguished: `striped` (zebra, default) · `lines` · `separated`; row alerts (`rowTone` → tinted row + icon), sortable columns, blue-tint hover.
- **CategoryChip** — muted categorical chip (6 tones: blue, teal, violet, plum, olive, slate); soft / outline; filter mode with counts.
- **ThresholdValue** — conditional-format number: muted amber/red (+ optional green), bold, with icon; text or pill.
- **DataBar** — in-cell bar; blue, muted amber/red past thresholds.
- **HeatCell** — 5-step blue intensity cell (same ramp as maps).

**Slide primitives** (`slides/`, exported but not "components"): **SlideFrame** (1280×720 canvas, light/navy/black), **SlideFooter** (logo + page), **SlideHeading** (kicker + title + subtitle), **PhotoFrame** (image placeholder).

---

## Web apps

The same brand rules apply to application UI, plus these app-specific conventions (tokens in `tokens/app.css`):

- **Shell:** 248px white sidebar + 64px white topbar, separated by hairlines. Content max-width 1240px, 32px padding. Page background stays white — panels are hairline-bordered, never shaded or shadowed.
- **Tagline:** `TaglineRoll` sits in the topbar left of the notification bell (hidden under ~1180px viewport) and above the login title. One per screen.
- **Navigation:** active item = `#EEF2FE` tint + blue icon and text; hover = `#F9FAFB`. Breadcrumbs in the topbar.
- **Page headers:** kicker + 28–30px Bold title with at most one blue word + gray subtitle; primary action top-right.
- **Controls:** heights 36 (toolbars) / 44 (forms) / 52 (login). 12px radius on fields, pill on buttons. Focus = blue border, no glow ring.
- **Charts:** compare series with patterns (`BarChart` `series` + `PatternSwatch` legend), keeping one blue.
- **Maps:** use `GeoMap` for any country-level geography of the Americas. Boundaries come from real Natural Earth data (world-atlas@2.0.2, 1:110m) rendered with d3-geo — never hand-drawn shapes. `scale` mode = 5-step blue ramp (#DCE4FC → #0E2B8C); `category` mode = the same blue tramas as charts on a blue tint. White 1px borders between countries, gray-200 for countries without data, gray-100 for context outside the Americas. Names in Spanish, shown only where they fit inside the country; small countries (Central America, Caribbean) are named in the hover tooltip. Regions: americas · north · central · latam · south. The page must load the pinned d3@7.9.0 + topojson-client@3.1.0 script tags (see `components/maps/GeoMap.prompt.md`).
- **Tables:** rows must always be easy to tell apart — zebra by default (`--table-stripe`), or hairline lines, or separated rounded rows. Flag problem rows with `rowTone` (soft red/amber row tint + alert icon column, never color alone). Conditional formatting inside cells: `ThresholdValue`, `DataBar`, `HeatCell`. Categories (subject, area, type) use `CategoryChip` — the 6 category tones are reserved for categories (chart series use the chart palette); status stays `StatusDot`, data stays the muted data states. Reference: Seguimiento screen.
- **Dark mode (web apps only):** three themes via `data-nods-theme` on `<html>` — `dark` (Grafito, recommended), `dark-navy` (brand deep navy), `dark-black` (pure black, hairlines only). Same flat rules. On dark, text/icon blue is lifted (`--accent` #6283FF / #7090FF) for contrast, while solid fills with white text use `--accent-fill`; data, category and map ramps have lifted dark versions; logos switch to `logo-nods-white.png`. Decks and documents always stay white. Compare all options in `ui_kits/web-app/dark-mode.html`; users pick in Ajustes → Apariencia or with the moon icon in the topbar.
- **KPI / budget dashboards:** compliance = big blue number + `StatDelta` GAP + `Gauge`; real vs budget = table with Semanal / Acumulado toggle, KPI pills, collapsible year row, cumplimiento pills (`ThresholdValue`), execution bars (`DataBar`) and a sticky total; weekly evolution = `BudgetChart`; per-entity evolution = `PivotTable`; patterns across two dimensions = `HeatmapGrid` (blue sequential for volumes like leads by day × hour; diverging red–gray–blue around 100% for compliance by program × week — never mix scales in one grid). ISO weeks are labelled `S35` with the date range ("24–30 ago"), never the raw `352026` code. The current week is highlighted in blue. Reference: Rendimiento screen.
- **Data:** KPI values in ink (blue reserved for slide-scale big numbers, icons and accents). Status = `StatusDot` (muted dot + ink label), never filled colored badges. Trends = `StatDelta`.
- **Overlays:** dialog scrim `rgba(10,10,10,.4)`, no blur, no shadow. Toasts = `Alert` fixed bottom-right.
- **Motion:** interaction = 150ms color/border transitions. Entrances = `Reveal` (fade + ≤12px rise, 420ms, `cubic-bezier(.2,0,0,1)`, 70ms stagger) at section/card level; headline numbers `CountUp`; bars and progress grow from the baseline (700–800ms). Screen changes fade-rise 360ms. Never bounce, scale, blur or loop (the only loop is `TaglineRoll`). Everything respects `prefers-reduced-motion`.

Reference UI kit: **`ui_kits/web-app/index.html`** — NODS Aula, a teacher platform (Inicio, Aulas, Detalle de aula, Seguimiento (tables + conditional formatting), Funnel (admissions funnel with hover drops, drop reasons, conversion by stage × channel), Redes sociales (Instagram vs Facebook: VersusTable, follower cards, leads by week with patterns, top posts), Buyer persona (profile + quote, facts, motivations, objections, channels, age, decision journey, messaging), Rendimiento (compliance gauge, real vs budget, weekly evolution, ISO-week pivot), Contenidos, Red regional (map), Ajustes incl. Apariencia, Login, Nueva tarea dialog) and `dark-mode.html` (the 4 themes side by side). There was no existing app source, so it's a brand-faithful direction, not a copy of a shipped product.

---

## Slide templates

Sixteen reusable layouts, each a component with its own `@dsCard` (group **Slides**) and composed from the primitives above. Browse them all at **`slides/index.html`**.

`CoverSlide` · `AgendaSlide` · `SectionSlide` (light divider) · `ProblemSolutionSlide` · `SectionDividerDark` (dark divider) · `CardGridSlide` (2/3/4/6) · `ProductShotSlide` · `TextChartSlide` · `MetricPhotoSlide` · `TimelineSlide` · `RoadmapSlide` · `ComparisonSlide` · `PricingSlide` · `LogoGridSlide` · `TeamSlide` · `ClosingSlide`.

A ready-to-edit deck built from these lives in **`templates/nods-deck/NodsDeck.dc.html`** (the "NODS — Presentación" template consuming projects can start from).

---

## File index

- `styles.css` — global entry point (link this one file). Imports everything below.
- `tokens/` — `fonts.css` (Space Grotesk), `icons.css` (Tabler webfont), `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `app.css` (web app shell + control sizes), `patterns.css` (chart tramas), `themes.css` (3 dark themes).
- `assets/` — `logo-nods-blue.png`, `logo-nods-white.png`.
- `guidelines/` — 16 foundation specimen cards (Colors, Type, Spacing, Brand).
- `components/core/`, `components/data/` — deck + shared primitives (+ specimen cards).
- `components/forms/`, `components/navigation/`, `components/feedback/`, `components/display/`, `components/kpi/`, `components/compare/`, `components/motion/`, `components/maps/` — web app primitives (+ specimen cards).
- `ui_kits/web-app/` — NODS Aula click-through web app (`index.html`, screens, README).
- `design.md` — portable spec with copy-paste prompts (Google Stitch etc.).
- `slides/` — the 16 slide-template components, their `@dsCard` previews, and `index.html`.
- `templates/nods-deck/` — the copyable NODS deck (`NodsDeck.dc.html` + `ds-base.js` + `deck-stage.js`).
- `thumbnail.html` — homepage tile. `SKILL.md` — portable skill wrapper.

---

## Caveats

- **Fonts load from Google Fonts CDN**, not self-hosted binaries (the exact family, Space Grotesk — not a substitute). To self-host, drop woff2 files into `assets/fonts/` and swap the `@import` in `tokens/fonts.css` for local `@font-face` rules. The compiler therefore reports 0 bundled font files — expected.
- **Icons are Tabler outline via CDN webfont.** This matches the brief's "Tabler o Phosphor outline" and is not a forced substitution, but it does require network access.
- **Imagery uses `PhotoFrame` placeholders** (no stock photos were provided). Swap in real `<img>` or a drop-in image slot in production.
- The **dark section divider defaults to black** (`theme="black"`) because NODS blue reads cleanly on it; `theme="navy"` is available but blue accents have lower contrast on `#0B1B4D`.
