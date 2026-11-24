import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { glass } from "./shared";
import {
  color,
  effect,
  font,
  headingMarker,
  layout,
  marks,
  media,
  motion,
  palette,
  radius,
  space,
  text,
  vars,
} from "./tokens.stylex";

const BLOCK_SPACE = space["--space-32"];
const MEDIA_SPACE = layout["--media-space"];
const note = (alpha: number) => `rgb(from ${marks["--note"]} r g b / ${alpha})`;

export const prose = stylex.create({
  root: {
    color: color["--text-secondary"],
    fontSize: text["--type-body"],
    lineHeight: 1.6,
    letterSpacing: "-0.01em",
    overflowWrap: "anywhere",
  },
  column: {
    maxInlineSize: layout["--measure"],
    marginInline: "auto",
    marginBlockStart: { default: BLOCK_SPACE, ":first-child": 0 },
  },
  box: {
    maxInlineSize: `calc(${layout["--measure"]} + 2 * ${layout["--box-pad"]})`,
    marginInline: "auto",
    marginBlockStart: { default: BLOCK_SPACE, ":first-child": 0 },
  },
  wide: {
    marginBlockStart: { default: BLOCK_SPACE, ":first-child": 0 },
  },
  media: {
    marginBlockStart: MEDIA_SPACE,
    marginBlockEnd: MEDIA_SPACE,
  },
  lead: {
    color: color["--text"],
    fontSize: text["--type-lead"],
    lineHeight: 1.3,
    letterSpacing: "-0.03em",
    marginBlockEnd: space["--space-48"],
  },
  heading: {
    color: color["--text"],
    fontSize: text["--type-h3"],
    lineHeight: 1.2,
    letterSpacing: "-0.03em",
    marginBlockStart: { default: space["--space-64"], ":first-child": 0 },
    scrollMarginBlockStart: layout["--scroll-offset"],
  },
  link: {
    color: { default: color["--text"], ":hover": color["--glow"] },
  },
  strong: {
    color: color["--text"],
  },
  figure: {
    marginBlockEnd: { default: MEDIA_SPACE, ":has(> figcaption)": BLOCK_SPACE },
  },
  picture: {
    display: "block",
  },
  image: {
    display: "block",
    inlineSize: "100%",
    blockSize: "auto",
    borderRadius: radius["--radius-card"],
    backgroundColor: palette.imagePaper,
  },
  caption: {
    maxInlineSize: layout["--measure"],
    marginInline: "auto",
    marginBlockStart: space["--space-16"],
    color: color["--text-muted"],
    fontSize: text["--type-small"],
  },
});

const chip = {
  display: "inline-block",
  minInlineSize: "1.6em",
  paddingInline: space["--space-4"],
  borderRadius: radius["--radius-pill"],
  fontSize: marks["--type-chip"],
  lineHeight: 1.6,
  letterSpacing: 0,
  fontVariantNumeric: "tabular-nums",
  textAlign: "center",
  textDecoration: "none",
  transitionProperty: { default: "none", [media.motion]: "color, background-color" },
  transitionDuration: motion["--duration-base"],
  transitionTimingFunction: "ease",
} as const;

