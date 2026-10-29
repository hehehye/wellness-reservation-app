"use client";
import { Activity, SlidersHorizontal } from "lucide-react";
import { CATEGORY_ICONS } from "../categories/components/CategoryIcon";
import { CategoryTabs } from "../categories/components/CategoryTabs";
import BottomFixedBar from "@/features/shared/ui/BottomFixedBar";
import { Button } from "@/features/shared/ui/Button";
import { Category } from "../categories/types/Category";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Amenity } from "../amenities/types/Amenity";

export default function FilterBar({
  categories,
  amenities,
}: {
  categories: Category[];
  amenities: Amenity[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedAmenity, setSelectedAmenity] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    // 바깥 클릭 시 닫기
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    // Esc로 닫기
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  // 카테고리 선택하기
  const handleSelectGenre = (categoryId: string) => {
    setSelectedCategory(
      (prev) =>
        prev.includes(categoryId)
          ? prev.filter((v) => v !== categoryId) // 이미 있으면 → 뺀다 (선택 해제)
          : [...prev, categoryId], // 없으면 → 추가한다 (선택)
    );
  };
  const handleSelectAmenity = (amenityId: string) => {
    setSelectedAmenity(
      (prev) =>
        prev.includes(amenityId)
          ? prev.filter((v) => v !== amenityId) // 이미 있으면 → 뺀다 (선택 해제)
          : [...prev, amenityId], // 없으면 → 추가한다 (선택)
    );
  };
  // 검색하기
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category"); // 기존 값 초기화
    params.delete("amenity"); // 기존 값 초기화
    selectedCategory.forEach((slug) => params.append("category", slug));
    selectedAmenity.forEach((slug) => params.append("amenity", slug));

    router.push(`/place?${params.toString()}`);
    setIsOpen(false); // 검색 후 시트 닫기
  };
  return (
    <>
      <Button variant={"ghost"} onClick={() => setIsOpen((v) => !v)}>
        <div className="flex items-center gap-2 mx-[-16px] mt-2 border border-stone-200 rounded-full px-3 py-1.5 hover:bg-primary-soft/10">
          <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          <span className="text-text/80 text-sm">필터링</span>
        </div>
      </Button>
      {isOpen && (
        <div className=" m-auto fixed inset-0 z-99 flex items-end justify-center bg-black/50 sm:max-w-[520px] lg:max-w-[520px]">
          <div
            ref={rootRef}
            className="  min-h-[60vh] rounded-t-3xl bg-white  border-t border-gray-200 pt-8 pb-24 px-page sm:max-w-[520px] lg:max-w-[520px]"
          >
            <section>
              <h2 className="font-bold mb-3">카테고리</h2>
              <div className="flex flex-wrap gap-2 ">
                {categories.map((category) => {
                  const Icon = CATEGORY_ICONS[category.icon] ?? Activity;
                  return (
                    <CategoryTabs
                      selected={selectedCategory.includes(category.slug)}
                      onClick={() => handleSelectGenre(category.slug)}
                      key={category.id}
                      icon={Icon}
                      label={category.name}
                    />
                  );
                })}
              </div>
            </section>
            <section className="py-8">
              <h2 className="font-bold mb-3">편의시설</h2>
              <div className="flex flex-wrap gap-2 ">
                {amenities.map((amenity) => {
                  const Icon = CATEGORY_ICONS[amenity.icon] ?? Activity;
                  return (
                    <CategoryTabs
                      selected={selectedAmenity.includes(amenity.slug)}
                      onClick={() => handleSelectAmenity(amenity.slug)}
                      key={amenity.id}
                      icon={Icon}
                      label={amenity.name}
                    />
                  );
                })}
              </div>
            </section>
            <BottomFixedBar>
              <Button
                className="w-full py-2 mx-2"
                onClick={() => {
                  handleSearch();
                }}
              >
                검색하기
              </Button>
            </BottomFixedBar>
          </div>
        </div>
      )}
    </>
  );
}
