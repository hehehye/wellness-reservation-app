import Link from "next/link";
import { ImageIcon, MapPin } from "lucide-react";
import type { Place } from "@/features/places/types/Place";
import LikeButton from "./LikeButton";
import Image from "next/image";

interface Props {
  place: Pick<Place, "id" | "name" | "category" | "address" | "imageUrl">;
}

// PlaceCard(그리드형)보다 작은 가로형 카드. 썸네일 + 정보 + 찜 버튼
export default function LikePlaceCard({ place }: Props) {
  return (
    <div className="relative flex items-center gap-3 rounded-card border border-border bg-surface p-3 transition hover:shadow-md">
      <Link
        href={`/place/${place.id}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <div className="relative flex size-20 shrink-0 items-center justify-center rounded-control bg-primary-soft text-muted">
          {place.imageUrl ? (
            <Image
              src={place.imageUrl}
              alt={place.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover rounded-xl"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="size-8" aria-hidden />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-medium text-text">
            {place.category}
          </span>
          <h3 className="mt-0.5 truncate font-bold text-text">{place.name}</h3>
          <p className="mt-1 flex items-center gap-1 truncate text-sm text-muted">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{place.address}</span>
          </p>
        </div>
      </Link>
      {/* 버튼을 Link 밖에 둬야 a 안에 button이 중첩되지 않는다 */}
      <div className="shrink-0">
        <LikeButton placeId={place.id} initialWish likeCount={0} />
      </div>
    </div>
  );
}
