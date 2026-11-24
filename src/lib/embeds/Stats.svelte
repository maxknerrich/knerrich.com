<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { playInTurn } from "#lib/in-view.ts";
  import { scroll, type } from "#lib/styles/shared.ts";
  import type { EmbedProps } from "./props";
  import { stats } from "./Stats.styles";

  let { items }: EmbedProps<"stats"> = $props();

  const columns = [stats.one, stats.one, stats.two, stats.three, stats.two];
</script>

<ul {...stylex.attrs(stats.card, columns[items.length])}>
  {#each items as { value, label } (label)}
    <li {@attach playInTurn()} {...stylex.attrs(stats.cell, scroll.reveal)}>
      <p {...stylex.attrs(stats.value)}>{value}</p>
      <p {...stylex.attrs(stats.label, type.caps)}><span {...stylex.attrs(stats.dot)}></span>{label}</p>
    </li>
  {/each}
</ul>
