import type { Picture } from "@sveltejs/enhanced-img";

// Project images live in src/lib/assets/projects/<slug>/, where @sveltejs/enhanced-img
// turns each into AVIF and WebP at a few widths at build time. Markdown keeps writing
// them as /projects/<slug>/<file>, so this maps those paths to the processed images.

const pictures = import.meta.glob<Picture>("/src/lib/assets/projects/**/*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
  // Article images are at most 60rem (960px) wide; these cover that at 1x and 2x, and phones.
  query: { enhanced: true, w: "1920;1280;640" },
});

/** The processed image for a `/projects/<slug>/<file>` path, or undefined for any other path. */
export function pictureFor(src: string): Picture | undefined {
  return pictures[`/src/lib/assets${src}`];
}
