import * as stylex from "@stylexjs/stylex";
import {
  layout,
  media,
  motion,
  palette,
  radius,
  space,
  stack,
  sticker,
  stickerMotion,
  stickerState,
  surface,
  text,
} from "#lib/styles/tokens.stylex.ts";

const ux = stickerState["--sticker-ux"];
const uy = stickerState["--sticker-uy"];
const p = stickerState["--sticker-peel"];
const fold = `(${stickerState["--sticker-fold-min"]} + ${p})`;
const far = "1000";
const back = `(-1 * ${far})`;
const at = (across: string, ahead: string) =>
  `calc((${fold} * ${ux} - ${across} * ${uy} + ${ahead} * ${ux}) * 1px) calc((${fold} * ${uy} + ${across} * ${ux} + ${ahead} * ${uy}) * 1px)`;
const kept = `polygon(${at(far, "0")}, ${at(back, "0")}, ${at(back, far)}, ${at(far, far)})`;
const peeled = `polygon(${at(far, "0")}, ${at(back, "0")}, ${at(back, back)}, ${at(far, back)})`;
const mirror = `matrix(calc(1 - 2 * ${ux} * ${ux}), calc(-2 * ${ux} * ${uy}), calc(-2 * ${ux} * ${uy}), calc(1 - 2 * ${uy} * ${uy}), calc(2 * ${fold} * ${ux}), calc(2 * ${fold} * ${uy}))`;
const crease = `calc((${p} + ${stickerState["--sticker-fold-offset"]}) * 1px)`;
const px = stickerState["--sticker-px"];
const py = stickerState["--sticker-py"];
const specular = `radial-gradient(circle at ${px} ${py}, ${sticker["--specular-light"]}, ${palette.stickerClear} 45%)`;
const roll = `${sticker["--sticker-backing-light"]} 0, ${sticker["--sticker-backing"]} calc(${crease} * 0.55), ${sticker["--sticker-backing-shade"]} calc(${crease} - 7px), ${sticker["--sticker-crease"]} calc(${crease} - 1.5px), ${sticker["--sticker-backing"]} ${crease}`;

const over = { position: "absolute", inset: 0 } as const;
const full = { ...over, inlineSize: "100%", blockSize: "100%" } as const;
const overlay = { ...full, overflow: "visible", pointerEvents: "none" } as const;
const leaf = {
  ...over,
  borderRadius: "inherit",
  backgroundImage: surface.bookGraphPaper,
  backgroundSize: "0.3rem 0.3rem",
  boxShadow: `inset ${space["--space-4"]} 0 0 ${sticker["--sticker-green"]}`,
} as const;

const slap = stylex.keyframes({
  "0%": { scale: `${stickerMotion.lift}` },
  "55%": { scale: "0.97" },
  "100%": { scale: "1" },
});

const hinged = (lift: string, tilt: string) =>
  `perspective(${sticker["--sticker-perspective"]}) translateZ(${lift}) translateY(50%) rotateX(${tilt}) translateY(-50%)`;

const fall = stylex.keyframes({
  "0%": {
    opacity: 0,
    transform: hinged(
      sticker["--sticker-fall-height"],
      `calc(${sticker["--sticker-fall-tilt"]} * -1)`,
    ),
    filter: sticker["--sticker-falling-shadow"],
    [stickerState["--sticker-px"]]: "0%",
    [stickerState["--sticker-py"]]: "0%",
    animationTimingFunction: "cubic-bezier(0.45, 0, 0.55, 1)",
  },
  "8%": { opacity: 1 },
  "30%": {
    transform: hinged("0px", `calc(${sticker["--sticker-fall-tilt"]} * -1)`),
    filter: sticker["--sticker-lifted-shadow"],
    animationTimingFunction: "cubic-bezier(0.5, 1, 0.89, 1)",
  },
  "100%": {
    transform: hinged("0px", "0deg"),
  },
});

