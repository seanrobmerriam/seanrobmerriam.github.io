import { compile } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import type { Program } from "estree";
import runtimeSource from "virtual:mdx-preview-runtime";

function resolveImports() {
  return (tree: Program) => {
    const visit = (node: unknown): void => {
      if (!node || typeof node !== "object") return;
      const value = node as Record<string, unknown>;
      if (value.type === "ImportExpression") {
        const source = value.source as Record<string, unknown>;
        value.type = "CallExpression";
        value.callee = { type: "Identifier", name: "__mdxImport" };
        value.arguments = [
          source.type === "CallExpression" &&
          (source.callee as Record<string, unknown>)?.name ===
            "_resolveDynamicMdxSpecifier"
            ? (source.arguments as unknown[])[0]
            : source,
        ];
        value.optional = false;
        delete value.source;
        delete value.options;
      }
      Object.values(value).forEach((child) => {
        if (Array.isArray(child)) child.forEach(visit);
        else visit(child);
      });
    };
    visit(tree);
  };
}

export async function compilePreview(source: string): Promise<string> {
  return String(
    await compile(source, {
      outputFormat: "function-body",
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: "frontmatter", default: {} }],
      ],
      recmaPlugins: [resolveImports],
    }),
  );
}

export function previewDocument(styles: string): string {
  return `<!doctype html><html><head><meta charset="utf-8">
    <meta name="referrer" content="no-referrer">
    ${styles}
    <style>html,body{margin:0;padding:0;background:var(--background);color:var(--text)}body{overflow-wrap:anywhere}#preview{display:flow-root;min-width:0;margin:0}pre{overflow-x:auto}img,video,svg{max-width:100%;height:auto}</style>
    </head><body><div class="text rich-text" id="preview"></div>
    <script>${runtimeSource.replace(/<\/script/gi, "<\\/script")}</script></body></html>`;
}
