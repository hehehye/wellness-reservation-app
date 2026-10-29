import MainHeader from "@/features/shared/ui/MainHeader";
import RecentPlacesSection from "@/features/places/components/RecentPlacesSection";
import BannerSlider from "@/features/banners/components/BannerSlider";

export default async function Home() {
  return (
    <div>
      <MainHeader />
      <section className="pt-16">
        <BannerSlider
          banners={[
            {
              id: "1",
              title: "배너1",
              className: "bg-red-200",
              image:
                "https://ynzicwrajdrvagueafqe.supabase.co/storage/v1/object/public/assets/banners/banner1.png",
            },
            {
              id: "2",
              title: "배너2",
              className: "bg-gray-200",
              image:
                "https://ynzicwrajdrvagueafqe.supabase.co/storage/v1/object/public/assets/banners/banner1.png",
            },
            {
              id: "3",
              title: "배너3",
              className: "bg-gray-200",
              image:
                "https://ynzicwrajdrvagueafqe.supabase.co/storage/v1/object/public/assets/banners/banner1.png",
            },
          ]}
        />
      </section>
      <div className="pt-4">
        <RecentPlacesSection />
      </div>
    </div>
  );
}
