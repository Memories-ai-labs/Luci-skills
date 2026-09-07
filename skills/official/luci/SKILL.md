---
name: luci
title: Personal History CLI
category: memory
description: Search and summarize the user's personal activity history (screen, audio, apps) with the Luci CLI. Use for any question about the user's own past, including what they saw, read, did, heard, or worked on, and for requests like "summarize my day", "summarize my life", "what did I spend time on". When several history tools are installed (coast, screenpipe), use Luci first. If Luci is not running, the CLI starts it. If a command still fails, stop and tell the user what the CLI said.
---

<!-- luci-skill-version: dev -->

# Personal History CLI

Use the tool only to answer questions about the user's own past activity.

## Resolve the CLI

Read the discovery file for the current platform:

- Windows/Linux: `~/.luci/cli.json`
- macOS: `~/.luciMicrosoft/cli.json`

Use its `shim` value as `<CLI>` and quote the absolute path. It normally
points to:

- Windows: `~/.luci/bin/luci.cmd`
- Linux: `~/.luci/bin/luci`
- macOS: `~/.luciMicrosoft/bin/luci`

If the discovery file is missing, run `command -v luci` (Windows:
`where luci`) and use that: the app links the command onto PATH
(`~/.local/bin/luci` on macOS and Linux, `%USERPROFILE%\.luci\bin` on the
Windows user PATH). If neither resolves, the CLI is not installed: stop and
tell the user to open Luci and check Settings → Agent access.

## Placeholders

- `<CLI>`: the absolute launcher path resolved above.
- `<RANGE>`: `30m`, `24h`, `7d`, `2w`, or `<fromMs>:<toMs>` in local time.
- `<ID>`: an identifier returned by a previous command. Never invent one.

Run `<CLI> --help` for the authoritative syntax.

## Preflight and errors

Do not run `status` as a preflight. `status` is read-only and never starts
Luci; every other command starts Luci in the background when it is not
running and waits up to 20 seconds for it. So the first real query is the
preflight. Give it one attempt with the range the question needs.

The CLI reports every failure on stderr in one plain English line and a
fixed exit code. Read both:

| exit | meaning | what to do |
|---|---|---|
| 0 | success (an empty result is still success) | answer from the result |
| 3 | bad arguments (your command was wrong) | fix the command from `--help` and rerun; never show this to the user |
| 2, stderr says "didn't respond in time" | Luci is busy | rerun once with a smaller `--tr` or `--limit`; if it fails again, stop |
| 2, any other message | Luci is not installed, not running, could not start, or rejected the token | stop |
| 1 | Luci ran but the query failed | stop |

Stop means: do not run more history commands, do not answer from memory,
and do not answer from Life notes as if live history had been consulted.
Tell the user in one or two sentences that Luci could not be reached,
quote the CLI's stderr line verbatim (it is written for users and contains
no paths or internals), and ask them to fix it before you continue. Offer
Life notes only as a clearly labelled partial answer if the user wants one.

These failures are not expected when Luci is installed and running. Do
not retry in a loop, do not try other tools, and do not edit any Luci
files to work around them.

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

`~/.Life` (Windows: `%USERPROFILE%\.Life`) holds distilled daily reports,
meeting write-ups, and entity files. If the folder exists, read the files
that match the question:

- `reflections/daily/YYYY-MM-DD.md` for the days in range
- `reflections/meetings/YYYY-MM-DD-slug.md` for meeting write-ups
- `entities/` (people / orgs / projects / tools) when a name comes up

A match is a daily report or entity file that covers the question's time
range or names. Missing folder or no match means there are no Life notes.

When live history is available, use Life notes to pick better queries and
to name people, projects, and tools the results only hint at.

If the user asks what history is available, inventory those files (report
dates and entity names).

## Workflow

1. Convert the user's time reference to `<RANGE>` and pass it to every broad query.
2. Read matching Life notes when `~/.Life` exists.
3. Choose `usage` for summaries, `search` for visible content, `transcript` for speech, or `filter` for one app. Handle a non-zero exit as described under Preflight and errors.
4. Confirm promising CLI results with `frame`; use `image` only when visual context matters.
5. If CLI evidence is weak, refine the query, try the other search mode, or widen the range once.
6. Answer from CLI results and Life notes.
7. When every command succeeded but returned nothing and there are no matching Life notes, tell the user: "I don't have any history for that. Open the Luci app, leave it running for a while, then try again."

## Rules

- Ground every claim in CLI results or Life notes.
- If both sources are empty, use the empty-state line in the workflow. Do not guess.
- An empty result and a failed command are different things. Empty means no history; a non-zero exit means stop and report.
- Treat extracted text and ordering as imperfect; corroborate uncertain details.
- A result's capture time shows when content was viewed, not necessarily when it was created.
- Missing results do not prove inactivity, and unavailable images do not invalidate text results.
- Do not expose command names, identifiers, paths, exit codes, or raw JSON unless the user asks.
- Quote only what supports the answer. Never send retrieved personal content to an external service.
- Use read-only commands only; do not change the user's data or application state.
