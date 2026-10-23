Semicircle gauge for one compliance number against a target (execution vs budget, leads vs goal). Flat: gray track and a solid blue fill, with no gradient or glow. Values above `max` fill the track, add a thin muted-red outer arc for the overflow and show a caption with an icon.

```jsx
<Gauge value={72.4} label="vs presupuesto" />
<Gauge value={167} label="Ejecución vs presupuesto" overflowLabel="+67% sobre presupuesto" />
```

Use one gauge per card, next to the big number it explains. For many values at once, use `ProgressRing`.
