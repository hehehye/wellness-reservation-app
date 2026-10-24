import Link from "next/link";
import type { Place } from "@/features/places/types/Place";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface Props {
  place: Pick<Place, "id" | "name" | "category" | "imageUrl">;
}

export default function PlaceCard({ place }: Props) {
  return (
    <Link
      href={`/place/${place.id}`}
      className="block overflow-hidden rounded-card border border-border bg-surface transition hover:shadow-md"
    >
      {/* 이미지 준비 전까지 더미 썸네일 */}
      <div className="relative flex aspect-4/3 items-center justify-center bg-primary-soft text-muted">
        {place.imageUrl ? (
          <Image
            src={place.imageUrl}
            alt={place.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="size-8" aria-hidden />
          </div>
        )}
      </div>
      <div className="p-3">
        <span className="text-xs font-medium text-primary">
          {place.category}
        </span>
        <h3 className="mt-1 truncate font-bold text-text">{place.name}</h3>
      </div>
    </Link>
  );
}
