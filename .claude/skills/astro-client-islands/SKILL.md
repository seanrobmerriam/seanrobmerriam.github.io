---
name: astro-client-islands
description: Hydrate UI framework components (React, Vue, Svelte, Preact, Solid) in an Astro project using client directives — client:load, client:idle, client:visible, client:media, client:only, and choosing the right one for performance. Use this skill whenever adding interactivity to a framework component in Astro, deciding when/whether a component needs to ship JavaScript at all, debugging a component that isn't interactive or is loading too eagerly/late, or nesting framework components inside each other.
---

# Astro Client Islands

By default, Astro strips **all** client-side JavaScript from UI framework components (React, Vue, Svelte, Preact, Solid, etc.) and renders them to static HTML only. A component becomes an interactive "island" — hydrated with its own isolated JS bundle — only when you explicitly add a `client:*` directive.

```astro
---
import InteractiveCounter from '../components/InteractiveCounter.jsx';
---
<!-- Static HTML only, zero JS shipped -->
<InteractiveCounter />

<!-- Now interactive -->
<InteractiveCounter client:load />
```

This opt-in model is the core of Astro's "fast by default" story: JavaScript, being the most expensive per-byte asset type, is only sent for the components that actually need it, and each island hydrates independently in parallel.

**A `client:*` directive only works on a framework component directly imported into an `.astro` file** — it does not work with dynamic tags or components passed through the MDX `components` prop.

## Choosing a directive

| Directive | Priority | Loads/hydrates | Best for |
|---|---|---|---|
| `client:load` | High | Immediately on page load | Above-the-fold UI that must be interactive right away (buy button, nav toggle) |
| `client:idle` | Medium | After initial load, on `requestIdleCallback` (falls back to `load` event) | Lower-priority UI that can wait a beat |
| `client:visible` | Low | When the component enters the viewport (`IntersectionObserver`) | Below-the-fold or heavy components you'd rather skip loading entirely if unseen |
| `client:media={query}` | Low | When a CSS media query matches | Components only relevant at certain screen sizes (e.g. a mobile sidebar toggle) |
| `client:only={framework}` | High | Client-only — **skips server rendering entirely** | Components that can't/shouldn't run on the server (browser-only APIs) |

With every directive except `client:only`, the component still server-renders to static HTML first (so there's real content immediately), then hydrates and becomes interactive per the directive's timing.

### `client:load`

```astro
<BuyButton client:load />
```

### `client:idle`

Optionally cap the wait with `timeout` (ms), so a low-priority component still hydrates within a bound even under heavy page load:

```astro
<ShowHideButton client:idle={{ timeout: 500 }} />
```

### `client:visible`

Optionally widen the trigger area with `rootMargin` (pixels) to hydrate slightly before the component is actually on screen — reduces layout shift and gives slower connections a head start:

```astro
<HeavyImageCarousel client:visible={{ rootMargin: "200px" }} />
```

### `client:media`

```astro
<SidebarToggle client:media="(max-width: 50em)" />
```

If the component is already hidden/shown by the same media query in CSS, prefer `client:visible` instead — no need to duplicate the query.

### `client:only`

Skips server rendering entirely. **You must pass the framework name explicitly** — Astro can't infer it since it never runs the component on the server:

```astro
<SomeReactComponent client:only="react" />
<SomeVueComponent client:only="vue" />
<SomeSvelteComponent client:only="svelte" />
<SomePreactComponent client:only="preact" />
<SomeSolidComponent client:only="solid-js" />
```

Show loading content while a `client:only` component initializes with `slot="fallback"`:

```astro
<ClientComponent client:only="vue">
  <div slot="fallback">Loading</div>
</ClientComponent>
```

## Passing props

Props passed to a hydrated component must be **serializable** (translated into a format that can cross the server→client boundary): plain objects, `number`, `string`, `Array`, `Map`, `Set`, `RegExp`, `Date`, `BigInt`, `URL`, typed arrays, `Infinity`. Functions can't be passed to a hydrated component — they can only be used while the component renders on the server.

## Nesting framework components

Framework components can nest hydrated children, including across frameworks, as long as each individual `.jsx`/`.svelte`/etc. file only uses one framework:

```astro
---
import MyReactSidebar from '../components/MyReactSidebar.jsx';
import MyReactButton from '../components/MyReactButton.jsx';
import MySvelteButton from '../components/MySvelteButton.svelte';
---
<MyReactSidebar>
  <p>Here is a sidebar with some text and a button.</p>
  <div slot="actions">
    <MyReactButton client:idle />
    <MySvelteButton client:idle />
  </div>
</MyReactSidebar>
```

Astro components are always static HTML even when they wrap hydrated children, so you can't pass a JS function as a "render prop" from an `.astro` file into a framework component — use named slots instead.

If two or more components on a page share the same framework, that framework's runtime is only sent to the browser once, no matter how many islands use it.

## When *not* to reach for a framework component

If all you need is a click handler, a toggle, or simple DOM manipulation, a plain `<script>` tag (optionally with a custom element) is usually lighter than shipping a whole framework runtime for one small interaction — see the scripts-and-event-handling skill. Reserve client islands for genuinely stateful, framework-shaped UI (forms with complex validation, rich widgets, anything you'd naturally reach for React/Vue/Svelte to build).

## Reference

- https://docs.astro.build/en/concepts/islands/#client-islands
- https://docs.astro.build/en/guides/framework-components/
- https://docs.astro.build/en/reference/directives-reference/#client-directives
