export type PaperSource = "upload"|"link"|"agent"|"radar";
export type Paper = {id:number; title:string; topic:string; venue:string; year:string; summary:string; method:string; limitation:string; url:string; saved:boolean; read:boolean;source:PaperSource;sourceDetail?:string};
export const initialPapers:Paper[] = [
{id:1,title:"Let's Verify Step by Step",topic:"过程监督",venue:"ICLR",year:"2024",summary:"比较过程监督与结果监督，为推理步骤的验证提供研究入口。",method:"过程奖励模型",limitation:"需进一步核查任务范围与标注成本。",url:"https://arxiv.org/abs/2305.20050",saved:true,read:false,source:"link",sourceDetail:"arXiv 链接"},
{id:2,title:"Self-Consistency Improves Chain of Thought Reasoning in Language Models",topic:"多路径推理",venue:"ICLR",year:"2023",summary:"从多条推理路径的答案一致性出发，研究推理结果的可靠性。",method:"多路径采样与答案聚合",limitation:"需比较采样预算与任务差异。",url:"https://arxiv.org/abs/2203.11171",saved:true,read:true,source:"agent",sourceDetail:"Agent 主题检索"},
{id:3,title:"Tree of Thoughts: Deliberate Problem Solving with Large Language Models",topic:"搜索与规划",venue:"NeurIPS",year:"2023",summary:"将推理组织为可探索的思维树，研究搜索与规划的作用。",method:"思维树搜索",limitation:"需比较搜索成本及评价机制。",url:"https://arxiv.org/abs/2305.10601",saved:true,read:false,source:"radar",sourceDetail:"科研雷达发现"},
{id:4,title:"Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",topic:"推理机制",venue:"NeurIPS",year:"2022",summary:"研究通过中间推理步骤引导语言模型解决复杂任务。",method:"思维链提示",limitation:"步骤流畅并不意味着每一步均正确。",url:"https://arxiv.org/abs/2201.11903",saved:true,read:true,source:"agent",sourceDetail:"Agent 引用扩展"},
{id:5,title:"Self-Refine: Iterative Refinement with Self-Feedback",topic:"自我纠错",venue:"NeurIPS",year:"2023",summary:"围绕生成、反馈和修改的循环探索输出改进。",method:"自反馈迭代",limitation:"需区分任务类型与反馈有效性。",url:"https://arxiv.org/abs/2303.17651",saved:false,read:false,source:"agent",sourceDetail:"Agent 主题检索"},
{id:6,title:"Reflexion: Language Agents with Verbal Reinforcement Learning",topic:"自我纠错",venue:"NeurIPS",year:"2023",summary:"利用反馈与语言反思支持后续尝试。",method:"语言反思与记忆",limitation:"需核查反馈来源与环境假设。",url:"https://arxiv.org/abs/2303.11366",saved:false,read:false,source:"radar",sourceDetail:"科研雷达发现"}
];
export type TaskOwner = "agent"|"human"|"collab";
export type Task = {id:number;title:string;category:string;done:boolean;owner:TaskOwner;output:string;paperId?:number;result?:string;completedAt?:string};
export type ReportVersion = {id:number;title:string;createdAt:string;content:string};
export type ResearchArtifact = {id:number;type:"report"|"chart"|"image"|"video";title:string;createdAt:string};
export const initialTasks:Task[]=[
{id:1,title:"比较三种推理增强方法",category:"证据对比",done:false,owner:"agent",output:"方法与实验条件对比表"},
{id:2,title:"精读过程监督的关键论文",category:"文献精读",done:true,owner:"collab",output:"结构化精读笔记与待核查项",paperId:1,completedAt:"2026-09-17 16:40",result:"# 过程监督关键论文精读\n\n已整理研究问题、过程奖励模型、标注方式、实验范围与成本边界。关键实验数据已关联原文位置，跨模型泛化仍列为待核查项。"},
{id:3,title:"核查自我纠错的反馈条件",category:"证据核查",done:true,owner:"collab",output:"反馈条件核查结论",completedAt:"2026-09-18 09:15",result:"# 自我纠错反馈条件核查\n\n已区分模型自反馈、环境反馈和人工反馈三类实验条件。当前证据不支持将三类反馈的结果直接合并比较，已形成统一实验变量清单。"},
{id:4,title:"明确研究问题与检索范围",category:"研究准备",done:true,owner:"human",output:"经确认的研究问题与检索范围",completedAt:"2026-09-17 10:30",result:"# 明确研究问题与检索范围\n\n## 任务结论\n\n研究问题聚焦于：如何让大语言模型的推理更准确、更可验证？\n\n## 已确认范围\n\n- 重点关注过程监督、多路径推理与自我纠错。\n- 优先比较反馈来源、实验条件与推理预算。\n- 所有方法判断需要回到论文原文核查。\n\n## 后续动作\n\n围绕已确认范围持续收录文献，并建立共识、争议、技术路线与研究空白。\n\n> SCIMate 项目任务成果，由研究者确认后归档。"}
];
export const discoveries=[{id:1,type:"研究进展",title:"过程监督：从答案正确到步骤可靠",description:"与你的「推理可验证性」问题相关。",impact:"建议将过程监督与结果监督分开比较，核查验证器的训练数据和评价条件。",paperId:1,tag:"高度相关"},{id:2,type:"待核查",title:"自我纠错的有效条件仍需区分",description:"建议比较有无外部反馈的实验设置。",impact:"自我反馈、环境反馈和人工反馈不应归为同一实验条件，先整理反馈来源再判断有效性。",paperId:5,tag:"影响研究判断"},{id:3,type:"研究资源",title:"思维树方法：补充搜索与规划路线",description:"为你的方法对比增加一个搜索视角。",impact:"将搜索预算、评价器与停止条件加入比较维度，准备后续复现材料。",paperId:3,tag:"方法补充"}];

export const initialReport=`# 大语言模型可靠推理：阶段研究报告

## 摘要

本项目围绕大语言模型推理结果的准确性与可验证性，对过程监督、多路径推理、搜索规划和自我纠错四类路线进行证据梳理。当前已形成方法分类、代表性文献清单和实验条件核查框架。

## 1. 研究问题

如何让大语言模型的推理更准确、更可验证？

## 2. 当前发现

- 过程监督能够提供步骤级验证信号，但依赖高质量标注与验证器能力。
- 多路径推理能够提升结果稳定性，同时增加采样与计算成本。
- 自我纠错的有效性取决于反馈来源，不能将模型自反馈与外部反馈直接合并比较。
- 跨模型、跨任务的统一验证仍然不足，是当前优先研究空白。

## 3. 下一步工作

在统一模型、任务集和推理预算下，对模型自反馈、环境反馈与人工反馈开展最小对比实验，并记录纠错成功率、错误放大率和额外成本。

## 4. 当前结论

项目已完成研究问题界定和首轮证据建图，正在进行实验条件对齐。核心科研判断将在原文核查和实验验证完成后进入最终成果。`;
export const initialReportHistory:ReportVersion[]=[
 {id:1,title:"阶段研究报告 v1.0",createdAt:"2026-09-18 14:20",content:initialReport}
];
export const initialResearchArtifacts:ResearchArtifact[]=[
 {id:1,type:"report",title:"大语言模型可靠推理：阶段研究报告",createdAt:"2026-09-18 14:20"},
 {id:2,type:"chart",title:"Figure 1 · 四类可靠推理方法证据对比",createdAt:"2026-09-18 14:08"},
 {id:3,type:"image",title:"Graphical Abstract · 可靠推理研究框架",createdAt:"2026-09-18 13:52"}
];
