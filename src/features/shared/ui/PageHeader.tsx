  
import { BackButton, ExitButton } from "./ExitButton";

interface Props {
  title: string;
  exit?: boolean;
  back?: boolean;
}
export default function PageHeader({ title, exit, back }: Props) {
  return (
    <header className="fixed top-0 bg-white z-99 w-full sm:max-w-[517px]">
      <div className="flex px-2 justify-between py-3 bg-white border-b border-gray-200">
        <div className="flex-1">
          {exit && <ExitButton/>}
          {back && <BackButton />}
        </div>
        <div className="flex-1">
          <h1 className="flex-1 text-center font-bold">{title}</h1>
        </div>
        <div className="flex-1"></div>
      </div>
    </header>
  );
}
