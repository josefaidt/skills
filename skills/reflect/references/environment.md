# The environment

The environment is everything a future agent reads or runs before it acts. Each kind of file has a job, and a lesson lands in the one whose job it is.

## Implementation and review

Work goes through two stages. The implementing agent carries the most context: it explores, writes code, and debugs. The reviewing agent receives a diff and needs little else. So the reviewer enforces coding standards, and a rule the implementer must hold in mind while working is a rule that a check or a review should carry instead.

## Files

| File | Job |
| :-- | :-- |
| `AGENTS.md` or `CLAUDE.md` | Loaded into every session, so it holds little beyond pointers to other files. A long one is itself a finding: move its rules into standards, checks, or skills |
| Coding standards | Judgment calls the reviewer enforces. A rule a tool could check belongs in the tool |
| Automated checks | Lint rules, hooks, and CI jobs that fail on mechanical mistakes, so no one has to remember them |
| `GLOSSARY.md` | The domain terms code, docs, and conversation share |
| Requirements and design documents | What the product does, which the user approves, and how it is built, which an agent owns. A question the user answered mid-session belongs in one of them |
| Docs | Reference material other files point to. Look for an existing doc before writing a new one |
| Skills | Procedures and guidance loaded when their description matches. Keep each self-contained, with no issue numbers or another skill's step numbers, so another repository can use it |
| Memory | Notes one agent keeps for one user on one machine. Nobody else reads them, so a lesson for everyone belongs in one of the files above |
