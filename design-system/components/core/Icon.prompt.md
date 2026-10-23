One icon system for the whole brand: a Tabler **outline** glyph, uniform 2px stroke. Use it anywhere the brand needs an icon — card headers, buttons, stat rows, timelines.

```jsx
<Icon name="rocket" size={28} color="var(--accent)" />
<Icon name="chart-bar" />
```

Notes:
- `name` is the Tabler name without the `ti-` prefix (browse tabler.io/icons — outline set only).
- Default color is `currentColor`, so it inherits text color; pass `color="var(--accent)"` for brand blue.
- Keep icons monochrome (ink, muted, or accent). Never mix icon libraries.
