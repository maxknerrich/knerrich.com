import * as stylex from "@stylexjs/stylex";

export const query = stylex.defineConsts({ phone: "(max-width: 600px)" });

export const media = stylex.defineConsts({
  phone: `@media ${query.phone}`,
  small: "@media (max-width: 480px)",
  article: "@media (max-width: 1600px)",
  motion: "@media (prefers-reduced-motion: no-preference)",
  scrollTimeline: "@supports (animation-timeline: scroll())",
  entrance: "@media (prefers-reduced-motion: no-preference) and (scripting: enabled)",
  noScript: "@media (scripting: none)",
});

export const palette = stylex.defineConsts({
  night: "#050505",
  text: "#fff",
  grid: "rgb(255 255 255 / 0.045)",
  imagePaper: "#fff",
  stickerPaper: "#f5f5f2",
  stickerGraphite: "#1c1d1f",
  chromeLight: "#f8f9fb",
  chromeMid: "#adb3bb",
  chromeDark: "#50555d",
  stickerStreak: "rgb(255 255 255 / 0.6)",
  stickerClear: "rgb(255 255 255 / 0)",
});

const graphLines = (line: string) =>
  `linear-gradient(180deg, ${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`;

export const surface = stylex.defineConsts({
  graphPaper: graphLines(palette.grid),
  bookGraphPaper: graphLines("rgb(60 110 160 / 0.07)"),
  graphPaperSize: "16px 16px",
  chrome: `linear-gradient(172deg, ${palette.chromeLight} 0%, ${palette.chromeMid} 40%, ${palette.chromeDark} 52%, ${palette.chromeLight} 66%, ${palette.chromeMid} 100%)`,
});

export const timing = stylex.defineConsts({ switchDelayMs: 120, slowMs: 240 });

export const stack = stylex.defineConsts({
  stickers: 5,
  bar: 10,
  lifted: 20,
  book: 10000,
  held: 20000,
});

export const stickerMotion = stylex.defineConsts({ lift: 1.06, ease: "ease-out" });

export const widths = stylex.defineConsts({ article: "64rem" });

const glowSurface = "18%";

const greenChannels = "42 212 121";
const green = `rgb(${greenChannels})`;
const greenAt = (alpha: number) => `rgb(${greenChannels} / ${alpha})`;

export const color = stylex.defineVars({
  "--night": palette.night,
  "--overlay": "#151515",
  "--text": palette.text,
  "--text-secondary": "rgb(255 255 255 / 0.6)",
  "--text-muted": "rgb(255 255 255 / 0.4)",
  "--text-dim": "rgb(255 255 255 / 0.16)",
  "--glow": green,
  "--glow-surface": `color-mix(in srgb, var(--glow) ${glowSurface}, transparent)`,
  "--dot": "#797979",
  "--hairline": "rgb(255 255 255 / 0.1)",
  "--pill": "rgb(0 0 0 / 0.16)",
  "--nav-hover": "rgb(255 255 255 / 0.05)",
  "--brand": green,
});

export const effect = stylex.defineVars({
  "--card-fill": "linear-gradient(100deg, rgb(255 255 255 / 0.07), rgb(255 255 255 / 0.02))",
  "--card-edge":
    "radial-gradient(circle at 0 0, rgb(255 255 255 / 0.2), rgb(21 21 21 / 0.2) 60%), linear-gradient(rgb(255 255 255 / 0.1), rgb(255 255 255 / 0.1))",
  "--scrim": "linear-gradient(transparent, rgb(0 0 0 / 0.6))",
  "--shimmer":
    "linear-gradient(90deg, var(--text-secondary) 42%, var(--text) 50%, var(--text-secondary) 58%)",

  "--primary-glow": `inset 4px 4px 25px ${greenAt(0.45)}, 0 0 10px ${greenAt(0.55)}`,
  "--secondary-glow": `0 0 10px ${greenAt(0.25)}, inset 4px 4px 25px ${greenAt(0.25)}`,
  "--secondary-hover-edge": `radial-gradient(circle at 0 0, ${green}, #0c2115)`,

  "--nav-fill": "linear-gradient(128deg, rgb(255 255 255 / 0.07), rgb(255 255 255 / 0.02))",
  "--nav-shadow":
    "inset 1px 1px 3px rgb(255 255 255 / 0.1), 0 2px 6px rgb(0 0 0 / 0.35), 0 12px 32px rgb(0 0 0 / 0.5)",
  "--nav-current-shadow": "2px 4px 2px rgb(0 0 0 / 0.15)",
  "--dot-glow": `0 0 4px ${green}`,
  "--focus-glow": `0 0 0 1px ${green}, 0 0 10px ${greenAt(0.55)}`,

  "--edge-mask": "linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
});

