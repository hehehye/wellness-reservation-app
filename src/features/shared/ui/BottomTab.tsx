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
      className="fixed m-auto w-full inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]
    sm:max-w-[520px]"
    >
      <ul className="mx-auto flex h-16  items-center justify-between">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2 text-xs transition-colors ${
                  active ? "font-semibold text-primary" : "text-gray-400"
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
