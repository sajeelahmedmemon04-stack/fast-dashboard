import { useState, useEffect, useRef } from "react";

const TT = [
  { day:"Monday",    code:"CS2004", short:"FSE",    name:"Software Engineering",      time:"08:00-08:50", room:"D-28",         teacher:"Sania Urooj",       color:"#059669" },
  { day:"Monday",    code:"MT1008", short:"MVC",    name:"Multivariable Calculus",     time:"10:45-11:35", room:"D-28",         teacher:"Urooj",             color:"#d97706" },
  { day:"Monday",    code:"SS1015", short:"PST",    name:"Pakistan Studies",           time:"11:40-12:30", room:"D-22",         teacher:"Fatheia Khan",      color:"#0891b2" },
  { day:"Monday",    code:"SS2012", short:"TBW",    name:"Tech & Business Writing",    time:"14:25-15:15", room:"D-22",         teacher:"Javeria Ali Wadho", color:"#7c3aed" },
  { day:"Tuesday",   code:"MT2005", short:"P&S",    name:"Probability & Statistics",   time:"08:00-08:50", room:"D-23",         teacher:"Syed Ashad",        color:"#dc2626" },
  { day:"Tuesday",   code:"CS2001", short:"DS",     name:"Data Structures",            time:"08:55-09:45", room:"D-26",         teacher:"Shafique Rehman",   color:"#2563eb" },
  { day:"Tuesday",   code:"SS2012", short:"TBW",    name:"Tech & Business Writing",    time:"10:45-11:35", room:"D-24",         teacher:"Javeria Ali Wadho", color:"#7c3aed" },
  { day:"Tuesday",   code:"MT1008", short:"MVC",    name:"Multivariable Calculus",     time:"12:35-13:25", room:"E-32",         teacher:"Urooj",             color:"#d97706" },
  { day:"Tuesday",   code:"CS2004", short:"FSE",    name:"Software Engineering",       time:"14:25-15:15", room:"D-25",         teacher:"Sania Urooj",       color:"#059669" },
  { day:"Wednesday", code:"SS2012", short:"TBW",    name:"Tech & Business Writing",    time:"08:55-09:45", room:"C-18",         teacher:"Javeria Ali Wadho", color:"#7c3aed" },
  { day:"Wednesday", code:"CS2004", short:"FSE",    name:"Software Engineering",       time:"09:50-10:40", room:"C-19",         teacher:"Sania Urooj",       color:"#059669" },
  { day:"Wednesday", code:"MT2005", short:"P&S",    name:"Probability & Statistics",   time:"12:35-13:25", room:"E-31",         teacher:"Syed Ashad",        color:"#dc2626" },
  { day:"Thursday",  code:"MT1008", short:"MVC",    name:"Multivariable Calculus",     time:"08:00-08:50", room:"D-26",         teacher:"Urooj",             color:"#d97706" },
  { day:"Thursday",  code:"CS2001", short:"DS",     name:"Data Structures",            time:"08:55-09:45", room:"E-31",         teacher:"Shafique Rehman",   color:"#2563eb" },
  { day:"Thursday",  code:"CS2001", short:"DS",     name:"Data Structures",            time:"09:50-10:40", room:"E-31",         teacher:"Shafique Rehman",   color:"#2563eb" },
  { day:"Thursday",  code:"CL2001", short:"DS Lab", name:"Data Structures Lab",        time:"13:30-14:20", room:"LAB-1 Blk I", teacher:"Izzah Salam",       color:"#1d4ed8" },
  { day:"Friday",    code:"MT2005", short:"P&S",    name:"Probability & Statistics",   time:"11:40-12:30", room:"D-23",         teacher:"Syed Ashad",        color:"#dc2626" },
];

const COURSES = [
  { code:"CS2001", name:"Data Structures",          short:"DS",     color:"#2563eb" },
  { code:"CL2001", name:"DS Lab",                   short:"DS Lab", color:"#1d4ed8" },
  { code:"CS2004", name:"Software Engineering",     short:"FSE",    color:"#059669" },
  { code:"MT1008", name:"Multivariable Calculus",   short:"MVC",    color:"#d97706" },
  { code:"MT2005", name:"Probability & Statistics", short:"P&S",    color:"#dc2626" },
  { code:"SS1015", name:"Pakistan Studies",         short:"PST",    color:"#0891b2" },
  { code:"SS2012", name:"Tech & Business Writing",  short:"TBW",    color:"#7c3aed" },
];

const WDAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

// Notes removed from NAV
const NAV = [
  { id:"dashboard",   label:"Dashboard",    icon:"▦" },
  { id:"timetable",   label:"Timetable",    icon:"⊞" },
  { id:"daily",       label:"Today",        icon:"☐" },
  { id:"assignments", label:"Assignments",  icon:"✎" },
  { id:"exams",       label:"Exam Planner", icon:"◈" },
  { id:"revision",    label:"Revision Log", icon:"↺" },
  { id:"projects",    label:"Projects",     icon:"⊙" },
];

function useLS(key, init) {
  const [v, sv] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, sv];
}

const isoToday  = () => new Date().toISOString().slice(0, 10);
const dayName   = () => ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
const nowMin    = () => { const d = new Date(); return d.getHours()*60+d.getMinutes(); };
const tStart    = s => { const p=s.split("-")[0].replace(":-",":"); const [h,m]=p.split(":").map(Number); return h*60+(m||0); };
const tEnd      = s => { const p=(s.replace(":-",":").split("-")[1]||s.split("-")[0]); const [h,m]=p.split(":").map(Number); return h*60+(m||0); };
const fmtD      = d => d ? new Date(d+"T00:00").toLocaleDateString("en-PK",{day:"numeric",month:"short"}) : "";
const dLeft     = d => d ? Math.ceil((new Date(d+"T00:00")-new Date())/86400000) : null;
const uid       = () => Math.random().toString(36).slice(2,9);

function weekMon(dateStr) {
  const d = new Date(dateStr+"T00:00");
  const day = d.getDay();
  const diff = day===0 ? -6 : 1-day;
  const m = new Date(d); m.setDate(d.getDate()+diff);
  return m.toISOString().slice(0,10);
}

