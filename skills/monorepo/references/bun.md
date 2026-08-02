# Bun workspaces

Bun-specific syntax for the concepts in `SKILL.md`. Read that first; this file only supplies the configuration.

## Root package.json

The root is private, holds no source, and declares the workspace globs and the catalog:

```json
{
  "private": true,
  "type": "module",
  "workspaces": {
    "packages": ["apps/*", "packages/*"],
    "catalog": {
      "@types/bun": "latest",
      "typescript": "^7.0.2",
      "rolldown": "^1.2.1"
    }
  },
  "packageManager": "bun@1.3.14"
}
```

The shorthand `"workspaces": ["apps/*", "packages/*"]` also works, but the object form is required once a catalog is present.

Pin `packageManager` so every machine and CI runner installs with the same Bun version.

## Catalogs

Members reference a catalog-pinned version with the `catalog:` protocol:

```json
{
  "devDependencies": {
    "typescript": "catalog:"
  }
}
```

Named catalogs cover the case where the workspace genuinely needs two versions during a migration:

```json
{
  "workspaces": {
    "catalogs": {
      "next": { "typescript": "^7.0.2" }
    }
  }
}
```

Members opt in with `"typescript": "catalog:next"`. Delete the named catalog once the migration lands, so a stale second version cannot outlive it.

## Internal dependencies

```json
{
  "dependencies": {
    "@workspace/core": "workspace:*"
  }
}
```

`workspace:*` accepts whatever version the local package declares, which is what you want for private packages that are never published. Bun fails the install if no workspace member matches the name, so a typo surfaces immediately instead of falling through to the registry.

## Isolated linker

Set the linker in `bunfig.toml` at the repo root so every install and every CI run agrees:

```toml
[install]
linker = "isolated"
```

The `--linker=isolated` flag does the same for a single run, but committing the config is what keeps machines consistent.

The resulting layout keeps one copy of each resolved version under `node_modules/.bun/` and symlinks declared dependencies into place:

```
node_modules/
├── is-odd -> .bun/is-odd@3.0.1/node_modules/is-odd
└── .bun/
    ├── is-odd@3.0.1/
    └── is-number@6.0.0/
```

`is-number` is a transitive dependency of `is-odd`, so it lives in the store and is reachable from `is-odd`, but no symlink for it appears in the top-level `node_modules/`. Nothing that failed to declare it can import it.

## Installing

```sh
bun install                      # whole workspace
bun install --filter './apps/*'  # one subset
bun install --frozen-lockfile    # CI; fails if the lockfile is stale
```

Run installs from the repo root and commit `bun.lock`.

## Running scripts across members

```sh
bun run --filter '*' typecheck               # every member
bun run --filter '@workspace/core' test      # by package name
bun run --filter './packages/*' build        # by path glob
```

`--filter` accepts package names and path globs, and `-F` is the short form. Output from parallel runs is elided to 10 lines per script by default; `--elide-lines=0` shows all of it.

## Inspecting the graph

```sh
bun pm why <pkg>   # explains why a package is installed
bun list --all     # full dependency tree from the lockfile
```

Reach for `bun pm why` when a package appears in the store that nothing seems to declare, and when deciding whether a version can be dropped from the catalog.
