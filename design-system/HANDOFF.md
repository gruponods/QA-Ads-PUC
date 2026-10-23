# Handoff: NODS Design System → Claude Code

## Overview
The full design system for **NODS — Technology for Education**: tokens, fonts, icons, ~45 React primitives (UI, tables, KPI charts, funnel, heat maps, maps, comparisons, motion), 16 slide templates, an editable deck, a reference web app (NODS Aula, 13 screens, light + 3 dark themes) and design rules. This file explains how to use the folder from Claude Code.

## About these files
Everything here is a **design reference built in HTML/React (no build step)**. The `.jsx` components are real, working React and use only CSS custom properties, so they can be copied into a React codebase almost as-is. For other stacks (Vue, Svelte, native), **recreate** them with that codebase's own patterns and keep the exact values in `tokens/`.

**Fidelity: high.** The colors, type, spacing, radii and states are final. Implement them pixel-perfect.

## Two ways to use it in Claude Code

### A) As a Skill (to generate branded slides, mocks and prototypes)
1. Unzip the folder and rename it `nods-design`.
2. Put it in `~/.claude/skills/nods-design/` (available in every project) or in `<repo>/.claude/skills/nods-design/` (that repo only).
3. `SKILL.md` at the root is the entry point. In Claude Code, invoke `/nods-design` or just ask: "make a NODS deck about…", "a screen for the NODS app with…".

### B) As the source for a real codebase
1. Copy `tokens/*.css` and `styles.css` into the app. Import `styles.css` once, globally.
2. Copy `assets/` (logos).
3. Copy whichever `components/**` the app needs. Each component has `Name.jsx` (implementation), `Name.d.ts` (props contract) and `Name.prompt.md` (usage).
4. Use `ui_kits/web-app/` as the visual and behavioral reference for screens.
5. Suggested prompt for Claude Code: *"Read readme.md and HANDOFF.md. Port tokens/ and components/ into src/design-system following this repo's conventions, without changing values."*

## Non-negotiable rules (summary — full detail in `readme.md`)
- Background **always white** `#FFFFFF` in decks (dark only for 1–2 chapter dividers). Web apps add optional dark themes via `data-nods-theme` on a root wrapper.
- Text `#0A0A0A`. **NODS Blue `#1946E3` is an accent only** (one word per title, big numbers, icons, lines). Under ~15% of the surface. Never in paragraphs.
- **Space Grotesk** only (300/400/500/700).
- **No shadows.** 1px `#E5E7EB` borders. Radius 12–16px on cards, pill on buttons and tags.
- Icons: **Tabler outline** (`<i class="ti ti-name">`). No emoji.
- Green/amber/red (`--data-*`) **only** for ↑↓ deltas, status dots and conditional formatting. Category chips use `--cat-1…6`.
- Chart series use the vivid **chart palette** `--chart-1…8` (blue first); patterns are optional extra encoding. Heat maps: Aurora ramp; diverging coral ↔ blue; funnels: `--funnel-1…6`.
- Maps: real geometry (Natural Earth + d3-geo). Never hand-drawn.
- Motion: entrances only (`Reveal` fade + 12px rise, `CountUp`, bars grow). No bounce/scale/blur. Respect `prefers-reduced-motion`.

