import { r as createServerFn } from "./ssr.mjs";
import { hn as object, mn as number, vn as string } from "../_libs/@better-auth/core+[...].mjs";
import { n as createSsrRpc } from "./routes-B7H0fKm0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-server-Cid4tTfg.js
var getHolidays = createServerFn({ method: "GET" }).validator(object({ year: number().int().min(1).max(9999) })).handler(createSsrRpc("0a73a2c0ee4446534c48380ab8dcaa23a4192c46d8931e88145db84b178684c0"));
var confirmElectionSecondRound = createServerFn({ method: "GET" }).validator(object({ year: number().int().min(1).max(9999) })).handler(createSsrRpc("6ce754ef39f76653745550a7d5c56f0951bf258c884c08b496ca80ba6bba9a0c"));
var confirmIrpfDeadline = createServerFn({ method: "GET" }).validator(object({ year: number().int().min(1).max(9999) })).handler(createSsrRpc("700bc4d363d10c4d04c0f2c203ca1e4fc4a80d3c9f38302a67a90bdca5ae19b4"));
var confirmLaborYear = createServerFn({ method: "GET" }).validator(object({ year: number().int().min(1).max(9999) })).handler(createSsrRpc("da3bc742dbf22aa3159e52a665cc53e7a6c96db35851635079ecc9f8e09cd50c"));
var getGoogleMonth = createServerFn({ method: "POST" }).validator(object({
	timeMin: string(),
	timeMax: string()
})).handler(createSsrRpc("16213d02f8ffad69cd3375c6c683e7a19a8a39ed14bcca8f4c4b3daf4fb9a62c"));
var searchMunicipio = createServerFn({ method: "GET" }).validator(object({
	query: string().min(2).max(80),
	uf: string().max(2).optional()
})).handler(createSsrRpc("7392c809e894659b550455ce58d228313c0b0708d2038c16d3530f0735950eaa"));
var locateMunicipio = createServerFn({ method: "GET" }).validator(object({
	lat: number(),
	lon: number()
})).handler(createSsrRpc("c21c5449358e2f9df618a8cc7bd3d04110813a0c36e8e23ef8f0e8f4fcb1e3a0"));
var getMunicipalHolidays = createServerFn({ method: "GET" }).validator(object({
	year: number().int().min(1).max(9999),
	ibge: number().int(),
	city: string().min(1).max(80),
	uf: string().max(2).optional()
})).handler(createSsrRpc("98b88ca90daf9bfbf0e19e4900c5906711c6bd29d2e0324e0f4f39032700d6d3"));
var confirmMoonFestival = createServerFn({ method: "GET" }).validator(object({ year: number().int().min(1).max(9999) })).handler(createSsrRpc("c1fc57be5d57ae35b9adc0bf0509e73d0577aa53bfda9bad75d2ee345329c470"));
var getInssCalendar = createServerFn({ method: "GET" }).validator(object({ year: number().int().min(1).max(9999) })).handler(createSsrRpc("25a1c62282c723e27a79c2de67d0f1a117cb0ffa0a6d3e37ea0a487963168d96"));
//#endregion
export { confirmElectionSecondRound, confirmIrpfDeadline, confirmLaborYear, confirmMoonFestival, getGoogleMonth, getHolidays, getInssCalendar, getMunicipalHolidays, locateMunicipio, searchMunicipio };
