import { useState } from "react";
import { Link } from "react-router-dom";

const styles = [
  { name: "Modern Minimalist", to: "/collections/modern-minimalist" },
  { name: "Luxury Living",     to: "/collections/luxury-living"     },
  { name: "Scandinavian",      to: "/collections/scandinavian"      },
  { name: "Boho Chic",         to: "/collections/boho-chic"         },
];

const quizQuestions = [
  {
    id: 1,
    question: "What is your preferred afternoon light?",
    options: [
      { text: "Muted light falling on raw concrete & clay surfaces", style: "modern-minimalist" },
      { text: "Bright, direct sun bouncing off marble floors", style: "luxury-living" },
      { text: "Soft shadows filtering through light linen drapes", style: "scandinavian" },
      { text: "Warm golden rays bouncing off organic fibers", style: "boho-chic" },
    ],
  },
  {
    id: 2,
    question: "Which material texture feels most like home?",
    options: [
      { text: "Chipped stone & structural unpolished plaster", style: "modern-minimalist" },
      { text: "Polished travertine & brushed solid brass", style: "luxury-living" },
      { text: "Textured bouclé wool & warm natural oak", style: "scandinavian" },
      { text: "Rough-woven terracotta & dried organic fibers", style: "boho-chic" },
    ],
  },
  {
    id: 3,
    question: "What is your primary interior design goal?",
    options: [
      { text: "Create a quiet, spacious wabi-sabi sanctuary", style: "modern-minimalist" },
      { text: "Build an opulent, striking architectural statement", style: "luxury-living" },
      { text: "Inspire warm, cozy and slow-paced gatherings", style: "scandinavian" },
      { text: "Design a free-flowing, raw and earthy retreat", style: "boho-chic" },
    ],
  },
];

const resultsData = {
  "modern-minimalist": {
    title: "Modern Minimalist",
    description: "You appreciate clean architectural lines, open spacing, and the authentic beauty of raw stone and plaster. Your home is a quiet sanctuary.",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
    link: "/collections/modern-minimalist",
  },
  "luxury-living": {
    title: "Luxury Living",
    description: "You love polished materials, opulent accents, and statements that radiate confidence. Your spaces feel grand, tailored, and premium.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    link: "/collections/luxury-living",
  },
  "scandinavian": {
    title: "Scandinavian",
    description: "You love light woods, warm cozy textiles, and spaces designed for hygge. You want comfort, light, and beautiful utility.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    link: "/collections/scandinavian",
  },
  "boho-chic": {
    title: "Boho Chic",
    description: "You favor layered organic textures, warm terracotta tones, and free-spirited wabi-sabi details that feel collected over time.",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80",
    link: "/collections/boho-chic",
  },
};

