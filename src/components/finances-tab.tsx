import { useState } from "react";
import { A11yHint } from "@/components/a11y-hint";
import { BenefitsTab } from "@/components/benefits-tab";
import { BoletosBlock } from "@/components/boletos-block";
import { CalendarGlyph, useGlyphFlash } from "@/components/calendar-glyph";
import { HeaderMenu } from "@/components/header-menu";
import { PaymentsTab } from "@/components/payments-tab";
import { Button } from "@/components/ui/button";
import { fromIso, MONTHS, weekdayName, type CalEvent } from "@/lib/calendar";
import { lotLabel, type IrpfLot } from "@/lib/irpf";
import { type IpvaParcel } from "@/lib/ipva";
import { cn, withTip } from "@/lib/utils";

const UF_OPTIONS = [
  { value: "", label: "UF" },
  ..."AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO"
    .split(" ")
    .map((uf) => ({ value: uf, label: uf })),
];

function KindMark({ on }: { on: boolean }) {
  return <span aria-hidden="true" className={cn("cal-kind", on && "is-on")} />;
}

type FinancesTabProps = {
  year: number;
  month: number;
  today: string;
  selectedIso: string;
  openBenefitId: string | null;
  openBillId: string | null;
  benefits: CalEvent[];
  bills: CalEvent[];
  boletos: CalEvent[];
  irpf: CalEvent | null;
  irpfLots: IrpfLot[];
  irpfOpen: boolean;
  pis: CalEvent | null;
  pisOpen: boolean;
  laborMonth: number | null;
  onLaborMonth: (month: number | null) => void;
  pisOn: boolean;
  fgtsOn: boolean;
  onPisOn: (on: boolean) => void;
  onFgtsOn: (on: boolean) => void;
  ipva: CalEvent | null;
  ipvaOpen: boolean;
  ipvaLots: IpvaParcel[];
  ipvaUf: string;
  ipvaPlate: string;
  ipvaOn: boolean;
  licencaOn: boolean;
  onIpvaUf: (uf: string) => void;
  onIpvaPlate: (plate: string) => void;
  onIpvaOn: (on: boolean) => void;
  onLicencaOn: (on: boolean) => void;
  onAdd: (event: CalEvent) => void;
  onRemoveBenefit: (id: string) => void;
  onRemoveBill: (id: string) => void;
  onUpdate: (event: CalEvent) => void;
  onOpenBenefit: (event: CalEvent, iso: string) => void;
  onOpenBill: (event: CalEvent, iso: string) => void;
  onOpenIrpf: (event: CalEvent) => void;
  onOpenLot: (iso: string) => void;
  onOpenPis: (event: CalEvent) => void;
  onOpenFgts: (event: CalEvent) => void;
  onOpenIpva: (event: CalEvent) => void;
  fgts: CalEvent | null;
  fgtsOpen: boolean;
  fgtsUntil: string | null;
  bolsa: CalEvent | null;
  bolsaOpen: boolean;
  bolsaNis: string;
  bolsaOn: boolean;
  gasOn: boolean;
  onBolsaNis: (nis: string) => void;
  onBolsaOn: (on: boolean) => void;
  onGasOn: (on: boolean) => void;
  onOpenBolsa: (event: CalEvent) => void;
  gas: CalEvent | null;
  gasOpen: boolean;
  onOpenGas: (event: CalEvent) => void;
  licenca: CalEvent | null;
  licencaOpen: boolean;
  onOpenLicenca: (event: CalEvent) => void;
};

