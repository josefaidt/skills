---
name: styling-ui
description: Rules for styling UI with Tailwind CSS v4 utility classes in the markup instead of hand-written stylesheets, covering the CSS entry file with its sources and @theme tokens, the few things CSS still writes by hand, wiring Tailwind in through @tailwindcss/vite for Vite or Astro, and tests that find elements without a styling class. Use when styling any UI, writing or reviewing a .css file or a class or className attribute, theming a View from a host's CSS variables, adding Tailwind to a workspace, porting hand-written CSS, or writing a test that selects an element.
user-invocable: false
---

# Styling UI

Style UI with Tailwind CSS v4 utility classes written in the markup. A reader then sees how an element looks where the element is written, and a change to one element cannot restyle another through a shared selector.

When the repository has a `CODING_STANDARDS.md`, read it first. Its rules win where they differ, and it sets how strictly a review enforces each rule here. Each rule's ID is `ui/` and its name in lowercase kebab case, with code font and punctuation dropped, such as `ui/utilities-in-the-markup` and `ui/components-not-apply`, and a review cites that ID. Examples for each rule, and a whole entry file, are in [references/tailwind.md](references/tailwind.md).

## The entry file

| Rule | Summary |
| :-- | :-- |
| One entry file per build | Each build that renders UI, such as an MCP App View or a site, has one CSS file. It imports Tailwind and holds the sources, the tokens, and the few rules in "Hand-written CSS". No other `.css` file exists. |
| Name every source | Import Tailwind with `source(none)` and list each folder that holds markup with `@source`, relative to the entry file, including folders in other workspace packages. Automatic detection guesses its base from the Vite root, which is wrong when the root is a subfolder, and it never reads another package. |
| Tokens in `@theme` | A design token, such as a color, radius, shadow, or container size, is a variable in `@theme`, which makes its utilities: `--color-accent` gives `bg-accent` and `text-accent`, and `--shadow-piece-selected` gives `shadow-piece-selected`, even for a shadow of several layers. Never write an arbitrary value, such as `bg-[#2563eb]`, for a value a token can name. |
| Reset the namespaces you own | Start the theme with `--color-*: initial` and `--radius-*: initial`, so only the project's own colors and radii make utilities and markup cannot reach Tailwind's default palette. |
| `@theme inline` for runtime variables | When a token's value reads a CSS variable that something sets at runtime, such as an MCP Apps host style variable like `--color-background-primary`, declare the token in `@theme inline`. Each utility then carries the `var()` itself and resolves it on the element that uses it. Give the `var()` a fallback for when the variable is not set, such as a View opened outside a host. |
| Name a token apart from what it reads | Name a token for its role, such as `--color-surface`. A token with the same name as the variable it reads, such as `--color-background-primary: var(--color-background-primary)`, is a variable that refers to itself, which is invalid, so its utilities have no value wherever no host sets the variable. |
| Leave shared names unmapped | A few host variables already have the name of one of Tailwind's own tokens, such as `--font-sans`, `--font-mono`, and `--font-weight-*`. Leave them out of the theme. Tailwind's utilities and its base styles already read `var(--font-sans)`, and the host's value, set inline on `<html>`, overrides Tailwind's default. |

## Markup

| Rule | Summary |
| :-- | :-- |
| Utilities in the markup | Style every element with utility classes in its `class` or `className`. Never write a stylesheet of selectors, such as `.card { … }` or `.board > button`. |
| Components, not `@apply` | When the same class list repeats, extract a component, such as an Astro or JSX component, and pass what differs as props. When elements of different kinds share a look, such as a link and a button, use a function that returns the class string, such as `buttonClass({ tone, size })`, kept with the other shared class constants in one module. `@apply` moves the look back into a selector. |
| Whole class names | Tailwind finds classes by reading source files for complete strings, so never build a class from parts, such as `` `bg-${color}` ``. Map each case to a full class string in an `as const` lookup. |
| State through variants | Style a state from the attribute that carries it, with variants such as `aria-pressed:`, `aria-[current=page]:`, `data-[state=open]:`, `disabled:`, `has-checked:`, `group-*`, and `peer-*`, rather than adding and removing classes in script. The attribute stays the one record of the state, and assistive technology and tests read it too. |
| One class per contested property | When several states compete for one property, such as a square's fill when it is selected, the last move, and on the trail, pick the one class in script from the winning state. Several `data-*` variants that set the same property apply in an order the markup does not control. |
| Built-in variants over selectors | Reach for Tailwind's variants before writing a media query or an attribute selector: `pointer-fine:` and `pointer-coarse:` for input type, `in-data-theme:` and `in-*` for an ancestor's state, `motion-reduce:`, and `@container` with a named `--container-<name>` token, which gives `@<name>:`, for a component that adapts to its own width. |

