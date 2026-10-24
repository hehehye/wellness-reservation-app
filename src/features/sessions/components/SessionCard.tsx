import { CalendarDays, ChevronRight, Clock, Users } from "lucide-react";
import { SessionItem } from "../types/Session";
import Link from "next/link";
import { dateFormatter, timeFormatter } from "../lib/format";

type Props = { session: SessionItem };

export default function SessionCard({ session }: Props) {
  const start = new Date(session.start_at);
  const end = new Date(session.end_at);
  const { title, price, duration_min } = session.classes;
  return (
    <article className="h-full py-1">
      <Link
        href={`/schedule/${session.id}`}
        className="group flex h-full flex-col rounded-card border border-border bg-surface p-4 shadow-sm
      transition duration-200 ease-out
      hover:-translate-y-0.5 hover:border-primary hover:shadow-md
      active:scale-[0.98]
      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
      motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        {/* 날짜 칩 */}
        <span className="inline-flex w-fit items-center gap-1 rounded-full-soft  py-1 text-xs font-semibold text-primary">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden />
          <time dateTime={session.start_at}>{dateFormatter.format(start)}</time>
        </span>

        {/* 수업명 */}
        <h4 className="mt-3 truncate text-sm font-medium text-muted transition-colors group-hover:text-primary">
          {title}
        </h4>

        {/* 시간 (가장 강조) */}
        <p className="mt-0.5 whitespace-nowrap text-lg font-bold tabular-nums text-text">
          {timeFormatter.format(start)} ~ {timeFormatter.format(end)}
        </p>

        {/* 보조 정보 */}
        <ul className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <li className="flex items-center gap-1">
            <Clock className="size-3.5 shrink-0" aria-hidden />
            {duration_min}분
          </li>
          <li className="flex items-center gap-1">
            <Users className="size-3.5 shrink-0" aria-hidden />
            정원 {session.capacity}명
          </li>
        </ul>

        {/* 하단: 가격 + 이동 */}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between border-t border-line pt-3">
            <span className="font-bold text-text">
              {price.toLocaleString("ko-KR")}원
            </span>
            <span className="flex size-7 items-center justify-center rounded-full text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <ChevronRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
