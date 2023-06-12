import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import UnoCSS from 'unocss/astro';
import markdoc from '@astrojs/markdoc';
import { astroImageTools } from 'astro-imagetools';

//
// https://astro.build/config
export default defineConfig({
	site: 'https://www.knerrich.com',
	integrations: [sitemap(), UnoCSS(), astroImageTools, markdoc()],
	server: {
		port: 8894,
	},
	vite: {
		build: {
			assetsDir: '_astro',
		},
	},
});
