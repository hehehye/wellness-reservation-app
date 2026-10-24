import { getPlaces } from "@/features/places/api/getPlaces";
import SearchBar from "@/features/places/components/Search";
import { BackButton } from "@/features/shared/ui/ExitButton";
import { KakaoMap } from "@/features/shared/ui/KakaoMap";

export default async function Page({ q }: { q?: string }) {
  const places = await getPlaces(q);

  return (
    <div className="w-full min-h-dvh">
      <div className="my-2 flex gap-2">
        <BackButton />
        <SearchBar />
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
