import { civilDate, toIso } from "@/lib/calendar";

const BANKS: Record<string, string> = {
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
  "756": "Sicoob",
};

const SEGMENTS: Record<string, string> = {
  "1": "Prefeitura",
  "2": "Saneamento",
  "3": "Energia elétrica e gás",
  "4": "Telecomunicações",
  "5": "Órgãos governamentais",
  "6": "Carnes e assemelhados",
  "7": "Multas de trânsito",
  "9": "Uso exclusivo do banco",
};

export type BoletoParse = {
  iso?: string;
  amount?: string;
  bank?: string;
  kind: "banco" | "arrecadacao" | null;
};

/** Only digits. Linha digitável 47/48 or barcode 44. */
export function sanitizeBarcode(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 48);
}

export function sanitizeAmount(raw: string): string {
  let text = raw.replace(/[^\d,]/g, "");
  const comma = text.indexOf(",");
  if (comma >= 0) {
    text = `${text.slice(0, comma).replace(/,/g, "")},${text.slice(comma + 1).replace(/\D/g, "").slice(0, 2)}`;
  }
  const [reais = "", cents] = text.split(",");
  return cents !== undefined ? `${reais.slice(0, 11)},${cents}` : reais.slice(0, 11);
}

export function sanitizeBank(raw: string): string {
  return raw.replace(/[^A-Za-zÀ-ÿ .'-]/g, "").slice(0, 40);
}

function bankName(code: string): string {
  return BANKS[code] ?? `Banco ${code}`;
}

function centsAmount(raw: string): string | undefined {
  if (!raw || !/^\d+$/.test(raw)) return undefined;
  const cents = Number(raw);
  if (!Number.isFinite(cents) || cents <= 0) return undefined;
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** FEBRABAN: 22/02/2025 = fator 1000. 0000 = sem vencimento no código. */
function fatorIso(fator: number): string | undefined {
  if (!Number.isFinite(fator) || fator < 1000) return undefined;
  const date = civilDate(2025, 1, 22);
  date.setDate(date.getDate() + (fator - 1000));
  return toIso(date);
}

function fromBarras44(bar: string): BoletoParse {
  if (bar[0] === "8") {
    const segment = SEGMENTS[bar[1]] ?? "Concessionária";
    const amount = centsAmount(bar.slice(4, 15));
    return { amount, bank: segment, kind: "arrecadacao" };
  }
  const bank = bankName(bar.slice(0, 3));
  const iso = fatorIso(Number(bar.slice(5, 9)));
  const amount = centsAmount(bar.slice(9, 19));
  return { iso, amount, bank, kind: "banco" };
}

function linha47to44(linha: string): string {
  return (
    linha.slice(0, 4) +
    linha.slice(32, 33) +
    linha.slice(33, 47) +
    linha.slice(4, 9) +
    linha.slice(10, 20) +
    linha.slice(21, 31)
  );
}

function linha48to44(linha: string): string {
  return [0, 1, 2, 3].map((i) => linha.slice(i * 12, i * 12 + 11)).join("");
}

export function parseBoleto(raw: string): BoletoParse {
  const digits = sanitizeBarcode(raw);
  if (digits.length === 47 && digits[0] !== "8") return fromBarras44(linha47to44(digits));
  if (digits.length === 48 || (digits.length === 44 && digits[0] === "8")) {
    const bar = digits.length === 48 ? linha48to44(digits) : digits;
    return fromBarras44(bar);
  }
  if (digits.length === 44) return fromBarras44(digits);
  if (digits.length >= 3 && digits[0] !== "8") {
    return { bank: bankName(digits.slice(0, 3)), kind: "banco" };
  }
  return { kind: null };
}

export function boletoHasData(code: string, amount: string, bank: string, iso: string, selected: string): boolean {
  const digits = sanitizeBarcode(code);
  if (digits.length >= 44) return true;
  if (amount.trim()) return true;
  if (bank.trim() && digits.length === 0) return true;
  return Boolean(iso && iso !== selected && (amount.trim() || bank.trim()));
}
