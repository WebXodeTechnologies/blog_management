import SmoothScrollProvider from "@/components/homepage/SmoothScrollProvider";
import HomepageAuraWrapper from "@/components/homepage/HomepageAuraWrapper";
import HeroSection from "@/components/homepage/HeroSection";
import FeaturesGrid from "@/components/homepage/FeaturesGrid";
import TrendingArticles from "@/components/homepage/TrendingArticles";
import CallToActionSection from "@/components/homepage/CallToActionSection";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <HomepageAuraWrapper>
        <div className="min-h-screen selection:bg-blue-600 selection:text-white">
          <HeroSection />
          <FeaturesGrid />
          <TrendingArticles />
          <CallToActionSection />
        </div>
      </HomepageAuraWrapper>
    </SmoothScrollProvider>
  );
}
