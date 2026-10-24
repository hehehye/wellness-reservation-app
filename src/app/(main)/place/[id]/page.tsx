import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ImageIcon } from "lucide-react";
import { getPlace } from "@/features/places/api/getPlaces";
import PlaceDetailSkeleton from "@/features/places/components/PlaceDetailSkeleton";
import PageHeader from "@/features/shared/ui/PageHeader";
import LikeButton from "@/features/likes/components/LikeButton";
import BottomFixedBar from "@/features/shared/ui/BottomFixedBar";
import { Button } from "@/features/shared/ui/Button";
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/server";
import Image from "next/image";
import { getSessions } from "@/features/sessions/api/sessions";
import SessionCarousel from "@/features/sessions/components/SessionCarousel";
import PlaceMap from "@/features/places/components/PlaceMap";

// 헤더 타이틀도 place.name에 의존하므로 헤더까지 Suspense 안쪽에서 렌더링
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
      <PageHeader title={place.name} back home />
      <main className="pt-14 pb-28">
        <div className="relative flex aspect-video items-center justify-center bg-primary-soft text-muted">
          {place.imageUrl ? (
            <Image
              src={place.imageUrl}
              alt={place.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="size-8" aria-hidden />
            </div>
          )}
        </div>

        <section className="px-page pt-5">
          <div className="flex justify-between">
            <div>
              <span className="text-sm font-medium text-primary">
                {place.category}
              </span>
              <h2 className="mt-1 text-xl font-bold text-text">{place.name}</h2>
            </div>
            <div>
              <LikeButton
                placeId={place.id}
                initialWish={place.isLiked}
                likeCount={0}
              />
            </div>
          </div>
          <p className="mt-1 text-sm text-muted">{place.address}</p>
          <p className="mt-4 text-text">{place.description}</p>
        </section>
        {place.amenities.length > 0 && (
          <section className="px-page pt-6">
            <h3 className="font-bold text-text">편의시설</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {place.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted"
                >
                  {amenity}
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="pt-6">
          <div className="pt-5 pb-1.5 px-page flex justify-between itmes=center">
            <h3 className="font-bold text-text">수업</h3>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-bg">
              <Link href={`/place/${id}/schedule`}>일정보기</Link>
            </span>
          </div>
          {sessions.length > 0 ? (
            <SessionCarousel sessions={sessions} />
          ) : (
            <p className="mt-2 px-page text-sm text-muted">
              예정된 수업이 없습니다.
            </p>
          )}
        </section>

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

export default async function Page({ params }: PageProps<"/place/[id]">) {
  const { id } = await params;

  return (
    <Suspense key={id} fallback={<PlaceDetailSkeleton />}>
      <PlaceDetail id={id} />
    </Suspense>
  );
}
