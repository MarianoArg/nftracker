/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        righteous: ["Righteous", "ui-sans-serif"],
      },
      colors: {
        "primary-blue": "#100E1A",
        "secondary-blue": "#22263c",
        "neon-pink": "#CE66ED",
        "neon-purple": "#622ADB",
        "light-purple": "#7F6BC8",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-radix")()],
};
