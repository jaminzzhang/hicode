import { type Plugin, tool } from "@opencode-ai/plugin";

const HICODE_OVERVIEW = [
  "hicode 是面向保险/金融核心系统研发的 Coding Agent 工程化体系。",
  "本 OpenCode plugin 只提供 hicode 入口说明，不执行目标项目初始化。",
  "后续如需初始化目标项目，应单独使用 hicode 仓库中的 harness-assets/init/ 规划资产。",
  "",
  "安全边界：",
  "1. 不扫描目标项目代码，除非用户后续明确要求。",
  "2. 不生成 CLAUDE.md、AGENTS.md 或 .hicode/，除非进入后续 hicode init 流程。",
  "3. 不读取 .env、密钥文件、生产配置、生产凭证或未脱敏客户数据。",
  "4. 不操作生产环境，不自动合并、自动发布、自动回滚或修改生产配置。",
  "5. 涉及保险核心业务规则、金额、状态流转、幂等、权限、审计、隐私、监管、生产变更或回滚时，按高风险任务处理。"
].join("\n");

export const HicodePlugin: Plugin = async () => {
  return {
    tool: {
      hicode: tool({
        description: "Show the hicode entry guidance and safety boundaries.",
        args: {},
        async execute() {
          return HICODE_OVERVIEW;
        }
      })
    }
  };
};
