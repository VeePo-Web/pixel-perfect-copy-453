import ScrollReveal from "./ScrollReveal";
import ImageReveal from "./ImageReveal";
import type { Article } from "./JournalArticleCard";

interface JournalFeaturedProps {
  article: Article & { image: string };
}

const JournalFeatured = ({ article }: JournalFeaturedProps) => (
  <section className="py-section-mobile md:py-section-tablet bg-card">
    <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
      <ScrollReveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <ImageReveal direction="left">
            <div className="aspect-[4/5] overflow-hidden relative group">
              {/* Cinematic letterbox bars */}
              <div
                className="absolute top-0 left-0 right-0 z-20 h-[6%] bg-foreground/90 -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] pointer-events-none"
              />
              <div
                className="absolute bottom-0 left-0 right-0 z-20 h-[6%] bg-foreground/90 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] pointer-events-none"
              />

              {/* Gold shimmer sweep */}
              <div
                className="absolute inset-0 z-10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.08) 40%, hsl(var(--gold) / 0.12) 50%, hsl(var(--gold) / 0.08) 60%, transparent 100%)" }}
              />

              <img
                src={article.image}
                alt={article.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-4 left-4 z-20">
                <span
                  className="font-sans-wedding text-caption tracking-[0.18em] uppercase text-white/80 backdrop-blur-sm px-3 py-1.5"
                  style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--primary) / 0.2))" }}
                >
                  Featured
                </span>
              </div>

              <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-white/0 group-hover:border-white/15 transition-colors duration-500" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-white/0 group-hover:border-white/15 transition-colors duration-500" />
            </div>
          </ImageReveal>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-primary/60">
                {article.category}
              </span>
              <span className="w-4 h-px bg-border/40" />
              <span className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-muted-foreground/50">
                Studio Note
              </span>
            </div>
            <h2 className="font-serif-wedding text-display-lg text-foreground mb-4 leading-tight">
              {article.title}
            </h2>
            <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed font-light mb-6">
              {article.excerpt}
            </p>
            {/* Pull-quote with gold gradient border */}
            <div
              className="pl-5 mb-2"
              style={{ borderLeft: "2px solid transparent", borderImage: "linear-gradient(180deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.08)) 1" }}
            >
              <p className="font-serif-wedding text-sm italic text-foreground/55 leading-relaxed">
                &ldquo;{article.pullQuote}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default JournalFeatured;
