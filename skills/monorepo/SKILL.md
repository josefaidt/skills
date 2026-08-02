---
name: monorepo
description: Structure and maintain a JavaScript or TypeScript monorepo. Covers the apps and packages split and when code belongs in each, promoting shared code to a package, pinning shared dependency versions in one place, and isolated node_modules to prevent phantom dependencies. Load the matching reference file for package-manager syntax. Use when setting up a monorepo, deciding where new code belongs, adding or upgrading a dependency across packages, or debugging a resolution failure.
---

# Monorepo

Structure for a workspace repo: what lives where, how packages depend on each other, and how installs resolve. The rules here hold across package managers. Syntax lives in the reference files.

For scaffolding an individual package, load `new-typescript-package`. For file-level TypeScript rules, load `writing-typescript`.

## Reference files

| File                | Use when                                                                                                        |
| :------------------ | :-------------------------------------------------------------------------------------------------------------- |
| `references/bun.md` | Working in a Bun workspace: `workspaces` and catalog config, `workspace:*`, `bunfig.toml` linker, filtered runs |

Check the repo's lockfile and `packageManager` field before reaching for a reference file. Only Bun is documented here. For any other package manager, apply the concepts below and confirm the syntax against its own docs rather than assuming it matches Bun's.

## Layout

```
.
├── apps/
│   ├── web/
│   └── cli/
├── packages/
│   ├── core/
│   └── config/
├── package.json
└── tsconfig.base.json
```

`apps/*` holds deployable units. An app is something you run: a server, a CLI, a site, a worker. It sits at the top of the dependency graph, nothing imports it, and it owns environment config, entrypoints, and deploy manifests.

`packages/*` holds shared libraries. A package is something you import. It has an entrypoint other workspace members consume, no deploy target, and no knowledge of which app is calling it.

The split keeps the dependency graph acyclic and legible. Packages depend on packages, apps depend on packages, and nothing depends on an app. When that holds, you can tell what a change touches by walking one direction through the graph.

## Where new code goes

Two rules keep the split from drifting:

1. Code shared by two or more apps moves to `packages/`. The second consumer is the trigger, not the first.
2. An app never imports from another app. If two apps need the same code, it is a package.

Do not create a package for code with one consumer that is unlikely to gain a second. A package costs a manifest, a tsconfig, a version-bump surface, and an indirection every reader has to follow. Leave the code in the app until a real second consumer appears.

When promoting code out of an app, move the whole unit rather than re-exporting from the original location. A package that exists alongside a shim in the app it came from leaves two import paths for the same symbol, and new code picks whichever it finds first.

## Internal dependencies

Declare dependencies between workspace members explicitly in the consuming package's manifest, using the workspace protocol so the package manager links the local directory instead of resolving from the registry. An edit in a package is then visible to its consumers with no rebuild and no publish step.

Declare them even though the files sit right there in the repo. The manifest is what makes the graph inspectable, drives filtered builds and installs, and tells the linker what to expose.

## Shared dependency versions

Pin the version of a dependency shared by multiple packages in one place at the root, and have members reference it by name rather than restating a range. An upgrade is then one edit instead of one per package, and version skew across the workspace becomes impossible to introduce by accident.

Promote a dependency to the root once a second package needs it. A dependency used by exactly one package is pinned in that package.

Most package managers call this a catalog. See the reference file for the syntax and for opting a package into a different version during a migration.

## Isolated node_modules

Install with an isolated layout rather than a hoisted one.

A hoisted install flattens every transitive dependency into the root `node_modules/`, which makes them all importable from every package. Code then compiles against a package it never declared, and the day the real dependent drops it the import breaks with no diff that explains why. This is the phantom dependency problem, and it is worse in a monorepo because one package's dependency silently becomes every package's.

An isolated install puts each resolved package in a content-addressed store and symlinks only declared dependencies into each `node_modules/`. A package can import exactly what its manifest lists, and an undeclared import fails on the machine that introduced it rather than in someone else's CI weeks later.

Run installs from the repo root so the lockfile covers the whole graph, commit the lockfile, and have CI install in frozen mode so a stale lockfile fails the build instead of being silently rewritten.

### Migrating an existing repo

Switching a hoisted workspace to isolated surfaces every phantom dependency at once, so expect a batch of resolution failures on the first install. Each one names a package being imported without being declared. Add it to the importing package's manifest, promoting it to the root catalog if a second package already uses it, and re-run. Do this in its own commit, separate from feature work.

### When to stay hoisted

A tool that scans `node_modules/` by walking directories rather than resolving through Node, some legacy bundler plugins and native toolchains among them, can trip on the symlink layout. Confirm the failure comes from the linker before reverting, since the same error usually means a genuinely missing declaration.

## Shared TypeScript config

`tsconfig.base.json` at the root holds the compiler options every package shares. Each member extends it and adds only what differs, usually `types` and `include`. See `writing-typescript` for the options themselves.

Imports of workspace members resolve through the install symlinks, so they type-check against local source with no path aliases. Do not add `compilerOptions.paths` entries for workspace members. They duplicate what the linker already provides and drift the moment a package is renamed.
