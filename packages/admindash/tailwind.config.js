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
    extend: {
      colors: {
        background: 'hsl(0 0% 0%)',
        foreground: 'hsl(0 0% 100%)',
        primary: {
          DEFAULT: 'hsl(20 100% 50%)',
          foreground: 'hsl(0 0% 100%)',
        },
        secondary: {
          DEFAULT: 'hsl(0 0% 10%)',
          foreground: 'hsl(0 0% 100%)',
        },
        muted: {
          DEFAULT: 'hsl(0 0% 20%)',
          foreground: 'hsl(0 0% 60%)',
        },
        accent: {
          DEFAULT: 'hsl(20 100% 50%)',
          foreground: 'hsl(0 0% 100%)',
        },
        destructive: {
          DEFAULT: 'hsl(4 90% 58%)',
          foreground: 'hsl(0 0% 100%)',
        },
        success: {
          DEFAULT: 'hsl(144 76% 60%)',
          foreground: 'hsl(0 0% 10%)',
        },
        warning: {
          DEFAULT: 'hsl(48 100% 50%)',
          foreground: 'hsl(0 0% 10%)',
        },
        border: 'hsl(0 0% 20%)',
        input: 'hsl(0 0% 20%)',
        ring: 'hsl(20 100% 50%)',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}
