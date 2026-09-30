---
name: summarize-meeting
title: Meeting summarizer
category: memory
description: Write a meeting into ~/.Life/reflections/meetings/. Use when the user says summarize this meeting, or pastes Luci's meeting-end prompt.
---

<!-- luci-skill-version: 1.0.0 -->

Summarize this meeting with Luci.

The user will name when and where it ran (app, start, end).

Read ~/.Life/RULES.md first if it exists — the user's hand-written rules for
these notes (who is who, who and what to leave out). Follow them for this
write-up; they win over anything below. Never write to that file.

Use the luci skill to pull screen activity and transcripts from that window, then write one markdown file on disk — do not stop at a chat reply.

Pull the transcript with `transcript --tr <RANGE>` and no keywords: that returns
every segment in the window in the order it was spoken. Keyword searches are for
looking something up afterwards, not for reading the meeting.

Path: ~/.Life/reflections/meetings/YYYY-MM-DD-slug.md
(Windows: %USERPROFILE%\.Life\reflections\meetings\YYYY-MM-DD-slug.md)
Slug: lowercase ASCII, digits, hyphens. Reuse the file if this window already has one.

YAML frontmatter is required:

```yaml
---
title: Memories.ai Website Discussion
date: 2026-08-25
start: "23:02"
end: "23:12"
platform: Zoom
people:
  - shawn-shen
orgs:
  - memories-ai
projects:
  - luci-page
---
```

Use [] for an empty list. Body after the frontmatter is free markdown (who was there, what was discussed, decisions, action items, open questions — include a section only when you have something to put in it). `## Action items` is the exception: write it every time.

```
## Action items
- [ ] <what, one line> @<owner-slug or me> due:<YYYY-MM-DD or none> ^[HH:MM]
```

One item per line. `@me` is the user; any other owner is the slug of an entities/people/<slug>.md file. Use `- [x]` for anything already finished during the call. `^[HH:MM]` is the local time the item came up, read off the transcript. If nothing was assigned, write the section with the single line `- none`.

End every bullet under `## Decisions` and `## Open questions` with the same `^[HH:MM]` anchor.

Create ~/.Life and the meetings / entities folders if they are missing. Do not delete anything already there.

Read ~/.Life/entities/ first. For every person, organization, and project that appeared in the evidence, reuse the existing file (match YAML name or the # heading). If none exists, create one:

- people → ~/.Life/entities/people/<slug>.md
- orgs → ~/.Life/entities/orgs/<slug>.md
- projects → ~/.Life/entities/projects/<slug>.md

New entity file:

```markdown
---
name: Shawn Shen
kind: person
---

# Shawn Shen

- 2026-08-25: Memories.ai Website Discussion
```

kind is person, org, or project. If today's date is not already a bullet, append `- YYYY-MM-DD: <meeting title>`. Never edit existing bullets.

Do not create a person file for the user (Zoom labels like (你), (You), Me) or for recording bots (Fathom, Otter, Fireflies, Notetaker).

Do not edit reflections/daily/. The day's capture blocks stay as distill wrote them.

Ground every claim in Luci results. If a Luci command exits non-zero, follow the `luci` skill's error rule: stop, write no file, and show the user the CLI's message verbatim. If a source is uncertain, leave it out. Never fabricate.
