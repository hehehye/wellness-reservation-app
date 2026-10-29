import SignForm from "@/features/auth/components/SignForm";
import PageHeader from "@/features/shared/ui/PageHeader";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <PageHeader title={"회원가입"} back={true} />
      <section className="py-22 px-page">
        <SignForm />
        <div>
          <Link href={`/login`}>
            <span className="py-5 text-muted justify-center flex underline underline-muted">
              로그인
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
