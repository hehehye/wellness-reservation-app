import { formatPrice } from "@/features/sessions/lib/format";

type Props = { price: number; qty?: number };

export default function PaymentAmountCard({ price, qty = 1 }: Props) {
  const total = price * qty;

  return (
    <section className="rounded-card border border-border bg-surface p-5">
      <h2 className="font-bold text-text">결제 금액</h2>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">수업 금액</dt>
          <dd className="text-text">{formatPrice(price)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">수량</dt>
          <dd className="text-text">{qty}회</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">할인</dt>
          <dd className="text-text">0원</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="font-bold text-text">총 결제 금액</span>
        <span className="text-xl font-bold text-primary">
          {formatPrice(total)}
        </span>
      </div>
    </section>
  );
}
