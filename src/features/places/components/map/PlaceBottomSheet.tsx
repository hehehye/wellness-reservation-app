import LikePlaceCard from "@/features/likes/components/LikePlaceCard";
import { getPlaces } from "../../api/getPlaces";

export default async function PlaceBottomSheet() {
  const places = await getPlaces();
  return (
    <div className="z-99 w-full bg-white fixed bottom-0 ">
      <div className="px-page bg-white pt-4 pb-12 min-h-[20vh] max-h-[40vh] w-full ">
        <h2>장소</h2>
        <div className="max-w-[520px] overflow-hidden">
          {places.map((place) => (
            <div key={place.id}>
              <ul className="flex flex-col gap-3">
                {places.map((place) => (
                  <li key={place.id}>
                    <LikePlaceCard place={place} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
