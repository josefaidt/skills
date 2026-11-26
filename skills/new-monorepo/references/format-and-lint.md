# Formatting and lint

Examples for the formatting and lint step: the formatter's config, the linter's config, and `packages/lint-rules`, the local plugin that holds the rules no upstream plugin has.

## `.oxfmtrc.jsonc`

`sortImports` orders imports the way `writing-typescript` sets out: type imports, then `node:` and `bun:` built-ins, then the runtime imports of `react` and `react-dom`, then every other package, then relative imports. oxfmt has no built-in React group, so the `react` custom group defines one, and its `value` modifier leaves React's type imports in the type group.

```jsonc
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "semi": false,
  "sortImports": {
    "groups": ["type", "builtin", "react", "external", ["parent", "sibling", "index"]],
    // React's runtime imports sit between the built-ins and every other package
    "customGroups": [
      {
        "groupName": "react",
        "elementNamePattern": ["react", "react/**", "react-dom", "react-dom/**"],
        "modifiers": ["value"],
      },
    ],
    "newlinesBetween": false,
  },
  "sortPackageJson": true,
  // A paragraph stays on one line, so a diff shows the sentence that changed
  "proseWrap": "never",
  "overrides": [
    {
      "files": ["*.jsonc"],
      "options": {
        "trailingComma": "none",
      },
    },
  ],
  "ignorePatterns": [".claude/worktrees/*", "**/dist/**"],
}
```

## `.oxlintrc.jsonc`

Four categories carry the config, and the `rules` block lists only where it departs from them. Every rule in a category the config turns on applies to each plugin in `plugins`, and a plugin with no matching code reports nothing.

```jsonc
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["typescript", "unicorn", "oxc", "import", "promise", "vitest", "node"],
  "jsPlugins": ["@<scope>/lint-rules"],
  "categories": {
    "correctness": "error",
    "suspicious": "error",
    "pedantic": "error",
    "perf": "error",
  },
  "rules": {
    // Pedantic and perf rules that flag ordinary code far more often than a defect
    "max-lines": "off",
    "max-lines-per-function": "off",
    "max-classes-per-file": "off",
    "import/max-dependencies": "off",
    "no-inline-comments": "off",
    "no-underscore-dangle": "off",
    "require-unicode-regexp": "off",
    // An async function that never awaits often implements an async interface
    "require-await": "off",
    "typescript/require-await": "off",
    // Awaits in a loop are usually sequential on purpose
    "no-await-in-loop": "off",
    "typescript/prefer-readonly-parameter-types": "off",
    "typescript/strict-boolean-expressions": "off",
    "typescript/no-confusing-void-expression": "off",
    "unicorn/consistent-function-scoping": "off",
    "unicorn/no-useless-undefined": "off",
    "vitest/no-conditional-in-test": "off",

    // Style and restriction rules that enforce writing-typescript
    "typescript/no-explicit-any": "error",
    "typescript/no-non-null-assertion": "error",
    // `{} as T` asserts a shape nothing checked
    "typescript/consistent-type-assertions": [
      "error",
      { "assertionStyle": "as", "objectLiteralTypeAssertions": "never" },
    ],
    "typescript/explicit-member-accessibility": "error",
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "import/no-cycle": "error",
    "oxc/no-barrel-file": "error",
    "unicorn/filename-case": ["error", { "case": "kebabCase" }],
    "unicorn/prefer-node-protocol": "error",
    "prefer-const": "error",
    // A rejection nothing awaits is lost, so `void` does not count as handling it
    "typescript/no-floating-promises": ["error", { "ignoreVoid": false }],
    // Rules nothing upstream has, from packages/lint-rules
    "workspace/types-first": "error",
    "workspace/no-tests-in-lib": "error",
  },
  "options": {
    "typeAware": true,
    // A suppression whose rule no longer fires is dead weight
    "reportUnusedDisableDirectives": "error",
  },
  "ignorePatterns": [
    ".claude/worktrees/*",
    "**/dist/**",
    // A skill's scripts sit outside every tsconfig, so type-aware rules would read every value in
    // them as untyped
    ".agents/skills/**",
    ".claude/skills/**",
  ],
}
```

## `packages/lint-rules`

