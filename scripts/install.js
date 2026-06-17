#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const readline = require("readline");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const pluginName = "hicode";
const marketplaceName = "hicode";
const skillNames = ["hi", "init", "scope", "tdd", "review", "release"];
const agentNames = [
  "requirement-reviewer",
  "coding-planner",
  "tdd-guide",
  "coding-assistant",
  "code-reviewer",
  "security-reviewer",
  "java-reviewer",
  "release-reviewer",
];
const hicodeSkillsLabel = "hicode-hi, hicode-init, hicode-scope, hicode-tdd, hicode-review, hicode-release";

const state = {
  installClaude: false,
  installOpenCode: false,
  installCodex: false,
  installMoss: false,
  check: false,
  uninstall: false,
  dryRun: false,
  yes: false,
  installScope: "user",
  openCodeScope: "user",
  openCodeConfigDir: process.env.OPENCODE_CONFIG_DIR || path.join(os.homedir(), ".config", "opencode"),
  openCodeProjectDir: process.cwd(),
  codexScope: "user",
  codexUserMarketplacePath:
    process.env.CODEX_MARKETPLACE_PATH || path.join(os.homedir(), ".agents", "plugins", "marketplace.json"),
  codexUserPluginRoot: process.env.CODEX_PLUGIN_ROOT || path.join(os.homedir(), "plugins"),
  codexProjectDir: process.cwd(),
  mossAgentId: "zhangdalong",
};

function usage() {
  process.stdout.write(`hicode Coding Agent installer

Usage:
  install.sh [--uninstall] [--claude-code] [--opencode] [--codex] [--all] [--scope user|local|project] [--opencode-scope user|project] [--codex-scope user|project] [--dry-run] [--yes]
  pwsh ./install.ps1 [-Uninstall] [-ClaudeCode] [-OpenCode] [-Codex] [-All] [-Scope user|local|project] [-OpenCodeScope user|project] [-CodexScope user|project] [-DryRun] [-Yes]
  node scripts/install.js [same long options as install.sh]

Options:
  --uninstall           Remove hicode from the selected target platform(s).
  --claude-code          Target the hicode Claude Code plugin.
  --opencode            Target hicode agents and skills for OpenCode.
  --codex               Target the hicode Codex plugin through a local marketplace.
  --moss                Target hicode skills and agents for Moss (learned-skills).
  --moss-agent-id       Moss agent ID. Default: zhangdalong.
  --all                 Target all supported platforms (Claude Code, OpenCode, Codex, Moss).
  --scope               Claude Code scope. Default: user.
  --opencode-scope      OpenCode scope: user or project. Default: user.
  --opencode-config-dir OpenCode user config directory. Default: $OPENCODE_CONFIG_DIR or ~/.config/opencode.
  --opencode-project-dir
                       Target project directory for --opencode-scope project. Default: current directory.
  --codex-scope        Codex plugin scope: user or project. Default: user.
  --codex-project-dir  Target project directory for --codex-scope project. Default: current directory.
  --check               Verify hicode installation on Moss. Run after install + server restart.
  --dry-run             Print the operation plan without changing user configuration.
  --yes                 Run without interactive confirmation. Without platform flags, defaults to Claude Code.
  -h, --help            Show this help.

Platform support:
  Linux/macOS/WSL/Git Bash/MSYS/Cygwin: use ./install.sh or node scripts/install.js.
  Windows PowerShell: use ./install.ps1 or node scripts/install.js.

When no platform flag is specified and --yes is not used, an interactive menu prompts
for platform selection. With --yes and no platform flag, Claude Code is installed by default.

This installer supports Claude Code plugin installation, OpenCode local agents/skills installation,
Codex plugin installation through a local marketplace, and Moss learned-skills installation.
With --uninstall, it removes only
hicode-owned plugin entries, bundles, and hicode-* OpenCode/Moss assets.
It exposes only Claude Code plugin assets, Codex plugin skill assets, or transformed OpenCode runtime assets.
It does not install this repository's docs/ or archive/ as runtime assets.
It does not scan projects, generate CLAUDE.md or AGENTS.md, or create .hicode/.
`);
}

function log(message = "") {
  process.stdout.write(`${message}\n`);
}

function die(message) {
  process.stderr.write(`Error: ${message}\n`);
  process.exit(1);
}

function quote(value) {
  return `"${String(value).replaceAll('"', '\\"')}"`;
}

function commandExists(command) {
  const checker = process.platform === "win32" ? "where" : "command";
  const args = process.platform === "win32" ? [command] : ["-v", command];
  return spawnSync(checker, args, { stdio: "ignore", shell: process.platform !== "win32" }).status === 0;
}

