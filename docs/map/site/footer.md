# Footer

On every page: back to top, the main pages, socials, the feed and the sound switch.

- Back to top returns to the top and focuses the content.
- **Failing:** once the skip link has put `#main` in the URL, Back to top stops short: for a link to the current hash SvelteKit calls `scrollIntoView()` then `focus()`, and the focus cancels the smooth glide part way.
