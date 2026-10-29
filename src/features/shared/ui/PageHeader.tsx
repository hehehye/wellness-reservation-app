import { HomeIcon } from "lucide-react";
import { BackButton, ExitButton } from "./ExitButton";
import Link from "next/link";

interface Props {
  title: string;
  exit?: boolean;
  back?: boolean;
  home?: boolean;
}
export default function PageHeader({ title, exit, back, home }: Props) {
  return (
    <header className="fixed top-0 bg-white z-99 w-full sm:max-w-[517px]">
      <div className="flex px-2 justify-between py-3 bg-white border-b border-gray-200">
        <div className="flex-1">
          {exit && <ExitButton />}
          {back && <BackButton />}
        </div>
        <div className="flex-1">
          <h1 className="flex-1 text-center truncate font-bold">{title}</h1>
        </div>
        <div className="flex-1">
          {home && (
            <Link href={"/"}>
              <HomeIcon className="absolute right-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
