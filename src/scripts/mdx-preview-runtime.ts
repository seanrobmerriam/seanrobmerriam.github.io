import * as React from "react";
import * as runtime from "react/jsx-runtime";
import * as client from "react-dom/client";

const modules: Record<string, unknown> = {
  react: React,
  "react/jsx-runtime": runtime,
  "react-dom/client": client,
};

const importModule = async (name: string) => {
  if (!Object.hasOwn(modules, name)) {
    throw new Error(
      `Import "${name}" is unavailable. Locally bundled modules: ${Object.keys(modules).join(", ")}.`,
    );
  }
  return modules[name];
};

const send = (data: Record<string, unknown>) =>
  parent.postMessage({ type: "mdx-preview", ...data }, "*");

const preview = document.getElementById("preview")!;
const root = client.createRoot(preview, {
  onUncaughtError: (error) =>
    send({ error: error instanceof Error ? error.message : String(error) }),
});
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
let revision = 0;

addEventListener("message", async (event: MessageEvent) => {
  if (event.source !== parent || event.data?.type !== "render-mdx") return;
  const current = ++revision;
  try {
    const module = await new AsyncFunction(
      "runtime",
      "__mdxImport",
      event.data.code,
    )({ ...runtime, baseUrl: "about:srcdoc" }, importModule);
    if (current !== revision) return;
    root.render(React.createElement(module.default));
    send({ rendered: true });
  } catch (error) {
    if (current === revision)
      send({ error: error instanceof Error ? error.message : String(error) });
  }
});

new ResizeObserver(() =>
  send({
    height:
      Math.ceil(
        Math.max(preview.scrollHeight, preview.getBoundingClientRect().height),
      ) + 1,
  }),
).observe(preview);
send({ ready: true });
