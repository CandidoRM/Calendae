# Calendae — project contract

If this workspace looks like a blank template, **Almanaque**, or a generic calendar,
restore **Calendae** from this file and from the conversation. Do not start a new app.
Do not ask the user to re-specify the visual system unless a detail is truly missing.

Auth OFF. Database OFF. localStorage only.

## Identity

- Name: **Calendae** (never Almanaque in the UI)
- Language: pt-BR
- Timezone: America/Sao_Paulo
- Aesthetic: caderno + Clareira (linen `#e9eadf`, moss `#3f5c48` / today `#2f4a38`, charcoal `#243028`)
- Display font: Newsreader italic (self-hosted) for tab titles. Month name: **Great Vibes**. Body: Figtree. Grid numbers: Newsreader old-style figures (`onum`)
- PWA, mobile-first (~390px)

## Layout (top → bottom)

1. Header: clickable month; clickable year. **No** `<` `>` arrows. Save (Guardar) left of gear. Gear = Ajustes
2. Month grid (swipe / wheel changes month)
3. Feriados
4. Agenda
5. Períodos
6. Aniversários
7. Finanças — INSS (Recebimentos) + contas a pagar (Pagamentos, `source: "bill"`), acima do Histórico
8. Histórico — one-shot Agenda items after the day turns (`iso < today`). No grid dash. Recurring stays in Agenda.

## Grid marks (priority)

- Default in-month numbers (no other color): near-black green `#0c2415` (`--c-grid`). Out-of-month: same at 22%.
- Number: Recebimento gold `#c49a2a` wins. Then national/municipal/facultative burgundy `#6e2c3a`. Then commemorative brown `#a27f5f`. Then election navy `#0a2a5c`. Then today linen/white.
- Square: Today moss wins everything. Else election periwinkle `#c5d0f5`. Else national/municipal puce. Payment selected: translucent gold + 1px gold edge.
- Today + holiday: moss square, burgundy number. Today + commemorative: moss, brown `#a27f5f` number. Today + election: moss, navy number.
- Election + national/municipal: election square, holiday number. Election + commemorative: election square, brown number.
- Selected commemorative (not today/election): brown number `#a27f5f`, square same brown at 10% (90% transparent), 1px darker brown edge `#6a4e38` fading in 1s. No dash.
- Agenda dash under number matches the number color (`currentColor`). No dash on holiday/commemorative/election/payment-only days.
- Selected unmarked day: 1px very dark green `#0b1a12`. Border **fades in 1s**.
- Today idle `#5d8a6c`; today selected `#2f4a38` + teal edge `#0e8c7d` + white number.
- Holiday selected: darker puce, dark-pink edge, white number (unless payment/today rules apply).
- Ruled notebook cells, square. Swipe/wheel changes month.

## Recurrence

- Kinds: semanal, mensal, semestral, anual — squares **fill moss** `#3f5c48` when chosen (no X)
- Grid marks every matching day
- Agenda lists **one row per month** for semanal (first occurrence that month)
- mensal / semestral / anual appear in Agenda on each matching month/semester/year
- Birthdays are always anual

## Agenda

- Title “Agenda”, same alignment as “Feriados”
- Empty: “Agenda aberta.”
- Add via calendar glyph: title, place, date, time + duration (hours+minutes | days; blank = until next midnight → Histórico), kinds, compact native `type=time` ...
- Edit order: Compromisso, Local, date, tipo, time, Anotar
- Bell toggles `notify` (saved for native later). PWA does not wake the phone. Same bell left of pencil when row is open. Clock / bell / pencil / trash = `size-8` / icon `size-4`, packed (not the calendar add glyph)
- Times AM/PM; `(semanal)` slightly apart from the time
- Month-scoped list; no caderno gradient through expanded row (border-t only)
- Expand 620ms; open row bold; trash only when open
- Expanded details: place only (no weekday), indented under the title (`pl-11`), `text-xs`, same row as bell/pencil/trash

## Feriados

