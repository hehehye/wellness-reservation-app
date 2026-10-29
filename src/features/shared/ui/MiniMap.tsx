"use client";

import { useEffect, useRef } from "react";

type KakaoMapProps = {
  lat: number;
  lng: number;
  className?: string;
  level?: number;
};

export function MiniMap({ lat, lng, className, level = 3 }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = () => {
      if (cancelled || !mapRef.current) return;
      const { maps } = window.kakao;

      const coords = new maps.LatLng(lat, lng);
      const map = new maps.Map(mapRef.current, { center: coords, level });
      new maps.Marker({ position: coords, map });
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
