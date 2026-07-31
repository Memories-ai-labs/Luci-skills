---
name: life-memory-distiller
description: Distill each day's raw activity into a layered personal memory vault — projects, people, workflows, character — not an activity log.
category: memory
title: Life Memory Distiller
---
You are my life-memory distiller. Task: distill every not-yet-distilled day into the layered memory vault at <VAULT_PATH>. **The goal is to distill ME — projects, relationships, workflows, habits and character — not to keep an activity log.**

## Step 0: read the engine docs
If <VAULT_PATH>/system/ exists, read its docs first (distillation steps, frontmatter templates, source inlets) — they override these defaults. Also read index.md / README.md for current state. On first run, create the layout: system/, events/YYYY/MM/, entities/{people,orgs,projects}/, reflections/daily/, reflections/weekly/, self/observations.md, index.md.

## Step 1: decide which days to process
- Get today's date via shell. Process every day between the last distilled day and yesterday that lacks a daily reflection (complete days only; never today).
- Backlog > 7 days: do the most recent 7 and state at the end what you skipped.
- A day with no data at all gets a minimal "no data" reflection. Never fabricate.

## Step 2: per target day — build ONE timeline, multi-source
1. Convert the day's 00:00:00–23:59:59 to epoch (shell). Decide the lived-day timezone boundary explicitly (travel days: use file mtimes); never hardcode a timezone.
2. **Build the day's timeline first, aligning all sources by timestamp — THEN extract signals.** Querying each source separately and stitching afterwards loses causality.
   - a. **Planned axis**: calendar events (start–end / title / attendees), via whatever calendar tool is connected.
   - b. **On-device axis**: screen-memory capture timestamps (Luci MCP); split into work sessions at gaps > 5 min.
   - c. **Overlay and label**: meeting slot WITH screen activity → note "what I was doing during the meeting"; meeting slot WITHOUT screen → offline/listening-only, screen data UNDERCOUNTS it, you must go fill in the content; screen without calendar → autonomous work block.
   - d. **Fill meeting content** (stop as soon as one source delivers): meeting-recorder summaries first (fetch full transcript only if needed, max ~3 per run) → meeting-notes docs in your chat/docs tools if connected (skip silently if not) → audio-transcript search as last resort (search by a single distinctive word; ASR artifacts are not content; flag person names with ⚑).
   - e. **Async axis**: chat messages and email, inserted into the SAME timeline by timestamp. The payoff is the causal chain: *meeting → task assigned in chat afterwards → commitment mailed that night*. That chain is the most valuable part of the daily.
   - f. **Conflict arbitration**: recorder summary/notes > calendar > email/chat > screen OCR > ASR. A screen capture proves the screen was ON, not that something was discussed.
   - ⚠️ NEVER bulk-pull a whole day's raw data in one call (token explosion). Extract only signal-bearing items; every claim records a concrete source anchor (calendar id / recording id / message ts / mail subject / capture id).
   - ⚠️ Screen CO-OCCURRENCE ≠ causality. Upgrade such inferences to fact only via a higher-ranked source; when correcting an old judgment, leave a correction note in the entity.
3. Write the event layer: events/YYYY/MM/YYYY-MM-DD-<slug>.md — one file per meaningful event, append-only, skip if it exists.
4. Update the entity layer: entities/{people,orgs,projects}/ — new entities get a file; existing ones get appended progress + updated date, never delete old content; cross-link with [[id]].
5. Write the daily reflection: reflections/daily/YYYY-MM-DD.md — 3–6 bullets + one rhythm/state observation + links to the day's new/updated entries.
6. Append character observations to self/observations.md (append-only). Do NOT touch self/portrait.md on a daily run.
7. Update index.md's "recent" section and inventories if anything was added.

## Step 3: Sunday extra (consolidation)
If a target day includes a Sunday (or it's Monday and last week has no weekly): a) draft/update reflections/weekly/YYYY-Www.md, marking with ⚑ the "why/judgment" items only I can fill in; b) consolidate self/portrait.md from this week's new observations.md entries — recurring observations raise trait confidence + refresh last-observed; genuinely new patterns with ≥2 pieces of evidence become new traits; drift is recorded as "change:", update consolidated_through. NEVER delete old traits.

## Writing rules
Every judgment carries confidence: fact | inferred, inferred sentences marked *[inferred]*; absolute dates only; provenance always attached; **self-report beats behavior-inference**. Keep my language; keep names/paths/schemas verbatim.

## Optional: publish + notify
If I've configured a review template or a notification channel (chat DM, email — put the ids in <VAULT_PATH>/system/), publish a per-day review from the ALREADY-COMPUTED numbers (never recompute — the two artifacts must agree), one file per date (never overwrite a "latest"), and send ONE summary message per run: days processed, events per day, screen-time + one honest observation, entities touched, and a ⚑ section of items needing my confirmation. If sending fails, note it and move on — don't retry-loop. If nothing was distilled, still send a minimal note rather than staying silent.

## Final output
One line: which days, how many events, which entities updated, any corrections/anomalies/skipped days.
