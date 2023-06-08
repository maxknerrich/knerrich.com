import { defineConfig, presetMini, presetIcons, presetUno } from 'unocss';

export default defineConfig({
	//import all logos from skills
	content: {
		pipeline: {
			include: [
				// the default
				/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
				'src/content/skills/*.mdoc',
			],
			// exclude files
			// exclude: []
		},
	},
	safelist: ['i-untitled-x-close'],
	rules: [
		['bg', { 'background-color': 'var(--bg-color)' }],
		['color', { color: 'var(--color)' }],
		['r-bg', { '--bg-color': 'var(--r-bg-color)' }],
		['r-color', { '--color': 'var(--r-color)' }],
		['r-em', { '--em-color': 'var(--r-em-color)' }],
	],
	presets: [
		presetMini(),
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
					myta: '<svg width="1000" height="1000" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_127_7)"><rect width="1000" height="1000" rx="500" fill="#008580"/><path d="M500 1000C776.142 1000 1000 776.142 1000 500C1000 223.858 776.142 0 500 0C223.858 0 0 223.858 0 500C0 776.142 223.858 1000 500 1000Z" fill="#008580"/><path d="M273.589 730.931C263.591 730.92 253.748 728.462 244.92 723.771C236.092 719.079 228.547 712.297 222.943 704.018C217.34 695.738 213.85 686.212 212.776 676.273C211.703 666.333 213.08 656.282 216.787 646.997L363.153 281.066C368.03 268.888 376.69 258.599 387.858 251.717C399.025 244.834 412.109 241.722 425.179 242.839C438.25 243.956 450.615 249.243 460.453 257.921C470.291 266.598 477.08 278.207 479.82 291.036L525.3 504.505L641.411 356.261C649.261 346.249 660.036 338.932 672.237 335.329C684.439 331.726 697.46 332.017 709.489 336.159C721.518 340.302 731.957 348.092 739.352 358.444C746.747 368.796 750.732 381.197 750.751 393.919V669.67C750.499 685.733 743.941 701.054 732.493 712.324C721.044 723.595 705.623 729.912 689.557 729.912C673.492 729.912 658.07 723.595 646.622 712.324C635.173 701.054 628.615 685.733 628.363 669.67V571.276L566.922 649.73C557.5 661.807 544.841 670.959 530.418 676.121C515.996 681.283 500.405 682.242 485.459 678.886C470.513 675.53 456.828 667.998 445.997 657.166C435.166 646.334 427.634 632.649 424.279 617.703C424.279 617.478 424.189 617.267 424.129 617.042L402.027 513.318L330.375 692.447C325.835 703.799 318 713.532 307.879 720.391C297.758 727.249 285.815 730.921 273.589 730.931Z" fill="white"/><path style="mix-blend-mode:multiply" opacity="0.33" d="M525.315 504.505L484.985 315.315C424.925 389.685 402.027 513.258 402.027 513.258L424.174 617.117L424.309 617.778C427.67 632.72 435.204 646.401 446.035 657.229C456.866 668.057 470.55 675.586 485.493 678.941C500.437 682.297 516.026 681.339 530.446 676.181C544.867 671.023 557.527 661.876 566.952 649.805L628.409 571.351C630.406 570.586 643.273 478.754 628.409 372.868L525.315 504.505Z" fill="url(#paint0_linear_127_7)"/></g><defs><linearGradient id="paint0_linear_127_7" x1="426.607" y1="456.772" x2="620.646" y2="562.252" gradientUnits="userSpaceOnUse"><stop stop-color="#403F44"/><stop offset="0.04" stop-color="#57565B"/><stop offset="0.12" stop-color="#8A898C"/><stop offset="0.21" stop-color="#B4B4B6"/><stop offset="0.29" stop-color="#D5D4D6"/><stop offset="0.37" stop-color="#ECECEC"/><stop offset="0.44" stop-color="#FAFAFA"/><stop offset="0.5" stop-color="white"/><stop offset="0.56" stop-color="#FBFBFB"/><stop offset="0.62" stop-color="#EEEEEE"/><stop offset="0.69" stop-color="#DADADA"/><stop offset="0.75" stop-color="#BCBCBC"/><stop offset="0.82" stop-color="#979797"/><stop offset="0.88" stop-color="#696969"/><stop offset="0.95" stop-color="#343434"/><stop offset="1"/></linearGradient><clipPath id="clip0_127_7"><rect width="1000" height="1000" fill="white"/></clipPath></defs></svg>',
				},
				untitled: () =>
					import('./src/assets/untitled.json').then(i => i.default),
			},
		}),
	],
});
