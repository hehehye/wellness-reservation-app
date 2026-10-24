// PlaceCard와 동일한 레이아웃(썸네일 4:3 + 카테고리 + 이름)을 유지해 로딩 후 레이아웃 이동을 막는다
export default function PlaceCardSkeleton() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-card border border-border bg-surface"
    >
      <div className="aspect-4/3 animate-pulse bg-line" />
      <div className="p-3">
        <div className="h-4 w-12 animate-pulse rounded bg-line" />
        <div className="mt-1 h-6 w-3/4 animate-pulse rounded bg-line" />
      </div>
    </div>
  );
}
