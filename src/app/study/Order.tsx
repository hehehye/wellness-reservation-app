import { useState } from "react";

/* ============================================================
   주문 로직 연습 (쇼핑몰 레이아웃 버전, Tailwind 사용)
   - 순수 함수(canTransition, changeStatus, summarize, createOrder)는 컴포넌트 밖
   - state를 건드리는 핸들러(cancelOrder)는 컴포넌트 안
   - 총액 같은 파생 값은 state가 아니라 렌더링 때마다 계산
   ============================================================ */

/* ---------- 타입 ---------- */
type Status = "결제대기중" | "결제완료" | "구매확정" | "취소및환불완료";

interface Product {
  id: number;
  name: string;
  price: number;
  qty: number;
  emoji: string; // 이미지 대신 이모지 (나중에 img src로 교체 가능)
}

interface Order {
  id: string;
  name: string;
  emoji: string;
  totalPrice: number;
  qty: number;
  status: Status;
}

/* ---------- 데이터 ---------- */
const PRODUCT: Product[] = [
  { id: 1, name: "키보드", price: 50000, qty: 1, emoji: "⌨️" },
  { id: 2, name: "마우스", price: 30000, qty: 1, emoji: "🖱️" },
  { id: 3, name: "모니터", price: 200000, qty: 1, emoji: "🖥️" },
  { id: 4, name: "헤드셋", price: 80000, qty: 1, emoji: "🎧" },
];

// 상태 전이 규칙표: "from 상태에서 갈 수 있는 상태 목록"
const ALLOWED: Record<Status, Status[]> = {
  결제대기중: ["결제완료", "취소및환불완료"],
  결제완료: ["구매확정", "취소및환불완료"],
  구매확정: [],
  취소및환불완료: [],
};

// 상태별 뱃지 색상
const STATUS_STYLE: Record<Status, string> = {
  결제대기중: "bg-yellow-100 text-yellow-700",
  결제완료: "bg-blue-100 text-blue-700",
  구매확정: "bg-green-100 text-green-700",
  취소및환불완료: "bg-gray-200 text-gray-500",
};

/* ---------- 순수 함수 ---------- */
// 이 상태에서 저 상태로 바꿔도 되나?
function canTransition(from: Status, to: Status): boolean {
  return ALLOWED[from].includes(to);
}

// 허용될 때만 해당 주문의 상태 변경, 아니면 원본 그대로
function changeStatus(orders: Order[], id: string, next: Status): Order[] {
  return orders.map((o) => {
    if (o.id !== id) return o;
    if (!canTransition(o.status, next)) return o;
    return { ...o, status: next };
  });
}

// 취소된 주문은 빼고 합산 (totalPrice가 이미 price * qty라서 qty를 또 곱하지 않음)
function summarize(orders: Order[]): number {
  return orders
    .filter((o) => o.status !== "취소및환불완료")
    .reduce((acc, o) => acc + o.totalPrice, 0);
}

// 새 주문 추가한 새 배열 반환
function createOrder(orders: Order[], product: Product): Order[] {
  if (product.qty <= 0) return orders; // 수량이 0 이하면 주문 안 만듦
  if (product.price < 0) return orders; // 가격이 음수면 거부
  const newOrder: Order = {
    id: crypto.randomUUID(),
    name: product.name,
    emoji: product.emoji,
    totalPrice: product.price * product.qty,
    qty: product.qty,
    status: "결제대기중",
  };
  return [...orders, newOrder];
}

/* ---------- 컴포넌트 ---------- */
export default function OrderPage() {
  const [products] = useState(PRODUCT);
  const [orders, setOrders] = useState<Order[]>([]);
  const paidTotal = summarize(orders); // 파생 값: state로 두지 않음

  const cancelOrder = (order: Order) => {
    if (!confirm("정말 주문을 취소하시겠어요?")) return;
    setOrders(changeStatus(orders, order.id, "취소및환불완료"));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">🛒 연습 쇼핑몰</h1>
          <span className="text-sm text-gray-500">
            주문 {orders.length}건
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 px-4 py-8">
        {/* 상품 목록 */}
        <section>
          <h2 className="mb-4 text-lg font-bold">상품</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <div className="flex h-32 items-center justify-center bg-gray-100 text-5xl">
                  {product.emoji}
                </div>
                <div className="space-y-2 p-3">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    {product.price.toLocaleString()}원
                  </p>
                  <button
                    className="w-full rounded-lg bg-black py-2 text-sm text-white hover:bg-gray-800"
                    onClick={() => setOrders(createOrder(orders, product))}
                  >
                    주문하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 주문 요약 */}
        <section className="flex items-center justify-between rounded-xl bg-black p-5 text-white">
          <span className="text-sm text-gray-300">총 주문 합계 금액</span>
          <span className="text-2xl font-bold">
            {paidTotal.toLocaleString()}원
          </span>
        </section>

        {/* 주문 목록 */}
        <section>
          <h2 className="mb-4 text-lg font-bold">주문 목록</h2>

          {orders.length === 0 ? (
            <p className="rounded-xl border border-dashed bg-white py-10 text-center text-gray-400">
              아직 주문 내역이 없어요
            </p>
          ) : (
            <ul className="space-y-3">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-3xl">
                    {order.emoji}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{order.name}</p>
                    <p className="text-sm text-gray-600">
                      {order.totalPrice.toLocaleString()}원 · {order.qty}개
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      주문번호 {order.id}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[order.status]}`}
                    >
                      {order.status}
                    </span>

                    {/* 취소가 허용된 상태일 때만 버튼 노출 */}
                    {canTransition(order.status, "취소및환불완료") && (
                      <button
                        className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-100"
                        onClick={() => cancelOrder(order)}
                      >
                        주문 취소
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

/* ============================================================
   다음에 해볼 것
   1. "결제하기" 버튼: changeStatus(orders, order.id, "결제완료")
   2. "구매확정" 버튼: 결제완료 상태일 때만 노출
   3. calcRefund(order): 상태별 환불 금액 계산
   4. summarize를 { 상태별 개수, 결제 총액, 환불 총액 } 객체로 확장
   ============================================================ */