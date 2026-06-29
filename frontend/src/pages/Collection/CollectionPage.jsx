import { Link } from 'react-router-dom'
import CollectionsHero from '../../components/collection/CollectionsHero'
import CollectionGrid from '../../components/collection/CollectionGrid'
import FeaturedCollection from '../../components/collection/FeaturedCollection'
import NewArrivalsStrip from '../../components/collection/NewArrivalStrip'
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
      <CollectionsHero />
      <CollectionGrid />
      <FeaturedCollection />
      <NewArrivalsStrip />
      <StyleQuizBanner />
      <BrandStrip />
    </div>
  )
}

export default CollectionPage
