# hicode_review Golden Samples

## 定位

本目录保存人工构造、脱敏的 `hicode_review` JSONL 样例，用于 SkillOpt 离线评估、runner/adapter 验证和后续训练优化。

当前样例基于 `docs/references/TECHNICAL_ANALYSIS.md` 抽象出的金融/保险理赔系统风险面设计，包括理赔金额、状态流转、财务结算、外部接口、RocketMQ、PBS 批处理、MyBatis/OceanBase、DDL/DML、JSP 权限过滤链和客户信息脱敏。

## 文件

1. `items.jsonl`：golden 样例源文件。每行一条 JSON 记录。

默认 train wrapper 直接读取本文件，并生成 SkillOpt split directory：

```bash
bash skill-opt/scripts/run-review-train-deepseek.sh --run-id <run-id>
```

运行期 split 目录由 runner 派生到 `skill-opt/outputs/<run-id>/split/{train,val,test}/items.json`，不要手工维护。

## 覆盖面

样例按 `train`、`val`、`test` 分层切分。每个 split 都至少覆盖：

1. 安全红线、客户材料未脱敏、原始上传内容、日志/返回值泄露。
2. 金额、状态、幂等、重复提交、消息重复消费和批处理重跑。
3. SQL、配置、DDL/DML、回滚、影响范围和证据缺口。
4. Java/Spring 事务、异常、外部接口 fallback、批处理一致性。
5. 审查范围、需求证据、TDD/测试证据和建议性结论格式。

## 安全边界

样例必须保持虚构和脱敏。不得写入真实客户、保单、支付、生产系统、生产日志、生产配置、连接串、Token、Cookie、Session、密钥或真实代码。

允许使用人工构造的伪 diff、虚构类名、虚构字段名和虚构金额/日期。不得复制真实 MR/PR、生产 SQL、真实配置、真实日志或 `.env` 内容。
