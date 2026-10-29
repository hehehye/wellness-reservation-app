import { createClient } from "@/app/utils/supabase/server";
import { fetchReview } from "@/features/reviews/api/reviews";
import ReviewCard from "@/features/reviews/components/ReviewCard";
import { Review } from "@/features/reviews/types/Review";
import PageHeader from "@/features/shared/ui/PageHeader";
import { Star } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const currentUser = session?.user.id;
  const reviews: Review[] = await fetchReview(id);

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  return (
    <div>
      <PageHeader title="후기" back />
      <main className="px-page pt-20 pb-10">
        {/* 요약 */}
        <div className="mb-6 flex items-center gap-2">
          <Star
            className="size-5 fill-yellow-400 text-yellow-400"
            aria-hidden
          />
          <span className="text-lg font-bold text-text">
            {average.toFixed(1)}
          </span>
          <span className="text-sm text-muted">후기 {reviews.length}개</span>
        </div>

        {reviews.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted">
            아직 후기가 없어요
          </p>
        ) : (
          <section aria-label="후기 목록">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUser={currentUser}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
