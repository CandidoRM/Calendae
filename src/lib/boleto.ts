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
  let text = raw.replace(/[^\d.,]/g, "");
  const comma = text.lastIndexOf(",");
  if (comma >= 0) {
    const reais = text.slice(0, comma).replace(/[^\d.]/g, "");
    const cents = text.slice(comma + 1).replace(/\D/g, "").slice(0, 2);
    return `${reais},${cents}`;
  }
  return text.replace(/[^\d.]/g, "");
}

const ONES = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
const TEENS = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
const TENS = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
const HUNDREDS = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

function below100(n: number): string {
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  const ten = Math.floor(n / 10);
  const one = n % 10;
  return one ? `${TENS[ten]} e ${ONES[one]}` : TENS[ten];
}

function below1000(n: number): string {
  if (n === 100) return "cem";
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  if (!hundred) return below100(rest);
  if (!rest) return HUNDREDS[hundred];
  return `${HUNDREDS[hundred]} e ${below100(rest)}`;
}

function integerWords(n: number): string {
  if (n === 0) return "zero";
  const classes: { text: string; n: number; big: boolean }[] = [];
  const scales: [number, string, string][] = [
    [1_000_000_000, "bilhão", "bilhões"],
    [1_000_000, "milhão", "milhões"],
    [1_000, "mil", "mil"],
  ];
  let left = n;
  for (const [div, one, many] of scales) {
    const count = Math.floor(left / div);
    if (!count) continue;
    left %= div;
    const text =
      div === 1_000
        ? count === 1
          ? "mil"
          : `${below1000(count)} mil`
        : count === 1
          ? `um ${one}`
          : `${below1000(count)} ${many}`;
    classes.push({ text, n: count, big: div >= 1_000_000 });
  }
  if (left) classes.push({ text: below1000(left), n: left, big: false });
  return classes
    .map((part, index) => {
      if (index === 0) return part.text;
      const last = index === classes.length - 1;
      const round = part.n < 100 || part.n % 100 === 0;
      if (last && round) return ` e ${part.text}`;
      if (classes[index - 1]?.big) return `, ${part.text}`;
      return ` ${part.text}`;
    })
    .join("");
}

function parseReais(raw: string): { reais: number; cents: number } | null {
  const text = raw.trim();
  if (!text || !/^[\d.,]+$/.test(text)) return null;
  const comma = text.lastIndexOf(",");
  const reaisText = (comma >= 0 ? text.slice(0, comma) : text).replace(/\./g, "").replace(/\D/g, "");
  const centsText = comma >= 0 ? text.slice(comma + 1).replace(/\D/g, "").padEnd(2, "0").slice(0, 2) : "00";
  if (!reaisText && !centsText) return null;
  const reais = Number(reaisText || "0");
  const cents = Number(centsText || "0");
  if (!Number.isFinite(reais) || !Number.isFinite(cents) || reais < 0 || cents < 0 || reais > 999_999_999_999) return null;
  return { reais, cents };
}

/** "100,05" → "cem reais e cinco centavos". */
export function amountInWords(raw: string): string {
  const parsed = parseReais(raw);
  if (!parsed) return raw;
  const { reais, cents } = parsed;
  const reaisText =
    reais === 0
      ? ""
      : `${integerWords(reais)}${reais % 1_000_000 === 0 && reais >= 1_000_000 ? " de" : ""} ${reais === 1 ? "real" : "reais"}`;
  const centsText = cents === 0 ? "" : `${integerWords(cents)} ${cents === 1 ? "centavo" : "centavos"}`;
  if (reaisText && centsText) return `${reaisText} e ${centsText}`;
  return reaisText || centsText || "zero reais";
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
