/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0 0% 0%)',
        foreground: 'hsl(0 0% 100%)',
        primary: {
          DEFAULT: '#6d28d9',
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
          DEFAULT: '#6d28d9',
          foreground: 'hsl(0 0% 100%)',
        },
        border: 'hsl(0 0% 20%)',
        input: 'hsl(0 0% 20%)',
        ring: '#6d28d9',
        'yan-avatar': {
          primary: '#DC2678',
          secondary: '#78DC26',
        },
        'yan-draw': {
          primary: '#2678DC',
          secondary: '#DCA626',
        },
        'yan-photobooth': {
          primary: '#7826DC',
          secondary: '#26DC78',
        },
        whatsapp: '#22c55e',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      animation: {
        'bounce-fast': 'bounce 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
}
