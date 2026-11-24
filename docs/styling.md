## Styling

`src/lib/styles/` holds the tokens and the styles shared by several components: `shared.ts` (the type roles, glass, entrances, and the page parts every page uses), `prose.ts`, `code.ts`, `stepper.ts` and `media-blocks.ts`. A style used by one component lives with it: inside the component's `<script module>`, or in `<Component>.styles.ts` beside it when it is long (`Stickers.styles.ts`, `BottomBar.styles.ts`). It has to be the module script: StyleX only compiles `stylex.create` at a module's top level, and the instance script compiles into a function. Either way it is StyleX with values from the tokens, never a Svelte `<style>` block.

- A route's styles sit beside its `+page.svelte` under a plain name (`src/routes/landing.styles.ts`, `projects/[slug]/case-study.styles.ts`): SvelteKit reserves file names that start with `+`.
- A component that uses the `$effect` rune can't import the `effect` tokens into its own script: Svelte reads `$effect` as a store named `effect`. Its styles go in `<Component>.styles.ts`, however short (`BottomBar.styles.ts`).

`tokens.stylex.ts` is the one variable file. Besides the design values it holds:

- `vars`, `button`, `stickerState`: variables set per element at runtime (`--edge`, a button's gradient stops, a sticker's position).
- `media`: breakpoints and feature queries, as `media.phone` and so on.
- The markers (`rollMarker` and so on), for `stylex.when.ancestor(":hover", cardMarker)`, so a hover on one thing can style another.

### Tokens

