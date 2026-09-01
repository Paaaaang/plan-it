/**
 * Loader — 인라인과 전체 화면 두 가지.
 * 항상 role="status"와 접근 가능한 이름을 함께 준다.
 */
export function Loader({
  size = 20,
  label = "불러오는 중이에요",
  className = "",
  ...rest
}: { size?: number; label?: string; className?: string } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...rest}
      role="status"
      aria-label={label}
      className={["inline-flex", className].filter(Boolean).join(" ")}
    >
      <span
        aria-hidden="true"
        className="block rounded-full border-2 border-default border-t-brand"
        style={{
          width: size,
          height: size,
          animation: "planit-spin 700ms linear infinite",
        }}
      />
    </span>
  );
}

export function LoaderScreen({ label = "불러오는 중이에요" }: { label?: string }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3">
      <Loader size={28} label={label} />
      <p className="text-caption text-tertiary">{label}</p>
    </div>
  );
}
