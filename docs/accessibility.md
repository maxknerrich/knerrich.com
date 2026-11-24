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

### Screen readers

- Code line numbers come from CSS `content` with empty alt text (`/ ""`), so they aren't read.
- The stepper's counter is `aria-live="polite"` while stepped by hand, and `off` while it plays on its own, so it doesn't talk over the page.
- Charts hide their drawing and legend (`aria-hidden`) and give screen readers a table of the numbers instead.

### Stickers

The stickers (`src/lib/Stickers.svelte`) are an easter egg and decoration only, on purpose:

- Pointer only. The layer and the book are `aria-hidden`, and the book's buttons are `tabindex="-1"`, so the keyboard and screen readers never meet them.
- Without JavaScript there are none.

### Touch

- A mouse grabs a sticker only by its edge (a band up to 24px wide). On a coarse pointer the whole sticker is the target, and its `touchstart` is cancelled so the page doesn't scroll while peeling.
- iOS Safari's long press would open "save image" or select text instead of peeling, so `app.css` turns off `-webkit-touch-callout` and `-webkit-user-select` on `[data-stickers]`.
- The compare frame sets `touch-action: pan-y`: a sideways drag moves the divider, a vertical one still scrolls.

### Contrast

- Chart series need 3:1 against the page and must stay apart from the brand series for colour-blind readers. The context bars are drawn with `--viz-stroke` and `--hairline`; `--viz-stroke` is about 2.7:1.