function requireCommand(command) {
  if (!commandExists(command)) die(`Required command not found: ${command}`);
}

function requireDir(target, message) {
  if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) die(`${message}: ${target}`);
}

function requireFile(target, message) {
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) die(`${message}: ${target}`);
}

function validateScope() {
  if (!["user", "local", "project"].includes(state.installScope)) {
    die(`Invalid --scope value: ${state.installScope}. Expected user, local, or project.`);
  }
}

function validateOpenCodeScope() {
  if (!["user", "project"].includes(state.openCodeScope)) {
    die(`Invalid --opencode-scope value: ${state.openCodeScope}. Expected user or project.`);
  }
}

function validateCodexScope() {
  if (!["user", "project"].includes(state.codexScope)) {
    die(`Invalid --codex-scope value: ${state.codexScope}. Expected user or project.`);
  }
}

function openCodeTargets() {
  validateOpenCodeScope();
  if (state.openCodeScope === "user") {
    return {
      skillsDir: path.join(state.openCodeConfigDir, "skills"),
      agentsDir: path.join(state.openCodeConfigDir, "agents"),
    };
  }
  return {
    skillsDir: path.join(state.openCodeProjectDir, ".opencode", "skills"),
    agentsDir: path.join(state.openCodeProjectDir, ".opencode", "agents"),
  };
}

function readCodexMarketplaceName(marketplacePath, defaultName) {
  try {
    const marketplace = JSON.parse(fs.readFileSync(marketplacePath, "utf8"));
    if (typeof marketplace.name === "string" && marketplace.name.trim()) return marketplace.name.trim();
  } catch {
    // Missing marketplace files use the installer's default marketplace name.
  }
  return defaultName;
}

function codexTargets() {
  validateCodexScope();
  if (state.codexScope === "user") {
    const marketplacePath = state.codexUserMarketplacePath;
    const marketplaceDefaultName = "personal";
    return {
      marketplacePath,
      pluginTarget: path.join(state.codexUserPluginRoot, pluginName),
      marketplaceDefaultName,
      marketplaceDisplayName: "Personal",
      commandDir: process.cwd(),
      marketplaceName: readCodexMarketplaceName(marketplacePath, marketplaceDefaultName),
    };
  }

  const marketplacePath = path.join(state.codexProjectDir, ".agents", "plugins", "marketplace.json");
  const marketplaceDefaultName = `${pluginName}-project`;
  return {
    marketplacePath,
    pluginTarget: path.join(state.codexProjectDir, "plugins", pluginName),
    marketplaceDefaultName,
    marketplaceDisplayName: "hicode Project",
    commandDir: state.codexProjectDir,
    marketplaceName: readCodexMarketplaceName(marketplacePath, marketplaceDefaultName),
  };
}

function validatePluginAssets() {
  requireDir(path.join(repoRoot, ".claude-plugin"), "Missing Claude plugin manifest directory");
  requireFile(path.join(repoRoot, ".claude-plugin", "plugin.json"), "Missing Claude plugin manifest");
  requireFile(path.join(repoRoot, ".claude-plugin", "marketplace.json"), "Missing Claude marketplace manifest");
  requireDir(path.join(repoRoot, ".codex-plugin"), "Missing Codex plugin manifest directory");
  requireFile(path.join(repoRoot, ".codex-plugin", "plugin.json"), "Missing Codex plugin manifest");
  requireFile(path.join(repoRoot, "scripts", "install-opencode.js"), "Missing OpenCode installer adapter");
  requireFile(path.join(repoRoot, "scripts", "install-codex.js"), "Missing Codex installer adapter");

  for (const skill of skillNames) {
    requireFile(path.join(repoRoot, "skills", skill, "SKILL.md"), "Missing skill entry");
  }

  for (const runtimeDoc of [
    "skills/init/coding_rules.md",
    "skills/init/hicode-entry-section.md",
    "skills/init/DOMAIN_KNOWLEDGE.md",
    "skills/init/PROJ_CONTEXT.md",
    "skills/init/ADR-template.md",
    "skills/scope/feature_context.md",
    "skills/scope/requirement-review-report.md",
    "skills/scope/scope-report.md",
    "skills/scope/task-split-plan.md",
    "skills/scope/ADR-template.md",
    "skills/tdd/tdd-report.md",
    "skills/review/review-report.md",
    "skills/release/release-report.md",
  ]) {
    requireFile(path.join(repoRoot, runtimeDoc), "Missing skill-local runtime document");
  }

  for (const agent of agentNames) {
    requireFile(path.join(repoRoot, "agents", `${agent}.md`), "Missing agent entry");
  }
}

