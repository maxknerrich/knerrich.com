# Embeds

How authors use them is in [content.md](content.md). This is for changing them.

A block's props are checked against `src/lib/embeds/props.ts` at build, and `index.ts` maps each block name to its component. `index.ts` takes only types from `props.ts`, so Effect stays out of the browser bundle.

## Compare

An invisible native range covers both images: it takes focus and gives screen readers a value, and takes no pointer events, so its thumb maths can't move the divider. The frame takes the pointer instead (`scrub`), setting the divider to wherever the pointer is, so touch isn't limited to a thumb; the images take no pointer events either, so a drag never picks one up. `touch-action: pan-y` keeps vertical swipes scrolling the page. Arrow keys are handled by the component: 2% a press, 10% with Shift. The before image gets its width and height from the build, so the block keeps its size while it loads.

## Code blocks

Highlighted at build by `src/lib/server/markdown/code.ts`, which gives each line its number in `data-line` for the gutter. Each line is a block, so the newlines between lines are dropped: they'd show as blank lines.

## Tweets

- Fetched once at build by `src/lib/server/tweets.ts`, from the public endpoint X's own embeds use (with the token react-tweet computes). It's unofficial and can break. A tweet that can't be fetched, or is gone, gets no data, and the embed is a plain link to it.
- `display_text_range` and link `indices` count code points, not UTF-16 units, so the text is sliced as `Array.from(text)`.
- The date is formatted in UTC, so the build and the browser agree.

## Charts and stats

Their entrances wait for `playInView` / `playInTurn` (see [motion.md](motion.md)). The chart's table is always rendered, visually hidden while the bars show, and the plot is `aria-hidden`: screen readers get the numbers as a table. The table is hidden through a wrapper: a table can't shrink below its content, so a hidden 1px table would still widen the page on a phone, while the wrapper's `overflow: hidden` clips it.

## Visualization shells

- **`Stepper`** (`src/lib/Stepper.svelte`) stacks every step's caption in one grid cell, hiding all but the current one, so the card is as tall as the tallest caption and doesn't jump. Step links are caught by one click listener on the document (`a[data-step="<id>/<n>"]`), which also marks the current step's links `aria-current="step"`. Autoplay runs only while half in view; any step by hand stops it.
- **`Playback`** (`src/lib/Playback.svelte`) controls every animation in its subtree through `getAnimations({ subtree: true })`, so its child only calls `element.animate()`. It pauses them a frame after mounting and plays them while half in view.

## Sync drawing

`sync-drawing.ts` is shared by `SyncSteps.svelte` (in steps) and `SyncLive.svelte` (playing), and holds the steps table, which the build also reads to check step links. All three sit beside the thesis, in `src/content/projects/local-first-api-sync/`, and `index.ts` registers the two components like the other embeds. Nothing globs `src/content/` for `.svelte` or `.ts` files, so they're only reached through those imports.

- Coordinates are isometric world units: `x` runs down to the right, `y` down to the left, `z` up. `iso` projects a point onto the SVG: `(cx + (x − y) · cos 30°, cy + (x + y) / 2 − z)`, around `(240, 64)`. Both components hard-code the matching `viewBox`, `"20 0 440 252"`.
- The packet is drawn around the origin so it can be moved by `transform`: a CSS transition in `SyncSteps`, `element.animate()` in `SyncLive`.
- `SyncLive` eases the packet once across its whole route. `element.animate()` would ease each keyframe segment on its own, so the eased journey is sampled into 72 keyframes with linear timing; between samples it's straight, so the ease stays smooth. `reach` inverts the ease to light each wire and record as the packet gets there.
- Labels are `11px` in SVG user units, so they scale with the drawing rather than following a type size.
