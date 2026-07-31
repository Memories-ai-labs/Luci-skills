<!-- TODO: banner / logo -->

# Luci Skills

<!-- TODO: one-line pitch -->

<!-- TODO: positioning — what these skills are for, why they exist, what makes them
     different. Matt's version is 3 short paragraphs + a newsletter CTA. -->

## Installation

<!-- TODO (optional): one sentence framing the two paths — plugin = managed read-only
     bundle that updates when we ship; npx skills = editable copies you own. Warn
     against installing both. -->

### 1. Get the skills

<details open>
<summary><strong>Claude Code</strong></summary>

```bash
claude plugin marketplace add OpenInterX-Products/luci-skills
claude plugin install luci-skills
```

Or, from inside a session:

```
/plugin marketplace add OpenInterX-Products/luci-skills
/plugin install luci-skills
/reload-plugins
```

Skills are namespaced by the plugin: `/luci:distill`.

The `marketplace add` line is one-time. It is needed because this marketplace is
self-hosted; plugins in Claude Code's official marketplace skip it.

**Recommended: turn on auto-update.** Self-hosted marketplaces don't auto-update by
default. Enable it once — `/plugin` → **Marketplaces** → **luci** → **Enable
auto-update** — and every push to this repo reaches you automatically (no version
bumps needed on our side; the plugin is unversioned so each commit counts as a new
release). Without it, update manually:

```
/plugin marketplace update luci
/plugin update luci-skills@luci
/reload-plugins
```

</details>

<details>
<summary><strong>Codex, and other agents</strong></summary>

```bash
npx skills add OpenInterX-Products/luci-skills --skill distill
```

Pick which coding agents to install it on. Files land in your repo as ordinary files
you own and can edit. Pull later changes with `npx skills update`.

</details>

<details>
<summary><strong>Or ask your agent</strong></summary>

```
Install this agent skill for me: https://github.com/OpenInterX-Products/luci-skills/tree/main/skills/official/distill
```

</details>

### 2. Set up the life file system

1. Luci installed with Screen Memory on — `distill` reads screen activity and
   transcriptions over Luci's MCP server.
2. In the directory where you want your daily reports and entity files to live, run
   `/luci:setup-luci-skills` once. It asks about your writing rules, report format,
   and notification connectors, then records everything in that repo's CLAUDE.md /
   AGENTS.md. `distill` reads that file on every run.

## Why This Exists

<!-- TODO: yours. Matt's format, repeated per problem:
       ### #1: <the failure mode, in the user's words>
       > quote
       **The Problem**. …
       **The Fix** is to use:
       - [`/luci:xxx`](./skills/…/SKILL.md) — one line
     He has 4. Two or three is plenty. -->

## Reference

<!-- Descriptions below are the frontmatter `description` of each skill — edit them in
     the SKILL.md, not here. -->

| Skill | Description |
| --- | --- |
| [`/luci:distill`](./skills/official/distill/SKILL.md) | Distill each day's raw activity into an objective daily report under `reflections/daily/`, and surface new entities for confirmation. |
| [`/luci:setup-luci-skills`](./skills/official/setup-luci-skills/SKILL.md) | Configure the life file system. Run once before first use of the other luci skills. |

## Manage

| Goal | Command |
| --- | --- |
| List installed plugins | `claude plugin list` |
| Components + token cost | `claude plugin details luci` |
| Pull the latest skills | `claude plugin marketplace update luci && claude plugin update luci-skills@luci` |
| Uninstall | `claude plugin uninstall luci-skills` |

Two naming quirks, both verified against the CLI: `install` / `list` / `uninstall` take
`luci-skills`, while `claude plugin details` takes `luci` (the namespace name). Add
`@luci` — `install luci-skills@luci` — only if another marketplace you added also
publishes a `luci-skills`.

## Contributing

Submit through **Luci → Skills Market → Submit a skill**. Approved submissions are
committed here with your name on them. Pull requests welcome — same bar either way.

<!-- TODO (optional): what gets accepted and what does not. -->

### Skill format

One directory per skill, one `SKILL.md` inside it:

```markdown
---
name: review-pr                  # kebab-case, must equal the directory name; keep it SHORT
                                 # — it is the skill namespace: /luci:review-pr
description: Review a code change for risk and correctness. Use when asked to review a PR.
category: coding                 # productivity | memory | writing | coding | other
title: Pull Request Reviewer     # optional display name; where the long, readable name goes
author: Your Name                # required for community skills
---

The prompt itself goes here, as the body.
```

`description` is the only thing an agent reads when deciding whether to use the skill —
say when to use it, not just what it is.

### Before you commit

```bash
node scripts/build-index.mjs
```

Regenerates [`index.json`](index.json) and
[`.claude-plugin/plugin.json`](.claude-plugin/plugin.json), and validates every skill:
kebab-case name matching its directory, non-empty description and body, known category,
community author present. CI runs `--check` and fails when either generated file is
stale — the Luci app ships `index.json`, so a stale one ships stale skills.

```bash
claude plugin validate .
```

Anthropic's review pipeline runs the same validator. It warns that `plugin.json` has
no `version` — that is deliberate, not an oversight: an unversioned git-sourced plugin
resolves its version from the commit SHA, so every push is update-detectable without
anyone remembering to bump a number. Don't add a `version` field, and don't use
`--strict` (it promotes that warning to an error).

## License

MIT — see [LICENSE](LICENSE).
