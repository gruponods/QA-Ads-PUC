Inline feedback message, also used as the body of toasts. Always a white card with a hairline border — the tone lives only in the icon color (no tinted fills, no colored left border).

```jsx
<Alert tone="success" title="Cambios guardados" onClose={close}>Tu perfil se actualizó.</Alert>
<Alert tone="warning" title="3 alumnos sin entregar">Revisá la tarea de ecuaciones.</Alert>
```

Tones: `info` (blue) · `success` · `warning` · `error` (muted green / amber / red).
