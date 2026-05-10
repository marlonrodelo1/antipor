/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B6EA8',
          deep: '#2C5485',
        },
        secondary: '#7BA888',
        accent: '#E8B96A',
        warm: {
          DEFAULT: '#D97757',
          soft: '#EFC9B6',
          bg: '#F5E5DC',
        },
        bg: '#F7F5F2',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1C2128',
          2: '#3F4854',
          3: '#6B7280',
        },
        hairline: 'rgba(28,33,40,0.08)',
        hairlineStrong: 'rgba(28,33,40,0.14)',
        dk: {
          bg: '#0F1419',
          surface: '#1C2128',
          surface2: '#242A33',
          ink: '#E8E6E3',
          ink2: '#A6ADB7',
          hairline: 'rgba(255,255,255,0.08)',
        },
      },
      fontFamily: {
        serif: ['Fraunces_500Medium', 'Fraunces', 'serif'],
        'serif-bold': ['Fraunces_600SemiBold', 'serif'],
        sans: ['Inter_400Regular', 'Inter', 'sans-serif'],
        'sans-medium': ['Inter_500Medium', 'sans-serif'],
        'sans-semibold': ['Inter_600SemiBold', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
