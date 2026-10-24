import ReviewWriteForm from "@/features/reviews/components/ReviewWriteForm";
import PageHeader from "@/features/shared/ui/PageHeader";

export default function Page() {
  return (
    <main>
      <PageHeader title="리뷰남기기" back home />
      <section className="py-24 px-page">
        <ReviewWriteForm />
      </section>
    </main>
  );
}
