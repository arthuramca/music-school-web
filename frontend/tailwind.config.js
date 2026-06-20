export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        stage: {
          950: '#05050f',
          900: '#0a0a1a',
          800: '#0f0f28',
          700: '#1a1a3e',
          600: '#252555',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    }
  },
  plugins: []
}
