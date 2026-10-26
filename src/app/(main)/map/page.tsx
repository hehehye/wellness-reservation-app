import { getPlaces } from "@/features/places/api/getPlaces";
import SearchBar from "@/features/places/components/Search";
import { BackButton } from "@/features/shared/ui/ExitButton";
import { KakaoMap } from "@/features/shared/ui/KakaoMap";
import { Suspense } from "react";

export default async function Page() {
  const places = await getPlaces();

  return (
    <div className="w-full min-h-dvh">
      <div className="my-2 flex gap-2">
        <BackButton />
        <Suspense fallback={<div className="h-11" />}>
          <SearchBar />
        </Suspense>
      </div>
      <div>
        <KakaoMap
          className="w-full min-h-dvh"
          lat={37.5665}
          lng={126.978}
          places={places}
        />
      </div>
    </div>
  );
}
