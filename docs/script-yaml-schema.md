# AI 辅助剧本创作工具 YAML Schema 设计文档

## 1. Schema 的用途

本 Schema 定义了「AI 小说转剧本工具」输出的结构化剧本数据格式。它的核心作用是：

- **作为 AI 与人类作者之间的中间语言**：AI 将小说理解为一组结构化数据（人物、地点、场次、节拍、对话），作者在这个结构基础上编辑打磨。
- **作为质量保证的契约**：通过 Zod Schema 校验，确保 AI 输出不存在字段缺失、类型错误、引用断裂等问题。
- **作为多工具互通的桥梁**：YAML 格式既人类可读，也可被其他剧本工具（如 Final Draft、Celtx 的导入功能）进一步处理。

## 2. 顶层结构

```
script
├── metadata          # 元信息
├── source            # 原作章节映射
├── characters        # 人物列表
├── locations         # 地点列表
├── scenes            # 场次列表（核心）
├── structure         # 幕结构
└── notes             # 改编说明
```

这七个顶层模块覆盖了从「原作品是什么样的」到「改编后剧本是什么样的」的完整链路。

## 3. 完整 YAML 模板

```yaml
script:
  metadata:
    title: ""                # 改编后标题
    original_title: ""       # 原作标题
    source_type: "novel"     # 来源类型
    adaptation_type: "film"  # 改编目标类型
    language: "zh-CN"        # 语言
    version: "0.1.0"         # 版本号
    created_by: ""           # 创建者
    created_at: ""           # 创建时间 (ISO 8601)
    description: ""          # 一句话描述

  source:
    chapter_count: 3         # 章节总数
    chapters:
      - chapter_id: "ch_001"
        title: ""
        original_order: 1
        summary: ""
        key_events: []
        emotional_arc: ""
        adaptation_notes: ""

  characters:
    - character_id: "char_001"
      name: ""
      role: "protagonist"
      gender: ""
      age_range: ""
      description: ""
      motivation: ""
      emotional_state: ""
      relationships:
        - target_character_id: "char_002"
          relationship_type: ""
          description: ""

  locations:
    - location_id: "loc_001"
      name: ""
      type: ""           # 住宅 / 室内 / 户外
      description: ""
      atmosphere: ""

  scenes:
    - scene_id: "sc_001"
      source_chapter_id: "ch_001"   # ← 必须能追溯到 source.chapters
      scene_number: 1
      title: ""
      location_id: "loc_001"        # ← 必须能追溯到 locations
      location_name: ""
      time_of_day: ""
      scene_type: ""                # dialogue / drama / montage / internal / transition
      characters: ["char_001"]      # ← character_id 数组
      scene_goal: ""
      conflict: ""
      summary: ""
      beats:
        - beat_id: ""
          type: "action"            # action | emotion | event | visual | sound | memory
          content: ""
          related_character_id: ""
      dialogue:
        - dialogue_id: ""
          speaker: "char_001"       # ← character_id
          speaker_name: ""
          line: ""
          emotion: ""
          action: ""
      visual_notes: ""
      sound_notes: ""
      transition: ""
      unresolved_issues: ""

  structure:
    act_type: "three-act"
    acts:
      - act_id: "act_01"
        title: ""
        purpose: ""
        related_scenes: ["sc_001"]  # ← scene_id 数组

  notes:
    adaptation_strategy: ""
    preserved_elements: []
    changed_elements: []
    unresolved_issues: []
```

## 4. 每个字段的含义

### 4.1 metadata — 元信息

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `title` | string | ✅ | 改编后的作品标题 |
| `original_title` | string | 否 | 原作标题，与 title 相同时可留空 |
| `source_type` | string | ✅ | 来源类型，如 `novel`、`web_novel` |
| `adaptation_type` | string | ✅ | 改编目标，如 `film`、`tv_series`、`stage_play` |
| `language` | string | ✅ | 语言代码，中文为 `zh-CN` |
| `version` | string | ✅ | 语义化版本号，初始为 `0.1.0` |
| `created_by` | string | ✅ | 创建者标识，AI 生成则填工具名 |
| `created_at` | string | ✅ | ISO 8601 时间戳 |
| `description` | string | ✅ | 一句话描述改编作品的核心内容 |

