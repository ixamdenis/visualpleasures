/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#0f0f13',      // Más oscuro aún (casi negro)
                    surface: '#1E1E24',   // Para tarjetas
                    primary: '#FF9B85',   // Salmón
                    gold: '#E0CA3C',      // Dorado
                    accent: '#6B4C9A',    // Un toque violeta para el neón (inspirado en Ref 1)
                }
            },
            fontFamily: {
                sans: ['"Josefin Sans"', 'sans-serif'],
                slab: ['"Josefin Slab"', 'serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}