const daisyui = require('daisyui');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [daisyui],

	daisyui: {
		themes: [
			{
				customLight: {
					'base-100': '#e8e8e8',
					'base-200': '#dfdfdf',
					neutral: '#F3F0EE',
					primary: '#515151',
					accent: '#E6C4A4'
				}
			}
		]
	}
};

module.exports = config;
