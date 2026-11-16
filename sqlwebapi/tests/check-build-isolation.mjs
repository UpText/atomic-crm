import { build, loadConfigFromFile } from "vite";
import { readdir, readFile, mkdtemp, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { tmpdir } from "node:os";
const root = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /\/$/,
  "",
);
const outputRoot = await mkdtemp(join(tmpdir(), "uptext-entra-isolation-"));
const markers = ["up.entra.transaction", "Entra invitations"];
try {
  for (const [name, path, expected] of [
    ["supabase", "vite.config.ts", false],
    ["demo", "vite.demo.config.ts", false],
    ["sqlwebapi", "vite.sqlwebapi.config.ts", true],
  ]) {
    const { config } = await loadConfigFromFile(
      { command: "build", mode: "production" },
      `${root}/${path}`,
      root,
    );
    const outDir = join(outputRoot, name);
    await build({
      ...config,
      configFile: false,
      root,
      plugins: config.plugins.filter((p) => p?.name !== "visualizer"),
      build: { ...config.build, outDir, emptyOutDir: true },
      logLevel: "warn",
    });
    let javascript = "";
    for (const file of await readdir(`${outDir}/assets`))
      if (file.endsWith(".js"))
        javascript += await readFile(`${outDir}/assets/${file}`, "utf8");
    for (const marker of markers)
      if (javascript.includes(marker) !== expected)
        throw new Error(`${name}: unexpected Entra availability for ${marker}`);
    console.log(
      `PASS: ${name} bundle ${expected ? "includes" : "excludes"} Entra login and invitation code.`,
    );
  }
} finally {
  await rm(outputRoot, { recursive: true, force: true });
}
