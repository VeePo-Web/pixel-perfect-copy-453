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
        charcoal: {
          950: "#0B0B0D",
          900: "#111114",
          800: "#1A1A1F",
          700: "#24242B",
          600: "#2E2E36",
        },
        champagne: {
          50: "#F5ECD7",
          100: "#E9D9B0",
          200: "#D9BE82",
          300: "#C9A35A",
          400: "#A8853F",
        },
        bone: "#EDE7DA",
        green: {
          signal: "#3F7A5E",
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
