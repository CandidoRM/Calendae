import {
  ALMANAC_KEY,
  EVENTS_KEY,
  HISTORY_KEY,
  HOLIDAYS_KEY,
  INSS_KEY,
  PERIODS_KEY,
  SETTINGS_KEY,
} from "@/lib/calendar";

export const GUARDAR_FILE = "calendae-guardar.json";
const FIRED_KEY = "calendae-reminders-fired";
const IDB_NAME = "calendae-guardar";
const IDB_STORE = "handles";

export type CalendaeSave = {
  v: 1;
  savedAt: string;
  settings: unknown;
  events: unknown;
  periods: unknown;
  holidays: unknown;
  inss: unknown;
  history: unknown;
  almanac: unknown;
  remindersFired: unknown;
};

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function packCalendae(live?: Partial<CalendaeSave>): CalendaeSave {
  if (live?.settings) writeJson(SETTINGS_KEY, live.settings);
  if (live?.events) writeJson(EVENTS_KEY, live.events);
  if (live?.periods) writeJson(PERIODS_KEY, live.periods);
  if (live?.holidays) writeJson(HOLIDAYS_KEY, live.holidays);
  if (live?.inss) writeJson(INSS_KEY, live.inss);
  if (live?.history) writeJson(HISTORY_KEY, live.history);
  if (live?.almanac) writeJson(ALMANAC_KEY, live.almanac);
  return {
    v: 1,
    savedAt: new Date().toISOString(),
    settings: live?.settings ?? readJson(SETTINGS_KEY),
    events: live?.events ?? readJson(EVENTS_KEY),
    periods: live?.periods ?? readJson(PERIODS_KEY),
    holidays: live?.holidays ?? readJson(HOLIDAYS_KEY),
    inss: live?.inss ?? readJson(INSS_KEY),
    history: live?.history ?? readJson(HISTORY_KEY),
    almanac: live?.almanac ?? readJson(ALMANAC_KEY),
    remindersFired: readJson(FIRED_KEY),
  };
}

/** Caderno da conta: só o que o usuário anotou. Feriado/INSS/almanaque ficam fora. */
export function packNotebook(live: {
  settings: unknown;
  events: unknown;
  history: unknown;
}): CalendaeSave {
  return {
    v: 1,
    savedAt: new Date().toISOString(),
    settings: live.settings,
    events: live.events,
    history: live.history,
    periods: readJson(PERIODS_KEY),
    holidays: null,
    inss: null,
    almanac: null,
    remindersFired: null,
  };
}

export function notebookPrint(settings: unknown, events: unknown, history: unknown) {
  return JSON.stringify({ settings, events, history });
}

export function applyNotebook(data: CalendaeSave) {
  if (data.settings) writeJson(SETTINGS_KEY, data.settings);
  if (data.events) writeJson(EVENTS_KEY, data.events);
  if (data.history) writeJson(HISTORY_KEY, data.history);
  if (data.periods) writeJson(PERIODS_KEY, data.periods);
}

export function applyCalendaeSave(data: CalendaeSave) {
  if (data.settings) writeJson(SETTINGS_KEY, data.settings);
  if (data.events) writeJson(EVENTS_KEY, data.events);
  if (data.periods) writeJson(PERIODS_KEY, data.periods);
  if (data.holidays) writeJson(HOLIDAYS_KEY, data.holidays);
  if (data.inss) writeJson(INSS_KEY, data.inss);
  if (data.history) writeJson(HISTORY_KEY, data.history);
  if (data.almanac) writeJson(ALMANAC_KEY, data.almanac);
  if (data.remindersFired) writeJson(FIRED_KEY, data.remindersFired);
}

export function clearLocalCalendae() {
  const keys = [
    SETTINGS_KEY,
    EVENTS_KEY,
    PERIODS_KEY,
    HOLIDAYS_KEY,
    INSS_KEY,
    HISTORY_KEY,
    ALMANAC_KEY,
    FIRED_KEY,
    "almanaque-settings",
    "almanaque-events",
    "almanaque-holidays",
    "almanaque-periods",
  ];
  for (const key of keys) localStorage.removeItem(key);
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(IDB_STORE)) {
        req.result.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getHandle(): Promise<FileSystemFileHandle | null> {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get("file");
      req.onsuccess = () => resolve((req.result as FileSystemFileHandle) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function setHandle(handle: FileSystemFileHandle) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(handle, "file");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

type WritableHandle = FileSystemFileHandle & {
  queryPermission?: (descriptor: { mode: "readwrite" }) => Promise<PermissionState>;
  requestPermission?: (descriptor: { mode: "readwrite" }) => Promise<PermissionState>;
};

async function writeFile(handle: FileSystemFileHandle, blob: Blob) {
  const file = handle as WritableHandle;
  const query = file.queryPermission?.({ mode: "readwrite" });
  const perm = query ? await query : "granted";
  if (perm !== "granted") {
    const next = await file.requestPermission?.({ mode: "readwrite" });
    if (next !== "granted") throw new Error("perm");
  }
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = GUARDAR_FILE;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2500);
}

export async function guardarCalendae(
  live?: Partial<CalendaeSave>,
): Promise<"overwrite" | "download"> {
  const data = packCalendae(live);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const stored = await getHandle();
  if (stored) {
    try {
      await writeFile(stored, blob);
      return "overwrite";
    } catch {
      /* fall through */
    }
  }
  const picker = (
    window as Window & {
      showSaveFilePicker?: (opts: {
        suggestedName: string;
        id?: string;
        startIn?: string;
        types?: { description: string; accept: Record<string, string[]> }[];
      }) => Promise<FileSystemFileHandle>;
    }
  ).showSaveFilePicker;
  if (typeof picker === "function") {
    try {
      const handle = await picker({
        suggestedName: GUARDAR_FILE,
        id: "calendae-guardar",
        startIn: "downloads",
        types: [{ description: "Calendae", accept: { "application/json": [".json"] } }],
      });
      await writeFile(handle, blob);
      await setHandle(handle);
      return "overwrite";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw error;
    }
  }
  downloadBlob(blob);
  return "download";
}
