/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				foreground: '#171717',
				background: '#ffcd18',
				primary: '#2354db',
				secondary: '#0c0a91',
				grid: '#ffffff',
				'foreground-dark': '#e7f0fe',
				'background-dark': '#031430',
				'primary-dark': '#ffd313',
				'secondary-dark': '#de8e0d',
				'grid-dark': '#072f71'
			}
		}
	},
	plugins: [],
	darkMode: 'class'
};
