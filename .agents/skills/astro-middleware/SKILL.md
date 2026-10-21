---
name: astro-middleware
description: Write Astro middleware to intercept requests and responses before a page or endpoint renders — src/middleware.ts, onRequest(), defineMiddleware() for type safety, sequence() for chaining multiple middleware functions, and sharing request-scoped data via context.locals / Astro.locals (including typing App.Locals in env.d.ts). Use this skill whenever adding authentication/session checks, request logging, header/cookie manipulation, redirects that apply across many routes, or any per-request logic that should run before every page or API route.
---

# Astro Middleware

Middleware intercepts every request/response before a page or endpoint renders, letting you inject shared behavior globally — auth checks, redirects, header manipulation, request-scoped data — without repeating logic in every route.

For **prerendered** routes, middleware runs at **build time**; for **on-demand rendered** routes, it runs at **request time**, where features like cookies and headers are fully available (see the server-side-rendering skill).

## Basic usage

Create `src/middleware.js`/`.ts` (or `src/middleware/index.js`/`.ts`) and export a non-default `onRequest()` function:

```ts
// src/middleware.js
export function onRequest(context, next) {
  // intercept data from a request
  context.locals.title = "New title";
  context.locals.property = "information";

  // return a Response or the result of calling next()
  return next();
}
```

`onRequest()` **must** return a `Response` — either directly, or via `next()`. Returning nothing (or just mutating `locals` without returning) throws `MiddlewareNoDataOrNextCalled`.

Read whatever the middleware set from any `.astro` file via `Astro.locals`:

```astro
---
const data = Astro.locals;
---
<h1>{data.title}</h1>
<p>This {data.property} is from middleware.</p>
```

## `context.locals`

`locals` is the mechanism for passing request-scoped data from middleware into pages, layouts, and API endpoints. It can hold any data type — strings, numbers, functions, `Map`s, whatever you need:

```ts
export function onRequest(context, next) {
  context.locals.user = { id: 1, name: "John Wick" };
  context.locals.welcomeTitle = () => "Welcome back " + context.locals.user.name;
  context.locals.orders = new Map([["1", { product: "socks" }]]);
  return next();
}
```

Read it in a page via `Astro.locals`, or in an API route via the `locals` property of the endpoint context:

```ts
// src/pages/hello.ts
import type { APIContext } from 'astro';
export function GET({ locals }: APIContext) {
  return new Response(locals.title);
}
```

`locals` lives and dies with a single request — it's fresh on every route render and can't be used to persist state across requests. It also **cannot be reassigned wholesale** at runtime (Astro throws if you try) — mutate its properties instead of replacing the object.

## Type safety

Wrap your handler in `defineMiddleware()` so `context` and `next()` are automatically typed, and TypeScript flags an invalid return value:

```ts
// src/middleware.ts
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  /* your middleware logic */
});
```

Type the contents of `locals` itself by declaring the global `App.Locals` interface in `src/env.d.ts` — this gives autocomplete both inside middleware and in `.astro` files reading `Astro.locals`:

```ts
// src/env.d.ts
type User = { id: number; name: string };

declare namespace App {
  interface Locals {
    user: User;
    welcomeTitle: () => string;
    orders: Map<string, object>;
    session: import("./lib/server/session").Session | null;
  }
}
```

## Chaining multiple middleware with `sequence()`

Run several middleware functions in a defined order:

```js
// src/middleware.js
import { sequence } from "astro:middleware";

async function validation(context, next) { /* ... */ }
async function auth(context, next) { /* ... */ }
async function greeting(context, next) { /* ... */ }

export const onRequest = sequence(validation, auth, greeting);
```

Each function receives `next()` bound to call the *next* function in the sequence (or complete the request if it's last).

## Real-world example: session auth

```ts
// src/middleware.ts
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const accessToken = context.cookies.get("session-token")?.value;

  if (accessToken) {
    try {
      context.locals.user = await validateToken(accessToken);
    } catch {
      context.cookies.delete("session-token", { path: "/" });
    }
  }

  return next();
});
```

Then any page or API route can check `Astro.locals.user` / `locals.user` without re-implementing the token check.

## Integration awareness

Integrations you install may also write to `locals` — check an integration's docs before assuming a `locals` key is free to use, to avoid silently overwriting something it depends on.

## Reference

- https://docs.astro.build/en/guides/middleware/
- https://docs.astro.build/en/reference/modules/astro-middleware/