A rule `writing-typescript` sets that no upstream plugin has, such as the order of a module's top-level statements, goes in this package as an oxlint JavaScript plugin. `.oxlintrc.jsonc` loads it by package name through `jsPlugins`, and turns each rule on under the plugin's name, `workspace`, as in `workspace/types-first`. Add a rule here only for a fixed pattern a tool can match, and keep a judgment call in `CODING_STANDARDS.md`, as `coding-standards` describes.

Add `"@<scope>/lint-rules": "workspace:*"` to the root `devDependencies` and run `bun install`, so oxlint resolves the plugin by name. The plugin's modules import each other without extensions, which Node cannot resolve, so the root lint scripts run oxlint under Bun with `bun --bun oxlint`, as `references/root-files.md` shows. Every hook and CI step lints through `bun run lint`, so they pick up the plugin with no change of their own.

```text
packages/lint-rules/
├── lib/
│   ├── no-tests-in-lib.test.ts
│   ├── no-tests-in-lib.ts
│   ├── types-first.test.ts
│   └── types-first.ts
├── lint-rules.ts
├── package.json
└── tsconfig.json
```

### `package.json`

`@oxlint/plugins` is pinned to the exact `oxlint` version, since the two release in step. Only this package uses it, so it stays out of the catalog.

```json
{
  "name": "@<scope>/lint-rules",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./lint-rules.ts"
  },
  "scripts": {
    "test": "vitest run",
    "typecheck": "bun check"
  },
  "devDependencies": {
    "@oxlint/plugins": "1.92.0",
    "oxlint": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
```

### `tsconfig.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig.json",
  "extends": "../../tsconfig.base.json",
  "include": ["./**/*.ts"]
}
```

### `lint-rules.ts`

```typescript
import { definePlugin } from "@oxlint/plugins"
import { noTestsInLib } from "./lib/no-tests-in-lib"
import { typesFirst } from "./lib/types-first"

export default definePlugin({
  meta: { name: "workspace" },
  rules: {
    "no-tests-in-lib": noTestsInLib,
    "types-first": typesFirst,
  },
})
```

### `lib/types-first.ts`

Enforces `writing-typescript`'s "Types first": type imports, runtime imports, types, then runtime code. oxfmt's `sortImports` orders the imports among themselves, and this rule orders everything else.

```typescript
import type { ESTree } from "@oxlint/plugins"
import { defineRule } from "@oxlint/plugins"

type TopLevelStatement = ESTree.Program["body"][number]
type Tier = (typeof TIERS)[number]

const TIERS = ["type import", "runtime import", "type", "runtime code"] as const

const MESSAGES = {
  "type import": "Type imports come first, before every runtime import and statement.",
  "runtime import": "Imports come before every type and runtime statement.",
  type: "Types come before runtime code: move this type export or declaration above the first runtime statement.",
} as const

function isTypeDeclaration(node: ESTree.Declaration | null): boolean {
  return node?.type === "TSInterfaceDeclaration" || node?.type === "TSTypeAliasDeclaration"
}

function tierOf(statement: TopLevelStatement): Tier | undefined {
  if (statement.type === "ImportDeclaration" || statement.type === "TSImportEqualsDeclaration") {
    return statement.importKind === "type" ? "type import" : "runtime import"
  }
  if (statement.type === "TSInterfaceDeclaration" || statement.type === "TSTypeAliasDeclaration") {
    return "type"
  }
  if (statement.type === "ExportNamedDeclaration") {
    return statement.exportKind === "type" || isTypeDeclaration(statement.declaration)
      ? "type"
      : "runtime code"
  }
  if (statement.type === "ExpressionStatement" && "directive" in statement) {
    return undefined
  }
  return "runtime code"
}

/**
 * Orders a module's top-level statements as type imports, runtime imports, types (type re-exports
 * and type declarations, exported or not), then runtime code.
 */
export const typesFirst = defineRule({
  meta: {
    type: "layout",
    docs: {
      description: "Type imports, runtime imports, and types come before runtime code",
    },
  },
  create(context) {
    return {
      Program(program) {
        let latest = 0
        for (const statement of program.body) {
          const tier = tierOf(statement)
          if (tier === undefined) {
            continue
          }
          const rank = TIERS.indexOf(tier)
          if (rank < latest && tier !== "runtime code") {
            context.report({ node: statement, message: MESSAGES[tier] })
          }
          latest = Math.max(latest, rank)
        }
      },
    }
  },
})
```

### `lib/no-tests-in-lib.ts`

Enforces `writing-typescript`'s "Suites in `tests/`" for end-to-end suites, which are the ones that drift into `lib/`.

```typescript
import { defineRule } from "@oxlint/plugins"

