import { createClient } from "@/app/utils/supabase/server";
import { getBooking } from "@/features/bookings/api/bookings";
import BookingSummaryCard from "@/features/bookings/components/BookingSummaryCard";
import PaymentAmountCard from "@/features/bookings/components/PaymentAmountCard";
import PaymentForm from "@/features/bookings/components/PaymentForm";
import PageHeader from "@/features/shared/ui/PageHeader";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: PageProps<"/payment/[bookingId]">) {
  const { bookingId } = await params;

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect(`/login?next=/payment/${bookingId}`);

  const booking = await getBooking(bookingId, session.access_token);
  console.log(booking);
  return (
    <div className="min-h-dvh bg-stone-50">
      <PageHeader title="결제하기" back />
      <main className="flex flex-col gap-3 px-page pt-17 pb-28">
        <BookingSummaryCard booking={booking} />
        <PaymentAmountCard price={booking.price} />
        <PaymentForm booking={booking} customerKey={session.user.id} />
        <p className="px-1 text-xs leading-relaxed text-muted">
          결제 완료 시 예약이 확정되며, 예약 내역에서 확인할 수 있어요.
        </p>
      </main>
    </div>
  );
}
