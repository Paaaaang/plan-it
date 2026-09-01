import { notFound } from "next/navigation";

/**
 * 컴포넌트 갤러리 — 개발 전용.
 * 프리미티브의 모든 변형을 한 화면에 모아 Playwright가 검증한다.
 * 태스크가 진행되면서 섹션이 추가된다.
 */
export default function UiGalleryPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-title-1 font-extrabold">플랜잇 UI 갤러리</h1>
      <p className="mt-2 text-body text-secondary">
        개발 전용 화면이에요. 프리미티브의 모든 상태를 여기에 모아둬요.
      </p>

      <section data-testid="token-probe" className="mt-8">
        <h2 className="text-title-3 font-bold">토큰</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {["bg", "surface", "sunken", "brand", "danger", "success", "warning"].map((n) => (
            <span
              key={n}
              data-testid={`swatch-${n}`}
              className="rounded-xs border border-default px-3 py-2 text-caption"
            >
              {n}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
