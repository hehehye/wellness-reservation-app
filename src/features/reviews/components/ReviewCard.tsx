import { Star, User } from "lucide-react";
import type { Review } from "../types/Review";
import Popover from "@/features/shared/ui/Popover";
import { DeleteReviewButton } from "./ReviewManageButtons";

// 별점 → 라벨
const RATING_LABEL: Record<number, string> = {
  5: "최고예요",
  4: "좋아요",
  3: "보통이에요",
  2: "별로예요",
  1: "아쉬워요",
};

// 2026-10-25T06:30:00Z → 2026.10.25 (한국 날짜)
const formatDate = (iso: string) =>
  new Date(iso)
    .toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" })
    .replaceAll("-", ".");

export default function ReviewCard({
  review,
  currentUser,
}: {
  review: Review;
  currentUser?: string;
}) {
  const isMine = currentUser !== null && currentUser === review.user_id;
  return (
    <article className="border-b border-border py-6 first:pt-0">
      {/* 작성자 + 별점 라벨 */}
      <header className="flex items-center gap-2">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft/20 text-muted">
          <User className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-text">{review.users.name}</p>
          <p className="text-xs text-muted">
            <span>작성일</span> {formatDate(review.created_at)}
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-primary-soft/20 px-3 py-1.5 text-xs font-bold text-primary">
          <Star className="size-3.5 fill-current" aria-hidden />
          {RATING_LABEL[review.rating] ?? review.rating}
        </span>
        <Popover>
          {isMine ? (
            <>
              <DeleteReviewButton reviewId={review.id} />
            </>
          ) : (
            <>
              <button
                type="button"
                role="menuitem"
                className="block w-full px-4 py-2 text-left text-danger hover:bg-primary-soft"
              >
                신고하기
              </button>
            </>
          )}
        </Popover>
      </header>

      {/* <div className="mt-4 flex aspect-square w-1/2 items-center justify-center rounded-card bg-primary-soft/20 text-muted">
        <ImageIcon className="size-8" aria-hidden />
      </div> */}

      {/* 본문 */}
      {review.content && (
        <p
          className="pt-6 pb-2 whitespace-pre-line text-sm leading-relaxed 
        font-medium text-sub-text"
        >
          {review.content}
        </p>
      )}
    </article>
  );
}
