---
name: new-typescript-package
description: Scaffold a new TypeScript package or app in a Bun workspace, creating package.json, tsconfig.json, and the entrypoint, or a bin/ executable and start script for an app that runs a server or CLI, plus an optional rolldown build, with bun check for type checking and Vitest for tests. Use when asked to create a new package or app in a monorepo.
argument-hint: <name> [apps|packages]
---

# New TypeScript package

Scaffold a package in a Bun workspace from scratch. Write the files rather than copying an existing package, so the new one carries no leftover dependencies or scripts.

The first argument is the package name, such as `utils`. The second optional argument is the directory, `packages` or `apps`, defaulting to `packages`. Load `monorepo` if you need to decide which of the two the new code belongs in.

## Steps

1. Read the root `package.json` for the workspace scope (the `name` prefix the other packages share, such as `@workspace`) and the catalog entries, and `tsconfig.base.json` for a `customConditions` entry such as `@workspace/source`.
2. Determine the destination: `packages/<name>` or `apps/<name>`.
3. For an app, decide whether it starts something, such as a server or a CLI. An app that does takes the files in "A runnable app" below in place of `<name>.ts`. An app with nothing to start takes the package files below without the `exports` field, since nothing takes a dependency on an app. The one exception is an app that deploys with the root infrastructure-as-code stack, such as a root `alchemy.run.ts`: it exports exactly one thing, `"./alchemy.stack": "./alchemy.stack.ts"`, described in "An app deployed by the root stack" below.
4. Decide the runtime the code runs on, such as Bun, Node, a browser, or a worker. It sets the ambient types in `tsconfig.json`.
5. Create the files below.

### `package.json`

```json
{
  "name": "@<scope>/<name>",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./<name>.ts"
  },
  "scripts": {
    "typecheck": "bun check"
  },
  "devDependencies": {
    "@types/bun": "catalog:",
    "typescript": "catalog:"
  }
}
```

List the ambient type package for the runtime, such as `@types/bun` or `@types/node`, from the catalog.

A scoped package keeps `"."` as its only export. Never add a subpath export to one; if the new code seems to need a second entrypoint, export it from `<name>.ts` or give it its own package.

Add `"test": "vitest run"` and `"vitest": "catalog:"` with the package's first test. The root `bun run test` skips a package with no `test` script, while `vitest run` fails a package with no test files.

