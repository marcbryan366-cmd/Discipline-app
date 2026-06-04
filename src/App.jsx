import { useState, useEffect, useRef, useCallback } from "react";

const QUOTES = [
  "La discipline est le pont entre les objectifs et les accomplissements. — Jim Rohn",
  "Ce n'est pas tomber qui te définit — c'est te relever.",
  "Le succès n'est pas final, l'échec n'est pas fatal : le courage de continuer compte. — Churchill",
  "Les champions sont faits d'un désir profond, d'un rêve, d'une vision. — Ali",
  "La douleur d'aujourd'hui sera la force de demain.",
  "Chaque matin : dormir avec tes rêves ou te lever et les réaliser.",
  "La motivation te fait démarrer. L'habitude te fait continuer. — Jim Ryun",
  "Un homme fort n'est pas celui qui ne tombe jamais, mais celui qui se relève.",
  "Ta vie s'améliore par changement, pas par chance. — Jim Rohn",
  "Sois plus fort que tes excuses.",
  "Le seul mauvais entraînement est celui que tu n'as pas fait.",
  "Chaque jour est une nouvelle chance de changer ta vie.",
  "Discipline égale liberté. — Jocko Willink",
  "Ce que tu fais chaque jour compte plus que ce que tu fais de temps en temps.",
];

const THEMES = [
  { name:"Or",     accent:"#F5A623", dark:"#c47d0e", rgb:"245,166,35"  },
  { name:"Bleu",   accent:"#4FC3F7", dark:"#0288d1", rgb:"79,195,247"  },
  { name:"Vert",   accent:"#66BB6A", dark:"#388e3c", rgb:"102,187,106" },
  { name:"Violet", accent:"#CE93D8", dark:"#7b1fa2", rgb:"206,147,216" },
  { name:"Rose",   accent:"#F48FB1", dark:"#c2185b", rgb:"244,143,177" },
  { name:"Corail", accent:"#FF7043", dark:"#bf360c", rgb:"255,112,67"  },
];

const CAT_COLORS = { etudes:"#4FC3F7",sport:"#FF7043",spirituel:"#FFD54F",relation:"#F48FB1",repos:"#81C784",routine:"#90A4AE",protection:"#CE93D8",autre:"#BCAAA4" };
const CAT_ICONS  = { etudes:"📚",sport:"💪",spirituel:"🙏",relation:"💑",repos:"🎌",routine:"🔄",protection:"🛡️",autre:"📌" };
const CAT_XP     = { etudes:25,sport:30,spirituel:20,relation:15,repos:5,routine:10,protection:15,autre:10 };
const CATEGORIES = ["routine","etudes","sport","spirituel","relation","repos","protection","autre"];
const EMOJIS     = ["📌","📚","💪","🙏","💻","🍽️","😴","🚿","💑","🎌","🚶","📵","🌅","⚡","🎯","📖","🎵","🏃","☕","🧘","✏️","🎨","🎮","🌙","🔥"];
const DAYS_FR    = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const DAYS_SHORT = ["Di","Lu","Ma","Me","Je","Ve","Sa"];
const MONTHS_FR  = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

const FREQ_OPTS = [
  { id:"daily",    label:"Tous les jours",      days:[0,1,2,3,4,5,6] },
  { id:"weekdays", label:"Lundi à Vendredi",    days:[1,2,3,4,5]     },
  { id:"weekend",  label:"Weekend seulement",   days:[0,6]           },
  { id:"custom",   label:"Jours personnalisés", days:[]              },
];

const XP_LEVELS = [
  {level:1, name:"Débutant",   min:0,    max:150  },
  {level:2, name:"Apprenti",   min:150,  max:400  },
  {level:3, name:"Régulier",   min:400,  max:750  },
  {level:4, name:"Sérieux",    min:750,  max:1200 },
  {level:5, name:"Déterminé",  min:1200, max:1800 },
  {level:6, name:"Discipliné", min:1800, max:2600 },
  {level:7, name:"Expert",     min:2600, max:3500 },
  {level:8, name:"Maître",     min:3500, max:4600 },
  {level:9, name:"Champion",   min:4600, max:6000 },
  {level:10,name:"Légende",    min:6000, max:Infinity },
];

const DEFAULT_TASKS = [
  {id:"t1", time:"06:00",emoji:"🌅",title:"Réveil",               sub:"Verre d'eau + prière",             category:"spirituel", freq:"daily",    days:[0,1,2,3,4,5,6]},
  {id:"t2", time:"06:15",emoji:"💪",title:"Sport",                sub:"20 min minimum",                   category:"sport",     freq:"daily",    days:[0,1,2,3,4,5,6]},
  {id:"t3", time:"06:45",emoji:"🚿",title:"Douche + Repas",       sub:"Bien manger pour bien travailler", category:"routine",   freq:"daily",    days:[0,1,2,3,4,5,6]},
  {id:"t4", time:"07:00",emoji:"📚",title:"Révisions matin",      sub:"Matière principale du jour",       category:"etudes",    freq:"daily",    days:[0,1,2,3,4,5,6]},
  {id:"t5", time:"12:00",emoji:"🍽️",title:"Déjeuner + Repos",     sub:"Recharge complète",                category:"routine",   freq:"daily",    days:[0,1,2,3,4,5,6]},
  {id:"t6", time:"14:00",emoji:"📚",title:"Révisions après-midi", sub:"Exercices et annales",             category:"etudes",    freq:"daily",    days:[0,1,2,3,4,5,6]},
  {id:"t7", time:"17:00",emoji:"⏸️",title:"Pause méritée",        sub:"30 min maximum",                  category:"repos",     freq:"daily",    days:[0,1,2,3,4,5,6]},
  {id:"t8", time:"19:00",emoji:"🍽️",title:"Dîner",               sub:"Bien manger",                      category:"routine",   freq:"daily",    days:[0,1,2,3,4,5,6]},
  {id:"t9", time:"21:00",emoji:"📵",title:"Arrêt écrans",         sub:"Mode nuit activé",                 category:"protection",freq:"daily",    days:[0,1,2,3,4,5,6]},
  {id:"t10",time:"21:30",emoji:"🙏",title:"Prière du soir",       sub:"Honnête et simple",               category:"spirituel", freq:"daily",    days:[0,1,2,3,4,5,6]},
  {id:"t11",time:"22:00",emoji:"😴",title:"Dors en paix",         sub:"Téléphone loin du lit",            category:"routine",   freq:"daily",    days:[0,1,2,3,4,5,6]},
];

const ff = "'Sora',system-ui,sans-serif";
const padT = n => String(n).padStart(2,"0");
const dStr = (d=new Date()) => d.toISOString().split("T")[0];
const todaySt = () => dStr();
const nowTime = () => { const n=new Date(); return `${padT(n.getHours())}:${padT(n.getMinutes())}`; };

