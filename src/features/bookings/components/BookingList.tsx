import { CalendarCheck } from "lucide-react";
import type { BookingDetail } from "../types/Book";
import BookingCard from "./BookingCard";

interface Props {
  bookings: BookingDetail[];
}

export default function BookingList({ bookings }: Props) {
  if (bookings.length === 0) {
    return (
      <div className="py-72 text-center">
        <CalendarCheck className="mx-auto mb-1 size-6 text-muted" aria-hidden />
        <p className="text-muted mt-2 font-bold text-sm">
          아직 예약한 수업이 없습니다.
        </p>
        <p className="text-muted mt-1 text-sm">
          마음에 드는 수업을 찾아 예약해 보세요.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {bookings.map((booking) => (
        <li key={booking.id}>
          <BookingCard booking={booking} />
        </li>
      ))}
    </ul>
  );
}
