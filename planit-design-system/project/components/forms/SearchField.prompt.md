Search input with a leading magnifier and optional clear button. Same focus rules as TextField.

```jsx
<SearchField value={q} onChange={e=>setQ(e.target.value)} onClear={()=>setQ("")} placeholder="일정 검색" />
```