function getXP(ap,tasks){ let x=0; Object.values(ap).forEach(dc=>Object.keys(dc).forEach(id=>{ const t=tasks.find(x=>x.id===id); if(t) x+=CAT_XP[t.category]||10; })); return x; }
function getLevel(xp){ return XP_LEVELS.find(l=>xp>=l.min&&xp<l.max)||XP_LEVELS[XP_LEVELS.length-1]; }
function getStrength(tid,ap){ let h=0; for(let i=0;i<14;i++){ const d=new Date(); d.setDate(d.getDate()-i); if(ap[dStr(d)]?.[tid]) h++; } const s=Math.round((h/14)*100); if(s===0)return{s,label:"Nouvelle",color:"#444"}; if(s<30)return{s,label:"Fragile",color:"#ef5350"}; if(s<60)return{s,label:"En croissance",color:"#FFD740"}; if(s<85)return{s,label:"Solide",color:"#66BB6A"}; return{s,label:"Imbattable",color:"#00E676"}; }
function isForToday(t){ return (t.days||[0,1,2,3,4,5,6]).includes(new Date().getDay()); }
function isForDay(t,d){ return (t.days||[0,1,2,3,4,5,6]).includes(d.getDay()); }
function pwChecks(p){ return{length:p.length>=8,upper:/[A-Z]/.test(p),lower:/[a-z]/.test(p),number:/[0-9]/.test(p),special:/[^A-Za-z0-9]/.test(p)}; }
function pwScore(p){ return Object.values(pwChecks(p)).filter(Boolean).length; }
function pwLabel(s){ if(s<=1)return["Très faible","#ef5350"]; if(s===2)return["Faible","#FF7043"]; if(s===3)return["Moyen","#FFD740"]; if(s===4)return["Fort","#66BB6A"]; return["Très fort","#00E676"]; }

async function sGet(k){ try{ const r=await window.localStorage.getItem(k); return r?JSON.parse(r):null; }catch{ return null; } }
async function sSet(k,v){ try{ window.localStorage.setItem(k,JSON.stringify(v)); }catch{} }

function injectCSS(){
  if(document.getElementById("dv3")) return;
  const el=document.createElement("style"); el.id="dv3";
  el.textContent=`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
    :root{--acc:#F5A623;--acc-rgb:245,166,35;}
    *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
    body{background:#080808;margin:0;}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    @keyframes bounceIn{0%{transform:scale(0.4);opacity:0}65%{transform:scale(1.12)}85%{transform:scale(0.95)}100%{transform:scale(1);opacity:1}}
    @keyframes modalUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
    @keyframes popIn{0%{transform:scale(1)}40%{transform:scale(1.4)}70%{transform:scale(0.85)}100%{transform:scale(1)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes toast{0%{transform:translateY(-18px);opacity:0}15%{transform:translateY(0);opacity:1}80%{opacity:1}100%{opacity:0}}
    @keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}
    .afd{animation:fadeIn .4s ease both}
    .aup{animation:slideUp .4s ease both}
    .abc{animation:bounceIn .5s cubic-bezier(.34,1.56,.64,1) both}
    .amd{animation:modalUp .35s cubic-bezier(.34,1.26,.64,1) both}
    .apl{animation:pulse 2.5s ease-in-out infinite}
    .apop{animation:popIn .35s ease}
    .asp{animation:spin 1s linear infinite}
    .ash{animation:shimmer 1.8s ease-in-out infinite}
    .ti{animation:toast 4.2s ease forwards}
    .tr{transition:transform .18s ease,opacity .2s ease,border-color .2s ease}
    .tr:hover{transform:translateX(3px)}
    .tr:active{transform:scale(0.975)}
    .bm{transition:transform .15s ease,box-shadow .2s ease}
    .bm:hover{box-shadow:0 6px 24px rgba(var(--acc-rgb),.35)}
    .bm:active{transform:scale(0.965)}
    .bg{transition:all .18s ease}
    .bg:hover{border-color:#444!important;color:#aaa!important}
    .bg:active{transform:scale(0.97)}
    .fab{transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .2s}
    .fab:hover{transform:scale(1.12) rotate(90deg);box-shadow:0 8px 32px rgba(var(--acc-rgb),.5)}
    .fab:active{transform:scale(0.9)}
    .cd{transition:background .2s,transform .15s}
    .cd:hover{transform:scale(1.12)}
    input:focus{border-color:var(--acc)!important;box-shadow:0 0 0 3px rgba(var(--acc-rgb),.18)!important;outline:none}
    ::-webkit-scrollbar{width:3px}
    ::-webkit-scrollbar-thumb{background:#1e1e1e;border-radius:2px}
  `;
  document.head.appendChild(el);
}
function applyTheme(t){ document.documentElement.style.setProperty("--acc",t.accent); document.documentElement.style.setProperty("--acc-rgb",t.rgb); }
const Card = ({children,style={}}) => <div style={{background:"#0f0f0f",border:"1px solid #181818",borderRadius:20,padding:18,...style}}>{children}</div>;
const ST   = ({children,c}) => <div style={{fontSize:11,color:c||"var(--acc)",letterSpacing:2.2,textTransform:"uppercase",fontWeight:700,marginBottom:14}}>{children}</div>;
const Div  = () => <div style={{height:1,background:"#111",margin:"10px 0"}}/>;
const iS   = (x={}) => ({width:"100%",background:"#0a0a0a",border:"1px solid #1e1e1e",borderRadius:13,padding:"12px 15px",color:"#ebebeb",fontSize:14,fontFamily:ff,outline:"none",transition:"border-color .2s,box-shadow .2s",...x});

function Toast({toasts}){
  return <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:999,display:"flex",flexDirection:"column",gap:8,alignItems:"center",pointerEvents:"none",width:"92%",maxWidth:400}}>
    {toasts.map(t=><div key={t.id} className="ti" style={{background:t.bg||"#1a1a1a",border:`1px solid ${t.br||"#2a2a2a"}`,borderRadius:14,padding:"12px 18px",fontSize:13,fontWeight:600,color:t.tc||"#ebebeb",fontFamily:ff,boxShadow:"0 8px 32px rgba(0,0,0,.5)",width:"100%",textAlign:"center"}}>{t.ic} {t.msg}</div>)}
  </div>;
}