### 4.2 source — 原作章节

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `chapter_count` | number | ✅ | 章节总数 |
| `chapters[].chapter_id` | string | ✅ | 唯一标识，如 `ch_001` |
| `chapters[].title` | string | ✅ | 章节标题（直接从原文识别） |
| `chapters[].original_order` | number | ✅ | 原始章节序号 |
| `chapters[].summary` | string | ✅ | AI 生成的章节摘要 |
| `chapters[].key_events` | string[] | ✅ | 本章关键事件列表 |
| `chapters[].emotional_arc` | string | ✅ | 本章情感弧线描述 |
| `chapters[].adaptation_notes` | string | 否 | 改编时的注意事项 |

### 4.3 characters — 人物

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `character_id` | string | ✅ | 唯一标识，如 `char_001`，全局引用该 ID |
| `name` | string | ✅ | 人物名称 |
| `role` | string | ✅ | 角色类型：`protagonist` / `antagonist` / `supporting` |
| `gender` | string | ✅ | 性别 |
| `age_range` | string | ✅ | 年龄段，如 `童年`、`成年`、`中年`、`童年—成年`（跨时间线） |
| `description` | string | ✅ | 人物描述 |
| `motivation` | string | ✅ | 人物动机 |
| `emotional_state` | string | ✅ | 当前情绪状态 |
| `relationships` | array | ✅ | 与其他人物关系列表 |

**relationships 子字段：**

| 字段 | 类型 | 说明 |
|---|---|---|
| `target_character_id` | string | 关系目标人物 ID |
| `relationship_type` | string | 关系类型，如 `母女`、`夫妻`、`朋友` |
| `description` | string | 关系描述 |

### 4.4 locations — 地点

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `location_id` | string | ✅ | 唯一标识，如 `loc_001` |
| `name` | string | ✅ | 地点名称 |
| `type` | string | ✅ | 类型：`住宅` / `室内` / `户外` |
| `description` | string | ✅ | 地点描述 |
| `atmosphere` | string | ✅ | 氛围描述（用于摄影师和美术指导） |

### 4.5 scenes — 场次（核心）

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `scene_id` | string | ✅ | 唯一标识，如 `sc_001` |
| `source_chapter_id` | string | ✅ | 来源章节 ID，必须存在于 `source.chapters` |
| `scene_number` | number | ✅ | 场次序号（全局递增） |
| `title` | string | ✅ | 场次标题 |
| `location_id` | string | ✅ | 地点 ID，必须存在于 `locations` |
| `location_name` | string | ✅ | 地点名称（冗余，方便阅读） |
| `time_of_day` | string | ✅ | 时间：`白天`、`午后`、`傍晚`、`夜晚`、`深夜` |
| `scene_type` | string | ✅ | 类型：`dialogue` / `drama` / `montage` / `internal` / `transition` |
| `characters` | string[] | ✅ | 出场人物 ID 数组 |
| `scene_goal` | string | ✅ | 本场戏的目标 |
| `conflict` | string | ✅ | 核心冲突 |
| `summary` | string | ✅ | 场次摘要 |
| `beats` | array | ✅ | 叙事节拍列表 |
| `dialogue` | array | ✅ | 对话列表 |
| `visual_notes` | string | 否 | 视觉备注（摄影、色调建议） |
| `sound_notes` | string | 否 | 声音备注（音效、配乐建议） |
| `transition` | string | ✅ | 转场方式 |
| `unresolved_issues` | string | 否 | 未解决的问题（留给作者） |

**beats 子字段：**

| 字段 | 类型 | 说明 |
|---|---|---|
| `beat_id` | string | 唯一标识 |
| `type` | enum | 类型：`action`、`emotion`、`event`、`visual`、`sound`、`memory` |
| `content` | string | 节拍内容描述 |
| `related_character_id` | string | 关联人物 ID（可为空） |

**dialogue 子字段：**

