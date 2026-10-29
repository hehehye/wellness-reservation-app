"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, CalendarDays, Heart, User } from "lucide-react";

const TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/map", label: "지도", icon: MapPin },
  { href: "/booking", label: "예약내역", icon: CalendarDays },
  { href: "/like", label: "찜", icon: Heart },
  { href: "/my", label: "마이", icon: User },
];

export default function BottomTab() {
  const pathname = usePathname();
  const HIDDEN = [
    /^\/place/,
    /^\/login/,
    /^\/signup/,
    /^\/schedule/,
    /^\/payment/,
    /^\/booking\/.+/,
    /^\/review/,
    /^\/map/,
  ];
  if (HIDDEN.some((re) => re.test(pathname))) return null;
  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mx-auto w-full px-4
    pb-[calc(env(safe-area-inset-bottom)+12px)] sm:max-w-[520px]"
    >
      <ul
        className="pointer-events-auto mx-auto flex h-16 w-full max-w-[400px] items-center gap-1 p-1.5
      rounded-full border border-white/50 bg-white/80
      supports-[backdrop-filter]:bg-white/55
      supports-[backdrop-filter]:backdrop-blur-sm
      supports-[backdrop-filter]:backdrop-saturate-150
      shadow-[0_8px_32px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.7)]"
      >
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <li key={href} className="h-full flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-0.5 rounded-full text-xs
              transition-[background-color,color,box-shadow] duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
              ${
                active
                  ? "bg-white/80 text-text shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                  : "text-gray-600 hover:bg-white/40"
              }`}
              >
                <Icon className="size-6" strokeWidth={active ? 2.5 : 2} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
