"use client";

import { useSyncExternalStore } from "react";
import RecommendSection from "@/features/shared/ui/RecommendSection";
import PlaceCard from "./PlaceCard";
import {
  clearRecentPlaces,
  getRecentPlaces,
  getServerRecentPlaces,
  subscribeRecentPlaces,
} from "../lib/recentPlaces";

export default function RecentPlacesSection() {
  const places = useSyncExternalStore(
    subscribeRecentPlaces,
    getRecentPlaces,
    getServerRecentPlaces,
  );

  // 본 장소가 없으면 섹션 자체를 숨김
  if (places.length === 0) return null;

  return (
    <>
      {places.length > 2 ? (
        <RecommendSection
          title="최근 본 장소"
          action={
            <button
              type="button"
              onClick={clearRecentPlaces}
              className="text-xs font-medium text-muted transition hover:text-text"
            >
              전체 삭제
            </button>
          }
        >
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </RecommendSection>
      ) : (
        <></>
      )}
    </>
  );
}
