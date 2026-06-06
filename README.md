# AI 小说转剧本工具

上传或粘贴小说文本，自动识别章节、提取人物、拆分场次，生成结构化 YAML 剧本初稿。

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

> **安全提醒**：不要把 `.env.local` 或 `DEEPSEEK_API_KEY` 提交到 Git。`.gitignore` 已配置 `.env*` 忽略所有环境变量文件。

## 技术栈

- Next.js 16 (App Router)
- TypeScript
- React
- Zod
- js-yaml
- OpenAI SDK (兼容 DeepSeek)
- Tailwind CSS
