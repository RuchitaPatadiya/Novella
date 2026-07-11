import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function EditorialBreak() {
  const [promoData, setPromoData] = useState({
    eyebrow: "Exclusive Privilege",
    title: "Enjoy 10% Off Your First Order",
    code: "WELCOME10",
    subtext: "Use code WELCOME10 at checkout to unlock your introductory savings. Enjoy complimentary white-glove shipping on your first purchase.",
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1600&q=85",
    linkText: "Shop the Collection",
    linkPath: "/shop"
  });

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const res = await API.get("/cms/home_editorial_promo");
        if (res.data) {
          setPromoData({
            eyebrow: res.data.eyebrow || "Exclusive Privilege",
            title: res.data.title || "Enjoy 10% Off Your First Order",
            code: res.data.code || "WELCOME10",
            subtext: res.data.subtext || "Use code WELCOME10 at checkout to unlock your introductory savings. Enjoy complimentary white-glove shipping on your first purchase.",
            image: res.data.image || "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1600&q=85",
            linkText: res.data.linkText || "Shop the Collection",
            linkPath: res.data.linkPath || "/shop"
          });
        }
      } catch (err) {
        console.error("Failed to load CMS editorial promo settings:", err);
      }
    };
    fetchPromo();
  }, []);

  return (
    <section className="bg-surface py-16 md:py-20 border-y border-border">
      <div className="px-[clamp(1.5rem,5vw,4rem)]">
        <div className="grid lg:grid-cols-2 gap-0 border border-border overflow-hidden">

          <div className="relative h-[320px] lg:h-auto lg:min-h-[440px] overflow-hidden">
            <img
              src={promoData.image}
              alt="Refined interior by Novella"
              className="absolute inset-0 w-full h-full object-cover object-[center_40%] brightness-[0.92] saturate-[0.95]"
            />
          </div>

          <div className="flex flex-col justify-center bg-background px-8 md:px-12 py-12 lg:py-16">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                {promoData.eyebrow}
              </span>
            </div>

            <h2 className="font-display font-light text-[clamp(1.8rem,4vw,2.8rem)] text-ink m-0 leading-[1.1] tracking-[-0.01em]">
              {promoData.title}
            </h2>

            <p className="font-body font-light text-[0.88rem] text-muted mt-5 mb-8 max-w-md leading-[1.8] tracking-[0.03em] m-0">
              {promoData.subtext}
            </p>

            <Link
              to={promoData.linkPath}
              className="no-underline inline-flex items-center gap-3 self-start group"
            >
              <span className="font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase bg-ink text-cream-muted px-7 py-3.5 transition-colors duration-300 group-hover:bg-gold group-hover:text-dark">
                {promoData.linkText}
              </span>
              <svg
                width="18" height="8" viewBox="0 0 18 8" fill="none"
                className="text-bronze transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
