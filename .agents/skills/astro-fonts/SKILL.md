---
name: astro-fonts
description: Add and use custom web fonts in an Astro project with Astro's built-in Fonts API — configuring the `fonts` array in astro.config.mjs with a font provider (Google, Fontsource, Bunny, Fontshare, Adobe, Google Icons, NPM, or local font files), the <Font /> component from astro:assets, preloading, variable fonts, and fallback font optimization. Use this skill whenever adding a webfont/typeface to an Astro site, choosing between Google Fonts/Fontsource/self-hosted font files, or debugging font loading, preload, FOUT/layout-shift, or fallback font issues.
---

# Astro Fonts

Astro's built-in Fonts API (stable since Astro 6 — no experimental flag needed) provides a unified, type-safe way to add fonts from your filesystem or a provider like Google Fonts or Fontsource, with automatic performance optimizations: preload links, optimized fallback fonts, and sensible defaults. Fonts are downloaded and cached to be served from your own site rather than a third-party origin — better performance and no third-party data leakage.

## 1. Configure the font in `astro.config.mjs`

Every font needs a `name`, a `cssVariable`, and a `provider`.

### Using a provider (e.g. Fontsource, which wraps Google Fonts and other open-source fonts)

```js
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Roboto",
      cssVariable: "--font-roboto",
    },
  ],
});
```

Built-in providers, all exported from `astro/config` as `fontProviders`:

| Provider | Call |
|---|---|
| Google Fonts | `fontProviders.google()` |
| Fontsource | `fontProviders.fontsource()` |
| Bunny Fonts | `fontProviders.bunny()` |
| Fontshare | `fontProviders.fontshare()` |
| Google Icons | `fontProviders.googleicons()` |
| Adobe Fonts | `fontProviders.adobe({ id: "your-id" })` |
| NPM package | `fontProviders.npm()` |
| Local files | `fontProviders.local()` |

### Using a local font file

```js
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  fonts: [{
    provider: fontProviders.local(),
    name: "DistantGalaxy",
    cssVariable: "--font-distant-galaxy",
    options: {
      variants: [{
        src: ['./src/assets/fonts/DistantGalaxy.woff2'],
        weight: 'normal',
        style: 'normal',
      }],
    },
  }],
});
```

Store local font files somewhere under `src/` (e.g. `src/assets/fonts/`) — **not** in `public/`, since Astro copies them into the build output itself and putting them in `public/` duplicates the files.

## 2. Add the `<Font />` component to your page `<head>`

Usually placed once in a shared `Head.astro` or base layout:

```astro
---
// src/layouts/Layout.astro
import { Font } from "astro:assets";
---
<html>
  <head>
    <Font cssVariable="--font-distant-galaxy" />
  </head>
  <body><slot /></body>
</html>
```

`cssVariable` (required) must match a font registered in `astro.config.mjs`. Preload is opt-in via `preload`:

```astro
<Font cssVariable="--font-roboto" preload />

<!-- or preload only specific weight/style/subset combinations -->
<Font cssVariable="--font-roboto" preload={[{ subset: "latin", style: "normal" }, { weight: "400" }]} />
```

Be selective about `preload` — preloading too many fonts competes with other critical resources for bandwidth.

## 3. Use the font in CSS

Reference the `cssVariable` in any `font-family`:

```astro
<h1>In a galaxy far, far away...</h1>
<style>
  h1 {
    font-family: var(--font-distant-galaxy);
  }
</style>
```

## Controlling what gets downloaded

Trim unnecessary variants for performance — only download the weights/styles/subsets/formats actually used:

```js
{
  name: "Inter",
  cssVariable: "--font-inter",
  provider: fontProviders.fontsource(),
  weights: [400, 500, 600, 700],
  styles: ["normal"],
  subsets: ["latin", "cyrillic"],
  formats: ["woff2", "woff"],
}
```

Defaults when unspecified: `weights: [400]`, `styles: ["normal", "italic"]`, `subsets: ["latin"]`, `fallbacks: ["sans-serif"]`, `formats: ["woff2"]`.

### Granular configuration

Register the **same** `cssVariable`/`name`/`provider` more than once with different weight/style combinations if you need an unusual mix (e.g. normal in two weights but italic in only one) — Astro merges the results and downloads only what's needed:

```js
fonts: [
  { name: "Roboto", cssVariable: "--roboto", provider: fontProviders.google(), weights: [500, 600], styles: ["normal"] },
  { name: "Roboto", cssVariable: "--roboto", provider: fontProviders.google(), weights: [500], styles: ["italic"] },
]
```

## Variable fonts

For a variable font, specify a weight **range** instead of individual weights.

Local provider — set `weight` on the variant to the range string:

```js
options: {
  variants: [{ weight: "100 900", style: "normal", src: ["./src/assets/fonts/InterVariable.woff2"] }],
}
```

Other providers (e.g. Fontsource) — pass the range as a string inside `weights`:

```js
{ cssVariable: "--font-fira-code", name: "Fira Code", provider: fontProviders.fontsource(), styles: ["normal"], weights: ["300 700"] }
```

## Fallback fonts and layout shift

Astro automatically generates an *optimized* fallback (metric-matched to reduce layout shift) from the last entry in `fallbacks`, defaulting to `sans-serif` if unspecified:

```js
{ provider: fontProviders.fontsource(), name: "Cousine", cssVariable: "--font-cousine", fallbacks: ["monospace"] }
```

Set `font.optimizedFallbacks: false` in the font's config to opt out of this optimization and use the listed fallbacks as-is.

## Advanced: accessing font data programmatically

For cases like generating an OpenGraph image with Satori inside an API route, use the low-level `fontData` object and `experimental_getFontFileURL()` from `astro:assets` to fetch the actual font file bytes:

```ts
// src/pages/og.png.ts
import type { APIRoute } from "astro";
import { fontData, experimental_getFontFileURL } from "astro:assets";

export const GET: APIRoute = async (context) => {
  const fontPath = fontData["--font-roboto"][0]?.src[0]?.url;
  if (!fontPath) throw new Error("Cannot find the font path.");
  const url = experimental_getFontFileURL(fontPath, context.url); // context.url needed on on-demand routes
  const data = await fetch(url).then((res) => res.arrayBuffer());
  // ... pass `data` to satori, sharp, etc.
};
```

## Reference

- https://docs.astro.build/en/guides/fonts/
- https://docs.astro.build/en/reference/font-provider-reference/
- https://docs.astro.build/en/reference/modules/astro-assets/#font-
