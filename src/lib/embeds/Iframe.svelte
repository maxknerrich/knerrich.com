<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import type { EmbedProps } from "./props";
  import { embed } from "#lib/styles/embeds.ts";

  // ```iframe
  // src: https://example.com/demo
  // title: What the frame shows   # required, read by screen readers
  // aspect: 4 / 3                 # optional, defaults to 16 / 9
  // ```
  let { src, title, aspect = "16 / 9" }: EmbedProps<"iframe"> = $props();
</script>

<iframe
  {...stylex.attrs(embed.frame, embed.aspect(aspect))}
  {src}
  {title}
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>