export const parts = stylex.create({
  list: {
    paddingInlineStart: space["--space-24"],
  },
  listItem: {
    paddingInlineStart: space["--space-4"],
    marginBlockStart: { default: 0, ":not(:first-child)": space["--space-8"] },
    "::marker": { color: color["--text-muted"] },
  },
  quote: {
    marginInlineEnd: 0,
    paddingInlineStart: space["--space-16"],
    borderInlineStartWidth: 1,
    borderInlineStartStyle: "solid",
    borderInlineStartColor: color["--hairline"],
    color: color["--text-muted"],
  },
  code: {
    paddingInline: space["--space-4"],
    borderRadius: radius["--radius-xs"],
    backgroundColor: marks["--chip-fill"],
    color: color["--text"],
    fontFamily: font["--font-mono"],
    fontSize: marks["--type-code"],
  },
  keys: {
    display: "inline-flex",
    gap: space["--space-2"],
    marginInline: space["--space-4"],
  },
  key: {
    display: "inline-block",
    minInlineSize: "1.9em",
    paddingInline: space["--space-4"],
    borderRadius: radius["--radius-sm"],
    backgroundImage: marks["--key-fill"],
    boxShadow: { default: marks["--key-shadow"], ":active": marks["--key-pressed-shadow"] },
    color: color["--text"],
    fontFamily: "inherit",
    fontSize: marks["--type-key"],
    lineHeight: 1.8,
    textAlign: "center",
    verticalAlign: "0.1em",
    cursor: "pointer",
    userSelect: "none",
    translate: { default: "0 0", ":active": "0 1px" },
    transitionProperty: { default: "none", [media.motion]: "translate, box-shadow" },
    transitionDuration: motion["--duration-tap"],
  },
  sup: {
    lineHeight: 0,
  },

  note: {
    position: "relative",
    display: "grid",
    rowGap: space["--space-12"],
    paddingBlock: space["--space-16"],
    paddingInline: layout["--box-pad"],
    borderRadius: radius["--radius-card"],
    backgroundImage: `radial-gradient(circle at 0 0 in srgb, ${note(0.09)}, transparent 60%), ${effect["--card-fill"]}`,
    [vars["--edge"]]:
      `radial-gradient(circle at 0 0 in srgb, ${note(0.6)}, ${note(0.08)} 45%, ${color["--hairline"]} 70%)`,
    "::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      zIndex: -1,
      borderRadius: "inherit",
      backgroundImage: `repeating-linear-gradient(135deg in srgb, ${note(0.14)} 0 1px, transparent 1px 7px)`,
      maskImage: marks["--note-fade"],
      pointerEvents: "none",
    },
  },
  inNote: {
    marginBlock: 0,
  },
  noteTitle: {
    display: "flex",
    alignItems: "center",
    gap: space["--space-8"],
    color: marks["--note"],
  },
  noteIcon: {
    flexShrink: 0,
    inlineSize: "1.1em",
    blockSize: "1.1em",
  },

  footnoteRef: {
    ...chip,
    marginInlineStart: space["--space-2"],
    backgroundColor: { default: marks["--chip-fill"], ":hover": color["--glow-surface"] },
    color: { default: color["--text-secondary"], ":hover": color["--glow"] },
    scrollMarginBlockStart: layout["--scroll-offset"],
  },
  footnotes: {
    marginBlockStart: space["--space-64"],
    paddingBlockStart: space["--space-24"],
    borderBlockStartWidth: 1,
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color["--hairline"],
    color: color["--text-muted"],
    fontSize: text["--type-small"],
  },
  footnoteList: {
    display: "grid",
    rowGap: space["--space-12"],
    paddingInlineStart: 0,
    listStyle: "none",
  },
  footnote: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    columnGap: space["--space-12"],
    alignItems: "baseline",
    marginBlockStart: 0,
    paddingInlineStart: 0,
    color: { default: null, ":target": color["--text-secondary"] },
    scrollMarginBlockStart: layout["--scroll-offset"],
  },
  footnoteNumber: {
    ...chip,
    textDecoration: "none",
    backgroundColor: {
      default: marks["--chip-fill"],
      ":hover": color["--glow-surface"],
      ":focus-visible": color["--glow-surface"],
    },
    color: {
      default: color["--text-secondary"],
      ":hover": color["--glow"],
      ":focus-visible": color["--glow"],
    },
    transitionProperty: { default: "none", [media.motion]: "background-color, color" },
    transitionDuration: motion["--duration-base"],
  },
  headingLink: {
    display: "inline-grid",
    placeItems: "center",
    inlineSize: "1.5rem",
    blockSize: "1.5rem",
    marginInlineStart: space["--space-8"],
    verticalAlign: "middle",
    borderRadius: radius["--radius-md"],
    color: {
      default: color["--text-muted"],
      ":hover": color["--text"],
      ":is([data-copied])": color["--glow"],
    },
    textDecoration: "none",
    opacity: {
      default: 0,
      [stylex.when.ancestor(":hover", headingMarker)]: 1,
      ":focus-visible": 1,
      ":is([data-copied])": 1,
    },
    transitionProperty: { default: "none", [media.motion]: "opacity, color" },
    transitionDuration: motion["--duration-base"],
  },

  step: {
    ...chip,
    paddingInline: space["--space-8"],
    fontSize: text["--type-small"],
    backgroundColor: {
      default: marks["--chip-fill"],
      ":hover": color["--glow-surface"],
      "[aria-current]": color["--glow"],
    },
    color: {
      default: color["--text"],
      ":hover": color["--glow"],
      "[aria-current]": color["--night"],
    },
  },
});

export const noteKinds = stylex.create({
  NOTE: { [marks["--note"]]: marks["--note-green"] },
  TIP: { [marks["--note"]]: marks["--note-blue"] },
  IMPORTANT: { [marks["--note"]]: marks["--note-purple"] },
  WARNING: { [marks["--note"]]: marks["--note-amber"] },
  CAUTION: { [marks["--note"]]: marks["--note-red"] },
});

export const roleStyles: Partial<Record<string, StyleXStyles>> = {
  note: [glass.edge, parts.note],
  "note-title": parts.noteTitle,
  "note-icon": parts.noteIcon,
  "footnote-ref": parts.footnoteRef,
  footnotes: parts.footnotes,
  "footnote-list": parts.footnoteList,
  footnote: parts.footnote,
  "footnote-number": parts.footnoteNumber,
  "heading-link": parts.headingLink,
  keys: parts.keys,
  step: parts.step,
};

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
  ul: parts.list,
  ol: parts.list,
  li: parts.listItem,
  blockquote: parts.quote,
  code: parts.code,
  kbd: parts.key,
  sup: parts.sup,
};
