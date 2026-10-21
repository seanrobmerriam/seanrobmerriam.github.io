import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export function mdxPreviewRuntime() {
  const id = "virtual:mdx-preview-runtime";
  const resolvedId = `\0${id}`;
  const entry = fileURLToPath(
    new URL("../src/scripts/mdx-preview-runtime.ts", import.meta.url),
  );

  return {
    name: "mdx-preview-runtime",
    resolveId(source) {
      if (source === id) return resolvedId;
    },
    async load(source) {
      if (source !== resolvedId) return;
      const result = await build({
        entryPoints: [entry],
        bundle: true,
        write: false,
        format: "iife",
        platform: "browser",
        target: "es2022",
        minify: true,
        define: { "process.env.NODE_ENV": '"production"' },
        metafile: true,
      });
      Object.keys(result.metafile.inputs)
        .filter((file) => !file.includes("node_modules/"))
        .forEach((file) => this.addWatchFile(resolve(file)));
      return `export default ${JSON.stringify(result.outputFiles[0].text)};`;
    },
  };
}
