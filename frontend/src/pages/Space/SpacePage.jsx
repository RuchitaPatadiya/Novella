import { Link } from 'react-router-dom'
import ChooseYourSpace from '../../components/space/Chooseyourspace'
import ShopTheLook from '../../components/space/ShopTheLook'
import WabiSabiGuide from '../../components/space/WabiSabiGuide'
import StyledByYou from '../../components/space/StyledByYou'
import BrandStrip from '../../components/home/BrandStrip'
import AtelierHero from '../../components/common/AtelierHero'

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
      <AtelierHero 
        eyebrow="Design Every Corner"
        title="Your Home, Your Story"
        subtitle="Shop curated pieces room by room — from social living areas to peaceful bed sanctuaries, every corner of your home deserves wabi-sabi intention."
        bottomText="↓ Discover Spaces ↓"
        images={[
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
          "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=80",
          "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80"
        ]}
      />
      <ChooseYourSpace />
      <ShopTheLook />
      <WabiSabiGuide />
      <StyledByYou />
      <BrandStrip />
    </div>
  )
}

export default SpacePage
