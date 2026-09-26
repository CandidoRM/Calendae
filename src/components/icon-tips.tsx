import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Anchor = {
  text: string;
  top: number;
  bottom: number;
  cx: number;
};

function readAnchor(el: HTMLElement): Anchor | null {
  const text = el.dataset.tip?.trim();
  if (!text) return null;
  const box = el.getBoundingClientRect();
  return { text, top: box.top, bottom: box.bottom, cx: box.left + box.width / 2 };
}

export function IconTips() {
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef(0);

  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!anchor || !node) return;
    const app = document.querySelector(".cal-app")?.getBoundingClientRect();
    if (!app) return;
    const pad = 8;
    const maxWidth = Math.max(96, app.width - pad * 2);
    node.style.maxWidth = `${maxWidth}px`;
    const width = Math.min(node.offsetWidth, maxWidth);
    const height = node.offsetHeight;
    const minX = app.left + pad;
    const maxX = app.right - pad - width;
    let x = anchor.cx - width / 2;
    x = maxX < minX ? minX : Math.min(Math.max(minX, x), maxX);
    let y = anchor.top - 6 - height;
    if (y < app.top + pad) y = anchor.bottom + 6;
    const maxY = app.bottom - pad - height;
    if (y > maxY) y = Math.max(app.top + pad, maxY);
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    node.style.visibility = "visible";
  }, [anchor]);

  useEffect(() => {
    let held: HTMLElement | null = null;
    let wait = 0;

    function tipOf(event: Event) {
      return (event.target as HTMLElement | null)?.closest(".cal-icon-tip") as HTMLElement | null;
    }

    function show(el: HTMLElement | null) {
      window.clearTimeout(hideTimer.current);
      setAnchor(el ? readAnchor(el) : null);
    }

    function over(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      const el = tipOf(event);
      if (!el) return;
      show(el);
    }

    function out(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      const el = tipOf(event);
      const next = event.relatedTarget as Node | null;
      if (el && next && el.contains(next)) return;
      if (held) return;
      show(null);
    }

    function down(event: PointerEvent) {
      if (event.pointerType === "mouse") return;
      const el = tipOf(event);
      if (!el) return;
      window.clearTimeout(wait);
      wait = window.setTimeout(() => {
        held = el;
        show(el);
      }, 480);
    }

    function up() {
      window.clearTimeout(wait);
      if (!held) return;
      const el = held;
      held = null;
      hideTimer.current = window.setTimeout(() => {
        if (held === el) return;
        show(null);
      }, 800);
    }

    function hide() {
      held = null;
      show(null);
    }

    function onFocusIn(event: FocusEvent) {
      show(tipOf(event));
    }

    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", up);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", hide);
    document.addEventListener("scroll", hide, true);
    return () => {
      window.clearTimeout(wait);
      window.clearTimeout(hideTimer.current);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", up);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", hide);
      document.removeEventListener("scroll", hide, true);
    };
  }, []);

  if (!anchor || typeof document === "undefined") return null;
  return createPortal(
    <div ref={nodeRef} className="cal-tip-float" style={{ visibility: "hidden" }} role="tooltip">
      {anchor.text}
    </div>,
    document.body,
  );
}
