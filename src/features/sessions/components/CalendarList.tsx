import { SessionItem } from "../types/Session";

export default function CalendarList({
  sessions,
}: {
  sessions: SessionItem[];
}) {
  return (
    <div>
      {sessions.map((session) => (
        <div key={session.id}></div>
      ))}
    </div>
  );
}
