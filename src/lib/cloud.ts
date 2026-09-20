import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { CalendaeSave } from "@/lib/guardar";

export const pullCloud = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<CalendaeSave | null> => {
    const sql = await getSql();
    const rows = await sql<{ payload: CalendaeSave }>`
      select payload from calendae_cloud where user_id = ${context.userId} limit 1
    `;
    return rows[0]?.payload ?? null;
  });

export const pushCloud = createServerFn({ method: "POST" })
  .validator((data: CalendaeSave) => data)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const payload = JSON.stringify(data);
    await sql`
      insert into calendae_cloud (user_id, payload, updated_at)
      values (${context.userId}, ${payload}::jsonb, now())
      on conflict (user_id) do update set payload = excluded.payload, updated_at = now()
    `;
    return { ok: true as const };
  });
