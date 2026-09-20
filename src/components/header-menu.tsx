import { useEffect, useRef, useState } from "react";
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
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!open) return;
    if (!fixed) activeRef.current?.scrollIntoView({ block: "nearest" });
    function place() {
      const box = buttonRef.current?.getBoundingClientRect();
      if (!box) return;
      setPos({ top: box.bottom + 6, left: box.left, width: box.width });
    }
    if (fixed) place();
    function onDoc(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) onClose();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    if (fixed) {
      window.addEventListener("resize", place);
      window.addEventListener("scroll", place, true);
    }
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
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
      event.preventDefault();
      go(target + event.deltaY * 0.38);
    }

    let startY = 0;
    let startScroll = 0;
    let holding = false;

    function markOver(x: number, y: number) {
      const hit = document.elementFromPoint(x, y)?.closest(".cal-month-option, .cal-year-option, .cal-kind-option");
      el.querySelectorAll(".cal-month-option.is-over, .cal-year-option.is-over, .cal-kind-option.is-over").forEach((node) => {
        if (node !== hit) node.classList.remove("is-over");
      });
      hit?.classList.add("is-over");
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
        const hit = document
          .elementFromPoint(event.clientX, event.clientY)
          ?.closest("button[role='option']") as HTMLButtonElement | null;
        if (hit && el.contains(hit)) hit.click();
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("wheel", onWheel);
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
        className={cn(buttonClassName, disabled && "cursor-not-allowed opacity-45")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          open ? onClose() : onOpen();
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
          style={fixed ? { top: pos.top, left: pos.left, minWidth: Math.max(pos.width, 192) } : undefined}
        >
          {options.map((option) => (
            <li key={String(option.value)}>
              <button
                ref={option.value === value ? activeRef : undefined}
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={cn(
                  "cal-pick-option",
                  optionClassName,
                  option.value === value && "is-active",
                )}
                onClick={() => {
                  if (dragged.current) {
                    dragged.current = false;
                    return;
                  }
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