# hicode Skill Runtime Shared Assets

`skills/_shared/` 保存随 Claude Code plugin `skills/` 一起安装的运行时共享资产镜像。

目标项目执行 `hicode:*` Skill 时优先读取本目录，避免跨 plugin 运行资产边界读取维护源文件时反复请求授权。

维护规则：

1. 本仓库维护源文件与本目录运行时镜像必须保持一致。
2. 本目录只镜像 Skill 运行时需要读取的规则和模板。
3. 修改源文件后必须同步本目录，并运行 `bash scripts/health-check.sh`。
4. 本目录不是可调用 Skill，不应包含 `SKILL.md`。
