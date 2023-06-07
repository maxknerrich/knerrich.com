import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import UnoCSS from 'unocss/astro';
import markdoc from '@astrojs/markdoc';

// https://astro.build/config
export default defineConfig({
	site: 'https://knerrich.com',
	integrations: [sitemap(), markdoc(), UnoCSS()],
	server: { port: 8894 },
});
