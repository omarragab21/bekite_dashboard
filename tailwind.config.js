/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#933D6B', // اللون البنفسجي الدقيق من Figma
        'primary-dark': '#7B2F5A',
        'primary-light': '#A8507F',
        'sidebar-bg': '#1E293B',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
