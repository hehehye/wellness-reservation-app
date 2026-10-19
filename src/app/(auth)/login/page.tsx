import LoginForm from "@/features/auth/components/LoginForm";
import KakaoLoginButton, {
  GoogleLoginButton,
} from "@/features/auth/components/SocialAuth";
import PageHeader from "@/features/shared/ui/PageHeader";

function SosialAuthSection() {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full py-3.5 cursor-pointer rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-text text-sm font-bold flex items-center justify-center gap-2">
        <KakaoLoginButton />
      </div>

      <div className="w-full py-3.5 border border-[#dadce0] hover:border-[#c8c9cb] cursor-pointer rounded-xl bg-[#ffffff] text-text text-sm font-bold flex items-center justify-center gap-2">
        <GoogleLoginButton />
      </div>
    </div>
  );
}
export default function Page() {
  return (
    <div>
      <PageHeader title={"로그인"} back={true} />
      <section className="py-22 px-page">
        <LoginForm />

        <div className="flex items-center gap-3 py-4">
          <div className="h-px flex-1 bg-line" />
          <span className="shrink-0 text-xs text-ink-3">또는</span>
          <div className="h-px flex-1 bg-line" />
        </div>
        
        <SosialAuthSection/>
      </section>
    </div>
  );
}
