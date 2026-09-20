/** TSE discovery. Returns true/false when official results exist; null if the cycle is not out yet. */

type Abr = { cp?: { cd?: string; ds?: string }[] };
type Ele = { cd?: string; t?: string; nm?: string; abr?: Abr[] };
type Pleito = { dt?: string; e?: Ele[] };

function pad(code: string): string {
  return code.padStart(6, "0");
}

function hasPresident(el: Ele): boolean {
  const name = String(el.nm ?? "").toLowerCase();
  if (/presidente|federal/.test(name) && !/municipal/.test(name)) return true;
  return (el.abr ?? []).some((row) =>
    (row.cp ?? []).some((cargo) => cargo.cd === "1" || /presidente/i.test(cargo.ds ?? "")),
  );
}

function octoberOf(year: number, date: string): boolean {
  const parts = date.split("/");
  return parts.length === 3 && parts[1] === "10" && parts[2] === String(year);
}

function candWentSecond(json: unknown): boolean | null {
  const text = JSON.stringify(json).toLowerCase();
  const votes = text.match(/"v"\s*:\s*"?(\d+)/g);
  const total = votes
    ? votes.reduce((sum, row) => sum + Number(row.replace(/\D/g, "") || 0), 0)
    : 0;
  if (total < 1000) return null;
  if (/2[ºo°]\s*turno/.test(text) || /"st"\s*:\s*"2/.test(text)) return true;
  if (/"st"\s*:\s*"eleito"/.test(text) || /"e"\s*:\s*"s"/.test(text)) return false;
  return null;
}

export async function tsePresidentSecondRound(year: number): Promise<boolean | null> {
  try {
    const cfgRes = await fetch("https://resultados.tse.jus.br/oficial/comum/config/ele-c.json", {
      signal: AbortSignal.timeout(2500),
    });
    if (!cfgRes.ok) return null;
    const cfg: unknown = await cfgRes.json();
    if (!cfg || typeof cfg !== "object") return null;
    const cycle = "c" in cfg && typeof cfg.c === "string" ? cfg.c : `ele${year}`;
    const pls: Pleito[] = "pl" in cfg && Array.isArray(cfg.pl) ? (cfg.pl as Pleito[]) : [];
    let electionCd = "";
    for (const pl of pls) {
      if (!octoberOf(year, String(pl.dt ?? ""))) continue;
      for (const el of pl.e ?? []) {
        if (String(el.t) !== "1" || !hasPresident(el)) continue;
        electionCd = String(el.cd ?? "");
        break;
      }
      if (electionCd) break;
    }
    if (!electionCd) return null;
    const url = `https://resultados.tse.jus.br/oficial/${cycle}/${electionCd}/dados/br/br-c0001-e${pad(electionCd)}-u.json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    return candWentSecond(await res.json());
  } catch {
    return null;
  }
}
