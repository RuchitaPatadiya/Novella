import { Link } from 'react-router-dom'
import CollectionsHero from '../../components/collection/CollectionsHero'
import CollectionGrid from '../../components/collection/CollectionGrid'
import TrendingNow from '../../components/collection/TrendingNow'
import DesignerSpotlight from '../../components/collection/DesignerSpotlight'
import StyleQuizBanner from '../../components/collection/StyleQuizBanner'
import BrandStrip from '../../components/home/BrandStrip'

const CollectionPage = () => {
  return (
    <div className="bg-background pt-[76px] min-h-screen">
      {/* Breadcrumbs Row */}
      <div className="px-[clamp(1.5rem,5vw,4rem)] py-5 border-b border-border bg-background animate-fadeIn">
        <div className="flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          <Link to="/" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-normal">Collections</span>
        </div>
      </div>

      {/* 1. Hero */}
      <CollectionsHero />

      {/* 2. Collection Grid — 6 curated worlds */}
      <CollectionGrid />

      {/* 3. Trending Now — Dynamic from DB (replaced FeaturedCollection) */}
      <TrendingNow />

      {/* 4. Designer Spotlight — Editorial (replaced NewArrivalsStrip) */}
      <DesignerSpotlight />

      {/* 5. Style Quiz */}
      <StyleQuizBanner />

      {/* 6. Brand Strip */}
      <BrandStrip />
    </div>
  )
}

export default CollectionPage
