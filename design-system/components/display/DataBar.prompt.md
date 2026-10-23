An inline bar inside a table cell for percentages (attendance, completion). It's blue normally and switches to muted amber or red when the value crosses a threshold.

```jsx
<DataBar value={92} unit="%" warn={85} bad={75} />
<DataBar value={71} unit="%" warn={85} bad={75} width={100} />
```
