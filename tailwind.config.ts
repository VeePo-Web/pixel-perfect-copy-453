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
      },
    },
  },
  plugins: [],
};
