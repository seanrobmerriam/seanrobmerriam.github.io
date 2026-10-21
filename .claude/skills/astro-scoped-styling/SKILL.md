---
name: astro-scoped-styling
description: Write and debug CSS inside .astro component <style> tags — Astro's built-in scoped styling system, the :global() selector and is:global directive, define:vars for passing frontmatter values into CSS, class:list, passing classes into child components, scopedStyleStrategy, and CSS preprocessors. Use this skill whenever styling an .astro component, troubleshooting styles that "leak" or fail to apply across components, or deciding between scoped, global, and utility-class (Tailwind) approaches in an Astro project.
---

# Astro Scoped Styling

Astro `<style>` tags inside `.astro` files are **scoped to that component by default** — no CSS-in-JS, no naming convention (like BEM) required to avoid collisions.

## How scoping works

Astro adds a unique `data-astro-cid-*` attribute to every element the component renders, and rewrites your selectors to require that attribute. This is the default `scopedStyleStrategy: 'attribute'`.

```astro
---
// src/components/Card.astro
---
<div class="card"><slot /></div>

<style>
  .card {
    border: 1px solid #ccc;
    padding: 1rem;
  }
</style>
```

Compiles roughly to `.card[data-astro-cid-xxxxxx] { ... }` and `<div class="card" data-astro-cid-xxxxxx>`. Two different components can both define `.card` with completely different rules and never collide.

**Key implications:**
- Scoped styles apply **only to elements written directly in that component's template** — not to children rendered through `<slot />`, and not automatically to child components you import and use.
- Scoped styles **do** cascade from parent to child, because a child component's root element also receives the parent's `data-astro-cid-*` attribute when rendered inside the parent. Use unique, specific class names in child components to avoid unintended overrides from a parent's scoped styles.
- Global element selectors (e.g. bare `h1 { }`) written inside a scoped `<style>` block only affect `<h1>` elements rendered by *that* component, not the whole page — this is often surprising to newcomers who expect `<style>` in a layout to be page-wide (it isn't; use `is:global` or a global stylesheet for that).

## Going global

Add `is:global` to opt a `<style>` block out of scoping entirely:

```astro
<style is:global>
  p {
    color: red;
  }
</style>
```

You can also mix scoped and global rules by nesting a global rule inside a scoped block using `:global()`:

```astro
<style>
  /* scoped */
  .card { padding: 1rem; }

  /* unscoped — reaches into markdown/slotted content */
  .content :global(a) {
    color: blue;
  }
</style>
```

`:global()` is the precise tool for the common case of styling HTML you don't control the markup of directly — rendered Markdown/MDX content, a `set:html` blob, or a UI framework component's internal DOM.

## Changing the scoping strategy

Set `scopedStyleStrategy` in `astro.config.mjs` (default `'attribute'`):

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  scopedStyleStrategy: 'attribute', // 'attribute' | 'class' | 'where'
});
```

| Value | Mechanism | Specificity | When to reach for it |
|---|---|---|---|
| `'attribute'` (default) | `data-astro-cid-*` attribute selector | +1 | Default; good balance |
| `'class'` | generated class added to `class` | +1 | You want scoped selectors to beat a global reset stylesheet |
| `'where'` | wraps selectors in `:where()` | +0 | You want full manual control over cascade/specificity, e.g. with CSS layers |

## Passing a `class` into a child component

`class` does **not** automatically pass through to a child component's root element — you must accept and apply it yourself. Because scoping uses an attribute, you also need to forward that attribute so the parent's scoped rule still matches:

```astro
---
// src/components/MyComponent.astro
const { class: className, ...rest } = Astro.props;
---
<div class={className} {...rest}>
  <slot />
</div>
```

```astro
---
import MyComponent from "./MyComponent.astro";
---
<style>
  .red { color: red; }
</style>
<MyComponent class="red">This will be red!</MyComponent>
```

The `{...rest}` spread carries the `data-astro-cid-*` attribute Astro adds behind the scenes. If you switched `scopedStyleStrategy` to `'class'` or `'where'`, `...rest` isn't necessary for this to work.

## `class:list`

Build a `class` string from a mix of strings, objects, and arrays (powered by `clsx`):

```astro
<span class:list={['hello goodbye', { world: true }, ['friend']]} />
<!-- becomes: class="hello goodbye world friend" -->
```

- `string` → included as-is
- `object` → keys with truthy values are included
- `array` → flattened
- `false` / `null` / `undefined` → skipped

## CSS variables with `define:vars`

Pass server-side (frontmatter) values into your CSS without a runtime:

```astro
---
const foregroundColor = "rgb(221 243 228)";
const backgroundColor = "rgb(24 121 78)";
---
<style define:vars={{ foregroundColor, backgroundColor }}>
  h1 {
    background-color: var(--backgroundColor);
    color: var(--foregroundColor);
  }
</style>
<h1>Hello</h1>
```

Any JSON-serializable frontmatter value works, including `Astro.props`. Values are inserted with `JSON.stringify()`. This also works on `<script define:vars={{...}}>`, but note that using `define:vars` on a script implies `is:inline` (the script becomes unbundled and reruns per-instance) — see the scripts skill for details.

## CSS preprocessors

Sass, Less, and Stylus work with zero config beyond installing the dev dependency:

```bash
npm install -D sass
```

```astro
<style lang="scss">
  p {
    color: black;
    &:hover { color: red; }
  }
</style>
```

## Combining with Tailwind or a global stylesheet

Astro's scoped styles and a utility framework like Tailwind aren't mutually exclusive — use Tailwind utility classes for most layout/spacing/color work, and reach for a scoped `<style>` block only when you need a rule that doesn't map cleanly to utilities (complex selectors, `@keyframes`, pseudo-elements). Global/reset CSS and Tailwind's own layers belong in a `src/styles/global.css` imported once (typically in a base `Layout.astro`), not inside a scoped component `<style>` tag.

## Common pitfalls

- **"My style isn't applying to the child component."** Scoped styles don't cross component boundaries. Either pass a `class` prop (see above), use `:global()`, or move the rule to a global stylesheet.
- **"My `<style>` in a layout only styles the layout's own markup, not the whole page."** That's expected — add `is:global`, or put shared rules in an imported global stylesheet.
- **Dynamic tags (`<Element>` where `Element` is a variable) don't support `define:vars`.** If you can't wrap children in an extra element, set `style={`--myVar:${value}`}` manually on the element instead.

## Reference

- https://docs.astro.build/en/guides/styling/
- https://docs.astro.build/en/reference/directives-reference/#definevars
- https://docs.astro.build/en/reference/configuration-reference/#scopedstylestrategy
