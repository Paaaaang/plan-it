Navigation chrome. TopBar (56pt header), TabBar (floating mobile bottom nav), BottomCTA (fixed bottom action zone).

```jsx
<TopBar title="제주 워크샵" onBack={goBack} trailing={<Icon name="share-2" />} />
<TabBar value={tab} onChange={setTab} items={[
  {value:"home",label:"홈",icon:"home"},
  {value:"list",label:"일정",icon:"calendar"},
  {value:"me",label:"내 정보",icon:"user"},
]} />
<BottomCTA info="로그인 없이 공유해요" onClick={publish}>공유 링크 만들기</BottomCTA>
```

Never place a BottomCTA and a primary Button on the same screen — the action hierarchy collapses.
