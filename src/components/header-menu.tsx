import { useEffect, useRef, useState } from "react";
import { useGlyphFlash } from "@/components/calendar-glyph";
import { cn } from "@/lib/utils";

type Option<T extends string | number> = {
  value: T;
  label: string;
};

type HeaderMenuProps<T extends string | number> = {
  label: string;
  value: T;
  options: Option<T>[];
  open: boolean;
  wide?: boolean;
  fixed?: boolean;
  soft?: boolean;
  buttonClassName?: string;
  optionClassName?: string;
  disabled?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPick: (value: T) => void;
};

export function HeaderMenu<T extends string | number>({
  label,
  value,
  options,
  open,
  wide,
  fixed,
  soft,
  buttonClassName,
  optionClassName,
  disabled,
  onOpen,
  onClose,
  onPick,
}: HeaderMenuProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const dragged = useRef(false);
  const lit = useRef(value);
  const settled = useRef(false);
  const valueRef = useRef(value);
  const onPickRef = useRef(onPick);
  const onCloseRef = useRef(onClose);
  const optionsRef = useRef(options);
  const opened = useRef(false);
  const [titleFlash, pingTitle] = useGlyphFlash();
  const isTitle = buttonClassName?.includes("cal-month-btn") ?? false;
  valueRef.current = value;
  onPickRef.current = onPick;
  onCloseRef.current = onClose;
  optionsRef.current = options;
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0, maxH: 216 });

  function valueFrom(node: Element | null) {
    const button = node?.closest("button[role='option']") as HTMLButtonElement | null;
    if (!button) return null;
    const raw = button.getAttribute("data-value");
    if (raw == null) return null;
    const found = optionsRef.current.find((option) => String(option.value) === raw);
    return found ? found.value : null;
  }

  function commit() {
    if (settled.current) return;
    settled.current = true;
    const next = lit.current;
    if (next !== valueRef.current) onPickRef.current(next);
    onCloseRef.current();
  }

  useEffect(() => {
    if (!open) {
      opened.current = false;
      return;
    }
    if (!opened.current) {
      lit.current = value;
      settled.current = false;
      opened.current = true;
    }
    if (!fixed) activeRef.current?.scrollIntoView({ block: "nearest" });
    function place() {
      const box = buttonRef.current?.getBoundingClientRect();
      if (!box) return;
      const frame =
        document.querySelector(".cal-app")?.getBoundingClientRect() ??
        ({ top: 0, bottom: window.innerHeight, left: 0, right: window.innerWidth } as DOMRect);
      const gap = 6;
      const pad = 10;
      const cap = 13.5 * 16;
      const below = frame.bottom - box.bottom - gap - pad;
      const above = box.top - frame.top - gap - pad;
      const openUp = below < 136 && above > below;
      const maxH = Math.min(cap, Math.max(64, openUp ? above : below));
      const top = openUp ? box.top - gap - maxH : box.bottom + gap;
      const width = Math.max(box.width, 8);
      let left = box.left;
      if (left + width > frame.right - 6) left = Math.max(frame.left + 6, frame.right - 6 - width);
      if (left < frame.left + 6) left = frame.left + 6;
      setPos({ top, left, width, maxH });
    }
    function onDoc(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node) && !menuRef.current?.contains(event.target as Node)) {
        commit();
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") commit();
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    let id = 0;
    if (fixed) {
      place();
      id = window.requestAnimationFrame(place);
      window.addEventListener("resize", place);
      window.addEventListener("scroll", place, true);
    }
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      if (fixed) {
        window.cancelAnimationFrame(id);
        window.removeEventListener("resize", place);
        window.removeEventListener("scroll", place, true);
      }
    };
  }, [open, onClose, fixed]);

  useEffect(() => {
    const el = menuRef.current;
    if (!open || !soft || !el) return;

    let current = el.scrollTop;
    let target = el.scrollTop;
    let raf = 0;
    const max = () => Math.max(0, el.scrollHeight - el.clientHeight);

    function clamp(n: number) {
      return Math.min(max(), Math.max(0, n));
    }

    function tick() {
      current += (target - current) * 0.08;
      el.scrollTop = current;
      if (Math.abs(target - current) > 0.35) raf = requestAnimationFrame(tick);
      else {
        el.scrollTop = target;
        raf = 0;
      }
    }

    function go(next: number) {
      target = clamp(next);
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onWheel(event: WheelEvent) {
      if (!el.contains(event.target as Node)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      go(target + event.deltaY * 0.38);
    }

    function onTouchMove(event: TouchEvent) {
      if (!el.contains(event.target as Node)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    let startY = 0;
    let startScroll = 0;
    let holding = false;

    function markOver(x: number, y: number) {
      const hit = document.elementFromPoint(x, y)?.closest("button[role='option']");
      const inside = hit && el.contains(hit) ? hit : null;
      el.querySelectorAll(".is-over").forEach((node) => {
        if (node !== inside) node.classList.remove("is-over");
      });
      inside?.classList.add("is-over");
      const next = valueFrom(inside);
      if (next != null) lit.current = next;
    }

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0) return;
      holding = true;
      dragged.current = false;
      startY = event.clientY;
      startScroll = target;
      current = el.scrollTop;
      target = el.scrollTop;
      markOver(event.clientX, event.clientY);
    }

    function onPointerMove(event: PointerEvent) {
      markOver(event.clientX, event.clientY);
      if (!holding) return;
      const dy = event.clientY - startY;
      if (Math.abs(dy) < 10) return;
      if (!dragged.current) {
        dragged.current = true;
        try {
          el.setPointerCapture(event.pointerId);
        } catch {
          /* ignore */
        }
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      go(startScroll - dy);
    }

    function onPointerUp(event: PointerEvent) {
      const wasDrag = dragged.current;
      holding = false;
      el.querySelectorAll(".cal-month-option.is-over, .cal-year-option.is-over, .cal-kind-option.is-over").forEach((node) => node.classList.remove("is-over"));
      try {
        el.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
      dragged.current = false;
      if (!wasDrag) {
        const point = document.elementFromPoint(event.clientX, event.clientY);
        const hit = point?.closest("button[role='option']") as HTMLButtonElement | null;
        if (hit && el.contains(hit)) hit.click();
      }
    }

    document.addEventListener("wheel", onWheel, { capture: true, passive: false });
    document.addEventListener("touchmove", onTouchMove, { capture: true, passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("wheel", onWheel, true);
      document.removeEventListener("touchmove", onTouchMove, true);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [open, soft]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        className={cn(buttonClassName, isTitle && titleFlash && "is-flash", disabled && "cursor-not-allowed opacity-45")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          if (isTitle) pingTitle();
          open ? commit() : onOpen();
        }}
      >
        {options.find((option) => option.value === value)?.label ?? String(value)}
      </button>
      {open ? (
        <ul
          ref={menuRef}
          role="listbox"
          aria-label={label}
          className={cn("cal-pick-menu", wide ? "is-wide" : "is-narrow", fixed && "is-fixed", soft && "is-soft")}
          style={
            fixed
              ? { top: pos.top, left: pos.left, width: Math.max(pos.width, 8), maxHeight: pos.maxH }
              : undefined
          }
        >
          {options.map((option) => (
            <li key={String(option.value)}>
              <button
                ref={option.value === value ? activeRef : undefined}
                type="button"
                role="option"
                aria-selected={option.value === value}
                data-value={String(option.value)}
                className={cn(
                  "cal-pick-option",
                  optionClassName,
                  option.value === value && "is-active",
                )}
                onMouseEnter={() => {
                  lit.current = option.value;
                }}
                onClick={() => {
                  if (dragged.current) {
                    dragged.current = false;
                    return;
                  }
                  settled.current = true;
                  onPick(option.value);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}