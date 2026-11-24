<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { glow } from "#lib/BrandGlow.styles.ts";

  const id = $props.id();
  const layers = [
    { style: glow.spotlight, stop: glow.brandStop, opacity: [0.95, 0.4] },
    { style: glow.left, stop: glow.brandStop, opacity: [0.8, 0.25] },
    { style: glow.right, stop: glow.brandStop, opacity: [0.8, 0.25] },
    { style: glow.core, stop: glow.lightStop, opacity: [0.7, 0.2] },
  ];
</script>

<div {...stylex.attrs(glow.root)} aria-hidden="true">
  {#each layers as { style, stop, opacity: [center, middle] }, index (index)}
    <svg {...stylex.attrs(glow.layer, style)} viewBox="0 0 100 100" preserveAspectRatio="none">
      <radialGradient id="{id}-{index}">
        <stop offset="0" stop-opacity={center} {...stylex.attrs(stop)} />
        <stop offset="0.45" stop-opacity={middle} {...stylex.attrs(stop)} />
        <stop offset="1" stop-opacity="0" {...stylex.attrs(stop)} />
      </radialGradient>
      <ellipse cx="50" cy="50" rx="50" ry="50" fill="url(#{id}-{index})" />
    </svg>
  {/each}
  <div {...stylex.attrs(glow.fade)}></div>
</div>
