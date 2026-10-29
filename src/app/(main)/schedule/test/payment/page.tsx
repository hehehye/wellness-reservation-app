"use client";

import { useState } from "react";

type Status = "예약대기" | "예약확정" | "이용완료" | "예약취소" | "예약전취소";
type ClassSession = {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  capacity: number; // 정원 (고정값)
  reservedCount: number; // 이미 예약확정된 인원 (다른 사람들의 예약을 흉내 냄)
};
type Order = {
  // id: crypto.randomUUID()
  id: string;
  sessionId: string;
  status: Status;
  //   classData: ClassSession[];
};
const sessions: ClassSession[] = [
  {
    id: "s1",
    title: "기구 필라테스 (여유)",
    start_at: "2026-10-23T10:00:00+09:00",
    end_at: "2026-10-23T10:50:00+09:00",
    capacity: 6,
    reservedCount: 2,
  },
  {
    id: "s2",
    title: "요가 (마지막 1자리)",
    start_at: "2026-10-23T14:00:00+09:00",
    end_at: "2026-10-23T15:00:00+09:00",
    capacity: 5,
    reservedCount: 4,
  },
  {
    id: "s3",
    title: "크로스핏 (인원마감)",
    start_at: "2026-10-23T19:00:00+09:00",
    end_at: "2026-10-23T20:00:00+09:00",
    capacity: 4,
    reservedCount: 4,
  },
  {
    id: "s4",
    title: "발레 (구매시간 지남)",
    start_at: "2026-10-21T21:00:00+09:00",
    end_at: "2026-10-21T22:00:00+09:00",
    capacity: 8,
    reservedCount: 1,
  },
  {
    id: "s5",
    title: "필라테스 (아직 오픈 전)",
    start_at: "2026-10-24T10:00:00+09:00",
    end_at: "2026-10-24T10:50:00+09:00",
    capacity: 6,
    reservedCount: 0,
  },
];
type CheckType = { orders: Order[]; remaining: number };

type Type = { ok: boolean; message: string };
function canOrder(session: ClassSession): Type {
  const ONE_HOUR = 60 * 60 * 1000; // 360000
  const cutoff = new Date(session.start_at).getTime() - ONE_HOUR;

  if (Date.now() > cutoff) {
    return {
      ok: false,
      message: "수업 구매가능시간이 지났습니다. 다른 회차를 이용해주세요.",
    };
  }
  return { ok: true, message: "" };
}
export default function Page() {
  const [orders, setOrders] = useState<Order[]>([]);

  function createOrder(session: ClassSession): CheckType {
    const { ok, message } = canOrder(session);
    if (!ok) {
      alert(message);
      return { orders: orders, remaining: 0 };
    }
    // 1) 남은 자리부터 계산
    const remaining =
      session.capacity -
      session.reservedCount -
      orders.filter(
        (o) =>
          o.sessionId === session.id &&
          (o.status === "예약대기" || o.status === "예약확정"),
      ).length;

    // 2) 자리가 없으면 그대로 반환
    if (remaining <= 0) {
      alert("정원이 마감되었습니다.");
      return { orders, remaining };
    }

    // 3) 자리가 있으면 주문 추가
    if (!confirm("구매 하시겠습니까?"))
      return { orders: [...orders], remaining };
    const newOrder: Order = {
      id: crypto.randomUUID(),
      sessionId: session.id,
      status: "예약대기",
    };
    alert("예약이 완료되었습니다.");
    return { orders: [...orders, newOrder], remaining: remaining - 1 };
  }
  function getRemaining(session: ClassSession, orders: Order[]) {
    return (
      session.capacity -
      session.reservedCount -
      orders.filter(
        (o) =>
          o.sessionId === session.id &&
          (o.status === "예약대기" || o.status === "예약확정"),
      ).length
    );
  }
  return (
    <div>
      <div>
        {sessions.map((session) => (
          <div key={session.id} className="border py-3 my-2">
            <p>{session.title}</p>
            <p>
              시작시간 :
              {new Date(session.start_at).toLocaleString("ko-KR", {
                timeZone: "Asia/Seoul",
              })}
            </p>
            <p>
              종료시간 :
              {new Date(session.end_at).toLocaleString("ko-KR", {
                timeZone: "Asia/Seoul",
              })}
            </p>
            <p className="text-red-500 font-medium">
              정원: {getRemaining(session, orders)}
            </p>

            <button
              onClick={() => {
                const result = createOrder(session);
                setOrders(result.orders);
              }}
              className="border"
            >
              예약하기
            </button>
          </div>
        ))}
      </div>
      <div>
        <b>---예약---</b>
        {orders.map((order) => {
          const session = sessions.find((s) => s.id === order.sessionId);
          if (!session) return null;
          return (
            <div key={order.id}>
              <p>{session?.title}</p>
              <p>{getRemaining(session, orders)}명</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