| 字段 | 类型 | 说明 |
|---|---|---|
| `dialogue_id` | string | 唯一标识 |
| `speaker` | string | 说话人 **character_id**（不是名字） |
| `speaker_name` | string | 说话人名称（冗余，方便阅读） |
| `line` | string | 台词内容 |
| `emotion` | string | 情绪描述 |
| `action` | string | 伴随动作（可为空） |

### 4.6 structure — 幕结构

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `act_type` | string | ✅ | 结构类型，如 `three-act` |
| `acts[].act_id` | string | ✅ | 幕 ID |
| `acts[].title` | string | ✅ | 幕标题 |
| `acts[].purpose` | string | ✅ | 本幕目的 |
| `acts[].related_scenes` | string[] | ✅ | 包含的 scene_id 列表 |

### 4.7 notes — 改编说明

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `adaptation_strategy` | string | ✅ | 改编策略说明 |
| `preserved_elements` | string[] | ✅ | 保留的元素 |
| `changed_elements` | string[] | ✅ | 改变的元素 |
| `unresolved_issues` | string[] | ✅ | 未决问题（供作者后续决定） |

## 5. 每个模块的设计原因

### metadata
剧本需要标注来源、版本和创建信息。原作者、改编者、创建时间对于后续迭代追溯至关重要。`original_title` 允许为空，因为改编标题可能和原作一致。

### source
记录原文章节结构是改编链条的起点。`chapter_id` 被 `scene.source_chapter_id` 引用，确保每个场次都能追溯到原文出处，方便作者「这场戏改自哪一章？」。

### characters
人物必须用 `character_id` 唯一标识，而非名字。因为：
- 同一人物在不同语境中可能有不同称呼（如「娘」「我妈」「母亲」）
- `dialogue.speaker`、`scenes.characters`、`beats.related_character_id`、`relationships.target_character_id` 全部通过 ID 引用，避免字符串匹配错误
- `relationships` 内嵌在人物中而非独立列表，因为关系是「人物的属性」

### locations
独立列表，因为同一地点可能出现在多个场次中。`scenes.location_id` 引用此地点的 ID。`location_name` 在 scene 中冗余存储是为了 YAML 可读性——读者不用跳转到 locations 区就能知道场景在哪里。

### scenes（核心设计）
每一场戏是改编的最小完整单元。设计原则：

- **`scene_goal` + `conflict`**：每场戏必须有一个目标和冲突，这是剧本的基本语法
- **`beats`（节拍）**：将一场戏拆分为更小的叙事单元，6 种类型覆盖了视听叙事的要素：
  - `action`：动作（人物做什么）
  - `emotion`：情感（人物感受什么）
  - `event`：事件（发生什么）
  - `visual`：视觉（观众看到什么）
  - `sound`：声音（观众听到什么）
  - `memory`：记忆（闪回/内心回忆）
- **`dialogue`**：对话独立于节拍，因为一句台词可能跨越多个节拍，一个节拍内也可能有多句台词
- **`visual_notes` + `sound_notes` + `transition`**：为导演、摄影、音效提供创作提示，是「剧本的剧本」
- **`unresolved_issues`**：留给作者的问题标记，承认 AI 的局限性

### structure
幕结构用 `related_scenes` 引用场次，而非将场次嵌入幕中。这是因为同一场戏可能服务于多个幕（非线性叙事），且场次的顺序已经是 `scene_number` 隐含的。

### notes
改编不是一次完成的工作。`preserved_elements` 和 `changed_elements` 帮作者理解 AI 做对了什么、做错了什么，`unresolved_issues` 标记需要人工决策的问题。

## 6. 为什么先让 AI 输出 JSON，再转 YAML

| 阶段 | 格式 | 原因 |
|---|---|---|
| AI 输出 | **JSON** | LLM 生成 JSON 的可靠性和速度远高于 YAML。JSON 语法规整、无缩进歧义，模型的训练数据中 JSON 占比高 |
| 存储/展示 | **YAML** | YAML 人类可读性更好，缩进直观，适合作者编辑。js-yaml 库完成 `Object → YAML 字符串` 的转换无任何歧义 |
| 校验 | **JSON 对象** | Zod 基于 JavaScript 对象做校验，无论来源是 JSON 还是 YAML，最终都变成对象再校验 |

