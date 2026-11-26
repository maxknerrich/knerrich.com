import { timing } from "#lib/styles/tokens.stylex.ts";

const LOUDEST = 1.5;
const KEY = "sound:quiet";

class SoundSetting {
  quiet = $state(false);

  load() {
    try {
      this.quiet = localStorage.getItem(KEY) === "true";
    } catch {}
  }

  toggle() {
    this.quiet = !this.quiet;
    try {
      localStorage.setItem(KEY, String(this.quiet));
    } catch {}
  }
}

export const soundSetting = new SoundSetting();

let context: AudioContext | undefined;
let crackle: AudioBuffer | undefined;
let hiss: AudioBuffer | undefined;

export function warm() {
  if (context || soundSetting.quiet || !navigator.userActivation?.hasBeenActive) return;
  const ctx = (context = new AudioContext());
  whenIdle(() => crackleOf(ctx));
  whenIdle(() => hissOf(ctx));
}

const whenIdle = (task: () => void) => (globalThis.requestIdleCallback ?? setTimeout)(task);

export function warmOnFirstUse() {
  const later = () => {
    stop();
    whenIdle(warm);
  };
  const stop = () => {
    removeEventListener("pointerdown", later);
    removeEventListener("keydown", later);
  };
  addEventListener("pointerdown", later, { passive: true });
  addEventListener("keydown", later, { passive: true });
  return stop;
}

function audio() {
  if (soundSetting.quiet || !context) return;
  if (context.state === "suspended") void context.resume();
  return context;
}

function crackleOf(ctx: AudioContext) {
  if (crackle) return crackle;
  crackle = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = crackle.getChannelData(0);
  for (let i = 0; i < data.length; i++)
    data[i] = (Math.random() * 2 - 1) * 0.2 + (Math.random() < 0.003 ? Math.random() * 2 - 1 : 0);
  return crackle;
}

function hissOf(ctx: AudioContext) {
  if (hiss) return hiss;
  hiss = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = hiss.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return hiss;
}

function noise(
  ctx: AudioContext,
  type: BiquadFilterType,
  frequency: number,
  q: number,
  buffer = crackleOf(ctx),
) {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = q;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  source.connect(filter).connect(gain).connect(ctx.destination);
  return { source, filter, gain: gain.gain };
}

type Filter = [type: BiquadFilterType, frequency: number, q: number];
type Envelope = [peak: number, attack: number, decay: number, end: number];

function burst(ctx: AudioContext, at: number, filter: Filter, envelope: Envelope, hiss = false) {
  const [peak, attack, decay, end] = envelope;
  const sound = noise(ctx, ...filter, hiss ? hissOf(ctx) : crackleOf(ctx));
  sound.gain.setValueAtTime(0, at);
  sound.gain.linearRampToValueAtTime(peak, at + attack);
  sound.gain.exponentialRampToValueAtTime(0.001, at + decay);
  sound.source.start(at, Math.random() * 0.5);
  sound.source.stop(at + end);
  return sound;
}

export function peel() {
  const ctx = audio();
  if (!ctx) return { speed() {}, stop() {} };
  const { source, gain } = noise(ctx, "bandpass", 2800, 0.8);
  source.loop = true;
  source.start();
  return {
    speed(speed: number) {
      const now = ctx.currentTime;
      gain.cancelScheduledValues(now);
      gain.setTargetAtTime(Math.min(1, speed / LOUDEST), now, 0.02);
      gain.setTargetAtTime(0, now + 0.08, 0.06);
    },
    stop(fade = 0.1) {
      const now = ctx.currentTime;
      gain.cancelScheduledValues(now);
      gain.setTargetAtTime(0, now, fade / 3);
      source.stop(now + fade);
    },
  };
}

export function stick() {
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime;
  burst(ctx, now, ["bandpass", 1600, 0.7], [0.9, 0.004, 0.05, 0.06]);
  burst(ctx, now + 0.03, ["highpass", 3500, 0.5], [0.25, 0.05, 0.19, 0.21]);
}

export function whoosh(up = true) {
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime;
  const air = burst(ctx, now, ["bandpass", 500, 1.2], [up ? 0.12 : 0.09, 0.09, 0.3, 0.32], true);
  air.filter.frequency.setValueAtTime(up ? 500 : 2800, now);
  air.filter.frequency.exponentialRampToValueAtTime(up ? 3200 : 450, now + 0.25);
}

export function presetKey() {
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime;
  burst(ctx, now, ["bandpass", 3200, 1.4], [0.35, 0.002, 0.03, 0.04]);

  const spring = ctx.createOscillator();
  spring.frequency.value = 2100;
  const ring = ctx.createGain();
  ring.gain.setValueAtTime(0, now);
  ring.gain.linearRampToValueAtTime(0.025, now + 0.003);
  ring.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  spring.connect(ring).connect(ctx.destination);
  spring.start(now);
  spring.stop(now + 0.13);

  const at = now + timing.switchDelayMs / 1000;
  burst(ctx, at, ["bandpass", 1100, 1], [0.8, 0.003, 0.05, 0.06]);
  burst(ctx, at, ["lowpass", 500, 0.7], [0.3, 0.004, 0.07, 0.08], true);
}

export function keycap() {
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime;
  burst(ctx, now, ["bandpass", 2600, 1.2], [0.45, 0.002, 0.025, 0.03]);
  burst(ctx, now + 0.07, ["bandpass", 3800, 1.5], [0.18, 0.002, 0.02, 0.025]);
}

export function step(forward = true) {
  const ctx = audio();
  if (!ctx) return;
  burst(ctx, ctx.currentTime, ["bandpass", forward ? 3200 : 2400, 2], [0.35, 0.002, 0.035, 0.04]);
}

export function drop() {
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime;
  const slide = burst(ctx, now, ["bandpass", 2200, 0.9], [0.12, 0.03, 0.14, 0.15], true);
  slide.filter.frequency.setValueAtTime(2200, now);
  slide.filter.frequency.exponentialRampToValueAtTime(900, now + 0.12);
  burst(ctx, now + 0.1, ["lowpass", 700, 0.7], [0.7, 0.004, 0.09, 0.1], true);
}
