import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
  'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Focus trap + Escape + scroll lock + focus restore for a dialog/overlay.
 *
 * The listener is attached on `document` in the CAPTURE phase, not on the
 * dialog element. That's the load-bearing detail: the lightbox this replaced
 * put its keydown handler on a `tabIndex={0}` div that was never
 * programmatically focused, so Escape and the arrow keys silently did nothing.
 * A document-level capture listener works regardless of what has focus inside
 * the dialog.
 *
 * `onClose`/`onKey` are read through refs so the effect depends on `open`
 * alone — an inline arrow function prop would re-run the effect (and re-steal
 * focus) on every render.
 */
export function useDialog<T extends HTMLElement>(
  open: boolean,
  onClose: () => void,
  onKey?: (e: KeyboardEvent) => void,
) {
  const ref = useRef<T | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const keyRef = useRef(onKey);
  keyRef.current = onKey;

  useEffect(() => {
    const node = ref.current;
    if (!open || !node) return;

    const restoreTarget = document.activeElement as HTMLElement | null;
    (node.querySelector<HTMLElement>(FOCUSABLE) ?? node).focus({ preventScroll: true });

    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarGap > 0) document.body.style.paddingRight = `${scrollbarGap}px`;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key === "Tab") {
        const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (el) => el.offsetWidth || el.offsetHeight || el === document.activeElement,
        );
        if (!items.length) {
          e.preventDefault();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      keyRef.current?.(e);
    };

    document.addEventListener("keydown", handler, true);
    return () => {
      document.removeEventListener("keydown", handler, true);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      restoreTarget?.focus?.({ preventScroll: true });
    };
  }, [open]);

  return ref;
}
