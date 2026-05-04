/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f0f1a',
          card: '#16162a',
          hover: '#1e1e38',
          border: '#2d2d52',
        },
        accent: {
          DEFAULT: '#818cf8',
          dim: '#4f46e5',
          glow: '#c4b5fd',
        },
        base: '#08080f',
        muted: '#64748b',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'accent': '0 0 30px rgba(129, 140, 248, 0.25)',
        'accent-lg': '0 0 50px rgba(129, 140, 248, 0.4)',
        'pink': '0 0 20px rgba(244, 114, 182, 0.3)',
      },
    },
  },
  plugins: [],
};
