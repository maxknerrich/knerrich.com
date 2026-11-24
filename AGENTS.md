# Knerrich.com

Personal website and portfolio of Max Knerrich. SvelteKit, prerendered with `adapter-static`. There is no CMS and no database. Content is Markdown in this repo; how to write it is in `docs/content.md`.

## Verifying

- Check visual changes in a real browser, on mobile width too.

## Documentation

- No code comments: lint bans them. Don't document what the code already shows; a reason the code can't show goes in `docs/`.
- `docs/`: `content.md` (writing content), `build.md` (build, checks, content mapper), `styling.md`, `motion.md`, `accessibility.md`, `embeds.md`, `stickers.md`, `Icons.md`. Read the one for the area you change.
- `docs/map/`: what every feature does and what proves it works, by topic. A change to a feature is done when every line of its file holds; keep the file in sync with the feature.

## Code

- Browser code imports only types from modules that use Effect (`src/lib/embeds/props.ts`, the frontmatter and syntax schemas), so Effect stays out of the client bundle.

## Plans and work artifacts

Don't commit plans, research notes or scratch files. Keep them outside the worktree. A merged PR is the record of the work.

# Styling

Everything is StyleX. `src/lib/styles/` holds the design tokens and the styles shared by several components. The tokens are in `tokens.stylex.ts`: change a value there to change it everywhere. A style used by one component lives with it, inside the component's `<script module>`, or in `<Component>.styles.ts` beside it when it is long. Visualizations draw with the `viz` palette (`src/lib/styles/stepper.ts`); one made for a single piece lives beside its Markdown, like the thesis's sync drawing. `src/app.css` only holds globals that StyleX can't express (fonts, the reset, element defaults). Never use sveltes <style> blocks, all css should end up in a single small file
