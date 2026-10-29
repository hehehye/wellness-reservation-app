"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createReview } from "../api/reviews";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export type State = { error?: string; success?: string } | undefined;

export async function ReviewActions(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const content = String(formData.get("content") ?? "").trim();
  const rating = Number(formData.get("rating"));
  const bookingId = String(formData.get("bookingId") ?? "");
  const placeId = String(formData.get("placeId") ?? ""); // revalidate용

  // 1. 검증
  if (content.length < 1) return { error: "내용을 입력하세요" };
  if (content.length > 200) return { error: "200자 이하로 입력하세요" };
  if (!(rating >= 1 && rating <= 5)) return { error: "별점을 선택하세요" };
  if (!bookingId) return { error: "예약 정보가 없어요" };

  // 2. 로그인 토큰 꺼내기 (Nest AuthGuard용)
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { error: "로그인이 필요해요" };

  // 3. Nest API 호출
  try {
    await createReview({ bookingId, rating, content }, session.access_token);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "저장에 실패했어요" };
  }

  revalidateTag("reviews", "max");
  return { success: "리뷰가 등록됐어요!" };
}