export const stop = stylex.defineVars({
  "--primary-fill-from": "rgb(255 255 255 / 0.3)",
  "--primary-fill-to": "rgb(255 255 255 / 0.15)",
  "--primary-edge-from": "rgb(255 255 255 / 0.4)",
  "--primary-edge-to": "rgb(25 25 25 / 0.4)",
  "--primary-hover-fill-from": greenAt(0.3),
  "--primary-hover-fill-to": greenAt(0.15),
  "--primary-hover-edge-from": green,
  "--primary-hover-edge-to": "#33714d",
  "--primary-hover-dim": "rgb(0 0 0 / 0.2)",

  "--secondary-fill-from": "rgb(255 255 255 / 0.07)",
  "--secondary-fill-to": "rgb(255 255 255 / 0.03)",
  "--secondary-edge-from": "rgb(255 255 255 / 0.2)",
  "--secondary-edge-to": "rgb(25 25 25 / 0.2)",
  "--secondary-hover-edge-from": green,
  "--secondary-hover-edge-to": "#0c2115",

  "--nav-current-fill-from": "rgb(255 255 255 / 0.2)",
  "--nav-current-fill-to": "rgb(255 255 255 / 0.04)",
  "--nav-current-edge-from": "rgb(255 255 255 / 0.4)",
  "--nav-current-edge-to": "rgb(67 72 69 / 0.4)",
});

export const sticker = stylex.defineVars({
  "--sticker-ink": "#121212",
  "--sticker-green": green,

  "--brand-docker": "#1d63ed",
  "--brand-claude": "#d97757",
  "--brand-claude-dark": "#141413",
  "--brand-react": "#61dafb",
  "--opera-sail": "#e9dccb",
  "--opera-sail-light": "#f6eee3",
  "--opera-stone": "#cfb9a1",
  "--opera-grain": "#a68d73",
  "--opera-teal": "#2c5d6c",
  "--opera-rust": "#cf5a3a",

  "--sticker-silver-light": "#eef0f3",
  "--holo-1": "#ffc4e8",
  "--holo-2": "#ffe9a8",
  "--holo-3": "#b5f7dc",
  "--holo-4": "#b3d2ff",
  "--holo-5": "#d9bfff",
  "--sticker-iris-1": "rgb(255 120 200 / 0.55)",
  "--sticker-iris-2": "rgb(255 230 120 / 0.55)",
  "--sticker-iris-3": "rgb(110 240 220 / 0.55)",
  "--sticker-iris-4": "rgb(150 140 255 / 0.55)",

  "--glitter":
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 9 -4.2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
  "--specular-light": "rgb(255 255 255 / 0.75)",

  "--sticker-backing-light": "#f1f1ee",
  "--sticker-backing": "#cfcfcb",
  "--sticker-backing-shade": "#a9a9a5",
  "--sticker-crease": "#ffffff",

  "--sticker-shadow":
    "drop-shadow(0 1px 1px rgb(0 0 0 / 0.5)) drop-shadow(0 3px 6px rgb(0 0 0 / 0.35))",
  "--sticker-lifted-shadow":
    "drop-shadow(0 6px 6px rgb(0 0 0 / 0.35)) drop-shadow(0 18px 28px rgb(0 0 0 / 0.5))",
  "--sticker-fall-height": "60px",
  "--sticker-fall-tilt": "32deg",
  "--sticker-perspective": "900px",
  "--sticker-falling-shadow":
    "drop-shadow(4px 8px 6px rgb(0 0 0 / 0.3)) drop-shadow(12px 26px 30px rgb(0 0 0 / 0.55))",
  "--flap-shadow": "drop-shadow(-2px 3px 3px rgb(0 0 0 / 0.4))",

  "--book-paper": "#f3f1ea",
  "--book-rule": "rgb(28 29 31 / 0.1)",
  "--book-ink": "#1c1d1f",
  "--book-ink-secondary": "rgb(28 29 31 / 0.8)",
  "--book-ink-muted": "rgb(28 29 31 / 0.55)",
  "--book-inside": "#e2ded3",
  "--book-action": "rgb(28 29 31 / 0.07)",
  "--book-shadow": "0 12px 32px rgb(0 0 0 / 0.55), 0 2px 6px rgb(0 0 0 / 0.4)",
  "--book-cover-shadow": "0 2px 3px rgb(0 0 0 / 0.5), 0 8px 16px rgb(0 0 0 / 0.4)",

  "--sticker-border": "0.3em",
  "--sticker-size": { default: "5.5em", [media.phone]: "5em" },
  "--sticker-round": "1.1",
});

