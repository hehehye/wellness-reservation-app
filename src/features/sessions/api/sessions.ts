import { SessionDetail, SessionItem } from "../types/Session";

export async function getSessions(placeId: string): Promise<SessionItem[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/sessions`);
  url.searchParams.set("placeId", placeId);

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`수업 일정을 불러오지 못했습니다. (${res.status})`);
  }

  return res.json();
}
export async function getSessionsDetail(
  sessionId: string,
): Promise<SessionDetail> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/sessions/${sessionId}`,
  );

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`수업 일정을 불러오지 못했습니다. (${res.status})`);
  }

  return res.json();
}
