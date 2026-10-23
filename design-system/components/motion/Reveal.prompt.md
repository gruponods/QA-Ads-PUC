The entrance animation for panels, cards and sections: a fade plus a 12px rise when the element enters the viewport. Stagger siblings with `index`.

```jsx
<Reveal index={0}><Panel>…</Panel></Reveal>
<Reveal index={1}><Panel>…</Panel></Reveal>
```

Motion rules: entrance only, 300–500ms, the standard ease `cubic-bezier(.2,0,0,1)`, a rise of 12px or less, and never bounce, scale or blur. Don't wrap every small element; animate at section or card level. If the user has reduced motion turned on, content appears immediately.
