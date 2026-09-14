# knerrich.com

A small, text-first portfolio built with SvelteKit and StyleX.

## Development

Requires Node.js 22.18+ and [Vite+](https://viteplus.dev/).

```sh
vp install
vp dev
```

```sh
vp run check   # Svelte and TypeScript checks
vp lint
vp build
vp preview
```

## Structure

- `src/routes/+page.svelte`: copy and page markup
- `src/lib/styles.ts`: StyleX component styles
- `src/app.css`: CSS layers, theme tokens and global defaults
- `svelte.config.js`: static adapter and experimental async compiler support

The native Light / Dark / Auto radio group sets the color scheme through CSS `:has()` and `light-dark()`. Auto follows the device preference and is the default. No theme preference is stored. The green accent has a darker text variant in light mode for readable contrast. Instrument Serif is self-hosted in `static/fonts/` under the included SIL Open Font License, alongside system sans-serif text. No external font requests, analytics or cookies are added. The page uses a slow staggered entrance on load, with no scroll-linked animation. All motion respects the reduced-motion preference.

The transparent MK favicon follows the device color scheme: black in light mode, white in dark mode. Feather icons are inlined as SVGs, with the MIT license in `static/licenses/feather.txt`. The theme picker uses CSS transitions to reveal its active label.

Brand SVGs in `static/logos/` come from tldraw.dev and lw.works, including the Porsche wordmark used on lw.works. They remain the respective brands' trademarks. All assets are served locally.

The static adapter writes the site to `build/`. All content is prerendered, and the production page loads no client JavaScript. Client rendering stays enabled in development for hot reload. Async compilation is enabled, but the page doesn't need async data fetching.

## Before publishing

The legal pages are intentionally omitted pending review of current contact details and hosting. Experience uses the supplied LinkedIn export, excluding the entries requested for removal. Collapsed descriptions in that export have not been reconstructed. No deployment configuration or live hosting has been changed.