export function FinancesTab({
  year,
  month,
  today,
  selectedIso,
  openBenefitId,
  openBillId,
  benefits,
  bills,
  boletos,
  irpf,
  irpfLots,
  irpfOpen,
  pis,
  pisOpen,
  laborMonth,
  onLaborMonth,
  pisOn,
  fgtsOn,
  onPisOn,
  onFgtsOn,
  ipva,
  ipvaOpen,
  ipvaLots,
  ipvaUf,
  ipvaPlate,
  ipvaOn,
  licencaOn,
  onIpvaUf,
  onIpvaPlate,
  onIpvaOn,
  onLicencaOn,
  onAdd,
  onRemoveBenefit,
  onRemoveBill,
  onUpdate,
  onOpenBenefit,
  onOpenBill,
  onOpenIrpf,
  onOpenLot,
  onOpenPis,
  onOpenFgts,
  onOpenIpva,
  fgts,
  fgtsOpen,
  fgtsUntil,
  bolsa,
  bolsaOpen,
  bolsaNis,
  bolsaOn,
  gasOn,
  onBolsaNis,
  onBolsaOn,
  onGasOn,
  onOpenBolsa,
  gas,
  gasOpen,
  onOpenGas,
  licenca,
  licencaOpen,
  onOpenLicenca,
}: FinancesTabProps) {
  const [glyphFlash, pingGlyph] = useGlyphFlash();
  const [adding, setAdding] = useState(false);
  const [pisMenu, setPisMenu] = useState(false);
  const [ipvaUfMenu, setIpvaUfMenu] = useState(false);

  return (
    <section className="cal-tab">
      <div className="cal-tab-head">
        <h2 className="cal-tab-title">Finanças</h2>
        <Button
          variant="ghost"
          size="icon"
          {...withTip("Novo")}
          aria-label="Novo lançamento"
          onClick={() => {
            pingGlyph();
            setAdding((v) => !v);
          }}
        >
          <CalendarGlyph className="size-5" flash={glyphFlash} />
        </Button>
      </div>
      <A11yHint>O que entra do INSS e o que sai de conta, no mesmo mês.</A11yHint>
      {irpf ? (
        <div className="mt-1">
          <button
            type="button"
            onClick={() => {
              pingGlyph();
              onOpenIrpf(irpf);
            }}
            className={cn(
              "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left",
              irpf.iso < today && "opacity-55",
            )}
          >
            <span
              className={cn(
                "cal-agenda-tone cal-dmy text-[0.8rem]",
                irpfOpen ? "text-today" : "text-muted",
              )}
            >
              <span>{String(fromIso(irpf.iso).getDate()).padStart(2, "0")}</span>
              <span>/</span>
              <span>{String(fromIso(irpf.iso).getMonth() + 1).padStart(2, "0")}</span>
            </span>
            <span
              className={cn(
                "cal-agenda-tone min-w-0 text-sm",
                irpfOpen ? "font-bold" : "font-medium",
              )}
            >
              {irpf.title}
            </span>
            <span
              className={cn(
                "cal-agenda-tone text-right text-xs",
                irpfOpen ? "font-bold text-fg" : "font-normal text-muted",
              )}
            >
              {irpf.confirmed ? "(confirmado)" : "(previsto)"}
            </span>
            <span
              className={cn(
                "cal-agenda-tone text-xs capitalize",
                irpfOpen ? "font-bold text-fg" : "font-normal text-muted",
              )}
            >
              {weekdayName(irpf.iso).slice(0, 3)}
            </span>
          </button>
          <div className={cn("cal-event-details", irpfOpen && "is-open")}>
            <div>
            <p className="grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted">
              <span />
              <span className="col-span-2 whitespace-nowrap">Prazo final · Receita Federal</span>
            </p>
            {irpfLots.length ? (
              <div className="cal-agenda-follow pb-3">
                <span className="flex flex-col items-start gap-0.5">
                  {irpfLots.map((lot) => {
                    const d = fromIso(lot.iso);
                    return (
                      <button
                        key={lot.iso}
                        type="button"
                        className={cn(
                          "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem] items-baseline gap-x-2.5 border-0 bg-transparent p-0 text-left",
                          lot.iso < today && "opacity-55",
                        )}
                        onClick={() => onOpenLot(lot.iso)}
                      >
                        <span className="cal-dmy text-[0.7rem] leading-tight text-muted">
                          <span>{String(d.getDate()).padStart(2, "0")}</span>
                          <span>/</span>
                          <span>{String(d.getMonth() + 1).padStart(2, "0")}</span>
                        </span>
                        <span className="text-[0.7rem] text-muted">
                          {lot.confirmed ? "Restituição" : "Restituição prevista"}
                        </span>
                        <span className="text-right text-[0.7rem] text-muted">{lotLabel(lot.n)}</span>
                      </button>
                    );
                  })}
                </span>
              </div>
            ) : null}
            </div>
          </div>
        </div>
      ) : null}
      {bolsa ? (
        <div className="mt-1">
          <button
            type="button"
            onClick={() => {
              pingGlyph();
              onOpenBolsa(bolsa);
            }}
            className={cn(
              "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left",
              bolsa.iso < today && "opacity-55",
            )}
          >
            <span
              className={cn(
                "cal-agenda-tone cal-dmy text-[0.8rem]",
                bolsaOpen ? "text-today" : "text-muted",
              )}
            >
              <span>{String(fromIso(bolsa.iso).getDate()).padStart(2, "0")}</span>
              <span>/</span>
              <span>{String(fromIso(bolsa.iso).getMonth() + 1).padStart(2, "0")}</span>
            </span>
            <span
              className={cn(
                "cal-agenda-tone min-w-0 text-sm",
                bolsaOpen ? "font-bold" : "font-medium",
              )}
            >
              {bolsa.title}
            </span>
            <span
              className={cn(
                "cal-agenda-tone text-right text-xs",
                bolsaOpen ? "font-bold text-fg" : "font-normal text-muted",
              )}
            >
              {bolsa.confirmed ? "(confirmado)" : "(previsto)"}
            </span>
            <span
              className={cn(
                "cal-agenda-tone text-xs capitalize",
                bolsaOpen ? "font-bold text-fg" : "font-normal text-muted",
              )}
            >
              {weekdayName(bolsa.iso).slice(0, 3)}
            </span>
          </button>
          <div className={cn("cal-event-details", bolsaOpen && "is-open")}>
            <div>
              <p className="grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted">
                <span />
                <span className="col-span-2 whitespace-nowrap">
                  MDS · final {bolsa.monthNth}
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : null}
      {gas ? (
        <div className="mt-1">
          <button
            type="button"
            onClick={() => {
              pingGlyph();
              onOpenGas(gas);
            }}
            className={cn(
              "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left",
              gas.iso < today && "opacity-55",
            )}
          >
            <span
              className={cn(
                "cal-agenda-tone cal-dmy text-[0.8rem]",
                gasOpen ? "text-today" : "text-muted",
              )}
            >
              <span>{String(fromIso(gas.iso).getDate()).padStart(2, "0")}</span>
              <span>/</span>
              <span>{String(fromIso(gas.iso).getMonth() + 1).padStart(2, "0")}</span>
            </span>
            <span
              className={cn(
                "cal-agenda-tone min-w-0 text-sm",
                gasOpen ? "font-bold" : "font-medium",
              )}
            >
              {gas.title}
            </span>
            <span
              className={cn(
                "cal-agenda-tone text-right text-xs",
                gasOpen ? "font-bold text-fg" : "font-normal text-muted",
              )}
            >
              {gas.confirmed ? "(confirmado)" : "(previsto)"}
            </span>
            <span
              className={cn(
                "cal-agenda-tone text-xs capitalize",
                gasOpen ? "font-bold text-fg" : "font-normal text-muted",
              )}
            >
              {weekdayName(gas.iso).slice(0, 3)}
            </span>
          </button>
          <div className={cn("cal-event-details", gasOpen && "is-open")}>
            <div>
              <p className="grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted">
                <span />
                <span className="col-span-2 whitespace-nowrap">Liberação · MDS</span>
              </p>
            </div>
          </div>
        </div>
      ) : null}
      {fgts ? (
        <div className="mt-1">
          <button
            type="button"
            onClick={() => {
              pingGlyph();
              onOpenFgts(fgts);
            }}
            className={cn(
              "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left",
              fgts.iso < today && "opacity-55",
            )}
          >
            <span
              className={cn(
                "cal-agenda-tone cal-dmy text-[0.8rem]",
                fgtsOpen ? "text-today" : "text-muted",
              )}
            >
              <span>{String(fromIso(fgts.iso).getDate()).padStart(2, "0")}</span>
              <span>/</span>
              <span>{String(fromIso(fgts.iso).getMonth() + 1).padStart(2, "0")}</span>
            </span>
            <span
              className={cn(
                "cal-agenda-tone min-w-0 text-sm",
                fgtsOpen ? "font-bold" : "font-medium",
              )}
            >
              {fgts.title}
            </span>
            <span
              className={cn(
                "cal-agenda-tone text-right text-xs",
                fgtsOpen ? "font-bold text-fg" : "font-normal text-muted",
              )}
            >
              {fgts.confirmed ? "(confirmado)" : "(previsto)"}
            </span>
            <span
              className={cn(
                "cal-agenda-tone text-xs capitalize",
                fgtsOpen ? "font-bold text-fg" : "font-normal text-muted",
              )}
            >
              {weekdayName(fgts.iso).slice(0, 3)}
            </span>
          </button>
          <div className={cn("cal-event-details", fgtsOpen && "is-open")}>
            <div>
              <p className="grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted">
                <span />
                <span className="col-span-2 whitespace-nowrap">
                  Caixa
                  {laborMonth ? ` · nasc. ${MONTHS[laborMonth - 1]}` : ""}
                </span>
              </p>
              {fgtsUntil ? (
                <div className="cal-agenda-follow pb-3">
                  <button
                    type="button"
                    className={cn(
                      "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem] items-baseline gap-x-2.5 border-0 bg-transparent p-0 text-left",
                      fgtsUntil < today && "opacity-55",
                    )}
                    onClick={() => onOpenLot(fgtsUntil)}
                  >
                    <span className="cal-dmy text-[0.7rem] leading-tight text-muted">
                      <span>{String(fromIso(fgtsUntil).getDate()).padStart(2, "0")}</span>
                      <span>/</span>
                      <span>{String(fromIso(fgtsUntil).getMonth() + 1).padStart(2, "0")}</span>
                    </span>
                    <span className="text-[0.7rem] text-muted">Prazo final</span>
                    <span className="text-right text-[0.7rem] text-muted">
                      {fgts.confirmed ? "(confirmado)" : "(previsto)"}
                    </span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
      {pis ? (
        <div className="mt-1">
          <button
            type="button"
            onClick={() => {
              pingGlyph();
              onOpenPis(pis);
            }}
            className={cn(
              "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left",
              pis.iso < today && "opacity-55",
            )}
          >
            <span
              className={cn(
                "cal-agenda-tone cal-dmy text-[0.8rem]",
                pisOpen ? "text-today" : "text-muted",
              )}
            >
              <span>{String(fromIso(pis.iso).getDate()).padStart(2, "0")}</span>
              <span>/</span>
              <span>{String(fromIso(pis.iso).getMonth() + 1).padStart(2, "0")}</span>
            </span>
            <span
              className={cn(
                "cal-agenda-tone min-w-0 text-sm",
                pisOpen ? "font-bold" : "font-medium",
              )}
            >
              {pis.title}
            </span>
            <span
              className={cn(
                "cal-agenda-tone text-right text-xs",
                pisOpen ? "font-bold text-fg" : "font-normal text-muted",
              )}
            >
              {pis.confirmed ? "(confirmado)" : "(previsto)"}
            </span>
            <span
              className={cn(
                "cal-agenda-tone text-xs capitalize",
                pisOpen ? "font-bold text-fg" : "font-normal text-muted",
              )}
            >
              {weekdayName(pis.iso).slice(0, 3)}
            </span>
          </button>
          <div className={cn("cal-event-details", pisOpen && "is-open")}>
            <div>
              <p className="grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted">
                <span />
                <span className="col-span-2 whitespace-nowrap">
                  Abono salarial
                  {laborMonth ? ` · nasc. ${MONTHS[laborMonth - 1]}` : ""}
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : null}
      {ipva ? (
            <div className="mt-1">
              <button
                type="button"
                onClick={() => {
                  pingGlyph();
                  onOpenIpva(ipva);
                }}
                className={cn(
                  "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left",
                  ipva.iso < today && "opacity-55",
                )}
              >
                <span
                  className={cn(
                    "cal-agenda-tone cal-dmy text-[0.8rem]",
                    ipvaOpen ? "text-today" : "text-muted",
                  )}
                >
                  <span>{String(fromIso(ipva.iso).getDate()).padStart(2, "0")}</span>
                  <span>/</span>
                  <span>{String(fromIso(ipva.iso).getMonth() + 1).padStart(2, "0")}</span>
                </span>
                <span
                  className={cn(
                    "cal-agenda-tone min-w-0 text-sm",
                    ipvaOpen ? "font-bold" : "font-medium",
                  )}
                >
                  {ipva.title}
                </span>
                <span
                  className={cn(
                    "cal-agenda-tone text-right text-xs",
                    ipvaOpen ? "font-bold text-fg" : "font-normal text-muted",
                  )}
                >
                  {ipva.confirmed ? "(confirmado)" : "(previsto)"}
                </span>
                <span
                  className={cn(
                    "cal-agenda-tone text-xs capitalize",
                    ipvaOpen ? "font-bold text-fg" : "font-normal text-muted",
                  )}
                >
                  {weekdayName(ipva.iso).slice(0, 3)}
                </span>
              </button>
              <div className={cn("cal-event-details", ipvaOpen && "is-open")}>
                <div>
                  {ipvaLots.length ? (
                    <div className="cal-agenda-follow pb-3">
                      <span className="flex flex-col items-start gap-0.5">
                        {ipvaLots.map((lot) => {
                          const d = fromIso(lot.iso);
                          return (
                            <button
                              key={lot.iso}
                              type="button"
                              className={cn(
                                "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem] items-baseline gap-x-2.5 border-0 bg-transparent p-0 text-left",
                                lot.iso < today && "opacity-55",
                              )}
                              onClick={() => onOpenLot(lot.iso)}
                            >
                              <span className="cal-dmy text-[0.7rem] leading-tight text-muted">
                                <span>{String(d.getDate()).padStart(2, "0")}</span>
                                <span>/</span>
                                <span>{String(d.getMonth() + 1).padStart(2, "0")}</span>
                              </span>
                              <span className="text-[0.7rem] text-muted">{lot.label}</span>
                              <span className="text-right text-[0.7rem] text-muted">
                                {lot.confirmed ? "(confirmado)" : "(previsto)"}
                              </span>
                            </button>
                          );
                        })}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
      {licenca ? (
            <div className="mt-1">
              <button
                type="button"
                onClick={() => {
                  pingGlyph();
                  onOpenLicenca(licenca);
                }}
                className={cn(
                  "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left",
                  licenca.iso < today && "opacity-55",
                )}
              >
                <span
                  className={cn(
                    "cal-agenda-tone cal-dmy text-[0.8rem]",
                    licencaOpen ? "text-today" : "text-muted",
                  )}
                >
                  <span>{String(fromIso(licenca.iso).getDate()).padStart(2, "0")}</span>
                  <span>/</span>
                  <span>{String(fromIso(licenca.iso).getMonth() + 1).padStart(2, "0")}</span>
                </span>
                <span
                  className={cn(
                    "cal-agenda-tone min-w-0 text-sm",
                    licencaOpen ? "font-bold" : "font-medium",
                  )}
                >
                  {licenca.title}
                </span>
                <span
                  className={cn(
                    "cal-agenda-tone text-right text-xs",
                    licencaOpen ? "font-bold text-fg" : "font-normal text-muted",
                  )}
                >
                  {licenca.confirmed ? "(confirmado)" : "(previsto)"}
                </span>
                <span
                  className={cn(
                    "cal-agenda-tone text-xs capitalize",
                    licencaOpen ? "font-bold text-fg" : "font-normal text-muted",
                  )}
                >
                  {weekdayName(licenca.iso).slice(0, 3)}
                </span>
              </button>
              <div className={cn("cal-event-details", licencaOpen && "is-open")}>
                <div>
                  <p className="grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted">
                    <span />
                    <span className="col-span-2 whitespace-nowrap">DETRAN · CRLV-e</span>
                  </p>
                </div>
              </div>
            </div>
          ) : null}
      <BenefitsTab
        framed={false}
        adding={adding}
        year={year}
        month={month}
        today={today}
        openId={openBenefitId}
        benefits={benefits}
        onAdd={onAdd}
        onRemove={onRemoveBenefit}
        onUpdate={onUpdate}
        onOpen={onOpenBenefit}
      />
      {adding ? (
        <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
          <p className="text-sm font-medium text-fg">Benefícios Sociais</p>
          <input
            value={bolsaNis}
            inputMode="numeric"
            autoCorrect="off"
            spellCheck={false}
            maxLength={11}
            aria-label="NIS"
            placeholder="NIS"
            className="cal-num-field h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
            onChange={(event) => onBolsaNis(event.target.value)}
          />
          <div className="grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-center gap-x-2.5">
            <button
              type="button"
              className="col-span-2 flex h-7 items-center gap-3 text-left text-sm"
              aria-pressed={bolsaOn}
              onClick={() => onBolsaOn(!bolsaOn)}
            >
              <KindMark on={bolsaOn} />
              Bolsa Família
            </button>
            <button
              type="button"
              className="col-span-2 flex h-7 items-center gap-3 text-left text-sm"
              aria-pressed={gasOn}
              onClick={() => onGasOn(!gasOn)}
            >
              <KindMark on={gasOn} />
              Gás do Povo
            </button>
          </div>
        </div>
      ) : null}
      {adding ? (
        <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
          <p className="text-sm font-medium text-fg">Trabalhistas</p>
          <div className="cal-kind-pick is-fill">
            <HeaderMenu
              label="Mês de nascimento"
              value={laborMonth ?? 0}
              options={[
                { value: 0, label: "Mês de nascimento" },
                ...MONTHS.map((label, index) => ({ value: index + 1, label })),
              ]}
              open={pisMenu}
              wide
              fixed
              soft
              buttonClassName="cal-kind-btn"
              optionClassName="cal-kind-option"
              onOpen={() => setPisMenu(true)}
              onClose={() => setPisMenu(false)}
              onPick={(next) => {
                onLaborMonth(next === 0 ? null : next);
                setPisMenu(false);
              }}
            />
          </div>
          <div className="grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-center gap-x-2.5">
            <button
              type="button"
              className="col-span-2 flex h-7 items-center gap-3 text-left text-sm"
              aria-pressed={fgtsOn}
              onClick={() => onFgtsOn(!fgtsOn)}
            >
              <KindMark on={fgtsOn} />
              FGTS
            </button>
            <button
              type="button"
              className="col-span-2 flex h-7 items-center gap-3 text-left text-sm"
              aria-pressed={pisOn}
              onClick={() => onPisOn(!pisOn)}
            >
              <KindMark on={pisOn} />
              PIS/Pasep
            </button>
          </div>
        </div>
      ) : null}
      <PaymentsTab
        framed={false}
        adding={adding}
        year={year}
        month={month}
        selectedIso={selectedIso}
        today={today}
        openId={openBillId}
        payments={bills}
        onAdd={onAdd}
        onRemove={onRemoveBill}
        onUpdate={onUpdate}
        onOpen={onOpenBill}
      />
      <BoletosBlock
        adding={adding}
        year={year}
        month={month}
        today={today}
        selectedIso={selectedIso}
        openId={openBillId}
        boletos={boletos}
        onAdd={onAdd}
        onRemove={onRemoveBill}
        onUpdate={onUpdate}
        onOpen={onOpenBill}
      />
      {adding ? (
        <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
          <p className="text-sm font-medium text-fg">Veículos</p>
          <div className="flex items-center gap-2">
            <div className="cal-kind-pick is-uf">
              <HeaderMenu
                label="UF"
                value={ipvaUf}
                options={UF_OPTIONS}
                open={ipvaUfMenu}
                wide
                fixed
                soft
                buttonClassName="cal-kind-btn"
                optionClassName="cal-kind-option"
                onOpen={() => setIpvaUfMenu(true)}
                onClose={() => setIpvaUfMenu(false)}
                onPick={(next) => {
                  onIpvaUf(next);
                  setIpvaUfMenu(false);
                }}
              />
            </div>
            <input
              value={ipvaPlate}
              maxLength={8}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Placa do veículo"
              placeholder="placa"
              className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm uppercase text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
              onChange={(event) => onIpvaPlate(event.target.value)}
            />
          </div>
          <div className="grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-center gap-x-2.5">
            <button
              type="button"
              className="col-span-2 flex h-7 items-center gap-3 text-left text-sm"
              aria-pressed={ipvaOn}
              onClick={() => onIpvaOn(!ipvaOn)}
            >
              <KindMark on={ipvaOn} />
              IPVA
            </button>
            <button
              type="button"
              className="col-span-2 flex h-7 items-center gap-3 text-left text-sm"
              aria-pressed={licencaOn}
              onClick={() => onLicencaOn(!licencaOn)}
            >
              <KindMark on={licencaOn} />
              Licenciamento
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
