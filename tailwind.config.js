export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        usf: {
          orange: '#EE7F2D',
          green: '#2F7D4B',
          deep: '#1E2A38',
          slate: '#E7EEF5',
          muted: '#6B7280'
        }
      },
      boxShadow: {
        soft: '0 10px 35px rgba(15,23,42,0.08)'
      }
    }
  },
  plugins: []
};
