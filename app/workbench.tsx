"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, BarChart3, BookOpen, Check, CheckCheck, ChevronRight, Clock3, Download, ExternalLink, FileText, GitBranch, Layers3, ImageIcon, Lightbulb, ListTodo, Loader2, Maximize2, Minimize2, Network, Pause, Play, Plus, Radar, RotateCcw, Search, Sparkles, Target, ZoomIn, ZoomOut, Bot, UserRound, UsersRound, Video, Zap, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Paper, Task, ReportVersion, ResearchArtifact, discoveries } from "./research-data";
import { assetPath } from "@/lib/asset-path";

type Props={papers:Paper[];setPapers:React.Dispatch<React.SetStateAction<Paper[]>>;selected:number[];setSelected:React.Dispatch<React.SetStateAction<number[]>>;openPaper:(id:number)=>void;go:(page:string)=>void;tasks:Task[];setTasks:React.Dispatch<React.SetStateAction<Task[]>>;focusedTaskId:number|null;setFocusedTaskId:React.Dispatch<React.SetStateAction<number|null>>;addTask:(title:string,category:string,paperId?:number,owner?:Task["owner"],output?:string)=>void;openInnovation:()=>void;dismissed:number[];setDismissed:React.Dispatch<React.SetStateAction<number[]>>;project:string;goal:string;isDemo:boolean;confirmed:boolean;setConfirmed:React.Dispatch<React.SetStateAction<boolean>>;paused:boolean;setPaused:React.Dispatch<React.SetStateAction<boolean>>;report:string;setReport:React.Dispatch<React.SetStateAction<string>>;reportUpdatedAt:string;setReportUpdatedAt:React.Dispatch<React.SetStateAction<string>>;reportHistory:ReportVersion[];setReportHistory:React.Dispatch<React.SetStateAction<ReportVersion[]>>;researchArtifacts:ResearchArtifact[];setResearchArtifacts:React.Dispatch<React.SetStateAction<ResearchArtifact[]>>;projectCompleted:boolean;setProjectCompleted:React.Dispatch<React.SetStateAction<boolean>>;creditBalance:number;setCreditBalance:React.Dispatch<React.SetStateAction<number>>;openBilling:()=>void};
export function PaperLibrary(p:Props){
 const [query,setQuery]=useState("");
 const [compareOpen,setCompareOpen]=useState(false);
 const filtered=p.papers.filter(x=>x.saved&&`${x.title} ${x.topic} ${x.method}`.toLowerCase().includes(query.toLowerCase()));
 const comparisonPapers=p.papers.filter(x=>p.selected.includes(x.id));
 const sourceMeta={upload:{label:"用户上传",icon:FileText},link:{label:"链接导入",icon:ExternalLink},agent:{label:"Agent 检索",icon:Sparkles},radar:{label:"雷达发现",icon:Radar}} as const;
 return <>
  {!p.papers.some(x=>x.saved)&&<section className="panel literature-auto-start"><div><span className="eyebrow">AUTOMATED RESEARCH START</span><h2>添加首批文献后，Agent 自动开始研究</h2><p>无需额外启动，系统会连续完成解析、建图和首轮任务规划。</p></div><ol><li><span><BookOpen size={17}/></span><div><strong>解析文献</strong><small>标题、摘要、方法与引用</small></div></li><li><span><Network size={17}/></span><div><strong>构建知识</strong><small>共识、争议、路线与空白</small></div></li><li><span><ListTodo size={17}/></span><div><strong>生成任务</strong><small>Agent 执行与人工确认</small></div></li></ol></section>}
  <div className="library-toolbar simplified-library"><div><strong>当前项目文献</strong><span>{p.papers.filter(x=>x.saved).length} 篇已收录</span></div><div className="search-field"><Search size={17}/><Input aria-label="搜索项目文献" placeholder="搜索标题、主题或方法" value={query} onChange={e=>setQuery(e.target.value)}/></div></div>
  <div className="library-topic-note"><Sparkles size={15}/><span>主题标签由 Agent 根据论文内容提取，仅用于辅助识别，不代表已经确认的研究方向。</span></div>
  <div className="panel paper-list"><div className="list-caption"><span>{filtered.length} 篇文献</span><span>当前项目 · 按收录顺序展示</span></div>{filtered.length===0?<Empty text={query?"没有找到匹配的文献":"当前项目还没有文献"} action={query?"清除搜索":undefined} onClick={()=>setQuery("")}/>:filtered.map(paper=><article className="library-paper" key={paper.id}><Checkbox aria-label={`选择 ${paper.title}`} checked={p.selected.includes(paper.id)} onCheckedChange={v=>p.setSelected(prev=>v?[...prev,paper.id]:prev.filter(x=>x!==paper.id))}/><div className="library-paper-main"><div className="paper-metadata"><span className="tag blue-tag">主题 · {paper.topic}</span><span>{paper.venue} {paper.year}</span>{(()=>{const source=sourceMeta[paper.source];const SourceIcon=source.icon;return <span className={`paper-source source-${paper.source}`} title={paper.sourceDetail}><SourceIcon size={12}/>{source.label}</span>})()}{paper.read&&<span className="read-status"><Check size={13}/>已读</span>}</div><button className="paper-title" onClick={()=>p.openPaper(paper.id)}>{paper.title}</button><p>{paper.summary}</p><div className="paper-links"><a href={paper.url||undefined} target="_blank" rel="noreferrer" aria-disabled={!paper.url}>{paper.url?<>原文<ExternalLink size={12}/></>:<>本地文件<FileText size={12}/></>}</a><span>{paper.read?"已核阅":"待核阅"}</span></div></div><div className="paper-actions"><Button variant="outline" onClick={()=>p.openPaper(paper.id)}><BookOpen/>精读</Button><button className="saved-label" onClick={()=>{p.setPapers(prev=>prev.map(x=>x.id===paper.id?{...x,saved:false}:x));toast.success("已移出当前项目文献")}}><Check size={14}/>已收录</button></div></article>)}</div>
  {p.selected.length>0&&<><div className="selection-bar-spacer" aria-hidden="true"/><div className="selection-bar" role="region" aria-label="文献比较操作"><span>已选择 <strong>{p.selected.length}</strong> 篇</span><button onClick={()=>p.setSelected([])}>取消选择</button><Button disabled={p.selected.length<2} onClick={()=>setCompareOpen(true)}><Network/>开始比较<ArrowRight/></Button></div></>}
  <Dialog open={compareOpen} onOpenChange={setCompareOpen}><DialogContent className="paper-compare-dialog"><DialogTitle>文献对比</DialogTitle><DialogDescription>在当前页面核对所选文献的研究路线、证据与局限，关闭后保留选择状态。</DialogDescription><div className="paper-compare-summary"><span><Network size={16}/>{comparisonPapers.length} 篇文献</span><small>Agent 已按统一维度整理 · 可左右滑动查看</small></div><div className="paper-compare-scroll"><table><thead><tr><th>比较维度</th>{comparisonPapers.map(paper=><th key={paper.id}><span className="tag blue-tag">{paper.topic}</span><strong>{paper.title}</strong><small>{paper.venue} · {paper.year}</small></th>)}</tr></thead><tbody><tr><th>研究方法</th>{comparisonPapers.map(paper=><td key={paper.id}>{paper.method}</td>)}</tr><tr><th>核心价值</th>{comparisonPapers.map(paper=><td key={paper.id}>{paper.summary}</td>)}</tr><tr><th>证据来源</th>{comparisonPapers.map(paper=><td key={paper.id}><span className={`paper-source source-${paper.source}`}>{sourceMeta[paper.source].label}</span><small>{paper.sourceDetail}</small></td>)}</tr><tr><th>当前局限</th>{comparisonPapers.map(paper=><td key={paper.id} className="compare-limitation">{paper.limitation}</td>)}</tr><tr><th>核阅状态</th>{comparisonPapers.map(paper=><td key={paper.id}>{paper.read?<span className="compare-checked"><Check size={14}/>已核阅</span>:<span className="compare-pending"><Clock3 size={14}/>待核阅</span>}</td>)}</tr></tbody></table></div><div className="paper-compare-actions"><Button variant="outline" onClick={()=>setCompareOpen(false)}>返回文献中心</Button><Button onClick={()=>{setCompareOpen(false);toast.success("对比结果已保留，可继续选择或精读文献")}}><Check/>确认本次对比</Button></div></DialogContent></Dialog>
 </>;
}
type GraphRotation={x:number;y:number};
type GraphNode={id:string;label:string;kind:"root"|"group"|"item";tone:"root"|"consensus"|"debate"|"method"|"gap"};
const graphNodeList:GraphNode[]=[
 {id:"root",label:"可靠推理",kind:"root",tone:"root"},
 {id:"consensus",label:"领域共识",kind:"group",tone:"consensus"},
 {id:"debate",label:"观点与争议",kind:"group",tone:"debate"},
 {id:"method",label:"技术路线",kind:"group",tone:"method"},
 {id:"gap",label:"研究空白",kind:"group",tone:"gap"},
 {id:"chain",label:"思维链改善复杂推理",kind:"item",tone:"consensus"},
 {id:"sampling",label:"多路径采样提升稳定性",kind:"item",tone:"consensus"},
 {id:"correction",label:"自我纠错是否稳定有效",kind:"item",tone:"debate"},
 {id:"steps",label:"步骤正确是否代表结论可靠",kind:"item",tone:"debate"},
 {id:"process",label:"过程监督",kind:"item",tone:"method"},
 {id:"multi",label:"多路径推理",kind:"item",tone:"method"},
 {id:"planning",label:"搜索与规划",kind:"item",tone:"method"},
 {id:"transfer",label:"跨模型验证不足",kind:"item",tone:"gap"},
 {id:"feedback",label:"反馈来源缺少统一比较",kind:"item",tone:"gap"}
];
const graphEdges=[
 ["root","consensus"],["root","debate"],["root","method"],["root","gap"],
 ["consensus","chain"],["consensus","sampling"],["debate","correction"],["debate","steps"],
 ["method","process"],["method","multi"],["method","planning"],["gap","transfer"],["gap","feedback"]
] as const;
const graphSphereCoordinates:Record<string,{longitude:number;latitude:number;radius:number}>={
 root:{longitude:0,latitude:0,radius:0},
 consensus:{longitude:-48,latitude:-22,radius:168},debate:{longitude:48,latitude:-22,radius:168},method:{longitude:38,latitude:30,radius:168},gap:{longitude:-42,latitude:30,radius:168},
 chain:{longitude:-72,latitude:-42,radius:236},sampling:{longitude:-18,latitude:-50,radius:236},correction:{longitude:18,latitude:-42,radius:236},steps:{longitude:72,latitude:-30,radius:236},
 process:{longitude:12,latitude:58,radius:236},multi:{longitude:48,latitude:52,radius:236},planning:{longitude:76,latitude:28,radius:236},transfer:{longitude:-72,latitude:38,radius:236},feedback:{longitude:-78,latitude:4,radius:236}
};

