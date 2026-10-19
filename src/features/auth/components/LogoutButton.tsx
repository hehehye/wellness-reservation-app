"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAction } from "../hooks/logout.actions";
import { toast } from "sonner";

export default function Logoutbutton() {
  const router = useRouter();
  const onLogout = async () => {
    await logoutAction();
    toast.success("성공적으로 로그아웃했어요.");
    router.push("/");
  };
  return (
    <button
      className="flex items-center gap-4 rounded-xl px-3 py-3 text-[16px] 
      w-full text-center transition-colors hover:bg-black/5"
      type="button"
      onClick={onLogout}
    >
      <span aria-hidden className="shrink-0">
        <LogOut />
      </span>
      <span>로그아웃</span>
    </button>
  );
}
