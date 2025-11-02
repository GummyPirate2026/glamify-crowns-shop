import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFB6C1',
          light: '#FFE5EA',
          dark: '#FF8FA3',
        },
        secondary: {
          DEFAULT: '#A8D5BA',
          light: '#E8F5E9',
          dark: '#7FB591',
        },
        cream: '#FFF8E7',
        sage: '#E8F5E9',
        blush: '#FFE5EA',
        rose: '#FFB6C1',
        sand: '#F5F5F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'softer': '0 2px 10px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
export default config
