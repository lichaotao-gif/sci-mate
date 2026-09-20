# SCIMate Research Studio

A Chinese-language, click-first research workspace prototype.

## Run

- `npm install`
- `npm run dev`
- `npm run build`
- `npx tsc --noEmit`

## 腾讯云静态网站托管

仓库提供独立的静态导出命令，构建后会生成可直接托管的 `out` 目录。

- 项目框架：`其他`（也可以选择 Next.js 后手动覆盖下列配置）
- Node.js：`22.17.1` 或控制台可选的更新 22.x 版本
- 目标目录：`./`
- 安装命令：`npm ci`
- 构建命令：`npm run build:tencent`
- 构建产物目录：`./out`
- 部署路径：`/`

当前资源以网站根路径引用，因此不要把部署路径设为 `/sci-mate`。如需绑定独立域名，仍保持部署路径为 `/` 即可。

## Implemented journeys

- Project overview and creation with empty-state onboarding
- Reference entry, collection, filtering and reading status
- Multi-paper evidence comparisons and reader panels
- Radar discovery triage and research-task creation
- Task completion and completed-task history
- Editable research brief and Markdown export
- Contextual assistant interaction demonstration
- Responsive navigation, keyboard-accessible dialogs, sheets and controls

## Scope

All initial research data and analysis cards are illustrative. The assistant uses explicit demonstration replies. Live academic search, PDF extraction, model inference, background scheduling and experiment execution are not connected. Data is held in the current browser page session only and resets on reload; there is no account or persistent research database. External references open their original source links. Creating a project replaces the active session project; the demo can be restored from workspace settings.
