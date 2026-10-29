import Link from "next/link";
import { Heart } from "lucide-react";

export default function LikeLoginPrompt() {
  return (
    <section className="flex flex-col items-center px-6 py-48 text-center">
      <Heart className="mb-1 size-6 text-muted" aria-hidden />

      <h2 className="mt-2 text-sm font-bold text-muted">
        로그인하고 찜해보세요
      </h2>
      <p className="mt-1 text-sm text-muted">
        마음에 드는 장소를 저장하고 한곳에서 모아볼 수 있어요.
      </p>

      <Link
        href="/login"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
      >
        로그인 하러가기
      </Link>
    </section>
  );
}
