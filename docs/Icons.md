## Icons

Every icon is an `.svg` file in `src/lib/icons/`, and every plain logo (Porsche, tldraw, lw.works, the Knerrich wordmark) one in `src/lib/logos/`. There are no icon packages: the files are copied in. `src/lib/icons/glyphs.ts` imports each one by name as text (`?raw`), so `IconName` is checked, and the build inlines it into the page.

- In Svelte: `<Icon name="copy" style={code.icon} />` (`src/lib/icons/Icon.svelte`). It takes the file's root attributes (`viewBox`, `fill`, `stroke`…) and draws its contents, and is hidden from screen readers unless given a `label`, as the logos are. Its size comes from `style`.
- In Markdown rendered on the server (note icons, heading links): `iconHtml(name)` in `src/lib/server/markdown/html.ts`.

A file paints with `currentColor`, set on its root (`fill`, or `stroke` for a drawn icon like `table.svg`), so it takes the text colour.

Shapes that code computes with stay in TypeScript instead: the sticker marks (`src/lib/stickers/marks.ts`, the K the header draws included), the sticker illustrations (`art.ts`), the garden-stage plants (`src/lib/writing/plants.ts`) and the sync drawing.

### Which set

- **Phosphor, Regular weight** ([phosphoricons.com](https://phosphoricons.com), MIT) everywhere, brand logos included. Its `viewBox` is `0 0 256 256`.
- **Pixelarticons** ([pixelarticons.com](https://pixelarticons.com), MIT) wherever the Geist Pixel font is: code block buttons, the visualizations' controls, the reading rail. The offer cards' holo stickers print one in their middle, at 36px, 24px on phones (`HoloSticker.svelte`). Their files start with `pixel-` and set `shape-rendering="crispEdges"`, which keeps their edges hard. Their `viewBox` is `0 0 24 24`, drawn in 2-unit pixels, so show them at sizes where each of their pixels lands on whole screen pixels on 2× screens: 12px (the scale of the pixel font, `code.icon`), 18px (the visualizations' controls, `stepper.icon`: each icon pixel is 3 screen pixels) or 24px. Keep those styles on one of these sizes.

Licences are in `static/licenses/`.

### Adding an icon

1. Find it in the right set (for Phosphor, the Regular weight) and save its SVG in `src/lib/icons/`. `https://api.iconify.design/ph/<name>.svg` or `https://api.iconify.design/pixelarticons/<name>.svg` gives the bare SVG. Set `fill="currentColor"` on its root.
2. Import it in `glyphs.ts` and add it to `sources`.
3. Use it by name.

### Why inline

The shapes are in the HTML. A sprite file (`<use href="/icons.svg#…">`) would cache them across pages, but it loads after the page, so icons would pop in on a first visit. Moving them into the stylesheet as CSS `d: path(…)` would avoid that, but Safari parses the property without drawing it (still the case in Safari 27, though WebKit is working on it), and `@supports` can't tell. Until Safari draws it, inline is the only version that works everywhere without JavaScript and without a pop-in. When it does, only `Icon.svelte`, `iconHtml` and `glyphs.ts` need to change.
