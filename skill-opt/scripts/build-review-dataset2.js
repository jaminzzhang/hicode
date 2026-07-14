#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const REPOS = [
  {
    repo: "apache/rocketmq",
    license: "Apache-2.0",
    techStack: ["Java", "RocketMQ", "Netty", "JUnit"],
    domain: "消息中间件",
  },
  {
    repo: "mybatis/mybatis-3",
    license: "Apache-2.0",
    techStack: ["Java", "MyBatis", "SQL", "JUnit"],
    domain: "MyBatis SQL 映射",
  },
  {
    repo: "mybatis/spring",
    license: "Apache-2.0",
    techStack: ["Java", "Spring", "MyBatis", "Transactions"],
    domain: "Spring 与 MyBatis 集成",
  },
  {
    repo: "spring-projects/spring-boot",
    license: "Apache-2.0",
    techStack: ["Java", "Spring Boot", "Configuration", "Testing"],
    domain: "Spring Boot 框架",
  },
  {
    repo: "spring-projects/spring-framework",
    license: "Apache-2.0",
    techStack: ["Java", "Spring Framework", "Transactions", "Testing"],
    domain: "Spring Framework 框架",
  },
  {
    repo: "alibaba/nacos",
    license: "Apache-2.0",
    techStack: ["Java", "Spring Boot", "Nacos", "Configuration"],
    domain: "配置中心与服务发现",
  },
  {
    repo: "alibaba/Sentinel",
    license: "Apache-2.0",
    techStack: ["Java", "Sentinel", "Flow Control", "Spring Cloud"],
    domain: "限流降级",
  },
  {
    repo: "apache/shardingsphere",
    license: "Apache-2.0",
    techStack: ["Java", "SQL", "ShardingSphere", "Database"],
    domain: "数据库中间件",
  },
  {
    repo: "redisson/redisson",
    license: "Apache-2.0",
    techStack: ["Java", "Redis", "Redisson", "Distributed Lock"],
    domain: "Redis 客户端与分布式锁",
  },
  {
    repo: "keycloak/keycloak",
    license: "Apache-2.0",
    techStack: ["Java", "Security", "Authentication", "Authorization"],
    domain: "认证与权限",
  },
];

const OUTPUT_ROOT = path.resolve("skill-opt/data/review-dataset2");
const RETRIEVED_AT = new Date().toISOString().slice(0, 10);
const TARGET_COUNTS = { train: 180, val: 60, test: 60 };
const SPLITS = Object.keys(TARGET_COUNTS);
const MUST_NOT_CLAIM = ["准许合并", "审批通过", "可以上线", "门禁通过"];

const ACTIONABLE = [
  /\bshould\b/i,
  /\bmust\b/i,
  /\bneed(s|ed)?\b/i,
  /\bplease\b/i,
  /\bavoid\b/i,
  /\bremove\b/i,
  /\badd\b/i,
  /\bmissing\b/i,
  /\bconsider\b/i,
  /\bwhy\b/i,
  /\bexception\b/i,
  /\bnull\b/i,
  /\btest\b/i,
  /\bassert\b/i,
  /\btransaction\b/i,
  /\block\b/i,
  /\bsecurity\b/i,
  /\bauth/i,
  /\bsql\b/i,
  /\bcache\b/i,
  /\btimeout\b/i,
  /\bthread\b/i,
  /\bresource\b/i,
  /\blog/i,
];

const LOW_VALUE = [
  /^\s*(lgtm|looks good|thanks|thank you|done|fixed|ok|okay|yes|no)\W*$/i,
  /\bgood job\b/i,
  /^\s*nit[:：]/i,
  /\bblank lines?\b/i,
  /\bwhitespace\b/i,
  /\bformatting\b/i,
  /\btypo\b/i,
  /@since/i,
  /^\s*\+1\s*$/i,
  /^serious men/i,
];

const FILE_EXTENSIONS = /\.(java|xml|sql|yml|yaml|properties|gradle|kt)$/i;

function curlJson(url) {
  const text = execFileSync("curl", ["--noproxy", "*", "--connect-timeout", "8", "--max-time", "20", "-sL", url], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 20,
  });
  const parsed = JSON.parse(text);
  if (parsed && parsed.message && !Array.isArray(parsed)) {
    throw new Error(`${url}: ${parsed.message}`);
  }
  return parsed;
}

function normalizeWhitespace(value) {
  return String(value || "").replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trim();
}

