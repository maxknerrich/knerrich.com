import { untrack } from "svelte";
import type { Attachment } from "svelte/attachments";
import { prefersReducedMotion } from "svelte/motion";

const EASE = 0.12;
const FRAME = 1000 / 60;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function chase(onFrame: (value: number) => void, from = 0) {
  let value = from;
  let target = from;
  let frame = 0;
  let last = 0;
  const step = (now: number) => {
    const ease = 1 - (1 - EASE) ** ((now - (last || now - FRAME)) / FRAME);
    last = now;
    value = Math.abs(target - value) < 0.0005 ? target : value + (target - value) * ease;
    onFrame(value);
    frame = value === target ? 0 : requestAnimationFrame(step);
    if (!frame) last = 0;
  };
  return {
    aim(to: number) {
      target = to;
      if (!frame) frame = requestAnimationFrame(step);
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

export const followScroll =
  (
    progressOf: (box: DOMRect) => number,
    onFrame: (progress: number, node: HTMLElement) => void,
  ): Attachment<HTMLElement> =>
  (node) => {
    if (prefersReducedMotion.current) return;
    const progress = () => clamp(progressOf(node.getBoundingClientRect()));
    const start = progress();
    untrack(() => onFrame(start, node));
    const follower = chase((value) => onFrame(value, node), start);
    const scrolled = () => follower.aim(progress());
    addEventListener("scroll", scrolled, { passive: true });
    addEventListener("resize", scrolled);
    return () => {
      removeEventListener("scroll", scrolled);
      removeEventListener("resize", scrolled);
      follower.stop();
    };
  };

export const easeInOut = (t: number) => t * t * (3 - 2 * t);
