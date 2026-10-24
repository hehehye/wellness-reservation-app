"use client";

import { Button } from "@/features/shared/ui/Button";
import { StarRating } from "./StarRating";
import { ImageStrip } from "@/features/shared/ui/ImageStrip";
import { usePostDraft } from "@/features/shared/hooks/usePostDraft";

export default function ReviewWriteForm() {
  const { draft, error, addFiles, removeImage, setField, canSubmit } =
    usePostDraft();
  // const [state, form, error] = useFormState
  return (
    <form action="">
      {/* 이미지 */}
      <section aria-labelledby="images-label" className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 id="images-label" className="text-sm font-bold">
            사진
          </h2>
          <span className="text-xs text-ink-3">
            장당 최대 4MB · 첫 장이 대표 이미지
          </span>
        </div>
        <ImageStrip
          images={draft.images}
          onAddFiles={addFiles}
          onRemove={removeImage}
        />
        {error && (
          <p role="alert" className="text-xs font-medium text-danger">
            {error}
          </p>
        )}
      </section>
      <section className="mt-8 w-full flex justify-center">
        <StarRating />
      </section>
      <textarea
        placeholder="체험 경험을 솔직하게 적어주세요."
        name="content"
        className="my-4 block h-48 w-full resize-none border border-gray-200 p-2 text-left align-top leading-normal"
      />
      <br /> <Button className="w-full">작성하기</Button>
    </form>
  );
}
