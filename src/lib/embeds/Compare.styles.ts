import * as stylex from "@stylexjs/stylex";
import {
  color,
  effect,
  media,
  mediaUi,
  motion,
  radius,
  space,
  text,
} from "#lib/styles/tokens.stylex.ts";

export const compare = stylex.create({
  frame: {
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
    borderRadius: radius["--radius-card"],
    backgroundColor: color["--night"],
    userSelect: "none",
    cursor: "ew-resize",
    touchAction: "pan-y",
  },
  before: {
    display: "block",
    inlineSize: "100%",
    blockSize: "auto",
    pointerEvents: "none",
  },
  after: {
    position: "absolute",
    inset: 0,
    inlineSize: "100%",
    blockSize: "100%",
    objectFit: "cover",
    pointerEvents: "none",
  },
  reveal: (position: number) => ({
    clipPath: `inset(0 0 0 ${position}%)`,
  }),
  revealBefore: (position: number) => ({
    clipPath: `inset(0 ${100 - position}% 0 0)`,
  }),
  range: {
    pointerEvents: "none",
  },
  at: (position: number) => ({
    insetInlineStart: `${position}%`,
  }),
  divider: {
    position: "absolute",
    insetBlock: 0,
    zIndex: 1,
    inlineSize: "2px",
    translate: "-50% 0",
    backgroundColor: mediaUi["--media-handle"],
    boxShadow: mediaUi["--media-handle-shadow"],
    pointerEvents: "none",
    transitionProperty: { default: "none", [media.motion]: "opacity" },
    transitionDuration: motion["--duration-base"],
  },
  dividerAtEnd: {
    opacity: 0,
  },
  handle: {
    position: "absolute",
    insetBlockStart: "50%",
    zIndex: 1,
    translate: "-50% -50%",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: mediaUi["--media-handle"],
    pointerEvents: "none",
    boxShadow: {
      default: mediaUi["--media-handle-shadow"],
      [stylex.when.siblingBefore(":focus-visible")]: effect["--focus-glow"],
    },
    transitionProperty: { default: "none", [media.motion]: "box-shadow" },
    transitionDuration: motion["--duration-base"],
  },
  label: {
    position: "absolute",
    insetBlockStart: space["--space-12"],
    paddingBlock: space["--space-4"],
    paddingInline: space["--space-10"],
    borderRadius: radius["--radius-pill"],
    color: color["--text"],
    fontSize: text["--type-small"],
    lineHeight: 1.3,
    pointerEvents: "none",
  },
  labelBefore: { insetInlineStart: space["--space-12"] },
  labelAfter: { insetInlineEnd: space["--space-12"] },
});
