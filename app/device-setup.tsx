"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Box, Check, ChevronRight, Cpu, KeyRound, LockKeyhole, MessageCircle, Phone, Radio, ScanLine, ShieldCheck, Wifi, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type SetupStage = "auth" | "device" | "channels" | "complete" | null;

type Channel = {
  id: string;
  name: string;
  description: string;
  logo: string;
  recommended?: boolean;
};

const channels: Channel[] = [
  { id:"wechat", name:"微信", description:"接收研究进展、雷达热点，并可直接向科研 Agent 提问。", logo:"/channels/wechat.svg", recommended:true },
  { id:"feishu", name:"飞书", description:"将报告、任务和提醒推送到个人或科研协作群。", logo:"/channels/feishu.svg", recommended:true },
  { id:"qq", name:"QQ", description:"通过私聊或群聊查看任务状态并继续研究对话。", logo:"/channels/qq.svg" },
  { id:"wecom", name:"企业微信", description:"面向实验室或团队同步研究任务与阶段成果。", logo:"/channels/wecom.svg" },
];

const DEVICE_PATTERN=/^SM-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export function SCIMateBoxSetup({stage,onStageChange,onFinish,authenticated,accountPhone,onAuthenticated,deviceBound,deviceName,onDeviceBound,connectedChannels,onChannelsChange}:{
  stage:SetupStage;
  onStageChange:(stage:SetupStage)=>void;
  onFinish?:()=>void;
  authenticated:boolean;
  accountPhone:string;
  onAuthenticated:(phone:string)=>void;
  deviceBound:boolean;
  deviceName:string;
  onDeviceBound:(name:string)=>void;
  connectedChannels:string[];
  onChannelsChange:(channels:string[])=>void;
}) {
  const [phone,setPhone]=useState(accountPhone||"13800138000");
  const [verificationCode,setVerificationCode]=useState("123456");
  const [codeSent,setCodeSent]=useState(true);
  const [deviceCode,setDeviceCode]=useState("SM-7A21-9K3M");
  const [activationCode,setActivationCode]=useState("SCIMATE-2026");
  const [name,setName]=useState(deviceName||"实验室 SCIMate 盒子");
  const [selectedChannels,setSelectedChannels]=useState<string[]>(connectedChannels);
  const [channelCredentials,setChannelCredentials]=useState<Record<string,{appId:string;appSecret:string}>>({});
  const [configuringChannel,setConfiguringChannel]=useState<string|null>(null);
  const phoneValid=/^1\d{10}$/.test(phone);
  const codeValid=/^\d{6}$/.test(verificationCode);
  const deviceCodeValid=DEVICE_PATTERN.test(deviceCode);
  const canBind=deviceCodeValid&&activationCode.trim().length>=6&&name.trim().length>0;
  const activeChannel=channels.find(channel=>channel.id===configuringChannel);
  const activeCredential=configuringChannel?channelCredentials[configuringChannel]||{appId:"",appSecret:""}:{appId:"",appSecret:""};
  const activeCredentialValid=Boolean(activeCredential.appId.trim()&&activeCredential.appSecret.trim());

  if(!stage)return null;

  const discoverDevice=()=>{
    setDeviceCode("SM-7A21-9K3M");
    setActivationCode("SCIMATE-2026");
    setName("实验室 SCIMate 盒子");
  };
  const bindDevice=()=>{
    if(!canBind)return;
    onDeviceBound(name.trim());
    onStageChange("channels");
  };
  const updateCredential=(id:string,key:"appId"|"appSecret",value:string)=>setChannelCredentials(current=>({...current,[id]:{appId:current[id]?.appId||"",appSecret:current[id]?.appSecret||"",[key]:value}}));
  const connectChannel=()=>{
    if(!configuringChannel||!activeCredentialValid)return;
    const next=selectedChannels.includes(configuringChannel)?selectedChannels:[...selectedChannels,configuringChannel];
    setSelectedChannels(next);
    onChannelsChange(next);
    setConfiguringChannel(null);
  };
  const finishChannels=()=>{
    onChannelsChange(selectedChannels);
    onStageChange("complete");
  };
  const finishSetup=()=>{onStageChange(null);onFinish?.()};
  const currentStep=stage==="auth"?1:stage==="device"?2:stage==="channels"?3:4;
  const maskedPhone=phoneValid?`${phone.slice(0,3)} **** ${phone.slice(-4)}`:"手机号账户";

  return <div className={`scimate-box-setup ${stage==="auth"?"auth-layout":"modal-layout"}`} role="dialog" aria-modal="true" aria-labelledby="scimate-box-setup-title">
    <div className="setup-ambient setup-ambient-one"/><div className="setup-ambient setup-ambient-two"/>
    {stage==="auth"&&<aside className="setup-story">
      <div className="setup-brand"><img src="/scimate-brand-mark.png" alt=""/><span>SCI<strong>Mate</strong></span></div>
      <div className="setup-story-copy"><span className="setup-kicker"><Radio size={15}/>SCIMATE BOX · RESEARCH NODE</span><h1>让科研 Agent<br/>真正持续运行</h1><p>SCIMate 盒子承载本地知识、自动任务与 24 小时科研雷达。绑定后，你可以从网页或常用通信工具随时调用它。</p></div>
      <div className="setup-security"><ShieldCheck size={17}/><span><strong>数据由盒子本地处理</strong><small>通道凭证保存在设备中，可随时解除绑定</small></span></div>
    </aside>}

    <main className="setup-panel">
      {stage!=="auth"&&<header className="setup-panel-header">
        <div className="setup-progress" aria-label={`设置进度：第 ${currentStep} 步，共 4 步`}>{["登录注册","绑定设备","连接通道","开始研究"].map((label,index)=>{const step=index+1;return <span className={step<currentStep?"done":step===currentStep?"current":""} key={label}><i>{step<currentStep?<Check size={12}/>:step}</i><em>{label}</em></span>})}</div>
        {authenticated&&<button className="setup-close" aria-label="关闭设备与通道设置" onClick={()=>onStageChange(null)}><X size={20}/></button>}
      </header>}

      {stage==="auth"&&<section className="setup-content auth-step">
        <div className="setup-heading"><span className="setup-step-icon auth-icon"><Phone size={23}/></span><div><h2 id="scimate-box-setup-title">手机号登录 / 注册</h2><p>首次登录将自动创建 SCIMate 账户，已有账户会直接进入原有研究空间。</p></div></div>
        <form className="auth-form" onSubmit={event=>{event.preventDefault();if(!phoneValid||!codeValid)return;onAuthenticated(phone);onStageChange(null)}}>
          <label><span>手机号</span><div className="setup-input-row"><Input type="tel" inputMode="numeric" autoComplete="tel" value={phone} onChange={event=>setPhone(event.target.value.replace(/\D/g,"").slice(0,11))} placeholder="请输入手机号" maxLength={11}/><Phone className="input-decoration" size={17}/></div><small>用于登录、找回账户和接收重要安全提醒</small></label>
          <label><span>短信验证码</span><div className="verification-row"><div className="setup-input-row"><Input inputMode="numeric" autoComplete="one-time-code" value={verificationCode} onChange={event=>setVerificationCode(event.target.value.replace(/\D/g,"").slice(0,6))} placeholder="6 位验证码" maxLength={6}/><KeyRound className="input-decoration" size={17}/></div><button type="button" disabled={!phoneValid} onClick={()=>{setCodeSent(true);setVerificationCode("123456")}}>{codeSent?"重新获取":"获取验证码"}</button></div><small aria-live="polite">{codeSent?`演示验证码已自动填入 · ${maskedPhone}`:"验证码 5 分钟内有效，支持系统自动填充"}</small></label>
          <Button type="submit" disabled={!phoneValid||!codeValid}>登录并继续<ArrowRight/></Button>
          <p className="auth-terms">未注册手机号将自动创建账户。登录即代表同意《服务协议》和《隐私政策》。</p>
        </form>
      </section>}

      {stage==="device"&&<section className="setup-content device-step">
        <div className="setup-heading"><span className="setup-step-icon"><Box size={23}/></span><div><small>第 2 步，共 4 步</small><h2 id="scimate-box-setup-title">{deviceBound?"SCIMate 盒子已连接":"绑定你的 SCIMate 盒子"}</h2><p>{deviceBound?"设备在线并正在承载科研 Agent。":"现在绑定可开启本地知识、自动任务和 24 小时科研雷达，也可以稍后处理。"}</p></div></div>
        {deviceBound?<div className="bound-device-card"><span className="bound-device-icon"><Cpu size={28}/><i/></span><div><small>当前设备</small><strong>{deviceName}</strong><p><span><Wifi size={13}/>在线</span><span>设备码 SM-7A21-9K3M</span><span>本地存储正常</span></p></div><span className="device-status-tag"><Check size={13}/>已绑定</span></div>:<form className="device-bind-form" onSubmit={event=>{event.preventDefault();bindDevice()}}>
          <div className="device-discovery"><span><Wifi size={18}/><span><strong>同一网络下可自动发现设备</strong><small>确保 SCIMate 盒子已开机并连接当前网络</small></span></span><button type="button" onClick={discoverDevice}><ScanLine size={16}/>自动发现</button></div>
          <label><span>设备码</span><div className="setup-input-row"><Input value={deviceCode} onChange={event=>setDeviceCode(event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g,"").slice(0,12))} placeholder="SM-XXXX-XXXX" maxLength={12} aria-invalid={deviceCode.length>0&&!deviceCodeValid}/>{deviceCodeValid&&<Check className="input-valid" size={17}/>}</div><small className={deviceCode.length>0&&!deviceCodeValid?"field-error":""}>{deviceCode.length>0&&!deviceCodeValid?"设备码格式应为 SM-XXXX-XXXX":"设备码位于盒子底部铭牌或包装卡片"}</small></label>
          <label><span>激活码</span><div className="setup-input-row"><Input type="password" value={activationCode} onChange={event=>setActivationCode(event.target.value)} placeholder="输入设备激活码" autoComplete="new-password"/><LockKeyhole className="input-decoration" size={17}/></div><small>激活码仅用于本次绑定，不会上传到通信通道</small></label>
          <label><span>设备名称</span><Input value={name} onChange={event=>setName(event.target.value)} placeholder="例如：实验室 SCIMate 盒子" maxLength={30}/></label>
          <div className="setup-footer-actions device-bind-actions"><Button type="button" variant="outline" onClick={finishSetup}>稍后绑定</Button><Button type="submit" disabled={!canBind}>绑定设备并继续<ArrowRight/></Button></div>
        </form>}
        {deviceBound&&<div className="setup-footer-actions"><Button variant="outline" onClick={()=>{setDeviceCode("");setActivationCode("");onDeviceBound("")}}>重新绑定</Button><Button onClick={()=>onStageChange("channels")}>管理通信通道<ArrowRight/></Button></div>}
      </section>}

      {stage==="channels"&&<section className="setup-content channel-step">
        <button className="setup-back" onClick={()=>configuringChannel?setConfiguringChannel(null):onStageChange("device")}><ArrowLeft size={16}/>{configuringChannel?"返回通道列表":"设备信息"}</button>
        <div className="setup-heading"><span className="setup-step-icon channel-icon"><MessageCircle size={23}/></span><div><small>第 3 步，共 4 步</small><h2 id="scimate-box-setup-title">{activeChannel?`配置${activeChannel.name}`:"选择通信通道"}</h2><p>{activeChannel?"填写该通道的应用凭证，验证成功后再配置其他通道。":"每次选择并配置一个通道，连接成功后可继续添加其他通道。"}</p></div></div>
        <div className="channel-privacy"><ShieldCheck size={16}/><span>授权由对应平台完成，账号凭证只保存在 {deviceName||"SCIMate 盒子"} 中。</span></div>
        {!activeChannel?<><div className="channel-grid">{channels.map(channel=>{const connected=selectedChannels.includes(channel.id);return <button type="button" className={`setup-channel-card ${connected?"selected":""}`} key={channel.id} onClick={()=>setConfiguringChannel(channel.id)}><span className="channel-logo"><img src={channel.logo} alt=""/></span><span className="channel-copy"><span><strong>{channel.name}</strong>{channel.recommended&&<em>推荐</em>}</span><small>{channel.description}</small></span><span className="channel-select-state">{connected?<><Check size={14}/>已连接</>:<>配置<ChevronRight size={14}/></>}</span></button>})}</div><div className="setup-channel-summary"><span><strong>{selectedChannels.length}</strong> 个通道已连接</span><small>点击任一通道进入独立配置</small></div><div className="setup-footer-actions"><Button variant="outline" onClick={()=>{if(!selectedChannels.length)onChannelsChange([]);onStageChange("complete")}}>{selectedChannels.length?"稍后继续配置":"暂不连接"}</Button><Button onClick={finishChannels}>{selectedChannels.length?"完成通道设置":"跳过并继续"}<ArrowRight/></Button></div></>:<div className="single-channel-setup"><div className="single-channel-profile"><span className="channel-logo"><img src={activeChannel.logo} alt=""/></span><div><strong>{activeChannel.name}</strong><p>{activeChannel.description}</p></div>{selectedChannels.includes(activeChannel.id)&&<span className="device-status-tag"><Check size={13}/>已连接</span>}</div><div className="channel-credential-list"><div className="credential-heading"><strong>应用连接凭证</strong><small>请从 {activeChannel.name} 开放平台获取</small></div><div className="channel-credential single"><label><span>AppID</span><Input value={activeCredential.appId} onChange={event=>updateCredential(activeChannel.id,"appId",event.target.value)} placeholder={`请输入${activeChannel.name} AppID`} autoComplete="off"/></label><label><span>AppSecret</span><div className="setup-input-row"><Input type="password" value={activeCredential.appSecret} onChange={event=>updateCredential(activeChannel.id,"appSecret",event.target.value)} placeholder={`请输入${activeChannel.name} AppSecret`} autoComplete="new-password"/><LockKeyhole className="input-decoration" size={15}/></div></label></div></div><div className="setup-footer-actions"><Button variant="outline" onClick={()=>setConfiguringChannel(null)}>取消</Button><Button onClick={connectChannel} disabled={!activeCredentialValid}>验证并连接 {activeChannel.name}<ArrowRight/></Button></div></div>}
      </section>}

      {stage==="complete"&&<section className="setup-content complete-step">
        <div className="setup-complete-mark"><Check size={34}/></div><span className="setup-kicker">SCIMATE BOX READY</span><h2 id="scimate-box-setup-title">科研工作空间已准备完成</h2><p>{deviceName||"SCIMate 盒子"} 已在线，科研 Agent 可以开始持续检索、分析和执行研究任务。</p>
        <div className="setup-ready-grid"><div><span><Cpu size={19}/></span><small>运行设备</small><strong>{deviceName||"SCIMate 盒子"}</strong><em><i/>在线运行</em></div><div><span><MessageCircle size={19}/></span><small>通信通道</small><strong>{connectedChannels.length?`${connectedChannels.length} 个已连接`:"暂未连接"}</strong><em>{connectedChannels.length?channels.filter(channel=>connectedChannels.includes(channel.id)).map(channel=>channel.name).join(" · "):"可稍后配置"}</em></div></div>
        <div className="setup-agent-route"><span><MessageCircle size={17}/>微信 / QQ / 飞书</span><i/><span><Box size={17}/>SCIMate 盒子</span><i/><span><Cpu size={17}/>科研 Agent</span></div>
        <Button onClick={finishSetup}>进入科研工作空间<ArrowRight/></Button>
      </section>}
    </main>
  </div>;
}
