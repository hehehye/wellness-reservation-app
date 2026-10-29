import { Category } from "../types/Category";

export default async function fetchCategory(): Promise<Category[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/category`);
  const res = await fetch(url, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`카테고리 목록을 불러오지 못했습니다. (${res.status})`);
  }

  return res.json();
}
