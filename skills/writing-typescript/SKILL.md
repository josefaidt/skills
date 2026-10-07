---
name: writing-typescript
description: Conventions for authoring TypeScript source files and laying out a package's files. Covers tsconfig baseline and explicit ambient types, import ordering and import type, the no-any rule and unknown at trust boundaries, JSDoc on exported types, Zod schema validation with contextual error messages, as const for fixed data and derived types, long-form class access modifiers, kebab-case filenames, entrypoint naming, the single-entrypoint rule for scoped packages' exports, the no-barrel-file rule, script placement in scripts/, and generated-file handling. Apply when writing or reviewing TypeScript, parsing external data, adding a build or codegen script, editing a package.json exports map, or restructuring a package's layout.
user-invocable: false
---

# Writing TypeScript

Rules that apply to every TypeScript file and to the shape of a package's directory. Apply them when creating or restructuring a package, not only when asked. For scaffolding a package from scratch, load `new-typescript-package`. For workspace structure and dependency installs, load `monorepo`.

## Repository standards take precedence

Before applying this skill, check the repository root for `CODING_STANDARDS.md`. When it exists, read it and treat it as the source of truth: its rules override this skill wherever they differ, and a review cites its rule IDs. This skill remains the baseline for anything that file does not cover, and for repositories without one.

## Configuration

- A repo-wide `tsconfig.base.json` holds the shared compiler options: strict, `moduleResolution: "bundler"`, `verbatimModuleSyntax`. Each package extends it.
- TypeScript 7 does not implicitly load ambient type packages. Keep `"types": []` in the base config and list each package's ambient types explicitly in its own `tsconfig.json`, such as `"types": ["bun", "node"]`.
- Declaring an ambient type package means adding the matching `@types/*` package to that workspace's dependencies.
- Bun executes raw TypeScript, so development needs no build or transpile step. A package only gains a bundler config when it ships a compiled artifact.

## Import style

Always use explicit `import type` for type-only imports. No blank lines between import statements.

Import order:

1. `import type` statements
2. `node:` built-in imports
3. Third-party package imports, alphabetical
4. Relative imports

```typescript
import type { Foo } from "./types"
import { join } from "node:path"
import { something } from "some-package"
import { bar } from "./bar"
```

## Type safety

**NEVER use `any`.** It disables checking everywhere the value travels, so one `any` at a boundary spreads untyped values through the call graph. Write the explicit type instead, whether that is an interface, a union, or a generic parameter.

`unknown` is the escape hatch when a shape genuinely is not known: a `fetch` response body, `JSON.parse` output, a caught error, a message off a queue. It carries the same "I don't know what this is" meaning as `any` while forcing a narrowing step before use.

```typescript
// prefer
const body: unknown = await response.json()
const user = UserSchema.parse(body)

// avoid
const body: any = await response.json()
```

Narrow `unknown` with a validator rather than a cast. `as User` on unvalidated data is `any` with extra syntax, since it asserts a shape nothing has checked.

Type a caught error as `unknown` and narrow it, since a `throw` can carry any value:

```typescript
try {
  await run()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
}
```

## Documenting exported types

Every exported `interface`, `type`, and `enum` gets a `/** */` block saying what it represents and who produces or consumes it, and every property gets one too, so an editor hover explains the field without a trip to the source.

- Say what the type cannot: units, formats, defaults for optional fields, and invariants such as which values a field may hold or how two fields relate.
- Use `@default`, `@example`, and `@see` where they help.
- Skip restating the name. A comment that says `userId` is "the user ID" adds nothing.
- Always write the multiline form, with `/**` and `*/` on their own lines, even for one sentence. Never the single-line `/** ... */`.

```typescript
/**
 * Input to `createTenant`, which creates a customer's production and development instances together.
 */
export interface CreateTenantInput {
  /**
   * Display name for the customer, shown in the admin dashboard.
   */
  name: string
  /**
   * Billing and administrative contact for the tenant. Not an end-user identifier.
   */
  owner_email: string
  /**
   * Exact HTTPS origins the production instance accepts, such as `https://app.example.com`.
   * @default []
   */
  allowed_origins?: string[]
}
```

## Validation

Validate anything crossing a trust boundary with a schema library, defaulting to Zod. That covers API responses, request bodies, environment variables, CLI arguments, and file contents. Derive the TypeScript type from the schema with `z.infer` so the type and the runtime check cannot drift apart.

```typescript
import { z } from "zod"

const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  age: z.number().int().nonnegative(),
})
type User = z.infer<typeof UserSchema>
```

Write error messages for whoever reads them. A default message such as `Invalid input: expected string, received undefined` names the type system, not the mistake, and the reader has to guess what to change.

```typescript
// prefer
const ConfigSchema = z.object({
  port: z.coerce
    .number()
    .int()
    .min(1, "PORT must be between 1 and 65535")
    .max(65535, "PORT must be between 1 and 65535"),
  apiKey: z
    .string()
    .min(1, "API_KEY is required. Generate one at https://example.com/settings/keys"),
})

