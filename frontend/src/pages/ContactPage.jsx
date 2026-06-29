import React from 'react'
import { Link } from 'react-router-dom'
import ContactHero from '../components/contact/ContactHero'
import QuickHelpCards from '../components/contact/QuickHelpCards'
import ContactForm from '../components/contact/ContactForm'
import StudioVisitBanner from '../components/contact/StudioVisitBanner'
import FAQStrip from '../components/contact/FaqStrip'

const ContactPage = () => {
  return (
    <div className="bg-background pt-[76px] min-h-screen">
      {/* Breadcrumbs Row */}
      <div className="px-[clamp(1.5rem,5vw,4rem)] py-5 border-b border-border bg-background animate-fadeIn">
        <div className="flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          <Link to="/" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-normal">Contact</span>
        </div>
      </div>
      <ContactHero />
        <QuickHelpCards />
        <ContactForm />
        <StudioVisitBanner />
        <FAQStrip />
    </div>
  )
}

export default ContactPage