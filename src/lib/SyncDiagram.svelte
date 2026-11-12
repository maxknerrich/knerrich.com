<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { sync } from "#lib/styles/sync-diagram.ts";

  // A silent, looping illustration of two-way sync between a local app and a REST API.
</script>

<figure {...stylex.attrs(sync.figure)} aria-label="Local-first synchronization illustration">
  <svg {...stylex.attrs(sync.svg)} viewBox="0 0 260 100" fill="none" aria-hidden="true">
    <path {...stylex.attrs(sync.trackBed)} d="M60 31h140M60 47h140" />
    <path {...stylex.attrs(sync.track)} d="M60 31h140M60 47h140" />
    <g {...stylex.attrs(sync.packet, sync.outbound)}>
      <circle {...stylex.attrs(sync.glow)} cx="60" cy="31" r="7" />
      <circle cx="60" cy="31" r="2.75" />
    </g>
    <g {...stylex.attrs(sync.packet, sync.inbound)}>
      <circle {...stylex.attrs(sync.glow)} cx="200" cy="47" r="7" />
      <circle cx="200" cy="47" r="2.75" />
    </g>

    <rect {...stylex.attrs(sync.node, sync.localNode)} x="8" y="12" width="52" height="52" rx="10" />
    <g {...stylex.attrs(sync.icon)}>
      <rect x="22" y="26" width="24" height="24" rx="3" />
      <path d="M22 33h24M28 29.5h1" />
    </g>
    <text {...stylex.attrs(sync.label)} x="34" y="87">Local app</text>

    <rect {...stylex.attrs(sync.node)} x="200" y="12" width="52" height="52" rx="10" />
    <g {...stylex.attrs(sync.icon)}>
      <rect x="214" y="26" width="24" height="9" rx="2" />
      <rect x="214" y="41" width="24" height="9" rx="2" />
      <path d="M219 30.5h1M219 45.5h1" />
    </g>
    <text {...stylex.attrs(sync.label)} x="226" y="87">REST API</text>
  </svg>
  <figcaption {...stylex.attrs(sync.caption)}>Changes sync in both directions.</figcaption>
</figure>
