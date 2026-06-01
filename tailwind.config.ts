import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1200px"
      }
    },
    extend: {
      colors: {
        background: "#FAF8F3",
        surface: "#FEFDFB",
        foreground: "#0A0A0A",
        muted: "#6B7280",
        border: "#E5E0D6",
        accent: "#000000"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(10, 10, 10, 0.08)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
