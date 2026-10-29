"use client";

import { Place } from "@/features/places/types/Place";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const pinSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
  <path d="M20 0C9 0 0 9 0 20c0 14 20 28 20 28s20-14 20-28C40 9 31 0 20 0z" fill="#4C9A6A"/>
  <g fill="#fff">
    <ellipse cx="20" cy="19" rx="3.5" ry="9"/>
    <ellipse cx="20" cy="19" rx="3.5" ry="9" transform="rotate(-45 20 24)"/>
    <ellipse cx="20" cy="19" rx="3.5" ry="9" transform="rotate(45 20 24)"/>
  </g>
</svg>`;

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
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const init = () => {
      if (cancelled || !mapRef.current) return;
      const { maps } = window.kakao;

      const positions = places.map(
        (p) => new maps.LatLng(Number(p.lat), Number(p.lng)),
      );

      const map = new maps.Map(mapRef.current, {
        center: positions[0] ?? new maps.LatLng(lat, lng),
        level: level,
      });

      map.addControl(new maps.MapTypeControl(), maps.ControlPosition.TOPRIGHT);
      map.addControl(new maps.ZoomControl(), maps.ControlPosition.RIGHT);

      const markerImage = new maps.MarkerImage(
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(pinSvg)}`,
        new maps.Size(40, 48),
        { offset: new maps.Point(20, 48) },
      );

      const overlay = new maps.CustomOverlay({ yAnchor: 1.3, zIndex: 3 });
      maps.event.addListener(map, "click", () => overlay.setMap(null));

      // 1) 마커
      const markers = places.map((p, i) => {
        const marker = new maps.Marker({
          position: positions[i],
          image: markerImage,
        });

        maps.event.addListener(marker, "click", () => {
          const content = document.createElement("div");
          content.className =
            "rounded-card border-[2px] border-[#39a86b] bg-white px-3 py-2 mb-6 text-sm shadow-md";

          const link = document.createElement("a");
          link.textContent = p.name;
          link.href = `/place/${p.id}`;
          link.addEventListener("click", (e) => {
            e.preventDefault();
            router.push(`/place/${p.id}`);
          });
          content.appendChild(link);

          overlay.setContent(content);
          overlay.setPosition(marker.getPosition());
          overlay.setMap(map);
        });

        return marker;
      });

      // 2) 클러스터러는 딱 한 번만 만들고, 모든 마커를 한꺼번에 등록한다
      const clusterer = new maps.MarkerClusterer({
        map,
        averageCenter: true,
        minLevel: 5,
      });
      clusterer.addMarkers(markers);

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
  }, [lat, lng, level, places, router]);

  return <div ref={mapRef} className={className} aria-label="카카오 지도" />;
}
