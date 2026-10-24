import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";
import { getBooking } from "@/features/bookings/api/bookings";
import BookingInfoSection from "@/features/bookings/components/BookingInfoSection";
import BookingStatusGuide from "@/features/bookings/components/BookingStatusGuide";
import BookingSummaryCard from "@/features/bookings/components/BookingSummaryCard";
import { dateTimeFormatter } from "@/features/bookings/lib/format";
import { getBookingGuide } from "@/features/bookings/lib/guide";
import { BOOKING_STATUS } from "@/features/bookings/lib/status";
import { formatPrice } from "@/features/sessions/lib/format";
import { cn } from "@/features/shared/lib/cn";
import PageHeader from "@/features/shared/ui/PageHeader";
import { Button } from "@/features/shared/ui/Button";
import CancelButton from "@/features/bookings/components/CancelButton";
import Link from "next/link";

interface Props {
  id: string;
  token: string;
  bookingId: string;
}
const formatDateTime = (value: string | null) =>
  value ? dateTimeFormatter.format(new Date(value)) : "-";

export function SubBar({ id, token, bookingId }: Props) {
  return (
    <div className="flex gap-2">
      <Button className="w-full" variant={"primary"}>
        <Link href={`/place/${bookingId}`}>장소보기</Link>
      </Button>
      <CancelButton id={id} token={token} />
    </div>
  );
}
export default async function Page({ params }: PageProps<"/booking/[id]">) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect(`/login?next=/booking/${id}`);

  const booking = await getBooking(id, session.access_token);
  const guide = getBookingGuide(booking, new Date());
  const status = BOOKING_STATUS[booking.status];
  const isPaid =
    booking.status === "confirmed" || booking.status === "completed";
  return (
    <div className="min-h-dvh bg-stone-50">
      <PageHeader title="예약 상세" back home />
      <main className="flex flex-col gap-3 px-page pt-17 pb-28">
        <BookingStatusGuide guide={guide} />
        <BookingSummaryCard booking={booking} />
        {booking.status === "confirmed" && (
          <SubBar
            id={id}
            token={session.access_token}
            bookingId={booking.class_sessions.classes.place_id}
          />
        )}
        <BookingInfoSection
          title="결제 정보"
          rows={[
            {
              label: "결제 금액",
              value: (
                <span
                  className={cn(
                    "font-bold",
                    !isPaid &&
                      booking.status !== "pending" &&
                      "line-through text-muted",
                  )}
                >
                  {formatPrice(booking.price)}
                </span>
              ),
            },
            {
              label: "결제 수단",
              value: <span>토스</span>,
            },
            {
              label: "결제 상태",
              value: isPaid
                ? "결제 완료"
                : booking.status === "pending"
                  ? "결제 대기"
                  : "-",
            },
            { label: "결제 일시", value: formatDateTime(booking.confirmed_at) },
          ]}
        />
        <BookingInfoSection
          title="예약 정보"
          rows={[
            {
              label: "예약 상태",
              value: (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    status.className,
                  )}
                >
                  {status.label}
                </span>
              ),
            },
            { label: "예약 번호", value: booking.id },
            { label: "예약 일시", value: formatDateTime(booking.created_at) },
            ...(booking.status === "pending"
              ? [
                  {
                    label: "결제 기한",
                    value: formatDateTime(booking.hold_expires_at),
                  },
                ]
              : []),
            ...(booking.cancelled_at
              ? [
                  {
                    label: "취소 일시",
                    value: formatDateTime(booking.cancelled_at),
                  },
                ]
              : []),
          ]}
        />

        <p className="px-1 text-xs leading-relaxed text-muted">
          예약 취소 및 환불은 수업별 취소 규정에 따라 처리돼요.
        </p>
      </main>
    </div>
  );
}
