"use client";

import { useTransition } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { setTheme } from "@/server/actions/theme-actions";
import type { Theme } from "@/server/theme";

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "라이트", Icon: Sun },
  { value: "dark", label: "다크", Icon: Moon },
  { value: "system", label: "시스템", Icon: Monitor },
];

export function ThemeToggle({ current }: { current: Theme }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      role="radiogroup"
      aria-label="화면 테마"
      className="inline-flex gap-0.5 rounded-control bg-neutral-fill p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = current === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            data-testid={`theme-${value}`}
            disabled={pending}
            onClick={() => startTransition(() => setTheme(value))}
            className={[
              "inline-flex items-center gap-1.5 rounded-xs px-3 py-1.5",
              "text-caption font-bold transition-colors duration-fast",
              active
                ? "bg-surface text-primary shadow-card"
                : "text-secondary hover:text-primary",
            ].join(" ")}
          >
            <Icon size={14} strokeWidth={2.2} aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
