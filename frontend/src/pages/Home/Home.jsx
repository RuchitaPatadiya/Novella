import React from "react";
import HeroSection from "../../components/home/Herosection";
import ShopByCategory from "../../components/home/ShopByCategory";
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

      {/* 2. Shop by curated Categories */}
      <ShopByCategory />

      {/* 3. Brand Narrative philosophy */}
      <EditorialBreak />

      {/* 4. Shop by curated Spaces */}
      <ShopBySpace />

      {/* 5. Live database dynamic Best Sellers catalog */}
      <BestSellers />

      {/* 6. Social proof reviews */}
      <CustomerReviews />

      {/* 7. Standard shipping information strip */}
      <BrandStrip />
    </div>
  );
};

export default Home;
