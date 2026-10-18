import { useState } from "react";
/* ---------- 타입 ---------- */
type BookingStatus = "확정" | "취소";

interface Schedule {
  id: string;
  title: string;
  startAt: string; // ISO 문자열 (한국 시간 +09:00)
  endAt: string;
  price: number;
  limit: number; // 정원 (몇 명 찼는지는 저장하지 않고 계산)
}

interface Gym {
  id: string;
  name: string;
  location: string;
  reviewRatings: number;
  schedule: Schedule[];
}

interface Reservation {
  id: string;
  gymId: string;
  scheduleId: string;
  status: BookingStatus;
  createdAt: string;
  // 스냅샷: 가게나 수업이 바뀌어도 예약 내역은 그대로 보이게 복사해 둠
  gymName: string;
  title: string;
  startAt: string;
  endAt: string;
  price: number;
}

type CreateResult =
  | { ok: true; reservations: Reservation[] }
  | { ok: false; reason: "마감" | "이미예약" | "지난수업" };

/* ---------- 데이터 ---------- */
const GYM: Gym[] = [
  {
    id: "gym-1",
    name: "유앤미스튜디오 필라테스",
    location: "인천 남동구 인주대로 588",
    reviewRatings: 5,
    schedule: [
      {
        id: "sch-1",
        title: "4:1 그룹 필라테스",
        startAt: "2026-10-19T12:00:00+09:00",
        endAt: "2026-10-19T13:00:00+09:00",
        price: 44000,
        limit: 4,
      },
    ],
  },
];

/* ---------- 순수 함수 ---------- */
// 확정된 예약만 세서 "현재 몇 명 찼는지" 계산
function countReserved(
  reservations: Reservation[],
  scheduleId: string,
): number {
  return reservations.filter(
    (r) => r.scheduleId === scheduleId && r.status === "확정",
  ).length;
}

function createReservation(
  reservations: Reservation[],
  gym: Gym,
  schedule: Schedule,
  now: Date = new Date(),
): CreateResult {
  if (now >= new Date(schedule.startAt)) {
    return { ok: false, reason: "지난수업" };
  }

  // 지금은 로그인 사용자가 한 명이라고 가정 (나중에 userId 조건 추가)
  const alreadyBooked = reservations.some(
    (r) => r.scheduleId === schedule.id && r.status === "확정",
  );
  if (alreadyBooked) return { ok: false, reason: "이미예약" };

  if (countReserved(reservations, schedule.id) >= schedule.limit) {
    return { ok: false, reason: "마감" };
  }

  const newReservation: Reservation = {
    id: crypto.randomUUID(),
    gymId: gym.id,
    scheduleId: schedule.id,
    status: "확정",
    createdAt: now.toISOString(),
    gymName: gym.name,
    title: schedule.title,
    startAt: schedule.startAt,
    endAt: schedule.endAt,
    price: schedule.price,
  };

  return { ok: true, reservations: [...reservations, newReservation] };
}

export default function ReservePage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const handleReserve = (gym: Gym, schedule: Schedule) => {
    const result = createReservation(reservations, gym, schedule);

    if (!result.ok) {
      alert(`예약할 수 없어요: ${result.reason}`);
      return;
    }
    setReservations(result.reservations);
  };

  return (
    <div>
      {GYM.map((g) => (
        <div key={g.id}>
          <div className="flex">
            <b>{g.name}</b>
            <b>{g.reviewRatings}점</b>
          </div>
          <b>{g.location}</b>

          <div>
            {g.schedule.map((schedule) => (
              <div key={schedule.id}>
                <p>{schedule.title}</p>
                <p>{schedule.price.toLocaleString()}원</p>
                <p>
                  {countReserved(reservations, schedule.id)} / {schedule.limit}명
                </p>
                <button
                  onClick={() => handleReserve(g, schedule)}
                  className="border"
                >
                  예약하기
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <section>
        <p>내 예약</p>
        {reservations.map((r) => (
          <div key={r.id}>
            {r.gymName} / {r.title} / {r.status}
          </div>
        ))}
      </section>
    </div>
  );
}