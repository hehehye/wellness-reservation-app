"use client";

import { useState } from "react";
import { toast } from "sonner";

type Status = "예약대기" | "예약확정" | "이용완료" | "예약취소";
interface Order {
  id: string;
  placeId: string;
  name: string;
  totalPrice: number;
  start_at: string;
  end_at: string;
  qty: number;
  status: Status;
}
// 상태 전이 규칙표: "from 상태에서 갈 수 있는 상태 목록"
const ALLOWED: Record<Status, Status[]> = {
  예약대기: ["예약확정", "예약취소"],
  예약확정: ["이용완료", "예약취소"],
  이용완료: [],
  예약취소: [],
};

const initialOrders: Order[] = [
  {
    id: "1",
    placeId: "123",
    name: "바렐 그룹 필라테스",
    totalPrice: 20000,
    start_at: "2026-10-25T10:00:00+09:00",
    end_at: "2026-10-25T10:50:00+09:00",
    qty: 1,
    status: "예약취소",
  },
  {
    id: "2",
    placeId: "123",
    name: "기구 그룹 필라테스",
    totalPrice: 15000,
    start_at: "2026-10-21T10:00:00+09:00",
    end_at: "2026-10-21T10:50:00+09:00",
    qty: 1,
    status: "예약확정",
  },
  {
    id: "3",
    placeId: "124",
    name: "아침 반야 요가",
    totalPrice: 15000,
    start_at: "2026-10-22T10:00:00+09:00",
    end_at: "2026-10-22T10:50:00+09:00",
    qty: 1,
    status: "예약확정",
  },
  {
    id: "4",
    placeId: "124",
    name: "아침 반야 요가",
    totalPrice: 15000,
    start_at: "2026-10-22T10:00:00+09:00",
    end_at: "2026-10-22T10:50:00+09:00",
    qty: 1,
    status: "예약대기",
  },
  {
    id: "5",
    placeId: "123",
    name: "기구 그룹 필라테스",
    totalPrice: 15000,
    start_at: "2026-10-21T19:00:00+09:00",
    end_at: "2026-10-21T19:50:00+09:00",
    qty: 1,
    status: "예약대기",
  },
];
type checkType = { ok: boolean; message: string };
function canTransition(from: Status, to: Status): boolean {
  return ALLOWED[from].includes(to);
}
// 예약취소가 가능한 날짜계산(date는 클래스 시작시간)
function canCancel(date: string): checkType {
  // 현재시간
  const now =
    new Date()
      .toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }) // "2026-10-21 16:25:51"
      .replace(" ", "T") + "+09:00";
  // date 수업 전날의 자정까지만 취소가능하게끔, 당일의 오전 12시 이후부턴 취소불가.
  const deadline = date.slice(0, 10) + "T00:00:00+09:00";
  if (now > deadline) {
    return { ok: false, message: "예약 취소 가능 시간이 지났습니다." };
  }

  return { ok: true, message: "취소가가능합니다." };
}
// 이용완료가 가능한 날짜계산(date는 클래스 끝시간)
function canConfirm(date: string): checkType {
  // 현재시간
  const now =
    new Date()
      .toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }) // "2026-10-21 16:25:51"
      .replace(" ", "T") + "+09:00";
  if (now < date) {
    return { ok: false, message: "아직 이용완료가 불가능한 시간입니다." };
  }
  return { ok: true, message: "이용완료가 완료되었습니다. 감사합니다." };
}

function canPayment(status: Status, date: string): checkType {
  if (!ALLOWED[status].includes("예약확정")) {
    return { ok: false, message: "구매가 불가능한 상태입니다." };
  }

  const ONE_HOUR = 60 * 60 * 1000; // 360000
  const cutoff = new Date(date).getTime() - ONE_HOUR;
  if (Date.now() >= cutoff) {
    return {
      ok: false,
      message: "수업 구매가능시간이 지났습니다. 다른 회차를 이용해주세요.",
    };
  }
  return { ok: true, message: "" };
}
function changeStatus(orders: Order[], id: string, next: Status): Order[] {
  return orders.map((o) => {
    if (o.id !== id) return o;
    if (!canTransition(o.status, next)) return o;
    return { ...o, status: next };
  });
}
export default function Page() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const paymentOrder = (order: Order) => {
    // 구매할거면 구매하는시간이, start_at보다는 적어야한다.
    const { ok, message } = canPayment(order.status, order.start_at);
    if (ok) {
      if (!confirm("구매 하시겠습니까?")) return;
      setOrders(changeStatus(orders, order.id, "예약확정"));
      toast.success("구매가 완료되었습니다.");
    } else {
      alert(message);
    }
  };
  const cancelOrder = (order: Order) => {
    const { ok, message } = canCancel(order.start_at);
    if (ok) {
      if (!confirm("정말 주문을 취소하시겠어요?")) return;
      setOrders(changeStatus(orders, order.id, "예약취소"));
      toast.success("예약취소가 완료되었습니다.");
    } else {
      alert(message);
    }
  };
  const confirmOrder = (order: Order) => {
    const { ok, message } = canConfirm(order.end_at);
    if (ok) {
      if (!confirm("정말 이용완료를 하셨나요?")) return;
      setOrders(changeStatus(orders, order.id, "이용완료"));
      toast.success(message);
    } else {
      alert(message);
    }
  };
  return (
    <div>
      {orders.map((order) => (
        <div key={order.id}>
          <p>{order.name}</p>
          <p>상태 : {order.status}</p>
          <p>
            시작시간 :
            {new Date(order.start_at).toLocaleString("ko-KR", {
              timeZone: "Asia/Seoul",
            })}
          </p>
          <p>
            시작시간 :
            {new Date(order.end_at).toLocaleString("ko-KR", {
              timeZone: "Asia/Seoul",
            })}
          </p>
          {canTransition(order.status, "예약확정") && (
            <button className="border" onClick={() => paymentOrder(order)}>
              구매하기
            </button>
          )}
          {canTransition(order.status, "예약취소") && (
            <button className="border" onClick={() => cancelOrder(order)}>
              결제취소
            </button>
          )}
          <button className="border" onClick={() => confirmOrder(order)}>
            이용완료
          </button>
        </div>
      ))}
    </div>
  );
}
