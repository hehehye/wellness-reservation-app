"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/features/shared/lib/cn";

type Props = {
  title: string;
  // 제목 오른쪽 영역 (ex: 전체보기 링크, 비우기 버튼)
  action?: ReactNode;
  // 각 child가 리스트 아이템 하나로 렌더링된다
  children: ReactNode;
  className?: string;
};

// 드래그로 판정할 최소 이동 거리(px). 이보다 적게 움직이면 클릭으로 본다
const DRAG_THRESHOLD = 5;

export default function RecommendSection({
  title,
  action,
  children,
  className,
}: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 });

  // 스크롤 위치/컨테이너 크기가 바뀔 때마다 양끝 도달 여부 갱신
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const update = () => {
      setCanPrev(list.scrollLeft > 1);
      setCanNext(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
    };
    update();

    list.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => {
      list.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const scroll = (direction: -1 | 1) => {
    const list = listRef.current;
    if (!list) return;
    // 한 화면의 80%만큼 이동, 이후 snap-start가 카드 경계에 맞춰준다
    list.scrollBy({
      left: direction * list.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  // 터치는 브라우저 기본 스와이프를 쓰고, 마우스만 직접 드래그 스크롤 처리
  const onPointerDown = (e: PointerEvent<HTMLUListElement>) => {
    const list = listRef.current;
    if (!list || e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startLeft: list.scrollLeft,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    const list = listRef.current;
    const state = drag.current;
    if (!list || !state.active) return;

    const dx = e.clientX - state.startX;
    if (!state.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      state.moved = true;
      // 드래그 중에는 snap이 스크롤을 붙잡지 않도록 해제
      setIsDragging(true);
      list.setPointerCapture(e.pointerId);
    }
    list.scrollLeft = state.startLeft - dx;
  };

  const endDrag = (e: PointerEvent<HTMLUListElement>) => {
    const list = listRef.current;
    const state = drag.current;
    if (!state.active) return;
    state.active = false;
    if (!state.moved) return;

    if (list?.hasPointerCapture(e.pointerId)) {
      list.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  // 드래그가 끝나며 발생하는 클릭은 카드 링크 이동으로 이어지지 않도록 막는다
  const onClickCapture = (e: MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <section className={cn("pt-6", className)}>
      <div className="flex items-center justify-between px-page pb-1.5">
        <h3 className="font-bold text-text">{title}</h3>
        {action}
      </div>

      <div className="relative mt-2">
        <ul
          ref={listRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()}
          className={cn(
            "flex gap-3 overflow-x-auto px-page scroll-px-page pb-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            isDragging ? "cursor-grabbing" : "snap-x snap-mandatory",
          )}
        >
          {Children.map(children, (child) => (
            <li className="w-[calc((100%-2.25rem)/3)] shrink-0 snap-start">
              {child}
            </li>
          ))}
        </ul>

        {/* 터치 기기는 스와이프로 충분하므로 마우스 환경에서만 버튼 노출 */}
        <ArrowButton
          direction="prev"
          hidden={!canPrev}
          onClick={() => scroll(-1)}
        />
        <ArrowButton
          direction="next"
          hidden={!canNext}
          onClick={() => scroll(1)}
        />
      </div>
    </section>
  );
}

function ArrowButton({
  direction,
  hidden,
  onClick,
}: {
  direction: "prev" | "next";
  hidden: boolean;
  onClick: () => void;
}) {
  const isPrev = direction === "prev";
  const Icon = isPrev ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "이전 항목 보기" : "다음 항목 보기"}
      className={cn(
        "absolute top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-md transition hover:bg-bg",
        isPrev ? "left-2" : "right-2",
        !hidden && "pointer-fine:flex",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
