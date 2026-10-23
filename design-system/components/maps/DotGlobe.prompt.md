A decorative dotted globe for login screens, covers and "presence" sections. Every dot comes from real land geometry (Natural Earth), never a drawn shape.

It's designed to look calm, not loud:
- Small gray dots (1.25px) that fade with depth toward the edge of the sphere.
- A hairline outline, with no glow, gradient or fill.
- It **sways** gently over the Americas (±26° longitude, a ~35s cycle) instead of spinning.
- Blue markers for the cities, with a soft, slow pulse.
- It stops when it's off screen and stays static with reduced motion.

```jsx
<DotGlobe size={420} />
<DotGlobe size={260} markers={[[-58.38, -34.6]]} sway={12} />
```

It needs the same d3 + topojson-client script tags as `GeoMap`. It reads `--text-faint`, `--accent` and `--gray-200`, so it adapts to the dark themes. Use one per screen at most.
