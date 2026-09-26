import { r as createServerFn } from "./ssr.mjs";
import { N as facultativeName, P as fallbackHolidays, _t as parseMoonFestivalHtml, a as CONFIRMED_IRPF_LOTS, gt as parseIrpfLots, ht as parseIrpfDeadline, i as CONFIRMED_IRPF, jt as standingPisMap, mt as parseGoogleEvents, o as CONFIRMED_PIS, p as KNOWN_SECOND_ROUND_FEDERAL, pt as parseFgtsCalendar, r as CONFIRMED_FGTS, vt as parsePisCalendar } from "./moon-festival-CMLpKxi0.mjs";
import { i as GoogleCalendarTools, r as ConnectorType } from "./types-Bggxm7au.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { hn as object, mn as number, vn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-server-Bln6bdgi.js
function pad(code) {
	return code.padStart(6, "0");
}
function hasPresident(el) {
	const name = String(el.nm ?? "").toLowerCase();
	if (/presidente|federal/.test(name) && !/municipal/.test(name)) return true;
	return (el.abr ?? []).some((row) => (row.cp ?? []).some((cargo) => cargo.cd === "1" || /presidente/i.test(cargo.ds ?? "")));
}
function octoberOf(year, date) {
	const parts = date.split("/");
	return parts.length === 3 && parts[1] === "10" && parts[2] === String(year);
}
function candWentSecond(json) {
	const text = JSON.stringify(json).toLowerCase();
	const votes = text.match(/"v"\s*:\s*"?(\d+)/g);
	if ((votes ? votes.reduce((sum, row) => sum + Number(row.replace(/\D/g, "") || 0), 0) : 0) < 1e3) return null;
	if (/2[ºo°]\s*turno/.test(text) || /"st"\s*:\s*"2/.test(text)) return true;
	if (/"st"\s*:\s*"eleito"/.test(text) || /"e"\s*:\s*"s"/.test(text)) return false;
	return null;
}
async function tsePresidentSecondRound(year) {
	try {
		const cfgRes = await fetch("https://resultados.tse.jus.br/oficial/comum/config/ele-c.json", { signal: AbortSignal.timeout(2500) });
		if (!cfgRes.ok) return null;
		const cfg = await cfgRes.json();
		if (!cfg || typeof cfg !== "object") return null;
		const cycle = "c" in cfg && typeof cfg.c === "string" ? cfg.c : `ele${year}`;
		const pls = "pl" in cfg && Array.isArray(cfg.pl) ? cfg.pl : [];
		let electionCd = "";
		for (const pl of pls) {
			if (!octoberOf(year, String(pl.dt ?? ""))) continue;
			for (const el of pl.e ?? []) {
				if (String(el.t) !== "1" || !hasPresident(el)) continue;
				electionCd = String(el.cd ?? "");
				break;
			}
			if (electionCd) break;
		}
		if (!electionCd) return null;
		const url = `https://resultados.tse.jus.br/oficial/${cycle}/${electionCd}/dados/br/br-c0001-e${pad(electionCd)}-u.json`;
		const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
		if (!res.ok) return null;
		return candWentSecond(await res.json());
	} catch {
		return null;
	}
}
var getHolidays_createServerFn_handler = createServerRpc({
	id: "0a73a2c0ee4446534c48380ab8dcaa23a4192c46d8931e88145db84b178684c0",
	name: "getHolidays",
	filename: "src/lib/calendar-server.ts"
}, (opts) => getHolidays.__executeServer(opts));
var getHolidays = createServerFn({ method: "GET" }).validator(object({ year: number().int().min(1).max(9999) })).handler(getHolidays_createServerFn_handler, async ({ data }) => {
	try {
		const res = await fetch(`https://brasilapi.com.br/api/feriados/v1/${data.year}`, { signal: AbortSignal.timeout(2500) });
		if (!res.ok) return {
			events: fallbackHolidays(data.year),
			live: false
		};
		const json = await res.json();
		if (!Array.isArray(json)) return {
			events: fallbackHolidays(data.year),
			live: false
		};
		const events = [];
		for (const row of json) {
			const item = row;
			if (!item.date || !item.name) continue;
			if (item.type && item.type !== "national") continue;
			events.push({
				id: `holiday-${item.date}-${item.name}`,
				iso: item.date,
				title: item.name,
				time: "",
				source: "holiday",
				holidayKind: facultativeName(item.name) ? "facultative" : "national"
			});
		}
		if (!events.length) return {
			events: fallbackHolidays(data.year),
			live: false
		};
		const seen = new Set(events.map((event) => event.iso));
		for (const row of fallbackHolidays(data.year)) if (row.holidayKind === "facultative" && !seen.has(row.iso)) events.push(row);
		return {
			events,
			live: true
		};
	} catch {
		return {
			events: fallbackHolidays(data.year),
			live: false
		};
	}
});
var confirmElectionSecondRound_createServerFn_handler = createServerRpc({
	id: "6ce754ef39f76653745550a7d5c56f0951bf258c884c08b496ca80ba6bba9a0c",
	name: "confirmElectionSecondRound",
	filename: "src/lib/calendar-server.ts"
}, (opts) => confirmElectionSecondRound.__executeServer(opts));
var confirmElectionSecondRound = createServerFn({ method: "GET" }).validator(object({ year: number().int().min(1).max(9999) })).handler(confirmElectionSecondRound_createServerFn_handler, async ({ data }) => {
	if (data.year % 4 !== 2) return { confirmed: false };
	if (KNOWN_SECOND_ROUND_FEDERAL.has(data.year)) return {
		confirmed: true,
		source: "known"
	};
	try {
		const official = await tsePresidentSecondRound(data.year);
		if (official === true) return {
			confirmed: true,
			source: "tse"
		};
		if (official === false) return { confirmed: false };
	} catch {}
	function readsConfirmed(extract) {
		const text = extract.toLowerCase();
		if (!text.includes("segundo turno") && !text.includes("second round") && !text.includes("runoff")) return false;
		if (/caso necess|caso nenhum|se ningu[eé]m|if necessary|should no candidate/.test(text)) return false;
		return /disput|confirmado|foi para o segundo|ir[aá] para o segundo|haver[aá] segundo|runoff|second round (will|was|is being|took)/.test(text);
	}
	async function wikiExtract(lang, title) {
		const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${title}`, { signal: AbortSignal.timeout(2500) });
		if (!res.ok) return "";
		const json = await res.json();
		return typeof json === "object" && json && "extract" in json && typeof json.extract === "string" ? json.extract : "";
	}
	try {
		const [pt, en] = await Promise.all([wikiExtract("pt", `Elei%C3%A7%C3%B5es_gerais_no_Brasil_em_${data.year}`), wikiExtract("en", `${data.year}_Brazilian_general_election`)]);
		if (readsConfirmed(pt) || readsConfirmed(en)) return {
			confirmed: true,
			source: "wiki"
		};
		return { confirmed: false };
	} catch {
		return { confirmed: false };
	}
});
var confirmIrpfDeadline_createServerFn_handler = createServerRpc({
	id: "700bc4d363d10c4d04c0f2c203ca1e4fc4a80d3c9f38302a67a90bdca5ae19b4",
	name: "confirmIrpfDeadline",
	filename: "src/lib/calendar-server.ts"
}, (opts) => confirmIrpfDeadline.__executeServer(opts));
var confirmIrpfDeadline = createServerFn({ method: "GET" }).validator(object({ year: number().int().min(1).max(9999) })).handler(confirmIrpfDeadline_createServerFn_handler, async ({ data }) => {
	const known = CONFIRMED_IRPF[data.year];
	const knownLots = CONFIRMED_IRPF_LOTS[data.year] ?? [];
	async function lotsFromReceita() {
		const res = await fetch(`https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/restituicao/lotes/${data.year}`, { signal: AbortSignal.timeout(3500) });
		if (!res.ok) return [];
		return parseIrpfLots(await res.text(), data.year);
	}
	let liveLots = [];
	try {
		liveLots = await lotsFromReceita();
	} catch {
		liveLots = [];
	}
	const lots = (liveLots.length ? liveLots : knownLots).map((iso, i) => ({
		n: i + 1,
		iso,
		confirmed: liveLots.length > 0 || knownLots.length > 0
	}));
	if (known) return {
		iso: known,
		confirmed: true,
		source: "known",
		lots
	};
	async function fromUrl(url) {
		const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
		if (!res.ok) return null;
		return parseIrpfDeadline(await res.text(), data.year);
	}
	try {
		const receita = await fromUrl("https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda");
		if (receita) return {
			iso: receita,
			confirmed: true,
			source: "receita",
			lots
		};
	} catch {}
	try {
		const title = `Imposto_de_Renda_${data.year}`;
		const res = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${title}`, { signal: AbortSignal.timeout(2500) });
		if (res.ok) {
			const json = await res.json();
			const extract = typeof json === "object" && json && "extract" in json && typeof json.extract === "string" ? json.extract : "";
			const iso = parseIrpfDeadline(extract, data.year);
			if (iso) return {
				iso,
				confirmed: true,
				source: "wiki",
				lots
			};
		}
	} catch {}
	return {
		iso: null,
		confirmed: false,
		lots
	};
});
var confirmLaborYear_createServerFn_handler = createServerRpc({
	id: "da3bc742dbf22aa3159e52a665cc53e7a6c96db35851635079ecc9f8e09cd50c",
	name: "confirmLaborYear",
	filename: "src/lib/calendar-server.ts"
}, (opts) => confirmLaborYear.__executeServer(opts));
var confirmLaborYear = createServerFn({ method: "GET" }).validator(object({ year: number().int().min(1).max(9999) })).handler(confirmLaborYear_createServerFn_handler, async ({ data }) => {
	async function pageText(url, ms) {
		const res = await fetch(url, { signal: AbortSignal.timeout(ms) });
		if (!res.ok) return "";
		return res.text();
	}
	async function wikiHtml(title) {
		return pageText(`https://pt.wikipedia.org/api/rest_v1/page/html/${title}`, 3500);
	}
	let pis = CONFIRMED_PIS[data.year] ? {
		byMonth: CONFIRMED_PIS[data.year],
		confirmed: true,
		source: "known"
	} : data.year >= 2026 ? {
		byMonth: standingPisMap(data.year),
		confirmed: true,
		source: "codefat"
	} : null;
	let fgts = CONFIRMED_FGTS[data.year] ? {
		byMonth: CONFIRMED_FGTS[data.year],
		confirmed: true,
		source: "known"
	} : null;
	try {
		const [abono, pisPage] = await Promise.all([wikiHtml("Abono_salarial"), wikiHtml(`Abono_salarial_${data.year}`)]);
		const parsed = parsePisCalendar(`${abono}\n${pisPage}`, data.year);
		if (parsed) pis = {
			byMonth: parsed,
			confirmed: true,
			source: "wiki"
		};
	} catch {}
	if (!fgts) try {
		const html = await wikiHtml("Saque-anivers%C3%A1rio");
		const parsed = parseFgtsCalendar(html, data.year);
		if (parsed) fgts = {
			byMonth: parsed,
			confirmed: true,
			source: "wiki"
		};
	} catch {}
	return {
		pis,
		fgts
	};
});
var getGoogleMonth_createServerFn_handler = createServerRpc({
	id: "16213d02f8ffad69cd3375c6c683e7a19a8a39ed14bcca8f4c4b3daf4fb9a62c",
	name: "getGoogleMonth",
	filename: "src/lib/calendar-server.ts"
}, (opts) => getGoogleMonth.__executeServer(opts));
var getGoogleMonth = createServerFn({ method: "POST" }).validator(object({
	timeMin: string(),
	timeMax: string()
})).handler(getGoogleMonth_createServerFn_handler, async ({ data }) => {
	const { callTool } = await import("./client.server-Blb5VH27.mjs");
	const result = await callTool(GoogleCalendarTools.search, {
		query: "",
		timeMin: data.timeMin,
		timeMax: data.timeMax
	}, { connectorType: ConnectorType.GoogleCalendar });
	return {
		ok: result.ok,
		events: result.ok ? parseGoogleEvents(result.data) : [],
		errorMessage: result.errorMessage,
		loginRequired: result.loginRequired,
		loginUrl: result.loginUrl,
		pending: result.pending
	};
});
var NOMINATIM_UA = "Calendae/1.0 (calendar; feriados municipais)";
var munYearCache = null;
var cityIndex = null;
function fold(value) {
	return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
function brDateToIso(raw, year) {
	const match = raw.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
	if (!match) return null;
	const [, dd, mm] = match;
	return `${year}-${mm}-${dd}`;
}
function ufFromAddress(address) {
	const iso = address?.["ISO3166-2-lvl4"] ?? "";
	if (iso.startsWith("BR-")) return iso.slice(3);
	return "";
}
function cityFromNominatim(hit) {
	const ibge = Number(hit.extratags?.["IBGE:GEOCODIGO"]);
	const name = hit.address?.city || hit.address?.town || hit.address?.municipality || hit.name;
	const uf = ufFromAddress(hit.address);
	if (!ibge || !name || !uf) return null;
	return {
		ibge,
		name,
		uf
	};
}
async function loadMunicipalRows(year) {
	if (munYearCache && (munYearCache.year === year || munYearCache.rows.length)) {
		if (munYearCache.year === year) return munYearCache.rows;
	}
	const urls = [`https://cdn.jsdelivr.net/gh/joaopbini/feriados-brasil@master/dados/feriados/municipal/json/${year}.json`, "https://cdn.jsdelivr.net/gh/joaopbini/feriados-brasil@master/dados/feriados/municipal/json/2026.json"];
	for (const url of urls) try {
		const res = await fetch(url, { signal: AbortSignal.timeout(8e3) });
		if (!res.ok) continue;
		const json = await res.json();
		if (!Array.isArray(json)) continue;
		munYearCache = {
			year,
			rows: json
		};
		return munYearCache.rows;
	} catch {
		continue;
	}
	return munYearCache?.rows ?? [];
}
async function loadCityIndex() {
	if (cityIndex?.length) return cityIndex;
	const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios", { signal: AbortSignal.timeout(12e3) });
	if (!res.ok) return cityIndex ?? [];
	const json = await res.json();
	if (!Array.isArray(json)) return cityIndex ?? [];
	const out = [];
	for (const row of json) {
		const item = row;
		const ibge = Number(item.id);
		const name = item.nome ?? "";
		const uf = item.microrregiao?.mesorregiao?.UF?.sigla ?? "";
		if (!ibge || !name || !uf) continue;
		out.push({
			ibge,
			name,
			uf
		});
	}
	cityIndex = out;
	return out;
}
var searchMunicipio_createServerFn_handler = createServerRpc({
	id: "7392c809e894659b550455ce58d228313c0b0708d2038c16d3530f0735950eaa",
	name: "searchMunicipio",
	filename: "src/lib/calendar-server.ts"
}, (opts) => searchMunicipio.__executeServer(opts));
var searchMunicipio = createServerFn({ method: "GET" }).validator(object({
	query: string().min(2).max(80),
	uf: string().max(2).optional()
})).handler(searchMunicipio_createServerFn_handler, async ({ data }) => {
	const q = fold(data.query);
	const uf = data.uf?.trim().toUpperCase() ?? "";
	if (q.length < 2) return [];
	try {
		return (await loadCityIndex()).filter((city) => !uf || city.uf === uf).map((city) => {
			const name = fold(city.name);
			return {
				city,
				score: name === q ? 0 : name.startsWith(q) ? 1 : name.includes(q) ? 2 : 9
			};
		}).filter((row) => row.score < 9).sort((a, b) => a.score - b.score || a.city.name.localeCompare(b.city.name, "pt-BR")).slice(0, 8).map((row) => row.city);
	} catch {
		return [];
	}
});
var locateMunicipio_createServerFn_handler = createServerRpc({
	id: "c21c5449358e2f9df618a8cc7bd3d04110813a0c36e8e23ef8f0e8f4fcb1e3a0",
	name: "locateMunicipio",
	filename: "src/lib/calendar-server.ts"
}, (opts) => locateMunicipio.__executeServer(opts));
var locateMunicipio = createServerFn({ method: "GET" }).validator(object({
	lat: number(),
	lon: number()
})).handler(locateMunicipio_createServerFn_handler, async ({ data }) => {
	try {
		const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${data.lat}&lon=${data.lon}&zoom=10&addressdetails=1&extratags=1`;
		const res = await fetch(url, {
			headers: {
				"User-Agent": NOMINATIM_UA,
				Accept: "application/json"
			},
			signal: AbortSignal.timeout(4e3)
		});
		if (!res.ok) return null;
		return cityFromNominatim(await res.json());
	} catch {
		return null;
	}
});
var getMunicipalHolidays_createServerFn_handler = createServerRpc({
	id: "98b88ca90daf9bfbf0e19e4900c5906711c6bd29d2e0324e0f4f39032700d6d3",
	name: "getMunicipalHolidays",
	filename: "src/lib/calendar-server.ts"
}, (opts) => getMunicipalHolidays.__executeServer(opts));
var getMunicipalHolidays = createServerFn({ method: "GET" }).validator(object({
	year: number().int().min(1).max(9999),
	ibge: number().int(),
	city: string().min(1).max(80),
	uf: string().max(2).optional()
})).handler(getMunicipalHolidays_createServerFn_handler, async ({ data }) => {
	const rows = await loadMunicipalRows(data.year);
	const nationals = new Set(fallbackHolidays(data.year).map((event) => event.iso));
	const out = [];
	for (const row of rows) {
		if (Number(row.codigo_ibge) !== data.ibge) continue;
		if (row.tipo && row.tipo !== "MUNICIPAL") continue;
		if (!row.data || !row.nome) continue;
		const iso = brDateToIso(row.data, data.year);
		if (!iso || nationals.has(iso)) continue;
		out.push({
			id: `mun-${data.ibge}-${iso}-${row.nome}`,
			iso,
			title: row.nome,
			time: "",
			place: data.uf ? `${data.city}-${data.uf}` : data.city,
			source: "holiday",
			holidayKind: "municipal"
		});
	}
	return out;
});
var MONTH_INDEX = {
	jan: 0,
	fev: 1,
	mar: 2,
	abr: 3,
	mai: 4,
	jun: 5,
	jul: 6,
	ago: 7,
	set: 8,
	out: 9,
	nov: 10,
	dez: 11
};
function stripCell(html) {
	return html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}
function tableRows(table) {
	return [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) => [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => stripCell(cell[1]))).filter((row) => row.length >= 2);
}
function parsePayCell(raw, year, competence) {
	const hit = raw.toLowerCase().match(/(\d{1,2})\s*\/\s*([a-zç]{3})/);
	if (!hit) return null;
	const month = MONTH_INDEX[hit[2]];
	if (month == null) return null;
	const day = Number(hit[1]);
	const payYear = month < competence ? year + 1 : year;
	const iso = `${payYear}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
	const date = new Date(payYear, month, day);
	if (date.getFullYear() !== payYear || date.getMonth() !== month || date.getDate() !== day) return null;
	return iso;
}
function emptyBoard() {
	const board = {};
	for (let digit = 0; digit <= 9; digit += 1) board[digit] = Array.from({ length: 12 }, () => "");
	return board;
}
function fillBoard(rows, year, grouped) {
	const board = emptyBoard();
	let filled = 0;
	for (const row of rows) {
		const digits = (row[0].match(/\d/g) ?? []).map(Number).filter((digit) => digit >= 0 && digit <= 9);
		if (!digits.length) continue;
		if (grouped && digits.length < 2) continue;
		if (!grouped && digits.length !== 1) continue;
		for (let month = 0; month < 12; month += 1) {
			const iso = parsePayCell(row[month + 1] ?? "", year, month);
			if (!iso) continue;
			for (const digit of digits) {
				board[digit][month] = iso;
				filled += 1;
			}
		}
	}
	if (filled < 40) return null;
	return board;
}
function parseInssHtml(html, year) {
	const tables = [...html.matchAll(/<table\b[\s\S]*?<\/table>/gi)].map((hit) => hit[0]);
	let minimo = null;
	let acima = null;
	for (const table of tables) {
		const rows = tableRows(table);
		if (!minimo) {
			const board = fillBoard(rows, year, false);
			if (board) {
				minimo = board;
				continue;
			}
		}
		if (!acima) {
			const board = fillBoard(rows, year, true);
			if (board) acima = board;
		}
	}
	if (!minimo || !acima) return null;
	return {
		minimo,
		acima
	};
}
var confirmMoonFestival_createServerFn_handler = createServerRpc({
	id: "c1fc57be5d57ae35b9adc0bf0509e73d0577aa53bfda9bad75d2ee345329c470",
	name: "confirmMoonFestival",
	filename: "src/lib/calendar-server.ts"
}, (opts) => confirmMoonFestival.__executeServer(opts));
var confirmMoonFestival = createServerFn({ method: "GET" }).validator(object({ year: number().int().min(1).max(9999) })).handler(confirmMoonFestival_createServerFn_handler, async ({ data }) => {
	try {
		const res = await fetch("https://en.wikipedia.org/api/rest_v1/page/html/Mid-Autumn_Festival", {
			signal: AbortSignal.timeout(3500),
			headers: { accept: "text/html" }
		});
		if (!res.ok) return { iso: null };
		return { iso: parseMoonFestivalHtml(await res.text(), data.year) };
	} catch {
		return { iso: null };
	}
});
var getInssCalendar_createServerFn_handler = createServerRpc({
	id: "25a1c62282c723e27a79c2de67d0f1a117cb0ffa0a6d3e37ea0a487963168d96",
	name: "getInssCalendar",
	filename: "src/lib/calendar-server.ts"
}, (opts) => getInssCalendar.__executeServer(opts));
var getInssCalendar = createServerFn({ method: "GET" }).validator(object({ year: number().int().min(1).max(9999) })).handler(getInssCalendar_createServerFn_handler, async ({ data }) => {
	const year = data.year;
	const urls = [
		`https://agenciabrasil.ebc.com.br/economia/noticia/${year}-01/confira-calendario-de-pagamentos-do-inss-para-${year}`,
		`https://agenciabrasil.ebc.com.br/economia/noticia/${year - 1}-12/confira-calendario-de-pagamentos-do-inss-para-${year}`,
		`https://agenciabrasil.ebc.com.br/economia/noticia/${year}-12/confira-calendario-de-pagamentos-do-inss-para-${year}`
	];
	for (const url of urls) try {
		const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
		if (!res.ok) continue;
		const table = parseInssHtml(await res.text(), year);
		if (table) return {
			table,
			live: true
		};
	} catch {}
	return {
		table: null,
		live: false
	};
});
//#endregion
export { confirmElectionSecondRound_createServerFn_handler, confirmIrpfDeadline_createServerFn_handler, confirmLaborYear_createServerFn_handler, confirmMoonFestival_createServerFn_handler, getGoogleMonth_createServerFn_handler, getHolidays_createServerFn_handler, getInssCalendar_createServerFn_handler, getMunicipalHolidays_createServerFn_handler, locateMunicipio_createServerFn_handler, searchMunicipio_createServerFn_handler };
