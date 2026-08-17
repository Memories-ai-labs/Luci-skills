<!-- TODO: banner / logo -->

# Luci Skills

<!-- TODO: one-line pitch -->

<!-- TODO: positioning — what these skills are for, why they exist, what makes them
     different. Matt's version is 3 short paragraphs + a newsletter CTA. -->

## Installation

<!-- TODO (optional): one sentence framing the two paths — plugin = managed read-only
     bundle that updates when we ship; npx skills = editable copies you own. Warn
     against installing both. -->

<details open>
<summary><strong>Claude Code</strong></summary>

```bash
claude plugin marketplace add Memories-ai-labs/Luci-skills
claude plugin install luci-skills
```

Or, from inside a session:

```
/plugin marketplace add Memories-ai-labs/Luci-skills
/plugin install luci-skills
/reload-plugins
```

</details>

<details>
<summary><strong>Codex, and other agents</strong></summary>

```bash
npx skills add Memories-ai-labs/Luci-skills
```

Or install globally, for every project:

```bash
npx skills add Memories-ai-labs/Luci-skills -g
```

Pick which coding agents to install it on. Files land in your repo as ordinary files
you own and can edit. Pull later changes with `npx skills update`.

</details>

<details>
<summary><strong>Or ask your agent</strong></summary>

```
Install this agent skill for me: https://github.com/Memories-ai-labs/Luci-skills
```

</details>

## How to use

1. Install the skills into your coding agent (see above).
2. **Ask what you previously saw, read, did, or heard** — `/luci:luci` searches
   live history through the Luci CLI. If the Luci app is not running, it reads
   matching notes under `~/.Life/` instead. If both are empty, it asks you to
   open the Luci app, leave it running for a while, then try again.
3. **Run `/luci:distill-my-life`** whenever you want to catch up. On the first run
   it creates `~/.Life/` (`reflections/daily/` and `entities/`) if they are
   missing, then pulls each missing day from Luci and writes one report per day
   under `~/.Life/reflections/daily/`. New people, organizations, projects, and
   tools are written under `~/.Life/entities/` without asking. If
   `~/.Life/CLAUDE.md` or `~/.Life/AGENTS.md` already has writing rules, those
   are used.

## Reference

<!-- Descriptions below are the frontmatter `description` of each skill — edit them in
     the SKILL.md, not here. -->

| Skill | Description |
| --- | --- |
| [`/luci:luci`](./skills/official/luci/SKILL.md) | Search personal activity history with the Luci CLI. Falls back to `~/.Life` notes when the Luci app is not running. |
| [`/luci:distill-my-life`](./skills/official/distill-my-life/SKILL.md) | Distill each day's raw activity into an objective daily report under `~/.Life/reflections/daily/`. Creates `~/.Life` if it is missing, and writes new entities under `~/.Life/entities/`. |

## License

MIT — see [LICENSE](LICENSE).
