<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { playInTurn } from "#lib/in-view.ts";
  import { scroll, type } from "#lib/styles/shared.ts";
  import type { EmbedProps } from "./props";
  import { stats } from "./Stats.styles";

  let { items }: EmbedProps<"stats"> = $props();

  const columns = [undefined, undefined, stats.two, stats.three, stats.two];
</script>

<ul {...stylex.attrs(stats.list, columns[items.length])}>
  {#each items as { value, label } (label)}
    <li {@attach playInTurn()} {...stylex.attrs(stats.item, scroll.reveal)}>
      <p {...stylex.attrs(stats.value)}>{value}</p>
      <p {...stylex.attrs(type.small, type.secondary, stats.label)}>{label}</p>
    </li>
  {/each}
</ul>
