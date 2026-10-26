export async function createReview(
  input: { bookingId: string; rating: number; content: string },
  token: string,
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "저장에 실패했어요");
  }
  return res.json();
}
export async function fetchReview(id: string) {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/reviews/${id}`,
  );
  const res = await fetch(url, {
    next: { revalidate: 60, tags: ["reviews"] },
  });
  if (!res.ok) {
    throw new Error(`리뷰 목록을 불러오지 못했습니다. (${res.status})`);
  }

  return res.json();
}