const LT = {
  bg:"#f7f6f3",card:"#ffffff",border:"#ede9e4",border2:"#ddd8d2",
  t1:"#1a1a2e",t2:"#4a4a6a",t3:"#888",t4:"#bbb",
  nav:"#1a1a2e",navT:"#ffffff",navH:"#f1ede8",
  inp:"#ffffff",inpB:"#ddd8d2",
  bpBg:"#1a1a2e",bpT:"#ffffff",bsBg:"#f1ede8",bsT:"#1a1a2e",
  row:"#faf9f7",div:"#f0ece6",hdr:"#ffffff",side:"#ffffff",
};
const DK = {
  bg:"#0d0d1a",card:"#161628",border:"#252542",border2:"#303055",
  t1:"#e8e6ff",t2:"#9896cc",t3:"#6664aa",t4:"#404070",
  nav:"#5b5bd6",navT:"#ffffff",navH:"#1a1a32",
  inp:"#0d0d1a",inpB:"#252542",
  bpBg:"#5b5bd6",bpT:"#ffffff",bsBg:"#1a1a32",bsT:"#9896cc",
  row:"#1a1a32",div:"#1e1e38",hdr:"#161628",side:"#161628",
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [mNav, setMNav] = useState(false);
  const [dark, setDark] = useLS("fa_dark", false);
  const T = dark ? DK : LT;

  const [assignments, setAssignments] = useLS("fa_asgn3",  []);
  const [tasks,       setTasks]       = useLS("fa_tasks3", []);
  const [examPlans,   setExamPlans]   = useLS("fa_expl3",  []);
  const [examTasks,   setExamTasks]   = useLS("fa_exts3",  []);
  const [revisions,   setRevisions]   = useLS("fa_revs3",  []);
  const [projects,    setProjects]    = useLS("fa_proj3",  []);
  const [studyLog,    setStudyLog]    = useLS("fa_study3", []);

  const sh = { T, assignments,setAssignments, tasks,setTasks, examPlans,setExamPlans,
    examTasks,setExamTasks, revisions,setRevisions, projects,setProjects,
    studyLog,setStudyLog };

  const PAGES = {
    dashboard:   <Dashboard   {...sh} setPage={setPage} />,
    timetable:   <Timetable   T={T} />,
    daily:       <Daily       {...sh} />,
    assignments: <Assignments {...sh} />,
    exams:       <Exams       {...sh} />,
    revision:    <Revision    {...sh} />,
    projects:    <Projects    {...sh} />,
  };

  const css = `
*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${T.border2};border-radius:4px}
input,select,textarea{font-family:inherit;font-size:14px;border:1.5px solid ${T.inpB};border-radius:9px;padding:9px 12px;outline:none;background:${T.inp};width:100%;color:${T.t1};transition:border-color .15s}
input:focus,select:focus,textarea:focus{border-color:${T.bpBg}}
button{font-family:inherit;cursor:pointer;border:none}
.sb{width:212px;min-width:212px;background:${T.side};border-right:1px solid ${T.border};display:flex;flex-direction:column;flex-shrink:0}
.msb{display:none;position:fixed;top:0;left:-220px;height:100%;transition:left .25s;z-index:201;flex-direction:column}
.msb.open{left:0}
.nb{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;width:100%;text-align:left;font-size:14px;color:${T.t2};background:transparent;font-weight:500;transition:background .12s;margin-bottom:1px}
.nb:hover{background:${T.navH}}
.nb.on{background:${T.nav};color:${T.navT}}
.card{background:${T.card};border-radius:14px;border:1px solid ${T.border};padding:18px}
.bp{background:${T.bpBg};color:${T.bpT};border-radius:9px;padding:9px 16px;font-size:14px;font-weight:600;transition:opacity .15s;white-space:nowrap}
.bp:hover{opacity:.82}
.bs{background:${T.bsBg};color:${T.bsT};border-radius:9px;padding:9px 16px;font-size:14px;font-weight:500;white-space:nowrap}
.bs:hover{filter:brightness(.95)}
.bg{background:transparent;color:${T.t3};border-radius:8px;padding:5px 9px;font-size:13px}
.bg:hover{background:${T.navH}}
.bdg{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap}
.st{font-size:11px;font-weight:700;color:${T.t3};letter-spacing:.9px;text-transform:uppercase;margin-bottom:10px}
.scroll{height:100%;overflow-y:auto;padding:22px}
.pt{background:${T.border};border-radius:10px;height:5px;overflow:hidden}
.pf{height:100%;border-radius:10px;transition:width .4s}
.ov{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:100;display:flex;align-items:center;justify-content:center;padding:14px}
.modal{background:${T.card};border-radius:16px;padding:22px;width:100%;max-width:480px;max-height:88vh;overflow-y:auto;border:1px solid ${T.border}}
.chk{width:16px;height:16px;accent-color:${T.bpBg};cursor:pointer;flex-shrink:0}
.ibt{background:${T.bsBg};border:none;border-radius:8px;width:34px;height:34px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:17px;color:${T.t2}}
.mob{display:none}
@media(max-width:700px){
  .sb:not(.msb){display:none}
  .msb{display:flex}
  .mob{display:flex!important}
  .scroll{padding:14px}
  .g2{grid-template-columns:1fr!important}
}`;

  return (
    <div style={{display:"flex",height:"100svh",background:T.bg,fontFamily:"'DM Sans','Segoe UI',sans-serif",overflow:"hidden",color:T.t1}}>
      <style>{css}</style>
      <aside className="sb"><SBar T={T} page={page} setPage={setPage} dark={dark} setDark={setDark}/></aside>
      {mNav&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:200}} onClick={()=>setMNav(false)}/>}
      <aside className={`sb msb ${mNav?"open":""}`}><SBar T={T} page={page} setPage={p=>{setPage(p);setMNav(false);}} dark={dark} setDark={setDark}/></aside>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        <header style={{padding:"11px 18px",background:T.hdr,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <button className="ibt mob" onClick={()=>setMNav(true)}>☰</button>
          <span style={{fontWeight:700,fontSize:16,color:T.t1}}>{NAV.find(n=>n.id===page)?.label}</span>
          <span style={{marginLeft:"auto",fontSize:12,color:T.t3}}>{new Date().toLocaleDateString("en-PK",{weekday:"short",day:"numeric",month:"short"})}</span>
        </header>
        <div style={{flex:1,overflow:"hidden"}}>{PAGES[page]}</div>
      </div>
    </div>
  );
}

function SBar({T,page,setPage,dark,setDark}) {
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",padding:"16px 12px 12px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
        <div style={{width:36,height:36,background:T.nav,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:13,flexShrink:0}}>SA</div>
        <div>
          <div style={{fontWeight:700,fontSize:13,color:T.t1}}>Sajeel Ahmed</div>
          <div style={{fontSize:10,color:T.t3}}>BCY-4A · FAST Karachi</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {NAV.map(n=>(
          <button key={n.id} className={`nb ${page===n.id?"on":""}`} onClick={()=>setPage(n.id)}>
            <span style={{width:20,textAlign:"center",fontSize:13}}>{n.icon}</span>{n.label}
          </button>
        ))}
      </div>
      <div style={{borderTop:`1px solid ${T.border}`,paddingTop:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:11,color:T.t4}}>Spring 2026</span>
        <button onClick={()=>setDark(d=>!d)} style={{background:T.bsBg,border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:16,color:T.t2}}>{dark?"☀":"🌙"}</button>
      </div>
    </div>
  );
}

