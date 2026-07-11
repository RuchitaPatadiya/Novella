import { Link } from 'react-router-dom'
import OurStory from '../../components/about/OurStory'
import OurValues from '../../components/about/OurValues'
import TheNumbers from '../../components/about/TheNumbers'
import MeetTheTeam from '../../components/about/MeetTheTeam'
import OurPromise from '../../components/about/OurPromise'
import BrandStrip from '../../components/home/BrandStrip'
import AtelierHero from '../../components/common/AtelierHero'

const AboutPage = () => {
  return (
    <div className="bg-background pt-[76px] min-h-screen">
      {/* Breadcrumbs Row */}
      <div className="px-[clamp(1.5rem,5vw,4rem)] py-5 border-b border-border bg-background animate-fadeIn">
        <div className="flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          <Link to="/" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-normal">About</span>
        </div>
      </div>
      <AtelierHero 
        eyebrow="Our Design Story"
        title="Artisan Craftsmanship"
        subtitle="We believe that home is the most personal form of self-expression. Learn about our commitment to organic textures and wabi-sabi spaces."
        bottomText="↓ Read Our Story ↓"
        images={[
          "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=400&q=80",
          "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80"
        ]}
      />
      <OurStory />
      <OurValues />
      <TheNumbers />
      <MeetTheTeam />
      <OurPromise />
      <BrandStrip />
    </div>
  )
}

export default AboutPage
