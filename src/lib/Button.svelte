<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import Icon from "#lib/icons/Icon.svelte";
  import type { Snippet } from "svelte";
  import { newTab } from "#lib/links.ts";
  import Roll from "#lib/Roll.svelte";
  import { glass } from "#lib/styles/shared.ts";
  import { rollMarker } from "#lib/styles/tokens.stylex.ts";

  let {
    href,
    variant = "secondary",
    children,
  }: {
    href: string;
    variant?: "primary" | "secondary";
    children: Snippet;
  } = $props();
</script>

<a {href} {...newTab(href)} {...stylex.attrs(glass.button, glass.edge, glass[variant], rollMarker)}>
  <Icon name="arrow" style={glass.icon} />
  <Roll>{@render children()}</Roll>
</a>
