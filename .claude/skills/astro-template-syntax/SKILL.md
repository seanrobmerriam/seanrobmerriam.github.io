---
name: astro-template-syntax
description: Write the HTML template portion of an .astro component — JSX-like expressions (variables, dynamic attributes, .map()/conditional rendering, dynamic tags), the differences between Astro syntax and JSX (kebab-case attributes, multiple root elements, comments), Fragments, template directives (class:list, set:html, set:text, is:raw, is:inline), and component utilities (Astro.slots, Astro.self). Use this skill whenever writing or debugging the markup inside an .astro file's template section, converting JSX-flavored intuitions to Astro syntax, or asked why an attribute, expression, or slot isn't rendering as expected.
---

# Astro Template Syntax

An `.astro` component has two parts: the **component script** (JS/TS between `---` fences, runs once during rendering — build time or request time, never in the browser) and the **component template** below it, which is a superset of HTML supporting JSX-like expressions.

```astro
---
// Component Script
const name = "Astro";
---
<!-- Component Template -->
<h1>Hello {name}!</h1>
```

## JSX-like expressions

### Variables

```astro
<h1>Hello {name}!</h1>
```

### Dynamic attributes

```astro
<h1 class={name}>Attribute expressions are supported</h1>
<MyComponent templateLiteralNameAttribute={`MyNameIs${name}`} />
```

HTML attributes are always converted to strings — you cannot pass a function or object as a plain HTML element attribute (e.g. no `onClick={handler}` on a native element; use a `<script>` with `addEventListener` instead — see the scripts-and-event-handling skill).

### Dynamic HTML: lists and conditionals

```astro
<ul>
  {items.map((item) => <li>{item}</li>)}
</ul>

{visible && <p>Show me!</p>}
{visible ? <p>Show me!</p> : <p>Else show me!</p>}
```

### Dynamic tags

Assign a tag name to a **capitalized** variable, or reassign an imported component:

```astro
---
import MyComponent from "./MyComponent.astro";
const Element = 'div';
const Component = MyComponent;
---
<Element>Hello!</Element>       <!-- renders <div>Hello!</div> -->
<Component />                    <!-- renders <MyComponent /> -->
```

Two limitations on dynamic tags: **client hydration directives (`client:*`) don't work** with them (Astro needs to statically know which components to bundle), and **`define:vars` doesn't work** on them either — set `style={`--myVar:${value}`}` manually if you can't wrap children in an extra static element.

## How Astro differs from JSX

| | JSX | Astro |
|---|---|---|
| Attributes | `camelCase` (`className`, `dataValue`) | standard HTML `kebab-case` (`class`, `data-value`) — and `class` works directly, unlike in React |
| Root elements | Must wrap multiple elements in one parent or `<>` | No wrapping needed — a template can have multiple root elements |
| Comments | `{/* JS comment */}` | Both `<!-- HTML comment -->` (ends up in the browser DOM) and `{/* JS comment */}` (stripped, good for TODOs) are valid |
| Event handlers | `onClick={fn}` | Not supported on native elements — use a `<script>` tag |

## Fragments

Use `<> </>` shorthand or the built-in `<Fragment />` component — most useful for avoiding a wrapper element while using a `set:*` directive:

```astro
---
const htmlString = '<p>Raw HTML content</p>';
---
<Fragment set:html={htmlString} />
```

## Template directives

Directives are special attributes in the form `X:Y` (e.g. `client:load`, `class:list`) that the Astro compiler treats specially — they never end up in the final HTML output.

### `class:list`

Builds a `class` string from a mix of strings, objects, and arrays (via `clsx`):

```astro
<span class:list={['hello goodbye', { world: true }, ['friend']]} />
<!-- class="hello goodbye world friend" -->
```

Rules: `string` → included; `object` → truthy keys included; `array` → flattened; `false`/`null`/`undefined` → skipped.

### `set:html`

Injects a raw HTML string, like `el.innerHTML` — **not escaped automatically**, so only pass trusted content (XSS risk otherwise):

```astro
---
const rawHTMLString = "Hello <strong>World</strong>";
---
<h1>{rawHTMLString}</h1>        <!-- escaped: Hello &lt;strong&gt;World&lt;/strong&gt; -->
<h1 set:html={rawHTMLString} /> <!-- raw: Hello <strong>World</strong> -->
```

Also accepts a `Promise<string>` or a `Promise<Response>` (handy for `fetch()`-ing HTML from a CMS directly into the attribute), and works on any tag — e.g. injecting `JSON.stringify(...)` into a `<script type="application/ld+json">` for structured data. Use on `<Fragment>` to inject raw HTML without an extra wrapper element.

### `set:text`

Injects an escaped text string, like `el.innerText`. Equivalent to `<div>{someText}</div>` — rarely used since the plain expression form is simpler.

### `is:raw`

Tells the compiler to treat all children as literal text — Astro's own `{...}` templating syntax inside is ignored. Useful for components (e.g. a KaTeX wrapper) whose content legitimately contains `{curly braces}` that aren't meant as Astro expressions:

```astro
<Katex is:raw>Some conflicting {syntax} here</Katex>
```

### `is:inline`

Opts a `<script>` or `<style>` tag out of Astro's default processing (bundling, TypeScript, deduplication) — see the scripts-and-event-handling skill for full detail.

## Component utilities

### `Astro.slots`

```astro
{Astro.slots.has('more') && (
  <aside>
    <h2>More</h2>
    <slot name="more" />
  </aside>
)}
```

`Astro.slots.render('default', args?)` asynchronously renders a slot's contents to an HTML string — an advanced escape hatch for utility components that need to inspect or transform slotted content (accepts an optional array of arguments forwarded to function children).

### `Astro.self`

Lets a component recursively render itself — useful for arbitrarily nested data structures:

```astro
---
const { items } = Astro.props;
---
<ul>
  {items.map((item) => (
    <li>{Array.isArray(item) ? <Astro.self items={item} /> : item}</li>
  ))}
</ul>
```

## Reference

- https://docs.astro.build/en/reference/astro-syntax/
- https://docs.astro.build/en/reference/directives-reference/
- https://docs.astro.build/en/basics/astro-components/
