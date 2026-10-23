The workhorse of card-grid slides: a flat, rounded (16px), hairline-bordered container with a soft-blue icon chip, title, and microcopy. Never carries a shadow.

```jsx
<Card icon="rocket" title="Onboarding guiado"
      footer={<Tag variant="soft">15 min</Tag>}>
  Activación en minutos, sin fricción para el docente.
</Card>
```

Notes:
- Use in 2 / 3 / 4 / 6-column grids with equal heights (`align-items: stretch`).
- `interactive` adds a blue border on hover for clickable cards.
- Keep microcopy to ~2 lines; one idea per card.
