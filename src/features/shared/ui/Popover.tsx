"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/features/shared/lib/cn";

export default function Popover({
  children,
  label = "더보기",
  className,
}: {
  children: ReactNode; // 팝오버 안에 보일 내용
  label?: string; // 버튼 접근성 라벨
  className?: string; // 팝오버 패널에 추가할 클래스
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // 바깥 클릭 시 닫기
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    // Esc로 닫기
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className="flex size-8 items-center justify-center rounded-full text-muted transition hover:bg-primary-soft hover:text-text"
      >
        <MoreVertical className="size-5" aria-hidden />
      </button>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 top-full z-50 mt-1 min-w-32 overflow-hidden rounded-card border border-border bg-white py-1 text-sm text-text shadow-md",
            className,
          )}
          onClick={() => setIsOpen(false)} // 항목을 누르면 닫기
        >
          {children}
        </div>
      )}
    </div>
  );
}
