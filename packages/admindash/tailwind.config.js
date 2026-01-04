/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(0 0% 33%)",
        input: "hsl(0 0% 33%)",
        ring: "hsl(27 96% 46%)",
        background: "hsl(0 0% 10%)",
        foreground: "hsl(0 0% 90%)",
        primary: {
          DEFAULT: "hsl(27 96% 46%)",
          foreground: "hsl(0 0% 10%)",
        },
        secondary: {
          DEFAULT: "hsl(0 0% 16%)",
          foreground: "hsl(0 0% 90%)",
        },
        destructive: {
          DEFAULT: "hsl(4 90% 58%)",
          foreground: "hsl(0 0% 100%)",
        },
        success: {
          DEFAULT: "hsl(144 76% 60%)",
          foreground: "hsl(0 0% 10%)",
        },
        warning: {
          DEFAULT: "hsl(48 100% 50%)",
          foreground: "hsl(0 0% 10%)",
        },
        muted: {
          DEFAULT: "hsl(0 0% 16%)",
          foreground: "hsl(0 0% 50%)",
        },
        accent: {
          DEFAULT: "hsl(0 0% 16%)",
          foreground: "hsl(0 0% 90%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 16%)",
          foreground: "hsl(0 0% 90%)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
}
