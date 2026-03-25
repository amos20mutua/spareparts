/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf1f2',
          100: '#f9d8dc',
          200: '#f4b3bb',
          300: '#ee8e99',
          400: '#e96572',
          500: '#E63946',
          600: '#c92d39',
          700: '#a8232d',
          800: '#7e1b22',
          900: '#5a1419'
        },
        ink: {
          50: '#F5F5F5',
          100: '#ECEDEF',
          200: '#DDE1E7',
          300: '#C4CAD5',
          400: '#8D99AE',
          500: '#6E7788',
          600: '#4D525E',
          700: '#34363E',
          800: '#1F1F24',
          900: '#0B0B0D'
        },
        accent: '#1F1F24'
      },
      boxShadow: {
        card: '0 14px 40px -24px rgba(11, 11, 13, 0.22)'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top right, rgba(230, 57, 70, 0.14), transparent 30%), linear-gradient(135deg, rgba(245, 245, 245, 0.96), rgba(236, 237, 239, 0.96))'
      }
    }
  },
  plugins: []
};
