Switch between views. `underline` for page-level sections (with optional counts); `segmented` for compact filters and time ranges inside panels.

```jsx
<Tabs items={[{ id: 'active', label: 'Activas', count: 5 }, { id: 'archived', label: 'Archivadas', count: 1 }]} value={tab} onChange={setTab} />
<Tabs variant="segmented" items={[{ id: 'week', label: 'Semana' }, { id: 'month', label: 'Mes' }]} />
```
