"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PendingImage, PostDraft } from "../ui/ImageStrip";
import { POST_LIMITS } from "@/app/utils/constants";

const makeId = () => crypto.randomUUID();

export function usePostDraft() {
  const [draft, setDraft] = useState<PostDraft>({
    images: [],
    title: "",
    content: "",
    categoryId: null,
  });
  const [error, setError] = useState<string | null>(null);

  // 언마운트 때 미리보기 URL 정리
  const imagesRef = useRef(draft.images);
  useEffect(
    () => () =>
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url)),
    [],
  );

  /** 파일 선택 / 드롭으로 들어온 사진 */
  const addFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const room = POST_LIMITS.maxImages - imagesRef.current.length;
    const tooBig = list.filter((f) => f.size > POST_LIMITS.maxFileBytes);
    const ok = list
      .filter((f) => f.size <= POST_LIMITS.maxFileBytes)
      .slice(0, Math.max(room, 0));

    if (tooBig.length)
      setError(`4MB가 넘는 사진 ${tooBig.length}장은 빼고 올렸어요.`);
    else if (list.length > room)
      setError(`사진은 최대 ${POST_LIMITS.maxImages}장까지 올릴 수 있어요.`);
    else setError(null);

    if (!ok.length) return;
    const next: PendingImage[] = ok.map((f) => ({
      id: makeId(),
      blob: f,
      url: URL.createObjectURL(f),
      name: f.name,
      editorJson: null,
    }));
    setDraft((d) => ({ ...d, images: [...d.images, ...next] }));
  }, []);

  const removeImage = useCallback((id: string) => {
    setDraft((d) => {
      const target = d.images.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return { ...d, images: d.images.filter((i) => i.id !== id) };
    });
    setError(null);
  }, []);

  const setField = useCallback(
    <K extends "title" | "content" | "categoryId">(
      key: K,
      value: PostDraft[K],
    ) => {
      setDraft((d) => ({ ...d, [key]: value }));
    },
    [],
  );

  const canSubmit =
    draft.images.length > 0 &&
    draft.title.trim().length > 0 &&
    draft.categoryId !== null;

  return {
    draft,
    error,
    addFiles,
    removeImage,
    setField,
    canSubmit,
  };
}
