import * as stylex from "@stylexjs/stylex";
import {
  color,
  font,
  media,
  motion,
  radius,
  space,
  stageMarker,
  text,
  vars,
} from "#lib/styles/tokens.stylex.ts";

const sprout = stylex.keyframes({
  from: { scale: 0 },
});

const LEAF_DELAY = 140;

export const stage = stylex.create({
  root: {
    display: "inline-flex",
    anchorName: "--stage",
    anchorScope: "--stage",
    alignItems: "center",
    gap: space["--space-8"],
  },
  now: {
    [vars["--play"]]: "running",
  },
  plant: {
    display: "block",
    flexShrink: 0,
    blockSize: "1.25rem",
    inlineSize: "auto",
    fill: color["--glow"],
  },
  leaf: {
    animationName: { default: "none", [media.entrance]: sprout },
    animationDuration: `calc(${motion["--duration-grow"]} * ${motion["--entrance-delay-scale"]})`,
    animationTimingFunction: motion["--ease-grow"],
    animationFillMode: "backwards",
    animationPlayState: vars["--play"],
  },
  grows: (x: number, y: number, order: number) => ({
    transformOrigin: `${x}px ${y}px`,
    animationDelay: `calc((${motion["--reveal-delay"]} + ${order * LEAF_DELAY}ms) * ${motion["--entrance-delay-scale"]})`,
  }),
  note: {
    position: "absolute",
    positionAnchor: "--stage",
    positionArea: "block-start span-inline-end",
    positionTryFallbacks: "flip-inline",
    marginBlockEnd: space["--space-8"],
    zIndex: 1,
    inlineSize: "max-content",
    maxInlineSize: "16rem",
    paddingBlock: space["--space-8"],
    paddingInline: space["--space-12"],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: color["--hairline"],
    borderRadius: radius["--radius-md"],
    backgroundColor: color["--overlay"],
    color: color["--text"],
    fontFamily: font["--font-switzer"],
    fontSize: text["--type-small"],
    lineHeight: 1.4,
    letterSpacing: "normal",
    textTransform: "none",
    whiteSpace: "normal",
    pointerEvents: "none",
    opacity: { default: 0, [stylex.when.ancestor(":hover", stageMarker)]: 1 },
    translate: {
      default: `0 ${space["--space-4"]}`,
      [stylex.when.ancestor(":hover", stageMarker)]: "0 0",
    },
    transitionProperty: { default: "none", [media.motion]: "opacity, translate" },
    transitionDuration: motion["--duration-base"],
    transitionTimingFunction: motion["--ease-out"],
  },
});
