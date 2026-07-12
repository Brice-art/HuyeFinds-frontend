import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAF7F1",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#201D1A",
          soft: "#6B6259",
          faint: "#A69F93",
        },
        primary: {
          DEFAULT: "#1F4E3C",
          tint: "#E7F0EA",
          dark: "#153A2C",
        },
        accent: {
          DEFAULT: "#E2A33B",
          tint: "#FBEEDA",
        },
        heart: "#C4573F",
        border: "#ECE6DB",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        lg: "22px",
        md: "16px",
        sm: "10px",
      },
      boxShadow: {
        soft: "0 8px 24px -12px rgba(32,29,26,0.14)",
        lift: "0 16px 36px -14px rgba(32,29,26,0.22)",
      },
    },
  },
  plugins: [],
} satisfies Config;
