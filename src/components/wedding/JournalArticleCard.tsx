import ScrollReveal from "./ScrollReveal";
import ImageReveal from "./ImageReveal";

interface Article {
  image: string;
  alt: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  pullQuote: string;
}

interface JournalArticleCardProps {
  article: Article;
  index: number;
}

const JournalArticleCard = ({ article, index }: JournalArticleCardProps) => (
  <ScrollReveal key={article.title} delay={index * 0.08}>
    <article className="group">
      <ImageReveal direction={index % 2 === 0 ? "up" : "left"} delay={index * 0.04}>
        <div className="aspect-[4/5] overflow-hidden relative">
          {/* Gold shimmer sweep on hover */}
          <div
            className="absolute inset-0 z-10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.08) 40%, hsl(var(--gold) / 0.12) 50%, hsl(var(--gold) / 0.08) 60%, transparent 100%)" }}
          />
          <img
            src={article.image}
            alt={article.alt}
            className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 via-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/0 group-hover:border-white/15 transition-colors duration-500" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/0 group-hover:border-white/15 transition-colors duration-500" />
          <div className="absolute top-4 left-4 z-20">
            <span
              className="font-sans-wedding text-caption tracking-[0.18em] uppercase text-white/80 backdrop-blur-sm px-2.5 py-1"
              style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.25), hsl(var(--primary) / 0.2))" }}
            >
              {article.category}
            </span>
          </div>
          {/* Pull-quote reveal on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
            <p className="font-serif-wedding text-xs italic text-white/50 leading-snug">
              &ldquo;{article.pullQuote}&rdquo;
            </p>
          </div>
        </div>
      </ImageReveal>

      <div className="mt-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-primary/60">
            {article.category}
          </span>
          <span className="w-3 h-px bg-border/40" />
          <span className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-muted-foreground/50">
            Studio Note
          </span>
        </div>
        <h3 className="font-serif-wedding text-display-sm text-foreground mb-2 leading-tight">
          {article.title}
        </h3>
        <p className="font-sans-wedding text-body-sm text-muted-foreground/70 font-light leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
      </div>
    </article>
  </ScrollReveal>
);

export default JournalArticleCard;
export type { Article };
