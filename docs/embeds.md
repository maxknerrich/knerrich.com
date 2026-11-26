# Embeds

How authors use them is in [content.md](content.md). This is for changing them.

A block's props are checked against `src/lib/embeds/props.ts` at build, and `index.ts` maps each block name to a dynamic import of its component, so a page loads only the embeds it uses. The case study's and piece's universal `load` (`+page.ts`) awaits `loadEmbeds` for the page's blocks, so the components are there before the server renders and before the browser hydrates: nothing flashes or shifts. `embedFor` throws for a component that wasn't loaded. `index.ts` takes only types from `props.ts`, so Effect stays out of the browser bundle.

## Compare

An invisible native range covers both images: it takes focus and gives screen readers a value, and takes no pointer events, so its thumb maths can't move the divider. The frame takes the pointer instead (`scrub`), setting the divider to wherever the pointer is, so touch isn't limited to a thumb; the images take no pointer events either, so a drag never picks one up. `touch-action: pan-y` keeps vertical swipes scrolling the page. Arrow keys are handled by the component: 2% a press, 10% with Shift. The before image gets its width and height from the build, so the block keeps its size while it loads. Both images are full `<picture>`s (AVIF, WebP, JPEG) with the article images' `sizes`; the `<picture>` is `display: contents`, so it doesn't change the layout. It's two images, so it takes the page's image width (`WIDE_EMBEDS` in `src/lib/server/markdown/embeds.ts`): wide on a case study, boxed in writing. So do videos, charts, timings and every visualization, so they all share one width. Other embeds stay boxed unless the block sets `wide: true`.

## Code blocks

Highlighted at build by `src/lib/server/markdown/code.ts`, which gives each line its number in `data-line` for the gutter. Each line is a block, so the newlines between lines are dropped: they'd show as blank lines.

## Tweets

- Fetched once at build by `src/lib/server/tweets.ts`, from the public endpoint X's own embeds use (with the token react-tweet computes). It's unofficial and can break. A tweet that can't be fetched, or is gone, gets no data, and the embed is a plain link to it.
- `display_text_range` and link `indices` count code points, not UTF-16 units, so the text is sliced as `Array.from(text)`.
- The date is formatted in UTC, so the build and the browser agree.

## Visualizations lit in the brand

`stepper.card` sets `--glow` to the page's `--brand`, so a visualization on a case study lights up in the client's color. `--viz-lit` mixes `--glow` where it's declared, on the root, so the card mixes its own from `--brand` too. The same goes for any variable that mixes `--glow`: one in a `.stylex.ts` file is mixed on the root, in the site's green. So `kit.stylex.ts` (the tldraw kit steps) holds only fixed values, and `KitSteps.svelte` builds its blue fills from `--glow` itself.

## Shared panels

The visualizations (all but the tldraw kit, which is a drawing) and the chart draw from `board` (`src/lib/styles/board.ts`): panels with a caps header and an icon, rows of mono key and value on a subgrid, links between panels with a travelling packet, and `lit`/`active` in `--glow`, which is the page's brand. A new visualization uses these instead of its own boxes and type, so they all share spacing and look, and only the content and the accent change. The timing replay's app windows (`Timing.styles.ts`) match them, and the chart borrows its stage, table and corner button.

## Charts and stats

Their entrances wait for `playInView` / `playInTurn` (see [motion.md](motion.md)). The chart's table is always rendered, visually hidden while the bars show, and the plot is `aria-hidden`: screen readers get the numbers as a table. The table and the plot share one grid cell, so the block is as tall as the taller of the two and doesn't jump when the button switches between them. The hidden one is transparent (the table, so screen readers still read it) or `visibility: hidden` (the plot). `Timing` works the same way: its table button is the code block's copy button, always shown, and it replays with a `requestAnimationFrame` clock that runs once the block is half in view and again for each choice.

## Visualization shells

- **`Stepper`** (`src/lib/Stepper.svelte`) stacks every step's caption in one grid cell, hiding all but the current one, so the card is as tall as the tallest caption and doesn't jump. Step links are caught by one click listener on the document (`a[data-step="<id>/<n>"]`), which also marks the current step's links `aria-current="step"`. Autoplay runs only while half in view; any step by hand stops it.
- **`Playback`** (`src/lib/Playback.svelte`) controls every animation in its subtree through `getAnimations({ subtree: true })`, so its child only calls `element.animate()`. It pauses them a frame after mounting and plays them while half in view.

## Thesis visualizations

`SyncSteps.svelte` (in steps) and `SyncLive.svelte` (playing) sit beside the thesis, in `src/content/projects/local-first-api-sync/`, and `index.ts` registers them like the other embeds. Nothing globs `src/content/` for `.svelte` or `.ts` files, so they're only reached through those imports.

- Both are panels joined by connectors (`board`): a flex row that turns into a column on a phone, where a connector is 1px tall or 1px wide. A data packet is a dot that moves from `left`/`top` 0% to 100% of its connector, so the same keyframes work in both directions of the layout.
- Each panel's body is a two-column grid and its rows are subgrids, so keys and values line up.
- `merge-steps.ts` holds the steps table: each step's issue on the device and on GitHub, the write-log, what the sync holds, which fields are lit and which way data flows (`in` or `out` of the sync). The build reads it to check step links. In `SyncSteps` the dot loops while its connector is flowing.
- `RequestsLive` (`requests-live`) replays five minutes of edits for both apps, from the sliders' edits per minute and sync interval. The counts follow the thesis: client-server sends one PATCH per edit and refetches about 4.15 GETs after it (83 for 20 edits); local-first sends one GET per sync and one PATCH if the issue changed since the last. The counters are `counter["--count"]`, a registered integer, animated with the rest, so Playback pauses and replays them too; animations need its bare name, not the `var()`. Changing a slider rebuilds the scene (`{#key}`), which starts it over.
- `SyncLive` plays one `element.animate()` timeline: rows light through an overlay's opacity, dots travel in the windows in `at`.

## Paper

`page` is an SVG beside the piece, which the build turns into a URL through `drawingFor` (`src/lib/server/assets.ts`): SVGs skip the image pipeline.

## Video

`preload="none"`, so a clip downloads nothing while it's far away. A second observer with a viewport of margin sets `preload` to `auto` once the clip is within a screen of the viewport, so it has buffered by the time it's half in view and plays. Pressing play loads it anyway. The `src` stays in the markup, so without JavaScript the browser's controls still play it. The poster is an AVIF of its first frame. The sheets behind it fan out on hover and focus through `paperMarker`. The page is drawn with an empty `alt`; the link's label names the paper and the PDF.
