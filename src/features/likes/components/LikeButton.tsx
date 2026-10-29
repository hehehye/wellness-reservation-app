"use client";
import { Button } from "@/features/shared/ui/Button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/app/utils/supabase/client";
import { toggleLike } from "../api/like";

interface Props {
  placeId: string;
  initialWish: boolean;
  likeCount: number;
}
export default function LikeButton({ placeId, initialWish }: Props) {
  const [liked, setLiked] = useState(initialWish ?? false);
  const [pending, setPending] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const handleLike = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      toast.error("로그인이 필요합니다");
      return;
    }
    if (pending) return; // 연타 방지
    setPending(true);

    const next = !liked;
    setLiked(next); // 낙관적 업데이트: 먼저 화면부터 바꿈

    try {
      await toggleLike(placeId, session.access_token, next);
      toast(next ? "좋아요를 눌렀습니다" : "좋아요를 취소했습니다");
      router.refresh();
    } catch {
      setLiked(!next); // 실패하면 원래대로 되돌림
      toast.error("처리에 실패했어요. 잠시 후 다시 시도해 주세요");
    } finally {
      setPending(false);
    }
  };
  return (
    <Button
      onClick={() => {
        handleLike();
      }}
      variant={"ghost"}
    >
      {liked ? (
        <Heart fill="red" className="text-red-500" size={26} />
      ) : (
        <Heart />
      )}
    </Button>
  );
}
