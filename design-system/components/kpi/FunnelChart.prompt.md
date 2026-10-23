A marketing or admissions funnel. Each stage is a centered bar colored along the funnel ramp (violet → blue → cyan → teal), with its volume on the right and its share of the total underneath. Between stages, a chip shows the **drop %**, and the biggest drop is highlighted in solid red. Hovering a stage or chip shows a tooltip with the volume, % of total, conversion from the previous stage and the drop (% and how many were lost).

```jsx
<FunnelChart stages={[
  { label: 'Visitas al sitio', value: 48200, icon: 'world' },
  { label: 'Leads', value: 4820, icon: 'user-plus' },
  { label: 'Contactados', value: 3610, icon: 'phone' },
  { label: 'Entrevista', value: 1390, icon: 'messages' },
  { label: 'Inscriptos', value: 486, icon: 'school' },
]} />
```

When the last stage is under 20% of the first, `scale="auto"` uses a square-root scale so late stages stay visible. The numbers and percentages are always exact. Keep it to 4–7 stages.