function XPBar({xp,accent}){
  const lv=getLevel(xp);
  const nx=XP_LEVELS.find(l=>l.level===lv.level+1);
  const pct=nx?Math.round(((xp-lv.min)/(nx.min-lv.min))*100):100;
  return <div style={{background:"#0a0a0a",border:"1px solid #1a1a1a",borderRadius:14,padding:"11px 14px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:32,height:32,borderRadius:16,background:`${accent}22`,border:`2px solid ${accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:accent}}>{lv.level}</div>
        <div><div style={{fontSize:13,fontWeight:700,color:"#e8e8e8"}}>{lv.name}</div><div style={{fontSize:10,color:"#555"}}>{xp} XP total</div></div>
      </div>
      {nx&&<div style={{fontSize:10,color:"#3a3a3a"}}>{nx.min-xp} XP → Niv.{nx.level}</div>}
    </div>
    <div style={{background:"#161616",borderRadius:999,height:7,overflow:"hidden"}}>
      <div style={{height:"100%",width:pct+"%",background:`linear-gradient(90deg,${accent},${accent}aa)`,borderRadius:999,transition:"width .8s cubic-bezier(.34,1.26,.64,1)"}}/>
    </div>
  </div>;
}

function StrBadge({s}){
  return <div style={{fontSize:9,fontWeight:700,color:s.color,border:`1px solid ${s.color}44`,borderRadius:20,padding:"2px 7px",letterSpacing:.5,flexShrink:0}}>{s.s}%</div>;
}

function PomodoroModal({task,accent,onClose}){
  const WORK=25*60,BRK=5*60;
  const [secs,setSecs]=useState(WORK);
  const [run,setRun]=useState(false);
  const [isWork,setIsWork]=useState(true);
  const [cycles,setCycles]=useState(0);
  const ref=useRef(null);
  useEffect(()=>{
    if(run){ ref.current=setInterval(()=>setSecs(s=>{ if(s<=1){ clearInterval(ref.current); setRun(false); const nw=!isWork; setIsWork(nw); if(!nw)setCycles(c=>c+1); return nw?WORK:BRK; } return s-1; }),1000); }
    else clearInterval(ref.current);
    return()=>clearInterval(ref.current);
  },[run,isWork]);
  const mm=Math.floor(secs/60),ss=secs%60,tot=isWork?WORK:BRK,pct=((tot-secs)/tot)*100,r=54,circ=2*Math.PI*r;
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,backdropFilter:"blur(8px)"}}>
    <div onClick={e=>e.stopPropagation()} className="abc" style={{background:"#0d0d0d",border:"1px solid #1e1e1e",borderRadius:24,padding:"32px 24px",width:"85%",maxWidth:340,textAlign:"center",fontFamily:ff}}>
      <div style={{fontSize:13,color:accent,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>{task.emoji} {task.title}</div>
      <div style={{fontSize:11,color:"#444",marginBottom:24}}>{isWork?"🎯 Travail focus":`☕ Pause — Cycle ${cycles+1}`}</div>
      <div style={{position:"relative",width:130,height:130,margin:"0 auto 24px"}}>
        <svg width="130" height="130" style={{transform:"rotate(-90deg)"}}>
          <circle cx="65" cy="65" r={r} fill="none" stroke="#161616" strokeWidth="8"/>
          <circle cx="65" cy="65" r={r} fill="none" stroke={accent} strokeWidth="8" strokeDasharray={circ} strokeDashoffset={circ-(circ*pct/100)} style={{transition:"stroke-dashoffset .9s ease"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontSize:32,fontWeight:800,color:"#ebebeb",lineHeight:1}}>{padT(mm)}:{padT(ss)}</div>
          <div style={{fontSize:10,color:"#555",marginTop:2}}>{isWork?"FOCUS":"PAUSE"}</div>
        </div>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:14}}>
        <button className="bm" onClick={()=>setRun(r=>!r)} style={{flex:1,background:accent,color:"#000",border:"none",borderRadius:12,padding:"12px 0",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:ff}}>{run?"⏸ Pause":"▶ Démarrer"}</button>
        <button onClick={()=>{setSecs(WORK);setRun(false);setIsWork(true);}} style={{background:"transparent",border:"1px solid #222",borderRadius:12,padding:"12px 16px",fontSize:14,cursor:"pointer",color:"#555"}}>↺</button>
      </div>
      <div style={{fontSize:12,color:"#444"}}>Cycles : <span style={{color:accent,fontWeight:700}}>{cycles}</span></div>
      <button onClick={onClose} style={{marginTop:14,background:"transparent",border:"none",fontSize:12,color:"#333",cursor:"pointer",fontFamily:ff}}>Fermer</button>
    </div>
  </div>;
}

function ChainCalendar({ap,tasks,accent}){
  const now=new Date(),y=now.getFullYear(),m=now.getMonth();
  const dim=new Date(y,m+1,0).getDate();
  const fdow=new Date(y,m,1).getDay();
  let streak=0,cs=0;
  for(let i=0;i<60;i++){ const d=new Date(); d.setDate(d.getDate()-i); const ds=dStr(d); const tt=tasks.filter(t=>isForDay(t,d)); const dc=ap[ds]?Object.keys(ap[ds]).length:0; const p=tt.length?dc/tt.length:0; if(p>=0.5){cs++;}else{if(i>0)break;} } streak=cs;
  let ls=0,cs2=0;
  for(let i=59;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); const ds=dStr(d); const tt=tasks.filter(t=>isForDay(t,d)); const dc=ap[ds]?Object.keys(ap[ds]).length:0; const p=tt.length?dc/tt.length:0; if(p>=0.5){cs2++;ls=Math.max(ls,cs2);}else cs2=0; }
  const days=[]; for(let i=0;i<fdow;i++)days.push(null); for(let d=1;d<=dim;d++)days.push(d);
  const getCol=(day)=>{ if(!day)return"transparent"; const d=new Date(y,m,day); if(d>now)return"#0d0d0d"; const ds=dStr(d); const dc=ap[ds]?Object.keys(ap[ds]).length:0; const tt=tasks.filter(t=>isForDay(t,d)); if(!tt.length)return"#0d0d0d"; const p=dc/tt.length; if(p===0)return"#1a1a1a"; if(p<0.5)return"#2d1a00"; if(p<0.8)return accent+"66"; return accent; };
  return <Card>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><ST c={accent}>🔥 Chaîne de discipline</ST><div style={{fontSize:11,color:"#555"}}>{MONTHS_FR[m]} {y}</div></div>
    <div style={{display:"flex",justifyContent:"space-around",marginBottom:16}}>
      {[["Streak actuel",streak+"j",accent],["Meilleur",ls+"j","#66BB6A"]].map(([lbl,val,c])=>(
        <div key={lbl} style={{textAlign:"center"}}><div style={{fontSize:24,fontWeight:800,color:c}}>{val}</div><div style={{fontSize:10,color:"#444"}}>{lbl}</div></div>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}}>
      {DAYS_SHORT.map(d=><div key={d} style={{textAlign:"center",fontSize:9,color:"#2a2a2a",fontWeight:600}}>{d}</div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
      {days.map((day,i)=>{ const isT=day===now.getDate()&&m===now.getMonth(); return <div key={i} className={day?"cd":""} style={{aspectRatio:"1",borderRadius:6,background:getCol(day),border:isT?`2px solid ${accent}`:"1px solid #0f0f0f",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:day?(isT?accent:"#333"):"transparent",fontWeight:isT?800:400}}>{day||""}</div>; })}
    </div>
    <div style={{display:"flex",gap:10,marginTop:12,fontSize:9,color:"#444",justifyContent:"center"}}>
      {[["#1a1a1a","0%"],[accent+"66","50-79%"],[accent,"80%+"]].map(([c,l])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:9,height:9,borderRadius:2,background:c}}/><span>{l}</span></div>))}
    </div>
  </Card>;
}

