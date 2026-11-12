## Patched dependencies

Three StyleX packages are patched (`patches/`, listed under `pnpm.patchedDependencies` in `package.json`). After a StyleX update pnpm refuses to install until each patch matches the new version. Before recreating one (`pnpm patch <pkg>@<version>`, edit, `pnpm patch-commit <dir>`), check whether it's still needed:

- **`@stylexjs/stylex`**: `stylex.attrs()` kebab-cases the variables behind dynamic styles, so dynamic camelCase properties (like an iframe's `aspectRatio`) silently do nothing. Without the patch, `vp test` fails in `src/lib/styles/stylex-patch.test.ts` while the bug is there; once it passes, delete the patch and the test.
- **`@stylexjs/eslint-plugin`**: teaches `valid-styles` the `::-webkit-details-marker` pseudo-element. Without the patch, `vp run lint` reports it in `src/lib/styles/home.ts` while it's still needed.
- **`@stylexjs/unplugin`**: its Vite plugin starts a timer it only clears when the server's HTTP server closes, which Vitest's servers don't have, so `vp test` hangs for 10s ("something prevents 2 Vite servers from exiting"). The patch `unref()`s the timer. If that message is back without it, it's still needed.
