import { Suspense } from "react";
import { getPlaces } from "@/features/places/api/getPlaces";
import PlaceListSkeleton from "@/features/places/components/PlaceListSkeleton";
import SearchBar from "@/features/places/components/Search";
import PageHeader from "@/features/shared/ui/PageHeader";
import FilterBar from "@/features/filter/components/FilterBar";
import fetchCategory from "@/features/filter/categories/api/category";
import fetchAmenity from "@/features/filter/amenities/api/amenity";
import { Metadata } from "next";
import PlaceListContent from "@/features/places/components/PlaceListContent";

// 1) SEO 메타데이터
export const metadata: Metadata = {
  title: "Wellny · 장소찾기",
  description: "나에게 맞는 웰니스 활동을 만나보세요.",
};
// 2) 본문
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    amenity?: string;
    // sort?: string;
  }>;
}) {
  const { q, category, amenity } = await searchParams;
  const categories = await fetchCategory();
  const amenities = await fetchAmenity();

  const places = await getPlaces(q, category, amenity);

  return (
    <div>
      <PageHeader title="플레이스" back home />
      <main className="px-page pt-16 pb-6">
        <Suspense fallback={<div className="h-11" />}>
          <SearchBar />
        </Suspense>
        <FilterBar categories={categories} amenities={amenities} />
        <div className="pt-3">
          {/* key로 검색어가 바뀔 때마다 스켈레톤을 다시 보여준다 */}
          <Suspense key={q ?? ""} fallback={<PlaceListSkeleton />}>
            <PlaceListContent places={places} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
