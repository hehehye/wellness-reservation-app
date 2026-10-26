"use client";

import { useCallback, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/features/shared/lib/cn";
import HoldTimer from "./HoldTimer";
import type { BookingDetail } from "../types/Book";
import { PaymentSection } from "@/features/payment/components/PaymentSection";

type Props = { booking: BookingDetail; customerKey: string };

const METHODS = [
  { value: "card", label: "신용·체크카드" },
  { value: "kakaopay", label: "카카오페이" },
  { value: "tosspay", label: "토스페이" },
] as const;
type Method = (typeof METHODS)[number]["value"];

const TERMS = [
  {
    key: "refund",
    label: "취소 및 환불 규정 동의",
    detail:
      "수업 시작 24시간 전까지 취소 시 전액 환불됩니다. 이후 취소 및 노쇼는 환불되지 않습니다.",
  },
  {
    key: "privacy",
    label: "개인정보 제3자 제공 동의",
    detail:
      "예약 확인을 위해 이름, 연락처가 해당 시설에 제공되며 수업 종료 후 파기됩니다.",
  },
  {
    key: "payment",
    label: "결제 대행 서비스 이용약관 동의",
    detail: "결제는 PG사를 통해 안전하게 처리됩니다.",
  },
] as const;
type TermKey = (typeof TERMS)[number]["key"];

export default function PaymentForm({ booking, customerKey }: Props) {
  const [agreed, setAgreed] = useState<Record<TermKey, boolean>>({
    refund: false,
    privacy: false,
    payment: false,
  });
  const [openTerm, setOpenTerm] = useState<TermKey | null>(null);
  const [expired, setExpired] = useState(false);
  const handleExpire = useCallback(() => setExpired(true), []);

  const allAgreed = TERMS.every(({ key }) => agreed[key]);
  const isPending = booking.status === "pending";
  const canPay = isPending && !expired && allAgreed;

  const toggleAll = () => {
    const next = !allAgreed;
    setAgreed({ refund: next, privacy: next, payment: next });
  };

  return (
    <>
      {isPending && booking.hold_expires_at && (
        <HoldTimer
          expiresAt={booking.hold_expires_at}
          onExpire={handleExpire}
          sessionId={booking.session_id}
        />
      )}

      {/* 결제 수단 */}
      <section className="rounded-card border border-border bg-surface p-5">
        <h2 className="font-bold text-text">결제 수단</h2>
        <PaymentSection
          order={{
            id: booking.id,
            amount: Number(booking.price),
            name: booking.place_name,
          }}
          customerKey={customerKey}
          disabled={!canPay}
        />
      </section>

      {/* 약관 동의 */}
      <section className="rounded-card border border-border bg-surface p-5">
        <button
          type="button"
          onClick={toggleAll}
          aria-pressed={allAgreed}
          className="flex w-full cursor-pointer items-center gap-3 text-left"
        >
          <CheckMark checked={allAgreed} />
          <span className="font-bold text-text">
            주문 내용 확인 및 전체 동의
          </span>
        </button>

        <ul className="mt-4 space-y-1 border-t border-line pt-3">
          {TERMS.map(({ key, label, detail }) => {
            const open = openTerm === key;
            return (
              <li key={key}>
                <div className="flex items-center gap-3 py-2">
                  <label className="flex flex-1 cursor-pointer items-center gap-3 text-sm text-text">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={agreed[key]}
                      onChange={(e) =>
                        setAgreed((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                    />
                    <CheckMark checked={agreed[key]} small />
                    <span>
                      <span className="text-muted">[필수]</span> {label}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setOpenTerm(open ? null : key)}
                    aria-expanded={open}
                    aria-label={`${label} 자세히 보기`}
                    className="cursor-pointer p-1 text-muted"
                  >
                    <ChevronDown
                      className={cn("size-4 transition", open && "rotate-180")}
                      aria-hidden
                    />
                  </button>
                </div>
                {open && (
                  <p className="mb-2 ml-8 rounded-control bg-bg p-3 text-xs leading-relaxed text-muted">
                    {detail}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

function CheckMark({ checked, small }: { checked: boolean; small?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border transition",
        small ? "size-5" : "size-6",
        checked
          ? "border-primary bg-primary text-white"
          : "border-line-strong bg-surface text-transparent",
      )}
    >
      <Check className={small ? "size-3" : "size-3.5"} strokeWidth={3} />
    </span>
  );
}
