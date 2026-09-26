//#region node_modules/.nitro/vite/services/ssr/assets/moon-festival-CMLpKxi0.js
var CAL_TABS = [
	{
		id: "holidays",
		label: "Feriados"
	},
	{
		id: "destaques",
		label: "Destaques"
	},
	{
		id: "agenda",
		label: "Agenda"
	},
	{
		id: "birthdays",
		label: "Aniversários"
	},
	{
		id: "finance",
		label: "Finanças"
	},
	{
		id: "history",
		label: "Histórico"
	}
];
var DEFAULT_SETTINGS = {
	theme: "clareira",
	font: "grove",
	size: "md",
	municipal: false,
	commemorative: false,
	elections: true,
	enem: false,
	irpfOn: true,
	seasons: true,
	lunar: false,
	hourCycle: "12",
	electionSecondRound: false,
	electionSecondTriedYear: null,
	facultative: true,
	national: true,
	cityName: "",
	cityIbge: null,
	cityUf: "",
	electionPlace: "",
	electionZone: "",
	weekStart: "sunday",
	saturdayTint: false,
	sundayTint: false,
	holidayTint: true,
	tabs: {
		holidays: true,
		destaques: true,
		agenda: true,
		birthdays: true,
		finance: true,
		history: true
	},
	a11yNumbers: false,
	a11yText: false,
	a11ySaturated: false,
	a11yColorblind: false,
	a11yHints: false,
	pisBirthMonth: null,
	fgtsBirthMonth: null,
	laborMonth: null,
	pisOn: false,
	fgtsOn: false,
	laborTriedYear: null,
	bolsaNis: "",
	bolsaOn: false,
	gasOn: false,
	ipvaUf: "",
	ipvaPlate: "",
	ipvaDigit: null,
	ipvaOn: false,
	licencaOn: false
};
var EVENT_KINDS = [
	"semanal",
	"mensal",
	"semestral",
	"anual",
	"personalizado"
];
var DOW = [
	"seg",
	"ter",
	"qua",
	"qui",
	"sex",
	"sáb",
	"dom"
];
var DOW_SUNDAY = [
	"dom",
	"seg",
	"ter",
	"qua",
	"qui",
	"sex",
	"sáb"
];
function weekLabels(start) {
	return start === "sunday" ? DOW_SUNDAY : DOW;
}
var MONTHS = [
	"janeiro",
	"fevereiro",
	"março",
	"abril",
	"maio",
	"junho",
	"julho",
	"agosto",
	"setembro",
	"outubro",
	"novembro",
	"dezembro"
];
var WEEKDAYS = [
	"domingo",
	"segunda-feira",
	"terça-feira",
	"quarta-feira",
	"quinta-feira",
	"sexta-feira",
	"sábado"
];
var SETTINGS_KEY = "calendae-settings";
var YEAR_MAX = 9999;
/** JS trata 0–99 como 1900–1999. setFullYear evita isso. */
function civilDate(year, monthIndex, day = 1) {
	const date = /* @__PURE__ */ new Date(0);
	date.setFullYear(year, monthIndex, day);
	date.setHours(0, 0, 0, 0);
	return date;
}
var EVENTS_KEY = "calendae-events";
var HOLIDAYS_KEY = "calendae-holidays";
var PERIODS_KEY = "calendae-periods";
var INSS_KEY = "calendae-inss";
var HISTORY_KEY = "calendae-history";
var ALMANAC_KEY = "calendae-almanac";
var LEGACY_SETTINGS_KEY = "almanaque-settings";
var LEGACY_EVENTS_KEY = "almanaque-events";
var LEGACY_HOLIDAYS_KEY = "almanaque-holidays";
function takeLocal(key, legacy) {
	try {
		const fresh = localStorage.getItem(key);
		if (fresh != null) {
			localStorage.removeItem(legacy);
			return fresh;
		}
		const old = localStorage.getItem(legacy);
		if (old == null) return null;
		localStorage.setItem(key, old);
		localStorage.removeItem(legacy);
		return old;
	} catch {
		return null;
	}
}
function readSettingsRaw() {
	return takeLocal(SETTINGS_KEY, LEGACY_SETTINGS_KEY);
}
function readEventsRaw() {
	return takeLocal(EVENTS_KEY, LEGACY_EVENTS_KEY);
}
function readHolidaysRaw() {
	return takeLocal(HOLIDAYS_KEY, LEGACY_HOLIDAYS_KEY);
}
function toIso(date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${String(y).padStart(4, "0")}-${m}-${d}`;
}
function todayIso() {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "America/Sao_Paulo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(/* @__PURE__ */ new Date());
	const pick = (type) => parts.find((p) => p.type === type)?.value ?? "01";
	return `${pick("year")}-${pick("month")}-${pick("day")}`;
}
function fromIso(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return civilDate(y, m - 1, d);
}
function shiftMonth(anchor, delta) {
	return civilDate(anchor.getFullYear(), anchor.getMonth() + delta, 1);
}
function weekdayName(iso) {
	return WEEKDAYS[fromIso(iso).getDay()];
}
function formatTime(time, cycle = "12") {
	if (!time) return "";
	const [hourPart, minutePart] = time.split(":");
	const hours = Number(hourPart);
	const minutes = Number(minutePart);
	if (!Number.isFinite(hours)) return time;
	const mins = Number.isFinite(minutes) ? String(minutes).padStart(2, "0") : "00";
	if (cycle === "24") return `${String(Math.min(23, Math.max(0, hours))).padStart(2, "0")}:${mins}`;
	const suffix = hours >= 12 ? "pm" : "am";
	return `${hours % 12 === 0 ? 12 : hours % 12}:${mins} ${suffix}`;
}
function shiftDays(date, days) {
	return civilDate(date.getFullYear(), date.getMonth(), date.getDate() + days);
}
function expandPeriod(period) {
	const start = fromIso(period.startIso);
	const count = Math.max(1, Math.min(366, Math.floor(period.days) || 1));
	return Array.from({ length: count }, (_, i) => toIso(shiftDays(start, i)));
}
function isPeriodEvent(event) {
	return event.source === "period";
}
function eventOverlapsMonth(event, year, month) {
	const days = Math.max(1, Math.min(366, Math.floor(event.durationDays ?? 1) || 1));
	const start = fromIso(event.iso);
	for (let i = 0; i < days; i += 1) {
		const date = shiftDays(start, i);
		if (date.getFullYear() === year && date.getMonth() === month) return true;
	}
	return false;
}
function eventSpanIsos(event) {
	return expandPeriod({
		id: event.id,
		title: event.title,
		startIso: event.iso,
		days: event.durationDays ?? 1
	});
}
function formatHolidaySync(cache) {
	if (!cache) return "Sincronizando feriados oficiais…";
	if (cache.source !== "live") return "Lista de segurança — reconecte para atualizar.";
	const age = Date.now() - cache.fetchedAt;
	if (age < 6e4) return "Sincronizado agora.";
	const hours = Math.max(1, Math.round(age / 36e5));
	if (hours < 24) return `Sincronizado há ${hours} h.`;
	return `Sincronizado há ${Math.max(1, Math.round(hours / 24))} d.`;
}
function lastDayOfMonth(year, month) {
	return civilDate(year, month + 1, 0).getDate();
}
function isLeapYear(year) {
	return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
/** 29/02 só existe em ano bissexto. Nos demais, a data observada é 28/02. */
function birthdayIso(iso, year) {
	const monthDay = iso.slice(5);
	if (monthDay === "02-29" && !isLeapYear(year)) return `${year}-02-28`;
	return `${year}-${monthDay}`;
}
function isEveryNMonths(start, date, every) {
	const diff = (date.getFullYear() - start.getFullYear()) * 12 + (date.getMonth() - start.getMonth());
	if (diff < 0 || diff % every !== 0) return false;
	const day = Math.min(start.getDate(), lastDayOfMonth(date.getFullYear(), date.getMonth()));
	return date.getDate() === day;
}
function isUtilDay(date) {
	const day = date.getDay();
	return day !== 0 && day !== 6;
}
function nationalOffIsos(year) {
	return new Set(fallbackHolidays(year).filter((event) => event.holidayKind === "national").map((event) => event.iso));
}
function offAround(year) {
	return /* @__PURE__ */ new Set([
		...nationalOffIsos(year - 1),
		...nationalOffIsos(year),
		...nationalOffIsos(year + 1)
	]);
}
function mondayOf(date) {
	const start = civilDate(date.getFullYear(), date.getMonth(), date.getDate());
	const weekDay = start.getDay();
	start.setDate(start.getDate() - (weekDay === 0 ? 6 : weekDay - 1));
	return start;
}
function collectDays(start, count, util, off) {
	const days = [];
	for (let i = 0; i < count; i += 1) {
		const date = civilDate(start.getFullYear(), start.getMonth(), start.getDate() + i);
		const iso = toIso(date);
		if (util && (!isUtilDay(date) || off.has(iso))) continue;
		days.push(iso);
	}
	return days;
}
function yearLength(year) {
	return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 366 : 365;
}
function usesOrdinal(event) {
	if (!event.monthSide) return false;
	return event.kind === "semanal" || event.kind === "mensal" || event.kind === "semestral" || event.kind === "anual" || event.kind === "posicao";
}
function ordinalIso(event, inDate) {
	if (!event.monthSide) return null;
	const n = event.monthNth && event.monthNth > 0 ? event.monthNth : 1;
	const year = inDate.getFullYear();
	const off = event.monthUtil ? offAround(year) : /* @__PURE__ */ new Set();
	const util = Boolean(event.monthUtil);
	let days = [];
	if (event.kind === "semanal") days = collectDays(mondayOf(inDate), 7, util, off);
	else if (event.kind === "mensal" || event.kind === "posicao") {
		const month = inDate.getMonth();
		days = collectDays(civilDate(year, month, 1), lastDayOfMonth(year, month), util, off);
	} else if (event.kind === "semestral") {
		const startMonth = inDate.getMonth() < 6 ? 0 : 6;
		const start = civilDate(year, startMonth, 1);
		const end = civilDate(year, startMonth + 6, 0);
		days = collectDays(start, Math.round((end.getTime() - start.getTime()) / 864e5) + 1, util, off);
	} else if (event.kind === "anual") days = collectDays(civilDate(year, 0, 1), yearLength(year), util, off);
	else return null;
	const index = event.monthSide === "ultimos" ? days.length - n : n - 1;
	if (index < 0 || index >= days.length) return null;
	return days[index];
}
function shiftByKind(date, event) {
	if (event.kind === "semanal") return civilDate(date.getFullYear(), date.getMonth(), date.getDate() + 7);
	if (event.kind === "personalizado") {
		const step = event.everyDays && event.everyDays > 0 ? event.everyDays : 1;
		return civilDate(date.getFullYear(), date.getMonth(), date.getDate() + step);
	}
	const months = event.kind === "semestral" ? 6 : event.kind === "anual" ? 12 : 1;
	const day = date.getDate();
	const next = civilDate(date.getFullYear(), date.getMonth() + months, 1);
	next.setDate(Math.min(day, lastDayOfMonth(next.getFullYear(), next.getMonth())));
	return next;
}
function postponeIso(event, from) {
	const date = fromIso(from);
	if (!event.kind) {
		date.setDate(date.getDate() + 1);
		return toIso(date);
	}
	const shifted = shiftByKind(date, event);
	if (usesOrdinal(event)) return ordinalIso(event, shifted) ?? toIso(shifted);
	return toIso(shifted);
}
function intervalFollow(event, from, year, month) {
	if (!event.kind) return {
		rest: [],
		hop: null
	};
	const monthEnd = toIso(civilDate(year, month + 1, 0));
	const rest = [];
	let cursor = from;
	for (let i = 0; i < 40; i += 1) {
		const next = postponeIso(event, cursor);
		if (!next || next <= cursor) return {
			rest,
			hop: null
		};
		if (next > monthEnd) return {
			rest,
			hop: next
		};
		rest.push(next);
		cursor = next;
	}
	const hop = postponeIso(event, cursor);
	return {
		rest,
		hop: hop && hop > cursor ? hop : null
	};
}
function advanceKind(event, iso, steps) {
	let cursor = iso;
	for (let i = 0; i < steps; i += 1) {
		const next = postponeIso(event, cursor);
		if (!next || next <= cursor) return cursor;
		cursor = next;
	}
	return cursor;
}
function freeNear(iso, step, blocked) {
	let cursor = iso;
	for (let i = 0; i < 21; i += 1) {
		const date = fromIso(cursor);
		date.setDate(date.getDate() + step);
		cursor = toIso(date);
		if (!blocked.has(cursor)) return cursor;
	}
	return cursor;
}
/** Datas do intervalo depois da regra de feriado. Ignorar devolve vazio: a série normal fica. */
function resolvedMarks(event, blocked, until) {
	const rule = event.intervalRule ?? "ignorar";
	if (!event.kind || rule === "ignorar") return [];
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	let cursor = event.iso;
	let delay = 0;
	for (let guard = 0; guard < 8e3 && cursor; guard += 1) {
		let placed = delay > 0 ? advanceKind(event, cursor, delay) : cursor;
		if (blocked.has(placed)) {
			if (rule === "adiar") {
				delay += 1;
				placed = advanceKind(event, cursor, delay);
				let extra = 0;
				while (blocked.has(placed) && extra < 30) {
					delay += 1;
					extra += 1;
					placed = advanceKind(event, cursor, delay);
				}
				if (!blocked.has(placed)) push(placed);
			} else if (rule === "preceder") push(freeNear(placed, -1, blocked));
			else if (rule === "proceder") push(freeNear(placed, 1, blocked));
		} else push(placed);
		if (cursor > until) break;
		const next = postponeIso(event, cursor);
		if (!next || next <= cursor) break;
		cursor = next;
	}
	return out;
	function push(iso) {
		if (seen.has(iso)) return;
		seen.add(iso);
		out.push(iso);
	}
}
function followResolved(event, blocked, anchor, year, month) {
	if (!event.kind || !event.intervalRule || event.intervalRule === "ignorar") return intervalFollow(event, anchor, year, month);
	const monthEnd = toIso(civilDate(year, month + 1, 0));
	const later = resolvedMarks(event, blocked, toIso(civilDate(year, month + 2, 21))).filter((iso) => iso > anchor);
	return {
		rest: later.filter((iso) => iso <= monthEnd),
		hop: later.find((iso) => iso > monthEnd) ?? null
	};
}
function eventMatchesIso(event, iso) {
	if (event.source === "birthday") {
		const year = Number(iso.slice(0, 4));
		const born = Number(event.iso.slice(0, 4));
		if (!Number.isFinite(year) || !Number.isFinite(born) || year < born) return false;
		return birthdayIso(event.iso, year) === iso;
	}
	if (event.source === "benefit") return event.iso === iso;
	if (usesOrdinal(event)) {
		if (iso < event.iso) return false;
		return ordinalIso(event, fromIso(iso)) === iso;
	}
	if (event.iso === iso) return true;
	if (iso < event.iso) return false;
	if (!event.kind) return false;
	const start = fromIso(event.iso);
	const date = fromIso(iso);
	if (event.kind === "semanal") return date.getDay() === start.getDay();
	if (event.kind === "mensal") return isEveryNMonths(start, date, 1);
	if (event.kind === "semestral") return isEveryNMonths(start, date, 6);
	if (event.kind === "anual") return isEveryNMonths(start, date, 12);
	if (event.kind === "personalizado") {
		const step = event.everyDays ?? 0;
		if (step < 1) return false;
		const diff = Math.round((date.getTime() - start.getTime()) / 864e5);
		return diff >= 0 && diff % step === 0;
	}
	return false;
}
function occurrenceInMonth(event, year, month) {
	if (event.source === "birthday") {
		const born = Number(event.iso.slice(0, 4));
		if (!Number.isFinite(born) || year < born) return null;
		const iso = birthdayIso(event.iso, year);
		return Number(iso.slice(5, 7)) === month + 1 ? iso : null;
	}
	if (usesOrdinal(event)) {
		const last = lastDayOfMonth(year, month);
		for (let day = 1; day <= last; day += 1) {
			const iso = toIso(civilDate(year, month, day));
			if (eventMatchesIso(event, iso)) return iso;
		}
		return null;
	}
	if (event.kind === "semanal") {
		const start = fromIso(event.iso);
		if (start.getFullYear() === year && start.getMonth() === month && eventMatchesIso(event, event.iso)) return event.iso;
		const last = lastDayOfMonth(year, month);
		for (let day = 1; day <= last; day += 1) {
			const iso = toIso(civilDate(year, month, day));
			if (eventMatchesIso(event, iso)) return iso;
		}
		return null;
	}
	const start = fromIso(event.iso);
	const iso = toIso(civilDate(year, month, Math.min(start.getDate(), lastDayOfMonth(year, month))));
	return eventMatchesIso(event, iso) ? iso : null;
}
function isOffDayHoliday(event) {
	if (event.source !== "holiday") return false;
	if (facultativeName(event.title) || event.holidayKind === "facultative") return false;
	return event.holidayKind === "national" || event.holidayKind === "municipal" || event.holidayKind === void 0;
}
function isCommemorative(event) {
	return event.source === "holiday" && (event.holidayKind === "commemorative" || isEasterHoliday(event));
}
function isEasterHoliday(event) {
	const n = foldName(event.title);
	if (n.includes("pascoa") || n.includes("ressurreicao") || n.includes("easter") && !n.includes("friday")) return true;
	if (event.source !== "holiday") return false;
	return toIso(easterDate(fromIso(event.iso).getFullYear())) === event.iso;
}
function isFacultative(event) {
	return event.source === "holiday" && (event.holidayKind === "facultative" || facultativeName(event.title));
}
function isNational(event) {
	if (event.source !== "holiday") return false;
	if (isFacultative(event) || isCommemorative(event) || isElection(event) || event.holidayKind === "enem" || event.holidayKind === "season" || event.holidayKind === "lunar") return false;
	if (event.holidayKind === "municipal") return false;
	return event.holidayKind === "national" || event.holidayKind === void 0;
}
function isElection(event) {
	return event.source === "holiday" && event.holidayKind === "election";
}
function isEnem(event) {
	return event.source === "holiday" && event.holidayKind === "enem";
}
function officeHolidayLabel(event) {
	if (event.source !== "holiday") return null;
	if (isFacultative(event) || isCommemorative(event) || isElection(event) || event.holidayKind === "enem" || event.holidayKind === "season" || event.holidayKind === "lunar") return null;
	if (event.holidayKind === "municipal") return "Feriado Municipal";
	if (event.holidayKind === "national" || event.holidayKind === void 0) return "Feriado Nacional";
	return null;
}
function isIpva(event) {
	return event.source === "ipva";
}
function isPayment(event) {
	return event.source === "benefit" || event.source === "pis" || event.source === "irpf" || event.source === "fgts" || event.source === "bolsa" || event.source === "gas";
}
function isLicenca(event) {
	return event.source === "licenca";
}
function isBill(event) {
	return event.source === "bill";
}
function isBoleto(event) {
	return event.source === "boleto";
}
function isAgendaMark(event) {
	return event.source === "local" || event.source === "google";
}
/** Traço na grade: só a data (e o intervalo, se houver). Duração nunca pinta dia extra. */
function eventMarksGrid(event, iso) {
	if (!isAgendaMark(event)) return false;
	return eventMatchesIso(event, iso);
}
function isOneShotEvent(event) {
	if (event.source === "birthday" || event.source === "benefit" || event.source === "holiday" || event.source === "bill" || event.source === "boleto" || event.source === "irpf" || event.source === "pis" || event.source === "ipva" || event.source === "fgts" || event.source === "bolsa" || event.source === "gas" || event.source === "licenca") return false;
	return !event.kind;
}
function timeToMinutes(time) {
	if (!time) return 0;
	const nums = time.match(/\d+/g);
	if (!nums?.length) return 0;
	const hours = Number(nums[0]);
	const minutes = nums[1] !== void 0 ? Number(nums[1]) : 0;
	if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0;
	return Math.max(0, hours) * 60 + Math.max(0, minutes);
}
function minutesToTime(mins) {
	if (mins <= 0) return "";
	const hours = Math.floor(mins / 60);
	const minutes = mins % 60;
	if (!minutes) return `${hours}  h`;
	return `${hours}  h ${minutes} min`;
}
function eventStartAt(event) {
	const date = fromIso(event.iso);
	if (event.time) {
		const [hours, minutes] = event.time.split(":").map(Number);
		if (Number.isFinite(hours) && Number.isFinite(minutes)) date.setHours(hours, minutes, 0, 0);
	}
	return date;
}
function eventEndAt(event) {
	const days = event.durationDays && event.durationDays > 0 ? event.durationDays : 0;
	const mins = event.durationMinutes && event.durationMinutes > 0 ? event.durationMinutes : 0;
	if (!days && !mins) {
		const end = fromIso(event.iso);
		end.setDate(end.getDate() + 1);
		end.setHours(0, 0, 0, 0);
		return end;
	}
	if (days) {
		const end = fromIso(event.iso);
		end.setDate(end.getDate() + days);
		end.setHours(0, 0, 0, 0);
		if (mins) end.setMinutes(end.getMinutes() + mins);
		return end;
	}
	const end = eventStartAt(event);
	end.setMinutes(end.getMinutes() + mins);
	return end;
}
function lastVisibleIso(event) {
	const end = eventEndAt(event);
	if (end.getHours() === 0 && end.getMinutes() === 0 && end.getSeconds() === 0) return toIso(/* @__PURE__ */ new Date(end.getTime() - 1));
	return toIso(end);
}
function isDueForHistory(event, today, now = /* @__PURE__ */ new Date()) {
	if (event.source === "birthday") return false;
	if (event.source === "period") {
		const span = eventSpanIsos(event);
		return (span[span.length - 1] ?? event.iso) < today;
	}
	if (!isOneShotEvent(event)) return false;
	if (!event.durationDays && !event.durationMinutes) return event.iso < today;
	return eventEndAt(event).getTime() <= now.getTime();
}
function archiveEvent(event) {
	return event.notify ? {
		...event,
		notify: false
	} : event;
}
function eventTab(event) {
	if (event.source === "holiday") {
		if (event.holidayKind === "election" || event.holidayKind === "enem" || event.holidayKind === "season" || event.holidayKind === "lunar") return "destaques";
		return "holidays";
	}
	if (event.source === "birthday") return "birthdays";
	if (event.source === "benefit" || event.source === "bill" || event.source === "boleto" || event.source === "irpf" || event.source === "pis" || event.source === "ipva" || event.source === "fgts" || event.source === "bolsa" || event.source === "gas" || event.source === "licenca") return "finance";
	if (event.source === "local" || event.source === "google" || event.source === "period") return "agenda";
	return null;
}
function tabAllowsEvent(tabs, event) {
	const tab = eventTab(event);
	return tab ? tabs[tab] !== false : true;
}
function mergeEventsById(base, extra) {
	if (!extra.length) return base;
	const have = new Set(base.map((event) => event.id));
	const add = extra.filter((event) => !have.has(event.id));
	return add.length ? [...base, ...add] : base;
}
function cellLook(cell, selected, inPeriod, saturdayTint = false, sundayTint = false, holidayTint = true, today = "") {
	const off = holidayTint && cell.events.some(isOffDayHoliday);
	const commemorative = holidayTint && cell.events.some(isCommemorative);
	const facultative = holidayTint && cell.events.some(isFacultative);
	const election = holidayTint && cell.events.some(isElection);
	const enem = cell.events.some(isEnem);
	const season = cell.events.some((event) => event.holidayKind === "season");
	const lunar = cell.events.find((event) => event.holidayKind === "lunar" && !event.title.startsWith("Eclipse"));
	const eclipse = cell.events.some((event) => event.holidayKind === "lunar" && event.title.startsWith("Eclipse"));
	const payment = cell.events.some(isPayment);
	const bill = cell.events.some(isBill) || cell.events.some(isBoleto) || cell.events.some(isIpva) || cell.events.some(isLicenca);
	const overdue = Boolean(today) && bill && cell.iso < today;
	const birthday = cell.events.some((event) => event.source === "birthday");
	const dow = fromIso(cell.iso).getDay();
	const weekend = saturdayTint && dow === 6 || sundayTint && dow === 0;
	if (birthday) return {
		square: "birthday",
		num: selected ? "white" : "fg"
	};
	let square = "none";
	if (cell.isToday) square = "today";
	else if (overdue) square = "overdue";
	else if (election) square = "election";
	else if (off) square = "holiday";
	else if (inPeriod && cell.inMonth) square = "period";
	let num = "fg";
	if (payment) num = "pay";
	else if (bill) num = "bill";
	else if (enem) num = "enem";
	else if (season) num = "season";
	else if (eclipse) num = "eclipse";
	else if (lunar?.title === "Lua nova") num = "moon-new";
	else if (lunar?.title === "Quarto crescente") num = "moon-wax";
	else if (lunar?.title === "Lua cheia") num = "moon-full";
	else if (lunar?.title === "Quarto minguante") num = "moon-wane";
	else if (lunar) num = "lunar";
	else if (off) num = "holiday";
	else if (commemorative) num = "commemorative";
	else if (facultative) num = "holiday";
	else if (election) num = "election";
	else if (square === "period") num = "period";
	else if (weekend && cell.inMonth) num = "holiday";
	else if (cell.isToday) num = "today";
	if (selected && (square === "today" || square === "holiday" || square === "election")) num = "white";
	return {
		square,
		num
	};
}
function uniqueEvents(events) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const event of events) {
		const key = `${event.source}:${event.holidayKind ?? ""}:${event.iso}:${event.title}:${event.time ?? ""}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(event);
	}
	return out;
}
function buildMonthCells(view, today, events, weekStart = "sunday") {
	const year = view.getFullYear();
	const month = view.getMonth();
	const firstDow = civilDate(year, month, 1).getDay();
	const start = civilDate(year, month, 1 - (weekStart === "sunday" ? firstDow : (firstDow + 6) % 7));
	const cells = [];
	for (let i = 0; i < 42; i++) {
		const date = new Date(start);
		date.setDate(start.getDate() + i);
		const iso = toIso(date);
		const inMonth = date.getMonth() === month;
		cells.push({
			day: date.getDate(),
			inMonth,
			isToday: iso === today,
			iso,
			events: inMonth ? events.filter((event) => eventMatchesIso(event, iso)) : []
		});
	}
	if (cells.slice(35).every((cell) => !cell.inMonth)) return cells.slice(0, 35);
	return cells;
}
function newEventId() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function easterDate(year) {
	const a = year % 19;
	const b = Math.floor(year / 100);
	const c = year % 100;
	const d = Math.floor(b / 4);
	const e = b % 4;
	const f = Math.floor((b + 8) / 25);
	const g = Math.floor((b - f + 1) / 3);
	const h = (19 * a + b - d - g + 15) % 30;
	const i = Math.floor(c / 4);
	const k = c % 4;
	const l = (32 + 2 * e + 2 * i - h - k) % 7;
	const m = Math.floor((a + 11 * h + 22 * l) / 451);
	const month = Math.floor((h + l - 7 * m + 114) / 31);
	const day = (h + l - 7 * m + 114) % 31 + 1;
	return civilDate(year, month - 1, day);
}
function shiftDay(date, days) {
	return toIso(shiftDays(date, days));
}
function foldName(name) {
	return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}
