import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import UnoCSS from 'unocss/astro';
import markdoc from '@astrojs/markdoc';

import image from '@astrojs/image';

// https://astro.build/config
export default defineConfig({
	site: 'https://knerrich.com',
	integrations: [
		sitemap(),
		markdoc(),
		UnoCSS(),
		image({
			serviceEntryPoint: '@astrojs/image/sharp',
		}),
	],
	server: {
		port: 8894,
	},
});
