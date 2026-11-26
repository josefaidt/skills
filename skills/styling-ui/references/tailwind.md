# Tailwind patterns

One example for each rule in `SKILL.md` whose table row leaves room for doubt, checked against Tailwind CSS 4.3.5.

## The entry file

Every hand-written rule an app needs, in one file such as `lib/styles.css`. The `@theme inline` block reads MCP Apps host style variables, with a fallback for when no host sets them.

```css
@import "tailwindcss";

@custom-variant dark {
  &:where([data-theme="dark"], [data-theme="dark"] *) {
    @slot;
  }
  @media (prefers-color-scheme: dark) {
    &:where(:not([data-theme="light"], [data-theme="light"] *)) {
      @slot;
    }
  }
}

@theme {
  --color-accent: oklch(0.62 0.19 255);
  --font-display: "Inter", system-ui, sans-serif;
  --animate-pop: pop 200ms ease-out;

  @keyframes pop {
    from {
      scale: 0.9;
      opacity: 0;
    }
    to {
      scale: 1;
      opacity: 1;
    }
  }
}

@theme inline {
  --color-surface: var(--color-background-primary, var(--color-white));
  --color-ink: var(--color-text-primary, var(--color-neutral-900));
}

@utility focus-ring {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

@layer base {
  html {
    color-scheme: light dark;
    scrollbar-color: var(--color-ink) transparent;
  }
  ::selection {
    background-color: var(--color-accent);
    color: var(--color-white);
  }
}
```

The `dark` variant applies under `data-theme="dark"`, and under the system's dark mode unless `data-theme="light"` overrides it. With it, `dark:bg-neutral-900` compiles to both rules, and a theme switch only sets the attribute on `<html>`.

`bg-surface` compiles to `background-color: var(--color-background-primary, var(--color-white))`, so it follows the host's value on whatever element it sits on. In a plain `@theme` block it would compile to `var(--color-surface)`, with the host variable read once where Tailwind declares `--color-surface`, on `:root`.

## Components, not `@apply`

```css
/* avoid: the look moves back into a selector */
.button {
  @apply rounded-md bg-accent px-3 py-1.5 text-white;
}
```

```astro
---
/* prefer: lib/components/button.astro, which owns the class list */
interface Props {
  variant?: "primary" | "quiet"
}
const { variant = "primary" } = Astro.props
const variants = {
  primary: "bg-accent text-white",
  quiet: "bg-transparent text-ink hover:bg-ink/5",
} as const
---

<button class:list={["rounded-md px-3 py-1.5 focus-visible:focus-ring", variants[variant]]}>
  <slot />
</button>
```

The same holds in JSX or in a function that returns an HTML string: one function owns the class list, and each call site passes what differs.

## Whole class names

```typescript
// avoid: Tailwind never sees `bg-red-600` or `bg-neutral-900` in the source
const pieceClass = (color: "red" | "black") => `bg-${color === "red" ? "red-600" : "neutral-900"}`

// prefer: every class appears whole, and the lookup's type covers every color
const pieceClasses = {
  red: "bg-red-600 ring-red-800",
  black: "bg-neutral-900 ring-neutral-700",
} as const satisfies Record<PieceColor, string>
```

## State through variants

```html
<!-- avoid: script adds and removes `selected`, and a selector styles it -->
<button class="square selected">…</button>

<!-- prefer: script sets the attribute, and a variant styles it -->
<button aria-pressed="true" class="bg-surface aria-pressed:bg-accent aria-pressed:text-white">
  …
</button>
```

`group` and `peer` style an element from a parent's or sibling's state, such as `group-aria-expanded:rotate-180` on the icon inside a disclosure button. `data-[state=open]:` covers a state with no ARIA attribute.

## Register markup from other packages

Tailwind reads the files under the folder it runs from, the app's, and skips what git ignores, such as `node_modules`. A workspace package that renders markup sits outside that folder, so the entry file names the package's folder:

```css
@import "tailwindcss";
@source "../../../packages/ui";
```

The path is relative to the entry file. A package that only renders markup has no entry file and no plugin of its own, and the app that renders it styles it.

## Wiring

`package.json` of the app, with both packages pinned in the root catalog:

```json
{
  "devDependencies": {
    "@tailwindcss/vite": "catalog:",
    "tailwindcss": "catalog:"
  }
}
```

`vite.config.ts`, such as for an MCP App View:

```typescript
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [tailwindcss()],
})
```

`astro.config.ts`:

```typescript
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
})
```

The root `.oxfmtrc.jsonc`, with one `overrides` entry for each app that renders UI. The `stylesheet` path is relative to the config file, and `functions` lists any helper whose string arguments are class lists, such as `clsx`:

```jsonc
{
  "overrides": [
    {
      "files": ["apps/<name>/**"],
      "options": {
        "sortTailwindcss": { "stylesheet": "./apps/<name>/lib/styles.css" },
      },
    },
  ],
}
```

## Never select by a styling class

```typescript
// avoid: breaks the day the accent color or the class name changes
await page.locator(".bg-accent").click()
expect(square.classList.contains("selected")).toBe(true)

// prefer: what a person or a screen reader finds, and the state the markup records
await page.getByRole("button", { name: "Undo" }).click()
await expect(page.getByTestId("square-c3")).toHaveAttribute("aria-pressed", "true")
```

Reach for a test id only when the element has no role, label, or text that names it, such as one square of a board.
