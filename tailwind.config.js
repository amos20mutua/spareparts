/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff8ff',
          100: '#d7ebff',
          200: '#b6dbff',
          300: '#84c3ff',
          400: '#4ea4ff',
          500: '#1e80f0',
          600: '#1062ca',
          700: '#104da4',
          800: '#133f82',
          900: '#16366b'
        },
        ink: {
          50: '#f7f8fb',
          100: '#eff1f5',
          200: '#dbe0e8',
          300: '#b4bfce',
          400: '#8697ad',
          500: '#64758b',
          600: '#4d5c70',
          700: '#3f4b5d',
          800: '#313a49',
          900: '#1e252f'
        },
        accent: '#f97316'
      },
      boxShadow: {
        card: '0 10px 35px -18px rgba(15, 23, 42, 0.18)'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top right, rgba(30, 128, 240, 0.18), transparent 30%), linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(239, 248, 255, 0.95))'
      }
    }
  },
  plugins: []
};
