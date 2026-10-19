"use client";
import { Button } from "@/features/shared/ui/Button";
import { FormField } from "@/features/shared/ui/FormField";
import { Input } from "@/features/shared/ui/Input";
import { useActionState  } from "react";  
import { loginAction } from "../hooks/form-create.actions";

export default function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, null);

  return (
    <form action={action}>
      <FormField label="이메일" className="py-2">
        <Input
          type="email"
          name="email"
          defaultValue={state?.email ?? ""}
          autoComplete="email"
          required
          placeholder="이메일을 입력해주세요."
        />
      </FormField>

      <FormField label="비밀번호" className="py-2">
        <Input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력해주세요"
          required
        />
      </FormField>

      {state?.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <Button 
        disabled={isPending}
        size={"md"}
        className="w-full my-3 text-sm"
      >
        {isPending ? "가입하는 중…" : "로그인"}
      </Button>
    </form>
  );
}
