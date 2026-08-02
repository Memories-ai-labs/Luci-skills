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

1. **Pick a folder** for your life file system — a fresh directory, or an existing
   repo — and install the skills there (see above).
2. **Run `/luci:setup-luci-skills` once** in that folder. It asks how you want your
   reports written, then creates `reflections/daily/` and `entities/` and records
   your answers in that folder's `CLAUDE.md` / `AGENTS.md`.
3. **Run `/luci:distill`** whenever you want to catch up. It reads that config,
   pulls each missing day from Luci, and writes one report per day.

Step 2 is one-time; step 3 is the daily loop.

## Reference

<!-- Descriptions below are the frontmatter `description` of each skill — edit them in
     the SKILL.md, not here. -->

| Skill | Description |
| --- | --- |
| [`/luci:distill`](./skills/official/distill/SKILL.md) | Distill each day's raw activity into an objective daily report under `reflections/daily/`, and surface new entities for confirmation. |
| [`/luci:setup-luci-skills`](./skills/official/setup-luci-skills/SKILL.md) | Configure the life file system. Run once before first use of the other luci skills. |

## License

MIT — see [LICENSE](LICENSE).
