---
name: astro-content-collections
description: Model and query structured content in Astro using content collections — the src/content.config.ts file, defineCollection() with the built-in glob() and file() loaders, Zod schemas for validated/typed frontmatter, cross-collection reference(), the getCollection()/getEntry()/render() query API, generating page routes from collection entries (both prerendered and on-demand), and live content collections for request-time data. Use this skill whenever setting up or querying a blog, docs set, portfolio/case-study list, or any other body of structured local Markdown/MDX/JSON/YAML content in Astro, or when deciding between a build-time and a live/real-time collection.
---

# Astro Content Collections

Content collections are Astro's typed, validated data layer for structured content — local Markdown/MDX/JSON/YAML/TOML files, or remote/live data via a loader. They live outside `src/pages/`, so collections don't automatically become routes; you build routes from them explicitly (see below).

## Defining collections: `src/content.config.ts`

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { blog };
```

Every collection needs a **`loader`** (required) and, strongly recommended, a **`schema`** for validation and full TypeScript autocompletion when you query it later. If a file's data violates its schema, Astro surfaces a clear build error.

If you change a schema and types don't seem to update, restart the dev server or press `s` + Enter to re-sync the content layer.

## Built-in loaders

### `glob()` — a directory of files

Fetches every matching entry from a directory of Markdown, MDX, Markdoc, JSON, YAML, or TOML files. IDs are auto-generated from filenames (URL-friendly, lowercased):

```ts
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/blog" }),
});
```

Override an entry's generated `id` with a `slug` field in its frontmatter/data (supports `/` for multi-segment URLs), or customize ID generation project-wide via `generateId` on the loader.

### `file()` — one file, many entries

For a single JSON/YAML array or TOML file where each top-level item is an entry (each needs a unique `id`):

```ts
const dogs = defineCollection({
  loader: file("src/data/dogs.json"),
});
```

```json
[
  { "id": "poodle", "coat": "curly", "shedding": "low" },
  { "id": "afghan", "coat": "short", "shedding": "low" }
]
```

For unsupported formats (e.g. CSV) or nested JSON documents, pass a `parser` function to `file()` to extract the right array yourself.

### Remote or custom sources

For remote data at build time, write a [custom loader](https://docs.astro.build/en/guides/content-collections/#custom-build-time-loaders) or use a published community loader (CMS integrations, Obsidian vaults, GitHub, Bluesky, etc.).

## Schemas with Zod

```ts
import { z } from "astro/zod";

schema: z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
})
```

`z` is Astro's re-export of Zod (v4-compatible) — all standard Zod methods (`.parse()`, `.transform()`, `.optional()`, `.array()`, etc.) are supported, with one notable exception: custom validation via `image().refine()` is not.

### References between collections

```ts
import { defineCollection, reference } from "astro:content";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    author: reference("authors"),              // single reference by id
    relatedPosts: z.array(reference("blog")),   // array of references
  }),
});
```

In frontmatter, just write the referenced entry's `id`:

```md
---
title: "Welcome to my blog"
author: ben-holmes
relatedPosts:
  - about-me
  - my-year-in-review
---
```

Astro transforms these into `{ collection, id }` objects you resolve with `getEntry()` when rendering.

## Querying: `getCollection()` / `getEntry()` / `render()`

```astro
---
import { getCollection, getEntry, render } from 'astro:content';

// All entries
const allBlogPosts = await getCollection('blog');

// Filtered
const draftBlogPosts = await getCollection('blog', ({ data }) => data.draft === true);

// A single entry by collection + id
const entry = await getEntry('blog', 'entry-1');
if (!entry) throw new Error('Could not find blog post');

// Compile it for rendering
const { Content, headings, remarkPluginFrontmatter } = await render(entry);
---
<Content />
```

`getEntry()` also resolves a `reference()` field directly: `await getEntry(enterprisePost.data.author)`.

## Generating routes from collection entries

Collections don't produce URLs on their own — you write a dynamic route under `src/pages/` that maps a param to an entry.

**Prerendered (static, default):**

```astro
---
// src/pages/posts/[id].astro
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<h1>{post.data.title}</h1>
<Content />
```

If custom `slug`s contain `/`, use a rest parameter filename (`[...id].astro`) to match multi-segment URLs.

**On-demand (SSR)**, with an adapter installed:

```astro
---
// src/pages/posts/[id].astro
export const prerender = false; // not needed if output: 'server'
import { getEntry, render } from "astro:content";

const { id } = Astro.params;
if (id === undefined) return Astro.redirect("/404");

const post = await getEntry("blog", id);
if (post === undefined) return Astro.redirect("/404");

const { Content } = await render(post);
---
<h1>{post.data.title}</h1>
<Content />
```

## Live content collections (request-time data)

For data that must be fresh on every request — CMS previews, live inventory, user-specific data — use a **live collection** instead, defined separately in `src/live.config.ts`:

```ts
// src/live.config.ts
import { defineLiveCollection } from 'astro:content';
import { storeLoader } from '@mystore/astro-loader';

const products = defineLiveCollection({
  loader: storeLoader({ apiKey: process.env.STORE_API_KEY, endpoint: 'https://api.mystore.com/v1' }),
});

export const collections = { products };
```

Query with `getLiveCollection()` / `getLiveEntry()` instead of `getCollection()` / `getEntry()`. Requires an adapter (on-demand rendering). Trade-offs vs. build-time collections: no MDX rendering, no image optimization, data is fetched per-request (no persistent data-store caching), but content is always current without a rebuild.

**Default to build-time collections** when performance matters and content changes infrequently (blog posts, docs, product descriptions). Reach for live collections only when up-to-the-moment freshness is worth the per-request cost (real-time prices, CMS draft previews, per-user data). Both kinds can coexist in the same project.

## Reference

- https://docs.astro.build/en/guides/content-collections/
- https://docs.astro.build/en/reference/modules/astro-content/
- https://docs.astro.build/en/reference/content-loader-reference/
