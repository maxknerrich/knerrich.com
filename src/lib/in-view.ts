import type { Attachment } from "svelte/attachments";

type Entry = {
  order: number;
  onArrival: boolean;
};

const callbacks = new WeakMap<Element, (node: Element, entry: Entry) => void>();
const reported = new WeakSet<Element>();
let observer: IntersectionObserver | undefined;

export const onView =
  (onEnter: (node: Element, entry: Entry) => void): Attachment =>
  (node) => {
    observer ??= new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const { isIntersecting, target } of entries) {
          const onArrival = !reported.has(target);
          reported.add(target);
          if (!isIntersecting) continue;
          observer?.unobserve(target);
          callbacks.get(target)?.(target, { order: order++, onArrival });
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    callbacks.set(node, onEnter);
    observer.observe(node);
    return () => {
      observer?.unobserve(node);
      callbacks.delete(node);
    };
  };

export const playInView = onView((node) => {
  if (node instanceof HTMLElement) node.style.setProperty("--play", "running");
});

const STAGGER = 70;

export const playInTurn = (after = 0) =>
  onView((node, { order, onArrival }) => {
    if (!(node instanceof HTMLElement)) return;
    node.style.setProperty("--reveal-delay", `${(onArrival ? after : 0) + order * STAGGER}ms`);
    node.style.setProperty("--play", "running");
  });
