import { useState } from "react";

interface Seat {
  name: string;
  price: number;
  stock: number;
}

const INITIAL_SEATS: Seat[] = [
  { name: "A1", price: 88000, stock: 1 },
  { name: "A2", price: 88000, stock: 1 },
  { name: "A3", price: 88000, stock: 0 },
  { name: "A4", price: 88000, stock: 1 },
  { name: "A5", price: 88000, stock: 0 },
];

type ReserveResult = { ok: true } | { ok: false; taken: string[] };

function canReserve(selected: string[], sold: Set<string>): ReserveResult {
  const taken = selected.filter((code) => sold.has(code));
  return taken.length === 0 ? { ok: true } : { ok: false, taken };
}

export default function SelectSeat() {
  const [seats] = useState<Seat[]>(INITIAL_SEATS);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSeat = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const handleReserve = () => {
    if (selected.length === 0) return;

    // 결제 시점에 재고를 확인해서 팔린 좌석 목록을 만들어요
    const sold = new Set(seats.filter((s) => s.stock <= 0).map((s) => s.name));
    const result = canReserve(selected, sold);

    if (!result.ok) {
      alert(
        `$(${result.taken.join(", ")})좌석은 이미 예매되었습니다. 해당 자리만 취소하겠습니다. `,
      );
      setSelected((prev) => prev.filter((n) => !result.taken.includes(n))); // 뺏긴 좌석은 선택에서 제거
      return;
    }

    alert(`${selected.join(", ")} 좌석 예매에 성공했어요`);
    setSelected([]);
  };

  return (
    <div>
      {seats.map((seat) => (
        <button
          key={seat.name}
          onClick={() => toggleSeat(seat.name)}
          className={`border px-3 py-2 ${selected.includes(seat.name) ? "bg-green-500 text-white" : ""}`}
        >
          {seat.name}
        </button>
      ))}
      <p>선택된 좌석: {selected.join(", ") || "없음"}</p>
      <button onClick={handleReserve}>선택한 좌석 예매하기</button>
    </div>
  );
}
