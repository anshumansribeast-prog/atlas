import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070B14",
        foreground: "#F5F7FF",
        atlas: {
          bg: "#070B14",
          surface: "#0D1424",
          card: "#111B2E",
          cardHover: "#16233B",
          border: "#1E2C4A",
          borderHover: "#2C416E",
          blue: "#3987FF",
          blueGlow: "rgba(57, 135, 255, 0.15)",
          violet: "#895CFF",
          violetGlow: "rgba(137, 92, 255, 0.15)",
          cyan: "#36D9E8",
          cyanGlow: "rgba(54, 217, 232, 0.15)",
          textMuted: "#9AA9C2",
          textFaint: "#5A6E8C",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "atlas-glow": "radial-gradient(circle at 50% 0%, rgba(57, 135, 255, 0.12), transparent 50%)",
        "cyber-grid": "linear-gradient(to right, rgba(30, 44, 74, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 44, 74, 0.2) 1px, transparent 1px)",
      },
      boxShadow: {
        "atlas-glow": "0 0 30px -5px rgba(57, 135, 255, 0.25)",
        "violet-glow": "0 0 30px -5px rgba(137, 92, 255, 0.25)",
        "cyan-glow": "0 0 30px -5px rgba(54, 217, 232, 0.25)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
