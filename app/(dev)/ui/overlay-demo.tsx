"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Dialog } from "@/components/ui/dialog";

export function OverlayDemo() {
  const [sheet, setSheet] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [deleted, setDeleted] = useState(false);
  // 중첩 모달: 시트 안에서 연 다이얼로그. 닫을 때 초점이 배경이 아니라
  // 시트 안 이 트리거로 돌아오는지 검증한다(스펙 §9-7).
  const [nestedDialog, setNestedDialog] = useState(false);

  // 안정된 참조로 둔다 — 매 렌더 새 클로저를 주면 그 클로저를 deps로 삼는 escape
  // 리스너 effect가 열림 상태와 무관하게 재등록돼, 등록 순서(따라서 모달 스택 검증)가
  // 이 렌더링 디테일에 좌우돼 버린다. 실제 소비자(예: 편집기)도 보통 안정된 핸들러를 쓴다.
  const closeSheet = useCallback(() => setSheet(false), []);
  const closeNestedDialog = useCallback(() => setNestedDialog(false), []);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button data-testid="sheet-open" variant="secondary" onClick={() => setSheet(true)}>
        시트 열기
      </Button>
      <Button data-testid="dialog-open" variant="secondary" onClick={() => setDialog(true)}>
        삭제 확인
      </Button>
      <span className="text-caption text-secondary">
        <b data-testid="delete-result">{deleted ? "지웠어요" : "안 지웠어요"}</b>
      </span>

      <BottomSheet open={sheet} onClose={closeSheet} title="흑돼지 명가">
        <p className="mt-1 text-label text-secondary">제주 서귀포시 중앙로 45</p>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" block>주소 복사</Button>
          <Button block>카카오맵으로 길찾기</Button>
        </div>
        <div className="mt-4">
          <Button
            data-testid="nested-dialog-open"
            variant="secondary"
            block
            onClick={() => setNestedDialog(true)}
          >
            이 장소 지우기
          </Button>
        </div>

        {/* 시트의 children 안에 둔다 — DOM상으로도 시트 패널의 자손이어야
            useFocusTrap이 "내 패널 안에서 연 자식 모달"로 인식한다. */}
        <Dialog
          open={nestedDialog}
          onClose={closeNestedDialog}
          onConfirm={closeNestedDialog}
          tone="danger"
          title="이 장소를 지울까요?"
          description="시트 안에서 연 다이얼로그예요. 닫으면 초점이 시트 안 트리거로 돌아와야 해요."
          confirmLabel="지울게요"
          cancelLabel="그대로 둘게요"
          testId="nested-dialog-panel"
        />
      </BottomSheet>

      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        onConfirm={() => { setDeleted(true); setDialog(false); }}
        tone="danger"
        title="이 일정을 지울까요?"
        description="지우면 공유한 링크도 함께 사라져요. 되돌릴 수 없어요."
        confirmLabel="삭제할게요"
        cancelLabel="그대로 둘게요"
      />
    </div>
  );
}
