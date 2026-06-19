import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        script: ["'Great Vibes'", "cursive"],
        "serif-wedding": ["'Cormorant Garamond'", "serif"],
        "sans-wedding": ["'Jost'", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 5.5vw, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "300" }],
        "display-lg": ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "300" }],
        "display-md": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "400" }],
        "display-sm": ["clamp(1.125rem, 2vw, 1.5rem)", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "400" }],
        "pull-quote": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.35", letterSpacing: "-0.01em", fontWeight: "300" }],
        // Readability floor: body >= 16px, body-sm >= 14px, weight >= 400
        "body-lg": ["1.125rem", { lineHeight: "1.7", fontWeight: "400" }],
        "body": ["1rem", { lineHeight: "1.7", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.65", fontWeight: "400" }],
        "label": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.18em", fontWeight: "400" }],
        "caption": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.04em", fontWeight: "400" }],
        // Override Tailwind defaults so legacy text-xs/text-sm usages meet the floor
        "xs": ["0.8125rem", { lineHeight: "1.5" }],
        "sm": ["0.875rem", { lineHeight: "1.6" }],
        "base": ["1rem", { lineHeight: "1.7" }],

      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Hickory & Rose brand tokens
        sage: {
          deep: "hsl(var(--sage-deep))",
          DEFAULT: "hsl(var(--sage))",
          light: "hsl(var(--sage-light))",
          mist: "hsl(var(--sage-mist))",
        },
        cream: {
          DEFAULT: "hsl(var(--cream))",
          dark: "hsl(var(--cream-dark))",
        },
        "warm-white": "hsl(var(--warm-white))",
        "brand-text": {
          DEFAULT: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          tertiary: "hsl(var(--text-tertiary))",
          decorative: "hsl(var(--text-decorative))",
          ghost: "hsl(var(--text-ghost))",
        },
        teal: {
          DEFAULT: "hsl(var(--teal))",
          light: "hsl(var(--teal-light))",
        },
        gold: "hsl(var(--gold))",
        // Keep legacy wedding tokens for backward compat
        wedding: {
          sage: "hsl(var(--sage))",
          "sage-light": "hsl(var(--sage-light))",
          cream: "hsl(var(--cream))",
          "cream-dark": "hsl(var(--cream-dark))",
          text: "hsl(var(--text-primary))",
          "text-light": "hsl(var(--text-secondary))",
          teal: "hsl(var(--teal))",
          "teal-light": "hsl(var(--teal-light))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        subtle: "0 2px 8px hsl(30 15% 20% / 0.06)",
        medium: "0 8px 24px hsl(30 15% 20% / 0.08)",
        large: "0 16px 48px hsl(30 15% 20% / 0.12)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards",
        "breathing-glow": "breathing-glow 4s ease-in-out infinite",
        "breathing-scale": "breathing-scale 3.5s ease-in-out infinite",
      },
      spacing: {
        "section-desktop": "7.5rem",
        "section-tablet": "5rem",
        "section-mobile": "3.75rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