function validateInstallBoundary() {
  const pattern = /("\.\/docs\/?|"docs\/"|"\.\/archive\/?|"archive\/"|"references\/)/;
  for (const manifest of [
    path.join(repoRoot, ".claude-plugin", "plugin.json"),
    path.join(repoRoot, ".codex-plugin", "plugin.json"),
  ]) {
    if (pattern.test(fs.readFileSync(manifest, "utf8"))) {
      die(`Plugin manifest must not expose repository docs, archive, or references as runtime assets: ${manifest}`);
    }
  }
}

function runCommand(command, args, options = {}) {
  log(`+ ${[command, ...args].join(" ")}`);
  if (state.dryRun) return;
  const result = spawnSync(command, args, { stdio: "inherit", cwd: options.cwd || process.cwd(), shell: false });
  if (result.status !== 0) process.exit(result.status || 1);
}

function runCommandInDir(cwd, command, args) {
  log(`+ (cd ${quote(cwd)} && ${[command, ...args].join(" ")})`);
  if (state.dryRun) return;
  const result = spawnSync(command, args, { stdio: "inherit", cwd, shell: false });
  if (result.status !== 0) process.exit(result.status || 1);
}

function runNodeAdapter(args) {
  const result = spawnSync(process.execPath, args, { cwd: repoRoot, encoding: "utf8" });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) process.exit(result.status || 1);
  return result.stdout || "";
}

function finishIdempotentUninstall(selector, status, output) {
  if (status === 0) {
    if (output) process.stdout.write(output);
    return;
  }
  if (/not found|not installed|not in installed plugins/i.test(output)) {
    if (output) process.stderr.write(output);
    log(`+ ${selector} already absent; continuing`);
    return;
  }
  if (output) process.stderr.write(output);
  process.exit(status || 1);
}

function runIdempotentUninstall(selector, command, args, cwd = process.cwd()) {
  log(cwd === process.cwd() ? `+ ${[command, ...args].join(" ")}` : `+ (cd ${quote(cwd)} && ${[command, ...args].join(" ")})`);
  if (state.dryRun) return;
  const result = spawnSync(command, args, { cwd, encoding: "utf8", shell: false });
  finishIdempotentUninstall(selector, result.status || 0, `${result.stdout || ""}${result.stderr || ""}`);
}

function installClaudeCode() {
  validatePluginAssets();
  validateInstallBoundary();
  validateScope();

  log("");
  log("Claude Code plan:");
  log(`  Marketplace root: ${repoRoot}`);
  log(`  Marketplace manifest: ${path.join(repoRoot, ".claude-plugin", "marketplace.json")}`);
  log(`  Plugin: ${pluginName}@${marketplaceName}`);
  log(`  Scope: ${state.installScope}`);
  log("  Runtime assets: skills/ declared by .claude-plugin/plugin.json; agents/ loaded from Claude Code plugin root conventions");
  log("  Init seed rule: skills/init/coding_rules.md");
  log("  Skill-local documents: concrete templates only; lifecycle rules live in target entry");
  log("  Excluded from runtime: docs/, archive/, references/");
  log("  Action: validate manifests, register local marketplace, install plugin");

  if (state.dryRun) {
    log(`+ claude plugin validate ${quote(path.join(repoRoot, ".claude-plugin", "plugin.json"))}`);
    log(`+ claude plugin validate ${quote(path.join(repoRoot, ".claude-plugin", "marketplace.json"))}`);
    log(`+ claude plugin marketplace add ${quote(repoRoot)} --scope ${quote(state.installScope)}`);
    log(`+ claude plugin install ${quote(`${pluginName}@${marketplaceName}`)} --scope ${quote(state.installScope)}`);
    return;
  }

  requireCommand("claude");
  runCommand("claude", ["plugin", "validate", path.join(repoRoot, ".claude-plugin", "plugin.json")]);
  runCommand("claude", ["plugin", "validate", path.join(repoRoot, ".claude-plugin", "marketplace.json")]);
  runCommand("claude", ["plugin", "marketplace", "add", repoRoot, "--scope", state.installScope]);
  runCommand("claude", ["plugin", "install", `${pluginName}@${marketplaceName}`, "--scope", state.installScope]);
}

function uninstallClaudeCode() {
  validateScope();

  log("");
  log("Claude Code uninstall plan:");
  log(`  Plugin: ${pluginName}@${marketplaceName}`);
  log(`  Scope: ${state.installScope}`);
  log("  Action: uninstall hicode Claude Code plugin from selected scope");

  if (state.dryRun) {
    log(`+ claude plugin uninstall ${quote(`${pluginName}@${marketplaceName}`)} --scope ${quote(state.installScope)}`);
    return;
  }

  requireCommand("claude");
  runIdempotentUninstall(`${pluginName}@${marketplaceName}`, "claude", [
    "plugin",
    "uninstall",
    `${pluginName}@${marketplaceName}`,
    "--scope",
    state.installScope,
  ]);
}

