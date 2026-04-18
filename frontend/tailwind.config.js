/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2C3E50",
          50:  "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#2C3E50",
        },
        secondary: {
          DEFAULT: "#3498DB",
          50:  "#ebf8ff",
          100: "#bee3f8",
          200: "#90cdf4",
          300: "#63b3ed",
          400: "#4299e1",
          500: "#3498DB",
          600: "#2b6cb0",
          700: "#2c5282",
          800: "#2a4365",
          900: "#1A365D",
        },
        success:    "#27AE60",
        warning:    "#F39C12",
        danger:     "#E74C3C",
        background: "#F8F9F9",
      },
      fontFamily: {
        sans: ["'IBM Plex Sans Arabic'", "sans-serif"],
      },
      boxShadow: {
        card:       "0 2px 4px rgba(0,0,0,0.1)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
};
