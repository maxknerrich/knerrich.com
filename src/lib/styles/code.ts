import * as stylex from "@stylexjs/stylex";
import {
  code as tokens,
  color,
  font,
  layout,
  media,
  motion,
  radius,
  space,
  text,
} from "./tokens.stylex";

const noHover = "@media (hover: none)";

export const code = stylex.create({
  figure: {
    position: "relative",
  },
  title: {
    paddingBlockStart: space["--space-16"],
    paddingInline: layout["--box-pad"],
    paddingInlineEnd: `calc(${layout["--box-pad"]} + ${space["--space-64"]})`,
    color: color["--text-muted"],
    fontFamily: font["--font-pixel"],
    fontSize: text["--type-small"],
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    overflowWrap: "anywhere",
  },
  actions: {
    position: "absolute",
    zIndex: 1,
    insetBlockStart: space["--space-8"],
    insetInlineEnd: space["--space-8"],
    display: { default: "flex", [media.noScript]: "none" },
    gap: space["--space-4"],
    opacity: {
      default: 0,
      [stylex.when.ancestor(":hover")]: 1,
      [stylex.when.ancestor(":focus-within")]: 1,
      [noHover]: 1,
    },
    transitionProperty: { default: "none", [media.motion]: "opacity" },
    transitionDuration: motion["--duration-base"],
  },
  button: {
    display: "grid",
    placeItems: "center",
    inlineSize: space["--space-32"],
    blockSize: space["--space-32"],
    borderRadius: radius["--radius-md"],
    backgroundColor: { default: color["--overlay"], ":hover": color["--hairline"] },
    color: { default: color["--text-muted"], ":hover": color["--text"] },
    transitionProperty: { default: "none", [media.motion]: "background-color, color" },
    transitionDuration: motion["--duration-base"],
  },
  icon: {
    inlineSize: space["--space-12"],
    blockSize: space["--space-12"],
  },
  on: {
    color: { default: color["--glow"], ":hover": color["--glow"] },
  },

  pre: {
    paddingBlock: space["--space-16"],
    borderRadius: "inherit",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    color: tokens["--code-foreground"],
    fontFamily: font["--font-mono"],
    fontSize: tokens["--code-size"],
    lineHeight: 1.7,
    tabSize: 2,
  },
  code: {
    display: "block",
    fontFamily: "inherit",
  },
  line: {
    position: "relative",
    display: "block",
    minBlockSize: "1lh",
    paddingInlineStart: `calc(${layout["--box-pad"]} + ${tokens["--code-gutter-width"]})`,
    paddingInlineEnd: layout["--box-pad"],
    "::before": {
      content: 'attr(data-line) "   " / ""',
      position: "absolute",
      insetInlineStart: layout["--box-pad"],
      inlineSize: tokens["--code-gutter-width"],
      color: tokens["--code-gutter"],
      textAlign: "end",
      userSelect: "none",
    },
  },
});
