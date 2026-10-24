import { notFound } from "next/navigation";
import type { BookingDetail } from "../types/Book";

export async function createBooking(sessionId: string, accessToken: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ sessionId }),
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? `예약에 실패했어요 (${res.status})`);
  }
  return res.json();
}
export async function getBookingList(
  accessToken: string,
): Promise<BookingDetail[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/bookings`,
    { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" },
  );
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`예약을 불러오지 못했어요 (${res.status})`);
  return res.json();
}
export async function getBooking(
  bookingId: string,
  accessToken: string,
): Promise<BookingDetail> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/bookings/${bookingId}`,
    { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" },
  );
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`예약을 불러오지 못했어요 (${res.status})`);
  return res.json();
}