这条流水线是：**AI → JSON 字符串 → JSON.parse → normalize → Zod 校验 → js-yaml → YAML 字符串 → 页面展示/下载**。

## 7. 为什么需要 Zod 校验

AI 的输出不稳定——每次可能缺少不同字段、使用错误的数据类型、引用不存在的 ID。

Zod Schema 在**服务端**（API Route 接收到 AI 输出后）和**前端**（生成 YAML 后再次确认）两层都做校验，提供：

1. **类型强制**：`scene_number` 必须是正整数，`beats.type` 必须是 6 种枚举之一，`speaker` 必须是字符串而非数字
2. **结构完整**：`script` 根对象必须包含全部 7 个子模块，不能缺失
3. **引用检查**（间接）：因 Zod 本身不做跨字段校验，所以代码中 `scenes.characters`、`dialogue.speaker` 等字段通过约定使用 `character_id` 字符串格式，配合 YAML 阅读时人工校验
4. **清晰错误**：校验失败时输出字段路径 + 具体原因，如 `script.scenes.2.beats.1.type: Invalid option`

另外，`normalizeScriptYamlOutput()` 在校验前还会做一次**清洗**：空字符串填入「待补充」、中文 beat type 映射为英文、字符串型 relationships 转为对象。这层容错让 Zod 不需要过于宽松。

## 8. 以《笑的历史》为例

### 8.1 章节映射

| 原文章节 | `chapter_id` | AI 生成的摘要 |
|---|---|---|
| 第一章 童年的笑 | `ch_001` | 女主回忆童年如何爱笑，笑是她与世界互动的方式 |
| 第二章 初到夫家 | `ch_002` | 嫁入夫家后，婆婆的规矩开始压制她的天性 |
| 第三章 笑的消失 | `ch_003` | 家道中落，丈夫冷漠，女主发现自己彻底笑不出来了 |

### 8.2 人物映射

| 原文称呼 | `character_id` | `role` |
|---|---|---|
| 我（女主） | `char_001` | `protagonist` |
| 娘 | `char_002` | `supporting` |
| 你（丈夫） | `char_003` | `supporting` |
| 爸爸 | `char_004` | `supporting` |
| 婆婆 | `char_005` | `antagonist` |
| 郭妈妈 | `char_006` | `supporting` |
| 小五 | `char_007` | `supporting` |

所有引用（`dialogue.speaker`、`scenes.characters`、`relationships.target_character_id`）都使用 `char_00X`，不出现「我」「娘」「你」等称呼。

### 8.3 地点映射

| 原文提及 | `location_id` | `type` |
|---|---|---|
| 娘家 | `loc_001` | `住宅` |
| 夫家 | `loc_002` | `住宅` |
| 厨房 | `loc_003` | `室内` |
| 夫家内室 | `loc_004` | `室内` |

### 8.4 场次映射

| 场次 | `scene_id` | `source_chapter_id` | 原文依据 |
|---|---|---|---|
| 女主回答为什么不爱笑 | `sc_001` | `ch_001` | 开篇内心独白 |
| 童年的笑 | `sc_002` | `ch_001` | 回忆童年片段 |
| 笑让父亲消气 | `sc_003` | `ch_001` | 父亲回家发怒，女儿用笑化解 |
| 初到夫家 | `sc_004` | `ch_002` | 新婚当日及初见婆婆 |
| 第一次因大笑受责备 | `sc_005` | `ch_002` | 厨房大笑被婆婆训斥 |
| 家境败落 | `sc_006` | `ch_003` | 生意失败，家庭气氛恶化 |
| 彻底笑不出来 | `sc_007` | `ch_003` | 深夜对镜，发现笑已死 |

注意场次不完全按章节顺序：`ch_001`（童年的笑）裂变成了 3 场戏，因为原文信息量大、时间跨度长，需要拆分为多个戏剧单元。`ch_003` 裂变成了 2 场。

### 8.5 幕结构

| 幕 | 包含场次 | 作用 |
|---|---|---|
| 第一幕：笑的时代 | `sc_001` ~ `sc_003` | 建立女主爱笑的天性 |
| 第二幕：笑的剥夺 | `sc_004` ~ `sc_006` | 规矩和变故压制笑声 |
| 第三幕：笑的消失 | `sc_007` | 高潮——笑已死 |