## Hand-written CSS

Write CSS by hand only for what a utility cannot express, and only in the entry file:

| Rule | Use for |
| :-- | :-- |
| `@keyframes` through `--animate-*` | An animation. Declare `@keyframes` inside `@theme`, next to an `--animate-<name>` variable that names it, so `animate-<name>` plays it and Tailwind drops keyframes nothing uses. |
| `@custom-variant` | A variant Tailwind lacks, such as a `dark` variant keyed to a `data-theme` attribute, with `prefers-color-scheme` as the fallback when no attribute is set. |
| `@utility` | A multi-property pattern that repeats across different components and that no token expresses. A pattern that repeats on one kind of element is a component instead. |
| `@layer base` | A few small rules for what markup cannot reach or every element shares: `::selection`, scrollbars, `color-scheme`, a `:focus-visible` ring, and a `prefers-reduced-motion` rule that stops every animation and transition. A site adds its `body` colors and font, link underlines, and `h1` and `h2` sizes, since Tailwind's base styles remove them. |

Anything else hand-written, such as a selector for one component or a media query around declarations, is a utility or a variant waiting to be written.

## Wiring Tailwind in

| Rule | Summary |
| :-- | :-- |
| Through `@tailwindcss/vite` | Add `tailwindcss()` from `@tailwindcss/vite` to the Vite config's `plugins`. For Astro, add it to `vite.plugins` in `astro.config.ts`, and never add the `@astrojs/tailwind` integration, which is for Tailwind v3. No `tailwind.config.js` and no PostCSS config: v4 reads its configuration from the entry file. |
| Pinned in the catalog | Pin `tailwindcss` and `@tailwindcss/vite` in the root version catalog, at `^4.3.5` or later, and depend on them as `catalog:`. |
| Linked once | Load the entry file once, where the page loads, through a `<link rel="stylesheet">`: in a View's HTML by its path, and in an Astro layout by importing it as `./styles.css?url`. A bare `import "./styles.css"` trips oxlint's `import/no-unassigned-import`, and the Vite plugin processes the `?url` import in dev and in the build alike. `vite/client` in the package's `types`, or `astro/client` in Astro, declares the `?url` module. |
| Sorted by the formatter | Turn on oxfmt's `sortTailwindcss` in an `overrides` entry for each build's files, with `stylesheet` set to that build's entry file so its own tokens sort with the built-in utilities. |

## Tests

| Rule | Summary |
| :-- | :-- |
| Never select by a styling class | A test finds an element by role and accessible name, label, text, or test id, such as `getByRole("button", { name: "Undo" })` or `getByRole("list", { name: "Moves" })`, and never by a class such as `.bg-accent` or `.selected`. A class says how an element looks, so a restyle breaks a test that reads one. When a container has no name to find it by, give it an `aria-label` rather than keeping a class as a test hook. |
| Assert state through attributes | Check a state through the attribute that carries it, such as `aria-pressed`, `aria-selected`, or `data-state`, and never through the class a variant adds. |

## Porting hand-written CSS

Port one component at a time. Move each selector's declarations onto the elements it matched as utilities, turn each value two components share into a token, and delete the selector in the same commit, so the old and new styles never both apply. Move any test that selects by class onto a role, label, or test id before you port, so the test proves the port changed nothing it checks.

Tailwind's base styles make every box `border-box` and remove default margins, heading sizes, and link underlines. A page that never set `box-sizing` may rely on a content-box `min-height` or on default paragraph margins, so take a screenshot of each page before the port and compare it after.
