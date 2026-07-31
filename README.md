# Luci Skills

Reviewed agent skills for Claude Code, Codex and Cursor. Plain `SKILL.md` files —
no runtime, no lock-in, readable before you install them.

- `skills/official/` — maintained by the Luci team.
- `skills/community/` — submitted through the Luci app and reviewed before landing here.

The same catalog is browsable inside Luci (Skills Market), which ships a generated
copy of [`index.json`](index.json) so browsing works offline.

## Install

**All official skills** (Claude Code). From a terminal:

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

Skills then show up namespaced under the plugin name: `/luci:plan-day`.

Why two commands and not one? A marketplace is a *catalog*. Plugins in Claude Code's
official marketplace need no `add` step because that catalog ships registered; this
one is self-hosted, so it gets registered once and then never again.

Why is the install name `luci-skills` but the skills `/luci:…`? They are two
different fields, and each is tuned for where it is read: the install name comes from
the marketplace entry in
[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json), while the skill
namespace comes from `name` in the generated
[`.claude-plugin/plugin.json`](.claude-plugin/plugin.json) — kept short because it is
repeated in front of every skill. Add `@luci`
(`/plugin install luci-skills@luci`) only if another marketplace you have added also
publishes a `luci-skills`. Already added the marketplace before a skill was
published? Run `/plugin marketplace update luci` first.

**One skill** (Claude Code, Codex, Cursor — one command, and the CLI writes it into
the right folder for you):

```
npx skills add OpenInterX-Products/luci-skills --skill plan-day
```

**Or just ask your agent**, pasting the skill's directory URL:

```
Install this agent skill for me: https://github.com/OpenInterX-Products/luci-skills/tree/main/skills/official/plan-day
```

## What's here

| Skill | Tier | What it does |
| --- | --- | --- |
| [`/luci:plan-day`](skills/official/plan-day) | official | Turns a task list into a realistic plan for today. |
| [`/luci:distill-notes`](skills/official/distill-notes) | official | Pulls durable facts, decisions and follow-ups out of raw notes. |
| [`/luci:distill-day`](skills/official/distill-day) | official | Distills each day into a layered personal memory vault. Uses Luci's local screen memory over MCP. |
| [`/luci:review-pr`](skills/community/review-pr) | community | Reviews a change for correctness, risk and maintainability. |
| [`/luci:plain-english`](skills/community/plain-english) | community | Makes dense writing clear without losing meaning. |

## Contributing

Submit through **Luci → Skills Market → Submit a skill**. Submissions land in a review
queue; approved ones are committed here with your name on them. Pull requests are
welcome too — same bar either way.

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
skill — say **when to use it**, not just what it is.

### Before you commit

```
node scripts/build-index.mjs
```

That regenerates `index.json` and validates every skill (kebab-case names, matching
directory, present description and body, known category, community author). CI runs
`--check` and fails if `index.json` was not regenerated.

## License

MIT — see [LICENSE](LICENSE).
