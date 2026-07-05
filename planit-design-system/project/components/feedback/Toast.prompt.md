Feedback surfaces. Loader = 3-dot pulse. Toast = transient confirmation. Dialog = desktop modal; BottomSheet = mobile-first alternative.

```jsx
<Loader />
<Toast tone="success" floating>주소를 복사했어요</Toast>
<Dialog open={o} title="이 링크를 비활성화할까요?" body="비활성화하면 참가자가 더 이상 열어볼 수 없어요."
  primary="비활성화" secondary="취소" onPrimary={off} onClose={close} />
<BottomSheet open={o} title="공유하기" onClose={close}>...</BottomSheet>
```

Error copy follows "navigating error" — always offer a way forward. Never skeleton shimmer.
