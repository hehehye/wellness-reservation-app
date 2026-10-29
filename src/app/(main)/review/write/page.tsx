import ReviewWriteForm from "@/features/reviews/components/ReviewWriteForm";
import PageHeader from "@/features/shared/ui/PageHeader";
import { notFound } from "next/navigation";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { bookingId } = await searchParams;
  if (!bookingId) notFound(); // 예약 없이 들어온 경우
  return (
    <main>
      <PageHeader title="리뷰남기기" back home />
      <section className="py-24 px-page">
        <ReviewWriteForm bookingId={bookingId} />
      </section>
    </main>
  );
}
