# Lumerical Script Language Extension Enhancement Project

## 概述
本项目旨在增强 Lumerical Script Language VS Code 扩展的功能，通过集成 `lumerical-docs` Git 子模块，为 Lumerical 脚本命令提供丰富的 Markdown 文档支持，包括增强的悬停提示、自动完成和语法高亮功能。

## 项目目标
1. **集成文档系统**：将 `lumerical-docs` 作为 Git 子模块集成，保持文档与扩展同步
2. **增强悬停功能**：为 727 个 Lumerical 命令提供完整的 Markdown 文档悬停提示
3. **改进开发体验**：通过丰富的文档和自动完成提高开发效率
4. **保持向后兼容**：确保现有功能（基本语法高亮）不受影响

## 当前状态
### 现有扩展功能
- **语法高亮**：基于 TextMate 语法的 `.lsf` 文件高亮
- **基本悬停**：使用 `commands.json` (766 个命令，信息有限)
- **代码片段**：765+ 命令的代码片段
- **语言配置**：`.lsf` 文件关联和基础配置

### 数据源
- `commands.json`：766 个命令，仅包含 `name`、`description`、`usage`、`category`
- `references/lumscript_command.csv`：过时的命令列表
- `lumerical-docs`：独立的文档项目，包含 `docs/lsf-script/en/*.md` (727 个 Markdown 文件)

## 目标状态
### 功能增强
1. **丰富悬停内容**：
   - 完整的 Markdown 文档（包含语法表格、代码示例）
   - 移除 "See Also" 链接部分以保持界面简洁
   - 支持 Markdown 表格和代码块渲染

2. **智能感知**：
   - 基于增强命令数据的自动完成
   - 参数提示和文档集成

3. **文档同步**：
   - Git 子模块确保文档与扩展版本同步
   - 预生成的 `commands-enhanced.json` 优化性能

## 架构设计
```
lumerical-script-language/
├── docs/                          # Git 子模块: lumerical-docs
├── scripts/                       # 构建脚本
│   └── generate-commands.js       # 生成增强命令数据
├── src/                           # 重构的扩展代码
│   ├── command-loader.js          # 加载 commands-enhanced.json
│   ├── hover-provider.js          # 增强的悬停提示 (Markdown 渲染)
│   └── completion-provider.js     # 基于增强数据的自动完成
├── data/                          # 生成的数据文件
│   └── commands-enhanced.json     # 增强的命令元数据
├── test/                          # 单元测试
│   ├── command-loader.test.js
│   └── hover-provider.test.js
└── package.json                   # 更新构建脚本和依赖
```

### 增强命令数据结构
```json
{
  "name": "abs",
  "description": "Returns the absolute value of a number or matrix.",
  "usage": "abs();",
  "category": "general",
  "markdown": "# abs\n\nReturns the absolute value...",
  "summary": "Returns the absolute value of a number or matrix.",
  "syntax": [
    {"syntax": "out = abs(x);", "description": "Returns the absolute value of x."}
  ],
  "example": "?x=linspace(0, 2+1i,2);\n...",
  "seeAlso": []  // 根据用户偏好移除
}
```

## 实施阶段

### 第一阶段：设置与数据生成 (预计: 2-3 天)
#### 任务 1.1: Git 子模块集成
- 添加 `lumerical-docs` 作为 `docs/` 子模块
- 更新 `.gitmodules` 配置文件
- 验证子模块初始化

#### 任务 1.2: 目录结构创建
- 创建 `scripts/` 目录：构建脚本
- 创建 `src/` 目录：重构的扩展代码
- 创建 `data/` 目录：生成的数据文件
- 创建 `test/` 目录：单元测试

#### 任务 1.3: 数据生成脚本
- 编写 `scripts/generate-commands.js`：
  - 扫描 `docs/docs/lsf-script/en/*.md` (727 个文件)
  - 解析 Markdown：提取标题、描述、语法表格、示例
  - 移除 "See Also" 部分
  - 与现有 `commands.json` 数据合并
  - 生成 `data/commands-enhanced.json`

#### 任务 1.4: 初始数据生成
- 运行数据生成脚本
- 验证生成的数据完整性
- 提交生成的 `commands-enhanced.json` 到 Git

