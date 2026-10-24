"use client";
import { Button } from "@/features/shared/ui/Button";
import { FormField } from "@/features/shared/ui/FormField";
import { Input } from "@/features/shared/ui/Input";
import { useActionState, useEffect, useState } from "react";
import {
  emailSchema,
  nicknameSchema,
  passwordSchema,
  validateField,
} from "../lib/schema";
import { signUpAction } from "../hooks/form-sign.actions";
import Link from "next/link";
import { toast } from "sonner";

export default function SignForm() {
  const [state, action, isPending] = useActionState(signUpAction, null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const serverEmailError =
    state?.values.email === email ? state?.fieldErrors?.email : null;
  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.notice) toast.success(state.notice);
  }, [state]);

  // 메일 인증 안내가 오면 폼 대신 안내 화면
  if (state?.notice) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <p className="text-base font-bold text-ink">거의 다 됐어요!</p>
        <p className="text-sm text-ink-2">{state.notice}</p>
        <Link
          href="/login"
          className="mt-2 text-xs font-semibold text-ink underline underline-offset-4"
        >
          로그인하러 가기
        </Link>
      </div>
    );
  }
  return (
    <form action={action}>
      <FormField
        label="이메일"
        className="py-2"
        error={emailError ?? serverEmailError}
      >
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailError(validateField(emailSchema, email))}
          error={!!emailError}
          placeholder="이메일 형식을 입력해주세요."
        />
      </FormField>

      <FormField label="비밀번호" className="py-2" error={passwordError}>
        <Input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() =>
            setPasswordError(validateField(passwordSchema, password))
          }
          error={!!passwordError}
          placeholder="비밀번호는 8자이상과 대문자, 특수문자1자를 포함해주세요."
        />
      </FormField>

      <FormField label="닉네임" className="py-2" error={nicknameError}>
        <Input
          value={nickname}
          name="nickname"
          onChange={(e) => setNickname(e.target.value)}
          onBlur={() =>
            setNicknameError(validateField(nicknameSchema, nickname))
          }
          error={!!nicknameError}
          placeholder="닉네임을 입력해주세요."
        />
      </FormField>
      <Button disabled={isPending} size={"md"} className="w-full my-3 text-sm">
        {isPending ? "가입하는 중…" : "가입하기"}
      </Button>
    </form>
  );
}
