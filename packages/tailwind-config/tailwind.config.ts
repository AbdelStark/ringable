import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

// Define a retro color palette (example)
const retroColors = {
  "pixel-bg": "#D3E0EA", // Light blue-gray background
  "pixel-container-bg": "#F0F4F8", // Lighter container background
  "pixel-border": "#2C3E50", // Dark blue-gray border
  "pixel-text": "#2C3E50", // Dark text
  "pixel-accent": "#E74C3C", // Red accent
  "pixel-accent-hover": "#C0392B", // Darker red hover
  "pixel-disabled": "#95A5A6", // Gray for disabled state
};

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      fontFamily: {
        // Add the pixel font, extending the default sans-serif fonts
        sans: ["Press Start 2P", ...fontFamily.sans],
      },
      colors: retroColors, // Add our custom colors
      boxShadow: {
        // Simple, blocky shadow
        pixel: "4px 4px 0px #2C3E50", // Using pixel-border color
        "pixel-lg": "6px 6px 0px #2C3E50",
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [],
};
export default config;
