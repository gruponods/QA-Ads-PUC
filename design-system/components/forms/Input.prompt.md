Text field for app forms and search bars: label above, optional leading icon, hint or error below. Focus turns the border blue — no glow ring.

```jsx
<Input label="Email" icon="mail" placeholder="nombre@escuela.edu" />
<Input icon="search" size="sm" placeholder="Buscar alumnos" style={{ width: 300 }} />
<Input label="Contraseña" type="password" error="Mínimo 8 caracteres." />
```

Sizes: `sm` 36px (toolbars) · `md` 44px (forms) · `lg` 52px (login). Pass width via `style` (outer wrapper).
