import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const input = cva(
  [
    "block w-full rounded-control border bg-surface text-text",
    "placeholder:text-muted",
    "focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-black",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-base",
      },
      error: {
        true: "border-danger",
        false: "border-border",
      },
    },
    defaultVariants: { size: "md", error: false },
  },
);

type Props = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof input>;

export function Input({ size, error, className, ...props }: Props) {
  return (
    <input
      {...props}
      aria-invalid={error || undefined}
      className={cn(input({ size, error }), className)}
    />
  );
}
