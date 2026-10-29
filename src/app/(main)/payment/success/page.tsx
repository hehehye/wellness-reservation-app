import { createClient } from "@/app/utils/supabase/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    orderId?: string;
    paymentKey?: string;
    amount?: string;
  }>;
}) {
  const { orderId, paymentKey, amount } = await searchParams;
  if (!orderId || !paymentKey || !amount) notFound();

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/bookings/${orderId}/pay`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ paymentKey, amount: Number(amount) }),
      cache: "no-store",
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    return (
      <main className="px-page py-16 text-center">
        <h1 className="text-lg font-bold text-text">
          결제를 완료하지 못했어요
        </h1>
        <p className="mt-2 text-sm text-muted">
          {err?.message ?? `잠시 후 다시 시도해 주세요. (${res.status})`}
        </p>
        <Link
          href={`/booking/${orderId}`}
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white"
        >
          예약 내역 보기
        </Link>
      </main>
    );
  }

  redirect(`/booking/${orderId}`);
}
