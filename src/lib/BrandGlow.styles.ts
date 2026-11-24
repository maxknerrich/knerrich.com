import * as stylex from "@stylexjs/stylex";
import { color, media, motion } from "#lib/styles/tokens.stylex.ts";

const drift = motion["--duration-drift"];

const breathe = stylex.keyframes({
  from: { transform: "translate(0, 0) scale(1)" },
  to: { transform: "translate(0, 14%) scale(1.4)" },
});

const wander = stylex.keyframes({
  from: { transform: "translate(0, 0) rotate(0deg)" },
  to: { transform: "translate(55%, 25%) rotate(28deg) scale(1.2)" },
});

const wanderBack = stylex.keyframes({
  from: { transform: "translate(0, 0) rotate(0deg)" },
  to: { transform: "translate(-55%, 20%) rotate(-24deg) scale(1.15)" },
});

export const glow = stylex.create({
  root: {
    position: "absolute",
    inset: 0,
    zIndex: -1,
    overflow: "clip",
    pointerEvents: "none",
  },
  layer: {
    position: "absolute",
    willChange: "transform",
    animationDirection: "alternate",
    animationIterationCount: "infinite",
    animationTimingFunction: "ease-in-out",
  },
  spotlight: {
    insetBlockStart: "-55%",
    insetInlineStart: "5%",
    inlineSize: "90%",
    blockSize: "125%",
    animationName: { default: "none", [media.motion]: breathe },
    animationDuration: drift,
  },
  left: {
    insetBlockStart: "-25%",
    insetInlineStart: "-25%",
    inlineSize: "65%",
    blockSize: "95%",
    opacity: 0.8,
    animationName: { default: "none", [media.motion]: wander },
    animationDuration: `calc(${drift} * 1.4)`,
  },
  right: {
    insetBlockStart: "-15%",
    insetInlineEnd: "-25%",
    inlineSize: "65%",
    blockSize: "85%",
    opacity: 0.7,
    animationName: { default: "none", [media.motion]: wanderBack },
    animationDuration: `calc(${drift} * 1.7)`,
    animationDelay: `calc(${drift} * -0.8)`,
  },
  core: {
    insetBlockStart: "-30%",
    insetInlineStart: "28%",
    inlineSize: "44%",
    blockSize: "60%",
    mixBlendMode: "overlay",
    animationName: { default: "none", [media.motion]: breathe },
    animationDuration: `calc(${drift} * 0.8)`,
    animationDelay: `calc(${drift} * -0.5)`,
  },
  brandStop: {
    stopColor: color["--brand"],
  },
  lightStop: {
    stopColor: color["--text"],
  },
  fade: {
    position: "absolute",
    inset: 0,
    backgroundImage: `linear-gradient(to bottom, transparent 45%, ${color["--night"]})`,
  },
});
