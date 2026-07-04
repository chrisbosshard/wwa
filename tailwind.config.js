/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "auto-xs": "repeat(auto-fill, minmax(120px, 1fr))",
        "auto-sm": "repeat(auto-fill, minmax(180px, 1fr))",
        "auto-md": "repeat(auto-fill, minmax(240px, 1fr))",
        "auto-lg": "repeat(auto-fill, minmax(300px, 1fr))",
        "auto-xl": "repeat(auto-fill, minmax(360px, 1fr))",
        "auto-2xl": "repeat(auto-fill, minmax(420px, 1fr))",
        "auto-3xl": "repeat(auto-fill, minmax(460px, 1fr))",
      },
      colors: {
        gold: { 300: "#f8eac5" },
        darkblue: { 300: "#182430" },
        lightblue: { 300: "#89999f" },
        caritas: {
          red: "#E30613",
          "red-dark": "#B8050F",
          gray: {
            50: "#F5F5F5",
            100: "#EEEEEE",
            800: "#333333",
          },
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
      transitionTimingFunction: {
        "cubic-bezier": "cubic-bezier(0.34, 2, 0.6, 1)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      fontFamily: {
        sans: "Helvetica, Arial, sans-serif",
        handwritten: ["Shadows Into Light", "cursive"],
      },
    },
  },
  plugins: [],
};
