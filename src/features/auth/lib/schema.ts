import { z } from "zod";

// 비밀번호는 8자이상 32자 이하 입력하여야 합니다.
// 비밀번호는 대소문자를 구분하며, 대문자1개이상을 포함하고 숫자 1개 이상을 포함하여야합니다.
// 비밀번호는 영문 숫자 특수문자(@ # ! ^ * ~)만 입력가능하며 1개이상을 포함하여야합니다.
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;

// 허용 문자: 영문 대소문자, 숫자, 특수문자(@ # ! ^ * ~)
const ALLOWED_CHARS_REGEX = /^[A-Za-z0-9@#!^*~]+$/;
const UPPERCASE_REGEX = /[A-Z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHAR_REGEX = /[@#!^*~]/;

// ---------- 필드별 스키마 (onBlur에서 하나씩 검사할 때도 사용) ----------
export const emailSchema = z
  .string()
  .trim()
  .min(1, "이메일을 입력해 주세요")
  .email("이메일 형식이 아니에요");

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, "8자 이상 입력해 주세요")
  .max(PASSWORD_MAX_LENGTH, "32자 이하로 입력해 주세요")
  .regex(ALLOWED_CHARS_REGEX, "영문, 숫자, 특수문자(@ # ! ^ * ~)만 가능해요")
  .regex(UPPERCASE_REGEX, "대문자를 1개 이상 포함해 주세요")
  .regex(NUMBER_REGEX, "숫자를 1개 이상 포함해 주세요")
  .regex(SPECIAL_CHAR_REGEX, "특수문자를 1개 이상 포함해 주세요");

export const nicknameSchema = z
  .string()
  .trim()
  .min(2, "닉네임은 2자 이상이어야 해요")
  .max(20, "닉네임은 20자까지 돼요");

// ---------- 제출용 전체 스키마 (서버 액션에서 재검증) ----------
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  // passwordConfirm: z.string(),
  nickname: nicknameSchema,
});
// .refine((v) => v.password === v.passwordConfirm, {
//   message: "비밀번호가 서로 달라요",
//   path: ["passwordConfirm"], // 에러를 비밀번호 확인 칸에 표시
// });

export type SignupField = "nickname" | "email" | "password" | "passwordConfirm";

// ---------- 한 필드만 검사 → 에러 문구 또는 null ----------
export function validateField(
  schema: z.ZodType,
  value: unknown,
): string | null {
  const result = schema.safeParse(value);
  return result.success ? null : result.error.issues[0].message;
}
