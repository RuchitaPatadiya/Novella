import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ModernMinimalist from "../../components/collection/ModernMinimalist";
import LuxuryLiving from "../../components/collection/LuxuryLiving";
import Scandinavian from "../../components/collection/Scandinavian";
import BohoChic from "../../components/collection/BohoChic";
import NewArrivals from "../../components/collection/NewArrivals";
import BestSellers from "../../components/collection/BestSellers";
import BrandStrip from "../../components/home/BrandStrip";

// Mapping collectionId to its respective component
const collectionComponents = {
  "modern-minimalist": ModernMinimalist,
  "luxury-living": LuxuryLiving,
  "scandinavian": Scandinavian,
  "boho-chic": BohoChic,
  "new-arrivals": NewArrivals,
  "best-sellers": BestSellers,
};

// Friendly collection titles for breadcrumbs
const collectionTitles = {
  "modern-minimalist": "Modern Minimalist",
  "luxury-living": "Luxury Living",
  "scandinavian": "Scandinavian",
  "boho-chic": "Boho Chic",
  "new-arrivals": "New Arrivals",
  "best-sellers": "Best Sellers",
};

const CollectionDetailPage = () => {
  const { collectionId } = useParams();
  const SelectedCollectionComponent = collectionComponents[collectionId];
  const title = collectionTitles[collectionId];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [collectionId]);

  if (!SelectedCollectionComponent) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pt-20">
        <h2 className="font-display font-light text-4xl text-ink mb-4">Collection Not Found</h2>
        <p className="font-body text-muted mb-8 text-center max-w-md">
          The curated design collection you are looking for is currently offline or unavailable.
        </p>
        <Link to="/collections" className="no-underline">
          <span className="px-8 py-3.5 bg-bronze text-background font-body font-medium text-xs tracking-widest uppercase hover:brightness-110 transition-all duration-200">
            View All Collections
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-[76px]">
      {/* Breadcrumbs Row */}
      <div className="px-[clamp(1.5rem,5vw,4rem)] py-5 border-b border-border bg-background">
        <div className="flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          <Link to="/" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Home
          </Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Collections
          </Link>
          <span>/</span>
          <span className="text-ink font-normal">{title}</span>
        </div>
      </div>

      {/* Render mapped collection view */}
      <SelectedCollectionComponent />

      <BrandStrip />
    </div>
  );
};

export default CollectionDetailPage;
