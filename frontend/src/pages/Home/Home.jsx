import React from "react";
import HeroSection from "../../components/home/Herosection";
import EditorialBreak from "../../components/home/EditorialBreak";
import ShopBySpace from "../../components/home/ShopBySpace";
import BestSellers from "../../components/home/BestSellers";
import CustomerReviews from "../../components/home/CustomerReviews";
import BrandStrip from "../../components/home/BrandStrip";

const Home = () => {
  return (
    <div className="bg-background animate-fadeIn">
      {/* 1. Hero Welcome banner */}
      <HeroSection />

      {/* 2. Brand Narrative philosophy */}
      <EditorialBreak />

      {/* 3. Shop by curated Spaces */}
      <ShopBySpace />

      {/* 4. Live database dynamic Best Sellers catalog */}
      <BestSellers />

      {/* 5. Social proof reviews */}
      <CustomerReviews />

      {/* 6. Standard shipping information strip */}
      <BrandStrip />
    </div>
  );
};

export default Home;
