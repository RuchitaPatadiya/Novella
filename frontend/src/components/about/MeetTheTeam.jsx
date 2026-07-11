import { useEffect, useState } from "react";
import API from "../../services/api";

const fallbackTeam = [
  {
    name: "Ananya Sharma",
    role: "Founder & Creative Director",
    bio: "I design for the moments you don't notice — the way morning light hits a surface, the way a chair invites you to sit.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=85",
  },
  {
    name: "Rohan Mehta",
    role: "Head of Product Design",
    bio: "Good design is invisible. You shouldn't think about a chair — you should just feel at home in it.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=85",
  },
  {
    name: "Priya Nair",
    role: "Lead Interior Stylist",
    bio: "Every collection starts with a question — what kind of life does this space want to support?",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=85",
  },
];

export default function MeetTheTeam() {
  const [hoveredId, setHoveredId] = useState(null);
  const [team, setTeam] = useState(fallbackTeam);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await API.get("/cms/team_members");
        if (res.data && Array.isArray(res.data)) {
          setTeam(res.data);
        }
      } catch (err) {
        console.error("Failed to load CMS team settings:", err);
      }
    };
    fetchTeam();
  }, []);

  return (
    <section className="bg-surface py-20 px-[clamp(2rem,8vw,6rem)] border-y border-border">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
                The People
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.1]">
              Meet the{" "}
              <em className="text-bronze font-medium italic">Team</em>
            </h2>
          </div>

          <p className="font-body font-light text-[0.85rem] text-muted max-w-xs leading-relaxed hidden md:block tracking-[0.03em]">
            A small team of designers, makers, and home obsessives — united by one belief.
          </p>
        </div>

        <div className="h-px mb-14 bg-gradient-to-r from-bronze/40 to-transparent" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, i) => {
            const memberId = member.name.replace(/\s+/g, "-");
            const hovered = hoveredId === memberId;
            const initialLetter = member.name.charAt(0);

            return (
              <div
                key={memberId}
                className="group flex flex-col overflow-hidden border border-border bg-background hover:border-bronze/40 transition-colors duration-300"
                onMouseEnter={() => setHoveredId(memberId)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative h-[380px] overflow-hidden bg-surface">
                  <img
                    src={member.image}
                    alt={member.name}
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ${hovered ? "scale-105" : "scale-100"}`}
                  />

                  <span className="absolute top-4 left-4 font-display font-light italic text-ink/15 text-[2.5rem] leading-none select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="p-5 border-t border-border flex flex-col gap-3">
                  <p
                    className={`font-display font-light italic text-[0.88rem] text-muted m-0 leading-[1.6] transition-all duration-300 ${
                      hovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 h-0 overflow-hidden"
                    }`}
                  >
                    "{member.bio || member.quote}"
                  </p>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display font-medium text-[1.15rem] text-ink m-0 mb-1 leading-tight group-hover:text-bronze transition-colors duration-200">
                        {member.name}
                      </h3>
                      <p className="font-body font-normal text-[0.65rem] tracking-[0.15em] uppercase text-muted m-0">
                        {member.role}
                      </p>
                    </div>

                    <div className="w-10 h-10 flex items-center justify-center shrink-0 border border-border transition-all duration-300 group-hover:border-bronze">
                      <span className="font-display font-medium text-[1rem] text-muted group-hover:text-bronze transition-colors duration-300">
                        {initialLetter}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center gap-6 p-8 border border-border bg-background">
          <div className="flex items-center shrink-0">
            {team.map((m, i) => (
              <div
                key={m.name}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-background"
                style={{ marginLeft: i === 0 ? "0" : "-10px", zIndex: team.length - i }}
              >
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-full object-cover object-top brightness-[0.92] saturate-[0.95]"
                />
              </div>
            ))}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-background bg-bronze"
              style={{ marginLeft: "-10px" }}
            >
              <span className="font-body font-medium text-[0.55rem] text-background">+12</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="font-display font-medium text-[1rem] text-ink m-0 mb-1 leading-snug">
              A team of 15 designers, craftspeople, and home enthusiasts.
            </p>
            <p className="font-body font-light text-[0.82rem] text-muted m-0">
              All working from our studio in Mumbai — and all deeply committed to the homes we help create.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
