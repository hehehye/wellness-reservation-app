"use client";

import { Input } from "@/features/shared/ui/Input";
import { SearchIcon, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClear = () => {
    setSearchValue("");
    router.push("/place");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchValue) params.set("q", searchValue);
    router.push(`/place?${params.toString()}`);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full relative flex items-center gap-2 rounded-xl"
    >
      <Input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="px-10 py-6"
        placeholder="장소, 지역을 검색해보세요."
      />
      <div className="absolute left-3">
        <SearchIcon color="var(--color-muted)" size={18} />
      </div>
      {searchValue && (
        <button type="button" onClick={handleClear} aria-label="검색어 지우기">
          <X className="w-8 h-8 text-gray-400 shrink-0" strokeWidth={2} />
        </button>
      )}
    </form>
  );
}
