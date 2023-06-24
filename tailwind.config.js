module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        backgroundBefore: {
          '0%': { transform: ['rotate(0deg)', 'translate(0%, 0%)'] },
          '25%': { transform: ['rotate(90deg)', 'translate(15%, 15%)'] },
          '50%': { transform: ['rotate(180deg)', 'translate(30%, 15%)'] },
          '75%': { transform: ['rotate(270deg)', 'translate(60%, 20%)'] },
          '100%': { transform: ['rotate(360deg)', 'translate(70%, 5%)'] },
        },
        backgroundAfter: {
          '0%': { transform: ['rotate(0deg)', 'translate(60%, 30%)'] },
          '25%': { transform: ['rotate(90deg)', 'translate(60%, 10%)'] },
          '50%': { transform: ['rotate(180deg)', 'translate(0%, 0%)'] },
          '75%': { transform: ['rotate(270deg)', 'translate(0%, 50%)'] },
          '100%': { transform: ['rotate(360deg)', 'translate(60%, 30%)'] },
        },
      },
      animation: {
        backgroundBefore: 'backgroundBefore 10s cubic-bezier(0.8, 0.2, 0.2, 0.8) alternate infinite',
        backgroundAfter: 'backgroundAfter 10s cubic-bezier(0.8, 0.2, 0.2, 0.8) alternate infinite'
      }
    },
  },
  plugins: [],
}
