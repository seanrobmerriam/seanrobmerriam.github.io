// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE_URL } from "./src/consts.ts";
import { isNoindexRoute } from "./src/utils/seo.ts";
import { mdxPreviewRuntime } from "./build/mdx-preview-runtime.mjs";
import markdoc from "@astrojs/markdoc";

export default defineConfig({
  server: { 
    allowedHosts: "coder.recover.works"
  },
  site: SITE_URL,
  integrations: [
    markdoc(),
    sitemap({
      filter: (page) => !isNoindexRoute(new URL(page).pathname),
    }),
  ],

  fonts: [
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/inter-regular.woff2"],
          },
        ],
      },
    },
  ],
  vite: {
    plugins: [mdxPreviewRuntime()],
    build: { cssTarget: "safari15.4" },
  },
});
