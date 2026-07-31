#!/usr/bin/env node
/**
 * Generate two files from every `skills/**\/SKILL.md` in this repo:
 *
 *   • `.claude-plugin/plugin.json` — the plugin manifest Claude Code reads when
 *     installing. Its `skills` array must list every skill directory, so it is
 *     generated rather than hand-maintained (hand-maintained lists drift: the
 *     repo this layout is modelled on ships a path whose directory is gone).
 *     `version` is copied from package.json so there is one version to bump.
 *
 *   • `index.json` — the machine-readable catalog. The Luci desktop app pulls it
 *     (via its own `pnpm skills:sync`) and ships the result inside its bundle,
 *     so browsing the in-app market needs no network.
 *
 * Regenerate and commit both in the same commit as any skill change — CI fails
 * otherwise.
 *
 *   node scripts/build-index.mjs          # write both files
 *   node scripts/build-index.mjs --check  # verify they are up to date (CI)
 */
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const INDEX_PATH = path.join(ROOT, "index.json");
const MANIFEST_PATH = path.join(ROOT, ".claude-plugin", "plugin.json");
const PACKAGE_PATH = path.join(ROOT, "package.json");

const REPO = "OpenInterX-Products/luci-skills";
const BRANCH = "main";
/** Marketplace `name` in .claude-plugin/marketplace.json. */
const MARKETPLACE = "luci";
/**
 * TWO names, deliberately different — Claude Code allows it and each one is
 * optimized for where it is read:
 *
 *   • INSTALL_NAME is the marketplace entry's `name`, i.e. what users type:
 *     `claude plugin install luci-skills`. Branded and searchable.
 *   • PLUGIN is `plugin.json`'s `name`, i.e. the skill NAMESPACE, so every
 *     skill reads `/luci:plan-day`. Short, because it is paid for in every
 *     single skill listing.
 */
const INSTALL_NAME = "luci-skills";
const PLUGIN = "luci";
const CATEGORIES = new Set(["productivity", "memory", "writing", "coding", "other"]);
/** Directories under `skills/` that are published, and what they mean. */
const TIERS = { official: true, community: false };

const problems = [];
function problem(where, message) {
  problems.push(`${where}: ${message}`);
}

/** Minimal frontmatter reader — `key: value` pairs, no nesting, no lists. */
function parseSkillFile(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) return null;
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    // Tolerate quoted values; descriptions often contain a colon.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    meta[key] = value;
  }
  return { meta, body: match[2].trim() };
}

