/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F6F0E6',
          50: '#FCF9F5',
          100: '#F6F0E6',
          200: '#EDE4D5',
          300: '#E2D5C0',
          paper: '#FAF6F0',
        },
        espresso: {
          DEFAULT: '#1D1916',
          light: '#2E2722',
          muted: '#5A5048',
          border: '#1D1916',
        },
        matcha: {
          DEFAULT: '#8FAF78',
          light: '#A7C492',
          dark: '#6E8E57',
          soft: '#E8EFE3',
        },
        butter: {
          DEFAULT: '#F4D35E',
          light: '#F8E08E',
          dark: '#E2BD39',
          soft: '#FDF7DF',
        },
        cherry: {
          DEFAULT: '#D94A45',
          light: '#E66D69',
          dark: '#B83530',
          soft: '#FCEBEA',
        },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        handwritten: ['Caveat', 'cursive'],
      },
      boxShadow: {
        'brutal': '3px 3px 0px #1D1916',
        'brutal-lg': '5px 5px 0px #1D1916',
        'brutal-xl': '8px 8px 0px #1D1916',
        'brutal-yellow': '4px 4px 0px #F4D35E',
        'brutal-matcha': '4px 4px 0px #8FAF78',
        'brutal-cherry': '4px 4px 0px #D94A45',
        'polaroid': '0 10px 25px -5px rgba(29, 25, 22, 0.12), 0 8px 10px -6px rgba(29, 25, 22, 0.08)',
      },
      rotate: {
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
        '-1': '-1deg',
        '-2': '-2deg',
        '-3': '-3deg',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.03)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'wiggle': 'wiggle 2.5s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'marquee': 'marquee 22s linear infinite',
      },
    },
  },
  plugins: [],
}
