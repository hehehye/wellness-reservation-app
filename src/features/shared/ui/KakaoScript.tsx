"use client";

import Script from "next/script";

export default function KakaoScript() {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  return (
    <Script
      id="kakao-maps-sdk"
      src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services,clusterer`}
      strategy="afterInteractive"
      onLoad={() => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            window.dispatchEvent(new Event("kakao:loaded"));
          });
        }
      }}
    />
  );
}
