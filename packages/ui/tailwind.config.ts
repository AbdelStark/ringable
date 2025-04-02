import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "prefix" | "presets" | "content" | "theme"> = {
  content: ["./src/**/*.tsx"],
  prefix: "ui-",
  presets: [sharedConfig],
  theme: {
    extend: {
      keyframes: {
        bounceIn: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        blinkBorder: {
          "0%, 100%": { borderColor: "rgba(220, 38, 38, 1)" }, // red-600
          "50%": { borderColor: "rgba(251, 146, 60, 1)" }, // orange-400
        },
      },
      animation: {
        "bounce-in": "bounceIn 0.3s ease-out",
        "blink-border": "blinkBorder 1s infinite",
      },
      borderWidth: {
        "6": "6px",
      },
    },
  },
};

export default config;
