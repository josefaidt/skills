---
name: new-typescript-package
description: Scaffold a new TypeScript package or app in a Bun workspace, creating package.json, tsconfig.json, the entrypoint, and an optional rolldown build, with bun check for type checking and Vitest for tests. Use when asked to create a new package or app in a monorepo.
argument-hint: <name> [apps|packages]
---

# New TypeScript package

Scaffold a package in a Bun workspace from scratch. Write the files rather than copying an existing package, so the new one carries no leftover dependencies or scripts.

The first argument is the package name, such as `utils`. The second optional argument is the directory, `packages` or `apps`, defaulting to `packages`. Load `monorepo` if you need to decide which of the two the new code belongs in.

## Steps

1. Read the root `package.json` for the workspace scope (the `name` prefix the other packages share, such as `@workspace`) and the catalog entries, and `tsconfig.base.json` for a `customConditions` entry such as `@workspace/source`.
2. Determine the destination: `packages/<name>` or `apps/<name>`.
3. Decide the runtime the code runs on, such as Bun, Node, a browser, or a worker. It sets the ambient types in `tsconfig.json`.
4. Create the files below.

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

## After scaffolding

Run `bun install` from the repo root to link the new workspace package, then `bun run --filter @<scope>/<name> typecheck`.

## Notes

- Use `catalog:` for any dependency the root `package.json` catalog already pins. Add the entry to the catalog first if it is missing.
- Use `workspace:*` to depend on another package in the same workspace.
- The entrypoint **must** be `<name>.ts` at the package root, never `src/index.ts`.
- Never use barrel files. Import directly from specific files.
- Put build, codegen, and one-off scripts in `scripts/`, wired up through a `package.json` script, and widen the tsconfig `include` to cover them.
