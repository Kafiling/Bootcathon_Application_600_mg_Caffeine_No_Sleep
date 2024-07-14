/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',
        '38': '9.5rem',
      },
      screens: {
        'xs': '385px',
        'sm': '640px',
        'md': '768px',
      },
    },
    plugins: [],
  }
}

