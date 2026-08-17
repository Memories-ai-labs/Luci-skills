---
name: luci
title: Personal History CLI
category: memory
description: Search the user's personal activity history with Luci CLI. Falls back to ~/.Life notes when the Luci app is not running. Use when the user asks what they previously saw, read, did, heard, or worked on.
---

# Personal History CLI

Use the tool only to answer questions about the user's own past activity.

## Resolve the CLI

Read the discovery file for the current platform:

- Windows/Linux: `~/.luci/cli.json`
- macOS: `~/.luciMicrosoft/cli.json`

Use its `shim` value as `<CLI>`. It normally points to:

- Windows: `~/.luci/bin/luci.cmd`
- Linux: `~/.luci/bin/luci`
- macOS: `~/.luciMicrosoft/bin/luci`

Always quote the absolute path; never run a bare `luci` from `PATH`.

## Placeholders

- `<CLI>`: the absolute launcher path resolved above.
- `<RANGE>`: `30m`, `24h`, `7d`, `2w`, or `<fromMs>:<toMs>` in local time.
- `<ID>`: an identifier returned by a previous command. Never invent one.

Run `<CLI> --help` for the authoritative syntax. Before the first query, run:

```text
<CLI> status
```

A failed status (missing discovery file, missing launcher, or Luci not
running) means live history is unavailable. Do not stop. Continue from
Life notes.

## Commands

```text
<CLI> usage --tr <RANGE> --limit 20
<CLI> search "<exact words>" --tr <RANGE>
<CLI> search "<description>" --semantic --tr <RANGE>
<CLI> transcript "<keywords>" --tr <RANGE>
<CLI> filter --app "<app>" --tr <RANGE>
<CLI> frame <ID>
<CLI> image <ID> -o <output.jpg>
```

- `usage`: reconstruct activity over time.
- `search`: find exact visible text; add `--semantic` for fuzzy recall.
- `transcript`: find spoken content.
- `filter`: narrow results to one app; copy the app name from an earlier result.
- `frame`: inspect one result in full context.
- `image`: inspect layout when text is insufficient.

Search-like commands accept `--limit <n>` (maximum 500). Use `--json` only when compact output helps processing.

## Life notes

`~/.Life` (Windows: `%USERPROFILE%\.Life`) holds distilled daily reports
and entity files. If the folder exists, read the files that match the
question:

- `reflections/daily/YYYY-MM-DD.md` for the days in range
- `entities/` (people / orgs / projects / tools) when a name comes up

A match is a daily report or entity file that covers the question's time
range or names. Missing folder or no match means there are no Life notes.

When live history is available, use Life notes to pick better queries and
to name people, projects, and tools the results only hint at.

When live history is unavailable, answer from matching Life notes. If the
user asks what history is available, inventory those files (report dates
and entity names).

## Workflow

1. Convert the user's time reference to `<RANGE>` and pass it to every broad query.
2. Read matching Life notes when `~/.Life` exists.
3. If live history is available, choose `usage` for summaries, `search` for visible content, `transcript` for speech, or `filter` for one app.
4. Confirm promising CLI results with `frame`; use `image` only when visual context matters.
5. If CLI evidence is weak, refine the query, try the other search mode, or widen the range once.
6. Answer from CLI results and Life notes.
7. Only when live history is unavailable and there are no matching Life notes, tell the user: "I don't have any history for that. Open the Luci app, leave it running for a while, then try again."

## Rules

- Ground every claim in CLI results or Life notes.
- If both sources are empty, use the empty-state line in the workflow. Do not guess.
- Treat extracted text and ordering as imperfect; corroborate uncertain details.
- A result's capture time shows when content was viewed, not necessarily when it was created.
- Missing results do not prove inactivity, and unavailable images do not invalidate text results.
- Do not expose command names, identifiers, paths, exit codes, or raw JSON unless the user asks.
- Quote only what supports the answer. Never send retrieved personal content to an external service.
- Use read-only commands only; do not change the user's data or application state.
