import Link from "next/link";
import {
  AlarmClock,
  CalendarCheck,
  ChevronRight,
  CircleAlert,
  CircleSlash,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/features/shared/lib/cn";
import type { BookingGuide, GuideTone } from "../lib/guide";

const TONE: Record<GuideTone, { icon?: LucideIcon; className: string }> = {
  none: { className: "bg-white border-border" },
  info: { icon: CalendarCheck, className: "bg-surface border-border" },
  soon: { icon: AlarmClock, className: "bg-amber-50 border-amber-200" },
  active: { icon: Sparkles, className: "bg-emerald-50 border-emerald-200" },
  warning: { icon: CircleAlert, className: "bg-danger/5 border-danger/20" },
  muted: { icon: CircleSlash, className: "bg-line/50 border-border" },
};

type Props = { guide: BookingGuide };

// 예약 상세 상단의 상태 안내 카드
export default function BookingStatusGuide({ guide }: Props) {
  const { icon: Icon, className } = TONE[guide.tone];
  return (
    <section
      aria-label="예약 상태 안내"
      className={cn("rounded-card border p-5", className)}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon className="mt-0.5 size-5 shrink-0 text-text" aria-hidden />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-text">{guide.title}</h2>
            {guide.badge && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
                {guide.badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">{guide.description}</p>
        </div>
      </div>
      {guide.action && (
        <Link
          href={guide.action.href}
          className="mt-4 flex h-11 items-center justify-center gap-0.5 rounded-control bg-primary text-sm font-bold text-white transition hover:opacity-90"
        >
          {guide.action.label}
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </section>
  );
}
