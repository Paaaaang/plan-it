Chip = multi-filter (toggle several). Badge = status label (read-only). Avatar = person/place image or initial.

```jsx
<Chip active={sel} onClick={toggle}>맛집</Chip>
<Chip variant="brand" leadingIcon={<Icon name="sparkles" size={14}/>}>추천</Chip>
<Badge tone="success" dot>공개중</Badge>
<Badge tone="danger">비공개</Badge>
<Avatar name="김플랜" size={44} />
```
