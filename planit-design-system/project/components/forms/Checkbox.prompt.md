Checkbox (multi-select) and Switch (on/off setting).

```jsx
<Checkbox checked={agree} onChange={setAgree} label="공개 일정으로 만들기" />
<Switch checked={on} onChange={setOn} />
```
Both flip to blue when active; disabled fades the whole node.
