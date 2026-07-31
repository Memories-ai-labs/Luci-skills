---
name: setup-luci-skills
title: Setup Luci Skills
category: memory
description: Configure the file system of user's life. Run once before first use of the other luci skills.
disable-model-invocation: true
---

# Setup — initialize the Luci life file system

Target directory structure:

```
reflections/daily/          # daily reports (YYYY-MM-DD.md)
entities/
  people/                   # people
  orgs/                     # organizations
  projects/                 # projects
CLAUDE.md or AGENTS.md      # file-system index + Agent skills section
```

## 1. Explore

Look at the repo's actual state. Read whatever exists; don't assume:

- Is there a `CLAUDE.md` at the root? An `AGENTS.md`?
- Does the existing one already have an `## Agent skills` section?
- Which of `reflections/daily/`, `entities/`, and its subdirectories
  already exist?

## 2. Present findings and ask

Report what's present and what's missing. Then ask the user everything in
one round (don't split across multiple turns):

1. **Directory handling**: fill in the standard structure above, or
   customize?
2. **Writing rules**: preferences for daily reports and entity files —
   language (Chinese/English), tone, level of detail, any topics never to
   write down.
3. **Daily-report format**: internal structure of
   `reflections/daily/YYYY-MM-DD.md` — free-form prose, fixed sections
   (e.g. "Work / Communication / Other"), or bullet lists? Frontmatter or
   not?
4. **External connectors**: after distillation, send a summary through a
   connected connector (email, Discord, Slack, …)? To which address or
   channel? If unconfigured, the default is: don't send.

## 3. Confirm and edit

Before writing, show the user a draft and let them edit:

- The `## Agent skills` block to append to CLAUDE.md / AGENTS.md
- The file-system index section (what each directory holds, the daily
  report naming format)

## 4. Write

Pick the file to edit:

- If `CLAUDE.md` exists → edit it.
- Else if `AGENTS.md` exists → edit it.
- If neither exists → **ask the user** which one to create; don't pick
  for them.
- Never create AGENTS.md when CLAUDE.md already exists (or vice versa) —
  always edit the one that's already there.

What to write (every answer from step 2 lands here; later skills read only
this file and never re-ask the user):

1. File-system index: the purpose of `reflections/daily/` (daily reports,
   YYYY-MM-DD.md) and `entities/people|orgs|projects/` (entity files).
2. **Writing rules**: the confirmed language, tone, level of detail, and
   never-write topics.
3. **Daily-report format**: the confirmed internal structure (include a
   minimal example template).
4. **External connectors**: which connector, where to send, and what the
   summary covers; if unconfigured, state "no sending" explicitly.
5. The `## Agent skills` block: list distill and the other luci skills,
   with a one-line trigger description each.

Finally, create any missing directories and report what was created and
what was changed.
