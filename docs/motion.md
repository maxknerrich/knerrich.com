# Motion

Durations and curves are the `motion` tokens in `src/lib/styles/tokens.stylex.ts`. The visualizations' motion is in [embeds.md](embeds.md).

## Reduced motion and no JavaScript

- Every transition and animation sits behind `media.motion` (`tokens.stylex.ts`) and defaults to `none`.
- Entrances that start hidden and wait for JavaScript to play use `media.entrance` instead, which also needs `scripting: enabled`. Without JavaScript, everything is there.
- Motion done in JavaScript checks `prefersReducedMotion` from `svelte/motion` itself: `followScroll`, `TypeIn`, the contact card's `shootUp`, `Playback`, `Stepper` autoplay, the stickers.
- Smooth scrolling (`app.css`) is switched off across page changes in `+layout.svelte`, so a new page doesn't glide to its top.

## Entrances

- `scroll.reveal` (`shared.ts`) is a time-based CSS animation, paused by `--play` (`vars` in `tokens.stylex.ts`) until `playInView` (`src/lib/in-view.ts`) sets it to `running`. Time-based, not scroll-driven, so it's smooth however fast the scroll, and nothing updates while scrolling past.
- It plays once: one shared `IntersectionObserver` fires when an element is 10% above the bottom of the viewport, then stops watching it.
- `playInTurn(after)` staggers elements that enter together by 70ms. Elements already in view when the page loads also wait `after` ms.
- `scroll.now` plays at once, `scroll.later` waits `--reveal-later`, `reveal.delay()` sets any delay.
- The landing page's `h1` uses `reveal.focus` (`shared.ts`), which is behind `media.motion` and never paused: it's the largest paint (LCP), so it comes into focus with the first paint instead of waiting for JavaScript.

## After client-side navigation

Entrances are instant. When the path changes, `+layout.svelte` applies its `navigated` theme: `--entrance-delay-scale` becomes 0 and `--duration-entrance` 0ms. An entrance is only instant if it multiplies its duration and delay by `--entrance-delay-scale` (or uses `--duration-entrance`).

## Following the scroll

The project grid grows and its images drift with the scroll (`src/routes/+page.svelte`), and `TypeIn` types as it scrolls in. These run in JavaScript, not as CSS scroll-driven animations, so they can trail the scroll and glide to a stop:

- `followScroll` (`src/lib/scroll-follow.ts`) turns the element's box into progress from 0 to 1. `chase` eases toward it every frame, by the same amount per time whatever the frame rate.
- The value is written straight onto the element that moves (`style.scale`, `style.translate`), never as a custom property: a custom property restyles everything inside the element it's set on, every frame.
- The first `onFrame` call is untracked. Otherwise the attachment would depend on the state it writes and re-attach on every change.
- With reduced motion, nothing attaches: the grid stays full width and the images centred.

## Scroll-driven CSS

The case study hero sinks and its cover rises with `animation-timeline` (`src/routes/projects/[slug]/case-study.styles.ts`). They're guarded by `media.scrollTimeline` (`@supports`): without support, they would play once on load as ordinary animations.

## Brand glow

`BrandGlow.svelte` behind the case study hero: each glow is a radial gradient fading to transparent, so there's no blur filter, and each is its own `<svg>`, so drifting it moves a layer instead of repainting the hero.

## Bottom bar

- **Nav keys.** Any page change (the nav, a link, back and forward) swaps the lit key, with a sound. It runs in `onNavigate`, before the new page renders, so the old item gets `nav.releasing`'s delay as it stops being current. The delay is `timing.switchDelayMs` (`tokens.stylex.ts`), read by `--switch-delay` and `presetKey`'s second clack. A transition keeps the delay it started with, so `nav.releasing` is dropped at the old key's `transitionrun`, as soon as its delayed transitions exist. With reduced motion nothing transitions, and the class stays until the next switch, where it does nothing. `BottomBar.svelte` must keep the comparison in `{@const released}`: inline in `stylex.attrs`, Svelte compiles it to `$.strict_equals(…)`, which the StyleX compiler rejects ("Unsupported expression: CallExpression").
- **Contact card.** A popover. Opening is animated in `shootUp`, growing out of the Contact button (its origin is measured from the button). Closing, however it closes, is a CSS transition on `:not(:popover-open)` that shrinks it back. `display` and `overlay` are transitioned with `transition-behavior: allow-discrete`, so it stays shown and in the top layer until the shrink is done.
- **Buttons** use the plain `ease-out`, not `--ease-out`: that one is nearly done after a frame or two.

## Holo sticker

`HoloSticker.svelte` is the round sticker on each offer card: holo foil (the stickers' `--holo-*` and `--sticker-iris-*` colours) with glitter, and a pixel icon. It slaps onto the card after the card rises in. While the card is hovered or focused (`cardMarker`) the foil runs through its colours, back and forth so the gradient never wraps, a sheen sweeps across and the glitter twinkles.

## Roll

`Roll.svelte` rolls link text on hover and keyboard focus. The trigger is the link's `:hover`, read through `rollMarker` (`tokens.stylex.ts`), so the link around it must carry `rollMarker`. The rolled-in line is `aria-hidden`.
