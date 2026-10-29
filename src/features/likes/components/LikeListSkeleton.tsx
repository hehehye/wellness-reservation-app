import LikePlaceCardSkeleton from "./LikePlaceCardSkeleton";

interface Props {
  count?: number;
}

export default function LikeListSkeleton({ count = 5 }: Props) {
  return (
    <ul
      className="flex flex-col gap-3"
      role="status"
      aria-label="찜 목록을 불러오는 중"
    >
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <LikePlaceCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
