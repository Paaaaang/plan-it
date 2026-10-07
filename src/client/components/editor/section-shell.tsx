/**
 * 편집기 섹션 껍데기 — 번호 뱃지 + 제목 + 우측 카운트.
 * 시안: `1 기본 정보` / `2 공지  3개` / `3 타임테이블  1일차 · 4개`.
 *
 * children이 선택인 이유: 각 섹션의 알맹이는 뒤 태스크가 채운다. 지금 자리만 잡는 화면에
 * "곧 채워집니다" 같은 가짜 문구를 넣지 않으려고 비워 둘 수 있게 했다.
 */
export function SectionShell({
  number,
  title,
  count,
  children,
}: {
  number: number;
  title: string;
  count?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="rounded-card bg-surface shadow-card">
      <header className="flex items-center gap-2.5 px-4 py-3.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-xs bg-brand-weak text-caption font-extrabold text-on-brand-weak">
          {number}
        </span>
        <h2 className="text-item-title font-bold tracking-tight">{title}</h2>
        {count && <span className="ml-auto text-caption font-semibold text-tertiary">{count}</span>}
      </header>
      {children && <div className="px-4 pb-4">{children}</div>}
    </section>
  );
}
