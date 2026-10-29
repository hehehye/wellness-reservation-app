// 세션 시간은 UTC ISO 문자열이므로 서버 타임존과 무관하게 한국 시간으로 표기
export const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "long",
  day: "numeric",
  weekday: "short",
});

export const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export const formatPrice = (price: number) => `${price.toLocaleString("ko-KR")}원`;
