interface Row {
  label: string;
  value: React.ReactNode;
}

type Props = {
  title: string;
  rows: Row[];
};

// 라벨-값 형태의 정보 목록 (결제 정보, 예약 정보 등)
export default function BookingInfoSection({ title, rows }: Props) {
  return (
    <section className="rounded-card border border-border bg-surface p-5">
      <h2 className="text-xs font-medium text-muted">{title}</h2>
      <dl className="mt-3 space-y-2.5 text-sm">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4"
          >
            <dt className="shrink-0 text-muted">{row.label}</dt>
            <dd className="min-w-0 break-all text-right text-text">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
