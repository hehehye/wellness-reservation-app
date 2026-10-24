"use client";
import { useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { ko } from "date-fns/locale";
import "react-day-picker/style.css";
import { SessionItem } from "../types/Session";

export default function SessionCalendar({
  sessions,
}: {
  sessions: SessionItem[];
}) {
  const [selected, setSelected] = useState<Date | undefined>();
  const defaults = getDefaultClassNames();
  const sessionDates = sessions.map((s) => new Date(s.start_at));
  console.log(sessionDates);
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={setSelected}
      locale={ko}
      modifiers={{ hasSession: sessionDates }} // 해당하는 수업 날짜에 점을 추가한다.
      modifiersClassNames={{
        hasSession:
          "relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-green-300",
      }}
      disabled={{ before: new Date() }} // 오늘 이전은 선택 불가
      classNames={{
        root: `${defaults.root}  rounded-2xl border border-border bg-surface p-3`,
        caption_label: `${defaults.caption_label} text-base font-bold`,
        today: "text-primary font-bold",
        selected: "bg-primary text-white rounded-full",
        disabled: "opacity-30",
      }}
    />
  );
}
