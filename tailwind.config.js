/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            screens: {
                tablet: '801px',
                desktop: '1101px'
            },
            colors: {
                ink: '#18334b',
                muted: '#6a8192',
                health: '#1460d2',
                'health-dark': '#0e3f86',
                line: '#dce8ee',
                mint: '#dff4ed',
                coral: '#f59a5c',
                lilac: '#7d73dd'
            },
            fontFamily: {
                sans: ['DM Sans', 'sans-serif'],
                display: ['Manrope', 'sans-serif']
            }
        }
    },
    plugins: []
};
