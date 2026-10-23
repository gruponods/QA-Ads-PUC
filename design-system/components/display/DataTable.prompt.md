Tables in apps (classes, students, deliveries). Rows must always be easy to tell apart. Pick one row style per table: `striped` (zebra, the default), `lines` (hairline rows) or `separated` (each row is its own rounded card, best for few, dense rows).

```jsx
<DataTable
  variant="striped"
  rowTone={(r) => (r.status === 'risk' ? 'risk' : r.status === 'warn' ? 'warn' : null)}
  defaultSort={{ key: 'avg', dir: 'asc' }}
  columns={[
    { key: 'name', label: 'Curso', sortable: true },
    { key: 'area', label: 'Área', render: (r) => <CategoryChip tone={r.tone}>{r.area}</CategoryChip> },
    { key: 'avg', label: 'Promedio', align: 'right', sortable: true, render: (r) => <ThresholdValue value={r.avg} warn={7} bad={6} /> },
    { key: 'att', label: 'Asistencia', sortable: true, render: (r) => <DataBar value={r.att} unit="%" warn={85} bad={75} /> },
  ]}
  rows={rows}
  onRowClick={open}
/>
```

Conditional formatting is done inside cells, with `ThresholdValue` (colored value + icon), `DataBar` (inline bar) and `HeatCell` (blue intensity). Row alerts use `rowTone`, which adds a tinted row plus an icon column so the meaning never relies on color alone. Hovering a clickable row shows a blue tint.
