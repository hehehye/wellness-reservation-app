import type { Place } from "@/features/places/types/Place";

// 최근 본 장소: 카드 렌더링에 필요한 필드만 localStorage에 저장
export type RecentPlace = Pick<Place, "id" | "name" | "category" | "imageUrl">;

const STORAGE_KEY = "recent-places";
const MAX_COUNT = 10;
// 같은 탭에서의 변경은 storage 이벤트가 오지 않으므로 직접 알림
const CHANGE_EVENT = "recent-places-change";

const EMPTY: RecentPlace[] = [];
let cachedRaw: string | null = null;
let cachedList: RecentPlace[] = EMPTY;

function readRaw() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

// useSyncExternalStore용 스냅샷. 값이 같으면 같은 배열 참조를 돌려줘야 한다
export function getRecentPlaces(): RecentPlace[] {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedList;

  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedList = Array.isArray(parsed) ? (parsed as RecentPlace[]) : EMPTY;
  } catch {
    cachedList = EMPTY;
  }
  return cachedList;
}

export function getServerRecentPlaces(): RecentPlace[] {
  return EMPTY;
}

export function addRecentPlace(place: RecentPlace) {
  const next = [
    place,
    ...getRecentPlaces().filter((p) => p.id !== place.id),
  ].slice(0, MAX_COUNT);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearRecentPlaces() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeRecentPlaces(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}
