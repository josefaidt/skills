# Running a reflection checkpoint

The coordinator runs each checkpoint itself. Each task session reflects on its own work, while its corrections are still in its context. The coordinator vets what they propose against the whole repository, the owner approves one batch, and the coordinator applies it. The owner reviews changes and never runs a reflection.

## 1. Ask each session to reflect

Send every task session since the last checkpoint the same message at once, so they run in parallel. Its first line is `/reflect` followed by the lessons that recurred, as focus topics. The rest of the message says:

> The coordinator is running this reflection checkpoint, not the owner. Report the Accepted, Rejected, and Backlog lists and each focus topic in full, each proposal with its file and exact wording. Edit nothing, file nothing, and ask no questions. The coordinator vets every proposal against the rest of the repository, takes them to the owner, and applies what the owner approves.

A session whose reflection skill doesn't load from the message gets a second message telling it to read that skill's `SKILL.md` and follow it, with the same instructions. A session that is archived or gone can't reflect, so name it to the owner.

A session's turn-end note quotes only the start of its report. Read the whole report from its transcript before vetting it.

## 2. Vet every proposal

The reflecting session saw one task. The coordinator sees the whole effort, so it checks what the session couldn't. A proposal that fails a check is dropped, rewritten until it passes, or brought to the owner as a choice.

| Check | How |
| :-- | :-- |
| It isn't said already | Read the destination file whole. When a rule exists and the session broke it, the finding is why the session never read it or why nothing enforced it, and a second copy of the rule fixes neither |
| It contradicts nothing | Search the repository's steering file, contributing guide, standards, design documents, decision records, and skills for the same topic. A line that disagrees with any of them, or with a decision the owner made, is rewritten to agree or dropped |
| It goes with the grain | It follows the conventions the repository already uses and the reasons recorded for them. A lesson that pulls toward a pattern the project rejected on purpose is dropped, however well it worked elsewhere |
| It breaks nothing | Run a proposed check or lint rule against the whole tree, and a proposed hook once. A check that flags existing code ships with those fixes in the same change. Search the code for what a written rule forbids: scope the rule so it doesn't ban code that is right, and file a task for each place that breaks it |
| It lands in the right place | A lesson one repository needs goes in that repository's docs. A change to a shared skill goes to the skill's source repository, with nothing private from this one. An owner document's text is the owner's |
| It earns its place | Weigh what the miss cost and how often it will recur against what the change costs to keep. A line in a file every session loads costs every session |
| The sessions agree | Merge the same lesson from several sessions into one proposal. When two sessions propose different fixes for one problem, pick one and say why |

Add the coordinator's own lessons, such as errors in its briefs that a session caught, and vet them the same way.

## 3. Bring the owner one batch

Write one message. For each proposal, give:

1. Take or skip, as your recommendation.
2. The problem, and what it cost.
3. The file, and the exact wording or check.
4. What could go wrong, and what you checked to rule it out.

Then list each proposal you or a session dropped, in a line each with its reason, including those where you overruled a session, so the owner can bring one back. Ask the decisions together in one question dialog.

## 4. Apply what the owner approves

The coordinator makes the approved changes itself, since several sessions' proposals often touch one file. Changes to this repository go in one pull request, which merges once CI passes like any other. A change to a shared skill goes in a pull request to the skill's source repository. Re-vendor the skill once that pull request merges. Approving the wording approves the merge.
