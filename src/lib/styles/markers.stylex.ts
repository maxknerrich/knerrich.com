import * as stylex from "@stylexjs/stylex";

// Markers let an element react to the state of an ancestor:
// `opacity: { default: 0, [stylex.when.ancestor(":hover", rowMarker)]: 1 }`.

/** A writing list row, so its parts can react to the row being hovered. */
export const rowMarker = stylex.defineMarker();

/** A homepage project card, so its title can react to the card being hovered or focused. */
export const cardMarker = stylex.defineMarker();

/** A theme switch option, so its label shows while its radio is checked. */
export const optionMarker = stylex.defineMarker();

/** An open/close section on the homepage, so its icon can react to it opening. */
export const detailsMarker = stylex.defineMarker();
