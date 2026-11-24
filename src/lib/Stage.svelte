<script module lang="ts">
  import type { Stage } from "#lib/writing/frontmatter.ts";

  const NOTES: Record<Stage, string> = {
    seed: "An idea, not published yet.",
    seedling: "Just planted: an early draft that will change.",
    budding: "Taking shape: reworked a few times, still growing.",
    evergreen: "Mature: settled, and kept up to date.",
  };
</script>

<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { stage as styles } from "#lib/Stage.styles.ts";
  import { PLANTS } from "#lib/writing/plants.ts";
  import { stageMarker } from "#lib/styles/tokens.stylex.ts";

  let { stage, now = false }: { stage: Stage; now?: boolean } = $props();

  const plant = $derived(stage === "seed" ? undefined : PLANTS[stage]);
</script>

<span {...stylex.attrs(styles.root, now && styles.now, stageMarker)}>
  {#if plant}
    <svg {...stylex.attrs(styles.plant)} viewBox={plant.viewBox} aria-hidden="true">
      {#each plant.leaves as { d, origin: [x, y] }, i (i)}
        <path {...stylex.attrs(styles.leaf, styles.grows(x, y, i))} {d} />
      {/each}
    </svg>
  {/if}
  {stage.charAt(0).toUpperCase() + stage.slice(1)}
  <span {...stylex.attrs(styles.note)} aria-hidden="true">{NOTES[stage]}</span>
</span>