function installOpenCode() {
  validatePluginAssets();
  const targets = openCodeTargets();

  log("");
  log("OpenCode plan:");
  log(`  Scope: ${state.openCodeScope}`);
  log(`  Skills target: ${targets.skillsDir}`);
  log(`  Agents target: ${targets.agentsDir}`);
  log(`  Skills installed as: ${hicodeSkillsLabel}`);
  log("  Agents installed as: hicode-<agent-name>.md");
  log("  Excluded from runtime: docs/, archive/, references/");
  log("  Action: copy transformed hicode skills and agents into OpenCode directories");

  if (state.dryRun) {
    log(`+ mkdir -p ${quote(targets.skillsDir)} ${quote(targets.agentsDir)}`);
    log(`+ install transformed skills/{hi,init,scope,tdd,review,release} to ${quote(`${targets.skillsDir}/hicode-*`)}`);
    log(`+ install transformed agents/*.md to ${quote(`${targets.agentsDir}/hicode-*.md`)}`);
    return;
  }

  fs.mkdirSync(targets.skillsDir, { recursive: true });
  fs.mkdirSync(targets.agentsDir, { recursive: true });
  runNodeAdapter([
    path.join(repoRoot, "scripts", "install-opencode.js"),
    "install",
    repoRoot,
    targets.skillsDir,
    targets.agentsDir,
  ]);
}

function uninstallOpenCode() {
  const targets = openCodeTargets();

  log("");
  log("OpenCode uninstall plan:");
  log(`  Scope: ${state.openCodeScope}`);
  log(`  Skills target: ${targets.skillsDir}`);
  log(`  Agents target: ${targets.agentsDir}`);
  log(`  Skills removed: ${hicodeSkillsLabel}`);
  log("  Agents removed: hicode-<agent-name>.md");
  log("  Action: remove hicode-owned OpenCode skills and agents only");

  if (state.dryRun) {
    log(`+ remove ${quote(`${targets.skillsDir}/hicode-{hi,init,scope,tdd,review,release}`)}`);
    log(`+ remove ${quote(`${targets.agentsDir}/hicode-*.md`)}`);
    return;
  }

  runNodeAdapter([
    path.join(repoRoot, "scripts", "install-opencode.js"),
    "uninstall",
    repoRoot,
    targets.skillsDir,
    targets.agentsDir,
  ]);
}

function installCodex() {
  validatePluginAssets();
  validateInstallBoundary();
  const targets = codexTargets();

  log("");
  log("Codex CLI plan:");
  log(`  Scope: ${state.codexScope}`);
  log(`  Marketplace file: ${targets.marketplacePath}`);
  log(`  Marketplace name: ${targets.marketplaceName}`);
  log(`  Plugin bundle target: ${targets.pluginTarget}`);
  log(`  Plugin selector: ${pluginName}@${targets.marketplaceName}`);
  log("  Runtime assets: .codex-plugin/plugin.json and skills/");
  log("  Agents: omitted for Codex because Codex plugin manifests do not support agents");
  log("  Excluded from runtime: docs/, archive/, references/");
  log("  Action: copy hicode Codex plugin bundle, update local marketplace, install plugin");

  if (state.dryRun) {
    log(`+ mkdir -p ${quote(path.dirname(targets.marketplacePath))} ${quote(path.dirname(targets.pluginTarget))}`);
    log(`+ copy .codex-plugin/ and skills/ to ${quote(targets.pluginTarget)}`);
    log(`+ upsert marketplace entry ${quote(pluginName)} with source.path ${quote(`./plugins/${pluginName}`)}`);
    if (state.codexScope === "user") {
      log(`+ codex plugin add ${quote(`${pluginName}@${targets.marketplaceName}`)}`);
    } else {
      log(`+ (cd ${quote(targets.commandDir)} && codex plugin add ${quote(`${pluginName}@${targets.marketplaceName}`)})`);
    }
    return;
  }

  const generatedName = runNodeAdapter([
    path.join(repoRoot, "scripts", "install-codex.js"),
    "install",
    repoRoot,
    targets.pluginTarget,
    targets.marketplacePath,
    targets.marketplaceDefaultName,
    targets.marketplaceDisplayName,
    pluginName,
  ]);
  const generatedMarketplaceName = generatedName.trim();

  log(`+ generated Codex marketplace entry: ${pluginName}@${generatedMarketplaceName}`);

  if (process.env.HICODE_CODEX_SKIP_ADD === "1") {
    log("+ skip codex plugin add because HICODE_CODEX_SKIP_ADD=1");
    return;
  }

  requireCommand("codex");
  if (state.codexScope === "user") {
    runCommand("codex", ["plugin", "add", `${pluginName}@${generatedMarketplaceName}`]);
  } else {
    runCommandInDir(targets.commandDir, "codex", ["plugin", "add", `${pluginName}@${generatedMarketplaceName}`]);
  }
}

