import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import BottomTab from "@/features/shared/ui/BottomTab";
import KakaoScript from "@/features/shared/ui/KakaoScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://내도메인.vercel.app"),
  title: {
    default: "Wellny | 요가·필라테스 예약", // 기본적으로 전부
    template: "%s | Wellny", // 하위 페이지 title 뒤에 자동으로 붙음
  },
  description: "내 주변 요가·필라테스 클래스를 찾고 바로 예약하세요.",
  openGraph: {
    siteName: "Wellny",
    locale: "ko_KR",
    type: "website",
    images: ["/og-default.png"], // 카톡이나 링크 공유 때 뜨는 기본 이미지 (1200×630)
  },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="w-full m-auto border border-gray-100 min-h-full flex flex-col shadow-lg sm:max-w-[520px] lg:max-w-[520px]">
        <Toaster position="top-center" />
        <KakaoScript />
        {children}
        <BottomTab />
      </body>
    </html>
  );
}
