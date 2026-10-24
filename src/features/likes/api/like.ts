export async function toggleLike(
  placeId: string,
  accessToken: string,
  like: boolean, // true면 찜 추가, false면 해제
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/likes/${placeId}/like`,
    {
      method: like ? "POST" : "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!res.ok) throw new Error("좋아요 처리에 실패했습니다");
  return res.json(); // { liked: boolean }
}