function uninstallCodex() {
  const targets = codexTargets();

  log("");
  log("Codex CLI uninstall plan:");
  log(`  Scope: ${state.codexScope}`);
  log(`  Marketplace file: ${targets.marketplacePath}`);
  log(`  Marketplace name: ${targets.marketplaceName}`);
  log(`  Plugin bundle target: ${targets.pluginTarget}`);
  log(`  Plugin selector: ${pluginName}@${targets.marketplaceName}`);
  log("  Action: remove Codex plugin install, marketplace entry, and hicode plugin bundle");

  if (state.dryRun) {
    if (state.codexScope === "user") {
      log(`+ codex plugin remove ${quote(`${pluginName}@${targets.marketplaceName}`)}`);
    } else {
      log(`+ (cd ${quote(targets.commandDir)} && codex plugin remove ${quote(`${pluginName}@${targets.marketplaceName}`)})`);
    }
    log(`+ remove marketplace entry ${quote(pluginName)} from ${quote(targets.marketplacePath)}`);
    log(`+ remove plugin bundle ${quote(targets.pluginTarget)}`);
    return;
  }

  if (process.env.HICODE_CODEX_SKIP_REMOVE === "1") {
    log("+ skip codex plugin remove because HICODE_CODEX_SKIP_REMOVE=1");
  } else {
    requireCommand("codex");
    if (state.codexScope === "user") {
      runIdempotentUninstall(`${pluginName}@${targets.marketplaceName}`, "codex", [
        "plugin",
        "remove",
        `${pluginName}@${targets.marketplaceName}`,
      ]);
    } else {
      runIdempotentUninstall(`${pluginName}@${targets.marketplaceName}`, "codex", [
        "plugin",
        "remove",
        `${pluginName}@${targets.marketplaceName}`,
      ], targets.commandDir);
    }
  }

  runNodeAdapter([
    path.join(repoRoot, "scripts", "install-codex.js"),
    "uninstall",
    repoRoot,
    targets.pluginTarget,
    targets.marketplacePath,
    targets.marketplaceDefaultName,
    targets.marketplaceDisplayName,
    pluginName,
  ]);
}

function parseArgs(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const nextValue = () => {
      index += 1;
      if (index >= argv.length) die(`Missing value for ${arg}`);
      return argv[index];
    };

    switch (arg) {
      case "--uninstall":
        state.uninstall = true;
        break;
      case "--claude-code":
        state.installClaude = true;
        break;
      case "--opencode":
        state.installOpenCode = true;
        break;
      case "--codex":
        state.installCodex = true;
        break;
      case "--moss":
        state.installMoss = true;
        break;
      case "--check":
        state.check = true;
        break;
      case "--all":
        state.installClaude = true;
        state.installOpenCode = true;
        state.installCodex = true;
        state.installMoss = true;
        break;
      case "--scope":
        state.installScope = nextValue();
        break;
      case "--opencode-scope":
        state.openCodeScope = nextValue();
        break;
      case "--opencode-config-dir":
        state.openCodeConfigDir = nextValue();
        break;
      case "--opencode-project-dir":
        state.openCodeProjectDir = nextValue();
        break;
      case "--codex-scope":
        state.codexScope = nextValue();
        break;
      case "--codex-project-dir":
        state.codexProjectDir = nextValue();
        break;
      case "--moss-agent-id":
        state.mossAgentId = nextValue();
      case "--dry-run":
        state.dryRun = true;
        break;
      case "--yes":
        state.yes = true;
        break;
      case "-h":
      case "--help":
        usage();
        process.exit(0);
        break;
      default:
        die(`Unknown option: ${arg}`);
    }
  }
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => {
    rl.close();
    resolve(answer);
  }));
}

