import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/backup")({
  server: {
    handlers: {
      GET: async () => {
        const { spawn } = await import("node:child_process");
        const { readFile } = await import("node:fs/promises");
        await new Promise<void>((resolve, reject) => {
          const child = spawn(
            "python3",
            ["scripts/make-calendae-backup.py", "/tmp/calendae-backup.zip"],
            { cwd: "/workspace" },
          );
          let err = "";
          const timer = setTimeout(() => {
            child.kill("SIGKILL");
            reject(new Error("backup timeout"));
          }, 25000);
          child.stderr.on("data", (chunk) => {
            err += String(chunk);
          });
          child.on("error", (error) => {
            clearTimeout(timer);
            reject(error);
          });
          child.on("close", (code) => {
            clearTimeout(timer);
            if (code === 0) resolve();
            else reject(new Error(err || `backup exit ${code}`));
          });
        });
        const buf = await readFile("/tmp/calendae-backup.zip");
        return new Response(new Uint8Array(buf), {
          headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": 'attachment; filename="calendae-backup.zip"',
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
