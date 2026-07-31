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

## License

MIT — see [LICENSE](LICENSE).
