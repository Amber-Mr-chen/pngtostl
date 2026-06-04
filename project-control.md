# PNGtoSTL Rebuild Control Board

项目：pngtostl
域名：pngtostl.net
目标市场：US / English
当前模式：manual-confirmed ShipSolo 13-step rebuild
当前状态：STEP_01_ORCHESTRATOR_READY_FOR_OWNER_CONFIRMATION
重做方式：option 2 - 在当前仓库内推倒重写，旧页面逐步替换
事实源：project-control.md + stage-dag.md + stage-status.md + blocked-log.md

## Owner 已确认
- 当前项目整体推倒重做。
- 使用 ShipSolo 全套 13 个 skill / 13 个步骤。
- 每一步必须先交付阶段产物，等 owner 确认后才能进入下一步。
- 允许在当前仓库内逐步替换旧页面。

## 当前仓库状态
- 工作目录：/root/projects/pngtostl
- 分支：main
- 现有站点版本：已从工作区清场，作为 git 历史中的旧版本存在，不再作为新方案设计依据。
- 已删除旧站实现范围：`src/`、`.next/`、`.open-next/`、`.wrangler/`、上一轮 PRD/页面矩阵/文案冻结/交接等旧内容文档。
- 当前只保留工程配置、依赖配置、部署配置、git 仓库和 13 步流程事实源文件。
- 处理原则：清场后不进入 Step 2，等待 owner 明确确认。

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

## 当前步骤：Step 1 / 13
阶段：Orchestrator / Preflight
Skill：site-orchestrator-playbook
状态：DONE_PENDING_OWNER_CONFIRMATION
本阶段目的：建立总控事实源、13 步顺序、确认重做边界和阻塞项。

## 当前已知阻塞/待确认
- 是否接受 Step 1 的 13 步顺序。
- 是否在 Step 2 继续以 `png to stl` / `image to stl` / `lithophane` / `3d print image` 作为种子词，还是重新给种子词。
- 旧未提交改动是否保留到实现阶段统一清理，还是现在先丢弃。默认：先保留，不动。

## 下一步
等待 owner 确认 Step 1。确认后进入 Step 2：keyword-research-agent。
