"use client";
import { Button } from "@/features/shared/ui/Button";
import { toast } from "sonner";
import { cancel } from "../api/transition";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  token: string;
}

export default function CancelButton({ id, token }: Props) {
  const router = useRouter();
  const handleCancel = async () => {
    try {
      if (!confirm("정말 예약을 취소하시겠습니까?")) return;
      await cancel(id, token);
      toast.success("취소가 완료되었습니다.");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "예약 취소에 실패했어요",
      );
    }
  };
  return (
    <Button
      onClick={() => {
        handleCancel();
      }}
      className="w-full"
      variant={"outline"}
    >
      취소하기
    </Button>
  );
}
