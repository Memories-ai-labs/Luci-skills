# Luci Skills

Reviewed agent skills for Claude Code, Codex and Cursor. Plain `SKILL.md` files —
no runtime, no lock-in, readable before you install them.

- `skills/official/` — maintained by the Luci team.
- `skills/community/` — submitted through the Luci app and reviewed before landing here.

The same catalog is browsable inside Luci (Skills Market), which ships a generated
copy of [`index.json`](index.json) so browsing works offline.

## Install

**All official skills** (Claude Code) — **two commands**. A marketplace is a catalog:
adding it lets Claude Code see what's here, installing is a separate step.

```
/plugin marketplace add OpenInterX-Products/luci-skills
/plugin install luci-skills@luci
```

Then `/reload-plugins`. The skills show up namespaced, e.g.
`/luci-skills:daily-focus-planner`.

`luci` is the marketplace name and `luci-skills` the plugin name — both come from
[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json), not from the
repo name. If you added the marketplace before a skill was published, run
`/plugin marketplace update luci` first.

**One skill** (Claude Code, Codex, Cursor — one command, and the CLI writes it into
the right folder for you):

```
npx skills add OpenInterX-Products/luci-skills --skill daily-focus-planner
```

**Or just ask your agent**, pasting the skill's directory URL:

```
Install this agent skill for me: https://github.com/OpenInterX-Products/luci-skills/tree/main/skills/official/daily-focus-planner
```

## What's here

| Skill | Tier | What it does |
| --- | --- | --- |
| [daily-focus-planner](skills/official/daily-focus-planner) | official | Turns a task list into a realistic plan for today. |
| [memory-distiller](skills/official/memory-distiller) | official | Pulls durable facts, decisions and follow-ups out of raw notes. |
| [life-memory-distiller](skills/official/life-memory-distiller) | official | Distills each day into a layered personal memory vault. Uses Luci's local screen memory over MCP. |
| [pull-request-reviewer](skills/community/pull-request-reviewer) | community | Reviews a change for correctness, risk and maintainability. |
| [plain-language-editor](skills/community/plain-language-editor) | community | Makes dense writing clear without losing meaning. |

## Contributing

Submit through **Luci → Skills Market → Submit a skill**. Submissions land in a review
queue; approved ones are committed here with your name on them. Pull requests are
welcome too — same bar either way.

### Skill format

One directory per skill, one `SKILL.md` inside it:

```markdown
---
name: daily-focus-planner        # kebab-case, must equal the directory name
description: Turn a busy task list into a realistic plan. Use when the user asks to plan a day.
category: productivity           # productivity | memory | writing | coding | other
title: Daily Focus Planner       # optional; derived from `name` if absent
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
