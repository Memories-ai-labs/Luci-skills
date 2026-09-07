---
name: distill-my-life
title: Daily Distiller
category: memory
description: Distill each day's raw activity into a daily report. Ensures ~/.Life exists, pulls the day's activity via Luci, writes an objective report under ~/.Life/reflections/daily/, and writes new entities under ~/.Life/entities/. Use when the user says "distill", "distill my life", "catch up on daily reports", "summarize the last few days", or first needs the life folders created.
---

<!-- luci-skill-version: 1.2.0 -->

# Distill — daily distillation

Luci's Life page reads these files as data. YAML and `##` headings are
the schema. Prose under a heading is shown as written. Do not invent
fields the schema does not name.

## Step 0: ensure the life file system

The life file system is always under the user's home directory, never
the current repo:

- macOS / Linux: `~/.Life`
- Windows: `%USERPROFILE%\.Life`

Create `~/.Life` if it does not exist. Then ensure this layout:

```
~/.Life/
  reflections/daily/          # daily reports (YYYY-MM-DD.md)
  entities/
    people/                   # people
    orgs/                     # organizations
    projects/                 # projects
    tools/                    # software tools
```

Create any missing directory. Do not ask first. Do not delete or move
anything that is already there. Do not write into the current working
directory.

Then look for a file-system index inside `~/.Life` only:

- If `~/.Life/CLAUDE.md` exists, use it.
- Else if `~/.Life/AGENTS.md` exists, use it.
- If neither exists, continue with the defaults in this skill (English,
  hourly blocks, no external send). Do not create an index file — Luci
  writes both on first launch.

If the index exists, follow its **writing rules**, **daily-report format**,
and **external connector config**. Missing keys fall back to the defaults
above.

## Step 0.5: read the user's rules

Read `~/.Life/RULES.md` if it exists. It is written by hand by the user:
who is who, who and what to leave out, how reports should read.

- Follow it for this whole run. Where it disagrees with the index or with this
  skill, **the rules file wins**.
- If it says to leave a person, app, site, or subject out, that thing does not
  appear anywhere — not in a daily file, not in an entity file, not in the
  final output.
- **Never write to `RULES.md`.** Do not create it, tidy it, reformat it,
  or append what you learned to it. It is the user's document; distill only
  reads it.
- Missing file, or a file you cannot read: continue with the defaults. Do not
  create one.

## Step 1: decide which days to process

- Before writing anything, check whether `~/.Life/reflections/daily/`
  contains any file matching `YYYY-MM-DD.md`. If it contains none, remember
  this — it means today's run may be the first distillation ever on this
  machine, which matters for Step 4.
- Get today's date via Bash (never guess from memory).
- Range: **from the last complete distillation to yesterday**. A daily file
  is complete only when its YAML frontmatter has both `date` and
  `observation`. A file without those keys is missing — write it again.
- Only complete days — yesterday and earlier. **Never process today.**
- Skip a date only when a complete file already exists.
- If the backlog exceeds 7 days, process only the most recent 7 and list
  the skipped dates explicitly at the end.
- A day with no data at all still gets a complete file: YAML plus one
  `observation`, and no `##` capture blocks. **Never fabricate.**
- "No data" means every Luci command for that day exited 0 and returned
  nothing. A command that failed is not a no-data day. See Step 2.

## Step 2: write each daily file

Pull that day's activity via the Luci CLI, then write
`~/.Life/reflections/daily/YYYY-MM-DD.md`. Process days oldest first.

### Pulling a day from Luci

Resolve `<CLI>` exactly as the `luci` skill describes (discovery file,
then PATH). Do not run `status` first: `status` never starts Luci, while
real commands start it in the background and wait for it. The first
`usage` call below is the preflight.

Ranges are epoch milliseconds in local time, `<fromMs>:<toMs>`. Get the
day's midnight from the shell, never from memory:

- macOS: `date -j -f '%Y-%m-%d %H:%M:%S' 'YYYY-MM-DD 00:00:00' +%s` then `* 1000`
- Linux: `date -d 'YYYY-MM-DD 00:00:00' +%s` then `* 1000`
- Windows: `[DateTimeOffset]::new([datetime]'YYYY-MM-DD').ToUnixTimeMilliseconds()`

`toMs` is the next midnight minus 1.

1. Screen: `<CLI> usage --tr <fromMs>:<toMs> --limit 500 --json`. The
   limit is a hard cap and the CLI has no paging, so if exactly 500
   entries come back, rerun per hour (24 ranges) and concatenate.
2. Audio: `<CLI> transcript "<keyword>" --tr <fromMs>:<toMs> --limit 500 --json`
   for the two or three subjects the screen entries show (meeting names,
   project names). There is no "all audio" command.
3. Details: `frame <ID>` only for entries whose text is too thin to place.

Read the exit code of every command:

- `0` with entries: use them.
- `0` with no entries: a real gap. Write the day as no-data if every
  command for that day was empty.
- `3`: your command was malformed. Fix it from `<CLI> --help` and rerun.
  This is never the user's problem.
- `2` with "didn't respond in time" on stderr: rerun that one range once
  with a smaller `--limit` or per-hour ranges. If it fails again, stop.
