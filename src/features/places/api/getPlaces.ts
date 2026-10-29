import type { Place } from "@/features/places/types/Place";
import { notFound } from "next/navigation";

// 장소 데이터는 자주 바뀌지 않으므로 60초마다 재검증 (ISR)
// 'places' 태그로 revalidateTag('places') 호출 시 즉시 갱신 가능
export async function getPlaces(
  q?: string,
  category?: string,
  amenity?: string,
): Promise<Place[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/places`);

  if (q) {
    url.searchParams.set("q", q);
  }
  [category ?? []]
    .flat()
    .forEach((c) => url.searchParams.append("category", c));
  [amenity ?? []].flat().forEach((a) => url.searchParams.append("amenity", a));
  const res = await fetch(url, {
    next: { revalidate: 60, tags: ["places"] },
  });
  if (!res.ok) {
    throw new Error(`장소 목록을 불러오지 못했습니다. (${res.status})`);
  }

  return res.json();
}

// 상세 데이터도 60초 재검증. 'places'(전체) 또는 `place-${id}`(개별) 태그로 갱신 가능
// 존재하지 않는 id면 null 반환 → 페이지에서 notFound() 처리
export async function getPlace(
  id: string,
  accessToken?: string,
): Promise<Place> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/places/${id}`,
    {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      ...(accessToken
        ? { cache: "no-store" as const }
        : { next: { revalidate: 60, tags: ["places", `place-${id}`] } }),
    },
  );
  if (res.status === 404) notFound();
  if (!res.ok) {
    throw new Error(`장소 정보를 불러오지 못했습니다. (${res.status})`);
  }

  return res.json();
}
