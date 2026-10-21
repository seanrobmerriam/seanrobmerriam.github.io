# Sean Merriam — Developer & Designer

A personal portfolio and demonstration of content management with Astro. The site brings together WordPress migration services, interface design, developer tools, and writing, with working examples of MDX and Markdoc.

Built on **Lumos for Astro**, using TypeScript, plain CSS, and custom properties.

## What's on the site

- An introduction with links to selected work and contact information.
- WordPress migration services, including content structure and launch planning.
- A live MDX playground with YAML frontmatter, JSX, expressions, and interactive React components.
- A Markdoc journal with article previews and full reading pages.
- Services, specialties, an about section, and an overview of the working approach.
- Open-source projects: **freshfonts**, **checkpoint**, **fslite**, and **agentchaos**.
- Contact links to [Sean's GitHub profile](https://github.com/seanrobmerriam).

## Local development

Use **Node.js 22.22 or newer** to meet the installed Astro and Markdoc dependencies' requirements.

```sh
npm ci
npm run dev -- --background
```

The dev server normally runs at `http://localhost:4321`.

```sh
npx astro dev status
npx astro dev logs
npx astro dev stop
```

| Command           | Purpose                                 |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Start an interactive development server |
| `npm run check`   | Check Astro and TypeScript diagnostics  |
| `npm run build`   | Generate the static site in `dist/`     |
| `npm run preview` | Preview the production build locally    |
| `npm run format`  | Format the project with Prettier        |

## Editing the portfolio

| File                                 | Content or behavior                                        |
| ------------------------------------ | ---------------------------------------------------------- |
| `src/pages/index.astro`              | Homepage sections, introductory copy, and contact links    |
| `src/data/projects.ts`               | Featured project names, descriptions, and repository links |
| `src/data/portfolio.ts`              | Services and specialties                                   |
| `src/consts.ts`                      | Site name, description, canonical URL, and locale          |
| `src/components/global/Nav.astro`    | Main navigation                                            |
| `src/components/global/Footer.astro` | Footer content and links                                   |
| `src/components/blocks/Hero.astro`   | Reusable hero with primary and secondary buttons           |
| `src/styles/base.css`                | Design tokens, typography, and color themes                |
| `src/styles/utilities.css`           | Shared utility classes                                     |

Project conventions are documented in [LUMOS.md](LUMOS.md) and [AGENTS.md](AGENTS.md). Task-specific guidance lives in `.agents/skills/`.

## Writing with Markdoc

Blog posts live in `src/content/blog/` as `.mdoc` files. Their frontmatter is validated by `src/content.config.ts`.

```md
---
title: A new article
description: A short summary for the article preview.
pubDate: 2026-10-21
category: Content & design
author: Sean Merriam
draft: false
---

## Start with an idea

Write the article using Markdown and Markdoc syntax.

This article belongs to **{% $frontmatter.category %}**.
```

`title`, `description`, `pubDate`, and `category` are required. `author` defaults to Sean Merriam, and `draft` defaults to `false`.

The homepage displays the two most recent non-draft posts. Each post gets a static `/blog/<post-id>/` page through `src/pages/blog/[...id].astro`. Set `draft: true` to exclude a post from both the listing and generated routes.

Full articles render inside the shared `RichText` component. The reading layout uses a 65-character maximum width, normal paragraph wrapping, and brand-colored headings.

- `markdoc.config.mjs` configures Markdoc rendering.
- `markdoc.config.json` points editor tooling to the content and schema configuration.

## The live MDX playground

`src/components/blocks/MarkdownEditor.astro` contains the sample document and editor interface. Editing the textarea updates an isolated preview frame, styled to match the site.

YAML metadata is exposed as `frontmatter`:

```mdx
---
title: Hello from MDX
tags: [Astro, MDX]
---

## {frontmatter.title}

{frontmatter.tags.join(' / ')}
```

The playground uses `@mdx-js/mdx`, `remark-frontmatter`, and `remark-mdx-frontmatter`. React is bundled locally; the preview does not depend on a remote module CDN.

Imports resolve through the module registry in `src/scripts/mdx-preview-runtime.ts`. It currently includes `react`, `react/jsx-runtime`, and `react-dom/client`. To expose another browser-compatible package or React component, import it there and add it to the registry. Installing a package alone does not make it available in the editor.

`build/mdx-preview-runtime.mjs` bundles the frame runtime through a Vite plugin. `src/utils/mdx-preview.ts` handles compilation, import routing, and the preview document. Compilation and runtime errors appear beside the preview.

Edits are temporary and are not saved to content files. The playground runs browser MDX; it does not provide Astro's server-side APIs or automatic file-based imports.

## Production build

```sh
npm run check
npm run build
npm run preview
```

The site builds as static HTML and assets in `dist/`. Set the intended canonical origin in `src/consts.ts` before deploying. The sitemap integration and `src/pages/robots.txt.ts` use that configuration.

A `wrangler.jsonc` configuration is included for serving `dist/` as static assets on Cloudflare Workers. Deployment is separate from building the site.

## License

[MIT](LICENSE). Built using Lumos for Astro; upstream attribution is retained in the license.
