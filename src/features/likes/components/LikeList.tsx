import type { Place } from "@/features/places/types/Place";
import LikePlaceCard from "./LikePlaceCard";
import { Heart } from "lucide-react";

interface Props {
  places: Place[];
}

export default function LikeList({ places }: Props) {
  if (places.length === 0) {
    return (
      <div className="py-72 text-center">
        <Heart className="mx-auto mb-1 size-6 text-muted" aria-hidden />
        <p className="text-muted mt-2 font-bold text-sm">
          아직 저장한 장소가 없습니다.
        </p>
        <p className="text-muted mt-1 text-sm">
          자주 가는 장소를 저장하고 둘러보세요.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {places.map((place) => (
        <li key={place.id}>
          <LikePlaceCard place={place} />
        </li>
      ))}
    </ul>
  );
}
