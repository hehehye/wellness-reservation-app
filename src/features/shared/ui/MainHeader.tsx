import { SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export default function MainHeader() {
  return (
    <header className="fixed top-0 bg-white z-99 w-full sm:max-w-[517px]">
      <div className="flex px-3 justify-between py-5 bg-white border-b border-gray-200">
        <div>
          <h1 className="font-bold text-primary text-xl">Wellny</h1>
        </div>
        <div className="flex-1"></div>
        <div className="flex gap-3">
          <Link href={"my"}>
            <UserIcon size={24} />
          </Link>
          <Link href={"/place"}>
            <SearchIcon size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}
