# Footer

On every page: back to top, the main pages, socials, the feed and the sound switch.

- Back to top returns to the top and focuses the content.
- It's revealed from under the page. When it's taller than the window, at high zoom, it scrolls on its own, so all of it can be reached.
- **Failing:** once the skip link has put `#main` in the URL, Back to top stops short: for a link to the current hash SvelteKit calls `scrollIntoView()` then `focus()`, and the focus cancels the smooth glide part way.
