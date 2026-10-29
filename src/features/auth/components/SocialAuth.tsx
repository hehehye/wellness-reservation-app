"use client";

import { createClient } from "@/app/utils/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";

export function GoogleLoginButton() {
  const supabase = createClient();
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="cursor-pointer flex items-center gap-2"
    >
      <FcGoogle size={20} />
      구글로 시작하기
    </button>
  );
}

export default function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    // fetch/axios 아님 — 반드시 location 이동으로 브라우저를 리다이렉트해야 카카오 로그인 창이 뜸
    window.location.href = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/kakao`;
  };

  return (
    <button
      className="cursor-pointer flex items-center gap-2"
      onClick={handleKakaoLogin}
    >
      <RiKakaoTalkFill size={22} /> 카카오로 시작하기
    </button>
  );
}