async function selectPlatforms() {
  log("");
  log(state.uninstall ? "Select target platform(s) to uninstall hicode:" : "Select target platform(s) to install hicode:");
  log("  1) Claude Code");
  log("  2) OpenCode");
  log("  3) Codex CLI");
  log("  4) Moss");
  log("  a) All platforms");
  log("");
  const answer = await ask('Enter choice(s), space-separated (e.g. "1 3" for Claude Code + Codex): ');

  for (const choice of answer.split(/\s+/).filter(Boolean)) {
    switch (choice) {
      case "1":
        state.installClaude = true;
        break;
      case "2":
        state.installOpenCode = true;
        break;
      case "3":
        state.installCodex = true;
        break;
      case "4":
        state.installMoss = true;
        break;
      case "a":
      case "A":
        state.installClaude = true;
        state.installOpenCode = true;
        state.installCodex = true;
        state.installMoss = true;
        break;
      default:
        die(`Invalid choice: ${choice}. Expected 1, 2, 3, 4, or a.`);
    }
  }

  if (!state.installClaude && !state.installOpenCode && !state.installCodex && !state.installMoss) die("No platform selected.");
}

async function confirm() {
  if (state.yes || state.dryRun) return;
  const answer = await ask(state.uninstall ? "Proceed with hicode plugin uninstallation? [y/N] " : "Proceed with hicode plugin installation? [y/N] ");
  if (!["y", "Y", "yes", "YES"].includes(answer)) die("Installation cancelled");
}

// ========== Moss 安装 / 卸载 ==========

/** 修正 SKILL.md 的 name frontmatter 为指定值 */
function fixSkillName(skillDir, expectedName) {
  const skPath = path.join(skillDir, "SKILL.md");
  if (!fs.existsSync(skPath)) return;
  let content = fs.readFileSync(skPath, "utf8");
  // 检查是否有 frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (match) {
    const frontmatter = match[1];
    const lines = frontmatter.split("\n");
    let nameFound = false;
    const newLines = lines.map((line) => {
      if (line.startsWith("name:")) {
        nameFound = true;
        return `name: ${expectedName}`;
      }
      return line;
    });
    if (!nameFound) {
      newLines.unshift(`name: ${expectedName}`);
    }
    content = `---\n${newLines.join("\n")}\n---${content.slice(match[0].length)}`;
  } else {
    content = `---\nname: ${expectedName}\n---\n${content}`;
  }
  fs.writeFileSync(skPath, content, "utf8");
}

