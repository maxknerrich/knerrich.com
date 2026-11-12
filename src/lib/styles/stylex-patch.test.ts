import * as stylex from "@stylexjs/stylex";
import { expect, test } from "vite-plus/test";

// StyleX is patched (patches/@stylexjs__stylex@<version>.patch, listed under
// pnpm.patchedDependencies in package.json). Unpatched, stylex.attrs()
// kebab-cases every inline style name, including the variable StyleX generates
// for a dynamic style: `--x-viewTransitionName` arrives as
// `--x-view-transition-name`, the compiled CSS never sees its value, and dynamic
// camelCase properties (like an embedded iframe's aspectRatio) silently
// do nothing.
//
// After updating StyleX: if pnpm can't apply the patch to the new version,
// remove it from package.json and run this test. If it passes, StyleX has fixed
// the bug: delete the patch and this test. If it fails, the bug is still there:
// recreate the patch for the new version (`pnpm patch @stylexjs/stylex@<version>`,
// change `toKebabCase` in lib/es/stylex.mjs and lib/cjs/stylex.js to leave names
// starting with `--` alone, then `pnpm patch-commit <dir>`).
const styles = stylex.create({
  name: (name: string) => ({ viewTransitionName: name }),
});

test("stylex.attrs() keeps the case of dynamic style variables", () => {
  expect(stylex.attrs(styles.name("project-title-fcsl")).style).toBe(
    "--x-viewTransitionName:project-title-fcsl",
  );
});
