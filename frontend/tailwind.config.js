/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff8ff',
          100: '#daeeff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#58b0ff',
          500: '#3194ff',
          600: '#1976f7',
          700: '#155fdc',
          800: '#174fb2',
          900: '#19458b',
        },
        accent: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(25, 69, 139, 0.18)',
      },
    },
  },
  plugins: [],
}
