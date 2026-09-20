import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function useGlyphFlash() {
  const [flash, setFlash] = useState(false);
  const timer = useRef(0);
  const ping = useCallback(() => {
    window.clearTimeout(timer.current);
    setFlash(true);
    timer.current = window.setTimeout(() => setFlash(false), 280);
  }, []);
  return [flash, ping] as const;
}

export function CalendarGlyph({ className, flash }: { className?: string; flash?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("cal-glyph", flash && "is-flash", className)}
      aria-hidden="true"
    >
      <rect x="5.8" y="3.5" width="14.6" height="17" rx="2.2" />
      <path d="M9.8 3.5v17" />
      <path d="M3.9 8h4.8" />
      <path d="M3.9 12h4.8" />
      <path d="M3.9 16h4.8" />
      <rect x="12.6" y="6.4" width="5.4" height="2.6" rx="0.4" />
    </svg>
  );
}
