"use client";

import { ViewerShell } from "@/components/viewer/viewer-shell";
import type { ViewerPlan } from "@/types/viewer";

/**
 * 참가자가 보는 화면. **확정된 뷰어 컴포넌트를 그대로 쓴다**(스펙 §5.2).
 *
 * 미리보기 전용 뷰어를 따로 만들면 두 화면이 반드시 어긋난다 — 뷰어를 고칠 때마다
 * 여기도 고쳐야 하는데, 안 고쳐도 아무 테스트가 깨지지 않는다(그게 어긋나는 방식이다).
 *
 * 셸을 고치지 않아도 이게 되는 이유는 2단계에서 미리 치운 덕이다(`app/p/layout.tsx` 헤더):
 * 셸은 `min-h-dvh`로 브라우저 뷰포트를 재지 않고 부모를 채우기만 하며, `<html>`에 걸던
 * 전역 `<style>`은 뷰어 라우트 레이아웃으로 옮겼다. 그래서 프레임에 높이를 주고 넣으면 된다.
 *
 * 안쪽에 스크롤을 따로 주는 이유: 하단 CTA가 `sticky bottom-0`이라 **스크롤 컨테이너가
 * 있어야** 제자리에 선다. 프레임 자체는 `overflow-hidden`으로 모서리를 자른다.
 */
export function PreviewPane({ plan }: { plan: ViewerPlan }) {
  return (
    <div
      data-testid="editor-preview"
      className="h-[720px] max-h-full w-[344px] max-w-full overflow-hidden rounded-sheet border border-default bg-bg shadow-pop"
    >
      <div className="h-full overflow-y-auto">
        <ViewerShell plan={plan} />
      </div>
    </div>
  );
}
