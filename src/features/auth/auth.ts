"use server";
import { validateEmail, validatePassword } from "./lib/validateForm";

export type State = { error?: string; success?: string } | undefined;
export async function loginAction(prevState: State, formData: FormData): Promise<State> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nickname = String(formData.get("nickname") ?? "");

//   // 1. 검사
//   const parsed = signupSchema.safeParse(raw);
//   if (!parsed.success) {
//     const fieldErrors: Partial<Record<SignupField, string>> = {};
//     for (const issue of parsed.error.issues) {
//       const key = issue.path[0] as SignupField;
//       fieldErrors[key] ??= issue.message; // 칸마다 첫 번째 에러만
//     }
//     return { fieldErrors, values };
//   }
  const emailError = validateEmail(email);
  if (emailError) return { error: emailError };
  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };
  // Supabase 로그인 ... 
  return { success: "저장됐어요!" };
}