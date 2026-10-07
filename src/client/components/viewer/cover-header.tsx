/**
 * @file 뷰어 커버 헤더
 * @description 사진 또는 코랄 그라데이션 위에 브랜드 칩·뱃지·제목·서브라인을 얹는
 *              공개 뷰어 최상단 커버. 스펙 §7.3.
 *
 * @connects
 *  - src/shared/viewer/summary.ts  → periodLabel, coverSubline
 *  - src/shared/types/viewer.ts        → ViewerPlan
 */

import Image from "next/image";
import { coverSubline, periodLabel } from "@/shared/viewer/summary";
import type { ViewerPlan } from "@/shared/types/viewer";

export function CoverHeader({ plan }: { plan: ViewerPlan }) {
  const hasPhoto = !!plan.coverImageUrl;

  return (
    <header
      className="relative h-[180px] overflow-hidden"
      // 커버는 항상 어둡다(사진 또는 코랄 그라데이션 위 스크림) — 뷰어 테마와 무관.
      // 이 그라데이션 값은 토큰에 없고 이 파일 단 한 곳에서만 쓰므로 인라인으로 둔다.
      style={
        hasPhoto
          ? undefined
          : { background: "linear-gradient(155deg, var(--coral-600), var(--coral-500) 55%, var(--coral-300))" }
      }
      data-testid="cover"
      data-cover={hasPhoto ? "photo" : "fallback"}
    >
      {hasPhoto && (
        <Image
          src={plan.coverImageUrl!}
          alt=""
          fill
          priority
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />
      )}
      {hasPhoto && (
        // 사진 위 스크림. 값은 토큰에 없다 — 커버 한 곳에서만 쓰는 고정값이라 인라인.
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,10,16,.52) 0%, rgba(8,10,16,.12) 38%, rgba(8,10,16,.78) 100%)",
          }}
        />
      )}

      {/* 흰 글자·반투명 흰 배경은 커버 전용 예외다. 스크림 위에서만 쓰고
          다른 화면으로 복사하지 않는다 — 뷰어 테마(라이트/다크)와 무관하게
          커버는 항상 어둡기 때문. */}
      <span className="absolute left-5 top-3.5 rounded-full bg-black/40 px-2.5 py-[5px] text-micro font-bold text-white">
        플랜잇으로 공유된 일정
      </span>

      <div className="absolute inset-x-0 bottom-0 px-5 pb-4 text-white">
        <div className="mb-[7px] flex gap-1.5">
          <span className="rounded-full bg-black/40 px-2.5 py-[3px] text-micro font-bold">{plan.planType}</span>
          <span className="rounded-full bg-black/40 px-2.5 py-[3px] text-micro font-bold">
            {periodLabel(plan.startDate, plan.endDate)}
          </span>
        </div>
        <h1 className="text-title-1 font-extrabold tracking-tight" style={{ textShadow: "0 1px 12px rgba(0,0,0,.34)" }}>
          {plan.title}
        </h1>
        <p className="mt-1 text-caption font-medium opacity-95">
          {coverSubline(plan.startDate, plan.endDate, plan.partyLabel)}
        </p>
      </div>
    </header>
  );
}
