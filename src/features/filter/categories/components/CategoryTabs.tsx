import { LucideIcon } from "lucide-react";
export function CategoryTabs({
  icon: Icon,
  label,
  selected = false,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 flex-col items-center gap-1.5 cursor-pointer"
    >
      <div
        className={`border rounded-full px-3 py-1 ${
          selected
            ? "bg-primary/20 border-primary text-primary font-medium"
            : "bg-white text-text border-stone-200"
        }`}
      >
        <span>{label}</span>
      </div>
    </button>
  );
}
