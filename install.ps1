Param(
  [switch]$Uninstall,
  [switch]$ClaudeCode,
  [switch]$OpenCode,
  [switch]$Codex,
  [switch]$All,
  [string]$Scope,
  [string]$OpenCodeScope,
  [string]$OpenCodeConfigDir,
  [string]$OpenCodeProjectDir,
  [string]$CodexScope,
  [string]$CodexProjectDir,
  [switch]$DryRun,
  [switch]$Yes,
  [switch]$Help
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$installer = Join-Path $scriptDir "scripts/install.js"

$argsList = @()
if ($Uninstall) { $argsList += "--uninstall" }
if ($ClaudeCode) { $argsList += "--claude-code" }
if ($OpenCode) { $argsList += "--opencode" }
if ($Codex) { $argsList += "--codex" }
if ($All) { $argsList += "--all" }
if ($Scope) { $argsList += @("--scope", $Scope) }
if ($OpenCodeScope) { $argsList += @("--opencode-scope", $OpenCodeScope) }
if ($OpenCodeConfigDir) { $argsList += @("--opencode-config-dir", $OpenCodeConfigDir) }
if ($OpenCodeProjectDir) { $argsList += @("--opencode-project-dir", $OpenCodeProjectDir) }
if ($CodexScope) { $argsList += @("--codex-scope", $CodexScope) }
if ($CodexProjectDir) { $argsList += @("--codex-project-dir", $CodexProjectDir) }
if ($DryRun) { $argsList += "--dry-run" }
if ($Yes) { $argsList += "--yes" }
if ($Help) { $argsList += "--help" }

node $installer @argsList
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
