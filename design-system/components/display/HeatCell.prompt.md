A color-scale cell for small grids inside tables, such as activity per weekday or completion per unit. It uses the same 5-step blue ramp as maps (`--map-1…5`) and keeps the text readable on every step.

```jsx
<span style={{ display: 'inline-flex', gap: 4 }}>
  {week.map((v, i) => <HeatCell key={i} value={v} label={days[i]} />)}
</span>
```

Add a small legend (Bajo → Alto) near the table when you use it.