// avoid
const ConfigSchema = z.object({
  port: z.coerce.number().int().min(1).max(65535),
  apiKey: z.string().min(1),
})
```

The context sets the wording. A message for an environment variable names the variable and how to obtain a value. A message for a form field names the field as the user sees it. A message for an internal API response names the endpoint and the field that came back wrong.

Choose the parse method by what the caller does next. `parse` throws and suits a startup path where a bad value should stop the process. `safeParse` returns a result object and suits a request handler that turns the failure into a response.

## Immutability

Use `as const` for any value that should be treated as readonly: literals, arrays, and objects that serve as fixed data or lookup tables. This narrows types to their literal values and prevents accidental mutation.

```typescript
// prefer
const DIRECTIONS = ["north", "south", "east", "west"] as const
const CONFIG = { retries: 3, timeout: 5000 } as const

// avoid
const DIRECTIONS = ["north", "south", "east", "west"]
const CONFIG = { retries: 3, timeout: 5000 }
```

Derive types from `as const` values rather than duplicating them:

```typescript
const STATUS = { active: "active", inactive: "inactive" } as const
type Status = (typeof STATUS)[keyof typeof STATUS]
```

## Class members

Write access modifiers in long form. `public`, `private`, and `protected` read as words at the start of the declaration, and `private readonly` states both facts in the order they are read. Prefer them over the `#` private-field syntax, and state `public` rather than leaving it implied, so every member declares its visibility the same way.

```typescript
// prefer
class Client {
  public readonly baseUrl: string
  private readonly token: string
  public async get(path: string): Promise<Response> {}
  private buildHeaders(): Headers {}
}

// avoid
class Client {
  readonly baseUrl: string
  #token: string
  async get(path: string): Promise<Response> {}
  #buildHeaders(): Headers {}
}
```

Mark a member `private` unless something outside the class calls it. `#` fields buy runtime enforcement at the cost of a syntax that reads differently from every other modifier and cannot be reached from tests or debuggers.

## File layout

- **Filenames are kebab-case**: `generate-script.ts`, `parse-config.ts`. Never `generateScript.ts` or `GenerateScript.ts`, including for a file whose only export is a class or a component.
- The package entrypoint is `<package-name>.ts` at the package root. A package named `template` has `template.ts`, not `src/index.ts`.
- **NEVER use barrel files.** Import directly from the file that defines the symbol.
- **NEVER include file extensions** in import statements.

## Scoped packages export one entrypoint

A scoped package (`@<scope>/<name>`) has exactly one entry in its `package.json` `exports` map, `"."`, pointing at the entrypoint. **NEVER add a subpath export** such as `"./server"`, `"./lib/allowed-origin"`, or `"./theme.css"` to one, whether the package lives in `packages/` or `apps/`.

Scoped packages are internal building blocks that roll up into the unscoped package customers install. The consumer's bundler tree-shakes whatever it does not import, so splitting a scoped package's surface into subpaths buys nothing for bundle size and leaves the package with several public faces to keep stable.

Reaching for a subpath export means the package's boundary is in question. Settle it one of two ways:

1. The code belongs to the package's domain. Export it from the entrypoint alongside everything else.
2. The code is its own domain. Extract it into a new scoped package with its own single `"."` export.

An unscoped package, the one customers install, may expose subpaths such as `<name>/server` when each one is a deliberate part of its public API.

## Scripts go in `scripts/`

Any build, codegen, or one-off script belongs in a `scripts/` subdirectory, never loose at the package root. The entrypoint is the exception, since it is what the package ships.

- Name the file for what it does: `scripts/generate.ts`, `scripts/copy-themes.ts`.
- Wire it up through a `package.json` script: `"build": "bun run scripts/generate.ts"`.
- Path-relative logic inside the script needs no change when the file moves into `scripts/`. `bun run <script>` executes with cwd at the package root regardless of where the script file lives, so `process.cwd()` and output paths such as `colors/` or `dist/` still resolve the same way.
- Keep the tsconfig `include` covering the new directory. A flat `*.ts` glob stops matching once scripts move down a level, while `./**/*.ts` already covers them.

This keeps the package root readable at a glance, holding the manifest, the tsconfig, and the shipped entrypoint, instead of mixing tooling in with them.

## Generated files

When a script's whole job is to emit another file, such as a compiled colorscheme or a copied build artifact:

- Put a "generated, do not hand-edit" comment at the top of the generated file, naming the script that produced it.
- Commit the output only when something consumes it directly from the repo as-is, the way a plugin manager loads a Neovim `colors/*.lua` file straight from the repo path. Otherwise it belongs in a gitignored `dist/`-style directory, rebuilt at publish or CI time.
