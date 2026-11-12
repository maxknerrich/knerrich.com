<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import type { Stage } from "#lib/writing/frontmatter.ts";
  import { ICONS } from "#lib/writing/sprites.ts";
  import { plant } from "#lib/styles/writing.ts";

  // The small pixel plant that marks a piece's stage in lists and legends.
  let { stage }: { stage: Stage } = $props();

  const rows = $derived(ICONS[stage]);
  const pixels = $derived(
    rows.flatMap((row, y) =>
      [...row].flatMap((char, x) => (char === "." ? [] : [{ x, y, bud: char === "+" && stage === "budding" }])),
    ),
  );
</script>

<svg
  {...stylex.attrs(plant.svg)}
  width={rows[0].length}
  height={rows.length}
  viewBox={`0 0 ${rows[0].length} ${rows.length}`}
  shape-rendering="crispEdges"
  aria-hidden="true"
>
  {#each pixels as { x, y, bud } (`${x},${y}`)}
    <rect {...stylex.attrs(bud ? plant.bud : plant.leaf)} {x} {y} width="1" height="1" />
  {/each}
</svg>
