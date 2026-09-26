import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as CAL_TABS, z as formatHolidaySync } from "./moon-festival-CMLpKxi0.mjs";
import { n as signIn } from "./client-CoMeym3u.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { a as setCalendaeLoginOff, c as Button, d as withTip, l as A11yHint, o as useCalendaeSession, s as HeaderMenu, u as cn } from "./routes-B7H0fKm0.mjs";
import { t as GROK_PROVIDERS } from "./server-CrmaWJSe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-panel-kLbtn_lp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		id: "geral",
		label: "Geral"
	},
	{
		id: "calendario",
		label: "Calendário"
	},
	{
		id: "app",
		label: "App"
	}
];
function KindMark({ on }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": "true",
		className: cn("cal-kind", on && "is-on")
	});
}
function Aba({ title, hint, children, bodyClassName }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "cal-tab",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cal-tab-head",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "cal-tab-title",
					children: title
				})
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: hint }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: bodyClassName ?? "grid grid-cols-[minmax(0,1fr)_8.5rem] items-center gap-x-3 gap-y-3",
				children
			})
		]
	});
}
function SettingsPanel({ onClose, holidayCache, reminderStatus, remindersBusy, weekStart, saturdayTint, sundayTint, holidayTint, hourCycle, onWeekStart, onSaturdayTint, onSundayTint, onHolidayTint, onHourCycle, tabs, onToggleTab, a11yNumbers, a11yText, a11ySaturated, a11yColorblind, a11yHints, onA11yNumbers, onA11yText, onA11ySaturated, onA11yColorblind, onA11yHints, onSyncGoogle, onEnableReminders, cloudStatus, onLeaveAccount }) {
	const [tab, setTab] = (0, import_react.useState)("geral");
	const [weekMenu, setWeekMenu] = (0, import_react.useState)(false);
	const [hourMenu, setHourMenu] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "cal-settings fixed inset-0 z-40 flex flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-[390px] flex-1 flex-col overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-[2.25rem] italic leading-none",
						children: "Ajustes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						...withTip("Fechar"),
						"aria-label": "Fechar",
						onClick: onClose,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cal-guide-nav mb-4 mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "grid grid-cols-3",
						"aria-label": "Seções de ajustes",
						children: TABS.map((item) => {
							const on = tab === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-current": on ? "page" : void 0,
								className: "cal-guide-btn pb-4 pt-2.5 font-display text-[1.05rem] italic leading-none",
								onClick: () => setTab(item.id),
								children: item.label
							}, item.id);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cal-guide-mark",
						"aria-hidden": "true",
						style: {
							transform: `translate3d(${TABS.findIndex((item) => item.id === tab) * 100}%, 0, 0)`,
							transition: "transform 0.5s ease-in-out"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/flourish-moss.png",
							alt: "",
							className: "cal-guide-flourish"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex min-h-0 flex-1 flex-col gap-3 pb-4", weekMenu || hourMenu ? "overflow-visible" : "overflow-y-auto"),
					children: [
						tab === "geral" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Aba, {
								title: "Login",
								hint: "A agenda sobe pra nuvem nesta conta. No outro aparelho, entre com a mesma.",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendaeLogin, { onLeaveAccount })
								}), cloudStatus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "col-span-2 text-pretty text-sm text-muted",
									children: cloudStatus
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aba, {
								title: "Abas",
								hint: "Desmarque para esconder uma seção. O que você anotou continua salvo.",
								bodyClassName: "grid grid-cols-[minmax(0,1fr)_8.5rem] items-center gap-x-3 gap-y-0.5",
								children: CAL_TABS.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-pressed": tabs[item.id],
										className: cn("flex w-full items-center justify-between text-sm text-fg", index === 0 ? "mt-2" : "mt-1.5"),
										onClick: () => onToggleTab(item.id, !tabs[item.id]),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-4 items-center leading-none",
											children: item.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark, { on: tabs[item.id] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: item.id === "holidays" ? "Feriados e eleições saem da lista e da grade." : item.id === "agenda" ? "Compromissos saem da lista e da grade. Avisos também param." : item.id === "birthdays" ? "Aniversários saem da lista e da grade." : item.id === "finance" ? "Benefícios e contas saem da lista e da grade." : "Compromissos antigos saem da lista." })]
								}, item.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aba, {
								title: "Acessibilidade",
								hint: "Ajusta tamanho e cores para enxergar ou entender melhor o calendário.",
								bodyClassName: "grid grid-cols-[minmax(0,1fr)_8.5rem] items-center gap-x-3 gap-y-0.5",
								children: [
									[
										"Ampliar números",
										a11yNumbers,
										onA11yNumbers,
										"Deixa os dias da grade e o ano 50% maiores."
									],
									[
										"Ampliar textos",
										a11yText,
										onA11yText,
										"Aumenta listas e alternativas, sem mexer nos títulos."
									],
									[
										"Cores saturadas",
										a11ySaturated,
										onA11ySaturated,
										"Deixa as cores das datas mais vivas e o texto mais contrastado."
									],
									[
										"Cores daltônicas",
										a11yColorblind,
										onA11yColorblind,
										"Troca as cores das datas para quem confunde vermelho e verde."
									],
									[
										"Textos explicativos",
										a11yHints,
										onA11yHints,
										"Mostra uma linha dizendo o que cada aba e alternativa faz."
									]
								].map(([label, on, set, hint], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-pressed": on,
										className: cn("flex w-full items-center justify-between text-sm text-fg", index === 0 ? "mt-2" : "mt-1.5"),
										onClick: () => set(!on),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-4 items-center leading-none",
											children: label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark, { on })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, { children: hint })]
								}, label))
							})
						] }) : null,
						tab === "calendario" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aba, {
								title: "Formato de horas",
								hint: "12h com am/pm, ou 24h. Vale no campo e na lista.",
								bodyClassName: "relative pb-1 pt-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "cal-kind-pick",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderMenu, {
										label: "Formato de horas",
										value: hourCycle,
										options: [{
											value: "12",
											label: "12h"
										}, {
											value: "24",
											label: "24h"
										}],
										open: hourMenu,
										wide: true,
										fixed: true,
										soft: true,
										buttonClassName: "cal-kind-btn is-center",
										optionClassName: "cal-kind-option",
										onOpen: () => {
											setWeekMenu(false);
											setHourMenu(true);
										},
										onClose: () => setHourMenu(false),
										onPick: (next) => {
											onHourCycle(next);
											setHourMenu(false);
										}
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aba, {
								title: "Início da Semana",
								hint: "Escolha se a primeira coluna da grade é domingo ou segunda.",
								bodyClassName: "relative pb-1 pt-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "cal-kind-pick",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderMenu, {
										label: "Início da semana",
										value: weekStart,
										options: [{
											value: "sunday",
											label: "Domingo"
										}, {
											value: "monday",
											label: "Segunda-feira"
										}],
										open: weekMenu,
										wide: true,
										fixed: true,
										soft: true,
										buttonClassName: "cal-kind-btn overflow-hidden text-ellipsis whitespace-nowrap",
										optionClassName: "cal-kind-option",
										onOpen: () => {
											setHourMenu(false);
											setWeekMenu(true);
										},
										onClose: () => setWeekMenu(false),
										onPick: (next) => {
											onWeekStart(next);
											setWeekMenu(false);
										}
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Aba, {
								title: "Diferenciar Dias Úteis",
								hint: "Pinta sábado, domingo ou feriado na grade. Pode ligar mais de um.",
								bodyClassName: "grid grid-cols-[minmax(0,1fr)_8.5rem] items-center gap-x-3 gap-y-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-pressed": saturdayTint,
										className: "col-span-2 mt-2 flex items-center justify-between text-sm text-fg",
										onClick: () => onSaturdayTint(!saturdayTint),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-4 items-center leading-none",
											children: "Sábado"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark, { on: saturdayTint })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, {
										className: "col-span-2",
										children: "Pinta os sábados na cor de feriado."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-pressed": sundayTint,
										className: "col-span-2 mt-1.5 flex items-center justify-between text-sm text-fg",
										onClick: () => onSundayTint(!sundayTint),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-4 items-center leading-none",
											children: "Domingos"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark, { on: sundayTint })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, {
										className: "col-span-2",
										children: "Pinta os domingos na cor de feriado."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-pressed": holidayTint,
										className: "col-span-2 mt-1.5 flex items-center justify-between text-sm text-fg",
										onClick: () => onHolidayTint(!holidayTint),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-4 items-center leading-none",
											children: "Feriados"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark, { on: holidayTint })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yHint, {
										className: "col-span-2",
										children: "Ligado, feriados ficam coloridos. Desligado, parecem dia comum."
									})
								]
							})
						] }) : null,
						tab === "app" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Aba, {
							title: "Botões",
							hint: "Aviso no horário e sincronizar a agenda do Google.",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-pretty text-sm text-muted",
									children: "O sino no compromisso fica gravado. No app nativo o celular avisa no horário, mesmo fechado. Por enquanto, neste PWA, só avisa se o Calendae estiver aberto."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "line",
									className: "w-full",
									disabled: remindersBusy,
									onClick: onEnableReminders,
									children: remindersBusy ? "Ligando…" : "Avisos"
								}),
								reminderStatus ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-pretty text-sm text-muted",
									children: reminderStatus
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})] }) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-pretty text-sm text-muted",
									children: "Puxa seus compromissos quando o app estiver aberto pelo Grok com a agenda conectada."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "line",
									className: "w-full",
									onClick: onSyncGoogle,
									children: "Sincronizar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-pretty text-sm text-muted",
									children: formatHolidaySync(holidayCache)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
							]
						}) }) : null
					]
				})
			]
		})
	});
}
function CalendaeLogin({ onLeaveAccount }) {
	const { user, isPending, signedIn } = useCalendaeSession();
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return null;
	if (!signedIn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-2",
		children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			variant: "line",
			className: "w-full",
			onClick: () => {
				setCalendaeLoginOff(false);
				signIn(p.providerId, { callbackURL: "/" });
			},
			children: ["Continuar com ", p.label]
		}, p.providerId))
	});
	const label = user?.displayName ?? user?.primaryEmail ?? "Conta";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user?.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-0 flex-1 truncate text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: busy,
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait",
				onClick: () => {
					setBusy(true);
					onLeaveAccount().catch(() => setBusy(false));
				},
				children: busy ? "Saindo…" : "Sair"
			})
		]
	});
}
//#endregion
export { SettingsPanel };
