import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#07090C",
        graphite: "#0D1117",
        steel: "#171B21",
        "steel-light": "#212730",
        brand: {
          orange: "#FF6A00",
          amber: "#FF8A2A",
          glow: "#FFA858",
        },
        alabaster: "#F5F5F5",
        silver: "#9BA3AE",
        slate: "#5E6672",
      },
      fontFamily: {
        sans: ["var(--font-vazirmatn)", "system-ui", "sans-serif"],
        display: ["var(--font-vazirmatn)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "metallic-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 50%, rgba(255,106,0,0.05) 100%)",
        "orange-flare":
          "radial-gradient(circle at center, rgba(255,106,0,0.22) 0%, rgba(255,138,42,0.06) 45%, transparent 70%)",
        "dark-vignette":
          "radial-gradient(circle at center, transparent 20%, #07090C 95%)",
      },
      boxShadow: {
        "orange-glow": "0 0 35px -5px rgba(255, 106, 0, 0.45)",
        "orange-subtle": "0 0 25px -8px rgba(255, 106, 0, 0.25)",
        "card-depth": "0 24px 48px -12px rgba(0, 0, 0, 0.75)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-subtle": "floatSubtle 6s ease-in-out infinite",
      },
      keyframes: {
        floatSubtle: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