- Keys starting with `--` keep their names in the CSS. That is how `src/app.css` can use `var(--text)`. In styles, import the token: `color["--text"]`.
- An imported token is a `var(--…)` string, no use where there's no CSS: the preview images (`src/lib/server/og.ts`, drawn by `OgCard.svelte` with inline styles) render without the site's variables, and timers need numbers. Values needed there are `defineConsts` at the top of `tokens.stylex.ts` (`palette`, `surface`, `timing`): code imports them as plain values, and the tokens are built from them.
- A value that is a const is used as the const. It gets no variable of the same value beside it, unless `app.css` reads it by name (`--night`, `--text`).
- The green is written once, as `green` and `greenAt(alpha)` at the top of the file. Every token that is green is built from them.
- The site is dark only, so colours are plain values, with no `light-dark()`.
- The `code` tokens are named by Shiki: its CSS variables theme writes `color: var(--code-token-keyword)` inline. Don't rename them.
- A token can't use a variable that is set per element. A variable defined on `:root` resolves its `var()`s there, so every element would get the `:root` value. The sticker's pointer-following light is an example: the tokens hold only its colour stops, and the gradient that uses `--sticker-px` is written in `Stickers.styles.ts`.
- Runtime variables that transition (the button stops, the sticker's peel depth and pointer position) are typed with `stylex.types` (`button`, `stickerState`), so StyleX registers them with `@property`. Without a type, a custom property can't be interpolated. StyleX always registers them as inheriting; nothing inside a button sets or reads the stops, so that is harmless. The sticker ones are plain numbers, so they work inside `calc()`.

### Type and units

- The type roles (`type` in `shared.ts`) are sized for a 1440px wide window: each `clamp()` reaches its maximum about there. For a new size, the `vw` value is the maximum in px divided by 14.4.
- The hero headline (`--type-display`) is sized in `cqi` of the page (`shell.page` in `src/routes/+layout.svelte`), so it keeps its line breaks at any width, and stops growing at `--content-width`, where the content does. Its scale is set to fill three lines with the current copy; phones get their own so "car dashboards." stays on one line. Both match the earlier `vw` sizes where the scrollbar takes no room (phones, macOS); where `scrollbar-gutter` reserves 15px the headline is about 1% smaller.
- Sticker sizes are in `em`, so a sticker scales with its font size (`--type-sticker`).
- Inside an SVG drawing, `px` are user units that scale with the drawing, so raw `px` there are fine (a lint exception, see below).

### The lint rules

`tools/oxlint-styles.ts` is an oxlint plugin, loaded through `lint.jsPlugins` in `vite.config.ts`. It skips the `*.stylex.ts` files, which define the values. It checks the styles in `.svelte` module scripts too.

- `styles/no-raw-values`: inside `stylex.create()`, `keyframes()` and `viewTransitionClass()`, it reports `var(--…)` strings (import the token, so a typo is a type error), colours (add a colour token), and raw font sizes, font families, durations, radii and spacing (use the scale).
- `@stylexjs/no-unused` is not on. It skips every exported style object, and it can't see the uses in Svelte markup, so it would report every key of a style kept in a component. Here it would check nothing.
- A style in a `.ts` file is type-checked by `pnpm lint`, a style inside a `.svelte` file by `pnpm check`.

Where a raw value is right, disable the rule for one line with `// oxlint-disable-next-line styles/no-raw-values`. The case so far: SVG user units. To use a colour token at another opacity, use relative colour syntax, `rgb(from ${token} r g b / 0.5)` (`note()` in `prose.ts`). Its result isn't a legacy colour, so a gradient through it blends in `oklab`; add `in srgb` to the gradient to blend like `rgb()` does.

### StyleX limits

- A function that builds a value at compile time (`graphLines()`) must be an arrow with an expression body: StyleX's evaluator rejects a block body, and calls only `Math`, `Array.from` and a few other built-ins.
- `stylex.when.*()` only compiles inside `stylex.create()`. Kept in a constant elsewhere, it stays a runtime call and throws "Unexpected 'stylex.when.ancestor' call at runtime", which stops `vp dev` and fails the build. Write it in the condition key.
- Keyframes can't be imported from another file: StyleX only evaluates imports from `*.stylex.ts` files, and reads those as variables. Keyframes used in several files are a variable holding their name, like `motion["--fade-in"]`. A `stylex.create` key imports freely, so the visually hidden style is one key, `screenReader.only` (`shared.ts`). For the same reason an object spread into styles (`...chip` in `prose.ts`) only works in the file that defines it; to share one across files, make it a key (`mediaBlock.frosted` in `media-blocks.ts`) and apply it beside the component's own style.
- What StyleX can't express goes in `app.css`: `@font-face`, the reset, element defaults, and the rule that stops the long-press menu on everything inside `[data-stickers]`. A StyleX class styles one element, not all its descendants, and the `valid-styles` lint rule doesn't know `-webkit-touch-callout`. `userSelect` in a style needs nothing extra: Lightning CSS adds `-webkit-user-select`.
- StyleX's `valid-styles` lint rule doesn't know properties newer than it (anchor positioning, `transitionBehavior`). They are listed in its `propLimits` option in `vite.config.ts`; when it rejects a property the compiler emits, add it there rather than disabling the rule. It can't be taught a pseudo-element, so `::-webkit-details-marker` (the marker Safari draws on a `<summary>` whatever its `list-style`, `ReadingRail.styles.ts`) is the one line that disables it.
- Gradient edges: a border can't be a gradient over a see-through fill. `glass.edge` draws `--edge` as a 1px ring in an `::after` over the border box, masked to the edge. Set `[vars["--edge"]]` to any background image to use it.

### Layout

- Text runs at `--measure`. A boxed block (a note, code, an embed, images in writing) is `--measure` plus `--box-pad` each side, and pads itself by `--box-pad`, so its content lines up with the text. A new boxed block needs both.
- Blocks are spaced with margins, not a grid `gap`. Each block kind (`column`, `box`, `wide` in `prose.ts`) has a top margin of `BLOCK_SPACE`; headings, images and embeds ask for more. Neighbouring margins collapse to the larger one, so an image followed by a heading gets the image's space, not both. Gaps would add up.
- A sticker's frame sets a height from its aspect, not `aspect-ratio`: a tall logo inside would override `aspect-ratio`.
- The bottom bar is 3.3rem tall from its content and floats `--bar-offset` above the bottom. What opens over it (the contact card, the sticker book) sits at `--above-bar`, 0.45rem above its top. Pages end with `--nav-clearance` of padding so the bar never covers their last line.

### Breakpoints

All `max-width`, in `media` (`tokens.stylex.ts`): `small` 480px, `phone` 600px, `article` 1600px.

- `article`: below 1600px the full-width images on article pages (64rem) leave no room for the side outline, so it becomes the bar under the header.

### Stacking

From the bottom:

- The footer (`z-index: -1`, sticky at the bottom) sits behind the page and shows as the page scrolls off it. The root (`shell.root` in `src/routes/+layout.svelte`) isolates, so the footer stays inside the root, not behind it.
- The page has a background and no `z-index`, so it covers the footer without making a stacking context. The sticker layer inside it can then rise over the nav.
- Header 1, the sticker layer and the reading rail 5, the nav bar 10, the skip link and a sticker being carried 20, the sticker book 10000.

### Drawings

- The compare block clips both images at the divider, not just the top one. Otherwise the before image shows through the after image's rounded, anti-aliased corners as a thin line.
- The garden stage plants (`PLANTS` in `src/lib/writing/plants.ts`) each have a `viewBox` as wide as their leaves and as tall as the tallest plant. All three stand on one baseline at one height, and only grow wider.
