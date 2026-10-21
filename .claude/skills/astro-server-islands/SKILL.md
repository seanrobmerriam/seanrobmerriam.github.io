---
name: astro-server-islands
description: Add server islands to an Astro page using the server:defer directive — deferred, on-demand rendering of personalized or slow components (user avatars, cart totals, recommendations) that load independently of the rest of an otherwise static, aggressively-cached page. Use this skill whenever a request involves showing per-visitor or frequently-changing data on an otherwise static page, mixing prerendered content with dynamic content, deciding between server islands and full-page SSR/client islands, or debugging server:defer, fallback content, prop serialization, or caching for server islands.
---

# Astro Server Islands

Server islands let a **static, cacheable page** contain small pockets of **server-rendered-on-demand** content — a logged-in user's avatar, a "you might also like" widget, live inventory count — without forcing the whole page to be dynamic.

## Requirements

Server islands need [on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/) capability, which means **an adapter must be installed**, even if the rest of the site stays fully static (`output: 'static'`, the default, is fine — you don't need `output: 'server'` project-wide). Using `server:defer` without an adapter throws `NoAdapterInstalledServerIslands`.

## Basic usage

Add `server:defer` to any Astro component used on a page:

```astro
---
import Avatar from '../components/Avatar.astro';
---
<Avatar server:defer />
```

The island component itself is a completely normal server-rendered Astro component and can do anything an on-demand page can — fetch data, read cookies, hit a database:

```astro
---
// src/components/Avatar.astro
import { getUserAvatar } from '../sessions';
const userSession = Astro.cookies.get('session');
const avatarURL = await getUserAvatar(userSession);
---
<img alt="User avatar" src={avatarURL} />
```

## Fallback content

The rest of the page renders and is visible immediately; the island shows fallback content until its own markup is ready, using the named `"fallback"` slot:

```astro
---
import Avatar from '../components/Avatar.astro';
import GenericAvatar from '../components/GenericAvatar.astro';
---
<Avatar server:defer>
  <GenericAvatar slot="fallback" />
</Avatar>
```

Good fallback content: a generic avatar, a skeleton/spinner, or a neutral placeholder message — anything that avoids layout shift when the real content swaps in.

## How it works

At build time, Astro replaces each `server:defer` component with a small script (plus your fallback markup) and splits the component off into its own route. In the browser, that script requests the special island endpoint, which renders and returns the component's HTML, replacing the fallback. Each island loads and resolves **independently** — a slow island never blocks the rest of the page or other islands.

This makes the main page shell eligible for aggressive caching (CDN, `Cache-Control`) since it no longer contains per-visitor content directly.

## Props

Props passed to a `server:defer` component are encrypted and sent to the island's endpoint as a `GET` request query string (or a `POST` body if the query would exceed the ~2048-byte URL limit — note `POST` responses aren't browser-cacheable, so keep props small and minimal).

Props must be **serializable**. Supported: plain objects, `number`, `string`, `Array`, `Map`, `Set`, `RegExp`, `Date`, `BigInt`, `URL`, typed arrays, `Infinity`. **Functions cannot be passed** — pass an id/token instead and look up the data inside the island.

## Accessing the requesting page's URL

A server island runs in its own isolated request context — `Astro.url` / `Astro.request.url` inside the island point at the internal `/_server-islands/...` endpoint, not the page the visitor is looking at. To read query params or path info from the actual page, read the `Referer` header instead:

```astro
---
const referer = Astro.request.headers.get("Referer");
if (!referer) throw new Error("Referer header is missing");
const url = new URL(referer);
const productId = url.searchParams.get("product");
---
```

## Caching

Because island data is fetched via `GET` with encrypted props in the query string, you can set standard `Cache-Control` headers on the island's response to cache it. Keep the props you pass minimal — large query strings force a fallback to uncacheable `POST` requests.

## Encryption key stability

Astro encrypts server island props with a random key generated fresh at each build. This is transparent for most hosts, but breaks decryption in setups where the frontend and backend can briefly run different builds simultaneously: rolling deployments (e.g. Kubernetes), multi-region hosting, or a CDN still serving a page built with an older key. In those cases, pin a reusable key:

```bash
astro create-key
```

Set the output as the `ASTRO_KEY` environment variable in your build/CI environment so the same key is embedded on every build.

## Configuration

`security.serverIslandBodySizeLimit` (default 1 MB) caps the size of a server island's `POST` request body (encrypted props + slot HTML) — raise it if an island needs to accept a larger payload:

```js
// astro.config.mjs
export default defineConfig({
  security: {
    serverIslandBodySizeLimit: 10 * 1024 * 1024, // 10 MB
  },
});
```

## When to reach for a server island vs. the alternatives

- **Server island (`server:defer`)** — a small piece of *server-rendered* HTML that's personalized or slow to compute, embedded in an otherwise static page. No client-side JS framework needed.
- **Client island (`client:*` directives)** — interactivity that must run *in the browser* (click handlers, forms, animation). See the client islands skill.
- **Full on-demand page (`prerender = false` / `output: 'server'`)** — the entire page's content depends on the request (e.g. a per-user dashboard) and caching the shell wouldn't help anyway.

## Reference

- https://docs.astro.build/en/guides/server-islands/
- https://docs.astro.build/en/concepts/islands/#server-islands
- https://docs.astro.build/en/reference/directives-reference/#server-directives
