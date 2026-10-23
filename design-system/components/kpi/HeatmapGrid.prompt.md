A heat-map grid for spotting patterns across two dimensions: day × hour, program × week, school × subject.

- `sequential` (default) uses the 5-step "aurora" ramp, cyan → blue → violet (`--aurora-1…5`). Use it for volumes such as leads, activity or visits. Pass `palette="blue"` for the all-blue ramp.
- `diverging` is centered on a target (`center`, e.g. 100%). Below the target is coral, around it is gray, above it is blue (`--div-1…5`). Use it for compliance or variation against a goal.
- Hovering highlights the row and column. Empty cells are dashed, and a legend is always included.

```jsx
<HeatmapGrid rows={days} cols={hours} values={leadsByDayHour} totals legendLow="Menos leads" legendHigh="Más leads" />
<HeatmapGrid scale="diverging" center={100} unit="%" rows={programs} cols={weeks} values={complianceByWeek} rowLabelWidth={220} />
```

Keep the cells square-ish (34–40px) and the values short. When the grid gets dense, set `showValues={false}` and rely on the tooltip. Never mix scales inside one grid.
