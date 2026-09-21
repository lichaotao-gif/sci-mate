"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowRight, BookOpen, Check, ChevronRight, Code2, Compass, Cpu, Database, FileText, FlaskConical, FolderOpen, GitBranch, LayoutDashboard, Lightbulb, ListTodo, MessageCircle, Network, Phone, Plus, Radar, Search, Settings2, ShieldCheck, Sparkles, Bell, Clock3, Target, Upload, Link2, FileType2, X, Pencil, WalletCards, Crown, Zap, CreditCard } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toaster, toast } from "sonner";
import { initialPapers, initialTasks, initialReport, initialReportHistory, initialResearchArtifacts, Paper, Task, ReportVersion, ResearchArtifact, discoveries } from "./research-data";
import { PaperLibrary, Evidence, RadarView, Tasks, Reports } from "./workbench";
import { SCIMateBoxSetup, SetupStage } from "./device-setup";
import { assetPath } from "@/lib/asset-path";

const navigation = [
  { id:"overview", name:"项目总览", description:"查看研究全貌、进展与下一步", icon:LayoutDashboard },
  { id:"papers", name:"文献中心", description:"检索、收录并精读研究文献", icon:BookOpen },
  { id:"evidence", name:"知识与证据", description:"组织共识、争议、技术路线与证据", icon:Network },
  { id:"radar", name:"科研雷达", description:"处理与课题相关的最新研究动态", icon:Radar },
  { id:"tasks", name:"研究任务", description:"所有任务均可调用 Agent，并支持研究者介入与确认", icon:ListTodo },
  { id:"reports", name:"研究成果", description:"整理经过确认的研究材料与成果", icon:FileText },
];
type SavedProjectState={title:string;goal:string;papers:Paper[];tasks:Task[];selected:number[];dismissed:number[];confirmed:boolean;paused:boolean;report:string;reportUpdatedAt:string;reportHistory:ReportVersion[];researchArtifacts:ResearchArtifact[];projectCompleted:boolean};

