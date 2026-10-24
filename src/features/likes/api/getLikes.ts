import type { Place } from "@/features/places/types/Place";

// 로그인한 유저의 찜 목록. 유저마다 다른 데이터라 캐시하지 않는다
export async function getLikes(accessToken: string): Promise<Place[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/likes`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`찜 목록을 불러오지 못했습니다. (${res.status})`);
  }

  return res.json();
}
