Labels categories (subjects, areas, content types) so they can be told apart at a glance. It uses 6 vivid tones (separate from the chart palette) and they're only for categories. Never use them for status (that's `StatusDot`) or for data (that's `ThresholdValue`).

```jsx
<CategoryChip tone={1}>Matemática</CategoryChip>
<CategoryChip tone={2} icon="book">Lengua</CategoryChip>
<CategoryChip tone={3} variant="outline">Ciencias</CategoryChip>
{/* filter bar */}
<CategoryChip tone={4} count={3} selected={on} onClick={toggle}>Historia</CategoryChip>
```

Tones: 1 blue · 2 cyan · 3 violet · 4 pink · 5 green · 6 orange. Give each category one fixed tone and keep it everywhere in the product. If there are more than 6 categories, use `outline` + `icon` and repeat tones. Dark themes have their own lifted versions of each tone.
