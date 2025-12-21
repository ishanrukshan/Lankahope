/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'unhro-dark-blue': '#00008B', // The main nav and footer color
        'unhro-purple': '#6A71B9',    // Team cards, Submit button
        'unhro-light-blue': '#ADD8E6', // Top header gradient start
        'unhro-pink': '#FFC0CB',       // Page title gradient start
        'sl-gold': '#C5A059',          // Sri Lanka Gold (More metallic)
        'sl-maroon': '#000000',        // Changed to Black
        'un-blue': '#009EDB',          // United Nations Blue
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Source Serif Pro', 'Noto Serif Sinhala', 'serif'],
      }
    },
  },
  plugins: [],
}