### `tsconfig.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig.json",
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "types": ["bun"]
  },
  "include": ["./**/*.ts"]
}
```

Match the `extends` depth to the actual location. Both `packages/<name>` and `apps/<name>` sit two levels down, so both use `../../tsconfig.base.json`. List the runtime's ambient types in `types`, such as `["bun"]` or `["node"]`, since the base config sets none.

### `<name>.ts`

The entrypoint, at the package root. Start with an empty export:

```typescript
export {}
```

## A package with a build step

Only a package that ships a compiled artifact, such as one published to a registry or loaded from `dist/` by an app, gets a build. A package consumed only inside the workspace exports raw `.ts` and needs none.

Add the build script and dependency to `package.json`, and point the export at the output behind the source condition that `tsconfig.base.json` names in `customConditions`. The type checker and the tests resolve the condition to the TypeScript entrypoint, so they never wait on a build, while an app that does not set the condition loads `dist/`:

```json
{
  "exports": {
    ".": {
      "@<scope>/source": "./<name>.ts",
      "default": "./dist/<name>.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "rolldown -c",
    "typecheck": "bun check"
  },
  "devDependencies": {
    "rolldown": "catalog:"
  }
}
```

When the base config has no `customConditions` entry, export `./dist/<name>.js` alone, and run `bun run build` before anything that imports the package.

### `rolldown.config.ts`

```typescript
import { defineConfig } from "rolldown"

export default defineConfig({
  input: "<name>.ts",
  output: {
    dir: "dist",
    format: "esm",
  },
})
```

## A runnable app

An app that starts something, such as a server or a CLI, ships an executable at `bin/<name>.ts` where a package ships its root entrypoint. Its `package.json` declares the executable in `bin`, runs it from a `start` script, and has no `exports` field unless the root stack deploys it, as "An app deployed by the root stack" describes.

### `package.json`

```json
{
  "name": "@<scope>/<name>",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "bin": {
    "<name>": "./bin/<name>.ts"
  },
  "scripts": {
    "start": "bun run bin/<name>.ts",
    "typecheck": "bun check"
  },
  "devDependencies": {
    "@types/bun": "catalog:",
    "typescript": "catalog:"
  }
}
```

`bun run --filter @<scope>/<name> start` then starts the app from the repo root. Add the `test` script and Vitest the same way as for a package.

### `tsconfig.json`

Use the package `tsconfig.json` above as is. Its `./**/*.ts` include covers `bin/`, while a root-only pattern such as `*.ts` would leave the executable unchecked.

### `bin/<name>.ts`

The executable. Open it with a shebang so the `bin` link runs it under Bun, and start with an empty export:

```typescript
#!/usr/bin/env bun
export {}
```

Mark it executable with `chmod +x bin/<name>.ts`, so the file runs directly and git records the mode.

## An app deployed by the root stack

An app that deploys to the cloud through the repository's root infrastructure-as-code stack, such as a root `alchemy.run.ts`, exports exactly one thing, its `alchemy.stack.ts`, which declares that app's cloud resources. The export is a subpath named `"./alchemy.stack"`, never `"."`, so the app still has no root entrypoint. Add it to the app's `package.json`:

```json
{
  "exports": {
    "./alchemy.stack": "./alchemy.stack.ts"
  }
}
```

`alchemy.stack.ts` exports functions that take bindings and return Worker or website props, with every path anchored to the file, so the stack resolves them wherever it runs: a folder, such as an Astro site's `rootDir`, as `import.meta.dirname`, and a file, such as a Worker's `main`, as `new URL("./lib/worker.ts", import.meta.url).href`. Never build a folder from `import.meta.url`, which `unicorn/prefer-import-meta-properties` rejects. The root `package.json` lists the app as a `workspace:*` dependency, the one place anything depends on an app, and the root stack imports `@<scope>/<name>/alchemy.stack` from each app and wires them together. Every other app still declares no `exports`.

## End-to-end tests

End-to-end suites go in `tests/e2e/`, as `writing-typescript` lays out. Name each end-to-end file `*.e2e.ts`, so Vitest's default include, which matches `*.test.*` and `*.spec.*`, never runs it. For Playwright, add `"e2e": "playwright test"` and `"@playwright/test": "catalog:"`, with this config:

### `playwright.config.ts`

```typescript
import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "**/*.e2e.ts",
})
```

## After scaffolding

Run `bun install` from the repo root to link the new workspace package, then `bun run --filter @<scope>/<name> typecheck`.

## Notes

- Use `catalog:` for any dependency the root `package.json` catalog already pins. Add the entry to the catalog first if it is missing.
- Use `workspace:*` to depend on another package in the same workspace.
- The entrypoint **must** be `<name>.ts` at the package root, never `src/index.ts`. A runnable app's executable **must** be `bin/<name>.ts` instead, declared in `bin` and run by `start`.
- An app declares no `exports` field, whether or not it has something to start, except the single `"./alchemy.stack": "./alchemy.stack.ts"` subpath export of an app that the root infrastructure-as-code stack deploys. The rule that a scoped package exports only `"."` is for packages, not this export.
- Nothing takes a dependency on an app, apart from that root stack. Never add an app as a dependency of a package, of another app, or of an example.
- Put every module the entrypoint or executable imports under `lib/`, never in a directory beside `package.json`. The `./**/*.ts` include already covers it.
- Never use barrel files. Import directly from specific files.
- Put build, codegen, and one-off scripts in `scripts/`, wired up through a `package.json` script, and widen the tsconfig `include` to cover them.
