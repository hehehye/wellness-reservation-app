import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "magiclink" | null;

  const supabase = await createClient();
  let session = null;

  if (code) {
    // 구글 등 네이티브 Supabase OAuth
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    session = data.session;
  } else if (tokenHash && type) {
    // 카카오 - NestJS에서 발급한 magiclink 토큰
    const { data } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    session = data.session;
  }

  // if (session) {
  //   await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/users/sync`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${session.access_token}`,
  //     },
  //     body: JSON.stringify({
  //       name:
  //         session.user.user_metadata.full_name ??
  //         session.user.user_metadata.name ??
  //         "",
  //       avatar_url: session.user.user_metadata.avatar_url ?? "",
  //     }),
  //   });
  // }

  return NextResponse.redirect(`${origin}/`);
}
