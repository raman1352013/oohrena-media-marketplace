/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{tsx,ts,jsx,js}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0066FF", // blue
          50: "#e6f2ff",
          100: "#cce5ff",
          200: "#99ccff",
          300: "#66b2ff",
          400: "#3399ff",
          500: "#0066ff",
          600: "#0052cc",
          700: "#003d99",
          800: "#002966",
          900: "#001433",
        },
        background: "#ffffff",
        surface: "#f8fafc",
        muted: "#64748b",
        border: "#e2e8f0",
      },
    },
  },
  plugins: [],
};
