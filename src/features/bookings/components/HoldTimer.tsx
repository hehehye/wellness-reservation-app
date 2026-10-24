"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { cn } from "@/features/shared/lib/cn";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  expiresAt: string;
  onExpire?: () => void;
  sessionId: string;
};

const format = (ms: number) => {
  const sec = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

// 좌석 홀드 만료까지 남은 시간. 서버/클라이언트 시각 차이로 인한 hydration 불일치를 피하려고 마운트 후 계산
export default function HoldTimer({ expiresAt, onExpire, sessionId }: Props) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const router = useRouter();
  useEffect(() => {
    const target = new Date(expiresAt).getTime();
    const tick = () => {
      const left = target - Date.now();
      setRemaining(left);
      if (left <= 0) {
        clearInterval(id);
        onExpire?.();
      }
    };
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [expiresAt, onExpire]);

  const expired = remaining !== null && remaining <= 0;
  const urgent = remaining !== null && remaining < 60_000;
  useEffect(() => {
    if (expired) {
      toast.error("결제 시간이 만료됐어요. 다시 예약해 주세요.");
      router.replace(`/schedule/${sessionId}`);
    }
  }, [expired, router, sessionId]);
  return (
    <div
      role="timer"
      aria-live="off"
      className={cn(
        "flex items-center justify-between rounded-control px-4 py-3 text-sm",
        expired || urgent
          ? "bg-danger/10 text-danger"
          : "bg-primary-soft/40 text-text",
      )}
    >
      <span className="flex items-center gap-1.5">
        <Timer className="size-4 shrink-0" aria-hidden />
        {expired ? "예약 유효시간이 만료되었어요" : "남은 결제 시간"}
      </span>
      {!expired && (
        <span className="font-bold tabular-nums">
          {remaining === null ? "--:--" : format(remaining)}
        </span>
      )}
    </div>
  );
}