## Structure
| Path | Contents |
|---|---|
| `styles.css` | Global entry point (only `@import`s). |
| `tokens/` | `colors` · `typography` · `spacing` · `effects` · `app` (shell/controls) · `patterns` (chart patterns) · `themes` (dark: Grafito / Navy / Black via `data-nods-theme`) · `fonts` · `icons`. |
| `assets/` | `logo-nods-blue.png` (light backgrounds), `logo-nods-white.png` (dark backgrounds). |
| `components/core/` | Button, IconButton, Card, Tag, Kicker, Divider, Icon. |
| `components/data/` | BigNumber, StatDelta, BarChart (grouped series + patterns), PatternSwatch, StepItem, LogoWall. |
| `components/forms/` | Input, Select, Checkbox, Switch. |
| `components/navigation/` | Tabs (underline / segmented). |
| `components/feedback/` | Alert, Dialog, StatusDot. |
| `components/display/` | Avatar, ProgressBar, DataTable (zebra/lines/separated, row alerts, sorting), CategoryChip, ThresholdValue, DataBar, HeatCell. |
| `components/kpi/` | Gauge, ProgressRing, BudgetChart (real vs budget + execution rings), PivotTable (entity × ISO week), HeatmapGrid (sequential / diverging), FunnelChart (hover drops). |
| `components/compare/` | VersusTable (head-to-head KPIs, butterfly bars). |
| `components/motion/` | Reveal (entrance + stagger), CountUp. Bars/progress grow via `animate`. |
| `components/maps/` | GeoMap (Americas; scale or categories), DotGlobe (calm dotted globe for login / covers). |
| `components/brand/` | TaglineRoll (animated "Technology for ___"). |
| `slides/` | 16 slide components (1280×720) + `index.html` gallery. |
| `templates/nods-deck/` | Editable deck (`NodsDeck.dc.html` + `deck-stage.js`). |
| `ui_kits/web-app/` | NODS Aula: Home, Classes, Class detail, Tracking (tables), Performance (compliance, real vs budget, ISO-week pivot), Funnel, Social (Instagram vs Facebook), Buyer persona, Content, Regional network (map), Settings (incl. Appearance), Login, New task dialog. `dark-mode.html` compares the 4 themes. |
| `guidelines/` | Foundation specimen cards (HTML). |
| `readme.md` | Complete guide: content, visual foundations, iconography, web apps, index. |
| `design.md` | Short spec with copy-paste prompts (Stitch, etc.). |
| `SKILL.md` | Agent Skill entry point. |
| `exports/Nods Deck.html` | Standalone offline deck. |

**Files you can ignore or regenerate:** `_ds_bundle.js`, `_ds_manifest.json` and `_adherence.oxlintrc.json` were generated by the design tool. `_ds_bundle.js` is a precompiled bundle of every component, exposed as `window.NodsDesignSystem_bde349`. The HTML previews load it, but a real codebase should import the `.jsx` files directly.

**Note on `ui_kits/web-app/*.app.js`:** these are JSX that the browser compiles with Babel. They are named `.app.js` only so the bundler doesn't treat them as library components. In a real app, rename them to `.jsx`/`.tsx`.

## External dependencies
- **Space Grotesk**: loaded from the Google Fonts CDN (`tokens/fonts.css`). To self-host, add woff2 files and swap the `@import` for `@font-face`.
- **Tabler Icons webfont 3.33.0**: CDN (`tokens/icons.css`). In React you can use `@tabler/icons-react` instead, with stroke 2.
- **Maps** (only if `GeoMap` / `DotGlobe` are used): `d3@7.9.0` + `topojson-client@3.1.0`, plus the `world-atlas@2.0.2` data (`countries-110m.json`, `land-110m.json`). The pinned tags are in `components/maps/GeoMap.prompt.md`. With npm: `d3-geo`, `topojson-client`, `world-atlas`.
- **React 18**. No other libraries are needed.

## Key interactions
- Hover: 150ms color/border change only. No elevation, no scaling.
- Focus on fields: blue border, no ring.
- Dialog: flat scrim `rgba(10,10,10,.4)`. Closes with Esc, scrim click or ×.
- TaglineRoll: words roll faster and faster (0.5s → 0.13s), land on the last word, which lights up for 3.6s, then it loops. Respects `prefers-reduced-motion`.
- GeoMap: hover shows a tooltip; clicking selects a country (outline). Labels appear only where they fit inside the country.

## Open caveats
- No real NODS app existed. The web app is a brand-faithful direction, not a copy of a shipped product.
- Images are placeholders (`PhotoFrame`). Real photography and client logos are still needed.
