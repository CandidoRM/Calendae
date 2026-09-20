import { useState } from "react";
import { A11yHint } from "@/components/a11y-hint";
import { BenefitsTab } from "@/components/benefits-tab";
import { CalendarGlyph, useGlyphFlash } from "@/components/calendar-glyph";
import { PaymentsTab } from "@/components/payments-tab";
import { Button } from "@/components/ui/button";
import type { CalEvent } from "@/lib/calendar";
import { withTip } from "@/lib/utils";

type FinancesTabProps = {
  year: number;
  month: number;
  today: string;
  selectedIso: string;
  openBenefitId: string | null;
  openBillId: string | null;
  benefits: CalEvent[];
  bills: CalEvent[];
  onAdd: (event: CalEvent) => void;
  onRemoveBenefit: (id: string) => void;
  onRemoveBill: (id: string) => void;
  onUpdate: (event: CalEvent) => void;
  onOpenBenefit: (event: CalEvent, iso: string) => void;
  onOpenBill: (event: CalEvent, iso: string) => void;
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
  onAdd,
  onRemoveBenefit,
  onRemoveBill,
  onUpdate,
  onOpenBenefit,
  onOpenBill,
}: FinancesTabProps) {
  const [glyphFlash, pingGlyph] = useGlyphFlash();
  const [adding, setAdding] = useState(false);

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
    </section>
  );
}
