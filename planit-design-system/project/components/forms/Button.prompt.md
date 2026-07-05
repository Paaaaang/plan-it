The Planit action button — reads like a sentence, one `primary` per screen. Use for any tap/click that commits an action.

```jsx
<Button variant="primary" size="xl" block>공유 링크 만들기</Button>
<Button variant="secondary" size="m">취소</Button>
<Button variant="ghost" size="m">건너뛰기</Button>
```

- `variant`: `primary` (blue, one per screen) · `secondary` (grey-100) · `danger` (red) · `ghost` (text-link).
- `size`: `xl`(56) · `l`(48) · `m`(40) · `s`(32) — radius scales 16/14/12/10.
- `loading` swaps the label for a 3-dot pulse. `disabled` fades the whole node (0.32). Never use two primaries or a primary + BottomCTA on the same screen.
