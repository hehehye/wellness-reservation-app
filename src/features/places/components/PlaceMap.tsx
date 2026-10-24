import { Building2, MapPin, Navigation } from "lucide-react";
import { KakaoMap } from "@/features/shared/ui/KakaoMap";
import { Place } from "../types/Place";
import { MiniMap } from "@/features/shared/ui/MiniMap";
type Props = {
  place: Pick<Place, "name" | "address" | "lat" | "lng">;
};
export default function PlaceMap({ place }: Props) {
  return (
    <section className="mb-20 pt-6 px-page">
      <div className="flex justify-between items-center pt-5 pb-1.5">
        <h3 className="font-bold text-text">장소 정보</h3>
        <a
          href={`https://map.kakao.com/link/to/${encodeURIComponent(place.name)},${place.lat},${place.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-bg"
        >
          <Navigation className="size-3" aria-hidden />
          길찾기
        </a>
      </div>
      {/* 지도 + 정보를 한 카드로 묶어 경계를 통일 */}
      <div className="mt-2 overflow-hidden rounded-card border border-border bg-surface">
        <MiniMap
          lat={place.lat}
          lng={place.lng}
          className="aspect-2/1 w-full"
        />
        <ul className="divide-y divide-line px-4 text-sm">
          <li className="flex items-start gap-3 py-3">
            <Building2
              className="mt-0.5 size-4 shrink-0 text-muted"
              aria-hidden
            />
            <div>
              <p className="font-medium text-text">{place.name}</p>
            </div>
          </li>
          <li className="flex items-start gap-3 py-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
            <p className="flex-1 text-text">{place.address}</p>
            <a
              href={`https://map.kakao.com/link/to/${encodeURIComponent(place.name)},${place.lat},${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-bg"
            >
              <Navigation className="size-3" aria-hidden />
              길찾기
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
