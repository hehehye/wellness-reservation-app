import PlaceCardSkeleton from "./PlaceCardSkeleton";

interface Props {
  count?: number;
}

export default function PlaceListSkeleton({ count = 6 }: Props) {
  return (
    <ul
      className="grid grid-cols-2 gap-3"
      role="status"
      aria-label="장소 목록을 불러오는 중"
    >
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <PlaceCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
