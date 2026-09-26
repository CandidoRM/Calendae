import { useEffect } from "react";

const PAPERS = [
  { id: "seda", name: "Seda", note: "Novo. Creme-oliva, grão quase liso." },
  { id: "nuvem", name: "Nuvem", note: "Novo. Nuvens grandes, o centro bem claro." },
  { id: "polen", name: "Pólen", note: "Novo. Amarelo-verde claro, grão em pó." },
  { id: "linho", name: "Linho", note: "Novo. Fibra tecida, sálvia pálido." },
  { id: "seiva", name: "Seiva", note: "Novo. Verde frio, em lavagens suaves." },
  { id: "manha", name: "Manhã", note: "Novo. Quase branco, um fio de lima no grão." },
  { id: "pincel", name: "Pincel", note: "Novo. Riscos verticais bem leves." },
  { id: "farelo", name: "Farelo", note: "Novo. Pontos miúdos, como papel artesanal." },
  { id: "nevoa", name: "Névoa", note: "Oliva bem claro, com nuvens suaves." },
  { id: "polpa", name: "Polpa", note: "Fibra fina. É o fundo do app agora." },
  { id: "veu", name: "Véu", note: "Aquarela clara, o grão em manchas." },
  { id: "algodao", name: "Algodão", note: "Papel quente, grão miúdo e contínuo." },
  { id: "bruma", name: "Bruma", note: "Quase branco, fibra fria e leve." },
  { id: "clareira", name: "Clareira", note: "Musgo claro dissolvido no creme." },
  { id: "clara", name: "Clara", note: "Lima bem pálida, grão quieto." },
  { id: "grao", name: "Grão", note: "O verde da foto, só mais claro." },
] as const;

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
          Oito papéis novos no topo. Os anteriores ficam abaixo.
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
        {PAPERS.map((paper) => (
          <article key={paper.id} className="bg-bg px-3 py-3 text-fg">
            <header className="mb-2 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-lg italic leading-none">{paper.name}</h2>
              <span className="text-[11px] uppercase tracking-[0.12em] text-muted">fundo</span>
            </header>
            <p className="mb-3 text-xs leading-5 text-muted">{paper.note}</p>
            <div
              className="h-52"
              style={{
                backgroundImage: `url("/test/${paper.id}.jpg")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
