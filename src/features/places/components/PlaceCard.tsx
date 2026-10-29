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
      className="block overflow-hidden bg-surface transition hover:shadow-md"
    >
      <div className="relative overflow-hidden rounded-xl flex aspect-4/3.5 items-center justify-center bg-primary-soft text-muted">
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
      <div className="p-1">
        <span className="text-xs font-medium text-soft">{place.category}</span>
        <h3 className="truncate font-bold text-text">{place.name}</h3>
      </div>
    </Link>
  );
}
