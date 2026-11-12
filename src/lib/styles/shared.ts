import * as stylex from "@stylexjs/stylex";
import { media } from "./media.stylex";
import { color, motion } from "./tokens.stylex";

// Styles used across pages: entrances and visually hidden text.

const enter = stylex.keyframes({
  from: { opacity: 0, transform: "translateY(6px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const fadeIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const ruleEnter = stylex.keyframes({
  from: { borderBlockStartColor: "transparent" },
  to: { borderBlockStartColor: color["--rule"] },
});

export const reveal = stylex.create({
  /** Fades and lifts an element in on first load. Combine with `reveal.delay()` to stagger. */
  enter: {
    animationName: { default: "none", [media.motion]: enter },
    animationDuration: motion["--duration-entrance"],
    animationDelay: `calc(${motion["--reveal-delay"]} * ${motion["--entrance-delay-scale"]})`,
    animationTimingFunction: motion["--ease-out"],
    animationFillMode: "backwards",
  },
  /** Fades an element in on first load. */
  fade: {
    animationName: { default: "none", [media.motion]: fadeIn },
    animationDuration: motion["--duration-entrance"],
    animationDelay: `calc(${motion["--reveal-delay"]} * ${motion["--entrance-delay-scale"]})`,
    animationTimingFunction: "ease",
    animationFillMode: "backwards",
  },
  /** Draws an element's top rule in with its entrance. */
  rule: {
    animationName: { default: "none", [media.motion]: ruleEnter },
  },
  /** When the entrance starts, e.g. `reveal.delay("240ms")`. */
  delay: (value: string) => ({ [motion["--reveal-delay"]]: value }),
});

export const shared = stylex.create({
  /** Read by screen readers, not shown. */
  visuallyHidden: {
    position: "absolute",
    inlineSize: 1,
    blockSize: 1,
    padding: 0,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
  },
});
