import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0d12",
        panel: "#141821",
        edge: "#232a38",
        accent: "#ffa11b",
        accent2: "#f05011",
      },
    },
  },
  plugins: [],
};
export default config;
