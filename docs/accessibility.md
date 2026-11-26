## Accessibility

### Reduced motion

Every transition and animation sits behind `media.motion` (`prefers-reduced-motion: no-preference`), with `none` as the default:

```ts nocheck
transitionProperty: { default: "none", [media.motion]: "opacity" },
```

- Entrances that start hidden use `media.entrance`, which also needs `scripting: enabled`. Without JavaScript nothing would start them, and the content would stay hidden.
- Scroll-driven animations also need `media.scrollTimeline`. Without support they would play once on load.
- Smooth scrolling and link colour transitions in `app.css` follow the same rule.

### Focus and forced colours

- Keyboard focus is a green glow (`glass.focus`), a `box-shadow`. Forced colours mode drops box shadows, so focusable elements also keep a 1px transparent outline, which forced colours paints in the system colour. Keep that outline on anything new that is focusable.
- Links get a plain `2px` outline in `app.css`.

### Page structure

- The layout has no `<main>`: every page puts its own `<main id="main" tabindex="-1">` after the header. The skip link jumps to `#main`, and `tabindex="-1"` lets it take focus. A new page needs one.
- The bottom bar is fixed to the bottom of the window but comes right after the header in the DOM, so the keyboard meets it after the logo (Work, Writing, Contact) instead of after the footer, and the skip link jumps past it. Its `<nav>` holds the Contact button too, so nothing in it sits outside a landmark.
- The root has `scroll-padding-block-end: var(--nav-clearance)`, so the browser never scrolls a focused element under the fixed bottom bar. Only the end side: anchors and Back to top align to the start, where nothing changes.
- The footer is sticky behind the page, and a sticky box taller than the window can never show its top. At high zoom it's capped at `100dvh` and scrolls on its own; whenever it fits, the cap does nothing.
- The visualisations' and timing replay's side panels are `role="group"`, not `<aside>`: three nested, identically named landmarks on one page made the landmark list noise.

### Screen readers

- Code line numbers come from CSS `content` with empty alt text (`/ ""`), so they aren't read.
- The stepper's counter is `aria-live="polite"` while stepped by hand, and `off` while it plays on its own, so it doesn't talk over the page.
- Charts hide their drawing and legend (`aria-hidden`) and give screen readers a table of the numbers instead.
- A section heading is named by its text only (`aria-labelledby` its own text), so the copy-link button inside it doesn't show up in the headings list.
- The stepper, playback and timing figures keep their buttons in the `<figcaption>`, which must be the figure's first or last child. Playback and timing figures are named (`aria-labelledby`) by the caption's text alone.
- A stepper's figure has a fixed name, its required `label` (exported beside its `steps`), so the name doesn't change at every step. The current step's caption describes it (`aria-describedby`).
- A slider drawn over its own label is named with `aria-label`; its shown value is `aria-hidden`, since the slider already says it (with the unit in `aria-valuetext`).

### Offer cards

Each offer card is one link, like a project card. It's named by its title and its "Contact me" (`aria-labelledby`), so two links aren't both just "Contact me", and described by its pitch. The holo sticker is `aria-hidden`.

### Stickers

The stickers (`src/lib/Stickers.svelte`) are an easter egg and decoration only, on purpose:

- Pointer only. The layer and the book are `aria-hidden`, and the book's buttons are `tabindex="-1"`, so the keyboard and screen readers never meet them.
- Without JavaScript there are none.

### Touch

- A mouse grabs a sticker only by its edge (a band up to 24px wide). On a coarse pointer the whole sticker is the target, and its `touchstart` is cancelled so the page doesn't scroll while peeling.
- iOS Safari's long press would open "save image" or select text instead of peeling, so `app.css` turns off `-webkit-touch-callout` and `-webkit-user-select` on `[data-stickers]`.
- The compare frame sets `touch-action: pan-y`: a sideways drag moves the divider, a vertical one still scrolls.

### Contrast

- `--text-muted` is real text (labels, dates, captions, the bar's other keys), so it needs 4.5:1 on everything it sits on. Its alpha, 0.49, is the lowest that clears that everywhere: about 5.1:1 on the page, the footer and the diagram panels, 4.85:1 on the bar, and 4.55:1 on a diagram's lit row in the site's green, the lightest surface. Raise it if muted text moves onto a lighter one.
- Chart series need 3:1 against the page and must stay apart from the brand series for colour-blind readers. The context bars are drawn with `--viz-stroke` and `--hairline`; `--viz-stroke` is about 2.7:1.
