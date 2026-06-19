import { useState, useRef } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FooterNewsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="border-b border-background/[0.06]">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
        >
          <div className="md:col-span-5">
            <p className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-background/60 mb-3">
              Stay Inspired
            </p>
            <h3 className="font-serif-wedding text-2xl md:text-3xl text-background/70 font-light leading-tight">
              Planning wisdom, delivered with care.
            </h3>
            <p className="font-sans-wedding text-xs text-background/25 font-light mt-3 leading-relaxed max-w-xs">
              Curated inspiration, vendor insights, and planning tips — never spam, always intentional.
            </p>
          </div>
          <div className="md:col-span-7 md:flex md:justify-end">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                    className="w-8 h-8 rounded-full border border-background/20 flex items-center justify-center"
                  >
                    <Check size={14} strokeWidth={1.5} className="text-background/50" />
                  </motion.div>
                  <div>
                    <p className="font-serif-wedding text-sm text-background/60 italic">
                      Welcome to the Hickory & Rose community.
                    </p>
                    <p className="font-sans-wedding text-caption text-background/60 mt-1">
                      Check your inbox for a warm welcome.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3 max-w-md w-full md:w-auto"
                >
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="Your email address"
                      className="w-full bg-transparent border-b border-background/15 focus:border-background/40 py-3 px-0 text-sm text-background/60 placeholder:text-background/20 font-sans-wedding font-light outline-none transition-colors duration-300"
                      aria-label="Email address for newsletter"
                      required
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-px origin-left"
                      style={{
                        background: "linear-gradient(90deg, hsl(var(--gold, 38 60% 55%)), hsl(var(--primary)))",
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: focused ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-8 py-3 text-caption tracking-[0.2em] uppercase font-sans-wedding font-light border border-background/15 text-background/60 hover:text-background/80 hover:border-background/40 transition-all duration-300 shrink-0 relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-background/5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                    <span className="relative z-10">Subscribe</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FooterNewsletter;
