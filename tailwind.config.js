/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				foreground: '#000000',
				background: '#fdfcf1',
				primary: '#588ee4',
				secondary: '#ffdc20',
				accent: '#1937e1',
				grid: '#f4eeb0',
				'foreground-dark': '#e7f0fe',
				'background-dark': '#031430',
				'primary-dark': '#588ee4',
				'secondary-dark': '#ffd313',
				'accent-dark': '#de8e0d',
				'grid-dark': '#072f71'
			}
		}
	},
	plugins: [],
	darkMode: 'class'
};
