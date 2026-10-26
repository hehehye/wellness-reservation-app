"use client";

import { useEffect } from "react";
import { addRecentPlace, type RecentPlace } from "../lib/recentPlaces";

// 장소 상세 페이지 진입 시 최근 본 장소로 기록 (화면에는 아무것도 그리지 않음)
export default function RecordRecentPlace({ id, name, category, imageUrl }: RecentPlace) {
  useEffect(() => {
    addRecentPlace({ id, name, category, imageUrl });
  }, [id, name, category, imageUrl]);

  return null;
}
