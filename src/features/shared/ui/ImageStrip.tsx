"use client";

import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
} from "react";
import { cn } from "./cn";
import { POST_LIMITS } from "@/app/utils/constants";
export type PendingImage = {
  id: string;
  blob: Blob; // 게시할 때 Storage에 올릴 원본
  url: string; // 미리보기용 objectURL
  name: string;
};
export type PostDraft = {
  images: PendingImage[];
  title: string;
  content: string;
  categoryId: string | null;
};

type Props = {
  images: PendingImage[];
  onAddFiles: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
};

// 카드 규격(4:5)과 같은 비율의 큰 미리보기
const TILE = "w-40 sm:w-[135px] aspect-4/5 shrink-0 snap-start rounded-xl";

export function ImageStrip({ images, onAddFiles, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const [dragging, setDragging] = useState(false);
  const full = images.length >= POST_LIMITS.maxImages;

  // 좌우 화살표는 넘칠 때만
  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateEdges();
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateEdges, images.length]);

  // 새 사진이 붙으면 끝으로 스크롤
  const prevCount = useRef(images.length);
  useEffect(() => {
    if (images.length > prevCount.current) {
      scrollerRef.current?.scrollTo({
        left: scrollerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
    prevCount.current = images.length;
  }, [images.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    el?.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) onAddFiles(e.dataTransfer.files);
  };

  return (
    <div
      className="relative"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) =>
        !e.currentTarget.contains(e.relatedTarget as Node) && setDragging(false)
      }
      onDrop={onDrop}
    >
      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:-mx-0 sm:scroll-px-0 sm:px-0"
      >
        {/* 추가 버튼 */}
        <button
          type="button"
          disabled={full}
          onClick={() => inputRef.current?.click()}
          aria-label={`사진 추가 (${images.length}/${POST_LIMITS.maxImages})`}
          className={cn(
            TILE,
            "group relative flex flex-col border overflow-hidden bg-primary text-white transition-colors",
            "hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            "disabled:cursor-not-allowed disabled:bg-ink/30",
            dragging && "bg-primary",
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(135deg,#fff_0_1px,transparent_1px_10px)]"
          />
          <span className="pt-6 relative grid flex-1 place-items-center">
            <Plus
              aria-hidden
              size={54}
              strokeWidth={1}
              className="transition-transform duration-300 ease-out group-hover:rotate-90 group-disabled:rotate-0"
            />
          </span>
          <span className="relative flex items-end justify-between px-3 pb-3 font-mono text-[11px] tracking-wider tabular-nums">
            <span>
              <span className="text-[15px] font-semibold">
                {String(images.length).padStart(2, "0")}
              </span>
              <span className="text-white/50">/{POST_LIMITS.maxImages}</span>
            </span>
            <span className="text-white/50">4:5</span>
          </span>
        </button>

        {images.map((img, i) => (
          <figure
            key={img.id}
            className={cn(
              TILE,
              "group relative overflow-hidden bg-workspace ring-1 ring-line",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={`${i + 1}번째 사진`}
              className="size-full object-cover"
              draggable={false}
            />

            <span className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-linear-to-b from-black/45 to-transparent" />
            <span className="absolute top-2.5 left-3 font-mono text-[11px] font-semibold text-white tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            {i === 0 && (
              <span className="absolute bottom-2.5 left-2.5 rounded-md bg-white px-1.5 py-0.5 text-2xs font-bold text-ink">
                대표
              </span>
            )}

            <button
              type="button"
              onClick={() => onRemove(img.id)}
              aria-label={`${i + 1}번째 사진 삭제`}
              className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-white"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </figure>
        ))}
      </div>

      {edges.left && <ArrowButton side="left" onClick={() => scrollBy(-1)} />}
      {edges.right && <ArrowButton side="right" onClick={() => scrollBy(1)} />}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) onAddFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function ArrowButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "이전 사진" : "다음 사진"}
      className={cn(
        "absolute top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-panel text-ink shadow-[0_4px_12px_-2px_rgb(16_24_40/0.18)] transition-colors hover:bg-primary-faint sm:grid",
        side === "left" ? "-left-4" : "-right-4",
      )}
    >
      <Icon size={18} />
    </button>
  );
}
