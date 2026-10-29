import { CalendarDays, Clock, MapPin } from "lucide-react";
import { dateFormatter, timeFormatter } from "@/features/sessions/lib/format";
import type { BookingDetail } from "../types/Book";
import Link from "next/link";

type Props = { booking: BookingDetail };

export default function BookingSummaryCard({ booking }: Props) {
  const start = new Date(booking.start_at);
  const end = new Date(booking.end_at);
  const durationMin = Math.round((end.getTime() - start.getTime()) / 60000);
  console.log(booking);
  return (
    <section className="rounded-card border border-border bg-surface p-5">
      <h2 className="text-xs font-medium text-muted">예약 정보</h2>
      <p className="mt-2 flex items-center gap-1 text-sm text-muted hover:text-gray-700">
        <MapPin className="size-4 shrink-0" aria-hidden />
        <Link href={`/place/${booking.class_sessions.classes.place_id}`}>
          <span className="truncate">{booking.place_name}</span>
        </Link>
      </p>
      <h3 className="mt-1 text-lg font-bold text-text">
        {booking.class_title}
      </h3>

      <ul className="mt-4 space-y-2 rounded-control bg-bg px-4 py-3 text-sm text-text">
        <li className="flex items-center gap-2 font-medium">
          <CalendarDays className="size-4 shrink-0 text-muted" aria-hidden />
          <time dateTime={booking.start_at}>{dateFormatter.format(start)}</time>
        </li>
        <li className="flex items-center gap-2">
          <Clock className="size-4 shrink-0 text-muted" aria-hidden />
          <span className="font-medium">
            {timeFormatter.format(start)} ~ {timeFormatter.format(end)}
            <span className="ml-1 text-muted font-medium">
              ({durationMin}분)
            </span>
          </span>
        </li>
      </ul>
    </section>
  );
}