export const font = stylex.defineVars({
  "--font-mono": '"Geist Mono", "SFMono-Regular", Consolas, monospace',
  "--font-pixel": '"Geist Pixel", "Geist Mono", monospace',
  "--font-switzer": '"Switzer", "Helvetica Neue", Helvetica, Arial, sans-serif',
});

const display = 8.047;

export const text = stylex.defineVars({
  "--type-display": {
    default: `clamp(3rem, ${display}cqi, calc(var(--content-width) * ${display} / 100))`,
    [media.phone]: "clamp(2.5rem, 13.45cqi, 3rem)",
  },
  "--type-h1": "clamp(2.375rem, 5.7vw, 5.125rem)",
  "--type-h2": "clamp(2.125rem, 4.2vw, 3.75rem)",
  "--type-h3": "clamp(1.375rem, 1.95vw, 1.75rem)",
  "--type-lead": "clamp(1.25rem, 1.67vw, 1.5rem)",
  "--type-body": "clamp(1rem, 1.25vw, 1.125rem)",
  "--type-small": "0.875rem",
  "--type-label": "1rem",
  "--type-sticker": { default: "0.75rem", [media.phone]: "0.6rem" },
});

export const space = stylex.defineVars({
  "--space-1": "0.0625rem",
  "--space-2": "0.125rem",
  "--space-4": "0.25rem",
  "--space-8": "0.5rem",
  "--space-10": "0.625rem",
  "--space-12": "0.75rem",
  "--space-16": "1rem",
  "--space-20": "1.25rem",
  "--space-24": "1.5rem",
  "--space-32": "2rem",
  "--space-40": "2.5rem",
  "--space-48": "3rem",
  "--space-64": "4rem",
  "--space-96": "6rem",
  "--space-128": "8rem",
  "--space-160": "10rem",
});

export const radius = stylex.defineVars({
  "--radius-xs": "2px",
  "--radius-sm": "0.375rem",
  "--radius-md": "0.5rem",
  "--radius-pill": "2rem",
  "--radius-button": "4px",
  "--radius-card": "12px",
});

export const motion = stylex.defineVars({
  "--duration-tap": "60ms",
  "--duration-base": "180ms",
  "--duration-slow": `${timing.slowMs}ms`,
  "--duration-drift": "7s",
  "--duration-shimmer": "4.5s",
  "--duration-press": "500ms",
  "--switch-delay": `${timing.switchDelayMs}ms`,
  "--duration-roll": "450ms",
  "--duration-zoom": "900ms",
  "--duration-entrance": "900ms",
  "--entrance-delay-scale": "1",
  "--reveal-delay": "0ms",
  "--duration-focus": "1.4s",
  "--focus-blur": "24px",
  "--focus-rise": "0.12em",
  "--duration-reveal": "1.2s",
  "--reveal-rise": "3rem",
  "--reveal-later": "150ms",
  "--parallax": "6%",
  "--duration-letter": "600ms",
  "--duration-fall": "550ms",
  "--duration-grow": "600ms",
  "--fade-in": stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } }),
  "--ease-out": "cubic-bezier(0.22, 1, 0.36, 1)",
  "--ease-grow": "cubic-bezier(0.34, 1.45, 0.64, 1)",
  "--ease-spring":
    "linear(0, 0.048, 0.173, 0.345, 0.539, 0.73, 0.903, 1.045, 1.15, 1.218, 1.25, 1.251, 1.229, 1.191, 1.144, 1.095, 1.048, 1.007, 0.975, 0.953, 0.94, 0.936, 0.938, 0.946, 0.957, 0.969, 0.982, 0.993, 1.002, 1.009, 1.014, 1.016, 1.016, 1.015, 1.013, 1.01, 1.006, 1.003, 1.001, 1)",
});

export const layout = stylex.defineVars({
  "--measure": "39rem",
  "--box-pad": "1rem",
  "--media-space": "clamp(3rem, 6vw, 5rem)",
  "--outline-bar-height": "2.75rem",
  "--scroll-offset": {
    default: "var(--space-24)",
    [media.article]: "calc(var(--outline-bar-height) + var(--space-24))",
  },

  "--page-margin": "clamp(1rem, 2.8vw, 2.5rem)",
  "--content-width": "85rem",
  "--text-column": "56.25rem",
  "--landing-section-space": "clamp(8rem, 20vw, 18rem)",
  "--intro-space": "clamp(4rem, 9vw, 8rem)",
  "--landing-header-height": "5.5rem",
  "--hero-space": "clamp(3rem, 9vw, 8rem)",
  "--bleed-margin": "2rem",
  "--bar-offset": "1.5rem",
  "--above-bar": "calc(var(--bar-offset) + 3.75rem)",
  "--nav-clearance": "calc(var(--bar-offset) + 6rem)",
});

