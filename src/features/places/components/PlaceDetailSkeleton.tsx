import PageHeader from "@/features/shared/ui/PageHeader";

// 상세 페이지(place/[id]) 레이아웃에 맞춘 스켈레톤
export default function PlaceDetailSkeleton() {
  return (
    <div role="status" aria-label="장소 정보를 불러오는 중">
      <PageHeader title="" back />
      <main aria-hidden className="pt-14 pb-6">
        <div className="aspect-video animate-pulse bg-line" />

        <section className="px-page pt-5">
          <div className="h-5 w-14 animate-pulse rounded bg-line" />
          <div className="mt-1 h-7 w-2/3 animate-pulse rounded bg-line" />
          <div className="mt-1 h-5 w-1/2 animate-pulse rounded bg-line" />
          <div className="mt-4 space-y-2">
            <div className="h-5 w-full animate-pulse rounded bg-line" />
            <div className="h-5 w-full animate-pulse rounded bg-line" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-line" />
          </div>
        </section>

        <section className="px-page pt-6">
          <div className="h-6 w-16 animate-pulse rounded bg-line" />
          <div className="mt-2 flex flex-wrap gap-2">
            {[16, 20, 14].map((w) => (
              <div
                key={w}
                className="h-7 animate-pulse rounded-full bg-line"
                style={{ width: `${w * 4}px` }}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
