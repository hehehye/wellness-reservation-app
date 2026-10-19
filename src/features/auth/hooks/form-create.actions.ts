// features/auth/actions.ts
"use server";
 
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

export type LoginState = { error: string; email: string } | null;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    
    if (error.code === "invalid_credentials") {
      return { error: "이메일 또는 비밀번호가 맞지 않아요. 다시 확인해주세요", email };
    }
    return {
      error: "가입 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
      email,
    };
  }
 

  redirect("/");  
}