export default function StyleQuizBanner() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const handleStartQuiz = () => {
    setQuizOpen(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const handleAnswerSelect = (styleId) => {
    const newAnswers = [...answers, styleId];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate most frequent style selection
      const counts = {};
      let maxStyle = "modern-minimalist";
      let maxCount = 0;

      newAnswers.forEach((style) => {
        counts[style] = (counts[style] || 0) + 1;
        if (counts[style] > maxCount) {
          maxCount = counts[style];
          maxStyle = style;
        }
      });

      setResult(resultsData[maxStyle]);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <section className="bg-background py-24 px-[clamp(1.5rem,5vw,4rem)] border-b border-border">
      <div className="max-w-6xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-0 border border-border overflow-hidden">

          <div className="relative h-[320px] lg:h-auto lg:min-h-[480px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=85"
              alt="Style Quiz"
              className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.92] saturate-[0.95]"
            />
          </div>

          <div className="flex flex-col justify-center bg-surface px-8 md:px-12 py-12 lg:py-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-6 h-px bg-bronze" />
              <span className="font-body font-light text-[0.55rem] tracking-[0.45em] uppercase text-bronze">
                Interactive Curation
              </span>
              <span className="block w-6 h-px bg-bronze" />
            </div>

            <h2 className="font-display font-light text-[clamp(2rem,4.5vw,3.2rem)] text-ink m-0 mb-4 leading-[1.05] tracking-[-0.01em]">
              Not sure which{" "}
              <em className="text-bronze font-medium italic">
                style is yours?
              </em>
            </h2>

            <p className="font-body font-light text-[0.88rem] text-muted leading-[1.85] tracking-[0.03em] mb-8 m-0 max-w-md">
              Answer 3 quick aesthetic questions and we'll match you with the perfect Novella collection — and curate a room just for you.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {styles.map(s => (
                <Link
                  key={s.name}
                  to={s.to}
                  className="no-underline font-body font-normal text-[0.58rem] tracking-[0.15em] uppercase px-3.5 py-1.5 border border-border text-muted bg-background hover:border-bronze/50 hover:text-bronze transition-all duration-200"
                >
                  {s.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-5 flex-wrap">
              <button
                onClick={handleStartQuiz}
                className="font-body font-medium text-[0.63rem] tracking-[0.28em] uppercase text-cream-muted bg-ink px-8 py-3.5 border-none cursor-pointer flex items-center gap-3 transition-all duration-300 hover:bg-bronze hover:text-white"
              >
                Take the Style Quiz
                <svg width="16" height="7" viewBox="0 0 18 8" fill="none">
                  <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <Link
                to="/collections"
                className="no-underline font-body font-normal text-[0.63rem] tracking-[0.28em] uppercase text-muted hover:text-bronze transition-colors duration-300 flex items-center gap-2"
              >
                Browse All
                <svg width="14" height="6" viewBox="0 0 18 8" fill="none" className="text-bronze">
                  <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
          {[
            "✦  Free Styling Advice",
            "✦  Curated by Designers",
            "✦  Easy Returns",
          ].map((item, i) => (
            <span
              key={i}
              className="font-body font-light text-[0.6rem] tracking-[0.18em] uppercase text-muted"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* QUIZ OVERLAY MODAL */}
      {quizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-background border border-border p-8 md:p-10 shadow-2xl animate-scaleIn">
            
            {/* Close button */}
            <button
              onClick={() => setQuizOpen(false)}
              className="absolute top-6 right-6 font-body text-xs tracking-wider uppercase text-muted hover:text-ink cursor-pointer bg-transparent border-none outline-none"
            >
              ✕ Close
            </button>

            {!result ? (
              <div>
                {/* Progress bar */}
                <div className="flex items-center justify-between mb-8 pb-3 border-b border-border">
                  <span className="font-body font-medium text-[0.55rem] tracking-[0.28em] uppercase text-bronze">
                    Aesthetic Matchmaker
                  </span>
                  <span className="font-body font-light text-[0.62rem] text-muted">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </span>
                </div>

                <p className="font-display font-light text-[1.45rem] text-ink mb-6 leading-tight">
                  {quizQuestions[currentQuestion].question}
                </p>

                <div className="flex flex-col gap-2.5">
                  {quizQuestions[currentQuestion].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(opt.style)}
                      className="text-left w-full p-4 border border-border bg-surface hover:border-bronze hover:bg-bronze/5 font-body font-light text-xs text-ink transition-all duration-200 cursor-pointer"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2.5 mb-4">
                  <span className="block w-5 h-px bg-bronze" />
                  <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                    Your Curated Fit
                  </span>
                  <span className="block w-5 h-px bg-bronze" />
                </div>

                <h3 className="font-display font-medium text-[1.85rem] text-ink m-0 mb-3 leading-none">
                  {result.title}
                </h3>

                <p className="font-body font-light text-[0.88rem] leading-[1.8] text-muted max-w-sm mx-auto mb-6">
                  {result.description}
                </p>

                <div className="relative aspect-[16/10] overflow-hidden border border-border mb-8 bg-surface">
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Link
                    to={result.link}
                    className="no-underline font-body font-medium text-[0.63rem] tracking-[0.28em] uppercase text-cream-muted bg-ink px-8 py-3.5 transition-colors duration-200 hover:bg-bronze"
                  >
                    View Collection
                  </Link>

                  <button
                    onClick={handleResetQuiz}
                    className="font-body font-normal text-[0.63rem] tracking-[0.28em] uppercase text-muted bg-transparent border border-border px-6 py-3.5 cursor-pointer hover:border-bronze hover:text-bronze transition-colors duration-200"
                  >
                    Restart Quiz
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
}