### 第二阶段：扩展重构 (预计: 3-4 天)
#### 任务 2.1: 扩展代码重构
- 移动 `extension.js` 到 `src/extension.js`
- 创建 `CommandLoader` 模块
- 实现命令数据加载和缓存机制

#### 任务 2.2: 增强悬停提供程序
- 创建 `HoverProvider` 类
- 实现 Markdown 文档渲染
- 支持 Markdown 表格和代码块
- 添加悬停内容的格式化

#### 任务 2.3: 自动完成提供程序
- 创建 `CompletionProvider` 类
- 基于增强命令数据提供建议
- 集成文档摘要到自动完成项

#### 任务 2.4: 向后兼容性
- 保持现有 `commands.json` 作为回退
- 确保未文档化的命令仍有基本悬停

### 第三阶段：构建与测试 (预计: 2-3 天)
#### 任务 3.1: 包配置更新
- 更新 `package.json`：
  - 添加构建脚本 (`generate-commands`, `test`)
  - 添加开发依赖 (Markdown 解析器、测试框架)
  - 更新主入口点指向 `src/extension.js`

#### 任务 3.2: 单元测试
- 为 `CommandLoader` 添加测试
- 为 `HoverProvider` 添加测试
- 测试数据生成脚本

#### 任务 3.3: 集成测试
- 手动测试悬停功能
- 验证 Markdown 渲染正确性
- 测试自动完成功能
- 验证性能（加载时间、内存使用）

#### 任务 3.4: 文档更新
- 更新 `README.md` 反映新功能
- 添加开发文档
- 更新变更日志

## 详细任务分解

### 任务 1.3 详情：数据生成脚本
```javascript
// scripts/generate-commands.js
// 输入: docs/docs/lsf-script/en/*.md, commands.json
// 输出: data/commands-enhanced.json

步骤：
1. 读取现有 commands.json
2. 遍历 docs/docs/lsf-script/en/*.md 文件
3. 对每个 Markdown 文件：
   a. 解析标题（第一行 # 后的内容）
   b. 提取描述（标题后的段落）
   c. 提取语法表格（| Syntax | Description | 格式）
   d. 提取示例代码块（``` 包含的内容）
   e. 移除 "See Also" 部分
4. 合并数据：使用 Markdown 数据增强现有命令
5. 生成 commands-enhanced.json
```

### 任务 2.2 详情：悬停提供程序
```javascript
// src/hover-provider.js
关键功能：
1. 监听悬停事件
2. 获取光标位置的单词
3. 从 CommandLoader 查找命令
4. 如果找到增强数据：
   - 创建 vscode.MarkdownString
   - 设置 markdown.value = command.markdown
   - 启用 isTrusted 以支持 Markdown
5. 如果只有基本数据：
   - 使用现有格式生成简单悬停
