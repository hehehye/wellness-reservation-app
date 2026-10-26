"use client";

import BottomFixedBar from "@/features/shared/ui/BottomFixedBar";
import { formatPrice } from "../lib/format";
import { Button } from "@/features/shared/ui/Button";
import { ClassInfo } from "../types/Session";
import { createClient } from "@/app/utils/supabase/client";
import { createBooking } from "@/features/bookings/api/bookings";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  classes: ClassInfo;
  bookingOpen: boolean;
  sessionId: string;
  placeName: string;
  soldOut: boolean;
}

export default function PaymentBar({
  classes,
  bookingOpen,
  sessionId,
  soldOut,
}: Props) {
  const router = useRouter();
  const supabase = createClient();
  async function handleReserve() {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return router.push("/login");

      const booking = await createBooking(sessionId, token);
      router.push(`/payment/${booking.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "예약에 실패했어요");
    }
  }
  const label = !bookingOpen ? "예약 오픈 전" : soldOut ? "마감" : "예약하기";
  const disabled = !bookingOpen || soldOut;
  return (
    <BottomFixedBar>
      <div className="flex w-full items-center gap-3 px-page">
        <div className="shrink-0">
          <p className="text-xs text-muted">결제 금액</p>
          <p className="font-bold text-text">{formatPrice(classes.price)}</p>
        </div>
        <Button
          onClick={() => {
            handleReserve();
          }}
          className="flex-1"
          disabled={disabled}
        >
          {label}
        </Button>
      </div>
    </BottomFixedBar>
  );
}
