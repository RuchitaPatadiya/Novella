import React from "react";

const stylingTips = [
  {
    step: "01",
    title: "Embrace Asymmetry & Air",
    description: "Avoid rigid showroom grids. Let your furniture breathe by placing items slightly off-center, leaving plenty of empty space (Ma) to let the room's energy settle.",
  },
  {
    step: "02",
    title: "Contrast Raw & Refined",
    description: "Layer rough textures against soft ones. Place a textured Belgian bouclé sofa next to a honed travertine block table, or a plaster-cast vase on a smooth dark walnut dresser.",
  },
  {
    step: "03",
    title: "Diffuse Muted Warm Light",
    description: "Incorporate low-level ambient lighting rather than harsh overhead fixtures. Alabaster wall sconces and plaster dome pendants cast warm, textured shadows that reveal character.",
  },
];

export default function WabiSabiGuide() {
  return (
    <section className="bg-background py-16 md:py-20 border-b border-border">
      <div className="px-[clamp(1.5rem,5vw,4rem)]">
        
        {/* Title Block */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="block w-5 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
              The Art of Placement
            </span>
          </div>
          <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.1] mb-4">
            How to Style a{" "}
            <em className="text-bronze font-medium italic">Wabi-Sabi Room</em>
          </h2>
          <p className="font-body font-light text-[0.88rem] text-muted leading-relaxed m-0">
            A guide to designing spaces that feel warm, organic, and intentionally imperfect.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stylingTips.map((tip) => (
            <div 
              key={tip.step} 
              className="group p-8 border border-border bg-surface flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:border-bronze/40 rounded-[2px]"
            >
              <div>
                <span className="block font-display font-light italic text-[1.4rem] text-bronze/40 mb-4 transition-colors duration-300 group-hover:text-bronze">
                  {tip.step}
                </span>
                <h3 className="font-display font-medium text-[1.15rem] text-ink m-0 mb-3 tracking-tight">
                  {tip.title}
                </h3>
                <p className="font-body font-light text-[0.82rem] leading-[1.8] text-muted m-0">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
