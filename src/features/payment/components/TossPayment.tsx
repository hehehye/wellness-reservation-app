"use client";

import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { useEffect, useRef, useState } from "react";

const widgetClientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
// const customerKey = "xu9s-Ce_ySiD9IWOhabWH";
export default function TossPayments({
  order,
  customerKey,
  disabled,
}: {
  order: { amount: number; id: string; name: string };
  customerKey: string;
  disabled?: boolean;
}) {
  const originalPrice = order.amount; // 서버에서 받은 실제 상품 가격 (동적)
  const [price, setPrice] = useState(originalPrice);
  const [paymentWidget, setPaymentWidget] = useState<Awaited<
    ReturnType<typeof loadPaymentWidget>
  > | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    NonNullable<typeof paymentWidget>["renderPaymentMethods"]
  > | null>(null);
  useEffect(() => {
    const fetchPaymentWidget = async () => {
      try {
        const loadedWidget = await loadPaymentWidget(
          widgetClientKey,
          customerKey,
        );
        setPaymentWidget(loadedWidget);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    };

    fetchPaymentWidget();
  }, [customerKey]);

  useEffect(() => {
    if (paymentWidget == null) {
      return;
    }

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      "#payment-widget",
      { value: price },
      { variantKey: "DEFAULT" },
    );

    paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, [paymentWidget, price]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(price);
  }, [price]);
  const handlePaymentRequest = async () => {
    try {
      await paymentWidget?.requestPayment({
        orderId: order.id,
        orderName: order.name, // 수업 이름 (props로 받기)
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error("Error requesting payment:", error);
    }
  };
  return (
    <div className="py-2">
      {/* 결제 UI, 이용약관 UI 영역 */}
      <div id="payment-widget" />
      <div id="agreement" />
      {/* 결제하기 버튼 */}
      <PaymentButton
        handlePaymentRequest={handlePaymentRequest}
        price={price}
        disabled={!paymentWidget || disabled}
      />
    </div>
  );
}
function PaymentButton({
  handlePaymentRequest,
  price,
  disabled = false,
}: {
  handlePaymentRequest: () => void;
  price: number;
  disabled?: boolean;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-[560px] px-4 py-3">
        <button
          onClick={handlePaymentRequest}
          disabled={disabled}
          className="w-full rounded-lg bg-primary py-4 text-base font-bold text-white disabled:opacity-50"
        >
          {price.toLocaleString("ko-KR")}원 결제하기
        </button>
      </div>
    </div>
  );
}
