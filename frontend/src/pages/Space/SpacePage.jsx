import { Link } from 'react-router-dom'
import SpacesHero from '../../components/space/Spaceshero'
import ChooseYourSpace from '../../components/space/Chooseyourspace'
import FeaturedSpace from '../../components/space/FeaturedSpace'
import InspirationGallery from '../../components/space/InspirationGallery'
import WabiSabiGuide from '../../components/space/WabiSabiGuide'
import BrandStrip from '../../components/home/BrandStrip'

const SpacePage = () => {
  return (
    <div className="bg-background pt-[76px] min-h-screen">
      {/* Breadcrumbs Row */}
      <div className="px-[clamp(1.5rem,5vw,4rem)] py-5 border-b border-border bg-background animate-fadeIn">
        <div className="flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          <Link to="/" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-normal">Spaces</span>
        </div>
      </div>
      <SpacesHero />
      <ChooseYourSpace />
      <FeaturedSpace />
      <InspirationGallery />
      <WabiSabiGuide />
      <BrandStrip />
    </div>
  )
}

export default SpacePage
