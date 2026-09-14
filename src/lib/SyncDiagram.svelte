<figure
  class="sync-diagram"
  aria-label="Local-first synchronization illustration"
>
  <svg viewBox="0 0 260 100" fill="none" aria-hidden="true">
    <path class="track-bed" d="M60 31h140M60 47h140" />
    <path class="track" d="M60 31h140M60 47h140" />
    <g class="packet outbound">
      <circle class="glow" cx="60" cy="31" r="7" />
      <circle cx="60" cy="31" r="2.75" />
    </g>
    <g class="packet inbound">
      <circle class="glow" cx="200" cy="47" r="7" />
      <circle cx="200" cy="47" r="2.75" />
    </g>

    <rect class="node local" x="8" y="12" width="52" height="52" rx="10" />
    <g class="icon">
      <rect x="22" y="26" width="24" height="24" rx="3" />
      <path d="M22 33h24M28 29.5h1" />
    </g>
    <text x="34" y="87">Local app</text>

    <rect class="node remote" x="200" y="12" width="52" height="52" rx="10" />
    <g class="icon">
      <rect x="214" y="26" width="24" height="9" rx="2" />
      <rect x="214" y="41" width="24" height="9" rx="2" />
      <path d="M219 30.5h1M219 45.5h1" />
    </g>
    <text x="226" y="87">REST API</text>
  </svg>
  <figcaption>Changes sync in both directions.</figcaption>
</figure>

<style>
  @layer portfolio {
    .sync-diagram {
      --sync-duration: 3.6s;
      --node-fill: var(--theme-active);
      --node-active: color-mix(in oklab, var(--accent-ink) 18%, var(--paper));
      margin: auto 0 0;
      padding-block-start: 2rem;
    }
    svg {
      display: block;
      inline-size: 100%;
    }
    .track-bed {
      stroke: var(--theme-active);
      stroke-width: 8;
      stroke-linecap: round;
      filter: blur(2px);
    }
    .track {
      stroke: var(--rule);
      stroke-width: 1.5;
      stroke-linecap: round;
    }
    .node {
      fill: var(--node-fill);
      stroke: var(--rule);
    }
    .icon {
      stroke: var(--muted);
      stroke-width: 1.5;
      stroke-linecap: round;
    }
    text {
      fill: var(--muted);
      font: 11px var(--font-mono);
      text-anchor: middle;
    }
    .packet {
      fill: var(--accent);
    }
    .glow {
      filter: blur(4px);
      opacity: 0.65;
    }
    .outbound {
      --travel-distance: 140px;
      transform: translateX(42px);
    }
    .inbound {
      --travel-distance: -140px;
      transform: translateX(-42px);
    }
    figcaption {
      text-align: center;
      color: var(--muted);
      font-size: 0.6875rem;
    }

    @media (prefers-reduced-motion: no-preference) {
      .packet {
        animation: transfer var(--sync-duration) ease-in-out infinite backwards;
      }
      .node {
        animation: node-update var(--sync-duration) ease-in-out infinite
          backwards;
      }
      /* Offset the return trip and its receiving node by exactly half a cycle. */
      .inbound,
      .local {
        animation-delay: calc(var(--sync-duration) / 2);
      }
    }

    @keyframes transfer {
      0%,
      4% {
        opacity: 0;
        transform: translateX(0);
      }
      8% {
        opacity: 1;
        transform: translateX(0);
      }
      43% {
        opacity: 1;
        transform: translateX(var(--travel-distance));
      }
      47%,
      100% {
        opacity: 0;
        transform: translateX(var(--travel-distance));
      }
    }
    /* Both nodes get the same complete pulse, starting only after arrival. */
    @keyframes node-update {
      0%,
      43%,
      63%,
      100% {
        fill: var(--node-fill);
        stroke: var(--rule);
      }
      47%,
      53% {
        fill: var(--node-active);
        stroke: var(--accent-ink);
      }
    }
  }
</style>
