# Tailwind patterns

One example for each rule in `SKILL.md` whose table row leaves room for doubt, checked against Tailwind CSS 4.3.5.

## The entry file

Every hand-written rule a build needs, in one file such as `lib/mcp-app/styles.css`. It names its sources, resets the color and radius namespaces, and reads MCP Apps host style variables in `@theme inline`, with a fallback for when no host sets them.

```css
@import "tailwindcss" source(none);
@source "./";
@source "../board";
@source "../../../../packages/ui";

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
  --color-*: initial;
  --radius-*: initial;

  --color-accent: oklch(0.62 0.19 255);
  --color-on-accent: oklch(0.99 0 0);
  --radius-control: 0.5rem;
  --radius-piece: 9999px;
  --shadow-piece-selected: 0 0 0 2px var(--color-accent), 0 4px 8px rgb(0 0 0 / 0.3);
  --container-game: 32rem;
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
  --color-surface: var(--color-background-primary, oklch(1 0 0));
  --color-ink: var(--color-text-primary, oklch(0.2 0 0));
  --color-muted: var(--color-text-secondary, oklch(0.45 0 0));
}

@utility scrollbar-none {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

@layer base {
  html {
    color-scheme: light dark;
    scrollbar-color: var(--color-muted) transparent;
  }
  ::selection {
    background-color: var(--color-accent);
    color: var(--color-on-accent);
  }
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    ::before,
    ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

`source(none)` turns off automatic detection, so Tailwind reads only the folders the `@source` lines name. The last one reaches a workspace package that renders markup for this build. A package like that has no entry file and no plugin of its own, and each build that renders it names its folder.

After the two `initial` resets, `bg-white` and `rounded-lg` produce nothing, and the only colors and radii are the project's tokens.

`bg-surface` compiles to `background-color: var(--color-background-primary, oklch(1 0 0))`, so it follows the host's value on whatever element it sits on. In a plain `@theme` block it would compile to `var(--color-surface)`, with the host variable read once where Tailwind declares `--color-surface`, on `:root`.

The theme maps no font. The host's `--font-sans` and `--font-mono` have the same names as Tailwind's own tokens, which Tailwind's base styles and `font-sans` already read, so the host's value wins wherever a host sets it.

The `dark` variant applies under `data-theme="dark"`, and under the system's dark mode unless `data-theme="light"` overrides it. A theme switch then only sets the attribute on `<html>`.

## Components, not `@apply`

```css
/* avoid: the look moves back into a selector */
.button {
  @apply rounded-control bg-accent px-3 py-1.5 text-on-accent;
}
```

```astro
---
/* prefer: lib/components/button.astro, which owns the class list */
interface Props {
  tone?: "primary" | "quiet"
}
const { tone = "primary" } = Astro.props
const tones = {
  primary: "bg-accent text-on-accent",
  quiet: "bg-transparent text-ink hover:bg-ink/5",
} as const
---

<button class:list={["rounded-control px-3 py-1.5", tones[tone]]}>
  <slot />
</button>
```

When a link and a button share a look, one function in a shared module, such as `lib/ui.ts`, owns the class list, and an Astro component and a React component can both call it:

```typescript
const tones = {
  primary: "bg-accent text-on-accent",
  quiet: "bg-transparent text-ink hover:bg-ink/5",
} as const
const sizes = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-1.5",
} as const

export const buttonClass = ({
  tone,
  size,
}: {
  tone: keyof typeof tones
  size: keyof typeof sizes
}) => `inline-flex items-center rounded-control ${tones[tone]} ${sizes[size]}`
```

```astro
<a href="/rooms/new" class={buttonClass({ tone: "primary", size: "md" })}>New game</a>
```

## Whole class names

```typescript
// avoid: Tailwind never sees `bg-piece-red` or `bg-piece-black` in the source
const pieceClass = (color: PieceColor) => `bg-piece-${color}`

// prefer: every class appears whole, and the lookup's type covers every color
const pieceClasses = {
  red: "bg-piece-red ring-piece-red-edge",
  black: "bg-piece-black ring-piece-black-edge",
} as const satisfies Record<PieceColor, string>
```

## State through variants

```html
<!-- avoid: script adds and removes `selected`, and a selector styles it -->
<button class="square selected">…</button>

<!-- prefer: script sets the attribute, and a variant styles it -->
<button aria-pressed="true" class="bg-surface aria-pressed:bg-accent aria-pressed:text-on-accent">
  …
</button>
```

`group` and `peer` style an element from a parent's or sibling's state, such as `group-aria-expanded:rotate-180` on the icon inside a disclosure button. `data-[state=open]:` covers a state with no ARIA attribute, and `has-checked:` styles a label from the input inside it.

## One class per contested property

```typescript
// avoid: three variants set the same background, and which one wins is up to Tailwind's output order
const square = "bg-square data-selected:bg-accent data-last-move:bg-highlight data-trail:bg-trail"

// prefer: script decides which state wins, and one whole class sets the fill
const fills = {
  selected: "bg-accent",
  lastMove: "bg-highlight",
  trail: "bg-trail",
  plain: "bg-square",
} as const satisfies Record<SquareState, string>

const squareState = (square: Square): SquareState =>
  square.selected ? "selected" : square.lastMove ? "lastMove" : square.onTrail ? "trail" : "plain"
```

## Built-in variants over selectors

```html
<!-- the board lays out in a row once its own container is wider than --container-game -->
<section class="@container">
  <div class="flex flex-col gap-4 @game:flex-row">…</div>
</section>

<!-- hover only where the pointer can hover precisely -->
<button class="pointer-fine:hover:bg-ink/5 pointer-coarse:py-3">…</button>

<!-- styled while any ancestor carries data-theme -->
<span class="in-data-theme:text-muted">…</span>
```

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

The View's HTML links the entry file by its path:

```html
<link rel="stylesheet" href="./styles.css" />
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

An Astro layout imports the entry file as a URL and links it, since a bare `import "../styles/site.css"` trips oxlint's `import/no-unassigned-import`:

```astro
---
import siteStyles from "../styles/site.css?url"
---

<html lang="en">
  <head>
    <link rel="stylesheet" href={siteStyles} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

The root `.oxfmtrc.jsonc`, with one `overrides` entry for each build that renders UI. The `stylesheet` path is relative to the config file, and `functions` lists any helper whose string arguments are class lists, such as `clsx`:

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
await expect(page.getByRole("list", { name: "Moves" }).getByRole("listitem")).toHaveCount(3)
await expect(page.getByTestId("square-c3")).toHaveAttribute("aria-pressed", "true")
```

A container with no name of its own, such as the group that holds one player's seat, takes an `aria-label`, which lets a test find it with `getByRole("group", { name: "black seat" })` and tells a screen reader what it is. Reach for a test id only when an element has no role or name to find it by, such as one square of a board.
