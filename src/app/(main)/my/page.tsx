import Link from "next/link";
import {
  CalendarCheck,
  ChevronRight,
  Heart,
  Megaphone,
  MessageSquareText,
  Receipt,
  Headset,
  Settings,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/app/utils/supabase/server";
import { logoutAction } from "@/features/auth/hooks/logout.actions";
import PageHeader from "@/features/shared/ui/PageHeader";

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const MENU_GROUPS: { title: string; items: MenuItem[] }[] = [
  {
    title: "나의 활동",
    items: [
      { href: "/booking", label: "예약 관리", icon: CalendarCheck },
      { href: "/my/order", label: "결제 내역", icon: Receipt },
      { href: "/like", label: "나의 찜", icon: Heart },
      { href: "/my/review", label: "나의 리뷰", icon: MessageSquareText },
    ],
  },
  {
    title: "고객 지원",
    items: [
      { href: "/notice", label: "공지사항", icon: Megaphone },
      { href: "/support", label: "고객센터", icon: Headset },
      { href: "/settings", label: "설정", icon: Settings },
    ],
  },
];

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 이메일 가입: nickname / 소셜 로그인: full_name, name
  const meta = user?.user_metadata ?? {};
  const name: string =
    meta.full_name ?? meta.name ?? meta.nickname ?? "로그인이 필요합니다.";
  const nickname: string = meta.nickname ?? user?.email?.split("@")[0] ?? "";
  return (
    <div>
      <PageHeader title="마이페이지" />
      <main className="px-page pt-16 pb-24">
        {/* 프로필 카드 */}
        <section className="flex items-center gap-4 rounded-card border border-border bg-surface p-4">
          {/* 프로필 이미지 준비 전까지 더미 아바타 */}
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary-soft/20 text-primary">
            <UserRound className="size-8" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-text">{name}</p>
            {nickname && (
              <p className="truncate text-sm text-muted">@{nickname}</p>
            )}
          </div>
          {/* TODO: 프로필 관리 기능 */}
          <button
            type="button"
            className="shrink-0 rounded-control border border-border px-3 py-1.5 text-sm font-medium text-text transition hover:bg-primary-soft"
          >
            프로필 관리
          </button>
        </section>

        {/* 메뉴 리스트 */}
        {MENU_GROUPS.map((group) => (
          <section key={group.title} className="pt-6">
            <h2 className="px-1 pb-2 text-sm font-medium text-muted">
              {group.title}
            </h2>
            <ul className="divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
              {group.items.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-primary-soft"
                  >
                    <Icon className="size-5 text-primary" aria-hidden />
                    <span className="flex-1 text-text">{label}</span>
                    <ChevronRight className="size-4 text-muted" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {user ? (
          <form action={logoutAction} className="pt-6 text-center">
            <button
              type="submit"
              className="cursor-pointer text-sm text-muted underline underline-offset-2"
            >
              로그아웃
            </button>
          </form>
        ) : (
          <Link href={"/login"}>
            <div className="pt-6 text-center">
              <button
                type="button"
                className="cursor-pointer text-sm text-muted underline underline-offset-2"
              >
                로그인
              </button>
            </div>
          </Link>
        )}
      </main>
    </div>
  );
}
