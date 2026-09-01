"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CircleAlert } from "lucide-react";

/**
 * Toast — 짧은 확인 메시지.
 * 오류 톤은 색만으로 말하지 않는다: 아이콘을 함께 낸다.
 * 4초 뒤 스스로 사라진다.
 */
type Tone = "neutral" | "danger";
type Item = { id: number; message: string; tone: Tone };

const ToastCtx = createContext<{ show: (message: string, tone?: Tone) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast는 ToastProvider 안에서만 쓸 수 있어요");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const active = timers.current;
    return () => {
      active.forEach((timer) => clearTimeout(timer));
      active.clear();
    };
  }, []);

  const show = useCallback((message: string, tone: Tone = "neutral") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, tone }]);
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
    timers.current.add(timer);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={[
              "pointer-events-auto flex items-center gap-2 rounded-[14px] px-4 py-3",
              "text-label font-semibold shadow-pop",
              t.tone === "danger" ? "bg-danger text-white" : "bg-raised text-primary",
            ].join(" ")}
            style={{ animation: "planit-toast-in var(--dur-base) var(--ease-out)" }}
          >
            {t.tone === "danger" && <CircleAlert size={17} strokeWidth={2.2} aria-hidden />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
