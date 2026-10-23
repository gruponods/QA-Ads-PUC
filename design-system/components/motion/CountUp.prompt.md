Makes big numbers (KPIs, big numbers, totals) count up when they appear, and tween smoothly when the value changes, for example when switching period.

```jsx
<CountUp value={48200} />
<CountUp value={4.8} decimals={1} format={(v) => `${v.toFixed(1)}%`} />
```

Use it only for headline numbers, not for every table cell. It uses tabular figures so the width doesn't jitter while counting.
