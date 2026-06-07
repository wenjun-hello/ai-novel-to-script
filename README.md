# AI 小说转剧本工具

上传或粘贴小说文本，自动识别章节、提取人物、拆分场次，生成结构化 YAML 剧本初稿。

## 在线 Demo

[https://wenjun-hello.github.io/ai-novel-to-script/](https://wenjun-hello.github.io/ai-novel-to-script/)

> 在线 Demo 为静态 GitHub Pages 版本，包含 Mock 示例生成和完整 UI，AI 真实生成需在本地运行。

## Demo 视频

[https://pan.quark.cn/s/39c43f1c9745]

项目根目录 `public/demo-video.mov`，展示了完整操作流程：加载示例文本 → 章节识别 → Mock 生成 → YAML 预览与下载 → AI 真实生成。

## 功能特点

- **章节自动识别**：支持中文小说常见章节格式（"第X章"、"Chapter X"等），自动拆分段落
- **人物提取**：从文本中识别主要人物及其关系
- **场次拆分**：按戏剧结构将小说内容拆分为独立场次
- **结构化 YAML 输出**：包含 metadata、source、characters、locations、scenes、beats、dialogue、structure、notes 九大模块
- **Mock 示例模式**：无需 API Key 即可体验完整功能（基于《笑的历史》示例）
- **AI 真实生成**：接入 DeepSeek / OpenAI API，自动分析任意小说并生成剧本初稿
- **Zod Schema 校验**：双端校验确保输出数据结构完整、类型正确
- **YAML 下载**：一键下载生成的剧本 YAML 文件

## YAML Schema 文档

完整的数据结构设计文档见：[docs/script-yaml-schema.md](docs/script-yaml-schema.md)

文档涵盖：Schema 用途、顶层结构、字段说明、设计原因、JSON→YAML 转换策略、Zod 校验机制、《笑的历史》映射示例、MVP 最小可用 Schema、后续扩展方向。

## 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## Mock 模式（无需 API Key）

1. 打开页面，保持 "Mock 示例生成" 模式
2. 点击 "加载示例文本：《笑的历史》"
3. 点击 "生成剧本 YAML"
4. 查看 YAML 预览并下载

## AI 模式（需配置 API Key）

### 本地配置步骤

1. 打开项目根目录
2. 创建或编辑 `.env.local`
3. 写入以下内容（**把第一行替换成你的真实 API Key**）：

```bash
DEEPSEEK_API_KEY=你的真实DeepSeek API Key
AI_PROVIDER=deepseek
AI_MODEL=deepseek-chat
AI_BASE_URL=https://api.deepseek.com
```

4. 保存文件
5. **停止当前 `npm run dev`**（按 Ctrl+C）
6. **重新运行 `npm run dev`**（环境变量只在启动时加载）
7. 打开页面，选择 **"AI 真实生成"**
8. 点击 "加载示例文本"
9. 点击 "生成剧本 YAML"
10. 等待 AI 生成（约 10-30 秒），查看结果

### 获取 DeepSeek API Key

访问 https://platform.deepseek.com/api_keys 注册并创建 API Key。

### 使用 OpenAI

如果你有 OpenAI API Key，将 `.env.local` 改为：

```bash
OPENAI_API_KEY=你的真实OpenAI API Key
AI_PROVIDER=openai
AI_MODEL=gpt-4.1-mini
```

不需要设置 `AI_BASE_URL`（默认使用 api.openai.com）。

## 项目结构

```
src/
  app/
    api/generate-script/route.ts   # 服务端 AI API Route（API Key 安全）
    page.tsx                        # 主页面
  components/
    NovelInput.tsx                  # 小说文本输入
    ChapterPreview.tsx              # 章节识别结果
    YamlPreview.tsx                 # YAML 预览 + 下载
  lib/
    chapterParser.ts                # 章节识别
    schema.ts                       # Zod Schema 校验
    types.ts                        # TypeScript 类型
    mockGenerateScriptYaml.ts       # Mock 数据生成
    scriptGenerator.ts              # 生成服务统一入口
    normalizeScriptYaml.ts          # AI 输出解析 + 容错
    yamlExport.ts                   # YAML 导出 + 下载
    devTest.ts                      # 开发自测
    prompts/
      scriptGenerationPrompt.ts     # AI Prompt 模板
  data/samples/
    laughHistorySample.ts           # 测试样本《笑的历史》
```

## GitHub Pages Demo 部署

GitHub Pages 版本是**静态 Demo 版**，只包含 Mock 示例生成功能。AI 真实生成需要服务端 API Route，静态托管无法运行。

### 部署步骤

1. 将代码推送到 GitHub 仓库
2. 如果仓库名不是 `ai-novel-to-script`，修改 `package.json` 中 `build:github` 的 `NEXT_PUBLIC_BASE_PATH` 为你的仓库名（如 `/my-repo`）
3. 打开 GitHub 仓库 **Settings** → **Pages**
4. **Source** 选择 **GitHub Actions**
5. Push 到 `main` 分支
6. 等待 Actions 构建完成（`.github/workflows/deploy-github-pages.yml`）
7. 打开 Pages 提供的网址：`https://<你的用户名>.github.io/<仓库名>/`

### 版本差异

| 功能 | GitHub Pages Demo | 本地完整版 |
|---|---|---|
| 章节识别 | ✅ | ✅ |
| Mock 剧本 YAML 生成 | ✅ | ✅ |
| Schema 校验 | ✅ | ✅ |
| YAML 下载 | ✅ | ✅ |
| AI 真实生成 (DeepSeek) | ❌ | ✅ |
| 自定义小说输入 | ✅ | ✅ |

### 本地构建验证

```bash
# 验证 GitHub Pages 构建
npm run build:github

# 构建后 out/ 目录即为静态网站文件
ls out/
```

> **安全提醒**：不要把 `.env.local` 或 `DEEPSEEK_API_KEY` 提交到 Git。`.gitignore` 已配置 `.env.local` 和 `.env*.local` 忽略本地环境变量文件。`.env.example`（模板）可以安全提交。

## 技术栈

- Next.js 16 (App Router)
- TypeScript
- React
- Zod
- js-yaml
- OpenAI SDK (兼容 DeepSeek)
- Tailwind CSS


## 后续改进方向

- **分镜扩展（Shot List）**：在 beat 下增加 shots 数组，描述镜头语言（景别、运镜、构图）
- **长文本分块处理**：当前输入限制 30,000 字符，未来支持自动分块 + 合并处理超长篇小说
- **跨字段引用校验**：增加业务校验层，确认所有 scene 中的 ID 引用（location_id、character_id 等）能在对应列表中查到
- **时间线信息结构化**：将 time_of_day 扩展为故事内时间、场景持续时间等结构化数据
- **多版本管理**：记录每次 AI 生成和人工修改之间的 diff
- **道具和服装模块**：记录场次中需要的道具和服装信息
- **更多 AI 提供商支持**：Anthropic Claude、国产大模型等
- **导出格式扩展**：支持 Final Draft (.fdx)、PDF 等专业剧本格式导出
