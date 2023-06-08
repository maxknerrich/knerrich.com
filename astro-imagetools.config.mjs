import { defineConfig } from 'astro-imagetools/config';

export default defineConfig({
	placeholder: 'dominantColor',
	format: ['webp', 'avif', 'jpg'],
	fallbackFormat: 'png',
	includeSourceFormat: false,
	formatOptions: {
		jpg: {
			quality: 80,
		},
		png: {
			quality: 80,
		},
		webp: {
			quality: 50,
		},
	},
});
