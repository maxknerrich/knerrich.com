import * as stylex from "@stylexjs/stylex";
import { media } from "./media.stylex";
import { vars } from "./vars.stylex";
import { color, font, layout, space, text } from "./tokens.stylex";

// The side outline (src/lib/SectionOutline.svelte): a fixed list of the page's
// sections beside the content on wide screens, a scrolling bar under the header
// when there's no room beside it, and hidden on phones.

const ROW = "2.25rem";
const BAR_ROW = "2.75rem";
const DOT = "0.3125rem";
const COLUMN = "6.75rem";
const index = vars["--active-index"];
const count = vars["--section-count"];

export const outline = stylex.create({
  nav: {
    display: { default: "block", [media.phone]: "none" },
    position: "fixed",
    borderBlockEndStyle: "solid",
    borderBlockEndColor: color["--rule"],
    scrollbarWidth: "thin",
    fontFamily: font["--font-mono"],
    fontSize: text["--text-xs"],
    lineHeight: 1.4,
  },
  track: {
    position: "relative",
  },
  list: {
    gridTemplateColumns: `repeat(${count}, minmax(${COLUMN}, 1fr))`,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  /** One dot moves between the links rather than each link showing its own. */
  indicator: {
    position: "absolute",
    inlineSize: DOT,
    blockSize: DOT,
    borderRadius: "50%",
    backgroundColor: color["--accent-ink"],
    pointerEvents: "none",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: space["--space-12"],
    color: { default: color["--faint"], ":hover": color["--ink"] },
    textDecoration: "none",
    // Room for the indicator, in line with the label.
    "::before": {
      content: '""',
      inlineSize: DOT,
      blockSize: DOT,
      flexShrink: 0,
    },
  },
  current: {
    color: color["--ink"],
    fontWeight: 500,
  },
  /** Long section names end in an ellipsis. */
  label: {
    maxInlineSize: "13rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  /** Passes the outline's state to the indicator. */
  state: (activeIndex: number, sectionCount: number) => ({
    [vars["--active-index"]]: String(activeIndex),
    [vars["--section-count"]]: String(sectionCount),
  }),
});

/**
 * Everything that differs between the side list and the bar, which takes over at
 * `bar`. The bar starts at the top of the screen under the header (padded by its
 * height), so header and bar read as one solid strip even where the header itself
 * is transparent.
 */
const sideOrBar = (bar: string) => ({
  nav: {
    zIndex: { default: 5, [bar]: 4 },
    insetInlineStart: { default: "2rem", [bar]: 0 },
    insetInlineEnd: { default: "auto", [bar]: 0 },
    insetBlockStart: { default: "50%", [bar]: 0 },
    transform: { default: "translateY(-50%)", [bar]: "none" },
    overflowX: { default: "visible", [bar]: "auto" },
    paddingInline: { default: 0, [bar]: space["--space-16"] },
    paddingBlockStart: { default: 0, [bar]: layout["--site-header-height"] },
    backgroundColor: { default: "transparent", [bar]: color["--paper"] },
    borderBlockEndWidth: { default: 0, [bar]: 1 },
  },
  /** Holds the links and the indicator, which is positioned against it. */
  track: {
    minInlineSize: { default: 0, [bar]: `calc(${count} * ${COLUMN})` },
  },
  list: {
    display: { default: "block", [bar]: "grid" },
  },
  indicator: {
    insetBlockStart: {
      default: `calc((${ROW} - ${DOT}) / 2 + ${index} * ${ROW})`,
      [bar]: `calc((${BAR_ROW} - ${DOT}) / 2)`,
    },
    insetInlineStart: {
      default: "0.25rem",
      [bar]: `calc(0.75rem + ${index} * 100% / ${count})`,
    },
  },
  link: {
    minBlockSize: { default: ROW, [bar]: BAR_ROW },
    paddingInline: { default: space["--space-4"], [bar]: space["--space-12"] },
  },
});

const page = sideOrBar(media.tablet);
const article = sideOrBar(media.article);

/** On the homepage the side list fits until tablet widths. */
export const pageLayout = stylex.create({
  nav: page.nav,
  track: page.track,
  list: page.list,
  indicator: page.indicator,
  link: page.link,
});

/** Article pages have full-width images, so the side list needs a wider screen to stay clear of them. */
export const articleLayout = stylex.create({
  nav: article.nav,
  track: article.track,
  list: article.list,
  indicator: article.indicator,
  link: article.link,
});