const E2E_IN_LIB = /(?:^|\/)lib\/(?:.+\/)?(?:e2e\/|[^/]+\.e2e\.tsx?$)/

/**
 * Keeps end-to-end suites and their helpers out of `lib/`, which holds only library code the
 * entrypoint or `bin/` reaches.
 */
export const noTestsInLib = defineRule({
  meta: {
    type: "problem",
    docs: {
      description: "End-to-end tests and their helpers live in tests/e2e/, never in lib/",
    },
  },
  create(context) {
    return {
      Program(program) {
        if (E2E_IN_LIB.test(context.physicalFilename.replaceAll("\\", "/"))) {
          context.report({
            node: program,
            message:
              "lib/ holds library code. Move end-to-end tests and the helpers only they use to tests/e2e/ beside package.json.",
          })
        }
      },
    }
  },
})
```

### Tests

`RuleTester` from `oxlint/plugins-dev` runs each case, through the global `describe` and `it` when they exist. Vitest sets no globals by default, so each test file sets both to plain calls and runs every case inside one Vitest test, which fails on the first case that throws.

```typescript
import { RuleTester } from "oxlint/plugins-dev"
import { expect, it } from "vitest"
import { typesFirst } from "./types-first"

// Each case runs inside the one test below, which fails on the first case that throws
RuleTester.describe = (_title, run) => {
  run()
}
RuleTester.it = (_title, run) => {
  run()
}

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: "ts" } } })

it("passes every case", () => {
  expect(() =>
    tester.run("types-first", typesFirst, {
      valid: [
        `"use client"
import type { A } from "a"
import { b } from "b"
export type { C } from "./c"
interface D {}
export type E = typeof f
export { g } from "./g"
const f = b()`,
        `export type { A } from "./a"
export type { B } from "./b"
export { a } from "./a"
export { b } from "./b"`,
        `import { a } from "a"
const b = a()`,
      ],
      invalid: [
        {
          code: `export { a } from "./a"
export type { A } from "./a"`,
          errors: [{ message: /^Types come before runtime code/, line: 2 }],
        },
        {
          code: `const a = 1
export interface B { a: typeof a }`,
          errors: [{ message: /^Types come before runtime code/, line: 2 }],
        },
        {
          code: `function a() {}
type B = ReturnType<typeof a>`,
          errors: [{ message: /^Types come before runtime code/, line: 2 }],
        },
        {
          code: `interface A {}
import { b } from "b"`,
          errors: [{ message: /^Imports come before/, line: 2 }],
        },
        {
          code: `import { b } from "b"
import type { A } from "a"`,
          errors: [{ message: /^Type imports come first/, line: 2 }],
        },
      ],
    }),
  ).not.toThrow()
})
```

```typescript
import { RuleTester } from "oxlint/plugins-dev"
import { expect, it } from "vitest"
import { noTestsInLib } from "./no-tests-in-lib"

// Each case runs inside the one test below, which fails on the first case that throws
RuleTester.describe = (_title, run) => {
  run()
}
RuleTester.it = (_title, run) => {
  run()
}

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: "ts" } } })

it("passes every case", () => {
  expect(() =>
    tester.run("no-tests-in-lib", noTestsInLib, {
      valid: [
        { code: "export {}", filename: "/repo/apps/checkers/tests/e2e/web.e2e.ts" },
        { code: "export {}", filename: "/repo/apps/checkers/tests/e2e/game-server-client.ts" },
        { code: "export {}", filename: "/repo/apps/checkers/lib/board/board.test.ts" },
        { code: "export {}", filename: "/repo/apps/checkers/lib/board/e2e-ready.ts" },
      ],
      invalid: [
        {
          code: "export {}",
          filename: "/repo/apps/checkers/lib/e2e/web.e2e.ts",
          errors: [{ message: /^lib\/ holds library code/ }],
        },
        {
          code: "export {}",
          filename: "/repo/apps/game-server/lib/e2e/push-service.ts",
          errors: 1,
        },
        {
          code: "export {}",
          filename: "/repo/packages/game-room/lib/room/room.e2e.ts",
          errors: 1,
        },
      ],
    }),
  ).not.toThrow()
})
```
