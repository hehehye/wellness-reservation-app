"use client";

import { useEffect, useState } from "react";
import { BackButton, ExitButton } from "@/features/shared/ui/ExitButton";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/features/shared/lib/cn";

interface Props {
  title: string;
  exit?: boolean;
  back?: boolean;
  home?: boolean;
}

const THRESHOLD = 50; // 이만큼 내려가면 흰 배경으로 전환

export default function PlaceHeader({ title, exit, back, home }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > THRESHOLD);
    onScroll(); // 새로고침했을 때 이미 내려가 있는 경우 대비
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const circle = cn(
    "flex size-9 items-center justify-center rounded-full transition-colors duration-300 motion-reduce:transition-none",
    scrolled ? "bg-transparent" : "bg-black/40",
  );
  return (
    <header
      className={cn(
        "fixed top-0 z-99 w-full sm:max-w-[517px] transition-colors duration-300 motion-reduce:transition-none",
        scrolled ? "bg-white" : "bg-transparent",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between border-b px-2 py-3 transition-colors duration-300 motion-reduce:transition-none",
          scrolled ? "border-gray-200" : "border-transparent",
        )}
      >
        <div className="flex-1">
          {exit && <ExitButton />}
          {back && (
            <div className={circle}>
              <BackButton color={scrolled ? "black" : "white"} />
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1
            className={cn(
              "truncate text-center font-bold transition-opacity duration-300 motion-reduce:transition-none",
              scrolled ? "opacity-100" : "opacity-0",
            )}
          >
            {title}
          </h1>
        </div>

        <div className="flex flex-1 justify-end">
          {home && (
            <Link href="/" className={circle}>
              <HomeIcon
                size={20}
                className={scrolled ? "text-black" : "text-white"}
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
