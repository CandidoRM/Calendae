import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { A11yHint } from "@/components/a11y-hint";
import { Button } from "@/components/ui/button";
import { HeaderMenu } from "@/components/header-menu";
import { SignInGate, UserButton } from "@/lib/auth/gates";
import { GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import {
  CAL_TABS,
  formatHolidaySync,
  type CalTabId,
  type HolidayYearCache,
  type WeekStart,
} from "@/lib/calendar";
import { cn, withTip } from "@/lib/utils";

type SettingsTab = "geral" | "calendario" | "app";

const TABS: { id: SettingsTab; label: string }[] = [
  { id: "geral", label: "Geral" },
  { id: "calendario", label: "Calendário" },
  { id: "app", label: "App" },
];

function KindMark({ on }: { on: boolean }) {
  return <span aria-hidden="true" className={cn("cal-kind", on && "is-on")} />;
}

function Aba({
  title,
  hint,
  children,
  bodyClassName,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  bodyClassName?: string;
}) {
  return (
    <section className="cal-tab">
      <div className="cal-tab-head">
        <h3 className="cal-tab-title">{title}</h3>
      </div>
      {hint ? <A11yHint>{hint}</A11yHint> : null}
      <div
        className={
          bodyClassName ??
          "grid grid-cols-[minmax(0,1fr)_8.5rem] items-center gap-x-3 gap-y-3"
        }
      >
        {children}
      </div>
    </section>
  );
}

type SettingsPanelProps = {
  onClose: () => void;
  holidayCache: HolidayYearCache | undefined;
  reminderStatus: string | null;
  remindersBusy?: boolean;
  weekStart: WeekStart;
  saturdayTint: boolean;
  sundayTint: boolean;
  holidayTint: boolean;
  onWeekStart: (next: WeekStart) => void;
  onSaturdayTint: (next: boolean) => void;
  onSundayTint: (next: boolean) => void;
  onHolidayTint: (next: boolean) => void;
  tabs: Record<CalTabId, boolean>;
  onToggleTab: (id: CalTabId, next: boolean) => void;
  a11yNumbers: boolean;
  a11yText: boolean;
  a11ySaturated: boolean;
  a11yColorblind: boolean;
  a11yHints: boolean;
  onA11yNumbers: (next: boolean) => void;
  onA11yText: (next: boolean) => void;
  onA11ySaturated: (next: boolean) => void;
  onA11yColorblind: (next: boolean) => void;
  onA11yHints: (next: boolean) => void;
  onSyncGoogle: () => void;
  onEnableReminders: () => void;
};

export function SettingsPanel({
  onClose,
  holidayCache,
  reminderStatus,
  remindersBusy,
  weekStart,
  saturdayTint,
  sundayTint,
  holidayTint,
  onWeekStart,
  onSaturdayTint,
  onSundayTint,
  onHolidayTint,
  tabs,
  onToggleTab,
  a11yNumbers,
  a11yText,
  a11ySaturated,
  a11yColorblind,
  a11yHints,
  onA11yNumbers,
  onA11yText,
  onA11ySaturated,
  onA11yColorblind,
  onA11yHints,
  onSyncGoogle,
  onEnableReminders,
}: SettingsPanelProps) {
  const [tab, setTab] = useState<SettingsTab>("geral");
  const [weekMenu, setWeekMenu] = useState(false);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-bg/96 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] text-fg backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[390px] flex-1 flex-col overflow-hidden">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-[2.25rem] italic leading-none">Ajustes</h2>
          <Button variant="ghost" size="icon" {...withTip("Fechar")} aria-label="Fechar" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <div className="cal-guide-nav mb-4 mt-3">
          <nav className="grid grid-cols-3" aria-label="Seções de ajustes">
            {TABS.map((item) => {
              const on = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={on ? "page" : undefined}
                  className="cal-guide-btn pb-4 pt-2.5 font-display text-[1.05rem] italic leading-none"
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
          <span
            className="cal-guide-mark"
            aria-hidden="true"
            style={{
              transform: `translate3d(${TABS.findIndex((item) => item.id === tab) * 100}%, 0, 0)`,
              transition: "transform 0.5s ease-in-out",
            }}
          >
            <img src="/flourish-moss.png" alt="" className="cal-guide-flourish" />
          </span>
        </div>
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col gap-3 pb-4",
            weekMenu ? "overflow-visible" : "overflow-y-auto",
          )}
        >
          {tab === "geral" ? (
            <>
              <Aba
                title="Login"
                hint="A agenda sobe pra nuvem nesta conta. No outro aparelho, entre com a mesma."
              >
                <div className="col-span-2">
                  <SignInGate
                    fallback={
                      <div className="flex flex-col gap-2">
                        {GROK_PROVIDERS.map((p) => (
                          <Button
                            key={p.providerId}
                            type="button"
                            variant="line"
                            className="w-full"
                            onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                          >
                            Continuar com {p.label}
                          </Button>
                        ))}
                      </div>
                    }
                  >
                    <UserButton />
                  </SignInGate>
                </div>
              </Aba>
              <Aba
                title="Abas"
                hint="Desmarque para esconder uma seção. O que você anotou continua salvo."
                bodyClassName="grid grid-cols-[minmax(0,1fr)_8.5rem] items-center gap-x-3 gap-y-0.5"
              >
                {CAL_TABS.map((item, index) => (
                  <div key={item.id} className="col-span-2">
                    <button
                      type="button"
                      aria-pressed={tabs[item.id]}
                      className={cn(
                        "flex w-full items-center justify-between text-sm text-fg",
                        index === 0 ? "mt-2" : "mt-1.5",
                      )}
                      onClick={() => onToggleTab(item.id, !tabs[item.id])}
                    >
                      <span className="flex h-4 items-center leading-none">{item.label}</span>
                      <KindMark on={tabs[item.id]} />
                    </button>
                    <A11yHint>
                      {item.id === "holidays"
                        ? "Feriados e eleições saem da lista e da grade."
                        : item.id === "agenda"
                          ? "Compromissos e períodos saem da lista e da grade. Avisos também param."
                          : item.id === "birthdays"
                              ? "Aniversários saem da lista e da grade."
                              : item.id === "finance"
                                ? "Benefícios e contas saem da lista e da grade."
                                : "Compromissos antigos saem da lista."}
                    </A11yHint>
                  </div>
                ))}
              </Aba>
              <Aba
                title="Acessibilidade"
                hint="Ajusta tamanho e cores para enxergar ou entender melhor o calendário."
                bodyClassName="grid grid-cols-[minmax(0,1fr)_8.5rem] items-center gap-x-3 gap-y-0.5"
              >
                {(
                  [
                    ["Ampliar números", a11yNumbers, onA11yNumbers, "Deixa os dias da grade e o ano 50% maiores."],
                    ["Ampliar textos", a11yText, onA11yText, "Aumenta listas e alternativas, sem mexer nos títulos."],
                    ["Cores saturadas", a11ySaturated, onA11ySaturated, "Deixa as cores das datas mais vivas e o texto mais contrastado."],
                    ["Cores daltônicas", a11yColorblind, onA11yColorblind, "Troca as cores das datas para quem confunde vermelho e verde."],
                    ["Textos explicativos", a11yHints, onA11yHints, "Mostra uma linha dizendo o que cada aba e alternativa faz."],
                  ] as const
                ).map(([label, on, set, hint], index) => (
                  <div key={label} className="col-span-2">
                    <button
                      type="button"
                      aria-pressed={on}
                      className={cn(
                        "flex w-full items-center justify-between text-sm text-fg",
                        index === 0 ? "mt-2" : "mt-1.5",
                      )}
                      onClick={() => set(!on)}
                    >
                      <span className="flex h-4 items-center leading-none">{label}</span>
                      <KindMark on={on} />
                    </button>
                    <A11yHint>{hint}</A11yHint>
                  </div>
                ))}
              </Aba>
            </>
          ) : null}
          {tab === "calendario" ? (
            <>
              <Aba
                title="Início da Semana"
                hint="Escolha se a primeira coluna da grade é domingo ou segunda."
                bodyClassName="relative pb-1 pt-1.5"
              >
                <HeaderMenu
                  label="Início da semana"
                  value={weekStart}
                  options={[
                    { value: "sunday", label: "Domingo" },
                    { value: "monday", label: "Segunda-feira" },
                  ]}
                  open={weekMenu}
                  wide
                  buttonClassName="cal-week-btn"
                  optionClassName="cal-week-option"
                  onOpen={() => setWeekMenu(true)}
                  onClose={() => setWeekMenu(false)}
                  onPick={(next) => {
                    onWeekStart(next);
                    setWeekMenu(false);
                  }}
                />
              </Aba>
              <Aba
                title="Diferenciar Dias Úteis"
                hint="Pinta sábado, domingo ou feriado na grade. Pode ligar mais de um."
                bodyClassName="grid grid-cols-[minmax(0,1fr)_8.5rem] items-center gap-x-3 gap-y-0.5"
              >
                <button
                  type="button"
                  aria-pressed={saturdayTint}
                  className="col-span-2 mt-2 flex items-center justify-between text-sm text-fg"
                  onClick={() => onSaturdayTint(!saturdayTint)}
                >
                  <span className="flex h-4 items-center leading-none">Sábado</span>
                  <KindMark on={saturdayTint} />
                </button>
                <A11yHint className="col-span-2">Pinta os sábados na cor de feriado.</A11yHint>
                <button
                  type="button"
                  aria-pressed={sundayTint}
                  className="col-span-2 mt-1.5 flex items-center justify-between text-sm text-fg"
                  onClick={() => onSundayTint(!sundayTint)}
                >
                  <span className="flex h-4 items-center leading-none">Domingos</span>
                  <KindMark on={sundayTint} />
                </button>
                <A11yHint className="col-span-2">Pinta os domingos na cor de feriado.</A11yHint>
                <button
                  type="button"
                  aria-pressed={holidayTint}
                  className="col-span-2 mt-1.5 flex items-center justify-between text-sm text-fg"
                  onClick={() => onHolidayTint(!holidayTint)}
                >
                  <span className="flex h-4 items-center leading-none">Feriados</span>
                  <KindMark on={holidayTint} />
                </button>
                <A11yHint className="col-span-2">
                  Ligado, feriados ficam coloridos. Desligado, parecem dia comum.
                </A11yHint>
              </Aba>
            </>
          ) : null}
          {tab === "app" ? (
            <>
              <Aba title="Botões" hint="Aviso no horário e sincronizar a agenda do Google.">
                <p className="text-pretty text-sm text-muted">
                  O sino no compromisso fica gravado. No app nativo o celular avisa no
                  horário, mesmo fechado. Por enquanto, neste PWA, só avisa se o
                  Calendae estiver aberto.
                </p>
                <Button
                  type="button"
                  variant="line"
                  className="w-full"
                  disabled={remindersBusy}
                  onClick={onEnableReminders}
                >
                  {remindersBusy ? "Ligando…" : "Avisos"}
                </Button>
                {reminderStatus ? (
                  <>
                    <p className="text-pretty text-sm text-muted">{reminderStatus}</p>
                    <span />
                  </>
                ) : null}
                <p className="text-pretty text-sm text-muted">
                  Puxa seus compromissos quando o app estiver aberto pelo Grok com a agenda conectada.
                </p>
                <Button type="button" variant="line" className="w-full" onClick={onSyncGoogle}>
                  Sincronizar
                </Button>
                <p className="text-pretty text-sm text-muted">{formatHolidaySync(holidayCache)}</p>
                <span />
              </Aba>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