6. 返回 vscode.Hover 对象
```

## 技术决策

### 1. Git 子模块 vs 文档提取
- **选择**：Git 子模块
- **理由**：
  - 保持文档与扩展版本同步
  - 避免重复的文档存储
  - 支持文档独立更新

### 2. 数据存储格式
- **选择**：预生成的 JSON + 延迟加载
- **理由**：
  - 启动时快速加载命令索引
  - 首次悬停时加载完整 Markdown
  - 平衡性能和内存使用

### 3. Markdown 渲染
- **选择**：vscode.MarkdownString
- **理由**：
  - 原生支持 Markdown 渲染
  - 支持表格、代码块、数学公式
  - 无需外部依赖

### 4. 链接处理
- **选择**：移除 "See Also" 部分
- **理由**：
  - 保持悬停界面简洁
  - 避免不可点击的相对链接
  - 用户明确要求

### 5. 测试策略
- **选择**：单元测试 + 手动验证
- **理由**：
  - 确保核心功能可靠性
  - 平衡测试覆盖和开发速度
  - 用户要求添加单元测试

## 测试计划

### 单元测试
1. **CommandLoader 测试**：
   - 测试数据加载正确性
   - 测试命令查找功能
   - 测试回退机制

2. **HoverProvider 测试**：
   - 测试 Markdown 生成
   - 测试边界情况处理
   - 测试性能基准

3. **数据生成测试**：
   - 测试 Markdown 解析
   - 测试数据合并逻辑
   - 测试输出格式

### 集成测试
1. **功能测试**：
   - 打开 `.lsf` 文件
   - 悬停在命令上验证文档显示
   - 测试自动完成建议

2. **性能测试**：
   - 测量扩展启动时间
   - 测量悬停响应时间
   - 监控内存使用情况

3. **兼容性测试**：
   - 测试未文档化命令的回退
   - 测试不同 VS Code 版本
   - 测试不同操作系统

## 风险与缓解措施

### 风险 1：文档格式不一致
- **描述**：Markdown 文件可能有不一致的格式
- **缓解**：数据生成脚本包含容错解析，提供日志输出

### 风险 2：性能影响
- **描述**：加载 727 个 Markdown 文件可能影响性能
- **缓解**：使用预生成的 JSON，延迟加载完整 Markdown

### 风险 3：Git 子模块管理复杂性
- **描述**：子模块更新和同步可能复杂
- **缓解**：提供清晰的文档和更新脚本

### 风险 4：向后兼容性破坏
- **描述**：重构可能影响现有功能
- **缓解**：保持现有 API，逐步迁移，全面测试

## 交付成果

### 代码交付
1. `docs/` 目录：lumerical-docs Git 子模块
2. `scripts/generate-commands.js`：数据生成脚本
3. `src/` 目录：重构的扩展代码
4. `data/commands-enhanced.json`：增强的命令数据
5. `test/` 目录：单元测试
6. 更新的 `package.json`：构建脚本和依赖

### 文档交付
1. 更新的 `README.md`：新功能说明
2. `TASKS.md`：本任务文档
3. 开发指南：如何更新文档和重新生成数据
4. 更新 `CHANGELOG.md`：版本变更记录

### 测试交付
1. 单元测试套件
2. 集成测试报告
3. 性能基准数据

## 成功标准

### 功能成功标准
1. ✅ 所有 727 个文档化命令显示完整 Markdown 悬停
2. ✅ 未文档化命令显示基本悬停（向后兼容）
3. ✅ 悬停响应时间 < 100ms
4. ✅ 扩展启动时间增加 < 500ms
5. ✅ 自动完成建议包含文档摘要

### 技术成功标准
1. ✅ Git 子模块正确初始化和更新
2. ✅ 数据生成脚本可重复执行
3. ✅ 单元测试覆盖率 > 80%
4. ✅ 代码符合项目编码规范
5. ✅ 所有测试通过

## 时间估算

| 阶段 | 任务 | 估算时间 | 负责人 |
|------|------|----------|--------|
| 第一阶段 | Git 子模块集成 | 0.5 天 | |
| 第一阶段 | 目录结构创建 | 0.5 天 | |
| 第一阶段 | 数据生成脚本 | 1.5 天 | |
| 第一阶段 | 初始数据生成 | 0.5 天 | |
| 第二阶段 | 扩展代码重构 | 1.5 天 | |
| 第二阶段 | 增强悬停提供程序 | 1.5 天 | |
| 第二阶段 | 自动完成提供程序 | 1.0 天 | |
| 第二阶段 | 向后兼容性 | 0.5 天 | |
| 第三阶段 | 包配置更新 | 0.5 天 | |
| 第三阶段 | 单元测试 | 1.0 天 | |
| 第三阶段 | 集成测试 | 1.0 天 | |
| 第三阶段 | 文档更新 | 0.5 天 | |
| **总计** | | **10.0 天** | |

## 依赖关系

### 外部依赖
1. `lumerical-docs` 仓库可访问且结构稳定
2. VS Code API 兼容性（^1.67.0）
3. Node.js 运行时（扩展开发）

### 内部依赖
1. 现有 `commands.json` 数据结构
2. 现有语法高亮系统
3. 现有代码片段系统

## 下一步行动

### 立即行动 (Day 1)
1. 添加 Git 子模块：`git submodule add git@github.com:ErwenL/lumerical-docs.git docs`
2. 创建目录结构：`scripts/`, `src/`, `data/`, `test/`
3. 开始实现数据生成脚本

### 后续行动
按照实施阶段顺序执行任务，每周进行进度检查和调整。

---

**最后更新**: 2026-02-08  
**版本**: 1.0  
**状态**: 待实施