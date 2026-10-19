import { SearchIcon, UserIcon } from "lucide-react";

export default function MainHeader() {
  return (
    <header className="fixed top-0 bg-white z-99 w-full sm:max-w-[517px]">
      <div className="flex px-3 justify-between py-4 bg-white border-b border-gray-200">
        <div>
            <h1 className="font-bold text-primary">WELLNESS</h1>
        </div>
        <div className="flex-1"></div>
        <div className="flex gap-3">
            <UserIcon size={24}/>
            <SearchIcon size={22}/>
        </div>
      </div>
    </header>
  );
}
