module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        backgroundBefore: {
          '0%': { transform: ['rotate(0deg)', 'translate(0rem, 0rem)'] },
          '25%': { transform: ['rotate(90deg)', 'translate(15rem, 15rem)'] },
          '50%': { transform: ['rotate(180deg)', 'translate(30rem, 15rem)'] },
          '75%': { transform: ['rotate(2700deg)', 'translate(60rem, 20rem)'] },
          '100%': { transform: ['rotate(3600deg)', 'translate(70rem, 5rem)'] },
        },
        backgroundAfter: {
          '0%': { transform: ['rotate(0deg)', 'translate(60rem, 30rem)'] },
          '25%': { transform: ['rotate(90deg)', 'translate(60rem, 10rem)'] },
          '50%': { transform: ['rotate(180deg)', 'translate(0rem, 0rem)'] },
          '75%': { transform: ['rotate(2700deg)', 'translate(0rem, 50rem)'] },
          '100%': { transform: ['rotate(3600deg)', 'translate(60rem, 30rem)'] },
        },
      },
      animation: {
        backgroundBefore: 'backgroundBefore 70s cubic-bezier(0.8, 0.2, 0.2, 0.8) alternate infinite',
        backgroundAfter: 'backgroundAfter 70s cubic-bezier(0.8, 0.2, 0.2, 0.8) alternate infinite'
      }
    },
  },
  plugins: [],
}
