import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_react_dom, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { $ as markMoonFestivalTried, A as eventSpanIsos, At as shiftMonth, B as formatTime, Bt as weekdayName, C as commemorativeAka, Ct as readEventsRaw, D as eventMarksGrid, Dt as resolvedMarks, E as electionRaceLabel, Et as rememberMoonFestival, F as fgtsEvent, Ft as toIso, G as isDueForHistory, H as holidaysForYears, I as fgtsWindow, It as todayIso, J as isNational, K as isElectionYear, L as firstRoundIso, Lt as uniqueEvents, M as facultativeAka, Mt as tabAllowsEvent, N as facultativeName, Nt as takeLocal, O as eventMatchesIso, Ot as seasonDates, P as fallbackHolidays, Pt as timeToMinutes, Q as lunarDates, R as followResolved, Rt as usesOrdinal, S as civilDate, St as projectedIrpfLots, T as electionDates, Tt as readSettingsRaw, U as intervalFollow, V as fromIso, W as irpfEvent, X as lastVisibleIso, Y as isPeriodEvent, Z as lotLabel, _ as YEAR_MAX, at as nationalAka, b as buildMonthCells, bt as postponeIso, c as EVENTS_KEY, ct as observanceYear, d as HOLIDAYS_KEY, dt as officialHolidayTitle, et as mergeEventsById, f as INSS_KEY, ft as ordinalIso, g as SETTINGS_KEY, h as PERIODS_KEY, i as CONFIRMED_IRPF, it as moonFestivalTriedYear, j as eventTab, jt as standingPisMap, k as eventOverlapsMonth, kt as secondRoundIso, l as EVENT_KINDS, lt as occurrenceInMonth, m as MONTHS$1, nt as moonFestivalEvent, o as CONFIRMED_PIS, ot as newEventId, p as KNOWN_SECOND_ROUND_FEDERAL, q as isFacultative, r as CONFIRMED_FGTS, rt as moonFestivalIso, s as DEFAULT_SETTINGS, st as observanceReached, t as ALMANAC_KEY, tt as minutesToTime, u as HISTORY_KEY, ut as officeHolidayLabel, v as archiveEvent, w as easterDate, wt as readHolidayStore, x as cellLook, xt as projectedIrpfIso, y as birthdayIso, yt as pisEvent, zt as weekLabels } from "./moon-festival-CMLpKxi0.mjs";
import { r as signOut } from "./client-CoMeym3u.mjs";
import { t as authMiddleware } from "./middleware-Cs7rQ4cc.mjs";
import { _ as Calendar, a as Smile, c as ScanBarcode, d as MapPin, f as FileImage, g as ChevronLeft, h as ChevronRight, i as SquareCheckBig, l as Pencil, m as Clock, o as Settings2, p as Contact, r as Trash2, s as Search, t as X, u as Paperclip, v as CalendarPlus, y as Bell } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B7H0fKm0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = require_react_dom();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function withTip(name, className) {
	return {
		className: cn("cal-icon-tip", className),
		"data-tip": name
	};
}
function A11yHint({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("a11y-hint", className),
		children
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg h-11 px-4",
			ghost: "text-fg h-11 w-11",
			line: "h-11 px-4 text-fg shadow-[0_0_0_1px_var(--c-line)]"
		},
		size: {
			default: "",
			icon: "size-11 p-0"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function HeaderMenu({ label, value, options, open, wide, fixed, soft, buttonClassName, optionClassName, disabled, onOpen, onClose, onPick }) {
	const rootRef = (0, import_react.useRef)(null);
	const buttonRef = (0, import_react.useRef)(null);
	const menuRef = (0, import_react.useRef)(null);
	const activeRef = (0, import_react.useRef)(null);
	const dragged = (0, import_react.useRef)(false);
	const lit = (0, import_react.useRef)(value);
	const settled = (0, import_react.useRef)(false);
	const valueRef = (0, import_react.useRef)(value);
	const onPickRef = (0, import_react.useRef)(onPick);
	const onCloseRef = (0, import_react.useRef)(onClose);
	const optionsRef = (0, import_react.useRef)(options);
	const opened = (0, import_react.useRef)(false);
	valueRef.current = value;
	onPickRef.current = onPick;
	onCloseRef.current = onClose;
	optionsRef.current = options;
	const [pos, setPos] = (0, import_react.useState)({
		top: 0,
		left: 0,
		width: 0,
		maxH: 216
	});
	function valueFrom(node) {
		const button = node?.closest("button[role='option']");
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
	(0, import_react.useEffect)(() => {
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
			const frame = document.querySelector(".cal-app")?.getBoundingClientRect() ?? {
				top: 0,
				bottom: window.innerHeight,
				left: 0,
				right: window.innerWidth
			};
			const gap = 6;
			const pad = 10;
			const cap = 216;
			const below = frame.bottom - box.bottom - gap - pad;
			const above = box.top - frame.top - gap - pad;
			const openUp = below < 136 && above > below;
			const maxH = Math.min(cap, Math.max(64, openUp ? above : below));
			const top = openUp ? box.top - gap - maxH : box.bottom + gap;
			const width = Math.max(box.width, 8);
			let left = box.left;
			if (left + width > frame.right - 6) left = Math.max(frame.left + 6, frame.right - 6 - width);
			if (left < frame.left + 6) left = frame.left + 6;
			setPos({
				top,
				left,
				width,
				maxH
			});
		}
		function onDoc(event) {
			if (!rootRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) commit();
		}
		function onKey(event) {
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
	}, [
		open,
		onClose,
		fixed
	]);
	(0, import_react.useEffect)(() => {
		const el = menuRef.current;
		if (!open || !soft || !el) return;
		let current = el.scrollTop;
		let target = el.scrollTop;
		let raf = 0;
		const max = () => Math.max(0, el.scrollHeight - el.clientHeight);
		function clamp(n) {
			return Math.min(max(), Math.max(0, n));
		}
		function tick() {
			current += (target - current) * .08;
			el.scrollTop = current;
			if (Math.abs(target - current) > .35) raf = requestAnimationFrame(tick);
			else {
				el.scrollTop = target;
				raf = 0;
			}
		}
		function go(next) {
			target = clamp(next);
			if (!raf) raf = requestAnimationFrame(tick);
		}
		function onWheel(event) {
			if (!el.contains(event.target)) return;
			event.preventDefault();
			event.stopImmediatePropagation();
			go(target + event.deltaY * .38);
		}
		function onTouchMove(event) {
			if (!el.contains(event.target)) return;
			event.preventDefault();
			event.stopImmediatePropagation();
		}
		let startY = 0;
		let startScroll = 0;
		let holding = false;
		function markOver(x, y) {
			const hit = document.elementFromPoint(x, y)?.closest("button[role='option']");
			const inside = hit && el.contains(hit) ? hit : null;
			el.querySelectorAll(".is-over").forEach((node) => {
				if (node !== inside) node.classList.remove("is-over");
			});
			inside?.classList.add("is-over");
			const next = valueFrom(inside);
			if (next != null) lit.current = next;
		}
		function onPointerDown(event) {
			if (event.button !== 0) return;
			holding = true;
			dragged.current = false;
			startY = event.clientY;
			startScroll = target;
			current = el.scrollTop;
			target = el.scrollTop;
			markOver(event.clientX, event.clientY);
		}
		function onPointerMove(event) {
			markOver(event.clientX, event.clientY);
			if (!holding) return;
			const dy = event.clientY - startY;
			if (Math.abs(dy) < 10) return;
			if (!dragged.current) {
				dragged.current = true;
				try {
					el.setPointerCapture(event.pointerId);
				} catch {}
			}
			event.preventDefault();
			event.stopImmediatePropagation();
			go(startScroll - dy);
		}
		function onPointerUp(event) {
			const wasDrag = dragged.current;
			holding = false;
			el.querySelectorAll(".cal-month-option.is-over, .cal-year-option.is-over, .cal-kind-option.is-over").forEach((node) => node.classList.remove("is-over"));
			try {
				el.releasePointerCapture(event.pointerId);
			} catch {}
			dragged.current = false;
			if (!wasDrag) {
				const hit = document.elementFromPoint(event.clientX, event.clientY)?.closest("button[role='option']");
				if (hit && el.contains(hit)) hit.click();
			}
		}
		document.addEventListener("wheel", onWheel, {
			capture: true,
			passive: false
		});
		document.addEventListener("touchmove", onTouchMove, {
			capture: true,
			passive: false
		});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: rootRef,
		className: "relative shrink-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			ref: buttonRef,
			type: "button",
			className: cn(buttonClassName, disabled && "cursor-not-allowed opacity-45"),
			"aria-haspopup": "listbox",
			"aria-expanded": open,
			"aria-label": label,
			disabled,
			onClick: () => {
				if (disabled) return;
				open ? commit() : onOpen();
			},
			children: options.find((option) => option.value === value)?.label ?? String(value)
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			ref: menuRef,
			role: "listbox",
			"aria-label": label,
			className: cn("cal-pick-menu", wide ? "is-wide" : "is-narrow", fixed && "is-fixed", soft && "is-soft"),
			style: fixed ? {
				top: pos.top,
				left: pos.left,
				width: Math.max(pos.width, 8),
				maxHeight: pos.maxH
			} : void 0,
			children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				ref: option.value === value ? activeRef : void 0,
				type: "button",
				role: "option",
				"aria-selected": option.value === value,
				"data-value": String(option.value),
				className: cn("cal-pick-option", optionClassName, option.value === value && "is-active"),
				onMouseEnter: () => {
					lit.current = option.value;
				},
				onClick: () => {
					if (dragged.current) {
						dragged.current = false;
						return;
					}
					settled.current = true;
					onPick(option.value);
				},
				children: option.label
			}) }, String(option.value)))
		}) : null]
	});
}
/**
* Stable fallback user, used ONLY when auth is disabled
* (`VITE_AUTH_ENABLED=false`, the shipped default). With auth on, the sandbox
* live preview does real sign-in via the baked preview client. Its id is
* `"dev-user"` — the SAME id `verify.server.ts` returns server-side — so per-user
* rows written in that mode belong to one consistent owner.
*/
var DEV_USER = {
	id: "dev-user",
	displayName: "Dev User",
	primaryEmail: "dev@example.com",
	profileImageUrl: null,
	isDevFallback: true
};
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return {
		user: DEV_USER,
		isPending: false
	};
}
var OFF_KEY = "calendae-login-off";
function calendaeLoginOff() {
	try {
		return localStorage.getItem(OFF_KEY) === "1";
	} catch {
		return false;
	}
}
function setCalendaeLoginOff(off) {
	try {
		if (off) localStorage.setItem(OFF_KEY, "1");
		else localStorage.removeItem(OFF_KEY);
		window.dispatchEvent(new Event("calendae-login"));
	} catch {}
}
function isGateUser(user) {
	if (!user) return false;
	const email = (user.primaryEmail ?? "").toLowerCase();
	const name = (user.displayName ?? "").toLowerCase();
	return email.includes("grok") || name.includes("grok") || user.id === "preview-user";
}
function useCalendaeSession() {
	const { user, isPending } = useCurrentUserState();
	const [off, setOff] = (0, import_react.useState)(false);
	const stable = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setOff(calendaeLoginOff());
		const sync = () => setOff(calendaeLoginOff());
		window.addEventListener("calendae-login", sync);
		window.addEventListener("storage", sync);
		return () => {
			window.removeEventListener("calendae-login", sync);
			window.removeEventListener("storage", sync);
		};
	}, []);
	if (Boolean(user) && !off && !isGateUser(user) && user) {
		if (!stable.current || stable.current.id !== user.id) stable.current = user;
	} else if (!isPending) stable.current = null;
	return {
		user: stable.current,
		isPending: isPending && !stable.current,
		signedIn: Boolean(stable.current)
	};
}
function isLoginRequired(result) {
	return result.ok === false && result.loginRequired === true;
}
function isFramed() {
	try {
		return window.self !== window.top;
	} catch {
		return true;
	}
}
function redirectToLoginIfRequired(result) {
	if (!isLoginRequired(result)) return false;
	const url = result.loginUrl;
	if (!url) return false;
	if (typeof window === "undefined") return false;
	if (isFramed()) {
		const opened = window.open(url, "_blank");
		if (opened) {
			opened.opener = null;
			return true;
		}
	}
	window.location.assign(url);
	return true;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function useGlyphFlash() {
	const [flash, setFlash] = (0, import_react.useState)(false);
	const timer = (0, import_react.useRef)(0);
	return [flash, (0, import_react.useCallback)(() => {
		window.clearTimeout(timer.current);
		setFlash(true);
		timer.current = window.setTimeout(() => setFlash(false), 280);
	}, [])];
}
function CalendarGlyph({ className, flash }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className: cn("cal-glyph", flash && "is-flash", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "5.8",
				y: "3.5",
				width: "14.6",
				height: "17",
				rx: "2.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9.8 3.5v17" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.9 8h4.8" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.9 12h4.8" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.9 16h4.8" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "12.6",
				y: "6.4",
				width: "5.4",
				height: "2.6",
				rx: "0.4"
			})
		]
	});
}
function pad(n) {
	return String(n).padStart(2, "0");
}
function partsOf(value) {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (match) return {
		year: match[1],
		month: match[2],
		day: match[3]
	};
	const date = fromIso(value);
	return {
		day: pad(date.getDate()),
		month: pad(date.getMonth() + 1),
		year: String(date.getFullYear())
	};
}
function validDate(year, month, day) {
	if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
	if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) return null;
	const date = civilDate(year, month - 1, day);
	if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
	return toIso(date);
}
function split12(time) {
	const [hRaw, mRaw] = time.split(":");
	const hours24 = Number(hRaw);
	const minutes = Number(mRaw ?? 0);
	const ap = hours24 >= 12 ? "pm" : "am";
	return {
		hour: pad(hours24 % 12 === 0 ? 12 : hours24 % 12),
		minute: pad(Number.isFinite(minutes) ? minutes : 0),
		ap
	};
}
function join12(hour, minute, ap) {
	if (hour.length < 2 || minute.length < 2) return null;
	let hours = Number(hour);
	const mins = Number(minute);
	if (!Number.isFinite(hours) || !Number.isFinite(mins) || mins > 59) return null;
	if (hours < 1 || hours > 12) return null;
	if (ap === "am") hours = hours === 12 ? 0 : hours;
	else hours = hours === 12 ? 12 : hours + 12;
	return `${pad(hours)}:${pad(mins)}`;
}
function split24(time) {
	const [hRaw, mRaw] = time.split(":");
	const hours = Number(hRaw);
	const minutes = Number(mRaw ?? 0);
	const h = Number.isFinite(hours) ? Math.min(23, Math.max(0, hours)) : 0;
	const m = Number.isFinite(minutes) ? Math.min(59, Math.max(0, minutes)) : 0;
	return {
		hour: pad(h),
		minute: pad(m)
	};
}
function join24(hour, minute) {
	if (hour.length < 2 || minute.length < 2) return null;
	const hours = Number(hour);
	const mins = Number(minute);
	if (!Number.isFinite(hours) || !Number.isFinite(mins) || hours > 23 || mins > 59) return null;
	return `${pad(hours)}:${pad(mins)}`;
}
function selectAll(el) {
	if (!el) return;
	el.focus();
	el.setSelectionRange(0, el.value.length);
}
function nextFormInput(from, selector) {
	const nodes = [...(from.closest("form") ?? document.body).querySelectorAll(selector)];
	const i = nodes.indexOf(from);
	return i >= 0 ? nodes[i + 1] ?? null : null;
}
function PickerPop({ anchor, children, onClose }) {
	const popRef = (0, import_react.useRef)(null);
	const [pos, setPos] = (0, import_react.useState)({
		top: 0,
		left: 0
	});
	(0, import_react.useLayoutEffect)(() => {
		const box = anchor?.getBoundingClientRect();
		const pop = popRef.current?.getBoundingClientRect();
		if (!box) return;
		const height = pop?.height ?? 220;
		const width = pop?.width ?? 220;
		const below = box.bottom + 8;
		const top = below + height > window.innerHeight - 12 ? Math.max(12, box.top - height - 8) : below;
		const left = Math.min(Math.max(12, box.left), window.innerWidth - width - 12);
		setPos({
			top,
			left
		});
	}, [anchor]);
	(0, import_react.useEffect)(() => {
		function onDoc(event) {
			const node = event.target;
			if (popRef.current?.contains(node) || anchor?.contains(node)) return;
			onClose();
		}
		function onKey(event) {
			if (event.key === "Escape") onClose();
		}
		document.addEventListener("mousedown", onDoc);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDoc);
			document.removeEventListener("keydown", onKey);
		};
	}, [anchor, onClose]);
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: popRef,
		className: "cal-dt-pop",
		style: {
			top: pos.top,
			left: pos.left
		},
		role: "dialog",
		children
	}), document.body);
}
function DateCal({ value, weekStart = "sunday", onPick }) {
	const selected = partsOf(value);
	const [cursor, setCursor] = (0, import_react.useState)(() => civilDate(Number(selected.year), Number(selected.month) - 1, 1));
	const year = cursor.getFullYear();
	const month = cursor.getMonth();
	const firstDow = civilDate(year, month, 1).getDay();
	const offset = weekStart === "sunday" ? firstDow : (firstDow + 6) % 7;
	const last = civilDate(year, month + 1, 0).getDate();
	const cells = [...Array(offset).fill(null), ...Array.from({ length: last }, (_, i) => i + 1)];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cal-dt-cal",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "cal-dt-nav cal-icon-tip",
					"data-tip": "Mês anterior",
					"aria-label": "Mês anterior",
					onClick: () => setCursor(civilDate(year, month - 1, 1)),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "m-0 flex-1 text-center text-sm capitalize text-fg",
					children: [
						MONTHS$1[month],
						" ",
						year
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "cal-dt-nav cal-icon-tip",
					"data-tip": "Próximo mês",
					"aria-label": "Próximo mês",
					onClick: () => setCursor(civilDate(year, month + 1, 1)),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cal-dt-mini",
			children: [weekLabels(weekStart).map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "cal-dt-dow",
				children: label
			}, label)), cells.map((day, i) => {
				if (!day) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}, `e-${i}`);
				const iso = toIso(civilDate(year, month, day));
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cn("cal-dt-day", iso === value && "is-on"),
					onClick: () => onPick(iso),
					children: day
				}, iso);
			})]
		})]
	});
}
function TimeCal({ value, cycle, onPick }) {
	const parts12 = split12(value);
	const parts24 = split24(value);
	const hourRef = (0, import_react.useRef)(null);
	const minuteRef = (0, import_react.useRef)(null);
	const apRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		for (const el of [
			hourRef.current,
			minuteRef.current,
			apRef.current
		]) {
			const col = el?.parentElement;
			if (!col || !el) continue;
			col.scrollTop = el.offsetTop - col.clientHeight / 2 + el.offsetHeight / 2;
		}
	}, []);
	if (cycle === "24") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cal-dt-clock",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "cal-dt-col",
			children: Array.from({ length: 24 }, (_, i) => {
				const h = pad(i);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					ref: h === parts24.hour ? hourRef : void 0,
					className: cn("cal-dt-tick", h === parts24.hour && "is-on"),
					onClick: () => {
						const joined = join24(h, parts24.minute);
						if (joined) onPick(joined);
					},
					children: h
				}, h);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "cal-dt-col",
			children: Array.from({ length: 60 }, (_, m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				ref: pad(m) === parts24.minute ? minuteRef : void 0,
				className: cn("cal-dt-tick", pad(m) === parts24.minute && "is-on"),
				onClick: () => {
					const joined = join24(parts24.hour, pad(m));
					if (joined) onPick(joined);
				},
				children: pad(m)
			}, m))
		})]
	});
	function pick(hour, minute, ap) {
		const joined = join12(hour, minute, ap);
		if (joined) onPick(joined);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cal-dt-clock",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cal-dt-col",
				children: Array.from({ length: 12 }, (_, i) => {
					const h = pad(i + 1);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						ref: h === parts12.hour ? hourRef : void 0,
						className: cn("cal-dt-tick", h === parts12.hour && "is-on"),
						onClick: () => pick(h, parts12.minute, parts12.ap),
						children: h
					}, h);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cal-dt-col",
				children: Array.from({ length: 60 }, (_, m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					ref: pad(m) === parts12.minute ? minuteRef : void 0,
					className: cn("cal-dt-tick", pad(m) === parts12.minute && "is-on"),
					onClick: () => pick(parts12.hour, pad(m), parts12.ap),
					children: pad(m)
				}, m))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cal-dt-col cal-dt-col-ap",
				children: ["am", "pm"].map((mer) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					ref: mer === parts12.ap ? apRef : void 0,
					className: cn("cal-dt-tick", mer === parts12.ap && "is-on"),
					onClick: () => pick(parts12.hour, parts12.minute, mer),
					children: mer
				}, mer))
			})
		]
	});
}
function earlyPad(kind, digit) {
	const n = Number(digit);
	if (!Number.isFinite(n)) return null;
	if (kind === "day" && n >= 4) return pad(n);
	if (kind === "month" && n >= 2) return pad(n);
	if (kind === "hour" && n >= 2) return pad(n);
	if (kind === "hour24" && n >= 3) return pad(n);
	if (kind === "minute" && n >= 6) return pad(n);
	return null;
}
function clampSeg(kind, raw) {
	const n = Number(raw);
	if (kind === "day") return pad(Math.min(31, Math.max(1, n || 1)));
	if (kind === "month") return pad(Math.min(12, Math.max(1, n || 1)));
	if (kind === "hour") return pad(Math.min(12, Math.max(1, n || 1)));
	if (kind === "hour24") return pad(Math.min(23, Math.max(0, Number.isFinite(n) ? n : 0)));
	if (kind === "minute") return pad(Math.min(59, Math.max(0, Number.isFinite(n) ? n : 0)));
	return raw.replace(/\D/g, "").slice(0, 4).padStart(4, "0");
}
function YearSeg({ value, label = "Ano", className, onChange, onComplete }) {
	const ref = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, {
		value,
		max: 4,
		kind: "year",
		label,
		wide: true,
		className,
		inputRef: ref,
		onChange: (next) => {
			onChange(next);
			if (next.length >= 4) onComplete?.(next);
		},
		onFull: () => {},
		onBack: () => {
			const el = ref.current;
			if (el) el.setSelectionRange(0, el.value.length);
		}
	});
}
function Seg({ value, max, kind, label, wide, className, inputRef, onChange, onFull, onBack }) {
	const liveRef = (0, import_react.useRef)(value);
	const eatenRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		liveRef.current = value;
	}, [value]);
	function selectAllHere(el) {
		el.setSelectionRange(0, el.value.length);
	}
	function applyDigit(digit) {
		const current = liveRef.current.replace(/\D/g, "");
		const el = inputRef.current;
		if (!el || el.selectionStart === 0 && el.selectionEnd === el.value.length || current.length >= max) {
			const early = earlyPad(kind, digit);
			if (early) {
				liveRef.current = early;
				onChange(early);
				queueMicrotask(onFull);
				return;
			}
			liveRef.current = digit;
			onChange(digit);
			return;
		}
		const next = (current + digit).slice(0, max);
		if (next.length >= max) {
			const done = clampSeg(kind, next);
			liveRef.current = done;
			onChange(done);
			queueMicrotask(onFull);
			return;
		}
		liveRef.current = next;
		onChange(next);
	}
	function onKey(event) {
		if ([
			"/",
			":",
			".",
			"-",
			" ",
			"Delete"
		].includes(event.key)) {
			event.preventDefault();
			return;
		}
		if (event.key === "Backspace") {
			event.preventDefault();
			onBack();
			return;
		}
		if (event.key === "ArrowRight") {
			event.preventDefault();
			onFull();
			return;
		}
		if (event.key === "ArrowLeft") {
			event.preventDefault();
			onBack();
			return;
		}
		if (/^\d$/.test(event.key)) {
			event.preventDefault();
			if (!eatenRef.current) applyDigit(event.key);
			eatenRef.current = false;
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		ref: inputRef,
		value,
		inputMode: "numeric",
		autoComplete: "off",
		spellCheck: false,
		"aria-label": label,
		className: cn("cal-seg", wide && "is-year", className),
		onFocus: (event) => {
			const el = event.currentTarget;
			requestAnimationFrame(() => {
				if (document.activeElement === el) selectAllHere(el);
			});
		},
		onPointerUp: (event) => selectAllHere(event.currentTarget),
		onBlur: () => {
			if (liveRef.current.length < max && liveRef.current.length > 0) {
				const done = clampSeg(kind, liveRef.current);
				liveRef.current = done;
				onChange(done);
			}
		},
		onCut: (event) => event.preventDefault(),
		onPaste: (event) => event.preventDefault(),
		onBeforeInput: (event) => {
			event.preventDefault();
			const type = event.nativeEvent.inputType ?? "";
			const data = event.nativeEvent.data ?? "";
			if (type.startsWith("delete")) return;
			if (data && /^\d+$/.test(data)) {
				eatenRef.current = true;
				for (const ch of data) applyDigit(ch);
			}
		},
		onChange: () => {},
		onKeyDown: onKey
	});
}
function DatePick({ value, weekStart = "sunday", onChange }) {
	const wrapRef = (0, import_react.useRef)(null);
	const dayRef = (0, import_react.useRef)(null);
	const monthRef = (0, import_react.useRef)(null);
	const yearRef = (0, import_react.useRef)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const initial = partsOf(value);
	const [day, setDay] = (0, import_react.useState)(initial.day);
	const [month, setMonth] = (0, import_react.useState)(initial.month);
	const [year, setYear] = (0, import_react.useState)(initial.year);
	(0, import_react.useEffect)(() => {
		const next = partsOf(value);
		setDay(next.day);
		setMonth(next.month);
		setYear(next.year);
	}, [value]);
	function emit(d, m, y) {
		if (d.length < 2 || m.length < 2 || y.length < 4) return;
		const iso = validDate(Number(y), Number(m), Number(d));
		if (iso) onChange(iso);
	}
	function jumpTime() {
		const hour = nextFormInput(yearRef.current ?? wrapRef.current, "input.cal-seg");
		if (hour) selectAll(hour);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "cal-date-wrap",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "cal-date-shell",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cal-date-text",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, {
						value: day,
						max: 2,
						kind: "day",
						label: "Dia",
						inputRef: dayRef,
						onChange: (next) => {
							setDay(next);
							emit(next, month, year);
						},
						onFull: () => monthRef.current?.focus(),
						onBack: () => dayRef.current?.focus()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cal-sep",
						"aria-hidden": "true",
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, {
						value: month,
						max: 2,
						kind: "month",
						label: "Mês",
						inputRef: monthRef,
						onChange: (next) => {
							setMonth(next);
							emit(day, next, year);
						},
						onFull: () => yearRef.current?.focus(),
						onBack: () => dayRef.current?.focus()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cal-sep",
						"aria-hidden": "true",
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, {
						value: year,
						max: 4,
						kind: "year",
						label: "Ano",
						wide: true,
						inputRef: yearRef,
						onChange: (next) => {
							setYear(next);
							emit(day, month, next);
						},
						onFull: jumpTime,
						onBack: () => monthRef.current?.focus()
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				...withTip("Data", "cal-date-icon"),
				"aria-label": "Escolher data",
				onClick: () => setOpen((v) => !v),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-4" })
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickerPop, {
				anchor: wrapRef.current,
				onClose: () => setOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCal, {
					value,
					weekStart,
					onPick: (iso) => {
						onChange(iso);
						setOpen(false);
					}
				})
			}) : null
		]
	});
}
function TimePick({ value, cycle = "12", onChange }) {
	const wrapRef = (0, import_react.useRef)(null);
	const hourRef = (0, import_react.useRef)(null);
	const minuteRef = (0, import_react.useRef)(null);
	const apRef = (0, import_react.useRef)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const parts = cycle === "24" ? {
		...split24(value),
		ap: "am"
	} : split12(value);
	const [hour, setHour] = (0, import_react.useState)(parts.hour);
	const [minute, setMinute] = (0, import_react.useState)(parts.minute);
	const [ap, setAp] = (0, import_react.useState)(parts.ap);
	(0, import_react.useEffect)(() => {
		if (wrapRef.current?.contains(document.activeElement)) return;
		const next = cycle === "24" ? {
			...split24(value),
			ap: "am"
		} : split12(value);
		setHour(next.hour);
		setMinute(next.minute);
		setAp(next.ap);
	}, [value, cycle]);
	function emit(h, m, mer) {
		const joined = cycle === "24" ? join24(h, m) : join12(h, m, mer);
		if (joined) onChange(joined);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "cal-time-wrap",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "cal-time-shell",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cal-time-text",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, {
						value: hour,
						max: 2,
						kind: cycle === "24" ? "hour24" : "hour",
						label: "Hora",
						inputRef: hourRef,
						onChange: (next) => {
							setHour(next);
							emit(next, minute, ap);
						},
						onFull: () => minuteRef.current?.focus(),
						onBack: () => hourRef.current?.focus()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cal-sep",
						"aria-hidden": "true",
						children: ":"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, {
						value: minute,
						max: 2,
						kind: "minute",
						label: "Minuto",
						inputRef: minuteRef,
						onChange: (next) => {
							setMinute(next);
							emit(hour, next, ap);
						},
						onFull: () => cycle === "24" ? void 0 : apRef.current?.focus(),
						onBack: () => hourRef.current?.focus()
					}),
					cycle === "12" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						ref: apRef,
						type: "button",
						className: "cal-ap",
						"aria-label": "AM ou PM",
						onClick: () => {
							const next = ap === "am" ? "pm" : "am";
							setAp(next);
							emit(hour, minute, next);
						},
						onKeyDown: (event) => {
							if (event.key === "ArrowLeft") {
								event.preventDefault();
								selectAll(minuteRef.current);
							}
							if (event.key === "a" || event.key === "A") {
								event.preventDefault();
								setAp("am");
								emit(hour, minute, "am");
							}
							if (event.key === "p" || event.key === "P") {
								event.preventDefault();
								setAp("pm");
								emit(hour, minute, "pm");
							}
							if (event.key === " " || event.key === "Enter" || event.key === "ArrowUp" || event.key === "ArrowDown") {
								event.preventDefault();
								const next = ap === "am" ? "pm" : "am";
								setAp(next);
								emit(hour, minute, next);
							}
						},
						children: ap
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				...withTip("Horário", "cal-time-icon"),
				"aria-label": "Escolher horário",
				onClick: () => setOpen((v) => !v),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" })
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickerPop, {
				anchor: wrapRef.current,
				onClose: () => setOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeCal, {
					value,
					cycle,
					onPick: (time) => {
						onChange(time);
					}
				})
			}) : null
		]
	});
}
function formatBrPhone(raw) {
	let digits = raw.replace(/\D/g, "");
	if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) digits = digits.slice(2);
	if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
	if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
	if (digits.length > 2) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
	return raw.trim();
}
function splitContact(raw) {
	const trimmed = raw.trim();
	let collected = "";
	let i = trimmed.length - 1;
	while (i >= 0 && collected.length < 13) {
		const ch = trimmed[i];
		if (/\d/.test(ch)) collected = ch + collected;
		else if (collected.length && /[\s()\-+./]/.test(ch)) {} else if (collected.length) break;
		i -= 1;
	}
	const local = brLocal(collected) ?? (collected.length >= 10 ? compactPhone(collected) : "");
	if (local.length === 10 || local.length === 11) return {
		name: trimmed.slice(0, i + 1).replace(/[\s,;.\-]+$/, "").trim(),
		phone: formatBrPhone(local),
		digits: local
	};
	return {
		name: trimmed,
		phone: "",
		digits: ""
	};
}
/** Tira do texto a primeira sequência que parece telefone (10 a 15 dígitos). */
function pullPhone(raw) {
	for (const match of raw.matchAll(/(?:\+|00)?[\d(][\d\s().-]{7,}\d/g)) {
		const digits = match[0].replace(/\D/g, "").replace(/^00/, "");
		const local = digits.startsWith("55") && (digits.length === 12 || digits.length === 13) ? digits.slice(2) : digits;
		if (local.length < 10 || local.length > 15) continue;
		const index = match.index ?? 0;
		return {
			name: `${raw.slice(0, index)}${raw.slice(index + match[0].length)}`.replace(/\s{2,}/g, " ").replace(/^[\s,;|/.-]+|[\s,;|/.-]+$/g, "").trim(),
			phone: local.length === 10 || local.length === 11 ? formatBrPhone(local) : `+${local}`
		};
	}
	return null;
}
function brLocal(digits) {
	const clean = digits.replace(/\D/g, "");
	if (clean.startsWith("55") && (clean.length === 12 || clean.length === 13)) return clean.slice(2);
	if (clean.length === 10 || clean.length === 11) return clean;
	return null;
}
function withCountry(digits) {
	const local = brLocal(digits);
	if (local) return `55${local}`;
	const clean = digits.replace(/\D/g, "");
	return clean.length >= 8 ? clean : "";
}
function telHref(digits) {
	const local = brLocal(digits);
	if (local) return `tel:${local}`;
	const clean = digits.replace(/\D/g, "");
	return clean ? `tel:+${clean}` : "";
}
function waHref(digits) {
	const n = withCountry(digits);
	return n ? `https://wa.me/${n}` : "";
}
function compactPhone(raw) {
	let digits = raw.replace(/\D/g, "");
	if (digits.startsWith("55") && digits.length >= 12) digits = digits.slice(2);
	return digits.replace(/^0+/, "");
}
function abbreviateName(name, max) {
	const trimmed = name.trim().replace(/\s+/g, " ");
	if (max <= 0) return "";
	if (trimmed.length <= max) return trimmed;
	const parts = trimmed.split(" ").filter(Boolean);
	if (parts.length === 1) return parts[0].slice(0, max);
	const particle = (word) => /^(d[aeo]s?|e)$/i.test(word);
	const first = parts[0];
	const last = parts[parts.length - 1];
	const attempts = [
		[
			first,
			...parts.slice(1, -1).filter((word) => !particle(word)).map((word) => `${word[0]?.toUpperCase()}.`),
			last
		].join(" "),
		`${first} ${last}`,
		`${first} ${last[0]?.toUpperCase()}.`,
		`${first[0]?.toUpperCase()}. ${last}`
	];
	for (const item of attempts) if (item.length <= max) return item;
	return first.length <= max ? first : trimmed.slice(0, max);
}
function fitContact(raw, max = 35) {
	const { name, phone, digits } = splitContact(raw.trim());
	const pretty = phone || (digits ? formatBrPhone(digits) : "");
	const compact = compactPhone(phone || digits);
	const join = (label, number) => [label, number].filter(Boolean).join(" ");
	if (!pretty && !compact) return abbreviateName(name || raw.trim(), max);
	if (join(name, pretty).length <= max) return join(name, pretty);
	const shortName = abbreviateName(name, Math.max(0, max - pretty.length - (pretty ? 1 : 0)));
	if (join(shortName, pretty).length <= max) return join(shortName, pretty);
	return join(abbreviateName(name, Math.max(0, max - compact.length - (compact ? 1 : 0))), compact);
}
async function pickDeviceContact() {
	try {
		const picker = navigator.contacts;
		if (!picker?.select) return null;
		const available = await picker.getProperties?.() ?? ["name", "tel"];
		const props = ["name", "tel"].filter((key) => available.includes(key));
		const row = (await picker.select(props.length ? props : ["name"], { multiple: false }))[0];
		if (!row) return null;
		const raw = [row.name?.[0]?.trim() ?? "", row.tel?.[0] ? formatBrPhone(row.tel[0]) : ""].filter(Boolean).join(" ");
		return raw ? fitContact(raw) : null;
	} catch {
		return null;
	}
}
function ContactLine({ value }) {
	const { name, phone, digits } = splitContact(value);
	const call = telHref(digits);
	const whats = waHref(digits);
	if (!phone || !call) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: value });
	function keep(event) {
		event.stopPropagation();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "cal-contact",
		onClick: keep,
		onPointerDown: keep,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: call,
			className: "cal-contact-call",
			children: [name ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [name, " "] }) : null, phone]
		}), whats ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: whats,
			target: "_blank",
			rel: "noreferrer",
			className: "cal-contact-wa",
			children: "WhatsApp"
		}) : null]
	});
}
var DB = "calendae-files";
var STORE = "boleto";
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB, 1);
		req.onupgradeneeded = () => {
			if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
async function putBoletoFile(id, file) {
	const db = await openDb();
	const record = {
		blob: file,
		name: file.name,
		type: file.type || "application/octet-stream"
	};
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).put(record, id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}
async function getBoletoFile(id) {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const req = db.transaction(STORE, "readonly").objectStore(STORE).get(id);
		req.onsuccess = () => resolve(req.result ?? null);
		req.onerror = () => reject(req.error);
	});
}
async function deleteBoletoFile(id) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).delete(id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}
var BASIC_EMOJIS = [
	"🎂",
	"🎉",
	"❤️",
	"😊",
	"🎁",
	"🌸",
	"⭐",
	"🙏",
	"💐"
];
function countdownLabel(today, occurrence) {
	const days = Math.round((fromIso(occurrence).getTime() - fromIso(today).getTime()) / 864e5);
	if (days === 0) return "Hoje";
	if (days === 1) return "Falta 1 dia";
	if (days > 1) return `Faltam ${days} dias`;
	const ago = -days;
	return ago === 1 ? "Há 1 dia" : `Há ${ago} dias`;
}
function currentAge(birthIso, today) {
	const birthYear = Number(birthIso.slice(0, 4));
	const todayYear = Number(today.slice(0, 4));
	let age = todayYear - birthYear;
	if (today < birthdayIso(birthIso, todayYear)) age -= 1;
	return Math.max(0, age);
}
function agesLabel(thenAge, nowAge) {
	const then = Math.max(0, thenAge);
	const now = Math.max(0, nowAge);
	if (then === now) return then === 1 ? "1 ano" : `${then} anos`;
	return `${then}-${now} ${then === 1 && now === 1 ? "ano" : "anos"}`;
}
var WEEKDAY_SHORT = [
	"Dom",
	"Seg",
	"Ter",
	"Qua",
	"Qui",
	"Sex",
	"Sab"
];
function ageWithWeekday(thenAge, nowAge, iso) {
	return `(${agesLabel(thenAge, nowAge)}) ${WEEKDAY_SHORT[fromIso(iso).getDay()]}`;
}
function NotifyMark({ on, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": on ? "Desligar aviso" : "Ligar aviso",
		"aria-pressed": on,
		...withTip(on ? "Aviso ligado" : "Aviso", cn("flex size-8 shrink-0 items-center justify-center", on ? "text-fg" : "text-muted")),
		onClick: onToggle,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" })
	});
}
function MessageField({ value, onChange, onAttach }) {
	const wrapRef = (0, import_react.useRef)(null);
	const areaRef = (0, import_react.useRef)(null);
	const buttonRef = (0, import_react.useRef)(null);
	const popRef = (0, import_react.useRef)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [box, setBox] = (0, import_react.useState)({
		top: 0,
		left: 0
	});
	(0, import_react.useLayoutEffect)(() => {
		if (!open) return;
		const rect = buttonRef.current?.getBoundingClientRect();
		const pop = popRef.current?.getBoundingClientRect();
		if (!rect) return;
		const frame = document.querySelector(".cal-app")?.getBoundingClientRect() ?? {
			top: 0,
			bottom: window.innerHeight,
			left: 0,
			right: window.innerWidth
		};
		const gap = 6;
		const pad = 8;
		const width = pop?.width || 120;
		const height = pop?.height || 120;
		const below = frame.bottom - rect.bottom - gap - pad;
		const above = rect.top - frame.top - gap - pad;
		const top = below < height && above > below ? Math.max(frame.top + pad, rect.top - gap - height) : Math.min(rect.bottom + gap, frame.bottom - pad - height);
		let left = rect.right - width;
		if (left + width > frame.right - pad) left = frame.right - pad - width;
		if (left < frame.left + pad) left = frame.left + pad;
		setBox({
			top,
			left
		});
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		function close(event) {
			const node = event.target;
			if (wrapRef.current?.contains(node) || popRef.current?.contains(node)) return;
			setOpen(false);
		}
		document.addEventListener("pointerdown", close);
		return () => document.removeEventListener("pointerdown", close);
	}, [open]);
	function insert(emoji) {
		const area = areaRef.current;
		const start = area?.selectionStart ?? value.length;
		const end = area?.selectionEnd ?? value.length;
		onChange(`${value.slice(0, start)}${emoji}${value.slice(end)}`);
		const caret = start + emoji.length;
		setOpen(false);
		requestAnimationFrame(() => {
			area?.focus();
			area?.setSelectionRange(caret, caret);
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "relative flex items-start",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				ref: areaRef,
				value,
				rows: 2,
				onChange: (event) => onChange(event.target.value),
				placeholder: "Mensagem",
				className: "min-w-0 flex-1 resize-none rounded-xl bg-bg px-3 py-2 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "-mt-1.5 flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					ref: buttonRef,
					type: "button",
					"aria-label": "Inserir emoticon",
					...withTip("Emoticons", "flex size-8 shrink-0 items-center justify-center text-fg"),
					onClick: () => setOpen((current) => !current),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Anexar",
					...withTip("Anexar", "flex size-8 shrink-0 items-center justify-center text-fg"),
					onClick: onAttach,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4" })
				})]
			}),
			open ? (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: popRef,
				className: "cal-pick-menu is-fixed grid !max-h-none !w-auto grid-cols-3 gap-0.5 p-1.5",
				style: {
					position: "fixed",
					top: box.top,
					left: box.left,
					zIndex: 80
				},
				children: BASIC_EMOJIS.map((emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "flex size-8 items-center justify-center text-lg leading-none",
					onClick: () => insert(emoji),
					children: emoji
				}, emoji))
			}), document.body) : null
		]
	});
}
function BirthdaysTab({ year, month, today, selectedIso, weekStart, openId, birthdays, onAdd, onRemove, onUpdate, onOpen }) {
	const [glyphFlash, pingGlyph] = useGlyphFlash();
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [notify, setNotify] = (0, import_react.useState)(false);
	const [fileName, setFileName] = (0, import_react.useState)("");
	const [viewing, setViewing] = (0, import_react.useState)(null);
	const [dateIso, setDateIso] = (0, import_react.useState)(selectedIso);
	const fileRef = (0, import_react.useRef)(null);
	const pendingFile = (0, import_react.useRef)(null);
	function onName(next) {
		setName(next);
	}
	function finishName(value) {
		const pulled = pullPhone(value);
		if (!pulled) return;
		setName(pulled.name);
		setPhone(pulled.phone);
	}
	function onPhone(next) {
		const clean = next.replace(/[^\d+()\s.-]/g, "");
		const pulled = pullPhone(clean);
		setPhone(pulled?.phone || clean);
	}
	function keepFile(file) {
		if (file.size > 12582912) return;
		setFileName(file.name);
		const id = editingId || draftId.current;
		if (id) {
			pendingFile.current = null;
			putBoletoFile(id, file);
			return;
		}
		pendingFile.current = file;
	}
	function closeView() {
		setViewing((current) => {
			if (current) URL.revokeObjectURL(current.url);
			return null;
		});
	}
	function viewAttachment(id) {
		getBoletoFile(id).then((record) => {
			if (!record) return;
			const url = URL.createObjectURL(record.blob);
			setViewing((current) => {
				if (current) URL.revokeObjectURL(current.url);
				return {
					url,
					name: record.name,
					type: record.type
				};
			});
		});
	}
	function fillFromContacts() {
		pickDeviceContact().then((picked) => {
			if (!picked) return;
			const parts = splitContact(picked);
			if (parts.name) setName(parts.name);
			else setName(picked);
			if (parts.phone) setPhone(parts.phone);
		});
	}
	const onAddRef = (0, import_react.useRef)(onAdd);
	const onUpdateRef = (0, import_react.useRef)(onUpdate);
	const onRemoveRef = (0, import_react.useRef)(onRemove);
	const birthdaysRef = (0, import_react.useRef)(birthdays);
	const draftId = (0, import_react.useRef)(null);
	onAddRef.current = onAdd;
	onUpdateRef.current = onUpdate;
	onRemoveRef.current = onRemove;
	birthdaysRef.current = birthdays;
	(0, import_react.useEffect)(() => {
		if (!adding) return;
		const title = name.trim();
		if (!title) {
			if (draftId.current) {
				onRemoveRef.current(draftId.current);
				draftId.current = null;
			}
			return;
		}
		const next = {
			id: draftId.current ?? `birthday-${Date.now()}`,
			iso: dateIso,
			title,
			note: message.trim() || void 0,
			contact: phone.trim() || void 0,
			kind: "anual",
			source: "birthday",
			notify,
			fileName: fileName || void 0
		};
		if (!draftId.current) {
			draftId.current = next.id;
			onAddRef.current(next);
			if (pendingFile.current) {
				putBoletoFile(next.id, pendingFile.current);
				pendingFile.current = null;
			}
			return;
		}
		onUpdateRef.current(next);
	}, [
		adding,
		name,
		message,
		phone,
		dateIso,
		notify,
		fileName
	]);
	(0, import_react.useEffect)(() => {
		if (!editingId || adding) return;
		const title = name.trim();
		if (!title) return;
		const current = birthdaysRef.current.find((event) => event.id === editingId);
		if (!current) return;
		onUpdateRef.current({
			...current,
			title,
			iso: dateIso,
			note: message.trim() || void 0,
			contact: phone.trim() || void 0,
			kind: "anual",
			source: "birthday",
			notify,
			fileName: fileName || void 0
		});
	}, [
		editingId,
		adding,
		name,
		message,
		phone,
		dateIso,
		notify,
		fileName
	]);
	const visible = birthdays.filter((event) => {
		const born = Number(event.iso.slice(0, 4));
		if (!Number.isFinite(born) || year < born) return false;
		return birthdayIso(event.iso, year).slice(5, 7) === String(month + 1).padStart(2, "0");
	}).sort((a, b) => birthdayIso(a.iso, year).localeCompare(birthdayIso(b.iso, year)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "cal-tab",
		"data-cal-tab": "birthdays",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cal-tab-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "cal-tab-title",
					children: "Aniversários"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					...withTip("Novo"),
					"aria-label": "Novo aniversário",
					onClick: () => {
						pingGlyph();
						setEditingId(null);
						setAdding((open) => {
							if (open) draftId.current = null;
							return !open;
						});
						setName("");
						setMessage("");
						setPhone("");
						setNotify(false);
						setFileName("");
						pendingFile.current = null;
						setDateIso(selectedIso);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarGlyph, {
						className: "size-5",
						flash: glyphFlash
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "image/*,application/pdf,.pdf",
				className: "hidden",
				onChange: (event) => {
					const file = event.target.files?.[0];
					event.target.value = "";
					if (file) keepFile(file);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "Datas de aniversário, repetidas todo ano." }),
			adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 mt-3 flex flex-col gap-2 border-t border-line pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (event) => onName(event.target.value),
							onBlur: (event) => finishName(event.target.value),
							onKeyDown: (event) => {
								if (event.key === "Enter") finishName(event.currentTarget.value);
							},
							placeholder: "Nome",
							className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
							autoFocus: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Abrir contatos do celular",
							...withTip("Contatos", "flex size-8 shrink-0 items-center justify-center text-fg"),
							onClick: fillFromContacts,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageField, {
						value: message,
						onChange: setMessage,
						onAttach: () => fileRef.current?.click()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePick, {
							value: dateIso,
							weekStart,
							onChange: setDateIso
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 flex-1 items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: phone,
								onChange: (event) => onPhone(event.target.value),
								placeholder: "WhatsApp",
								inputMode: "tel",
								"aria-label": "Número do WhatsApp",
								className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-2 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotifyMark, {
								on: notify,
								onToggle: () => setNotify((on) => !on)
							})]
						})]
					}),
					fileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-muted",
						children: fileName
					}) : null
				]
			}) : null,
			visible.length === 0 && !adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 border-t border-line pt-3 text-pretty text-sm text-muted",
				children: "Nenhum aniversário neste mês."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1",
				children: visible.map((event) => {
					const birthYear = Number(event.iso.slice(0, 4));
					const occurrence = birthdayIso(event.iso, year);
					const shown = fromIso(occurrence);
					const age = year - birthYear;
					const open = openId === event.id;
					const editing = editingId === event.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							pingGlyph();
							setEditingId(null);
							onOpen(event);
						},
						className: cn("flex w-full items-baseline gap-3 border-t border-line py-3 text-left"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("cal-agenda-tone cal-dmy text-[0.8rem]", open ? "text-today" : "text-muted"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(shown.getDate()).padStart(2, "0") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(shown.getMonth() + 1).padStart(2, "0") })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("cal-agenda-tone min-w-0 flex-1 truncate text-sm", open ? "font-bold" : "font-medium"),
								children: event.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("cal-agenda-tone shrink-0 text-xs", open ? "font-bold text-fg" : "text-muted"),
								children: ageWithWeekday(age, currentAge(event.iso, today), occurrence)
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("cal-event-details", open && "is-open"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 pb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: name,
										onChange: (change) => onName(change.target.value),
										onBlur: (change) => finishName(change.target.value),
										onKeyDown: (change) => {
											if (change.key === "Enter") finishName(change.currentTarget.value);
										},
										placeholder: "Nome",
										className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Abrir contatos do celular",
										...withTip("Contatos", "flex size-8 shrink-0 items-center justify-center text-fg"),
										onClick: fillFromContacts,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageField, {
									value: message,
									onChange: setMessage,
									onAttach: () => fileRef.current?.click()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePick, {
										value: dateIso,
										weekStart,
										onChange: setDateIso
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex min-w-0 flex-1 items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: phone,
											onChange: (change) => onPhone(change.target.value),
											placeholder: "WhatsApp",
											inputMode: "tel",
											"aria-label": "Número do WhatsApp",
											className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-2 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotifyMark, {
											on: notify,
											onToggle: () => setNotify((on) => !on)
										})]
									})]
								}),
								fileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted",
									children: fileName
								}) : null
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cal-agenda-follow pb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 flex-col gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "m-0 text-xs text-muted",
									children: countdownLabel(today, occurrence)
								}), event.contact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "m-0 min-w-0 text-xs text-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactLine, { value: event.contact })
								}) : null]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end pb-3",
							children: [
								event.fileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Visualizar anexo",
									...withTip("Visualizar", "flex size-8 shrink-0 items-center justify-center text-muted"),
									onClick: () => viewAttachment(event.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileImage, { className: "size-4" })
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": event.notify ? "Desligar aviso" : "Ligar aviso",
									"aria-pressed": Boolean(event.notify),
									...withTip(event.notify ? "Aviso ligado" : "Aviso", cn("flex size-8 shrink-0 items-center justify-center", event.notify ? "text-fg" : "text-muted")),
									onClick: () => onUpdate({
										...event,
										notify: !event.notify
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `Editar ${event.title}`,
									...withTip("Editar", "flex size-8 items-center justify-center text-muted"),
									onClick: () => {
										setAdding(false);
										setEditingId((id) => id === event.id ? null : event.id);
										setName(event.title);
										setMessage(event.note ?? "");
										setPhone(event.contact ?? "");
										setNotify(Boolean(event.notify));
										setFileName(event.fileName ?? "");
										setDateIso(event.iso);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `Apagar ${event.title}`,
									...withTip("Apagar", "flex size-8 items-center justify-center text-muted"),
									onClick: () => {
										deleteBoletoFile(event.id);
										onRemove(event.id);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})
							]
						})] })
					})] }, event.id);
				})
			}),
			viewing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[90] flex items-center justify-center bg-black/55 p-4",
				onClick: closeView,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex max-h-full max-w-full flex-col gap-2",
					onClick: (event) => event.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "m-0 truncate text-center text-xs text-white",
						children: viewing.name
					}), viewing.type.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: viewing.url,
						alt: viewing.name,
						className: "max-h-[78vh] max-w-full object-contain"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						title: viewing.name,
						src: viewing.url,
						className: "h-[78vh] w-[86vw] max-w-3xl bg-white"
					})]
				})
			}) : null
		]
	});
}
function FormSlot({ id, children }) {
	const [node, setNode] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!id) {
			setNode(null);
			return;
		}
		setNode(document.getElementById(id));
	}, [id]);
	if (!id) return children;
	if (!node) return null;
	return (0, import_react_dom.createPortal)(children, node);
}
var THIRTEENTH_DEFAULT = {
	competenceMonths: [3, 4],
	source: "antecipacao-inss-2020",
	ruleYear: 2020
};
function carnivalRows(year) {
	return fallbackHolidays(year).filter((event) => /carnaval|cinzas/i.test(event.title)).map((event) => ({
		iso: event.iso,
		title: event.title
	}));
}
function buildAlmanacYear(year) {
	const election = isElectionYear(year) ? {
		race: electionRaceLabel(year),
		first: firstRoundIso(year),
		second: KNOWN_SECOND_ROUND_FEDERAL.has(year) ? secondRoundIso(year) : null,
		secondSource: KNOWN_SECOND_ROUND_FEDERAL.has(year) ? "known" : null
	} : null;
	return {
		year,
		carnival: carnivalRows(year),
		election,
		irpf: CONFIRMED_IRPF[year] ? {
			iso: CONFIRMED_IRPF[year],
			confirmed: true,
			source: "known",
			lots: projectedIrpfLots(year, CONFIRMED_IRPF[year])
		} : {
			iso: projectedIrpfIso(year),
			confirmed: false,
			source: null,
			lots: projectedIrpfLots(year, projectedIrpfIso(year))
		},
		thirteenth: { ...THIRTEENTH_DEFAULT },
		pis: CONFIRMED_PIS[year] ? {
			byMonth: CONFIRMED_PIS[year],
			confirmed: true,
			source: "known"
		} : year >= 2026 ? {
			byMonth: standingPisMap(year),
			confirmed: true,
			source: "codefat"
		} : null,
		fgts: CONFIRMED_FGTS[year] ? {
			byMonth: CONFIRMED_FGTS[year],
			confirmed: true,
			source: "known"
		} : null,
		builtAt: Date.now()
	};
}
var almanacMem = null;
function readAlmanacStore() {
	if (almanacMem) return almanacMem;
	try {
		const raw = takeLocal(ALMANAC_KEY, "almanaque-almanac");
		if (!raw) {
			almanacMem = {};
			return almanacMem;
		}
		const parsed = JSON.parse(raw);
		almanacMem = parsed && typeof parsed === "object" ? parsed : {};
		return almanacMem;
	} catch {
		almanacMem = {};
		return almanacMem;
	}
}
function writeAlmanacStore(store) {
	almanacMem = store;
	try {
		if (typeof localStorage === "undefined") return;
		localStorage.setItem(ALMANAC_KEY, JSON.stringify(store));
	} catch {}
}
function ensureAlmanac(year) {
	const store = readAlmanacStore();
	const key = String(year);
	const existing = store[key];
	if (existing?.year === year && Array.isArray(existing.carnival)) {
		if (!existing.irpf?.iso) {
			existing.irpf = CONFIRMED_IRPF[year] ? {
				iso: CONFIRMED_IRPF[year],
				confirmed: true,
				source: "known",
				lots: projectedIrpfLots(year, CONFIRMED_IRPF[year])
			} : {
				iso: projectedIrpfIso(year),
				confirmed: false,
				source: null,
				lots: projectedIrpfLots(year, projectedIrpfIso(year))
			};
			store[key] = existing;
			writeAlmanacStore(store);
		} else if (!existing.irpf.lots?.length) {
			existing.irpf.lots = projectedIrpfLots(year, existing.irpf.iso);
			store[key] = existing;
			writeAlmanacStore(store);
		}
		return existing;
	}
	const next = buildAlmanacYear(year);
	store[key] = next;
	writeAlmanacStore(store);
	return next;
}
function stampSecondRound(year, second, source) {
	const store = readAlmanacStore();
	const pack = store[String(year)] ?? buildAlmanacYear(year);
	if (!pack.election) {
		store[String(year)] = pack;
		writeAlmanacStore(store);
		return pack;
	}
	pack.election.second = second;
	pack.election.secondSource = second ? source : null;
	store[String(year)] = pack;
	writeAlmanacStore(store);
	return pack;
}
function stampIrpf(year, iso, source, lots) {
	const store = readAlmanacStore();
	const pack = store[String(year)] ?? buildAlmanacYear(year);
	pack.irpf = {
		iso,
		confirmed: true,
		source,
		lots: lots?.length ? lots : pack.irpf?.lots?.length ? pack.irpf.lots : projectedIrpfLots(year, iso)
	};
	store[String(year)] = pack;
	writeAlmanacStore(store);
	return pack;
}
function irpfForYear(year) {
	const row = ensureAlmanac(year).irpf;
	return irpfEvent(year, row.iso, row.confirmed);
}
function stampIrpfLots(year, lots) {
	const store = readAlmanacStore();
	const pack = store[String(year)] ?? buildAlmanacYear(year);
	pack.irpf = {
		...pack.irpf,
		lots
	};
	store[String(year)] = pack;
	writeAlmanacStore(store);
	return pack;
}
function irpfLotsForYear(year) {
	const row = ensureAlmanac(year).irpf;
	if (row.lots?.length) return row.lots;
	return projectedIrpfLots(year, row.iso);
}
function stampPis(year, byMonth, source, confirmed = true) {
	const store = readAlmanacStore();
	const pack = store[String(year)] ?? buildAlmanacYear(year);
	pack.pis = {
		byMonth,
		confirmed,
		source
	};
	store[String(year)] = pack;
	writeAlmanacStore(store);
	return pack;
}
function stampFgts(year, byMonth, source, confirmed = true) {
	const store = readAlmanacStore();
	const pack = store[String(year)] ?? buildAlmanacYear(year);
	pack.fgts = {
		byMonth,
		confirmed,
		source
	};
	store[String(year)] = pack;
	writeAlmanacStore(store);
	return pack;
}
function showElectionSecond(year, userOn) {
	if (userOn) return true;
	return Boolean(ensureAlmanac(year).election?.second);
}
function thirteenthMonths(year) {
	const months = ensureAlmanac(year).thirteenth.competenceMonths;
	return months.length ? months : THIRTEENTH_DEFAULT.competenceMonths;
}
function dayAfter(iso) {
	const date = fromIso(iso);
	return toIso(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
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
/** Last digit before the hyphen (DV after it). 0104-7 → 4. */
function sanitizeInssField(raw) {
	return raw.replace(/[^0-9Bb-]/g, "").replace(/b/g, "B");
}
function parseNb(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const hyphen = trimmed.match(/^(.*)-(\d)\s*$/);
	if (hyphen) {
		const before = hyphen[1].replace(/\D/g, "");
		if (!before) return null;
		return {
			digits: `${before}${hyphen[2]}`,
			digit: Number(before.at(-1))
		};
	}
	const digits = trimmed.replace(/\D/g, "");
	if (!digits) return null;
	if (digits.length === 1) return {
		digits,
		digit: Number(digits)
	};
	if (digits.length >= 10) return {
		digits,
		digit: Number(digits[digits.length - 2])
	};
	return {
		digits,
		digit: Number(digits.at(-1))
	};
}
function isBpcEspecie(raw) {
	const digits = raw.replace(/\D/g, "");
	return digits === "87" || digits === "88";
}
var ESPECIES = {
	"01": {
		name: "Pensão por morte do trabalhador rural",
		short: "Pens. Rural"
	},
	"02": {
		name: "Pensão por morte acidentária do trabalhador rural",
		short: "Pens. Rural Ac."
	},
	"03": {
		name: "Pensão por morte do empregador rural",
		short: "Pens. Empr. Rural"
	},
	"04": {
		name: "Aposentadoria por incapacidade permanente do trabalhador rural",
		short: "Ap. Rural"
	},
	"05": {
		name: "Aposentadoria por incapacidade permanente acidentária do trabalhador rural",
		short: "Ap. Rural Ac."
	},
	"06": {
		name: "Aposentadoria por incapacidade permanente do empregador rural",
		short: "Ap. Empr. Rural"
	},
	"07": {
		name: "Aposentadoria por idade do trabalhador rural",
		short: "Ap. Idade Rural"
	},
	"08": {
		name: "Aposentadoria por idade do empregador rural",
		short: "Ap. Idade Empr."
	},
	"10": {
		name: "Auxílio por incapacidade temporária acidentário do trabalhador rural",
		short: "Aux. Rural Ac."
	},
	"11": {
		name: "Renda mensal vitalícia por invalidez do trabalhador rural",
		short: "RMV Inv. Rural"
	},
	"12": {
		name: "Renda mensal vitalícia por idade do trabalhador rural",
		short: "RMV Idade Rural"
	},
	"13": {
		name: "Auxílio por incapacidade temporária do trabalhador rural",
		short: "Aux. Rural"
	},
	"15": {
		name: "Auxílio-reclusão do trabalhador rural",
		short: "Aux. Recl. Rural"
	},
	"21": {
		name: "Pensão por morte",
		short: "Pens. Morte"
	},
	"23": {
		name: "Pensão por morte de ex-combatente",
		short: "Pens. Ex-comb."
	},
	"25": {
		name: "Auxílio-reclusão",
		short: "Aux. Reclusão"
	},
	"27": {
		name: "Pensão por morte de servidor público federal",
		short: "Pens. Servidor"
	},
	"28": {
		name: "Pensão por morte (RGPS antigo)",
		short: "Pens. RGPS"
	},
	"29": {
		name: "Pensão por morte de ex-combatente marítimo",
		short: "Pens. Marít."
	},
	"30": {
		name: "Renda mensal vitalícia por invalidez",
		short: "RMV Invalidez"
	},
	"31": {
		name: "Auxílio por incapacidade temporária",
		short: "Aux. Incap. Temp."
	},
	"32": {
		name: "Aposentadoria por incapacidade permanente",
		short: "Ap. Incap. Perm."
	},
	"33": {
		name: "Aposentadoria por incapacidade permanente de aeronauta",
		short: "Ap. Aeronauta"
	},
	"34": {
		name: "Aposentadoria por incapacidade permanente de ex-combatente marítimo",
		short: "Ap. Marít."
	},
	"36": {
		name: "Auxílio-acidente",
		short: "Aux. Acidente"
	},
	"40": {
		name: "Renda mensal vitalícia por idade",
		short: "RMV Idade"
	},
	"41": {
		name: "Aposentadoria por idade",
		short: "Ap. Idade"
	},
	"42": {
		name: "Aposentadoria por tempo de contribuição",
		short: "Ap. Tempo"
	},
	"43": {
		name: "Aposentadoria por tempo de contribuição de ex-combatente",
		short: "Ap. Tempo Ex-c."
	},
	"44": {
		name: "Aposentadoria por tempo de contribuição de aeronauta",
		short: "Ap. Tempo Aer."
	},
	"45": {
		name: "Aposentadoria por tempo de contribuição de jornalista",
		short: "Ap. Tempo Jorn."
	},
	"46": {
		name: "Aposentadoria especial",
		short: "Ap. Especial"
	},
	"47": {
		name: "Abono de permanência em serviço 25%",
		short: "Abono 25%"
	},
	"48": {
		name: "Abono de permanência em serviço 20%",
		short: "Abono 20%"
	},
	"49": {
		name: "Aposentadoria por tempo de contribuição ordinária",
		short: "Ap. Tempo Ord."
	},
	"50": {
		name: "Auxílio por incapacidade temporária (plano básico)",
		short: "Aux. Plano Bás."
	},
	"51": {
		name: "Aposentadoria por incapacidade permanente (plano básico)",
		short: "Ap. Plano Bás."
	},
	"52": {
		name: "Aposentadoria por idade (plano básico)",
		short: "Ap. Idade Bás."
	},
	"54": {
		name: "Pensão especial vitalícia",
		short: "Pens. Especial"
	},
	"55": {
		name: "Pensão por morte (plano básico)",
		short: "Pens. Plano Bás."
	},
	"56": {
		name: "Pensão por síndrome de talidomida",
		short: "Pens. Talidom."
	},
	"57": {
		name: "Aposentadoria de professor",
		short: "Ap. Professor"
	},
	"68": {
		name: "Pecúlio especial de aposentadoria",
		short: "Pecúlio"
	},
	"72": {
		name: "Aposentadoria por tempo de contribuição de ex-combatente marítimo",
		short: "Ap. Tempo Mar."
	},
	"76": {
		name: "Salário-família",
		short: "Sal. Família"
	},
	"78": {
		name: "Aposentadoria por idade de ex-combatente marítimo",
		short: "Ap. Idade Mar."
	},
	"79": {
		name: "Abono de servidor aposentado",
		short: "Abono Servidor"
	},
	"80": {
		name: "Salário-maternidade",
		short: "Sal. Maternid."
	},
	"81": {
		name: "Aposentadoria por idade compulsória",
		short: "Ap. Compulsória"
	},
	"82": {
		name: "Aposentadoria por tempo de contribuição (Ex-SASSE)",
		short: "Ap. Tempo SASSE"
	},
	"83": {
		name: "Aposentadoria por incapacidade permanente (Ex-SASSE)",
		short: "Ap. Incap. SASSE"
	},
	"84": {
		name: "Pensão por morte (Ex-SASSE)",
		short: "Pens. SASSE"
	},
	"85": {
		name: "Pensão mensal vitalícia do seringueiro",
		short: "Pens. Sering."
	},
	"86": {
		name: "Pensão mensal vitalícia do dependente do seringueiro",
		short: "Pens. Dep. Ser."
	},
	"87": {
		name: "BPC à pessoa com deficiência",
		short: "BPC Defic."
	},
	"88": {
		name: "BPC ao idoso",
		short: "BPC Idoso"
	},
	"91": {
		name: "Auxílio por incapacidade temporária acidentário",
		short: "Aux. Incap. Ac."
	},
	"92": {
		name: "Aposentadoria por incapacidade permanente acidentária",
		short: "Ap. Incap. Ac."
	},
	"93": {
		name: "Pensão por morte acidentária",
		short: "Pens. Morte Ac."
	},
	"94": {
		name: "Auxílio-acidente",
		short: "Aux. Acidente"
	},
	"95": {
		name: "Auxílio-suplementar acidentário",
		short: "Aux. Suplem."
	}
};
function especieCode(raw) {
	const digits = (raw ?? "").replace(/\D/g, "");
	if (!digits) return "";
	if (digits.length === 1) return digits.padStart(2, "0");
	return digits.slice(0, 2).padStart(2, "0");
}
function especieInfo(raw) {
	const code = especieCode(raw);
	if (!code) return null;
	return ESPECIES[code] ?? null;
}
function withCheckHyphen(raw) {
	const digits = raw.replace(/\D/g, "");
	if (digits.length < 2) return digits;
	return `${digits.slice(0, -1)}-${digits.slice(-1)}`;
}
function parseEspecieField(raw) {
	const compact = sanitizeInssField(raw.replace(/\s+/g, ""));
	const prefix = compact.startsWith("B") ? "B" : "";
	const rest = prefix ? compact.slice(1) : compact;
	const digits = rest.replace(/\D/g, "");
	if (digits.length === 12) return {
		especie: `${prefix}${digits.slice(0, 2)}`,
		nb: withCheckHyphen(digits.slice(2))
	};
	if (digits.length === 10) return {
		especie: "",
		nb: withCheckHyphen(digits)
	};
	if (digits.length >= 2 && !rest.includes("-")) return {
		especie: compact,
		nb: null
	};
	return {
		especie: compact,
		nb: null
	};
}
function parseNbField(raw) {
	const compact = sanitizeInssField(raw.replace(/\s+/g, ""));
	const prefix = compact.startsWith("B") ? "B" : "";
	const digits = (prefix ? compact.slice(1) : compact).replace(/\D/g, "");
	if (digits.length === 12) return {
		especie: `${prefix}${digits.slice(0, 2)}`,
		nb: withCheckHyphen(digits.slice(2))
	};
	if (digits.length === 10 && !compact.includes("-")) return {
		especie: null,
		nb: withCheckHyphen(digits)
	};
	return {
		especie: null,
		nb: compact
	};
}
function isAutoPayTitle(title) {
	return !title || /^INSS final\b/i.test(title) || /\bfinal\s+\d\b/i.test(title) || /^Espécie\s+\d+\b/i.test(title) || /^B?\d{2}\b/.test(title);
}
function benefitPayTitle(event) {
	const custom = event.title.trim();
	if (custom && !isAutoPayTitle(custom)) return custom;
	const info = especieInfo(event.especie);
	if (info) return info.name;
	const code = especieCode(event.especie);
	return code ? `Espécie ${code}` : custom || "Benefício";
}
function benefitThirteenthTitle(event) {
	const custom = event.title.trim();
	if (custom && !isAutoPayTitle(custom)) return `13º ${custom}`;
	const info = especieInfo(event.especie);
	if (info) return `13º ${info.short}`;
	const pay = benefitPayTitle(event);
	return pay === "Benefício" ? "13º" : `13º ${pay}`;
}
function formatNb(digits) {
	const clean = digits.replace(/\D/g, "");
	if (clean.length < 2) return clean;
	const body = clean.slice(0, -1);
	const dv = clean.slice(-1);
	return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${dv}`;
}
function holidaySet(...years) {
	return new Set(years.flatMap((year) => fallbackHolidays(year).map((event) => event.iso)));
}
function isInssOff(date, holidays) {
	const dow = date.getDay();
	if (dow === 0 || dow === 6) return true;
	if (holidays.has(toIso(date))) return true;
	if (date.getMonth() === 11 && (date.getDate() === 24 || date.getDate() === 31)) return true;
	return false;
}
function lastBankingDays(year, month, count) {
	const holidays = holidaySet(year - 1, year);
	const dates = [];
	const cursor = civilDate(year, month + 1, 0);
	while (dates.length < count) {
		if (!isInssOff(cursor, holidays)) dates.push(new Date(cursor));
		cursor.setDate(cursor.getDate() - 1);
	}
	return dates.reverse();
}
function firstBankingDays(year, month, count) {
	const holidays = holidaySet(year, year + 1);
	const dates = [];
	const cursor = civilDate(year, month, 1);
	while (dates.length < count) {
		if (!isInssOff(cursor, holidays)) dates.push(new Date(cursor));
		cursor.setDate(cursor.getDate() + 1);
	}
	return dates;
}
function acimaIndex(digit) {
	if (digit === 1 || digit === 6) return 0;
	if (digit === 2 || digit === 7) return 1;
	if (digit === 3 || digit === 8) return 2;
	if (digit === 4 || digit === 9) return 3;
	return 4;
}
var published = /* @__PURE__ */ new Map();
function rememberInssTable(year, table) {
	if (!table) published.delete(year);
	else published.set(year, table);
}
function snapBanking(iso) {
	const date = fromIso(iso);
	const holidays = holidaySet(date.getFullYear() - 1, date.getFullYear(), date.getFullYear() + 1);
	for (let i = 0; i < 6 && isInssOff(date, holidays); i += 1) date.setDate(date.getDate() + 1);
	return toIso(date);
}
/**
* Deposit date for this competence month (may fall in the next calendar month).
* Prefers a published Agência Brasil table when synced; otherwise 10 banking days.
* Weekend/holiday cells in the PDF snap to the next banking day (real deposit).
*/
function inssCompetencePay(year, competenceMonth, digit, bracket = "minimo") {
	const d = (digit % 10 + 10) % 10;
	const publishedIso = published.get(year)?.[bracket]?.[d]?.[competenceMonth];
	if (publishedIso) return snapBanking(publishedIso);
	if (bracket === "minimo" && d >= 1 && d <= 5) return toIso(lastBankingDays(year, competenceMonth, 5)[d - 1]);
	const next = competenceMonth === 11 ? {
		year: year + 1,
		month: 0
	} : {
		year,
		month: competenceMonth + 1
	};
	const index = bracket === "acima" ? acimaIndex(d) : d === 0 ? 4 : d - 6;
	return toIso(firstBankingDays(next.year, next.month, 5)[index]);
}
/** INSS 13º has been paid with April + May deposits since 2020 (antecipação). Not BPC. */
function inssThirteenth(year, digit, bracket = "minimo", competenceMonths = [3, 4]) {
	return (competenceMonths.length ? competenceMonths : [3, 4]).map((competence, index) => ({
		iso: inssCompetencePay(year, competence, digit, bracket),
		label: `${index + 1}ª parcela`
	}));
}
/** Deposit that actually lands on this calendar month (previous competence may spill in). */
function inssPayIso(year, month, digit, bracket = "minimo") {
	return [inssCompetencePay(year, month, digit, bracket), inssCompetencePay(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, digit, bracket)].find((iso) => {
		const date = fromIso(iso);
		return date.getFullYear() === year && date.getMonth() === month;
	}) ?? null;
}
function inssCompetenceLabel(payIso, digit, bracket) {
	const date = fromIso(payIso);
	for (const delta of [
		0,
		-1,
		-2,
		1
	]) {
		const probe = new Date(date.getFullYear(), date.getMonth() + delta, 1);
		if (inssCompetencePay(probe.getFullYear(), probe.getMonth(), digit, bracket) === payIso) {
			const label = MONTHS[probe.getMonth()];
			return label.charAt(0).toUpperCase() + label.slice(1);
		}
	}
	return "";
}
function formatPayDay(iso) {
	return String(fromIso(iso).getDate()).padStart(2, "0");
}
var BRACKETS = [{
	value: "minimo",
	label: "até um salário mínimo"
}, {
	value: "acima",
	label: "acima de um salário mínimo"
}];
function FaixaPick({ value, onChange }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "cal-kind-pick is-long flex items-center gap-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderMenu, {
			label: "Faixa do INSS",
			value,
			options: BRACKETS,
			open,
			wide: true,
			fixed: true,
			soft: true,
			buttonClassName: "cal-kind-btn",
			optionClassName: "cal-kind-option",
			onOpen: () => setOpen(true),
			onClose: () => setOpen(false),
			onPick: (next) => {
				onChange(next);
				setOpen(false);
			}
		})
	});
}
function BenefitsTab({ year, month, today, openId, benefits, onAdd, onRemove, onUpdate, onOpen, framed = true, adding: addingProp, formSlot = null }) {
	const [glyphFlash, pingGlyph] = useGlyphFlash();
	const [addingSelf, setAddingSelf] = (0, import_react.useState)(false);
	const adding = addingProp ?? addingSelf;
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [nb, setNb] = (0, import_react.useState)("");
	const [especie, setEspecie] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [bracket, setBracket] = (0, import_react.useState)("minimo");
	const draftIdRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (adding) return;
		if (editingId) return;
		if (draftIdRef.current && !nb.trim() && !especie.trim()) onRemove(draftIdRef.current);
		setNb("");
		setEspecie("");
		setName("");
		setBracket("minimo");
		draftIdRef.current = null;
	}, [adding, editingId]);
	const parsed = parseNb(nb);
	const previewIso = parsed ? inssCompetencePay(year, month, parsed.digit, bracket) : null;
	const visible = benefits.flatMap((event) => {
		const parsedNb = parseNb(event.nb ?? "");
		if (!parsedNb) return [];
		const digit = parsedNb.digit;
		const eventBracket = event.bracket ?? "minimo";
		const iso = inssPayIso(year, month, digit, eventBracket);
		const rows = [];
		if (iso) rows.push({
			event,
			iso,
			digit,
			tag: null
		});
		if (!isBpcEspecie(event.especie ?? "")) for (const extra of inssThirteenth(year, digit, eventBracket, thirteenthMonths(year))) {
			const date = fromIso(extra.iso);
			if (date.getFullYear() === year && date.getMonth() === month) rows.push({
				event,
				iso: extra.iso,
				digit,
				tag: extra.label
			});
		}
		return rows;
	}).sort((a, b) => a.iso.localeCompare(b.iso) || (a.tag ?? "").localeCompare(b.tag ?? ""));
	function resetForm() {
		setNb("");
		setEspecie("");
		setName("");
		setBracket("minimo");
		setEditingId(null);
		draftIdRef.current = null;
	}
	function persist(next) {
		const nbVal = next.nb ?? nb;
		const espVal = next.especie ?? especie;
		const nameVal = next.name ?? name;
		const bracketVal = next.bracket ?? bracket;
		const parsedNb = parseNb(nbVal);
		const digits = parsedNb?.digits.replace(/\D/g, "") ?? "";
		const ready = Boolean(parsedNb && (digits.length >= 10 || nbVal.includes("-")));
		const target = editingId ?? draftIdRef.current;
		if (!ready) {
			if (!editingId && draftIdRef.current) {
				onRemove(draftIdRef.current);
				draftIdRef.current = null;
			}
			return;
		}
		const pay = inssCompetencePay(year, month, parsedNb.digit, bracketVal);
		if (!pay) return;
		const bpcNow = isBpcEspecie(espVal);
		const info = especieInfo(espVal);
		const patch = {
			title: nameVal.trim() || info?.name || (especieCode(espVal) ? `Espécie ${especieCode(espVal)}` : "Benefício"),
			iso: pay,
			nb: parsedNb.digits,
			especie: espVal.trim() || void 0,
			bracket: bracketVal,
			thirteenth: !bpcNow,
			kind: "mensal",
			source: "benefit"
		};
		if (target) {
			const current = benefits.find((event) => event.id === target);
			if (current) onUpdate({
				...current,
				...patch
			});
			return;
		}
		const id = newEventId();
		draftIdRef.current = id;
		onAdd({
			id,
			...patch
		});
	}
	function payHint() {
		if (!parsed || !previewIso) return null;
		const date = fromIso(previewIso);
		return `Final ${parsed.digit}: depósito em ${date.getDate()} de ${MONTHS$1[date.getMonth()]}.`;
	}
	const hint = payHint();
	const formFields = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: especie,
				onChange: (event) => {
					const parsedField = parseEspecieField(event.target.value);
					setEspecie(parsedField.especie);
					if (parsedField.nb) setNb(parsedField.nb);
					persist({
						especie: parsedField.especie,
						nb: parsedField.nb || void 0
					});
				},
				placeholder: "B21",
				"aria-label": "Espécie",
				maxLength: 22,
				autoCapitalize: "characters",
				autoCorrect: "off",
				spellCheck: false,
				className: "cal-num-field h-11 w-[4.5rem] shrink-0 rounded-xl bg-bg px-2 text-center text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
				autoFocus: adding && !editingId
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: nb,
				onChange: (event) => {
					const parsedField = parseNbField(event.target.value);
					if (parsedField.especie != null) setEspecie(parsedField.especie);
					setNb(parsedField.nb);
					persist({
						nb: parsedField.nb,
						especie: parsedField.especie ?? void 0
					});
				},
				placeholder: "NB",
				"aria-label": "Número do benefício",
				inputMode: "text",
				autoCorrect: "off",
				spellCheck: false,
				className: "cal-num-field h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: name,
			onChange: (event) => {
				setName(event.target.value);
				persist({ name: event.target.value });
			},
			placeholder: "Nome (opcional)",
			className: "h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaixaPick, {
			value: bracket,
			onChange: (value) => {
				setBracket(value);
				persist({ bracket: value });
			}
		}),
		hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: hint
		}) : null
	] });
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		framed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cal-tab-head",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "cal-tab-title",
				children: "INSS"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				...withTip("Novo"),
				"aria-label": "Novo recebimento",
				onClick: () => {
					pingGlyph();
					resetForm();
					setAddingSelf((v) => !v);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarGlyph, {
					className: "size-5",
					flash: glyphFlash
				})
			})]
		}) : null,
		framed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "Dia em que o benefício do INSS cai na conta." }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSlot, {
			id: formSlot,
			children: adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [framed ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-fg",
					children: "INSS"
				}), formFields]
			}) : null
		}),
		visible.length === 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "cal-ruled mt-1",
			children: visible.map(({ event, iso, digit, tag }) => {
				const open = openId === event.id;
				const past = iso < today;
				const editing = editingId === event.id;
				const competence = inssCompetenceLabel(iso, digit, event.bracket ?? "minimo");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						pingGlyph();
						setEditingId(null);
						onOpen(event, iso);
					},
					className: cn("flex w-full items-baseline gap-3 border-t border-line py-3 text-left", past && "opacity-55"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone min-w-8 shrink-0 tabular-nums text-sm", open ? "text-today" : "text-muted"),
							children: formatPayDay(iso)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone min-w-0 flex-1 truncate text-sm", open ? "font-bold" : "font-medium"),
							children: tag ? benefitThirteenthTitle(event) : benefitPayTitle(event)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone flex shrink-0 items-baseline gap-2.5 text-xs", open ? "font-bold text-fg" : "text-muted"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"(",
								tag ?? "mensal",
								")"
							] })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("cal-event-details", open && "is-open"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-2 pb-3",
						children: formFields
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 pb-3 pl-11 text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							event.especie ? `Espécie ${event.especie} · ` : "",
							"NB ",
							formatNb(event.nb ?? "")
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [event.bracket === "acima" ? "(maior salário)" : "(único salário)", competence ? ` competência ${competence}` : ""] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": `Editar ${event.title}`,
							...withTip("Editar", "flex size-8 items-center justify-center text-muted"),
							onClick: () => {
								if (addingProp === void 0) setAddingSelf(false);
								draftIdRef.current = null;
								setEditingId((id) => id === event.id ? null : event.id);
								setNb(sanitizeInssField(event.nb ?? ""));
								setEspecie(sanitizeInssField(event.especie ?? ""));
								setName(event.title === benefitPayTitle({
									title: "",
									especie: event.especie
								}) || event.title.startsWith("INSS final") || /\bfinal\s+\d\b/i.test(event.title) || event.title === especieInfo(event.especie)?.name ? "" : event.title);
								setBracket(event.bracket ?? "minimo");
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": `Apagar ${event.title}`,
							...withTip("Apagar", "flex size-8 items-center justify-center text-muted"),
							onClick: () => onRemove(event.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					})] })
				})] }, `${event.id}:${iso}:${tag ?? "pay"}`);
			})
		})
	] });
	if (!framed) return body;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "cal-tab",
		children: body
	});
}
var BANKS = {
	"001": "Banco do Brasil",
	"004": "Banco do Nordeste",
	"021": "Banestes",
	"033": "Santander",
	"041": "Banrisul",
	"047": "Banese",
	"070": "BRB",
	"077": "Inter",
	"085": "Ailos",
	"104": "Caixa",
	"121": "Agibank",
	"136": "Unicred",
	"208": "BTG Pactual",
	"212": "Banco Original",
	"237": "Bradesco",
	"260": "Nubank",
	"318": "BMG",
	"336": "C6 Bank",
	"341": "Itaú",
	"389": "Mercantil",
	"422": "Safra",
	"623": "Banco Pan",
	"637": "Sofisa",
	"655": "Itaú Unibanco",
	"745": "Citibank",
	"748": "Sicredi",
	"756": "Sicoob"
};
var SEGMENTS = {
	"1": "Prefeitura",
	"2": "Saneamento",
	"3": "Energia elétrica e gás",
	"4": "Telecomunicações",
	"5": "Órgãos governamentais",
	"6": "Carnes e assemelhados",
	"7": "Multas de trânsito",
	"9": "Uso exclusivo do banco"
};
/** Only digits. Linha digitável 47/48 or barcode 44. */
function sanitizeBarcode(raw) {
	return raw.replace(/\D/g, "").slice(0, 48);
}
function sanitizeAmount(raw) {
	let text = raw.replace(/[^\d.,]/g, "");
	const comma = text.lastIndexOf(",");
	if (comma >= 0) return `${text.slice(0, comma).replace(/[^\d.]/g, "")},${text.slice(comma + 1).replace(/\D/g, "").slice(0, 2)}`;
	return text.replace(/[^\d.]/g, "");
}
var ONES = [
	"",
	"um",
	"dois",
	"três",
	"quatro",
	"cinco",
	"seis",
	"sete",
	"oito",
	"nove"
];
var TEENS = [
	"dez",
	"onze",
	"doze",
	"treze",
	"quatorze",
	"quinze",
	"dezesseis",
	"dezessete",
	"dezoito",
	"dezenove"
];
var TENS = [
	"",
	"",
	"vinte",
	"trinta",
	"quarenta",
	"cinquenta",
	"sessenta",
	"setenta",
	"oitenta",
	"noventa"
];
var HUNDREDS = [
	"",
	"cento",
	"duzentos",
	"trezentos",
	"quatrocentos",
	"quinhentos",
	"seiscentos",
	"setecentos",
	"oitocentos",
	"novecentos"
];
function below100(n) {
	if (n < 10) return ONES[n];
	if (n < 20) return TEENS[n - 10];
	const ten = Math.floor(n / 10);
	const one = n % 10;
	return one ? `${TENS[ten]} e ${ONES[one]}` : TENS[ten];
}
function below1000(n) {
	if (n === 100) return "cem";
	const hundred = Math.floor(n / 100);
	const rest = n % 100;
	if (!hundred) return below100(rest);
	if (!rest) return HUNDREDS[hundred];
	return `${HUNDREDS[hundred]} e ${below100(rest)}`;
}
function integerWords(n) {
	if (n === 0) return "zero";
	const classes = [];
	const scales = [
		[
			1e9,
			"bilhão",
			"bilhões"
		],
		[
			1e6,
			"milhão",
			"milhões"
		],
		[
			1e3,
			"mil",
			"mil"
		]
	];
	let left = n;
	for (const [div, one, many] of scales) {
		const count = Math.floor(left / div);
		if (!count) continue;
		left %= div;
		const text = div === 1e3 ? count === 1 ? "mil" : `${below1000(count)} mil` : count === 1 ? `um ${one}` : `${below1000(count)} ${many}`;
		classes.push({
			text,
			n: count,
			big: div >= 1e6
		});
	}
	if (left) classes.push({
		text: below1000(left),
		n: left,
		big: false
	});
	return classes.map((part, index) => {
		if (index === 0) return part.text;
		const last = index === classes.length - 1;
		const round = part.n < 100 || part.n % 100 === 0;
		if (last && round) return ` e ${part.text}`;
		if (classes[index - 1]?.big) return `, ${part.text}`;
		return ` ${part.text}`;
	}).join("");
}
function parseReais(raw) {
	const text = raw.trim();
	if (!text || !/^[\d.,]+$/.test(text)) return null;
	const comma = text.lastIndexOf(",");
	const reaisText = (comma >= 0 ? text.slice(0, comma) : text).replace(/\./g, "").replace(/\D/g, "");
	const centsText = comma >= 0 ? text.slice(comma + 1).replace(/\D/g, "").padEnd(2, "0").slice(0, 2) : "00";
	if (!reaisText && !centsText) return null;
	const reais = Number(reaisText || "0");
	const cents = Number(centsText || "0");
	if (!Number.isFinite(reais) || !Number.isFinite(cents) || reais < 0 || cents < 0 || reais > 999999999999) return null;
	return {
		reais,
		cents
	};
}
/** "100,05" → "cem reais e cinco centavos". */
function amountInWords(raw) {
	const parsed = parseReais(raw);
	if (!parsed) return raw;
	const { reais, cents } = parsed;
	const reaisText = reais === 0 ? "" : `${integerWords(reais)}${reais % 1e6 === 0 && reais >= 1e6 ? " de" : ""} ${reais === 1 ? "real" : "reais"}`;
	const centsText = cents === 0 ? "" : `${integerWords(cents)} ${cents === 1 ? "centavo" : "centavos"}`;
	if (reaisText && centsText) return `${reaisText} e ${centsText}`;
	return reaisText || centsText || "zero reais";
}
function sanitizeBank(raw) {
	return raw.replace(/[^A-Za-zÀ-ÿ .'-]/g, "").slice(0, 40);
}
function bankName(code) {
	return BANKS[code] ?? `Banco ${code}`;
}
function centsAmount(raw) {
	if (!raw || !/^\d+$/.test(raw)) return void 0;
	const cents = Number(raw);
	if (!Number.isFinite(cents) || cents <= 0) return void 0;
	return (cents / 100).toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}
/** FEBRABAN: 22/02/2025 = fator 1000. 0000 = sem vencimento no código. */
function fatorIso(fator) {
	if (!Number.isFinite(fator) || fator < 1e3) return void 0;
	const date = civilDate(2025, 1, 22);
	date.setDate(date.getDate() + (fator - 1e3));
	return toIso(date);
}
function fromBarras44(bar) {
	if (bar[0] === "8") {
		const segment = SEGMENTS[bar[1]] ?? "Concessionária";
		return {
			amount: centsAmount(bar.slice(4, 15)),
			bank: segment,
			kind: "arrecadacao"
		};
	}
	const bank = bankName(bar.slice(0, 3));
	return {
		iso: fatorIso(Number(bar.slice(5, 9))),
		amount: centsAmount(bar.slice(9, 19)),
		bank,
		kind: "banco"
	};
}
function linha47to44(linha) {
	return linha.slice(0, 4) + linha.slice(32, 33) + linha.slice(33, 47) + linha.slice(4, 9) + linha.slice(10, 20) + linha.slice(21, 31);
}
function linha48to44(linha) {
	return [
		0,
		1,
		2,
		3
	].map((i) => linha.slice(i * 12, i * 12 + 11)).join("");
}
function parseBoleto(raw) {
	const digits = sanitizeBarcode(raw);
	if (digits.length === 47 && digits[0] !== "8") return fromBarras44(linha47to44(digits));
	if (digits.length === 48 || digits.length === 44 && digits[0] === "8") return fromBarras44(digits.length === 48 ? linha48to44(digits) : digits);
	if (digits.length === 44) return fromBarras44(digits);
	if (digits.length >= 3 && digits[0] !== "8") return {
		bank: bankName(digits.slice(0, 3)),
		kind: "banco"
	};
	return { kind: null };
}
function boletoHasData(code, amount, bank, iso, selected) {
	const digits = sanitizeBarcode(code);
	if (digits.length >= 44) return true;
	if (amount.trim()) return true;
	if (bank.trim() && digits.length === 0) return true;
	return Boolean(iso && iso !== selected && (amount.trim() || bank.trim()));
}
function makeDetector() {
	const Ctor = window.BarcodeDetector;
	if (!Ctor) return null;
	try {
		return new Ctor({ formats: [
			"itf",
			"code_128",
			"codabar",
			"code_39"
		] });
	} catch {
		try {
			return new Ctor();
		} catch {
			return null;
		}
	}
}
function pickDigits(raw) {
	return sanitizeBarcode(raw);
}
function BarcodeScanButton({ onRead }) {
	const [live, setLive] = (0, import_react.useState)(false);
	const [flash, ping] = useGlyphFlash();
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const loopRef = (0, import_react.useRef)(0);
	function stop() {
		cancelAnimationFrame(loopRef.current);
		streamRef.current?.getTracks().forEach((track) => track.stop());
		streamRef.current = null;
		setLive(false);
	}
	(0, import_react.useEffect)(() => () => stop(), []);
	async function fromSource(source) {
		const detector = makeDetector();
		if (!detector) return "";
		const codes = await detector.detect(source);
		for (const code of codes) {
			const digits = pickDigits(code.rawValue);
			if (digits.length >= 44) return digits;
		}
		return "";
	}
	async function loop() {
		const video = videoRef.current;
		if (!video || video.readyState < 2) {
			loopRef.current = requestAnimationFrame(() => void loop());
			return;
		}
		try {
			const digits = await fromSource(video);
			if (digits) {
				onRead(digits);
				stop();
				return;
			}
		} catch {}
		loopRef.current = requestAnimationFrame(() => void loop());
	}
	async function openCamera() {
		if (!navigator.mediaDevices?.getUserMedia) {
			fileRef.current?.click();
			return;
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: { ideal: "environment" } },
				audio: false
			});
			streamRef.current = stream;
			setLive(true);
			requestAnimationFrame(() => {
				const video = videoRef.current;
				if (!video) return;
				video.srcObject = stream;
				video.play().then(() => void loop());
			});
		} catch {
			fileRef.current?.click();
		}
	}
	async function onFile(file) {
		if (!file) return;
		try {
			const bmp = await createImageBitmap(file);
			const digits = await fromSource(bmp);
			bmp.close();
			if (digits) onRead(digits);
		} catch {}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Ler código de barras",
			...withTip("Câmera", "flex size-8 shrink-0 items-center justify-center text-fg"),
			onClick: () => {
				ping();
				openCamera();
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanBarcode, { className: cn("cal-glyph size-4", flash && "is-flash") })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: fileRef,
			type: "file",
			accept: "image/*",
			capture: "environment",
			className: "hidden",
			onChange: (event) => {
				const file = event.target.files?.[0];
				event.target.value = "";
				onFile(file);
			}
		}),
		live ? (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-[80] flex flex-col bg-black",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				className: "min-h-0 flex-1 object-cover",
				playsInline: true,
				muted: true,
				autoPlay: true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Fechar câmera",
				className: cn("absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-black/50 text-white"),
				onClick: stop,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
			})]
		}), document.body) : null
	] });
}
function BoletosBlock({ adding, year, month, today, selectedIso, openId, boletos, onAdd, onRemove, onUpdate, onOpen, formSlot = null }) {
	const [, pingGlyph] = useGlyphFlash();
	const [code, setCode] = (0, import_react.useState)("");
	const [due, setDue] = (0, import_react.useState)(selectedIso);
	const [amount, setAmount] = (0, import_react.useState)("");
	const [bank, setBank] = (0, import_react.useState)("");
	const [fileName, setFileName] = (0, import_react.useState)("");
	const fileRef = (0, import_react.useRef)(null);
	const fileFor = (0, import_react.useRef)(null);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editCode, setEditCode] = (0, import_react.useState)("");
	const [editDue, setEditDue] = (0, import_react.useState)(selectedIso);
	const [editAmount, setEditAmount] = (0, import_react.useState)("");
	const [editBank, setEditBank] = (0, import_react.useState)("");
	const draftId = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (adding) {
			setDue(selectedIso);
			return;
		}
		if (draftId.current && !boletoHasData(code, amount, bank, due, selectedIso)) {
			onRemove(draftId.current);
			draftId.current = null;
		}
		setCode("");
		setAmount("");
		setBank("");
		setDue(selectedIso);
	}, [adding]);
	function applyParse(digits, setA, setB, setD) {
		const parsed = parseBoleto(digits);
		if (parsed.amount) setA(parsed.amount);
		if (parsed.bank) setB(parsed.bank);
		if (parsed.iso) setD(parsed.iso);
		return parsed;
	}
	function persist(nextCode, nextDue, nextAmount, nextBank, nextFile = fileName) {
		const digits = sanitizeBarcode(nextCode);
		if (!boletoHasData(digits, nextAmount, nextBank, nextDue, selectedIso) && !nextFile) {
			if (draftId.current) {
				deleteBoletoFile(draftId.current);
				onRemove(draftId.current);
				draftId.current = null;
			}
			return null;
		}
		const parsed = parseBoleto(digits);
		const iso = nextDue || parsed.iso || selectedIso;
		const title = nextBank.trim() || parsed.bank || "Boleto";
		const body = {
			id: draftId.current ?? `boleto-${Date.now()}`,
			iso,
			title,
			source: "boleto",
			nb: digits || void 0,
			place: nextBank.trim() || void 0,
			amount: nextAmount.trim() || void 0,
			fileName: nextFile || void 0
		};
		if (draftId.current) {
			onUpdate(body);
			return body.id;
		}
		draftId.current = body.id;
		onAdd(body);
		return body.id;
	}
	function keepFile(file, id) {
		if (file.size > 12582912) return;
		if (!id || id === "draft") {
			const saved = persist(code, due, amount, bank, file.name);
			if (!saved) return;
			setFileName(file.name);
			putBoletoFile(saved, file);
			return;
		}
		const current = boletos.find((event) => event.id === id);
		if (current) onUpdate({
			...current,
			fileName: file.name
		});
		putBoletoFile(id, file);
	}
	function fillCode(digits) {
		setCode(digits);
		if (!digits) {
			setAmount("");
			setBank("");
			setDue(selectedIso);
			persist("", selectedIso, "", "");
			return;
		}
		const parsed = applyParse(digits, setAmount, setBank, setDue);
		persist(digits, parsed.iso || due, parsed.amount ?? amount, parsed.bank ?? bank);
	}
	const visible = boletos.filter((event) => {
		const date = fromIso(event.iso);
		return date.getFullYear() === year && date.getMonth() === month;
	}).sort((a, b) => a.iso.localeCompare(b.iso) || a.title.localeCompare(b.title));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSlot, {
		id: formSlot,
		children: adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-col gap-2 border-t border-line pt-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-fg",
					children: "Boletos"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: code,
						inputMode: "numeric",
						autoCorrect: "off",
						spellCheck: false,
						maxLength: 48,
						"aria-label": "Código de Barras",
						placeholder: "Código de Barras",
						className: "cal-num-field h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
						onChange: (event) => fillCode(sanitizeBarcode(event.target.value))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarcodeScanButton, { onRead: fillCode })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: bank,
							autoCorrect: "off",
							spellCheck: false,
							maxLength: 40,
							"aria-label": "Banco",
							placeholder: "Banco",
							className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
							onChange: (event) => {
								const next = sanitizeBank(event.target.value);
								setBank(next);
								persist(code, due, amount, next);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Anexar",
							...withTip("Anexar", "flex size-8 shrink-0 items-center justify-center text-fg"),
							onClick: () => {
								fileFor.current = "draft";
								fileRef.current?.click();
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/*,application/pdf,.pdf",
							className: "hidden",
							onChange: (event) => {
								const file = event.target.files?.[0];
								event.target.value = "";
								if (file) keepFile(file, fileFor.current);
							}
						})
					]
				}),
				fileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs text-muted",
					children: fileName
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: amount,
					inputMode: "decimal",
					autoCorrect: "off",
					spellCheck: false,
					"aria-label": "Valor",
					placeholder: "Valor",
					className: "cal-num-field h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
					onChange: (event) => {
						const next = sanitizeAmount(event.target.value);
						setAmount(next);
						persist(code, due, next, bank);
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Vencimento"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePick, {
					value: due,
					onChange: (iso) => {
						setDue(iso);
						persist(code, iso, amount, bank);
					}
				})
			]
		}) : null
	}), visible.map((event) => {
		const open = openId === event.id;
		const editing = editingId === event.id;
		const overdue = event.iso < today;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					pingGlyph();
					setEditingId(null);
					onOpen(event, event.iso);
				},
				className: cn("grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left", overdue && "opacity-55"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cn("cal-agenda-tone cal-dmy text-[0.8rem]", open ? "text-today" : "text-muted"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(event.iso).getDate()).padStart(2, "0") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(event.iso).getMonth() + 1).padStart(2, "0") })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("cal-agenda-tone min-w-0 text-sm", open ? "font-bold" : "font-medium"),
						children: event.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("cal-agenda-tone text-right text-xs", open ? "font-bold text-fg" : "font-normal text-muted"),
						children: overdue ? "(vencido)" : event.amount ? `R$ ${event.amount}` : ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("cal-agenda-tone text-xs capitalize", open ? "font-bold text-fg" : "font-normal text-muted"),
						children: weekdayName(event.iso).slice(0, 3)
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("cal-event-details", open && "is-open"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 pb-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: editCode,
								inputMode: "numeric",
								autoCorrect: "off",
								spellCheck: false,
								maxLength: 48,
								placeholder: "Código de Barras",
								className: "cal-num-field h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
								onChange: (change) => {
									const digits = sanitizeBarcode(change.target.value);
									setEditCode(digits);
									const parsed = applyParse(digits, setEditAmount, setEditBank, setEditDue);
									onUpdate({
										...event,
										nb: digits || void 0,
										iso: parsed.iso || editDue,
										title: parsed.bank || editBank || event.title,
										place: parsed.bank || editBank || void 0,
										amount: parsed.amount ?? editAmount
									});
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarcodeScanButton, { onRead: (digits) => {
								setEditCode(digits);
								const parsed = applyParse(digits, setEditAmount, setEditBank, setEditDue);
								onUpdate({
									...event,
									nb: digits || void 0,
									iso: parsed.iso || editDue,
									title: parsed.bank || editBank || event.title,
									place: parsed.bank || editBank || void 0,
									amount: parsed.amount ?? editAmount
								});
							} })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: editBank,
								maxLength: 40,
								placeholder: "Banco",
								className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
								onChange: (change) => {
									const next = sanitizeBank(change.target.value);
									setEditBank(next);
									onUpdate({
										...event,
										title: next || "Boleto",
										place: next || void 0
									});
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Anexar",
								...withTip("Anexar", "flex size-8 shrink-0 items-center justify-center text-fg"),
								onClick: () => {
									fileFor.current = event.id;
									fileRef.current?.click();
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: editAmount,
							inputMode: "decimal",
							placeholder: "Valor",
							className: "cal-num-field h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
							onChange: (change) => {
								const next = sanitizeAmount(change.target.value);
								setEditAmount(next);
								onUpdate({
									...event,
									amount: next || void 0
								});
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Vencimento"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePick, {
							value: editDue,
							onChange: (iso) => {
								setEditDue(iso);
								onUpdate({
									...event,
									iso
								});
							}
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "col-span-2",
						children: [event.amount ? amountInWords(event.amount) : "Boleto", event.nb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "break-all",
							children: ` · ${event.nb}`
						}) : null]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": `Editar ${event.title}`,
						...withTip("Editar", "flex size-8 items-center justify-center text-muted"),
						onClick: () => {
							setEditingId((id) => id === event.id ? null : event.id);
							setEditCode(event.nb ?? "");
							setEditDue(event.iso);
							setEditAmount(event.amount ?? "");
							setEditBank(event.place || event.title);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": `Apagar ${event.title}`,
						...withTip("Apagar", "flex size-8 items-center justify-center text-muted"),
						onClick: () => {
							deleteBoletoFile(event.id);
							onRemove(event.id);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})]
				})] })
			})]
		}, event.id);
	})] });
}
var PAY_INTERVALS = [{
	value: "",
	label: "único"
}, ...EVENT_KINDS.map((kind) => ({
	value: kind,
	label: kind
}))];
function intervalOf(kind, days) {
	if (kind === "personalizado") {
		const step = Number(days);
		return {
			kind: "personalizado",
			everyDays: step > 0 ? step : void 0
		};
	}
	if (!kind) return {
		kind: void 0,
		everyDays: void 0
	};
	return {
		kind,
		everyDays: void 0
	};
}
function intervalTag(event) {
	if (event.kind === "personalizado" && event.everyDays) return `(${event.everyDays} dias)`;
	if (event.kind) return `(${event.kind})`;
	return "(único)";
}
function PaymentsTab({ year, month, selectedIso, today, openId, payments, onAdd, onRemove, onUpdate, onOpen, framed = true, adding = false, formSlot = null, afterName = null, extra = null }) {
	const [glyphFlash, pingGlyph] = useGlyphFlash();
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [creditor, setCreditor] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [due, setDue] = (0, import_react.useState)(selectedIso);
	const [kind, setKind] = (0, import_react.useState)("mensal");
	const [everyDays, setEveryDays] = (0, import_react.useState)("");
	const [kindMenu, setKindMenu] = (0, import_react.useState)(false);
	const [fileName, setFileName] = (0, import_react.useState)("");
	const [editName, setEditName] = (0, import_react.useState)("");
	const [editCreditor, setEditCreditor] = (0, import_react.useState)("");
	const [editAmount, setEditAmount] = (0, import_react.useState)("");
	const [editKind, setEditKind] = (0, import_react.useState)("mensal");
	const [editEveryDays, setEditEveryDays] = (0, import_react.useState)("");
	const [editKindMenu, setEditKindMenu] = (0, import_react.useState)(false);
	const [dateIso, setDateIso] = (0, import_react.useState)(selectedIso);
	const draftIdRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const start = fromIso(due || selectedIso);
	(0, import_react.useEffect)(() => {
		if (!adding) return;
		setDue(selectedIso);
	}, [adding, selectedIso]);
	(0, import_react.useEffect)(() => {
		if (adding) return;
		if (draftIdRef.current && !name.trim() && !creditor.trim() && !amount.trim() && !fileName) {
			deleteBoletoFile(draftIdRef.current);
			onRemove(draftIdRef.current);
		}
		setName("");
		setCreditor("");
		setAmount("");
		setKind("mensal");
		setEveryDays("");
		setKindMenu(false);
		setFileName("");
		draftIdRef.current = null;
	}, [adding]);
	function persistNew(title, person, value, nextKind = kind, nextDays = everyDays, file = fileName, nextDue = due) {
		const next = title.trim().slice(0, 45);
		const who = person.trim().slice(0, 35);
		const money = value.trim();
		const target = draftIdRef.current;
		if (!next && !who && !money && !file) {
			if (target) {
				deleteBoletoFile(target);
				onRemove(target);
				draftIdRef.current = null;
			}
			return null;
		}
		const body = {
			id: target ?? `bill-${Date.now()}`,
			iso: nextDue || selectedIso,
			title: next || who || "Dívida",
			contact: who || void 0,
			amount: money || void 0,
			fileName: file || void 0,
			...intervalOf(nextKind, nextDays),
			source: "bill"
		};
		if (target) {
			onUpdate(body);
			return target;
		}
		draftIdRef.current = body.id;
		onAdd(body);
		return body.id;
	}
	function keepFile(file) {
		if (file.size > 12582912) return;
		const id = persistNew(name, creditor, amount, kind, everyDays, file.name);
		if (!id) return;
		setFileName(file.name);
		putBoletoFile(id, file);
	}
	function persistEdit(title, iso, person = editCreditor, value = editAmount, nextKind = editKind, nextDays = editEveryDays) {
		if (!editingId) return;
		const next = title.trim();
		if (!next && !person.trim() && !value.trim()) return;
		const current = payments.find((event) => event.id === editingId);
		if (!current) return;
		onUpdate({
			...current,
			title: next || person.trim() || "Dívida",
			iso,
			contact: person.trim() || void 0,
			amount: value.trim() || void 0,
			...intervalOf(nextKind, nextDays),
			source: "bill"
		});
	}
	const visible = payments.map((event) => {
		const iso = occurrenceInMonth(event, year, month);
		return iso ? {
			event,
			iso
		} : null;
	}).filter((row) => row !== null).sort((a, b) => a.iso.localeCompare(b.iso) || a.event.title.localeCompare(b.event.title));
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSlot, {
			id: formSlot,
			children: [
				framed || adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "cal-tab-head",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: framed ? "cal-tab-title" : "translate-y-1/2 text-sm font-medium text-fg",
						children: "Pagamentos"
					})
				}) : null,
				framed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "Contas a pagar no mês. Repetem sozinhas no mês seguinte." }) : null,
				adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-col gap-2 pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								start.getDate(),
								" de ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "capitalize",
									children: MONTHS$1[start.getMonth()]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: name,
									maxLength: 45,
									onChange: (event) => {
										const next = event.target.value.slice(0, 45);
										setName(next);
										persistNew(next, creditor, amount);
									},
									placeholder: "Nome da Dívida",
									"aria-label": "Nome da Dívida",
									className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Anexar",
									...withTip("Anexar", "flex size-8 shrink-0 items-center justify-center text-fg"),
									onClick: () => fileRef.current?.click(),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileRef,
									type: "file",
									accept: "image/*,application/pdf,.pdf",
									className: "hidden",
									onChange: (event) => {
										const file = event.target.files?.[0];
										event.target.value = "";
										if (file) keepFile(file);
									}
								})
							]
						}),
						fileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted",
							children: fileName
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: creditor,
								maxLength: 35,
								onChange: (event) => {
									const next = event.target.value;
									const fitted = next.length > 35 ? fitContact(next) : next;
									setCreditor(fitted);
									persistNew(name, fitted, amount);
								},
								placeholder: "Credor",
								"aria-label": "Credor",
								className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Abrir contatos do celular",
								...withTip("Contatos", "flex size-8 shrink-0 items-center justify-center text-fg"),
								onClick: () => {
									pickDeviceContact().then((picked) => {
										if (!picked) return;
										const next = fitContact(picked);
										setCreditor(next);
										persistNew(name, next, amount);
									});
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: amount,
							inputMode: "decimal",
							autoCorrect: "off",
							spellCheck: false,
							"aria-label": "Valor",
							placeholder: "Valor",
							className: "cal-num-field h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
							onChange: (event) => {
								const next = sanitizeAmount(event.target.value);
								setAmount(next);
								persistNew(name, creditor, next);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePick, {
							value: due || selectedIso,
							onChange: (iso) => {
								setDue(iso);
								persistNew(name, creditor, amount, kind, everyDays, fileName, iso);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cal-kind-pick flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderMenu, {
								label: "Intervalo",
								value: kind,
								options: PAY_INTERVALS,
								open: kindMenu,
								wide: true,
								fixed: true,
								soft: true,
								buttonClassName: "cal-kind-btn",
								optionClassName: "cal-kind-option",
								onOpen: () => setKindMenu(true),
								onClose: () => setKindMenu(false),
								onPick: (next) => {
									const picked = next === "" ? "" : next;
									const days = picked && picked !== "personalizado" ? "" : everyDays;
									setKind(picked);
									if (days !== everyDays) setEveryDays(days);
									setKindMenu(false);
									persistNew(name, creditor, amount, picked, days);
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: !kind || kind === "personalizado" ? everyDays : "",
								disabled: Boolean(kind && kind !== "personalizado"),
								readOnly: Boolean(kind && kind !== "personalizado"),
								onChange: (event) => {
									if (kind && kind !== "personalizado") return;
									const next = event.target.value.replace(/\D/g, "").slice(0, 3);
									const picked = next ? "personalizado" : kind;
									setEveryDays(next);
									if (picked !== kind) setKind(picked);
									persistNew(name, creditor, amount, picked, next);
								},
								placeholder: "dias",
								inputMode: "numeric",
								"aria-label": "Intervalo em dias",
								className: cn("cal-field-sm h-11 rounded-xl bg-bg px-2 text-center text-sm tabular-nums text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted", kind && kind !== "personalizado" && "cursor-not-allowed opacity-45")
							})]
						}),
						afterName
					]
				}) : null
			]
		}),
		extra,
		visible.length === 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-1",
			children: visible.map(({ event, iso }) => {
				const open = openId === event.id;
				const editing = editingId === event.id;
				const overdue = iso < today;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						pingGlyph();
						setEditingId(null);
						onOpen(event, iso);
					},
					className: cn("grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left", overdue && "opacity-55"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("cal-agenda-tone cal-dmy text-[0.8rem]", open ? "text-today" : "text-muted"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(iso).getDate()).padStart(2, "0") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(iso).getMonth() + 1).padStart(2, "0") })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone min-w-0 text-sm", open ? "font-bold" : "font-medium"),
							children: event.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("cal-agenda-tone col-span-2 text-right text-xs", open ? "font-bold text-fg" : "font-normal text-muted"),
							children: [event.amount ? `R$ ${event.amount} ` : "", overdue ? "(vencido)" : intervalTag(event)]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("cal-event-details", open && "is-open"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						!editing && event.contact && event.contact !== event.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "col-span-2",
								children: event.contact
							})]
						}) : null,
						editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 pb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: editName,
									onChange: (change) => {
										setEditName(change.target.value);
										persistEdit(change.target.value, dateIso);
									},
									placeholder: "Nome da Dívida",
									"aria-label": "Nome da Dívida",
									className: "h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: editCreditor,
									maxLength: 35,
									onChange: (change) => {
										const next = change.target.value.slice(0, 35);
										setEditCreditor(next);
										persistEdit(editName, dateIso, next, editAmount);
									},
									placeholder: "Credor",
									className: "h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: editAmount,
									inputMode: "decimal",
									onChange: (change) => {
										const next = sanitizeAmount(change.target.value);
										setEditAmount(next);
										persistEdit(editName, dateIso, editCreditor, next);
									},
									placeholder: "Valor",
									className: "cal-num-field h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePick, {
									value: dateIso,
									onChange: (iso) => {
										setDateIso(iso);
										persistEdit(editName, iso, editCreditor, editAmount);
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "cal-kind-pick flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderMenu, {
										label: "Intervalo",
										value: editKind,
										options: PAY_INTERVALS,
										open: editKindMenu,
										wide: true,
										fixed: true,
										soft: true,
										buttonClassName: "cal-kind-btn",
										optionClassName: "cal-kind-option",
										onOpen: () => setEditKindMenu(true),
										onClose: () => setEditKindMenu(false),
										onPick: (next) => {
											const picked = next === "" ? "" : next;
											const days = picked && picked !== "personalizado" ? "" : editEveryDays;
											setEditKind(picked);
											if (days !== editEveryDays) setEditEveryDays(days);
											setEditKindMenu(false);
											persistEdit(editName, dateIso, editCreditor, editAmount, picked, days);
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: !editKind || editKind === "personalizado" ? editEveryDays : "",
										disabled: Boolean(editKind && editKind !== "personalizado"),
										readOnly: Boolean(editKind && editKind !== "personalizado"),
										onChange: (event) => {
											if (editKind && editKind !== "personalizado") return;
											const next = event.target.value.replace(/\D/g, "").slice(0, 3);
											const picked = next ? "personalizado" : editKind;
											setEditEveryDays(next);
											if (picked !== editKind) setEditKind(picked);
											persistEdit(editName, dateIso, editCreditor, editAmount, picked, next);
										},
										placeholder: "dias",
										inputMode: "numeric",
										"aria-label": "Intervalo em dias",
										className: cn("cal-field-sm h-11 rounded-xl bg-bg px-2 text-center text-sm tabular-nums text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted", editKind && editKind !== "personalizado" && "cursor-not-allowed opacity-45")
									})]
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": `Editar ${event.title}`,
								...withTip("Editar", "flex size-8 items-center justify-center text-muted"),
								onClick: () => {
									setEditingId((id) => id === event.id ? null : event.id);
									setEditName(event.title);
									setEditCreditor(event.contact ?? "");
									setEditAmount(event.amount ?? "");
									setEditKind(event.kind ?? "");
									setEditEveryDays(event.everyDays ? String(event.everyDays) : "");
									setDateIso(event.iso);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": `Apagar ${event.title}`,
								...withTip("Apagar", "flex size-8 items-center justify-center text-muted"),
								onClick: () => {
									deleteBoletoFile(event.id);
									onRemove(event.id);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						})
					] })
				})] }, event.id);
			})
		})
	] });
	if (!framed) return body;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "cal-tab",
		children: body
	});
}
var UF_OPTIONS = [{
	value: "",
	label: "UF"
}, ..."AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ").map((uf) => ({
	value: uf,
	label: uf
}))];
function KindMark$3({ on }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": "true",
		className: cn("cal-kind", on && "is-on")
	});
}
function FinanceFold({ title, open, onToggle, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 border-t border-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onToggle,
			className: "flex w-full items-baseline py-3 text-left",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium text-fg",
				children: title
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("cal-event-details", open && "is-open"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3 pb-2",
				children
			})
		})]
	});
}
function FinancesTab({ year, month, today, selectedIso, openBenefitId, openBillId, benefits, bills, boletos, irpf, irpfOn, onIrpf, irpfLots, irpfOpen, pis, pisOpen, laborMonth, onLaborMonth, pisOn, fgtsOn, onPisOn, onFgtsOn, ipva, ipvaOpen, ipvaLots, ipvaUf, ipvaPlate, ipvaOn, licencaOn, onIpvaUf, onIpvaPlate, onIpvaOn, onLicencaOn, onAdd, onRemoveBenefit, onRemoveBill, onUpdate, onOpenBenefit, onOpenBill, onOpenIrpf, onOpenLot, onOpenPis, onOpenFgts, onOpenIpva, fgts, fgtsOpen, fgtsUntil, bolsa, bolsaOpen, bolsaNis, bolsaOn, gasOn, onBolsaNis, onBolsaOn, onGasOn, onOpenBolsa, gas, gasOpen, onOpenGas, licenca, licencaOpen, onOpenLicenca }) {
	const [glyphFlash, pingGlyph] = useGlyphFlash();
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [proventos, setProventos] = (0, import_react.useState)(false);
	const [despesas, setDespesas] = (0, import_react.useState)(false);
	const [pisMenu, setPisMenu] = (0, import_react.useState)(false);
	const [ipvaUfMenu, setIpvaUfMenu] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!adding) {
			setProventos(false);
			setDespesas(false);
		}
	}, [adding]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "cal-tab",
		"data-cal-tab": "finance",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cal-tab-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "cal-tab-title",
					children: "Finanças"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					...withTip("Novo"),
					"aria-label": "Novo lançamento",
					onClick: () => {
						pingGlyph();
						setAdding((v) => !v);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarGlyph, {
						className: "size-5",
						flash: glyphFlash
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "O que entra do INSS e o que sai de conta, no mesmo mês." }),
			irpf ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						pingGlyph();
						onOpenIrpf(irpf);
					},
					className: cn("grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left", irpf.iso < today && "opacity-55"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("cal-agenda-tone cal-dmy text-[0.8rem]", irpfOpen ? "text-today" : "text-muted"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(irpf.iso).getDate()).padStart(2, "0") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(irpf.iso).getMonth() + 1).padStart(2, "0") })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone min-w-0 text-sm", irpfOpen ? "font-bold" : "font-medium"),
							children: irpf.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone text-right text-xs", irpfOpen ? "font-bold text-fg" : "font-normal text-muted"),
							children: irpf.confirmed ? "(confirmado)" : "(previsto)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone text-xs capitalize", irpfOpen ? "font-bold text-fg" : "font-normal text-muted"),
							children: weekdayName(irpf.iso).slice(0, 3)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("cal-event-details", irpfOpen && "is-open"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "col-span-2 whitespace-nowrap",
							children: "Prazo final · Receita Federal"
						})]
					}), irpfLots.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cal-agenda-follow pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex flex-col items-start gap-0.5",
							children: irpfLots.map((lot) => {
								const d = fromIso(lot.iso);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: cn("grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem] items-baseline gap-x-2.5 border-0 bg-transparent p-0 text-left", lot.iso < today && "opacity-55"),
									onClick: () => onOpenLot(lot.iso),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "cal-dmy text-[0.7rem] leading-tight text-muted",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(d.getDate()).padStart(2, "0") }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(d.getMonth() + 1).padStart(2, "0") })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[0.7rem] text-muted",
											children: lot.confirmed ? "Restituição" : "Restituição prevista"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-right text-[0.7rem] text-muted",
											children: lotLabel(lot.n)
										})
									]
								}, lot.iso);
							})
						})
					}) : null] })
				})]
			}) : null,
			bolsa ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						pingGlyph();
						onOpenBolsa(bolsa);
					},
					className: cn("grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left", bolsa.iso < today && "opacity-55"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("cal-agenda-tone cal-dmy text-[0.8rem]", bolsaOpen ? "text-today" : "text-muted"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(bolsa.iso).getDate()).padStart(2, "0") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(bolsa.iso).getMonth() + 1).padStart(2, "0") })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone min-w-0 text-sm", bolsaOpen ? "font-bold" : "font-medium"),
							children: bolsa.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone text-right text-xs", bolsaOpen ? "font-bold text-fg" : "font-normal text-muted"),
							children: bolsa.confirmed ? "(confirmado)" : "(previsto)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone text-xs capitalize", bolsaOpen ? "font-bold text-fg" : "font-normal text-muted"),
							children: weekdayName(bolsa.iso).slice(0, 3)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("cal-event-details", bolsaOpen && "is-open"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "col-span-2 whitespace-nowrap",
							children: ["MDS · final ", bolsa.monthNth]
						})]
					}) })
				})]
			}) : null,
			gas ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						pingGlyph();
						onOpenGas(gas);
					},
					className: cn("grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left", gas.iso < today && "opacity-55"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("cal-agenda-tone cal-dmy text-[0.8rem]", gasOpen ? "text-today" : "text-muted"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(gas.iso).getDate()).padStart(2, "0") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(gas.iso).getMonth() + 1).padStart(2, "0") })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone min-w-0 text-sm", gasOpen ? "font-bold" : "font-medium"),
							children: gas.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone text-right text-xs", gasOpen ? "font-bold text-fg" : "font-normal text-muted"),
							children: gas.confirmed ? "(confirmado)" : "(previsto)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone text-xs capitalize", gasOpen ? "font-bold text-fg" : "font-normal text-muted"),
							children: weekdayName(gas.iso).slice(0, 3)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("cal-event-details", gasOpen && "is-open"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "col-span-2 whitespace-nowrap",
							children: "Liberação · MDS"
						})]
					}) })
				})]
			}) : null,
			fgts ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						pingGlyph();
						onOpenFgts(fgts);
					},
					className: cn("grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left", fgts.iso < today && "opacity-55"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("cal-agenda-tone cal-dmy text-[0.8rem]", fgtsOpen ? "text-today" : "text-muted"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(fgts.iso).getDate()).padStart(2, "0") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(fgts.iso).getMonth() + 1).padStart(2, "0") })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone min-w-0 text-sm", fgtsOpen ? "font-bold" : "font-medium"),
							children: fgts.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone text-right text-xs", fgtsOpen ? "font-bold text-fg" : "font-normal text-muted"),
							children: fgts.confirmed ? "(confirmado)" : "(previsto)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone text-xs capitalize", fgtsOpen ? "font-bold text-fg" : "font-normal text-muted"),
							children: weekdayName(fgts.iso).slice(0, 3)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("cal-event-details", fgtsOpen && "is-open"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "col-span-2 whitespace-nowrap",
							children: ["Caixa", laborMonth ? ` · nasc. ${MONTHS$1[laborMonth - 1]}` : ""]
						})]
					}), fgtsUntil ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cal-agenda-follow pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: cn("grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem] items-baseline gap-x-2.5 border-0 bg-transparent p-0 text-left", fgtsUntil < today && "opacity-55"),
							onClick: () => onOpenLot(fgtsUntil),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "cal-dmy text-[0.7rem] leading-tight text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(fgtsUntil).getDate()).padStart(2, "0") }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(fgtsUntil).getMonth() + 1).padStart(2, "0") })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[0.7rem] text-muted",
									children: "Prazo final"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-right text-[0.7rem] text-muted",
									children: fgts.confirmed ? "(confirmado)" : "(previsto)"
								})
							]
						})
					}) : null] })
				})]
			}) : null,
			pis ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						pingGlyph();
						onOpenPis(pis);
					},
					className: cn("grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left", pis.iso < today && "opacity-55"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("cal-agenda-tone cal-dmy text-[0.8rem]", pisOpen ? "text-today" : "text-muted"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(pis.iso).getDate()).padStart(2, "0") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(pis.iso).getMonth() + 1).padStart(2, "0") })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone min-w-0 text-sm", pisOpen ? "font-bold" : "font-medium"),
							children: pis.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone text-right text-xs", pisOpen ? "font-bold text-fg" : "font-normal text-muted"),
							children: pis.confirmed ? "(confirmado)" : "(previsto)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone text-xs capitalize", pisOpen ? "font-bold text-fg" : "font-normal text-muted"),
							children: weekdayName(pis.iso).slice(0, 3)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("cal-event-details", pisOpen && "is-open"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "col-span-2 whitespace-nowrap",
							children: ["Abono salarial", laborMonth ? ` · nasc. ${MONTHS$1[laborMonth - 1]}` : ""]
						})]
					}) })
				})]
			}) : null,
			ipva ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						pingGlyph();
						onOpenIpva(ipva);
					},
					className: cn("grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left", ipva.iso < today && "opacity-55"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("cal-agenda-tone cal-dmy text-[0.8rem]", ipvaOpen ? "text-today" : "text-muted"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(ipva.iso).getDate()).padStart(2, "0") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(ipva.iso).getMonth() + 1).padStart(2, "0") })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone min-w-0 text-sm", ipvaOpen ? "font-bold" : "font-medium"),
							children: ipva.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone text-right text-xs", ipvaOpen ? "font-bold text-fg" : "font-normal text-muted"),
							children: ipva.confirmed ? "(confirmado)" : "(previsto)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone text-xs capitalize", ipvaOpen ? "font-bold text-fg" : "font-normal text-muted"),
							children: weekdayName(ipva.iso).slice(0, 3)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("cal-event-details", ipvaOpen && "is-open"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: ipvaLots.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cal-agenda-follow pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex flex-col items-start gap-0.5",
							children: ipvaLots.map((lot) => {
								const d = fromIso(lot.iso);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: cn("grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem] items-baseline gap-x-2.5 border-0 bg-transparent p-0 text-left", lot.iso < today && "opacity-55"),
									onClick: () => onOpenLot(lot.iso),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "cal-dmy text-[0.7rem] leading-tight text-muted",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(d.getDate()).padStart(2, "0") }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(d.getMonth() + 1).padStart(2, "0") })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[0.7rem] text-muted",
											children: lot.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-right text-[0.7rem] text-muted",
											children: lot.confirmed ? "(confirmado)" : "(previsto)"
										})
									]
								}, lot.iso);
							})
						})
					}) : null })
				})]
			}) : null,
			licenca ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						pingGlyph();
						onOpenLicenca(licenca);
					},
					className: cn("grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left", licenca.iso < today && "opacity-55"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("cal-agenda-tone cal-dmy text-[0.8rem]", licencaOpen ? "text-today" : "text-muted"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(licenca.iso).getDate()).padStart(2, "0") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(licenca.iso).getMonth() + 1).padStart(2, "0") })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone min-w-0 text-sm", licencaOpen ? "font-bold" : "font-medium"),
							children: licenca.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone text-right text-xs", licencaOpen ? "font-bold text-fg" : "font-normal text-muted"),
							children: licenca.confirmed ? "(confirmado)" : "(previsto)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cal-agenda-tone text-xs capitalize", licencaOpen ? "font-bold text-fg" : "font-normal text-muted"),
							children: weekdayName(licenca.iso).slice(0, 3)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("cal-event-details", licencaOpen && "is-open"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "col-span-2 whitespace-nowrap",
							children: "DETRAN · CRLV-e"
						})]
					}) })
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitsTab, {
				framed: false,
				adding: adding && proventos,
				formSlot: adding && proventos ? "fin-inss" : null,
				year,
				month,
				today,
				openId: openBenefitId,
				benefits,
				onAdd,
				onRemove: onRemoveBenefit,
				onUpdate,
				onOpen: onOpenBenefit
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentsTab, {
				framed: false,
				adding: adding && despesas,
				formSlot: adding && despesas ? "fin-pagamentos" : null,
				year,
				month,
				selectedIso,
				today,
				openId: openBillId,
				payments: bills,
				onAdd,
				onRemove: onRemoveBill,
				onUpdate,
				onOpen: onOpenBill
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoletosBlock, {
				adding: adding && despesas,
				formSlot: adding && despesas ? "fin-boletos" : null,
				year,
				month,
				today,
				selectedIso,
				openId: openBillId,
				boletos,
				onAdd,
				onRemove: onRemoveBill,
				onUpdate,
				onOpen: onOpenBill
			}),
			adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "mt-3 flex h-7 w-full items-center gap-3 border-t border-line pt-3 text-left text-sm",
					"aria-pressed": irpfOn,
					onClick: () => onIrpf(!irpfOn),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$3, { on: irpfOn }), "Declaração de Imposto de Renda"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FinanceFold, {
					title: "Proventos",
					open: proventos,
					onToggle: () => setProventos((open) => !open),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { id: "fin-inss" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-fg",
									children: "Benefícios Sociais"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: bolsaNis,
									inputMode: "numeric",
									autoCorrect: "off",
									spellCheck: false,
									maxLength: 11,
									"aria-label": "NIS",
									placeholder: "NIS",
									className: "cal-num-field h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
									onChange: (event) => onBolsaNis(event.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-center gap-x-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "col-span-2 flex h-7 items-center gap-3 text-left text-sm",
										"aria-pressed": bolsaOn,
										onClick: () => onBolsaOn(!bolsaOn),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$3, { on: bolsaOn }), "Bolsa Família"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "col-span-2 flex h-7 items-center gap-3 text-left text-sm",
										"aria-pressed": gasOn,
										onClick: () => onGasOn(!gasOn),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$3, { on: gasOn }), "Gás do Povo"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-fg",
									children: "Trabalhistas"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "cal-kind-pick is-fill",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderMenu, {
										label: "Mês de nascimento",
										value: laborMonth ?? 0,
										options: [{
											value: 0,
											label: "Mês de nascimento"
										}, ...MONTHS$1.map((label, index) => ({
											value: index + 1,
											label
										}))],
										open: pisMenu,
										wide: true,
										fixed: true,
										soft: true,
										buttonClassName: "cal-kind-btn",
										optionClassName: "cal-kind-option",
										onOpen: () => setPisMenu(true),
										onClose: () => setPisMenu(false),
										onPick: (next) => {
											onLaborMonth(next === 0 ? null : next);
											setPisMenu(false);
										}
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-center gap-x-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "col-span-2 flex h-7 items-center gap-3 text-left text-sm",
										"aria-pressed": fgtsOn,
										onClick: () => onFgtsOn(!fgtsOn),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$3, { on: fgtsOn }), "FGTS"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "col-span-2 flex h-7 items-center gap-3 text-left text-sm",
										"aria-pressed": pisOn,
										onClick: () => onPisOn(!pisOn),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$3, { on: pisOn }), "PIS/Pasep"]
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FinanceFold, {
					title: "Despesas",
					open: despesas,
					onToggle: () => setDespesas((open) => !open),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { id: "fin-pagamentos" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { id: "fin-boletos" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-fg",
									children: "Veículos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "cal-kind-pick is-uf",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderMenu, {
											label: "UF",
											value: ipvaUf,
											options: UF_OPTIONS,
											open: ipvaUfMenu,
											wide: true,
											fixed: true,
											soft: true,
											buttonClassName: "cal-kind-btn",
											optionClassName: "cal-kind-option",
											onOpen: () => setIpvaUfMenu(true),
											onClose: () => setIpvaUfMenu(false),
											onPick: (next) => {
												onIpvaUf(next);
												setIpvaUfMenu(false);
											}
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: ipvaPlate,
										maxLength: 8,
										autoCapitalize: "characters",
										autoCorrect: "off",
										spellCheck: false,
										"aria-label": "Placa do veículo",
										placeholder: "placa",
										className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm uppercase text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
										onChange: (event) => onIpvaPlate(event.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-center gap-x-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "col-span-2 flex h-7 items-center gap-3 text-left text-sm",
										"aria-pressed": ipvaOn,
										onClick: () => onIpvaOn(!ipvaOn),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$3, { on: ipvaOn }), "IPVA"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "col-span-2 flex h-7 items-center gap-3 text-left text-sm",
										"aria-pressed": licencaOn,
										onClick: () => onLicencaOn(!licencaOn),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$3, { on: licencaOn }), "Licenciamento"]
									})]
								})
							]
						})
					]
				})
			] }) : null
		]
	});
}
function HistoryTab({ events, openId, onOpen, onRemove, onReschedule, hourCycle = "12" }) {
	const rows = [...events].sort((a, b) => b.iso.localeCompare(a.iso) || (b.time ?? "").localeCompare(a.time ?? ""));
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [draftDate, setDraftDate] = (0, import_react.useState)("");
	const [draftTime, setDraftTime] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (openId !== editingId) setEditingId(null);
	}, [openId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "cal-tab",
		"data-cal-tab": "history",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cal-tab-head",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "cal-tab-title",
					children: "Histórico"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "Compromissos que já passaram. Edite para remarcar e devolver à Agenda." }),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 border-t border-line pt-3 text-pretty text-sm text-muted",
				children: "Nada no histórico."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1",
				children: rows.map((event) => {
					const open = openId === event.id;
					const editing = editingId === event.id;
					const day = fromIso(event.iso);
					const year = String(day.getFullYear()).slice(2);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onOpen(event),
						className: "flex w-full items-baseline gap-3 border-t border-line py-3 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("cal-agenda-tone w-8 shrink-0 tabular-nums text-sm", open ? "text-today" : "text-muted"),
								children: String(day.getDate()).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("cal-agenda-tone min-w-0 flex-1 truncate text-sm", open ? "font-bold" : "font-medium"),
								children: event.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("cal-agenda-tone flex shrink-0 items-baseline gap-2.5 text-xs", open ? "font-bold text-fg" : "font-normal text-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "capitalize",
									children: [
										MONTHS$1[day.getMonth()].slice(0, 3),
										" ",
										year
									]
								}), event.source === "period" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: event.durationDays === 1 ? "1 dia" : `${event.durationDays ?? 1} dias` }) : event.time ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTime(event.time, hourCycle) }) : null]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("cal-event-details", open && "is-open"),
						children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex flex-col gap-2 pb-3",
							onSubmit: (formEvent) => {
								formEvent.preventDefault();
								if (!draftDate) return;
								onReschedule({
									...event,
									iso: draftDate,
									time: draftTime
								});
								setEditingId(null);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePick, {
									value: draftDate,
									onChange: setDraftDate
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimePick, {
									value: draftTime,
									cycle: hourCycle,
									onChange: setDraftTime
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "w-full",
									children: "Remarcar"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "capitalize text-muted",
									children: [
										weekdayName(event.iso),
										event.place ? ` · ${event.place}` : "",
										event.note ? ` · ${event.note}` : ""
									]
								}), event.contact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactLine, { value: event.contact })
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cal-actions self-end text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `Remarcar ${event.title}`,
									...withTip("Remarcar", "flex size-8 shrink-0 items-center justify-center text-muted"),
									onClick: () => {
										setEditingId(event.id);
										setDraftDate(event.iso);
										setDraftTime(event.time || "09:00");
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `Apagar ${event.title}`,
									...withTip("Apagar", "flex size-8 shrink-0 items-center justify-center text-muted"),
									onClick: () => onRemove(event.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							})]
						})
					})] }, event.id);
				})
			})
		]
	});
}
function KindMark$2({ on }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": "true",
		className: cn("cal-kind", on && "is-on")
	});
}
function holidayKindLabel(event) {
	if (event.holidayKind === "municipal") return "(municipal)";
	if (event.holidayKind === "commemorative") return "(comemorativo)";
	if (event.holidayKind === "facultative" || facultativeName(event.title)) return "(facultativo)";
	if (event.holidayKind === "election") return `(${event.title})`;
	if (event.holidayKind === "enem") return `(${event.title})`;
	if (event.holidayKind === "season") return "(estação)";
	return null;
}
function withStarted(label, event) {
	const year = observanceYear(event.title);
	return year ? `${label} (${year})` : label;
}
function holidayTypeName(event) {
	if (event.holidayKind === "municipal") return event.place || "Municipal";
	if (event.holidayKind === "commemorative") return withStarted(commemorativeAka(event.title) ?? nationalAka(event.title) ?? "Comemorativo", event);
	if (event.holidayKind === "facultative" || facultativeName(event.title)) return withStarted(facultativeAka(event.title) ?? "Ponto facultativo", event);
	if (event.holidayKind === "election") return "Eleitoral";
	if (event.holidayKind === "enem") return event.confirmed ? "Confirmado" : "Previsto";
	if (event.holidayKind === "season") return event.place || "Estação";
	return withStarted(nationalAka(event.title) ?? "Histórico", event);
}
function holidayTitle(event) {
	if (event.holidayKind === "election") return electionRaceLabel(fromIso(event.iso).getFullYear());
	if (event.holidayKind === "enem") return "ENEM";
	if (event.holidayKind === "season") return event.title;
	return officialHolidayTitle(event);
}
function HolidaysTab({ year, month, today, openId, catalog, extras, pool, municipal, commemorative, facultative, national, cityName, cityUf, cityIbge, onToggleMunicipal, onToggleCommemorative, onToggleFacultative, onToggleNational, onSearchCity, onPickCity, onLocate, onOpen }) {
	const [glyphFlash, pingGlyph] = useGlyphFlash();
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)(cityName);
	const [uf, setUf] = (0, import_react.useState)(cityUf);
	const [draftMunicipal, setDraftMunicipal] = (0, import_react.useState)(municipal);
	const [draftCommemorative, setDraftCommemorative] = (0, import_react.useState)(commemorative);
	const [draftFacultative, setDraftFacultative] = (0, import_react.useState)(facultative);
	const [draftNational, setDraftNational] = (0, import_react.useState)(national);
	const [pendingCity, setPendingCity] = (0, import_react.useState)(cityIbge ? {
		ibge: cityIbge,
		name: cityName,
		uf: cityUf
	} : null);
	const [suggestions, setSuggestions] = (0, import_react.useState)([]);
	const debounce = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!adding) return;
		setQuery(cityName);
		setUf(cityUf);
		setDraftMunicipal(municipal);
		setDraftCommemorative(commemorative);
		setDraftFacultative(facultative);
		setDraftNational(national);
		setPendingCity(cityIbge ? {
			ibge: cityIbge,
			name: cityName,
			uf: cityUf
		} : null);
		setSuggestions([]);
	}, [
		adding,
		cityName,
		cityUf,
		cityIbge,
		municipal,
		commemorative,
		facultative,
		national
	]);
	function fold(value) {
		return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
	}
	function applyHits(value, hits) {
		const exact = hits.filter((city) => fold(city.name) === fold(value));
		if (exact.length === 1) {
			setSuggestions([]);
			setPendingCity(exact[0]);
			setQuery(exact[0].name);
			setUf(exact[0].uf);
			onPickCity(exact[0]);
			return;
		}
		if (hits.length === 1) {
			setSuggestions([]);
			setPendingCity(hits[0]);
			setQuery(hits[0].name);
			setUf(hits[0].uf);
			onPickCity(hits[0]);
			return;
		}
		setSuggestions(exact.length > 1 ? exact : hits);
	}
	function searchSoon(name, state) {
		if (debounce.current) window.clearTimeout(debounce.current);
		const city = name.trim();
		if (city.length < 2) {
			setSuggestions([]);
			return;
		}
		debounce.current = window.setTimeout(() => {
			onSearchCity(city, state || void 0).then((hits) => applyHits(city, hits));
		}, 280);
	}
	function onCityInput(value) {
		const letters = value.replace(/[^\p{L}\s-]/gu, "");
		const split = letters.match(/^(.*)-(\p{L}{2})$/u);
		if (split) {
			const city = split[1].replace(/\s+/g, " ").trim();
			const state = split[2].toUpperCase();
			setQuery(city);
			setUf(state);
			searchSoon(city, state);
			return;
		}
		const city = letters.replace(/\s+/g, " ");
		setQuery(city);
		searchSoon(city, uf);
	}
	function onUfInput(value) {
		const next = value.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
		setUf(next);
		searchSoon(query, next);
	}
	const events = uniqueEvents([...catalog, ...extras]).filter((event) => {
		const date = fromIso(event.iso);
		return date.getFullYear() === year && date.getMonth() === month;
	}).sort((a, b) => a.iso.localeCompare(b.iso) || a.title.localeCompare(b.title));
	const available = uniqueEvents(pool).filter((event) => {
		const date = fromIso(event.iso);
		return date.getFullYear() === year && date.getMonth() === month;
	});
	const empty = events.length === 0 ? !national && available.some(isNational) ? "Feriados desativados" : "Mês sem feriados oficiais" : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "cal-tab",
		"data-cal-tab": "holidays",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cal-tab-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "cal-tab-title",
					children: "Feriados"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					...withTip("Opções"),
					"aria-label": "Opções de feriados",
					onClick: () => {
						pingGlyph();
						setAdding((v) => !v);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarGlyph, {
						className: "size-5",
						flash: glyphFlash
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "Datas em que não há expediente, mais comemorações do mês." }),
			adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cal-holiday-opts mt-3 flex flex-col border-t border-line pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-7 w-full items-center gap-3 text-left text-sm",
						"aria-pressed": draftNational,
						onClick: () => {
							const next = !draftNational;
							setDraftNational(next);
							onToggleNational(next);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$2, { on: draftNational }), "Nacionais"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "Feriados de todo o país, com folga no expediente." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-7 w-full items-center gap-3 text-left text-sm",
						"aria-pressed": draftFacultative,
						onClick: () => {
							const next = !draftFacultative;
							setDraftFacultative(next);
							onToggleFacultative(next);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$2, { on: draftFacultative }), "Facultativos"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "Pontos facultativos, como Carnaval e Corpus Christi." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-7 w-full items-center gap-3 text-left text-sm",
						"aria-pressed": draftCommemorative,
						onClick: () => {
							const next = !draftCommemorative;
							setDraftCommemorative(next);
							onToggleCommemorative(next);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$2, { on: draftCommemorative }), "Comemorativos"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "Datas lembradas, sem folga no trabalho." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "flex h-7 min-w-0 flex-1 items-center gap-3 text-left text-sm",
									"aria-pressed": draftMunicipal,
									onClick: () => {
										const next = !draftMunicipal;
										setDraftMunicipal(next);
										onToggleMunicipal(next);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$2, { on: draftMunicipal }), "Municipais"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Usar minha localização",
									...withTip("Localização", "flex size-8 shrink-0 items-center justify-center text-muted"),
									onClick: () => {
										onLocate().then((city) => {
											if (!city) return;
											setDraftMunicipal(true);
											onToggleMunicipal(true);
											setQuery(city.name);
											setUf(city.uf);
											setPendingCity(city);
											setSuggestions([]);
											onPickCity(city);
										});
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "Feriados só da sua cidade, como padroeiro." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2 pl-7",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: query,
										disabled: !draftMunicipal,
										onChange: (event) => onCityInput(event.target.value),
										placeholder: "Cidade",
										inputMode: "text",
										autoCapitalize: "words",
										autoCorrect: "off",
										className: cn("h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted", !draftMunicipal && "cursor-not-allowed opacity-45"),
										onKeyDown: (event) => {
											if (!draftMunicipal || event.key !== "Enter") return;
											event.preventDefault();
											const city = suggestions[0] ?? pendingCity;
											if (!city) return;
											setSuggestions([]);
											setQuery(city.name);
											setUf(city.uf);
											setPendingCity(city);
											onPickCity(city);
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: uf,
										disabled: !draftMunicipal,
										onChange: (event) => onUfInput(event.target.value),
										placeholder: "UF",
										maxLength: 2,
										"aria-label": "Estado",
										autoCapitalize: "characters",
										autoCorrect: "off",
										className: cn("h-11 w-14 shrink-0 rounded-xl bg-bg px-0 text-center text-sm uppercase tracking-wide text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted", !draftMunicipal && "cursor-not-allowed opacity-45")
									})]
								}), draftMunicipal && suggestions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "overflow-hidden rounded-xl shadow-[0_0_0_1px_var(--c-line)]",
									children: suggestions.map((city) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "flex h-11 w-full items-center px-3 text-left text-sm",
										onClick: () => {
											setSuggestions([]);
											setQuery(city.name);
											setUf(city.uf);
											setPendingCity(city);
											onPickCity(city);
										},
										children: [
											city.name,
											", ",
											city.uf
										]
									}) }, city.ibge))
								}) : null]
							})
						]
					})
				]
			}) : null,
			empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("text-pretty text-sm text-muted", adding ? "mt-2" : "mt-3 border-t border-line pt-3"),
				children: empty
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1",
				children: events.map((event) => {
					const past = event.iso < today;
					const open = openId === event.id;
					const kindLabel = holidayKindLabel(event);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							pingGlyph();
							onOpen(event);
						},
						className: cn("grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left", past && "opacity-55"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("cal-agenda-tone cal-dmy text-[0.8rem]", open ? "text-today" : "text-muted"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(event.iso).getDate()).padStart(2, "0") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(event.iso).getMonth() + 1).padStart(2, "0") })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("cal-agenda-tone min-w-0 text-sm", kindLabel ? "text-pretty" : "col-span-2 whitespace-nowrap", open ? "font-bold" : "font-medium"),
								children: holidayTitle(event)
							}),
							kindLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("cal-agenda-tone text-right text-xs", open ? "font-bold text-fg" : "font-normal text-muted"),
								children: kindLabel
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("cal-agenda-tone text-xs capitalize", open ? "font-bold text-fg" : "font-normal text-muted"),
								children: weekdayName(event.iso).slice(0, 3)
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("cal-event-details", open && "is-open"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: holidayTypeName(event) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "col-span-2 whitespace-nowrap",
								children: holidayTypeName(event)
							})]
						}) : null })
					})] }, event.id);
				})
			})
		]
	});
}
function readAnchor(el) {
	const text = el.dataset.tip?.trim();
	if (!text) return null;
	const box = el.getBoundingClientRect();
	return {
		text,
		top: box.top,
		bottom: box.bottom,
		cx: box.left + box.width / 2
	};
}
function IconTips() {
	const [anchor, setAnchor] = (0, import_react.useState)(null);
	const nodeRef = (0, import_react.useRef)(null);
	const hideTimer = (0, import_react.useRef)(0);
	(0, import_react.useLayoutEffect)(() => {
		const node = nodeRef.current;
		if (!anchor || !node) return;
		const app = document.querySelector(".cal-app")?.getBoundingClientRect();
		if (!app) return;
		const pad = 8;
		const maxWidth = Math.max(96, app.width - 16);
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
	(0, import_react.useEffect)(() => {
		let held = null;
		let wait = 0;
		function tipOf(event) {
			return event.target?.closest(".cal-icon-tip");
		}
		function show(el) {
			window.clearTimeout(hideTimer.current);
			setAnchor(el ? readAnchor(el) : null);
		}
		function over(event) {
			if (event.pointerType === "touch") return;
			const el = tipOf(event);
			if (!el) return;
			show(el);
		}
		function out(event) {
			if (event.pointerType === "touch") return;
			const el = tipOf(event);
			const next = event.relatedTarget;
			if (el && next && el.contains(next)) return;
			if (held) return;
			show(null);
		}
		function down(event) {
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
		function onFocusIn(event) {
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
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: nodeRef,
		className: "cal-tip-float",
		style: { visibility: "hidden" },
		role: "tooltip",
		children: anchor.text
	}), document.body);
}
function KindMark$1({ on }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": "true",
		className: cn("cal-kind", on && "is-on")
	});
}
function rowTitle(event) {
	if (event.holidayKind === "election") return electionRaceLabel(fromIso(event.iso).getFullYear());
	if (event.holidayKind === "enem") return "ENEM";
	return event.title;
}
function rowTag(event) {
	if (event.holidayKind === "election" || event.holidayKind === "enem") return `(${event.title})`;
	if (event.holidayKind === "season") return "(estação)";
	if (event.holidayKind === "lunar") {
		if (!event.title.startsWith("Eclipse")) return "(lunar)";
		return event.place?.startsWith("Parcial") ? "(parcial)" : "(total)";
	}
	return null;
}
function rowDetail(event, place, zone) {
	if (event.holidayKind === "election") return [place, zone ? `Zona ${zone}` : ""].filter(Boolean).join(" · ") || "Eleitoral";
	if (event.holidayKind === "enem") return event.confirmed ? "Confirmado" : "Previsto";
	return event.place || "Estação";
}
function DestaquesTab({ year, month, today, openId, events, elections, electionSecondRound, enem, seasons, lunar, electionPlace, electionZone, onToggleElections, onToggleSecondRound, onToggleEnem, onToggleSeasons, onToggleLunar, onElectionPlace, onElectionZone, onOpen }) {
	const [glyphFlash, pingGlyph] = useGlyphFlash();
	const [adding, setAdding] = (0, import_react.useState)(false);
	const rows = events.filter((event) => {
		const date = fromIso(event.iso);
		return date.getFullYear() === year && date.getMonth() === month;
	}).sort((a, b) => a.iso.localeCompare(b.iso) || a.title.localeCompare(b.title));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "cal-tab",
		"data-cal-tab": "destaques",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cal-tab-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "cal-tab-title",
					children: "Destaques"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					...withTip("Opções"),
					"aria-label": "Opções de destaques",
					onClick: () => {
						pingGlyph();
						setAdding((open) => !open);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarGlyph, {
						className: "size-5",
						flash: glyphFlash
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "Eleição, ENEM, estações e Lua. Não são feriado." }),
			adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cal-holiday-opts mt-3 flex flex-col border-t border-line pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-7 w-full items-center gap-3 text-left text-sm",
						"aria-pressed": elections,
						onClick: () => onToggleElections(!elections),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$1, { on: elections }), "Eleições"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 pl-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: electionPlace,
							disabled: !elections,
							onChange: (event) => {
								onElectionPlace(event.target.value.replace(/[^\p{L}\s-]/gu, "").replace(/\s+/g, " "));
							},
							placeholder: "Local",
							inputMode: "text",
							autoCapitalize: "words",
							autoCorrect: "off",
							className: cn("h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted", !elections && "cursor-not-allowed opacity-45")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: electionZone,
							disabled: !elections,
							onChange: (event) => onElectionZone(event.target.value.replace(/\D/g, "").slice(0, 4)),
							placeholder: "Zona",
							inputMode: "numeric",
							maxLength: 4,
							"aria-label": "Zona eleitoral",
							className: cn("h-11 w-[4.5rem] shrink-0 rounded-xl bg-bg px-0 text-center text-sm tabular-nums text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted", !elections && "cursor-not-allowed opacity-45")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn("flex h-7 w-full items-center gap-3 pl-7 text-left text-sm", !elections && "cursor-not-allowed opacity-45"),
						"aria-pressed": elections ? electionSecondRound : false,
						disabled: !elections,
						onClick: () => {
							if (!elections) return;
							onToggleSecondRound(!electionSecondRound);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$1, { on: elections ? electionSecondRound : false }), "2º turno"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-7 w-full items-center gap-3 text-left text-sm",
						"aria-pressed": enem,
						onClick: () => onToggleEnem(!enem),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$1, { on: enem }), "ENEM"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-7 w-full items-center gap-3 text-left text-sm",
						"aria-pressed": seasons,
						onClick: () => onToggleSeasons(!seasons),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$1, { on: seasons }), "Estações"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-7 w-full items-center gap-3 text-left text-sm",
						"aria-pressed": lunar,
						onClick: () => onToggleLunar(!lunar),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark$1, { on: lunar }), "Lunar"]
					})
				]
			}) : null,
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("text-pretty text-sm text-muted", adding ? "mt-2" : "mt-3 border-t border-line pt-3"),
				children: "Nada neste mês."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1",
				children: rows.map((event) => {
					const past = event.iso < today;
					const open = openId === event.id;
					const tag = rowTag(event);
					const detail = rowDetail(event, electionPlace, electionZone);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onOpen(event),
						className: cn("grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left", past && "opacity-55"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("cal-agenda-tone cal-dmy text-[0.8rem]", open ? "text-today" : "text-muted"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(event.iso).getDate()).padStart(2, "0") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(fromIso(event.iso).getMonth() + 1).padStart(2, "0") })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("cal-agenda-tone min-w-0 text-pretty text-sm", open ? "font-bold" : "font-medium"),
								children: rowTitle(event)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("cal-agenda-tone text-right text-xs", open ? "font-bold text-fg" : "font-normal text-muted"),
								children: tag
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("cal-agenda-tone text-xs capitalize", open ? "font-bold text-fg" : "font-normal text-muted"),
								children: weekdayName(event.iso).slice(0, 3)
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("cal-event-details", open && "is-open"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "col-span-2 whitespace-nowrap",
								children: detail
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}) })
					})] }, event.id);
				})
			})
		]
	});
}
function MonthGrid({ cells, selectedIso, today, periodIsos, weekStart, saturdayTint, sundayTint, holidayTint, onSelect, onHold }) {
	const held = (0, import_react.useRef)(null);
	const press = (0, import_react.useRef)(null);
	function clearPress() {
		if (press.current != null) window.clearTimeout(press.current);
		press.current = null;
	}
	function holdStart(iso, event) {
		if (!onHold || event.button !== 0) return;
		const startX = event.clientX;
		const startY = event.clientY;
		clearPress();
		press.current = window.setTimeout(() => {
			press.current = null;
			held.current = iso;
			onHold(iso);
		}, 1e3);
		const move = (next) => {
			if (Math.hypot(next.clientX - startX, next.clientY - startY) > 12) {
				clearPress();
				window.removeEventListener("pointermove", move);
			}
		};
		const up = () => {
			clearPress();
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
			window.removeEventListener("pointercancel", up);
		};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
		window.addEventListener("pointercancel", up);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cal-month-grid",
		children: [weekLabels(weekStart).map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "cal-dow",
			children: label
		}, `${label}-${i}`)), cells.map((cell) => {
			const selected = cell.iso === selectedIso;
			const inPeriod = periodIsos.has(cell.iso) && cell.inMonth;
			const look = cellLook(cell, selected, inPeriod, saturdayTint, sundayTint, holidayTint, today);
			const hasMark = cell.events.some((event) => eventMarksGrid(event, cell.iso));
			const hasBirthday = cell.events.some((event) => event.source === "birthday");
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-current": cell.isToday ? "date" : void 0,
				"aria-pressed": selected,
				"aria-label": `${cell.day}`,
				className: cn("cal-cell", !cell.inMonth && "is-out", selected && "is-selected", hasBirthday && "has-birthday", `sq-${look.square}`, `nm-${look.num}`),
				onPointerDown: (event) => holdStart(cell.iso, event),
				onContextMenu: (event) => event.preventDefault(),
				onClick: () => {
					if (held.current === cell.iso) {
						held.current = null;
						return;
					}
					onSelect(cell.iso);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "cal-num",
					children: cell.day
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "cal-dots",
					"aria-hidden": "true",
					children: cell.inMonth && hasMark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cal-dot" }) : null
				})]
			}, cell.iso);
		})]
	});
}
function fold(value) {
	return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}
function oneEdit(word, query) {
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
function scoreName(query, text) {
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
		if (parts.every((part) => {
			const found = words.findIndex((word, index) => index >= from && word.startsWith(part));
			if (found < 0) return false;
			from = found + 1;
			return true;
		})) return 80;
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
function dayLabel(iso) {
	const [year, month, day] = iso.split("-");
	if (!year || !month || !day) return iso;
	return `${day}/${month}/${year}`;
}
function SearchPanel({ query, items, onQuery, onPick }) {
	const hits = (0, import_react.useMemo)(() => {
		const ranked = items.map((item) => ({
			item,
			score: scoreName(query, item.text)
		})).filter((row) => row.score > 0).sort((a, b) => b.score - a.score || a.item.iso.localeCompare(b.item.iso) || a.item.title.localeCompare(b.item.title));
		const seen = /* @__PURE__ */ new Set();
		const out = [];
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-3 overflow-hidden px-3 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "cal-tab-title",
				children: "Procurar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				autoFocus: true,
				placeholder: "Nome, compromisso, feriado",
				"aria-label": "Procurar",
				className: "h-11 w-full rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
				onChange: (event) => onQuery(event.target.value)
			}),
			typed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "cal-pick-menu cal-search-menu min-h-0 flex-1",
				role: "listbox",
				"aria-label": "Resultados",
				children: hits.length ? hits.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "option",
					className: "cal-pick-option cal-kind-option gap-3",
					onClick: () => onPick(item),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate text-left",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-xs text-muted",
							children: item.kind
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "cal-dmy shrink-0 text-[0.8rem] text-muted",
							children: dayLabel(item.iso)
						})
					]
				}) }, `${item.id}:${item.iso}`)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-3 text-sm text-muted",
					children: "Nada parecido."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "m-0 text-sm text-muted",
				children: "Digite o começo ou as iniciais."
			})
		]
	});
}
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("25aaec7a8758ff2c521809c10883d1ba3444f231989a22a16b87e883feea033a"));
var pushCloud = createServerFn({ method: "POST" }).validator((data) => data).middleware([authMiddleware]).handler(createSsrRpc("17349792903b7ccffc13cfe05aadeb8554d97bb2abeb9e31730b485a9a2bce57"));
var FIRED_KEY$1 = "calendae-reminders-fired";
function readJson(key) {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
/** Caderno da conta: só o que o usuário anotou. Feriado/INSS/almanaque ficam fora. */
function packNotebook(live) {
	return {
		v: 1,
		savedAt: (/* @__PURE__ */ new Date()).toISOString(),
		settings: live.settings,
		events: live.events,
		history: live.history,
		periods: readJson(PERIODS_KEY),
		holidays: null,
		inss: null,
		almanac: null,
		remindersFired: null
	};
}
function notebookPrint(settings, events, history) {
	return JSON.stringify({
		settings,
		events,
		history
	});
}
function clearLocalCalendae() {
	const keys = [
		SETTINGS_KEY,
		EVENTS_KEY,
		PERIODS_KEY,
		HOLIDAYS_KEY,
		INSS_KEY,
		HISTORY_KEY,
		ALMANAC_KEY,
		FIRED_KEY$1,
		"almanaque-settings",
		"almanaque-events",
		"almanaque-holidays",
		"almanaque-periods"
	];
	for (const key of keys) localStorage.removeItem(key);
}
var CUPS = {
	2002: {
		open: "2002-05-31",
		final: "2002-06-30",
		brazil: [
			{
				iso: "2002-06-03",
				title: "Brasil x Turquia"
			},
			{
				iso: "2002-06-08",
				title: "Brasil x China"
			},
			{
				iso: "2002-06-13",
				title: "Brasil x Costa Rica"
			},
			{
				iso: "2002-06-17",
				title: "Brasil x Bélgica"
			},
			{
				iso: "2002-06-21",
				title: "Brasil x Inglaterra"
			},
			{
				iso: "2002-06-26",
				title: "Brasil x Turquia"
			},
			{
				iso: "2002-06-30",
				title: "Brasil x Alemanha"
			}
		]
	},
	2006: {
		open: "2006-06-09",
		final: "2006-07-09",
		brazil: [
			{
				iso: "2006-06-13",
				title: "Brasil x Croácia"
			},
			{
				iso: "2006-06-18",
				title: "Brasil x Austrália"
			},
			{
				iso: "2006-06-22",
				title: "Brasil x Japão"
			},
			{
				iso: "2006-06-27",
				title: "Brasil x Gana"
			},
			{
				iso: "2006-07-01",
				title: "Brasil x França"
			}
		]
	},
	2010: {
		open: "2010-06-11",
		final: "2010-07-11",
		brazil: [
			{
				iso: "2010-06-15",
				title: "Brasil x Coreia do Norte"
			},
			{
				iso: "2010-06-20",
				title: "Brasil x Costa do Marfim"
			},
			{
				iso: "2010-06-25",
				title: "Brasil x Portugal"
			},
			{
				iso: "2010-06-28",
				title: "Brasil x Holanda"
			}
		]
	},
	2014: {
		open: "2014-06-12",
		final: "2014-07-13",
		brazil: [
			{
				iso: "2014-06-12",
				title: "Brasil x Croácia"
			},
			{
				iso: "2014-06-17",
				title: "Brasil x México"
			},
			{
				iso: "2014-06-23",
				title: "Brasil x Camarões"
			},
			{
				iso: "2014-06-28",
				title: "Brasil x Chile"
			},
			{
				iso: "2014-07-04",
				title: "Brasil x Colômbia"
			},
			{
				iso: "2014-07-08",
				title: "Brasil x Alemanha"
			},
			{
				iso: "2014-07-12",
				title: "Brasil x Holanda"
			}
		]
	},
	2018: {
		open: "2018-06-14",
		final: "2018-07-15",
		brazil: [
			{
				iso: "2018-06-17",
				title: "Brasil x Suíça"
			},
			{
				iso: "2018-06-22",
				title: "Brasil x Costa Rica"
			},
			{
				iso: "2018-06-27",
				title: "Brasil x Sérvia"
			},
			{
				iso: "2018-07-02",
				title: "Brasil x México"
			},
			{
				iso: "2018-07-06",
				title: "Brasil x Bélgica"
			}
		]
	},
	2022: {
		open: "2022-11-20",
		final: "2022-12-18",
		brazil: [
			{
				iso: "2022-11-24",
				title: "Brasil x Sérvia"
			},
			{
				iso: "2022-11-28",
				title: "Brasil x Suíça"
			},
			{
				iso: "2022-12-02",
				title: "Brasil x Camarões"
			},
			{
				iso: "2022-12-05",
				title: "Brasil x Coreia do Sul"
			},
			{
				iso: "2022-12-09",
				title: "Brasil x Croácia"
			}
		]
	},
	2026: {
		open: "2026-06-11",
		final: "2026-07-19",
		brazil: [
			{
				iso: "2026-06-13",
				title: "Brasil x Marrocos"
			},
			{
				iso: "2026-06-19",
				title: "Brasil x Haiti"
			},
			{
				iso: "2026-06-24",
				title: "Brasil x Escócia"
			},
			{
				iso: "2026-06-29",
				title: "Brasil x Japão"
			},
			{
				iso: "2026-07-05",
				title: "Brasil x Noruega"
			}
		]
	},
	2030: {
		open: "2030-06-08",
		final: "2030-07-21",
		brazil: []
	}
};
function row(iso, title) {
	return {
		id: `com-copa-${iso}-${title}`,
		iso,
		title,
		time: "",
		source: "holiday",
		holidayKind: "commemorative"
	};
}
function worldCupDates(year) {
	const cup = CUPS[year];
	if (!cup) return [];
	const out = [row(cup.open, "Copa do Mundo"), row(cup.final, "Final da Copa")];
	for (const match of cup.brazil) out.push(row(match.iso, match.title));
	return out;
}
function nthWeekday(year, month, weekday, nth) {
	const shift = (weekday - civilDate(year, month, 1).getDay() + 7) % 7;
	return toIso(civilDate(year, month, 1 + shift + (nth - 1) * 7));
}
var commemorativeCache = /* @__PURE__ */ new Map();
function commemorativeDates(year) {
	const key = `${year}|${moonFestivalIso(year)}`;
	const hit = commemorativeCache.get(key);
	if (hit) return hit;
	const rows = [
		{
			iso: `${year}-01-06`,
			title: "Dia de Reis"
		},
		{
			iso: `${year}-03-08`,
			title: "Dia Internacional da Mulher"
		},
		{
			iso: `${year}-04-01`,
			title: "Dia da Mentira"
		},
		{
			iso: toIso(easterDate(year)),
			title: "Páscoa"
		},
		{
			iso: `${year}-04-19`,
			title: "Dia dos Povos Indígenas"
		},
		{
			iso: `${year}-04-22`,
			title: "Descobrimento do Brasil"
		},
		{
			iso: nthWeekday(year, 4, 0, 2),
			title: "Dia das Mães"
		},
		{
			iso: `${year}-05-13`,
			title: "Abolição da Escravatura"
		},
		{
			iso: `${year}-06-12`,
			title: "Dia dos Namorados"
		},
		{
			iso: `${year}-06-13`,
			title: "Santo Antônio"
		},
		{
			iso: `${year}-06-24`,
			title: "São João"
		},
		{
			iso: `${year}-06-28`,
			title: "Orgulho LGBTQIA+"
		},
		{
			iso: `${year}-06-29`,
			title: "São Pedro"
		},
		{
			iso: nthWeekday(year, 7, 0, 2),
			title: "Dia dos Pais"
		},
		{
			iso: `${year}-08-11`,
			title: "Dia do Estudante"
		},
		{
			iso: `${year}-08-22`,
			title: "Dia do Folclore"
		},
		{
			iso: `${year}-09-21`,
			title: "Dia da Árvore"
		},
		{
			iso: `${year}-10-12`,
			title: "Dia das Crianças"
		},
		{
			iso: `${year}-10-15`,
			title: "Dia do Professor"
		},
		{
			iso: `${year}-10-31`,
			title: "Halloween"
		}
	];
	const moon = moonFestivalEvent(year);
	const events = [
		...rows.filter((row) => observanceReached(row.title, year)).map((row) => ({
			id: `com-${row.iso}-${row.title}`,
			iso: row.iso,
			title: row.title,
			time: "",
			source: "holiday",
			holidayKind: "commemorative"
		})),
		...worldCupDates(year).filter((event) => observanceReached(event.title, year)),
		...observanceReached(moon.title, year) ? [moon] : []
	];
	commemorativeCache.set(key, events);
	return events;
}
/** Provas regulares já publicadas pelo INEP. O resto fica como os dois primeiros domingos de novembro. */
var CONFIRMED$1 = {
	2023: ["2023-11-05", "2023-11-12"],
	2024: ["2024-11-03", "2024-11-10"],
	2025: ["2025-11-09", "2025-11-16"],
	2026: ["2026-11-08", "2026-11-15"]
};
function nthSunday(year, month, n) {
	const shift = (7 - civilDate(year, month, 1).getDay()) % 7;
	return toIso(civilDate(year, month, 1 + shift + (n - 1) * 7));
}
function enemDates(year) {
	const known = CONFIRMED$1[year];
	const days = known ?? [nthSunday(year, 10, 1), nthSunday(year, 10, 2)];
	const confirmed = Boolean(known);
	return days.map((iso, index) => ({
		id: `enem-${iso}`,
		iso,
		title: index === 0 ? "1º dia" : "2º dia",
		source: "holiday",
		holidayKind: "enem",
		confirmed
	}));
}
/** MDS 2026: dia do mês (1–31) por dígito final do NIS (0–9), jan–dez. */
var CONFIRMED_2026 = {
	1: [
		19,
		12,
		18,
		16,
		18,
		17,
		20,
		18,
		17,
		19,
		16,
		10
	],
	2: [
		20,
		13,
		19,
		17,
		19,
		18,
		21,
		19,
		18,
		20,
		17,
		11
	],
	3: [
		21,
		18,
		20,
		20,
		20,
		19,
		22,
		20,
		21,
		21,
		18,
		14
	],
	4: [
		22,
		19,
		23,
		22,
		21,
		22,
		23,
		21,
		22,
		22,
		19,
		15
	],
	5: [
		23,
		20,
		24,
		23,
		22,
		23,
		24,
		24,
		23,
		23,
		23,
		16
	],
	6: [
		26,
		23,
		25,
		24,
		25,
		24,
		27,
		25,
		24,
		26,
		24,
		17
	],
	7: [
		27,
		24,
		26,
		27,
		26,
		25,
		28,
		26,
		25,
		27,
		25,
		18
	],
	8: [
		28,
		25,
		27,
		28,
		27,
		26,
		29,
		27,
		28,
		28,
		26,
		21
	],
	9: [
		29,
		26,
		30,
		29,
		28,
		29,
		30,
		28,
		29,
		29,
		27,
		22
	],
	0: [
		30,
		27,
		31,
		30,
		29,
		30,
		31,
		31,
		30,
		30,
		30,
		23
	]
};
function sanitizeNis(raw) {
	return raw.replace(/\D/g, "").slice(0, 11);
}
function nisDigit(nis) {
	const digits = sanitizeNis(nis);
	if (!digits) return null;
	return Number(digits.at(-1));
}
function offDays(year) {
	return new Set(fallbackHolidays(year).filter((event) => isNational(event) || event.holidayKind === "facultative").map((event) => event.iso));
}
function isUtil(year, monthIndex, day, off) {
	const date = civilDate(year, monthIndex, day);
	const dow = date.getDay();
	const iso = toIso(date);
	return dow !== 0 && dow !== 6 && !off.has(iso);
}
/** Últimos 10 dias úteis. Em dezembro, para em 23 (antecipação de Natal). */
function lastTenUtil(year, monthIndex) {
	const off = offDays(year);
	const last = civilDate(year, monthIndex + 1, 0).getDate();
	const cap = monthIndex === 11 ? Math.min(23, last) : last;
	const days = [];
	for (let day = cap; day >= 1 && days.length < 10; day--) if (isUtil(year, monthIndex, day, off)) days.push(toIso(civilDate(year, monthIndex, day)));
	return days.reverse();
}
function bolsaIso(year, monthIndex, digit) {
	const known = year === 2026 ? CONFIRMED_2026[digit]?.[monthIndex] : void 0;
	if (known) return {
		iso: toIso(civilDate(year, monthIndex, known)),
		confirmed: true
	};
	const days = lastTenUtil(year, monthIndex);
	return {
		iso: days[digit === 0 ? 9 : digit - 1] ?? days.at(-1) ?? toIso(civilDate(year, monthIndex + 1, 0)),
		confirmed: false
	};
}
function bolsaEvent(year, monthIndex, digit, nis = "") {
	const { iso, confirmed } = bolsaIso(year, monthIndex, digit);
	return {
		id: `bolsa-${year}-${monthIndex}`,
		iso,
		title: "Bolsa Família",
		time: "",
		source: "bolsa",
		kind: "mensal",
		confirmed,
		monthNth: digit,
		nb: nis || void 0
	};
}
function nextUtilDay(year, monthIndex, day) {
	const off = /* @__PURE__ */ new Set([...offDays(year), ...offDays(year + 1)]);
	const cursor = civilDate(year, monthIndex, day);
	for (let i = 0; i < 10; i++) {
		const iso = toIso(cursor);
		const dow = cursor.getDay();
		if (dow !== 0 && dow !== 6 && !off.has(iso)) return iso;
		cursor.setDate(cursor.getDate() + 1);
	}
	return toIso(civilDate(year, monthIndex, day));
}
/** MDS: Gás do Povo — liberação no dia 10 (próximo útil se banco fechado). */
function gasIso(year, monthIndex) {
	return {
		iso: nextUtilDay(year, monthIndex, 10),
		confirmed: year >= 2026
	};
}
function gasEvent(year, monthIndex, nis = "") {
	const { iso, confirmed } = gasIso(year, monthIndex);
	return {
		id: `gas-${year}-${monthIndex}`,
		iso,
		title: "Gás do Povo",
		time: "",
		source: "gas",
		kind: "mensal",
		confirmed,
		nb: nis || void 0
	};
}
var LABELS = [
	"1ª parcela",
	"2ª parcela",
	"3ª parcela",
	"4ª parcela",
	"5ª parcela"
];
/** Placa BR: até 7 letras/números; hífen opcional (ABC-1234). Sem outros caracteres. */
function sanitizePlate(raw) {
	let out = "";
	let alnum = 0;
	let hyphen = false;
	for (const ch of raw.toUpperCase()) {
		if (ch === "-") {
			if (hyphen || alnum !== 3) continue;
			hyphen = true;
			out += "-";
			continue;
		}
		if (!/[A-Z0-9]/.test(ch)) continue;
		if (alnum >= 7) continue;
		out += ch;
		alnum += 1;
	}
	return out;
}
function plateDigit(plate) {
	const digits = plate.replace(/\D/g, "");
	if (!digits) return null;
	return Number(digits[digits.length - 1]);
}
function nextUtil$1(year, monthIndex, day) {
	const off = new Set(fallbackHolidays(year).filter((event) => isNational(event) || event.holidayKind === "facultative").map((event) => event.iso));
	const last = civilDate(year, monthIndex + 1, 0).getDate();
	const cursor = civilDate(year, monthIndex, Math.min(day, last));
	for (let i = 0; i < 12; i++) {
		const dow = cursor.getDay();
		const iso = toIso(cursor);
		if (dow !== 0 && dow !== 6 && !off.has(iso)) return iso;
		cursor.setDate(cursor.getDate() + 1);
	}
	return toIso(civilDate(year, monthIndex, Math.min(day, last)));
}
function prDays(digit) {
	if (digit === 1 || digit === 2) return [
		9,
		9,
		9,
		9,
		11
	];
	if (digit === 3 || digit === 4) return [
		12,
		10,
		10,
		10,
		12
	];
	if (digit === 5 || digit === 6) return [
		13,
		11,
		11,
		13,
		13
	];
	if (digit === 7 || digit === 8) return [
		14,
		12,
		12,
		14,
		14
	];
	return [
		15,
		13,
		13,
		15,
		15
	];
}
function spDays(digit) {
	if (digit === 0) return 23;
	if (digit === 1) return 12;
	if (digit === 2) return 13;
	if (digit === 3) return 14;
	if (digit === 4) return 15;
	if (digit === 5) return 16;
	if (digit === 6) return 19;
	if (digit === 7) return 20;
	if (digit === 8) return 21;
	return 22;
}
/** Datas oficiais 2026 (SEFA-PR / SEFAZ-SP, automóveis). */
var CONFIRMED_IPVA = {
	PR: { 2026: {
		1: [
			"2026-01-09",
			"2026-02-09",
			"2026-03-09",
			"2026-04-09",
			"2026-05-11"
		],
		2: [
			"2026-01-09",
			"2026-02-09",
			"2026-03-09",
			"2026-04-09",
			"2026-05-11"
		],
		3: [
			"2026-01-12",
			"2026-02-10",
			"2026-03-10",
			"2026-04-10",
			"2026-05-12"
		],
		4: [
			"2026-01-12",
			"2026-02-10",
			"2026-03-10",
			"2026-04-10",
			"2026-05-12"
		],
		5: [
			"2026-01-13",
			"2026-02-11",
			"2026-03-11",
			"2026-04-13",
			"2026-05-13"
		],
		6: [
			"2026-01-13",
			"2026-02-11",
			"2026-03-11",
			"2026-04-13",
			"2026-05-13"
		],
		7: [
			"2026-01-14",
			"2026-02-12",
			"2026-03-12",
			"2026-04-14",
			"2026-05-14"
		],
		8: [
			"2026-01-14",
			"2026-02-12",
			"2026-03-12",
			"2026-04-14",
			"2026-05-14"
		],
		9: [
			"2026-01-15",
			"2026-02-13",
			"2026-03-13",
			"2026-04-15",
			"2026-05-15"
		],
		0: [
			"2026-01-15",
			"2026-02-13",
			"2026-03-13",
			"2026-04-15",
			"2026-05-15"
		]
	} },
	SP: { 2026: {
		1: [
			"2026-01-12",
			"2026-02-12",
			"2026-03-12",
			"2026-04-12",
			"2026-05-12"
		],
		2: [
			"2026-01-13",
			"2026-02-13",
			"2026-03-13",
			"2026-04-13",
			"2026-05-13"
		],
		3: [
			"2026-01-14",
			"2026-02-14",
			"2026-03-14",
			"2026-04-14",
			"2026-05-14"
		],
		4: [
			"2026-01-15",
			"2026-02-15",
			"2026-03-15",
			"2026-04-15",
			"2026-05-15"
		],
		5: [
			"2026-01-16",
			"2026-02-16",
			"2026-03-16",
			"2026-04-16",
			"2026-05-16"
		],
		6: [
			"2026-01-19",
			"2026-02-19",
			"2026-03-19",
			"2026-04-19",
			"2026-05-19"
		],
		7: [
			"2026-01-20",
			"2026-02-20",
			"2026-03-20",
			"2026-04-20",
			"2026-05-20"
		],
		8: [
			"2026-01-21",
			"2026-02-21",
			"2026-03-21",
			"2026-04-21",
			"2026-05-21"
		],
		9: [
			"2026-01-22",
			"2026-02-22",
			"2026-03-22",
			"2026-04-22",
			"2026-05-22"
		],
		0: [
			"2026-01-23",
			"2026-02-23",
			"2026-03-23",
			"2026-04-23",
			"2026-05-23"
		]
	} }
};
function normalizeUf(raw) {
	return raw.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
}
function projected(year, uf, digit) {
	if (uf === "PR") return prDays(digit).map((day, i) => nextUtil$1(year, i, day));
	if (uf === "SP") {
		const day = spDays(digit);
		return [
			0,
			1,
			2,
			3,
			4
		].map((i) => nextUtil$1(year, i, day));
	}
	return null;
}
function ipvaParcels(year, uf, digit) {
	const state = normalizeUf(uf);
	if (!state || digit < 0 || digit > 9) return null;
	const known = CONFIRMED_IPVA[state]?.[year]?.[digit];
	const isos = known ?? projected(year, state, digit);
	if (!isos) return null;
	const confirmed = Boolean(known);
	return isos.map((iso, i) => ({
		n: i + 1,
		iso,
		confirmed,
		label: i === 0 ? "à vista / 1ª" : LABELS[i]
	}));
}
function ipvaEvent(year, uf, digit) {
	const parcels = ipvaParcels(year, uf, digit);
	if (!parcels?.length) return null;
	return {
		id: `ipva-${year}`,
		iso: parcels[0].iso,
		title: "IPVA",
		time: "",
		source: "ipva",
		kind: "anual",
		confirmed: parcels[0].confirmed
	};
}
function ipvaMarks(year, uf, digit) {
	const parcels = ipvaParcels(year, uf, digit);
	if (!parcels) return [];
	return parcels.map((parcel) => ({
		id: `ipva-${year}-${parcel.n}`,
		iso: parcel.iso,
		title: "IPVA",
		time: "",
		source: "ipva",
		kind: "anual",
		confirmed: parcel.confirmed
	}));
}
/** DETRAN: vencimento do licenciamento por final de placa. */
var CONFIRMED = {
	PR: { 2026: {
		1: "2026-08-14",
		2: "2026-08-28",
		3: "2026-09-09",
		4: "2026-09-18",
		5: "2026-09-28",
		6: "2026-10-09",
		7: "2026-10-20",
		8: "2026-10-30",
		9: "2026-11-13",
		0: "2026-11-27"
	} },
	SP: { 2026: {
		1: "2026-07-31",
		2: "2026-07-31",
		3: "2026-08-31",
		4: "2026-08-31",
		5: "2026-09-30",
		6: "2026-09-30",
		7: "2026-10-31",
		8: "2026-10-31",
		9: "2026-11-30",
		0: "2026-12-31"
	} }
};
var PR_PATTERN = {
	1: [7, 14],
	2: [7, 28],
	3: [8, 9],
	4: [8, 18],
	5: [8, 28],
	6: [9, 9],
	7: [9, 20],
	8: [9, 30],
	9: [10, 13],
	0: [10, 27]
};
var SP_MONTH = {
	1: 6,
	2: 6,
	3: 7,
	4: 7,
	5: 8,
	6: 8,
	7: 9,
	8: 9,
	9: 10,
	0: 11
};
function nextUtil(year, monthIndex, day) {
	const off = new Set(fallbackHolidays(year).filter((event) => isNational(event) || event.holidayKind === "facultative").map((event) => event.iso));
	const last = civilDate(year, monthIndex + 1, 0).getDate();
	const cursor = civilDate(year, monthIndex, Math.min(day, last));
	for (let i = 0; i < 12; i++) {
		const dow = cursor.getDay();
		const iso = toIso(cursor);
		if (dow !== 0 && dow !== 6 && !off.has(iso)) return iso;
		cursor.setDate(cursor.getDate() + 1);
	}
	return toIso(civilDate(year, monthIndex, Math.min(day, last)));
}
function lastUtil(year, monthIndex) {
	const off = new Set(fallbackHolidays(year).filter((event) => isNational(event) || event.holidayKind === "facultative").map((event) => event.iso));
	const cursor = civilDate(year, monthIndex + 1, 0);
	for (let i = 0; i < 12; i++) {
		const dow = cursor.getDay();
		const iso = toIso(cursor);
		if (dow !== 0 && dow !== 6 && !off.has(iso)) return iso;
		cursor.setDate(cursor.getDate() - 1);
	}
	return toIso(civilDate(year, monthIndex + 1, 0));
}
function licencaIso(year, uf, digit) {
	const state = normalizeUf(uf);
	if (!state || digit < 0 || digit > 9) return null;
	const known = CONFIRMED[state]?.[year]?.[digit];
	if (known) return {
		iso: known,
		confirmed: true
	};
	if (state === "PR") {
		const [monthIndex, day] = PR_PATTERN[digit];
		return {
			iso: nextUtil(year, monthIndex, day),
			confirmed: false
		};
	}
	if (state === "SP") return {
		iso: lastUtil(year, SP_MONTH[digit]),
		confirmed: false
	};
	return null;
}
function licencaEvent(year, uf, digit) {
	const hit = licencaIso(year, uf, digit);
	if (!hit) return null;
	return {
		id: `licenca-${year}`,
		iso: hit.iso,
		title: "Licenciamento",
		time: "",
		source: "licenca",
		kind: "anual",
		confirmed: hit.confirmed
	};
}
var FIRED_KEY = "calendae-reminders-fired";
var LEGACY_FIRED_KEY = "almanaque-reminders-fired";
var CHECK_MS = 15e3;
var timers = [];
var intervalId = null;
function eventWhen(event, on) {
	if (!event.time) return null;
	const [hours, minutes] = event.time.split(":").map(Number);
	if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
	const next = new Date(on);
	next.setHours(hours, minutes, 0, 0);
	return next;
}
function addMonths(date, months) {
	const next = new Date(date);
	const day = next.getDate();
	next.setMonth(next.getMonth() + months);
	if (next.getDate() !== day) next.setDate(0);
	return next;
}
function nextReminderAt(event, now = /* @__PURE__ */ new Date()) {
	if (!event.notify) return null;
	if (event.source === "holiday") return null;
	if (isDueForHistory(event, todayIso(), now)) return null;
	const day = fromIso(event.iso);
	const start = event.time ? eventWhen(event, day) : new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
	if (!start) return null;
	if (!event.kind) return start.getTime() > now.getTime() - CHECK_MS || toIso(start) === toIso(now) ? start : null;
	if (event.source === "birthday") {
		const born = Number(event.iso.slice(0, 4));
		let year = Math.max(now.getFullYear(), Number.isFinite(born) ? born : now.getFullYear());
		for (let i = 0; i < 4; i += 1) {
			const day = fromIso(birthdayIso(event.iso, year));
			const when = eventWhen(event, day) ?? new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
			if (when.getTime() > now.getTime() - CHECK_MS || toIso(when) === toIso(now)) return when;
			year += 1;
		}
		return null;
	}
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
			cursor = eventWhen(event, day) ?? new Date(day.getFullYear(), day.getMonth(), day.getDate(), cursor.getHours(), cursor.getMinutes(), 0, 0);
		} else if (event.kind === "semanal") cursor = new Date(cursor.getTime() + 6048e5);
		else if (event.kind === "mensal") cursor = addMonths(cursor, 1);
		else if (event.kind === "semestral") cursor = addMonths(cursor, 6);
		else if (event.kind === "anual") cursor = addMonths(cursor, 12);
		else if (event.kind === "personalizado") {
			const step = event.everyDays ?? 0;
			if (step < 1) break;
			cursor = new Date(cursor.getTime() + step * 24 * 60 * 60 * 1e3);
		} else break;
	}
	return null;
}
function fireKey(event, when) {
	return `${event.id}@${when.getTime()}`;
}
function readFired() {
	try {
		const raw = takeLocal(FIRED_KEY, LEGACY_FIRED_KEY);
		const list = raw ? JSON.parse(raw) : [];
		return new Set(Array.isArray(list) ? list.slice(-80) : []);
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function markFired(key) {
	const set = readFired();
	set.add(key);
	localStorage.setItem(FIRED_KEY, JSON.stringify([...set].slice(-80)));
}
async function showNotice(title, body) {
	try {
		const ready = await Promise.race([navigator.serviceWorker?.ready, new Promise((resolve) => window.setTimeout(() => resolve(null), 1200))]);
		if (ready && "showNotification" in ready) {
			await ready.showNotification(title, { body });
			return;
		}
	} catch {}
	try {
		new Notification(title, { body });
	} catch {}
}
function reminderStatusLabel() {
	if (typeof Notification === "undefined") return "Este celular não avisa por aqui.";
	if (Notification.permission === "granted") return "Sino gravado. Aviso no horário virá no app nativo.";
	if (Notification.permission === "denied") return "Avisos bloqueados nas configurações do celular.";
	return "Avisos ainda não liberados.";
}
async function requestReminderPermission() {
	if (typeof Notification === "undefined") return "unsupported";
	if (Notification.permission !== "default") return Notification.permission;
	return Notification.requestPermission();
}
async function enableReminders() {
	if (typeof window === "undefined" || typeof Notification === "undefined") return "Este celular não avisa por aqui.";
	if (window.parent !== window) return "Abra o Calendae na tela inicial (não no preview) para ligar os avisos.";
	const permission = await requestReminderPermission();
	if (permission === "unsupported") return "Este celular não avisa por aqui.";
	if (permission === "denied") return "Avisos bloqueados nas configurações do celular.";
	if (permission !== "granted") return "Permissão não concedida.";
	await showNotice("Calendae", "Sino ligado neste compromisso. Aviso no horário virá no app nativo.");
	return "Sino gravado. Aviso no horário virá no app nativo.";
}
function stopReminders() {
	for (const id of timers) window.clearTimeout(id);
	timers = [];
	if (intervalId !== null) {
		window.clearInterval(intervalId);
		intervalId = null;
	}
}
function startReminders(events, cycle = "12") {
	stopReminders();
	if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
	const tick = () => {
		const now = /* @__PURE__ */ new Date();
		for (const event of events) {
			const when = nextReminderAt(event, now);
			if (!when) continue;
			const wait = when.getTime() - now.getTime();
			if (wait > 432e5) continue;
			const key = fireKey(event, when);
			if (readFired().has(key)) continue;
			if (wait <= 0) {
				const sameDay = toIso(when) === toIso(now);
				const recent = now.getTime() - when.getTime() < 12e4;
				if (!event.time && sameDay) {
					markFired(key);
					showNotice(event.title, [event.kind ? `(${event.kind})` : "", "hoje"].filter(Boolean).join(" "));
					continue;
				}
				if (recent) {
					markFired(key);
					showNotice(event.title, [event.kind ? `(${event.kind})` : "", formatTime(event.time, cycle)].filter(Boolean).join(" "));
				}
				continue;
			}
			const id = window.setTimeout(() => {
				if (readFired().has(key)) return;
				markFired(key);
				showNotice(event.title, [event.kind ? `(${event.kind})` : "", formatTime(event.time, cycle)].filter(Boolean).join(" "));
			}, wait);
			timers.push(id);
		}
	};
	tick();
	intervalId = window.setInterval(tick, CHECK_MS);
}
var SettingsPanel = (0, import_react.lazy)(() => import("./settings-panel-kLbtn_lp.mjs").then((mod) => ({ default: mod.SettingsPanel })));
function whenIdle(fn) {
	if (typeof window === "undefined") return () => {};
	const ric = window.requestIdleCallback?.bind(window);
	if (ric) {
		const id = ric(fn, { timeout: 900 });
		return () => window.cancelIdleCallback(id);
	}
	const timer = window.setTimeout(fn, 1);
	return () => window.clearTimeout(timer);
}
function seedHolidayStore() {
	const year = fromIso(todayIso()).getFullYear();
	return { [String(year)]: {
		events: fallbackHolidays(year),
		fetchedAt: 0,
		source: "fallback"
	} };
}
function readSettings() {
	try {
		const raw = readSettingsRaw();
		if (!raw) return DEFAULT_SETTINGS;
		const parsed = JSON.parse(raw);
		return {
			...DEFAULT_SETTINGS,
			...parsed,
			theme: "clareira",
			municipal: Boolean(parsed.municipal),
			commemorative: Boolean(parsed.commemorative),
			elections: typeof parsed.elections === "boolean" ? parsed.elections : true,
			enem: Boolean(parsed.enem),
			irpfOn: parsed.irpfOn !== false,
			seasons: parsed.seasons !== false,
			lunar: parsed.lunar === true,
			hourCycle: parsed.hourCycle === "24" ? "24" : "12",
			electionSecondRound: Boolean(parsed.electionSecondRound),
			electionSecondTriedYear: typeof parsed.electionSecondTriedYear === "number" ? parsed.electionSecondTriedYear : null,
			facultative: parsed.facultative !== false,
			national: parsed.national !== false,
			cityName: typeof parsed.cityName === "string" ? parsed.cityName : "",
			cityIbge: typeof parsed.cityIbge === "number" ? parsed.cityIbge : null,
			cityUf: typeof parsed.cityUf === "string" ? parsed.cityUf : "",
			electionPlace: typeof parsed.electionPlace === "string" ? parsed.electionPlace : "",
			electionZone: typeof parsed.electionZone === "string" ? parsed.electionZone : "",
			weekStart: parsed.weekStart === "monday" ? "monday" : "sunday",
			saturdayTint: Boolean(parsed.saturdayTint) || parsed.weekendTint === "uteis",
			sundayTint: Boolean(parsed.sundayTint) || parsed.weekendTint === "uteis" || parsed.weekendTint === "domingos",
			holidayTint: parsed.holidayTint !== false,
			tabs: (() => {
				const raw = parsed.tabs ?? {};
				const finance = typeof raw.finance === "boolean" ? raw.finance : raw.benefits !== false || raw.bills !== false;
				const { benefits: _benefits, bills: _bills, periods: _periods, ...rest } = raw;
				return {
					...DEFAULT_SETTINGS.tabs,
					...rest,
					finance
				};
			})(),
			a11yNumbers: Boolean(parsed.a11yNumbers),
			a11yText: Boolean(parsed.a11yText),
			a11ySaturated: Boolean(parsed.a11ySaturated),
			a11yColorblind: Boolean(parsed.a11yColorblind),
			a11yHints: Boolean(parsed.a11yHints),
			pisBirthMonth: typeof parsed.pisBirthMonth === "number" && parsed.pisBirthMonth >= 1 && parsed.pisBirthMonth <= 12 ? parsed.pisBirthMonth : null,
			fgtsBirthMonth: typeof parsed.fgtsBirthMonth === "number" && parsed.fgtsBirthMonth >= 1 && parsed.fgtsBirthMonth <= 12 ? parsed.fgtsBirthMonth : null,
			laborMonth: (() => {
				const n = parsed.laborMonth ?? parsed.pisBirthMonth ?? parsed.fgtsBirthMonth;
				return typeof n === "number" && n >= 1 && n <= 12 ? n : null;
			})(),
			pisOn: typeof parsed.pisOn === "boolean" ? parsed.pisOn : Boolean(parsed.pisBirthMonth),
			fgtsOn: typeof parsed.fgtsOn === "boolean" ? parsed.fgtsOn : Boolean(parsed.fgtsBirthMonth ?? parsed.pisBirthMonth),
			laborTriedYear: typeof parsed.laborTriedYear === "number" ? parsed.laborTriedYear : null,
			bolsaNis: typeof parsed.bolsaNis === "string" ? parsed.bolsaNis.replace(/\D/g, "").slice(0, 11) : "",
			bolsaOn: typeof parsed.bolsaOn === "boolean" ? parsed.bolsaOn : Boolean(typeof parsed.bolsaNis === "string" && parsed.bolsaNis.replace(/\D/g, "")),
			gasOn: Boolean(parsed.gasOn),
			ipvaUf: typeof parsed.ipvaUf === "string" ? parsed.ipvaUf.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() : "",
			ipvaPlate: (() => {
				if (typeof parsed.ipvaPlate === "string" && parsed.ipvaPlate) return sanitizePlate(parsed.ipvaPlate);
				if (typeof parsed.ipvaDigit === "number") return String(parsed.ipvaDigit);
				return "";
			})(),
			ipvaDigit: (() => {
				const fromPlate = plateDigit(typeof parsed.ipvaPlate === "string" && parsed.ipvaPlate ? sanitizePlate(parsed.ipvaPlate) : "");
				if (fromPlate !== null) return fromPlate;
				return typeof parsed.ipvaDigit === "number" && parsed.ipvaDigit >= 0 && parsed.ipvaDigit <= 9 ? parsed.ipvaDigit : null;
			})(),
			ipvaOn: typeof parsed.ipvaOn === "boolean" ? parsed.ipvaOn : Boolean(typeof parsed.ipvaPlate === "string" && parsed.ipvaPlate || typeof parsed.ipvaDigit === "number"),
			licencaOn: typeof parsed.licencaOn === "boolean" ? parsed.licencaOn : Boolean(typeof parsed.ipvaPlate === "string" && parsed.ipvaPlate || typeof parsed.ipvaDigit === "number")
		};
	} catch {
		return DEFAULT_SETTINGS;
	}
}
function readLocalEvents() {
	try {
		const raw = readEventsRaw();
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
function readHistory() {
	try {
		const raw = localStorage.getItem(HISTORY_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.map(archiveEvent) : [];
	} catch {
		return [];
	}
}
function readInssStore() {
	try {
		const raw = localStorage.getItem(INSS_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}
function applyInssStore(store) {
	for (const [year, row] of Object.entries(store)) if (row?.table) rememberInssTable(Number(year), row.table);
}
var KIND_OPTIONS = [{
	value: "",
	label: "único"
}, ...EVENT_KINDS.map((kind) => ({
	value: kind,
	label: kind
}))];
var SIDE_OPTIONS = [
	{
		value: "",
		label: "Qualquer dia"
	},
	{
		value: "primeiros",
		label: "Primeiro dia"
	},
	{
		value: "ultimos",
		label: "Último dia"
	}
];
var RULE_OPTIONS = [
	{
		value: "ignorar",
		label: "Ignorar"
	},
	{
		value: "preceder",
		label: "Preceder"
	},
	{
		value: "proceder",
		label: "Proceder"
	},
	{
		value: "adiar",
		label: "Adiar"
	},
	{
		value: "cancelar",
		label: "Cancelar"
	}
];
function upcomingBirthday(iso, today) {
	const year = Number(today.slice(0, 4));
	const thisYear = birthdayIso(iso, year);
	return thisYear >= today ? thisYear : birthdayIso(iso, year + 1);
}
function searchKind(event) {
	if (event.holidayKind === "election") return "Eleição";
	if (event.holidayKind === "enem") return "ENEM";
	if (event.holidayKind === "season") return "Estação";
	if (event.holidayKind === "lunar") return "Lua";
	if (event.source === "birthday") return "Aniversário";
	if (event.source === "holiday") return "Feriado";
	if (event.source === "benefit") return "INSS";
	if (event.source === "bill") return "Pagamento";
	if (event.source === "boleto") return "Boleto";
	if (event.source === "irpf") return "Declaração";
	if (event.source === "pis") return "PIS";
	if (event.source === "fgts") return "FGTS";
	if (event.source === "bolsa") return "Bolsa Família";
	if (event.source === "gas") return "Gás";
	if (event.source === "ipva") return "IPVA";
	if (event.source === "licenca") return "Licença";
	if (event.source === "period") return "Período";
	return "Compromisso";
}
function searchSlot(event, forced) {
	if (forced === "Histórico") return "history";
	const tab = eventTab(event);
	if (tab === "destaques") return "highlight";
	if (tab === "holidays") return "holiday";
	if (tab === "birthdays") return "birthday";
	if (event.source === "period") return "period";
	if (event.source === "benefit") return "benefit";
	if (event.source === "bill" || event.source === "boleto") return "bill";
	if (event.source === "irpf") return "irpf";
	if (event.source === "pis") return "pis";
	if (event.source === "fgts") return "fgts";
	if (event.source === "bolsa") return "bolsa";
	if (event.source === "gas") return "gas";
	if (event.source === "ipva") return "ipva";
	if (event.source === "licenca") return "licenca";
	return "event";
}
function HojeIcon({ day }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className: "size-5",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "3.5",
				y: "5",
				width: "17",
				height: "16",
				rx: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 3.5v3.5M16 3.5v3.5M3.5 10h17" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "12",
				y: "18.2",
				textAnchor: "middle",
				fill: "currentColor",
				stroke: "none",
				fontSize: "8",
				fontWeight: "600",
				fontFamily: "Figtree, ui-sans-serif, sans-serif",
				children: day
			})
		]
	});
}
function KindMark({ on }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": "true",
		className: cn("cal-kind", on && "is-on")
	});
}
function KindPick({ kind, everyDays, open, onOpen, onClose, onKind, onEveryDays }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cal-kind-pick flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderMenu, {
			label: "Intervalo",
			value: kind ?? "",
			options: KIND_OPTIONS,
			open,
			wide: true,
			fixed: true,
			soft: true,
			buttonClassName: "cal-kind-btn",
			optionClassName: "cal-kind-option",
			onOpen,
			onClose,
			onPick: (next) => {
				onKind(next === "" ? null : next);
				onClose();
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: !kind || kind === "personalizado" ? everyDays : "",
			disabled: Boolean(kind && kind !== "personalizado"),
			readOnly: Boolean(kind && kind !== "personalizado"),
			onChange: (event) => {
				if (kind && kind !== "personalizado") return;
				const next = event.target.value.replace(/\D/g, "").slice(0, 3);
				onEveryDays(next);
				if (next && !kind) onKind("personalizado");
			},
			placeholder: "dias",
			inputMode: "numeric",
			"aria-label": "Intervalo em dias",
			className: cn("cal-field-sm h-11 rounded-xl bg-bg px-2 text-center text-sm tabular-nums text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted", kind && kind !== "personalizado" && "cursor-not-allowed opacity-45")
		})]
	});
}
function PlacePick({ side, util, open, locked, onOpen, onClose, onSide, onUtil }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cal-kind-pick flex flex-wrap items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderMenu, {
			label: "Posição no mês",
			value: side,
			options: SIDE_OPTIONS,
			open: open && !locked,
			wide: true,
			fixed: true,
			soft: true,
			disabled: locked,
			buttonClassName: "cal-kind-btn",
			optionClassName: "cal-kind-option",
			onOpen,
			onClose,
			onPick: (next) => {
				if (locked) return;
				onSide(next);
				onClose();
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			"aria-pressed": locked ? false : util,
			disabled: locked,
			className: cn("flex h-11 items-center gap-2 text-sm text-fg", locked && "cursor-not-allowed opacity-45"),
			onClick: () => {
				if (locked) return;
				onUtil();
			},
			children: ["útil", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark, { on: locked ? false : util })]
		})]
	});
}
function RulePick({ rule, open, locked, onOpen, onClose, onRule }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderMenu, {
		label: "Se cair em feriado",
		value: rule,
		options: RULE_OPTIONS,
		open: open && !locked,
		wide: true,
		fixed: true,
		soft: true,
		disabled: locked,
		buttonClassName: "cal-kind-btn",
		optionClassName: "cal-kind-option",
		onOpen,
		onClose,
		onPick: (next) => {
			if (locked) return;
			onRule(next);
			onClose();
		}
	});
}
function NotifyToggle({ on, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": on ? "Desligar aviso" : "Ligar aviso",
		"aria-pressed": on,
		...withTip(on ? "Aviso ligado" : "Aviso", cn("flex size-8 shrink-0 items-center justify-center", on ? "text-fg" : "text-muted")),
		onClick: onToggle,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" })
	});
}
function DurationPick({ time, days, onTime, onDays }) {
	const hoursRef = (0, import_react.useRef)(null);
	const caretRef = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		const el = hoursRef.current;
		const pos = caretRef.current;
		if (!el || pos == null) return;
		el.setSelectionRange(pos, pos);
		caretRef.current = null;
	}, [time]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-1 text-xs text-muted",
		children: "Duração"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: hoursRef,
			type: "text",
			inputMode: "numeric",
			value: time,
			placeholder: "0  h",
			"aria-label": "Duração em horas e minutos",
			onChange: (event) => {
				const raw = event.target.value;
				if (!raw.trim()) {
					onTime("");
					return;
				}
				const nums = raw.match(/\d+/g) ?? [];
				let hours = Number((nums[0] ?? "").slice(0, 3));
				const minutes = (nums[1] ?? "").slice(0, 2);
				if (!Number.isFinite(hours)) hours = 0;
				if (!hours && !minutes) {
					onTime("");
					return;
				}
				if (hours > 23) {
					const extra = Math.floor(hours / 24);
					hours = hours % 24;
					const current = Number(days.replace(/\D/g, "")) || 0;
					onDays(String(current + extra));
				}
				if (!hours && !minutes) {
					onTime("");
					caretRef.current = 0;
					return;
				}
				const hourLabel = String(hours);
				const next = minutes ? `${hourLabel}  h ${Number(minutes)} min` : `${hourLabel}  h`;
				caretRef.current = minutes ? next.lastIndexOf(" min") : hourLabel.length;
				onTime(next);
			},
			className: "cal-field-sm h-11 rounded-xl bg-bg px-2 text-center text-sm tabular-nums text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: days,
			onChange: (event) => onDays(event.target.value.replace(/\D/g, "").slice(0, 3)),
			placeholder: "dias",
			inputMode: "numeric",
			"aria-label": "Duração em dias",
			className: "cal-field-sm h-11 rounded-xl bg-bg px-3 text-center text-sm tabular-nums text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
		})]
	})] });
}
function HolidayNote({ iso, events }) {
	let label = null;
	for (const event of events) {
		if (event.iso !== iso) continue;
		const next = officeHolidayLabel(event);
		if (next === "Feriado Nacional") {
			label = next;
			break;
		}
		if (next) label = next;
	}
	if (!label) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "cal-holiday-note",
		children: label
	});
}
function ArquivoIcon({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "5",
				y: "3.8",
				width: "14",
				height: "16.4",
				rx: "1",
				stroke: "currentColor",
				strokeWidth: "1.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M5 9.2h14M5 14.4h14",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10.6 6.4h2.8M10.6 11.7h2.8M10.6 16.9h2.8",
				stroke: "currentColor",
				strokeWidth: "1.6",
				strokeLinecap: "round"
			})
		]
	});
}
function foldPt(value) {
	return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}
function titleHits(title, query) {
	const q = foldPt(query);
	if (q.length < 2) return false;
	const folded = foldPt(title);
	if (folded.startsWith(q)) return true;
	return folded.split(/[^a-z0-9]+/).some((word) => word.startsWith(q));
}
function newestTitleMatch(list, query, skipId) {
	const hits = list.filter((event) => event.id !== skipId && titleHits(event.title, query));
	if (!hits.length) return null;
	hits.sort((a, b) => a.iso < b.iso ? 1 : a.iso > b.iso ? -1 : 0);
	return hits[0];
}
function recallFromArchive(query, agenda, historyList, skipId) {
	const q = query.trim();
	if (foldPt(q).length < 2) return null;
	const live = agenda.filter((event) => event.source === "local" || event.source === "period" || event.source === "google");
	const birthdays = agenda.filter((event) => event.source === "birthday");
	return newestTitleMatch(live, q, skipId) ?? newestTitleMatch(historyList, q, skipId) ?? newestTitleMatch(birthdays, q, skipId);
}
function YearType({ year, onYear }) {
	const [text, setText] = (0, import_react.useState)(String(year).padStart(4, "0"));
	const [flash, setFlash] = (0, import_react.useState)(false);
	const [pick, setPick] = (0, import_react.useState)(false);
	const flashT = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		setText(String(year).padStart(4, "0"));
	}, [year]);
	function commit(raw) {
		if (raw.length !== 4) {
			setText(String(year).padStart(4, "0"));
			return;
		}
		const next = Number(raw);
		if (!Number.isFinite(next) || next < 1 || next > 9999) {
			setText(String(year).padStart(4, "0"));
			return;
		}
		if (next !== year) onYear(next);
		else setText(String(next).padStart(4, "0"));
	}
	function ping() {
		setPick(true);
		setFlash(false);
		requestAnimationFrame(() => setFlash(true));
		window.clearTimeout(flashT.current);
		flashT.current = window.setTimeout(() => setFlash(false), 1250);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("cal-year-btn cal-year-type", flash && "is-flash", pick && "is-pick"),
		onPointerDown: ping,
		onBlurCapture: () => setPick(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YearSeg, {
			value: text,
			className: "cal-year-seg",
			onChange: setText,
			onComplete: commit
		})
	});
}
function ContactField({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			maxLength: 35,
			onChange: (event) => {
				const next = event.target.value;
				onChange(next.length > 35 ? fitContact(next) : next);
			},
			placeholder: "Contato",
			className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Abrir contatos do celular",
			...withTip("Contatos", "flex size-8 shrink-0 items-center justify-center text-fg"),
			onClick: () => {
				pickDeviceContact().then((picked) => {
					if (picked) onChange(fitContact(picked));
				});
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, { className: "size-4" })
		})]
	});
}
function Calendae() {
	const [today, setToday] = (0, import_react.useState)(todayIso);
	const [view, setView] = (0, import_react.useState)(() => fromIso(todayIso()));
	const [selected, setSelected] = (0, import_react.useState)(todayIso);
	const [settings, setSettings] = (0, import_react.useState)(DEFAULT_SETTINGS);
	const [localEvents, setLocalEvents] = (0, import_react.useState)([]);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [holidayStore, setHolidayStore] = (0, import_react.useState)(seedHolidayStore);
	const [googleEvents, setGoogleEvents] = (0, import_react.useState)([]);
	const [googleStatus, setGoogleStatus] = (0, import_react.useState)(null);
	const [googlePending, setGooglePending] = (0, import_react.useState)(false);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [draftTitle, setDraftTitle] = (0, import_react.useState)("");
	const [draftTime, setDraftTime] = (0, import_react.useState)("09:00");
	const [draftPlace, setDraftPlace] = (0, import_react.useState)("");
	const [draftContact, setDraftContact] = (0, import_react.useState)("");
	const [draftKind, setDraftKind] = (0, import_react.useState)(null);
	const [draftEveryDays, setDraftEveryDays] = (0, import_react.useState)("");
	const [kindMenu, setKindMenu] = (0, import_react.useState)(false);
	const [draftMonthSide, setDraftMonthSide] = (0, import_react.useState)("");
	const [draftMonthNth, setDraftMonthNth] = (0, import_react.useState)("");
	const [draftMonthUtil, setDraftMonthUtil] = (0, import_react.useState)(false);
	const [draftIntervalRule, setDraftIntervalRule] = (0, import_react.useState)("ignorar");
	const [sideMenu, setSideMenu] = (0, import_react.useState)(false);
	const [ruleMenu, setRuleMenu] = (0, import_react.useState)(false);
	const [draftNotify, setDraftNotify] = (0, import_react.useState)(false);
	const [draftDurTime, setDraftDurTime] = (0, import_react.useState)("");
	const [draftDurDays, setDraftDurDays] = (0, import_react.useState)("");
	const [draftDate, setDraftDate] = (0, import_react.useState)(todayIso);
	const [nowMs, setNowMs] = (0, import_react.useState)(() => Date.now());
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [openMenu, setOpenMenu] = (0, import_react.useState)(null);
	const [openEventId, setOpenEventId] = (0, import_react.useState)(null);
	const [openHolidayIso, setOpenHolidayIso] = (0, import_react.useState)(null);
	const [openHighlightId, setOpenHighlightId] = (0, import_react.useState)(null);
	const [openBirthdayId, setOpenBirthdayId] = (0, import_react.useState)(null);
	const [openBenefitId, setOpenBenefitId] = (0, import_react.useState)(null);
	const [openBillId, setOpenBillId] = (0, import_react.useState)(null);
	const [openIrpfId, setOpenIrpfId] = (0, import_react.useState)(null);
	const [openPisId, setOpenPisId] = (0, import_react.useState)(null);
	const [openIpvaId, setOpenIpvaId] = (0, import_react.useState)(null);
	const [openFgtsId, setOpenFgtsId] = (0, import_react.useState)(null);
	const [openBolsaId, setOpenBolsaId] = (0, import_react.useState)(null);
	const [openGasId, setOpenGasId] = (0, import_react.useState)(null);
	const [openLicencaId, setOpenLicencaId] = (0, import_react.useState)(null);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [periodOpen, setPeriodOpen] = (0, import_react.useState)(false);
	const [periodMenu, setPeriodMenu] = (0, import_react.useState)(false);
	const [periodTitle, setPeriodTitle] = (0, import_react.useState)("Folgas");
	const [periodNote, setPeriodNote] = (0, import_react.useState)("");
	const [periodDate, setPeriodDate] = (0, import_react.useState)(todayIso);
	const [periodDays, setPeriodDays] = (0, import_react.useState)("1");
	const [periodDirty, setPeriodDirty] = (0, import_react.useState)(false);
	const [periodEditingId, setPeriodEditingId] = (0, import_react.useState)(null);
	const [openPeriodId, setOpenPeriodId] = (0, import_react.useState)(null);
	const periodDraftId = (0, import_react.useRef)(null);
	const searchOpenRef = (0, import_react.useRef)(false);
	searchOpenRef.current = searchOpen;
	const [irpfRev, setIrpfRev] = (0, import_react.useState)(0);
	const [moonRev, setMoonRev] = (0, import_react.useState)(0);
	const [laborRev, setLaborRev] = (0, import_react.useState)(0);
	const [openHistoryId, setOpenHistoryId] = (0, import_react.useState)(null);
	const [editingEventId, setEditingEventId] = (0, import_react.useState)(null);
	const [reminderStatus, setReminderStatus] = (0, import_react.useState)(null);
	const [remindersBusy, setRemindersBusy] = (0, import_react.useState)(false);
	const [municipalEvents, setMunicipalEvents] = (0, import_react.useState)([]);
	const [inssStore, setInssStore] = (0, import_react.useState)({});
	const holidayStoreRef = (0, import_react.useRef)(holidayStore);
	holidayStoreRef.current = holidayStore;
	const viewRef = (0, import_react.useRef)(view);
	viewRef.current = view;
	const selectedRef = (0, import_react.useRef)(selected);
	selectedRef.current = selected;
	const agendaDraftId = (0, import_react.useRef)(null);
	const swipeRef = (0, import_react.useRef)(null);
	const pageRef = (0, import_react.useRef)(null);
	const tabFlash = (0, import_react.useRef)(0);
	const [canScrollDown, setCanScrollDown] = (0, import_react.useState)(true);
	const [canScrollUp, setCanScrollUp] = (0, import_react.useState)(false);
	const pointerStart = (0, import_react.useRef)(null);
	const lastWheel = (0, import_react.useRef)(0);
	const skipGridClick = (0, import_react.useRef)(false);
	const [glyphFlash, pingGlyph] = useGlyphFlash();
	const [endFlash, pingEnd] = useGlyphFlash();
	const [startFlash, pingStart] = useGlyphFlash();
	const [downHiding, setDownHiding] = (0, import_react.useState)(false);
	const [upHiding, setUpHiding] = (0, import_react.useState)(false);
	const hideDownTimer = (0, import_react.useRef)(0);
	const hideUpTimer = (0, import_react.useRef)(0);
	const firstLaunch = (0, import_react.useRef)(false);
	const pulledFor = (0, import_react.useRef)(null);
	const lastPushPrint = (0, import_react.useRef)("");
	const [cloudStatus, setCloudStatus] = (0, import_react.useState)(null);
	const { user } = useCalendaeSession();
	const userId = user?.id ?? null;
	(0, import_react.useLayoutEffect)(() => {
		firstLaunch.current = !readSettingsRaw();
		setSettings(firstLaunch.current ? {
			...readSettings(),
			municipal: true
		} : readSettings());
		const day = todayIso();
		const loaded = readLocalEvents();
		const live = [];
		const archived = [];
		for (const raw of loaded) {
			const event = raw.source === "period" && raw.kind ? {
				...raw,
				kind: void 0,
				everyDays: void 0
			} : raw;
			if (isDueForHistory(event, day)) archived.push(archiveEvent(event));
			else live.push(event);
		}
		setToday(day);
		setLocalEvents(live);
		setHistory(mergeEventsById(readHistory(), archived));
		const store = readHolidayStore();
		const y = fromIso(day).getFullYear();
		if (!store[String(y)]?.events?.length) store[String(y)] = {
			events: fallbackHolidays(y),
			fetchedAt: 0,
			source: "fallback"
		};
		setHolidayStore(store);
		const inss = readInssStore();
		applyInssStore(inss);
		setInssStore(inss);
		setHydrated(true);
		setReminderStatus(reminderStatusLabel());
	}, []);
	(0, import_react.useEffect)(() => {
		function down(event) {
			const el = event.target?.closest(".cal-icon-tip");
			if (!el) return;
			const wait = window.setTimeout(() => {
				el.classList.add("is-tip");
				el.dataset.held = "1";
			}, 480);
			function up() {
				window.clearTimeout(wait);
				window.setTimeout(() => el.classList.remove("is-tip"), 800);
				window.removeEventListener("pointerup", up);
				window.removeEventListener("pointercancel", up);
			}
			window.addEventListener("pointerup", up);
			window.addEventListener("pointercancel", up);
		}
		function click(event) {
			const el = event.target?.closest(".cal-icon-tip");
			if (el?.dataset.held === "1") {
				event.preventDefault();
				event.stopPropagation();
				delete el.dataset.held;
			}
		}
		document.addEventListener("pointerdown", down);
		document.addEventListener("click", click, true);
		return () => {
			document.removeEventListener("pointerdown", down);
			document.removeEventListener("click", click, true);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
	}, [settings, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(EVENTS_KEY, JSON.stringify(localEvents));
	}, [localEvents, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
	}, [history, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(HOLIDAYS_KEY, JSON.stringify(holidayStore));
	}, [holidayStore, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(INSS_KEY, JSON.stringify(inssStore));
	}, [inssStore, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!userId) {
			pulledFor.current = null;
			lastPushPrint.current = "";
		}
	}, [userId]);
	(0, import_react.useEffect)(() => {
		if (!hydrated || !userId || pulledFor.current !== userId) return;
		const print = notebookPrint(settings, localEvents, history);
		if (print === lastPushPrint.current) return;
		const wait = window.setTimeout(() => {
			if (print === lastPushPrint.current) return;
			lastPushPrint.current = print;
			pushCloud({ data: packNotebook({
				settings,
				events: localEvents,
				history
			}) }).catch(() => setCloudStatus("Nuvem falhou."));
		}, 1500);
		return () => window.clearTimeout(wait);
	}, [
		settings,
		localEvents,
		history,
		hydrated,
		userId
	]);
	(0, import_react.useEffect)(() => {
		const tick = () => {
			setToday(todayIso());
			setNowMs(Date.now());
		};
		const id = window.setInterval(tick, 15e3);
		const onVis = () => {
			if (document.visibilityState === "visible") tick();
		};
		document.addEventListener("visibilitychange", onVis);
		return () => {
			window.clearInterval(id);
			document.removeEventListener("visibilitychange", onVis);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		setLocalEvents((prev) => {
			const keep = [];
			const move = [];
			for (const event of prev) if (isDueForHistory(event, today, new Date(nowMs))) move.push(event);
			else keep.push(event);
			if (!move.length) return prev;
			setHistory((hist) => mergeEventsById(hist, move.map(archiveEvent)));
			return keep;
		});
		setGoogleEvents((prev) => {
			const keep = [];
			const move = [];
			for (const event of prev) if (isDueForHistory(event, today, new Date(nowMs))) move.push(event);
			else keep.push(event);
			if (!move.length) return prev;
			setHistory((hist) => mergeEventsById(hist, move.map(archiveEvent)));
			return keep;
		});
	}, [
		hydrated,
		today,
		nowMs
	]);
	const year = view.getFullYear();
	const todayYear = fromIso(today).getFullYear();
	const syncHolidays = (0, import_react.useCallback)(async (years, force = false) => {
		const unique = [...new Set(years)];
		await Promise.all(unique.map(async (target) => {
			const cached = holidayStoreRef.current[String(target)];
			if (!force && cached?.source === "live" && cached.events.length) return;
			try {
				const { getHolidays } = await import("./calendar-server-Cid4tTfg.mjs");
				const row = await getHolidays({ data: { year: target } });
				setHolidayStore((prev) => ({
					...prev,
					[String(target)]: {
						events: row.events.length ? row.events : fallbackHolidays(target),
						fetchedAt: Date.now(),
						source: row.events.length ? "live" : "fallback"
					}
				}));
			} catch {
				setHolidayStore((prev) => {
					if (prev[String(target)]?.events?.length) return prev;
					return {
						...prev,
						[String(target)]: {
							events: fallbackHolidays(target),
							fetchedAt: 0,
							source: "fallback"
						}
					};
				});
			}
		}));
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		syncHolidays([year, todayYear]);
	}, [
		hydrated,
		year,
		todayYear,
		syncHolidays
	]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		ensureAlmanac(year - 1);
		ensureAlmanac(year);
		ensureAlmanac(year + 1);
		ensureAlmanac(todayYear);
	}, [
		hydrated,
		year,
		todayYear
	]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		if (!settings.elections || settings.electionSecondRound) return;
		if (year % 4 !== 2) return;
		if (settings.electionSecondTriedYear === year) return;
		if (showElectionSecond(year, false)) return;
		const first = firstRoundIso(year);
		if (today < dayAfter(first)) return;
		let cancelled = false;
		import("./calendar-server-Cid4tTfg.mjs").then(async ({ confirmElectionSecondRound }) => {
			try {
				const row = await confirmElectionSecondRound({ data: { year } });
				if (cancelled) return;
				if (row.confirmed) stampSecondRound(year, secondRoundIso(year), row.source ?? "wiki");
				setSettings((prev) => ({
					...prev,
					electionSecondTriedYear: year,
					electionSecondRound: row.confirmed ? true : prev.electionSecondRound
				}));
			} catch {
				if (cancelled) return;
				setSettings((prev) => ({
					...prev,
					electionSecondTriedYear: year
				}));
			}
		});
		return () => {
			cancelled = true;
		};
	}, [
		hydrated,
		settings.elections,
		settings.electionSecondRound,
		settings.electionSecondTriedYear,
		year,
		today
	]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		const row = ensureAlmanac(year).irpf;
		if (row?.confirmed && row.lots?.some((lot) => lot.confirmed)) return;
		let cancelled = false;
		import("./calendar-server-Cid4tTfg.mjs").then(async ({ confirmIrpfDeadline }) => {
			try {
				const hit = await confirmIrpfDeadline({ data: { year } });
				if (cancelled) return;
				if (hit.confirmed && hit.iso) {
					stampIrpf(year, hit.iso, hit.source ?? "receita", hit.lots);
					setIrpfRev((n) => n + 1);
				} else if (hit.lots?.some((lot) => lot.confirmed)) {
					stampIrpfLots(year, hit.lots);
					setIrpfRev((n) => n + 1);
				}
			} catch {}
		});
		return () => {
			cancelled = true;
		};
	}, [hydrated, year]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		if (settings.laborTriedYear === todayYear) return;
		let cancelled = false;
		const stop = whenIdle(() => {
			import("./calendar-server-Cid4tTfg.mjs").then(async ({ confirmLaborYear }) => {
				try {
					const hit = await confirmLaborYear({ data: { year: todayYear } });
					if (cancelled) return;
					if (hit.pis) stampPis(todayYear, hit.pis.byMonth, hit.pis.source, hit.pis.confirmed);
					if (hit.fgts) stampFgts(todayYear, hit.fgts.byMonth, hit.fgts.source, hit.fgts.confirmed);
					if (hit.pis || hit.fgts) setLaborRev((n) => n + 1);
				} catch {}
				if (!cancelled) setSettings((prev) => prev.laborTriedYear === todayYear ? prev : {
					...prev,
					laborTriedYear: todayYear
				});
			});
		});
		return () => {
			cancelled = true;
			stop();
		};
	}, [
		hydrated,
		settings.laborTriedYear,
		todayYear
	]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		if (moonFestivalTriedYear() === todayYear) return;
		let cancelled = false;
		const stop = whenIdle(() => {
			import("./calendar-server-Cid4tTfg.mjs").then(async ({ confirmMoonFestival }) => {
				try {
					const hit = await confirmMoonFestival({ data: { year: todayYear } });
					if (cancelled) return;
					if (hit.iso) rememberMoonFestival(todayYear, hit.iso, todayYear);
					else markMoonFestivalTried(todayYear);
					setMoonRev((n) => n + 1);
				} catch {
					if (!cancelled) markMoonFestivalTried(todayYear);
				}
			});
		});
		return () => {
			cancelled = true;
			stop();
		};
	}, [hydrated, todayYear]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		const y = year;
		if (inssStore[String(y)]?.table) {
			rememberInssTable(y, inssStore[String(y)].table);
			return;
		}
		return whenIdle(() => {
			import("./calendar-server-Cid4tTfg.mjs").then(async ({ getInssCalendar }) => {
				try {
					const row = await getInssCalendar({ data: { year: y } });
					if (!row.table) return;
					rememberInssTable(y, row.table);
					setInssStore((prev) => ({
						...prev,
						[String(y)]: {
							table: row.table,
							fetchedAt: Date.now()
						}
					}));
				} catch {}
			});
		});
	}, [
		hydrated,
		year,
		inssStore
	]);
	const holidays = (0, import_react.useMemo)(() => {
		return holidaysForYears(holidayStore, [year, todayYear]).filter((event) => {
			if (!settings.facultative && isFacultative(event)) return false;
			if (!settings.national && isNational(event)) return false;
			return true;
		});
	}, [
		holidayStore,
		year,
		todayYear,
		settings.facultative,
		settings.national
	]);
	const holidayPool = (0, import_react.useMemo)(() => uniqueEvents([
		...holidaysForYears(holidayStore, [year]),
		...commemorativeDates(year),
		...electionDates(year, true),
		...municipalEvents
	]), [
		holidayStore,
		year,
		municipalEvents,
		moonRev
	]);
	const irpfEvent = (0, import_react.useMemo)(() => settings.irpfOn ? irpfForYear(year) : null, [
		year,
		irpfRev,
		settings.irpfOn
	]);
	const irpfLots = (0, import_react.useMemo)(() => irpfLotsForYear(year), [year, irpfRev]);
	const laborMonth = settings.laborMonth;
	const pis = (0, import_react.useMemo)(() => {
		if (!laborMonth || !settings.pisOn) return null;
		const base = pisEvent(year, laborMonth);
		const stamp = ensureAlmanac(year).pis;
		const iso = stamp?.byMonth?.[laborMonth];
		if (!iso) return base;
		return {
			...base,
			iso,
			confirmed: stamp.confirmed
		};
	}, [
		year,
		laborMonth,
		settings.pisOn,
		laborRev
	]);
	const fgts = (0, import_react.useMemo)(() => {
		if (!laborMonth || !settings.fgtsOn) return null;
		const base = fgtsEvent(year, laborMonth);
		const stamp = ensureAlmanac(year).fgts;
		const row = stamp?.byMonth?.[laborMonth];
		if (!row) return base;
		return {
			...base,
			iso: row.iso,
			confirmed: stamp.confirmed
		};
	}, [
		year,
		laborMonth,
		settings.fgtsOn,
		laborRev
	]);
	const fgtsUntil = (0, import_react.useMemo)(() => {
		if (!laborMonth || !settings.fgtsOn) return null;
		const stamp = ensureAlmanac(year).fgts?.byMonth?.[laborMonth];
		if (stamp?.until) return stamp.until;
		return fgtsWindow(year, laborMonth).until;
	}, [
		year,
		laborMonth,
		settings.fgtsOn,
		laborRev
	]);
	const bolsaDigit = nisDigit(settings.bolsaNis);
	const bolsa = (0, import_react.useMemo)(() => bolsaDigit !== null && settings.bolsaOn ? bolsaEvent(year, view.getMonth(), bolsaDigit, settings.bolsaNis) : null, [
		year,
		view,
		bolsaDigit,
		settings.bolsaNis,
		settings.bolsaOn
	]);
	const gas = (0, import_react.useMemo)(() => bolsaDigit !== null && settings.gasOn ? gasEvent(year, view.getMonth(), settings.bolsaNis) : null, [
		year,
		view,
		bolsaDigit,
		settings.bolsaNis,
		settings.gasOn
	]);
	const ipvaUf = settings.ipvaUf || settings.cityUf;
	const ipva = (0, import_react.useMemo)(() => settings.ipvaOn && settings.ipvaDigit !== null ? ipvaEvent(year, ipvaUf, settings.ipvaDigit) : null, [
		year,
		ipvaUf,
		settings.ipvaDigit,
		settings.ipvaOn
	]);
	const ipvaLots = (0, import_react.useMemo)(() => settings.ipvaOn && settings.ipvaDigit !== null ? ipvaParcels(year, ipvaUf, settings.ipvaDigit) ?? [] : [], [
		year,
		ipvaUf,
		settings.ipvaDigit,
		settings.ipvaOn
	]);
	const ipvaGrid = (0, import_react.useMemo)(() => settings.ipvaOn && settings.ipvaDigit !== null ? ipvaMarks(year, ipvaUf, settings.ipvaDigit) : [], [
		year,
		ipvaUf,
		settings.ipvaDigit,
		settings.ipvaOn
	]);
	const licenca = (0, import_react.useMemo)(() => settings.licencaOn && settings.ipvaDigit !== null ? licencaEvent(year, ipvaUf, settings.ipvaDigit) : null, [
		year,
		ipvaUf,
		settings.ipvaDigit,
		settings.licencaOn
	]);
	const extraHolidays = (0, import_react.useMemo)(() => {
		const list = [];
		if (settings.commemorative) list.push(...commemorativeDates(year));
		if (settings.municipal) list.push(...municipalEvents);
		return list;
	}, [
		settings.commemorative,
		settings.municipal,
		municipalEvents,
		year,
		moonRev
	]);
	const highlights = (0, import_react.useMemo)(() => {
		const list = [];
		if (settings.elections) list.push(...electionDates(year, showElectionSecond(year, settings.electionSecondRound)));
		if (settings.enem) list.push(...enemDates(year));
		if (settings.seasons) list.push(...seasonDates(year));
		if (settings.lunar) list.push(...lunarDates(year));
		return list;
	}, [
		settings.elections,
		settings.electionSecondRound,
		settings.enem,
		settings.seasons,
		settings.lunar,
		year
	]);
	const searchItems = (0, import_react.useMemo)(() => {
		if (!searchOpen) return [];
		const items = [];
		const pushEvent = (event, iso = event.iso, kind) => {
			if (!event.title || !iso) return;
			items.push({
				id: event.id,
				title: event.title,
				text: [
					event.title,
					event.place,
					event.contact,
					event.note
				].filter(Boolean).join(" "),
				iso,
				kind: kind ?? searchKind(event),
				slot: searchSlot(event, kind)
			});
		};
		for (const event of localEvents) pushEvent(event, event.source === "birthday" ? upcomingBirthday(event.iso, today) : event.iso);
		for (const event of googleEvents) pushEvent(event);
		for (const event of history) pushEvent(event, event.iso, "Histórico");
		const years = [];
		for (let next = todayYear - 1; next <= todayYear + 15; next += 1) years.push(next);
		for (const event of holidaysForYears(holidayStore, years)) pushEvent(event);
		for (const event of extraHolidays) pushEvent(event);
		for (const target of years) {
			if (settings.elections) for (const event of electionDates(target, showElectionSecond(target, settings.electionSecondRound))) pushEvent(event);
			if (settings.enem) for (const event of enemDates(target)) pushEvent(event);
			if (settings.seasons) for (const event of seasonDates(target)) pushEvent(event);
			if (settings.lunar) for (const event of lunarDates(target)) pushEvent(event);
		}
		for (const event of [
			irpfEvent,
			pis,
			fgts,
			bolsa,
			gas,
			licenca,
			ipva
		]) if (event) pushEvent(event);
		return items;
	}, [
		searchOpen,
		localEvents,
		googleEvents,
		history,
		today,
		todayYear,
		holidayStore,
		extraHolidays,
		settings.elections,
		settings.electionSecondRound,
		settings.enem,
		settings.seasons,
		settings.lunar,
		irpfEvent,
		pis,
		fgts,
		bolsa,
		gas,
		licenca,
		ipva
	]);
	const benefitEvents = (0, import_react.useMemo)(() => {
		const month = view.getMonth();
		return localEvents.flatMap((event) => {
			if (event.source !== "benefit") return [];
			const parsed = parseNb(event.nb ?? "");
			if (!parsed) return [];
			const iso = inssPayIso(year, month, parsed.digit, event.bracket ?? "minimo");
			return iso ? [{
				...event,
				iso,
				kind: "mensal"
			}] : [];
		});
	}, [
		localEvents,
		year,
		view
	]);
	const allEvents = (0, import_react.useMemo)(() => uniqueEvents([
		...localEvents.filter((event) => event.source !== "benefit" && event.source !== "period"),
		...benefitEvents,
		...holidays,
		...extraHolidays,
		...highlights,
		...irpfEvent ? [irpfEvent] : [],
		...pis ? [pis] : [],
		...fgts ? [fgts] : [],
		...bolsa ? [bolsa] : [],
		...gas ? [gas] : [],
		...licenca ? [licenca] : [],
		...ipvaGrid,
		...googleEvents.filter((event) => !isDueForHistory(event, today))
	]).filter((event) => tabAllowsEvent(settings.tabs, event)), [
		localEvents,
		benefitEvents,
		holidays,
		extraHolidays,
		highlights,
		irpfEvent,
		pis,
		fgts,
		bolsa,
		gas,
		licenca,
		ipvaGrid,
		googleEvents,
		today,
		settings.tabs
	]);
	const blockedHolidays = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const event of [...holidays, ...extraHolidays]) {
			if (event.holidayKind === "election" || event.holidayKind === "enem" || event.holidayKind === "season" || event.holidayKind === "lunar") continue;
			set.add(event.iso);
		}
		return set;
	}, [holidays, extraHolidays]);
	const gridEvents = (0, import_react.useMemo)(() => {
		const month = view.getMonth();
		const start = toIso(civilDate(year, month, 1));
		const end = toIso(civilDate(year, month + 1, 0));
		const horizon = toIso(civilDate(year, month + 1, 21));
		return allEvents.flatMap((event) => {
			if (!event.kind || !event.intervalRule || event.intervalRule === "ignorar") return [event];
			return resolvedMarks(event, blockedHolidays, horizon).filter((iso) => iso >= start && iso <= end).map((iso) => ({
				...event,
				iso,
				kind: void 0,
				everyDays: void 0,
				monthSide: void 0
			}));
		});
	}, [
		allEvents,
		blockedHolidays,
		view,
		year
	]);
	const cells = (0, import_react.useMemo)(() => buildMonthCells(view, today, gridEvents, settings.weekStart), [
		view,
		today,
		gridEvents,
		settings.weekStart
	]);
	const periodIsos = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const event of localEvents) {
			if (event.source !== "period" || isDueForHistory(event, today, new Date(nowMs))) continue;
			for (const iso of eventSpanIsos(event)) set.add(iso);
		}
		return set;
	}, [
		localEvents,
		today,
		nowMs
	]);
	const monthEvents = (0, import_react.useMemo)(() => {
		const month = view.getMonth();
		return allEvents.flatMap((event) => {
			if (event.source === "holiday" || event.source === "birthday" || event.source === "benefit" || event.source === "bill" || event.source === "boleto" || event.source === "irpf" || event.source === "pis" || event.source === "ipva" || event.source === "fgts" || event.source === "bolsa" || event.source === "gas" || event.source === "licenca" || event.source === "period" || isPeriodEvent(event)) return [];
			if (event.kind && event.intervalRule && event.intervalRule !== "ignorar") {
				const start = toIso(civilDate(year, month, 1));
				const end = toIso(civilDate(year, month + 1, 0));
				const horizon = toIso(civilDate(year, month + 1, 21));
				const marks = resolvedMarks(event, blockedHolidays, horizon).filter((iso) => iso >= start && iso <= end);
				return marks[0] ? [{
					event,
					iso: marks[0]
				}] : [];
			}
			if (event.kind === "semanal" || event.kind === "mensal" || event.kind === "semestral" || event.kind === "anual" || event.kind === "posicao") {
				const iso = occurrenceInMonth(event, year, month);
				return iso ? [{
					event,
					iso
				}] : [];
			}
			if (event.kind === "personalizado") {
				const last = civilDate(year, month + 1, 0).getDate();
				const rows = [];
				for (let day = 1; day <= last; day += 1) {
					const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
					if (eventMatchesIso(event, iso)) rows.push({
						event,
						iso
					});
				}
				return rows;
			}
			if (isDueForHistory(event, today, new Date(nowMs))) return [];
			const last = lastVisibleIso(event);
			const monthStart = toIso(civilDate(year, month, 1));
			const monthEnd = toIso(civilDate(year, month + 1, 0));
			if (last < monthStart || event.iso > monthEnd) return [];
			return [{
				event,
				iso: event.iso
			}];
		}).sort((a, b) => a.iso.localeCompare(b.iso) || (a.event.time ?? "").localeCompare(b.event.time ?? ""));
	}, [
		allEvents,
		blockedHolidays,
		view,
		year,
		today,
		nowMs
	]);
	const monthPeriods = (0, import_react.useMemo)(() => localEvents.filter((event) => event.source === "period" && eventOverlapsMonth(event, year, view.getMonth()) && !isDueForHistory(event, today, new Date(nowMs))).sort((a, b) => a.iso.localeCompare(b.iso) || a.title.localeCompare(b.title)), [
		localEvents,
		year,
		view,
		today,
		nowMs
	]);
	const birthdays = (0, import_react.useMemo)(() => localEvents.filter((event) => event.source === "birthday").map((event) => ({
		...event,
		kind: "anual"
	})), [localEvents]);
	const benefits = (0, import_react.useMemo)(() => localEvents.filter((event) => event.source === "benefit"), [localEvents]);
	const bills = (0, import_react.useMemo)(() => localEvents.filter((event) => event.source === "bill"), [localEvents]);
	const boletos = (0, import_react.useMemo)(() => localEvents.filter((event) => event.source === "boleto"), [localEvents]);
	(0, import_react.useEffect)(() => {
		if (!settings.cityIbge) {
			setMunicipalEvents([]);
			return;
		}
		if (!settings.municipal) return;
		const ibge = settings.cityIbge;
		const city = settings.cityName;
		const uf = settings.cityUf;
		let cancelled = false;
		import("./calendar-server-Cid4tTfg.mjs").then(async ({ getMunicipalHolidays }) => {
			try {
				const events = await getMunicipalHolidays({ data: {
					year,
					ibge,
					city: city || "Cidade",
					uf: uf || void 0
				} });
				if (cancelled) return;
				setMunicipalEvents(events);
			} catch {
				if (cancelled) return;
				setMunicipalEvents([]);
			}
		});
		return () => {
			cancelled = true;
		};
	}, [
		settings.municipal,
		settings.cityIbge,
		settings.cityName,
		settings.cityUf,
		year
	]);
	const syncGoogle = (0, import_react.useCallback)(async ({ login = false } = {}) => {
		setGooglePending(true);
		try {
			const start = civilDate(viewRef.current.getFullYear(), viewRef.current.getMonth(), 1);
			const end = civilDate(viewRef.current.getFullYear(), viewRef.current.getMonth() + 1, 1);
			const { getGoogleMonth } = await import("./calendar-server-Cid4tTfg.mjs");
			const row = await getGoogleMonth({ data: {
				timeMin: start.toISOString(),
				timeMax: end.toISOString()
			} });
			if (row.loginRequired) {
				if (login) redirectToLoginIfRequired({
					ok: false,
					data: null,
					loginRequired: true,
					loginUrl: row.loginUrl
				});
				setGoogleStatus("Conecte o Google Agenda no Grok para puxar seus eventos.");
				setGoogleEvents([]);
				return;
			}
			if (!row.ok) {
				setGoogleStatus(row.errorMessage || "Não deu para puxar a agenda.");
				return;
			}
			setGoogleEvents(row.events.filter((event) => !isDueForHistory(event, todayIso())));
			const archived = row.events.filter((event) => isDueForHistory(event, todayIso()));
			if (archived.length) setHistory((hist) => mergeEventsById(hist, archived.map(archiveEvent)));
			setGoogleStatus(row.events.length ? `Agenda conectada. ${row.events.length} compromisso(s).` : "Agenda conectada. Nenhum compromisso no período.");
		} catch {
			setGoogleStatus("Não deu para puxar a agenda.");
		} finally {
			setGooglePending(false);
		}
	}, []);
	async function locateCity() {
		try {
			const { locateMunicipio } = await import("./calendar-server-Cid4tTfg.mjs");
			const pos = await new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8e3 });
			});
			return await locateMunicipio({ data: {
				lat: pos.coords.latitude,
				lon: pos.coords.longitude
			} });
		} catch {
			return null;
		}
	}
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		startReminders([...localEvents, ...googleEvents].filter((event) => tabAllowsEvent(settings.tabs, event)), settings.hourCycle);
	}, [
		hydrated,
		localEvents,
		googleEvents,
		settings.tabs,
		settings.hourCycle
	]);
	const monthOptions = MONTHS$1.map((label, value) => ({
		value,
		label
	}));
	function jumpTo(next, selectIso) {
		const y = next.getFullYear();
		if (y < 1) next = civilDate(1, next.getMonth(), 1);
		if (y > 9999) next = civilDate(YEAR_MAX, next.getMonth(), 1);
		setView(next);
		if (selectIso) setSelected(selectIso);
		else {
			const day = fromIso(selectedRef.current).getDate();
			const last = civilDate(next.getFullYear(), next.getMonth() + 1, 0).getDate();
			const iso = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(Math.min(day, last)).padStart(2, "0")}`;
			setSelected(iso);
		}
		setOpenMenu(null);
	}
	function openFound(item) {
		setSearchOpen(false);
		const date = fromIso(item.iso);
		jumpTo(civilDate(date.getFullYear(), date.getMonth(), 1), item.iso);
		setOpenEventId(item.slot === "event" ? item.id : null);
		setOpenHolidayIso(item.slot === "holiday" ? item.id : null);
		setOpenHighlightId(item.slot === "highlight" ? item.id : null);
		setOpenBirthdayId(item.slot === "birthday" ? item.id : null);
		setOpenBenefitId(item.slot === "benefit" ? item.id : null);
		setOpenBillId(item.slot === "bill" ? item.id : null);
		setOpenHistoryId(item.slot === "history" ? item.id : null);
		setOpenIrpfId(item.slot === "irpf" ? item.id : null);
		setOpenPisId(item.slot === "pis" ? item.id : null);
		setOpenIpvaId(item.slot === "ipva" ? item.id : null);
		setOpenFgtsId(item.slot === "fgts" ? item.id : null);
		setOpenBolsaId(item.slot === "bolsa" ? item.id : null);
		setOpenGasId(item.slot === "gas" ? item.id : null);
		setOpenLicencaId(item.slot === "licenca" ? item.id : null);
		setOpenPeriodId(item.slot === "period" ? item.id : null);
		const tab = item.slot === "holiday" ? "holidays" : item.slot === "highlight" ? "destaques" : item.slot === "birthday" ? "birthdays" : item.slot === "history" ? "history" : item.slot === "event" || item.slot === "period" ? "agenda" : "finance";
		window.setTimeout(() => {
			const page = pageRef.current;
			const node = page?.querySelector(`[data-cal-tab="${tab}"]`);
			if (!page || !(node instanceof HTMLElement)) return;
			const top = node.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop - 8;
			page.scrollTo({
				top: Math.max(0, top),
				behavior: "smooth"
			});
		}, 80);
	}
	function selectFromGrid(iso) {
		if (skipGridClick.current) {
			skipGridClick.current = false;
			return;
		}
		const date = fromIso(iso);
		if (date.getMonth() !== view.getMonth() || date.getFullYear() !== year) jumpTo(civilDate(date.getFullYear(), date.getMonth(), 1), iso);
		else setSelected(iso);
		setDraftDate(iso);
		setOpenEventId(null);
		setOpenHolidayIso(null);
		setOpenHighlightId(null);
		setOpenBirthdayId(null);
		setOpenBenefitId(null);
		setOpenHistoryId(null);
		setOpenBillId(null);
		setOpenIrpfId(null);
		setOpenPisId(null);
		setOpenIpvaId(null);
		setOpenFgtsId(null);
		setOpenBolsaId(null);
		setOpenGasId(null);
		setOpenLicencaId(null);
	}
	function scrollToTab(tab) {
		window.setTimeout(() => {
			const page = pageRef.current;
			const node = page?.querySelector(`[data-cal-tab="${tab}"]`);
			if (!page || !(node instanceof HTMLElement)) return;
			const top = node.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop - 8;
			page.scrollTo({
				top: Math.max(0, top),
				behavior: "smooth"
			});
			page.querySelectorAll(".cal-tab.is-held").forEach((item) => item.classList.remove("is-held"));
			window.clearTimeout(tabFlash.current);
			node.offsetWidth;
			node.classList.add("is-held");
			tabFlash.current = window.setTimeout(() => node.classList.remove("is-held"), 280);
		}, 80);
	}
	function showOnly(next) {
		setOpenEventId(next.event ?? null);
		setOpenHolidayIso(next.holiday ?? null);
		setOpenHighlightId(next.highlight ?? null);
		setOpenBirthdayId(next.birthday ?? null);
		setOpenBenefitId(next.benefit ?? null);
		setOpenHistoryId(null);
		setOpenBillId(next.bill ?? null);
		setOpenIrpfId(next.irpf ?? null);
		setOpenPisId(next.pis ?? null);
		setOpenIpvaId(next.ipva ?? null);
		setOpenFgtsId(next.fgts ?? null);
		setOpenBolsaId(next.bolsa ?? null);
		setOpenGasId(next.gas ?? null);
		setOpenLicencaId(next.licenca ?? null);
		setOpenPeriodId(null);
	}
	function startAgenda(iso) {
		agendaDraftId.current = null;
		setDraftTitle("");
		setDraftPlace("");
		setDraftContact("");
		setDraftTime("09:00");
		setDraftKind(null);
		setDraftEveryDays("");
		setDraftMonthSide("");
		setDraftMonthNth("");
		setDraftMonthUtil(false);
		setDraftIntervalRule("ignorar");
		setDraftNotify(false);
		setDraftDurTime("");
		setDraftDurDays("");
		setDraftDate(iso);
		setKindMenu(false);
		setSideMenu(false);
		setRuleMenu(false);
		setEditingEventId(null);
		setAdding(true);
		showOnly({});
		scrollToTab("agenda");
	}
	function revealHeld(event) {
		setAdding(false);
		setEditingEventId(null);
		const id = event.id;
		const tab = eventTab(event) ?? "agenda";
		if (event.source === "holiday") showOnly(event.holidayKind === "election" || event.holidayKind === "enem" || event.holidayKind === "season" || event.holidayKind === "lunar" ? { highlight: id } : { holiday: id });
		else if (event.source === "birthday") showOnly({ birthday: id });
		else if (event.source === "benefit") showOnly({ benefit: id });
		else if (event.source === "bill" || event.source === "boleto") showOnly({ bill: id });
		else if (event.source === "irpf") showOnly({ irpf: id });
		else if (event.source === "pis") showOnly({ pis: id });
		else if (event.source === "ipva") showOnly({ ipva: id });
		else if (event.source === "fgts") showOnly({ fgts: id });
		else if (event.source === "bolsa") showOnly({ bolsa: id });
		else if (event.source === "gas") showOnly({ gas: id });
		else if (event.source === "licenca") showOnly({ licenca: id });
		else if (event.source === "period") {
			showOnly({});
			setOpenPeriodId(id);
		} else showOnly({ event: id });
		scrollToTab(tab);
	}
	function holdFromGrid(iso) {
		const date = fromIso(iso);
		if (date.getMonth() !== view.getMonth() || date.getFullYear() !== year) jumpTo(civilDate(date.getFullYear(), date.getMonth(), 1), iso);
		else setSelected(iso);
		setDraftDate(iso);
		const chosen = [...gridEvents.filter((event) => eventMatchesIso(event, iso) && tabAllowsEvent(settings.tabs, event)), ...localEvents.filter((event) => event.source === "period" && eventSpanIsos(event).includes(iso))][0];
		if (!chosen) {
			if (settings.tabs.agenda !== false) startAgenda(iso);
			return;
		}
		revealHeld(chosen);
	}
	function pickCity(city) {
		setSettings((prev) => ({
			...prev,
			municipal: true,
			cityName: city.name,
			cityIbge: city.ibge,
			cityUf: city.uf
		}));
	}
	function kindPatch() {
		const rule = draftKind ? { intervalRule: draftIntervalRule } : { intervalRule: void 0 };
		if (draftKind && [
			"semanal",
			"mensal",
			"semestral",
			"anual"
		].includes(draftKind)) {
			const n = Number(draftMonthNth);
			const hasNth = Number.isFinite(n) && n > 0;
			if (draftMonthSide === "primeiros" || draftMonthSide === "ultimos") return {
				kind: draftKind,
				everyDays: void 0,
				monthSide: draftMonthSide,
				monthNth: hasNth ? n : 1,
				monthUtil: draftMonthUtil,
				...rule
			};
			return {
				kind: draftKind,
				everyDays: void 0,
				monthSide: void 0,
				monthNth: void 0,
				monthUtil: void 0,
				...rule
			};
		}
		if (draftKind !== "personalizado") return {
			kind: draftKind ?? void 0,
			everyDays: void 0,
			monthSide: void 0,
			monthNth: void 0,
			monthUtil: void 0,
			...rule
		};
		const step = Number(draftEveryDays);
		if (!Number.isFinite(step) || step < 1) return {
			kind: void 0,
			everyDays: void 0,
			monthSide: void 0,
			monthNth: void 0,
			monthUtil: void 0,
			...rule
		};
		return {
			kind: "personalizado",
			everyDays: step,
			monthSide: void 0,
			monthNth: void 0,
			monthUtil: void 0,
			...rule
		};
	}
	function durationPatch() {
		const days = Number(draftDurDays);
		const mins = timeToMinutes(draftDurTime);
		return {
			durationDays: Number.isFinite(days) && days > 0 ? days : void 0,
			durationMinutes: mins > 0 ? mins : void 0
		};
	}
	function recallDraft() {
		const found = recallFromArchive(draftTitle, [...localEvents, ...googleEvents], history, editingEventId);
		if (!found) return;
		setDraftTitle(found.title.slice(0, 45));
		if (found.place) setDraftPlace(found.place.slice(0, 45));
		if (found.contact) setDraftContact(found.contact);
	}
	function updateEvent(id, patch) {
		setLocalEvents((prev) => prev.map((event) => event.id === id ? {
			...event,
			...patch
		} : event));
	}
	function removeEvent(id) {
		setLocalEvents((prev) => prev.filter((event) => event.id !== id));
	}
	function postponeEvent(event, iso) {
		if (event.source !== "local" && event.source !== "period") return;
		const nextIso = postponeIso(event, iso);
		const next = fromIso(nextIso);
		updateEvent(event.id, { iso: nextIso });
		jumpTo(civilDate(next.getFullYear(), next.getMonth(), 1), nextIso);
	}
	function markDone(event, iso) {
		if (event.source !== "local" && event.source !== "period") return;
		const snapshot = archiveEvent({
			...event,
			id: event.kind ? newEventId() : event.id,
			iso,
			kind: void 0,
			everyDays: void 0,
			monthSide: void 0,
			monthNth: void 0,
			monthUtil: void 0,
			durationDays: void 0,
			durationMinutes: void 0
		});
		setHistory((prev) => mergeEventsById(prev, [snapshot]));
		if (event.kind) {
			const nextIso = postponeIso(event, iso);
			updateEvent(event.id, { iso: nextIso });
		} else removeEvent(event.id);
		setOpenEventId(null);
		setEditingEventId(null);
	}
	function openAgendaItem(event, iso = event.iso) {
		pingGlyph();
		setSelected(iso);
		setOpenEventId((cur) => cur === event.id ? null : event.id);
		setEditingEventId(null);
		setOpenHolidayIso(null);
		setOpenHighlightId(null);
		setOpenBirthdayId(null);
		setOpenBenefitId(null);
		setOpenHistoryId(null);
		setOpenBillId(null);
		setOpenIrpfId(null);
		setOpenPisId(null);
		setOpenIpvaId(null);
		setOpenFgtsId(null);
		setOpenBolsaId(null);
		setOpenGasId(null);
		setOpenLicencaId(null);
	}
	(0, import_react.useEffect)(() => {
		if (!adding) return;
		const title = draftTitle.trim();
		if (!title) {
			if (agendaDraftId.current) {
				const id = agendaDraftId.current;
				agendaDraftId.current = null;
				setLocalEvents((prev) => prev.filter((event) => event.id !== id));
			}
			return;
		}
		if (!agendaDraftId.current) agendaDraftId.current = newEventId();
		const id = agendaDraftId.current;
		const next = {
			id,
			iso: draftDate || selected,
			title: title.slice(0, 45),
			time: draftTime,
			place: draftPlace.trim().slice(0, 45) || void 0,
			contact: draftContact.trim() ? fitContact(draftContact) : void 0,
			...kindPatch(),
			...durationPatch(),
			source: "local",
			notify: draftNotify
		};
		setLocalEvents((prev) => {
			const index = prev.findIndex((event) => event.id === id);
			if (index < 0) return [...prev, next];
			const copy = [...prev];
			copy[index] = {
				...copy[index],
				...next
			};
			return copy;
		});
	}, [
		adding,
		draftTitle,
		draftPlace,
		draftContact,
		draftTime,
		draftDate,
		draftKind,
		draftEveryDays,
		draftMonthSide,
		draftMonthNth,
		draftMonthUtil,
		draftIntervalRule,
		draftNotify,
		draftDurTime,
		draftDurDays,
		selected
	]);
	(0, import_react.useEffect)(() => {
		if (!periodOpen) return;
		const days = Math.max(1, Math.min(366, Math.floor(Number(periodDays)) || 1));
		const note = periodNote.trim().slice(0, 45) || void 0;
		if (periodEditingId) {
			setLocalEvents((prev) => prev.map((event) => event.id === periodEditingId ? {
				...event,
				title: periodTitle,
				iso: periodDate,
				durationDays: days,
				note,
				source: "period",
				kind: void 0,
				everyDays: void 0
			} : event));
			return;
		}
		if (!periodDirty) return;
		if (!periodDraftId.current) periodDraftId.current = newEventId();
		const id = periodDraftId.current;
		const next = {
			id,
			title: periodTitle,
			iso: periodDate,
			durationDays: days,
			note,
			source: "period"
		};
		setLocalEvents((prev) => {
			const index = prev.findIndex((event) => event.id === id);
			if (index < 0) return [...prev, next];
			const copy = [...prev];
			copy[index] = {
				...copy[index],
				...next
			};
			return copy;
		});
	}, [
		periodOpen,
		periodDirty,
		periodEditingId,
		periodTitle,
		periodNote,
		periodDate,
		periodDays
	]);
	(0, import_react.useEffect)(() => {
		if (!editingEventId) return;
		const title = draftTitle.trim();
		if (!title) return;
		const current = localEvents.find((event) => event.id === editingEventId);
		const source = current?.source === "birthday" || current?.source === "google" ? current.source : "local";
		updateEvent(editingEventId, {
			title: title.slice(0, 45),
			iso: draftDate,
			time: draftTime,
			place: draftPlace.trim().slice(0, 45) || void 0,
			contact: draftContact.trim() ? fitContact(draftContact) : void 0,
			...kindPatch(),
			...durationPatch(),
			source,
			notify: draftNotify
		});
	}, [
		editingEventId,
		draftTitle,
		draftPlace,
		draftContact,
		draftTime,
		draftDate,
		draftKind,
		draftEveryDays,
		draftMonthSide,
		draftMonthNth,
		draftMonthUtil,
		draftIntervalRule,
		draftNotify,
		draftDurTime,
		draftDurDays
	]);
	async function armNotify(next) {
		setDraftNotify(next);
		if (!next) return;
		setRemindersBusy(true);
		const message = await enableReminders();
		setReminderStatus(message);
		setRemindersBusy(false);
	}
	async function toggleEventNotify(event) {
		const next = !event.notify;
		updateEvent(event.id, { notify: next });
		if (!next) return;
		setRemindersBusy(true);
		const message = await enableReminders();
		setReminderStatus(message);
		setRemindersBusy(false);
	}
	(0, import_react.useEffect)(() => {
		const node = swipeRef.current;
		if (!node) return;
		function onPointerDown(event) {
			pointerStart.current = {
				x: event.clientX,
				y: event.clientY
			};
		}
		function onPointerUp(event) {
			if (searchOpenRef.current) return;
			const start = pointerStart.current;
			pointerStart.current = null;
			if (!start) return;
			const dx = event.clientX - start.x;
			const dy = event.clientY - start.y;
			if (Math.abs(dx) < 40 && Math.abs(dy) < 40) return;
			skipGridClick.current = true;
			if (Math.abs(dx) >= Math.abs(dy)) jumpTo(shiftMonth(viewRef.current, dx < 0 ? 1 : -1));
			else jumpTo(shiftMonth(viewRef.current, dy < 0 ? 1 : -1));
		}
		function onWheel(event) {
			if (searchOpenRef.current) return;
			if (event.target?.closest(".cal-pick-menu")) return;
			event.preventDefault();
			const now = Date.now();
			if (now - lastWheel.current < 420) return;
			const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
			if (Math.abs(delta) < 12) return;
			lastWheel.current = now;
			jumpTo(shiftMonth(viewRef.current, delta > 0 ? 1 : -1));
		}
		node.addEventListener("pointerdown", onPointerDown);
		node.addEventListener("pointerup", onPointerUp);
		node.addEventListener("pointercancel", onPointerUp);
		node.addEventListener("wheel", onWheel, { passive: false });
		return () => {
			node.removeEventListener("pointerdown", onPointerDown);
			node.removeEventListener("pointerup", onPointerUp);
			node.removeEventListener("pointercancel", onPointerUp);
			node.removeEventListener("wheel", onWheel);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		function onPageWheel(event) {
			if (event.target?.closest(".cal-pick-menu")) return;
			const page = pageRef.current;
			if (!page) return;
			const grid = document.querySelector(".cal-month-grid");
			if (grid && grid.contains(event.target)) return;
			if (page.scrollHeight <= page.clientHeight + 1) return;
			page.scrollTop += event.deltaY;
		}
		window.addEventListener("wheel", onPageWheel, { passive: true });
		return () => window.removeEventListener("wheel", onPageWheel);
	}, []);
	(0, import_react.useEffect)(() => {
		const el = pageRef.current;
		if (!el) return;
		function holdHide(show, setShow, setHiding, timer) {
			if (show) {
				window.clearTimeout(timer.current);
				timer.current = 0;
				setHiding(false);
				setShow(true);
				return;
			}
			if (timer.current) return;
			setHiding(true);
			timer.current = window.setTimeout(() => {
				timer.current = 0;
				setShow(false);
				setHiding(false);
			}, 1250);
		}
		function check() {
			const node = pageRef.current;
			if (!node) return;
			holdHide(node.scrollHeight - node.clientHeight - node.scrollTop > 16, setCanScrollDown, setDownHiding, hideDownTimer);
			holdHide(node.scrollTop > 16, setCanScrollUp, setUpHiding, hideUpTimer);
		}
		check();
		el.addEventListener("scroll", check, { passive: true });
		window.addEventListener("resize", check);
		const ro = new ResizeObserver(check);
		ro.observe(el);
		return () => {
			el.removeEventListener("scroll", check);
			window.removeEventListener("resize", check);
			ro.disconnect();
			window.clearTimeout(hideDownTimer.current);
			window.clearTimeout(hideUpTimer.current);
		};
	}, [
		settingsOpen,
		openEventId,
		adding,
		view,
		settings.tabs
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-theme": "clareira",
		className: cn("cal-app bg-bg font-body text-fg", settings.a11yNumbers && "a11y-num", settings.a11yText && "a11y-text", settings.a11ySaturated && "a11y-sat", settings.a11yColorblind && "a11y-cb", settings.a11yHints && "a11y-hints"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconTips, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto flex min-h-0 w-full flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "shrink-0 px-5 pt-[max(1.1rem,env(safe-area-inset-top))] pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-end gap-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderMenu, {
								label: "Escolher mês",
								value: view.getMonth(),
								options: monthOptions,
								open: openMenu === "month",
								wide: true,
								soft: true,
								buttonClassName: "cal-month-btn capitalize",
								optionClassName: "cal-month-option",
								onOpen: () => setOpenMenu("month"),
								onClose: () => setOpenMenu(null),
								onPick: (month) => jumpTo(civilDate(year, month, 1))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YearType, {
								year,
								onYear: (nextYear) => jumpTo(civilDate(nextYear, view.getMonth(), 1))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-end",
							children: [
								view.getMonth() !== fromIso(today).getMonth() || year !== fromIso(today).getFullYear() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "cal-icon-tip cal-ajustes",
									"data-tip": "Hoje",
									"aria-label": "Hoje",
									onClick: () => {
										setSearchOpen(false);
										jumpTo(fromIso(today), today);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HojeIcon, { day: fromIso(today).getDate() })
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "cal-icon-tip cal-ajustes",
									"data-tip": "Procurar",
									"aria-label": "Procurar",
									"aria-pressed": searchOpen,
									onClick: () => setSearchOpen((open) => !open),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "cal-icon-tip cal-ajustes",
									"data-tip": "Ajustes",
									"aria-label": "Ajustes",
									onClick: () => setSettingsOpen(true),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-5" })
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-h-0 w-full flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: pageRef,
							className: "cal-page flex h-full min-h-0 w-full flex-col gap-3 overflow-y-auto px-4 pb-[max(1.1rem,env(safe-area-inset-bottom))]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									ref: swipeRef,
									className: "cal-swipe relative shrink-0 overflow-hidden rounded-panel bg-surface shadow-panel",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: searchOpen ? "invisible pointer-events-none" : void 0,
										"aria-hidden": searchOpen || void 0,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthGrid, {
											cells,
											selectedIso: selected,
											today,
											periodIsos,
											weekStart: settings.weekStart,
											saturdayTint: settings.saturdayTint,
											sundayTint: settings.sundayTint,
											holidayTint: settings.holidayTint,
											onSelect: selectFromGrid,
											onHold: holdFromGrid
										})
									}), searchOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchPanel, {
											query: searchQuery,
											items: searchItems,
											onQuery: setSearchQuery,
											onPick: openFound
										})
									}) : null]
								}),
								settings.tabs.holidays ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HolidaysTab, {
									year,
									month: view.getMonth(),
									today,
									openId: openHolidayIso,
									catalog: holidays,
									extras: extraHolidays,
									pool: holidayPool,
									municipal: settings.municipal,
									commemorative: settings.commemorative,
									facultative: settings.facultative,
									national: settings.national,
									cityName: settings.cityName,
									cityUf: settings.cityUf,
									cityIbge: settings.cityIbge,
									onToggleMunicipal: (on) => {
										setSettings((prev) => ({
											...prev,
											municipal: on
										}));
									},
									onToggleCommemorative: (on) => {
										setSettings((prev) => ({
											...prev,
											commemorative: on
										}));
									},
									onToggleFacultative: (on) => {
										setSettings((prev) => ({
											...prev,
											facultative: on
										}));
									},
									onToggleNational: (on) => {
										setSettings((prev) => ({
											...prev,
											national: on
										}));
									},
									onSearchCity: async (query, uf) => {
										const { searchMunicipio } = await import("./calendar-server-Cid4tTfg.mjs");
										return searchMunicipio({ data: {
											query,
											uf
										} });
									},
									onPickCity: pickCity,
									onLocate: locateCity,
									onOpen: (event) => {
										pingGlyph();
										setSelected(event.iso);
										setOpenHolidayIso((cur) => cur === event.id ? null : event.id);
										setOpenHighlightId(null);
										setOpenEventId(null);
										setOpenBirthdayId(null);
										setOpenBenefitId(null);
										setOpenHistoryId(null);
										setOpenBillId(null);
										setOpenIrpfId(null);
										setOpenPisId(null);
										setOpenIpvaId(null);
										setOpenFgtsId(null);
										setOpenBolsaId(null);
										setOpenGasId(null);
										setOpenLicencaId(null);
									}
								}) : null,
								settings.tabs.destaques ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DestaquesTab, {
									year,
									month: view.getMonth(),
									today,
									openId: openHighlightId,
									events: highlights,
									elections: settings.elections,
									electionSecondRound: showElectionSecond(year, settings.electionSecondRound),
									enem: settings.enem,
									seasons: settings.seasons,
									lunar: settings.lunar,
									electionPlace: settings.electionPlace,
									electionZone: settings.electionZone,
									onToggleElections: (on) => setSettings((prev) => ({
										...prev,
										elections: on
									})),
									onToggleSecondRound: (on) => {
										stampSecondRound(year, on ? secondRoundIso(year) : null, on ? "user" : null);
										setSettings((prev) => ({
											...prev,
											electionSecondRound: on,
											electionSecondTriedYear: on ? prev.electionSecondTriedYear : year
										}));
									},
									onToggleEnem: (on) => setSettings((prev) => ({
										...prev,
										enem: on
									})),
									onToggleSeasons: (on) => setSettings((prev) => ({
										...prev,
										seasons: on
									})),
									onToggleLunar: (on) => setSettings((prev) => ({
										...prev,
										lunar: on
									})),
									onElectionPlace: (value) => setSettings((prev) => ({
										...prev,
										electionPlace: value
									})),
									onElectionZone: (value) => setSettings((prev) => ({
										...prev,
										electionZone: value
									})),
									onOpen: (event) => {
										pingGlyph();
										setSelected(event.iso);
										setOpenHighlightId((cur) => cur === event.id ? null : event.id);
										setOpenHolidayIso(null);
										setOpenEventId(null);
										setOpenBirthdayId(null);
										setOpenBenefitId(null);
										setOpenHistoryId(null);
										setOpenBillId(null);
										setOpenIrpfId(null);
										setOpenPisId(null);
										setOpenIpvaId(null);
										setOpenFgtsId(null);
										setOpenBolsaId(null);
										setOpenGasId(null);
										setOpenLicencaId(null);
									}
								}) : null,
								settings.tabs.agenda ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "cal-tab cal-tab-agenda",
									"data-cal-tab": "agenda",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "cal-tab-head",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "cal-tab-title",
												children: "Agenda"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												...withTip("Novo"),
												"aria-label": "Novo compromisso",
												onClick: () => {
													pingGlyph();
													if (!adding) {
														agendaDraftId.current = null;
														setDraftTitle("");
														setDraftPlace("");
														setDraftContact("");
														setDraftTime("09:00");
														setDraftKind(null);
														setDraftEveryDays("");
														setDraftMonthSide("");
														setDraftMonthNth("");
														setDraftMonthUtil(false);
														setDraftIntervalRule("ignorar");
														setDraftNotify(false);
														setDraftDurTime("");
														setDraftDurDays("");
														setDraftDate(selected);
														setKindMenu(false);
														setSideMenu(false);
														setRuleMenu(false);
														setEditingEventId(null);
													}
													setAdding((v) => !v);
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarGlyph, {
													className: "size-5",
													flash: glyphFlash
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "Compromissos do mês. Toque para ver detalhes, editar ou apagar." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 border-t border-line" }),
										adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
											className: "flex flex-col gap-2 pt-3",
											onSubmit: (event) => {
												event.preventDefault();
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														value: draftTitle,
														maxLength: 45,
														onChange: (event) => setDraftTitle(event.target.value.slice(0, 45)),
														placeholder: "Compromisso",
														className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
														autoFocus: true
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": "Arquivo",
														...withTip("Arquivo", "flex size-8 shrink-0 items-center justify-center text-fg"),
														onClick: recallDraft,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArquivoIcon, { className: "size-5" })
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														value: draftPlace,
														maxLength: 45,
														onChange: (event) => setDraftPlace(event.target.value.slice(0, 45)),
														placeholder: "Local",
														className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "size-8 shrink-0",
														"aria-hidden": "true"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactField, {
													value: draftContact,
													onChange: setDraftContact
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePick, {
													value: draftDate,
													weekStart: settings.weekStart,
													onChange: (next) => {
														setDraftDate(next);
														setSelected(next);
													}
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HolidayNote, {
													iso: draftDate,
													events: [...holidays, ...extraHolidays]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimePick, {
														value: draftTime,
														cycle: settings.hourCycle,
														onChange: setDraftTime
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotifyToggle, {
														on: draftNotify,
														onToggle: () => void armNotify(!draftNotify)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DurationPick, {
													time: draftDurTime,
													days: draftDurDays,
													onTime: setDraftDurTime,
													onDays: setDraftDurDays
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted",
													children: "Intervalo"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "Se marcar, o compromisso volta sozinho na semana, mês, semestre, ano ou a cada X dias." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindPick, {
													kind: draftKind,
													everyDays: draftEveryDays,
													open: kindMenu,
													onOpen: () => setKindMenu(true),
													onClose: () => setKindMenu(false),
													onKind: (next) => {
														setDraftKind(next);
														if (!next || next === "personalizado") {
															setDraftMonthNth("");
															if (!next) {
																setDraftMonthUtil(false);
																setSideMenu(false);
															}
														}
													},
													onEveryDays: setDraftEveryDays
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlacePick, {
													side: draftMonthSide,
													util: draftMonthUtil,
													open: sideMenu,
													locked: !draftKind,
													onOpen: () => setSideMenu(true),
													onClose: () => setSideMenu(false),
													onSide: setDraftMonthSide,
													onUtil: () => setDraftMonthUtil((v) => !v)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted",
													children: "Feriados"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "O que fazer quando uma data do intervalo cair em feriado." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulePick, {
													rule: draftIntervalRule,
													open: ruleMenu,
													locked: !draftKind,
													onOpen: () => setRuleMenu(true),
													onClose: () => setRuleMenu(false),
													onRule: setDraftIntervalRule
												})
											]
										}) : null,
										monthEvents.length === 0 && !adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "pt-3 text-pretty text-sm text-muted",
											children: "Agenda aberta."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: monthEvents.map(({ event, iso }) => {
											const past = iso < today;
											const open = openEventId === event.id;
											const day = fromIso(iso);
											const follow = event.intervalRule && event.intervalRule !== "ignorar" ? followResolved(event, blockedHolidays, iso, year, view.getMonth()) : intervalFollow(event, iso, year, view.getMonth());
											const nextDates = follow.rest;
											const hop = follow.hop;
											const hopLabel = hop ? MONTHS$1[fromIso(hop).getMonth()].slice(0, 3).replace(/^./, (c) => c.toUpperCase()) : null;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "[&:first-child>button]:border-t-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => openAgendaItem(event, iso),
													className: cn("cal-agenda-line w-full border-t border-line py-3 text-left", past && "opacity-55"),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: cn("cal-agenda-tone cal-dmy text-[0.8rem]", open ? "text-today" : "text-muted"),
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(day.getDate()).padStart(2, "0") }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(day.getMonth() + 1).padStart(2, "0") })
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: cn("cal-agenda-tone min-w-0 flex-1 truncate text-sm", open ? "font-bold" : "font-medium"),
															children: event.title
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: cn("cal-agenda-tone flex shrink-0 items-baseline gap-2.5 text-xs", open ? "font-bold text-fg" : "font-normal text-muted"),
															children: [event.kind ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
																"(",
																event.kind === "personalizado" && event.everyDays ? `${event.everyDays} dias` : event.monthSide ? [
																	event.monthSide === "ultimos" ? "último dia" : "primeiro dia",
																	event.monthNth && event.monthNth > 1 ? event.monthNth : null,
																	event.monthUtil ? "útil" : null
																].filter(Boolean).join(" ") : event.kind,
																")"
															] }) : null, event.time ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTime(event.time, settings.hourCycle) }) : event.kind ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: weekdayName(iso).slice(0, 3) })]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: cn("cal-event-details", open && "is-open"),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: editingEventId === event.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
														className: "flex flex-col gap-2 pb-3",
														onSubmit: (formEvent) => {
															formEvent.preventDefault();
														},
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																	value: draftTitle,
																	maxLength: 45,
																	onChange: (e) => setDraftTitle(e.target.value.slice(0, 45)),
																	placeholder: "Compromisso",
																	className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	type: "button",
																	"aria-label": "Arquivo",
																	...withTip("Arquivo", "flex size-8 shrink-0 items-center justify-center text-fg"),
																	onClick: recallDraft,
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArquivoIcon, { className: "size-5" })
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																	value: draftPlace,
																	maxLength: 45,
																	onChange: (e) => setDraftPlace(e.target.value.slice(0, 45)),
																	placeholder: "Local",
																	className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "size-8 shrink-0",
																	"aria-hidden": "true"
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactField, {
																value: draftContact,
																onChange: setDraftContact
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePick, {
																value: draftDate,
																weekStart: settings.weekStart,
																onChange: setDraftDate
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HolidayNote, {
																iso: draftDate,
																events: [...holidays, ...extraHolidays]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimePick, {
																	value: draftTime,
																	cycle: settings.hourCycle,
																	onChange: setDraftTime
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotifyToggle, {
																	on: draftNotify,
																	onToggle: () => void armNotify(!draftNotify)
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DurationPick, {
																time: draftDurTime,
																days: draftDurDays,
																onTime: setDraftDurTime,
																onDays: setDraftDurDays
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindPick, {
																kind: draftKind,
																everyDays: draftEveryDays,
																open: kindMenu,
																onOpen: () => setKindMenu(true),
																onClose: () => setKindMenu(false),
																onKind: (next) => {
																	setDraftKind(next);
																	if (!next || next === "personalizado") {
																		setDraftMonthNth("");
																		if (!next) {
																			setDraftMonthUtil(false);
																			setSideMenu(false);
																		}
																	}
																},
																onEveryDays: setDraftEveryDays
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlacePick, {
																side: draftMonthSide,
																util: draftMonthUtil,
																open: sideMenu,
																locked: !draftKind,
																onOpen: () => setSideMenu(true),
																onClose: () => setSideMenu(false),
																onSide: setDraftMonthSide,
																onUtil: () => setDraftMonthUtil((v) => !v)
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-xs text-muted",
																children: "Feriados"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: "O que fazer quando uma data do intervalo cair em feriado." }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulePick, {
																rule: draftIntervalRule,
																open: ruleMenu,
																locked: !draftKind,
																onOpen: () => setRuleMenu(true),
																onClose: () => setRuleMenu(false),
																onRule: setDraftIntervalRule
															})
														]
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "cal-agenda-follow pb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "flex flex-col items-start gap-0.5",
															children: [nextDates.map((next) => {
																const d = fromIso(next);
																return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																	type: "button",
																	className: "cal-dmy border-0 bg-transparent p-0 text-[0.7rem] leading-tight text-muted",
																	onClick: () => {
																		if (d.getMonth() !== view.getMonth() || d.getFullYear() !== year) jumpTo(civilDate(d.getFullYear(), d.getMonth(), 1), next);
																		else setSelected(next);
																		setDraftDate(next);
																	},
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(d.getDate()).padStart(2, "0") }),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(d.getMonth() + 1).padStart(2, "0") })
																	]
																}, next);
															}), hop && hopLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																className: "flex w-[2.85rem] justify-center border-0 bg-transparent p-0 text-[0.65rem] leading-tight text-muted",
																onClick: () => {
																	const d = fromIso(hop);
																	jumpTo(civilDate(d.getFullYear(), d.getMonth(), 1), hop);
																	setDraftDate(hop);
																},
																children: hopLabel
															}) : null]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex min-w-0 flex-1 flex-col gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "m-0 min-w-0 text-xs text-muted",
																children: [event.place ?? "", event.contact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [event.place ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactLine, { value: event.contact })] }) : null]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "cal-actions self-end text-muted",
																children: [
																	event.source === "local" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																		type: "button",
																		"aria-label": "Feito",
																		...withTip("Feito", "flex size-8 shrink-0 items-center justify-center text-muted"),
																		onClick: () => markDone(event, iso),
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "size-4" })
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																		type: "button",
																		"aria-label": "Adiar",
																		...withTip("Adiar", "flex size-8 shrink-0 items-center justify-center text-muted"),
																		onClick: () => postponeEvent(event, iso),
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-4" })
																	})] }) : null,
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotifyToggle, {
																		on: Boolean(event.notify),
																		onToggle: () => void toggleEventNotify(event)
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																		type: "button",
																		"aria-label": `Editar ${event.title}`,
																		...withTip("Editar", "flex size-8 shrink-0 items-center justify-center text-muted"),
																		onClick: () => {
																			setEditingEventId(event.id);
																			setDraftTitle(event.title);
																			setDraftPlace(event.place ?? "");
																			setDraftContact(event.contact ?? "");
																			setDraftTime(event.time || "09:00");
																			setDraftKind(event.kind === "posicao" ? "mensal" : event.kind ?? null);
																			setDraftEveryDays(event.everyDays ? String(event.everyDays) : "");
																			setDraftMonthSide(event.monthSide ?? "");
																			setDraftMonthNth(event.monthNth && event.monthNth > 0 ? String(event.monthNth) : "");
																			setDraftMonthUtil(Boolean(event.monthUtil));
																			setDraftIntervalRule(event.intervalRule ?? "ignorar");
																			setDraftDurTime(event.durationMinutes ? minutesToTime(event.durationMinutes) : "");
																			setDraftDurDays(event.durationDays && event.durationDays > 0 ? String(event.durationDays) : "");
																			setDraftNotify(Boolean(event.notify));
																			setDraftDate(iso);
																		},
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																		type: "button",
																		"aria-label": `Apagar ${event.title}`,
																		...withTip("Apagar", "flex size-8 shrink-0 items-center justify-center text-muted"),
																		onClick: () => {
																			removeEvent(event.id);
																			setOpenEventId(null);
																			setEditingEventId(null);
																		},
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
																	})
																]
															})]
														})]
													}) })
												})]
											}, `${event.id}-${iso}`);
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 border-t border-line",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "flex w-full items-baseline py-3 text-left",
													"aria-expanded": periodOpen,
													onClick: () => {
														setPeriodOpen((open) => !open);
														if (periodOpen) {
															setPeriodMenu(false);
															setPeriodEditingId(null);
															setPeriodDirty(false);
															periodDraftId.current = null;
															setPeriodTitle("Folgas");
															setPeriodNote("");
															setPeriodDays("1");
															setPeriodDate(selected);
														}
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm font-medium text-fg",
														children: "Períodos"
													})
												}),
												periodOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-col gap-2 pb-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "cal-kind-pick min-w-0 flex-1",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderMenu, {
																label: "Período",
																value: periodTitle,
																options: [
																	"Folgas",
																	"Férias",
																	"Licenças",
																	"Contratos",
																	"Outros"
																].map((label) => ({
																	value: label,
																	label
																})),
																open: periodMenu,
																wide: true,
																fixed: true,
																soft: true,
																buttonClassName: "cal-kind-btn",
																optionClassName: "cal-kind-option",
																onOpen: () => setPeriodMenu(true),
																onClose: () => setPeriodMenu(false),
																onPick: (next) => {
																	setPeriodTitle(next);
																	setPeriodDirty(true);
																	setPeriodMenu(false);
																}
															})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															value: periodNote,
															maxLength: 45,
															placeholder: "Complementos",
															"aria-label": "Complementos",
															className: "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
															onChange: (event) => {
																setPeriodNote(event.target.value);
																setPeriodDirty(true);
															}
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "min-w-0 flex-1",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePick, {
																value: periodDate,
																weekStart: settings.weekStart,
																onChange: (next) => {
																	setPeriodDate(next);
																	setSelected(next);
																	setPeriodDirty(true);
																}
															})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															value: periodDays,
															inputMode: "numeric",
															"aria-label": "Quantidade de dias",
															className: "cal-num-field h-11 w-16 rounded-xl bg-bg px-2 text-center text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none",
															onChange: (event) => {
																setPeriodDays(event.target.value.replace(/\D/g, "").slice(0, 3));
																setPeriodDirty(true);
															}
														})]
													})]
												}) : null,
												monthPeriods.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: monthPeriods.map((event) => {
													const open = openPeriodId === event.id;
													const day = fromIso(event.iso);
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														className: "cal-agenda-line w-full border-t border-line py-3 text-left",
														onClick: () => {
															setSelected(event.iso);
															setOpenPeriodId((current) => current === event.id ? null : event.id);
															setOpenEventId(null);
														},
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: cn("cal-agenda-tone cal-dmy text-[0.8rem]", open ? "text-today" : "text-muted"),
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(day.getDate()).padStart(2, "0") }),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(day.getMonth() + 1).padStart(2, "0") })
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: cn("cal-agenda-tone min-w-0 flex-1 truncate text-sm", open ? "font-bold" : "font-medium"),
																children: event.title
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "cal-agenda-tone text-xs text-muted",
																children: [event.durationDays ?? 1, " d"]
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: cn("cal-event-details", open && "is-open"),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [event.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "pb-2 text-sm text-muted",
															children: event.note
														}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center justify-end pb-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																"aria-label": `Editar ${event.title}`,
																...withTip("Editar", "flex size-8 shrink-0 items-center justify-center text-muted"),
																onClick: () => {
																	setPeriodEditingId(event.id);
																	setPeriodTitle(event.title);
																	setPeriodNote(event.note ?? "");
																	setPeriodDate(event.iso);
																	setPeriodDays(String(event.durationDays ?? 1));
																	setPeriodDirty(true);
																	setPeriodOpen(true);
																	periodDraftId.current = null;
																},
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																"aria-label": `Apagar ${event.title}`,
																...withTip("Apagar", "flex size-8 shrink-0 items-center justify-center text-muted"),
																onClick: () => {
																	removeEvent(event.id);
																	setOpenPeriodId(null);
																	if (periodEditingId === event.id) setPeriodEditingId(null);
																},
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
															})]
														})] })
													})] }, event.id);
												}) }) : null
											]
										})
									]
								}) : null,
								settings.tabs.birthdays ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BirthdaysTab, {
									year,
									month: view.getMonth(),
									today,
									selectedIso: selected,
									weekStart: settings.weekStart,
									openId: openBirthdayId,
									birthdays,
									onAdd: (event) => setLocalEvents((prev) => [...prev, event]),
									onRemove: (id) => {
										removeEvent(id);
										setOpenBirthdayId(null);
									},
									onUpdate: (event) => {
										updateEvent(event.id, event);
										setSelected(`${year}-${event.iso.slice(5)}`);
									},
									onOpen: (event) => {
										setSelected(`${year}-${event.iso.slice(5)}`);
										setOpenBirthdayId((cur) => cur === event.id ? null : event.id);
										setOpenEventId(null);
										setOpenHolidayIso(null);
										setOpenHighlightId(null);
										setOpenBenefitId(null);
										setOpenHistoryId(null);
										setOpenBillId(null);
										setOpenIrpfId(null);
										setOpenPisId(null);
										setOpenIpvaId(null);
										setOpenFgtsId(null);
										setOpenBolsaId(null);
										setOpenGasId(null);
										setOpenLicencaId(null);
									}
								}) : null,
								settings.tabs.finance ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinancesTab, {
									year,
									month: view.getMonth(),
									today,
									selectedIso: selected,
									openBenefitId,
									openBillId,
									benefits,
									bills,
									boletos,
									irpf: irpfEvent,
									irpfOn: settings.irpfOn,
									onIrpf: (irpfOn) => setSettings((prev) => ({
										...prev,
										irpfOn
									})),
									irpfLots,
									irpfOpen: Boolean(irpfEvent && openIrpfId === irpfEvent.id),
									pis,
									pisOpen: Boolean(pis && openPisId === pis.id),
									laborMonth,
									onLaborMonth: (month) => setSettings((prev) => ({
										...prev,
										laborMonth: month,
										pisBirthMonth: month,
										fgtsBirthMonth: month
									})),
									pisOn: settings.pisOn,
									fgtsOn: settings.fgtsOn,
									onPisOn: (on) => setSettings((prev) => ({
										...prev,
										pisOn: on
									})),
									onFgtsOn: (on) => setSettings((prev) => ({
										...prev,
										fgtsOn: on
									})),
									fgts,
									fgtsOpen: Boolean(fgts && openFgtsId === fgts.id),
									fgtsUntil,
									onOpenFgts: (event) => {
										const closing = openFgtsId === event.id;
										setOpenFgtsId(closing ? null : event.id);
										if (!closing) {
											const date = fromIso(event.iso);
											setView(civilDate(date.getFullYear(), date.getMonth(), 1));
											setSelected(event.iso);
										}
										setOpenEventId(null);
										setOpenHolidayIso(null);
										setOpenHighlightId(null);
										setOpenBirthdayId(null);
										setOpenBenefitId(null);
										setOpenHistoryId(null);
										setOpenBillId(null);
										setOpenIrpfId(null);
										setOpenPisId(null);
										setOpenIpvaId(null);
										setOpenBolsaId(null);
										setOpenGasId(null);
										setOpenLicencaId(null);
									},
									bolsa,
									bolsaOpen: Boolean(bolsa && openBolsaId === bolsa.id),
									bolsaNis: settings.bolsaNis,
									bolsaOn: settings.bolsaOn,
									gasOn: settings.gasOn,
									onBolsaNis: (nis) => setSettings((prev) => ({
										...prev,
										bolsaNis: sanitizeNis(nis)
									})),
									onBolsaOn: (on) => setSettings((prev) => ({
										...prev,
										bolsaOn: on
									})),
									onGasOn: (on) => setSettings((prev) => ({
										...prev,
										gasOn: on
									})),
									onOpenBolsa: (event) => {
										const closing = openBolsaId === event.id;
										setOpenBolsaId(closing ? null : event.id);
										if (!closing) {
											const date = fromIso(event.iso);
											setView(civilDate(date.getFullYear(), date.getMonth(), 1));
											setSelected(event.iso);
										}
										setOpenEventId(null);
										setOpenHolidayIso(null);
										setOpenHighlightId(null);
										setOpenBirthdayId(null);
										setOpenBenefitId(null);
										setOpenHistoryId(null);
										setOpenBillId(null);
										setOpenIrpfId(null);
										setOpenPisId(null);
										setOpenIpvaId(null);
										setOpenFgtsId(null);
										setOpenGasId(null);
									},
									gas,
									gasOpen: Boolean(gas && openGasId === gas.id),
									onOpenGas: (event) => {
										const closing = openGasId === event.id;
										setOpenGasId(closing ? null : event.id);
										if (!closing) {
											const date = fromIso(event.iso);
											setView(civilDate(date.getFullYear(), date.getMonth(), 1));
											setSelected(event.iso);
										}
										setOpenEventId(null);
										setOpenHolidayIso(null);
										setOpenHighlightId(null);
										setOpenBirthdayId(null);
										setOpenBenefitId(null);
										setOpenHistoryId(null);
										setOpenBillId(null);
										setOpenIrpfId(null);
										setOpenPisId(null);
										setOpenIpvaId(null);
										setOpenFgtsId(null);
										setOpenBolsaId(null);
										setOpenLicencaId(null);
									},
									ipva,
									ipvaOpen: Boolean(ipva && openIpvaId === ipva.id),
									ipvaLots,
									ipvaUf: settings.ipvaUf,
									ipvaPlate: settings.ipvaPlate,
									ipvaOn: settings.ipvaOn,
									licencaOn: settings.licencaOn,
									onIpvaUf: (uf) => setSettings((prev) => ({
										...prev,
										ipvaUf: normalizeUf(uf)
									})),
									onIpvaPlate: (plate) => {
										const next = sanitizePlate(plate);
										setSettings((prev) => ({
											...prev,
											ipvaPlate: next,
											ipvaDigit: plateDigit(next)
										}));
									},
									onIpvaOn: (on) => setSettings((prev) => ({
										...prev,
										ipvaOn: on
									})),
									onLicencaOn: (on) => setSettings((prev) => ({
										...prev,
										licencaOn: on
									})),
									onAdd: (event) => setLocalEvents((prev) => [...prev, event]),
									onRemoveBenefit: (id) => {
										removeEvent(id);
										setOpenBenefitId(null);
									},
									onRemoveBill: (id) => {
										removeEvent(id);
										setOpenBillId(null);
										setOpenIrpfId(null);
										setOpenPisId(null);
										setOpenIpvaId(null);
										setOpenFgtsId(null);
										setOpenBolsaId(null);
										setOpenGasId(null);
										setOpenLicencaId(null);
									},
									onUpdate: (event) => {
										updateEvent(event.id, event);
										if (event.source === "bill" || event.source === "boleto") setSelected(event.iso);
									},
									onOpenBenefit: (event, iso) => {
										const date = fromIso(iso);
										setView(civilDate(date.getFullYear(), date.getMonth(), 1));
										setSelected(iso);
										setOpenBenefitId((cur) => cur === event.id ? null : event.id);
										setOpenEventId(null);
										setOpenHolidayIso(null);
										setOpenHighlightId(null);
										setOpenBirthdayId(null);
										setOpenHistoryId(null);
										setOpenBillId(null);
										setOpenIrpfId(null);
										setOpenPisId(null);
										setOpenIpvaId(null);
										setOpenFgtsId(null);
										setOpenBolsaId(null);
										setOpenGasId(null);
										setOpenLicencaId(null);
									},
									onOpenBill: (event, iso) => {
										setSelected(iso);
										setOpenBillId((cur) => cur === event.id ? null : event.id);
										setOpenEventId(null);
										setOpenHolidayIso(null);
										setOpenHighlightId(null);
										setOpenBirthdayId(null);
										setOpenBenefitId(null);
										setOpenHistoryId(null);
										setOpenIrpfId(null);
										setOpenPisId(null);
										setOpenIpvaId(null);
										setOpenFgtsId(null);
										setOpenBolsaId(null);
										setOpenGasId(null);
										setOpenLicencaId(null);
									},
									onOpenIrpf: (event) => {
										const closing = openIrpfId === event.id;
										setOpenIrpfId(closing ? null : event.id);
										if (!closing) {
											const date = fromIso(event.iso);
											setView(civilDate(date.getFullYear(), date.getMonth(), 1));
											setSelected(event.iso);
										}
										setOpenEventId(null);
										setOpenHolidayIso(null);
										setOpenHighlightId(null);
										setOpenBirthdayId(null);
										setOpenBenefitId(null);
										setOpenHistoryId(null);
										setOpenBillId(null);
										setOpenPisId(null);
										setOpenIpvaId(null);
										setOpenFgtsId(null);
										setOpenBolsaId(null);
										setOpenGasId(null);
										setOpenLicencaId(null);
									},
									onOpenLot: (iso) => {
										const date = fromIso(iso);
										jumpTo(civilDate(date.getFullYear(), date.getMonth(), 1), iso);
									},
									onOpenPis: (event) => {
										const closing = openPisId === event.id;
										setOpenPisId(closing ? null : event.id);
										if (!closing) {
											const date = fromIso(event.iso);
											setView(civilDate(date.getFullYear(), date.getMonth(), 1));
											setSelected(event.iso);
										}
										setOpenEventId(null);
										setOpenHolidayIso(null);
										setOpenHighlightId(null);
										setOpenBirthdayId(null);
										setOpenBenefitId(null);
										setOpenHistoryId(null);
										setOpenBillId(null);
										setOpenIrpfId(null);
										setOpenIpvaId(null);
										setOpenFgtsId(null);
										setOpenBolsaId(null);
										setOpenGasId(null);
										setOpenLicencaId(null);
									},
									onOpenIpva: (event) => {
										const closing = openIpvaId === event.id;
										setOpenIpvaId(closing ? null : event.id);
										if (!closing) {
											const date = fromIso(event.iso);
											setView(civilDate(date.getFullYear(), date.getMonth(), 1));
											setSelected(event.iso);
										}
										setOpenEventId(null);
										setOpenHolidayIso(null);
										setOpenHighlightId(null);
										setOpenBirthdayId(null);
										setOpenBenefitId(null);
										setOpenHistoryId(null);
										setOpenBillId(null);
										setOpenIrpfId(null);
										setOpenPisId(null);
										setOpenFgtsId(null);
										setOpenBolsaId(null);
										setOpenGasId(null);
										setOpenLicencaId(null);
									},
									licenca,
									licencaOpen: Boolean(licenca && openLicencaId === licenca.id),
									onOpenLicenca: (event) => {
										const closing = openLicencaId === event.id;
										setOpenLicencaId(closing ? null : event.id);
										if (!closing) {
											const date = fromIso(event.iso);
											setView(civilDate(date.getFullYear(), date.getMonth(), 1));
											setSelected(event.iso);
										}
										setOpenEventId(null);
										setOpenHolidayIso(null);
										setOpenHighlightId(null);
										setOpenBirthdayId(null);
										setOpenBenefitId(null);
										setOpenHistoryId(null);
										setOpenBillId(null);
										setOpenIrpfId(null);
										setOpenPisId(null);
										setOpenIpvaId(null);
										setOpenFgtsId(null);
										setOpenBolsaId(null);
										setOpenGasId(null);
									}
								}) : null,
								settings.tabs.history ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryTab, {
									events: history,
									hourCycle: settings.hourCycle,
									openId: openHistoryId,
									onOpen: (event) => {
										const date = fromIso(event.iso);
										setView(civilDate(date.getFullYear(), date.getMonth(), 1));
										setSelected(event.iso);
										setOpenHistoryId((cur) => cur === event.id ? null : event.id);
										setOpenEventId(null);
										setOpenHolidayIso(null);
										setOpenHighlightId(null);
										setOpenBirthdayId(null);
										setOpenBenefitId(null);
										setOpenBillId(null);
										setOpenIrpfId(null);
										setOpenPisId(null);
										setOpenIpvaId(null);
										setOpenFgtsId(null);
										setOpenBolsaId(null);
										setOpenGasId(null);
										setOpenLicencaId(null);
									},
									onRemove: (id) => {
										setHistory((prev) => prev.filter((event) => event.id !== id));
										setOpenHistoryId(null);
										setOpenBillId(null);
										setOpenIrpfId(null);
										setOpenPisId(null);
										setOpenIpvaId(null);
										setOpenFgtsId(null);
										setOpenBolsaId(null);
										setOpenGasId(null);
										setOpenLicencaId(null);
									},
									onReschedule: (event) => {
										const next = {
											...event,
											notify: false
										};
										if (isDueForHistory(next, today, new Date(nowMs))) setHistory((prev) => prev.map((item) => item.id === next.id ? next : item));
										else {
											setHistory((prev) => prev.filter((item) => item.id !== next.id));
											setLocalEvents((prev) => [...prev, next]);
											setOpenHistoryId(null);
										}
										const date = fromIso(next.iso);
										jumpTo(civilDate(date.getFullYear(), date.getMonth(), 1), next.iso);
									}
								}) : null
							]
						}),
						canScrollUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "cal-scroll-start-wrap",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Ir ao início",
								...withTip("Ir ao início", cn("cal-scroll-end", upHiding && "is-hiding")),
								onClick: () => {
									pingStart();
									const node = pageRef.current;
									if (!node) return;
									node.scrollTo({
										top: 0,
										behavior: "smooth"
									});
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									viewBox: "0 0 24 24",
									fill: "none",
									"aria-hidden": "true",
									className: startFlash ? "cal-glyph is-flash" : "cal-glyph",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M12 20.5v-11",
										stroke: "currentColor",
										strokeWidth: "1.8",
										strokeLinecap: "round"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M6 12.5 12 5 18 12.5",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									})]
								})
							})
						}) : null,
						canScrollDown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "cal-scroll-end-wrap",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Ir ao final",
								...withTip("Ir ao final", cn("cal-scroll-end", downHiding && "is-hiding")),
								onClick: () => {
									pingEnd();
									const node = pageRef.current;
									if (!node) return;
									node.scrollTo({
										top: node.scrollHeight,
										behavior: "smooth"
									});
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									viewBox: "0 0 24 24",
									fill: "none",
									"aria-hidden": "true",
									className: endFlash ? "cal-glyph is-flash" : "cal-glyph",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M12 3.5v11",
										stroke: "currentColor",
										strokeWidth: "1.8",
										strokeLinecap: "round"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M6 11.5 12 19 18 11.5",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									})]
								})
							})
						}) : null
					]
				}),
				settingsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: null,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, {
						onClose: () => setSettingsOpen(false),
						holidayCache: holidayStore[String(year)],
						reminderStatus,
						remindersBusy,
						weekStart: settings.weekStart,
						saturdayTint: settings.saturdayTint,
						sundayTint: settings.sundayTint,
						holidayTint: settings.holidayTint,
						hourCycle: settings.hourCycle,
						onWeekStart: (weekStart) => setSettings((prev) => ({
							...prev,
							weekStart
						})),
						onSaturdayTint: (saturdayTint) => setSettings((prev) => ({
							...prev,
							saturdayTint
						})),
						onSundayTint: (sundayTint) => setSettings((prev) => ({
							...prev,
							sundayTint
						})),
						onHolidayTint: (holidayTint) => setSettings((prev) => ({
							...prev,
							holidayTint
						})),
						onHourCycle: (hourCycle) => setSettings((prev) => ({
							...prev,
							hourCycle
						})),
						tabs: settings.tabs,
						onToggleTab: (id, next) => setSettings((prev) => ({
							...prev,
							tabs: {
								...prev.tabs,
								[id]: next
							}
						})),
						a11yNumbers: settings.a11yNumbers,
						a11yText: settings.a11yText,
						a11ySaturated: settings.a11ySaturated,
						a11yColorblind: settings.a11yColorblind,
						a11yHints: settings.a11yHints,
						onA11yNumbers: (a11yNumbers) => setSettings((prev) => ({
							...prev,
							a11yNumbers
						})),
						onA11yText: (a11yText) => setSettings((prev) => ({
							...prev,
							a11yText
						})),
						onA11ySaturated: (a11ySaturated) => setSettings((prev) => ({
							...prev,
							a11ySaturated
						})),
						onA11yColorblind: (a11yColorblind) => setSettings((prev) => ({
							...prev,
							a11yColorblind
						})),
						onA11yHints: (a11yHints) => setSettings((prev) => ({
							...prev,
							a11yHints
						})),
						onSyncGoogle: () => {
							syncGoogle({ login: true });
						},
						onEnableReminders: () => {
							setRemindersBusy(true);
							setReminderStatus("Pedindo permissão no celular…");
							enableReminders().then((message) => {
								setReminderStatus(message);
								startReminders([...localEvents, ...googleEvents].filter((event) => tabAllowsEvent(settings.tabs, event)), settings.hourCycle);
							}).finally(() => setRemindersBusy(false));
						},
						cloudStatus,
						onLeaveAccount: async () => {
							try {
								await pushCloud({ data: packNotebook({
									settings,
									events: localEvents,
									history
								}) });
							} catch {}
							clearLocalCalendae();
							setSettings(DEFAULT_SETTINGS);
							setLocalEvents([]);
							setHistory([]);
							setGoogleEvents([]);
							setHolidayStore(seedHolidayStore());
							setInssStore({});
							setCloudStatus(null);
							pulledFor.current = null;
							lastPushPrint.current = "";
							setCalendaeLoginOff(true);
							await signOut();
						}
					})
				}) : null
			]
		})]
	});
}
var CREAM = "#f4efe4";
var MUTED = {
	blue: "#4a7fba",
	red: "#c45a5a",
	gold: "#d4b44a",
	green: "#5a9662",
	orange: "#d48c52",
	brown: "#8a6850"
};
var VIVID = {
	blue: "#1d4ed8",
	red: "#e11d2e",
	gold: "#f5c400",
	green: "#16a34a",
	orange: "#f97316",
	brown: "#9a3412"
};
function grid(colors, cols, rows) {
	const layers = colors.map((color) => `linear-gradient(${color}, ${color})`);
	const positions = colors.map((_, index) => {
		const col = index % cols;
		const row = Math.floor(index / cols);
		return `${cols === 1 ? "0" : `${col / (cols - 1) * 100}%`} ${rows === 1 ? "0" : `${row / (rows - 1) * 100}%`}`;
	});
	return {
		backgroundColor: colors[colors.length - 1],
		backgroundImage: layers.join(", "),
		backgroundRepeat: "no-repeat",
		backgroundSize: `${100 / cols}% ${100 / rows}%`,
		backgroundPosition: positions.join(", ")
	};
}
[
	`radial-gradient(circle at 16% 28%, ${MUTED.blue} 0 28%, transparent 58%)`,
	`radial-gradient(circle at 84% 18%, ${MUTED.red} 0 26%, transparent 56%)`,
	`radial-gradient(circle at 72% 82%, ${MUTED.gold} 0 30%, transparent 60%)`,
	`radial-gradient(circle at 18% 80%, ${MUTED.green} 0 28%, transparent 58%)`,
	`radial-gradient(circle at 92% 56%, ${MUTED.orange} 0 22%, transparent 52%)`,
	`radial-gradient(circle at 48% 46%, ${MUTED.brown} 0 18%, transparent 48%)`
].join(", "), grid([
	MUTED.blue,
	MUTED.red,
	MUTED.green,
	MUTED.gold
], 2, 2), grid([
	MUTED.blue,
	MUTED.red,
	MUTED.gold,
	MUTED.green
], 1, 4), [
	`linear-gradient(${MUTED.blue}, ${MUTED.blue})`,
	`linear-gradient(${MUTED.red}, ${MUTED.red})`,
	`linear-gradient(${MUTED.green}, ${MUTED.green})`,
	`linear-gradient(${MUTED.gold}, ${MUTED.gold})`
].join(", "), `${CREAM}${CREAM}${VIVID.blue}${VIVID.red}${VIVID.gold}${VIVID.green}${VIVID.orange}${VIVID.brown}${VIVID.blue}`, [
	MUTED.blue,
	MUTED.red,
	MUTED.gold,
	MUTED.green,
	MUTED.orange,
	MUTED.brown
].map((color) => `linear-gradient(${color}, ${color})`).join(", "), `${VIVID.blue}${VIVID.red}${VIVID.gold}${VIVID.green}${VIVID.orange}${VIVID.brown}`, [
	`linear-gradient(${VIVID.blue}, ${VIVID.blue})`,
	`linear-gradient(${VIVID.red}, ${VIVID.red})`,
	`linear-gradient(${VIVID.gold}, ${VIVID.gold})`,
	`linear-gradient(${VIVID.green}, ${VIVID.green})`
].join(", ");
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	const [seen, setSeen] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendae, {});
}
//#endregion
export { setCalendaeLoginOff as a, Button as c, withTip as d, A11yHint as l, createSsrRpc as n, useCalendaeSession as o, HeaderMenu as s, routes_exports as t, cn as u };