/** "daily-focus-planner" → "Daily Focus Planner" */
function titleFromName(name) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Last commit time of a path, or null outside a git checkout. */
async function lastCommitTime(target) {
  try {
    const { stdout } = await run("git", ["log", "-1", "--format=%cI", "--", target], {
      cwd: ROOT,
    });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

async function listDirs(parent) {
  const entries = await readdir(parent, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

const skills = [];

for (const [tier, official] of Object.entries(TIERS)) {
  const tierDir = path.join(SKILLS_DIR, tier);
  for (const dir of (await listDirs(tierDir)).sort()) {
    const repoPath = `skills/${tier}/${dir}`;
    const file = path.join(tierDir, dir, "SKILL.md");
    const text = await readFile(file, "utf8").catch(() => null);
    if (text === null) {
      problem(repoPath, "no SKILL.md");
      continue;
    }

    const parsed = parseSkillFile(text);
    if (!parsed) {
      problem(repoPath, "SKILL.md has no --- frontmatter --- block");
      continue;
    }
    const { meta, body } = parsed;

    if (!meta.name) problem(repoPath, "frontmatter is missing `name`");
    if (meta.name && meta.name !== dir) {
      problem(repoPath, `frontmatter name "${meta.name}" must equal the directory name`);
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(dir)) {
      problem(repoPath, "directory name must be kebab-case");
    }
    if (!meta.description) problem(repoPath, "frontmatter is missing `description`");
    if (!body) problem(repoPath, "SKILL.md has no body — the prompt is the body");

    const category = meta.category ?? "other";
    if (!CATEGORIES.has(category)) {
      problem(repoPath, `unknown category "${category}" (allowed: ${[...CATEGORIES].join(", ")})`);
    }
    if (!official && !meta.author) {
      problem(repoPath, "community skills must credit an `author`");
    }

    // Falls back to the file's own mtime so a fresh, uncommitted skill still
    // gets a plausible date instead of an empty string.
    const updatedAt =
      (await lastCommitTime(repoPath)) ?? (await stat(file)).mtime.toISOString();

    skills.push({
      name: dir,
      title: meta.title ?? titleFromName(dir),
      description: meta.description ?? "",
      content: body,
      category,
      official,
      authorName: meta.author ?? (official ? "Luci" : ""),
      repoPath,
      updatedAt,
    });
  }
}

if (skills.length === 0) problem("skills/", "no skills found");

const names = new Set();
for (const skill of skills) {
  if (names.has(skill.name)) problem(skill.repoPath, `duplicate skill name "${skill.name}"`);
  names.add(skill.name);
}

if (problems.length > 0) {
  console.error("build-index failed:");
  for (const line of problems) console.error(`  • ${line}`);
  process.exit(1);
}

// Official first, then most recently updated first — the same order the app
// shows, so a human reading index.json sees the shelf order.
// Name is the tiebreaker: skills committed together share one timestamp, and
// index.json has to be byte-stable or `--check` fails on unrelated changes.
skills.sort((a, b) => {
  if (a.official !== b.official) return a.official ? -1 : 1;
  const byDate = Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  return byDate !== 0 ? byDate : a.name.localeCompare(b.name);
});

const previous = await readFile(INDEX_PATH, "utf8").catch(() => null);
// `generatedAt` would change on every run and make --check useless, so it is
// carried over unless the catalog itself changed.
const catalogChanged =
  previous === null ||
  JSON.stringify(JSON.parse(previous).skills ?? null) !== JSON.stringify(skills);
const generatedAt = catalogChanged
  ? new Date().toISOString()
  : JSON.parse(previous).generatedAt;

// `plugin` and `marketplace` are the two halves of the `/plugin install`
// identifier, and `plugin` is also the skill namespace. Both are published so
// consumers (the Luci app) build the install commands from data instead of
// hardcoding names that a rename would silently break.
const next = `${JSON.stringify(
  {
    repo: REPO,
    branch: BRANCH,
    marketplace: MARKETPLACE,
    installName: INSTALL_NAME,
    plugin: PLUGIN,
    generatedAt,
    skills,
  },
  null,
  2,
)}\n`;

// --- .claude-plugin/plugin.json -------------------------------------------
// The manifest Claude Code reads on install. `skills` lists every skill
// directory; `version` mirrors package.json so a release bumps one number.
const pkg = JSON.parse(await readFile(PACKAGE_PATH, "utf8"));
const manifest = {
  name: PLUGIN,
  version: pkg.version,
  description: pkg.description,
  author: { name: "Luci", url: `https://github.com/${REPO}` },
  homepage: `https://github.com/${REPO}`,
  repository: `https://github.com/${REPO}`,
  license: pkg.license,
  keywords: pkg.keywords,
  // Sorted by path so the file is stable regardless of catalog ordering.
  skills: skills.map((skill) => `./${skill.repoPath}`).sort(),
};
const nextManifest = `${JSON.stringify(manifest, null, 2)}\n`;
const previousManifest = await readFile(MANIFEST_PATH, "utf8").catch(() => null);

const stale = [
  ...(previous !== next ? ["index.json"] : []),
  ...(previousManifest !== nextManifest ? [".claude-plugin/plugin.json"] : []),
];

if (process.argv.includes("--check")) {
  if (stale.length > 0) {
    console.error(
      `${stale.join(" and ")} out of date — run \`node scripts/build-index.mjs\` and commit the result.`,
    );
    process.exit(1);
  }
  console.log(`index.json and plugin.json are up to date (${skills.length} skills).`);
} else {
  await writeFile(INDEX_PATH, next, "utf8");
  await writeFile(MANIFEST_PATH, nextManifest, "utf8");
  const official = skills.filter((skill) => skill.official).length;
  console.log(
    `wrote index.json + .claude-plugin/plugin.json — ${skills.length} skills (${official} official, ${skills.length - official} community)`,
  );
}
