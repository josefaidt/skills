# Focus topics

A focus topic is anything the user wants more thought on than the sweep gives, such as a recurring failure, a part of the environment they distrust, or a question about how the repository is set up. It adds to the sweep and never narrows it.

For each topic:

1. Trace every moment in the session that touches it, including the ones that went well, and read the files that govern it, even those the session never opened.
2. Find the root cause: what the environment told the agent, or failed to tell it. Stop at a cause a change to the environment could fix, not at the agent's mistake.
3. Weigh the topic against every row of the routing table rather than the first that fits, and compare at least two ways to address it, with what each costs to maintain. A new script is code someone maintains, so prefer a line in an existing tool's configuration, and a check that repeats another layer's replaces that copy rather than adding one more.
4. When the session holds no evidence on the topic, say so, and reason from the repository and earlier sessions rather than inventing a lesson.

A topic can conclude that nothing should change. Say so with the reasons rather than proposing a weak change to fill the slot.

Report each topic in its own section after the Accepted, Rejected, and Backlog lists, with the reasoning and any proposals in the same form as Accepted, so a topic never displaces a more severe finding from the sweep. A finding both reach appears once, under its topic.
