A small ring with the value inside, for showing many periods at once (weekly execution under a chart, completion per course). The tone carries a band: `ok` ≤100%, `warn` 100–125%, `risk` >125%, or plain `accent`. A `null` value draws a dashed empty ring for future periods.

```jsx
<ProgressRing value={96} tone="ok" />
<ProgressRing value={119} tone="warn" />
<ProgressRing value={null} />
```
