import * as stylex from "@stylexjs/stylex";

export const kit = stylex.defineVars({
  "--kit-canvas": "#f3f3f4",
  "--kit-plate": "#fff",
  "--kit-plate-radius": "22px",
  "--kit-plate-shadow": "1px 2px 0 rgb(0 0 0 / 0.06), 0 2px 6px rgb(0 0 0 / 0.04)",
  "--kit-plate-lifted-shadow": "2px 4px 0 rgb(0 0 0 / 0.05), 0 18px 32px rgb(0 0 0 / 0.1)",
  "--kit-face-radius": "18px",
  "--kit-rim": "inset 2px 2px 1px rgb(255 255 255 / 0.3), inset -1px -1px 1px rgb(0 0 0 / 0.12)",
  "--kit-glass-blur": "blur(6px)",
  "--kit-part-shadow": "drop-shadow(0 16px 14px rgb(0 0 0 / 0.16))",
  "--kit-soft": "blur(2px)",
  "--kit-tilt-blur": "blur(6px)",
  "--kit-tilt-mask": "linear-gradient(to bottom, #000, transparent 30%, transparent 52%, #000 78%)",
});