export const code = stylex.defineVars({
  "--code-foreground": "rgb(255 255 255 / 0.92)",
  "--code-token-keyword": "#5fd99c",
  "--code-token-function": "#82b8ff",
  "--code-token-string": "#c8e6a0",
  "--code-token-string-expression": "#c8e6a0",
  "--code-token-constant": "#8fd8e8",
  "--code-token-parameter": "#d6e2ff",
  "--code-token-punctuation": "rgb(255 255 255 / 0.55)",
  "--code-token-comment": "rgb(255 255 255 / 0.42)",
  "--code-token-link": "#82b8ff",
  "--code-token-inserted": "#5fd99c",
  "--code-token-deleted": "#ff8a8a",
  "--code-token-changed": "#82b8ff",
  "--code-gutter": "rgb(255 255 255 / 0.28)",
  "--code-size": "0.8125rem",
  "--code-gutter-width": "5ch",
});

export const mediaUi = stylex.defineVars({
  "--media-backdrop": "rgb(5 5 5 / 0.94)",
  "--media-glass": "rgb(20 20 20 / 0.45)",
  "--media-glass-hover": "rgb(255 255 255 / 0.14)",
  "--media-blur": "blur(16px) saturate(1.4)",
  "--media-handle": "#fff",
  "--media-handle-shadow": "0 1px 3px rgb(0 0 0 / 0.4), 0 4px 16px rgb(0 0 0 / 0.35)",
});

export const marks = stylex.defineVars({
  "--note-green": green,
  "--note-blue": "#7daafa",
  "--note-purple": "#b094ff",
  "--note-amber": "#f5c25b",
  "--note-red": "#f87171",
  "--note": green,
  "--note-fade": "radial-gradient(circle at 0 0, #000, transparent 70%)",
  "--key-fill": "linear-gradient(rgb(255 255 255 / 0.16), rgb(255 255 255 / 0.08))",
  "--key-shadow":
    "inset 0 1px 0 rgb(255 255 255 / 0.18), inset 0 -1px 0 rgb(0 0 0 / 0.3), 0 1px 0 rgb(0 0 0 / 0.7), 0 2px 3px rgb(0 0 0 / 0.45)",
  "--key-pressed-shadow": "inset 0 1px 0 rgb(255 255 255 / 0.1), inset 0 -1px 0 rgb(0 0 0 / 0.2)",
  "--type-key": "0.8125rem",
  "--type-code": "0.875em",
  "--chip-fill": "rgb(255 255 255 / 0.08)",
  "--type-chip": "0.75rem",
});

export const reading = stylex.defineVars({
  "--rail-width": "2px",
  "--rail-indent": "0.75rem",
  "--viz-stroke": "rgb(255 255 255 / 0.32)",
  "--viz-surface": "#0d0d0d",
  "--viz-lit": `color-mix(in srgb, var(--glow) ${glowSurface}, var(--viz-surface))`,
  "--duration-step": "700ms",
  "--type-caption": "0.75rem",
});

export const vars = stylex.defineVars({
  "--edge": "none",
  "--play": "paused",
});

export const stickerState = stylex.defineVars({
  "--sticker-x": "0",
  "--sticker-y": "0",
  "--sticker-rotate": "0",
  "--sticker-ox": "0",
  "--sticker-oy": "0",
  "--sticker-ux": "1",
  "--sticker-uy": "0",
  "--sticker-fold-min": "0",
  "--sticker-fold-angle": "90",
  "--sticker-fold-offset": "0",
  "--sticker-peel": stylex.types.number(0),
  "--sticker-px": stylex.types.percentage("50%"),
  "--sticker-py": stylex.types.percentage("50%"),
});

export const button = stylex.defineVars({
  "--button-fill-from": stylex.types.color("transparent"),
  "--button-fill-to": stylex.types.color("transparent"),
  "--button-edge-from": stylex.types.color("transparent"),
  "--button-edge-to": stylex.types.color("transparent"),
  "--button-dim": stylex.types.color("transparent"),
});

export const cardMarker = stylex.defineMarker();

export const rollMarker = stylex.defineMarker();

export const headingMarker = stylex.defineMarker();

export const stageMarker = stylex.defineMarker();
