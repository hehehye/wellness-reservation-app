type FieldProps = {
  id?: string;
  error?: boolean;
  "aria-describedby"?: string;
};

type Props = {
  children: React.ReactElement<FieldProps>; // Input 한 개
};

export default function BottomFixedBar({ children }: Props) {
  return (
    <nav
      className="fixed m-auto w-full inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]
    sm:max-w-[520px]"
    >
      <div className="mx-auto flex h-16  items-center justify-between">
        {children}
      </div>
    </nav>
  );
}
