import SignForm from "@/features/auth/components/SignForm";
import PageHeader from "@/features/shared/ui/PageHeader";

export default function Page() {
  return (
    <div>
      <PageHeader title={"회원가입"} back={true}/>
      <section className="py-22 px-page">
        <SignForm />
      </section>
    </div>
  );
}
