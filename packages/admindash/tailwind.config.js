/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './src/pages/**/*.{ts,tsx}',
        './src/components/**/*.{ts,tsx}',
        './src/app/**/*.{ts,tsx}',
        './src/features/**/*.{ts,tsx}',
        '../shared/src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // Keep your existing custom colors
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
                ring: '#6d28d9',

                // Add Radix Colors - these will be defined in CSS
                // Slate scale (gray) - only needed steps
                'slate-3': 'var(--slate-3)',
                'slate-5': 'var(--slate-5)',
                'slate-8': 'var(--slate-8)',
                'slate-10': 'var(--slate-10)',
                'slate-11': 'var(--slate-11)',
                'slate-12': 'var(--slate-12)',

                // Green scale (for success/balance) - only 8 and 10
                'green-8': 'var(--green-8)',
                'green-10': 'var(--green-10)',

                // Red scale (for destructive/errors) - only 8 and 10
                'red-8': 'var(--red-8)',
                'red-10': 'var(--red-10)',

                // Orange scale (for warnings/suspend) - only 8 and 10
                'orange-8': 'var(--orange-8)',
                'orange-10': 'var(--orange-10)',
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