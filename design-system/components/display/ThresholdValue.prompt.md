Applies conditional formatting to a number in a table cell. Values that cross a threshold turn muted amber or red, go bold and get an icon. Everything else stays ink. Green is opt-in (`good`); keep it rare so problems stand out.

```jsx
<ThresholdValue value={5.2} warn={7} bad={6} />                       {/* grade */}
<ThresholdValue value={8} warn={3} bad={6} higherIsBetter={false} />  {/* pending tasks */}
<ThresholdValue value={92} suffix="%" good={90} variant="pill" />
```
