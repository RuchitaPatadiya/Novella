import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ModernMinimalist from "../../components/collection/ModernMinimalist";
import LuxuryLiving from "../../components/collection/LuxuryLiving";
import Scandinavian from "../../components/collection/Scandinavian";
import BohoChic from "../../components/collection/BohoChic";
import NewArrivals from "../../components/collection/NewArrivals";
import BestSellers from "../../components/collection/BestSellers";
import BrandStrip from "../../components/home/BrandStrip";
import ShopProductGrid from "../../components/shop/Shopproductgrid";
import { useProducts } from "../../context/ProductContext";
import API from "../../services/api";
import AtelierHero from "../../components/common/AtelierHero";

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
  const { products, loading: productsLoading } = useProducts();
  const [collectionInfo, setCollectionInfo] = useState(null);
  const [loadingCollection, setLoadingCollection] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (collectionComponents[collectionId]) {
      setCollectionInfo({
        name: collectionTitles[collectionId] || collectionId.replace("-", " "),
        tagline: "Curated Collection",
        image: ""
      });
      setLoadingCollection(false);
      return;
    }

    const fetchCollection = async () => {
      try {
        setLoadingCollection(true);
        const res = await API.get(`/collections/${collectionId}`);
        setCollectionInfo(res.data);
      } catch (err) {
        console.error("Failed to load collection details:", err);
        setCollectionInfo(null);
      } finally {
        setLoadingCollection(false);
      }
    };
    fetchCollection();
  }, [collectionId]);

  if (loadingCollection || productsLoading) {
    return (
      <div className="bg-background min-h-screen pt-32 flex items-center justify-center font-body text-[0.62rem] text-muted tracking-[0.2em] uppercase animate-pulse">
        Loading Collection...
      </div>
    );
  }

  if (!collectionInfo) {
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

  // Filter products by collection
  const filteredProducts = products.filter(
    (p) => p.collections && p.collections.includes(collectionId)
  );

  // Gallery images for AtelierHero: use product images first, then fill remaining slots with the collection hero image
  const collectionGalleryImages = [];
  filteredProducts.slice(0, 3).forEach((p) => {
    collectionGalleryImages.push(p.images?.[0] || p.image);
  });
  while (collectionGalleryImages.length < 3) {
    collectionGalleryImages.push(collectionInfo.image || "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80");
  }

  const SelectedCollectionComponent = collectionComponents[collectionId];

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
          <span className="text-ink font-normal">{collectionInfo.name}</span>
        </div>
      </div>

      {SelectedCollectionComponent ? (
        <SelectedCollectionComponent />
      ) : (
        <>
          {/* Generic Collection Hero */}
          <AtelierHero 
            eyebrow="Curated Collection"
            title={collectionInfo.name}
            subtitle={collectionInfo.tagline}
            bottomText="↓ Discover Catalog ↓"
            images={collectionGalleryImages}
          />

          {/* Collection Product Grid */}
          <div className="px-[clamp(1.5rem,5vw,4rem)] pt-12 pb-16 bg-background">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
              <span className="font-body text-[0.62rem] uppercase tracking-wider text-muted">
                {filteredProducts.length} pieces in this collection
              </span>
            </div>
            <ShopProductGrid
              products={filteredProducts}
              onClearFilters={() => {}}
            />
          </div>
        </>
      )}

      <BrandStrip />
    </div>
  );
};

export default CollectionDetailPage;