export default function Home() { return <SidebarProvider style={{"--sidebar-width":"248px"} as React.CSSProperties}><ResearchWorkspace/></SidebarProvider>; }
function ResearchWorkspace() {
  const {setOpenMobile}=useSidebar();
  const [page, setPage] = useState("overview");
  const [projectOpen, setProjectOpen] = useState(true);
  const [papers,setPapers]=useState<Paper[]>(initialPapers);
  const [tasks,setTasks]=useState<Task[]>(initialTasks);
  const [focusedTaskId,setFocusedTaskId]=useState<number|null>(null);
  const [selected,setSelected]=useState<number[]>([]);
  const [dismissed,setDismissed]=useState<number[]>([]);
  const [paused,setPaused]=useState(false);
  const [report,setReport]=useState(initialReport);
  const [reportUpdatedAt,setReportUpdatedAt]=useState("2026-09-18 14:20");
  const [reportHistory,setReportHistory]=useState<ReportVersion[]>(initialReportHistory);
  const [researchArtifacts,setResearchArtifacts]=useState<ResearchArtifact[]>(initialResearchArtifacts);
  const [isDemo,setIsDemo]=useState(true);
  const [confirmed,setConfirmed]=useState(false);
  const [projectCompleted,setProjectCompleted]=useState(false);
  const [project,setProject]=useState("大语言模型的可靠推理");
  const [goal,setGoal]=useState("如何让大语言模型的推理更准确、更可验证？");
  const [createdProject,setCreatedProject]=useState<SavedProjectState|null>(null);
  const [paperId,setPaperId]=useState<number|null>(null);
  const [editingPaperTitle,setEditingPaperTitle]=useState(false);
  const [paperTitleDraft,setPaperTitleDraft]=useState("");
  const [modal,setModal]=useState<"project"|"import"|"direction"|"innovation"|"settings"|"billing"|null>(null);
  const [assistant,setAssistant]=useState(false);
  const [message,setMessage]=useState("");
  const [answer,setAnswer]=useState("");
  const [formTitle,setFormTitle]=useState("");
  const [formGoal,setFormGoal]=useState("");
  const [formUrl,setFormUrl]=useState("");
  const [importMode,setImportMode]=useState<"upload"|"link">("upload");
  const [importFiles,setImportFiles]=useState<File[]>([]);
  const [setupStage,setSetupStage]=useState<SetupStage>("auth");
  const [authenticated,setAuthenticated]=useState(false);
  const [accountPhone,setAccountPhone]=useState("");
  const [nickname,setNickname]=useState("研究者");
  const [profileNameDraft,setProfileNameDraft]=useState("研究者");
  const [avatarUrl,setAvatarUrl]=useState(assetPath("/scimate-default-avatar.png"));
  const [editingPhone,setEditingPhone]=useState(false);
  const [newPhone,setNewPhone]=useState("");
  const [phoneCode,setPhoneCode]=useState("");
  const [phoneCodeSent,setPhoneCodeSent]=useState(false);
  const [deviceBound,setDeviceBound]=useState(false);
  const [deviceName,setDeviceName]=useState("");
  const [connectedChannels,setConnectedChannels]=useState<string[]>([]);
  const [onboardingFlow,setOnboardingFlow]=useState(false);
  const [creditBalance,setCreditBalance]=useState(3280);
  const [subscriptionPlan,setSubscriptionPlan]=useState<"free"|"pro"|"team">("pro");
  const [billingView,setBillingView]=useState<"overview"|"plans"|"recharge">("overview");
  const [rechargeAmount,setRechargeAmount]=useState(100);
  const [paymentMethod,setPaymentMethod]=useState<"wechat"|"alipay">("wechat");
  const maskedAccountPhone=accountPhone?`${accountPhone.slice(0,3)} **** ${accountPhone.slice(-4)}`:"个人工作空间";
  const currentPaper=papers.find(x=>x.id===paperId);
  const currentView=navigation.find(n=>n.id===page);
  const primaryTask=tasks.find(task=>!task.done);
  const primaryPaperIds=papers.filter(paper=>paper.saved).slice(0,3).map(paper=>paper.id);
  const hasProjectPapers=papers.some(paper=>paper.saved);
  const guideStage=projectCompleted?7:!hasProjectPapers?2:paused?4:primaryTask?5:!report?6:6;
  const guideContent=!hasProjectPapers?{title:"添加首批核心文献",description:"建议先加入 5–8 篇代表性论文；添加后 Agent 会自动解析、去重并构建初始知识图谱，通常 30–60 分钟形成首轮调研结果。",action:"添加文献"}:paused?{title:"Agent 已开始分析，开启科研雷达",description:"文献解析和知识建图会自动进行；开启雷达后，系统将持续补充新论文、争议观点与开源资源。",action:"开启科研雷达"}:primaryTask?{title:`推进：${primaryTask.title}`,description:"Agent 已根据当前证据生成研究任务。进入任务查看输入材料、执行步骤和需要人工确认的位置。",action:"查看研究任务"}:!report?{title:"生成阶段研究报告",description:"当前研究任务已经完成，可以汇总文献、知识图谱和任务成果，形成阶段研究报告。",action:"生成研究报告"}:projectCompleted?{title:"项目已完成，科研雷达持续监测",description:"成果版本已经归档。后续出现重要论文或观点变化时，系统会生成新的研究任务。",action:"查看科研雷达"}:{title:"确认最终成果并完成项目",description:"核心任务和研究报告已经准备完成，请在成果页完成最终确认与项目归档。",action:"前往研究成果"};
  const go=(id:string)=>{setOpenMobile(false);setPage(id);window.location.hash=id;window.scrollTo({top:0,behavior:"instant"});};
  useEffect(()=>{const sync=()=>{const v=window.location.hash.slice(1);if(navigation.some(n=>n.id===v))setPage(v);};sync();window.addEventListener("hashchange",sync);return()=>window.removeEventListener("hashchange",sync)},[]);
  useEffect(()=>{const context=(document as unknown as {modelContext?:{registerTool:(tool:unknown,options:unknown)=>Promise<void>|void}}).modelContext;if(!context?.registerTool)return;const lifecycle=new AbortController();Promise.resolve(context.registerTool({name:"navigate_research_workspace",description:"Navigate to a research workspace view. Does not change research data.",inputSchema:{type:"object",properties:{view:{type:"string",enum:navigation.map(n=>n.id)}},required:["view"],additionalProperties:false},annotations:{readOnlyHint:false},execute:async(input:unknown)=>{const view=(input as {view?:string})?.view;if(!view||!navigation.some(n=>n.id===view))throw new Error("Unknown workspace view");go(view);await new Promise(resolve=>requestAnimationFrame(resolve));return{view};}},{signal:lifecycle.signal})).catch(()=>{});return()=>lifecycle.abort()},[]);
  function addTask(title:string,category:string,paperId?:number,owner?:Task["owner"],output?:string){
    if(tasks.some(t=>t.title===title&&!t.done)){toast.info("该任务已在研究任务中");return;}
    const inferredOwner:Task["owner"]=owner??(category.includes("核查")||category.includes("创新")||category.includes("精读")?"collab":category.includes("实验")||category.includes("准备")||category.includes("自定义")?"human":"agent");
    const inferredOutput=output??(category==="证据对比"?"方法与实验条件对比表":category==="文献精读"?"结构化精读笔记与待核查项":category.includes("核查")?"核查结论与知识节点更新":category.includes("复现")||category.includes("资源")?"代码与数据资源清单":category.includes("创新")?"最小实验方案与创新性证据":"研究任务记录");
    setTasks(prev=>[...prev,{id:Date.now(),title,category,done:false,paperId,owner:inferredOwner,output:inferredOutput}]);
    toast.success("已创建研究任务",{action:{label:"查看",onClick:()=>go("tasks")}})
  }
  function continueAfterLiteratureAdded(count:number){
    if(!isDemo){
      setIsDemo(true);
      setDismissed([]);
      setTasks([
        {id:Date.now()+1,title:`解析首批 ${count} 篇文献并提取研究要素`,category:"文献解析",done:false,owner:"agent",output:"结构化文献卡片与引用索引"},
        {id:Date.now()+2,title:`建立「${project}」初始知识图谱`,category:"知识建图",done:false,owner:"agent",output:"共识、争议、技术路线与研究空白"},
        {id:Date.now()+3,title:"核查研究范围与第一轮证据边界",category:"证据核查",done:false,owner:"collab",output:"经确认的研究范围与核查清单"}
      ]);
      setModal(null);go("overview");
      toast.success("文献已加入，Agent 已自动开始解析、建图和任务规划");
      return;
    }
    setModal(null);go("papers");
    toast.success(`${count} 项文献已加入，Agent 已加入解析队列`);
  }
  function loadExistingProject(){
    if(createdProject&&project===createdProject.title){
      setCreatedProject({...createdProject,papers,tasks,selected,dismissed,confirmed,paused,report,reportUpdatedAt,reportHistory,researchArtifacts,projectCompleted});
    }
    setIsDemo(true);setProjectCompleted(false);setConfirmed(false);setPaused(false);setProject("大语言模型的可靠推理");setGoal("如何让大语言模型的推理更准确、更可验证？");setPapers(initialPapers);setTasks(initialTasks);setSelected([]);setDismissed([]);setReport(initialReport);setReportUpdatedAt("2026-09-18 14:20");setReportHistory(initialReportHistory);setResearchArtifacts(initialResearchArtifacts);setModal(null);go("overview");toast.success("已打开研究中的项目");
  }
  function loadCreatedProject(){
    if(!createdProject)return;
    setProject(createdProject.title);setGoal(createdProject.goal);setPapers(createdProject.papers);setTasks(createdProject.tasks);setSelected(createdProject.selected);setDismissed(createdProject.dismissed);setConfirmed(createdProject.confirmed);setPaused(createdProject.paused);setReport(createdProject.report);setReportUpdatedAt(createdProject.reportUpdatedAt);setReportHistory(createdProject.reportHistory);setResearchArtifacts(createdProject.researchArtifacts);setProjectCompleted(createdProject.projectCompleted);setIsDemo(createdProject.papers.length>0);setProjectOpen(true);go("overview");toast.success("已切换到新建项目");
  }
  const openPaper=(id:number)=>{setEditingPaperTitle(false);setPaperId(id)};
  const shared={papers,setPapers,selected,setSelected,openPaper,go,tasks,setTasks,focusedTaskId,setFocusedTaskId,addTask,openInnovation:()=>setModal("innovation"),dismissed,setDismissed,project,goal,isDemo,confirmed,setConfirmed,paused,setPaused,report,setReport,reportUpdatedAt,setReportUpdatedAt,reportHistory,setReportHistory,researchArtifacts,setResearchArtifacts,projectCompleted,setProjectCompleted,creditBalance,setCreditBalance,openBilling:()=>{setBillingView("overview");setModal("billing")}};
  function openModal(type:typeof modal){setOpenMobile(false);setFormTitle(type==="project"?"不同反馈来源对大模型自我纠错的影响":"");setFormGoal(type==="project"?"研究不同反馈来源如何影响大模型自我纠错的可靠性。":"");setFormUrl("");setImportMode("upload");setImportFiles([]);if(type==="settings"){setProfileNameDraft(nickname);setEditingPhone(false);setNewPhone(accountPhone);setPhoneCode("");setPhoneCodeSent(false)}setModal(type)}
  function startFirstUseGuide(){setOnboardingFlow(true);setSetupStage(deviceBound?"channels":"device")}
  function ask(question:string){setMessage(question);setAnswer(question.includes("比较")?"先选中两篇以上论文，按方法、数据与实验条件进行比较。证据工作台会保留待核查项，帮助你逐条回到原文。":question.includes("雷达")?"科研雷达将发现关联到研究问题。你可以查看影响、打开论文，或直接创建研究任务。科研雷达将持续跟踪相关论文、观点与研究资源。":"建议先精读过程监督的关键论文，再比较不同方法的实验条件。先核查材料，再形成项目判断。建议将结果记录为研究任务，并在关键判断处进行人工确认。");}
  return <>
    <Sidebar className="research-sidebar" aria-hidden={Boolean(setupStage)} inert={setupStage?true:undefined}>
      <SidebarHeader><div className="brand"><img className="brand-mark" src={assetPath("/scimate-brand-mark.png")} alt=""/><span>SCI<span className="brand-light">Mate</span></span></div></SidebarHeader>
      <SidebarContent>
        <div className="nav-caption">研究空间</div>
        <button className="all-projects" onClick={()=>openModal("project")}>
          <FolderOpen size={18}/><span>科研项目</span><span className="nav-global-action"><Plus size={13}/>新建</span>
        </button>
        <div className="sidebar-divider"/>
        <section className="project-scope" aria-label="科研项目列表">
          <div className="project-scope-label"><span>科研项目</span><small>{createdProject?"2 个":"1 个"}</small></div>
          <button className={`project-disclosure ${project==="大语言模型的可靠推理"?"active-project":"project-disclosure-inactive"}`} onClick={()=>project==="大语言模型的可靠推理"?setProjectOpen(open=>!open):loadExistingProject()} aria-expanded={project==="大语言模型的可靠推理"&&projectOpen}>
            <span className="project-disclosure-icon"><FlaskConical size={17}/></span>
            <span className="project-disclosure-copy"><strong>大语言模型的可靠推理</strong><small>{project==="大语言模型的可靠推理"?`${navigation.find(item=>item.id===page)?.name} · 文献调研阶段`:"研究中 · 4 篇核心文献"}</small></span>
            <ChevronRight className="project-disclosure-chevron" size={15}/>
          </button>
          {project==="大语言模型的可靠推理"&&projectOpen&&<SidebarMenu id="current-project-navigation" className="project-menu">{navigation.map(n=><SidebarMenuItem key={n.id}><SidebarMenuButton className="nav-item" isActive={page===n.id} onClick={()=>go(n.id)}><n.icon size={18}/><span>{n.name}</span>{n.id==="radar"&&<span className="nav-count">{discoveries.length-dismissed.length}</span>}</SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu>}
          {createdProject&&<><button className={`project-disclosure ${project===createdProject.title?"active-project":"project-disclosure-inactive"}`} onClick={()=>project===createdProject.title?setProjectOpen(open=>!open):loadCreatedProject()} aria-expanded={project===createdProject.title&&projectOpen}>
            <span className="project-disclosure-icon new-project-icon"><FlaskConical size={17}/></span>
            <span className="project-disclosure-copy"><strong>{createdProject.title}</strong><small>{project===createdProject.title?`${navigation.find(item=>item.id===page)?.name} · ${papers.length?"Agent 研究中":"等待添加文献"}`:`${createdProject.papers.length?"研究中":"待启动"} · ${createdProject.papers.length} 篇文献`}</small></span>
            <ChevronRight className="project-disclosure-chevron" size={15}/>
          </button>{project===createdProject.title&&projectOpen&&<SidebarMenu id="created-project-navigation" className="project-menu">{navigation.map(n=><SidebarMenuItem key={n.id}><SidebarMenuButton className="nav-item" isActive={page===n.id} onClick={()=>go(n.id)}><n.icon size={18}/><span>{n.name}</span>{n.id==="radar"&&<span className="nav-count">{discoveries.length-dismissed.length}</span>}</SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu>}</>}
        </section>
      </SidebarContent>
      <SidebarFooter>
        <button className="sidebar-billing" onClick={()=>{setBillingView("overview");openModal("billing")}} aria-label={`查看订阅与积分，当前剩余 ${creditBalance.toLocaleString()} 积分`}>
          <span className="sidebar-billing-icon"><Crown size={17}/></span>
          <span><strong>专业版</strong><small><i>{creditBalance.toLocaleString()}</i> 积分可用</small></span>
          <ChevronRight size={15}/>
        </button>
        <button className="profile" onClick={()=>openModal("settings")}><span className="avatar">{avatarUrl?<img src={avatarUrl} alt=""/>:nickname.slice(0,1)||"研"}</span><span>{nickname}<small>{maskedAccountPhone}</small></span><Settings2 size={17}/></button>
      </SidebarFooter>
    </Sidebar>
    <div className={`app-main ${page==="overview"&&isDemo?"overview-app-main":""}`} aria-hidden={Boolean(setupStage)} inert={setupStage?true:undefined}><header className={`topbar ${page==="overview"&&isDemo?"overview-topbar":""}`}><div className="breadcrumbs"><SidebarTrigger/><span>项目</span><ChevronRight size={14}/><span>{project}</span><ChevronRight className="breadcrumb-detail" size={14}/><span className="breadcrumb-detail">{currentView?.name}</span></div><div className="topbar-actions"><button className="first-use-top-button" aria-label="打开新手引导" onClick={startFirstUseGuide}><Sparkles size={15}/><span>新手引导</span></button><button className="device-status-button" aria-label={deviceBound?`管理 SCIMate 盒子，${deviceName}在线，已连接 ${connectedChannels.length} 个通道`:"绑定 SCIMate 盒子"} onClick={()=>setSetupStage(deviceBound?"channels":"device")}><span><Cpu size={17}/></span><span><strong>{deviceBound?deviceName:"绑定 SCIMate 盒子"}</strong><small>{deviceBound?<><i/>在线 · {connectedChannels.length} 个通道</>:"绑定后开启持续研究"}</small></span><ChevronRight size={15}/></button><button className="icon-btn" aria-label="科研动态" onClick={()=>go("radar")}><Bell size={19}/></button><button className="top-avatar" aria-label="打开个人设置" onClick={()=>openModal("settings")}>{avatarUrl?<img src={avatarUrl} alt=""/>:nickname.slice(0,1)||"研"}</button></div></header>
    <main className={`workspace ${page==="overview"&&isDemo?"overview-workspace":""}`}><div className="page-heading"><div><div className="eyebrow">RESEARCH WORKSPACE</div><h1>{currentView?.name}</h1><p>{currentView?.description}</p></div><div className="heading-actions">{page==="papers"&&<Button variant="outline" onClick={()=>openModal("import")}><Plus/>添加文献</Button>}{page==="overview"&&<Button variant="outline" onClick={()=>go("evidence")}><Network/>查看知识地图</Button>}{page==="radar"&&<Button variant="outline" onClick={()=>go("evidence")}><Target/>管理关注节点</Button>}</div></div>
    {(isDemo||page!=="overview")&&<section className={`research-journey-guide ${projectCompleted?"completed":""}`} aria-label="项目研究引导">
      <div className="journey-guide-main"><span className="journey-label"><Compass size={15}/>研究引导 <em>{projectCompleted?"6 / 6":`${Math.min(guideStage,6)} / 6`}</em></span><h2>{guideContent.title}</h2><p>{guideContent.description}</p></div>
      <div className="journey-steps">{["创建项目","添加文献","Agent 分析","科研雷达","研究任务","研究成果"].map((label,index)=>{const step=index+1;const state=step<guideStage?"done":step===guideStage?"current":"waiting";return <span className={state} key={label}><i>{state==="done"?<Check size={11}/>:step}</i><small>{label}</small></span>})}</div>
      <Button onClick={()=>{if(!hasProjectPapers){openModal("import");return}if(paused){setPaused(false);setDismissed([]);go("radar");toast.success("科研雷达已启动，将持续监测相关研究进展");return}if(primaryTask){setFocusedTaskId(primaryTask.id);go("tasks");return}if(!report||!projectCompleted){go("reports");return}go("radar")}}>{guideContent.action}<ArrowRight/></Button>
    </section>}
    {page==="papers"&&<PaperLibrary {...shared}/>}
    {page==="evidence"&&<Evidence {...shared}/>}
    {page==="radar"&&<RadarView {...shared}/>}
    {page==="tasks"&&<Tasks {...shared}/>}
    {page==="reports"&&<Reports {...shared}/>}
    {page==="overview"&&!isDemo&&<section className="panel project-start-guide">
      <header className="project-start-header"><div><span className="start-ready"><Check size={13}/>项目已创建</span><h2>{project}</h2><p>先建立可靠的研究起点，添加文献后 Agent 会自动开始工作。</p></div><div className="start-estimate"><Clock3 size={18}/><span>首轮调研预计<strong>30–60 分钟</strong></span></div></header>
      <div className="project-goal-card"><small>研究目标</small><p>{goal}</p><span>具体模型、任务集、评价指标和推理预算，将在文献分析后由 Agent 形成研究方案。</span></div>
      <div className="project-start-metrics"><div><BookOpen size={18}/><span>建议首批文献<strong>5–8 篇</strong><small>优先选择综述、经典工作和近期代表论文</small></span></div><div><Sparkles size={18}/><span>首轮自动分析<strong>30–60 分钟</strong><small>解析文献、建立图谱并生成研究任务</small></span></div><div><Radar size={18}/><span>较完整领域扫描<strong>1–3 天</strong><small>科研雷达持续补充新论文和争议观点</small></span></div></div>
      <div className="project-start-flow">{[{icon:BookOpen,title:"添加核心文献",text:"上传 PDF、Word 或添加 DOI、arXiv 与期刊链接",owner:"你 · 约 10 分钟"},{icon:Network,title:"Agent 解析与建图",text:"提取方法、数据集、结论和证据关系",owner:"Agent · 约 20–40 分钟"},{icon:Radar,title:"开启科研雷达",text:"持续检索相关工作、热点、代码和数据资源",owner:"Agent · 24 小时运行"},{icon:ShieldCheck,title:"确认研究范围",text:"核查关键证据和边界，生成首轮研究报告",owner:"你与 Agent · 约 10 分钟"}].map((item,index)=><article key={item.title}><span className="start-step-number">0{index+1}</span><span className="start-step-icon"><item.icon size={18}/></span><div><strong>{item.title}</strong><p>{item.text}</p><small>{item.owner}</small></div></article>)}</div>
      <div className="project-agent-trigger"><Sparkles size={18}/><div><strong>提交参考文献后，Agent 将立即展开科研</strong><span>系统会自动解析文献、建立知识图谱、补充相关工作并生成首轮研究任务，无需再次点击启动。</span></div></div>
      <div className="project-start-actions"><div><strong>现在先做一件事</strong><span>建议提交 5–8 篇代表性文献，作为 Agent 的首轮研究依据。</span></div><Button variant="outline" onClick={()=>go("papers")}>查看文献中心</Button><Button onClick={()=>openModal("import")}><Plus/>提交首批参考文献</Button></div>
    </section>}
    {page==="overview"&&isDemo&&<div className="overview-dashboard">
      <section className="panel research-command-center">
        <div className="command-ambient command-ambient-one"/><div className="command-ambient command-ambient-two"/>
        <header className="command-header"><div><div className="command-eyebrow"><span><i/>SCIMate Research Command</span><em>Agent 24/7 运行中</em></div><h2>{project}</h2><p>{goal}</p><div className="command-topic-tags"><span>推理机制</span><span>过程监督</span><span>自我纠错</span><button onClick={()=>openModal("direction")}>研究范围 <ArrowUpRight size={13}/></button></div></div><div className="command-stage-index"><small>当前阶段</small><strong>02<em>/05</em></strong><span>文献与证据</span></div></header>

        <div className="command-stage-track">{[{name:"明确问题",state:"done",meta:"AI 已完成"},{name:"文献与证据",state:"current",meta:"进行中 68%"},{name:"研究方案",state:"waiting",meta:"预计 09-20"},{name:"实验验证",state:"human",meta:"需要人工"},{name:"研究成果",state:"waiting",meta:"等待验证"}].map((item,index)=><div className={`command-stage ${item.state}`} key={item.name}><span>{item.state==="done"?<Check size={13}/>:index+1}</span><div><strong>{item.name}</strong><small>{item.meta}</small></div></div>)}</div>

        <div className="command-workspace-grid">
          <article className="command-current-card"><div className="command-card-label"><Compass size={14}/>现在到哪里</div><div className="command-current-main"><div className="stage-progress-ring" style={{"--stage-progress":"68%"} as React.CSSProperties}><span><strong>68%</strong><small>当前阶段</small></span></div><div><span className="command-live-label"><i/>AI 正在进行</span><h3>梳理文献与证据</h3><p>组织论文、研究判断与待验证问题，形成可核查的证据结构。</p></div></div><div className="command-eta"><Clock3 size={15}/><span>预计完成<strong>今天 18:00</strong></span></div><div className="command-checks"><span><Check size={12}/>核心论文已收录</span><span className="active"><Sparkles size={12}/>实验条件提取中</span><span><Clock3 size={12}/>等待人工核查</span></div></article>

          <div className="research-visual agent-working-visual command-agent-visual" aria-label="科研 Agent 正在梳理项目"><div className="visual-grid"/><div className="agent-visual-top"><span><i/>Agent 实时工作流</span><em>LIVE</em></div><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/><div className="mini-radar-scan"><i/></div><span className="data-particle particle-one"/><span className="data-particle particle-two"/><span className="data-particle particle-three"/><button className="visual-core agent-core" onClick={()=>go("evidence")}><span className="core-pulse"/><Sparkles size={21}/><strong>证据整合</strong><small>正在分析</small></button><button className="visual-node node-a active-work" onClick={()=>go("papers")}><BookOpen size={13}/><span>文献解析</span><strong>{papers.filter(x=>x.saved).length}/8</strong></button><button className="visual-node node-b active-work" onClick={()=>go("evidence")}><GitBranch size={13}/><span>证据对齐</span><strong>12</strong></button><button className="visual-node node-c scanning" onClick={()=>go("radar")}><Radar size={13}/><span>雷达监测</span><strong>{discoveries.length-dismissed.length}</strong></button><button className="visual-node node-d" onClick={()=>go("tasks")}><ListTodo size={13}/><span>任务编排</span><strong>{tasks.filter(x=>!x.done).length}</strong></button><div className="agent-activity-line"><span><i/><i/><i/></span><p>正在核查：模型、数据集与推理预算</p></div></div>

          <article className="command-next-card"><div className="command-card-label"><Target size={14}/>我应该做什么</div><div className="command-priority"><span>优先级 01</span><em>预计 20 分钟</em></div><h3>{primaryTask?.title||"当前阶段任务已全部完成"}</h3><p>{primaryTask?"Agent 已准备输入材料和执行步骤，关键研究判断将在完成前交由你确认。":"可以进入研究成果查看当前结论，或让科研雷达继续发现新的研究任务。"}</p><div className="command-owner-row"><span><Sparkles size={12}/>Agent 主导</span><span><ShieldCheck size={12}/>人工审核</span></div><div className="command-output"><FileText size={14}/><span>本次产出<strong>{primaryTask?.output||"阶段研究成果"}</strong></span></div><div className="command-action-buttons"><Button disabled={!primaryTask} onClick={()=>{setFocusedTaskId(primaryTask?.id||null);go("tasks")}}>开始执行<ArrowRight/></Button><Button variant="outline" disabled={!primaryPaperIds.length} onClick={()=>{setSelected(primaryPaperIds);go("evidence")}}>查看依据</Button></div></article>
        </div>

        <div className="command-metrics">{[{label:"项目文献",value:papers.filter(x=>x.saved).length,detail:`${papers.filter(x=>x.saved&&!x.read).length} 篇待核阅`,icon:BookOpen,to:"papers",tone:"cyan"},{label:"知识证据",value:12,detail:"3 条待核查",icon:Network,to:"evidence",tone:"violet"},{label:"研究任务",value:tasks.filter(x=>!x.done).length,detail:`${tasks.filter(x=>x.done).length} 项已完成`,icon:ListTodo,to:"tasks",tone:"coral"},{label:"研究成果",value:reportHistory.length,detail:reportUpdatedAt?"已有阶段报告":"尚未生成报告",icon:FileText,to:"reports",tone:"blue"}].map(item=><button className={`command-metric ${item.tone}`} key={item.label} onClick={()=>go(item.to)}><span><item.icon size={16}/></span><div><small>{item.label}</small><strong>{item.value}</strong><em>{item.detail}</em></div><ChevronRight size={14}/></button>)}</div>
      </section>

      <section className="overview-updates"><div className="section-heading standalone"><div><h2>最新研究变化</h2><p>知识更新与科研雷达合并展示</p></div><button onClick={()=>go("radar")}>查看全部动态 <ChevronRight size={15}/></button></div><div className="update-grid"><article className="panel update-card knowledge-update"><span className="update-icon"><Network size={20}/></span><div><span className="tag green-tag">知识更新</span><h3>过程监督成为当前重点技术路线</h3><p>新收录论文补充了步骤验证证据，同时暴露出跨模型验证不足。</p><button onClick={()=>go("evidence")}>查看证据变化<ArrowUpRight size={14}/></button></div></article><article className="panel update-card radar-update"><span className="update-icon"><Radar size={20}/></span><div><div className="update-meta"><span className="tag amber-tag">雷达发现</span><span><Clock3 size={12}/>已监测 12天 08小时</span></div><h3>自我纠错的有效条件仍需区分</h3><p>建议比较模型自反馈、环境反馈和人工反馈的实验设置。</p><button onClick={()=>go("radar")}>处理这条发现<ArrowUpRight size={14}/></button></div></article></div></section>

      <section className="panel opportunity-panel overview-opportunity"><div className="opportunity-icon"><Lightbulb size={22}/></div><div><span className="section-kicker">值得验证的研究机会 <span className="tag amber-tag">知识空白</span></span><h2>不同反馈来源如何影响大模型自我纠错的可靠性？</h2><p>现有工作分别使用模型自反馈、环境反馈与人工反馈，尚缺少统一实验条件下的系统比较。</p><div className="opportunity-meta"><span>关联 4 篇论文</span><span>2 个争议观点</span><span>建议最小实验：3 组反馈条件</span></div></div><div className="opportunity-actions"><Button variant="outline" onClick={()=>go("evidence")}>查看依据</Button><Button onClick={()=>setModal("innovation")}><Sparkles/>评估创新性</Button></div></section>


    </div>}
    <footer className="workspace-footer"><span>SCIMate Research Studio</span><span>保持好奇，严谨求证。</span></footer></main></div>

    {modal&&<Dialog open onOpenChange={v=>{if(!v)setModal(null)}}><DialogContent className={`research-dialog ${modal==="innovation"?"innovation-dialog":""} ${modal==="billing"?"billing-dialog":""}`}>
      <DialogTitle>{modal==="project"?"新建科研项目":modal==="import"?"添加文献":modal==="direction"?"研究方向":modal==="innovation"?"创新性评估":modal==="billing"?"订阅与积分":"个人设置"}</DialogTitle>
      <DialogDescription>{modal==="project"?"填写项目名称和研究目标，创建后进入统一的项目启动引导。":modal==="import"?"提交参考文献后，Agent 将立即开始解析、建图、关联检索和研究任务规划。":modal==="direction"?"明确重点，让后续发现围绕课题展开。":modal==="innovation"?"基于当前知识地图与相近工作，判断差异、风险和验证路径。":modal==="billing"?"订阅套餐提供每月积分，Agent 根据任务所选模型与实际用量扣除积分。":"管理个人资料、登录手机号和 SCIMate 盒子。"}</DialogDescription>
      {modal==="project"&&<form className="research-form" onSubmit={e=>{e.preventDefault();if(!formTitle.trim()||!formGoal.trim())return;const title=formTitle.trim(),researchGoal=formGoal.trim();setCreatedProject({title,goal:researchGoal,papers:[],tasks:[],selected:[],dismissed:[1,2,3],confirmed:false,paused:true,report:"",reportUpdatedAt:"",reportHistory:[],researchArtifacts:[],projectCompleted:false});setIsDemo(false);setConfirmed(false);setProjectCompleted(false);setPaused(true);setProject(title);setGoal(researchGoal);setTasks([]);setPapers([]);setSelected([]);setDismissed([1,2,3]);setReport("");setReportUpdatedAt("");setReportHistory([]);setResearchArtifacts([]);setModal(null);go("overview");toast.success("项目已创建，请按照启动引导添加首批文献")}}><label>项目名称<Input value={formTitle} onChange={e=>setFormTitle(e.target.value)} placeholder="例如：大语言模型的可靠推理" required maxLength={80}/></label><label>研究目标<textarea value={formGoal} onChange={e=>setFormGoal(e.target.value)} placeholder="你希望解决什么研究问题？" required maxLength={240}/></label><div className="form-note">创建后进入项目启动引导。建议先添加 5–8 篇代表性文献，Agent 将自动解析、建图并生成首轮研究任务。</div><Button type="submit">创建项目<ArrowRight/></Button></form>}
      {modal==="import"&&<div className="paper-import"><div className="import-switch"><button className={importMode==="upload"?"active":""} onClick={()=>setImportMode("upload")}><Upload size={16}/>上传文件</button><button className={importMode==="link"?"active":""} onClick={()=>setImportMode("link")}><Link2 size={16}/>添加链接</button></div>{importMode==="upload"?<form className="research-form" onSubmit={e=>{e.preventDefault();if(!importFiles.length)return;const now=Date.now();setPapers(prev=>[...prev,...importFiles.map((file,i)=>({id:now+i,title:file.name.replace(/\.[^.]+$/,"")||file.name,url:"",topic:"未分类",venue:"用户上传",year:"",summary:"等待 Agent 解析文件内容。",method:"尚未提取",limitation:"上传文件尚未核查",saved:true,read:false,source:"upload" as const,sourceDetail:file.name}))]);continueAfterLiteratureAdded(importFiles.length);setImportFiles([])}}><label className="upload-drop" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();setImportFiles(Array.from(e.dataTransfer.files||[]))}}><input type="file" multiple accept=".pdf,.doc,.docx,.txt,.md,.ris,.bib,.csv,.epub" onChange={e=>setImportFiles(Array.from(e.target.files||[]))}/><span><Upload size={25}/></span><strong>选择文件或拖放到这里</strong><small>支持 PDF、Word、TXT、Markdown、RIS、BibTeX、CSV、EPUB</small></label>{importFiles.length>0&&<div className="selected-files">{importFiles.map((file,i)=><div key={`${file.name}-${i}`}><FileType2 size={16}/><span>{file.name}</span><small>{file.size?`${Math.max(1,Math.round(file.size/1024))} KB`:"本地文件"}</small><button type="button" aria-label={`移除 ${file.name}`} onClick={()=>setImportFiles(files=>files.filter((_,index)=>index!==i))}><X size={14}/></button></div>)}</div>}<div className="form-note"><strong>提交后立即启动 Agent</strong>：自动解析标题、摘要、方法、引用与证据关系，并开始相关文献检索。</div><Button type="submit" disabled={!importFiles.length}><Sparkles/>提交文献并启动 Agent {importFiles.length?`· ${importFiles.length} 篇`:""}</Button></form>:<form className="research-form" onSubmit={e=>{e.preventDefault();if(!formUrl.trim())return;let fallback="链接导入文献";try{const url=new URL(formUrl);fallback=url.pathname.split("/").filter(Boolean).pop()||url.hostname}catch{}setPapers(prev=>[...prev,{id:Date.now(),title:fallback,url:formUrl.trim(),topic:"未分类",venue:"链接导入",year:"",summary:"等待阅读与提取。",method:"尚未提取",limitation:"链接内容尚未核查",saved:true,read:false,source:"link",sourceDetail:"用户添加链接"}]);continueAfterLiteratureAdded(1)}}><label>DOI、arXiv 或期刊链接<Input required type="url" value={formUrl} onChange={e=>setFormUrl(e.target.value)} placeholder="https://arxiv.org/abs/…" pattern="https?://.+"/></label><div className="auto-title-note"><Sparkles size={17}/><div><strong>提交后立即启动 Agent</strong><p>系统将识别正式标题、作者、期刊和 DOI，并开始解析、建图与关联文献检索。</p></div></div><Button type="submit"><Sparkles/>提交链接并启动 Agent</Button></form>}</div>}
      {modal==="direction"&&isDemo&&<div className="direction-content"><div className="direction-question">{goal}</div>{["推理机制","过程监督","自我纠错"].map((x,i)=><button key={x} onClick={()=>{setModal(null);go(i===1?"evidence":"papers")}}><span className="direction-number">0{i+1}</span><div><strong>{x}</strong><p>{["理解推理路径如何形成","探索中间步骤的验证方法","区分反馈来源与有效条件"][i]}</p></div><ArrowRight size={17}/></button>)}<Button variant="outline" onClick={()=>{setModal(null);setAssistant(true)}}><Sparkles/>讨论研究方向</Button></div>}
      {modal==="innovation"&&<div className="innovation-content"><div className="innovation-question"><span className="tag amber-tag">候选研究问题</span><h3>不同反馈来源如何影响大模型自我纠错的可靠性？</h3><p>比较模型自反馈、环境反馈与人工反馈在相同模型、任务和推理预算下的表现。</p></div><div className="innovation-score"><div><strong>中高</strong><span>差异化潜力</span></div><p>现有工作覆盖了单类反馈机制，但缺少统一实验条件下的系统比较。当前结论基于已收录证据，仍需扩大检索范围并核查近期工作。</p></div><div className="innovation-dimensions">{[{name:"问题差异",value:"较明显",text:"将反馈来源作为主变量"},{name:"方法差异",value:"中等",text:"实验框架需要进一步明确"},{name:"证据缺口",value:"较明显",text:"跨任务、跨模型证据不足"},{name:"撞题风险",value:"待核查",text:"需要持续监测近期工作"}].map(x=><div key={x.name}><span>{x.name}</span><strong>{x.value}</strong><small>{x.text}</small></div>)}</div><section className="closest-work"><div className="section-heading"><h2>最接近的已有工作</h2><span className="tag">2 篇</span></div><button onClick={()=>{setModal(null);setPaperId(5)}}><div><strong>Self-Refine</strong><small>覆盖模型自反馈，但没有统一比较外部反馈</small></div><ChevronRight size={15}/></button><button onClick={()=>{setModal(null);setPaperId(6)}}><div><strong>Reflexion</strong><small>引入环境反馈与记忆，实验任务范围不同</small></div><ChevronRight size={15}/></button></section><div className="innovation-risk"><ShieldCheck size={18}/><div><strong>建议先完成最小验证</strong><p>固定模型、任务集和推理预算，只改变反馈来源；记录纠错成功率、错误放大率与额外成本。</p></div></div><div className="innovation-actions"><Button variant="outline" onClick={()=>{setModal(null);go("papers")}}><Search/>扩展相关工作</Button><Button onClick={()=>{addTask("设计三类反馈来源的统一对比实验","创新验证");setModal(null)}}><Plus/>创建研究任务</Button></div></div>}
      {modal==="billing"&&<div className="billing-content">
        <nav className="billing-tabs" aria-label="订阅与积分导航">
          <button className={billingView==="overview"?"active":""} onClick={()=>setBillingView("overview")}>账户用量</button>
          <button className={billingView==="plans"?"active":""} onClick={()=>setBillingView("plans")}>订阅套餐</button>
          <button className={billingView==="recharge"?"active":""} onClick={()=>setBillingView("recharge")}>充值积分</button>
        </nav>
        {billingView==="overview"&&<>
          <section className="credit-hero">
            <div><span><WalletCards size={18}/>可用积分</span><strong>{creditBalance.toLocaleString()}</strong><small>本月套餐积分将在 10 月 21 日刷新</small></div>
            <Button onClick={()=>setBillingView("recharge")}><Plus/>充值积分</Button>
          </section>
          <div className="usage-grid">
            <section><span>当前套餐</span><strong><Crown size={16}/>专业版</strong><small>¥99/月 · 每月 10,000 积分</small><button onClick={()=>setBillingView("plans")}>管理订阅<ChevronRight size={14}/></button></section>
            <section><span>本月已用</span><strong>6,720 <em>积分</em></strong><small>主要用于深度研究与论文精读</small><div className="usage-progress"><i style={{width:"67.2%"}}/></div></section>
          </div>
          <section className="model-rate-card"><header><div><Zap size={18}/><span><strong>模型与积分消耗</strong><small>任务启动前可以选择模型</small></span></div><span>每千 Token</span></header>{[
            {name:"快速模型",use:"检索、分类、摘要",rate:"1 积分",tone:"fast"},
            {name:"研究模型",use:"精读、知识图谱、报告",rate:"4 积分",tone:"research"},
            {name:"前沿模型",use:"复杂推理、创新性评估",rate:"8 积分",tone:"advanced"}
          ].map(model=><div className="model-rate-row" key={model.name}><i className={model.tone}/><span><strong>{model.name}</strong><small>{model.use}</small></span><em>{model.rate}</em></div>)}</section>
          <section className="usage-history"><header><strong>最近消耗</strong><button onClick={()=>toast.info("完整用量账单将在计费服务接入后展示")}>查看全部</button></header>{[
            {name:"生成阶段研究报告",model:"研究模型",value:"− 680",time:"今天 14:20"},
            {name:"精读 4 篇核心论文",model:"研究模型",value:"− 420",time:"今天 10:35"},
            {name:"科研雷达每日检索",model:"快速模型",value:"− 86",time:"今天 08:00"}
          ].map(item=><div key={item.name}><span><strong>{item.name}</strong><small>{item.model} · {item.time}</small></span><em>{item.value}</em></div>)}</section>
        </>}
        {billingView==="plans"&&<div className="plan-list">{[
          {id:"free" as const,name:"基础版",price:"免费",credits:"1,000",desc:"适合体验文献解析与基础问答",features:["1 个研究项目","基础模型","7 天科研雷达"]},
          {id:"pro" as const,name:"专业版",price:"¥99 / 月",credits:"10,000",desc:"适合持续开展个人科研项目",features:["不限研究项目","全部研究模型","24 小时科研雷达","多格式成果导出"],recommended:true},
          {id:"team" as const,name:"团队版",price:"¥299 / 月",credits:"40,000",desc:"适合实验室共享研究与算力",features:["5 名团队成员","共享知识图谱","用量与权限管理","优先任务队列"]}
        ].map(plan=><section key={plan.id} className={`${plan.recommended?"recommended":""} ${subscriptionPlan===plan.id?"current":""}`}>
          {plan.recommended&&<span className="plan-recommended">推荐</span>}<header><div><strong>{plan.name}</strong><small>{plan.desc}</small></div><b>{plan.price}</b></header><div className="plan-credit"><Zap size={15}/><strong>{plan.credits}</strong> 积分/月</div><ul>{plan.features.map(feature=><li key={feature}><Check size={14}/>{feature}</li>)}</ul><Button variant={subscriptionPlan===plan.id?"outline":"default"} disabled={subscriptionPlan===plan.id} onClick={()=>{setSubscriptionPlan(plan.id);toast.success(`已切换为${plan.name}`)}}>{subscriptionPlan===plan.id?"当前套餐":"选择套餐"}</Button>
        </section>)}</div>}
        {billingView==="recharge"&&<div className="recharge-content">
          <section className="recharge-balance"><span><WalletCards size={18}/>当前可用</span><strong>{creditBalance.toLocaleString()} <em>积分</em></strong><small>充值积分长期有效，优先使用每月套餐积分</small></section>
          <section className="recharge-section"><header><strong>选择充值金额</strong><small>到账积分已包含赠送</small></header><div className="amount-grid">{[{yuan:30,credits:3000},{yuan:50,credits:5200},{yuan:100,credits:11000},{yuan:200,credits:23000}].map(item=><button className={rechargeAmount===item.yuan?"active":""} key={item.yuan} onClick={()=>setRechargeAmount(item.yuan)}><strong>¥{item.yuan}</strong><span>{item.credits.toLocaleString()} 积分</span>{item.credits>item.yuan*100&&<em>赠 {item.credits-item.yuan*100}</em>}</button>)}</div></section>
          <section className="recharge-section"><header><strong>支付方式</strong></header><div className="payment-methods"><button className={paymentMethod==="wechat"?"active":""} onClick={()=>setPaymentMethod("wechat")}><span className="wechat-pay">微</span><strong>微信支付</strong><i>{paymentMethod==="wechat"&&<Check size={13}/>}</i></button><button className={paymentMethod==="alipay"?"active":""} onClick={()=>setPaymentMethod("alipay")}><span className="alipay">支</span><strong>支付宝</strong><i>{paymentMethod==="alipay"&&<Check size={13}/>}</i></button></div></section>
          <div className="recharge-submit"><div><span>支付金额</span><strong>¥{rechargeAmount}.00</strong></div><Button onClick={()=>{const credits={30:3000,50:5200,100:11000,200:23000}[rechargeAmount]||rechargeAmount*100;setCreditBalance(balance=>balance+credits);setBillingView("overview");toast.success(`${credits.toLocaleString()} 积分已到账`)}}><CreditCard/>立即支付</Button></div>
          <p className="billing-note"><ShieldCheck size={14}/>支付由微信支付或支付宝安全处理，充值记录可在用量账单中查询。</p>
        </div>}
      </div>}
      {modal==="settings"&&<div className="settings-content profile-settings"><section className="profile-settings-card"><label className="profile-avatar-editor"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={event=>{const file=event.target.files?.[0];if(file)setAvatarUrl(URL.createObjectURL(file))}}/><span>{avatarUrl?<img src={avatarUrl} alt="当前头像"/>:profileNameDraft.slice(0,1)||"研"}</span><em>更换头像</em></label><div className="profile-name-editor"><label>昵称<Input value={profileNameDraft} onChange={event=>setProfileNameDraft(event.target.value)} maxLength={20} placeholder="请输入昵称"/></label><Button disabled={!profileNameDraft.trim()||profileNameDraft.trim()===nickname} onClick={()=>{setNickname(profileNameDraft.trim());toast.success("个人资料已保存")}}>保存昵称</Button></div></section><section className="profile-phone-card"><div className="profile-setting-title"><span><Phone size={18}/></span><div><strong>登录手机号</strong><small>{maskedAccountPhone}</small></div><button onClick={()=>{setEditingPhone(value=>!value);setNewPhone(accountPhone);setPhoneCode("");setPhoneCodeSent(false)}}>{editingPhone?"取消修改":"修改"}</button></div>{editingPhone&&<div className="phone-change-form"><label>新手机号<Input type="tel" inputMode="numeric" value={newPhone} onChange={event=>setNewPhone(event.target.value.replace(/\D/g,"").slice(0,11))} placeholder="请输入新手机号" maxLength={11}/></label><label>短信验证码<div><Input inputMode="numeric" value={phoneCode} onChange={event=>setPhoneCode(event.target.value.replace(/\D/g,"").slice(0,6))} placeholder="6 位验证码" maxLength={6}/><button disabled={!/^1\d{10}$/.test(newPhone)} onClick={()=>{setPhoneCodeSent(true);setPhoneCode("123456")}}>{phoneCodeSent?"重新获取":"获取验证码"}</button></div></label><Button disabled={!/^1\d{10}$/.test(newPhone)||!/^\d{6}$/.test(phoneCode)} onClick={()=>{setAccountPhone(newPhone);setEditingPhone(false);setPhoneCode("");toast.success("登录手机号已更新")}}>确认更换手机号</Button></div>}</section><div className="settings-device-card"><span><Cpu size={20}/></span><div><small>SCIMate 盒子</small><strong>{deviceBound?deviceName:"尚未绑定"}</strong><p>{deviceBound?`在线运行 · 已连接 ${connectedChannels.length} 个通信通道`:"绑定后科研 Agent 可持续运行"}</p></div><Button variant="outline" onClick={()=>{setModal(null);setSetupStage(deviceBound?"channels":"device")}}>{deviceBound?"管理盒子":"绑定盒子"}<MessageCircle/></Button></div><section className="account-exit-row"><div><strong>退出当前账户</strong><p>退出后需要重新使用手机号验证码登录。</p></div><Button variant="outline" className="logout-button" onClick={()=>{setModal(null);setAuthenticated(false);setSetupStage("auth");toast.success("已退出当前账户")}}>退出账户</Button></section></div>}
    </DialogContent></Dialog>}
    <Sheet open={paperId!==null} onOpenChange={v=>{if(!v){setPaperId(null);setEditingPaperTitle(false)}}}><SheetContent className="paper-sheet"><SheetHeader><div className="eyebrow">PAPER READER</div><SheetTitle>文献精读</SheetTitle><SheetDescription>方法、证据与复现资源 · 关键结论需原文核查</SheetDescription></SheetHeader>{currentPaper&&<div className="reader-content"><div className="reader-meta"><span className="tag blue-tag">{currentPaper.topic}</span><span>{currentPaper.venue} {currentPaper.year}</span><span className={`paper-source source-${currentPaper.source}`}>{currentPaper.source==="upload"?<Upload size={12}/>:currentPaper.source==="link"?<Link2 size={12}/>:currentPaper.source==="radar"?<Radar size={12}/>:<Sparkles size={12}/>} {currentPaper.source==="upload"?"用户上传":currentPaper.source==="link"?"链接导入":currentPaper.source==="radar"?"雷达发现":"Agent 检索"}</span></div>{editingPaperTitle?<form className="paper-title-editor" onSubmit={e=>{e.preventDefault();const title=paperTitleDraft.trim();if(!title)return;setPapers(prev=>prev.map(x=>x.id===currentPaper.id?{...x,title}:x));setEditingPaperTitle(false);toast.success("文献标题已更新")}}><Input autoFocus value={paperTitleDraft} onChange={e=>setPaperTitleDraft(e.target.value)} maxLength={300} aria-label="编辑文献标题"/><div><Button type="button" variant="ghost" onClick={()=>setEditingPaperTitle(false)}>取消</Button><Button type="submit" disabled={!paperTitleDraft.trim()}>保存标题</Button></div></form>:<h2>{currentPaper.title}</h2>}<div className="reader-toolbar"><Button variant="outline" onClick={()=>{setPaperTitleDraft(currentPaper.title);setEditingPaperTitle(true)}}><Pencil/>编辑标题</Button>{currentPaper.url&&<Button variant="outline" asChild><a href={currentPaper.url} target="_blank" rel="noreferrer">打开原文<ArrowUpRight/></a></Button>}<Button variant="outline" onClick={()=>{setPapers(prev=>prev.map(x=>x.id===currentPaper.id?{...x,saved:!x.saved}:x))}}>{currentPaper.saved?<Check/>:<Plus/>}{currentPaper.saved?"已收录":"收录"}</Button></div><Tabs defaultValue="summary"><TabsList className="view-tabs reader-tabs"><TabsTrigger value="summary">核心内容</TabsTrigger><TabsTrigger value="method">方法拆解</TabsTrigger><TabsTrigger value="project">课题关系</TabsTrigger><TabsTrigger value="resources">复现资源</TabsTrigger></TabsList><TabsContent value="summary"><div className="reader-block"><span>01 / 研究内容</span><p>{currentPaper.summary}</p></div><div className="reader-block"><span>02 / 核心方法</span><p>{currentPaper.method}</p></div><div className="reader-block"><span>03 / 核查边界</span><p>{currentPaper.limitation}</p></div><div className="source-note">Agent 已整理核心内容；关键实验数据和结论边界仍需通过原文核查。</div></TabsContent><TabsContent value="method"><div className="method-summary"><div><span>输入</span><strong>问题与候选推理过程</strong></div><ArrowRight size={17}/><div><span>核心机制</span><strong>{currentPaper.method}</strong></div><ArrowRight size={17}/><div><span>输出</span><strong>更可靠的推理结果</strong></div></div><div className="pseudo-head"><div><Code2 size={17}/><span>方法伪代码</span></div><span className="tag amber-tag">Agent 整理 · 待核查</span></div><pre className="pseudo-code"><code>{`INPUT  question q, model M\npaths ← M.generate(q, samples = K)\nFOR each path IN paths:\n    score ← verify(path)\nresult ← aggregate(paths, score)\nRETURN result`}</code></pre><div className="method-steps">{["生成候选推理路径","对中间步骤或结果进行评价","根据评分聚合或选择答案"].map((x,i)=><div key={x}><span>0{i+1}</span><p>{x}</p><button onClick={()=>toast.info("原文定位将在接入全文解析后启用")}>定位原文</button></div>)}</div></TabsContent><TabsContent value="project"><div className="reader-block"><span>当前研究问题</span><p>{goal}</p></div><div className="reader-block"><span>建议核查</span><p>记录方法的反馈来源、评价条件与计算成本，再判断是否适用于你的研究问题。</p></div><Button variant="outline" onClick={()=>addTask(`核查：${currentPaper.title}`,"文献精读",currentPaper.id)}>创建研究任务<Plus/></Button></TabsContent><TabsContent value="resources"><div className="resource-grid"><a className="resource-card verified" href={currentPaper.url||undefined} target="_blank" rel="noreferrer"><span><FileText size={19}/></span><div><small>论文数据库</small><strong>{currentPaper.url?"arXiv 原文":"尚未关联"}</strong><em>{currentPaper.url?"已验证链接":"待补充"}</em></div><ArrowUpRight size={15}/></a><button className="resource-card" onClick={()=>addTask(`核查官方代码：${currentPaper.title}`,"复现资源",currentPaper.id)}><span><Code2 size={19}/></span><div><small>开源代码</small><strong>官方仓库待核查</strong><em>创建核查任务</em></div><Plus size={15}/></button><button className="resource-card" onClick={()=>addTask(`查找数据集：${currentPaper.title}`,"复现资源",currentPaper.id)}><span><Database size={19}/></span><div><small>实验数据</small><strong>数据集链接待核查</strong><em>创建查找任务</em></div><Plus size={15}/></button></div><div className="source-note">资源链接只有在来源明确时才标记为“已验证”；Agent 推断的仓库或数据集不会直接作为官方资源展示。</div></TabsContent></Tabs><div className="reader-bottom"><Button onClick={()=>{setPapers(prev=>prev.map(x=>x.id===currentPaper.id?{...x,read:!x.read}:x));toast.success(currentPaper.read?"已标记为待阅读":"已标记为已读")}}>{currentPaper.read?<Check/>:<BookOpen/>}{currentPaper.read?"已读 · 标记为未读":"标记为已读"}</Button><Button variant="outline" onClick={()=>{setSelected(prev=>prev.includes(currentPaper.id)?prev:[...prev,currentPaper.id]);setPaperId(null);go("papers");toast.info("已选中该论文，请再选择一篇进行比较")}}>加入对比<Network/></Button></div></div>}</SheetContent></Sheet>
    <button className={`floating-assistant ${page==="overview"&&isDemo?"overview-floating-assistant":""}`} onClick={()=>{setOpenMobile(false);setAssistant(true)}} aria-label="随时打开科研助手" aria-hidden={Boolean(setupStage)} inert={setupStage?true:undefined}><span className="floating-assistant-icon"><img src={assetPath("/research-assistant-icon.png")} alt=""/></span><span><strong>科研助手</strong><small>随时提问</small></span><Sparkles size={16}/></button>
    <Sheet open={assistant} onOpenChange={setAssistant}><SheetContent className="assistant-sheet"><SheetHeader><div className="assistant-emblem"><Sparkles size={24}/></div><SheetTitle>科研助手</SheetTitle><SheetDescription>围绕当前课题，继续下一步。</SheetDescription></SheetHeader><div className="assistant-context"><span>当前项目</span><strong>{project}</strong></div><div className="assistant-body"><p>你想先做什么？</p>{["我下一步应该做什么？","帮我比较核心论文","解释雷达发现的影响"].map(x=><button className="suggestion" key={x} onClick={()=>ask(x)}>{x}<ArrowUpRight size={16}/></button>)}{answer&&<div className="assistant-response" aria-live="polite"><span className="tag">Agent 建议</span><p>{answer}</p><Button variant="outline" onClick={()=>{go(message.includes("比较")?"evidence":message.includes("雷达")?"radar":"tasks");setAssistant(false)}}>打开工作台<ArrowRight/></Button></div>}</div><form className="assistant-input" onSubmit={e=>{e.preventDefault();if(message.trim())ask(message.trim())}}><label htmlFor="assistant-message">补充你的研究需求</label><div><Input id="assistant-message" value={message} onChange={e=>setMessage(e.target.value)} placeholder="例如：比较实验条件" maxLength={500}/><Button type="submit" size="icon" disabled={!message.trim()} aria-label="发送"><ArrowRight/></Button></div><small>回答基于当前项目的文献、知识图谱与任务状态</small></form></SheetContent></Sheet>
    <SCIMateBoxSetup stage={setupStage} onStageChange={setSetupStage} onFinish={()=>{if(onboardingFlow){setOnboardingFlow(false);openModal("project")}}} authenticated={authenticated} accountPhone={accountPhone} onAuthenticated={phone=>{setAccountPhone(phone);setAuthenticated(true);go("overview");toast.success("登录成功")}} deviceBound={deviceBound} deviceName={deviceName} onDeviceBound={name=>{setDeviceName(name);setDeviceBound(Boolean(name));if(name)toast.success("SCIMate 盒子绑定成功")}} connectedChannels={connectedChannels} onChannelsChange={channels=>{setConnectedChannels(channels);if(channels.length)toast.success(`已连接 ${channels.length} 个通信通道`)}}/>
    <Toaster position="bottom-right" richColors closeButton/>
  </>;
}
