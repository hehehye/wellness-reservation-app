import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  MapPin,
  TimerReset,
  Users,
} from "lucide-react";
import { getSessionsDetail } from "@/features/sessions/api/sessions";
import {
  dateFormatter,
  formatPrice,
  timeFormatter,
} from "@/features/sessions/lib/format";
import PageHeader from "@/features/shared/ui/PageHeader";
import PaymentBar from "@/features/sessions/components/PaymentBar";
import { cn } from "@/features/shared/lib/cn";
import PlaceMap from "@/features/places/components/PlaceMap";

// 고정 안내 문구 (추후 장소/수업별 데이터로 대체 가능)
const NOTICES = [
  "수업 시작 10분 전까지 도착해 주세요.",
  "편한 운동복을 착용해 주세요. 개인 수건과 물을 지참하시면 좋아요.",
  "지각 시 다른 회원을 위해 입장이 제한될 수 있습니다.",
];

// 요청 시점 기준으로 예약 오픈 여부 판단 (no-store 페이지라 매 요청마다 재계산됨)
function isBookingOpen(opensAt: Date) {
  return Date.now() >= opensAt.getTime();
}

function SeatStatus({
  remaining,
  capacity,
}: {
  remaining: number;
  capacity: number;
}) {
  const soldOut = remaining <= 0;
  const almost = !soldOut && remaining <= 3;

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs font-bold",
          soldOut && "bg-gray-100 text-muted",
          almost && "bg-red-50 text-red-600",
          !soldOut && !almost && "bg-primary-soft text-primary",
        )}
      >
        {soldOut
          ? "마감"
          : almost
            ? `${remaining}자리 남음`
            : `${remaining}자리 여유`}
      </span>
      <span className="text-xs text-muted">정원 {capacity}명</span>
    </span>
  );
}
export default async function Page({ params }: PageProps<"/schedule/[id]">) {
  const { id } = await params;
  const sessionItem = await getSessionsDetail(id);
  const { classes } = sessionItem;
  const place = classes.places;

  const start = new Date(sessionItem.start_at);
  const end = new Date(sessionItem.end_at);
  const opensAt = new Date(sessionItem.booking_opens_at);
  const bookingOpen = isBookingOpen(opensAt);
  const scheduleRows = [
    {
      icon: CalendarDays,
      label: "날짜",
      value: (
        <time dateTime={sessionItem.start_at}>
          {dateFormatter.format(start)}
        </time>
      ),
    },
    {
      icon: Clock,
      label: "시간",
      value: `${timeFormatter.format(start)} ~ ${timeFormatter.format(end)} (${classes.duration_min}분)`,
    },
    {
      icon: Users,
      label: "잔여석",
      value: (
        <SeatStatus
          remaining={sessionItem.remaining}
          capacity={sessionItem.capacity}
        />
      ),
    },
    {
      icon: TimerReset,
      label: "예약 오픈",
      value: `${dateFormatter.format(opensAt)} ${timeFormatter.format(opensAt)}`,
    },
  ];
  return (
    <div>
      <PageHeader title="수업 상세정보" back />
      <main className="pt-14 pb-24">
        {/* 수업 정보 (classes) */}
        <section className="px-page pt-5">
          <Link
            href={`/place/${place.id}`}
            className="inline-flex items-center text-sm font-medium text-primary"
          >
            {place.name}
            <ChevronRight className="size-4" aria-hidden />
          </Link>
          <h2 className="mt-1 text-xl font-bold text-text">{classes.title}</h2>
          <p className="mt-2 text-lg font-bold text-text">
            {formatPrice(classes.price)}
            <span className="ml-1 text-sm font-normal text-muted">/ 1회</span>
          </p>
        </section>

        {/* 현재 세션 일정 */}
        <section className="px-page pt-6">
          <h3 className="font-bold text-text">수업 일정</h3>
          <dl className="mt-2 divide-y divide-line rounded-card border border-border bg-surface px-4">
            {scheduleRows.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 py-3 text-sm">
                <Icon className="size-4 shrink-0 text-muted" aria-hidden />
                <dt className="w-16 shrink-0 text-muted">{label}</dt>
                <dd className="font-medium text-text">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 장소 */}
        <section className="px-page pt-6">
          <h3 className="font-bold text-text">장소</h3>
          <div className="mt-2 flex items-start gap-3 rounded-card border border-border bg-surface p-4 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
            <div>
              <p className="font-medium text-text">{place.name}</p>
              <p className="mt-0.5 text-muted">{place.address}</p>
            </div>
          </div>
        </section>

        {/* 안내사항 */}
        <section className="px-page pt-6">
          <h3 className="font-bold text-text">안내사항</h3>
          <ul className="mt-2 list-disc space-y-1 rounded-card bg-primary-soft/40 py-4 pr-4 pl-8 text-sm text-text">
            {NOTICES.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </section>
        <PlaceMap place={place} />
      </main>

      <PaymentBar
        classes={classes}
        bookingOpen={bookingOpen}
        sessionId={id}
        placeName={place.name}
      />
    </div>
  );
}
