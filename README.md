# Luci Skills

Agent skills for people whose computer remembers their day. Plain `SKILL.md` files —
no runtime, no lock-in, readable before you install them.

Most skill collections work on what you paste into the chat. These work on what
already happened: Luci records your screen and meetings **on your own machine**, and
exposes them to your agent over MCP. So a skill can ask "what did I actually do
Tuesday?" instead of asking you to remember. Two of the skills here need Luci for
that; the rest are ordinary skills that work anywhere.

- `skills/official/` — maintained by the Luci team.
- `skills/community/` — submitted through the Luci app and reviewed before landing here.

The same catalog is browsable inside Luci (Skills Market), which ships a generated
copy of [`index.json`](index.json) so browsing works offline.

## Install

Two ways in, two philosophies. **The Claude Code plugin** installs the whole official
set as a managed, read-only bundle that updates when we ship — you subscribe rather
than fork. **`npx skills`** copies editable skill files into your project, so you can
hack on them and make them your own. Pick one; installing both leaves you with every
skill twice.

<details open>
<summary><strong>Claude Code — the whole official set</strong></summary>

From a terminal:

```bash
claude plugin marketplace add OpenInterX-Products/luci-skills
claude plugin install luci-skills
```

Or from inside a session:

```
/plugin marketplace add OpenInterX-Products/luci-skills
/plugin install luci-skills
/reload-plugins
```

Skills then show up namespaced: `/luci:plan-day`.

Why two commands? A marketplace is a *catalog*. Plugins in Claude Code's official
marketplace need no `add` step because that catalog ships pre-registered; this one is
self-hosted, so it gets registered once and then never again.

Why is the install name `luci-skills` but the skills `/luci:…`? Two different fields,
each tuned for where it is read: the install name comes from the marketplace entry in
[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json), the skill
namespace from `name` in the generated
[`.claude-plugin/plugin.json`](.claude-plugin/plugin.json) — kept short because it is
repeated in front of every skill.

</details>

<details>
<summary><strong>Codex, Cursor, and other agents — one skill or all of them</strong></summary>

```bash
npx skills add OpenInterX-Products/luci-skills --skill plan-day
```

Drop `--skill` to pick interactively from the whole list. This writes the skills into
your repo as ordinary files you own and can edit; nothing updates behind your back.
Pull our latest changes when you want them with `npx skills update`.

</details>

<details>
<summary><strong>Or just ask your agent</strong></summary>

Paste the skill's directory URL and let the agent do it:

```
Install this agent skill for me: https://github.com/OpenInterX-Products/luci-skills/tree/main/skills/official/plan-day
```

</details>

### Before you run `distill-day`

It is the one skill with prerequisites, because it reads your real day rather than
your prompt:

1. **Luci installed, with Screen Memory on.** The skill queries capture timestamps
   over Luci's MCP server. Without it, the on-device timeline is simply empty and the
   skill says so instead of inventing one.
2. **A vault directory.** The prompt carries a literal `<VAULT_PATH>` placeholder —
   replace it with a real path (e.g. `~/memory-vault`) the first time you run it, or
   tell the agent the path when it asks. The skill creates the layout on first run.

Everything else — `plan-day`, `distill-notes`, `review-pr`, `plain-english` — runs
with no setup.

## Reference

Each skill is one directory, one `SKILL.md`, readable in under a minute. Click through
before you install; that is the point of shipping them as plain files.

### Official

| Skill | What it is for | Needs Luci |
| --- | --- | --- |
| [`/luci:plan-day`](skills/official/plan-day/SKILL.md) | Turns a messy task list into three must-win outcomes and time blocks, and names the one task to start now. Use when the day already feels lost. | no |
| [`/luci:distill-notes`](skills/official/distill-notes/SKILL.md) | Pulls durable facts, decisions-with-rationale, and owned follow-ups out of raw notes, and marks what is uncertain instead of smoothing it over. | no |
| [`/luci:distill-day`](skills/official/distill-day/SKILL.md) | Builds one timestamp-aligned timeline of your day from calendar, screen memory, chat and mail, then distills it into a layered memory vault — projects, people, workflows, character. Not an activity log. | **yes** |

### Community

| Skill | What it is for | Author |
| --- | --- | --- |
| [`/luci:review-pr`](skills/community/review-pr/SKILL.md) | Reviews a change for correctness, edge cases, security and maintainability, prioritized by impact, ending in an explicit approve / request-changes. | Maya Chen |
| [`/luci:plain-english`](skills/community/plain-english/SKILL.md) | Makes dense writing direct without flattening the author's voice, and asks before changing the argument. | Jordan Lee |

## Manage

| Goal | Command |
| --- | --- |
| See what is installed | `claude plugin list` |
| See components + token cost | `claude plugin details luci` |
| Pull the latest skills | `claude plugin marketplace update luci` |
| Remove it | `claude plugin uninstall luci-skills` |

Two naming quirks worth knowing, both verified against the CLI: `install`, `list` and
`uninstall` take `luci-skills`, but `claude plugin details` takes the namespace name
(`details luci-skills` reports "not found"). And add `@luci`
(`install luci-skills@luci`) only if another marketplace you have added also publishes
a `luci-skills`.

## Contributing

Submit through **Luci → Skills Market → Submit a skill**. Submissions land in a review
queue; approved ones are committed here with your name on them. Pull requests are
welcome too — same bar either way.

What gets accepted: a skill that does one job, states plainly when it should fire, and
does not need a runtime. What does not: prompt-engineering tricks with no task behind
them, anything that phones home, and anything that only works with a paid third-party
service.

### Skill format

One directory per skill, one `SKILL.md` inside it:

```markdown
---
name: plan-day                   # kebab-case, must equal the directory name; keep it SHORT
                                 # — it is the skill namespace: /luci:plan-day
description: Turn a busy task list into a realistic plan. Use when the user asks to plan a day.
category: productivity           # productivity | memory | writing | coding | other
title: Daily Focus Planner       # optional display name; where the long, readable name goes
author: Your Name                # required for community skills
---

The prompt itself goes here, as the body.
```

`description` is the only thing an agent reads when deciding whether to use the
skill — say **when to use it**, not just what it is. That single line is the difference
between a skill that fires on its own and one the user has to remember.

### Before you commit

```bash
node scripts/build-index.mjs
```

That regenerates [`index.json`](index.json) and
[`.claude-plugin/plugin.json`](.claude-plugin/plugin.json), and validates every skill:
kebab-case name matching its directory, non-empty description and body, known
category, community author present. CI runs `--check` and fails if either generated
file is stale — the app ships `index.json`, so a stale one silently ships stale skills.

Before opening a PR, also run Claude Code's own validator, the same one Anthropic's
review pipeline runs:

```bash
claude plugin validate . --strict
```

## License

MIT — see [LICENSE](LICENSE).
