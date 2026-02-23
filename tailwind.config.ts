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
        primary: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        secondary: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        warm: {
          50: "#FEFDFB",
          100: "#FDF8F0",
          200: "#FAF0E1",
        },
      },
      fontFamily: {
        sans: [
          '"Noto Sans JP"',
          '"Inter"',
          '"Hiragino Sans"',
          "sans-serif",
        ],
        inter: ['"Inter"', "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        "soft": "0 2px 16px rgba(0, 0, 0, 0.04)",
        "soft-lg": "0 4px 32px rgba(0, 0, 0, 0.06)",
        "glow": "0 0 40px rgba(249, 115, 22, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
