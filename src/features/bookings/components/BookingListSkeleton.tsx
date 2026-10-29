import BookingCardSkeleton from "./BookingCardSkeleton";

interface Props {
  count?: number;
}

export default function BookingListSkeleton({ count = 4 }: Props) {
  return (
    <ul
      className="flex flex-col gap-3"
      role="status"
      aria-label="예약 내역을 불러오는 중"
    >
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <BookingCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