var NATIONAL_AKA_RULES = [
	{
		test: (n) => n.includes("confraternizacao") || n.includes("fraternidade") || n.includes("ano novo") || n.includes("new year"),
		aka: "Ano Novo"
	},
	{
		test: (n) => n.includes("paixao") || n.includes("sexta") && n.includes("santa") || n.includes("good friday"),
		aka: "Paixão de Cristo"
	},
	{
		test: (n) => n.includes("pascoa") || n.includes("ressurreicao") || n.includes("easter"),
		aka: "Domingo da Ressurreição"
	},
	{
		test: (n) => n.includes("tiradentes") || n.includes("inconfidencia"),
		aka: "Dia da Inconfidência"
	},
	{
		test: (n) => n.includes("finados") || n.includes("dia dos mortos") || n.includes("all souls"),
		aka: "Dia dos Mortos"
	},
	{
		test: (n) => n.includes("natal") || n.includes("christmas") || n.includes("nascimento de cristo"),
		aka: "Nascimento de Cristo"
	},
	{
		test: (n) => n.includes("dia do trabalho") || n.includes("dia do trabalhador") || n.includes("1 de maio") || n.includes("1o de maio") || n.includes("labour") || n.includes("labor day"),
		aka: "Dia dos Trabalhadores"
	},
	{
		test: (n) => n.includes("independencia") || n.includes("dia da patria"),
		aka: "Dia da Pátria"
	},
	{
		test: (n) => n.includes("aparecida"),
		aka: "Padroeira do Brasil"
	},
	{
		test: (n) => n.includes("proclamacao") || n.includes("dia da republica"),
		aka: "Dia da República"
	},
	{
		test: (n) => n.includes("consciencia negra") || n.includes("zumbi"),
		aka: "Zumbi dos Palmares"
	}
];
function nationalAka(title) {
	const n = foldName(title);
	return NATIONAL_AKA_RULES.find((row) => row.test(n))?.aka ?? null;
}
/** Ano estimado em que a data começou a ser comemorada. Municipal fica de fora. */
var OBSERVANCE_YEAR = [
	{
		test: (n) => n.includes("vespera") && n.includes("natal"),
		year: 336
	},
	{
		test: (n) => n.includes("vespera") && (n.includes("ano") || n.includes("reveillon")),
		year: 1582
	},
	{
		test: (n) => n.includes("confraternizacao") || n.includes("ano novo") || n.includes("new year"),
		year: 1949
	},
	{
		test: (n) => n.includes("paixao") || n.includes("sexta") && n.includes("santa") || n.includes("good friday"),
		year: 325
	},
	{
		test: (n) => n.includes("tiradentes") || n.includes("inconfidencia"),
		year: 1890
	},
	{
		test: (n) => n.includes("trabalho") || n.includes("trabalhador"),
		year: 1924
	},
	{
		test: (n) => n.includes("independencia") || n.includes("patria"),
		year: 1822
	},
	{
		test: (n) => n.includes("aparecida") || n.includes("padroeira"),
		year: 1717
	},
	{
		test: (n) => n.includes("finados") || n.includes("dia dos mortos"),
		year: 998
	},
	{
		test: (n) => n.includes("proclamacao") || n.includes("republica"),
		year: 1889
	},
	{
		test: (n) => n.includes("consciencia negra") || n.includes("zumbi"),
		year: 1971
	},
	{
		test: (n) => n.includes("natal") || n.includes("nascimento de cristo") || n.includes("christmas"),
		year: 336
	},
	{
		test: (n) => n.includes("carnaval") || n.includes("momo"),
		year: 1723
	},
	{
		test: (n) => n.includes("cinzas") || n.includes("quaresma"),
		year: 1091
	},
	{
		test: (n) => n.includes("corpus"),
		year: 1264
	},
	{
		test: (n) => n.includes("servidor") || n.includes("funcionario publico"),
		year: 1943
	},
	{
		test: (n) => n.includes("reis") || n.includes("epifania"),
		year: 361
	},
	{
		test: (n) => n.includes("mulher"),
		year: 1911
	},
	{
		test: (n) => n.includes("mentira") || n.includes("bobos") || n.includes("april fool"),
		year: 1582
	},
	{
		test: (n) => n.includes("pascoa") || n.includes("ressurreicao") || n.includes("easter"),
		year: 325
	},
	{
		test: (n) => n.includes("indigena") || n.includes("indio"),
		year: 1943
	},
	{
		test: (n) => n.includes("descobrimento") || n.includes("cabral"),
		year: 1500
	},
	{
		test: (n) => n.includes("maes") || n.includes("maternidade"),
		year: 1932
	},
	{
		test: (n) => n.includes("abolicao") || n.includes("escrav"),
		year: 1888
	},
	{
		test: (n) => n.includes("namorado") || n.includes("dia do amor"),
		year: 1949
	},
	{
		test: (n) => n.includes("santo antonio") || n.includes("casamenteiro"),
		year: 1232
	},
	{
		test: (n) => n.includes("sao joao") || n.includes("joao batista"),
		year: 400
	},
	{
		test: (n) => n.includes("lgbt") || n.includes("orgulho"),
		year: 1970
	},
	{
		test: (n) => n.includes("sao pedro") || n.includes("pedro e paulo"),
		year: 258
	},
	{
		test: (n) => n.includes("paternidade") || n.includes(" dia dos pais") || n.endsWith("pais"),
		year: 1953
	},
	{
		test: (n) => n.includes("estudante") || n.includes("aluno"),
		year: 1827
	},
	{
		test: (n) => n.includes("folclore"),
		year: 1846
	},
	{
		test: (n) => n.includes("arvore"),
		year: 1965
	},
	{
		test: (n) => n.includes("crianca"),
		year: 1925
	},
	{
		test: (n) => n.includes("professor") || n.includes("mestre"),
		year: 1963
	},
	{
		test: (n) => n.includes("halloween") || n.includes("bruxas"),
		year: 835
	},
	{
		test: (n) => n.includes("festival da lua") || n.includes("meio-outono") || n.includes("meio outono"),
		year: 618
	},
	{
		test: (n) => n.includes("copa") || n.includes("brasil x"),
		year: 1930
	}
];
function observanceYear(title) {
	const n = foldName(title);
	return OBSERVANCE_YEAR.find((row) => row.test(n))?.year ?? null;
}
function observanceReached(title, year) {
	const start = observanceYear(title);
	return start == null || year >= start;
}
var FACULTATIVE_AKA_RULES = [
	{
		test: (n) => n.includes("carnaval") || n.includes("momo"),
		aka: "Folia de Momo"
	},
	{
		test: (n) => n.includes("cinzas"),
		aka: "Quaresma"
	},
	{
		test: (n) => n.includes("corpus"),
		aka: "Corpo de Cristo"
	},
	{
		test: (n) => n.includes("servidor") || n.includes("funcionario publico"),
		aka: "Dia do Funcionário Público"
	},
	{
		test: (n) => n.includes("vespera") && n.includes("natal"),
		aka: "Ceia"
	},
	{
		test: (n) => n.includes("vespera") && (n.includes("ano") || n.includes("reveillon")),
		aka: "Réveillon"
	}
];
function facultativeAka(title) {
	const n = foldName(title);
	return FACULTATIVE_AKA_RULES.find((row) => row.test(n))?.aka ?? null;
}
var COMMEMORATIVE_AKA_RULES = [
	{
		test: (n) => n.includes("reis") || n.includes("epifania"),
		aka: "Epifania do Senhor"
	},
	{
		test: (n) => n.includes("mulher"),
		aka: "Dia da Mulher"
	},
	{
		test: (n) => n.includes("mentira") || n.includes("bobos") || n.includes("april fool"),
		aka: "Dia dos Bobos"
	},
	{
		test: (n) => n.includes("indigena") || n.includes("indio") || n.includes("indios"),
		aka: "Dia do Índio"
	},
	{
		test: (n) => n.includes("descobrimento") || n.includes("cabral"),
		aka: "Chegada de Pedro Álvares Cabral"
	},
	{
		test: (n) => n.includes("abolicao") || n.includes("escrav"),
		aka: "Fim da Escravidão"
	},
	{
		test: (n) => n.includes("namorado") || n.includes("dia do amor"),
		aka: "Dia do Amor"
	},
	{
		test: (n) => n.includes("maes") || n.includes("maternidade"),
		aka: "Dia da Maternidade"
	},
	{
		test: (n) => n.includes("crianca"),
		aka: "Dia Mundial das Crianças"
	},
	{
		test: (n) => n.includes("lgbt") || n.includes("orgulho"),
		aka: "Dia Internacional do Orgulho LGBTQIA+"
	},
	{
		test: (n) => n.includes("santo antonio") || n.includes("casamenteiro"),
		aka: "Festa do Santo Casamenteiro"
	},
	{
		test: (n) => n.includes("sao joao") || n.includes("joao batista"),
		aka: "Nascimento de São João Batista"
	},
	{
		test: (n) => n.includes("sao pedro") || n.includes("pedro e paulo"),
		aka: "Festa de São Pedro e Paulo"
	},
	{
		test: (n) => n.includes("pais") || n.includes("paternidade"),
		aka: "Dia da Paternidade"
	},
	{
		test: (n) => n.includes("estudante") || n.includes("aluno"),
		aka: "Dia do Aluno"
	},
	{
		test: (n) => n.includes("folclore"),
		aka: "Dia Nacional do Folclore"
	},
	{
		test: (n) => n.includes("arvore"),
		aka: "Dia Nacional da Árvore"
	},
	{
		test: (n) => n.includes("professor") || n.includes("mestre"),
		aka: "Dia do Mestre"
	},
	{
		test: (n) => n.includes("halloween") || n.includes("bruxas"),
		aka: "Dia das Bruxas"
	},
	{
		test: (n) => n.includes("festival da lua") || n.includes("meio-outono") || n.includes("meio outono"),
		aka: "Festival do Meio-Outono"
	}
];
function commemorativeAka(title) {
	const n = foldName(title);
	return COMMEMORATIVE_AKA_RULES.find((row) => row.test(n))?.aka ?? null;
}
function facultativeName(name) {
	const n = foldName(name);
	return n.includes("carnaval") || n.includes("corpus christi") || n.includes("corpus-christi") || n.includes("cinzas") || n.includes("vespera de natal") || n.includes("vespera do natal") || n.includes("vespera de ano") || n.includes("servidor publico");
}
var fallbackHolidayCache = /* @__PURE__ */ new Map();
function fallbackHolidays(year) {
	const hit = fallbackHolidayCache.get(year);
	if (hit) return hit;
	const easter = easterDate(year);
	const events = [
		{
			iso: `${year}-01-01`,
			title: "Confraternização Universal",
			holidayKind: "national"
		},
		{
			iso: shiftDay(easter, -48),
			title: "Carnaval",
			holidayKind: "facultative"
		},
		{
			iso: shiftDay(easter, -47),
			title: "Carnaval",
			holidayKind: "facultative"
		},
		{
			iso: shiftDay(easter, -46),
			title: "Quarta-feira de Cinzas",
			holidayKind: "facultative"
		},
		{
			iso: shiftDay(easter, -2),
			title: "Sexta-feira Santa",
			holidayKind: "national"
		},
		{
			iso: `${year}-04-21`,
			title: "Tiradentes",
			holidayKind: "national"
		},
		{
			iso: `${year}-05-01`,
			title: "Dia do Trabalho",
			holidayKind: "national"
		},
		{
			iso: shiftDay(easter, 60),
			title: "Corpus Christi",
			holidayKind: "facultative"
		},
		{
			iso: `${year}-09-07`,
			title: "Independência do Brasil",
			holidayKind: "national"
		},
		{
			iso: `${year}-10-12`,
			title: "Nossa Senhora Aparecida",
			holidayKind: "national"
		},
		{
			iso: `${year}-10-28`,
			title: "Dia do Servidor Público",
			holidayKind: "facultative"
		},
		{
			iso: `${year}-11-02`,
			title: "Finados",
			holidayKind: "national"
		},
		{
			iso: `${year}-11-15`,
			title: "Proclamação da República",
			holidayKind: "national"
		},
		{
			iso: `${year}-11-20`,
			title: "Dia da Consciência Negra",
			holidayKind: "national"
		},
		{
			iso: `${year}-12-24`,
			title: "Véspera de Natal",
			holidayKind: "facultative"
		},
		{
			iso: `${year}-12-25`,
			title: "Natal",
			holidayKind: "national"
		},
		{
			iso: `${year}-12-31`,
			title: "Véspera de Ano-Novo",
			holidayKind: "facultative"
		}
	].filter((row) => observanceReached(row.title, year)).map((row) => ({
		id: `holiday-${row.iso}-${row.title}`,
		iso: row.iso,
		title: row.title,
		time: "",
		source: "holiday",
		holidayKind: row.holidayKind
	}));
	fallbackHolidayCache.set(year, events);
	return events;
}
function readHolidayStore() {
	try {
		const raw = readHolidaysRaw();
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}
function mergeHolidayCatalog(events, year) {
	const have = new Set(events.map((event) => event.iso));
	const extra = fallbackHolidays(year).filter((row) => !have.has(row.iso));
	return extra.length ? [...events, ...extra] : events;
}
function officialHolidayTitle(event) {
	if (event.source === "holiday" && event.iso.slice(5) === "01-01") return "Confraternização Universal";
	if (event.source === "holiday" && event.iso.slice(5) === "12-25") return "Natal";
	const n = foldName(event.title);
	if (n.includes("paixao") || n.includes("sexta") && n.includes("santa") || n.includes("good friday")) return "Sexta-feira Santa";
	if (n.includes("dia do trabalho") || n.includes("dia do trabalhador") || n.includes("labour") || n.includes("labor day")) return "Dia do Trabalho";
	if (n.includes("finados") || n.includes("dia dos mortos") || n.includes("all souls")) return "Finados";
	if (n.includes("proclamacao") || n.includes("dia da republica")) return "Proclamação da República";
	if (n.includes("consciencia negra") || n.includes("zumbi")) return "Dia da Consciência Negra";
	return event.title;
}
function holidaysForYears(store, years) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const year of years) {
		const events = mergeHolidayCatalog(store[String(year)]?.events ?? fallbackHolidays(year), year);
		for (const event of events) {
			const next = {
				...event,
				title: officialHolidayTitle(event)
			};
			if (isEasterHoliday(next)) continue;
			if (!observanceReached(next.title, year)) continue;
			const key = `${next.iso}:${next.title}`;
			if (seen.has(key)) continue;
			seen.add(key);
			out.push(next);
		}
	}
	return out;
}
function parseGoogleEvents(data) {
	const root = data;
	const list = Array.isArray(root) ? root : Array.isArray(root?.items) ? root.items : Array.isArray(root?.events) ? root.events : [];
	const out = [];
	for (const item of list) {
		const row = item;
		const start = row.start;
		const isoRaw = typeof start === "string" ? start : start?.dateTime || start?.date || "";
		if (!isoRaw) continue;
		const iso = isoRaw.slice(0, 10);
		const time = isoRaw.length > 10 ? new Intl.DateTimeFormat("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
			timeZone: "America/Sao_Paulo"
		}).format(new Date(isoRaw)) : "";
		const title = (row.summary || row.title || "Evento").trim();
		out.push({
			id: `google-${row.id ?? iso + title}`,
			iso,
			title,
			time,
			source: "google"
		});
	}
	return out;
}
function firstWeekday(year, month, weekday) {
	return toIso(civilDate(year, month, 1 + (weekday - civilDate(year, month, 1).getDay() + 7) % 7));
}
function lastWeekday(year, month, weekday) {
	const last = civilDate(year, month + 1, 0);
	const shift = (last.getDay() - weekday + 7) % 7;
	return toIso(civilDate(year, month, last.getDate() - shift));
}
function isElectionYear(year) {
	return year >= 1 && year <= 9999 && year % 2 === 0;
}
/** General (president, congress, governors) vs mayors / city council. */
function electionRaceLabel(year) {
	return year % 4 === 2 ? "Eleição Federal" : "Eleição Municipal";
}
function firstRoundIso(year) {
	return firstWeekday(year, 9, 0);
}
function secondRoundIso(year) {
	return lastWeekday(year, 9, 0);
}
/** Presidential races that already had a confirmed second round. */
var KNOWN_SECOND_ROUND_FEDERAL = /* @__PURE__ */ new Set([
	2002,
	2006,
	2010,
	2014,
	2018,
	2022
]);
function row(iso, title) {
	return {
		id: `election-${iso}-${title}`,
		iso,
		title,
		time: "",
		source: "holiday",
		holidayKind: "election"
	};
}
function electionDates(year, secondRound = false) {
	if (!isElectionYear(year)) return [];
	const first = firstRoundIso(year);
	const second = secondRoundIso(year);
	const out = [row(first, "1º turno")];
	if (secondRound && second !== first) out.push(row(second, "2º turno"));
	return out;
}
/** Caixa: início e prazo do saque-aniversário (mês de nascimento 1–12). */
var CONFIRMED_FGTS = { 2026: {
	1: {
		iso: "2026-01-02",
		until: "2026-03-31"
	},
	2: {
		iso: "2026-02-02",
		until: "2026-04-30"
	},
	3: {
		iso: "2026-03-02",
		until: "2026-05-29"
	},
	4: {
		iso: "2026-04-01",
		until: "2026-06-30"
	},
	5: {
		iso: "2026-05-04",
		until: "2026-07-31"
	},
	6: {
		iso: "2026-06-01",
		until: "2026-08-31"
	},
	7: {
		iso: "2026-07-01",
		until: "2026-09-30"
	},
	8: {
		iso: "2026-08-03",
		until: "2026-10-30"
	},
	9: {
		iso: "2026-09-01",
		until: "2026-11-30"
	},
	10: {
		iso: "2026-10-01",
		until: "2026-12-30"
	},
	11: {
		iso: "2026-11-02",
		until: "2027-01-29"
	},
	12: {
		iso: "2026-12-01",
		until: "2027-02-26"
	}
} };
function offDays(year) {
	return new Set(fallbackHolidays(year).filter((event) => isNational(event) || event.holidayKind === "facultative").map((event) => event.iso));
}
function isUtil(iso, off) {
	const dow = fromDow(iso);
	return dow !== 0 && dow !== 6 && !off.has(iso);
}
function fromDow(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return civilDate(y, m - 1, d).getDay();
}
function firstUtil(year, monthIndex) {
	const off = /* @__PURE__ */ new Set([...offDays(year), ...offDays(year + 1)]);
	const cursor = civilDate(year, monthIndex, 1);
	for (let i = 0; i < 12; i++) {
		const iso = toIso(cursor);
		if (isUtil(iso, off)) return iso;
		cursor.setDate(cursor.getDate() + 1);
	}
	return toIso(civilDate(year, monthIndex, 1));
}
function lastUtil(year, monthIndex) {
	const off = /* @__PURE__ */ new Set([
		...offDays(year),
		...offDays(year + 1),
		...offDays(year - 1)
	]);
	const cursor = civilDate(year, monthIndex + 1, 0);
	for (let i = 0; i < 12; i++) {
		const iso = toIso(cursor);
		if (isUtil(iso, off)) return iso;
		cursor.setDate(cursor.getDate() - 1);
	}
	return toIso(civilDate(year, monthIndex + 1, 0));
}
/** Prazo: último dia útil do mês de nascimento + 2. */
function projectedUntil(year, birthMonth) {
	const start = civilDate(year, birthMonth - 1, 1);
	start.setMonth(start.getMonth() + 2);
	return lastUtil(start.getFullYear(), start.getMonth());
}
function fgtsWindow(year, birthMonth) {
	const known = CONFIRMED_FGTS[year]?.[birthMonth];
	if (known) return {
		...known,
		confirmed: true
	};
	return {
		iso: firstUtil(year, birthMonth - 1),
		until: projectedUntil(year, birthMonth),
		confirmed: false
	};
}
var PT_MONTHS$1 = [
	"janeiro",
	"fevereiro",
	"marco",
	"abril",
	"maio",
	"junho",
	"julho",
	"agosto",
	"setembro",
	"outubro",
	"novembro",
	"dezembro"
];
function fold$1(text) {
	return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function readDate(chunk, fallbackYear) {
	const iso = chunk.match(/(\d{4})-(\d{2})-(\d{2})/);
	if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
	const slash = chunk.match(/(\d{1,2})\s*[\/\-]\s*(\d{1,2})(?:\s*[\/\-]\s*(\d{2,4}))?/);
	if (slash) return toIso(civilDate(slash[3] ? slash[3].length === 2 ? 2e3 + Number(slash[3]) : Number(slash[3]) : fallbackYear, Number(slash[2]) - 1, Number(slash[1])));
	const named = chunk.match(/(\d{1,2})\s+de\s+(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?:\s+de\s+(\d{4}))?/);
	if (!named) return null;
	return toIso(civilDate(named[3] ? Number(named[3]) : fallbackYear, PT_MONTHS$1.indexOf(named[2]), Number(named[1])));
}
function parseFgtsCalendar(text, year) {
	const body = fold$1(text);
	const found = {};
	const dateRe = /(\d{4}-\d{2}-\d{2}|\d{1,2}\s+de\s+(?:janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?:\s+de\s+\d{4})?|\d{1,2}\s*[\/\-]\s*\d{1,2}(?:\s*[\/\-]\s*\d{2,4})?)/g;
	for (let i = 0; i < 12; i++) {
		const label = PT_MONTHS$1[i];
		const idx = body.indexOf(` ${label}`) >= 0 ? body.indexOf(` ${label}`) : body.indexOf(label);
		if (idx < 0) continue;
		const window = body.slice(idx, idx + 320);
		const hits = [];
		for (const row of window.matchAll(dateRe)) {
			const iso = readDate(row[0], year);
			if (iso && !hits.includes(iso)) hits.push(iso);
			if (hits.length >= 2) break;
		}
		if (!hits.length) continue;
		found[i + 1] = {
			iso: hits[0],
			until: hits[1] ?? projectedUntil(year, i + 1)
		};
	}
	return Object.keys(found).length >= 8 ? found : null;
}
function fgtsEvent(year, birthMonth) {
	const { iso, confirmed } = fgtsWindow(year, birthMonth);
	return {
		id: `fgts-${year}`,
		iso,
		title: "Saque-aniversário FGTS",
		time: "",
		source: "fgts",
		kind: "anual",
		confirmed,
		monthNth: birthMonth
	};
}
/** Exercício (ano da entrega) → prazo oficial já publicado. */
var CONFIRMED_IRPF = {
	2018: "2018-04-30",
	2019: "2019-04-30",
	2020: "2020-06-30",
	2021: "2021-05-31",
	2022: "2022-05-31",
	2023: "2023-05-31",
	2024: "2024-05-31",
	2025: "2025-05-30",
	2026: "2026-05-29"
};
/** Lotes oficiais de restituição (data do crédito). */
var CONFIRMED_IRPF_LOTS = {
	2025: [
		"2025-05-30",
		"2025-06-30",
		"2025-07-31",
		"2025-08-29",
		"2025-09-30"
	],
	2026: [
		"2026-05-29",
		"2026-06-30",
		"2026-07-31",
		"2026-08-28"
	]
};
var MONTHS_PT = {
	janeiro: 0,
	fevereiro: 1,
	marco: 2,
	março: 2,
	abril: 3,
	maio: 4,
	junho: 5,
	julho: 6,
	agosto: 7,
	setembro: 8,
	outubro: 9,
	novembro: 10,
	dezembro: 11
};
function lastUtilOfMonth(year, monthIndex) {
	const off = new Set(fallbackHolidays(year).filter((event) => isNational(event) || event.holidayKind === "facultative").map((event) => event.iso));
	const cursor = civilDate(year, monthIndex + 1, 0);
	while (cursor.getMonth() === monthIndex) {
		const dow = cursor.getDay();
		const iso = toIso(cursor);
		if (dow !== 0 && dow !== 6 && !off.has(iso)) return iso;
		cursor.setDate(cursor.getDate() - 1);
	}
	return toIso(civilDate(year, monthIndex + 1, 0));
}
function projectedIrpfIso(year) {
	return lastUtilOfMonth(year, 4);
}
function projectedIrpfLots(year, deadlineIso) {
	const known = CONFIRMED_IRPF_LOTS[year];
	if (known?.length) return known.map((iso, i) => ({
		n: i + 1,
		iso,
		confirmed: true
	}));
	return [
		4,
		5,
		6,
		7
	].map((month, i) => {
		const iso = i === 0 ? deadlineIso : lastUtilOfMonth(year, month);
		return {
			n: i + 1,
			iso,
			confirmed: false
		};
	});
}
function parseIrpfDeadline(text, year) {
	const fold = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	const re = new RegExp(`(\\d{1,2})\\s+de\\s+(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\\s+de\\s+${year}`, "g");
	let hit = null;
	let match;
	while (match = re.exec(fold)) {
		const day = Number(match[1]);
		const month = MONTHS_PT[match[2]];
		if (!Number.isFinite(day) || month === void 0 || month < 4) continue;
		hit = toIso(civilDate(year, month, day));
	}
	return hit;
}
function parseIrpfLots(text, year) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	const re = new RegExp(`(\\d{1,2})\\s*[\\/.-]\\s*(\\d{1,2})\\s*[\\/.-]\\s*${year}`, "g");
	let match;
	while (match = re.exec(text)) {
		const day = Number(match[1]);
		const month = Number(match[2]);
		if (month < 5 || month > 9 || day < 1 || day > 31) continue;
		const iso = toIso(civilDate(year, month - 1, day));
		if (seen.has(iso)) continue;
		seen.add(iso);
		out.push(iso);
	}
	return out.sort();
}
function irpfEvent(year, iso, confirmed) {
	return {
		id: `irpf-${year}`,
		iso,
		title: "Declaração de Imposto de Renda",
		time: "",
		source: "irpf",
		confirmed
	};
}
function lotLabel(n) {
	return `(${n}º lote)`;
}
/** Mês de nascimento (1–12) → ISO oficial já publicado. */
var CONFIRMED_PIS = { 2026: {
	1: "2026-02-16",
	2: "2026-03-16",
	3: "2026-04-15",
	4: "2026-04-15",
	5: "2026-05-15",
	6: "2026-05-15",
	7: "2026-06-15",
	8: "2026-06-15",
	9: "2026-07-15",
	10: "2026-07-15",
	11: "2026-08-17",
	12: "2026-08-17"
} };
function payMonthIndex(birthMonth) {
	if (birthMonth <= 2) return birthMonth;
	if (birthMonth <= 4) return 3;
	if (birthMonth <= 6) return 4;
	if (birthMonth <= 8) return 5;
	if (birthMonth <= 10) return 6;
	return 7;
}
function nextUtil(year, monthIndex, day) {
	const off = new Set(fallbackHolidays(year).filter((event) => isNational(event) || event.holidayKind === "facultative").map((event) => event.iso));
	const cursor = civilDate(year, monthIndex, day);
	for (let i = 0; i < 10; i++) {
		const dow = cursor.getDay();
		const iso = toIso(cursor);
		if (dow !== 0 && dow !== 6 && !off.has(iso)) return iso;
		cursor.setDate(cursor.getDate() + 1);
	}
	return toIso(civilDate(year, monthIndex, day));
}
function projectedPisIso(year, birthMonth) {
	return nextUtil(year, payMonthIndex(birthMonth), 15);
}
var PT_MONTHS = [
	"janeiro",
	"fevereiro",
	"marco",
	"abril",
	"maio",
	"junho",
	"julho",
	"agosto",
	"setembro",
	"outubro",
	"novembro",
	"dezembro"
];
function fold(text) {
	return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function isoFromParts$1(year, monthIndex, day) {
	if (monthIndex < 0 || monthIndex > 11 || day < 1 || day > 31) return null;
	return toIso(civilDate(year, monthIndex, day));
}
/** Extracts birth-month → pay ISO from a Codefat/wiki page. */
function parsePisCalendar(text, year) {
	const body = fold(text);
	const found = {};
	for (const [births, label] of [
		[[1], "janeiro"],
		[[2], "fevereiro"],
		[[3, 4], "marco"],
		[[5, 6], "maio"],
		[[7, 8], "julho"],
		[[9, 10], "setembro"],
		[[11, 12], "novembro"]
	]) {
		const idx = body.indexOf(label);
		if (idx < 0) continue;
		const window = body.slice(idx, idx + 220);
		const slash = window.match(/(\d{1,2})\s*[\/\-]\s*(\d{1,2})(?:\s*[\/\-]\s*(\d{2,4}))?/);
		const named = window.match(/(\d{1,2})\s+de\s+(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/);
		let iso = null;
		if (named) iso = isoFromParts$1(year, PT_MONTHS.indexOf(named[2]), Number(named[1]));
		else if (slash) iso = isoFromParts$1(year, Number(slash[2]) - 1, Number(slash[1]));
		if (!iso) continue;
		for (const birth of births) found[birth] = iso;
	}
	return Object.keys(found).length >= 6 ? found : null;
}
function standingPisMap(year) {
	const out = {};
	for (let month = 1; month <= 12; month++) out[month] = projectedPisIso(year, month);
	return out;
}
function pisIso(year, birthMonth) {
	const known = CONFIRMED_PIS[year]?.[birthMonth];
	if (known) return {
		iso: known,
		confirmed: true
	};
	/** Codefat (dez/2025): calendário fixo a partir de 2026, dia 15 (próximo útil se banco fechado). */
	if (year >= 2026) return {
		iso: projectedPisIso(year, birthMonth),
		confirmed: true
	};
	return {
		iso: projectedPisIso(year, birthMonth),
		confirmed: false
	};
}
function pisEvent(year, birthMonth) {
	const { iso, confirmed } = pisIso(year, birthMonth);
	return {
		id: `pis-${year}`,
		iso,
		title: "Abono PIS/Pasep",
		time: "",
		source: "pis",
		kind: "anual",
		confirmed,
		monthNth: birthMonth
	};
}
var DEG$1 = Math.PI / 180;
var PHASES = [
	"Lua nova",
	"Quarto crescente",
	"Lua cheia",
	"Quarto minguante"
];
function rad(deg) {
	return (deg % 360 + 360) % 360 * DEG$1;
}
/** Instante da fase (Meeus, cap. 49), preciso o bastante para o dia civil. */
function phaseInstant(k, phase) {
	const kk = k + phase / 4;
	const T = kk / 1236.85;
	const jde = 2451550.09766 + 29.530588861 * kk + 15437e-8 * T * T - 15e-8 * T ** 3 + 73e-11 * T ** 4;
	const E = 1 - .002516 * T - 74e-7 * T * T;
	const M = rad(2.5534 + 29.1053567 * kk);
	const Mp = rad(201.5643 + 385.81693528 * kk);
	const F = rad(160.7108 + 390.67050274 * kk);
	const Om = rad(124.7746 - 1.5637558 * kk);
	const s = Math.sin;
	const c = Math.cos;
	let corr;
	if (phase === 0 || phase === 2) corr = (phase === 0 ? -.4072 : -.40614) * s(Mp) + .17241 * E * s(M) + .01608 * s(2 * Mp) + .01039 * s(2 * F) + .00739 * E * s(Mp - M) - .00514 * E * s(Mp + M) + .00208 * E * E * s(2 * M) - .00111 * s(Mp - 2 * F) - 57e-5 * s(Mp + 2 * F) + 56e-5 * E * s(2 * Mp + M) - 42e-5 * s(3 * Mp) + 42e-5 * E * s(M + 2 * F) + 38e-5 * E * s(M - 2 * F) - 24e-5 * E * s(2 * Mp - M) - 17e-5 * s(Om) - 7e-5 * s(Mp + 2 * M);
	else {
		corr = -.62801 * s(Mp) + .17172 * E * s(M) - .01183 * E * s(Mp + M) + .00862 * s(2 * Mp) + .00804 * s(2 * F) + .00454 * E * s(Mp - M) + .00204 * E * E * s(2 * M) - .0018 * s(Mp - 2 * F) - 7e-4 * s(Mp + 2 * F) - 4e-4 * s(3 * Mp) - 34e-5 * E * s(2 * Mp - M) + 32e-5 * E * s(M + 2 * F) + 32e-5 * E * s(M - 2 * F) - 28e-5 * E * E * s(Mp + 2 * M) + 27e-5 * E * s(2 * Mp + M) - 17e-5 * s(Om);
		const w = .00306 - 38e-5 * E * c(M) + 26e-5 * c(Mp) - 2e-5 * c(Mp - M) + 2e-5 * c(Mp + M) + 2e-5 * c(2 * F);
		corr += phase === 1 ? w : -w;
	}
	return /* @__PURE__ */ new Date((jde + corr - 2440587.5) * 864e5);
}
/** Instante da fase (Meeus, cap. 49), preciso o bastante para o dia civil. */
function lunarPhaseInstant(k, phase) {
	return phaseInstant(k, phase);
}
function brasiliaIso$1(date) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "America/Sao_Paulo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(date);
}
/**
* Eclipses cuja fase citada é visível em território brasileiro.
* Penumbral fica de fora. Anular fica de fora.
* Fontes: NASA, Observatório Nacional, Time and Date.
* O de 3 de março de 2026 é total em outras regiões; no Brasil só a fase parcial.
*/
var ECLIPSES = [
	{
		iso: "1991-07-11",
		title: "Eclipse solar",
		kind: "total"
	},
	{
		iso: "1994-11-03",
		title: "Eclipse solar",
		kind: "total"
	},
	{
		iso: "2000-01-21",
		title: "Eclipse lunar",
		kind: "total"
	},
	{
		iso: "2003-05-16",
		title: "Eclipse lunar",
		kind: "total"
	},
	{
		iso: "2003-11-09",
		title: "Eclipse lunar",
		kind: "total"
	},
	{
		iso: "2007-03-03",
		title: "Eclipse lunar",
		kind: "total"
	},
	{
		iso: "2007-08-28",
		title: "Eclipse lunar",
		kind: "total"
	},
	{
		iso: "2008-02-21",
		title: "Eclipse lunar",
		kind: "total"
	},
	{
		iso: "2008-08-16",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2010-12-21",
		title: "Eclipse lunar",
		kind: "total"
	},
	{
		iso: "2012-06-04",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2014-04-15",
		title: "Eclipse lunar",
		kind: "total"
	},
	{
		iso: "2015-09-28",
		title: "Eclipse lunar",
		kind: "total"
	},
	{
		iso: "2019-01-21",
		title: "Eclipse lunar",
		kind: "total"
	},
	{
		iso: "2019-07-16",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2021-11-19",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2022-05-16",
		title: "Eclipse lunar",
		kind: "total"
	},
	{
		iso: "2023-10-28",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2024-09-17",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2025-03-14",
		title: "Eclipse lunar",
		kind: "total"
	},
	{
		iso: "2026-03-03",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2026-08-28",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2028-01-12",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2028-07-06",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2029-06-26",
		title: "Eclipse lunar",
		kind: "total"
	},
	{
		iso: "2029-12-20",
		title: "Eclipse lunar",
		kind: "total"
	},
	{
		iso: "2034-09-28",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2035-08-19",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2037-07-27",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2041-05-16",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2041-11-08",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2045-08-12",
		title: "Eclipse solar",
		kind: "total"
	},
	{
		iso: "2046-07-18",
		title: "Eclipse lunar",
		kind: "parcial"
	},
	{
		iso: "2046-08-02",
		title: "Eclipse solar",
		kind: "total"
	},
	{
		iso: "2048-06-26",
		title: "Eclipse lunar",
		kind: "parcial"
	}
];
function phaseEvents(year) {
	const k0 = Math.floor((year - 2e3) * 12.3685);
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (let k = k0 - 2; k <= k0 + 15; k += 1) for (const phase of [
		0,
		1,
		2,
		3
	]) {
		const iso = brasiliaIso$1(phaseInstant(k, phase));
		if (!iso.startsWith(`${year}-`)) continue;
		const key = `${iso}-${phase}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push({
			id: `lunar-${iso}-${phase}`,
			iso,
			title: PHASES[phase],
			place: "Fase da Lua",
			source: "holiday",
			holidayKind: "lunar",
			confirmed: true
		});
	}
	return out;
}
function eclipseEvents(year) {
	return ECLIPSES.filter((item) => item.iso.startsWith(`${year}-`)).map((item) => ({
		id: `eclipse-${item.iso}`,
		iso: item.iso,
		title: item.title,
		place: item.kind === "total" ? "Total · visível no Brasil" : "Parcial · visível no Brasil",
		source: "holiday",
		holidayKind: "lunar",
		confirmed: true
	}));
}
var lunarYearCache = /* @__PURE__ */ new Map();
function lunarDates(year) {
	const hit = lunarYearCache.get(year);
	if (hit) return hit;
	const rows = [...phaseEvents(year), ...eclipseEvents(year)];
	lunarYearCache.set(year, rows);
	return rows;
}
var DEG = Math.PI / 180;
/** Termos periódicos de Meeus, suficientes para acertar o dia civil. */
var TERMS = [
	[
		485,
		324.96,
		1934.136
	],
	[
		203,
		337.23,
		32964.467
	],
	[
		199,
		342.08,
		20.186
	],
	[
		182,
		27.85,
		445267.112
	],
	[
		156,
		73.14,
		45036.886
	],
	[
		136,
		171.52,
		22518.443
	],
	[
		77,
		222.54,
		65928.934
	],
	[
		74,
		296.72,
		3034.906
	],
	[
		70,
		243.58,
		9037.513
	],
	[
		58,
		119.81,
		33718.147
	],
	[
		52,
		297.17,
		150.678
	],
	[
		50,
		21.02,
		2281.226
	],
	[
		45,
		247.54,
		29929.562
	],
	[
		44,
		325.15,
		31555.956
	],
	[
		29,
		60.93,
		4443.417
	],
	[
		18,
		155.12,
		67555.328
	],
	[
		17,
		288.79,
		4562.452
	],
	[
		16,
		198.04,
		62894.029
	],
	[
		14,
		199.76,
		31436.921
	],
	[
		12,
		95.39,
		14577.848
	],
	[
		12,
		287.11,
		31931.756
	],
	[
		12,
		320.81,
		34777.259
	],
	[
		9,
		227.73,
		1222.114
	],
	[
		8,
		15.45,
		16859.074
	]
];
function meanJde(year, which) {
	const y = (year - 2e3) / 1e3;
	if (which === 0) return 2451623.80984 + 365242.37404 * y + .05169 * y * y - .00411 * y ** 3 - 57e-5 * y ** 4;
	if (which === 1) return 2451716.56767 + 365241.62603 * y + .00325 * y * y + .00888 * y ** 3 - 3e-4 * y ** 4;
	if (which === 2) return 2451810.21715 + 365242.01767 * y - .11575 * y * y + .00337 * y ** 3 + 78e-5 * y ** 4;
	return 2451900.05952 + 365242.74049 * y - .06223 * y * y - .00823 * y ** 3 + 32e-5 * y ** 4;
}
var seasonCache = /* @__PURE__ */ new Map();
function seasonInstant(year, which) {
	const key = `${year}:${which}`;
	const hit = seasonCache.get(key);
	if (hit) return hit;
	const jde0 = meanJde(year, which);
	const t = (jde0 - 2451545) / 36525;
	let s = 0;
	for (const [a, b, c] of TERMS) s += a * Math.cos((b + c * t) * DEG);
	const w = (35999.373 * t - 2.47) * DEG;
	const dl = 1 + .0334 * Math.cos(w) + 7e-4 * Math.cos(2 * w);
	const jde = jde0 + 1e-5 * s / dl;
	const date = /* @__PURE__ */ new Date((jde - 2440587.5) * 864e5);
	seasonCache.set(key, date);
	return date;
}
/** Equinócio de setembro: outono no norte, primavera no sul. */
function septemberEquinox(year) {
	return seasonInstant(year, 2);
}
function brasiliaIso(date) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "America/Sao_Paulo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(date);
}
var SEASONS = [
	{
		which: 0,
		title: "Outono",
		detail: "Equinócio"
	},
	{
		which: 1,
		title: "Inverno",
		detail: "Solstício"
	},
	{
		which: 2,
		title: "Primavera",
		detail: "Equinócio"
	},
	{
		which: 3,
		title: "Verão",
		detail: "Solstício"
	}
];
var seasonYearCache = /* @__PURE__ */ new Map();
/** Estações do hemisfério sul, no dia civil de Brasília. */
function seasonDates(year) {
	const hit = seasonYearCache.get(year);
	if (hit) return hit;
	const rows = SEASONS.map((season) => {
		const iso = brasiliaIso(seasonInstant(year, season.which));
		return {
			id: `season-${year}-${season.title}`,
			iso,
			title: season.title,
			place: season.detail,
			source: "holiday",
			holidayKind: "season",
			confirmed: true
		};
	});
	seasonYearCache.set(year, rows);
	return rows;
}
var KEY = "calendae-moon-festival";
function empty() {
	return {
		triedYear: null,
		dates: {}
	};
}
var moonMem = null;
function readStore() {
	if (moonMem) return moonMem;
	if (typeof localStorage === "undefined") return empty();
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) {
			moonMem = empty();
			return moonMem;
		}
		const parsed = JSON.parse(raw);
		moonMem = {
			triedYear: typeof parsed.triedYear === "number" ? parsed.triedYear : null,
			dates: parsed.dates && typeof parsed.dates === "object" ? parsed.dates : {}
		};
		return moonMem;
	} catch {
		moonMem = empty();
		return moonMem;
	}
}
function writeStore(store) {
	moonMem = store;
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(KEY, JSON.stringify(store));
}
var moonComputed = /* @__PURE__ */ new Map();
/**
* Festival da Lua = 15º dia do 8º mês lunar.
* O 8º mês é o que contém o equinócio de setembro.
* O dia civil é o da China (UTC+8), que é a data oficial do festival.
*/
function computedMoonFestivalIso(year) {
	const hit = moonComputed.get(year);
	if (hit) return hit;
	const equinox = septemberEquinox(year);
	const k0 = Math.floor((year - 2e3) * 12.3685);
	let start = null;
	for (let k = k0 - 3; k <= k0 + 16; k += 1) {
		const moon = lunarPhaseInstant(k, 0);
		if (moon.getTime() <= equinox.getTime()) start = moon;
		else if (start) break;
	}
	const iso = start ? addDays(shanghaiIso(start), 14) : `${year}-09-15`;
	moonComputed.set(year, iso);
	return iso;
}
function shanghaiIso(date) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Shanghai",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(date);
}
function addDays(iso, days) {
	const [year, month, day] = iso.split("-").map(Number);
	const date = new Date(Date.UTC(year, month - 1, day + days));
	return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
function moonFestivalIso(year) {
	return readStore().dates[String(year)] || computedMoonFestivalIso(year);
}
function moonFestivalTriedYear() {
	return readStore().triedYear;
}
function rememberMoonFestival(year, iso, triedYear) {
	const store = readStore();
	store.dates[String(year)] = iso;
	store.triedYear = triedYear;
	writeStore(store);
}
function markMoonFestivalTried(year) {
	const store = readStore();
	store.triedYear = year;
	writeStore(store);
}
var MONTH_INDEX = {
	january: "01",
	february: "02",
	march: "03",
	april: "04",
	may: "05",
	june: "06",
	july: "07",
	august: "08",
	september: "09",
	october: "10",
	november: "11",
	december: "12"
};
function isoFromParts(year, day, monthName) {
	const month = MONTH_INDEX[monthName.toLowerCase()];
	if (!month) return null;
	const iso = `${year}-${month}-${day.padStart(2, "0")}`;
	if (month === "09" || month === "10" && Number(day) <= 15) return iso;
	return null;
}
/** Lê a data do ano no infobox ou na lista da Wikipedia. */
function parseMoonFestivalHtml(html, year) {
	const month = "January|February|March|April|May|June|July|August|September|October|November|December";
	const infobox = new RegExp(`${year}(?:<[^>]+>|&nbsp;|\\s)*date</th>\\s*<td[^>]*>\\s*(\\d{1,2})\\s+(${month})`, "i");
	const listed = new RegExp(`${year}:\\s*[A-Za-z]+\\s+(\\d{1,2})\\s+(${month})`, "i");
	const hit = html.match(infobox) ?? html.match(listed);
	if (!hit) return null;
	return isoFromParts(year, hit[1], hit[2]);
}
function moonFestivalEvent(year) {
	const iso = moonFestivalIso(year);
	return {
		id: `com-${iso}-Festival da Lua`,
		iso,
		title: "Festival da Lua",
		time: "",
		source: "holiday",
		holidayKind: "commemorative"
	};
}
//#endregion
export { markMoonFestivalTried as $, eventSpanIsos as A, shiftMonth as At, formatTime as B, weekdayName as Bt, commemorativeAka as C, readEventsRaw as Ct, eventMarksGrid as D, resolvedMarks as Dt, electionRaceLabel as E, rememberMoonFestival as Et, fgtsEvent as F, toIso as Ft, isDueForHistory as G, holidaysForYears as H, fgtsWindow as I, todayIso as It, isNational as J, isElectionYear as K, firstRoundIso as L, uniqueEvents as Lt, facultativeAka as M, tabAllowsEvent as Mt, facultativeName as N, takeLocal as Nt, eventMatchesIso as O, seasonDates as Ot, fallbackHolidays as P, timeToMinutes as Pt, lunarDates as Q, followResolved as R, usesOrdinal as Rt, civilDate as S, projectedIrpfLots as St, electionDates as T, readSettingsRaw as Tt, intervalFollow as U, fromIso as V, irpfEvent as W, lastVisibleIso as X, isPeriodEvent as Y, lotLabel as Z, YEAR_MAX as _, parseMoonFestivalHtml as _t, CONFIRMED_IRPF_LOTS as a, nationalAka as at, buildMonthCells as b, postponeIso as bt, EVENTS_KEY as c, observanceYear as ct, HOLIDAYS_KEY as d, officialHolidayTitle as dt, mergeEventsById as et, INSS_KEY as f, ordinalIso as ft, SETTINGS_KEY as g, parseIrpfLots as gt, PERIODS_KEY as h, parseIrpfDeadline as ht, CONFIRMED_IRPF as i, moonFestivalTriedYear as it, eventTab as j, standingPisMap as jt, eventOverlapsMonth as k, secondRoundIso as kt, EVENT_KINDS as l, occurrenceInMonth as lt, MONTHS as m, parseGoogleEvents as mt, CAL_TABS as n, moonFestivalEvent as nt, CONFIRMED_PIS as o, newEventId as ot, KNOWN_SECOND_ROUND_FEDERAL as p, parseFgtsCalendar as pt, isFacultative as q, CONFIRMED_FGTS as r, moonFestivalIso as rt, DEFAULT_SETTINGS as s, observanceReached as st, ALMANAC_KEY as t, minutesToTime as tt, HISTORY_KEY as u, officeHolidayLabel as ut, archiveEvent as v, parsePisCalendar as vt, easterDate as w, readHolidayStore as wt, cellLook as x, projectedIrpfIso as xt, birthdayIso as y, pisEvent as yt, formatHolidaySync as z, weekLabels as zt };
