/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        nav: "84.375em",
      },
      height: {
        "header-mobile": "var(--header-height-mobile)",
        "header-desktop": "var(--header-height-desktop)",
        "header-desktop-collapsed": "var(--header-height-desktop-collapsed)",
      },
      spacing: {
        "header-mobile": "var(--header-height-mobile)",
        "header-desktop": "var(--header-height-desktop)",
        "header-desktop-collapsed": "var(--header-height-desktop-collapsed)",
      },
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: { 300: "#f8eac5" },
        darkblue: { 300: "#182430" },
        lightblue: { 300: "#89999f" },
        caritas: {
          red: "#E30613",
          "red-dark": "#B8050F",
          "regio-red": "#fe0020",
          "regio-red-dark": "#db001b",
          grey: "#575656",
          gray: {
            50: "#F5F5F5",
            100: "#EEEEEE",
            800: "#333333",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "2rem",
      },
      transitionTimingFunction: {
        "cubic-bezier": "cubic-bezier(0.34, 2, 0.6, 1)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        nav: "cubic-bezier(0.25, 0.46, 0.45, 0.75)",
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        handwritten: ["Shadows Into Light", "cursive"],
      },
      boxShadow: {
        header: "0 2px 20px 0 rgba(26, 25, 25, 0.12)",
        "regio-pill": "-1px 1px 50px rgba(0, 0, 0, 0.2)",
        "regio-pill-hover": "-1px 1px 50px rgba(0, 0, 0, 0.26)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        wiggle1: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        wiggle2: {
          "0%, 100%": { transform: "rotate(3deg)" },
          "50%": { transform: "rotate(-3deg)" },
        },
        wiggle3: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        glow1: {
          "0%, 100%": { transform: "scale(0.6)" },
          "50%": { transform: "scale(1)" },
        },
        glow2: {
          "0%, 100%": { transform: "scale(0.8)" },
          "50%": { transform: "scale(1.1)" },
        },
        glow3: {
          "0%, 100%": { transform: "scale(0.7)" },
          "50%": { transform: "scale(1.05)" },
        },
        ballFadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        wiggle1: "wiggle1 4s linear infinite",
        wiggle2: "wiggle2 4s linear infinite",
        wiggle3: "wiggle3 4s linear infinite",
        glow1: "glow1 2s linear infinite",
        glow2: "glow2 2s linear infinite",
        glow3: "glow3 2s linear infinite",
        ballFadeIn: "ballFadeIn 1s ease forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
