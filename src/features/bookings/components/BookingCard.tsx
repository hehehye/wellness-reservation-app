import Link from "next/link";
import { CalendarDays, ChevronRight, Clock, MapPin } from "lucide-react";
import { cn } from "@/features/shared/lib/cn";
import {
  dateFormatter,
  formatPrice,
  timeFormatter,
} from "@/features/sessions/lib/format";
import { BOOKING_STATUS } from "../lib/status";
import type { BookingDetail } from "../types/Book";

interface Props {
  booking: Pick<
    BookingDetail,
    | "id"
    | "status"
    | "place_name"
    | "class_title"
    | "price"
    | "start_at"
    | "end_at"
  >;
}

// 예약 내역용 카드. 상태 뱃지 + 수업 정보 + 일시/가격, 클릭 시 예약 상세로 이동
export default function BookingCard({ booking }: Props) {
  const start = new Date(booking.start_at);
  const end = new Date(booking.end_at);
  const status = BOOKING_STATUS[booking.status];
  const isInactive =
    booking.status === "cancelled" || booking.status === "expired";

  return (
    <Link
      href={`/booking/${booking.id}`}
      className={cn(
        "block rounded-card border border-border bg-surface p-4 transition hover:shadow-md",
        isInactive && "opacity-70",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold",
            status.className,
          )}
        >
          {status.label}
        </span>
        <span
          className={cn(
            "text-sm font-bold text-text",
            isInactive && "text-muted line-through",
          )}
        >
          {formatPrice(booking.price)}
        </span>
      </div>

      <p className="mt-3 flex items-center gap-1 truncate text-sm text-muted">
        <MapPin className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate">{booking.place_name}</span>
      </p>
      <h3 className="mt-0.5 truncate font-bold text-text">
        {booking.class_title}
      </h3>

      <div className="mt-3 flex items-center gap-3 rounded-control bg-bg px-3 py-2 text-sm text-text">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-4 shrink-0 text-muted" aria-hidden />
          <time dateTime={booking.start_at}>{dateFormatter.format(start)}</time>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-4 shrink-0 text-muted" aria-hidden />
          {timeFormatter.format(start)} ~ {timeFormatter.format(end)}
        </span>
      </div>
      {booking.status === "pending" && (
        <p className="mt-3 flex items-center justify-end text-xs font-semibold text-primary">
          결제를 완료해 주세요
          <ChevronRight className="size-4" aria-hidden />
        </p>
      )}
    </Link>
  );
}