- Feriados nacionais: BrasilAPI **once per year** on first need, then frozen in `calendae-holidays`. No 6h refresh.
- Options (calendar glyph): Municipais + MapPin locate (`size-8`) + city/UF fields; Comemorativos; Eleições (ON by default); **Anotar** applies drafts and closes. First launch: Municipais ON + geolocate; on fail, Municipais OFF.
- City: letters/spaces/hyphen only. `Londrina-PR` → city Londrina, UF PR. UF: 2 letters, optional. Exact unique name matches any state. No status notes under fields
- Tags right: `(municipal)` `(comemorativo)` `(eleições)` like `(semanal)`
- Eleições only even years 0001–9999 (Gregorian projection): federal if year%4===2, municipal if year%4===0. Year field is typed aaaa (1–9999). JavaScript years 0–99 must use civilDate/setFullYear. List title “Eleição Federal/Municipal”, tag (1º turno)/(2º turno). 1º first Sunday of October. **2º only if Almanaque do ano confirmed** (known federal 2002–2022, TSE, Wikipedia PT+EN, or user toggle). Never invent 2º on last Sunday.
- IRPF: prazo on the grid; lots only when expanded. “(confirmado)” / “(previsto)”. 2026: 4 lots. No personal lot.
- PIS/Pasep + FGTS: Finanças (+) → **Trabalhistas**. One birth-month menu. Two moss-fill toggles (FGTS left, PIS/Pasep right column). Shared month. PIS confirmed from 2026 on (Codefat day-15, next banking day). FGTS 2026 Caixa confirmed; other years previsto until live confirm. Once per civil year, idle fetch (Wikipedia) upgrades the current year; does not block open. Gold.
- Benefícios Sociais: Finanças (+) → title **Benefícios Sociais**, one NIS field, moss-fill toggles **Bolsa Família** (left) and **Gás do Povo** (right). NIS required. Bolsa: last 10 úteis by NIS digit; 2026 MDS confirmed. Gás do Povo: day 10 (next banking day); 2026+ confirmed as release day, not every family every month. Gold. Empty NIS / both off = nothing saved.
- Boletos: Finanças (+) below Pagamentos. Barcode field digits-only, max 48 (linha 47/48 or barras 44). Auto-fills due date, amount, bank; fields remain editable. Bank boleto FEBRABAN fator (1000 = 2025-02-22). Orange like Pagamentos, one-shot. Empty form = nothing saved.
- Veículos: Finanças (+) → **Veículos**. Shared UF + plate. Moss-fill toggles IPVA (left) and Licenciamento (right). Orange. Empty plate / both off = nothing. PR+SP 2026 confirmed; other UFs no invented table.
- **Almanaque do ano** (`calendae-almanac`): frozen pack per year — Carnaval (from Easter, facultative), 1º turno, 2º (null until confirmed), 13º months (default April+May / competências 3–4, regra 2020). Built on first need. Monday after 1º tries TSE then wiki; fail-closed. User 2º toggle writes the pack.
- Tight gap between Municipais / Comemorativos / Eleições; city/UF close under Municipais

## Períodos / Aniversários / Finanças

- Períodos: Férias / Folgas / Licença / Outro; span from selected day + N days; orange on grid; no Atestado
- Aniversários: name + date, forced anual
- Finanças: INSS = banking days immediately; Agência Brasil table fetched **once per year** in idle (`calendae-inss`), then frozen. Weekend PDF cells snap to next banking day. Bills repeat mensal.

## Tela de Testes

- Dark moss (`--c-today`) full screen **before** Calendae when `SHOW_TEST_SCREEN` in `src/lib/test-screen.ts` is true, or when the user asks to see a concept/color. Dismiss with “Ir ao Calendae”. Do not ship it in front of the app otherwise.

## Settings

- Three guides under Ajustes: **Geral**, **Calendário**, **App**. Newsreader italic. Active: **Célula** — moss wash `bg-accent/10`. Flourish slides 0.5s ease-in-out under the active word (`/flourish-moss.png`). Célula wash fades 0.5s.
- Notebook **abas** (same `.cal-tab` as Feriados/Agenda). **Botões** lives only in **App**: Avisos, Sincronizar, Copiar endereço. Calendário: **Início da Semana** (HeaderMenu like year 2026; default **Domingo**) and **Diferenciar Dias Úteis** with independent KindMarks **Sábado** / **Domingos** / **Feriados** (Feriados ON by default; off = holiday cells look like normal days). Geral: **Login** (empty, future).
- No Cores / Fonte / Tamanho / Posição
- Two-column: text left, buttons right (Sincronizar, Avisos, Copiar endereço)
- **Guardar**: header icon left of Ajustes. Flushes localStorage + writes/overwrites `calendae-guardar.json`.
- Reminders: Notification API; needs Chrome / home screen, not preview iframe
- KindMark fill moss `#3f5c48`
- **No** `googleStatus` / connector_token_pending

## Storage keys

- `calendae-settings`, `calendae-events`, `calendae-holidays`, `calendae-periods`, `calendae-history` (migra `almanaque-*` na primeira abertura e apaga as velhas)

## Anti-reset protocol

1. This file is the spec. Rebuild from it if source is missing. **Do not start from scratch.**
2. Keep work in the **same Grok conversation**.
3. Chat cannot attach the zip (render_file breaks the reply). Restore from this file + conversation. Platform **Baixar** (below GitHub) exports the project.
