/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#000000",
          level1: "#1c1c1e",
          level2: "#2c2c2e",
          level3: "#464647",
        },
        text: {
          DEFAULT: "#ffffff",
          second: "#848484",
        },
        primary: {
          DEFAULT: "#9F7AEA",
          contrast: "#E4DEF2",
        },
        secondary: {
          danger: "#DD404A",
          success: "#2ECC71",
        },
        card: {
          DEFAULT: "#475675",
          light: "#8A9BA8",
          muted: "#848484",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        'space-50': '50px',
        'space-30': '30px',
        'space-25': '25px',
        'space-20': '20px',
        'space-10': '10px',
      },
      borderRadius: {
        '30': '30px',
        '40': '40px',
        '65': '65px',
      },
    },
  },
  plugins: [],
}

