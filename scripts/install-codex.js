#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const [
  ,
  ,
  mode,
  root,
  pluginTarget,
  marketplacePath,
  marketplaceDefaultName,
  marketplaceDisplayName,
  pluginName,
] = process.argv;

function assertPluginTarget(target, expectedBase, action) {
  const base = path.basename(target);
  if (base !== expectedBase) {
    throw new Error(`Refusing to ${action} non-hicode plugin target: ${target}`);
  }
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

function readMarketplace(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      name: marketplaceDefaultName,
      interface: { displayName: marketplaceDisplayName },
      plugins: [],
    };
  }

  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${filePath} must contain a JSON object`);
  }
  if (typeof parsed.name !== "string" || !parsed.name.trim()) {
    parsed.name = marketplaceDefaultName;
  }
  if (!parsed.interface || typeof parsed.interface !== "object" || Array.isArray(parsed.interface)) {
    parsed.interface = { displayName: marketplaceDisplayName };
  } else if (typeof parsed.interface.displayName !== "string" || !parsed.interface.displayName.trim()) {
    parsed.interface.displayName = marketplaceDisplayName;
  }
  if (!Array.isArray(parsed.plugins)) {
    throw new Error(`${filePath} field plugins must be an array`);
  }
  return parsed;
}

function writeMarketplace(marketplace) {
  fs.mkdirSync(path.dirname(marketplacePath), { recursive: true });
  fs.writeFileSync(marketplacePath, `${JSON.stringify(marketplace, null, 2)}\n`);
}

function install() {
  assertPluginTarget(pluginTarget, pluginName, "replace");
  fs.rmSync(pluginTarget, { recursive: true, force: true });
  fs.mkdirSync(pluginTarget, { recursive: true });
  copyDir(path.join(root, ".codex-plugin"), path.join(pluginTarget, ".codex-plugin"));
  copyDir(path.join(root, "skills"), path.join(pluginTarget, "skills"));

  const marketplace = readMarketplace(marketplacePath);
  marketplace.plugins = marketplace.plugins.filter((entry) => !entry || entry.name !== pluginName);
  marketplace.plugins.push({
    name: pluginName,
    source: {
      source: "local",
      path: `./plugins/${pluginName}`,
    },
    policy: {
      installation: "AVAILABLE",
      authentication: "ON_INSTALL",
    },
    category: "Productivity",
  });

  writeMarketplace(marketplace);
  process.stdout.write(marketplace.name);
}

function uninstall() {
  assertPluginTarget(pluginTarget, pluginName, "remove");
  fs.rmSync(pluginTarget, { recursive: true, force: true });

  if (!fs.existsSync(marketplacePath)) return;
  const marketplace = JSON.parse(fs.readFileSync(marketplacePath, "utf8"));
  if (!marketplace || typeof marketplace !== "object" || Array.isArray(marketplace)) {
    throw new Error(`${marketplacePath} must contain a JSON object`);
  }
  if (Array.isArray(marketplace.plugins)) {
    marketplace.plugins = marketplace.plugins.filter((entry) => !entry || entry.name !== pluginName);
    writeMarketplace(marketplace);
  }
}

if (mode === "install") {
  install();
} else if (mode === "uninstall") {
  uninstall();
} else {
  throw new Error(`Unknown Codex install mode: ${mode}`);
}
