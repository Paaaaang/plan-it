/**
 * @file 공개 뷰어 라우트 레이아웃
 * @route /p/*
 *
 * 여기 있는 두 가지는 **뷰어 셸에서 옮겨 온 것**이다. 3단계 편집기가 같은 셸을
 * 폰 프레임 미리보기로 재사용하기 때문이다 — 셸이 문서 전체를 건드리면 미리보기가
 * 호스트(편집기) 화면을 바꾼다.
 *
 *  1. `scroll-padding-bottom` — 하단 sticky CTA가 앵커·포커스·scrollIntoView로
 *     올라온 항목을 덮지 않게 스크롤포트에 여백을 준다(스펙 §5.1).
 *     스크롤포트는 `<html>`이라 컴포넌트 클래스로는 표현할 수 없다. 셸 안에서는
 *     `<style>`이 `precedence` 없이 렌더돼 **`<body>` 한복판**에 앉았고(React 19는
 *     그때만 head로 hoist한다), 셸이 마운트되는 모든 화면에 규칙이 걸렸다.
 *     라우트 레이아웃 + `precedence`로 옮기면 head에 올라가고 /p 경로에서만 걸린다.
 *
 *  2. 화면 높이 — 셸이 `min-h-dvh`로 **브라우저 뷰포트**를 재던 것을 여기로 뺐다.
 *     셸은 이제 부모를 채우기만 한다(`grow`). 폰 프레임 미리보기는 프레임에
 *     높이를 주고 셸을 그 안에 넣으면 된다 — 셸을 고칠 필요가 없다.
 */

export default function ViewerLayout({ children }: LayoutProps<"/p">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <style href="viewer-scroll-padding" precedence="default">{`
        html { scroll-padding-bottom: 96px; }
      `}</style>
      {children}
    </div>
  );
}
