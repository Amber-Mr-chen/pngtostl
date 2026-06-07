# PNGtoSTL Rebuild Control Board

项目：pngtostl
域名：pngtostl.net
目标市场：US / English
当前模式：manual-confirmed ShipSolo 13-step rebuild
当前状态：V1_LAUNCHED_TASK_FIRST_IA_SEO_BASICS_PASSED
重做方式：option 2 - 在当前仓库内推倒重写，旧页面已由新站实现替换
事实源：project-control.md + stage-dag.md + stage-status.md + checkpoints/ + seo-launch-recheck-2026-06-06.md

## Owner 已确认

- 当前项目整体推倒重做。
- 使用 ShipSolo 全套 13 个 skill / 13 个步骤。
- 每一步必须先交付阶段产物，等 owner 确认后才能进入下一步。
- 允许在当前仓库内逐步替换旧页面。
- 首页 IA 从格式入口收敛为 task-first：一个统一 `Image to STL` 入口，保留 PNG/JPG 等格式页作为 SEO/preset 入口。

## 当前仓库/线上状态

- 工作目录：`/root/projects/pngtostl`
- 分支：`main`
- 生产地址：`https://pngtostl.net/`
- Worker：`pngtostl`
- 最新已验证部署版本：`45778b38-ffb6-4700-a0e1-e971eb5a515f`
- 线上首页、核心内页、robots、sitemap、llms、API smoke 均已复查。
- Git 清理策略：正式 repo 只保留源码、部署配置、必要 QA 脚本、checkpoint 和上线复查记录；调研截图/原始 JSON/中间 handoff 已移入本地 `project-archive/` 并忽略。

## 13-step 流程

1. Orchestrator / Preflight - site-orchestrator-playbook
2. Keyword research - keyword-research-agent
3. Product definition / PRD - product-definition-prd
4. Pricing calibration - site-pricing-calibration
5. Compliance pipeline - student-site-compliance-pipeline
6. SEO copy freeze - site-copywriting-student
7. Design source - site-design-student
8. Backend/data contract - backend-auto-site-cloudflare-workers
9. Frontend implementation - frontend-site-automation
10. SEO launch workflow - seo-launch-workflow
11. QA acceptance - student-site-qa-acceptance
12. Ops/growth launch - site-ops-growth-launch
13. Data review/iteration - site-data-review-iteration

## 硬闸门

- 每一步最后必须输出：DONE / BLOCKED / NEEDS_REVIEW。
- 每一步 DONE 后必须等 owner 明确回复“确认 / 继续 / 通过”才进入下一步。
- 设计、前端、部署、公开发布不能跳过上游 PRD、文案冻结、合规和 QA。
- 任何线上部署、公开发布、支付、账号、真实用户数据动作前必须单独确认。

## 当前步骤：Step 10-11 post-launch stabilization

阶段：SEO launch recheck + QA acceptance stabilization
Skill：seo-launch-workflow + student-site-qa-acceptance + frontend-site-automation
状态：DONE_WITH_GSC_BING_CONFIRMED

已完成：

- 生产部署：DONE
- 任务导向 IA：DONE
- 首页 title/metadata 修复：DONE
- `/llms.txt`：DONE
- `/robots.txt`：DONE
- `/sitemap.xml`：DONE
- 核心工具 API smoke：DONE
- responsive QA：DONE
- core tool QA：DONE
- git 工作区清理：DONE_PENDING_COMMIT

阻塞/待 owner 配合：

- GSC/Bing sitemap 提交已由 owner 截图确认成功；下一步只需按需做 priority URL Inspection。
- 是否进入 Step 12 运营冷启动，需要 owner 确认。

## 下一步建议

1. 提交当前干净源码版本到 git。
2. 按需对 3 个新 SEO guide 执行 GSC/Bing URL Inspection。
3. 进入 Step 12：ops/growth launch，做低风险目录提交/冷启动监控。