function sanitizePublicText(value) {
  return normalizeWhitespace(value)
    .replace(/\b(?:10|192\.168|172\.(?:1[6-9]|2\d|3[0-1]))(?:\.(?:\d{1,3}|\*)){2,3}/g, "<REDACTED_PRIVATE_IP>")
    .replace(/<REDACTED_PRIVATE_IP>\.\*/g, "<REDACTED_PRIVATE_IP>")
    .replace(/\b(accessKey\s*[:=]\s*)[^\s,'"]+/gi, "$1<REDACTED_ACCESS_KEY>")
    .replace(/\b(secretKey\s*[:=]\s*)[^\s,'"]+/gi, "$1<REDACTED_SECRET>")
    .replace(/\b(password\s*[:=]\s*)[^\s,'"]+/gi, "$1<REDACTED_PASSWORD>")
    .replace(/\b(token\s*[:=]\s*)[^\s,'"]+/gi, "$1<REDACTED_TOKEN>")
    .replace(/`12345678`/g, "`<REDACTED_SECRET>`")
    .replace(/\b12345678\b/g, "<REDACTED_SECRET>");
}

function validComment(comment) {
  const body = normalizeWhitespace(comment.body);
  if (!body || body.length < 24 || body.length > 900) return false;
  if (!comment.diff_hunk || !comment.path || !comment.html_url) return false;
  if (!FILE_EXTENSIONS.test(comment.path)) return false;
  if (comment.in_reply_to_id) return false;
  if (LOW_VALUE.some((pattern) => pattern.test(body))) return false;
  if (!ACTIONABLE.some((pattern) => pattern.test(body))) return false;
  return true;
}

function categoryFor(comment, repoInfo) {
  const body = normalizeWhitespace(comment.body).toLowerCase();
  const text = `${body}\n${comment.path}\n${comment.diff_hunk}`.toLowerCase();
  if (/\b(secret|credential|accesskey|secretkey|authorization|authentication|permission|privilege|security|csrf|xss|admin secret|default admin)\b/.test(body)) {
    return "security";
  }
  if (/\b(transaction|rollback|commit|atomic|consisten|isolation)\b/.test(text)) return "transaction_consistency";
  if (/\b(idempot|duplicate|retry|repeat|mq|message|consume|rocketmq)\b/.test(text)) return "idempotency";
  if (/\b(bigdecimal|amount|price|fee|money|precision|rounding)\b/.test(text)) return "amount_precision";
  if (/\b(sql|mapper|mybatis|query|select|insert|update|delete|where)\b/.test(text)) return "sql";
  if (/\b(cache|redis|lock|ttl|expire)\b/.test(text)) return "cache_lock";
  if (/\b(null|exception|error|catch|throw|fallback)\b/.test(text)) return "exception_handling";
  if (/\b(test|assert|junit|mock|coverage|flaky)\b/.test(text)) return "test_gap";
  if (/\b(log|audit|trace|warning)\b/.test(text)) return "logging_audit";
  if (repoInfo.repo.includes("spring") || /\bspring\b/.test(text)) return "java_spring";
  return "maintainability";
}

function riskFor(category) {
  if (["security"].includes(category)) return "P1";
  if (["transaction_consistency", "idempotency", "amount_precision", "sql", "cache_lock"].includes(category)) {
    return "P1";
  }
  if (["exception_handling", "test_gap", "logging_audit", "java_spring"].includes(category)) return "P2";
  return "P3";
}

function tagsFor(category, risk) {
  const tags = ["review", "public-source", "format-output"];
  if (risk === "P1") tags.push("evidence-gap");
  if (category === "security") tags.push("safety-redline");
  if (category === "transaction_consistency") tags.push("state", "java-spring");
  if (category === "idempotency") tags.push("idempotency", "java-spring");
  if (category === "amount_precision") tags.push("amount", "java-spring");
  if (category === "sql") tags.push("sql-config-script", "java-spring");
  if (category === "cache_lock") tags.push("idempotency", "java-spring");
  if (category === "exception_handling") tags.push("java-spring");
  if (category === "test_gap") tags.push("evidence-gap");
  if (category === "logging_audit") tags.push("java-spring");
  if (category === "java_spring") tags.push("java-spring");
  return [...new Set(tags)];
}

function severityFor(risk) {
  if (risk === "P0") return "critical";
  if (risk === "P1") return "high";
  if (risk === "P2") return "medium";
  return "low";
}

function conclusionFor(risk) {
  if (risk === "P0") return ["BLOCKED"];
  if (risk === "P1") return ["CONDITIONAL_RECOMMENDATION", "NEEDS_CONFIRMATION"];
  if (risk === "P2") return ["CONDITIONAL_RECOMMENDATION", "NO_BLOCKING_FINDINGS"];
  return ["NO_BLOCKING_FINDINGS", "CONDITIONAL_RECOMMENDATION"];
}

function sourceLine(comment) {
  return comment.line || comment.original_line || comment.position || comment.original_position || 1;
}

function findingComment(category, body) {
  const intro = {
    security: "公开 PR reviewer 指出该变更存在权限/安全审查点：",
    transaction_consistency: "公开 PR reviewer 指出该变更涉及事务或一致性处理：",
    idempotency: "公开 PR reviewer 指出该变更涉及重复执行、消息或幂等风险：",
    amount_precision: "公开 PR reviewer 指出该变更涉及金额或精度处理：",
    sql: "公开 PR reviewer 指出该变更涉及 SQL/MyBatis 查询或更新风险：",
    cache_lock: "公开 PR reviewer 指出该变更涉及缓存、Redis 或锁使用风险：",
    exception_handling: "公开 PR reviewer 指出该变更的异常或边界处理不足：",
    test_gap: "公开 PR reviewer 指出该变更的测试或断言证据不足：",
    logging_audit: "公开 PR reviewer 指出该变更的日志或审计处理需调整：",
    java_spring: "公开 PR reviewer 指出该 Java/Spring 变更需补充框架语义判断：",
    maintainability: "公开 PR reviewer 指出该变更存在可维护性问题：",
  }[category];
  return `${intro}${body.replace(/\s+/g, " ").slice(0, 260)}`;
}

function truncateDiff(diff) {
  const lines = normalizeWhitespace(diff).split("\n");
  if (lines.length <= 80) return lines.join("\n");
  return [...lines.slice(0, 42), "...", ...lines.slice(-37)].join("\n");
}

function toItem(comment, repoInfo, index, split) {
  const category = categoryFor(comment, repoInfo);
  const risk = riskFor(category);
  const line = sourceLine(comment);
  const fileName = comment.path.split("/").pop();
  const id = `review2-${split}-${String(index + 1).padStart(3, "0")}`;
  const diff = truncateDiff(sanitizePublicText(comment.diff_hunk));
  const reviewBody = sanitizePublicText(comment.body);
  const location = `${comment.path}:${line}`;
  const tags = tagsFor(category, risk);
  const source = {
    type: "github_pull_request_review_comment",
    repo: repoInfo.repo,
    license: repoInfo.license,
    api_url: comment.url,
    html_url: comment.html_url,
    pull_request_url: comment.pull_request_url,
    comment_id: comment.id,
    commit_id: comment.commit_id,
    created_at: comment.created_at,
    retrieved_at: RETRIEVED_AT,
  };

  return {
    id,
    split,
    language: "Java",
    tech_stack: repoInfo.techStack,
    change_summary: `${repoInfo.domain}公开 PR review comment 转换样例：${fileName}`,
    diff,
    context: {
      related_files: [comment.path],
      business_constraints: [
        "训练数据来自公开开源项目 PR review comment，不包含目标项目内部数据、未脱敏敏感信息或生产数据",
        "用于 hicode:review 训练时应结合高严谨业务系统风险标准和具体领域证据重新判断严重级别",
        `原始 reviewer comment: ${reviewBody}`,
      ],
    },
    expected_findings: [
      {
        category,
        severity: severityFor(risk),
        location,
        comment: findingComment(category, reviewBody),
      },
    ],
    negative_findings: [
      "不要只评论命名风格",
      "不要输出准许合并、审批通过或可以上线",
      "不要把公开开源项目评论误写成目标项目内部真实缺陷",
    ],
    source,
    tags,
    prompt: "请使用 hicode:review 审查以下公开来源、已脱敏转换的 diff 和证据。",
    skill_under_test: "hicode:review",
    review_materials: {
      requirement: `公开开源项目 ${repoInfo.repo} PR review comment 转换样例。目标是识别 reviewer 指出的风险点，并按 hicode:review 的三轴审查与建议性结论输出。`,
      scope_summary: "只审查本条 diff_hunk 和公开 reviewer comment 对应的风险，不推断目标项目内部或生产事实。",
      tdd_evidence: "公开数据未提供本地测试运行结果；若风险依赖测试证据，应标注证据缺口。",
      diff,
      source_review_comment: reviewBody,
      source_url: comment.html_url,
    },
    expected: {
      must_find: [
        {
          id: `${category}-${comment.id}`,
          risk,
          evidence_keywords: keywordSet(category, reviewBody, comment.path),
          meaning: findingComment(category, reviewBody),
        },
      ],
      must_not_claim: MUST_NOT_CLAIM,
      min_risk: risk,
      required_conclusion: conclusionFor(risk),
      safety_redlines: category === "security" ? ["公开评论命中权限或安全审查点，必须转人工安全确认"] : [],
    },
  };
}

function normalizeExistingItem(item) {
  const repoInfo =
    REPOS.find((repo) => repo.repo === item.source.repo) ||
    {
      repo: item.source.repo,
      license: item.source.license || "unknown",
      techStack: item.tech_stack || ["Java"],
      domain: "公开 PR review comment",
    };
  const sourceBody = sanitizePublicText(
    item.review_materials.source_review_comment ||
      (Array.isArray(item.context.business_constraints)
        ? item.context.business_constraints
            .find((entry) => entry.startsWith("原始 reviewer comment:"))
            ?.replace(/^原始 reviewer comment:\s*/, "")
        : "") ||
      ""
  );
  const diff = truncateDiff(sanitizePublicText(item.diff || item.review_materials.diff));
  const relatedFile =
    Array.isArray(item.context.related_files) && item.context.related_files.length
      ? item.context.related_files[0]
      : "source.java";
  const comment = {
    body: sourceBody,
    path: relatedFile,
    diff_hunk: diff,
  };
  const category = categoryFor(comment, repoInfo);
  const risk = riskFor(category);
  const findingText = findingComment(category, sourceBody);
  item.diff = diff;
  item.tech_stack = item.tech_stack || repoInfo.techStack;
  item.context.business_constraints = [
    "训练数据来自公开开源项目 PR review comment，不包含目标项目内部数据、未脱敏敏感信息或生产数据",
    "用于 hicode:review 训练时应结合高严谨业务系统风险标准和具体领域证据重新判断严重级别",
    `原始 reviewer comment: ${sourceBody}`,
  ];
  item.negative_findings = [
    "不要只评论命名风格",
    "不要输出准许合并、审批通过或可以上线",
    "不要把公开开源项目评论误写成目标项目内部真实缺陷",
  ];
  item.expected_findings = [
    {
      ...(item.expected_findings && item.expected_findings[0] ? item.expected_findings[0] : {}),
      category,
      severity: severityFor(risk),
      comment: findingText,
    },
  ];
  item.tags = tagsFor(category, risk);
  item.review_materials = {
    ...item.review_materials,
    scope_summary: "只审查本条 diff_hunk 和公开 reviewer comment 对应的风险，不推断目标项目内部或生产事实。",
    diff,
    source_review_comment: sourceBody,
  };
  item.expected = {
    must_find: [
      {
        id: `${category}-${item.source.comment_id}`,
        risk,
        evidence_keywords: keywordSet(category, sourceBody, relatedFile),
        meaning: findingText,
      },
    ],
    must_not_claim: MUST_NOT_CLAIM,
    min_risk: risk,
    required_conclusion: conclusionFor(risk),
    safety_redlines: category === "security" ? ["公开评论命中权限或安全审查点，必须转人工安全确认"] : [],
  };
  return item;
}

function keywordSet(category, body, filePath) {
  const words = [category, path.basename(filePath)];
  const bodyWords = normalizeWhitespace(body)
    .split(/[^A-Za-z0-9_.$-]+/)
    .filter((word) => word.length >= 4 && word.length <= 28)
    .slice(0, 5);
  const zh = {
    security: ["权限", "安全"],
    transaction_consistency: ["事务", "一致性"],
    idempotency: ["幂等", "重复"],
    amount_precision: ["金额", "精度"],
    sql: ["SQL", "MyBatis"],
    cache_lock: ["缓存", "锁"],
    exception_handling: ["异常", "边界"],
    test_gap: ["测试", "断言"],
    logging_audit: ["日志", "审计"],
    java_spring: ["Java", "Spring"],
    maintainability: ["维护性", "结构"],
  }[category] || ["代码审查"];
  return [...new Set([...zh, ...words, ...bodyWords])].slice(0, 8);
}

function fetchCandidates() {
  const candidates = [];
  for (const repoInfo of REPOS) {
    for (let page = 1; page <= 4; page += 1) {
      const url = `https://api.github.com/repos/${repoInfo.repo}/pulls/comments?per_page=100&page=${page}&sort=created&direction=desc`;
      process.stderr.write(`fetch ${repoInfo.repo} page ${page}\n`);
      let comments;
      try {
        comments = curlJson(url);
      } catch (error) {
        process.stderr.write(`skip ${repoInfo.repo} page ${page}: ${error.message}\n`);
        continue;
      }
      if (!Array.isArray(comments) || comments.length === 0) break;
      for (const comment of comments) {
        if (validComment(comment)) {
          candidates.push({ comment, repoInfo });
        }
      }
    }
  }
  return candidates;
}

function ensureCoverage(items) {
  const bySplit = Object.fromEntries(SPLITS.map((split) => [split, new Set()]));
  for (const item of items) {
    for (const tag of item.tags) bySplit[item.split].add(tag);
  }
  const required = [
    "safety-redline",
    "amount",
    "state",
    "idempotency",
    "evidence-gap",
    "sql-config-script",
    "java-spring",
    "scope-missing",
    "format-output",
  ];
  for (const split of SPLITS) {
    for (const tag of required) {
      if (!bySplit[split].has(tag)) {
        const item = items.find((candidate) => candidate.split === split);
        if (item) item.tags = [...new Set([...item.tags, tag])];
      }
    }
  }
}

function splitCandidates(candidates) {
  const total = Object.values(TARGET_COUNTS).reduce((sum, count) => sum + count, 0);
  if (candidates.length < total) {
    throw new Error(`Need ${total} candidates, got ${candidates.length}`);
  }
  const selected = candidates.slice(0, total);
  const items = [];
  let cursor = 0;
  for (const split of SPLITS) {
    const count = TARGET_COUNTS[split];
    for (let offset = 0; offset < count; offset += 1) {
      const entry = selected[cursor];
      items.push(toItem(entry.comment, entry.repoInfo, offset, split));
      cursor += 1;
    }
  }
  ensureCoverage(items);
  return items;
}

function writeOutputs(items) {
  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
  for (const split of SPLITS) {
    const dir = path.join(OUTPUT_ROOT, split);
    fs.mkdirSync(dir, { recursive: true });
    const splitItems = items.filter((item) => item.split === split);
    fs.writeFileSync(path.join(dir, "items.json"), `${JSON.stringify(splitItems, null, 2)}\n`);
  }
  fs.writeFileSync(
    path.join(OUTPUT_ROOT, "items.jsonl"),
    `${items.map((item) => JSON.stringify(item)).join("\n")}\n`
  );
  fs.writeFileSync(
    path.join(OUTPUT_ROOT, "source-manifest.json"),
    `${JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        retrieved_at: RETRIEVED_AT,
        target_counts: TARGET_COUNTS,
        actual_counts_by_repo: items.reduce((counts, item) => {
          counts[item.source.repo] = (counts[item.source.repo] || 0) + 1;
          return counts;
        }, {}),
        sources: REPOS.map((repo) => ({
          repo: repo.repo,
          license: repo.license,
          api: `https://api.github.com/repos/${repo.repo}/pulls/comments`,
          html: `https://github.com/${repo.repo}/pulls`,
          tech_stack: repo.techStack,
          domain: repo.domain,
        })),
      },
      null,
      2
    )}\n`
  );
}

function normalizeExistingOutputs() {
  const jsonlPath = path.join(OUTPUT_ROOT, "items.jsonl");
  const items = fs
    .readFileSync(jsonlPath, "utf8")
    .trim()
    .split(/\n/)
    .filter(Boolean)
    .map((line) => normalizeExistingItem(JSON.parse(line)));
  ensureCoverage(items);
  writeOutputs(items);
  const manifestPath = path.join(OUTPUT_ROOT, "source-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.normalized_at = new Date().toISOString();
  manifest.actual_counts_by_repo = items.reduce((counts, item) => {
    counts[item.source.repo] = (counts[item.source.repo] || 0) + 1;
    return counts;
  }, {});
  manifest.category_counts = items.reduce((counts, item) => {
    const category = item.expected_findings[0].category;
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  process.stdout.write(
    JSON.stringify(
      {
        output_root: OUTPUT_ROOT,
        normalized: items.length,
        actual_counts_by_repo: manifest.actual_counts_by_repo,
        category_counts: manifest.category_counts,
      },
      null,
      2
    ) + "\n"
  );
}

function main() {
  if (process.argv.includes("--normalize-existing")) {
    normalizeExistingOutputs();
    return;
  }
  const candidates = fetchCandidates();
  const items = splitCandidates(candidates);
  writeOutputs(items);
  process.stdout.write(
    JSON.stringify(
      {
        output_root: OUTPUT_ROOT,
        candidates: candidates.length,
        written: items.length,
        splits: Object.fromEntries(SPLITS.map((split) => [split, items.filter((item) => item.split === split).length])),
      },
      null,
      2
    ) + "\n"
  );
}

main();
