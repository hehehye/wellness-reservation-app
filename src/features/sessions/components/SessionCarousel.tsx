"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SessionItem } from "../types/Session";
import SessionCard from "./SessionCard";

type Props = { sessions: SessionItem[] };

export default function SessionCarousel({ sessions }: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

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

  return (
    <div className="relative mt-2">
      <ul
        ref={listRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-page scroll-px-page pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sessions.map((session) => (
          <li key={session.id} className="w-40 shrink-0 snap-start">
            <SessionCard session={session} />
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
      aria-label={isPrev ? "이전 수업 보기" : "다음 수업 보기"}
      className={`absolute top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-md transition hover:bg-bg ${
        isPrev ? "left-2" : "right-2"
      } ${hidden ? "" : "pointer-fine:flex"}`}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
