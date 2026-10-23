Modal for focused tasks (create, confirm). Flat dark scrim, white rounded panel with a hairline border — never a drop shadow. Closes on scrim click, × and Esc.

```jsx
<Dialog open={open} onClose={close} title="Nueva tarea" description="Se publica en el aula."
  footer={<><Button variant="ghost" onClick={close}>Cancelar</Button><Button>Crear tarea</Button></>}>
  <Input label="Título" />
</Dialog>
```

`inline` renders just the panel (no scrim) for documentation.
