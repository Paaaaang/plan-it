Mutually-exclusive single choice (vs Chip which is multi-filter). Selected segment lifts to white + shadow-1.

```jsx
<SegmentedControl options={["타임테이블","하이라이트","장소"]} value={tab} onChange={setTab} />
<SegmentedControl options={[{value:"day1",label:"1일차"},{value:"day2",label:"2일차"}]} value={day} onChange={setDay} />
```
