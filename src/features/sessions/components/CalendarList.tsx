import Link from "next/link";
import { dateFormatter } from "../lib/format";
import { SessionItem } from "../types/Session";
import { ChevronRight } from "lucide-react";

export default function CalendarList({
  sessions,
}: {
  sessions: SessionItem[];
}) {
  return (
    <div className="px-page">
      {sessions.map((session) => (
        <Link href={`/schedule/${session.id}`} key={session.id}>
          <div className="flex justify-between items-center py-1">
            <div className="flex gap-4 justify-between items-center">
              <div>
                <p className="font-bold text-xl">
                  {new Date(session.start_at).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Asia/Seoul",
                  })}
                </p>
                <div>
                  <p className=" text-md">
                    <span> ~ </span>
                    {new Date(session.end_at).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                      timeZone: "Asia/Seoul",
                    })}
                  </p>
                </div>
              </div>
              <div className="bg-primary h-12 w-1 my-4" />
              <div>
                <b>{session.classes.title}</b>
                <p>{Number(session.classes.price).toLocaleString()}원</p>
              </div>
            </div>
            <div>
              <ChevronRight />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
