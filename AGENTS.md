# Knerrich.com

Personal Website/Portfolio of Max Knerrich. Content is Markdown in this repo.

## Verifying

- Check visual changes in a real browser, on mobile width too.

## Documentation

- Don't document what the code already shows. A local reason the code can't show goes in a short comment next to it.

## Plans and work artifacts

Don't commit plans, research notes or scratch files. Keep them outside the worktree. A merged PR is the record of the work.

# Styling

Everything is StyleX, in `src/lib/styles/`. The design tokens are in `tokens.stylex.ts`: change a value there to change it everywhere. `src/app.css` only holds globals that StyleX can't express (fonts, the reset, the theme switch, element defaults). Never use sveltes <style> blocks, all css should end up in a single small gile