/** 将 skill 名称追加到 Moss config.yaml 的 skills.enabled 列表 */
function enableSkillInConfig(configPath, skillName) {
  if (!fs.existsSync(configPath)) return;
  let content = fs.readFileSync(configPath, "utf8");
  // 检查是否已在 enabled 列表中
  const pattern = new RegExp(`^    - ${escapeRegExp(skillName)}$`, "m");
  if (pattern.test(content)) return false; // 已存在

  // 找到最后一个 - 开头的 enabled 项，在其后追加
  const lastDashMatch = content.match(/^(    - .+)$/m);
  if (lastDashMatch) {
    const lastIndex = content.lastIndexOf(lastDashMatch[1]);
    content = content.slice(0, lastIndex + lastDashMatch[1].length) +
      `\n    - ${skillName}` +
      content.slice(lastIndex + lastDashMatch[1].length);
  } else if (/^skills:/m.test(content)) {
    // 有 skills: 但没有 enabled 列表
    content = content.replace(/^(skills:)$/m, "$1\n  enabled:\n    - " + skillName);
  } else {
    // 没有 skills 段落
    content += `\nskills:\n  enabled:\n    - ${skillName}\n`;
  }
  fs.writeFileSync(configPath, content, "utf8");
  return true;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mossSkillsDir() {
  return path.join(os.homedir(), ".moss", "agents", state.mossAgentId, "learned-skills");
}

function mossConfigPath() {
  return path.join(os.homedir(), ".moss", "agents", state.mossAgentId, "config.yaml");
}

const mossSkillNames = ["hi", "init", "scope", "tdd", "review", "release"];
const mossAgentNames = [
  "requirement-reviewer", "coding-planner", "tdd-guide", "coding-assistant",
  "code-reviewer", "security-reviewer", "java-reviewer", "release-reviewer",
];

function allMossSkillIdentifiers() {
  const skills = mossSkillNames.map((s) => `hicode-${s}`);
  const agents = mossAgentNames.map((a) => `hicode-agent-${a}`);
  return [...skills, ...agents];
}

function installMoss() {
  const learnDir = mossSkillsDir();
  const configPath = mossConfigPath();

  if (!fs.existsSync(configPath)) {
    die(`未找到 Moss config.yaml (${configPath})，请先初始化 Moss agent: ${state.mossAgentId}`);
  }

  log("");
  log("Moss install plan:");
  log(`  Agent ID: ${state.mossAgentId}`);
  log(`  Target dir: ${learnDir}`);
  log("  Action: copy skills/ and agents/ to Moss learned-skills, fix name fields, enable in config.yaml");

  if (state.dryRun) {
    log(`+ mkdir -p ${learnDir}/hicode-{hi,init,scope,tdd,review,release}`);
    log(`+ mkdir -p ${learnDir}/hicode-agent-{${mossAgentNames.join(",")}}`);
    log(`+ copy skills/{hi,init,scope,tdd,review,release}/. to ${learnDir}/hicode-*`);
    log(`+ copy agents/*.md to ${learnDir}/hicode-agent-*/SKILL.md`);
    log(`+ fix name frontmatter in all SKILL.md`);
    log(`+ append ${allMossSkillIdentifiers().length} entries to ${configPath} skills.enabled`);
    return;
  }

  log("");
  log("[1/4] 安装 6 个 hicode Skill...");
  for (const skill of mossSkillNames) {
    const targetDir = path.join(learnDir, `hicode-${skill}`);
    fs.rmSync(targetDir, { recursive: true, force: true });
    fs.mkdirSync(targetDir, { recursive: true });
    const srcDir = path.join(repoRoot, "skills", skill);
    for (const entry of fs.readdirSync(srcDir)) {
      const srcPath = path.join(srcDir, entry);
      const destPath = path.join(targetDir, entry);
      if (fs.statSync(srcPath).isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
    log(`  ✅ hicode-${skill}`);
  }

  log("[2/4] 安装 8 个 hicode Agent...");
  for (const agent of mossAgentNames) {
    const targetDir = path.join(learnDir, `hicode-agent-${agent}`);
    fs.rmSync(targetDir, { recursive: true, force: true });
    fs.mkdirSync(targetDir, { recursive: true });
    fs.copyFileSync(path.join(repoRoot, "agents", `${agent}.md`), path.join(targetDir, "SKILL.md"));
    log(`  ✅ hicode-agent-${agent}`);
  }

  log("[3/4] 修正 SKILL.md name 字段（目录名 = name）...");
  for (const skill of mossSkillNames) {
    fixSkillName(path.join(learnDir, `hicode-${skill}`), `hicode-${skill}`);
    log(`  ✅ hicode-${skill}`);
  }
  for (const agent of mossAgentNames) {
    fixSkillName(path.join(learnDir, `hicode-agent-${agent}`), `hicode-agent-${agent}`);
    log(`  ✅ hicode-agent-${agent}`);
  }

  log("[4/4] 启用 hicode Skill（写入 config.yaml）...");
  let addedCount = 0;
  for (const id of allMossSkillIdentifiers()) {
    if (enableSkillInConfig(configPath, id)) {
      log(`  ➕ ${id}`);
      addedCount++;
    } else {
      log(`  ✅ ${id} (已存在)`);
    }
  }

  log("");
  log("==========================================");
  log("  ✅ 安装完成！");
  log("==========================================");
  log("");
  log("下一步：重启 Moss server");
  log("");
  log("  方式一（推荐）：关闭 Moss 桌面端再重新打开");
  log("");
  log("  方式二：杀死 server 进程（GUI 会自动重启）");
  log(`    kill \$(pgrep -f "server/bootstrap.js" | tail -1)`);
  log("");
  log("重启后验证：");
  log("    node scripts/install.js --check");
  log("==========================================");
}

function uninstallMoss() {
  const learnDir = mossSkillsDir();
  const configPath = mossConfigPath();

  log("");
  log("Moss uninstall plan:");
  log(`  Agent ID: ${state.mossAgentId}`);
  log(`  Target dir: ${learnDir}`);
  log("  Action: remove hicode-* directories from Moss learned-skills");

  if (state.dryRun) {
    log(`+ rm -rf ${learnDir}/hicode-*`);
    return;
  }

  // 删除 hicode-* 目录
  for (const id of allMossSkillIdentifiers()) {
    const targetDir = path.join(learnDir, id);
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
      log(`  🗑️  ${id}`);
    }
  }

  // 从 config.yaml 移除
  if (fs.existsSync(configPath)) {
    let content = fs.readFileSync(configPath, "utf8");
    let changed = false;
    for (const id of allMossSkillIdentifiers()) {
      const pattern = new RegExp(`^    - ${escapeRegExp(id)}$`, "gm");
      if (pattern.test(content)) {
        content = content.replace(pattern, "");
        changed = true;
        log(`  🗑️  从 config.yaml 移除 ${id}`);
      }
    }
    if (changed) {
      // 清理空行冗余
      content = content.replace(/\n{3,}/g, "\n\n");
      fs.writeFileSync(configPath, content, "utf8");
    }
  }

  log("");
  log("✅ Moss hicode 卸载完成。重启 Moss server 后生效。");
}

function hostPlatformLabel() {
  const platform = os.platform();
  const release = os.release();
  if (platform === "win32") return `windows (${release})`;
  if (platform === "linux" && /microsoft/i.test(release)) return `wsl (${release})`;
  return `${platform} (${release})`;
}

function runPlatform(enabled, installFn, uninstallFn) {
  if (!enabled) return;
  if (state.uninstall) uninstallFn();
  else installFn();
}

async function main() {
  parseArgs(process.argv.slice(2));

  // --check 模式：验证 Moss 安装
  if (state.check) {
    const serverInfo = path.join(os.homedir(), ".moss", "server-info.json");
    if (!fs.existsSync(serverInfo)) die("Moss 未运行（未找到 server-info.json）");

    const info = JSON.parse(fs.readFileSync(serverInfo, "utf8"));
    const { token, port } = info;

    log(`检查 Moss Server (端口 ${port})...`);

    const http = require("http");
    const url = `http://localhost:${port}/api/skills?agentId=${state.mossAgentId}`;

    http.get(url, { headers: { Authorization: `Bearer ${token}` } }, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => {
        try {
          const data = JSON.parse(body);
          const hicode = data.skills.filter((s) => s.name.startsWith("hicode"));
          const enabled = hicode.filter((s) => s.enabled);
          const disabled = hicode.filter((s) => !s.enabled);

          log("");
          log("hicode 技能状态：");
          for (const s of hicode) {
            log(`  ${s.enabled ? "✅" : "❌"} ${s.name}  (source=${s.source || "-"})`);
          }
          log("");
          if (disabled.length > 0) {
            log(`  ⚠️  有 ${disabled.length} 个技能未启用`);
            process.exit(1);
          } else {
            log(`  ✅ 全部 ${hicode.length} 个 hicode 技能已启用！`);
            process.exit(0);
          }
        } catch (err) {
          die(`解析 Moss API 响应失败: ${err.message}`);
        }
      });
    }).on("error", (err) => {
      die(`Moss API 无响应: ${err.message}，是否重启了 server？`);
    });
    return; // 让事件循环处理回调
  }

  if (!state.installClaude && !state.installOpenCode && !state.installCodex && !state.installMoss) {
    if (state.yes) state.installClaude = true;
    else await selectPlatforms();
  }

  log("hicode Coding Agent installer");
  log(`Mode: ${state.uninstall ? "uninstall" : "install"}`);
  log(`Host platform: ${hostPlatformLabel()}`);
  log(`Dry run: ${state.dryRun ? 1 : 0}`);
  log(`Claude Code: ${state.installClaude ? 1 : 0}`);
  log(`Claude Code scope: ${state.installScope}`);
  log(`OpenCode: ${state.installOpenCode ? 1 : 0}`);
  log(`OpenCode scope: ${state.openCodeScope}`);
  log(`OpenCode config dir: ${state.openCodeConfigDir}`);
  log(`OpenCode project dir: ${state.openCodeProjectDir}`);
  log(`Codex: ${state.installCodex ? 1 : 0}`);
  log(`Codex scope: ${state.codexScope}`);
  log(`Codex user marketplace: ${state.codexUserMarketplacePath}`);
  log(`Codex user plugin root: ${state.codexUserPluginRoot}`);
  log(`Codex project dir: ${state.codexProjectDir}`);
  log(`Moss: ${state.installMoss ? 1 : 0}`);
  log(`Moss agent ID: ${state.mossAgentId}`);
  log("");
  log("This installer exposes only Claude Code/Codex plugin runtime assets or transformed OpenCode runtime assets.");
  log("This installer will not install repository docs/archive as runtime assets.");
  log("This installer will not scan code, generate CLAUDE.md, generate AGENTS.md, or create .hicode/.");

  await confirm();

  runPlatform(state.installClaude, installClaudeCode, uninstallClaudeCode);
  runPlatform(state.installOpenCode, installOpenCode, uninstallOpenCode);
  runPlatform(state.installCodex, installCodex, uninstallCodex);
  runPlatform(state.installMoss, installMoss, uninstallMoss);

  log("");
  if (state.dryRun) log("Dry run complete. No files or user configuration were changed.");
  else if (state.uninstall) log("hicode uninstallation complete.");
  else log("hicode installation complete.");
}

main().catch((error) => {
  process.stderr.write(`Error: ${error && error.message ? error.message : String(error)}\n`);
  process.exit(1);
});
