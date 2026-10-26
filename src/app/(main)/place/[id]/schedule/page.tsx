import { getSessions } from "@/features/sessions/api/sessions";
import CalendarList from "@/features/sessions/components/CalendarList";
import SessionCalendar from "@/features/sessions/components/SessionCalendar";
import { SessionItem } from "@/features/sessions/types/Session";
import PageHeader from "@/features/shared/ui/PageHeader";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;

  searchParams: Promise<{ selectedDate?: string }>;
}) {
  const { id } = await params;
  const { selectedDate } = await searchParams;
  const sessions: SessionItem[] = await getSessions(id);
  // ?selectedDate=2026-10-27

  // 서버 시각(UTC) → 한국 날짜
  const kstYmd = (iso: string) =>
    new Date(new Date(iso).getTime() + 9 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

  const daySessions = selectedDate
    ? sessions.filter((s) => kstYmd(s.start_at) === selectedDate)
    : sessions;
  return (
    <main>
      <PageHeader title="스케줄확인" back home />
      <section className="py-20 w-full">
        <SessionCalendar sessions={sessions} id={id} />
        <div className="py-2 my-2 w-full bg-stone-100" />
        <CalendarList sessions={daySessions} />
      </section>
    </main>
  );
}
