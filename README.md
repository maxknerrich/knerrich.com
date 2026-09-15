# knerrich.com

Max Knerrich's portfolio, built with SvelteKit and StyleX.

## Development

Requires Node.js 22.18+ and [Vite+](https://viteplus.dev/).

```sh
vp install
vp dev
```

The dev server binds to `0.0.0.0`, so it is reachable through this machine's LAN and Tailscale IPs. Use the port printed by Vite, normally `5173`. This does not enable Tailscale Funnel or change tailnet access rules.

```sh
vp run check   # Svelte and TypeScript checks
vp lint
vp build
vp preview
```

## Structure

- `src/routes/+page.svelte`: page metadata and portfolio entry point
- `src/lib/Portfolio.svelte`: homepage content, project links, and accordions
- `src/lib/SiteHeader.svelte`: shared logo and native theme controls
- `src/content/projects/*.md`: short project write-ups
- `src/lib/server/projects.ts`: build-time Markdown loading and metadata
- `src/routes/projects/[slug]/`: prerendered project pages
- `src/lib/SectionOutline.svelte`: section navigation and animated active indicator
- `src/lib/SyncDiagram.svelte`: CSS-only, looping synchronization illustration
- `src/lib/styles.ts`: StyleX styles and entrance animations
- `src/app.css`: self-hosted font, theme tokens, and global defaults
- `src/app.html`: document shell and CSS layer order, declared before stylesheets load

## Editing projects

Edit the plain Markdown files in `src/content/projects/`. The filename is the URL slug, the first `#` heading is the title, and the first paragraph supplies the page description. Keep the title and opening paragraph plain text. An optional bullet list directly after the title supplies the work-type tags. Use normal Markdown for the body, images, and links.

```md
# Project name

- UX design
- Prototyping
- Voluntary work

A short opening description.

## My contribution

The rest of the write-up.
```

The first standalone image in a write-up becomes its lead image, above the body. Keep its URL matched to the homepage thumbnail so the image can animate between views. The title also moves between its card and page heading. Back links return to the corresponding card.

Assets live in `static/projects/<slug>/` and are referenced as `/projects/<slug>/image.jpg`. The thesis PDF is public at `/projects/local-first-api-sync/thesis.pdf`. `ASSETS_DELETE_LATER/` is source material only and is not served or needed by the build.

Markdown is rendered with `marked` at build time, with no browser-side Markdown parser. It is trusted repository content, not a renderer for visitor input. All project files are prerendered automatically. When adding a project, also add its homepage link in `Portfolio.svelte` and URL in `static/sitemap.xml`.

The old `/projects/annextracker` and `/projects/fcsl` paths are preserved. Bakery Backbone and Saturdays are intentionally left out for now.

## Behavior

The homepage uses a 49rem maximum width, green light/dark palette, and Bricolage Grotesque headings. Cards have 1.75rem padding on desktop and 1.5rem on mobile. Projects precede the biography in a responsive grid. Each card is a single, keyboard-accessible link with a visible hover and focus state. Four cards use project images; the thesis keeps its animated sync diagram. Experience and education use native accordions, open by default.

The MK logo and theme control sit at opposite top corners. The desktop header is transparent and lets pointer events through between the controls. The section outline sits at center left, becomes horizontal on tablets, and is hidden on mobile. Mobile section headings stick below the header with blurred backgrounds.

The outline tracks scrolling with `aria-current` and a 360ms Svelte tween. Native anchor scrolling puts section dividers above the desktop viewport or behind the tablet controls where space permits. Final anchors stop at the natural page end; no empty scroll space is added.

Light / Dark / Auto radios use CSS `:has()` and `light-dark()`, with Auto selected initially. Icons are always visible; only the selected option shows its label. The shared layout keeps the selection when navigating between the homepage and projects. No theme preference is stored across reloads.

Entrances run on the first page load only, with project cards before the bio, experience, education, and contact. After client-side navigation, the layout disables their duration and delay so returning home does not replay them. Route changes use native View Transitions. Matching images and titles move and resize over 460ms, while the remaining page crossfades over 180ms and the header stays stationary. The destination image is decoded before capture so it does not animate as an empty box. Same-page anchors, reduced-motion users, and browsers without the API skip the transition. SvelteKit retains control of scroll restoration. The silent sync illustration uses a 3.6-second CSS loop. Dots ease along tracks connected to the node edges; nodes light up after arrival. Both directions share travel and pulse keyframes, offset by half a cycle. Reduced motion disables entrances, smooth scrolling, the moving indicator, and the sync loop.

The static adapter prerenders the site to `build/`. Hydration enables active-section tracking; navigation, themes, accordions, and the sync illustration work without JavaScript. No analytics, cookies, or external font requests are added.

## Assets

All assets are served locally:

- Bricolage Grotesque: SIL Open Font License in `static/fonts/bricolage-grotesque-OFL.txt`.
- Inlined Feather icons: MIT license in `static/licenses/feather.txt`.
- Brand SVGs in `static/logos/`: sourced from tldraw.dev and lw.works, including the Porsche wordmark used on lw.works. They remain the respective brands' trademarks.
- The transparent MK favicon follows the device color scheme.
- Project imagery comes from the supplied assets. Luchse sketch and crest images were recovered from the previous website at commit `4c1f767`.
- Porsche images are official Porsche press material, credited on the project page.
- The thesis architecture diagram is extracted from Figure 6 of the supplied PDF. The original PDF is included unchanged.
- tldraw covers the website design system and reusable 3D illustration toolkit, with lw.works credited. `website-home.jpg` and `website-starter-kits.jpg` are browser screenshots of the public tldraw.dev site. Unreleased work is omitted.

## Before publishing

The legal pages are intentionally omitted pending review of current contact details and hosting. Experience uses the supplied LinkedIn export, excluding the entries requested for removal. Collapsed descriptions in that export have not been reconstructed. No deployment configuration or live hosting has been changed.
