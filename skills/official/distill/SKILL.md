---
name: distill
title: Daily Distiller
category: memory
description: Distill each day's raw activity into a daily report. Pulls the day's activity via Luci MCP, writes an objective report under reflections/daily/, and surfaces new entities for user confirmation. Use when the user says "distill", "catch up on daily reports", or "summarize the last few days".
---

# Distill — daily distillation

## Step 1: read the index

Read the file-system index in `CLAUDE.md` (or `AGENTS.md`) at the repo root
to confirm the structure of `reflections/daily/` and `entities/`, and follow
the **writing rules**, **daily-report format**, and **external connector
config** recorded there. If the index doesn't exist, tell the user to run
`setup-luci-skills` first, then stop.

## Step 2: decide which days to process

- Get today's date via Bash (never guess from memory).
- Range: **from the last distillation to yesterday**. "Last distillation" is
  the date in the newest filename under `reflections/daily/`; if the
  directory is empty, start from the earliest day that has data.
- Only complete days — yesterday and earlier. **Never process today.**
- Only fill in dates still missing a report under `reflections/daily/`;
  skip existing ones.
- If the backlog exceeds 7 days, process only the most recent 7 and list
  the skipped dates explicitly at the end.
- A day with no data at all gets a minimal "no data" report (one line).
  **Never fabricate.**

## Step 3: summarize each day

For each day, pull that day's activity via Luci MCP and write
`reflections/daily/YYYY-MM-DD.md`:

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

## Step 4: confirm new entities

While summarizing, watch for four kinds of new entities: **software tools,
people, projects, organizations**.

1. Read the existing entries under `entities/` (people / orgs / projects).
2. List the entities that appeared this run but aren't recorded yet
   (name + one line of context + date seen) and send the list to the user.
3. **The user decides** which ones go into `entities/` — never write them
   automatically. Persist only after confirmation.

## Final output

- Which days got reports (list the file paths).
- Which dates were skipped and why.
- The list of new entities awaiting user confirmation (if any).
- If an external connector is configured in CLAUDE.md/AGENTS.md, send one
  summary message through it (exactly one per run); if not configured,
  send nothing.
