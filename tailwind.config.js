/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#f1f5fb',
          100: '#e0e8f5',
          200: '#c3d2e9',
          300: '#95b0d6',
          400: '#6186bd',
          500: '#3f66a3',
          600: '#2f4f88',
          700: '#27406e',
          800: '#1d3155',
          900: '#13213a',
          // Alinhado ao fundo da logomarca Repara Edu (#09132a)
          950: '#09132a',
        },
        repara: {
          navy: '#09132a',
          orange: '#e8551f',
          'orange-soft': '#f97b4d',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(16 24 40 / 0.04), 0 1px 3px 0 rgb(16 24 40 / 0.06)',
        'card-hover': '0 4px 6px -1px rgb(16 24 40 / 0.07), 0 10px 20px -4px rgb(16 24 40 / 0.08)',
        pop: '0 10px 15px -3px rgb(16 24 40 / 0.08), 0 24px 48px -12px rgb(16 24 40 / 0.18)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out both',
        'fade-up': 'fade-up 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right': 'slide-in-right 0.25s ease-out both',
        'scale-in': 'scale-in 0.18s ease-out both',
      },
    },
  },
  plugins: [],
};
