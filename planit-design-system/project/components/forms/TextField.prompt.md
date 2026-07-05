Single- or multi-line text input. 48px, grey-100 resting, white + 1.5px blue border on focus.

```jsx
<TextField label="일정 제목" value={title} onChange={e=>setTitle(e.target.value)} placeholder="예) 제주 워크샵" />
<TextField label="설명" multiline rows={4} helper="참가자에게 보일 소개예요." />
<TextField label="이메일" error="이메일 형식이 올바르지 않아요." />
```

- Focus flips background to white and border to 1.5px `--border-primary`. `error` flips to 1.5px red + red helper.
- `leadingIcon` / `trailingSlot` for search icons, clear buttons, units. `multiline` renders a textarea.
