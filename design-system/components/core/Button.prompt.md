Fully-rounded pill button. Flat (no shadow); hover shifts fill/border color only. Use `primary` for the one main action on a slide (CTA), `secondary`/`ghost` for the rest.

```jsx
<Button variant="primary" iconRight="arrow-right">Agendar demo</Button>
<Button variant="secondary" icon="download">Descargar informe</Button>
<Button variant="ghost" size="sm">Ver más</Button>
```

Variants: `primary` (blue fill, white text) · `secondary` (hairline outline, ink text → blue on hover) · `ghost` (bare, gray hover). Sizes `sm` · `md` · `lg`. Pass `href` to render an anchor.
