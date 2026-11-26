<script lang="ts" module>
  import * as stylex from "@stylexjs/stylex";
  import { color, media, motion, palette, radius, reading } from "#lib/styles/tokens.stylex.ts";
  import { kit as look } from "./kit.stylex.ts";
  import type { Depth } from "./kit-steps";

  const faceFill = `linear-gradient(45deg, color-mix(in srgb, ${color["--glow"]} 70%, ${palette.imagePaper}), ${color["--glow"]})`;
  const sideFill = `color-mix(in srgb, ${color["--glow"]} 62%, ${color["--night"]})`;
  const DEPTH = 8;
  const copies = Array.from({ length: DEPTH }, (_, i) => DEPTH - i);

  const shift = (depth: Depth, copy: number) =>
    depth === "solid" ? copy : depth === "copy" && copy === DEPTH ? DEPTH : 0;

  const toStep = {
    transitionDuration: reading["--duration-step"],
    transitionTimingFunction: motion["--ease-out"],
  } as const;

  const layer = {
    gridRow: 1,
    gridColumn: 1,
  } as const;

  const kit = stylex.create({
    stage: {
      position: "relative",
      display: "grid",
      placeItems: "center",
      blockSize: { default: "26rem", [media.phone]: "18rem" },
      overflow: "hidden",
      borderRadius: radius["--radius-md"],
      backgroundColor: look["--kit-canvas"],
    },
    scene: {
      display: "grid",
      inlineSize: { default: "11rem", [media.phone]: "8rem" },
      aspectRatio: "1",
      transitionProperty: { default: "none", [media.motion]: "transform" },
      ...toStep,
    },
    iso: {
      transform: "scaleY(0.57735) rotate(45deg)",
    },
    plate: {
      ...layer,
      borderRadius: look["--kit-plate-radius"],
      backgroundColor: look["--kit-plate"],
      boxShadow: look["--kit-plate-shadow"],
      transitionProperty: { default: "none", [media.motion]: "transform, box-shadow, opacity, filter" },
      ...toStep,
    },
    plateLifted: {
      transform: "translate(16%, 16%)",
      boxShadow: look["--kit-plate-lifted-shadow"],
    },
    soft: {
      opacity: 0.7,
      filter: look["--kit-soft"],
    },
    part: {
      ...layer,
      display: "grid",
      placeSelf: "center",
      inlineSize: "78%",
      aspectRatio: "1",
      transitionProperty: { default: "none", [media.motion]: "transform, filter" },
      ...toStep,
    },
    lifted: {
      transform: "translate(-10%, -10%)",
      filter: look["--kit-part-shadow"],
    },
    face: {
      ...layer,
      position: "relative",
      zIndex: 1,
      borderRadius: look["--kit-face-radius"],
      backgroundImage: faceFill,
      boxShadow: look["--kit-rim"],
      transitionProperty: { default: "none", [media.motion]: "opacity" },
      ...toStep,
    },
    glass: {
      opacity: 0.6,
      backdropFilter: look["--kit-glass-blur"],
    },
    side: {
      ...layer,
      borderRadius: look["--kit-face-radius"],
      backgroundColor: sideFill,
      transitionProperty: { default: "none", [media.motion]: "transform, opacity" },
      ...toStep,
    },
    unmade: {
      opacity: 0,
    },
    shifted: (by: number) => ({
      transform: `translate(${by}px, ${by}px)`,
    }),
    tilt: {
      position: "absolute",
      inset: 0,
      backdropFilter: look["--kit-tilt-blur"],
      maskImage: look["--kit-tilt-mask"],
      opacity: 0,
      pointerEvents: "none",
      transitionProperty: { default: "none", [media.motion]: "opacity" },
      ...toStep,
    },
    tilted: {
      opacity: 1,
    },
  });
</script>

<script lang="ts">
  import Stepper from "#lib/Stepper.svelte";
  import type { EmbedProps } from "#lib/embeds/props.ts";
  import { label, steps } from "./kit-steps";

  let { id, autoplay = false }: EmbedProps<"kit-steps"> = $props();
</script>

<Stepper {id} {label} {steps} {autoplay}>
  {#snippet children(index)}
    {@const step = steps[index]}
    <div {...stylex.attrs(kit.stage)} aria-hidden="true">
      <div {...stylex.attrs(kit.scene, step?.iso && kit.iso)}>
        <div {...stylex.attrs(kit.plate, step?.lifted && kit.plateLifted, step?.soft && kit.soft)}></div>
        <div {...stylex.attrs(kit.part, step?.lifted && kit.lifted)}>
          {#each copies as copy (copy)}
            <div {...stylex.attrs(kit.side, step?.depth === "none" && kit.unmade, kit.shifted(step ? shift(step.depth, copy) : 0))}></div>
          {/each}
          <div {...stylex.attrs(kit.face, step?.depth === "none" && kit.glass)}></div>
        </div>
      </div>
      <div {...stylex.attrs(kit.tilt, step?.soft && kit.tilted)}></div>
    </div>
  {/snippet}
</Stepper>
