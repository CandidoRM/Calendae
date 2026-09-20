import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="cal-app mx-auto grid min-h-dvh max-w-[390px] place-items-center bg-bg p-6 text-fg">
      <div className="w-full space-y-4 rounded-panel bg-surface p-5 shadow-panel">
        <h1 className="font-display text-3xl italic text-fg">Calendae</h1>
        <p className="text-sm text-muted">Entre para levar a agenda neste aparelho e no outro.</p>
        {authEnabled ? (
          GROK_PROVIDERS.map((p) => (
            <button
              key={p.providerId}
              type="button"
              onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              className="h-11 w-full rounded-xl text-sm text-fg shadow-[0_0_0_1px_var(--c-line)]"
            >
              Continuar com {p.label}
            </button>
          ))
        ) : (
          <p className="text-sm text-muted">Login ainda não está ligado.</p>
        )}
      </div>
    </main>
  );
}
