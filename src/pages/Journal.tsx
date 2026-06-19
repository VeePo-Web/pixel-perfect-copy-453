import { useEffect, useRef, useState } from "react";
import { setPageMeta, setBreadcrumbSchema } from "@/lib/seo";
import { motion, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/wedding/Navigation";
import CTASection from "@/components/wedding/CTASection";
import Footer from "@/components/wedding/Footer";
import ScrollReveal from "@/components/wedding/ScrollReveal";
import PreFooterDivider from "@/components/wedding/PreFooterDivider";
import GoldFrame from "@/components/wedding/GoldFrame";
import BreathingDiamond from "@/components/wedding/BreathingDiamond";
import JournalFeatured from "@/components/wedding/JournalFeatured";
import JournalArticleCard from "@/components/wedding/JournalArticleCard";
import journalVowsImage from "@/assets/journal-vows.jpg";
import journalBrideImage from "@/assets/journal-bride.jpg";
import journalReceptionImage from "@/assets/journal-reception.jpg";
import editorialFloralsImage from "@/assets/editorial-florals.jpg";
import detailImage from "@/assets/detail-placecard.jpg";
import ceremonyImage from "@/assets/ceremony-setup.jpg";

// Studio Notebook is structure-only until the first real essay ships
// (brand-identity §8.5, seo.blog.postCount: 0). The single tile below is a
// coming-soon placeholder — replace with real, dated articles when published.
const articles = [
  {
    image: journalBrideImage,
    alt: "Bride in ivory silk gown standing in sunlit conservatory with orchids and ferns",
    category: "Coming Soon",
    title: "The Studio Notebook — publishing with our 2027 season",
    excerpt: "Planning thinking, design philosophy, and the small details we believe in. We're writing carefully — and the first essays will live here when we open our 2027 calendar.",
    readTime: "",
    date: "Publishing with 2027",
    pullQuote: "Worth waiting for.",
    featured: true,
  },
];


const journalFilters = ["All", "Planning", "Inspiration", "Design", "Florals", "Stationery", "Venues"] as const;

const Journal = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    setPageMeta({ title: "Journal | Hickory & Rose Edmonton Wedding Planner", description: "Planning notes, design inspiration, and real-wedding stories from the Hickory & Rose studio in Edmonton, Alberta.", path: "/journal" });
    setBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Journal", path: "/journal" }]);
  }, []);

  const featuredArticle = articles[0];
  const allRemaining = articles.slice(1);
  const remainingArticles = activeFilter === "All" ? allRemaining : allRemaining.filter((a) => a.category === activeFilter);

  return (
    <main id="main-content">
      <Navigation variant="overlay" />

      {/* Cinematic Hero */}
      <section ref={heroRef} className="relative h-[55vh] md:h-[65vh] overflow-hidden grain-overlay vignette">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img src={journalBrideImage} alt="Bride in natural light surrounded by florals — editorial wedding photography" className="w-full h-[120%] object-cover" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/55" />
        </motion.div>
        <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "15%"]) }} initial={{ opacity: 0 }} animate={{ opacity: 0.03 }} transition={{ duration: 2, delay: 0.5 }}>
          <span className="font-serif-wedding text-[12rem] md:text-[20rem] text-white leading-none tracking-tight whitespace-nowrap">Journal</span>
        </motion.div>
        <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6" style={{ opacity: heroOpacity }}>
          <ScrollReveal>
            <p className="font-sans-wedding text-label uppercase text-white/50 mb-4">
              <span className="inline-flex items-center gap-3">
                <motion.span className="w-8 h-px bg-white/30 origin-right" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
                Stories & Wisdom
                <motion.span className="w-8 h-px bg-white/30 origin-left" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
              </span>
            </p>
            <h1 className="font-serif-wedding text-display-xl text-white mb-6 max-w-3xl">The Journal</h1>
            <p className="font-sans-wedding text-base md:text-lg text-white/70 leading-relaxed max-w-xl mx-auto font-light">Field notes from the studio — planning thinking, design philosophy, and the small details we believe in. Publishing alongside our 2027 season.</p>
          </ScrollReveal>
        </motion.div>
        <GoldFrame inset="20px" delay={1} />
        <motion.div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-4 py-3 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }}>
          {["Planning Wisdom", "Real Stories", "Design Details"].map((t, i) => (
            <span key={t} className="font-sans-wedding text-caption tracking-[0.18em] uppercase text-white/60 flex items-center gap-4">
              {i > 0 && <BreathingDiamond size={4} />}
              {t}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Featured Article */}
      <JournalFeatured article={featuredArticle} />

      {/* Gold divider */}
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="h-px origin-center" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.2), transparent)" }} />
      </div>

      {/* Category Filter Tabs */}
      <section className="py-5 md:py-6 bg-card/80 backdrop-blur-sm border-b border-border/30 sticky top-[72px] z-30">
        <div className="container mx-auto px-6 lg:px-8 flex justify-center items-center gap-0 overflow-x-auto">
          {journalFilters.map((f, i) => (
            <span key={f} className="flex items-center">
              {i > 0 && <BreathingDiamond size={3} className="mx-1 hidden md:inline-flex" />}
              <button onClick={() => setActiveFilter(f)} className={`relative font-sans-wedding text-xs tracking-[0.15em] uppercase px-4 md:px-5 py-2.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 whitespace-nowrap ${activeFilter === f ? "text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground"}`}>
                {f}
                {activeFilter === f && (
                  <motion.div layoutId="journal-filter" className="absolute bottom-0 left-0 w-full h-px origin-left" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold)), transparent)" }} transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }} />
                )}
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-section-mobile md:py-section-tablet bg-background relative overflow-hidden">
        <motion.div className="absolute -right-8 top-1/4 pointer-events-none select-none" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}>
          <span className="font-serif-wedding text-[8rem] md:text-[12rem] font-light text-foreground/[0.015] whitespace-nowrap tracking-tight italic">Stories</span>
        </motion.div>
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl relative">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-12 md:mb-16">
              <span className="font-serif-wedding text-sm text-primary/60 font-light">02</span>
              <span className="w-8 h-px bg-primary/30" />
              <p className="font-sans-wedding text-label uppercase text-muted-foreground tracking-[0.2em]">Studio Notebook</p>
              <span className="flex-1 h-px bg-border/20 hidden md:block" />
              <span className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-muted-foreground/60 hidden md:block">Publishing with 2027 Season</span>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {remainingArticles.map((article, index) => (
              <JournalArticleCard key={article.title} article={article} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscribe */}
      <section className="py-section-mobile md:py-section-tablet bg-card relative overflow-hidden">
        <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block" initial={{ opacity: 0 }} whileInView={{ opacity: 0.02 }} viewport={{ once: true }} transition={{ duration: 1.5 }}>
          <span className="font-script text-[18rem] text-foreground leading-none">J</span>
        </motion.div>
        <motion.div className="absolute right-0 top-1/4 w-[400px] h-[400px] pointer-events-none hidden md:block" initial={{ opacity: 0 }} whileInView={{ opacity: 0.06 }} viewport={{ once: true }} transition={{ duration: 2 }} style={{ background: "radial-gradient(ellipse, hsl(var(--gold) / 0.15), transparent 70%)" }} aria-hidden="true" />
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl relative">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-5">
                <span className="font-serif-wedding text-5xl font-light text-primary/10 block mb-3">03</span>
                <p className="font-sans-wedding text-label uppercase text-muted-foreground/50 mb-3"><span className="inline-flex items-center gap-3"><span className="w-5 h-px bg-border" />Stay Inspired</span></p>
                <h2 className="font-serif-wedding text-display-lg text-foreground mb-4 leading-tight">Planning wisdom, delivered with care.</h2>
                <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed font-light max-w-sm">Seasonal inspiration, planning tips, and first access to new journal entries. Curated monthly — never spam.</p>
              </div>
              <div className="lg:col-span-7 lg:flex lg:justify-end">
                <div className="relative max-w-md w-full">
                  <div className="absolute -top-3 -left-3 w-8 h-8 hidden lg:block pointer-events-none" aria-hidden="true">
                    <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.25), transparent)" }} />
                    <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.25), transparent)" }} />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-8 h-8 hidden lg:block pointer-events-none" aria-hidden="true">
                    <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.25), transparent)" }} />
                    <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.25), transparent)" }} />
                  </div>
                  <div className="border border-border/30 p-8 md:p-10">
                    <p className="font-serif-wedding text-sm italic text-foreground/40 mb-6">"The best planning starts with inspiration."</p>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const input = (e.currentTarget.elements.namedItem("journal-email") as HTMLInputElement | null);
                        const email = input?.value.trim();
                        if (!email) { input?.focus(); return; }
                        const subject = "Studio Notebook — Notify me when essays publish";
                        const body = `Please add me to the notebook list.\n\nEmail: ${email}\n\n— Sent from hickoryandrose.com/journal`;
                        window.location.href = `mailto:sales@hickoryandrose.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      }}
                      className="flex flex-col sm:flex-row items-stretch gap-3 mb-4"
                    >
                      <div className="flex-1 input-gold-focus relative">
                        <input name="journal-email" type="email" required placeholder="your@email.com" className="w-full px-4 py-3.5 bg-transparent border border-border/60 font-sans-wedding text-sm text-foreground font-light placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0 focus:border-transparent transition-colors duration-300" aria-label="Email address for notebook notifications" />
                      </div>
                      <button type="submit" className="px-8 py-3.5 bg-primary text-primary-foreground font-sans-wedding text-xs tracking-[0.18em] uppercase font-light hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 relative overflow-hidden group shrink-0">
                        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.15), transparent 60%)" }} />
                        <span className="relative z-10">Notify Me</span>
                      </button>
                    </form>
                    <p className="font-sans-wedding text-caption tracking-[0.08em] text-muted-foreground/60 font-light">One email per month · Unsubscribe anytime</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Signature Quote */}
      <section className="py-20 md:py-28 bg-sage-deep relative overflow-hidden">
        <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] pointer-events-none" initial={{ opacity: 0 }} whileInView={{ opacity: 0.06 }} viewport={{ once: true }} transition={{ duration: 2 }} style={{ background: "radial-gradient(ellipse, hsl(var(--gold) / 0.12), transparent 70%)" }} aria-hidden="true" />
        <motion.div className="absolute -left-4 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block" initial={{ opacity: 0 }} whileInView={{ opacity: 0.025 }} viewport={{ once: true }} transition={{ duration: 1.5 }}>
          <span className="font-serif-wedding text-[10rem] md:text-[14rem] text-primary-foreground leading-none tracking-tight italic whitespace-nowrap">Wisdom</span>
        </motion.div>
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center relative">
          <ScrollReveal>
            <div className="flex items-center justify-center gap-4 mb-10">
              <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-10 h-px origin-right" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.25))" }} />
              <motion.span className="w-2 h-2 rotate-45 shrink-0" style={{ background: "hsl(var(--gold) / 0.25)", boxShadow: "0 0 12px 4px hsl(var(--gold) / 0.1)" }} animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
              <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-10 h-px origin-left" style={{ background: "linear-gradient(270deg, transparent, hsl(var(--gold) / 0.25))" }} />
            </div>
            <span className="font-serif-wedding text-6xl text-primary-foreground/[0.06] leading-none block -mb-4" aria-hidden="true">"</span>
            <blockquote className="font-serif-wedding text-display-md text-primary-foreground leading-relaxed mb-8">"The best planning doesn't feel like planning — it feels like permission to simply enjoy."</blockquote>
            <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="w-8 h-px mx-auto mb-4 origin-center" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.3), transparent)" }} />
            <span className="font-script text-xl text-primary-foreground/35">Hickory & Rose</span>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="w-4 h-px bg-primary-foreground/10" />
              <span className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-primary-foreground/60">Edmonton · Alberta</span>
              <span className="w-4 h-px bg-primary-foreground/10" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CTASection />
      <PreFooterDivider />
      <Footer />
    </main>
  );
};

export default Journal;
