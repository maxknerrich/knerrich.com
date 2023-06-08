import Picture from '$components/Picture.astro';
import { defineMarkdocConfig } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
	tags: {
		picture: {
			render: Picture,
			selfClosing: true,
			attributes: {
				src: { type: String, required: true },
				aspect: { type: Number, default: 16 / 10 },
				alt: { type: String, default: '' },
			},
		},
	},
});