export const stickers = stylex.create({
  layer: {
    ...over,
    zIndex: stack.stickers,
    overflow: "clip",
    pointerEvents: "none",
  },
  lifting: {
    zIndex: stack.lifted,
  },
  sticker: {
    position: "absolute",
    insetBlockStart: 0,
    insetInlineStart: 0,
    translate: `calc(${stickerState["--sticker-x"]} * 1px) calc(${stickerState["--sticker-y"]} * 1px)`,
    rotate: `calc(${stickerState["--sticker-rotate"]} * 1deg)`,
    scale: "1",
    transformOrigin: `calc(${stickerState["--sticker-ox"]} * 1px) calc(${stickerState["--sticker-oy"]} * 1px)`,
    filter: sticker["--sticker-shadow"],
    fontSize: text["--type-sticker"],
    cursor: "default",
    pointerEvents: "auto",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    transitionProperty: {
      default: "none",
      [media.motion]: "--sticker-peel, --sticker-px, --sticker-py, rotate, scale, filter",
    },
    transitionDuration: motion["--duration-slow"],
    transitionTimingFunction: stickerMotion.ease,
  },
  tracking: {
    transitionProperty: {
      default: "none",
      [media.motion]: "--sticker-px, --sticker-py, rotate, scale, filter",
    },
  },
  held: {
    cursor: "grabbing",
  },
  measuring: {
    visibility: "hidden",
  },
  lifted: {
    scale: { default: "1", [media.motion]: `${stickerMotion.lift}` },
    filter: sticker["--sticker-lifted-shadow"],
  },
  settle: {
    animationName: { default: "none", [media.motion]: slap },
    animationDuration: motion["--duration-slow"],
    animationTimingFunction: "ease-out",
  },
  fall: {
    animationName: { default: "none", [media.motion]: fall },
    animationDuration: `calc(${motion["--duration-fall"]} * ${motion["--entrance-delay-scale"]})`,
    animationDelay: `calc(${motion["--reveal-delay"]} * ${motion["--entrance-delay-scale"]})`,
    animationFillMode: "backwards",
    animationPlayState: "paused",
  },
  falling: {
    animationPlayState: "running",
  },

  place: (x: number, y: number, rotate: number, originX: number, originY: number, z: number) => ({
    zIndex: z,
    [stickerState["--sticker-x"]]: String(x),
    [stickerState["--sticker-y"]]: String(y),
    [stickerState["--sticker-rotate"]]: String(rotate),
    [stickerState["--sticker-ox"]]: String(originX),
    [stickerState["--sticker-oy"]]: String(originY),
  }),
  fold: (x: number, y: number, min: number, angle: number, offset: number, depth: number) => ({
    [stickerState["--sticker-ux"]]: String(x),
    [stickerState["--sticker-uy"]]: String(y),
    [stickerState["--sticker-fold-min"]]: String(min),
    [stickerState["--sticker-fold-angle"]]: String(angle),
    [stickerState["--sticker-fold-offset"]]: String(offset),
    [stickerState["--sticker-peel"]]: String(depth),
  }),
  light: (x: number, y: number) => ({
    [stickerState["--sticker-px"]]: `${x}%`,
    [stickerState["--sticker-py"]]: `${y}%`,
  }),

  body: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "minmax(0, 1fr)",
    gridTemplateColumns: "minmax(0, 1fr)",
    blockSize: "100%",
    padding: sticker["--sticker-border"],
    backgroundColor: palette.stickerPaper,
    clipPath: kept,
  },
  face: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    isolation: "isolate",
  },
  fill: (colour: string) => ({ backgroundColor: colour }),
  ink: (colour: string) => ({ color: colour }),

  round: { borderRadius: "50%" },
  frame: (width: string, aspect: number) => ({
    inlineSize: width,
    blockSize: `calc(${width} / ${aspect})`,
  }),
  mask: (url: string) => ({
    maskImage: `url("${url}")`,
    maskSize: "100% 100%",
    maskRepeat: "no-repeat",
  }),
  cutBody: {
    padding: 0,
    backgroundColor: "transparent",
  },
  cutPaper: {
    ...over,
    backgroundColor: palette.stickerPaper,
  },
  cutFace: over,
  cutColour: (left: number, top: number, width: number, height: number) => ({
    position: "absolute",
    insetInlineStart: `${left}%`,
    insetBlockStart: `${top}%`,
    inlineSize: `${width}%`,
    blockSize: `${height}%`,
    objectFit: "contain",
  }),
  cutArt: full,
  badgeMark: {
    display: "block",
    minInlineSize: 0,
    minBlockSize: 0,
    inlineSize: "58%",
    blockSize: "auto",
  },

  holo: {
    backgroundColor: sticker["--sticker-silver-light"],
    backgroundImage: `${sticker["--glitter"]}, linear-gradient(125deg, ${sticker["--holo-1"]}, ${sticker["--holo-2"]}, ${sticker["--holo-3"]}, ${sticker["--holo-4"]}, ${sticker["--holo-5"]}, ${sticker["--holo-1"]})`,
    backgroundSize: "90px, 400% 400%",
    backgroundPosition: `0 0, ${px} ${py}`,
    backgroundBlendMode: "soft-light, multiply",
  },
  chrome: {
    backgroundColor: palette.chromeMid,
    backgroundImage: surface.chrome,
  },

  sheen: {
    ...over,
    borderRadius: "inherit",
    pointerEvents: "none",
  },
  holoSheen: {
    backgroundImage: `${specular}, linear-gradient(115deg, ${palette.stickerClear} 30%, ${sticker["--sticker-iris-1"]} 40%, ${sticker["--sticker-iris-2"]} 46%, ${sticker["--sticker-iris-3"]} 52%, ${sticker["--sticker-iris-4"]} 58%, ${palette.stickerClear} 68%)`,
    backgroundSize: "100% 100%, 300% 100%",
    backgroundPosition: `0 0, ${px} ${py}`,
    opacity: 0.7,
  },
  chromeSheen: {
    backgroundImage: `${specular}, linear-gradient(110deg, ${palette.stickerClear} 40%, ${palette.stickerStreak} 48%, ${palette.stickerClear} 56%)`,
    backgroundSize: "100% 100%, 260% 100%",
    backgroundPosition: `0 0, ${px} 0`,
  },

  flapShadow: {
    ...over,
    filter: sticker["--flap-shadow"],
    pointerEvents: "none",
    opacity: `clamp(0, ${p}, 1)`,
  },
  flap: {
    ...over,
    clipPath: peeled,
    transform: mirror,
    transformOrigin: "0 0",
  },
  flapPaper: {
    ...over,
    borderRadius: "inherit",
    backgroundImage: `linear-gradient(calc(${stickerState["--sticker-fold-angle"]} * 1deg), ${roll})`,
  },

  ringSvg: {
    ...overlay,
    touchAction: "none",
  },
  inertSvg: overlay,
  inert: {
    fill: palette.stickerClear,
    stroke: palette.stickerClear,
    cursor: "default",
  },
  ring: {
    fill: "none",
    stroke: palette.stickerClear,
    cursor: "grab",
  },

  cover: {
    position: "fixed",
    zIndex: stack.book,
    pointerEvents: "auto",
    insetBlockEnd: {
      default: `calc(${layout["--bar-offset"]} + env(safe-area-inset-bottom))`,
      [media.phone]: "auto",
    },
    insetBlockStart: { default: "auto", [media.phone]: "calc(1.15rem + env(safe-area-inset-top))" },
    insetInlineEnd: { default: space["--space-24"], [media.phone]: space["--space-16"] },
    inlineSize: "2.6rem",
    blockSize: "3.2rem",
    borderStartStartRadius: radius["--radius-xs"],
    borderEndStartRadius: radius["--radius-xs"],
    borderStartEndRadius: radius["--radius-md"],
    borderEndEndRadius: radius["--radius-md"],
    backgroundColor: palette.stickerClear,
    boxShadow: sticker["--book-cover-shadow"],
    perspective: "10rem",
    rotate: { default: "-8deg", ":hover": "-3deg" },
    translate: { default: "0 0", ":hover": "0 -0.15rem" },
    scale: "1",
    transformOrigin: { default: "bottom right", [media.phone]: "top right" },
    transitionProperty: { default: "none", [media.motion]: "rotate, translate, scale" },
    transitionDuration: motion["--duration-slow"],
    transitionTimingFunction: "ease-out",
  },
  coverReady: {
    scale: "1.35",
    rotate: { default: "-3deg", ":hover": "-3deg" },
  },
  coverNear: {
    scale: "1.6",
    rotate: { default: "0deg", ":hover": "0deg" },
  },
  coverOpen: {
    rotate: { default: "3deg", ":hover": "3deg" },
    translate: { default: "0 -0.25rem", ":hover": "0 -0.25rem" },
  },
  coverInside: {
    ...leaf,
    backgroundColor: sticker["--book-inside"],
  },
  coverFront: {
    ...leaf,
    display: "grid",
    placeItems: "center",
    backgroundColor: sticker["--book-paper"],
    transformOrigin: "left center",
    transform: "rotateY(0deg)",
    transitionProperty: { default: "none", [media.motion]: "transform" },
    transitionDuration: motion["--duration-slow"],
    transitionTimingFunction: "ease-out",
  },
  coverFrontOpen: {
    transform: "rotateY(-70deg)",
  },
  coverSticker: {
    display: "grid",
    placeItems: "center",
    inlineSize: "1.5rem",
    blockSize: "1.5rem",
    marginInlineStart: space["--space-4"],
    borderWidth: "0.12rem",
    borderStyle: "solid",
    borderColor: palette.stickerPaper,
    borderRadius: "50%",
    backgroundColor: sticker["--sticker-green"],
    color: palette.stickerGraphite,
    filter: sticker["--sticker-shadow"],
    rotate: "12deg",
  },
  coverMark: {
    inlineSize: "0.85rem",
    blockSize: "auto",
  },
  book: {
    position: "fixed",
    zIndex: stack.book,
    pointerEvents: "auto",
    insetInline: space["--space-16"],
    insetBlockEnd: {
      default: `calc(${layout["--above-bar"]} + env(safe-area-inset-bottom))`,
      [media.phone]: "auto",
    },
    insetBlockStart: { default: "auto", [media.phone]: "calc(5rem + env(safe-area-inset-top))" },
    display: "grid",
    borderRadius: radius["--radius-card"],
    backgroundColor: sticker["--book-paper"],
    backgroundImage: surface.bookGraphPaper,
    backgroundSize: surface.graphPaperSize,
    boxShadow: sticker["--book-shadow"],
    color: sticker["--book-ink"],
    fontSize: text["--type-small"],
    translate: { default: "0 1rem", [media.phone]: "0 -1rem" },
    opacity: 0,
    visibility: "hidden",
    transitionProperty: { default: "visibility", [media.motion]: "translate, opacity, visibility" },
    transitionDuration: motion["--duration-slow"],
    transitionTimingFunction: "ease-out",
  },
  bookOpen: {
    translate: "0 0",
    opacity: 1,
    visibility: "visible",
  },
  bookHead: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: space["--space-4"],
    paddingBlock: space["--space-8"],
    paddingInlineStart: space["--space-16"],
    paddingInlineEnd: space["--space-8"],
    borderBlockEndWidth: 1,
    borderBlockEndStyle: "solid",
    borderBlockEndColor: sticker["--book-rule"],
  },
  bookCount: {
    marginInlineEnd: "auto",
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
  },
  bookActions: {
    display: "flex",
    gap: space["--space-4"],
    order: { default: 0, [media.phone]: 1 },
    inlineSize: { default: "auto", [media.phone]: "100%" },
    marginInlineStart: { default: 0, [media.phone]: `calc(-1 * ${space["--space-10"]})` },
  },
  bookAction: {
    minBlockSize: space["--space-32"],
    paddingInline: space["--space-10"],
    borderRadius: radius["--radius-sm"],
    backgroundColor: { default: palette.stickerClear, ":hover": sticker["--book-action"] },
  },
  bookIconAction: {
    display: "grid",
    placeItems: "center",
    inlineSize: space["--space-32"],
    blockSize: space["--space-32"],
    padding: 0,
  },
  bookIcon: {
    inlineSize: space["--space-16"],
    blockSize: space["--space-16"],
  },
  shelf: {
    display: "flex",
    gap: space["--space-48"],
    paddingBlock: space["--space-16"],
    paddingInline: { default: space["--space-24"], [media.phone]: space["--space-16"] },
    overflowX: "auto",
    overflowY: "hidden",
    overscrollBehaviorX: "contain",
    scrollbarWidth: "thin",
    scrollbarColor: `${sticker["--book-ink-muted"]} ${palette.stickerClear}`,
    cursor: "grab",
    userSelect: "none",
  },
  shelfDragging: {
    cursor: "grabbing",
  },
  chapter: {
    display: "grid",
    alignContent: "start",
    gap: space["--space-12"],
    flexShrink: 0,
  },
  chapterTitle: {
    fontSize: text["--type-small"],
    fontWeight: 600,
    color: sticker["--book-ink-secondary"],
  },
  chapterRow: {
    display: "flex",
    gap: space["--space-16"],
    padding: 0,
    listStyle: "none",
  },
  slot: {
    display: "grid",
    gridTemplateRows: "5.5rem auto",
    justifyItems: "center",
    gap: space["--space-8"],
    inlineSize: "6.5rem",
    textAlign: "center",
  },
  slotFrame: {
    position: "relative",
    display: "block",
    alignSelf: "center",
    fontSize: text["--type-sticker"],
  },
  slotOutline: {
    ...full,
    overflow: "visible",
    color: sticker["--book-ink-muted"],
  },
  slotEdge: {
    ...over,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: sticker["--book-ink-muted"],
    borderRadius: "50%",
  },
  slotLabel: {
    color: sticker["--book-ink-muted"],
    lineHeight: 1.3,
  },
  defs: {
    position: "absolute",
  },
});
