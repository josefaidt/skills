---
name: styling-ui
description: Rules for styling UI with Tailwind CSS v4 utility classes in the markup instead of hand-written stylesheets, covering the one CSS entry file and its @theme tokens, the few things CSS still writes by hand, wiring Tailwind in through @tailwindcss/vite for Vite or Astro, and tests that find elements without a styling class. Use when styling any UI, writing or reviewing a .css file or a class or className attribute, theming a View from a host's CSS variables, adding Tailwind to a workspace, porting hand-written CSS, or writing a test that selects an element.
user-invocable: false
---

# Styling UI

Style UI with Tailwind CSS v4 utility classes written in the markup. A reader then sees how an element looks where the element is written, and a change to one element cannot restyle another through a shared selector.

When the repository has a `CODING_STANDARDS.md`, read it first. Its rules win where they differ, and it sets how strictly a review enforces each rule here. Each rule's ID is `ui/` and its name in lowercase kebab case, with code font and punctuation dropped, such as `ui/utilities-in-the-markup` and `ui/components-not-apply`, and a review cites that ID. Examples for each rule, and a whole entry file, are in [references/tailwind.md](references/tailwind.md).

## Styling

| Rule | Summary |
| :-- | :-- |
| Utilities in the markup | Style every element with utility classes in its `class` or `className`. Never write a stylesheet of selectors, such as `.card { … }` or `.board > button`. |
| One CSS entry file | Each app that renders UI has one CSS file. It imports Tailwind and holds the app's tokens and the few rules in "Hand-written CSS". No other `.css` file exists. |
| Tokens in `@theme` | A design token, such as a color, font, radius, or shadow, is a variable in `@theme` in the entry file, which makes its utilities: `--color-accent` gives `bg-accent`, `text-accent`, and `border-accent`. Never write an arbitrary value, such as `bg-[#2563eb]`, for a value a token names. |
| `@theme inline` for runtime variables | When a token's value reads a CSS variable that something sets at runtime, such as an MCP Apps host style variable like `--color-background-primary`, declare the token in `@theme inline`. Each utility then carries the `var()` itself and resolves it on the element that uses it. Give the `var()` a fallback for when the variable is not set, such as a View opened outside a host. |
| Name a token apart from what it reads | Name a token for its role, such as `--color-surface`, never the same as the variable it reads. `--color-background-primary: var(--color-background-primary)` makes Tailwind write that variable to `:root` as a reference to itself, which is invalid and hides the host's value. |
| Components, not `@apply` | When the same class list repeats, extract a component, such as an Astro or JSX component or a function that returns markup, and pass what differs as props. `@apply` moves the look back into a selector. |
| Whole class names | Tailwind finds classes by reading source files for complete strings, so never build a class from parts, such as `` `bg-${color}` ``. Map each case to a full class string in an `as const` lookup. |
| State through variants | Style a state from the attribute that carries it, with variants such as `aria-pressed:`, `aria-disabled:`, `data-[state=open]:`, `disabled:`, `group-*`, and `peer-*`, rather than adding and removing classes in script. The attribute stays the one record of the state, and assistive technology and tests read it too. |
| Register markup from other packages | Tailwind reads only the files under the app's folder, so the classes in markup another workspace package renders are missing until the entry file names that package's folder with `@source`. |

## Hand-written CSS

Write CSS by hand only for what a utility cannot express, and only in the entry file:

| Rule | Use for |
| :-- | :-- |
| `@keyframes` through `--animate-*` | An animation. Declare `@keyframes` inside `@theme` with an `--animate-<name>` variable that names it, so `animate-<name>` plays it and Tailwind drops keyframes nothing uses. |
| `@custom-variant` | A variant Tailwind lacks, such as a `dark` variant keyed to a `data-theme` attribute, with `prefers-color-scheme` as the fallback when no attribute is set. |
| `@utility` | A multi-property pattern that repeats across different components, such as a focus ring. A pattern that repeats on one kind of element is a component instead. |
| `@layer base` | A few small rules for surfaces the browser draws that markup cannot reach, such as `::selection`, scrollbars, and the page's `color-scheme`. |

Anything else hand-written, such as a selector for one component or a media query around declarations, is a utility or a variant waiting to be written.

## Wiring Tailwind in

| Rule | Summary |
| :-- | :-- |
| Through `@tailwindcss/vite` | Add `tailwindcss()` from `@tailwindcss/vite` to the Vite config's `plugins`. For Astro, add it to `vite.plugins` in `astro.config.ts`, and never add the `@astrojs/tailwind` integration, which is for Tailwind v3. No `tailwind.config.js` and no PostCSS config: v4 reads its configuration from the entry file. |
| Pinned in the catalog | Pin `tailwindcss` and `@tailwindcss/vite` in the root version catalog, at `^4.3.5` or later, and depend on them as `catalog:`. |
| Imported once | Import the entry file once, where the page loads, such as an Astro layout's frontmatter or a View's HTML. A TypeScript file that imports it needs `vite/client` in the package's `types`, which declares `.css` modules. |
| Sorted by the formatter | Turn on oxfmt's `sortTailwindcss` in an `overrides` entry for each app's files, with `stylesheet` set to that app's entry file so its own tokens sort with the built-in utilities. |

## Tests

| Rule | Summary |
| :-- | :-- |
| Never select by a styling class | A test finds an element by role, label, text, or test id, such as `getByRole("button", { name: "Undo" })` or `getByTestId("square-c3")`, and never by a class such as `.bg-accent` or `.selected`. A class says how an element looks, so a restyle breaks a test that reads one. |
| Assert state through attributes | Check a state through the attribute that carries it, such as `aria-pressed`, `aria-selected`, or `data-state`, and never through the class a variant adds. |

## Porting hand-written CSS

Port one component at a time. Move each selector's declarations onto the elements it matched as utilities, turn each value two components share into a token, and delete the selector in the same commit, so the old and new styles never both apply. Move any test that selects by class onto a role, label, or test id before you port, so the test proves the port changed nothing it checks.
