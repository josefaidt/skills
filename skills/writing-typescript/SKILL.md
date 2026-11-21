---
name: writing-typescript
description: Rules for writing TypeScript and laying out a package's files, so the compiler rejects bad states and every package reads the same way. Use when writing or reviewing any .ts or .tsx file, parsing external data, editing a package.json or tsconfig, or adding a package, script, or generated file.
user-invocable: false
---

# Writing TypeScript

Make the compiler reject what the code cannot handle, and make every package look the same so a reader finds things without searching.

When the repository has a `CODING_STANDARDS.md`, read it first. Its rules win where they differ, and a review cites its rule IDs. This skill covers what it leaves out. To scaffold a package, load `new-typescript-package`, and for when a comment earns its place, `writing-code`. Examples for each rule are in [references/patterns.md](references/patterns.md).

## Types

| Rule | Summary |
| :-- | :-- |
| No `any` | Write the real type. External data and caught errors are `unknown` until narrowed. |
| Parse at the boundary | Run data that crosses in, such as a response body, env, CLI args, a database row, or a file, through a schema (Zod by default) and derive the type with `z.infer`. Never keep a schema, an interface, and a guard that can drift apart. |
| Trust types inside | Past the parse, never check the same data again. `Record<string, unknown>` ends at the parse, and transport or framework types stay out of a module's exports. |
| No `as` on unchecked data | A cast asserts a shape nothing checked. Use `satisfies` to check a literal without widening it. To remove a cast, find why inference fails: a missing tag, a source type that is too wide, or an unparsed boundary. |
| Narrowing order | Discriminant switch, then `in`, then `typeof` or `instanceof`, then a type guard, then `as` only after validation. |
| Honest type guards | A guard named `isX` or `hasX` checks every part of what it claims. A guard that lies is worse than a cast. |
| Unions over optional bags | Model states as a union with a literal tag, so contradictory combinations cannot be written. A second boolean that must stay in step with the first is the sign you need one. |
| One tag name | Pick one discriminant name, such as `status` or `kind`, and use it in every union. |
| Exhaustive switches | End a switch over a union with `const unhandled: never = value`, so a new member breaks the build where it must be handled. |
| Brand IDs | When two values share a primitive but mean different things, such as a tenant ID and a user ID, brand them. Only a parse function creates a branded value. |
| Build bad values out | Choose a shape where the bad value cannot be written, rather than a check every caller repeats: `[T, ...T[]]` for a non-empty list, `[T, T][]` for pairs, a start plus a duration for a range. |
| Strengthen only to remove a lie | Keep `T[]` while every use works on an empty list. Switch to `NonEmpty<T>` when the loose type forces a `!`, a cast, or a "can't happen" throw. |
| Derive, don't copy | Get types from their source: `z.infer`, `typeof` an `as const` value, `Pick`, `Omit`, `ReturnType`. |
| `as const` for fixed data | Lookup tables and fixed lists are `as const`, which keeps literal types and blocks mutation. |

## Code

| Rule | Summary |
| :-- | :-- |
| Pure logic, thin shell | Business logic lives in pure functions with no framework imports. The handler, route, or command parses input, calls them, and writes the result. |
| Stored and wire data | Persisted JSON carries a version and is parsed where it is read. A wire format ignores unknown fields, so an older reader survives a newer writer. |
| Object arguments | Pass an object when a function takes more than two parameters or two of the same type, so a swap fails to compile. Skip on hot paths. |
| Schema errors name the fix | A validation message names the field as its reader knows it and how to correct it, not the type that failed. |
| `parse` or `safeParse` | `parse` where a bad value should stop the process. `safeParse` where the failure becomes a response. |
| Real tests | Never mock what you can run. Use the platform's real test runtime, and mock only a system you cannot run locally. |
| Structured logs | Shipped code logs through a structured logger with the IDs needed to debug from a report, never a bare `console.log`. |
| Long-form modifiers | `public`, `private`, and `protected` on every class member, never `#`. Members are `private` unless something outside calls them. |
| Imports | `import type` for types. Order: types, `node:` built-ins, packages, relative. No blank lines between them, no file extensions, no barrel files. |
| JSDoc on exported types | Every exported type and each of its properties gets a multiline `/** */` saying what the name cannot: units, formats, defaults, invariants. |
| Comment syntax | Whether to comment at all is `writing-code`'s call. `//` for one line. A longer comment is a plain `/* */` block, never stacked `//` lines and never `/**`, which is for API docs. A lint or compiler directive stays a `//` line with its reason on the line above. |

## Layout

| Rule | Summary |
| :-- | :-- |
| Kebab-case files | `parse-config.ts`, even for a file that exports one class or component. |
| Entrypoint at the root | A package's entrypoint is `<name>.ts` beside `package.json`, not `src/index.ts`. |
| Runnable apps use `bin/` | An app that starts a server or CLI has `bin/<name>.ts` with a `#!/usr/bin/env bun` shebang, a `bin` field, a `start` script, and no `exports`. |
| Modules in `lib/` | Everything the entrypoint imports lives under `lib/`, grouped by concern with tests beside their modules. `lib/` has no index file. |
| Scripts in `scripts/` | Build, codegen, and one-off scripts go in `scripts/` and run through a `package.json` script. |
| One export for scoped packages | A `@scope/name` package exports only `"."`. Wanting a subpath means the code belongs in the entrypoint or in its own package. |
| Generated files | Open with a comment naming the script that made it. Commit it only when something reads it from the repo as-is. Otherwise it goes in a gitignored `dist/`. |
| tsconfig | Packages extend a base config that is strict with `moduleResolution: "bundler"`, `verbatimModuleSyntax`, and `"types": []`. Each package lists its ambient types and depends on their `@types/*` packages. |
