"use client";
import { toast } from "sonner";
import { deleteReview } from "../api/reviews";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";
import { revalidateReviews } from "../lib/revalidateReviews";

export function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const handleDeleteReview = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session)
      return { error: "로그인이 필요하거나 본인의 게시글이 아닙니다." };
    try {
      if (!confirm("정말 리뷰를 삭제 하시겠습니까?")) return;
      await deleteReview(reviewId, session?.access_token);
      await revalidateReviews();
      toast.success("리뷰 삭제에 성공했습니다.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "리뷰 삭제에 실패했어요.",
      );
    }
  };
  return (
    <button
      onClick={() => {
        handleDeleteReview();
      }}
      type="button"
      role="menuitem"
      className="block w-full px-4 py-2 text-left text-danger hover:bg-primary-soft"
    >
      삭제하기
    </button>
  );
}
