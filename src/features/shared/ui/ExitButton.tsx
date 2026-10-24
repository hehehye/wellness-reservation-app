"use client";

import { ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function ExitButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="cursor-pointer"
      onClick={() => router.back()}
      aria-label="뒤로가기"
    >
      <X onClick={() => router.back()} />
    </button>
  );
}
export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="cursor-pointer"
      onClick={() => router.back()}
      aria-label="뒤로가기"
    >
      <ChevronLeft />
    </button>
  );
}