// ─── DASHBOARD (no DSA counter) ───
function Dashboard({T,assignments,tasks,examPlans,studyLog,setStudyLog,setPage}) {
  const [logH,setLogH]=useState("");
  const td=isoToday();
  const todayH=studyLog.filter(l=>l.date===td).reduce((a,b)=>a+b.hours,0);
  const wk=weekMon(td);
  const wkEntries=studyLog.filter(l=>weekMon(l.date)===wk);
  const byDay={};
  wkEntries.forEach(l=>{byDay[l.date]=(byDay[l.date]||0)+l.hours;});
  const wkDays=Object.keys(byDay).sort();
  const wkTotal=wkDays.reduce((a,d)=>a+byDay[d],0);
  const wkAvg=wkDays.length?(wkTotal/wkDays.length).toFixed(1):"0.0";
  const allWeeks={};
  studyLog.forEach(l=>{const w=weekMon(l.date);allWeeks[w]=(allWeeks[w]||0)+l.hours;});
  const pastWeeks=Object.entries(allWeeks).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,5);
  const pending=assignments.filter(a=>!a.completed).length;
  const todayT=tasks.filter(t=>t.date===td);
  const doneT=todayT.filter(t=>t.completed).length;
  const upExams=examPlans.filter(e=>{const d=dLeft(e.date);return d!=null&&d>=0&&d<=7;}).length;
  const todayCls=TT.filter(c=>c.day===dayName()).sort((a,b)=>tStart(a.time)-tStart(b.time));
  const nm=nowMin();
  let live=null,next=null;
  for(const c of todayCls){if(nm>=tStart(c.time)&&nm<=tEnd(c.time)){live=c;break;}}
  if(!live) next=todayCls.find(c=>tStart(c.time)>nm);
  const deadlines=[
    ...assignments.filter(a=>!a.completed&&a.dueDate).map(a=>({label:a.title,date:a.dueDate,type:"Assignment",c:"#2563eb"})),
    ...examPlans.map(e=>({label:e.subject+" "+e.type,date:e.date,type:"Exam",c:"#dc2626"})),
  ].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5);
  function log(){const h=parseFloat(logH);if(isNaN(h)||h<=0)return;setStudyLog(p=>[...p,{id:uid(),date:td,hours:h}]);setLogH("");}
  return (
    <div className="scroll">
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:18}}>
        {[
          {label:"Today's Study",  val:todayH.toFixed(1)+"h", color:"#2563eb"},
          {label:"Today's Tasks",  val:`${doneT}/${todayT.length}`, color:"#059669"},
          {label:"Pending Asgn",   val:pending, color:"#d97706"},
          {label:"Exams ≤7 days",  val:upExams, color:"#dc2626"},
        ].map(s=>(
          <div key={s.label} className="card" style={{textAlign:"center",padding:"13px 8px"}}>
            <div style={{fontSize:26,fontWeight:700,color:s.color}}>{s.val}</div>
            <div style={{fontSize:11,color:T.t3,marginTop:3}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}} className="g2">
        <div className="card">
          <div className="st">Log Study Hours (Today)</div>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <input type="number" min="0" step="0.5" placeholder="e.g. 1.5" value={logH} onChange={e=>setLogH(e.target.value)} onKeyDown={e=>e.key==="Enter"&&log()}/>
            <button className="bp" style={{padding:"9px 14px"}} onClick={log}>Log</button>
          </div>
          <div className="st">This Week</div>
          {wkDays.length===0
            ? <div style={{fontSize:13,color:T.t4}}>No entries yet this week</div>
            : <>
                {wkDays.map(d=>(
                  <div key={d} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:T.t2,padding:"4px 0",borderBottom:`1px solid ${T.div}`}}>
                    <span>{fmtD(d)}</span><span style={{fontWeight:700,color:T.t1}}>{byDay[d].toFixed(1)}h</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:12,color:T.t3}}>
                  <span>Total: <b style={{color:T.t1}}>{wkTotal.toFixed(1)}h</b></span>
                  <span>Avg/day: <b style={{color:T.t1}}>{wkAvg}h</b></span>
                </div>
              </>
          }
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {pastWeeks.length>0 && (
            <div className="card">
              <div className="st">Weekly History</div>
              {pastWeeks.map(([wk,h])=>(
                <div key={wk} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.t2,padding:"4px 0",borderBottom:`1px solid ${T.div}`}}>
                  <span>Wk of {fmtD(wk)}</span><span style={{fontWeight:700,color:T.t1}}>{h.toFixed(1)}h</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div className="st" style={{marginBottom:0}}>Today — {dayName()}</div>
          <button className="bg" onClick={()=>setPage("timetable")}>Full →</button>
        </div>
        {todayCls.length===0
          ? <div style={{color:T.t4,textAlign:"center",padding:"16px 0",fontSize:14}}>No classes today 🎉</div>
          : <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {todayCls.map((c,i)=>{
                const isL=live?.time===c.time&&live?.code===c.code;
                const isN=!live&&next?.time===c.time&&next?.code===c.code;
                return (
                  <div key={i} style={{flex:"1 1 148px",background:isL?c.color+"22":T.row,border:`1.5px solid ${isL?c.color:T.border}`,borderRadius:12,padding:"10px 13px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span style={{fontSize:12,fontWeight:700,color:c.color}}>{c.short}</span>
                      {isL&&<span className="bdg" style={{background:"#dcfce7",color:"#166534",fontSize:10}}>LIVE</span>}
                      {isN&&<span className="bdg" style={{background:"#fef9c3",color:"#713f12",fontSize:10}}>NEXT</span>}
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:T.t1,marginBottom:2}}>{c.time}</div>
                    <div style={{fontSize:11,color:T.t3}}>{c.room} · {c.teacher}</div>
                  </div>
                );
              })}
            </div>
        }
      </div>

      <div className="card">
        <div className="st">Upcoming Deadlines</div>
        {deadlines.length===0
          ? <div style={{color:T.t4,textAlign:"center",padding:"14px 0",fontSize:13}}>All clear!</div>
          : deadlines.map((d,i)=>{
              const dl=dLeft(d.date);
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.div}`}}>
                  <span className="bdg" style={{background:d.c+"18",color:d.c,minWidth:80,justifyContent:"center"}}>{d.type}</span>
                  <span style={{flex:1,fontSize:13,color:T.t1}}>{d.label}</span>
                  <span style={{fontSize:12,fontWeight:700,color:dl<=2?"#ef4444":dl<=5?"#f59e0b":T.t3}}>
                    {dl==null?"?":dl<0?"Overdue":dl===0?"Today!":dl+"d"}
                  </span>
                </div>
              );
            })
        }
      </div>
    </div>
  );
}

// ─── TIMETABLE ───
function Timetable({T}) {
  const [view,setView]=useState("today");
  const td=dayName(); const nm=nowMin();
  function status(c) {
    if(c.day!==td) return null;
    if(nm>=tStart(c.time)&&nm<=tEnd(c.time)) return "live";
    const fut=TT.filter(x=>x.day===td&&tStart(x.time)>nm).sort((a,b)=>tStart(a.time)-tStart(b.time));
    if(fut[0]?.time===c.time&&fut[0]?.code===c.code) return "next";
    return null;
  }
  return (
    <div className="scroll">
      <div style={{display:"flex",gap:8,marginBottom:18,alignItems:"center",flexWrap:"wrap"}}>
        {["today","week"].map(v=>(
          <button key={v} className={view===v?"bp":"bs"} style={{fontSize:13}} onClick={()=>setView(v)}>{v==="today"?"Today":"Full Week"}</button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <span className="bdg" style={{background:"#dcfce7",color:"#166634"}}>Live</span>
          <span className="bdg" style={{background:"#fef9c3",color:"#713f12"}}>Next</span>
        </div>
      </div>
      {view==="today"?(
        <>
          <div style={{fontWeight:700,fontSize:15,color:T.t1,marginBottom:14}}>{td}</div>
          {TT.filter(c=>c.day===td).sort((a,b)=>tStart(a.time)-tStart(b.time)).map((c,i)=>{
            const st=status(c);
            return (
              <div key={i} className="card" style={{marginBottom:10,borderLeft:`4px solid ${c.color}`,background:st==="live"?c.color+"15":T.card}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,fontSize:15,color:T.t1}}>{c.name}</span>
                      {st==="live"&&<span className="bdg" style={{background:"#dcfce7",color:"#166534"}}>LIVE NOW</span>}
                      {st==="next"&&<span className="bdg" style={{background:"#fef9c3",color:"#713f12"}}>UP NEXT</span>}
                    </div>
                    <div style={{fontSize:13,color:T.t3}}>{c.time} · {c.room} · {c.teacher}</div>
                  </div>
                  <span className="bdg" style={{background:c.color+"20",color:c.color}}>{c.short}</span>
                </div>
              </div>
            );
          })}
          {TT.filter(c=>c.day===td).length===0&&<div className="card" style={{textAlign:"center",color:T.t4,padding:"36px 0"}}>No classes today!</div>}
        </>
      ):(
        <div>
          {WDAYS.map(day=>{
            const dc=TT.filter(c=>c.day===day).sort((a,b)=>tStart(a.time)-tStart(b.time));
            return (
              <div key={day} style={{marginBottom:20}}>
                <div style={{fontWeight:700,fontSize:12,color:day===td?T.nav:T.t3,marginBottom:8,textTransform:"uppercase",letterSpacing:".6px"}}>{day}{day===td?" — Today":""}</div>
                {dc.length===0?<div style={{fontSize:13,color:T.t4}}>No classes</div>:(
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {dc.map((c,i)=>{
                      const st=status(c);
                      return (
                        <div key={i} style={{background:st==="live"?c.color:c.color+"1a",border:`1.5px solid ${c.color}44`,borderRadius:10,padding:"10px 13px",minWidth:135,flex:"0 0 auto"}}>
                          <div style={{fontSize:11,fontWeight:700,color:st==="live"?"#fff":c.color,marginBottom:2}}>{c.short}{st==="live"?" ● LIVE":st==="next"?" ◎ NEXT":""}</div>
                          <div style={{fontSize:13,fontWeight:700,color:st==="live"?"#fff":T.t1,marginBottom:2}}>{c.time}</div>
                          <div style={{fontSize:11,color:st==="live"?"rgba(255,255,255,.75)":T.t3}}>{c.room}</div>
                          <div style={{fontSize:11,color:st==="live"?"rgba(255,255,255,.55)":T.t4}}>{c.teacher}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── DAILY PLANNER ───
// Shows: manual tasks, exam planner tasks, assignment chunks, project tasks — all due today
function Daily({T,tasks,setTasks,examTasks,assignments,setAssignments,projects,setProjects}) {
  const [form,setForm]=useState({title:"",course:"",type:"task"});
  const td=isoToday();

  // manual tasks for today
  const todayT=tasks.filter(t=>t.date===td);
  // exam tasks due today
  const todayET=(examTasks||[]).filter(t=>t.date===td&&!t.completed);
  // assignment chunks due today
  const todayChunks=[];
  (assignments||[]).filter(a=>!a.completed).forEach(a=>{
    (a.chunks||[]).filter(ch=>ch.date===td&&!ch.completed).forEach(ch=>{
      todayChunks.push({...ch, assignmentTitle:a.title, course:a.course, assignmentId:a.id});
    });
  });
  // project tasks due today
  const todayProjTasks=[];
  (projects||[]).forEach(proj=>{
    (proj.tasks||[]).filter(t=>t.deadline===td&&!t.completed).forEach(t=>{
      todayProjTasks.push({...t, projectName:proj.name, course:proj.course, projectId:proj.id});
    });
  });

  const doneManual=todayT.filter(t=>t.completed).length;
  const total=todayT.length+todayET.length+todayChunks.length+todayProjTasks.length;
  const doneAll=doneManual+todayET.filter(t=>t.completed).length+todayChunks.filter(c=>c.completed).length+todayProjTasks.filter(t=>t.completed).length;
  const pct=total===0?0:Math.round(doneAll/total*100);

  function add(){if(!form.title.trim())return;setTasks(p=>[...p,{...form,id:uid(),completed:false,date:td}]);setForm({title:"",course:"",type:"task"});}
  function toggle(id){setTasks(p=>p.map(t=>t.id===id?{...t,completed:!t.completed}:t));}
  function del(id){setTasks(p=>p.filter(t=>t.id!==id));}
  function toggleChunk(assignmentId,chunkId){
    setAssignments(p=>p.map(a=>a.id!==assignmentId?a:{...a,chunks:a.chunks.map(c=>c.id===chunkId?{...c,completed:!c.completed}:c)}));
  }
  function toggleProjTask(projectId,taskId){
    setProjects(p=>p.map(x=>x.id!==projectId?x:{...x,tasks:x.tasks.map(t=>t.id===taskId?{...t,completed:!t.completed}:t)}));
  }

  return (
    <div className="scroll">
      <div className="card" style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontWeight:700,fontSize:15,color:T.t1}}>Today's Progress</span>
          <span style={{fontSize:13,color:T.t3}}>{doneAll}/{total} · {pct}%</span>
        </div>
        <div className="pt"><div className="pf" style={{width:pct+"%",background:pct===100?"#059669":T.bpBg}}/></div>
      </div>

      {/* Exam planner tasks due today */}
      {todayET.length>0&&(
        <div className="card" style={{marginBottom:12,borderLeft:"4px solid #dc2626"}}>
          <div className="st">Exam Planner — Due Today</div>
          {todayET.map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`1px solid ${T.div}`}}>
              <span className="bdg" style={{background:"#fee2e2",color:"#dc2626"}}>{t.subject}</span>
              <span style={{flex:1,fontSize:14,color:T.t1}}>{t.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Assignment chunks due today */}
      {todayChunks.length>0&&(
        <div className="card" style={{marginBottom:12,borderLeft:"4px solid #d97706"}}>
          <div className="st">Assignment Chunks — Due Today</div>
          {todayChunks.map((ch,i)=>{
            const co=COURSES.find(c=>c.short===ch.course);
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${T.div}`,opacity:ch.completed?.55:1}}>
                <input type="checkbox" className="chk" checked={ch.completed} onChange={()=>toggleChunk(ch.assignmentId,ch.id)}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,color:T.t1,textDecoration:ch.completed?"line-through":"none"}}>{ch.title||"(unlabelled chunk)"}</div>
                  <div style={{fontSize:11,color:T.t3}}>{ch.assignmentTitle}</div>
                </div>
                {co&&<span className="bdg" style={{background:co.color+"20",color:co.color}}>{co.short}</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Project tasks due today */}
      {todayProjTasks.length>0&&(
        <div className="card" style={{marginBottom:12,borderLeft:"4px solid #7c3aed"}}>
          <div className="st">Project Tasks — Due Today</div>
          {todayProjTasks.map((t,i)=>{
            const co=COURSES.find(c=>c.short===t.course);
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${T.div}`,opacity:t.completed?.55:1}}>
                <input type="checkbox" className="chk" checked={t.completed} onChange={()=>toggleProjTask(t.projectId,t.id)}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,color:T.t1,textDecoration:t.completed?"line-through":"none"}}>{t.title}</div>
                  <div style={{fontSize:11,color:T.t3}}>{t.projectName}{t.assignee?" · "+t.assignee:""}</div>
                </div>
                {co&&<span className="bdg" style={{background:co.color+"20",color:co.color}}>{co.short}</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Add manual task */}
      <div className="card" style={{marginBottom:14}}>
        <div className="st">Add Task</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <input placeholder="Task description..." value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} style={{flex:"2 1 150px"}} onKeyDown={e=>e.key==="Enter"&&add()}/>
          <select value={form.course} onChange={e=>setForm(p=>({...p,course:e.target.value}))} style={{flex:"1 1 90px"}}>
            <option value="">Course</option>
            {COURSES.map(c=><option key={c.code} value={c.short}>{c.short}</option>)}
          </select>
          <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={{flex:"1 1 90px"}}>
            {["task","revision","assignment","lab","reading"].map(t=><option key={t}>{t}</option>)}
          </select>
          <button className="bp" onClick={add}>Add</button>
        </div>
      </div>

      {/* Manual tasks */}
      <div className="card">
        <div className="st">My Tasks — {fmtD(td)}</div>
        {todayT.length===0&&<div style={{color:T.t4,textAlign:"center",padding:"22px 0",fontSize:14}}>No manual tasks yet</div>}
        {todayT.map(t=>{
          const co=COURSES.find(c=>c.short===t.course);
          return (
            <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${T.div}`,opacity:t.completed?.55:1}}>
              <input type="checkbox" className="chk" checked={t.completed} onChange={()=>toggle(t.id)}/>
              <span style={{flex:1,fontSize:14,textDecoration:t.completed?"line-through":"none",color:t.completed?T.t3:T.t1}}>{t.title}</span>
              {co&&<span className="bdg" style={{background:co.color+"20",color:co.color}}>{co.short}</span>}
              <span className="bdg" style={{background:T.bsBg,color:T.t3}}>{t.type}</span>
              <button className="bg" style={{color:"#ef4444"}} onClick={()=>del(t.id)}>×</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ASSIGNMENTS ───
// Chunks: editable label + manually set deadline
function Assignments({T,assignments,setAssignments,tasks,setTasks}) {
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({title:"",course:"",dueDate:"",description:"",chunks:3});
  const [exp,setExp]=useState(null);

  function add() {
    if(!form.title||!form.dueDate) return;
    const id=uid();
    // Create chunks with EMPTY title and EMPTY date — user sets both themselves
    const chunks=Array.from({length:form.chunks},(_,i)=>{
      const cid=uid();
      // also add to tasks with empty title/date — user will fill in
      setTasks(p=>[...p,{id:cid,title:"",course:form.course,type:"assignment",date:"",completed:false}]);
      return {id:cid,title:"",date:"",completed:false};
    });
    setAssignments(p=>[...p,{...form,id,completed:false,chunks,created:isoToday()}]);
    setForm({title:"",course:"",dueDate:"",description:"",chunks:3});
    setModal(false);
  }

  function editLabel(aId,cId,title){
    setAssignments(p=>p.map(a=>a.id!==aId?a:{...a,chunks:a.chunks.map(c=>c.id===cId?{...c,title}:c)}));
    setTasks(p=>p.map(t=>t.id===cId?{...t,title}:t));
  }
  function editDate(aId,cId,date){
    setAssignments(p=>p.map(a=>a.id!==aId?a:{...a,chunks:a.chunks.map(c=>c.id===cId?{...c,date}:c)}));
    setTasks(p=>p.map(t=>t.id===cId?{...t,date}:t));
  }
  function toggleChunk(aId,cId){setAssignments(p=>p.map(a=>a.id!==aId?a:{...a,chunks:a.chunks.map(c=>c.id===cId?{...c,completed:!c.completed}:c)}));}

  const active=assignments.filter(a=>!a.completed);
  const done=assignments.filter(a=>a.completed);

  return (
    <div className="scroll">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <button className="bp" onClick={()=>setModal(true)}>+ New Assignment</button>
      </div>

      {modal&&(
        <div className="ov" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div style={{fontWeight:700,fontSize:17,marginBottom:18,color:T.t1}}>New Assignment</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Assignment title" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/>
              <select value={form.course} onChange={e=>setForm(p=>({...p,course:e.target.value}))}>
                <option value="">Select course</option>
                {COURSES.map(c=><option key={c.code} value={c.short}>{c.name}</option>)}
              </select>
              <div style={{display:"flex",gap:8}}>
                <div style={{flex:1}}><label style={{fontSize:12,color:T.t3,display:"block",marginBottom:4}}>Overall Due Date</label><input type="date" value={form.dueDate} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/></div>
                <div style={{width:110}}><label style={{fontSize:12,color:T.t3,display:"block",marginBottom:4}}># Chunks</label><input type="number" min="1" max="14" value={form.chunks} onChange={e=>setForm(p=>({...p,chunks:parseInt(e.target.value)||1}))}/></div>
              </div>
              <textarea placeholder="Notes (optional)" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={2}/>
              <div style={{fontSize:12,color:T.t3,background:T.row,padding:10,borderRadius:8,lineHeight:1.5}}>
                Each chunk starts blank — you set the label (e.g. Q1, Q2) and deadline yourself.
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button className="bs" onClick={()=>setModal(false)} style={{flex:1}}>Cancel</button>
              <button className="bp" onClick={add} style={{flex:1}}>Create</button>
            </div>
          </div>
        </div>
      )}

      <div className="st">Active ({active.length})</div>
      {active.length===0&&<div className="card" style={{textAlign:"center",color:T.t4,padding:"22px 0",marginBottom:14}}>No active assignments</div>}
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:22}}>
        {active.map(a=>{
          const co=COURSES.find(c=>c.short===a.course);
          const dl=dLeft(a.dueDate);
          const dc=a.chunks.filter(c=>c.completed).length;
          const pct=a.chunks.length?Math.round(dc/a.chunks.length*100):0;
          return (
            <div key={a.id} className="card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:14,color:T.t1}}>{a.title}</span>
                    {co&&<span className="bdg" style={{background:co.color+"20",color:co.color}}>{co.short}</span>}
                    {dl!=null&&<span className="bdg" style={{background:dl<=2?"#fee2e2":T.bsBg,color:dl<=2?"#dc2626":T.t3}}>{dl<0?"Overdue":dl===0?"Today!":dl+"d left"}</span>}
                  </div>
                  <div className="pt" style={{marginBottom:5}}><div className="pf" style={{width:pct+"%",background:co?.color||T.bpBg}}/></div>
                  <div style={{fontSize:12,color:T.t3,marginBottom:6}}>{dc}/{a.chunks.length} chunks · {pct}%</div>
                  <button className="bg" style={{fontSize:12,paddingLeft:0,color:T.t3}} onClick={()=>setExp(exp===a.id?null:a.id)}>{exp===a.id?"▴ Hide chunks":"▾ Show chunks"}</button>
                  {exp===a.id&&(
                    <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:7}}>
                      {a.chunks.map((ch,idx)=>{
                        const cdl=dLeft(ch.date);
                        return (
                          <div key={ch.id} style={{padding:"8px 10px",background:ch.completed?T.row:T.bg,borderRadius:8,border:`1px solid ${T.border}`}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                              <input type="checkbox" className="chk" checked={ch.completed} onChange={()=>toggleChunk(a.id,ch.id)}/>
                              <input
                                value={ch.title}
                                onChange={e=>editLabel(a.id,ch.id,e.target.value)}
                                placeholder={`Label — e.g. Q${idx+1}`}
                                style={{flex:1,fontSize:13,padding:"4px 8px",borderRadius:6,textDecoration:ch.completed?"line-through":"none"}}
                              />
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:8,paddingLeft:24}}>
                              <label style={{fontSize:11,color:T.t3,whiteSpace:"nowrap"}}>Deadline:</label>
                              <input
                                type="date"
                                value={ch.date||""}
                                onChange={e=>editDate(a.id,ch.id,e.target.value)}
                                style={{fontSize:12,padding:"3px 8px",flex:1}}
                              />
                              {ch.date&&<span style={{fontSize:11,fontWeight:700,whiteSpace:"nowrap",color:cdl!=null&&cdl<=1?"#ef4444":cdl<=3?"#f59e0b":T.t4}}>
                                {cdl<0?"Overdue":cdl===0?"Today!":cdl+"d"}
                              </span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0}}>
                  <button className="bg" style={{fontSize:12,color:"#059669"}} onClick={()=>setAssignments(p=>p.map(x=>x.id===a.id?{...x,completed:true}:x))}>✓</button>
                  <button className="bg" style={{color:"#ef4444"}} onClick={()=>setAssignments(p=>p.filter(x=>x.id!==a.id))}>×</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {done.length>0&&<>
        <div className="st">Completed ({done.length})</div>
        {done.map(a=>(
          <div key={a.id} className="card" style={{opacity:.5,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:14,textDecoration:"line-through",color:T.t3}}>{a.title}</span>
            <button className="bg" style={{color:"#ef4444"}} onClick={()=>setAssignments(p=>p.filter(x=>x.id!==a.id))}>×</button>
          </div>
        ))}
      </>}
    </div>
  );
}

// ─── EXAM PLANNER ───
function Exams({T,examPlans,setExamPlans,examTasks,setExamTasks}) {
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({subject:"",date:"",type:"Midterm",topics:""});
  const [exp,setExp]=useState(null);
  const [nt,setNt]=useState({title:"",date:"",eid:""});
  function add(){
    if(!form.subject||!form.date) return;
    const id=uid(); const d=dLeft(form.date)||14;
    const topics=form.topics.split(",").map(t=>t.trim()).filter(Boolean);
    const gen=[];
    if(d>=7){
      const intv=Math.max(1,Math.floor((d-3)/Math.max(topics.length,1)));
      topics.forEach((t,i)=>{const dt=new Date();dt.setDate(dt.getDate()+intv*(i+1));gen.push({id:uid(),eid:id,title:`Study: ${t}`,date:dt.toISOString().slice(0,10),completed:false,subject:form.subject});});
      const rev=new Date();rev.setDate(rev.getDate()+d-3);gen.push({id:uid(),eid:id,title:`Full revision — ${form.subject}`,date:rev.toISOString().slice(0,10),completed:false,subject:form.subject});
      const pp=new Date();pp.setDate(pp.getDate()+d-1);gen.push({id:uid(),eid:id,title:`Past papers — ${form.subject}`,date:pp.toISOString().slice(0,10),completed:false,subject:form.subject});
    }
    setExamPlans(p=>[...p,{...form,id}]); setExamTasks(p=>[...p,...gen]);
    setForm({subject:"",date:"",type:"Midterm",topics:""}); setModal(false);
  }
  function toggleT(id){setExamTasks(p=>p.map(t=>t.id===id?{...t,completed:!t.completed}:t));}
  function delPlan(id){setExamPlans(p=>p.filter(e=>e.id!==id));setExamTasks(p=>p.filter(t=>t.eid!==id));}
  return (
    <div className="scroll">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <button className="bp" onClick={()=>setModal(true)}>+ Add Exam</button>
      </div>
      {modal&&(
        <div className="ov" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div style={{fontWeight:700,fontSize:17,marginBottom:18,color:T.t1}}>Plan an Exam</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <select value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}>
                <option value="">Select subject</option>{COURSES.map(c=><option key={c.code} value={c.short}>{c.name}</option>)}
              </select>
              <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
                {["Midterm","Final","Quiz","Lab Exam","Viva"].map(t=><option key={t}>{t}</option>)}
              </select>
              <input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/>
              <textarea placeholder="Topics comma-separated (e.g. Arrays, Trees, Recursion)" value={form.topics} onChange={e=>setForm(p=>({...p,topics:e.target.value}))} rows={3}/>
            </div>
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button className="bs" onClick={()=>setModal(false)} style={{flex:1}}>Cancel</button>
              <button className="bp" onClick={add} style={{flex:1}}>Create Plan</button>
            </div>
          </div>
        </div>
      )}
      {examPlans.length===0&&<div className="card" style={{textAlign:"center",color:T.t4,padding:"36px 0"}}>No exams planned yet</div>}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {examPlans.sort((a,b)=>a.date.localeCompare(b.date)).map(exam=>{
          const co=COURSES.find(c=>c.short===exam.subject);
          const dl=dLeft(exam.date);
          const et=examTasks.filter(t=>t.eid===exam.id);
          const dc=et.filter(t=>t.completed).length;
          const pct=et.length?Math.round(dc/et.length*100):0;
          return (
            <div key={exam.id} className="card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:14,color:T.t1}}>{exam.subject} — {exam.type}</span>
                    {co&&<span className="bdg" style={{background:co.color+"20",color:co.color}}>{co.short}</span>}
                    {dl!=null&&<span className="bdg" style={{background:dl<=3?"#fee2e2":dl<=7?"#fef9c3":T.bsBg,color:dl<=3?"#dc2626":dl<=7?"#92400e":T.t3}}>{dl<0?"Past":dl===0?"Today!":dl+"d"}</span>}
                  </div>
                  <div style={{fontSize:12,color:T.t4}}>{fmtD(exam.date)}</div>
                </div>
                <div style={{display:"flex",gap:4}}>
                  <button className="bg" onClick={()=>setExp(exp===exam.id?null:exam.id)}>{exp===exam.id?"▴":"▾"}</button>
                  <button className="bg" style={{color:"#ef4444"}} onClick={()=>delPlan(exam.id)}>×</button>
                </div>
              </div>
              <div className="pt" style={{marginBottom:5}}><div className="pf" style={{width:pct+"%",background:co?.color||T.bpBg}}/></div>
              <div style={{fontSize:12,color:T.t3}}>{dc}/{et.length} tasks done</div>
              {exp===exam.id&&(
                <div style={{marginTop:12}}>
                  <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:10}}>
                    {et.sort((a,b)=>a.date.localeCompare(b.date)).map(t=>(
                      <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:t.completed?T.row:T.bg,borderRadius:8,border:`1px solid ${T.border}`}}>
                        <input type="checkbox" className="chk" checked={t.completed} onChange={()=>toggleT(t.id)}/>
                        <span style={{flex:1,fontSize:13,textDecoration:t.completed?"line-through":"none",color:T.t1}}>{t.title}</span>
                        <span style={{fontSize:11,color:T.t4}}>{fmtD(t.date)}</span>
                      </div>
                    ))}
                    {et.length===0&&<div style={{fontSize:13,color:T.t4}}>No tasks yet</div>}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <input placeholder="Add task..." value={nt.eid===exam.id?nt.title:""} onChange={e=>setNt({...nt,title:e.target.value,eid:exam.id})} style={{flex:1}}/>
                    <input type="date" value={nt.eid===exam.id?nt.date:""} onChange={e=>setNt({...nt,date:e.target.value,eid:exam.id})} style={{width:130}}/>
                    <button className="bp" onClick={()=>{if(!nt.title||!nt.date)return;setExamTasks(p=>[...p,{id:uid(),eid:exam.id,title:nt.title,date:nt.date,completed:false,subject:exam.subject}]);setNt({title:"",date:"",eid:""});}}>Add</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── REVISION LOG ───
// User manually sets: topic, course, first revision date, and after each revision sets the NEXT date themselves
function Revision({T,revisions,setRevisions}) {
  const [form,setForm]=useState({topic:"",course:"",firstDate:""});
  const [filter,setFilter]=useState("all");
  const [nextDates,setNextDates]=useState({}); // {revisionId: dateString}

  function add(){
    if(!form.topic||!form.firstDate) return;
    setRevisions(p=>[...p,{
      id:uid(), topic:form.topic, course:form.course,
      lastDate:"", nextDate:form.firstDate, count:0
    }]);
    setForm({topic:"",course:"",firstDate:""});
  }

  function markRevised(id){
    const nextDate=nextDates[id];
    if(!nextDate){alert("Please set the next revision date before marking as revised.");return;}
    setRevisions(p=>p.map(r=>r.id!==id?r:{
      ...r, lastDate:isoToday(), nextDate, count:r.count+1
    }));
    setNextDates(p=>({...p,[id]:""}));
  }

  const list=revisions.filter(r=>{
    if(filter==="due") return r.nextDate<=isoToday();
    if(filter==="upcoming") return r.nextDate>isoToday();
    return true;
  }).sort((a,b)=>a.nextDate.localeCompare(b.nextDate));

  return (
    <div className="scroll">
      <div className="card" style={{marginBottom:14}}>
        <div className="st">Add Topic to Revise</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <input placeholder="Topic name..." value={form.topic} onChange={e=>setForm(p=>({...p,topic:e.target.value}))} style={{flex:"2 1 150px"}}/>
          <select value={form.course} onChange={e=>setForm(p=>({...p,course:e.target.value}))} style={{flex:"1 1 100px"}}>
            <option value="">Course</option>
            {COURSES.map(c=><option key={c.code} value={c.short}>{c.short}</option>)}
          </select>
          <div style={{flex:"1 1 130px"}}>
            <input type="date" value={form.firstDate} onChange={e=>setForm(p=>({...p,firstDate:e.target.value}))} placeholder="First revision date"/>
            <div style={{fontSize:10,color:T.t3,marginTop:2}}>First revision date</div>
          </div>
          <button className="bp" onClick={add}>Add</button>
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[["all","All"],["due","Due / Today"],["upcoming","Upcoming"]].map(([v,l])=>(
          <button key={v} className={filter===v?"bp":"bs"} style={{fontSize:13}} onClick={()=>setFilter(v)}>{l}</button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {list.length===0&&<div className="card" style={{textAlign:"center",color:T.t4,padding:"22px 0"}}>No topics tracked yet</div>}
        {list.map(r=>{
          const co=COURSES.find(c=>c.short===r.course);
          const due=r.nextDate<=isoToday();
          const dl=dLeft(r.nextDate);
          return (
            <div key={r.id} className="card" style={{borderLeft:`4px solid ${due?"#ef4444":"#059669"}`}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:160}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:14,color:T.t1}}>{r.topic}</span>
                    {co&&<span className="bdg" style={{background:co.color+"20",color:co.color}}>{co.short}</span>}
                    <span className="bdg" style={{background:due?"#fee2e2":"#dcfce7",color:due?"#dc2626":"#166534"}}>
                      {due?"Due today!":dl===1?"Tomorrow":"In "+dl+"d"}
                    </span>
                  </div>
                  <div style={{fontSize:11,color:T.t4}}>
                    Revised {r.count}× · Next: {fmtD(r.nextDate)}{r.lastDate?" · Last: "+fmtD(r.lastDate):""}
                  </div>
                </div>
                {/* After marking revised, user picks the NEXT date themselves */}
                <div style={{display:"flex",flexDirection:"column",gap:6,minWidth:200}}>
                  <div style={{fontSize:11,color:T.t3}}>Set next revision date:</div>
                  <div style={{display:"flex",gap:6}}>
                    <input
                      type="date"
                      value={nextDates[r.id]||""}
                      onChange={e=>setNextDates(p=>({...p,[r.id]:e.target.value}))}
                      style={{flex:1,fontSize:12,padding:"5px 8px"}}
                    />
                    <button className="bp" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>markRevised(r.id)}>✓ Done</button>
                  </div>
                </div>
                <button className="bg" style={{color:"#ef4444"}} onClick={()=>setRevisions(p=>p.filter(x=>x.id!==r.id))}>×</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PROJECTS ───
function Projects({T,projects,setProjects}) {
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({name:"",course:"",deadline:"",members:"",description:""});
  const [exp,setExp]=useState(null);
  const [nt,setNt]=useState({title:"",assignee:"",deadline:"",pid:""});
  function add(){if(!form.name)return;const members=form.members.split(",").map(m=>m.trim()).filter(Boolean);setProjects(p=>[...p,{...form,id:uid(),members,tasks:[]}]);setForm({name:"",course:"",deadline:"",members:"",description:""});setModal(false);}
  function addTask(pid){
    if(!nt.title||!nt.deadline)return;
    setProjects(p=>p.map(x=>x.id===pid?{...x,tasks:[...x.tasks,{...nt,id:uid(),completed:false}]}:x));
    setNt({title:"",assignee:"",deadline:"",pid:""});
  }
  function toggleTask(pid,tid){setProjects(p=>p.map(x=>x.id===pid?{...x,tasks:x.tasks.map(t=>t.id===tid?{...t,completed:!t.completed}:t)}:x));}
  function editTaskDL(pid,tid,deadline){setProjects(p=>p.map(x=>x.id===pid?{...x,tasks:x.tasks.map(t=>t.id===tid?{...t,deadline}:t)}:x));}
  return (
    <div className="scroll">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <button className="bp" onClick={()=>setModal(true)}>+ New Project</button>
      </div>
      {modal&&(
        <div className="ov" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div style={{fontWeight:700,fontSize:17,marginBottom:18,color:T.t1}}>New Project</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Project name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
              <select value={form.course} onChange={e=>setForm(p=>({...p,course:e.target.value}))}>
                <option value="">Course</option>{COURSES.map(c=><option key={c.code} value={c.short}>{c.name}</option>)}
              </select>
              <div><label style={{fontSize:12,color:T.t3,display:"block",marginBottom:4}}>Project Deadline</label><input type="date" value={form.deadline} onChange={e=>setForm(p=>({...p,deadline:e.target.value}))}/></div>
              <input placeholder="Team members (comma-separated)" value={form.members} onChange={e=>setForm(p=>({...p,members:e.target.value}))}/>
              <textarea placeholder="Description" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={2}/>
            </div>
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button className="bs" onClick={()=>setModal(false)} style={{flex:1}}>Cancel</button>
              <button className="bp" onClick={add} style={{flex:1}}>Create</button>
            </div>
          </div>
        </div>
      )}
      {projects.length===0&&<div className="card" style={{textAlign:"center",color:T.t4,padding:"36px 0"}}>No projects yet</div>}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {projects.map(proj=>{
          const co=COURSES.find(c=>c.short===proj.course);
          const dc=proj.tasks.filter(t=>t.completed).length;
          const pct=proj.tasks.length?Math.round(dc/proj.tasks.length*100):0;
          const dl=dLeft(proj.deadline);
          return (
            <div key={proj.id} className="card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:14,color:T.t1}}>{proj.name}</span>
                    {co&&<span className="bdg" style={{background:co.color+"20",color:co.color}}>{co.short}</span>}
                    {dl!=null&&<span className="bdg" style={{background:T.bsBg,color:T.t3}}>{dl<0?"Overdue":dl+"d left"}</span>}
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{proj.members.map((m,i)=><span key={i} className="bdg" style={{background:T.bsBg,color:T.t3}}>{m}</span>)}</div>
                </div>
                <div style={{display:"flex",gap:4}}>
                  <button className="bg" onClick={()=>setExp(exp===proj.id?null:proj.id)}>{exp===proj.id?"▴":"▾"}</button>
                  <button className="bg" style={{color:"#ef4444"}} onClick={()=>setProjects(p=>p.filter(x=>x.id!==proj.id))}>×</button>
                </div>
              </div>
              <div className="pt" style={{marginBottom:5}}><div className="pf" style={{width:pct+"%",background:co?.color||T.bpBg}}/></div>
              <div style={{fontSize:12,color:T.t3}}>{pct}% · {dc}/{proj.tasks.length} tasks</div>
              {exp===proj.id&&(
                <div style={{marginTop:12}}>
                  <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
                    {proj.tasks.length===0&&<div style={{fontSize:13,color:T.t4}}>No tasks yet</div>}
                    {proj.tasks.map(t=>{
                      const tdl=dLeft(t.deadline);
                      return (
                        <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:t.completed?T.row:T.bg,borderRadius:8,border:`1px solid ${T.border}`,flexWrap:"wrap"}}>
                          <input type="checkbox" className="chk" checked={t.completed} onChange={()=>toggleTask(proj.id,t.id)}/>
                          <span style={{flex:1,fontSize:13,textDecoration:t.completed?"line-through":"none",color:T.t1,minWidth:80}}>{t.title}</span>
                          {t.assignee&&<span className="bdg" style={{background:"#eff6ff",color:"#2563eb"}}>{t.assignee}</span>}
                          <input type="date" value={t.deadline||""} onChange={e=>editTaskDL(proj.id,t.id,e.target.value)} style={{width:128,fontSize:12,padding:"4px 8px"}}/>
                          {t.deadline&&<span style={{fontSize:11,fontWeight:700,color:tdl!=null&&tdl<=1?"#ef4444":T.t4,whiteSpace:"nowrap"}}>{tdl<0?"Overdue":tdl===0?"Today":tdl+"d"}</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",background:T.row,padding:"10px",borderRadius:10,border:`1px solid ${T.border}`}}>
                    <input placeholder="Task title *" value={nt.pid===proj.id?nt.title:""} onChange={e=>setNt({...nt,title:e.target.value,pid:proj.id})} style={{flex:"2 1 120px"}}/>
                    <select value={nt.pid===proj.id?nt.assignee:""} onChange={e=>setNt({...nt,assignee:e.target.value,pid:proj.id})} style={{flex:"1 1 90px"}}>
                      <option value="">Assign</option>{proj.members.map((m,i)=><option key={i}>{m}</option>)}
                    </select>
                    <div style={{flex:"1 1 120px"}}>
                      <input type="date" value={nt.pid===proj.id?nt.deadline:""} onChange={e=>setNt({...nt,deadline:e.target.value,pid:proj.id})}/>
                      <div style={{fontSize:10,color:T.t3,marginTop:2}}>Deadline (required)</div>
                    </div>
                    <button className="bp" onClick={()=>addTask(proj.id)}>Add Task</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
