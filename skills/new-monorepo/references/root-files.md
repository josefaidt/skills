# Root files

Examples for the workspace and TypeScript steps. Replace `<name>` with the root package name, `<scope>` with the workspace scope, and `<bun version>` with the output of `bun --version`.

## `package.json`

The catalog holds the version range of every dependency that more than one package uses, and each package depends on it as `catalog:`. The ranges below were current when this example was written, so raise any that `bun outdated` reports behind once the install finishes.

Some scripts run files that later steps write: `setup`, `check-catalog`, and `check-changes` from the scripts step, and the hooks path that `prepare` sets from the git hooks step. `zod` is a root dependency because `scripts/check-catalog.ts` parses each manifest with it.

```json
{
  "name": "<name>",
  "private": true,
  "workspaces": {
    "packages": ["apps/*", "packages/*"],
    "catalog": {
      "@commitlint/cli": "^21.2.3",
      "@commitlint/config-conventional": "^21.2.3",
      "@types/bun": "^1.4.2",
      "@types/node": "^26.6.4",
      "oxfmt": "^0.71.0",
      "oxlint": "1.86.0",
      "oxlint-tsgolint": "^7.0.2003",
      "rolldown": "^1.2.12",
      "typescript": "^7.0.2",
      "vitest": "^4.1.10",
      "zod": "^4.6.5"
    }
  },
  "type": "module",
  "scripts": {
    "setup": "./scripts/setup.sh",
    "prepare": "git config core.hooksPath .git-hooks",
    "build": "bun run --filter './packages/*' --if-present build",
    "test": "bun run --filter '*' --if-present test",
    "typecheck": "bun run --filter '*' --if-present typecheck && bun check -p scripts",
    "fmt": "oxfmt",
    "fmt:check": "oxfmt --check",
    "lint": "oxlint --deny-warnings",
    "lint:fix": "oxlint --fix",
    "check-catalog": "bun run scripts/check-catalog.ts",
    "check-changes": "./scripts/check-changes.sh"
  },
  "devDependencies": {
    "@commitlint/cli": "catalog:",
    "@commitlint/config-conventional": "catalog:",
    "@types/bun": "catalog:",
    "oxfmt": "catalog:",
    "oxlint": "catalog:",
    "oxlint-tsgolint": "catalog:",
    "typescript": "catalog:",
    "zod": "catalog:"
  },
  "packageManager": "bun@<bun version>"
}
```

`--if-present` lets a fan-out skip a workspace without the script, so every check passes before the first package exists. `oxlint` is pinned exactly because `oxlint-tsgolint` releases in step with it.

## `bunfig.toml`

```toml
[install]
# Each package can import only what its own package.json declares, so an undeclared import fails
# where it is written instead of in someone else's CI
linker = "isolated"
# `bun add` writes the exact version it resolved, and shared ranges live in the root catalog
exact = true
# Only install versions published at least three days ago, so a compromised release has time to be
# caught and pulled before it reaches this lockfile
minimumReleaseAge = 259200
```

## `.bun-version`

The installed Bun version alone, such as `1.4.3`, which CI reads to install the same one.

## `.gitignore`

```gitignore
node_modules

# no dotenv files, apart from the examples that list each variable
.env*
!.env.example

# no build output
dist/

# no local Claude Code settings or worktrees
.claude/settings.local.json
.claude/worktrees
```

## `tsconfig.base.json`

The strict baseline every package extends. It names no ambient types, so each package lists its runtime's, such as `bun`, `node`, or `dom`, and code for one runtime cannot reach another's globals.

```json
{
  "$schema": "https://json.schemastore.org/tsconfig.json",
  "compilerOptions": {
    "moduleResolution": "bundler",
    "customConditions": ["@<scope>/source"],
    "moduleDetection": "force",
    "module": "preserve",
    "lib": ["esnext"],
    "target": "esnext",
    "types": [],
    "noEmit": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "strict": true,
    "strictFunctionTypes": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true,
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true
  }
}
```

## `scripts/tsconfig.json`

The root scripts sit outside every workspace, so they get a project of their own, which the root `typecheck` script checks with `bun check -p scripts`.

```json
{
  "$schema": "https://json.schemastore.org/tsconfig.json",
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "types": ["bun"]
  },
  "include": ["./**/*.ts"]
}
```