function EditModal({task,onSave,onDelete,onClose}){
  const isNew=!task.id;
  const [form,setForm]=useState({id:task.id||"",time:task.time||"08:00",emoji:task.emoji||"📌",title:task.title||"",sub:task.sub||"",category:task.category||"routine",freq:task.freq||"daily",days:task.days||[0,1,2,3,4,5,6]});
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const toggleDay=d=>f("days",form.days.includes(d)?form.days.filter(x=>x!==d):[...form.days,d].sort());
  const selFreq=opt=>{ f("freq",opt.id); if(opt.id!=="custom")f("days",opt.days); };
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:300,backdropFilter:"blur(6px)"}}>
    <div className="amd" onClick={e=>e.stopPropagation()} style={{background:"#0d0d0d",border:"1px solid #1e1e1e",borderRadius:"22px 22px 0 0",padding:"8px 20px 52px",width:"100%",maxWidth:440,maxHeight:"90vh",overflowY:"auto",fontFamily:ff,color:"#ebebeb"}}>
      <div style={{width:40,height:4,background:"#242424",borderRadius:2,margin:"14px auto 20px"}}/>
      <div style={{fontSize:17,fontWeight:700,textAlign:"center",color:"var(--acc)",marginBottom:20}}>{isNew?"✨ Nouvelle tâche":"✏️ Modifier"}</div>
      <div style={{fontSize:11,color:"#555",letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Heure</div>
      <input style={{...iS(),marginBottom:16}} type="time" value={form.time} onChange={e=>f("time",e.target.value)}/>
      <div style={{fontSize:11,color:"#555",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Emoji</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{EMOJIS.map(e=><button key={e} onClick={()=>f("emoji",e)} style={{background:form.emoji===e?"#1c1500":"#0a0a0a",border:`1.5px solid ${form.emoji===e?"var(--acc)":"#1e1e1e"}`,borderRadius:9,padding:"6px 8px",fontSize:18,cursor:"pointer",transition:"all .18s"}}>{e}</button>)}</div>
      <div style={{fontSize:11,color:"#555",letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Titre</div>
      <input style={{...iS(),marginBottom:12}} placeholder="Titre de la tâche" value={form.title} onChange={e=>f("title",e.target.value)}/>
      <div style={{fontSize:11,color:"#555",letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Description</div>
      <input style={{...iS(),marginBottom:16}} placeholder="Description courte" value={form.sub} onChange={e=>f("sub",e.target.value)}/>
      <div style={{fontSize:11,color:"#555",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Catégorie</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{CATEGORIES.map(c=><button key={c} onClick={()=>f("category",c)} style={{background:form.category===c?`${CAT_COLORS[c]}18`:"transparent",border:`1.5px solid ${form.category===c?CAT_COLORS[c]:"#1e1e1e"}`,borderRadius:20,padding:"5px 13px",fontSize:12,fontWeight:form.category===c?700:400,cursor:"pointer",color:form.category===c?CAT_COLORS[c]:"#555",fontFamily:ff,transition:"all .18s"}}>{CAT_ICONS[c]} {c}</button>)}</div>
      <div style={{fontSize:11,color:"#555",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Fréquence</div>
      <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>{FREQ_OPTS.map(opt=><button key={opt.id} onClick={()=>selFreq(opt)} style={{background:form.freq===opt.id?"#1c1500":"transparent",border:`1.5px solid ${form.freq===opt.id?"var(--acc)":"#1e1e1e"}`,borderRadius:12,padding:"10px 14px",fontSize:13,cursor:"pointer",color:form.freq===opt.id?"var(--acc)":"#666",fontFamily:ff,textAlign:"left",fontWeight:form.freq===opt.id?700:400,display:"flex",justifyContent:"space-between",transition:"all .18s"}}><span>{opt.label}</span>{form.freq===opt.id&&<span>✓</span>}</button>)}</div>
      {form.freq==="custom"&&<div style={{marginBottom:16}}><div style={{fontSize:11,color:"#555",marginBottom:8}}>Sélectionne les jours :</div><div style={{display:"flex",gap:6,justifyContent:"center"}}>{DAYS_SHORT.map((d,i)=><button key={i} onClick={()=>toggleDay(i)} style={{width:36,height:36,borderRadius:18,background:form.days.includes(i)?"var(--acc)":"#0a0a0a",border:`1.5px solid ${form.days.includes(i)?"var(--acc)":"#2a2a2a"}`,color:form.days.includes(i)?"#000":"#555",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:ff,transition:"all .22s"}}>{d}</button>)}</div></div>}
      <button className="bm" onClick={()=>form.title.trim()&&onSave(form)} style={{width:"100%",background:"var(--acc)",color:"#000",border:"none",borderRadius:13,padding:14,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:ff}}>{isNew?"➕ Ajouter":"💾 Sauvegarder"}</button>
      {!isNew&&<button onClick={()=>onDelete(task.id)} className="bg" style={{width:"100%",background:"transparent",border:"1px solid #2a1010",borderRadius:13,padding:13,fontSize:13,color:"#ef5350",cursor:"pointer",fontFamily:ff,marginTop:10}}>🗑️ Supprimer</button>}
      <button onClick={onClose} style={{width:"100%",background:"transparent",border:"none",padding:12,fontSize:13,color:"#333",cursor:"pointer",fontFamily:ff,marginTop:4}}>Annuler</button>
    </div>
  </div>;
}

function AuthScreen({onLogin}){
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({name:"",username:"",password:""});
  const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);
  const [showPw,setShowPw]=useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const sc=pwScore(form.password),ch=pwChecks(form.password),[ll,lc]=pwLabel(sc);
  const CI=[["length","8 caractères minimum"],["upper","Majuscule (A-Z)"],["lower","Minuscule (a-z)"],["number","Chiffre (0-9)"],["special","Caractère spécial (!@#...)"]];
  const submit=async()=>{
    setErr(""); setBusy(true);
    const{name,username,password}=form;
    if(!username.trim()||!password.trim()){setErr("Remplis tous les champs.");setBusy(false);return;}
    if(mode==="register"&&sc<3){setErr("Mot de passe trop faible.");setBusy(false);return;}
    const users=await sGet("users")||{};
    if(mode==="register"){
      if(users[username]){setErr("Nom d'utilisateur déjà pris.");setBusy(false);return;}
      users[username]={password,name:name.trim()||username,createdAt:new Date().toISOString().split("T")[0]};
      await sSet("users",users); await sSet(`sched_${username}`,DEFAULT_TASKS); await sSet("cu",username);
      onLogin(username,users[username],DEFAULT_TASKS,THEMES[0]);
    } else {
      if(!users[username]||users[username].password!==password){setErr("Identifiants incorrects.");setBusy(false);return;}
      await sSet("cu",username);
      const t=await sGet(`sched_${username}`)||DEFAULT_TASKS;
      const ti=await sGet(`theme_${username}`)??0;
      onLogin(username,users[username],t,THEMES[ti]||THEMES[0]);
    }
    setBusy(false);
  };
  return <div className="afd" style={{background:"#080808",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:ff,color:"#ebebeb",maxWidth:440,margin:"0 auto"}}>
    <div className="abc" style={{fontSize:56,marginBottom:4}}>🏆</div>
    <div style={{fontSize:28,fontWeight:800,color:"var(--acc)",letterSpacing:6,marginBottom:2}}>DISCIPLINE</div>
    <div style={{fontSize:10,color:"#252525",letterSpacing:3,marginBottom:40,textTransform:"uppercase"}}>Ton programme de vie</div>
    <div className="aup" style={{background:"#0f0f0f",border:"1px solid #191919",borderRadius:24,padding:24,width:"100%",maxWidth:360,boxShadow:"0 24px 80px rgba(0,0,0,.6)"}}>
      <div style={{display:"flex",background:"#080808",borderRadius:14,padding:3,marginBottom:20}}>
        {[["login","Connexion"],["register","S'inscrire"]].map(([m,l])=><button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:"10px 0",borderRadius:11,border:"none",background:mode===m?"var(--acc)":"transparent",color:mode===m?"#000":"#555",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:ff,transition:"all .22s"}}>{l}</button>)}
      </div>
      {mode==="register"&&<input style={{...iS(),marginBottom:12}} placeholder="Ton prénom ou pseudo" value={form.name} onChange={e=>f("name",e.target.value)}/>}
      <input style={{...iS(),marginBottom:12}} placeholder="Nom d'utilisateur" value={form.username} onChange={e=>f("username",e.target.value)} autoCapitalize="none"/>
      <div style={{position:"relative",marginBottom:12}}>
        <input style={{...iS({paddingRight:46})}} type={showPw?"text":"password"} placeholder="Mot de passe" value={form.password} onChange={e=>f("password",e.target.value)}/>
        <button onClick={()=>setShowPw(s=>!s)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",cursor:"pointer",fontSize:16,color:"#555",padding:0}}>{showPw?"🙈":"👁️"}</button>
      </div>
      {mode==="register"&&form.password.length>0&&<div className="aup" style={{background:"#0a0a0a",border:"1px solid #1a1a1a",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:11,color:"#555"}}>Force</span><span style={{fontSize:11,fontWeight:700,color:lc}}>{ll}</span></div>
        <div style={{display:"flex",gap:4,marginBottom:10}}>{[1,2,3,4,5].map(i=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=sc?lc:"#1e1e1e",transition:"background .3s"}}/>)}</div>
        {CI.map(([k,label])=><div key={k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
          <div style={{width:15,height:15,borderRadius:8,background:ch[k]?"#66BB6A":"#1e1e1e",border:`1.5px solid ${ch[k]?"#66BB6A":"#2a2a2a"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#000",fontWeight:700,flexShrink:0,transition:"all .25s"}}>{ch[k]?"✓":""}</div>
          <span style={{fontSize:11,color:ch[k]?"#66BB6A":"#3a3a3a",transition:"color .25s"}}>{label}</span>
        </div>)}
      </div>}
      {err&&<div className="afd" style={{color:"#ef5350",fontSize:12,marginBottom:12,textAlign:"center",padding:8,background:"#1a0808",borderRadius:8}}>{err}</div>}
      <button className="bm" onClick={submit} disabled={busy} style={{width:"100%",background:"var(--acc)",color:"#000",border:"none",borderRadius:13,padding:14,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:ff,opacity:busy?0.6:1}}>
        {busy?"⏳ Chargement...":mode==="login"?"Se connecter →":"Créer mon compte →"}
      </button>
      <div style={{fontSize:11,color:"#333",textAlign:"center",marginTop:12}}>🔒 Tes données sont sauvegardées localement</div>
    </div>
    <div style={{fontSize:10,color:"#1e1e1e",marginTop:30,textAlign:"center",fontStyle:"italic",lineHeight:1.9,maxWidth:260}}>"La discipline est le pont entre les objectifs et les accomplissements."</div>
  </div>;
  }
export default function App(){
  useEffect(()=>injectCSS(),[]);
  const [screen,setScreen]=useState("loading");
  const [username,setUsername]=useState("");
  const [userInfo,setUserInfo]=useState({});
  const [tasks,setTasks]=useState([]);
  const [completed,setCompleted]=useState({});
  const [allProg,setAllProg]=useState({});
  const [theme,setTheme]=useState(THEMES[0]);
  const [tab,setTab]=useState("today");
  const [qIdx,setQIdx]=useState(0);
  const [qVis,setQVis]=useState(true);
  const [editModal,setEditModal]=useState(null);
  const [pomo,setPomo]=useState(null);
  const [aiText,setAiText]=useState("");
  const [aiLoad,setAiLoad]=useState(false);
  const [toasts,setToasts]=useState([]);
  const [celebrate,setCelebrate]=useState(false);
  const [notifOn,setNotifOn]=useState(false);
  const [prevLvl,setPrevLvl]=useState(1);
  const [confirm,setConfirm]=useState(null);

  const now=new Date(),ts=todaySt(),acc=theme.accent;

  const addToast=useCallback((msg,ic="🔔",bg="#1a1a1a",br="#2a2a2a",tc="#ebebeb")=>{
    const id=Date.now(); setToasts(t=>[...t,{id,msg,ic,bg,br,tc}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),4400);
  },[]);

  useEffect(()=>{
    (async()=>{
      const cu=await sGet("cu");
      if(cu){ const users=await sGet("users")||{}; if(users[cu]){ const t=await sGet(`sched_${cu}`)||DEFAULT_TASKS; const ap=await sGet(`prog_${cu}`)||{}; const ti=await sGet(`theme_${cu}`)??0; const th=THEMES[ti]||THEMES[0]; applyTheme(th); setUsername(cu);setUserInfo(users[cu]);setTasks(t);setAllProg(ap);setCompleted(ap[ts]||{});setTheme(th);setPrevLvl(getLevel(getXP(ap,t)).level);setScreen("app");return; } }
      setScreen("auth");
    })();
  },[]);

  useEffect(()=>{ const iv=setInterval(()=>{ setQVis(false); setTimeout(()=>{ setQIdx(i=>(i+1)%QUOTES.length); setQVis(true); },600); },8000); return()=>clearInterval(iv); },[]);

  useEffect(()=>{
    if(!notifOn||screen!=="app") return;
    const todayT=tasks.filter(t=>isForToday(t));
    const check=()=>{ const ct=nowTime(); todayT.forEach(t=>{ if(t.time===ct&&!completed[t.id]) addToast(`${t.emoji} ${t.title} — C'est l'heure !`,"⏰","#0d1a0d","#1a3a1a","#81C784"); }); };
    const iv=setInterval(check,60000); return()=>clearInterval(iv);
  },[notifOn,completed,tasks,screen]);

  const onLogin=(u,info,t,th)=>{ applyTheme(th);setUsername(u);setUserInfo(info);setTasks(t);setAllProg({});setCompleted({});setTheme(th);setPrevLvl(1);setScreen("app"); };
  const onLogout=async()=>{ await sSet("cu","");setScreen("auth");setTab("today");setAiText(""); };

  const toggleTask=async(id)=>{
    const nc={...completed},was=!!nc[id];
    was?delete nc[id]:(nc[id]=true);
    setCompleted(nc);
    const nap={...allProg,[ts]:nc};
    setAllProg(nap);
    await sSet(`prog_${username}`,nap);
    if(!was){
      const t=tasks.find(x=>x.id===id);
      const xpG=CAT_XP[t?.category]||10;
      addToast(`+${xpG} XP — ${t?.emoji} ${t?.title}`,"⚡","#0d1500",`${acc}33`,acc);
      const newXP=getXP(nap,tasks),newLvl=getLevel(newXP).level;
      if(newLvl>prevLvl){ setTimeout(()=>addToast(`🎉 Niveau ${newLvl} ! Tu es ${getLevel(newXP).name}`,"🏆","#1a1500",acc+"55",acc),900); setPrevLvl(newLvl); }
    }
    const todayT=tasks.filter(t=>isForToday(t));
    if(todayT.length&&Object.keys(nc).filter(id=>todayT.find(t=>t.id===id)).length===todayT.length&&!was){ setCelebrate(true); setTimeout(()=>setCelebrate(false),4000); }
  };

  const saveTask=async(t)=>{ let nt=t.id?tasks.map(x=>x.id===t.id?t:x):[...tasks,{...t,id:"t"+Date.now()}]; nt.sort((a,b)=>a.time.localeCompare(b.time)); setTasks(nt);await sSet(`sched_${username}`,nt);setEditModal(null); };
  const delTask=async(id)=>{ const nt=tasks.filter(t=>t.id!==id); setTasks(nt);await sSet(`sched_${username}`,nt);setEditModal(null);setConfirm(null); };
  const chgTheme=async(t,i)=>{ applyTheme(t);setTheme(t);await sSet(`theme_${username}`,i); };
  const resetToday=async()=>{ const nap={...allProg};delete nap[ts]; setCompleted({});setAllProg(nap);await sSet(`prog_${username}`,nap);setConfirm(null);addToast("Progression réinitialisée","🔄","#0d1a0d","#1a3a1a","#81C784"); };
  const resetAll=async()=>{ setCompleted({});setAllProg({});await sSet(`prog_${username}`,{});setPrevLvl(1);setConfirm(null);addToast("Toute la progression effacée","⚠️","#1a0808","#3a1010","#ef5350"); };
  const enNotif=()=>{ setNotifOn(true); if("Notification"in window)Notification.requestPermission(); addToast("Rappels activés !","🔔","#0d1a0d","#1a3a1a","#81C784"); };

  const getAI=async()=>{
    setAiLoad(true);setAiText("");
    try{
      const sched=tasks.map(t=>`${t.time} ${t.title} [${t.category}]`).join("\n");
      const xp=getXP(allProg,tasks),lv=getLevel(xp);
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Tu es APEX, IA spécialisée en Data Science comportementale. Étudiant 19 ans. Niveau ${lv.level} - ${lv.name} (${xp} XP).\nProgramme:\n${sched}\nDonne 4 recommandations numérotées avec emoji, concrètes et motivantes en français. Signe — APEX.`}]})
      });
      if(!res.ok){const e=await res.json().catch(()=>({}));setAiText(`Erreur ${res.status}: ${e?.error?.message||"Réessaie."}`);setAiLoad(false);return;}
      const d=await res.json();
      setAiText(d.content?.map(c=>c.text||"").join("")||"Réponse vide.");
    }catch{setAiText("⚠️ Connexion impossible.");}
    setAiLoad(false);
  };

  const todayT=tasks.filter(t=>isForToday(t));
  const doneC=todayT.filter(t=>completed[t.id]).length;
  const pct=todayT.length?Math.round((doneC/todayT.length)*100):0;
  const pctC=pct>=80?"#66BB6A":pct>=50?acc:"#ef5350";
  const xp=getXP(allProg,tasks),lv=getLevel(xp);
  const wkD=Array.from({length:7},(_,i)=>{ const d=new Date();d.setDate(d.getDate()-(6-i));const ds=dStr(d);const tt=tasks.filter(t=>isForDay(t,d));const dc=allProg[ds]?Object.keys(allProg[ds]).length:0; return{label:DAYS_FR[d.getDay()].slice(0,3),pct:tt.length?Math.round((dc/tt.length)*100):0,isToday:ds===ts}; });

  if(screen==="loading") return <div style={{background:"#080808",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14,fontFamily:ff}}><div className="asp" style={{fontSize:36}}>⚙️</div><div style={{color:"#1e1e1e",letterSpacing:3,fontSize:10,textTransform:"uppercase"}}>Chargement...</div></div>;
  if(screen==="auth") return <AuthScreen onLogin={onLogin}/>;

  return <div className="afd" style={{background:"#080808",minHeight:"100vh",color:"#ebebeb",fontFamily:ff,maxWidth:440,margin:"0 auto",paddingBottom:96,position:"relative"}}>
    <Toast toasts={toasts}/>
    {celebrate&&<div className="abc" style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:440,zIndex:600,background:`linear-gradient(135deg,${acc},${theme.dark})`,padding:"16px 20px",textAlign:"center",fontSize:14,fontWeight:700,color:"#000"}}>🎉 Programme 100% complété — Champion !</div>}

    <div style={{padding:"20px 18px 14px",background:"linear-gradient(180deg,#0d0d0d,#080808)",borderBottom:"1px solid #0f0f0f"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:11,color:"#2e2e2e",letterSpacing:2,textTransform:"uppercase",marginBottom:2}}>Bonjour 👋</div>
          <div style={{fontSize:21,fontWeight:800,color:acc,lineHeight:1}}>{userInfo.name||username}</div>
          <div style={{fontSize:11,color:"#2e2e2e",marginTop:3}}>{DAYS_FR[now.getDay()]} {now.getDate()} {MONTHS_FR[now.getMonth()]} {now.getFullYear()}</div>
        </div>
        <div className="apl" style={{background:"#111",border:`1.5px solid ${acc}30`,borderRadius:24,padding:"8px 16px",textAlign:"center"}}>
          <div style={{fontSize:9,color:"#555",letterSpacing:1}}>NIVEAU</div>
          <div style={{fontSize:22,fontWeight:800,color:acc,lineHeight:1}}>{lv.level}</div>
          <div style={{fontSize:8,color:"#555"}}>{lv.name}</div>
        </div>
      </div>
    </div>

    <div style={{margin:"12px 16px 0",padding:"12px 16px",background:"#0b0b0b",borderRadius:14,border:"1px solid #111",minHeight:56,position:"relative"}}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:`linear-gradient(180deg,${acc},${theme.dark})`,borderRadius:"3px 0 0 3px"}}/>
      <div style={{fontSize:9,color:acc,letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:5,marginLeft:4}}>Citation</div>
      <div style={{fontSize:11,color:"#666",fontStyle:"italic",lineHeight:1.9,marginLeft:4,transition:"opacity .55s ease,transform .55s ease",opacity:qVis?1:0,transform:qVis?"translateY(0)":"translateY(5px)"}}>{QUOTES[qIdx]}</div>
    </div>

    <div style={{padding:"10px 16px 0"}}><XPBar xp={xp} accent={acc}/></div>

    <div style={{background:"#0f0f0f",border:"1px solid #181818",borderRadius:20,margin:"10px 16px",padding:"14px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div><div style={{fontSize:11,color:"#444",letterSpacing:1.5,textTransform:"uppercase"}}>Progression</div><div style={{fontSize:11,color:"#2e2e2e",marginTop:2}}>{doneC}/{todayT.length} tâches</div></div>
        <div style={{fontSize:32,fontWeight:800,color:pctC,lineHeight:1}}>{pct}%</div>
      </div>
      <div style={{background:"#161616",borderRadius:999,height:8,overflow:"hidden"}}>
        <div style={{height:"100%",width:pct+"%",background:`linear-gradient(90deg,${acc},${theme.dark})`,borderRadius:999,transition:"width .7s cubic-bezier(.34,1.26,.64,1)"}}/>
      </div>
    </div>

    <div style={{display:"flex",background:"#090909",borderTop:"1px solid #0f0f0f",borderBottom:"1px solid #0f0f0f",marginBottom:14}}>
      {[["today","📅","Auj."],["chain","🔥","Chaîne"],["week","📊","Stats"],["ai","🤖","APEX"],["settings","⚙️","Compte"]].map(([id,ico,lbl])=>(
        <button key={id} onClick={()=>setTab(id)} style={{flex:1,background:"transparent",border:"none",color:tab===id?acc:"#333",padding:"11px 2px 9px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",borderBottom:tab===id?`2.5px solid ${acc}`:"2.5px solid transparent",fontFamily:ff,transition:"color .2s"}}>
          <span style={{fontSize:18}}>{ico}</span>
          <span style={{fontSize:8,letterSpacing:.5,fontWeight:tab===id?700:400}}>{lbl}</span>
        </button>
      ))}
    </div>

    <div style={{padding:"0 16px"}}>
      {tab==="today"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <ST c={acc}>📋 Tâches du jour</ST>
          <button onClick={()=>setConfirm({msg:"Réinitialiser la progression d'aujourd'hui ?",action:resetToday})} className="bg" style={{background:"transparent",border:"1px solid #1e1e1e",borderRadius:20,padding:"5px 13px",fontSize:11,color:"#444",cursor:"pointer",fontFamily:ff}}>🔄 Reset</button>
        </div>
        {todayT.length===0&&<div style={{textAlign:"center",color:"#2a2a2a",padding:"50px 20px"}}><div style={{fontSize:44,marginBottom:12}}>📋</div><div style={{fontSize:12}}>Aucune tâche pour aujourd'hui</div></div>}
        {todayT.map((t,i)=>{
          const s=getStrength(t.id,allProg),done=!!completed[t.id],xpG=CAT_XP[t.category]||10;
          return <div key={t.id} className="tr aup" style={{background:"#0d0d0d",border:`1px solid ${done?"#1e3a1e":"#141414"}`,borderLeft:`3.5px solid ${CAT_COLORS[t.category]||acc}`,borderRadius:15,padding:"12px 8px 12px 12px",display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:8,opacity:done?0.4:1,animationDelay:`${i*0.03}s`}} onClick={()=>toggleTask(t.id)}>
            <div style={{fontSize:11,color:acc,fontWeight:700,minWidth:42,fontVariantNumeric:"tabular-nums"}}>{t.time}</div>
            <div style={{fontSize:19,minWidth:24,textAlign:"center"}}>{t.emoji}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,textDecoration:done?"line-through":"none",color:done?"#444":"#e8e8e8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</div>
              <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}>
                {t.sub&&<div style={{fontSize:10,color:"#3a3a3a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{t.sub}</div>}
                <StrBadge s={s}/>
                <div style={{fontSize:9,color:"#444",flexShrink:0}}>+{xpG}XP</div>
              </div>
            </div>
            <div className={done?"apop":""} style={{width:23,height:23,borderRadius:12,border:`2px solid ${done?acc:"#242424"}`,background:done?acc:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#000",flexShrink:0,transition:"all .25s",fontWeight:700}}>{done?"✓":""}</div>
            <button onClick={e=>{e.stopPropagation();setPomo(t);}} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:13,padding:"2px 4px",color:"#333",flexShrink:0}}>⏱️</button>
            <button onClick={e=>{e.stopPropagation();setEditModal(t);}} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:13,padding:"2px 4px",color:"#333",flexShrink:0}}>✏️</button>
          </div>;
        })}
        {tasks.filter(t=>!isForToday(t)).length>0&&<div style={{textAlign:"center",fontSize:10,color:"#2a2a2a",padding:"6px 0"}}>{tasks.filter(t=>!isForToday(t)).length} tâche(s) non programmées aujourd'hui</div>}
      </div>}

      {tab==="chain"&&<div className="afd" style={{display:"flex",flexDirection:"column",gap:14}}>
        <ChainCalendar ap={allProg} tasks={tasks} accent={acc}/>
        <Card>
          <ST c={acc}>💪 Force des habitudes</ST>
          {tasks.map(t=>{ const s=getStrength(t.id,allProg); return <div key={t.id} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <div style={{fontSize:12,color:"#c8c8c8",display:"flex",gap:6,alignItems:"center"}}><span>{t.emoji}</span><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:150}}>{t.title}</span></div>
              <div style={{fontSize:11,fontWeight:700,color:s.color,flexShrink:0}}>{s.label}</div>
            </div>
            <div style={{background:"#161616",borderRadius:999,height:5,overflow:"hidden"}}><div style={{height:"100%",width:s.s+"%",background:s.color,borderRadius:999,transition:"width .6s ease"}}/></div>
          </div>; })}
        </Card>
      </div>}

      {tab==="week"&&<div className="afd" style={{display:"flex",flexDirection:"column",gap:14}}>
        <Card>
          <ST c={acc}>📊 7 derniers jours</ST>
          <div style={{display:"flex",gap:5,alignItems:"flex-end",justifyContent:"center",padding:"8px 0 6px"}}>
            {wkD.map((d,i)=><div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <span style={{fontSize:9,color:"#555"}}>{d.pct}%</span>
              <div style={{width:36,height:Math.max(5,d.pct*.85),background:d.isToday?acc:d.pct>=80?"#4caf50":d.pct>=50?"#2d5a27":"#161616",borderRadius:6,transition:"height .5s"}}/>
              <span style={{fontSize:9,color:d.isToday?acc:"#3a3a3a",fontWeight:d.isToday?700:400}}>{d.label}</span>
            </div>)}
          </div>
        </Card>
        <Card>
          <ST c={acc}>🏆 Statistiques</ST>
          <div style={{display:"flex",justifyContent:"space-around"}}>
            {[[xp+" XP","Total",acc],[lv.name,"Rang","#CE93D8"],[wkD.filter(d=>d.pct>=50).length+"j","Bons jours","#66BB6A"]].map(([val,lbl,c])=><div key={lbl} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:c}}>{val}</div><div style={{fontSize:10,color:"#555",marginTop:2}}>{lbl}</div></div>)}
          </div>
        </Card>
        <Card>
          <ST c={acc}>💬 Citations</ST>
          {QUOTES.map((q,i)=><div key={i} style={{padding:"9px 0",borderBottom:"1px solid #0f0f0f",fontSize:11,color:"#666",lineHeight:1.8}}><span style={{color:acc,fontWeight:700,marginRight:6}}>{i+1}.</span>{q}</div>)}
        </Card>
      </div>}

      {tab==="ai"&&<div className="afd" style={{display:"flex",flexDirection:"column",gap:14}}>
        <Card>
          <div style={{fontSize:40,textAlign:"center",marginBottom:8}}>🤖</div>
          <ST c={acc}>APEX — Intelligence Artificielle</ST>
          <div style={{fontSize:12,color:"#555",lineHeight:1.9,marginBottom:16}}>APEX analyse ton programme ({tasks.length} tâches · Niv.{lv.level} · {xp} XP) via la neuroscience cognitive.</div>
          <button className="bm" onClick={getAI} disabled={aiLoad} style={{width:"100%",background:acc,color:"#000",border:"none",borderRadius:13,padding:14,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:ff,opacity:aiLoad?0.6:1}}>
            <span className={aiLoad?"ash":""}>{aiLoad?"⏳ Analyse...":"🚀 Analyser mon programme"}</span>
          </button>
        </Card>
        {aiText&&<div className="aup" style={{background:"#091409",border:"1px solid #1a3a1a",borderRadius:20,padding:18}}><ST c="#66BB6A">💡 Recommandations d'APEX</ST><div style={{fontSize:13,color:"#cccccc",lineHeight:1.95,whiteSpace:"pre-wrap"}}>{aiText}</div></div>}
        <Card>
          <ST c={acc}>📈 Score du jour</ST>
          <div style={{textAlign:"center",padding:"12px 0"}}>
            <div style={{fontSize:56,fontWeight:800,color:pctC,lineHeight:1}}>{pct}%</div>
            <div style={{fontSize:12,color:"#555",marginTop:8}}>{pct===100?"🏆 Parfait !":pct>=80?"💪 Excellent !":pct>=50?"😊 Continue !":"⚡ Accroche-toi !"}</div>
          </div>
        </Card>
      </div>}

      {tab==="settings"&&<div className="afd" style={{display:"flex",flexDirection:"column",gap:14}}>
        <Card>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:52,height:52,borderRadius:26,background:`${acc}18`,border:`2.5px solid ${acc}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>👤</div>
            <div><div style={{fontSize:19,fontWeight:800,color:acc}}>{userInfo.name||username}</div><div style={{fontSize:11,color:"#3a3a3a"}}>@{username}</div><div style={{fontSize:10,color:"#2a2a2a",marginTop:2}}>Depuis {userInfo.createdAt||"..."}</div></div>
          </div>
          <div style={{display:"flex",justifyContent:"space-around"}}>
            {[["Niv."+lv.level,"Niveau",acc],[xp+"XP","XP Total","#CE93D8"],[tasks.length,"Tâches","#66BB6A"]].map(([v,l,c])=><div key={l} style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:10,color:"#3a3a3a"}}>{l}</div></div>)}
          </div>
        </Card>
        <Card>
          <ST c={acc}>🎨 Couleur de l'app</ST>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            {THEMES.map((t,i)=><div key={i} style={{textAlign:"center"}}>
              <button onClick={()=>chgTheme(t,i)} style={{width:44,height:44,borderRadius:22,background:t.accent,border:`3px solid ${theme.accent===t.accent?"#fff":"transparent"}`,cursor:"pointer",display:"block",marginBottom:4,boxShadow:theme.accent===t.accent?`0 0 16px ${t.accent}70`:"none",transition:"all .25s"}}/>
              <span style={{fontSize:9,color:theme.accent===t.accent?t.accent:"#444",fontWeight:theme.accent===t.accent?700:400}}>{t.name}</span>
            </div>)}
          </div>
        </Card>
                <Card>
          <ST c={acc}>🔔 Rappels</ST>
          <div style={{fontSize:12,color:"#555",lineHeight:1.8,marginBottom:14}}>Reçois une notification à l'heure de chaque tâche non complétée.</div>
          <button className="bm" onClick={()=>{setTab("today");setEditModal({id:"",time:"08:00",emoji:"📌",title:"",sub:"",category:"routine",freq:"daily",days:[0,1,2,3,4,5,6]});}} style={{width:"100%",background:acc,color:"#000",border:"none",borderRadius:13,padding:13,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:ff}}>+ Ajouter une tâche</button>
        </Card>
        <Card>
          <ST c={acc}>🔄 Réinitialisation</ST>
          <button onClick={()=>setConfirm({msg:"Réinitialiser aujourd'hui ?",action:resetToday})} className="bg" style={{width:"100%",background:"transparent",border:"1px solid #0d2a0d",borderRadius:13,padding:13,fontSize:13,color:"#4caf50",cursor:"pointer",fontFamily:ff,marginBottom:10}}>🔄 Réinitialiser aujourd'hui</button>
          <button onClick={()=>setConfirm({msg:"⚠️ Effacer TOUTE la progression ?",action:resetAll})} className="bg" style={{width:"100%",background:"transparent",border:"1px solid #2a0d0d",borderRadius:13,padding:13,fontSize:13,color:"#ef5350",cursor:"pointer",fontFamily:ff}}>⚠️ Effacer toute la progression</button>
        </Card>
        <button onClick={onLogout} className="bg" style={{width:"100%",background:"transparent",border:"1px solid #141414",borderRadius:13,padding:13,fontSize:13,color:"#333",cursor:"pointer",fontFamily:ff,marginBottom:6}}>Se déconnecter</button>
      </div>}
    {tab==="today"&&<button className="fab" onClick={()=>setEditModal({id:"",time:"08:00",emoji:"📌",title:"",sub:"",category:"routine",freq:"daily",days:[0,1,2,3,4,5,6]})} style={{position:"fixed",bottom:26,right:22,width:56,height:56,borderRadius:28,background:acc,color:"#000",border:"none",fontSize:30,fontWeight:200,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 6px 28px rgba(var(--acc-rgb),.45)`,zIndex:100}}>+</button>}

    {editModal&&<EditModal task={editModal} onSave={saveTask} onDelete={(id)=>setConfirm({msg:"Supprimer cette tâche ?",action:()=>delTask(id)})} onClose={()=>setEditModal(null)}/>}
    {pomo&&<PomodoroModal task={pomo} accent={acc} onClose={()=>setPomo(null)}/>}

    {confirm&&<div onClick={()=>setConfirm(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,backdropFilter:"blur(6px)",padding:24}}>
      <div className="abc" onClick={e=>e.stopPropagation()} style={{background:"#0f0f0f",border:"1px solid #222",borderRadius:20,padding:28,width:"100%",maxWidth:340,fontFamily:ff,textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:14}}>⚠️</div>
        <div style={{fontSize:14,color:"#e8e8e8",lineHeight:1.7,marginBottom:24}}>{confirm.msg}</div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setConfirm(null)} className="bg" style={{flex:1,background:"transparent",border:"1px solid #2a2a2a",borderRadius:12,padding:13,fontSize:13,color:"#666",cursor:"pointer",fontFamily:ff}}>Annuler</button>
          <button onClick={confirm.action} style={{flex:1,background:"#ef5350",color:"#fff",border:"none",borderRadius:12,padding:13,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:ff}}>Confirmer</button>
        </div>
      </div>
          </div>}
      
    </div>
  );
};

export default App; 
                                                                    
