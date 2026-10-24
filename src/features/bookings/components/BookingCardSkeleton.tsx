// BookingCard와 동일한 레이아웃을 유지해 로딩 후 레이아웃 이동을 막는다
export default function BookingCardSkeleton() {
  return (
    <div
      aria-hidden
      className="rounded-card border border-border bg-surface p-4"
    >
      <div className="flex items-center justify-between">
        <div className="h-5 w-16 animate-pulse rounded-full bg-line" />
        <div className="h-5 w-14 animate-pulse rounded bg-line" />
      </div>
      <div className="mt-3 h-5 w-1/3 animate-pulse rounded bg-line" />
      <div className="mt-0.5 h-6 w-2/3 animate-pulse rounded bg-line" />
      <div className="mt-3 h-9 w-full animate-pulse rounded-control bg-line" />
    </div>
  );
}
