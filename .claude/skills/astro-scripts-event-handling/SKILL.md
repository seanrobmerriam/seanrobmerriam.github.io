---
name: astro-scripts-event-handling
description: Add client-side JavaScript and handle DOM events in an .astro component without a UI framework — <script> tag processing (bundling, TypeScript, dedup), is:inline for unprocessed/external scripts, addEventListener patterns, custom elements/Web Components for reusable interactive widgets, passing frontmatter (server) values into scripts via data attributes, and script re-execution behavior with the ClientRouter/view transitions (astro:page-load, data-astro-rerun). Use this skill whenever adding a click handler, toggle, or other lightweight interactivity to an .astro component without reaching for a full UI framework, or debugging a script that runs multiple times, doesn't run at all, or breaks after client-side navigation.
---

# Astro Scripts & Event Handling

For interactivity that doesn't need a full UI framework — click handlers, toggles, animations, analytics — a plain `<script>` tag inside an `.astro` component is usually the lightest option, avoiding the overhead of shipping a framework runtime just to attach `client:*` islands.

## How Astro processes `<script>` tags

A `<script>` with no attributes other than `src` gets automatic enhancement:

- **TypeScript** by default
- **Import bundling** — local files and npm packages are resolved and bundled
- Automatically becomes `type="module"`
- **Deduplicated** — if a component with a script is used multiple times on a page, the script still only runs once
- **Auto-inlined** into the HTML if small enough, to save a request

```astro
<script>
  // Processed! Bundled! TypeScript! Local/npm imports work.
  import confetti from 'canvas-confetti';
  document.querySelectorAll('[data-confetti-button]').forEach((button) => {
    button.addEventListener('click', () => confetti());
  });
</script>
```

### Opting out with `is:inline`

Any attribute other than `src` disables processing automatically. Add `is:inline` explicitly to opt out on purpose:

```astro
<script is:inline>
  // Rendered exactly as written — no TypeScript, no import resolution.
  // If used inside a component instance used multiple times, this code duplicates per instance.
</script>
```

### Local vs. external script files

```astro
<!-- Local file under src/ — gets full processing -->
<script src="../scripts/local.js"></script>
<script src="./script-with-types.ts"></script>

<!-- External / public/ file — needs is:inline to skip Astro's bundling -->
<script is:inline src="/my-script.js"></script>
<script is:inline src="https://my-analytics.com/script.js"></script>
```

## Handling events (no framework syntax)

Astro follows plain HTML/DOM conventions — there's no `onClick={...}` (React) or `@click="..."` (Vue) syntax for native elements. Use `addEventListener` in a `<script>`:

```astro
<button class="alert">Click me!</button>
<script>
  document.querySelectorAll('button.alert').forEach((button) => {
    button.addEventListener('click', () => alert('Button was clicked!'));
  });
</script>
```

Because Astro dedupes bundled scripts, this script only runs **once per page** even if `<AlertButton />` is used many times — `querySelectorAll` is what makes it attach to every instance.

## Custom elements (Web Components) for reusable widgets

When a component is used multiple times and each instance needs its own isolated state/behavior, wrap it in a custom element instead of relying on global `querySelectorAll`:

```astro
<astro-heart>
  <button aria-label="Heart">💜</button> × <span>0</span>
</astro-heart>
<script>
  class AstroHeart extends HTMLElement {
    connectedCallback() {
      let count = 0;
      const heartButton = this.querySelector("button");
      const countSpan = this.querySelector("span");
      heartButton?.addEventListener("click", () => {
        count++;
        countSpan.textContent = count.toString();
      });
    }
  }
  customElements.define("astro-heart", AstroHeart);
</script>
```

Two advantages over the plain `querySelectorAll` pattern: `this.querySelector()` is scoped to just that instance's children (no risk of grabbing another instance's elements), and the browser re-runs `connectedCallback()` for every `<astro-heart>` on the page even though the `<script>` itself only executes once.

## Passing frontmatter (server) values into a script

Frontmatter code runs on the server — it isn't available to the browser script directly. Store values in `data-*` attributes and read them via `dataset` in the client:

```astro
---
const { message = 'Welcome, world!' } = Astro.props;
---
<astro-greet data-message={message}>
  <button>Say hi!</button>
</astro-greet>
<script>
  class AstroGreet extends HTMLElement {
    connectedCallback() {
      const message = this.dataset.message;
      this.querySelector('button')?.addEventListener('click', () => alert(message));
    }
  }
  customElements.define('astro-greet', AstroGreet);
</script>
```

This is exactly what Astro does internally for `client:*` hydrated components — it emits an `<astro-island>` custom element with a `props` attribute carrying the serialized server props.

## Script behavior with view transitions / the `<ClientRouter />`

If the project uses Astro's `<ClientRouter />` for SPA-style navigation, script re-execution rules change from a normal full-page reload:

- **Bundled/processed scripts** (the default) run **once** per full page load, and are **not** re-run again after a client-side navigation, even if the new page contains the same component/script.
- **`is:inline` scripts** *can* re-execute — every time the page containing them is (re)loaded during navigation.
- To force an inline script to rerun on every visit to its page, add `data-astro-rerun` (implies `is:inline`).

To run setup code on **every** navigation (initial load and thereafter), listen for the `astro:page-load` lifecycle event instead of `DOMContentLoaded`:

```js
document.addEventListener("astro:page-load", () => {
  // Runs on first load AND after every client-side navigation.
  setupStuff();
});
```

For code that must run before the new page paints (e.g. applying a dark-mode class to avoid a flash), use `astro:after-swap`:

```astro
<script is:inline>
  function applyTheme() {
    document.documentElement.classList.toggle("dark", localStorage.theme === "dark");
  }
  document.addEventListener("astro:after-swap", applyTheme);
  applyTheme();
</script>
```

If an inline script sets up global state, guard against it running more than once (`window` persists across client-side navigations):

```js
if (!window.SomeGlobal) {
  window.SomeGlobal = {};
}
```

## Combining scripts with UI framework components

Elements a framework (React/Vue/etc.) renders may not exist in the DOM yet when a plain `<script>` executes. If a script needs to interact with framework-rendered elements, prefer a custom element wrapper (as above) so the logic runs relative to `connectedCallback`, or handle the interaction inside the framework component itself with a `client:*` directive instead — see the astro-client-islands skill.

## Reference

- https://docs.astro.build/en/guides/client-side-scripts/
- https://docs.astro.build/en/guides/view-transitions/#lifecycle-events
