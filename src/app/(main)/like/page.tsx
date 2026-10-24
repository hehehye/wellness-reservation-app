import { Suspense } from "react";
import { createClient } from "@/app/utils/supabase/server";
import { getLikes } from "@/features/likes/api/getLikes";
import LikeList from "@/features/likes/components/LikeList";
import LikeListSkeleton from "@/features/likes/components/LikeListSkeleton";
import LikeLoginPrompt from "@/features/likes/components/LikeLoginPrompt";
import PageHeader from "@/features/shared/ui/PageHeader";

// 데이터 fetch를 Suspense 안쪽 컴포넌트로 분리해야 fallback(스켈레톤)이 스트리밍된다
async function LikeListContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <LikeLoginPrompt />;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return <LikeLoginPrompt />;

  const places = await getLikes(session.access_token);
  return <LikeList places={places} />;
}

export default function Page() {
  return (
    <div>
      <PageHeader title="나의 찜" back />
      <main className="px-page pt-16 pb-24">
        <Suspense fallback={<LikeListSkeleton />}>
          <LikeListContent />
        </Suspense>
      </main>
    </div>
  );
}
