import Picture from '$components/Picture.astro';
import Gallery from '$components/Gallery.astro';
import Video from '$components/Video.astro';
import Row from '$components/Row.astro';
import { defineMarkdocConfig, nodes } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
	nodes: {
		document: {
			...nodes.document,
			render: 'main',
		},
	},
	tags: {
		video: {
			render: Video,
			selfClosing: true,
			attributes: {
				src: { type: String, required: true },
				poster: { type: String },
			},
		},
		picture: {
			render: Picture,
			selfClosing: true,
			attributes: {
				src: { type: String, required: true },
				aspect: { type: Number, default: 16 / 10 },
				alt: { type: String, default: '' },
			},
		},
		gallery: {
			render: Gallery,
		},
		row: {
			render: Row,
			attributes: {
				twoColumn: { type: Boolean },
			},
		},
	},
});
