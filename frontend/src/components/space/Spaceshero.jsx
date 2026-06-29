import { Link } from "react-router-dom";

export default function SpacesHero() {
  return (
    <div className="relative h-[62vh] min-h-[460px] bg-dark-deep flex items-center justify-center overflow-hidden">

      <img
        src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1092&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Spaces"
        className="absolute inset-0 w-full h-full object-cover object-[center_40%] brightness-[0.55] saturate-90"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-dark-deep/70 via-transparent to-transparent" />

      <div className="relative z-10 text-center px-6 max-w-3xl">

        <div className="flex items-center justify-center gap-3 mb-5 translate-y-3">
          <span className="block w-7 h-px bg-gold" />
          <span className="font-body font-light text-[0.57rem] tracking-[0.45em] uppercase text-gold">
            Design Every Corner
          </span>
          <span className="block w-7 h-px bg-gold" />
        </div>

        <h1 className="font-display font-light text-[clamp(2.8rem,6.5vw,5.5rem)] text-cream m-0 leading-[1.05] tracking-[-0.01em]">
          Your Home,{" "}
          <em className="text-gold font-medium italic">
            Your Story
          </em>
        </h1>

        <p className="font-body font-light text-[0.88rem] text-cream-muted/50 mt-4 mb-8 tracking-[0.04em] leading-relaxed max-w-lg mx-auto">
          Shop curated pieces room by room — from living spaces to restful bedrooms, every corner deserves intention.
        </p>
      </div>

      <div className="absolute bottom-5 right-10 hidden md:flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-10 bg-cream-muted/20 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-[45%] bg-gold"
            style={{ animation: "scrollDrop 2s ease-in-out infinite" }}
          />
        </div>
        <span className="font-body font-light text-[0.48rem] tracking-[0.3em] uppercase text-cream-muted [writing-mode:vertical-rl]">
          Scroll
        </span>
      </div>

      <style>{`
        @keyframes scrollDrop {
          0%   { transform: translateY(-100%); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
