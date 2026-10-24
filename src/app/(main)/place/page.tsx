import { Suspense } from "react";
import { getPlaces } from "@/features/places/api/getPlaces";
import PlaceList from "@/features/places/components/PlaceList";
import PlaceListSkeleton from "@/features/places/components/PlaceListSkeleton";
import SearchBar from "@/features/places/components/Search";
import PageHeader from "@/features/shared/ui/PageHeader";
import { KakaoMap } from "@/features/shared/ui/KakaoMap";

// 데이터 fetch를 Suspense 안쪽 컴포넌트로 분리해야 fallback(스켈레톤)이 스트리밍된다
async function PlaceListContent({ q }: { q?: string }) {
  const places = await getPlaces(q);
  return <PlaceList places={places} />;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    // status?: string;
    // category?: string;
    // sort?: string;
  }>;
}) {
  const { q } = await searchParams;
  return (
    <div>
      <PageHeader title="플레이스" back home />
      <main className="px-page pt-16 pb-6">
        <SearchBar />
        <div className="pt-3">
          {/* key로 검색어가 바뀔 때마다 스켈레톤을 다시 보여준다 */}
          <Suspense key={q ?? ""} fallback={<PlaceListSkeleton />}>
            <PlaceListContent q={q} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
