import * as stylex from "@stylexjs/stylex";
import { media } from "./media.stylex";
import { color, font, layout, radius, space, text } from "./tokens.stylex";

// Article pages: a project (src/routes/projects/[slug]) or a piece of writing
// (src/routes/writing/[slug]). The text itself is styled by ./prose.ts.

export const article = stylex.create({
  page: {
    maxInlineSize: "64rem",
    marginInline: "auto",
    paddingBlockStart: { default: space["--space-192"], [media.phone]: space["--space-160"] },
    paddingBlockEnd: { default: space["--space-64"], [media.phone]: space["--space-48"] },
    paddingInline: { default: space["--space-32"], [media.phone]: space["--space-24"] },
    scrollMarginBlockStart: layout["--site-header-height"],
  },
  /** The reading column, matching the text below. */
  column: {
    maxInlineSize: layout["--measure"],
    marginInline: "auto",
  },
  backLink: {
    marginBlockEnd: space["--space-48"],
    color: color["--muted"],
    fontFamily: font["--font-mono"],
    fontSize: text["--text-xs"],
  },
  /** A piece's title, stage, dates and tags. */
  header: {
    marginBlockEnd: space["--space-64"],
  },
  /** A piece's growth stage, with its plant icon. */
  stage: {
    display: "flex",
    alignItems: "end",
    gap: space["--space-8"],
    marginBlockEnd: space["--space-16"],
    color: color["--accent-ink"],
    fontFamily: font["--font-pixel"],
    fontSize: text["--text-md"],
  },
  title: {
    fontFamily: font["--font-display"],
    fontSize: text["--text-display"],
    fontWeight: 400,
    lineHeight: 1.08,
    letterSpacing: "-0.025em",
    textWrap: "balance",
  },
  projectTitle: {
    marginBlockEnd: space["--space-32"],
  },
  dates: {
    display: "flex",
    flexWrap: "wrap",
    rowGap: space["--space-4"],
    columnGap: space["--space-24"],
    marginBlockStart: space["--space-24"],
    color: color["--muted"],
    fontSize: text["--text-md"],
  },
  date: {
    color: color["--ink"],
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: space["--space-12"],
    padding: 0,
    margin: 0,
    listStyle: "none",
  },
  pieceTags: {
    marginBlockStart: space["--space-24"],
  },
  projectTags: {
    marginBlockEnd: space["--space-64"],
  },
  tag: {
    paddingBlock: space["--space-8"],
    paddingInline: space["--space-12"],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: color["--rule"],
    borderRadius: radius["--radius-pill"],
    color: color["--muted"],
    fontFamily: font["--font-mono"],
    fontSize: text["--text-xs"],
  },
  /** The text under the title on the not-found page. */
  message: {
    marginBlockStart: space["--space-24"],
    color: color["--muted"],
    fontSize: text["--text-lg"],
  },
  /** A project's lead image, across the page. */
  hero: {
    display: "block",
    inlineSize: "100%",
    blockSize: "auto",
    borderRadius: radius["--radius-lg"],
    backgroundColor: color["--image-paper"],
    marginBlock: 0,
    marginBlockEnd: layout["--media-space"],
  },
  footer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: space["--space-16"],
    borderBlockStartWidth: 1,
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color["--rule"],
    marginBlockStart: space["--space-96"],
    paddingBlockStart: space["--space-32"],
    fontSize: text["--text-md"],
  },
});
