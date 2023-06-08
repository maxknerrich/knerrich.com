module.exports = {
	plugins: [require.resolve('prettier-plugin-astro')],
	bracketSpacing: true,
	singleQuote: true,
	trailingComma: 'all',
	arrowParens: 'avoid',
	semi: true,
	useTabs: true,
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
};
