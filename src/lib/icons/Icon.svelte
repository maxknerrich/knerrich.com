<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import type { StyleXStyles } from "@stylexjs/stylex";
  import { glyph, type IconName } from "./glyphs";

  let { name, style, label }: { name: IconName; style?: StyleXStyles; label?: string } = $props();
  const svg = $derived(glyph(name));
</script>

<svg
  {...svg.attributes}
  role={label ? "img" : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : "true"}
  {...stylex.attrs(style)}
>
  {@html svg.inner}
</svg>
