import { Amenity } from "../types/Amenity";

export default async function fetchAmenity(): Promise<Amenity[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/amenities`);
  const res = await fetch(url, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`편의시설 목록을 불러오지 못했습니다. (${res.status})`);
  }

  return res.json();
}
