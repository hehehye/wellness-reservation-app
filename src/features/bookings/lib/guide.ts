import type { BookingDetail } from "../types/Book";

export type GuideTone =
  | "none"
  | "info"
  | "soon"
  | "active"
  | "warning"
  | "muted";

export interface BookingGuide {
  tone: GuideTone;
  badge?: string; // D-day 등 보조 표기
  title: string;
  description: string;
  action?: { label: string; href: string };
}

const DAY_MS = 24 * 60 * 60 * 1000;
// 곧 예약일로 안내할 기준 (예약일 기준 남은 일수)
const SOON_DAYS = 1;

// 한국 시간 기준 자정으로 맞춰 날짜 차이(D-day)를 계산
const kstDay = (date: Date) =>
  Date.parse(date.toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" }));

export const getDayDiff = (target: Date, now: Date) =>
  Math.round((kstDay(target) - kstDay(now)) / DAY_MS);

// 예약 상태와 현재 시각을 비교해 상세 페이지 상단 안내 문구를 만든다
export function getBookingGuide(
  booking: Pick<BookingDetail, "id" | "status" | "start_at" | "end_at">,
  now: Date,
  isWritten: boolean,
): BookingGuide {
  const start = new Date(booking.start_at);
  const isWrittenReview = isWritten;
  switch (booking.status) {
    case "pending":
      return {
        tone: "warning",
        title: "결제가 아직 완료되지 않았어요",
        description: "결제 유효시간 안에 결제를 완료해야 예약이 확정돼요.",
        action: { label: "결제 이어하기", href: `/payment/${booking.id}` },
      };
    case "cancelled":
      return {
        tone: "muted",
        title: "취소된 예약이에요",
        description: "다른 일정의 수업을 찾아 다시 예약해 보세요.",
        action: { label: "다른 수업 둘러보기", href: "/place" },
      };
    case "expired":
      return {
        tone: "muted",
        title: "이용하지 않은 예약이에요",
        description: "예약 시간에 방문하지 않아 만료 처리되었어요.",
      };
  }
  if (booking.status === "completed") {
    if (isWrittenReview) {
      return {
        tone: "none",
        title: "후기를 남겨 주셔서 감사해요",
        description: "소중한 후기가 다른 분들에게 도움이 돼요.",
        // action 없음 → 버튼이 안 보여요
      };
    }
    return {
      tone: "none",
      title: "체험은 즐거우셨나요?🧘🏻‍♀️",
      description: "더 나은 경험을 위해 후기를 남겨주세요.",
      action: {
        label: "리뷰 남기기",
        href: `/review/write?bookingId=${booking.id}`,
      },
    };
  }
  if (now >= start) {
    return {
      tone: "active",
      title: "지금 수업이 진행 중이에요",
      description: "즐거운 시간 보내세요!",
    };
  }

  const diff = getDayDiff(start, now);
  const badge = diff === 0 ? "D-DAY" : `D-${diff}`;
  if (diff <= SOON_DAYS) {
    return {
      tone: "soon",
      badge,
      title: diff === 0 ? "오늘이 예약일이에요." : "곧 예약일이에요",
      description: "미리 수업을 준비해주세요. 늦지 않게 도착해 주세요.",
    };
  }
  return {
    tone: "info",
    badge,
    title: "예약이 확정되었어요",
    description: "예약일에 맞춰 방문해 주세요.",
  };
}
