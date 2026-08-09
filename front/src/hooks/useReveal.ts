import { useLayoutEffect, useRef } from "react";

const STAGGER_MS = 70;
const STAGGER_CAP = 5; // 6 items max -> 350ms total, never longer

/**
 * Scroll reveal. Returns a ref only — no wrapper DOM node — so the element it
 * attaches to stays exactly the grid/flex child it already was. A `<Reveal>`
 * wrapper component would inject a div that becomes the grid item instead of
 * the real content, breaking every direct grid child on this site.
 *
 * The hidden state is applied by JS in useLayoutEffect, before paint, and only
 * ever by this hook — never by static CSS. That is the guard against the one
 * failure mode that matters here: if this file never runs (no
 * IntersectionObserver, reduced motion, JS disabled entirely), nothing is ever
 * hidden, because nothing set data-reveal in the first place.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  group = false,
  threshold = 0.06,
}: { group?: boolean; threshold?: number } = {}) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = group ? (Array.from(el.children) as HTMLElement[]) : [el];
    targets.forEach((t, i) => {
      t.style.setProperty("--reveal-delay", `${Math.min(i, STAGGER_CAP) * STAGGER_MS}ms`);
    });
    el.dataset.reveal = "pending";
    if (group) el.dataset.revealGroup = "";

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        el.dataset.reveal = "in";
        io.disconnect();
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [group, threshold]);

  return ref;
}