三幕对应笑的三个阶段：**拥有 → 失去 → 发现已失去**。

## 9. MVP 阶段的最小可用 Schema

MVP 阶段的核心原则是：**宁可有一个空的结构，也不能缺失这个结构**。下面的「最小 YAML」包含所有必填模块，但填充了最少的样例数据：

```yaml
script:
  metadata:
    title: "未命名作品"
    original_title: ""
    source_type: "novel"
    adaptation_type: "film"
    language: "zh-CN"
    version: "0.1.0"
    created_by: "AI 小说转剧本工具"
    created_at: "2026-01-01T00:00:00.000Z"
    description: "待补充"

  source:
    chapter_count: 1
    chapters:
      - chapter_id: "ch_001"
        title: "第一章"
        original_order: 1
        summary: "待补充"
        key_events: ["待补充"]
        emotional_arc: "待补充"
        adaptation_notes: ""

  characters:
    - character_id: "char_001"
      name: "待补充"
      role: "protagonist"
      gender: "待补充"
      age_range: "待补充"
      description: "待补充"
      motivation: "待补充"
      emotional_state: "待补充"
      relationships:
        - target_character_id: "char_unknown"
          relationship_type: "待补充"
          description: "待补充"

  locations:
    - location_id: "loc_001"
      name: "待补充"
      type: "室内"
      description: "待补充"
      atmosphere: "待补充"

  scenes:
    - scene_id: "sc_001"
      source_chapter_id: "ch_001"
      scene_number: 1
      title: "待补充"
      location_id: "loc_001"
      location_name: "待补充"
      time_of_day: "待补充"
      scene_type: "dialogue"
      characters: ["char_001"]
      scene_goal: "待补充"
      conflict: "待补充"
      summary: "待补充"
      beats:
        - beat_id: "beat_001"
          type: "action"
          content: "待补充"
          related_character_id: ""
      dialogue:
        - dialogue_id: "dlg_001"
          speaker: "char_001"
          speaker_name: "待补充"
          line: "待补充"
          emotion: "待补充"
          action: ""
      visual_notes: ""
      sound_notes: ""
      transition: "切至"
      unresolved_issues: ""

  structure:
    act_type: "three-act"
    acts:
      - act_id: "act_01"
        title: "第一幕"
        purpose: "待补充"
        related_scenes: ["sc_001"]

  notes:
    adaptation_strategy: "待补充"
    preserved_elements: ["待补充"]
    changed_elements: ["待补充"]
    unresolved_issues: ["待补充"]
```

## 10. 后续可扩展方向

### 10.1 分镜扩展（Shot List）
当前 `beats` 是叙事层面的最小单元。未来可在 beat 下增加 `shots` 数组，描述具体的镜头语言（景别、运镜、构图），使输出从「文学剧本」升级为「分镜头脚本」。

```yaml
beats:
  - beat_id: "beat_001"
    type: "visual"
    shots:
      - shot_id: "shot_001"
        type: "close_up"
        duration: "3s"
        description: "女主脸部特写"
```

### 10.2 时间线信息
当前 `time_of_day` 是字符串。可以扩展为结构化的时间信息，包括故事内时间、场景持续时间等，便于排期和统筹。

### 10.3 多版本管理
当前 `metadata.version` 只是字符串。未来可加入 diff 机制，记录每次 AI 生成和人工修改之间的差异。

### 10.4 道具和服装
新增 `props` 和 `costumes` 模块，记录场次中需要的道具和服装信息。

### 10.5 预算和制作备注
新增 `production_notes` 模块，包含预估预算、拍摄难度等实务信息。

### 10.6 长文本分块处理
当前输入限制 30,000 字符。未来支持自动分块 + 合并，处理超长篇小说。

### 10.7 跨字段引用校验
当前 `scene.location_id` 和 `source.chapters[].chapter_id` 的引用一致性靠 AI 自觉遵守。未来可在 Zod 校验后增加**业务校验层**，遍历所有 scene，确认每个 `source_chapter_id`、`location_id`、`characters` 中的 ID 都能在对应列表中查到。
