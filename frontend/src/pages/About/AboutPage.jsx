import { Link } from 'react-router-dom'
import AboutHero from '../../components/about/AboutHero'
import OurStory from '../../components/about/OurStory'
import OurValues from '../../components/about/OurValues'
import TheNumbers from '../../components/about/TheNumbers'
import MeetTheTeam from '../../components/about/MeetTheTeam'
import OurPromise from '../../components/about/OurPromise'
import BrandStrip from '../../components/home/BrandStrip'

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
      <AboutHero />
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
