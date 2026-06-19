import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

interface FullWidthImageProps {
  src: string;
  alt: string;
  height?: string;
  parallax?: boolean;
  overlay?: boolean;
  caption?: string;
  index?: string;
}

const FullWidthImage = ({
  src,
  alt,
  height = "h-[400px] md:h-[600px]",
  parallax = true,
  overlay = false,
  caption,
  index,
}: FullWidthImageProps) => {
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.12, 0.05, 0.15]);
  const captionOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0.6]);

  return (
    <section
      ref={ref}
      className={`w-full overflow-hidden ${height} relative group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cinematic letterbox bars on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 bg-foreground z-30 pointer-events-none"
        animate={{ height: isHovered ? "5%" : "0%" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-foreground z-30 pointer-events-none"
        animate={{ height: isHovered ? "5%" : "0%" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Top and bottom fade blending edges */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      {parallax ? (
        <motion.img
          src={src}
          alt={alt}
          style={{ y }}
          className="w-full h-[120%] object-cover"
          animate={{
            scale: isHovered ? 1.04 : 1,
            filter: isHovered ? "brightness(0.92) saturate(1.1)" : "brightness(1) saturate(1)",
          }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          loading="lazy"
          decoding="async"
          width={1920}
          height={1080}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
          width={1920}
          height={1080}
        />
      )}

      {/* Cinematic gradient tint — scroll-linked */}
      <motion.div
        className="absolute inset-0 bg-foreground pointer-events-none"
        style={{ opacity: overlay ? overlayOpacity : 0 }}
      />

      {/* Static overlay fallback */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-transparent to-foreground/15 pointer-events-none" />
      )}

      {/* Corner accent frames — gold gradient on hover */}
      <div className="absolute top-6 left-6 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20" aria-hidden="true">
        <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)" }} />
        <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), transparent)" }} />
      </div>
      <div className="absolute bottom-6 right-6 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20" aria-hidden="true">
        <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.3), transparent)" }} />
        <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.3), transparent)" }} />
      </div>

      {/* Corner section index */}
      {index && (
        <motion.div
          className="absolute top-8 right-8 pointer-events-none z-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="font-serif-wedding text-sm font-light text-white/20 tracking-widest">
            {index}
          </span>
        </motion.div>
      )}

      {/* Editorial caption bar */}
      {caption && (
        <motion.div
          className="absolute bottom-6 left-0 right-0 z-20"
          style={{ opacity: captionOpacity }}
        >
          <div className="flex items-center justify-center gap-4">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-10 h-px bg-white/20 origin-right hidden md:block"
            />
            <p className="font-overline text-white/45 text-center text-[0.55rem] tracking-[0.3em]">
              {caption}
            </p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="w-10 h-px bg-white/20 origin-left hidden md:block"
            />
          </div>
        </motion.div>
      )}

      {/* Flanking decorative lines on hover — gold tint */}
      <div className="absolute top-0 left-0 w-px h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: "linear-gradient(180deg, transparent, hsl(var(--gold) / 0.1), transparent)" }} />
      <div className="absolute top-0 right-0 w-px h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: "linear-gradient(180deg, transparent, hsl(var(--gold) / 0.1), transparent)" }} />
    </section>
  );
};

export default FullWidthImage;
