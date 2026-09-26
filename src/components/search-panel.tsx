import { useEffect, useMemo, useRef } from "react";
import { A11yHint } from "@/components/a11y-hint";

export type SearchSlot =
  | "event"
  | "holiday"
  | "highlight"
  | "birthday"
  | "benefit"
  | "bill"
  | "irpf"
  | "pis"
  | "ipva"
  | "fgts"
  | "bolsa"
  | "gas"
  | "licenca"
  | "history"
  | "period";

export type SearchItem = {
  id: string;
  title: string;
  text: string;
  iso: string;
  kind: string;
  slot: SearchSlot;
};

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function oneEdit(word: string, query: string): boolean {
  if (Math.abs(word.length - query.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < word.length && j < query.length) {
    if (word[i] === query[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (word.length > query.length) i += 1;
    else if (word.length < query.length) j += 1;
    else {
      i += 1;
      j += 1;
    }
  }
  if (i < word.length || j < query.length) edits += 1;
  return edits <= 1;
}

function scoreName(query: string, text: string): number {
  const q = fold(query).trim();
  const t = fold(text);
  if (!q || !t) return 0;
  const words = t.split(/[^a-z0-9]+/).filter(Boolean);
  if (!words.length) return 0;
  if (t === q) return 100;
  if (t.startsWith(q) || words.some((word) => word.startsWith(q))) return 90;
  if (q.length >= 2 && t.includes(q)) return 70;
  const parts = q.split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    let from = 0;
    const ordered = parts.every((part) => {
      const found = words.findIndex((word, index) => index >= from && word.startsWith(part));
      if (found < 0) return false;
      from = found + 1;
      return true;
    });
    if (ordered) return 80;
  }
  const letters = q.replace(/[^a-z0-9]/g, "");
  if (letters.length >= 2 && !words.some((word) => word.startsWith(letters))) {
    let at = 0;
    for (const word of words) {
      if (word.startsWith(letters[at])) at += 1;
      if (at === letters.length) return 75;
    }
  }
  if (q.length >= 4 && words.some((word) => oneEdit(word, q) || oneEdit(word.slice(0, q.length + 1), q))) return 40;
  return 0;
}

function dayLabel(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

export function SearchPanel({
  query,
  items,
  onQuery,
  onPick,
}: {
  query: string;
  items: SearchItem[];
  onQuery: (value: string) => void;
  onPick: (item: SearchItem) => void;
}) {
  const menuRef = useRef<HTMLUListElement>(null);
  const dragged = useRef(false);
  const pickedAt = useRef(0);
  const hits = useMemo(() => {
    const ranked = items
      .map((item) => ({ item, score: scoreName(query, item.text) }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score || a.item.iso.localeCompare(b.item.iso) || a.item.title.localeCompare(b.item.title));
    const seen = new Set<string>();
    const out: SearchItem[] = [];
    for (const row of ranked) {
      const key = `${row.item.iso}:${fold(row.item.title)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(row.item);
      if (out.length === 12) break;
    }
    return out;
  }, [items, query]);

  const typed = fold(query).trim().length >= 1;

  useEffect(() => {
    const node = menuRef.current;
    if (!typed || !node) return;
    const el: HTMLUListElement = node;

    let current = el.scrollTop;
    let target = el.scrollTop;
    let raf = 0;
    const max = () => Math.max(0, el.scrollHeight - el.clientHeight);
    const clamp = (n: number) => Math.min(max(), Math.max(0, n));

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
      el.querySelectorAll(".cal-kind-option.is-over").forEach((node) => node.classList.remove("is-over"));
      try {
        el.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
      if (wasDrag) return;
      dragged.current = false;
      const point = document.elementFromPoint(event.clientX, event.clientY);
      const hit = point?.closest("button[role='option']") as HTMLButtonElement | null;
      if (hit && el.contains(hit)) hit.click();
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
  }, [typed, hits]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden px-3 py-4">
      <h2 className="cal-tab-title">Procurar</h2>
      <A11yHint>Busca pelo começo do nome ou pelas iniciais e abre o evento.</A11yHint>
      <input
        value={query}
        autoFocus
        placeholder="Nome, compromisso, feriado"
        aria-label="Procurar"
        className="h-11 w-full rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
        onChange={(event) => onQuery(event.target.value)}
      />
      {typed ? (
        <ul
          ref={menuRef}
          className="cal-pick-menu is-soft cal-search-menu min-h-0 flex-1"
          role="listbox"
          aria-label="Resultados"
        >
          {hits.length ? (
            hits.map((item) => (
              <li key={`${item.id}:${item.iso}`}>
                <button
                  type="button"
                  role="option"
                  className="cal-pick-option cal-kind-option cal-search-option"
                  onClick={() => {
                    if (dragged.current) {
                      dragged.current = false;
                      return;
                    }
                    const now = performance.now();
                    if (now - pickedAt.current < 50) return;
                    pickedAt.current = now;
                    onPick(item);
                  }}
                >
                  <span className="min-w-0 flex-1 truncate text-left">{item.title}</span>
                  <span className="cal-search-kind">{item.kind}</span>
                  <span className="cal-search-date">{dayLabel(item.iso)}</span>
                </button>
              </li>
            ))
          ) : (
            <li className="cal-pick-option cal-kind-option pointer-events-none text-muted">Nada parecido.</li>
          )}
        </ul>
      ) : (
        <p className="m-0 text-sm text-muted">Digite o começo ou as iniciais.</p>
      )}
    </div>
  );
}
