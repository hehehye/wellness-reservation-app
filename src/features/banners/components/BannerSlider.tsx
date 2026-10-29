"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/features/shared/lib/cn";
import Image from "next/image";

type Banner = { id: string; title: string; className?: string; image: string };

export default function BannerSlider({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const last = banners.length - 1;

  const move = (diff: number) =>
    setIndex((i) => Math.min(Math.max(i + diff, 0), last));

  return (
    <div className="relative h-54 w-full overflow-hidden">
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={cn(
              "relative flex h-full w-full shrink-0 items-center justify-center",
              banner.className ?? "bg-primary-soft",
            )}
          >
            <Image src={banner.image} alt={`배너 이미지`} fill />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="이전 배너"
        onClick={() => move(-1)}
        disabled={index === 0}
        className="absolute left-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md disabled:opacity-0"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="다음 배너"
        onClick={() => move(1)}
        disabled={index === last}
        className="absolute right-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md disabled:opacity-0"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
