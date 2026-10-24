// LikePlaceCard와 동일한 레이아웃을 유지해 로딩 후 레이아웃 이동을 막는다
export default function LikePlaceCardSkeleton() {
  return (
    <div
      aria-hidden
      className="flex items-center gap-3 rounded-card border border-border bg-surface p-3"
    >
      <div className="size-20 shrink-0 animate-pulse rounded-control bg-line" />
      <div className="min-w-0 flex-1">
        <div className="h-4 w-12 animate-pulse rounded bg-line" />
        <div className="mt-1 h-6 w-3/4 animate-pulse rounded bg-line" />
        <div className="mt-1 h-5 w-1/2 animate-pulse rounded bg-line" />
      </div>
    </div>
  );
}
