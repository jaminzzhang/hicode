# hicode_review Golden Samples

## 定位

本目录用于保存首批人工构造、脱敏的 `hicode_review` JSONL 样例。样例只用于离线 evaluator 和后续 SkillOpt adapter 原型，不来自真实会话、真实 MR、真实项目代码、生产日志、生产配置、客户信息或密钥。

## 文件

1. `items.jsonl`：首批 seed 样例。每行一条 JSON 记录。

## 安全边界

样例必须保持虚构和脱敏。不得写入真实客户、保单、支付、生产系统、生产日志、生产配置、连接串、Token、Cookie、Session、密钥或真实代码。
