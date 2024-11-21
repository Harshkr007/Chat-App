/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {  // Changed from 'color' to 'colors'
        primary:'#4499e3',
        secondary:'#113f67',
      }
    },
  },
  plugins: [],
}

