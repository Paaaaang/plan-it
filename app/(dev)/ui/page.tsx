import { notFound } from "next/navigation";
import { getTheme } from "@/lib/theme";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ButtonDemo } from "./button-demo";
import { FormDemo } from "./form-demo";
import { DisplayDemo } from "./display-demo";
import { NavDemo } from "./nav-demo";

/**
 * 컴포넌트 갤러리 — 개발 전용.
 * 프리미티브의 모든 변형을 한 화면에 모아 Playwright가 검증한다.
 * 태스크가 진행되면서 섹션이 추가된다.
 */
export default async function UiGalleryPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const theme = await getTheme();

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-title-1 font-extrabold">플랜잇 UI 갤러리</h1>
      <p className="mt-2 text-body text-secondary">
        개발 전용 화면이에요. 프리미티브의 모든 상태를 여기에 모아둬요.
      </p>
      <div className="mt-4">
        <ThemeToggle current={theme} />
      </div>

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

      <section className="mt-10">
        <h2 className="text-title-3 font-bold">Button</h2>
        <p className="mt-1 text-caption text-secondary">
          primary는 화면당 하나만 써요. 나머지 액션은 secondary나 ghost로 눌러요.
        </p>
        <div className="mt-4"><ButtonDemo /></div>
      </section>

      <section className="mt-10">
        <h2 className="text-title-3 font-bold">TextField · DateField</h2>
        <p className="mt-1 text-caption text-secondary">
          오류는 색만으로 말하지 않아요. aria-invalid와 문구를 함께 내요.
        </p>
        <div className="mt-4"><FormDemo /></div>
      </section>

      <section className="mt-10">
        <h2 className="text-title-3 font-bold">Card · Badge · Chip</h2>
        <div className="mt-4"><DisplayDemo /></div>
      </section>

      <section className="mt-10">
        <h2 className="text-title-3 font-bold">Tabs · SegmentedControl</h2>
        <p className="mt-1 text-caption text-secondary">
          화면 전환은 Tabs, 상태 전환은 SegmentedControl을 써요.
        </p>
        <div className="mt-4"><NavDemo /></div>
      </section>
    </main>
  );
}
