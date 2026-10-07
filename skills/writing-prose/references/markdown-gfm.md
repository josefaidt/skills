# GitHub Flavored Markdown (GFM) Authoring Standard

Syntax rules for writing markdown across the repo. Always use [GitHub Flavored Markdown](https://github.github.com/gfm/) — no exceptions.

`SKILL.md` governs how prose reads (voice, sentence construction, paragraph leads). This file governs how markdown is formatted (fences, lists, headings, tables).

## Code blocks

- Always use fenced code blocks with triple backticks
- Always specify the language identifier
- Never use indented code blocks

```typescript
// Good — fenced with language
const example = "always specify language"
```

## Lists

- Use `-` for unordered lists (never `*` or `+`)
- Use `1.` for ordered lists with proper sequential numbering
- Never start a line with `1/`, `2/`, or another `N/` marker; it renders as plain text, not a list. `N/` belongs only inside a running paragraph (see "Lists vs prose" in `SKILL.md`)
- Add blank lines between list items that contain multiple paragraphs
- Use 2 spaces for nested list indentation
- When nesting under ordered lists, use ordered lists (not unordered)
- When nesting under unordered lists, use unordered lists (not ordered)

```markdown
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

1. First ordered item
   1. Nested ordered item
   2. Another nested ordered item
2. Second ordered item
3. Third ordered item
```

## Tables

- Always use pipe tables with proper alignment
- Include header separator row with hyphens
- Align columns using colons (`:---`, `:---:`, `---:`)

```markdown
| Left Aligned | Center Aligned | Right Aligned |
| :----------- | :------------: | ------------: |
| text         |      text      |          text |
| more text    |   more text    |     more text |
```

## Links and images

- Use inline links for most cases: `[text](url)`
- Use reference-style links for repeated URLs
- Always include alt text for images
- Use angle brackets for automatic links: `<https://example.com>`

```markdown
[Inline link](https://example.com)

[Reference link][ref]

[ref]: https://example.com

![Alt text for image](image.png)

<https://example.com>
```

## Task lists

- Use GFM task list syntax: `- [ ]` and `- [x]`
- Add space after the closing bracket
- Can be nested within other lists

```markdown
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task
  - [x] Nested completed task
  - [ ] Nested incomplete task
```

## Strikethrough

Use double tildes: `~~strikethrough~~`.

## Emphasis

- `*italic*` for italics
- `**bold**` for bold
- `***bold italic***` for bold italic
- Never use underscores for emphasis

## Headings

- Use ATX-style headings (`#`), never setext-style
- Add blank line before and after headings
- Don't skip heading levels
- Add space after `#` symbols

```markdown
# Heading 1

Content paragraph.

## Heading 2

More content.

### Heading 3

Even more content.
```

## Line breaks and paragraphs

- Use blank lines to separate paragraphs
- Never use trailing spaces for line breaks
- Use `<br>` only when absolutely necessary (rare)

## Autolinks

- Email: `<email@example.com>`
- URL: `<https://example.com>`

## Inline code

- Use single backticks: `` `code` ``
- For code containing backticks, use multiple backticks: ``` ``code with `backtick` `` ```

## Blockquotes

- Use `>` for blockquotes
- Can be nested with multiple `>`
- Can contain other markdown elements

```markdown
> This is a blockquote.
>
> It can span multiple paragraphs.

> > Nested blockquote
```

## Forbidden syntax

- No HTML (except `<br>` when absolutely required)
- No indented code blocks (use fenced blocks)
- No setext-style headings (underlined with `=` or `-`)
- No underscore emphasis (`_italic_` or `__bold__`)
- No reference-style footnotes (not in GFM spec)

## File structure

1. Title (H1) — exactly one per document
2. Brief introduction paragraph
3. Table of contents (for documents >3 sections)
4. Content sections with H2/H3/H4 hierarchy
5. Conclusion or next steps (if applicable)

## Validation checklist

Before completing any markdown file, verify:

- [ ] All code blocks use triple backticks with language identifiers
- [ ] All lists use `-` for unordered, `1.` for ordered
- [ ] No line or paragraph begins with an `N/` marker
- [ ] All tables are properly formatted with alignment
- [ ] No HTML except necessary `<br>` tags
- [ ] Headings follow proper hierarchy (no skipped levels)
- [ ] No trailing whitespace
- [ ] Blank lines before and after headings
- [ ] Space after `#` in headings
- [ ] No underscore emphasis

## Notes

- This standard applies to all markdown files unless explicitly told otherwise
- When in doubt, check the GFM spec: <https://github.github.com/gfm/>
- Consistency is more important than personal preference
