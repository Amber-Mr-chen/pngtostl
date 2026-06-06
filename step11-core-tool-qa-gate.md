# Step 11 Core Tool QA Gate

项目：pngtostl.net
阶段：Step 11 / QA acceptance
状态：IN_PROGRESS_REWORK

## 为什么重开 Step 11

前一轮 Step 9/10 验证偏技术链路：build、API smoke、页面渲染、metadata。owner 真人试用后暴露：参数交互、表单提交、Paint 3D 可视方向、图标/emoji 输出质量、细节网格等核心体验问题。因此 Step 11 不进入下一步，先按核心工具返工处理。

## Step 11 通过标准

只有全部满足，才能进入 Step 12。

### 1. 上传与生成链路
- 上传 PNG 后，点击 Generate STL / 生成 STL 不刷新页面。
- 生成过程中按钮进入 processing 状态。
- 成功后自动下载 `.stl`。
- 无文件时显示明确错误，不刷新页面。
- 非 PNG 返回明确 unsupported 错误。

### 2. 参数必须真实影响输出
- Output width 改变 STL 坐标尺寸。
- Relief height 改变最大厚度。
- Base thickness 改变底板厚度。
- Icon threshold 改变凸起覆盖比例。
- Smoothing 改变边缘平滑高度分布。
- Detail level 改变 mesh grid / triangle count / file size。
- Invert height 改变高低关系。

### 3. STL 必须真实可用
- 输出为 binary STL。
- header triangle count 与响应头一致。
- 坐标方向对 Paint 3D 友好：X/Z 为正面，Y 为厚度。
- 保留原图比例，不把宽图/高图强行变成正方形。
- 默认 detail 下不是低清 demo；高 detail 下能保留更多图形细节。

### 4. 常见图片场景
- 透明背景 emoji/icon：透明区不变成整块黑板，图案区域凸起。
- 白底黑图标：白底保持低，黑色图案凸起。
- 纯黑方块：生成整块凸起方板，属于合理结果。
- 宽图：输出比例正确。
- 高图：输出比例正确。

### 5. 用户预期说明
- 页面明确说明 STL 不保存颜色。
- 页面默认模式适合 icon / emoji / logo。
- 输出后显示 mesh、triangle count、file size、coverage。
- 不承诺彩色模型、完整 CAD 模型或万能照片转 3D。

## 当前结论

Step 11 仍处于 `IN_PROGRESS_REWORK`。
不能进入 Step 12，直到真人最小验收通过。
