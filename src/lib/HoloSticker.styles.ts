import * as stylex from "@stylexjs/stylex";
import { cardMarker, media, motion, palette, sticker, vars } from "#lib/styles/tokens.stylex.ts";

const slap = stylex.keyframes({
  from: { opacity: 0, scale: 1.6 },
  "30%": { opacity: 1 },
});

const shift = stylex.keyframes({
  from: {
    backgroundPosition: "0 0, 0% 0%, 0% 0%",
    filter: "hue-rotate(0deg) saturate(2.2) contrast(1.1)",
  },
  to: {
    backgroundPosition: "60px 60px, 100% 100%, 100% 100%",
    filter: "hue-rotate(360deg) saturate(2.2) contrast(1.1)",
  },
});

const sweep = stylex.keyframes({
  from: { translate: "-60% 0" },
  to: { translate: "60% 0" },
});

const twinkle = stylex.keyframes({
  "0%": { opacity: 0.35, backgroundPosition: "0 0" },
  "50%": { opacity: 0.9, backgroundPosition: "37px 11px" },
  "100%": { opacity: 0.35, backgroundPosition: "13px 41px" },
});

export const holo = stylex.create({
  root: {
    display: "grid",
    inlineSize: { default: "6.5rem", [media.phone]: "5.25rem" },
    aspectRatio: "1",
    padding: sticker["--sticker-border"],
    borderRadius: "50%",
    backgroundColor: palette.stickerPaper,
    filter: sticker["--sticker-shadow"],
    pointerEvents: "none",
    transitionProperty: { default: "none", [media.motion]: "rotate, scale" },
    transitionDuration: motion["--duration-slow"],
    transitionTimingFunction: motion["--ease-grow"],
    scale: {
      default: 1,
      [media.motion]: {
        default: 1,
        [stylex.when.ancestor(":hover", cardMarker)]: 1.08,
        [stylex.when.ancestor(":focus-visible", cardMarker)]: 1.08,
      },
    },
    animationName: { default: "none", [media.entrance]: slap },
    animationDuration: motion["--duration-fall"],
    animationTimingFunction: motion["--ease-spring"],
    animationDelay: `calc((${motion["--reveal-delay"]} + ${motion["--reveal-later"]} * 3) * ${motion["--entrance-delay-scale"]})`,
    animationFillMode: "backwards",
    animationPlayState: vars["--play"],
  },
  tilt: (degrees: number) => ({
    rotate: `${degrees}deg`,
  }),
  foil: {
    position: "relative",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
    borderRadius: "50%",
    color: sticker["--sticker-ink"],
    backgroundImage: `${sticker["--glitter"]}, conic-gradient(from 200deg, ${sticker["--sticker-iris-1"]}, ${sticker["--sticker-iris-2"]}, ${sticker["--sticker-iris-3"]}, ${sticker["--sticker-iris-4"]}, ${sticker["--sticker-iris-1"]}), linear-gradient(125deg, ${sticker["--holo-1"]}, ${sticker["--holo-2"]}, ${sticker["--holo-3"]}, ${sticker["--holo-4"]}, ${sticker["--holo-5"]}, ${sticker["--holo-1"]})`,
    backgroundSize: "60px 60px, 200% 200%, 300% 300%",
    backgroundBlendMode: "overlay, normal, normal",
    filter: "saturate(1.3)",
    animationName: {
      default: "none",
      [media.motion]: {
        default: "none",
        [stylex.when.ancestor(":hover", cardMarker)]: shift,
        [stylex.when.ancestor(":focus-visible", cardMarker)]: shift,
      },
    },
    animationDuration: motion["--duration-holo"],
    animationTimingFunction: "linear",
    animationDirection: "alternate",
    animationIterationCount: "infinite",
  },
  sheen: {
    position: "absolute",
    inset: "-20%",
    backgroundImage: `linear-gradient(115deg, ${palette.stickerClear} 30%, ${sticker["--sticker-iris-1"]} 40%, ${sticker["--sticker-iris-2"]} 46%, ${sticker["--sticker-iris-3"]} 52%, ${sticker["--sticker-iris-4"]} 58%, ${palette.stickerClear} 68%)`,
    mixBlendMode: "overlay",
    translate: "-30% 0",
    animationName: {
      default: "none",
      [media.motion]: {
        default: "none",
        [stylex.when.ancestor(":hover", cardMarker)]: sweep,
        [stylex.when.ancestor(":focus-visible", cardMarker)]: sweep,
      },
    },
    animationDuration: motion["--duration-holo-sweep"],
    animationTimingFunction: "ease-in-out",
    animationDirection: "alternate",
    animationIterationCount: "infinite",
  },
  glitter: {
    position: "absolute",
    inset: 0,
    backgroundImage: sticker["--glitter"],
    backgroundSize: "45px 45px",
    mixBlendMode: "overlay",
    opacity: {
      default: 0,
      [stylex.when.ancestor(":hover", cardMarker)]: 1,
      [stylex.when.ancestor(":focus-visible", cardMarker)]: 1,
    },
    animationName: {
      default: "none",
      [media.motion]: {
        default: "none",
        [stylex.when.ancestor(":hover", cardMarker)]: twinkle,
        [stylex.when.ancestor(":focus-visible", cardMarker)]: twinkle,
      },
    },
    animationDuration: motion["--duration-holo-twinkle"],
    animationTimingFunction: "steps(3)",
    animationIterationCount: "infinite",
  },
  icon: {
    position: "relative",
    inlineSize: { default: "2.25rem", [media.phone]: "1.5rem" },
    blockSize: { default: "2.25rem", [media.phone]: "1.5rem" },
  },
});
