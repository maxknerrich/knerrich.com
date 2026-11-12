import * as stylex from "@stylexjs/stylex";

// Values set per element at runtime, for styles that compute with them in calc()
// (a dynamic style can only pass a value straight to one property).
export const vars = stylex.defineVars({
  /** SectionOutline's highlighted link, as a (tweened, fractional) index. */
  "--active-index": "0",
  "--section-count": "1",
});
