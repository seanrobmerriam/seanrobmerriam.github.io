---
name: astro-server-side-rendering
description: Enable and use on-demand (server-side) rendering in Astro — adding a server adapter, the prerender export and output ('static' vs 'server') config to control which routes render at build time vs per-request, and the request-time features that unlocks (cookies, headers, Response control, HTML streaming, reading the Request). Use this skill whenever a page needs per-visitor/per-request content (auth, personalization, form handling, live data), when choosing between static generation and SSR for a route, or when debugging cookies/headers/redirects that only work in on-demand mode.
---

# Astro Server-Side Rendering (On-Demand Rendering)

Astro calls this **on-demand rendering** — pages/endpoints rendered per-request by a server, as opposed to **prerendering**, where HTML is generated once at build time. Astro's default (`output: 'static'`) prerenders everything; on-demand rendering is opt-in, per route or project-wide.

## 1. Add an adapter

An adapter is required for *any* on-demand rendering, even just a single route (and also for server islands and some adapter-provided features like Netlify's Image CDN):

```bash
npx astro add netlify   # or vercel, cloudflare, node
```

This installs the package and wires it into `astro.config.mjs` automatically. Official adapters: `@astrojs/node`, `@astrojs/netlify`, `@astrojs/vercel`, `@astrojs/cloudflare` — plus community adapters for other hosts.

## 2. Opt routes into on-demand rendering

### Per-route (recommended default)

Leave the project in default `'static'` output and opt out individual routes with `export const prerender = false`:

```astro
---
// src/pages/dashboard.astro
export const prerender = false;
---
<html>
  <!-- Server-rendered on demand; the rest of the site stays static -->
</html>
```

```js
// src/pages/randomnumber.js
export const prerender = false;

export async function GET() {
  return new Response(JSON.stringify({ number: Math.random() }));
}
```

### Project-wide (`output: 'server'`)

For apps where *most* routes are dynamic, flip the default and prerender only the exceptions:

```js
// astro.config.mjs
export default defineConfig({
  output: 'server',
  adapter: nodeAdapter(),
});
```

```astro
---
// src/pages/privacy-policy.astro
export const prerender = true; // static even though output: 'server'
---
```

`output: 'server'` doesn't add capability beyond per-route `prerender = false` — it only flips which behavior is the default. **Start in `'static'` mode and opt out route-by-route** unless you're confident most of the site needs to be dynamic; this keeps the maximum amount of the site cacheable and fast by default.

`prerender` only accepts the literal `true`/`false` — it can't be set dynamically from an environment variable at the route level (use an integration hook like `astro:route:setup` if you need conditional logic).

## What on-demand rendering unlocks

These are **only** available on routes that are not prerendered:

### Cookies

```astro
---
export const prerender = false;
let counter = 0;
if (Astro.cookies.has('counter')) {
  const value = Astro.cookies.get('counter')?.number();
  if (value !== undefined && !isNaN(value)) counter = value + 1;
}
Astro.cookies.set('counter', String(counter));
---
<html><h1>Counter = {counter}</h1></html>
```

### Full `Request`

```astro
---
export const prerender = false;
const cookie = Astro.request.headers.get('cookie');
const method = Astro.request.method;
---
```

In prerendered mode, only `request.url` is available.

### Controlling the `Response`

```astro
---
export const prerender = false;
import { getProduct } from '../api';
const product = await getProduct(Astro.params.id);

if (!product) {
  Astro.response.status = 404;
  Astro.response.statusText = 'Not found';
}
---
```

Set headers directly: `Astro.response.headers.set('Cache-Control', 'public, max-age=3600')`.

You can also return a `Response` (or use `Astro.redirect()`) directly from a page component:

```astro
---
export const prerender = false;
const product = await getProduct(Astro.params.id);
if (!product) return new Response(null, { status: 404, statusText: 'Not found' });
if (!product.isAvailable) return Astro.redirect("/products", 301);
---
```

**Caution:** anything that modifies response headers only works at the **page level**, not inside child components (including layouts) — by the time a component's code runs, headers have often already been sent.

### HTML streaming

On-demand rendering streams HTML to the browser in chunks as components render, rather than waiting for the entire document — visitors see content sooner, though slow data fetches can still block rendering of the parts that depend on them. (This is distinct from server islands, which isolate a slow fetch so it *doesn't* block the rest of the page — see the astro-server-islands skill.)

### Server endpoints (API routes)

A `.js`/`.ts` file in `src/pages/` with on-demand rendering enabled becomes a live API route, fully covered in the astro-api-endpoints skill.

## Relationship to server islands

Server islands (`server:defer`) let you keep a page prerendered/static overall while deferring just *one component* to render on demand — they still require an adapter, but don't require flipping the whole route (or project) to `output: 'server'`. If only a small piece of a page needs per-request data, prefer a server island over making the entire page on-demand. See the astro-server-islands skill.

## Choosing static vs. on-demand for a route — quick checklist

- Content is the same for every visitor and doesn't need to react to cookies/headers/query params → **prerender** (default).
- Content depends on the logged-in user, request headers, or must always be fresh → **on-demand** (`prerender = false`).
- Only a small piece of an otherwise-static page needs per-request data → **server island**, not a fully on-demand page.
- Need an API route/webhook handler → **on-demand endpoint** (see astro-api-endpoints skill).

## Reference

- https://docs.astro.build/en/guides/on-demand-rendering/
- https://docs.astro.build/en/reference/configuration-reference/#output
