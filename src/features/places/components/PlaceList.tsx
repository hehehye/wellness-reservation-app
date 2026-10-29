import type { Place } from "@/features/places/types/Place";
import PlaceCard from "./PlaceCard";

interface Props {
  places: Place[];
}

export default function PlaceList({ places }: Props) {
  if (places.length === 0) {
    return <p className="py-10 text-center text-muted">등록된 장소가 없습니다.</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-3">
      {places.map((place) => (
        <li key={place.id}>
          <PlaceCard place={place} />
        </li>
      ))}
    </ul>
  );
}
