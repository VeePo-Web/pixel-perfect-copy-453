/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Role aliases — the design system speaks in these.
        sans: [
          "circular-web",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: ["robert-medium", "circular-web", "sans-serif"],
        // Face names kept for existing call sites.
        zentry: ["zentry", "sans-serif"],
        general: ["general", "monospace"],
        "circular-web": ["circular-web", "sans-serif"],
        "robert-medium": ["robert-medium", "sans-serif"],
        "robert-regular": ["robert-regular", "sans-serif"],
      },
      colors: {
        blue: {
          50: "#DFDFF0",
          75: "#dfdff2",
          100: "#F0F2FA",
          200: "#010101",
          300: "#4FB7DD",
        },
        violet: {
          300: "#5724ff",
        },
        yellow: {
          100: "#8e983f",
          300: "#edff66",
        },
        // Pure-white trust palette. Keys retained for backward compat — values flipped to white/ink/gold.
        charcoal: {
          950: "#FFFFFF", // page background — pure white
          900: "#FFFFFF", // flatten tinted cards to white (translucent /55 etc become invisible washes)
          800: "#FAFAFB", // subtle elevation only (tables, sticky nav)
          700: "#E6E8EC", // hairline border
          600: "#C9CED6", // muted border
        },
        champagne: {
          50: "#FBF5E4",
          100: "#ECD8A3",
          200: "#D4A845", // decorative gold (rules, dots)
          300: "#B8893A", // accessible gold text/icons (AA on white)
          400: "#8A6422",
        },
        bone: "#0B0D12", // ink — primary text
        ink: {
          DEFAULT: "#0B0D12",
          muted: "#5A6170",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          raised: "#FAFAFB",
          white: "#FFFFFF",
        },
        gold: {
          300: "#ECD8A3",
          500: "#D4A845",
          700: "#B8893A",
        },
        navy: "#0F1B3D",
        green: {
          signal: "#2E6B4A",
          deep: "#1F3B2D",
        },
        // Single restrained semantic-danger token (AA on white) — used only for
        // "past the line" financial warnings (e.g. prime cost > 65%).
        red: {
          signal: "#A8362F",
        },
      },
      transitionTimingFunction: {
        cinema: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "panel-rise": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.985)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "section-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "rim-in": {
          "0%": { opacity: "0", transform: "scaleX(0)" },
          "100%": { opacity: "1", transform: "scaleX(1)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "caret-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "soft-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      // Motion discipline: no infinite attention loops on static UI.
      // "shimmer-slow", "soft-pulse" and "ghost-drift" are intentionally
      // undefined — their utility classes no-op, and shimmer overlays rest
      // off-canvas (-translate-x-full), i.e. invisible. "shimmer" and
      // "caret-blink" remain for genuine loading/progress states only.
      animation: {
        "panel-rise": "panel-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "section-in": "section-in 500ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "rim-in": "rim-in 500ms cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 1.8s linear infinite",
        "caret-blink": "caret-blink 1.1s steps(2, end) infinite",
        "soft-pulse": "soft-pulse 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
