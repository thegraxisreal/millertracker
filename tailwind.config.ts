import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        ping: {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
        sonar1: {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        sonar2: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        sonar3: {
          "0%": { transform: "scale(1)", opacity: "0.4" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        sonar1: "sonar1 2s ease-out infinite",
        sonar2: "sonar2 2s ease-out infinite 0.6s",
        sonar3: "sonar3 2s ease-out infinite 1.2s",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
