import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import ImageReveal from "./ImageReveal";
import journalVowsImage from "@/assets/journal-vows.jpg";
import journalBrideImage from "@/assets/journal-bride.jpg";
import journalReceptionImage from "@/assets/journal-reception.jpg";

const articles = [
  {
    image: journalBrideImage,
    alt: "Bride in ivory silk gown standing in sunlit conservatory with orchids and ferns",
    category: "Planning",
    title: "The Art of Being Present on Your Wedding Day",
    excerpt:
      "How letting go of the details you've labored over is the final — and most important — step in your wedding journey.",
    readTime: "6 min read",
    date: "March 2026",
    pullQuote: "Presence is the final gift you give yourself.",
  },
  {
    image: journalVowsImage,
    alt: "Handwritten calligraphy wedding vows with gold pen and eucalyptus on warm-toned wood",
    category: "Inspiration",
    title: "Writing Vows That Feel Like You",
    excerpt:
      "Forget the templates. Here's how to find words that carry the weight of what you actually feel.",
    readTime: "4 min read",
    date: "February 2026",
    pullQuote: "Your words don't need to be perfect — they need to be yours.",
  },
  {
    image: journalReceptionImage,
    alt: "Heritage timber venue reception with sage linen runner, brass candlesticks, and string lights at twilight",
    category: "Design",
    title: "Tablescapes That Tell a Story",
    excerpt:
      "Why your reception table is the most underestimated design element — and how to make it unforgettable.",
    readTime: "5 min read",
    date: "January 2026",
    pullQuote: "A table is never just a table — it's the first chapter of your evening.",
  },
];

const JournalTeaserSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const verticalRuleScale = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="py-section-mobile md:py-section-tablet lg:py-section-desktop bg-card relative overflow-hidden"
      aria-label="Journal articles"
    >
      {/* Parallax watermark */}
      <motion.div
        className="absolute -left-8 top-1/3 pointer-events-none select-none"
        style={{ y: watermarkY }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-[8rem] md:text-[14rem] font-light text-foreground/[0.015] whitespace-nowrap tracking-tight italic">
          Journal
        </span>
      </motion.div>

      {/* Scroll-linked vertical accent */}
      <motion.div
        className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/8 to-transparent hidden lg:block"
        style={{ scaleY: verticalRuleScale, transformOrigin: "top" }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 lg:px-8 max-w-6xl relative">
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 md:mb-24 gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="font-serif-wedding text-sm text-primary/20 font-light">10</span>
                <span className="w-8 h-px bg-primary/15" />
                <p className="font-sans-wedding text-label uppercase text-muted-foreground/40 tracking-[0.2em]">
                  Our Journal
                </p>
              </div>
              <h2 className="font-serif-wedding text-display-lg text-foreground">
                Stories & Inspiration
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-16 h-px bg-primary/20 origin-left mt-4"
              />
            </div>
            <p className="font-sans-wedding text-body-sm text-muted-foreground font-light leading-relaxed max-w-xs md:text-right">
              Planning wisdom, real wedding stories, and the design details that
              make each celebration unforgettable.
            </p>
          </div>
        </ScrollReveal>

        {/* Editorial asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Featured large card */}
          <div className="lg:col-span-7">
            <ArticleCard article={articles[0]} index={0} featured />
          </div>

          {/* Right stack */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            <ArticleCard article={articles[1]} index={1} />
            <ArticleCard article={articles[2]} index={2} />
          </div>
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.3}>
          <div className="mt-14 md:mt-20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-10 h-px bg-border/30 origin-right"
              />
              <span className="w-1.5 h-1.5 rotate-45" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.1))" }} />
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-10 h-px bg-border/30 origin-left"
              />
            </div>
            <p className="font-sans-wedding text-caption tracking-[0.18em] uppercase text-muted-foreground/60">
              More stories coming soon
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const ArticleCard = ({
  article,
  index,
  featured = false,
}: {
  article: (typeof articles)[number];
  index: number;
  featured?: boolean;
}) => (
  <ScrollReveal delay={index * 0.1}>
    <div className="group cursor-pointer">
      <ImageReveal direction={index === 0 ? "left" : "up"} delay={index * 0.06}>
        <div
          className={`overflow-hidden relative ${
            featured ? "aspect-[4/5] lg:aspect-[3/4]" : "aspect-[16/10]"
          }`}
        >
          <img
            src={article.image}
            alt={article.alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Corner frame accents */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/0 group-hover:border-white/15 transition-colors duration-500" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/0 group-hover:border-white/15 transition-colors duration-500" />

          {/* Category tag */}
          <div className="absolute top-4 left-4">
            <span className="font-sans-wedding text-caption tracking-[0.18em] uppercase text-white/70 bg-foreground/30 backdrop-blur-sm px-3 py-1.5">
              {article.category}
            </span>
          </div>

          {/* Hover reveal: pull-quote + title */}
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
            {featured && (
              <p className="font-serif-wedding text-xs italic text-white/40 mb-2">
                "{article.pullQuote}"
              </p>
            )}
            <p className="font-serif-wedding text-lg md:text-xl text-white leading-snug">
              {article.title}
            </p>
          </div>

          {/* Frame number */}
          <span className="absolute top-4 right-4 font-serif-wedding text-caption text-white/60 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </ImageReveal>

      {/* Text content below image */}
      <div className="mt-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-primary/60">
            {article.category}
          </span>
          <span className="w-3 h-px bg-border/40" />
          <span className="font-sans-wedding text-caption tracking-[0.08em] text-muted-foreground/60">
            {article.readTime}
          </span>
        </div>

        <h3 className="font-serif-wedding text-display-sm text-foreground group-hover:text-primary transition-colors duration-500 mb-2 leading-tight relative">
          {article.title}
          {/* Gold underline reveal on hover */}
          <span
            className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out"
            style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.1), transparent)" }}
          />
        </h3>

        <p className="font-sans-wedding text-body-sm text-muted-foreground/60 font-light leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>

        {/* Editorial pull-quote below excerpt — visible on featured */}
        {featured && (
          <p className="font-serif-wedding text-xs italic text-primary/25 mt-3 hidden lg:block">
            "{article.pullQuote}"
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="h-px bg-primary/30 w-0 group-hover:w-8 transition-all duration-500 origin-left"
            />
            <span className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-muted-foreground/60 group-hover:text-primary/60 transition-colors duration-500">
              {article.date}
            </span>
          </div>
          {/* Read indicator */}
          <span className="font-sans-wedding text-caption tracking-[0.1em] uppercase text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
            Read →
          </span>
        </div>
      </div>
    </div>
  </ScrollReveal>
);

export default JournalTeaserSection;
