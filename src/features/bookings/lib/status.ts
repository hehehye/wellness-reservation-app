import type { BookingStatus } from "../types/Book";

// 예약 상태별 뱃지 라벨/스타일
export const BOOKING_STATUS: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  pending: { label: "결제 대기", className: "bg-amber-50 text-amber-700" },
  confirmed: { label: "예약 확정", className: "bg-primary text-white" },
  completed: { label: "이용 완료", className: "bg-line text-muted" },
  cancelled: { label: "취소됨", className: "bg-red-50 text-danger" },
  expired: { label: "기간 만료", className: "bg-line text-muted" },
};
