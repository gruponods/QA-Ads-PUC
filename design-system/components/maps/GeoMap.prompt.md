Country-level map of the Americas (or a sub-region) drawn from real Natural Earth boundaries with d3-geo — never hand-drawn shapes. Use it for presence, reach or any per-country metric.

```html
<!-- required in <head>, exactly these pinned tags -->
<script src="https://unpkg.com/d3@7.9.0/dist/d3.min.js" integrity="sha384-CjloA8y00+1SDAUkjs099PVfnY2KmDC2BZnws9kh8D/lX1s46w6EPhpXdqMfjK6i" crossorigin="anonymous"></script>
<script src="https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js" integrity="sha384-Ukv1p/xTma6P4/2bY5KzWBw+ydSpXmhCMtyciIQVDJ1RmOxtCYNMF1uXT9T63H67" crossorigin="anonymous"></script>
```

```jsx
<GeoMap data={{ '032': 980000, '484': 620000 }} valueLabel="alumnos" legendTitle="Alumnos activos" />
<GeoMap region="latam" mode="category"
  categories={[{ key: 'op', label: 'En operación', pattern: 'solid' }, { key: 'pilot', label: 'Piloto', pattern: 'diagonal' }]}
  data={{ '032': 'op', '600': 'pilot' }} onSelect={setCountry} selected={country} />
```

Rules:
- Keys are ISO 3166-1 numeric ids as 3-digit strings (`AMERICAS_ES` lists every country in the Americas with its Spanish name).
- `scale`: 5-step blue ramp (tokens --map-1…--map-5; light #DCE4FC → #0E2B8C, inverted on dark themes). `category`: blue patterns on a blue tint, same order as charts (solid → diagonal → dots → cross). No other colors.
- 1px borders in the surface color between countries; Americas countries without data = gray-200; countries outside the Americas = gray-100, non-interactive.
- Labels appear only where the name fits inside the country; small countries (Central America, Caribbean) rely on the hover tooltip.
- Regions: `americas` · `north` · `central` · `latam` · `south`.
