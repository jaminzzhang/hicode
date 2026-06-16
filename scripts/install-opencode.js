#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const [, , mode, root, skillsOut, agentsOut] = process.argv;
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

function assertSafeOwnedTarget(target, allowedPrefix) {
  const base = path.basename(target);
  if (base !== allowedPrefix && !base.startsWith(`${allowedPrefix}-`)) {
    throw new Error(`Refusing to replace non-hicode target: ${target}`);
  }
}

function resetTarget(target, allowedPrefix) {
  assertSafeOwnedTarget(target, allowedPrefix);
  fs.rmSync(target, { recursive: true, force: true });
}

function removePath(target, expectedBase) {
  const base = path.basename(target);
  if (base !== expectedBase) {
    throw new Error(`Refusing to remove non-hicode target: ${target}`);
  }
  fs.rmSync(target, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function upsertFrontmatterName(content, name) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return `---\nname: ${name}\n---\n\n${content}`;

  const body = content.slice(match[0].length);
  const lines = match[1].split("\n").filter((line) => !line.match(/^name\s*:/));
  return `---\nname: ${name}\n${lines.join("\n")}\n---\n${body}`;
}

function setFrontmatterFields(content, fields, removeKeys = []) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  const keys = new Set([...Object.keys(fields), ...removeKeys]);
  const body = match ? content.slice(match[0].length) : content;
  const lines = match ? match[1].split("\n") : [];
  const filtered = lines.filter((line) => {
    const keyMatch = line.match(/^([A-Za-z0-9_-]+)\s*:/);
    return !keyMatch || !keys.has(keyMatch[1]);
  });

  for (const [key, value] of Object.entries(fields)) {
    filtered.push(`${key}: ${value}`);
  }

  return `---\n${filtered.join("\n")}\n---\n${body.startsWith("\n") ? body : `\n${body}`}`;
}

function transformAgentContent(content) {
  let next = setFrontmatterFields(content, { mode: "subagent" }, ["name"]);
  for (const skill of skillNames) {
    next = next.replaceAll(
      `../skills/${skill}/SKILL.md`,
      path.join(skillsOut, `hicode-${skill}/SKILL.md`)
    );
    next = next.replaceAll(
      `skills/${skill}/SKILL.md`,
      path.join(skillsOut, `hicode-${skill}/SKILL.md`)
    );
  }
  return next;
}

function install() {
  for (const skill of skillNames) {
    const dest = path.join(skillsOut, `hicode-${skill}`);
    resetTarget(dest, "hicode");
    copyDir(path.join(root, "skills", skill), dest);
    const skillPath = path.join(dest, "SKILL.md");
    fs.writeFileSync(
      skillPath,
      upsertFrontmatterName(fs.readFileSync(skillPath, "utf8"), `hicode-${skill}`)
    );
  }

  for (const agent of agentNames) {
    const dest = path.join(agentsOut, `hicode-${agent}.md`);
    assertSafeOwnedTarget(dest, "hicode");
    const source = path.join(root, "agents", `${agent}.md`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, transformAgentContent(fs.readFileSync(source, "utf8")));
  }
}

function uninstall() {
  for (const skill of skillNames) {
    removePath(path.join(skillsOut, `hicode-${skill}`), `hicode-${skill}`);
  }
  for (const agent of agentNames) {
    removePath(path.join(agentsOut, `hicode-${agent}.md`), `hicode-${agent}.md`);
  }
}

if (mode === "install") {
  install();
} else if (mode === "uninstall") {
  uninstall();
} else {
  throw new Error(`Unknown OpenCode install mode: ${mode}`);
}
