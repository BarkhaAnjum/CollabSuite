/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'border-blue-500',
    'border-green-500',
    'border-purple-500',
    'border-pink-500',
    'text-blue-600',
    'text-green-600',
    'text-purple-600',
    'text-pink-600',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
