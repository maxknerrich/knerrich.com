import * as stylex from "@stylexjs/stylex";

// Media queries shared by all styles. Use them as condition keys:
// `padding: { default: space["--space-32"], [media.phone]: space["--space-24"] }`.
export const media = stylex.defineConsts({
  /** Phones: one column, compact header. */
  phone: "@media (max-width: 600px)",
  small: "@media (max-width: 480px)",
  /** Tablets and narrow windows: the side outline moves under the header. */
  tablet: "@media (max-width: 1080px)",
  /**
   * Article pages: their full-width images (64rem) leave no room for the side
   * outline below this, so it becomes the bar under the header.
   */
  article: "@media (max-width: 1600px)",
  hover: "@media (hover: hover)",
  /** Wrap every transition and animation in this. */
  motion: "@media (prefers-reduced-motion: no-preference)",
});
