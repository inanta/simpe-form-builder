/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: [
    "grid",
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",
    "grid-cols-5",
    "grid-cols-6",
    "grid-cols-7",
    "grid-cols-8",
    "grid-cols-9",
    "grid-cols-10",
    "grid-cols-11",
    "grid-cols-12"
  ],
  // darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Mulish", "sans-serif"],
      serif: ["Lora", "serif"],
      body: ["Mulish", "sans-serif"],
      title: ["Lora", "serif"]
    },
    extend: {
      colors: {
        // "primary-background": "#0067ac",
        // "primary-foreground": "#ffffff",
        // "positive-background": "#73c322",
        // "positive-foreground": "#ffffff",
        // "negative-background": "#d41111",
        // "negative-foreground": "#ffffff",
        // "light-gray": "#f2f2f3",
        // "mid-gray": "#c8cdd0",
        // "dark-gray": "#415058",

        surface: {
          100: "#ffffff",
          200: "#ffffff",
          300: "#ffffff",
          400: "#ffffff",
          500: "#ffffff",
          600: "#ffffff"
        },
        "surface--dark": {
          100: "#121212",
          200: "#282828",
          300: "#3f3f3f",
          400: "#575757",
          500: "#717171",
          600: "#8b8b8b"
        },
        "on-surface--dark": {
          100: "#ffffff",
          200: "#ffffff",
          300: "#ffffff",
          400: "#ffffff",
          500: "#ffffff",
          600: "#ffffff"
        },

        primary: "#0093ff",
        "on-primary": "#ffffff",
        positive: "#8cdd3c",
        "on-positive": "#ffffff",
        negative: "#ee2b2b",
        "on-negative": "#ffffff",
        disabled: "#c8cdd0",
        "on-disabled": "#ffffff",

        "primary--dark": "#3a76b5",
        "on-primary--dark": "#ffffff",
        "positive--dark": "#de3f2a",
        "on-positive--dark": "#ffffff",
        "negative--dark": "#de3f2a",
        "on-negative--dark": "#ffffff",
        "disabled--dark": "#282828",
        "on-disabled--dark": "#575757",

        white: "#ffffff",
        "light-gray": "#f2f2f3",
        "mid-gray": "#c8cdd0",
        "dark-gray": "#415058",
        black: "#1f292e",
        "light-gray--dark": "#f2f2f3",
        "mid-gray--dark": "#f2f2f3",
        "dark-gray--dark": "#415058"
      },
      boxShadow: {
        center: "0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)"
      }
    }
  },
  plugins: []
};
