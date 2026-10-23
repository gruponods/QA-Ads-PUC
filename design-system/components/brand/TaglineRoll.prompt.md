Animated brand tagline "TECHNOLOGY FOR ___": words roll up inside a pill, getting faster, and land on the last word, which lights up (blue border + tint + a shine sweep). Use it in the app topbar (next to notifications) and on the login screen. Use one per screen at most.

```jsx
<TaglineRoll />                         {/* topbar, sm */}
<TaglineRoll size="md" />               {/* login / hero */}
<TaglineRoll words={['schools', 'teachers', 'education']} loop={false} />
```

Notes:
- The last word is the message, so keep `education` (or the brand's key word) last.
- It's flat on purpose: the lit state is a border + tint, with no glow shadow, so it follows the no-shadows rule.
- With `prefers-reduced-motion` it shows the final word, lit, with no animation.
