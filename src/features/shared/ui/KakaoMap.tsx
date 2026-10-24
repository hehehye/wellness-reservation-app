"use client";

import { Place } from "@/features/places/types/Place";
import { useEffect, useRef } from "react";

type KakaoMapProps = {
  lat: number;
  lng: number;
  className?: string;
  level?: number;
  places: Place[];
};

export function KakaoMap({
  lat,
  lng,
  className,
  level = 8,
  places,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = () => {
      if (cancelled || !mapRef.current) return;
      const { maps } = window.kakao;

      const positions = places.map(
        (p) => new maps.LatLng(Number(p.lat), Number(p.lng)),
      );

      const map = new maps.Map(mapRef.current, { center: positions[0], level });
      positions.forEach((position) => new maps.Marker({ map, position }));

      if (positions.length > 1) {
        const bounds = new maps.LatLngBounds();
        positions.forEach((pos) => bounds.extend(pos));
        map.setBounds(bounds, 120, 100, 50, 50);
        map.setLevel(level);
      }
    };

    const start = () => window.kakao.maps.load(init);

    let onLoaded: (() => void) | undefined;
    if (window.kakao?.maps) {
      start();
    } else {
      onLoaded = start;
      window.addEventListener("kakao:loaded", onLoaded, { once: true });
    }

    return () => {
      cancelled = true;
      if (onLoaded) window.removeEventListener("kakao:loaded", onLoaded);
      if (mapRef.current) mapRef.current.innerHTML = "";
    };
  }, [lat, lng, level]);

  return <div ref={mapRef} className={className} aria-label="카카오 지도" />;
}
