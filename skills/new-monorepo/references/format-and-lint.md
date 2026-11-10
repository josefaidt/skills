# Formatting and lint

Examples for the formatting and lint step.

## `.oxfmtrc.jsonc`

```jsonc
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "semi": false,
  "sortImports": {
    "groups": ["type", "builtin", "external", ["parent", "sibling", "index"]],
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
