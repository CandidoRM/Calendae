import { useEffect } from "react";

const SET = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 0, 0, 0];
const OUT = [0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

function Grade({ days, label, trail }: { days: number[]; label: string; trail?: boolean }) {
  return (
    <div className="cal-test-grade">
      <p className="cal-test-month">{label}</p>
      <div className="cal-test-cells">
        {days.map((day, index) => (
          <span
            key={index}
            className={day ? undefined : "is-out"}
            style={trail ? { animationDelay: `${index * 0.028 - 1.5}s` } : undefined}
          >
            {day || ""}
          </span>
        ))}
      </div>
    </div>
  );
}

const CONCEPTS = [
  {
    id: "lamina",
    name: "Lâmina",
    note: "A grade desliza para o lado e a do mês seguinte entra no lugar.",
    stage: "is-lamina",
  },
  {
    id: "folha",
    name: "Folha",
    note: "A página do caderno vira, presa na borda esquerda.",
    stage: "is-folha",
  },
  {
    id: "veu",
    name: "Véu",
    note: "Um mês dissolve enquanto o outro aparece por baixo.",
    stage: "is-veu",
  },
  {
    id: "gaveta",
    name: "Gaveta",
    note: "A grade sobe e a próxima entra por baixo, como uma gaveta.",
    stage: "is-gaveta",
  },
  {
    id: "iris",
    name: "Íris",
    note: "O mês novo abre a partir do centro da grade.",
    stage: "is-iris",
  },
  {
    id: "fileiras",
    name: "Fileiras",
    note: "As semanas saem uma depois da outra, de cima para baixo.",
    stage: "is-fileiras",
  },
  {
    id: "carta",
    name: "Carta",
    note: "A grade tomba para trás, como um cartão, e revela o outro mês.",
    stage: "is-carta",
  },
  {
    id: "rastro",
    name: "Rastro",
    note: "Os números apagam em sequência e os do mês seguinte acendem.",
    stage: "is-rastro",
  },
  {
    id: "persiana",
    name: "Persiana",
    note: "As semanas fecham na horizontal, uma após a outra, e o outro mês aparece.",
    stage: "is-persiana",
  },
  {
    id: "leque",
    name: "Leque",
    note: "Uma lâmina varre a grade da direita para a esquerda e revela outubro.",
    stage: "is-leque",
  },
  {
    id: "lupa",
    name: "Lupa",
    note: "A grade aproxima, some, e o mês seguinte volta ao tamanho.",
    stage: "is-lupa",
  },
  {
    id: "onda",
    name: "Onda",
    note: "As colunas descem em onda, da esquerda para a direita.",
    stage: "is-onda",
  },
  {
    id: "dobra",
    name: "Dobra",
    note: "A folha dobra ao meio, na vertical, e o outro mês fica por baixo.",
    stage: "is-dobra",
  },
  {
    id: "queda",
    name: "Queda",
    note: "A grade cai para fora e a do mês seguinte já está no lugar.",
    stage: "is-queda",
  },
  {
    id: "fresta",
    name: "Fresta",
    note: "O mês fecha numa fresta no centro e o seguinte ocupa a grade.",
    stage: "is-fresta",
  },
  {
    id: "sopro",
    name: "Sopro",
    note: "Os números perdem o foco, como um sopro, e o outro mês entra nítido.",
    stage: "is-sopro",
  },
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
      <style>{CSS}</style>
      <header className="mx-auto flex w-full max-w-[390px] shrink-0 flex-col gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <h1 className="font-display text-3xl italic leading-none">Tela de Testes</h1>
        <p className="text-sm leading-5 text-today-fg/80">
          Oito jeitos da grade trocar de mês, e mais oito. Já estão em movimento. Setembro vai e outubro entra.
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
        {CONCEPTS.map((concept) => (
          <article key={concept.id} className="bg-bg px-3 py-3 text-fg">
            <h2 className="font-display text-lg italic leading-none">{concept.name}</h2>
            <p className="mb-3 mt-1 text-xs leading-5 text-muted">{concept.note}</p>
            <div className={`cal-test-stage ${concept.stage}`}>
              <div className="cal-test-under">
                <Grade
                  days={concept.id === "iris" ? SET : OUT}
                  label={concept.id === "iris" ? "Setembro" : "Outubro"}
                />
              </div>
              <div className="cal-test-over">
                <Grade
                  days={concept.id === "iris" ? OUT : SET}
                  label={concept.id === "iris" ? "Outubro" : "Setembro"}
                  trail={concept.id === "rastro"}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

const CSS = `
.cal-test-stage {
  position: relative;
  height: 168px;
  overflow: hidden;
  border-radius: 2px;
  background: #f4f1e8;
  box-shadow: inset 0 0 0 1px rgba(36, 48, 40, 0.14);
  perspective: 700px;
}
.cal-test-under,
.cal-test-over {
  position: absolute;
  inset: 0;
}
.cal-test-grade {
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 8px 8px 6px;
}
.cal-test-month {
  margin: 0 0 4px;
  color: #0c2415;
  font-family: "Great Vibes", cursive;
  font-size: 22px;
  line-height: 1;
}
.cal-test-cells {
  display: grid;
  min-height: 0;
  flex: 1;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 1fr);
}
.cal-test-cells span {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0c2415;
  font-family: "Newsreader", serif;
  font-size: 11px;
  line-height: 1;
}
.cal-test-cells span.is-out {
  opacity: 0;
}
.is-lamina .cal-test-under,
.is-lamina .cal-test-over {
  width: 100%;
}
.is-lamina .cal-test-over {
  animation: cal-lamina 4.4s cubic-bezier(.4,0,.2,1) infinite;
  animation-delay: -1.1s;
}
@keyframes cal-lamina {
  0%, 16% { transform: translateX(0); }
  42%, 66% { transform: translateX(-100%); }
  92%, 100% { transform: translateX(0); }
}
.is-folha .cal-test-over {
  transform-origin: left center;
  backface-visibility: hidden;
  animation: cal-folha 4.6s ease-in-out infinite;
  animation-delay: -0.8s;
}
@keyframes cal-folha {
  0%, 14% { transform: rotateY(0deg); }
  42%, 64% { transform: rotateY(-102deg); }
  92%, 100% { transform: rotateY(0deg); }
}
.is-veu .cal-test-over {
  animation: cal-veu 4.2s ease-in-out infinite;
  animation-delay: -1.6s;
}
@keyframes cal-veu {
  0%, 18% { opacity: 1; }
  46%, 68% { opacity: 0; }
  100% { opacity: 1; }
}
.is-gaveta .cal-test-over {
  animation: cal-gaveta 4.4s cubic-bezier(.4,0,.2,1) infinite;
  animation-delay: -0.4s;
}
@keyframes cal-gaveta {
  0%, 16% { transform: translateY(0); }
  44%, 66% { transform: translateY(-100%); }
  94%, 100% { transform: translateY(0); }
}
.is-iris .cal-test-over {
  animation: cal-iris 4.5s ease-in-out infinite;
  animation-delay: -2s;
}
@keyframes cal-iris {
  0%, 12% { clip-path: circle(0% at 50% 46%); }
  46%, 66% { clip-path: circle(78% at 50% 46%); }
  100% { clip-path: circle(0% at 50% 46%); }
}
.is-fileiras .cal-test-over .cal-test-cells span {
  animation: cal-fileira 4.4s ease-in-out infinite;
  animation-delay: -1.3s;
}
.is-fileiras .cal-test-over .cal-test-cells span:nth-child(n + 8):nth-child(-n + 14) { animation-delay: -1.24s; }
.is-fileiras .cal-test-over .cal-test-cells span:nth-child(n + 15):nth-child(-n + 21) { animation-delay: -1.18s; }
.is-fileiras .cal-test-over .cal-test-cells span:nth-child(n + 22):nth-child(-n + 28) { animation-delay: -1.12s; }
.is-fileiras .cal-test-over .cal-test-cells span:nth-child(n + 29) { animation-delay: -1.06s; }
@keyframes cal-fileira {
  0%, 10% { transform: translateX(0); opacity: 1; }
  38% { transform: translateX(-14px); opacity: 0; }
  62% { opacity: 0; }
  88%, 100% { transform: translateX(0); opacity: 1; }
}
.is-carta .cal-test-over {
  transform-origin: center top;
  backface-visibility: hidden;
  animation: cal-carta 4.6s ease-in-out infinite;
  animation-delay: -1.4s;
}
@keyframes cal-carta {
  0%, 14% { transform: rotateX(0deg); }
  44%, 64% { transform: rotateX(-92deg); }
  94%, 100% { transform: rotateX(0deg); }
}
.is-rastro .cal-test-over .cal-test-cells span:not(.is-out) {
  animation: cal-rastro 4.8s ease-in-out infinite;
}
@keyframes cal-rastro {
  0%, 6% { opacity: 1; }
  34% { opacity: 0; }
  62% { opacity: 0; }
  90%, 100% { opacity: 1; }
}
.is-persiana .cal-test-over .cal-test-cells span {
  transform-origin: center;
  animation: cal-persiana 4.4s ease-in-out infinite;
  animation-delay: -1.1s;
}
.is-persiana .cal-test-over .cal-test-cells span:nth-child(n + 8):nth-child(-n + 14) { animation-delay: -1.02s; }
.is-persiana .cal-test-over .cal-test-cells span:nth-child(n + 15):nth-child(-n + 21) { animation-delay: -0.94s; }
.is-persiana .cal-test-over .cal-test-cells span:nth-child(n + 22):nth-child(-n + 28) { animation-delay: -0.86s; }
.is-persiana .cal-test-over .cal-test-cells span:nth-child(n + 29) { animation-delay: -0.78s; }
@keyframes cal-persiana {
  0%, 12% { transform: scaleY(1); opacity: 1; }
  40% { transform: scaleY(0.05); opacity: 0; }
  64% { transform: scaleY(0.05); opacity: 0; }
  92%, 100% { transform: scaleY(1); opacity: 1; }
}
.is-leque .cal-test-over {
  animation: cal-leque 4.4s ease-in-out infinite;
  animation-delay: -0.7s;
}
@keyframes cal-leque {
  0%, 14% { clip-path: inset(0 0 0 0); }
  46%, 66% { clip-path: inset(0 0 0 100%); }
  100% { clip-path: inset(0 0 0 0); }
}
.is-lupa .cal-test-over {
  animation: cal-lupa 4.4s ease-in-out infinite;
  animation-delay: -1.5s;
}
@keyframes cal-lupa {
  0%, 16% { transform: scale(1); opacity: 1; }
  42% { transform: scale(1.14); opacity: 0; }
  58% { transform: scale(0.9); opacity: 0; }
  86%, 100% { transform: scale(1); opacity: 1; }
}
.is-onda .cal-test-over .cal-test-cells span {
  animation: cal-onda 4.5s ease-in-out infinite;
}
.is-onda .cal-test-over .cal-test-cells span:nth-child(7n + 1) { animation-delay: -1.35s; }
.is-onda .cal-test-over .cal-test-cells span:nth-child(7n + 2) { animation-delay: -1.27s; }
.is-onda .cal-test-over .cal-test-cells span:nth-child(7n + 3) { animation-delay: -1.19s; }
.is-onda .cal-test-over .cal-test-cells span:nth-child(7n + 4) { animation-delay: -1.11s; }
.is-onda .cal-test-over .cal-test-cells span:nth-child(7n + 5) { animation-delay: -1.03s; }
.is-onda .cal-test-over .cal-test-cells span:nth-child(7n + 6) { animation-delay: -0.95s; }
.is-onda .cal-test-over .cal-test-cells span:nth-child(7n + 7) { animation-delay: -0.87s; }
@keyframes cal-onda {
  0%, 10% { transform: translateY(0); opacity: 1; }
  34% { transform: translateY(12px); opacity: 0; }
  60% { opacity: 0; }
  88%, 100% { transform: translateY(0); opacity: 1; }
}
.is-dobra .cal-test-over {
  transform-origin: center center;
  animation: cal-dobra 4.4s ease-in-out infinite;
  animation-delay: -0.9s;
}
@keyframes cal-dobra {
  0%, 16% { transform: scaleX(1); }
  44%, 66% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}
.is-queda .cal-test-over {
  animation: cal-queda 4.5s ease-in infinite;
  animation-delay: -1.2s;
}
@keyframes cal-queda {
  0%, 18% { transform: translateY(0) rotate(0deg); opacity: 1; }
  50% { transform: translateY(108%) rotate(7deg); opacity: 0; }
  62% { transform: translateY(-8%) rotate(-2deg); opacity: 0; }
  86%, 100% { transform: translateY(0) rotate(0deg); opacity: 1; }
}
.is-fresta .cal-test-over {
  animation: cal-fresta 4.4s ease-in-out infinite;
  animation-delay: -1.8s;
}
@keyframes cal-fresta {
  0%, 14% { clip-path: inset(0 0 0 0); }
  46%, 66% { clip-path: inset(0 50% 0 50%); }
  100% { clip-path: inset(0 0 0 0); }
}
.is-sopro .cal-test-over {
  animation: cal-sopro 4.4s ease-in-out infinite;
  animation-delay: -0.5s;
}
@keyframes cal-sopro {
  0%, 16% { filter: blur(0); opacity: 1; transform: translateX(0); }
  46% { filter: blur(7px); opacity: 0; transform: translateX(14px); }
  64% { filter: blur(6px); opacity: 0; transform: translateX(-6px); }
  100% { filter: blur(0); opacity: 1; transform: translateX(0); }
}
`;
