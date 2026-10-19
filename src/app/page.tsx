import MainHeader from "@/features/shared/ui/MainHeader";
import Link from "next/link";
import { createClient } from "./utils/supabase/server";
import { connection } from "next/server";
import { Suspense } from "react";
import Logoutbutton from "@/features/auth/components/LogoutButton";

async function AuthLinks() {
  await connection(); // 요청 때 실행하겠다고 선언
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <li>
      <Logoutbutton />
    </li>
  ) : (
    <>
      <li>
        <Link href="/login">로그인</Link>
      </li>
      <li>
        <Link href="/signup">회원가입</Link>
      </li>
    </>
  );
}
export default function Home() {
  return (
    <div>
      <MainHeader />
      <div className="pt-16">
        <h1>웰니스 예약시스템 홈페이지</h1>
        <ul className="cursor-pointer">
          <Suspense fallback={null}>
            <AuthLinks />
          </Suspense>
          <li>
            <Link href="/place">플레이스</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
