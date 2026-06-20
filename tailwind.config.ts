/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        zentry: ["zentry", "sans-serif"],
        general: ["general", "sans-serif"],
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
        // Light-theme aliases. Keys retained for backward compat — values flipped to paper/ink/gold.
        charcoal: {
          950: "#FAF8F3", // page background — warm paper
          900: "#F4F0E6", // raised surface
          800: "#ECE6D6", // subtle band
          700: "#DCD6C7", // hairline / divider
          600: "#C7BFAB", // muted border
        },
        champagne: {
          50: "#F7EFD8",   // soft gold tint (hover wash)
          100: "#ECD8A3",  // light gold
          200: "#C9A24B",  // decorative gold (rules, dots, borders)
          300: "#A8842F",  // emphasis gold
          400: "#7A5F1F",  // darkest gold for small text
        },
        bone: "#191C22", // ink — primary text
        ink: {
          DEFAULT: "#191C22",
          muted: "#5A5F6A",
        },
        paper: {
          DEFAULT: "#FAF8F3",
          raised: "#FDFBF7",
          white: "#FFFFFF",
        },
        gold: {
          300: "#ECD8A3",
          500: "#C9A24B",
          700: "#997327",
        },
        navy: "#1B2A44",
        green: {
          signal: "#356B4F",
          deep: "#1F3B2D",
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
        "ghost-drift": {
          "0%, 100%": { transform: "translateY(0) rotate(-3deg)" },
          "50%": { transform: "translateY(-4px) rotate(-3deg)" },
        },
      },
      animation: {
        "panel-rise": "panel-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "section-in": "section-in 500ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "rim-in": "rim-in 500ms cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 1.8s linear infinite",
        "shimmer-slow": "shimmer 6s linear infinite",
        "caret-blink": "caret-blink 1.1s steps(2, end) infinite",
        "soft-pulse": "soft-pulse 1.6s ease-in-out infinite",
        "ghost-drift": "ghost-drift 16s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
