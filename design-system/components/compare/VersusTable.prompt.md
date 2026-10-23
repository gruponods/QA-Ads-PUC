Compares two options head to head across many KPIs (Instagram vs Facebook, campaign A vs B, this year vs last year). Each row is a butterfly: the left bar is blue (`--chart-1`) and the right bar is coral (`--chart-2`). Use `rightPattern="diagonal"` to add a second encoding for print or color-blind readers. The winner of each row goes bold, with its advantage in muted green. Use `lower: true` for costs (CPL, CPC) and `neutral: true` for rows with no winner, like spend.

```jsx
<VersusTable
  left={{ label: 'Instagram', icon: 'brand-instagram' }}
  right={{ label: 'Facebook', icon: 'brand-facebook' }}
  metrics={[
    { label: 'Alcance', left: 412000, right: 268000 },
    { label: 'Engagement', left: 4.8, right: 1.9, format: (v) => `${v}%` },
    { label: 'Costo por lead', left: 6.2, right: 5.1, lower: true, format: (v) => `$${v}` },
  ]}
/>
```

Bars are scaled per row, so compare the bars within a row and not between rows. Keep it to about 10 rows.
