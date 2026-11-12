<script lang="ts">
  import type { SVGAttributes } from "svelte/elements";

  // The lw.works logo, drawn in the current text color.
  let props: SVGAttributes<SVGSVGElement> = $props();
</script>

<svg {...props} viewBox="0 0 43 24" fill="currentColor" role="img" aria-label="lw.works">
  <path d="M4.90817 2.22222C5.18479 0.994927 6.45991 0 7.75626 0H12.9201L9.11385 16.8889H18.9723L17.3696 24H0L4.90817 2.22222Z" /><path d="M24.625 2.22222H32.1362L27.7289 21.7777C27.4523 23.0051 26.1771 24 24.8808 24H19.7168L24.625 2.22222Z" /><path d="M42.4954 0H34.9842L30.0761 21.7777H35.2401C36.5363 21.7777 37.8115 20.7828 38.0881 19.5555L42.4954 0Z" /><path d="M15.2674 0H22.7786L19.4731 14.6666H11.9619L15.2674 0Z" />
</svg>
