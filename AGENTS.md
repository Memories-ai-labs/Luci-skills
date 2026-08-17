# Luci Skills — agent instructions

Official and community-reviewed agent skills for Luci. The Luci app ships
`index.json`; Claude Code installs via `.claude-plugin/`.

Same content as `CLAUDE.md`. Edit both when this changes.

## Catalog

`index.json` and `.claude-plugin/plugin.json` are generated. After any change
under `skills/`:

1. Commit the skill files.
2. Run `node scripts/build-index.mjs` (same as `npm run build`).
3. Commit the regenerated catalog files.
4. Confirm with `node scripts/build-index.mjs --check` (`npm run check`).

CI workflow `index` runs that `--check` on every push and PR.

`updatedAt` is each skill path's last git commit time. Generating in the same
commit as the skill change writes the previous commit time — or the file mtime
if the path is new. After that commit, CI sees the new timestamp and fails.
Commit skills first, then regenerate.

## Skill files

Each published skill is `skills/<tier>/<name>/SKILL.md`.

- `tier` is `official` or `community`
- directory `name` is kebab-case and equals frontmatter `name`
- frontmatter needs `description`; `category` is one of `productivity`,
  `memory`, `writing`, `coding`, `other` (default `other`)
- community skills also need `author`
- the prompt is the markdown body after the frontmatter

Edit descriptions in the SKILL.md. The README table copies those descriptions;
update it when adding, removing, or renaming a skill.
