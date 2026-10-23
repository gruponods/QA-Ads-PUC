Weekly (or monthly) actual vs budget. Budget is a gray outlined bar behind; the actual is a blue bar in front, which turns muted amber when it falls below budget. Future periods show only a hatched budget bar. A `ProgressRing` under each bar shows execution, banded ok / warn / risk.

```jsx
<BudgetChart current="S40" data={[
  { label: 'S38', real: 1310, budget: 1150, exec: 207 },
  { label: 'S39', real: 1270, budget: 1110, exec: 200 },
  { label: 'S40', real: null, budget: 1200 },
]} />
```

Pair it with a Semanal / Acumulado segmented toggle that feeds cumulative data to the same chart.
