# Stickers

The landing page's peelable stickers and their sticker book are `src/lib/Stickers.svelte`. The fold maths is in `src/lib/stickers/fold.ts`, the die-cut shapes in `cut.ts` and `marks.ts` (every mark; the Knerrich K is in `symbol.ts`, so the header, on every page, doesn't load the other marks), the sounds in `src/lib/sound.svelte.ts` (the whole site uses them), and the styles in `src/lib/Stickers.styles.ts`.

A sticker is die-cut along its mark, unless it's a `badge`: a circle of holo or chrome foil with the mark printed on it in `ink`. A die-cut shows the brand's `colourFile`, or is printed in `ink` all over; an illustration (`art`) draws its details over that `ink` in its own colours (`src/lib/stickers/art.ts`): ordered layers of paths, each with its own paint, drawn by the `drawing` snippet in `Stickers.svelte`. A layer can name the shapes in front of it (`hiddenBy`), which mask it out: the Opera House's rear sails don't show their lines through the front ones. A sail can't simply be filled to cover them, because the undersides beside it would disappear too.

## Units and coordinates

- A sticker's state is set on it as custom properties (`stickerState` in `src/lib/styles/tokens.stylex.ts`; the `sticker` group beside it holds its colours and sizes, imported as `p` in `Stickers.svelte`, where `sticker` is the snippet's name). Position, rotation, origin and fold are plain numbers, not lengths, so they can go into `calc()` and `matrix()`; the styles add the units. `--sticker-px`/`--sticker-py` (the light's position) are percentages.
- `--sticker-peel`, `--sticker-px` and `--sticker-py` are typed with `stylex.types`, which registers them with `@property`, so they transition. The others jump.
- `--sticker-x`/`--sticker-y` are px in the sticker layer. `--sticker-rotate` is degrees: the resting turn plus the tilt while carried. `--sticker-ox`/`--sticker-oy` are what it turns and scales around (where it was last grabbed), in px from its top left.
- The fold works in the sticker's own px: origin at its top left, unrotated. `toLocal` converts a pointer into that space.
- Angles for shading (`Fold.angle`, `--sticker-fold-angle`) use the CSS gradient convention (0deg is up, clockwise), not `atan2`'s.

## Size

`--sticker-size` in `tokens.stylex.ts` is the side of a square of the same area, so a wide sticker is wider and lower, not smaller (`frameOf`). Two corrections on top: badges (circles) get `--sticker-round` (1.1×) so they look as big, and long shapes get 0.1× more per step of aspect ratio, up to 1.2× (`LONG_PER_ASPECT`, `LONG_MAX`).

## The fold

- The outline is a rounded rectangle (`Outline`); pills and badges are fully round. The fold is a straight line across it, perpendicular to the pull direction `u`. The part on the grab's side is lifted and mirrored over the rest.
- `--sticker-fold-min` is where the sticker starts along `u`; the fold line sits `--sticker-peel` px past it. `--sticker-fold-offset` is the distance from the box's first corner along `u` to where the rounded shape starts.
- The fold aims for the line halfway between the grab point and the pointer: there the mirrored grab point (the flap's tip) is under the pointer. This holds whatever the pull's direction: into the sticker, at a slant, or along the edge. A pull mostly outward lifts nothing.
- `u` starts as the edge's inward normal and turns toward the pull only as fast as the lifted area may grow with the pull's length (the bisection in `fold`). Turned all the way at once, a slanted pull from the middle of an edge would flip half the sticker over in its first pixel.
- The grab point's own depth is added gradually, over a pull of twice that depth, so a touch alone lifts nothing.
- On touch, the first 6px of the pull (`AIM`) set the direction instead of the edge's normal.
- Progress is measured by area (`foldedShare`, sampled on a grid), not depth: along a slant a thin sticker is mostly over long before the fold reaches its far corner. It comes off once 85% is folded and the pull is at least the sticker's shorter side.
- In CSS (`Stickers.styles.ts`), the kept part is the body clipped by a polygon on one side of the fold line; the flap is a copy clipped to the other side and mirrored with a `matrix()`. The polygons reach 1000px from the fold, far past any sticker's diagonal, so each covers its whole side of the sticker.
- A pull at 120° or more off the inward normal lifts nothing, one at 100° or less lifts fully, with a smooth blend between (`PULL_LIFTS_NOTHING`, `PULL_LIFTS_FULLY`).
- The flap's opacity is its peel in px, clamped to 1: an empty fold can leave a hairline along its edge. It follows the transitioned `--sticker-peel`, so the flap still folds back after a drop; removing it at a peel of 0 would cut that short.

## Die-cut shapes

- Each mark's `box` in `marks.ts` is the logo's exact bounds, so its die-cut outline and the brand's colour file in `static/stickers/` line up with it. `cut.contour` is the die-cut line, traced from the mark with its border, holes filled. Marks without a `cut` get a border of 10% of their box (`cutOf`); the illustrations set their own border and have no contour. Sources are in `static/licenses/stickers.txt`.
- `maskOf` makes the silhouette with the border (the paper, and the backing where it peels) or without (the printed face). It's a blob URL, made once per mark, so a detailed logo isn't repeated in every element's style. Browser only. The book's outlines use the same image.
- A colour file isn't masked by the mark's face: it has its own shape, and the mark's would cut its colours out.
- Drawn marks must be one shape where they're one body: shapes that only touch leave hairline seams in a mask (`claudeCodeShape` in `src/lib/stickers/art.ts`).
- The Porsche sticker shows the colour crest in colour, but its one-colour mark is the Turbo's crest.

## Grabbing

- With a mouse, only a band around the edge grabs (the ring SVG's stroke). The face has inert shapes over it, so the middle does nothing. With a coarse pointer the ring hit-tests its whole area, so the whole sticker grabs.
- The ring is stroked with a clear paint: some engines only hit-test a stroke that has a paint.
- `touch-action: none` is on the ring's `svg`, not the shapes: Chrome ignores it on SVG shapes. iOS may still pan, so `holdTouch` also cancels `touchstart` on the ring.
- iOS Safari would open its "save image" menu or select text on a long press. `src/app.css` turns that off for `[data-stickers]` and everything inside it; why it isn't a StyleX style is in [styling.md](styling.md).
- Only the main button grabs: on macOS a ctrl-click opens the context menu and never sends a `pointerup`.
- `setPointerCapture` throws if the pointer is already released (a quick click in the book). The sticker then goes back.
- Moves with no distance, sent around a scroll, are ignored.
- The gesture ends on window `blur`: switching windows mid-gesture may never send the release.

## Placement on the page

- Some stickers are pinned in the hero and About (`spotOf`), some scattered over the Writing section (`zoneOf`, `freeSpot`), the rest start in the book. One that can't find a free spot goes in the book (`unfit`) without that being remembered.
- A pinned sticker's centre is a fixed offset from the top left of its anchor (`pin`, a selector inside `main`: the place line or the About label), in `em` of the anchor's font size, one offset for desktop (`wide`) and one for phones. No sticker is pinned to the headline: it rewraps at almost every phone width, so a fixed offset lands on its letters. The K badge, the 911 and the local-first sticker sit in the empty space above the place line instead: left of the intro statement on desktop, in one row just above the line on phones. That row fits the smallest gap measured, 69px on a 375×667 phone. The Porsche crest sits next to the About label.
- The scatter keeps clear of the Writing section's text: `textOf` measures a text range, because a paragraph's box may fill its grid column.
- `atRest` subtracts the `translate` of every ancestor, so a translated (e.g. animating) ancestor doesn't shift the spots. Text ranges have no transform-free geometry (no `offsetTop` for a `Range`), and waiting for the entrances would delay the stickers and never end for reveals paused until scrolled to.
- The layer mounts after the hydrated page's first paint, in a task of its own, so it doesn't hold up the headline or hydration. The fall's delay is shortened by that wait, so the stickers fall in when they did before. The book's shelf renders in the next task: the layout the stickers read when they're placed then doesn't have to style the whole book, and the first open doesn't have to build it.
- Layout waits for `document.fonts.ready`, since the type sets the anchors' size. After that, stickers not moved by hand follow their spots when the page reflows or grows as images load (a `ResizeObserver` on the layer and one per sticker).
- The page container (`shell.page` in `src/routes/+layout.svelte`) has no `z-index`, so the sticker layer covers the footer (`z-index: -1`) and a carried sticker can lift over the bottom bar.
- The layers that overlap are `stack` in `tokens.stylex.ts`: the sticker layer, the bottom bar, the layer while a sticker is lifted (over the bar), the book and its cover, and a held sticker (over the book: `stack.held` is added to its own place in the pile, so the one picked up last stays on top).
- Wheel deltas in lines are taken as 16px (`LINE_PX`); browsers don't expose the line height they mean.

## What's remembered

`localStorage` key `stickers:page` (`Kept`) holds which stickers are in the book and, for ones moved by hand, their centre (x as a share of the layer's width, y in px) and turn. Stickers not mentioned start where they always do.

## Svelte notes

- When a sticker moves between the book and the page, the new element mounts before the old one's cleanup runs, so `mount`'s cleanup only removes the element it added.

## Rendering quirks

- WebKit can draw stray edges when a mask shares an element with the fold's `clip-path`. The paper (`cutPaper`) and face (`cutFace`) are masked on their own elements inside the clipped body.
- The foil's sheen uses plain alpha, no `mix-blend-mode`: Safari can draw a blended layer's edge outside a die-cut's mask.

## Sounds

- Starting an `AudioContext` takes tens of ms, more with a real output device, so it never starts when a sound is due: that would stall the animation it goes with. `warm` starts it ahead, when the pointer enters a sticker or the book's cover, or when the browser is idle after the page's first pointer down or key press (`warmOnFirstUse`; before that, browsers don't allow audio). A sound due before the context exists is skipped. The noise the sounds are filtered from is generated when the browser is idle after that, or by the first sound that needs it, so `warm` stays off the pointer event it runs in.
- `stick` is a short, dry mid-range press, then a quiet brush. No low knock: that sounds like a drum.
- `soundSetting` is site-wide, set by the footer's switch. While it's quiet, `audio` hands out no context, so every sound is skipped in that one place, and `warm` doesn't start one. It's read after load (`soundSetting.load()`, from `src/routes/+layout.svelte`, which also sets up `warmOnFirstUse`), so the prerendered page hydrates as rendered.
