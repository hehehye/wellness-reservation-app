import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ChevronRight, ImageIcon, Star } from "lucide-react";
import { getPlace } from "@/features/places/api/getPlaces";
import PlaceDetailSkeleton from "@/features/places/components/PlaceDetailSkeleton";
import LikeButton from "@/features/likes/components/LikeButton";
import BottomFixedBar from "@/features/shared/ui/BottomFixedBar";
import { Button } from "@/features/shared/ui/Button";
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/server";
import Image from "next/image";
import { getSessions } from "@/features/sessions/api/sessions";
import SessionCarousel from "@/features/sessions/components/SessionCarousel";
import PlaceMap from "@/features/places/components/PlaceMap";
import RecordRecentPlace from "@/features/places/components/RecordRecentPlace";
import PlaceHeader from "@/features/places/components/PlaceHeader";
import {
  Coffee,
  Dumbbell,
  Lock,
  ParkingCircle,
  ShowerHead,
  Shirt,
  Sparkles,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import ShareButton from "@/features/shared/ui/ShareButton";

// 편의시설 이름 -> 아이콘
const AMENITY_ICONS: [keyword: string, icon: LucideIcon][] = [
  ["요가매트", Dumbbell],
  ["탈의", Shirt],
  ["음료", Coffee],
  ["샤워", ShowerHead],
  ["와이파이", Wifi],
  ["wifi", Wifi],
  ["주차", ParkingCircle],
  ["사물함", Lock],
];
const getAmenityIcon = (name: string): LucideIcon =>
  AMENITY_ICONS.find(([keyword]) =>
    name.toLowerCase().includes(keyword),
  )?.[1] ?? Sparkles;

// 1) SEO 메타데이터
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const place = await getPlace(id);

  const title = `${place.name} | wellness`;
  const description = `${place.name}에서 나에게 맞는 웰니스 활동을 만나보세요.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: place.imageUrl ? [{ url: place.imageUrl }] : [],
    },
  };
}

async function PlaceDetail({ id }: { id: string }) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const [place, sessions] = await Promise.all([
    getPlace(id, session?.access_token),
    getSessions(id),
  ]);
  if (!place) notFound();
  return (
    <div>
      <RecordRecentPlace
        id={place.id}
        name={place.name}
        category={place.category}
        imageUrl={place.imageUrl}
      />
      <PlaceHeader title={place.name} back home />
      <main className="pb-16">
        <div className="relative flex h-92 items-center justify-center bg-primary-soft text-muted">
          {place.imageUrl ? (
            <Image
              src={place.imageUrl}
              alt={place.name}
              fill
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="size-8" aria-hidden />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent" />
        </div>

        <section className="px-page pt-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-text">
                {place.category}
              </span>
              <h2 className="mt-1 text-xl font-bold text-text">{place.name}</h2>
              <div>
                <Link
                  href={`/place/${id}/review`}
                  className="flex items-center gap-2 py-2"
                >
                  <Star size={18} fill="#facc15" stroke="#facc15" />
                  <span className="font-bold text-sm">
                    {place._count.place_reviews}개 리뷰
                  </span>
                  <ChevronRight size={16} color="var(--color-soft)" />
                </Link>
              </div>
            </div>
            <div className="flex items-center mb-3">
              <LikeButton
                placeId={place.id}
                initialWish={place.isLiked}
                likeCount={0}
              />
              <div className="ml-[-14px]">
                <ShareButton placeId={place.id} />
              </div>
            </div>
          </div>
          <p className="mt-1 text-sm font-medium text-muted">{place.address}</p>
        </section>

        <section className="pt-4">
          <div className="pt-5 pb-1.5 px-page flex justify-between itmes=center">
            <h3 className="font-bold text-text">수업</h3>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-text transition hover:bg-bg">
              <Link href={`/place/${id}/schedule`}>일정보기</Link>
            </span>
          </div>
          {sessions.length > 0 ? (
            <SessionCarousel sessions={sessions} />
          ) : (
            <p className="mt-2 px-page text-center py-16 text-sm text-muted">
              아직 예정된 수업이 없습니다.
            </p>
          )}
        </section>
        {place.amenities.length > 0 && (
          <section className="px-page pt-6 ">
            <h3 className="font-bold text-text  pb-1.5">편의시설</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {place.amenities.map((amenity) => {
                const Icon = getAmenityIcon(amenity);
                return (
                  <li
                    key={amenity}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5
                     text-sm font-medium text-text transition duration-200 ease-out 
                     hover:-translate-y-0.5 hover:border-soft/30 hover:bg-bg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <Icon className="size-3.5 text-primary" aria-hidden />
                    {amenity}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
        <PlaceMap place={place} />
        <BottomFixedBar>
          <Button className="w-full py-2 mx-2">
            <Link href={`/place/${id}/schedule`}>스케줄 확인</Link>
          </Button>
        </BottomFixedBar>
      </main>
    </div>
  );
}
// 2. 페이지 본문
export default async function Page({ params }: PageProps<"/place/[id]">) {
  const { id } = await params;

  return (
    <Suspense key={id} fallback={<PlaceDetailSkeleton />}>
      <PlaceDetail id={id} />
    </Suspense>
  );
}
