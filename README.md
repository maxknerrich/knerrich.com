# knerrich.com

Max Knerrich's portfolio, built with SvelteKit and StyleX.

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

- `src/routes/+page.svelte`: page metadata and portfolio entry point
- `src/lib/Portfolio.svelte`: content, native theme controls, and accordions
- `src/lib/SectionOutline.svelte`: section navigation and animated active indicator
- `src/lib/SyncDiagram.svelte`: CSS-only, looping synchronization illustration
- `src/lib/styles.ts`: StyleX styles and entrance animations
- `src/app.css`: self-hosted font, theme tokens, and global defaults
- `src/app.html`: document shell and CSS layer order, declared before stylesheets load

## Behavior

The site uses a narrow layout, green light/dark palette, and Bricolage Grotesque headings. Projects precede the biography in a responsive bento grid. Experience and education use native accordions, open by default.

The MK logo and theme control sit at opposite top corners. The desktop header is transparent and lets pointer events through between the controls. The section outline sits at center left, becomes horizontal on tablets, and is hidden on mobile. Mobile section headings stick below the header with blurred backgrounds.

The outline tracks scrolling with `aria-current` and a 360ms Svelte tween. Native anchor scrolling puts section dividers above the desktop viewport or behind the tablet controls where space permits. Final anchors stop at the natural page end; no empty scroll space is added.

Light / Dark / Auto radios use CSS `:has()` and `light-dark()`, with Auto selected initially. Icons are always visible; only the selected option shows its label. No theme preference is stored.

Entrances run on load, with project cards before the bio, experience, education, and contact. The silent sync illustration uses a 3.6-second CSS loop. Dots ease along tracks connected to the node edges; nodes light up after arrival. Both directions share travel and pulse keyframes, offset by half a cycle. Reduced motion disables entrances, smooth scrolling, the moving indicator, and the sync loop.

The static adapter prerenders the site to `build/`. Hydration enables active-section tracking; navigation, themes, accordions, and the sync illustration work without JavaScript. No analytics, cookies, or external font requests are added.

## Assets

All assets are served locally:

- Bricolage Grotesque: SIL Open Font License in `static/fonts/bricolage-grotesque-OFL.txt`.
- Inlined Feather icons: MIT license in `static/licenses/feather.txt`.
- Brand SVGs in `static/logos/`: sourced from tldraw.dev and lw.works, including the Porsche wordmark used on lw.works. They remain the respective brands' trademarks.
- The transparent MK favicon follows the device color scheme.

## Before publishing

The legal pages are intentionally omitted pending review of current contact details and hosting. Experience uses the supplied LinkedIn export, excluding the entries requested for removal. Collapsed descriptions in that export have not been reconstructed. No deployment configuration or live hosting has been changed.
