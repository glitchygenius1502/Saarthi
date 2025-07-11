// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brown: "#7B3F00",
        beige: "#F5F5DC",
        cream: "#FFFDD0",
      },
          animation: {
      'fade-in': 'fadeIn 0.4s ease-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0, transform: 'translateY(10px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
    },
    },
  },
  plugins: [],
};

