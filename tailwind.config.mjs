/** @type {import('tailwindcss').Config} */

export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"];
export const theme = {
  extend: {
    animation: {
      bounce: "bounce 1s infinite",
    },
    keyframes: {
      bounce: {
        "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
        "40%": { transform: "translateY(-10px)" },
        "60%": { transform: "translateY(-5px)" },
      },
    },
  },
};
export const plugins = [];
