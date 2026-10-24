// _component/PaymentSection.tsx
"use client";

import { useState } from "react";
import TossPayments from "./TossPayment";
// import { SkipPaymentButton } from "./SkipPaymentButton";

export function PaymentSection({
  order,
  customerKey,
  disabled,
}: {
  order: { id: string; amount: number; name: string };
  customerKey: string;
  disabled: boolean;
}) {
  const [mode, setMode] = useState<"payment" | "skip">("payment");
  return (
    <section className="pt-8">
      {/* 탭 */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`flex-1 py-3 text-sm font-bold ${
            mode === "payment"
              ? "border-b-2 border-black text-black"
              : "text-gray-400"
          }`}
          onClick={() => setMode("payment")}
        >
          실제 결제하기
        </button>
        <button
          className={`flex-1 py-3 text-sm font-bold ${
            mode === "skip"
              ? "border-b-2 border-black text-black"
              : "text-gray-400"
          }`}
          onClick={() => setMode("skip")}
        >
          결제 없이 체험하기
        </button>
      </div>

      {/* 탭에 따라 완전히 다른 영역 렌더링 */}
      {mode === "payment" ? (
        <TossPayments
          order={order}
          customerKey={customerKey}
          disabled={disabled}
        />
      ) : (
        <div className="border rounded-lg px-4 py-6 mx-8 text-center">
          <p className="text-xs text-gray-500 mb-4">
            포트폴리오 체험용입니다.
            <br />
            결제 테스트를 원하지 않는다면, 바로 완료 화면으로 이동해요.
          </p>
          {/* <SkipPaymentButton orderId={order.id} amount={order.amount} /> */}
        </div>
      )}
    </section>
  );
}
