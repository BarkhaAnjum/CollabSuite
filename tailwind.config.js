/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enables dark mode

  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  safelist: [
    "border-blue-500",
    "border-green-500",
    "border-purple-500",
    "border-pink-500",
    "text-blue-600",
    "text-green-600",
    "text-purple-600",
    "text-pink-600",
  ],

  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        bounceDots: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },

        // ⭐ Floating bot animation
        floatingBot: {
          "0%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(10px, -10px)" },
          "50%": { transform: "translate(0, -15px)" },
          "75%": { transform: "translate(-10px, -5px)" },
          "100%": { transform: "translate(0, 0)" },
        },
      },

      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        fadeInUp: "fadeInUp 0.45s ease-out",
        bounceDots: "bounceDots 1s infinite ease-in-out",

        // ⭐ Floating bot animation name
        floatingBot: "floatingBot 6s ease-in-out infinite",
      },
    },
  },

  plugins: [],
};