- `2` with any other message, or `1`: stop.

Stop means: do not write a daily file for this day, do not touch later
days, do not write entities from partial results, and do not fall back to
guessing. Files already written for earlier days stay. Report the day it
happened on and the CLI's stderr line verbatim (it is written for users
and contains no paths). Then wait for the user to fix Luci and rerun.
These failures are not expected when Luci is installed; do not loop on
retries or try other tools.

### YAML (required)

Every daily file starts with this frontmatter. `observation` is one
sentence. Slugs match entity filenames without `.md`. Use `[]` when a
list is empty. Always fold `observation` with `>` so colons in the
sentence cannot break the file:

```yaml
---
date: 2026-08-24
samples: 187
audio_segments: 148
first: "01:21"
last: "23:06"
observation: >
  Only 37 minutes of captured screen time before the 21-hour gap, and all
  of it went into recording and re-recording the same talk.
projects:
  - microsoft-luci-electron
people:
  - matt-pocock
orgs: []
---
```

`samples` is the number of screen entries `usage` returned for the day.
`audio_segments` is the number of distinct transcript segments you saw;
omit it when you ran no transcript query. `first` and `last` are the
local times of the earliest and latest screen entry. Omit a key only
when its source was not queried, never because a command failed (a
failed command means Step 2 stopped and this file is not written).

Do not put a second copy of `observation` below the body. The Life page reads
the YAML field.

### Body

After the frontmatter:

1. `# YYYY-MM-DD (Weekday)` using the English weekday.
2. The screen-memory caveat in one short paragraph.
3. Hourly blocks. Align screen activity and live transcription by
   timestamp. Objective only. If the source is uncertain, leave it out.

Heading grammar is locked. Use an en dash between times. Use an em dash
before a title or a gap label. No other `##` shape:

```
## HH:MM–HH:MM
## HH:MM–HH:MM — title
## HH:MM–HH:MM — no samples ({duration})
```

A gap is a heading only, no body. Never invent hours to fill a gap.
Never use a single timestamp without an end time.

## Step 3: write entities

While summarizing, watch for **people, organizations, projects, and
software tools**.

Read `~/.Life/entities/` first. Write every entity that appeared in that
day's evidence — do not ask:

- people → `~/.Life/entities/people/<slug>.md`
- organizations → `~/.Life/entities/orgs/<slug>.md`
- projects → `~/.Life/entities/projects/<slug>.md`
- software tools → `~/.Life/entities/tools/<slug>.md`

Slug: lowercase ASCII, digits, hyphens. Reuse the existing filename when
the name already has a file (match YAML `name` or the `#` heading).

New file:

```markdown
---
name: Microsoft-Luci-Electron
kind: project
---

# Microsoft-Luci-Electron

- 2026-08-24: eight threads still in flight, including Insights unlock
```

`kind` is `person`, `org`, `project`, or `tool`.

Existing file:

- If YAML is missing, insert `name` / `kind` frontmatter above the
  current body. Do not delete the body.
- If today's date is not already a `- YYYY-MM-DD:` bullet, append one.
- Never edit existing bullets. Never rewrite prose into a summary.

## Step 4: first-time notification

Only when `~/.Life/reflections/daily/` had **no** `YYYY-MM-DD.md` files
before this run (Step 1) **and** Step 2 wrote at least one daily file, add
one congratulations row to Luci's local notification center so it appears
next time the app opens. Do this at most once ever — skip it entirely if an
entry with id `first-distill` already exists.

1. Find Luci's config file:
   - macOS: `~/.luciMicrosoft/luci-config.json`
   - Windows: `%USERPROFILE%\.luci\luci-config.json`
   - Linux: `~/.luci/luci-config.json`
2. If the file does not exist, skip this step — Luci has never run here.
3. Read the whole file as JSON. If it fails to parse, skip this step; never
   overwrite a config file you cannot read.
4. It has a `notifications` key holding an array (treat it as `[]` if
   absent). If any entry in that array already has `"id": "first-distill"`,
   skip — already sent. Otherwise prepend this object to the front of the
   array, touching no other key in the file:

   ```json
   {
     "id": "first-distill",
     "kind": "distill",
     "title": "You just distilled your first day!",
     "body": "Your first daily report is in ~/.Life. Keep it up and Luci will build a real picture of your work over time.",
     "at": <current time as epoch milliseconds>,
     "read": false,
     "to": "/v2/life"
   }
   ```
5. Write the whole JSON object back to the same path, preserving every other
   key exactly as read.

This only makes the row appear the next time the app is opened or restarted
— Luci does not watch this file live.

## Final output

- Which folders were created in Step 0, if any.
- Which days got reports (list the file paths), including days rewritten
  because YAML was missing.
- Which dates were skipped and why.
- If a Luci command failed: the date it failed on, the CLI's message
  verbatim, and that no later day was processed.
- Which entity files were written or appended (if any).
- Whether `~/.Life/RULES.md` was found and applied.
- Whether the Step 4 first-time notification was sent.
- If an external connector is configured in `~/.Life/CLAUDE.md` or
  `~/.Life/AGENTS.md`, send one summary message through it (exactly one
  per run); if not configured, send nothing.
