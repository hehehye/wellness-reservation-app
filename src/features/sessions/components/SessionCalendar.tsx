"use client";
import { useEffect, useMemo, useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { ko } from "date-fns/locale";
import { SessionItem } from "../types/Session";
import { useRouter } from "next/navigation";

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const kstYmd = (iso: string) =>
  new Date(new Date(iso).getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

export default function SessionCalendar({
  sessions,
  id,
}: {
  sessions: SessionItem[];
  id: string;
}) {
  const defaults = getDefaultClassNames();
  const router = useRouter();

  const available = useMemo(
    () => new Set(sessions.map((s) => kstYmd(s.start_at))),
    [sessions],
  );

  const todayStr = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Seoul",
  });
  const [selected, setSelected] = useState<Date | undefined>(
    () => new Date(`${todayStr}T00:00:00`),
  );

  useEffect(() => {
    router.replace(`/place/${id}/schedule?selectedDate=${todayStr}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={(date) => {
        setSelected(date);
        if (date)
          router.push(`/place/${id}/schedule?selectedDate=${ymd(date)}`);
      }}
      locale={ko}
      disabled={[{ before: new Date() }, (d: Date) => !available.has(ymd(d))]}
      modifiers={{ sunday: { dayOfWeek: [0] } }}
      modifiersClassNames={{ sunday: "text-red-400" }}
      classNames={{
        root: `${defaults.root} w-full bg-surface px-2`,
        months: "relative w-full ",
        month: "w-full ",
        month_grid: "w-full ",
        month_caption: " flex h-10 items-center justify-center",
        caption_label: "py-4 text-lg font-bold",
        nav: "absolute inset-x-0 top-0 px-4 z-10 flex h-10 items-center justify-between",
        weekdays:
          "[&>th:first-child]:text-red-400 [&>th:last-child]:text-sky-400",
        weekday: "pt-6 text-sm font-medium text-muted",
        day: "py-2 h-12 w-auto p-0 text-sm text-text",
        day_button:
          "mx-auto flex size-10 items-center justify-center rounded-full",
        today: "font-bold text-primary",
        selected:
          "[&>button]:bg-primary! [&>button]:text-white! [&>button]:font-bold [&>button]:border-transparent!",
        disabled: "opacity-40",
      }}
    />
  );
}
