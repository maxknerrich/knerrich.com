import * as stylex from "@stylexjs/stylex";

// The design tokens: every color, font, type size, duration, radius and page
// rhythm on the site. Styles import these instead of writing raw values (the
// `styles/no-raw-values` lint rule checks that), so changing a value here
// changes it everywhere.
//
// Keys starting with `--` keep their names in the CSS, so app.css can use
// `var(--ink)` too. Use them in styles as `color["--ink"]`.
//
// Colors are `light-dark()` pairs: the theme switch only sets `color-scheme`
// (see app.css), so no theme classes or JavaScript are needed.

export const color = stylex.defineVars({
  "--paper": "light-dark(#e9ede5, #0c100d)",
  "--ink": "light-dark(#222920, #e7ece3)",
  "--muted": "light-dark(#596353, #9ca796)",
  /** Muted text that sits back further, like the side outline's links. */
  "--faint": "color-mix(in srgb, var(--muted) 94%, var(--paper))",
  "--rule": "color-mix(in oklab, var(--ink) 14%, var(--paper))",
  "--accent": "#3ed42a",
  "--accent-ink": "light-dark(#247719, #3ed42a)",
  "--selection": "light-dark(#d6f5d1, #254820)",
  /** Buds on budding plant icons in writing. */
  "--bud": "light-dark(#c2416f, #ff6b8e)",

  /** Cards, the theme switch and embeds. */
  "--surface": "color-mix(in oklab, var(--ink) 3.5%, var(--paper))",
  /** The selected theme option and the sync diagram's nodes. */
  "--surface-strong": "color-mix(in oklab, var(--ink) 9%, var(--paper))",
  /** The featured project card. */
  "--accent-surface": "color-mix(in oklab, var(--accent-ink) 9%, var(--paper))",
  /** A sync diagram node while it receives a change. */
  "--accent-surface-strong": "color-mix(in oklab, var(--accent-ink) 18%, var(--paper))",
  /** Bars that stay on top while the page scrolls under them, blurred. */
  "--sticky-paper": "color-mix(in srgb, var(--paper) 88%, transparent)",
  /** Behind images with transparency, in both themes. */
  "--image-paper": "#fff",

  "--button-fill": "var(--accent)",
  "--button-ink": "#0c100d",
  "--button-hover": "color-mix(in oklab, var(--accent) 85%, var(--ink))",
});

export const font = stylex.defineVars({
  "--font-display": '"Bricolage Grotesque", "Helvetica Neue", sans-serif',
  "--font-sans": '"Helvetica Neue", Helvetica, Arial, sans-serif',
  "--font-mono": '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
  "--font-pixel": '"Pixelify Sans", var(--font-mono)',
});

/** Type sizes, smallest first. */
export const text = stylex.defineVars({
  "--text-2xs": "0.6875rem",
  "--text-xs": "0.75rem",
  "--text-sm": "0.8125rem",
  "--text-md": "0.875rem",
  "--text-base": "0.9375rem",
  "--text-lg": "1.0625rem",
  "--text-xl": "1.25rem",
  "--text-2xl": "1.5rem",
  "--text-3xl": "1.75rem",
  "--text-4xl": "clamp(1.625rem, 5vw, 2.125rem)",
  "--text-5xl": "clamp(1.625rem, 6.5vw, 2.75rem)",
  /** Page titles and the homepage headline. */
  "--text-display": "clamp(2.625rem, 6.5vw, 3.625rem)",
});

/**
 * Spacing for margins, padding and gaps, named by size in px at the default
 * 16px text size (`space["--space-24"]` is 1.5rem). Continue the steps by 32px
 * (224, 256, …) if a larger one is ever needed.
 */
export const space = stylex.defineVars({
  "--space-1": "0.0625rem",
  "--space-2": "0.125rem",
  "--space-4": "0.25rem",
  "--space-8": "0.5rem",
  "--space-12": "0.75rem",
  "--space-16": "1rem",
  "--space-24": "1.5rem",
  "--space-32": "2rem",
  "--space-40": "2.5rem",
  "--space-48": "3rem",
  "--space-64": "4rem",
  "--space-96": "6rem",
  "--space-128": "8rem",
  "--space-160": "10rem",
  "--space-192": "12rem",
});

export const radius = stylex.defineVars({
  /** Focus outlines. */
  "--radius-xs": "2px",
  "--radius-sm": "0.375rem",
  "--radius-md": "0.5rem",
  "--radius-lg": "0.625rem",
  "--radius-pill": "2rem",
});

export const motion = stylex.defineVars({
  /** Hover states in lists. */
  "--duration-fast": "160ms",
  /** Links, colors and outlines. */
  "--duration-base": "180ms",
  /** Buttons and the theme switch. */
  "--duration-slow": "240ms",
  /** The sync diagram's loop. */
  "--duration-loop": "3.6s",
  /** First-load entrances. After client-side navigation the layout sets these to 0 (see layout.ts). */
  "--duration-entrance": "900ms",
  "--entrance-delay-scale": "1",
  /** Each element's own entrance delay, set with `reveal.delay()`. */
  "--reveal-delay": "0ms",
  "--ease-out": "cubic-bezier(0.22, 1, 0.36, 1)",
  "--ease-snap": "cubic-bezier(0.2, 0, 0, 1)",
});

/** Page rhythm: header height, section spacing and the reading column. */
export const layout = stylex.defineVars({
  "--site-header-height": { default: "6rem", "@media (max-width: 600px)": "4.75rem" },
  "--section-bleed": "clamp(0.75rem, 3vw, 1.5rem)",
  "--section-space": "clamp(3rem, 6vw, 4.5rem)",
  "--contact-space": "clamp(4.5rem, 9vw, 6rem)",
  /** The width of running text in articles. */
  "--measure": "39rem",
  /** Space around images and embeds in articles. */
  "--media-space": "clamp(3rem, 6vw, 5rem)",
});
