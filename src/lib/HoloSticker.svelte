<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import type { StyleXStyles } from "@stylexjs/stylex";
  import { holo } from "#lib/HoloSticker.styles.ts";
  import Icon from "#lib/icons/Icon.svelte";
  import type { IconName } from "#lib/icons/glyphs.ts";

  let { icon, tilt, style }: { icon: IconName; tilt: number; style?: StyleXStyles } = $props();
</script>

<span aria-hidden="true" {...stylex.attrs(holo.root, holo.tilt(tilt), style)}>
  <span {...stylex.attrs(holo.foil)}>
    <span {...stylex.attrs(holo.sheen)}></span>
    <span {...stylex.attrs(holo.glitter)}></span>
    <Icon name={icon} style={holo.icon} />
  </span>
</span>
