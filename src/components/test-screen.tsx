import { useEffect, type ReactNode } from "react";

function ArrowChip({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-28 items-center justify-center bg-[#e9eadf]">
      <span className="flex size-10 items-center justify-center rounded-full bg-white text-[#222] shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_10px_rgba(0,0,0,0.14)]">
        {children}
      </span>
    </div>
  );
}

const CONCEPTS: {
  id: string;
  name: string;
  tag: "do app" | "ideia nova";
  note: string;
  Preview: () => ReactNode;
}[] = [
  {
    id: "clareira",
    name: "Clareira",
    tag: "do app",
    note: "O V atual, na cor dos números da grade (#0c2415).",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 14" width="18" height="11" fill="none">
          <path
            d="M4 3.5 12 11 20 3.5"
            stroke="#0c2415"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "caderno",
    name: "Caderno",
    tag: "do app",
    note: "Uma pauta de caderno com o V logo abaixo — vira a página.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path d="M5 7h14" stroke="#0c2415" strokeWidth="1.6" strokeLinecap="round" />
          <path
            d="M6.5 12.5 12 18 17.5 12.5"
            stroke="#0c2415"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "celula",
    name: "Célula",
    tag: "do app",
    note: "O anel do dia na grade, com o V no meio.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <circle cx="12" cy="12" r="8.6" stroke="#3f5c48" strokeWidth="1.5" />
          <path
            d="M8 10.2 12 14.6 16 10.2"
            stroke="#0c2415"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "folha",
    name: "Folha",
    tag: "do app",
    note: "Ponta de folha musgo, orgânica, apontando para baixo.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path
            d="M12 4.5c-3.6 4.2-5 7.4-5 10.2 0 3 2.2 5.3 5 5.3s5-2.3 5-5.3c0-2.8-1.4-6-5-10.2Z"
            stroke="#3f5c48"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M12 7.5v11" stroke="#3f5c48" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "navalha",
    name: "Navalha",
    tag: "ideia nova",
    note: "V seco, sem arredondar. Mais gráfico do que o chat.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 14" width="18" height="11" fill="none">
          <path d="M3.5 3 12 12.5 20.5 3" stroke="#1a1a1a" strokeWidth="1.7" strokeLinejoin="miter" />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "espiga",
    name: "Espiga",
    tag: "ideia nova",
    note: "Haste + V. Lembra um broto descendo.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path d="M12 3.5v11" stroke="#243028" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M6 11.5 12 19 18 11.5"
            stroke="#243028"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "arco",
    name: "Arco",
    tag: "ideia nova",
    note: "Uma curva só, fina. Mais joia do que seta.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 16" width="20" height="13" fill="none">
          <path
            d="M3.5 5q8.5 13 17 0"
            stroke="#243028"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "pleno",
    name: "Pleno",
    tag: "ideia nova",
    note: "Triângulo cheio. O mais direto dos oito.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 16" width="16" height="11">
          <path d="M3.8 3.2h16.4L12 14.6 3.8 3.2Z" fill="#243028" />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "duplo",
    name: "Duplo",
    tag: "ideia nova",
    note: "Dois V empilhados. O clássico “desce mais”.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path
            d="M5 5.5 12 12 19 5.5"
            stroke="#243028"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 12.5 12 19 19 12.5"
            stroke="#243028"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "gota",
    name: "Gota",
    tag: "ideia nova",
    note: "Uma lágrima apontando para baixo.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <path
            d="M12 3.5c0 0-6.5 8.2-6.5 12.2A6.5 6.5 0 0 0 12 22a6.5 6.5 0 0 0 6.5-6.3C18.5 11.7 12 3.5 12 3.5Z"
            fill="#243028"
          />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "talho",
    name: "Talho",
    tag: "ideia nova",
    note: "Dois cortes que não se tocam. Aberto no meio.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 16" width="18" height="12" fill="none">
          <path d="M4 3.5 11 13" stroke="#243028" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M13 13 20 3.5" stroke="#243028" strokeWidth="2.1" strokeLinecap="round" />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "pena",
    name: "Pena",
    tag: "do app",
    note: "Traço caligráfico, no espírito do Setembro em Great Vibes.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path
            d="M5 7c5 1 7 4 7 10 0-6 2-9 7-10"
            stroke="#0c2415"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M9.5 14.5c1.6 2.4 2.5 4 2.5 5.5 0-1.5.9-3.1 2.5-5.5"
            stroke="#0c2415"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "selo",
    name: "Selo",
    tag: "do app",
    note: "Disco musgo com o V recortado em linho.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 24" width="20" height="20">
          <circle cx="12" cy="12" r="9" fill="#3f5c48" />
          <path
            d="M7.5 9.5 12 14.8 16.5 9.5"
            fill="none"
            stroke="#f4f5ee"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "lua",
    name: "Lua",
    tag: "ideia nova",
    note: "Um crescente virado para baixo.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 16" width="20" height="13" fill="none">
          <path
            d="M4 5.5c4.2 8 11.8 8 16 0"
            stroke="#243028"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <path
            d="M6.5 8c3.2 5.2 7.8 5.2 11 0"
            stroke="#243028"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "degrau",
    name: "Degrau",
    tag: "ideia nova",
    note: "Escadinha descendo. Menos seta, mais caminho.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path
            d="M5 6h5v5h5v5h5"
            stroke="#243028"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      </ArrowChip>
    ),
  },
  {
    id: "linho",
    name: "Linho",
    tag: "do app",
    note: "V bordado, bem fino, na cor da grade.",
    Preview: () => (
      <ArrowChip>
        <svg viewBox="0 0 24 14" width="18" height="11" fill="none">
          <path
            d="M4 3.2 12 11.2 20 3.2"
            stroke="#0c2415"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.2 3.2 12 9.2 17.8 3.2"
            stroke="#0c2415"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ArrowChip>
    ),
  },
];

function ConceptCard({
  name,
  tag,
  note,
  Preview,
}: {
  name: string;
  tag: "do app" | "ideia nova";
  note: string;
  Preview: () => ReactNode;
}) {
  return (
    <article className="bg-bg px-3 py-3 text-fg">
      <header className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg italic leading-none">{name}</h2>
        <span className="text-[11px] uppercase tracking-[0.12em] text-muted">{tag}</span>
      </header>
      <p className="mb-3 text-xs leading-5 text-muted">{note}</p>
      <Preview />
    </article>
  );
}

export function TestScreen({ onContinue }: { onContinue: () => void }) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevHtmlH = html.style.height;
    const prevBodyH = body.style.height;
    html.style.overflow = "auto";
    body.style.overflow = "auto";
    html.style.height = "auto";
    body.style.height = "auto";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      html.style.height = prevHtmlH;
      body.style.height = prevBodyH;
    };
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-today text-today-fg">
      <header className="mx-auto flex w-full max-w-[390px] shrink-0 flex-col gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <h1 className="font-display text-3xl italic leading-none">Tela de Testes</h1>
        <p className="text-sm leading-5 text-today-fg/80">
          Dezesseis setas para o botãozinho. Todas no mesmo círculo branco.
        </p>
        <button
          type="button"
          className="h-11 self-start border border-today-fg/40 px-4 text-sm text-today-fg"
          onClick={onContinue}
        >
          Ir ao Calendae
        </button>
      </header>
      <div className="mx-auto flex w-full max-w-[390px] flex-col gap-3 px-4 pb-[max(1.2rem,env(safe-area-inset-bottom))]">
        {CONCEPTS.map((item) => (
          <ConceptCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
