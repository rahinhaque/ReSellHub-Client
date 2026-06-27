import FeaturedProducts from "@/components/FeaturedProducts";
import HeroBanner from "@/components/HeroBanner";
import MarketplaceStatistics from "@/components/MarketplaceStatistics";
import PopularCategory from "@/components/PopularCategories";
import SuccessStories from "@/components/SuccessStories";
import SustainabilityImpact from "@/components/SustainabilityImpact";
import TrustedSellersShowcase from "@/components/TrustedSellersShowcase";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <HeroBanner />
      <div className="w-full bg-white">
        <FeaturedProducts />
      </div>
      <div className="w-full bg-white">
        <PopularCategory />
      </div>
      <SuccessStories />
      <MarketplaceStatistics />
      <SustainabilityImpact />
      <TrustedSellersShowcase />
    </div>
  );
}
