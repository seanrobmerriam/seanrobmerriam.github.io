---
name: astro-api-endpoints
description: Build API routes and custom non-HTML endpoints in Astro by exporting GET/POST/PUT/DELETE/ALL functions from .js/.ts files in src/pages/ — the APIRoute type, static vs on-demand (SSR) endpoints, dynamic route params, reading the Request, returning a Response, redirects, and generating binary output like images or RSS/sitemap files. Use this skill whenever building a backend API route, a webhook handler, a JSON/XML/binary file endpoint, a form submission handler, or anything under src/pages/api/ or a file like src/pages/*.json.ts.
---

# Astro API Endpoints

Astro lets you create custom endpoints — API routes — by exporting HTTP-method-named functions from a `.js` or `.ts` file inside `src/pages/`. The `.js`/`.ts` extension is stripped from the URL, so the file's remaining extension (if any) becomes part of the route: `src/pages/data.json.ts` → `/data.json`.

## Basic shape

```ts
// src/pages/api/hello.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({ greeting: "Hello" }),
    { headers: { "Content-Type": "application/json" } },
  );
};
```

Every handler receives a **context object** with properties similar to the `Astro` global (`params`, `request`, `cookies`, `redirect`, `locals`, etc.) and must return a standard [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response). Type handlers with `APIRoute` + `satisfies` for full param/return-type checking:

```ts
export const GET = (async ({ params, request }) => {
  // ...
}) satisfies APIRoute;
```

Since Astro v3, endpoints must return a real `Response` object — returning a plain object (`{ body: {...} }`) is no longer supported.

## Static vs. on-demand endpoints

Everything above works in both modes, but the timing and available features differ:

- **Static (prerendered, default)** — the function runs **once at build time**; its output is written to a static file. Only `request.url` is available on `request` in this mode.
- **On-demand (SSR)** — with [an adapter installed](https://docs.astro.build/en/guides/on-demand-rendering/) and either `output: 'server'` or `export const prerender = false` on the file, the function runs **on every request**, giving you a fully usable `Request`, cookies, headers, and the ability to securely execute server-only code per request.

```ts
// src/pages/randomnumber.js
export const prerender = false;

export async function GET() {
  const number = Math.random();
  return new Response(JSON.stringify({ number }));
}
```

## HTTP methods

Export any function named after an [HTTP method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) — Astro dispatches to the matching one. Export `ALL` as a catch-all for any method without its own handler; unmatched requests otherwise redirect to your 404 page. If you define `GET` but not `HEAD`, Astro auto-handles `HEAD` by calling `GET` and stripping the body.

```ts
// src/pages/methods.json.ts
import type { APIRoute } from "astro";

export const GET = (({ request }) => {
  return new Response(JSON.stringify({ message: "This was a GET!" }));
}) satisfies APIRoute;

export const POST = (({ request }) => {
  return new Response(JSON.stringify({ message: "This was a POST!" }));
}) satisfies APIRoute;

export const ALL = (({ request }) => {
  return new Response(JSON.stringify({ message: `This was a ${request.method}!` }));
}) satisfies APIRoute;
```

## Reading the request

In on-demand mode, `request` is a full [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request):

```ts
export const POST = (async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    return new Response(JSON.stringify({ message: "Your name was: " + body.name }));
  }
  return new Response(null, { status: 400 });
}) satisfies APIRoute;
```

`request.formData()` works the same way for handling `<form>` submissions.

## Dynamic routes on endpoints

Endpoints support the same bracketed-filename dynamic routing as pages.

**Static mode** needs `getStaticPaths()`, same as a page:

```ts
// src/pages/api/[id].json.ts
import type { APIRoute } from "astro";
const usernames = ["Sarah", "Chris", "Yan", "Elian"];

export const GET = (({ params }) => {
  const id = Number(params.id);
  return new Response(JSON.stringify({ name: usernames[id] }));
}) satisfies APIRoute;

export function getStaticPaths() {
  return [
    { params: { id: "0" } },
    { params: { id: "1" } },
    { params: { id: "2" } },
    { params: { id: "3" } },
  ];
}
```

**On-demand mode** just reads `params` directly — no `getStaticPaths()`, and (since the endpoint is a function, not a component) no `props` mechanism either:

```ts
// src/pages/[id].json.js
import type { APIRoute } from "astro";
import { getProduct } from "../db";

export const GET = (async ({ params }) => {
  const product = await getProduct(params.id);
  if (!product) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }
  return new Response(JSON.stringify(product), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}) satisfies APIRoute;
```

## Redirects

The endpoint context includes a `redirect()` helper, mirroring `Astro.redirect`:

```ts
export const GET = (async ({ params, redirect }) => {
  const link = await getLinkUrl(params.id);
  if (!link) return new Response(null, { status: 404, statusText: "Not found" });
  return redirect(link, 307);
}) satisfies APIRoute;
```

## Binary output (images, files)

Return an `ArrayBuffer`/`Buffer` with the right `Content-Type`:

```ts
// src/pages/astro-logo.png.ts
export const GET: APIRoute = async () => {
  const response = await fetch("https://docs.astro.build/assets/full-logo-light.png");
  const buffer = Buffer.from(await response.arrayBuffer()); // needs @types/node
  return new Response(buffer, { headers: { "Content-Type": "image/png" } });
};
```

Some SSR hosts require the `Content-Type` header to be explicit for binary responses — always set it yourself rather than relying on inference.

## Calling an endpoint from a page (no network round trip)

You can import and call a `GET`/`POST` export directly from an Astro page, passing the `Astro` global as context, to reuse endpoint logic without an actual HTTP request:

```astro
---
import { GET } from './api/hello.ts';
const response = await GET(Astro);
const data = await response.json();
---
<h1>{data.greeting} world!</h1>
```

## Notes

- Endpoints whose URL includes a file extension (e.g. `sitemap.xml.ts`) are only reachable **without** a trailing slash, regardless of the `build.trailingSlash` config.
- Route priority between endpoints and pages: **endpoints win** when both would build the same URL — see the pages skill for the full route priority order.

## Reference

- https://docs.astro.build/en/guides/endpoints/
- https://docs.astro.build/en/guides/on-demand-rendering/#server-endpoints
