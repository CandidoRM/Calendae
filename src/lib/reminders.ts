import { formatTime, fromIso, isDueForHistory, ordinalIso, takeLocal, todayIso, toIso, usesOrdinal, type CalEvent, type HourCycle } from "@/lib/calendar";

const FIRED_KEY = "calendae-reminders-fired";
const LEGACY_FIRED_KEY = "almanaque-reminders-fired";
const CHECK_MS = 15_000;

let timers: number[] = [];
let intervalId: number | null = null;

function eventWhen(event: CalEvent, on: Date): Date | null {
  if (!event.time) return null;
  const [hours, minutes] = event.time.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  const next = new Date(on);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  const day = next.getDate();
  next.setMonth(next.getMonth() + months);
  if (next.getDate() !== day) next.setDate(0);
  return next;
}

export function nextReminderAt(event: CalEvent, now = new Date()): Date | null {
  if (!event.notify) return null;
  if (event.source === "holiday") return null;
  if (isDueForHistory(event, todayIso(), now)) return null;
  const day = fromIso(event.iso);
  const start = event.time
    ? eventWhen(event, day)
    : new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
  if (!start) return null;
  if (!event.kind) return start.getTime() > now.getTime() - CHECK_MS || toIso(start) === toIso(now) ? start : null;
  let cursor = start;
  for (let i = 0; i < 48; i += 1) {
    if (cursor.getTime() > now.getTime() - CHECK_MS || toIso(cursor) === toIso(now)) return cursor;
    if (usesOrdinal(event)) {
      const next = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
      if (event.kind === "semanal") next.setDate(next.getDate() + 7);
      else if (event.kind === "semestral") next.setMonth(next.getMonth() + 6);
      else if (event.kind === "anual") next.setFullYear(next.getFullYear() + 1);
      else next.setMonth(next.getMonth() + 1);
      const iso = ordinalIso(event, next);
      if (!iso) break;
      const day = fromIso(iso);
      cursor =
        eventWhen(event, day) ??
        new Date(day.getFullYear(), day.getMonth(), day.getDate(), cursor.getHours(), cursor.getMinutes(), 0, 0);
    } else if (event.kind === "semanal") cursor = new Date(cursor.getTime() + 7 * 24 * 60 * 60 * 1000);
    else if (event.kind === "mensal") cursor = addMonths(cursor, 1);
    else if (event.kind === "semestral") cursor = addMonths(cursor, 6);
    else if (event.kind === "anual") cursor = addMonths(cursor, 12);
    else if (event.kind === "personalizado") {
      const step = event.everyDays ?? 0;
      if (step < 1) break;
      cursor = new Date(cursor.getTime() + step * 24 * 60 * 60 * 1000);
    } else break;
  }
  return null;
}

function fireKey(event: CalEvent, when: Date): string {
  return `${event.id}@${when.getTime()}`;
}

function readFired(): Set<string> {
  try {
    const raw = takeLocal(FIRED_KEY, LEGACY_FIRED_KEY);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(Array.isArray(list) ? list.slice(-80) : []);
  } catch {
    return new Set();
  }
}

function markFired(key: string) {
  const set = readFired();
  set.add(key);
  localStorage.setItem(FIRED_KEY, JSON.stringify([...set].slice(-80)));
}

async function showNotice(title: string, body: string) {
  try {
    const ready = await Promise.race([
      navigator.serviceWorker?.ready,
      new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 1200)),
    ]);
    if (ready && "showNotification" in ready) {
      await ready.showNotification(title, { body });
      return;
    }
  } catch {
    /* fall through */
  }
  try {
    new Notification(title, { body });
  } catch {
    /* ignore */
  }
}

export function reminderStatusLabel(): string {
  if (typeof Notification === "undefined") return "Este celular não avisa por aqui.";
  if (Notification.permission === "granted") return "Sino gravado. Aviso no horário virá no app nativo.";
  if (Notification.permission === "denied") return "Avisos bloqueados nas configurações do celular.";
  return "Avisos ainda não liberados.";
}

export async function requestReminderPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof Notification === "undefined") return "unsupported";
  if (Notification.permission !== "default") return Notification.permission;
  return Notification.requestPermission();
}

export async function enableReminders(): Promise<string> {
  if (typeof window === "undefined" || typeof Notification === "undefined") {
    return "Este celular não avisa por aqui.";
  }
  if (window.parent !== window) {
    return "Abra o Calendae na tela inicial (não no preview) para ligar os avisos.";
  }
  const permission = await requestReminderPermission();
  if (permission === "unsupported") return "Este celular não avisa por aqui.";
  if (permission === "denied") return "Avisos bloqueados nas configurações do celular.";
  if (permission !== "granted") return "Permissão não concedida.";
  await showNotice("Calendae", "Sino ligado neste compromisso. Aviso no horário virá no app nativo.");
  return "Sino gravado. Aviso no horário virá no app nativo.";
}

export function registerReminderWorker() {}

export function stopReminders() {
  for (const id of timers) window.clearTimeout(id);
  timers = [];
  if (intervalId !== null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
}

export function startReminders(events: CalEvent[], cycle: HourCycle = "12") {
  stopReminders();
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;

  const tick = () => {
    const now = new Date();
    for (const event of events) {
      const when = nextReminderAt(event, now);
      if (!when) continue;
      const wait = when.getTime() - now.getTime();
      if (wait > 12 * 60 * 60 * 1000) continue;
      const key = fireKey(event, when);
      if (readFired().has(key)) continue;
      if (wait <= 0) {
        const sameDay = toIso(when) === toIso(now);
        const recent = now.getTime() - when.getTime() < 120_000;
        if (!event.time && sameDay) {
          markFired(key);
          void showNotice(
            event.title,
            [event.kind ? `(${event.kind})` : "", "hoje"].filter(Boolean).join(" "),
          );
          continue;
        }
        if (recent) {
          markFired(key);
          void showNotice(
            event.title,
            [event.kind ? `(${event.kind})` : "", formatTime(event.time, cycle)].filter(Boolean).join(" "),
          );
        }
        continue;
      }
      const id = window.setTimeout(() => {
        if (readFired().has(key)) return;
        markFired(key);
        void showNotice(
          event.title,
          [event.kind ? `(${event.kind})` : "", formatTime(event.time, cycle)].filter(Boolean).join(" "),
        );
      }, wait);
      timers.push(id);
    }
  };

  tick();
  intervalId = window.setInterval(tick, CHECK_MS);
}
