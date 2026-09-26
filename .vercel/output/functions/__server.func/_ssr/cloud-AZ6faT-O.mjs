import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-Cs7rQ4cc.mjs";
import { r as getSql } from "./db-BoLgordd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cloud-AZ6faT-O.js
var pullCloud_createServerFn_handler = createServerRpc({
	id: "25aaec7a8758ff2c521809c10883d1ba3444f231989a22a16b87e883feea033a",
	name: "pullCloud",
	filename: "src/lib/cloud.ts"
}, (opts) => pullCloud.__executeServer(opts));
var pullCloud = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(pullCloud_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select payload from calendae_cloud where user_id = ${context.userId} limit 1
    `)[0]?.payload ?? null;
});
var pushCloud_createServerFn_handler = createServerRpc({
	id: "17349792903b7ccffc13cfe05aadeb8554d97bb2abeb9e31730b485a9a2bce57",
	name: "pushCloud",
	filename: "src/lib/cloud.ts"
}, (opts) => pushCloud.__executeServer(opts));
var pushCloud = createServerFn({ method: "POST" }).validator((data) => data).middleware([authMiddleware]).handler(pushCloud_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const payload = JSON.stringify(data);
	await sql`
      insert into calendae_cloud (user_id, payload, updated_at)
      values (${context.userId}, ${payload}::jsonb, now())
      on conflict (user_id) do update set payload = excluded.payload, updated_at = now()
    `;
	return { ok: true };
});
//#endregion
export { pullCloud_createServerFn_handler, pushCloud_createServerFn_handler };
