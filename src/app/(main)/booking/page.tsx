import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";
import { getBookingList } from "@/features/bookings/api/bookings";
import BookingList from "@/features/bookings/components/BookingList";
import BookingListSkeleton from "@/features/bookings/components/BookingListSkeleton";
import PageHeader from "@/features/shared/ui/PageHeader";

// 데이터 fetch를 Suspense 안쪽 컴포넌트로 분리해야 fallback(스켈레톤)이 스트리밍된다
async function BookingListContent() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const bookings = await getBookingList(session.access_token);
  return <BookingList bookings={bookings} />;
}

export default function Page() {
  return (
    <div>
      <PageHeader title="예약 관리" back />
      <main className="px-page pt-16 pb-24">
        <Suspense fallback={<BookingListSkeleton />}>
          <BookingListContent />
        </Suspense>
      </main>
    </div>
  );
}
