export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "expired";
// pending - 결제완료 되지않은 상태. , confirmed - 구매완료(이용가능상태), completed - 이용완료
// cancelled - 취소됨(취소기간내에 취소완료 또는 사장권한으로 취소), expired - 만료됨(=노쇼. 환불처리X)

// 예약타입
export interface Booking {
  id: string;
  userId: string; // 예약한 유저
  sessionId: string;
  status: BookingStatus;
  holdExpiresAt: Date | null;
}

// GET /bookings/:id 응답 (API 원본 snake_case)
interface PlaceId {
  place_id: string;
}
interface Classes {
  classes: PlaceId;
}
export interface BookingDetail {
  id: string;
  user_id: string;
  session_id: string;
  status: BookingStatus;
  place_name: string;
  class_title: string;
  price: number;
  start_at: string;
  end_at: string;
  hold_expires_at: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  class_sessions: Classes;
}
