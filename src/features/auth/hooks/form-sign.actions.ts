"use server";
import { redirect } from "next/navigation";
import { SignupField, signupSchema } from "../lib/schema";
import { createClient } from "@/app/utils/supabase/server";

export type SignupState = {
  fieldErrors?: Partial<Record<SignupField, string>>; // 칸별 에러
  error?: string; // 칸과 상관없는 에러 (서버 오류 등)
  notice?: string; // 메일 인증 안내
  values: { nickname: string; email: string }; // 실패해도 다시 채워줄 값
} | null;

export async function signUpAction(
  prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const raw = {
    nickname: String(formData.get("nickname") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const values = { nickname: raw.nickname, email: raw.email };

  // 1. 검사
  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<SignupField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as SignupField;
      fieldErrors[key] ??= issue.message; // 칸마다 첫 번째 에러만
    }
    return { fieldErrors, values };
  }

  // 2. Supabase (nickname은 users 테이블 트리거가 받아감)
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { nickname: parsed.data.nickname } },
  });

  if (error) {
    console.error("signUp error:", error.status, error.code, error.message);
    if (error.code === "user_already_exists") {
      return { fieldErrors: { email: "이미 가입된 이메일이에요" }, values };
    }
    return {
      error: "가입 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
      values,
    };
  }

  // 3. 이미 가입된 이메일 (메일 인증을 켜두면 에러 대신 빈 identities로 옴)
  if (data.user && data.user.identities?.length === 0) {
    return { fieldErrors: { email: "이미 가입된 이메일이에요" }, values };
  }

  // 4. 메일 인증을 켜뒀으면 세션이 없음 → 안내만
  if (!data.session) {
    return { notice: "인증 메일을 보냈어요. 메일함에서 확인해주세요.", values };
  }

  redirect("/");
}
