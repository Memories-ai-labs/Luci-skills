---
name: distill-my-life
title: Daily Distiller
category: memory
description: Distill each day's raw activity into a daily report. Ensures ~/.Life exists, pulls the day's activity via Luci, writes an objective report under ~/.Life/reflections/daily/, and writes new entities under ~/.Life/entities/. Use when the user says "distill", "distill my life", "catch up on daily reports", "summarize the last few days", or first needs the life folders created.
---

# Distill — daily distillation

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
  hourly blocks, no external send). Do not create an index file.

If the index exists, follow its **writing rules**, **daily-report format**,
and **external connector config**. Missing keys fall back to the defaults
above.

## Step 1: decide which days to process

- Get today's date via Bash (never guess from memory).
- Range: **from the last distillation to yesterday**. "Last distillation" is
  the date in the newest filename under `~/.Life/reflections/daily/`; if the
  directory is empty, start from the earliest day that has data.
- Only complete days — yesterday and earlier. **Never process today.**
- Only fill in dates still missing a report under `~/.Life/reflections/daily/`;
  skip existing ones.
- If the backlog exceeds 7 days, process only the most recent 7 and list
  the skipped dates explicitly at the end.
- A day with no data at all gets a minimal "no data" report (one line).
  **Never fabricate.**

## Step 2: summarize each day

For each day, pull that day's activity via Luci and write
`~/.Life/reflections/daily/YYYY-MM-DD.md`:

- **Divide the day into hourly blocks.** Align screen activity and real-time
  transcription (meeting/voice transcripts) by timestamp before summarizing —
  the two sources must corroborate each other, not be written up separately.
- Purely objective description: what was done, what tools were used, who was
  interacted with. No judgment, no extrapolation, no advice.
- If the source is uncertain, leave it out.
- **Mandatory caveat**: screen-memory only samples while the **screen is
  on**; daytime gaps are usually offline meetings, commuting, or sleep, so
  **screen time is an underestimate**. State this in every report, and never
  read a gap as "not working."
- Close with **one honest sentence**: an honest observation grounded in real
  data (sleep schedule, late nights, context-switch density). Tell the
  truth — no sugarcoating, no platitudes.

## Step 3: write new entities

While summarizing, watch for **people, organizations, projects, and
software tools**.

Read `~/.Life/entities/` first. Write every entity that appeared in that
day's evidence — do not ask:

- people → `~/.Life/entities/people/<slug>.md`
- organizations → `~/.Life/entities/orgs/<slug>.md`
- projects → `~/.Life/entities/projects/<slug>.md`
- software tools → `~/.Life/entities/tools/<slug>.md`

New file: a `# Name` heading and one `- YYYY-MM-DD: context` bullet.
Existing file: append a bullet. Never invent. Never rewrite.

## Final output

- Which folders were created in Step 0, if any.
- Which days got reports (list the file paths).
- Which dates were skipped and why.
- Which entity files were written or appended (if any).
- If an external connector is configured in `~/.Life/CLAUDE.md` or
  `~/.Life/AGENTS.md`, send one summary message through it (exactly one
  per run); if not configured, send nothing.
