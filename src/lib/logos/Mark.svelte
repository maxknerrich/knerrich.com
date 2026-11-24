<script lang="ts">
  import type { SVGAttributes } from "svelte/elements";
  import type { Mark } from "#lib/stickers/cut.ts";

  let { mark, ...props }: { mark: Mark } & SVGAttributes<SVGSVGElement> = $props();
</script>

<svg {...props} viewBox={mark.box.join(" ")} aria-hidden="true">
  {#each mark.paths as { d, paint = "fill" }, index (index)}
    <path
      {d}
      fill={paint === "line" ? "none" : "currentColor"}
      stroke={paint === "fill" ? "none" : "currentColor"}
      stroke-width={mark.line}
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  {/each}
</svg>
