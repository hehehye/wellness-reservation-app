import { getSessions } from "@/features/sessions/api/sessions";
import CalendarList from "@/features/sessions/components/CalendarList";
import SessionCalendar from "@/features/sessions/components/SessionCalendar";
import { SessionItem } from "@/features/sessions/types/Session";
import PageHeader from "@/features/shared/ui/PageHeader";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessions: SessionItem[] = await getSessions(id);
  return (
    <main>
      <PageHeader title="스케줄확인" back />

      <section className="py-24">
        <SessionCalendar sessions={sessions} />
        <CalendarList sessions={sessions} />
      </section>
    </main>
  );
}
