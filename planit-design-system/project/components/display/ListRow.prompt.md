The core Planit list unit — whole row is tappable. Left slot + title/subtitle + right slot + optional chevron.

```jsx
<ListRow
  left={<Avatar name="제주 워크샵" />}
  title="제주 워크샵"
  subtitle="2박 3일 · 12명"
  right={<Badge tone="success" dot>공개중</Badge>}
  chevron onClick={open}
/>
```
Right-slot numbers use tabular figures. Group rows with a ListHeader-style title row above.
