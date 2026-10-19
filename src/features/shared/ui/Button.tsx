import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/shared/lib/cn";

const button = cva(
  "inline-flex items-center justify-center rounded-control font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:opacity-90",
        outline: "border border-primary bg-surface text-primary",
        ghost: "text-muted hover:bg-primary-soft",
        danger: "bg-danger text-white",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-base",
        lg: "h-13 px-5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export function Button({ variant, size, className, ...props }: Props) {
  return <button className={cn(button({ variant, size }), className)}
   {...props} />;
}