type ProjectedGraphPoint={x:number;y:number;z:number;scale:number};

function KnowledgeGraph({project,node,setNode,paperCount}:{project:string;node:string;setNode:(node:string)=>void;paperCount:number}){
 const svgRef=useRef<SVGSVGElement>(null);
 const graphRef=useRef<SVGGElement>(null);
 const shellRef=useRef<HTMLDivElement>(null);
 const dragRef=useRef<{startX:number;startY:number;origin:GraphRotation;lastX:number;lastY:number;lastT:number;velocityX:number;velocityY:number}|null>(null);
 const didRotateRef=useRef(false);
 const animationRef=useRef<number|null>(null);
 const [viewport,setViewport]=useState({x:0,y:0,scale:1});
 const [rotation,setRotation]=useState<GraphRotation>({x:-.16,y:0});
 const [fullscreen,setFullscreen]=useState(false);
 useEffect(()=>{const sync=()=>setFullscreen(document.fullscreenElement===shellRef.current);document.addEventListener("fullscreenchange",sync);return()=>document.removeEventListener("fullscreenchange",sync)},[]);
 useEffect(()=>()=>{if(animationRef.current!==null)cancelAnimationFrame(animationRef.current)},[]);

 function rotatePoint(point:{x:number;y:number;z:number}){
  const cosY=Math.cos(rotation.y),sinY=Math.sin(rotation.y),cosX=Math.cos(rotation.x),sinX=Math.sin(rotation.x);
  const x=point.x*cosY+point.z*sinY;
  const yawZ=-point.x*sinY+point.z*cosY;
  return{x,y:point.y*cosX-yawZ*sinX,z:point.y*sinX+yawZ*cosX};
 }
 function projectPoint(point:{x:number;y:number;z:number}):ProjectedGraphPoint{
  const rotated=rotatePoint(point);
  const perspective=Math.min(1.28,Math.max(.66,760/(760-rotated.z)));
  return{x:500+rotated.x*perspective,y:310+rotated.y*perspective,z:rotated.z,scale:perspective};
 }
 function spherePoint(longitude:number,latitude:number,radius:number){
  const lon=longitude*Math.PI/180,lat=latitude*Math.PI/180;
  return{x:radius*Math.cos(lat)*Math.sin(lon),y:radius*Math.sin(lat),z:radius*Math.cos(lat)*Math.cos(lon)};
 }
 const projected=Object.fromEntries(Object.entries(graphSphereCoordinates).map(([id,coordinate])=>{
  if(id==="root")return[id,{x:500,y:310,z:260,scale:1}];
  return[id,projectPoint(spherePoint(coordinate.longitude,coordinate.latitude,coordinate.radius))];
 })) as Record<string,ProjectedGraphPoint>;
 const sphereGrid=[-60,-30,0,30,60].map(latitude=>({key:`lat-${latitude}`,path:Array.from({length:73},(_,index)=>projectPoint(spherePoint(index*5,latitude,246)))})).concat(
  [-60,-30,0,30,60,90,120,150].map(longitude=>({key:`lon-${longitude}`,path:Array.from({length:49},(_,index)=>projectPoint(spherePoint(longitude,-90+index*3.75,246))) }))
 );
 const orderedNodes=[...graphNodeList.filter(item=>item.id!=="root")].sort((a,b)=>projected[a.id].z-projected[b.id].z);

 function pointerDown(event:React.PointerEvent<SVGSVGElement>){
  if(animationRef.current!==null){cancelAnimationFrame(animationRef.current);animationRef.current=null}
  event.currentTarget.setPointerCapture(event.pointerId);didRotateRef.current=false;
  dragRef.current={startX:event.clientX,startY:event.clientY,origin:rotation,lastX:event.clientX,lastY:event.clientY,lastT:event.timeStamp,velocityX:0,velocityY:0};
 }
 function pointerMove(event:React.PointerEvent<SVGSVGElement>){
  const drag=dragRef.current;if(!drag)return;
  const deltaX=event.clientX-drag.startX,deltaY=event.clientY-drag.startY;
  if(Math.abs(deltaX)+Math.abs(deltaY)>4)didRotateRef.current=true;
  const now=event.timeStamp,elapsed=Math.max(8,now-drag.lastT);
  drag.velocityX=((event.clientY-drag.lastY)*.006)/elapsed;drag.velocityY=((event.clientX-drag.lastX)*.008)/elapsed;
  drag.lastX=event.clientX;drag.lastY=event.clientY;drag.lastT=now;
  setRotation({x:Math.min(1.25,Math.max(-1.25,drag.origin.x+deltaY*.006)),y:drag.origin.y+deltaX*.008});
 }
 function finishDrag(event:React.PointerEvent<SVGSVGElement>){
  const drag=dragRef.current;dragRef.current=null;if(!drag)return;
  let velocityX=drag.velocityX,velocityY=drag.velocityY,last=event.timeStamp;
  const tick=(now:number)=>{const elapsed=Math.min(32,now-last);last=now;velocityX*=Math.pow(.89,elapsed/16.67);velocityY*=Math.pow(.89,elapsed/16.67);if(Math.abs(velocityX)+Math.abs(velocityY)<.000025){animationRef.current=null;return}setRotation(current=>({x:Math.min(1.25,Math.max(-1.25,current.x+velocityX*elapsed)),y:current.y+velocityY*elapsed}));animationRef.current=requestAnimationFrame(tick)};
  if(didRotateRef.current&&(Math.abs(velocityX)+Math.abs(velocityY)>=.000025))animationRef.current=requestAnimationFrame(tick);
 }
 function zoom(delta:number){setViewport(current=>({...current,scale:Math.min(1.8,Math.max(.62,current.scale+delta))}))}
 function reset(){if(animationRef.current!==null)cancelAnimationFrame(animationRef.current);animationRef.current=null;setViewport({x:0,y:0,scale:1});setRotation({x:-.16,y:0})}
 async function toggleFullscreen(){if(document.fullscreenElement)await document.exitFullscreen();else await shellRef.current?.requestFullscreen()}
 function pathFrom(points:ProjectedGraphPoint[]){return points.map((point,index)=>`${index?"L":"M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ")}

 const renderNode=(item:GraphNode)=>{const position=projected[item.id];const width=item.kind==="root"?118:item.kind==="group"?82:158;const height=item.kind==="root"?118:item.kind==="group"?82:40;const label=item.id==="root"?project:item.label;const depthOpacity=item.kind==="root"?1:Math.min(1,Math.max(.26,.62+(position.z/246)*.38));return <g key={item.id} className={`graph-node graph-${item.kind} sphere-node sphere-node-${item.id} ${item.tone} ${node===item.label?"selected":""}`} style={{opacity:depthOpacity}} transform={`translate(${position.x} ${position.y}) scale(${position.scale})`} onClick={()=>{if(!didRotateRef.current&&item.kind==="item")setNode(item.label)}} onKeyDown={event=>{if(item.kind==="item"&&(event.key==="Enter"||event.key===" "))setNode(item.label)}} role={item.kind==="item"?"button":undefined} tabIndex={item.kind==="item"?0:undefined}><rect x={-width/2} y={-height/2} width={width} height={height} rx={item.kind==="item"?20:width/2}/>{item.kind==="root"&&<><circle className="graph-core-orbit" cx="0" cy="0" r="48"/><circle className="graph-core-dot" cx="0" cy="-18" r="5"/></>}<text textAnchor="middle" y={item.kind==="root"?8:item.kind==="group"?-3:5}>{label.length>14?`${label.slice(0,13)}…`:label}</text>{item.kind==="root"&&<text className="graph-node-count" textAnchor="middle" y="27">核心研究问题</text>}{item.kind==="group"&&<text className="graph-node-count" textAnchor="middle" y="17">{graphEdges.filter(edge=>edge[0]===item.id).length} 个节点</text>}</g>};

 return <div ref={shellRef} className="knowledge-layout knowledge-graph-shell graph-only"><section className="panel knowledge-canvas"><div className="map-toolbar"><div><strong>3D 球形知识网络</strong><span>按住任意区域拖动球体，滚轮缩放，点击节点可高亮查看</span></div><div className="graph-toolbar-meta"><span className="tag green-tag">已关联 {paperCount} 篇论文</span><div className="graph-controls"><button onClick={()=>zoom(-.15)} aria-label="缩小知识图谱" title="缩小"><ZoomOut size={16}/></button><button onClick={()=>zoom(.15)} aria-label="放大知识图谱" title="放大"><ZoomIn size={16}/></button><button onClick={reset} aria-label="重置知识图谱" title="重置视角"><RotateCcw size={15}/></button><button onClick={toggleFullscreen} aria-label={fullscreen?"退出全屏":"全屏展示知识图谱"} title={fullscreen?"退出全屏":"全屏展示"}>{fullscreen?<Minimize2 size={16}/>:<Maximize2 size={16}/>}</button></div></div></div><div className="graph-stage graph-stage-3d"><svg ref={svgRef} viewBox="0 0 1000 620" role="img" aria-label={`${project}三维球形知识图谱`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={finishDrag} onPointerCancel={finishDrag} onWheel={event=>{event.preventDefault();zoom(event.deltaY>0?-.08:.08)}}><defs><pattern id="knowledgeGrid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth="1"/></pattern><radialGradient id="sphereFill" cx="35%" cy="28%"><stop offset="0" stopColor="#91e7ef" stopOpacity=".28"/><stop offset=".45" stopColor="#4f8fc1" stopOpacity=".16"/><stop offset="1" stopColor="#142b48" stopOpacity=".08"/></radialGradient><radialGradient id="rootSphereGradient" cx="35%" cy="28%"><stop offset="0" stopColor="#92c8ff"/><stop offset=".5" stopColor="#587fc7"/><stop offset="1" stopColor="#314b7d"/></radialGradient><filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="sphereShadow" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="20" stdDeviation="24" floodColor="#031321" floodOpacity=".58"/></filter><clipPath id="sphereClip"><circle cx="500" cy="310" r="247"/></clipPath></defs><rect className="graph-grid" width="1000" height="620" fill="url(#knowledgeGrid)"/><g ref={graphRef} className="graph-scene sphere-scene" transform={`translate(${viewport.x} ${viewport.y}) scale(${viewport.scale})`}><ellipse className="sphere-ground-shadow" cx="500" cy="568" rx="172" ry="23"/><circle className="sphere-halo" cx="500" cy="310" r="271"/>{orderedNodes.filter(item=>projected[item.id].z<=0).map(renderNode)}<circle className="sphere-shell sphere-shell-3d" cx="500" cy="310" r="247" filter="url(#sphereShadow)"/><g className="rotating-sphere-grid" clipPath="url(#sphereClip)" aria-hidden="true">{sphereGrid.map(line=><path key={line.key} className="sphere-grid-line" d={pathFrom(line.path)}/>)}</g><ellipse className="sphere-specular" cx="428" cy="226" rx="94" ry="55" transform="rotate(-28 428 226)"/><path className="sphere-rim-light" d="M331 131 A247 247 0 0 1 716 185"/>{graphEdges.map(([from,to])=>{const a=projected[from],b=projected[to],depth=(a.z+b.z)/2;const curveX=(a.x+b.x)/2+(a.y-b.y)*.08,curveY=(a.y+b.y)/2+(b.x-a.x)*.05;return <path className={`graph-edge graph-arc ${graphNodeList.find(item=>item.id===to)?.tone||""}`} style={{opacity:Math.min(.78,Math.max(.16,.42+depth/620))}} key={`${from}-${to}`} d={`M ${a.x} ${a.y} Q ${curveX} ${curveY} ${b.x} ${b.y}`}/>})}{renderNode(graphNodeList[0])}{orderedNodes.filter(item=>projected[item.id].z>0).map(renderNode)}</g></svg><div className="graph-depth-hint"><span/><span/><span/>拖动旋转 360°</div><div className="graph-legend"><span><i className="consensus"/>领域共识</span><span><i className="debate"/>观点争议</span><span><i className="method"/>技术路线</span><span><i className="gap"/>研究空白</span></div></div></section></div>
}

type PaperRelation={id:string;source:number;target:number;knowledge:string;description:string;strength:number;kind?:"within"|"cross"};

const paperGraphClusters=[
 {name:"基础推理",tone:"foundation",topics:["推理机制"],y:135},
 {name:"多路径与搜索",tone:"search",topics:["多路径推理","搜索与规划"],y:305},
 {name:"过程验证",tone:"verification",topics:["过程监督"],y:475},
 {name:"自我纠错",tone:"correction",topics:["自我纠错"],y:645}
] as const;

function StructuredPaperGraph({papers,openPaper}:{papers:Paper[];openPaper:(id:number)=>void}){
 const graphPapers=papers.filter(paper=>paper.saved);
 const [selectedPaper,setSelectedPaper]=useState<number|null>(graphPapers[0]?.id??null);
 const [selectedRelation,setSelectedRelation]=useState<string|null>(null);
 const clusterFor=(paper:Paper)=>paperGraphClusters.find(cluster=>cluster.topics.includes(paper.topic as never))||paperGraphClusters[0];
 const positions:Record<number,{x:number;y:number}>={};
 paperGraphClusters.forEach(cluster=>{
  const group=graphPapers.filter(paper=>clusterFor(paper).name===cluster.name).sort((a,b)=>Number(a.year)-Number(b.year)||a.id-b.id);
  group.forEach((paper,index)=>{const count=group.length;positions[paper.id]={x:count===1?600:220+index*(760/Math.max(count-1,1)),y:cluster.y}});
 });
 const relationSpecs:Array<[number,number,string]>=[
  [8,4,"推理轨迹到思维链"],[4,7,"提示与问题分解"],[2,3,"多路径采样与搜索"],[3,9,"搜索与推理时计算"],
  [10,1,"过程反馈到过程奖励"],[1,11,"步骤级验证器"],[5,6,"反思与记忆机制"],[6,12,"外部反馈增强"],
  [4,2,"思维链到路径聚合"],[2,1,"结果稳定到步骤验证"],[7,3,"问题分解到搜索规划"],[8,10,"推理轨迹监督"],
  [10,5,"反馈信号驱动修正"],[11,12,"验证器与工具反馈"],[3,12,"搜索规划与工具批判"]
 ];
 const available=new Set(graphPapers.map(paper=>paper.id));
 const relations:PaperRelation[]=relationSpecs.filter(([source,target])=>available.has(source)&&available.has(target)).map(([source,target,knowledge])=>{
  const sourcePaper=graphPapers.find(paper=>paper.id===source)!;const targetPaper=graphPapers.find(paper=>paper.id===target)!;
  const kind=clusterFor(sourcePaper).name===clusterFor(targetPaper).name?"within":"cross";
  return{id:`${source}-${target}`,source,target,knowledge,kind,description:`「${sourcePaper.title}」与「${targetPaper.title}」在“${knowledge}”上形成研究承接，可进一步核对方法假设、实验设置和适用边界。`,strength:80+((source+target)*7)%16};
 });
 const activePaper=graphPapers.find(paper=>paper.id===selectedPaper)||null;
 const activeRelation=relations.find(relation=>relation.id===selectedRelation)||null;
 const relatedToPaper=activePaper?relations.filter(relation=>relation.source===activePaper.id||relation.target===activePaper.id):[];
 const relationPapers=activeRelation?graphPapers.filter(paper=>paper.id===activeRelation.source||paper.id===activeRelation.target):[];
 const selectPaper=(id:number)=>{setSelectedPaper(id);setSelectedRelation(null)};
 const selectRelation=(id:string)=>{setSelectedRelation(id);setSelectedPaper(null)};
 return <div className="paper-graph-layout structured-paper-layout"><section className="panel paper-graph-canvas"><header><div><strong>结构化论文关系网络</strong><span>纵向按研究主线分组，横向按发表时间演进</span></div><span className="tag green-tag">{graphPapers.length} 篇论文 · {relations.length} 条关联</span></header><div className="paper-graph-stage structured-paper-stage"><svg viewBox="0 0 1200 760" role="img" aria-label="按研究主线和发表时间组织的论文关系图谱"><defs><pattern id="structuredPaperGrid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="1"/></pattern><filter id="structuredPaperGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect className="paper-graph-grid" width="1200" height="760" fill="url(#structuredPaperGrid)"/><g className="paper-time-axis"><text x="70" y="38">研究演进</text><line x1="210" y1="34" x2="1000" y2="34"/><path d="M1000 34l-10-5v10z"/><text x="220" y="58">早期工作</text><text x="565" y="58">方法扩展</text><text x="930" y="58">近期进展</text></g>{paperGraphClusters.map(cluster=>{const count=graphPapers.filter(paper=>clusterFor(paper).name===cluster.name).length;return <g className={`paper-cluster-band ${cluster.tone}`} key={cluster.name}><rect x="55" y={cluster.y-58} width="1090" height="116" rx="18"/><text className="paper-cluster-title" x="76" y={cluster.y-30}>{cluster.name}</text><text className="paper-cluster-count" x="76" y={cluster.y-13}>{count} 篇代表论文</text></g>})}{relations.map(relation=>{const source=positions[relation.source],target=positions[relation.target];if(!source||!target)return null;const middle={x:(source.x+target.x)/2,y:(source.y+target.y)/2};const selected=selectedRelation===relation.id;return <g className={`paper-relation ${relation.kind||"within"} ${selected?"selected":""}`} key={relation.id} role="button" tabIndex={0} aria-label={`查看关联：${relation.knowledge}`} onClick={()=>selectRelation(relation.id)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" ")selectRelation(relation.id)}}><line className="paper-relation-hit" x1={source.x} y1={source.y} x2={target.x} y2={target.y}/><line className="paper-relation-line" x1={source.x} y1={source.y} x2={target.x} y2={target.y}/><circle className="paper-relation-point" cx={middle.x} cy={middle.y} r={selected?6:4}/><g className="paper-relation-label" transform={`translate(${middle.x} ${middle.y-12})`}><rect x="-55" y="-11" width="110" height="22" rx="11"/><text textAnchor="middle" y="4">{relation.knowledge.length>9?`${relation.knowledge.slice(0,9)}…`:relation.knowledge}</text></g></g>})}{graphPapers.map(paper=>{const point=positions[paper.id];if(!point)return null;const selected=selectedPaper===paper.id;const cluster=clusterFor(paper);return <g className={`paper-graph-node compact ${cluster.tone} ${selected?"selected":""}`} key={paper.id} transform={`translate(${point.x} ${point.y})`} role="button" tabIndex={0} aria-label={`查看论文：${paper.title}`} onClick={()=>selectPaper(paper.id)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" ")selectPaper(paper.id)}}><rect x="-104" y="-35" width="208" height="70" rx="12"/><circle cx="-80" cy="-11" r="10"/><text className="paper-year" x="-80" y="-7" textAnchor="middle">{paper.year.slice(-2)}</text><text className="paper-node-title" x="-62" y="-9">{paper.title.length>25?`${paper.title.slice(0,24)}…`:paper.title}</text><text className="paper-node-meta" x="-88" y="12">{paper.venue} · {paper.year}</text><text className="paper-node-topic" x="-88" y="27">{paper.topic}</text></g>})}</svg><div className="paper-graph-legend structured"><span><i className="foundation"/>基础推理</span><span><i className="search"/>多路径与搜索</span><span><i className="verification"/>过程验证</span><span><i className="correction"/>自我纠错</span><em>点击节点或连线查看详情</em></div></div></section><aside className="panel paper-graph-inspector">{activeRelation?<><div className="paper-inspector-kicker"><GitBranch size={15}/>关联知识点</div><span className="relation-strength">关联强度 {activeRelation.strength}%</span><h3>{activeRelation.knowledge}</h3><div className="relation-paper-pair">{relationPapers.map((paper,index)=><div key={paper.id}><button onClick={()=>selectPaper(paper.id)}>{paper.title}</button><small>{paper.venue} · {paper.year}</small>{index===0&&<i/>}</div>)}</div><section className="relation-explanation"><span>关联解释</span><p>{activeRelation.description}</p></section><div className="paper-inspector-note"><Sparkles size={14}/><span>关联由 Agent 从研究问题、方法和摘要中提取，关键判断需回到原文核查。</span></div></>:activePaper?<><div className="paper-inspector-kicker"><BookOpen size={15}/>论文节点 · {clusterFor(activePaper).name}</div><span className={`paper-source source-${activePaper.source}`}>{activePaper.sourceDetail||"项目文献"}</span><h3>{activePaper.title}</h3><p className="paper-inspector-meta">{activePaper.venue} · {activePaper.year} · {activePaper.topic}</p><section className="paper-inspector-method"><span>核心方法</span><strong>{activePaper.method}</strong><p>{activePaper.summary}</p></section><section className="paper-related-list"><header><span>关联论文与知识点</span><em>{relatedToPaper.length}</em></header>{relatedToPaper.map(relation=>{const otherId=relation.source===activePaper.id?relation.target:relation.source;const other=graphPapers.find(paper=>paper.id===otherId);return <button key={relation.id} onClick={()=>selectRelation(relation.id)}><span><strong>{relation.knowledge}</strong><small>{other?.title}</small></span><ChevronRight size={14}/></button>})}</section><Button variant="outline" onClick={()=>openPaper(activePaper.id)}><BookOpen/>查看论文详情</Button></>:null}</aside></div>;
}

function PaperGraph({papers,openPaper}:{papers:Paper[];openPaper:(id:number)=>void}){
 const graphPapers=papers.filter(paper=>paper.saved);
 const [selectedPaper,setSelectedPaper]=useState<number|null>(graphPapers[0]?.id??null);
 const [selectedRelation,setSelectedRelation]=useState<string|null>(null);
 if(graphPapers.length>=8)return <StructuredPaperGraph papers={papers} openPaper={openPaper}/>;
 const explicitRelations:Record<string,string>={"1-2":"可靠性提升机制","1-3":"推理步骤与搜索验证","1-4":"推理过程可验证性","2-3":"多路径采样与搜索","2-4":"思维链稳定性","3-4":"显式推理与规划","5-6":"反馈驱动自我纠错"};
 const relationKnowledge=(a:Paper,b:Paper)=>explicitRelations[[a.id,b.id].sort((x,y)=>x-y).join("-")]||(a.topic===b.topic?a.topic:`${a.topic} × ${b.topic}`);
 const relations:PaperRelation[]=[];
 graphPapers.forEach((paper,index)=>graphPapers.slice(index+1).forEach((target,offset)=>{
  const targetIndex=index+offset+1;
  const shouldConnect=graphPapers.length<=6||paper.topic===target.topic||targetIndex===index+1||index===0&&targetIndex===graphPapers.length-1;
  if(!shouldConnect)return;
  const knowledge=relationKnowledge(paper,target);
  relations.push({id:`${paper.id}-${target.id}`,source:paper.id,target:target.id,knowledge,description:`两篇论文在「${knowledge}」上形成可比较的研究证据，可进一步核对任务设置、方法假设与实验边界。`,strength:78+((paper.id+target.id)*7)%18});
 }));
 const positions=Object.fromEntries(graphPapers.map((paper,index)=>{const angle=-Math.PI/2+(Math.PI*2*index/Math.max(graphPapers.length,1));const radius=graphPapers.length<=4?225:index%2?250:215;return[paper.id,{x:500+Math.cos(angle)*radius,y:315+Math.sin(angle)*radius}]})) as Record<number,{x:number;y:number}>;
 const activePaper=graphPapers.find(paper=>paper.id===selectedPaper)||null;
 const activeRelation=relations.find(relation=>relation.id===selectedRelation)||null;
 const relatedToPaper=activePaper?relations.filter(relation=>relation.source===activePaper.id||relation.target===activePaper.id):[];
 const relationPapers=activeRelation?graphPapers.filter(paper=>paper.id===activeRelation.source||paper.id===activeRelation.target):[];
 const selectPaper=(id:number)=>{setSelectedPaper(id);setSelectedRelation(null)};
 const selectRelation=(id:string)=>{setSelectedRelation(id);setSelectedPaper(null)};
 if(!graphPapers.length)return <section className="panel"><Empty text="文献中心还没有已收录论文"/></section>;
 return <div className="paper-graph-layout"><section className="panel paper-graph-canvas"><header><div><strong>论文关系网络</strong><span>点击论文或连线，查看关联知识点与证据解释</span></div><span className="tag green-tag">{graphPapers.length} 篇论文 · {relations.length} 条关联</span></header><div className="paper-graph-stage"><svg viewBox="0 0 1000 630" role="img" aria-label="项目论文关系图谱"><defs><pattern id="paperGraphGrid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="1"/></pattern><filter id="paperNodeGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect className="paper-graph-grid" width="1000" height="630" fill="url(#paperGraphGrid)"/><circle className="paper-network-orbit orbit-outer" cx="500" cy="315" r="270"/><circle className="paper-network-orbit orbit-inner" cx="500" cy="315" r="155"/><g className="paper-network-core"><circle cx="500" cy="315" r="62"/><BookOpen x="480" y="284" width="40" height="40"/><text x="500" y="342" textAnchor="middle">论文知识网络</text><text className="paper-network-count" x="500" y="359" textAnchor="middle">{graphPapers.length} PAPERS</text></g>{relations.map(relation=>{const source=positions[relation.source],target=positions[relation.target];const middle={x:(source.x+target.x)/2,y:(source.y+target.y)/2};const selected=selectedRelation===relation.id;return <g className={`paper-relation ${selected?"selected":""}`} key={relation.id} role="button" tabIndex={0} aria-label={`查看关联：${relation.knowledge}`} onClick={()=>selectRelation(relation.id)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" ")selectRelation(relation.id)}}><line className="paper-relation-hit" x1={source.x} y1={source.y} x2={target.x} y2={target.y}/><line className="paper-relation-line" x1={source.x} y1={source.y} x2={target.x} y2={target.y}/><circle className="paper-relation-point" cx={middle.x} cy={middle.y} r={selected?6:4}/><g className="paper-relation-label" transform={`translate(${middle.x} ${middle.y-13})`}><rect x="-54" y="-11" width="108" height="22" rx="11"/><text textAnchor="middle" y="4">{relation.knowledge.length>9?`${relation.knowledge.slice(0,9)}…`:relation.knowledge}</text></g></g>})}{graphPapers.map(paper=>{const point=positions[paper.id];const selected=selectedPaper===paper.id;return <g className={`paper-graph-node ${selected?"selected":""}`} key={paper.id} transform={`translate(${point.x} ${point.y})`} role="button" tabIndex={0} aria-label={`查看论文：${paper.title}`} onClick={()=>selectPaper(paper.id)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" ")selectPaper(paper.id)}}><rect x="-105" y="-42" width="210" height="84" rx="13"/><circle cx="-79" cy="-15" r="10"/><text className="paper-year" x="-79" y="-11" textAnchor="middle">{paper.year.slice(-2)}</text><text className="paper-node-title" x="-60" y="-13">{paper.title.length>24?`${paper.title.slice(0,23)}…`:paper.title}</text><text className="paper-node-meta" x="-88" y="12">{paper.venue} · {paper.year}</text><text className="paper-node-topic" x="-88" y="30">{paper.topic}</text></g>})}</svg><div className="paper-graph-legend"><span><i/>论文节点</span><span><i className="relation"/>知识关联</span><em>点击连线查看关联依据</em></div></div></section><aside className="panel paper-graph-inspector">{activeRelation?<><div className="paper-inspector-kicker"><GitBranch size={15}/>知识关联</div><span className="relation-strength">关联强度 {activeRelation.strength}%</span><h3>{activeRelation.knowledge}</h3><div className="relation-paper-pair">{relationPapers.map((paper,index)=><div key={paper.id}><button onClick={()=>selectPaper(paper.id)}>{paper.title}</button><small>{paper.venue} · {paper.year}</small>{index===0&&<i/>}</div>)}</div><section className="relation-explanation"><span>为什么关联</span><p>{activeRelation.description}</p></section><div className="paper-inspector-note"><Sparkles size={14}/><span>关联由 Agent 根据研究问题、方法与摘要提取，需结合论文原文核查。</span></div></>:activePaper?<><div className="paper-inspector-kicker"><BookOpen size={15}/>论文节点</div><span className={`paper-source source-${activePaper.source}`}>{activePaper.sourceDetail||"项目文献"}</span><h3>{activePaper.title}</h3><p className="paper-inspector-meta">{activePaper.venue} · {activePaper.year} · {activePaper.topic}</p><section className="paper-inspector-method"><span>核心方法</span><strong>{activePaper.method}</strong><p>{activePaper.summary}</p></section><section className="paper-related-list"><header><span>关联论文与知识点</span><em>{relatedToPaper.length}</em></header>{relatedToPaper.map(relation=>{const otherId=relation.source===activePaper.id?relation.target:relation.source;const other=graphPapers.find(paper=>paper.id===otherId);return <button key={relation.id} onClick={()=>selectRelation(relation.id)}><span><strong>{relation.knowledge}</strong><small>{other?.title}</small></span><ChevronRight size={14}/></button>})}</section><Button variant="outline" onClick={()=>openPaper(activePaper.id)}><BookOpen/>查看论文详情</Button></>:null}</aside></div>;
}

export function Evidence(p:Props){
 const [node,setNode]=useState("过程监督");
 const [view,setView]=useState<"knowledge"|"papers">("knowledge");
 const graphNodes=[
  {group:"领域共识",tone:"consensus",items:["思维链改善复杂推理","多路径采样提升稳定性"]},
  {group:"观点与争议",tone:"debate",items:["自我纠错是否稳定有效","步骤正确是否代表结论可靠"]},
  {group:"技术路线",tone:"method",items:["过程监督","多路径推理","搜索与规划"]},
  {group:"研究空白",tone:"gap",items:["跨模型验证不足","反馈来源缺少统一比较"]}
 ];
 const summaries=[{label:"领域共识",count:2,tone:"consensus",node:graphNodes[0].items[0]},{label:"观点争议",count:2,tone:"debate",node:graphNodes[1].items[0]},{label:"技术路线",count:3,tone:"method",node:graphNodes[2].items[0]},{label:"研究空白",count:2,tone:"gap",node:graphNodes[3].items[0]}];
 const savedPapers=p.papers.filter(x=>x.saved);
 const years=savedPapers.map(paper=>Number(paper.year)).filter(Boolean);
 return <>
  <div className="knowledge-hero"><div><span className="eyebrow">PROJECT KNOWLEDGE</span><h2>{view==="knowledge"?p.goal:"论文之间如何形成研究脉络"}</h2><p>{view==="knowledge"?"查看领域共识、观点争议、技术路线与研究空白。":"查看全部项目论文、发表时间及其共同知识点；点击论文或连线查看详细关联。"}</p></div><div className="knowledge-health"><strong>{view==="knowledge"?12:savedPapers.length}</strong><span>{view==="knowledge"?"知识节点":"论文节点"}<small>持续自动更新</small></span></div></div>
  <div className="knowledge-view-tabs" role="tablist" aria-label="图谱类型"><button role="tab" aria-selected={view==="knowledge"} className={view==="knowledge"?"active":""} onClick={()=>setView("knowledge")}><Network size={18}/><span><strong>知识图谱</strong><small>共识、争议、路线与研究空白</small></span></button><button role="tab" aria-selected={view==="papers"} className={view==="papers"?"active":""} onClick={()=>setView("papers")}><BookOpen size={18}/><span><strong>论文图谱</strong><small>论文关系、发表时间与关联知识点</small></span></button></div>
  {view==="knowledge"?<><div className="knowledge-evidence-strip">{summaries.map(item=><button className={item.tone} key={item.label} onClick={()=>setNode(item.node)}><span>{item.label}</span><strong>{item.count}</strong><small>查看相关证据<ChevronRight size={13}/></small></button>)}</div><KnowledgeGraph project={p.project} node={node} setNode={setNode} paperCount={savedPapers.length}/></>:<><div className="paper-graph-stats"><div><span>论文总数</span><strong>{savedPapers.length}</strong><small>来自项目文献中心</small></div><div><span>研究主题</span><strong>{new Set(savedPapers.map(paper=>paper.topic)).size}</strong><small>Agent 自动聚类</small></div><div><span>时间跨度</span><strong>{years.length?`${Math.min(...years)}–${Math.max(...years)}`:"—"}</strong><small>按发表年份组织</small></div><div><span>最新论文</span><strong>{years.length?Math.max(...years):"—"}</strong><small>持续由雷达补充</small></div></div><PaperGraph papers={p.papers} openPaper={p.openPaper}/></>}
  {p.selected.length>=2&&<section className="selected-evidence-comparison"><div className="section-heading standalone"><h2>已选文献证据对比</h2><span className="tag blue-tag">{p.selected.length} 篇</span></div><EvidenceComparison p={p}/></section>}
 </>;
}

function EvidenceComparison({p}:{p:Props}){const chosen=p.papers.filter(x=>p.selected.includes(x.id));const list=chosen.length>=2?chosen:p.papers.filter(x=>x.saved).slice(0,3);const {confirmed,setConfirmed}=p;return <><div className="evidence-banner"><span className="action-icon blue"><Network size={23}/></span><div><h2>对齐实验条件，再比较方法结论</h2><p>逐项核查模型、数据集、反馈来源与推理预算。</p></div><Button variant="outline" onClick={()=>p.go("papers")}>重新选择</Button></div><div className="section-heading standalone"><h2>方法比较 <span className="sub-count">{list.length} 篇</span></h2><span className="tag amber-tag">Agent 提取 · 待核查</span></div>{list.length<2?<div className="panel"><Empty text="先收录至少两篇文献，开始比较" action="前往文献中心" onClick={()=>p.go("papers")}/></div>:<div className="panel evidence-table"><Table><TableHeader><TableRow><TableHead className="dimension-col">比较维度</TableHead>{list.map(x=><TableHead key={x.id}><button onClick={()=>p.openPaper(x.id)}>{x.title}<ArrowUpRight size={15}/></button><small>{x.venue} · {x.year}</small></TableHead>)}</TableRow></TableHeader><TableBody>{[{name:"研究主题",key:"topic"},{name:"核心方法",key:"method"},{name:"研究内容",key:"summary"},{name:"待核查边界",key:"limitation"}].map(row=><TableRow key={row.key}><TableCell className="dimension-col">{row.name}</TableCell>{list.map(x=><TableCell key={x.id}><button className="evidence-cell" onClick={()=>p.openPaper(x.id)}>{x[row.key as keyof Paper]}<span>查看论文 <ArrowUpRight size={12}/></span></button></TableCell>)}</TableRow>)}<TableRow><TableCell className="dimension-col">实验结果</TableCell>{list.map(x=><TableCell key={x.id}><span className="muted">尚未提取</span><p className="cell-note">请核查原文数据与实验条件</p></TableCell>)}</TableRow></TableBody></Table></div>}{p.isDemo&&<div className="evidence-bottom"><section className="panel insight-panel"><div className="section-heading"><h2><Sparkles size={18}/>研究提示</h2><span className="tag">AI 建议</span></div><div className="panel-body"><h3>先对齐条件，再比较效果</h3><p>将模型、数据集、采样预算和反馈来源加入核查清单。当前材料不足以直接判断哪种方法更优。</p><Button variant="outline" onClick={()=>p.addTask("核查对比论文的模型、数据集与推理预算","证据核查")}>创建核查任务<Plus/></Button></div></section><section className="panel insight-panel"><div className="section-heading"><h2>项目判断</h2><span className={confirmed?"tag green-tag":"tag amber-tag"}>{confirmed?"已记录":"待确认"}</span></div><div className="panel-body"><h3>将过程验证作为候选研究路线</h3><p>这是一条探索假设，尚不能作为领域共识或研究结论。</p><Button variant="outline" onClick={()=>{setConfirmed(!confirmed);toast.success(confirmed?"已恢复为待确认":"已记录为项目候选路线")}}>{confirmed?<Check/>:<Plus/>}{confirmed?"已纳入候选路线":"纳入候选路线"}</Button></div></section></div>}</>}
export function RadarView(p:Props){const[filter,setFilter]=useState("全部发现");const[scanning,setScanning]=useState(false);const[scanned,setScanned]=useState(false);const list=discoveries.filter(x=>!p.dismissed.includes(x.id)&&(filter==="全部发现"||x.type===filter));const nodes=["过程监督","自我纠错争议","搜索与规划"];
 return <><div className="radar-control panel"><div className="radar-control-icon"><Radar size={31}/></div><div><h2>{p.paused?"监测已暂停":"知识地图持续监测中"}</h2><p>{p.isDemo?"过程监督 · 自我纠错争议 · 跨模型验证不足":p.goal}</p><small>{scanned?"本轮检查完成 · 没有更多发现":"围绕已关注节点检索论文、观点与复现资源"}</small></div><div className="radar-runtime"><span><Clock3 size={15}/>{p.paused?"暂停前累计":"连续监测"}</span><strong>12天 08小时</strong><small>最近检查 18 分钟前</small></div><div className="radar-control-actions"><Button variant="outline" onClick={()=>p.setPaused(!p.paused)}>{p.paused?<Play/>:<Pause/>}{p.paused?"恢复监测":"暂停监测"}</Button><Button disabled={scanning||p.paused} onClick={()=>{setScanning(true);setTimeout(()=>{setScanning(false);setScanned(true);toast.info("本轮监测检查已完成。");},900)}}>{scanning?<Loader2 className="spin"/>:<Radar/>}{scanning?"检查中":"立即检查"}</Button></div></div><div className="watching-nodes"><span>正在关注</span>{nodes.map(x=><button key={x} onClick={()=>p.go("evidence")}><Target size={12}/>{x}</button>)}<button onClick={()=>p.go("evidence")}><Plus size={12}/>管理节点</button></div><div className="filter-row radar-filters">{["全部发现","研究进展","待核查","研究资源"].map(x=><button key={x} className={filter===x?"filter-chip active":"filter-chip"} onClick={()=>setFilter(x)}>{x}</button>)}<span className="muted">{list.length} 条发现</span></div><div className="discovery-list">{!list.length?<div className="panel"><Empty text="当前没有待处理的发现" action={p.isDemo?"恢复已忽略发现":undefined} onClick={()=>{p.setDismissed([]);setFilter("全部发现")}}/></div>:list.map((x,i)=><article className="panel discovery" key={x.id}><div className="discovery-top"><span className={`tag ${x.type==="待核查"?"amber-tag":"blue-tag"}`}>{x.type}</span><span className="mini-meta">{i===0?"新增证据":i===1?"挑战已有观点":"补充技术路线"}</span></div><div className="graph-link"><Network size={13}/><span>关联节点：{nodes[i]||"可靠推理"}</span></div><h2>{x.title}</h2><p>{x.description}</p><div className="impact"><span>对知识地图的影响</span><p>{x.impact}</p></div><div className="discovery-bottom"><span className="relevance"><span/>{x.tag}</span><div><button className="text-button" onClick={()=>p.setDismissed(prev=>[...prev,x.id])}>忽略</button><Button variant="outline" onClick={()=>p.openPaper(x.paperId)}>查看论文<ArrowUpRight/></Button><Button onClick={()=>p.addTask(x.title,x.type,x.paperId)}>创建任务<Plus/></Button></div></div></article>)}</div></>;
}
export function Tasks(p:Props){
 const[title,setTitle]=useState("");
 const[tab,setTab]=useState("all");
 const[selectedModel,setSelectedModel]=useState<"fast"|"research"|"advanced">("research");
 const[selectedTask,setSelectedTask]=useState<Task|null>(()=>p.focusedTaskId?p.tasks.find(item=>item.id===p.focusedTaskId)||null:null);
 const[runStates,setRunStates]=useState<Record<number,"idle"|"running"|"review">>({});
 const active=p.tasks.filter(x=>!x.done);
 const completed=p.tasks.filter(x=>x.done);
 const list=[...p.tasks]
  .filter(x=>tab==="todo"?!x.done:tab==="done"?x.done:true)
  .sort((a,b)=>Number(a.done)-Number(b.done));
 const ownerMeta={
  agent:{label:"Agent 主导",icon:Bot,action:"启动 / 查看"},
  human:{label:"人主导 · Agent 辅助",icon:UserRound,action:"开始任务"},
  collab:{label:"Agent 与人协同",icon:UsersRound,action:"协同推进"}
 } as const;
 const relatedMaterial=(x:Task)=>{setSelectedTask(null);p.setFocusedTaskId(null);if(x.paperId){p.openPaper(x.paperId)}else{p.go(x.category==="证据对比"||x.category==="证据核查"||x.category==="创新验证"?"evidence":"papers")}};
 const buildTaskResult=(x:Task)=>{const mode=x.owner==="agent"?"Agent 主导，研究者审核":x.owner==="human"?"研究者主导，Agent 辅助":"Agent 与研究者协同";const focus=x.category==="证据对比"?"已按方法、数据、实验条件与推理预算组织比较框架。":x.category.includes("精读")?"已整理核心方法、关键证据、适用边界与待核查项。":x.category.includes("核查")?"已记录支持证据、冲突观点与仍需回到原文确认的边界。":x.category.includes("创新")?"已形成最小验证思路，并标记创新性证据与撞题风险。":"已根据当前项目材料形成结构化任务记录。";return `# ${x.title}\n\n## 成果摘要\n\n${focus}\n\n## 产出信息\n\n- 产出类型：${x.output}\n- 完成方式：${mode}\n- 关联范围：当前项目文献、知识地图与任务材料\n\n## 关键结论\n\n- 已完成当前任务要求的材料整理与结构化记录。\n- 关键科研判断由研究者确认后纳入项目。\n- 尚未核实的内容保留为待核查项，不直接视为研究结论。\n\n## 后续建议\n\n将本成果纳入项目知识地图，并在新增论文或实验结果出现后继续更新。\n\n> SCIMate 项目任务成果；未确认内容已保留为待核查项。`;};
 const completeTask=(x:Task)=>{const completedAt=new Date().toLocaleString("zh-CN",{hour12:false});const result=buildTaskResult(x);p.setTasks(prev=>prev.map(t=>t.id===x.id?{...t,done:true,result,completedAt}:t));toast.success("任务已完成，成果文档已生成")};
 const downloadTaskResult=(x:Task)=>{if(!x.result)return;const url=URL.createObjectURL(new Blob([x.result],{type:"text/markdown;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=`SCIMate-${x.title.replace(/[\/:*?"<>|]/g,"-")}-任务成果.md`;a.click();URL.revokeObjectURL(url)};
 const modelOptions={fast:{name:"快速模型",cost:120,detail:"适合检索与基础整理"},research:{name:"研究模型",cost:360,detail:"适合精读、证据与报告"},advanced:{name:"前沿模型",cost:720,detail:"适合复杂推理与创新评估"}} as const;
 const startAgent=(x:Task)=>{const cost=modelOptions[selectedModel].cost;if(p.creditBalance<cost){toast.error("积分不足，请先充值或选择消耗更低的模型",{action:{label:"查看积分",onClick:p.openBilling}});return}p.setCreditBalance(balance=>balance-cost);setRunStates(prev=>({...prev,[x.id]:"running"}));setTimeout(()=>{setRunStates(prev=>({...prev,[x.id]:"review"}));toast.success(`Agent 执行完成，本次消耗 ${cost} 积分，请审核产出`)},1100)};
 const startHuman=(x:Task)=>{setRunStates(prev=>({...prev,[x.id]:"review"}));toast.info("已进入人工处理阶段，Agent 可继续提供辅助")};
 const task=selectedTask&&p.tasks.find(x=>x.id===selectedTask.id)||null;
 const state=task?runStates[task.id]||"idle":"idle";
 const modelPicker=<section className="task-model-picker"><header><span><Zap size={16}/><strong>选择 Agent 模型</strong></span><button onClick={p.openBilling}><WalletCards size={14}/>{p.creditBalance.toLocaleString()} 积分</button></header><div>{(Object.entries(modelOptions) as [keyof typeof modelOptions,(typeof modelOptions)[keyof typeof modelOptions]][]).map(([id,model])=><button key={id} className={selectedModel===id?"active":""} onClick={()=>setSelectedModel(id)}><span><strong>{model.name}</strong><small>{model.detail}</small></span><em>预计 {model.cost} 积分</em>{selectedModel===id&&<Check size={13}/>}</button>)}</div></section>;
 return <>
  <section className="task-execution panel">
   <div className="task-execution-copy"><span className="eyebrow">RESEARCH EXECUTION</span><h2>每项任务都能调用 Agent，也允许人随时参与</h2><p>任务类型表示主导方式：Agent 可以持续执行，人可以介入、补充判断并确认最终产出。</p></div>
   <div className="task-owner-summary">
    <div className="agent"><Bot/><strong>{active.filter(x=>x.owner==="agent").length}</strong><span>Agent 主导</span></div>
    <div className="human"><UserRound/><strong>{active.filter(x=>x.owner==="human").length}</strong><span>人主导 · Agent 辅助</span></div>
    <div className="collab"><UsersRound/><strong>{active.filter(x=>x.owner==="collab").length}</strong><span>协同推进</span></div>
   </div>
  </section>
  <form className="task-add panel" onSubmit={e=>{e.preventDefault();if(!title.trim()){toast.info("请先填写一项具体的研究工作，例如：对比三篇论文的实验条件");return}p.addTask(title.trim(),"自定义任务",undefined,"human","研究任务记录");setTitle("")}}><Plus size={20}/><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="例如：对比三篇论文的实验条件" aria-label="研究任务内容" maxLength={160}/><Button type="submit">创建研究任务</Button></form>
  <Tabs value={tab} onValueChange={setTab}><TabsList className="view-tabs"><TabsTrigger value="all">全部 {p.tasks.length}</TabsTrigger><TabsTrigger value="todo">待推进 {active.length}</TabsTrigger><TabsTrigger value="done">已完成 {completed.length}</TabsTrigger></TabsList><div className="panel task-list">{list.length?list.map(x=>{const meta=ownerMeta[x.owner];const OwnerIcon=meta.icon;return <div className={`task-item task-item-${x.owner}`} key={x.id}><span className={`task-state-marker ${x.done?"done":"todo"}`} aria-label={x.done?"任务已完成":"任务待推进"}>{x.done?<Check size={14}/>:<i/>}</span><button className="task-item-main" onClick={()=>setSelectedTask(x)}><div className="task-item-head"><span className={`task-owner ${x.owner}`}><OwnerIcon size={13}/>{meta.label}</span><span className="tag">{x.category}</span></div><h3 className={x.done?"completed":""}>{x.title}</h3><p className="task-output"><CheckCheck size={14}/>预期产出：{x.output}</p></button><Button variant="ghost" onClick={()=>setSelectedTask(x)}>{x.done?<>查看成果文档<FileText/></>:<>{meta.action}<ArrowRight/></>}</Button></div>}):<Empty text={tab==="done"?"还没有完成的任务":tab==="todo"?"当前任务已全部推进完成":"还没有研究任务"}/>}</div></Tabs>
  <div className="subtle-help"><CheckCheck size={16}/>任务完成后，产出会进入项目记录，并更新知识地图或阶段成果。</div>
  <Dialog open={!!task} onOpenChange={open=>{if(!open){setSelectedTask(null);p.setFocusedTaskId(null)}}}><DialogContent className="research-dialog task-dialog">{task&&<>
   <div className={`task-dialog-owner ${task.owner}`}>{task.owner==="agent"?<Bot/>:task.owner==="human"?<UserRound/>:<UsersRound/>}<span>{ownerMeta[task.owner].label}</span></div>
   <DialogTitle>{task.title}</DialogTitle><DialogDescription>{task.category} · {task.done?`已形成「${task.output}」`:`完成后形成「${task.output}」`}</DialogDescription>
   {!task.done&&state==="idle"&&modelPicker}
   {task.done&&task.result&&<section className="task-result"><div className="task-result-status"><span><Check size={20}/></span><div><strong>任务成果已生成</strong><p>{task.completedAt||"已完成"} · {ownerMeta[task.owner].label}</p></div></div><div className="task-result-meta"><div><small>成果类型</small><strong>{task.output}</strong></div><div><small>成果状态</small><strong>已确认并归档</strong></div></div><div className="task-result-preview"><div><span>成果文档预览</span><em>Markdown</em></div><pre>{task.result}</pre></div><div className="task-dialog-actions"><Button variant="outline" onClick={()=>relatedMaterial(task)}><BookOpen/>查看关联材料</Button><Button onClick={()=>downloadTaskResult(task)}><Download/>下载成果文档</Button></div></section>}
   {!task.done&&task.owner==="agent"&&<div className="task-workflow"><div className="task-operation-note"><Bot/><div><strong>Agent 主导推进</strong><p>Agent 自动处理主要步骤；你可以随时查看材料、介入判断，并审核最终产出。</p></div></div><ol className="task-steps"><li className="active"><span>01</span><div><strong>确认输入材料</strong><small>{task.paperId?"已关联 1 篇核心论文":"使用当前项目文献与知识地图"}</small></div></li><li className={state!=="idle"?"active":""}><span>02</span><div><strong>Agent 检索与分析</strong><small>{state==="running"?"正在整理证据并生成结构化结果…":"检索、去重、比较并保留证据来源"}</small></div></li><li className={state==="review"?"active":""}><span>03</span><div><strong>人工审核产出</strong><small>{state==="review"?"Agent 产出已就绪，等待你的确认":"确认结论、边界与引用后完成任务"}</small></div></li></ol><div className="task-dialog-actions"><Button variant="outline" onClick={()=>relatedMaterial(task)}><BookOpen/>查看输入材料</Button>{state==="idle"&&<Button onClick={()=>startAgent(task)}><Sparkles/>启动 Agent</Button>}{state==="running"&&<><Button variant="outline" onClick={()=>startHuman(task)}><UserRound/>人工介入</Button><Button disabled><Loader2 className="spin"/>Agent 执行中</Button></>}{state==="review"&&<Button onClick={()=>completeTask(task)}><Check/>审核通过并完成</Button>}</div></div>}
   {!task.done&&task.owner==="human"&&<div className="task-workflow"><div className="task-operation-note human"><UserRound/><div><strong>人主导，Agent 全程辅助</strong><p>你负责关键判断或实验操作；Agent 可以先准备材料、生成方案，并根据你的反馈继续整理。</p></div></div><ol className="task-steps"><li className="active"><span>01</span><div><strong>Agent 准备辅助材料</strong><small>{state==="running"?"正在整理证据、方案与操作建议…":"可选：让 Agent 先完成检索、整理或方案草拟"}</small></div></li><li className={state==="review"?"active":""}><span>02</span><div><strong>研究者处理关键步骤</strong><small>完成判断、确认或真实实验，并记录依据</small></div></li><li><span>03</span><div><strong>Agent 整理并提交结果</strong><small>根据人工输入形成结构化项目记录</small></div></li></ol><div className="task-dialog-actions"><Button variant="outline" onClick={()=>relatedMaterial(task)}><BookOpen/>打开相关材料</Button>{state==="idle"&&<><Button variant="outline" onClick={()=>startHuman(task)}><UserRound/>我来处理</Button><Button onClick={()=>startAgent(task)}><Sparkles/>让 Agent 先准备</Button></>}{state==="running"&&<Button disabled><Loader2 className="spin"/>Agent 准备中</Button>}{state==="review"&&<Button onClick={()=>completeTask(task)}><Check/>人工确认并提交</Button>}</div></div>}
   {!task.done&&task.owner==="collab"&&<div className="task-workflow"><div className="task-operation-note collab"><UsersRound/><div><strong>Agent 与研究者协同推进</strong><p>Agent 先整理证据和待核查项，你可以随时介入并负责关键判断，确认后由 Agent 汇总产出。</p></div></div><ol className="task-steps"><li className="active"><span>01</span><div><strong>Agent 准备初稿</strong><small>{state==="running"?"正在整理材料与待核查项…":"提取内容、组织证据并标记不确定项"}</small></div></li><li className={state==="review"?"active":""}><span>02</span><div><strong>研究者核查判断</strong><small>{state==="review"?"初稿已就绪，请查看材料并核查":"回到原文确认关键结论与适用边界"}</small></div></li><li><span>03</span><div><strong>Agent 汇总最终产出</strong><small>根据你的确认更新任务产出和知识地图</small></div></li></ol><div className="task-dialog-actions"><Button variant="outline" onClick={()=>relatedMaterial(task)}><BookOpen/>查看相关材料</Button>{state==="idle"&&<Button onClick={()=>startAgent(task)}><Sparkles/>让 Agent 先整理</Button>}{state==="running"&&<><Button variant="outline" onClick={()=>startHuman(task)}><UserRound/>人工介入</Button><Button disabled><Loader2 className="spin"/>Agent 整理中</Button></>}{state==="review"&&<Button onClick={()=>completeTask(task)}><Check/>完成核查并提交</Button>}</div></div>}
   <p className="prototype-note">任务执行记录将保留输入材料、处理步骤、证据来源和人工确认结果。</p>
  </>}</DialogContent></Dialog>
 </>;
}
export function Reports(p:Props){
 const[busy,setBusy]=useState(false);
 const[artifactBusy,setArtifactBusy]=useState<ResearchArtifact["type"]|null>(null);
 const[view,setView]=useState<"preview"|"edit">("preview");
 const completed=p.tasks.filter(x=>x.done);
 const readyToComplete=p.tasks.length>0&&p.tasks.every(x=>x.done)&&!!p.report&&p.papers.some(x=>x.saved);
 const buildReport=()=>`# ${p.project}

## 摘要

本研究围绕“${p.goal}”组织现有文献、知识证据与阶段任务。当前结果显示，推理机制、过程监督与自我纠错需要在统一模型、数据集、反馈来源和推理预算下比较。本文为阶段性研究稿，关键结论仍需回到论文原文与实验验证。

关键词：可靠推理；过程监督；自我纠错；证据图谱

## 1. 研究问题

${p.goal}

## 2. 相关工作

${p.papers.filter(x=>x.saved).map((x,i)=>`[${i+1}] ${x.title}. ${x.venue}, ${x.year}.\n    ${x.url}`).join("\n")}

## 3. 研究方法与证据组织

基于项目知识地图组织领域共识、观点争议、技术路线与研究空白，并通过研究任务持续核查证据来源和实验条件。

## 4. 阶段结果

${completed.length?completed.map((x,i)=>`4.${i+1} ${x.title}\n    产出：${x.output}${x.completedAt?`；完成于 ${x.completedAt}`:""}`).join("\n"):"当前暂无已完成任务。"}

Figure 1. 可靠推理研究流程与人机协作闭环

Figure 2. 当前研究知识与证据网络

Figure 3. 三类反馈方法的阶段性指标对比（演示数据）

## 5. 讨论与局限

当前材料主要用于建立研究框架。论文原文、实验条件与数值结果仍需进一步核查；未经研究者确认的 Agent 内容不作为最终科研结论。

## 6. 下一步工作

${p.tasks.filter(x=>!x.done).map(x=>`- ${x.title}（${x.owner==="agent"?"Agent 主导":x.owner==="human"?"人主导 · Agent 辅助":"协同推进"}）`).join("\n")||"- 当前没有待推进任务"}

## 参考文献

${p.papers.filter(x=>x.saved).map((x,i)=>`[${i+1}] ${x.title}. ${x.venue}, ${x.year}. ${x.url}`).join("\n")}`;
 function generate(){setBusy(true);setTimeout(()=>{const content=buildReport();const createdAt=new Date().toLocaleString("zh-CN",{hour12:false});const id=Date.now();const version:ReportVersion={id,title:`研究论文稿 v${p.reportHistory.length+1}`,createdAt,content};p.setReport(content);p.setReportUpdatedAt(createdAt);p.setReportHistory(prev=>[version,...prev]);p.setResearchArtifacts(prev=>[{id,type:"report",title:version.title,createdAt},...prev]);setView("preview");setBusy(false);toast.success(p.report?"论文格式报告已更新并保留新版本":"论文格式报告已生成")},650)}
 function generateArtifact(type:ResearchArtifact["type"]){if(type==="report"){generate();return}setArtifactBusy(type);setTimeout(()=>{const createdAt=new Date().toLocaleString("zh-CN",{hour12:false});const titles={report:"研究论文稿",chart:"Figure 1 · 推理方法证据对比",image:"Graphical Abstract · 可靠推理研究框架",video:"Supplementary Video S1 · 方法与研究路径讲解"};p.setResearchArtifacts(prev=>[{id:Date.now(),type,title:titles[type],createdAt},...prev]);setArtifactBusy(null);toast.success(`${titles[type]}已生成并加入成果记录`)},800)}
 function downloadBlob(content:string,type:string,name:string){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}
 function exportName(title:string){return title.replace(/[\\/:*?"<>|]/g,"-")}
 function exportMarkdown(content:string,title:string){downloadBlob(content,"text/markdown;charset=utf-8",`${exportName(title)}.md`)}
 const reportFigures=[assetPath("/report-figures/research-workflow.png"),assetPath("/report-figures/evidence-network.png"),assetPath("/report-figures/feedback-method-comparison.png")];
 function exportFigureAppendix(){return reportFigures.map((src,index)=>`<figure><img src="${new URL(src,window.location.href).href}"/><figcaption>Figure ${index+1}. ${["可靠推理研究流程与人机协作闭环","当前研究知识与证据网络","三类反馈方法的阶段性指标对比（演示数据）"][index]}</figcaption></figure>`).join("")}
 function exportWord(content:string,title:string){const escaped=content.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");const html=`<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,'Microsoft YaHei',sans-serif;margin:48px;color:#263b57;line-height:1.8}pre{white-space:pre-wrap;font:inherit}figure{margin:28px 0;text-align:center;page-break-inside:avoid}img{max-width:100%;height:auto}figcaption{margin-top:8px;color:#66758a;font-size:12px}</style></head><body><pre>${escaped}</pre>${exportFigureAppendix()}</body></html>`;downloadBlob(html,"application/msword;charset=utf-8",`${exportName(title)}.doc`)}
 function exportPdf(content:string,title:string){const win=window.open("","_blank");if(!win){toast.error("浏览器阻止了打印窗口，请允许弹窗后重试");return}win.opener=null;const escaped=content.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${exportName(title)}</title><style>@page{margin:20mm}body{font-family:Arial,'Microsoft YaHei',sans-serif;color:#263b57;line-height:1.8}pre{white-space:pre-wrap;font:inherit}figure{margin:28px 0;text-align:center;page-break-inside:avoid}img{max-width:100%;height:auto}figcaption{margin-top:8px;color:#66758a;font-size:12px}</style></head><body><pre>${escaped}</pre>${exportFigureAppendix()}<script>window.onload=()=>window.print()<\/script></body></html>`);win.document.close()}
 const reportFigure=(src:string,caption:string,index:number)=><figure className="report-figure" key={`figure-${index}`}><img src={src} alt={caption}/><figcaption><strong>Figure {index}.</strong> {caption}{index===3&&<em>演示数据</em>}</figcaption></figure>;
 const preview=p.report.split("\n").map((line,i)=>line.startsWith("# ")?<div className="report-title-block" key={i}><h1>{line.slice(2)}</h1>{reportFigure(reportFigures[0],"可靠推理研究流程与人机协作闭环",1)}</div>:line.startsWith("## ")?<div className="report-section-block" key={i}><h2>{line.slice(3)}</h2>{(line.includes("当前发现")||line.includes("研究方法与证据组织"))&&reportFigure(reportFigures[1],"当前研究知识与证据网络",2)}{(line.includes("下一步工作")||line.includes("阶段结果"))&&reportFigure(reportFigures[2],"三类反馈方法的阶段性指标对比",3)}</div>:line.startsWith("### ")?<h3 key={i}>{line.slice(4)}</h3>:line.startsWith("Figure ")||line.startsWith("Table ")?null:line.startsWith("- ")?<p className="report-bullet" key={i}>{line}</p>:line.startsWith("  ")?<p className="report-indent" key={i}>{line.trim()}</p>:line?<p key={i}>{line}</p>:<div className="report-space" key={i}/>);
 return <>
  <section className={`panel project-finalization ${p.projectCompleted?"completed":""}`}><div className="finalization-copy"><span className="eyebrow">PROJECT COMPLETION</span><h2>{p.projectCompleted?"研究项目已完成并归档":"完成条件与项目归档"}</h2><p>{p.projectCompleted?"最终成果、任务记录和证据版本已锁定，可继续由科研雷达跟踪后续进展。":"当研究任务、核心文献和最终报告准备完成后，可结束本轮研究并保留完整成果版本。"}</p></div><div className="finalization-checks"><span className={p.papers.some(x=>x.saved)?"done":""}><Check size={13}/>核心文献</span><span className={p.tasks.length>0&&p.tasks.every(x=>x.done)?"done":""}><Check size={13}/>研究任务</span><span className={p.report?"done":""}><Check size={13}/>最终报告</span></div><Button disabled={!readyToComplete||p.projectCompleted} onClick={()=>{p.setProjectCompleted(true);toast.success("研究项目已完成，成果版本已归档")}}>{p.projectCompleted?<><Check/>已完成并归档</>:<>确认完成项目<ArrowRight/></>}</Button></section>
  <div className="report-hero panel"><div className="report-symbol"><FileText size={33}/></div><div><h2>把研究积累，整理成论文格式成果</h2><p>主文档、Figure、Graphical Abstract 与补充视频使用统一研究版本和引用关系。</p>{p.reportUpdatedAt&&<span className="report-updated"><Clock3 size={13}/>最后更新：{p.reportUpdatedAt}</span>}</div><Button disabled={busy} onClick={generate}>{busy?<Loader2 className="spin"/>:<Sparkles/>}{busy?"整理中":p.report?"更新报告":"生成报告"}</Button></div>
  <section className="panel multimodal-studio"><div className="section-heading"><div><h2>多模态科研成果</h2><p>借鉴论文主文档与补充材料的组织方式</p></div><span className="tag blue-tag">统一版本</span></div><div className="artifact-types">{[{type:"report" as const,title:"研究论文稿",desc:"摘要、方法、结果、讨论与参考文献",icon:FileText},{type:"chart" as const,title:"Figure / Table",desc:"实验图表、证据比较与规范图注",icon:BarChart3},{type:"image" as const,title:"Graphical Abstract",desc:"研究问题、方法与结论的图形摘要",icon:ImageIcon},{type:"video" as const,title:"Supplementary Video",desc:"方法说明、实验过程与阶段讲解",icon:Video}].map(item=><article className={`artifact-type ${item.type}`} key={item.type}><span><item.icon size={21}/></span><div><strong>{item.title}</strong><p>{item.desc}</p></div><Button variant="outline" disabled={busy||artifactBusy===item.type} onClick={()=>generateArtifact(item.type)}>{artifactBusy===item.type?<Loader2 className="spin"/>:<Plus/>}{item.type==="report"&&p.report?"更新":"生成"}</Button></article>)}</div></section>
  {p.researchArtifacts.length>0&&<section className="artifact-gallery"><div className="section-heading standalone"><h2>成果记录 <span className="sub-count">{p.researchArtifacts.length}</span></h2><span className="mini-meta">图、文、视频关联到同一研究项目</span></div><div className="artifact-grid">{p.researchArtifacts.map(item=><article className="panel artifact-card" key={item.id}><div className={`artifact-preview ${item.type}`}>{item.type==="report"?<><FileText size={34}/><span>MANUSCRIPT</span></>:item.type==="chart"?<><img src={reportFigures[2]} alt="反馈方法对比数据图"/><span>FIGURE 3</span></>:item.type==="image"?<><img src={reportFigures[0]} alt="可靠推理研究流程图"/><span>GRAPHICAL ABSTRACT</span></>:<><span className="video-play"><Play size={21}/></span><em>02:18</em><span>SUPPLEMENTARY VIDEO S1</span></>}</div><div className="artifact-card-body"><span className="tag">{item.type==="report"?"主文档":item.type==="chart"?"Figure / Table":item.type==="image"?"图形摘要":"补充视频"}</span><h3>{item.title}</h3><p>{item.createdAt}</p><button onClick={()=>toast.info(item.type==="report"?"请在下方在线预览论文稿":"成果已生成，可进入详情查看或导出")}>在线预览<ArrowUpRight size={14}/></button></div></article>)}</div></section>}
  {p.report?<div className="report-center"><section className="panel report-document"><div className="report-toolbar"><Tabs value={view} onValueChange={v=>setView(v as "preview"|"edit")}><TabsList className="view-tabs"><TabsTrigger value="preview">在线预览</TabsTrigger><TabsTrigger value="edit">编辑内容</TabsTrigger></TabsList></Tabs><div className="report-export"><span>导出当前版本</span><Button variant="outline" onClick={()=>exportWord(p.report,"SCIMate-阶段研究报告")}><Download/>Word</Button><Button variant="outline" onClick={()=>exportPdf(p.report,"SCIMate-阶段研究报告")}><Download/>PDF</Button><Button variant="outline" onClick={()=>exportMarkdown(p.report,"SCIMate-阶段研究报告")}><Download/>Markdown</Button></div></div>{view==="preview"?<article className="report-online-preview">{preview}</article>:<textarea aria-label="编辑阶段研究报告" value={p.report} onChange={e=>p.setReport(e.target.value)}/>}</section><aside className="panel report-history"><div className="section-heading"><h2>生成记录</h2><span className="tag">{p.reportHistory.length} 个版本</span></div><div className="report-history-list">{p.reportHistory.map((item,index)=><div className={`report-history-item ${p.report===item.content?"active":""}`} key={item.id}><button className="history-select" onClick={()=>{p.setReport(item.content);p.setReportUpdatedAt(item.createdAt);setView("preview")}}><span className="history-index">{String(p.reportHistory.length-index).padStart(2,"0")}</span><div><strong>{item.title}</strong><small>{item.createdAt}</small></div><ChevronRight size={15}/></button><DropdownMenu><DropdownMenuTrigger asChild><button className="history-export" aria-label={`导出 ${item.title}`}><Download size={13}/>导出</button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={()=>exportWord(item.content,item.title)}><FileText/>Word 文档</DropdownMenuItem><DropdownMenuItem onSelect={()=>exportPdf(item.content,item.title)}><FileText/>PDF</DropdownMenuItem><DropdownMenuItem onSelect={()=>exportMarkdown(item.content,item.title)}><FileText/>Markdown</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>)}</div></aside></div>:<section className="panel"><Empty text="还没有研究报告"/><div className="empty-note">点击「生成报告」，整理当前项目材料并创建第一条生成记录。</div></section>}
 </>;
}
export function Empty({text,action,onClick}:{text:string;action?:string;onClick?:()=>void}){return <div className="empty-state"><FolderIcon/><h3>{text}</h3>{action&&<Button variant="outline" onClick={onClick}>{action}</Button>}</div>}
function FolderIcon(){return <BookOpen size={28} strokeWidth={1.3}/>}
