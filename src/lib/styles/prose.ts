import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { media } from "./media.stylex";
import { color, font, layout, radius, space, text } from "./tokens.stylex";

// Long-form text rendered from Markdown (projects and writing). The Markdown
// renderer (#lib/server/markdown.ts) gives every element the style for its tag
// from `tagStyles`, and every top-level block `column` or `wide`.
//
// Blocks are spaced by `BLOCK_SPACE`, set once on `column`. Elements that want
// more room (headings, images, embeds) ask for a larger margin; neighbouring
// margins collapse to the larger one, so an image followed by a heading gets
// the image's space, not both. (A grid gap can't do that: gaps add up.)

const BLOCK_SPACE = space["--space-32"];
const MEDIA_SPACE = layout["--media-space"];

export const prose = stylex.create({
  root: {
    color: color["--muted"],
    fontSize: text["--text-lg"],
    lineHeight: 1.85,
    overflowWrap: "anywhere",
  },
  /** A top-level block in the reading column, spaced from the one before. */
  column: {
    maxInlineSize: layout["--measure"],
    marginInline: "auto",
    marginBlockStart: { default: BLOCK_SPACE, ":first-child": 0 },
  },
  /** A top-level block across the full article width: images and `wide` embeds. */
  wide: {
    marginBlockStart: { default: BLOCK_SPACE, ":first-child": 0 },
  },
  /** Images and embeds get more room around them than text. */
  media: {
    marginBlockStart: MEDIA_SPACE,
    marginBlockEnd: MEDIA_SPACE,
  },
  /** The opening paragraph. */
  lead: {
    color: color["--ink"],
    fontSize: text["--text-xl"],
    lineHeight: 1.7,
    marginBlockEnd: space["--space-48"],
  },
  heading: {
    color: color["--ink"],
    fontFamily: font["--font-display"],
    fontSize: text["--text-3xl"],
    fontWeight: 500,
    lineHeight: 1.3,
    marginBlockStart: { default: space["--space-64"], ":first-child": 0 },
    // Table of contents links land below the header, and below the outline bar where it's a bar.
    scrollMarginBlockStart: {
      default: `calc(${layout["--site-header-height"]} + 1rem)`,
      [media.article]: `calc(${layout["--site-header-height"]} + 3.75rem)`,
      [media.phone]: `calc(${layout["--site-header-height"]} + 1rem)`,
    },
  },
  link: {
    color: { default: color["--ink"], ":hover": color["--accent-ink"] },
  },
  strong: {
    color: color["--ink"],
  },
  /** An image alone in a paragraph. With a caption, the caption ends it like text. */
  figure: {
    marginBlockEnd: { default: MEDIA_SPACE, ":has(> figcaption)": BLOCK_SPACE },
  },
  /** Wraps an image's processed versions (see src/lib/server/images.ts). */
  picture: {
    display: "block",
  },
  image: {
    display: "block",
    inlineSize: "100%",
    blockSize: "auto",
    borderRadius: radius["--radius-lg"],
    backgroundColor: color["--image-paper"],
  },
  /** Under a wide image, but in line with the text column. */
  caption: {
    maxInlineSize: layout["--measure"],
    marginInline: "auto",
    marginBlockStart: space["--space-16"],
    fontSize: text["--text-sm"],
  },
});

/** The style for each HTML element the Markdown renderer produces. Tags without one keep the inherited text style. */
export const tagStyles: Partial<Record<string, StyleXStyles>> = {
  h1: prose.heading,
  h2: prose.heading,
  h3: prose.heading,
  h4: prose.heading,
  a: prose.link,
  strong: prose.strong,
  figure: [prose.media, prose.figure],
  picture: prose.picture,
  img: prose.image,
  figcaption: prose.caption,
};
