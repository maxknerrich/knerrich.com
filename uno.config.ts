import { defineConfig, presetMini, presetIcons, presetUno } from 'unocss';

export default defineConfig({
	presets: [
		presetMini({ dark: 'media' }),
		presetUno(),
		presetIcons({
			customizations: {
				customize(props) {
					props.width = '1.5em';
					props.height = '1.5em';
					return props;
				},
				transform(svg) {
					return svg.replace(/black/, 'currentColor');
				},
			},
			collections: {
				custom: {
					logo: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 18V6H5.54912L7.83397 15.9086H8.07768L10.4082 6H13.9573V18H11.901V7.76571L12.5864 8.53714H10.9871L11.8401 7.8L9.43336 18H6.46306L4.11729 7.78286L4.9703 8.53714H3.35567L4.04113 7.76571V18H2Z" fill="black"/><path d="M11.901 18V6H13.9421V12.2743L18.8164 6H21.5887L16.7296 12.0171L17.0343 10.8343L22 18H19.4105L15.7852 12.5314L16.2574 12.6171L13.9421 15.4629V18H11.901Z" fill="black"/></svg>',
				},
				untitled: () =>
					import('./src/assets/untitled.json').then(i => i.default),
			},
		}),
	],
});
