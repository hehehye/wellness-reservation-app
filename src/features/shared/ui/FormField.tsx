import { cloneElement, useId } from "react";
import { cn } from "../lib/cn";

type FieldProps = {
  id?: string;
  error?: boolean;
  "aria-describedby"?: string;
};

type Props = {
  label: string;
  error?: string | null; // 에러 문구 (없으면 null)
  hint?: string; // 평소에 보여줄 안내 문구
  required?: boolean; // 라벨 옆 * 표시만 담당
  className?: string;
  children: React.ReactElement<FieldProps>; // Input 한 개
};

export function FormField({
  label,
  error,
  hint,
  required,
  className,
  children,
}: Props) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint; // 에러가 있으면 에러가 우선

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {/* 자식 Input에 id, error, aria-describedby를 자동으로 연결 */}
      {cloneElement(children, {
        id,
        error: !!error,
        "aria-describedby": message ? messageId : undefined,
      })}

      {message && (
        <p style={{ color: "red" }} 
          id={messageId}
          role={error ? "alert" : undefined}
          className={cn("text-sm", error ? "text-red-500" : "text-red-500")}
        >
          {message}
        </p>
      )}
    </div>
  );
}