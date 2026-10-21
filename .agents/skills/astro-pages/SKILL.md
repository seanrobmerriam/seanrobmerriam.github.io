---
name: astro-pages
description: Create and organize pages in an Astro project's src/pages/ directory — file-based routing, static and dynamic routes, getStaticPaths(), rest parameters, route priority, custom 404/500 error pages, and page partials for htmx-style partial rendering. Use this skill whenever adding a new route/page to an Astro site, deciding how to name a file for the URL it should produce, building a dynamic route from a list of items or collection, or setting up custom error pages.
---

# Astro Pages

Astro uses **file-based routing**: any supported file placed in `src/pages/` automatically becomes a page at the matching URL. `src/pages/` is the one directory Astro requires — every other directory (`components/`, `layouts/`, etc.) is just convention.

Supported page file types: `.astro`, `.md`, `.mdx` (with the MDX integration), and `.html`. You can also export custom endpoints (`.js`/`.ts`) from `src/pages/` — see the API endpoints skill for that.

## Static routes

```text
src/pages/index.astro        -> mysite.com/
src/pages/about.astro        -> mysite.com/about
src/pages/about/index.astro  -> mysite.com/about
src/pages/about/me.astro     -> mysite.com/about/me
src/pages/posts/1.md         -> mysite.com/posts/1
```

There's no separate routing config to maintain — adding a file adds a route. Navigate between pages with plain `<a>` tags; Astro doesn't ship a framework-specific `<Link>` component.

## Dynamic routes

Put a bracketed parameter in the filename to generate multiple pages from one component. How you supply the list of pages to build depends on whether the route is **prerendered** (static, default) or **on-demand** (SSR) — see the server-side-rendering skill for enabling on-demand rendering project-wide.

### Static (prerendered) dynamic routes

Export `getStaticPaths()` returning an array of `{ params, props? }` objects — one per page to generate:

```astro
---
// src/pages/dogs/[dog].astro
export function getStaticPaths() {
  return [
    { params: { dog: "clifford" } },
    { params: { dog: "rover" } },
    { params: { dog: "spot" } },
  ];
}
const { dog } = Astro.params;
---
<div>Good dog, {dog}!</div>
```

This generates `/dogs/clifford`, `/dogs/rover`, `/dogs/spot`. Multiple parameters can appear in one filename (`src/pages/[lang]-[version]/info.astro`) and all must be present in every `params` object.

Pass additional non-URL data via `props` (not encoded into the URL, so any serializable type is fine — including whole objects fetched from an API or a content collection):

```astro
---
export async function getStaticPaths() {
  const response = await fetch("https://example.com/api/posts");
  const data = await response.json();
  return data.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}
const { id } = Astro.params;
const { post } = Astro.props;
---
<h1>{id}: {post.name}</h1>
```

`getStaticPaths()` runs once, in its own isolated scope, before any page renders — you can't reference outer variables from the module scope, only imports.

### Rest parameters

`[...path]` matches any depth of path segments:

```astro
---
// src/pages/sequences/[...path].astro
export function getStaticPaths() {
  return [
    { params: { path: "one/two/three" } },
    { params: { path: "four" } },
    { params: { path: undefined } }, // matches the top-level /sequences route
  ];
}
const { path } = Astro.params;
---
```

Rest parameters combine with named parameters, e.g. `/[org]/[repo]/tree/[branch]/[...file]` (this is how GitHub's own file viewer routes).

### On-demand dynamic routes

With an adapter installed and `export const prerender = false` (or project-wide `output: 'server'`), a route is served for *any* matching URL — `getStaticPaths()` is not used and must not be exported:

```astro
---
// src/pages/resources/[resource]/[id].astro
export const prerender = false; // not needed if output: 'server'
const { resource, id } = Astro.params;
---
<h1>{resource}: {id}</h1>
```

Only one rest parameter is allowed per filename for on-demand routes. Since there's no `getStaticPaths()`, there's no `props` mechanism — look up whatever data you need directly from `Astro.params` inside the component.

### Pagination with `paginate()`

`getStaticPaths()` receives a `paginate` helper for splitting a large collection across pages:

```astro
---
// src/pages/pokemon/[page].astro
export async function getStaticPaths({ paginate }) {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
  const { results } = await response.json();
  return paginate(results, { pageSize: 10 });
}
const { page } = Astro.props;
---
```

`[page].astro` generates `/pokemon/1`, `/pokemon/2`, etc; `[...page].astro` generates `/pokemon`, `/pokemon/2`, etc. (page 1 has no number in the URL).

## Route priority order

When multiple files could build the same URL, Astro resolves it in this order:
1. Astro's reserved routes (`_astro/`, `_server-islands/`, `_actions/`)
2. More path segments beat fewer (`/posts/create` beats `/[...slug]`)
3. Static routes beat dynamic ones (`/posts/create.astro` beats `/posts/[page].astro`)
4. Named parameters beat rest parameters (`/posts/[page]` beats `/posts/[...slug]`)
5. Prerendered dynamic routes beat on-demand ones
6. Endpoints beat pages
7. File-based routes beat configured redirects
8. Alphabetical, as a final tiebreaker

## Custom error pages

- **404** — create `src/pages/404.astro` (or `.md`). Builds to `404.html`; most hosts auto-detect it.
- **500** — create `src/pages/500.astro`. Only used for **on-demand rendered** pages (not available for prerendered ones). Astro automatically passes an `error` prop:

```astro
---
// src/pages/500.astro
interface Props { error: unknown }
const { error } = Astro.props;
---
<div>{error instanceof Error ? error.message : "Unknown error"}</div>
```

Avoid rendering `error.stack` to visitors — it reveals server-side implementation details.

## Page partials

For progressively-enhanced UIs using htmx, Unpoly, or similar, mark a page as a **partial**: it skips the `<!DOCTYPE html>` wrapper and `<head>` content (including scoped styles/scripts, which are stripped) so it can be swapped into an existing page.

```astro
---
// src/pages/partials/clicked.astro
export const partial = true;
---
<div>I was clicked!</div>
```

```html
<button hx-post="/partials/clicked/" hx-target="#parent-div" hx-swap="innerHTML">
  Click Me!
</button>
```

Only `.astro` and `.mdx` files support the `partial` export (not `.md`). Don't use partials for components that need scoped styles/scripts — use a regular page plus a client library that merges `<head>` content instead.

## Reference

- https://docs.astro.build/en/basics/astro-pages/
- https://docs.astro.build/en/guides/routing/
- https://docs.astro.build/en/reference/routing-reference/
