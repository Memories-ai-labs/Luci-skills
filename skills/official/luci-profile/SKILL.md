---
name: luci-profile
title: Luci Profile
category: memory
description: Write or rewrite ~/.Life/profile.md, the user's Luci profile, from their daily reports, meeting write-ups and entities. Use when a distill run says the profile is due, or when the user asks to write, refresh or redo their Luci profile.
---

<!-- luci-skill-version: 1.0.0 -->

# Luci profile

Luci's Life page reads `~/.Life/profile.md` as data: the frontmatter keys are
fields, the `##` headings are fixed, and each bullet is split into parts on
its first ` — `, its ` · ` and its `[ / ]`. Keep that shape exactly, or the
page drops the line.

Windows: `%USERPROFILE%\.Life\profile.md`.

## When it runs

Usually at the end of a distill, after the daily files and entities are
written. The distill prompt then says which kind of write this is:

- **First profile**: read every daily file, meeting write-up and entity in
  the folder.
- **Weekly rewrite**: the same, weighting the last 7 days most, and add the
  `## This week, you changed` section at the end.

If the prompt gives today's date, the user's name, or questions the user
already answered, use them as given. Asked directly with no distill prompt,
write a first profile unless one already exists, in which case do a weekly
rewrite.

Overwrite the file if it exists. Luci has already kept a copy of the previous
version.

## Rules

- It describes the user to their own coding agent and to them. Second person,
  present tense, objective, and only what the files support. Never invent a
  number, a name or a project.
- Follow `~/.Life/RULES.md`: anything it says to leave out stays out of the
  profile too, and anything under "Answers you gave Luci" is settled — use it
  and never ask it again. Never write to that file; Luci adds the answers.
- If the prompt names the user, keep the `name:` line it gives in the
  frontmatter exactly as written. Otherwise leave `name:` out.
- If the current profile.md has a `## Confirmed by you` section, the user
  confirmed those lines: treat them as facts, and copy the section unchanged
  right after Not sure.

## Shape

```markdown
---
luci_profile: 1
name: <only when the prompt gives it>
updated: <today, YYYY-MM-DD>
days: <number of daily files you read>
hours: <recorded hours across them, one decimal>
make: <0-100: share of working time spent making things (code, writing, design) rather than meeting, chatting, or reviewing>
switch: <0-100: how often focus switches between apps and tasks; 0 = long deep blocks, 100 = constant switching>
peak_hour: <0-23: local hour that starts the most productive window>
headline: >
  <one sentence about what they do and how, under 30 words>
---

## Summary

<3-4 sentences. Wrap the 2-3 phrases a reader may want proof for in **bold**.>

## Working on

- [<Project name>](<project-entity-slug>) · <hours>h — <what it covers> ^[YYYY-MM-DD HH:MM] ^[YYYY-MM-DD HH:MM]

## How you work

- <short figure, e.g. 27 min> — <one sentence: focus blocks, peak window, share of chat/social apps, meetings>

## People

- [<Name>](<person-entity-slug>) — <what they are to the user, from the notes>

## Tools

- <App or tool name>

## Not sure

- <A yes/no question about something you inferred but cannot confirm>? — <why you think so> [<Answer if your guess is right> / <Answer if it is wrong>]
```

Weekly rewrite only, at the end:

```markdown
## This week, you changed

<One sentence comparing this week with the previous profile.>
- + <new project or person> — <detail>
- ↑ <something that grew> — <before → after>
- ↓ <something that shrank> — <before → after>
- − <something that went quiet> — <detail>
```

## Limits

- Up to 4 Working on items, 4 How you work lines, 5 people, 8 tools and 2
  Not sure questions.
- Every Working on item carries 1-3 `^[YYYY-MM-DD HH:MM]` moments taken from
  the daily files' blocks.
- In each Not sure line the first answer means your guess is right and the
  second means it is wrong.
