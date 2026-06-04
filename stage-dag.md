# PNGtoSTL Rebuild Stage DAG

模式：manual-confirmed ShipSolo 13-step rebuild
规则：每一步 owner 确认后才进入下一步。

```text
01 orchestrator / preflight
  -> 02 keyword research
    -> 03 product definition / PRD
      -> 04 pricing calibration
      -> 05 compliance pipeline
        -> 06 SEO copy freeze
          -> 07 design source
            -> 08 backend / data contract
            -> 09 frontend implementation
              -> 10 SEO launch workflow
                -> 11 QA acceptance
                  -> 12 ops / growth launch
                    -> 13 data review / iteration
```

## 并行限制
- 本项目当前按 owner 要求不并行推进阶段。
- 即使理论上 pricing/compliance 可并行，也必须逐步确认。
- 前端实现不得早于 PRD、文案冻结、设计真源、后端/数据合同。

## Step Gate
- Step 1 gate：owner 确认流程、边界和下一步种子词。
- Step 2 gate：关键词机会有证据，owner 确认主词/簇。
- Step 3 gate：PRD 和页面矩阵确认。
- Step 4 gate：定价/商业模型确认。
- Step 5 gate：合规边界和法律页合同确认。
- Step 6 gate：文案冻结确认。
- Step 7 gate：设计真源确认。
- Step 8 gate：后端/数据合同确认。
- Step 9 gate：实现、构建、预览确认。
- Step 10 gate：SEO GO 确认。
- Step 11 gate：QA GO 确认。
- Step 12 gate：公开发布动作确认。
- Step 13 gate：数据口径和迭代决策确认。
