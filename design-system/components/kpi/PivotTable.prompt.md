A KPI evolution table: one row per entity (program, campaign, school) and a column group per period (ISO week, month), with several measures per period. The first column stays fixed while scrolling sideways. Rows are zebra-striped, groups are split by hairlines and there's a bold total row. Conditional formatting goes in `measures[].render`.

```jsx
<PivotTable
  rowLabel="Programa"
  groups={[{ key: '35', label: 'S35', sub: '24–30 ago' }, { key: '36', label: 'S36', sub: '31 ago – 6 sep' }]}
  measures={[
    { key: 'cpl', label: 'Costo por lead', render: (v) => <ThresholdValue value={v} warn={9} bad={11} higherIsBetter={false} format={money} />, format: money },
    { key: 'leads', label: 'Leads' },
  ]}
  rows={[{ id: 'cx', label: 'Customer Experience e IA', cells: { '35': { cpl: 5.68, leads: 126 }, '36': { cpl: 6.54, leads: 112 } } }]}
  total={{ cells: { '35': { cpl: 6.04, leads: 1047 }, '36': { cpl: 6.56, leads: 994 } } }}
/>
```

Label ISO weeks as `S35` with the date range underneath. Never show the raw `352026` code.
