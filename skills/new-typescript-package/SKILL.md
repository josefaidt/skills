---
name: new-typescript-package
description: Scaffold a new TypeScript package or app in a Bun workspace, creating package.json, tsconfig.json, the entrypoint, and an optional rolldown build. Use when asked to create a new package or app in a monorepo.
argument-hint: <name> [apps|packages]
---

# New TypeScript package

Scaffold a package in a Bun workspace from scratch. Write the files rather than copying an existing package, so the new one carries no leftover dependencies or scripts.

The first argument is the package name, such as `utils`. The second optional argument is the directory, `packages` or `apps`, defaulting to `packages`. Load `monorepo` if you need to decide which of the two the new code belongs in.

## Steps

1. Read the root `package.json` for the workspace scope (the `name` prefix the other packages share, such as `@workspace`) and the catalog entries.
2. Determine the destination: `packages/<name>` or `apps/<name>`.
3. Create the files below.

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
    "build": "rolldown -c",
    "test": "bun test",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/bun": "catalog:",
    "rolldown": "catalog:",
    "typescript": "catalog:"
  }
}
```

Include `rolldown` and the `build` script only when the package ships a compiled artifact. A package consumed only inside the workspace exports raw `.ts` and needs neither.

A scoped package keeps `"."` as its only export. Never add a subpath export to one; if the new code seems to need a second entrypoint, export it from `<name>.ts` or give it its own package.

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

Match the `extends` depth to the actual location. Both `packages/<name>` and `apps/<name>` sit two levels down, so both use `../../tsconfig.base.json`.

### `<name>.ts`

The entrypoint, at the package root. Start with an empty export:

```typescript
export {}
```

### `rolldown.config.ts`

Only for a package with a build step:

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

Run `bun install` from the repo root to link the new workspace package.

## Notes

- Use `catalog:` for any dependency the root `package.json` catalog already pins. Add the entry to the catalog first if it is missing.
- Use `workspace:*` to depend on another package in the same workspace.
- The entrypoint **must** be `<name>.ts` at the package root, never `src/index.ts`.
- Never use barrel files. Import directly from specific files.
- Put build, codegen, and one-off scripts in `scripts/`, wired up through a `package.json` script, and widen the tsconfig `include` to cover them.
