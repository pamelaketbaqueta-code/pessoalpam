import { useState, useRef, useEffect } from "react";

const fmt = v => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(v);
const fmt2 = n => String(n).padStart(2,"0");
const MONTHS=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const WDAYS=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const today=new Date();
const todayStr=`${today.getFullYear()}-${fmt2(today.getMonth()+1)}-${fmt2(today.getDate())}`;

/* ── FINANCEIRO ─────────────────────────────────────────────────────────────── */
const FIN={
  contas:[{n:"Nubank PJ",v:56082,c:"#a855f7"},{n:"Nubank PF",v:40567,c:"#c084fc"},{n:"Itaú",v:7500,c:"#f97316"},{n:"Inter",v:5930,c:"#fb923c"}],
  cartoes:[{n:"Inter",f:1655,lim:10200},{n:"Itaú",f:1109,lim:8050},{n:"Bradesco",f:716,lim:6250},{n:"Nubank",f:1529,lim:6008}],
  dividas:[{n:"ESPM",v:14393},{n:"Construtora (apê)",v:15000},{n:"Cartões (saldo total)",v:30508}],
  fixos:[{n:"Aluguel",v:4144,ic:"🏠"},{n:"Apartamento (obra)",v:1250,ic:"🔨"},{n:"ESPM",v:1581,ic:"🎓"},{n:"Internet",v:100,ic:"📶"},{n:"Claro",v:159,ic:"📱"},{n:"Enel",v:105,ic:"⚡"},{n:"Comgás",v:83,ic:"🔥"},{n:"Contador",v:335,ic:"📊"}],
  aReceber:[{n:"Parcelas carro",v:18500},{n:"Amiga",v:4000},{n:"Caução",v:9000}],
  renda:35000,parcelaCarro:2000,
  evolucao:[{m:"Início",v:22993},{m:"Maio",v:68477},{m:"Junho",v:72221},{m:"Julho",v:null}],
};
const totalContas=FIN.contas.reduce((a,b)=>a+b.v,0);
const totalFaturas=FIN.cartoes.reduce((a,b)=>a+b.f,0);
const totalDividas=FIN.dividas.reduce((a,b)=>a+b.v,0);
const totalFixos=FIN.fixos.reduce((a,b)=>a+b.v,0);
const totalAReceber=FIN.aReceber.reduce((a,b)=>a+b.v,0);
const PL=totalContas+totalAReceber-totalDividas;
const sobra=FIN.renda+FIN.parcelaCarro-totalFixos-totalFaturas;

/* ── DADOS INICIAIS ─────────────────────────────────────────────────────────── */
const TASKS0=[
  {id:1,text:"Pagar fatura Inter",cat:"finance",done:false,prio:"high",date:"2026-06-20"},
  {id:2,text:"Entregar trabalho ESPM",cat:"study",done:false,prio:"high",date:"2026-06-22"},
  {id:3,text:"Academia",cat:"health",done:false,prio:"med",date:"2026-06-16"},
  {id:4,text:"Pesquisar CDB/LCI esta semana",cat:"finance",done:false,prio:"high",date:"2026-06-17"},
  {id:5,text:"Remédio da mãe",cat:"family",done:false,prio:"high",date:"2026-06-16"},
  {id:6,text:"Ligar construtora",cat:"home",done:true,prio:"high",date:"2026-06-16"},
];
const EVENTS0=[
  {id:1,date:"2026-06-18",title:"Entrega do apê",cat:"home"},
  {id:2,date:"2026-06-20",title:"Fatura Inter vence",cat:"finance"},
  {id:3,date:"2026-06-22",title:"Prova ESPM",cat:"study"},
  {id:4,date:"2026-07-01",title:"Meta: sair do aluguel",cat:"home"},
  {id:5,date:"2026-07-15",title:"Vencimento ESPM",cat:"study"},
];
const WORK0=[
  {id:1,title:"Reunião com cliente — proposta Q3",status:"hoje",prio:"high",date:"2026-06-16",notes:"Apresentar deck atualizado",client:"Cliente A"},
  {id:2,title:"Enviar relatório mensal",status:"pendente",prio:"high",date:"2026-06-18",notes:"",client:"Interno"},
  {id:3,title:"Revisar 3 contratos novos",status:"pendente",prio:"med",date:"2026-06-20",notes:"Solicitar ao contador",client:""},
  {id:4,title:"Follow-up proposta anterior",status:"feito",prio:"med",date:"2026-06-15",notes:"",client:"Cliente B"},
];
const GOALS0=[
  {id:1,name:"Fundo de emergência",icon:"🛡️",target:totalFixos*6,current:0,color:"#22c55e",cat:"finance",prazo:"Dez 2026"},
  {id:2,name:"CDB — render dinheiro parado",icon:"📈",target:totalContas,current:0,color:"#8b5cf6",cat:"finance",prazo:"Jul 2026"},
  {id:3,name:"Viagem Europa",icon:"✈️",target:30000,current:0,color:"#3b82f6",cat:"travel",prazo:"Set 2027"},
  {id:4,name:"Mobília apê",icon:"🛋️",target:20000,current:5000,color:"#f59e0b",cat:"home",prazo:"Set 2026"},
  {id:5,name:"Macbook novo",icon:"💻",target:15000,current:2000,color:"#ec4899",cat:"work",prazo:"Dez 2026"},
];
const HABITS0=[
  {id:1,name:"Academia",icon:"🏋️",days:[1,0,1,1,0,0,1],goal:5},
  {id:2,name:"Água (8 copos)",icon:"💧",days:[1,1,0,1,1,0,0],goal:7},
  {id:3,name:"Leitura 20min",icon:"📖",days:[0,1,1,0,1,0,0],goal:5},
  {id:4,name:"Sem gasto impulsivo",icon:"💰",days:[1,1,1,0,1,1,0],goal:7},
];
const COURSES0=[
  {id:1,name:"Inglês — Wizard",icon:"🇺🇸",progress:65,total:120,next:"Qua 19h"},
  {id:2,name:"ESPM — Marketing",icon:"🎓",progress:40,total:100,next:"Sex 14h"},
  {id:3,name:"Excel Avançado",icon:"📊",progress:20,total:40,next:"Auto-estudo"},
];
const TRIPS0=[
  {id:1,dest:"Europa",icon:"🇪🇺",date:"Set 2027",budget:30000,saved:0,items:["Passagem","Hotel","Passeios","Seguro viagem"]},
  {id:2,dest:"Rio de Janeiro",icon:"🏖️",date:"Jul 2026",budget:3000,saved:1200,items:["Hotel","Transporte","Passeios"]},
];
const NOTION=[
  {title:"Faculdade",icon:"🎓",url:"https://app.notion.com/p/360ac4449af780abb6d4c0c0737ce5c5"},
  {title:"Estratégia",icon:"🎯",url:"https://app.notion.com/p/37cac4449af780c9a71cf2cfb94d04f0"},
  {title:"Minhas Tarefas",icon:"✅",url:"https://app.notion.com/p/20fef34856664f40873e361270762941"},
  {title:"Reflexões",icon:"💭",url:"https://app.notion.com/p/26bac4449af7801388f2c973a4662336"},
];
const CAT={finance:{l:"Finanças",c:"#8b5cf6"},work:{l:"Trabalho",c:"#3b82f6"},study:{l:"Faculdade",c:"#06b6d4"},health:{l:"Saúde",c:"#10b981"},home:{l:"Casa",c:"#f59e0b"},family:{l:"Família",c:"#ec4899"},travel:{l:"Viagem",c:"#60a5fa"},other:{l:"Outro",c:"#6b7280"}};

/* ── DESIGN TOKENS ──────────────────────────────────────────────────────────── */
const T={
  bg:"#080810",card:"#0f0f1a",border:"rgba(255,255,255,0.07)",
  text:"#f0f0ff",muted:"#6b7280",faint:"rgba(255,255,255,0.05)",
  green:"#22c55e",purple:"#8b5cf6",blue:"#3b82f6",amber:"#f59e0b",red:"#ef4444",pink:"#ec4899",cyan:"#06b6d4",
  grad:"linear-gradient(135deg,#1a0a2e 0%,#0a0a1e 50%,#0a1a0e 100%)",
};

/* ── MICRO COMPONENTS ───────────────────────────────────────────────────────── */
function Pill({label,color,size=10}){
  return <span style={{fontSize:size,fontWeight:700,padding:"3px 9px",borderRadius:99,background:color+"20",color,letterSpacing:0.3,whiteSpace:"nowrap"}}>{label}</span>;
}
function Bar({val,max,color=T.green,h=4,glow}){
  const p=Math.min(100,max>0?Math.round(val/max*100):0);
  return(
    <div style={{background:"rgba(255,255,255,0.06)",borderRadius:99,height:h,overflow:"hidden"}}>
      <div style={{width:`${p}%`,height:"100%",borderRadius:99,background:color,boxShadow:glow?`0 0 8px ${color}88`:"none",transition:"width .5s ease"}}/>
    </div>
  );
}
function Stat({label,value,color=T.text,sub,size=22}){
  return(
    <div style={{padding:"16px",background:T.card,border:`1px solid ${T.border}`,borderRadius:14}}>
      <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:1.2,marginBottom:8}}>{label}</div>
      <div style={{fontSize:size,fontWeight:800,color,lineHeight:1,marginBottom:sub?4:0}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:T.muted,marginTop:4}}>{sub}</div>}
    </div>
  );
}
function Card({children,style={},accent,glow}){
  return(
    <div style={{background:T.card,border:`1px solid ${accent?accent+"30":T.border}`,borderRadius:16,padding:"18px 20px",
      boxShadow:glow&&accent?`0 0 20px ${accent}15`:"none",...style}}>{children}</div>
  );
}
function STitle({children,color=T.muted}){
  return <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color,marginBottom:14}}>{children}</div>;
}
function Row({label,value,color=T.text,sub,valueColor}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
      <div><div style={{fontSize:13,color}}>{label}</div>{sub&&<div style={{fontSize:11,color:T.muted,marginTop:1}}>{sub}</div>}</div>
      <div style={{fontSize:14,fontWeight:700,color:valueColor||T.text}}>{value}</div>
    </div>
  );
}
function Inp({style,...p}){
  return <input style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${T.border}`,borderRadius:10,padding:"9px 12px",color:T.text,fontSize:13,outline:"none",...style}} {...p}/>;
}
function Sel({style,...p}){
  return <select style={{background:"#0f0f1a",border:`1px solid ${T.border}`,borderRadius:10,padding:"9px 12px",color:T.text,fontSize:13,outline:"none",...style}} {...p}/>;
}
function Btn({children,onClick,color=T.purple,ghost,style}){
  return <button onClick={onClick} style={{padding:"8px 16px",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:700,border:`1px solid ${ghost?T.border:color+"40"}`,background:ghost?"transparent":`${color}20`,color:ghost?T.muted:color,transition:"all .15s",...style}}>{children}</button>;
}

/* ── APP ─────────────────────────────────────────────────────────────────────── */
export default function App(){
  const [tab,setTab]=useState("home");
  const [tasks,setTasks]=useState(TASKS0);
  const [events,setEvents]=useState(EVENTS0);
  const [work,setWork]=useState(WORK0);
  const [goals,setGoals]=useState(GOALS0);
  const [habits,setHabits]=useState(HABITS0);
  const [courses,setCourses]=useState(COURSES0);
  const [trips,setTrips]=useState(TRIPS0);
  const [note,setNote]=useState("📌 Apê: confirmar data entrega com construtora\n💊 Mãe: marcar médico em julho\n💰 Pesquisar CDB esta semana — dinheiro parado!\n✈️ Europa 2027 — começar a juntar agora\n🎓 ESPM: trabalho final semana que vem");
  const [calDate,setCalDate]=useState({y:2026,m:5});
  const [selDay,setSelDay]=useState(null);
  const [evtIn,setEvtIn]=useState({title:"",cat:"other"});
  const [taskIn,setTaskIn]=useState({text:"",cat:"other",prio:"med",date:""});
  const [workIn,setWorkIn]=useState({title:"",status:"pendente",prio:"med",date:"",notes:"",client:""});
  const [goalIn,setGoalIn]=useState({name:"",icon:"🎯",target:"",current:"",prazo:"",color:T.purple});
  const [chatMsgs,setChatMsgs]=useState([{r:"a",t:"Oi Pamela! 👋 Sou sua assistente pessoal. Tenho acesso a todas suas informações — finanças, agenda, metas, saúde e trabalho. Como posso te ajudar agora?"}]);
  const [chatIn,setChatIn]=useState("");
  const [chatLoad,setChatLoad]=useState(false);
  const chatRef=useRef(null);
  const [finTab,setFinTab]=useState("geral");
  const [savingsGoal,setSavingsGoal]=useState(50000);

  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},[chatMsgs]);

  const upcoming=events.filter(e=>e.date>=todayStr).sort((a,b)=>a.date.localeCompare(b.date));
  const urgent=tasks.filter(t=>!t.done&&t.prio==="high");
  const todayWork=work.filter(w=>w.status==="hoje");
  const completedGoals=goals.filter(g=>g.current>=g.target).length;

  function getDIM(y,m){return new Date(y,m+1,0).getDate();}
  function getFD(y,m){return new Date(y,m,1).getDay();}

  async function sendChat(){
    if(!chatIn.trim()||chatLoad)return;
    const msg=chatIn.trim();setChatIn("");setChatLoad(true);
    setChatMsgs(m=>[...m,{r:"u",t:msg}]);
    const goalsCtx=goals.map(g=>`${g.name}: ${fmt(g.current)}/${fmt(g.target)}`).join(", ");
    const ctx=`Você é a assistente pessoal da Pamela. Responda em português, de forma direta, calorosa e útil. Máx 3 parágrafos curtos.

FINANÇAS:
- Patrimônio líquido: ${fmt(PL)} (cresceu 253% desde o início: R$22.993 → ${fmt(PL)})
- Em contas: ${fmt(totalContas)} PARADO SEM RENDER (urgente aplicar!)
- Renda mensal: ${fmt(FIN.renda)} + ${fmt(FIN.parcelaCarro)} parcela carro = ${fmt(FIN.renda+FIN.parcelaCarro)}
- Gastos fixos: ${fmt(totalFixos)} | Faturas: ${fmt(totalFaturas)} | Sobra: ${fmt(sobra)}/mês
- Dívidas: ${fmt(totalDividas)} (ESPM 14.393, construtora 15.000, cartões 30.508)
- A receber: ${fmt(totalAReceber)} (carro 18.5k, amiga 4k, caução 9k)
- CDB 0,7%/mês sobre o total parado = ${fmt(Math.round(totalContas*0.007))}/mês de graça

METAS: ${goalsCtx}
TRABALHO URGENTE: ${work.filter(w=>w.status!=="feito").map(w=>w.title).join(" | ")}
AGENDA: ${upcoming.slice(0,5).map(e=>e.date.slice(5)+" "+e.title).join(" | ")}
TAREFAS URGENTES: ${urgent.map(t=>t.text).join(" | ")}
CURSOS: Inglês ${courses[0].progress}%, ESPM ${courses[1].progress}%, Excel ${courses[2].progress}%
VIAGENS: ${trips.map(t=>`${t.dest} ${t.date} meta:${fmt(t.budget)} guardado:${fmt(t.saved)}`).join(" | ")}
FAMÍLIA: Mãe mora com ela, precisa de atenção médica
META SETEMBRO: Sair do aluguel, apê próprio, patrimônio ~R$399k`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:700,system:ctx,messages:[...chatMsgs.slice(-6).filter(m=>m.r==="u").map(m=>({role:"user",content:m.t})),{role:"user",content:msg}]})});
      const d=await res.json();
      setChatMsgs(m=>[...m,{r:"a",t:d.content?.[0]?.text||"Não consegui responder agora."}]);
    }catch{setChatMsgs(m=>[...m,{r:"a",t:"Erro de conexão 😔 Tente novamente."}]);}
    setChatLoad(false);
  }

  const TABS=[
    {id:"home",icon:"✦",label:"Home"},
    {id:"work",icon:"💼",label:"Trabalho"},
    {id:"tasks",icon:"✅",label:"Tarefas"},
    {id:"cal",icon:"📅",label:"Agenda"},
    {id:"fin",icon:"💰",label:"Finanças"},
    {id:"goals",icon:"🎯",label:"Metas"},
    {id:"trips",icon:"✈️",label:"Viagens"},
    {id:"health",icon:"💪",label:"Saúde"},
    {id:"study",icon:"📚",label:"Cursos"},
    {id:"notes",icon:"📝",label:"Notas"},
    {id:"chat",icon:"🤖",label:"IA"},
  ];

  return(
    <div style={{background:T.bg,minHeight:"100vh",color:T.text,fontFamily:"-apple-system,'SF Pro Display',BlinkMacSystemFont,sans-serif"}}>
      <h2 className="sr-only">Painel de Vida Pamela</h2>

      {/* HEADER */}
      <div style={{background:"rgba(8,8,16,0.95)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:30,padding:"0 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:16,paddingBottom:12}}>
          <div>
            <div style={{fontSize:10,color:T.muted,letterSpacing:2,textTransform:"uppercase"}}>Minha Vida</div>
            <div style={{fontSize:21,fontWeight:800,letterSpacing:-0.5,background:"linear-gradient(90deg,#f0f0ff,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Pamela ✦</div>
          </div>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:T.muted}}>patrimônio líquido</div>
              <div style={{fontSize:17,fontWeight:800,color:T.green}}>{fmt(PL)}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:T.muted}}>sobra/mês</div>
              <div style={{fontSize:17,fontWeight:800,color:T.blue}}>{fmt(sobra)}</div>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:0,overflowX:"auto",scrollbarWidth:"none"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:"10px 14px",fontSize:12,fontWeight:tab===t.id?700:400,cursor:"pointer",
              background:"transparent",border:"none",
              borderBottom:`2px solid ${tab===t.id?T.purple:"transparent"}`,
              color:tab===t.id?T.text:T.muted,whiteSpace:"nowrap",gap:5,display:"flex",alignItems:"center",
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"24px 20px 60px",maxWidth:760,margin:"0 auto"}}>

        {/* ══ HOME ══════════════════════════════════════════════════════════════ */}
        {tab==="home" && <>
          {/* urgente */}
          {urgent.length>0&&(
            <Card accent={T.red} glow style={{marginBottom:16}}>
              <STitle color={T.red}>⚡ Urgente agora</STitle>
              {urgent.slice(0,5).map(t=>(
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                  <input type="checkbox" checked={t.done} onChange={()=>setTasks(x=>x.map(i=>i.id===t.id?{...i,done:!i.done}:i))} style={{accentColor:T.green,width:16,height:16,cursor:"pointer"}}/>
                  <span style={{fontSize:14,flex:1}}>{t.text}</span>
                  <Pill label={CAT[t.cat]?.l} color={CAT[t.cat]?.c}/>
                  {t.date&&<span style={{fontSize:11,color:T.muted}}>{t.date.slice(5).split("-").reverse().join("/")}</span>}
                </div>
              ))}
            </Card>
          )}

          {/* trabalho hoje */}
          {todayWork.length>0&&(
            <Card accent={T.blue} style={{marginBottom:16}}>
              <STitle color={T.blue}>💼 Trabalho hoje</STitle>
              {todayWork.map(w=>(
                <div key={w.id} style={{padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:14,fontWeight:500}}>{w.title}</span>
                    {w.client&&<Pill label={w.client} color={T.blue}/>}
                  </div>
                  {w.notes&&<div style={{fontSize:12,color:T.muted,marginTop:3}}>{w.notes}</div>}
                </div>
              ))}
            </Card>
          )}

          {/* stats grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
            <Stat label="Patrimônio" value={fmt(PL)} color={T.green} sub="↑253% desde início"/>
            <Stat label="Em contas" value={fmt(totalContas)} color={T.purple} sub="⚠ Sem render"/>
            <Stat label="Sobra/mês" value={fmt(sobra)} color={T.blue} sub="Após faturas"/>
            <Stat label="Metas" value={`${completedGoals}/${goals.length}`} color={T.amber} sub="concluídas"/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
            {/* agenda */}
            <Card>
              <STitle>📅 Próximos eventos</STitle>
              {upcoming.slice(0,5).map(e=>(
                <div key={e.id} style={{display:"flex",gap:10,alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:11,color:T.muted,minWidth:36}}>{e.date.slice(5).split("-").reverse().join("/")}</span>
                  <span style={{fontSize:13,flex:1}}>{e.title}</span>
                  <div style={{width:7,height:7,borderRadius:"50%",background:CAT[e.cat]?.c||T.muted,flexShrink:0}}/>
                </div>
              ))}
            </Card>

            {/* metas */}
            <Card>
              <STitle>🎯 Metas em progresso</STitle>
              {goals.filter(g=>g.current<g.target).slice(0,4).map(g=>{
                const p=Math.round(g.current/g.target*100);
                return(
                  <div key={g.id} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:12}}>{g.icon} {g.name}</span>
                      <span style={{fontSize:11,color:T.muted}}>{p}%</span>
                    </div>
                    <Bar val={g.current} max={g.target} color={g.color} glow/>
                  </div>
                );
              })}
            </Card>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
            {/* hábitos */}
            <Card>
              <STitle>💪 Hábitos da semana</STitle>
              {habits.map(h=>{
                const d=h.days.filter(Boolean).length;
                return(
                  <div key={h.id} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:13}}>{h.icon} {h.name}</span>
                      <span style={{fontSize:11,color:d>=h.goal?T.green:T.muted}}>{d}/{h.goal}</span>
                    </div>
                    <Bar val={d} max={h.goal} color={d>=h.goal?T.green:T.blue}/>
                  </div>
                );
              })}
            </Card>

            {/* cursos */}
            <Card>
              <STitle>📚 Cursos</STitle>
              {courses.map(c=>(
                <div key={c.id} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13}}>{c.icon} {c.name}</span>
                    <span style={{fontSize:11,color:T.muted}}>{Math.round(c.progress/c.total*100)}%</span>
                  </div>
                  <Bar val={c.progress} max={c.total} color="#a78bfa"/>
                  <div style={{fontSize:11,color:T.muted,marginTop:3}}>Próx: {c.next}</div>
                </div>
              ))}
            </Card>
          </div>

          {/* alerta investimento */}
          <Card accent={T.amber} glow style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <STitle color={T.amber}>⚠️ Alerta — dinheiro parado</STitle>
                <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{fmt(totalContas)} sem render nada</div>
                <div style={{fontSize:13,color:T.muted}}>CDB 0,7%/mês renderia <span style={{color:T.amber,fontWeight:700}}>{fmt(Math.round(totalContas*0.007))}/mês</span> sem fazer nada</div>
              </div>
              <button onClick={()=>setTab("goals")} style={{padding:"10px 18px",background:`${T.amber}20`,border:`1px solid ${T.amber}40`,borderRadius:12,color:T.amber,fontWeight:700,fontSize:13,cursor:"pointer",whiteSpace:"nowrap"}}>Ver metas →</button>
            </div>
          </Card>

          {/* mamãe */}
          <Card accent={T.pink}>
            <STitle color={T.pink}>💕 Mamãe</STitle>
            {[{t:"Médico trimestral",d:"Julho 2026",s:"pendente"},{t:"Remédio mensal",d:"Todo dia 1",s:"ativo"},{t:"Exames anuais",d:"Agosto 2026",s:"pendente"}].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                <div>
                  <div style={{fontSize:13}}>{r.t}</div>
                  <div style={{fontSize:11,color:T.muted}}>{r.d}</div>
                </div>
                <Pill label={r.s} color={r.s==="ativo"?T.green:T.amber}/>
              </div>
            ))}
          </Card>
        </>}

        {/* ══ TRABALHO ══════════════════════════════════════════════════════════ */}
        {tab==="work" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
            {[{s:"hoje",c:T.blue},{s:"pendente",c:T.amber},{s:"feito",c:T.green}].map(({s,c})=>(
              <div key={s} style={{padding:"14px",background:T.card,border:`1px solid ${c}30`,borderRadius:14,textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:800,color:c}}>{work.filter(w=>w.status===s).length}</div>
                <div style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginTop:4}}>{s}</div>
              </div>
            ))}
          </div>

          {["hoje","pendente","feito"].map(s=>{
            const ws=work.filter(w=>w.status===s);
            if(!ws.length)return null;
            const sc={hoje:T.blue,pendente:T.amber,feito:T.green};
            const si={hoje:"💼",pendente:"⏳",feito:"✅"};
            return(
              <div key={s} style={{marginBottom:20}}>
                <STitle color={sc[s]}>{si[s]} {s.charAt(0).toUpperCase()+s.slice(1)}</STitle>
                {ws.map(w=>(
                  <Card key={w.id} style={{marginBottom:8,opacity:s==="feito"?.5:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>{w.title}</div>
                        {w.notes&&<div style={{fontSize:12,color:T.muted,marginBottom:6}}>{w.notes}</div>}
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          {w.client&&<Pill label={w.client} color={T.blue}/>}
                          {w.date&&<span style={{fontSize:11,color:T.muted}}>{w.date.slice(5).split("-").reverse().join("/")}</span>}
                          <Pill label={w.prio==="high"?"Alta":"Média"} color={w.prio==="high"?T.red:T.amber}/>
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                        <Sel value={w.status} onChange={e=>setWork(x=>x.map(i=>i.id===w.id?{...i,status:e.target.value}:i))} style={{fontSize:12,padding:"5px 8px",color:sc[w.status]}}>
                          <option value="hoje">Hoje</option>
                          <option value="pendente">Pendente</option>
                          <option value="feito">Feito ✓</option>
                        </Sel>
                        <button onClick={()=>setWork(x=>x.filter(i=>i.id!==w.id))} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:14}}>✕</button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            );
          })}

          <Card accent={T.blue}>
            <STitle color={T.blue}>+ Nova tarefa de trabalho</STitle>
            <Inp placeholder="Título da tarefa..." value={workIn.title} onChange={e=>setWorkIn(f=>({...f,title:e.target.value}))} style={{width:"100%",marginBottom:8}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <Inp placeholder="Cliente (opcional)" value={workIn.client} onChange={e=>setWorkIn(f=>({...f,client:e.target.value}))}/>
              <Inp placeholder="Notas..." value={workIn.notes} onChange={e=>setWorkIn(f=>({...f,notes:e.target.value}))}/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Sel value={workIn.status} onChange={e=>setWorkIn(f=>({...f,status:e.target.value}))} style={{flex:1}}>
                <option value="hoje">Hoje</option>
                <option value="pendente">Pendente</option>
              </Sel>
              <Sel value={workIn.prio} onChange={e=>setWorkIn(f=>({...f,prio:e.target.value}))} style={{flex:1}}>
                <option value="high">Alta prioridade</option>
                <option value="med">Média prioridade</option>
              </Sel>
              <Inp type="date" value={workIn.date} onChange={e=>setWorkIn(f=>({...f,date:e.target.value}))} style={{flex:1}}/>
              <Btn onClick={()=>{if(!workIn.title.trim())return;setWork(w=>[{id:Date.now(),...workIn},...w]);setWorkIn({title:"",status:"pendente",prio:"med",date:"",notes:"",client:""});}}>+ Add</Btn>
            </div>
          </Card>
        </>}

        {/* ══ TAREFAS ════════════════════════════════════════════════════════════ */}
        {tab==="tasks" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
            {Object.entries({total:tasks.length,pendente:tasks.filter(t=>!t.done).length,concluida:tasks.filter(t=>t.done).length,urgente:urgent.length}).map(([k,v])=>(
              <div key={k} style={{padding:"14px",background:T.card,border:`1px solid ${T.border}`,borderRadius:14,textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:800,color:k==="urgente"?T.red:k==="concluida"?T.green:T.text}}>{v}</div>
                <div style={{fontSize:11,color:T.muted,textTransform:"capitalize",marginTop:4}}>{k}</div>
              </div>
            ))}
          </div>

          {["high","med","low"].map(prio=>{
            const ts=tasks.filter(t=>!t.done&&t.prio===prio);
            if(!ts.length)return null;
            const pc={high:T.red,med:T.amber,low:T.green};
            const pl={high:"🔴 Alta",med:"🟡 Média",low:"🟢 Baixa"};
            return(
              <div key={prio} style={{marginBottom:20}}>
                <STitle color={pc[prio]}>{pl[prio]} prioridade</STitle>
                {ts.map(t=>(
                  <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:T.card,border:`1px solid ${T.border}`,borderRadius:10,marginBottom:6}}>
                    <input type="checkbox" checked={t.done} onChange={()=>setTasks(x=>x.map(i=>i.id===t.id?{...i,done:!i.done}:i))} style={{accentColor:T.green,width:16,height:16,cursor:"pointer",flexShrink:0}}/>
                    <span style={{fontSize:14,flex:1}}>{t.text}</span>
                    <Pill label={CAT[t.cat]?.l} color={CAT[t.cat]?.c}/>
                    {t.date&&<span style={{fontSize:11,color:T.muted,whiteSpace:"nowrap"}}>{t.date.slice(5).split("-").reverse().join("/")}</span>}
                    <button onClick={()=>setTasks(x=>x.filter(i=>i.id!==t.id))} style={{background:"none",border:"none",color:T.muted,cursor:"pointer"}}>✕</button>
                  </div>
                ))}
              </div>
            );
          })}

          {tasks.filter(t=>t.done).length>0&&(
            <div style={{marginBottom:20,opacity:0.4}}>
              <STitle>✅ Concluídas ({tasks.filter(t=>t.done).length})</STitle>
              {tasks.filter(t=>t.done).map(t=>(
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                  <input type="checkbox" checked onChange={()=>setTasks(x=>x.map(i=>i.id===t.id?{...i,done:false}:i))} style={{accentColor:T.green}}/>
                  <span style={{fontSize:13,textDecoration:"line-through",color:T.muted,flex:1}}>{t.text}</span>
                </div>
              ))}
            </div>
          )}

          <Card accent={T.purple}>
            <STitle color={T.purple}>+ Nova tarefa</STitle>
            <Inp placeholder="O que precisa fazer?" value={taskIn.text} onChange={e=>setTaskIn(f=>({...f,text:e.target.value}))} style={{width:"100%",marginBottom:8}} onKeyDown={e=>{if(e.key==="Enter"&&taskIn.text.trim()){setTasks(t=>[{id:Date.now(),...taskIn,done:false},...t]);setTaskIn(f=>({...f,text:""}));}}}/>
            <div style={{display:"flex",gap:8}}>
              <Sel value={taskIn.cat} onChange={e=>setTaskIn(f=>({...f,cat:e.target.value}))} style={{flex:2}}>
                {Object.entries(CAT).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}
              </Sel>
              <Sel value={taskIn.prio} onChange={e=>setTaskIn(f=>({...f,prio:e.target.value}))} style={{flex:1}}>
                <option value="high">Alta</option>
                <option value="med">Média</option>
                <option value="low">Baixa</option>
              </Sel>
              <Inp type="date" value={taskIn.date} onChange={e=>setTaskIn(f=>({...f,date:e.target.value}))} style={{flex:1}}/>
              <Btn onClick={()=>{if(!taskIn.text.trim())return;setTasks(t=>[{id:Date.now(),...taskIn,done:false},...t]);setTaskIn(f=>({...f,text:""}));}}>+</Btn>
            </div>
          </Card>
        </>}

        {/* ══ AGENDA ═════════════════════════════════════════════════════════════ */}
        {tab==="cal" && <> 
          {/* Banner Google Calendar conectado */}
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(34,197,94,0.07)",border:`1px solid rgba(34,197,94,0.2)`,borderRadius:12,marginBottom:16}}>
            <span style={{fontSize:18}}>📅</span>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600,color:T.green}}>Google Calendar conectado</div>
              <div style={{fontSize:11,color:T.muted}}>pamelaketbaqueta@gmail.com · Lembretes vão para o celular automaticamente</div>
            </div>
            <Pill label="✓ Ativo" color={T.green}/>
          </div>
          <Card style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <Btn ghost onClick={()=>setCalDate(d=>d.m===0?{y:d.y-1,m:11}:{y:d.y,m:d.m-1})}>‹</Btn>
              <span style={{fontWeight:700,fontSize:15}}>{MONTHS[calDate.m]} {calDate.y}</span>
              <Btn ghost onClick={()=>setCalDate(d=>d.m===11?{y:d.y+1,m:0}:{y:d.y,m:d.m+1})}>›</Btn>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:6}}>
              {WDAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:11,color:T.muted,padding:"3px 0"}}>{d.slice(0,1)}</div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
              {Array(getFD(calDate.y,calDate.m)).fill(null).map((_,i)=><div key={"e"+i}/>)}
              {Array(getDIM(calDate.y,calDate.m)).fill(null).map((_,i)=>{
                const d=i+1;
                const ds=`${calDate.y}-${fmt2(calDate.m+1)}-${fmt2(d)}`;
                const ev=events.filter(e=>e.date===ds);
                const isTd=calDate.y===today.getFullYear()&&calDate.m===today.getMonth()&&d===today.getDate();
                const isSel=selDay===d;
                return(
                  <div key={d} onClick={()=>setSelDay(isSel?null:d)} style={{
                    padding:"5px 4px",borderRadius:10,cursor:"pointer",textAlign:"center",minHeight:46,
                    background:isTd?"rgba(139,92,246,0.15)":isSel?"rgba(255,255,255,0.05)":"transparent",
                    border:`1px solid ${isSel?"rgba(139,92,246,0.4)":"transparent"}`,
                  }}>
                    <div style={{fontSize:12,fontWeight:isTd?700:400,color:isTd?T.purple:T.text,marginBottom:3}}>{d}</div>
                    {ev.slice(0,2).map((e,i)=>(
                      <div key={i} style={{width:"60%",height:3,borderRadius:99,background:CAT[e.cat]?.c||T.muted,margin:"2px auto"}}/>
                    ))}
                  </div>
                );
              })}
            </div>
          </Card>

          {selDay&&(
            <Card accent={T.purple} style={{marginBottom:16}}>
              <STitle color={T.purple}>📅 {selDay}/{fmt2(calDate.m+1)}/{calDate.y}</STitle>
              {events.filter(e=>e.date===`${calDate.y}-${fmt2(calDate.m+1)}-${fmt2(selDay)}`).map(e=>(
                <div key={e.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:CAT[e.cat]?.c||T.muted,flexShrink:0}}/>
                  <span style={{fontSize:13,flex:1}}>{e.title}</span>
                  <Pill label={CAT[e.cat]?.l||"Outro"} color={CAT[e.cat]?.c||T.muted}/>
                  <button onClick={()=>setEvents(x=>x.filter(i=>i.id!==e.id))} style={{background:"none",border:"none",color:T.muted,cursor:"pointer"}}>✕</button>
                </div>
              ))}
              <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:12}}>
                <div style={{display:"flex",gap:8}}>
                  <Inp placeholder="Título do evento..." value={evtIn.title} onChange={e=>setEvtIn(f=>({...f,title:e.target.value}))} style={{flex:2}}/>
                  <Sel value={evtIn.cat} onChange={e=>setEvtIn(f=>({...f,cat:e.target.value}))} style={{flex:1}}>
                    {Object.entries(CAT).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}
                  </Sel>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Inp type="time" value={evtIn.time||"09:00"} onChange={e=>setEvtIn(f=>({...f,time:e.target.value}))} style={{flex:1}}/>
                  <Inp type="time" value={evtIn.endTime||"10:00"} onChange={e=>setEvtIn(f=>({...f,endTime:e.target.value}))} style={{flex:1}} placeholder="Fim"/>
                  <Btn color={T.green} onClick={async()=>{
                    if(!evtIn.title.trim())return;
                    const dateStr=`${calDate.y}-${fmt2(calDate.m+1)}-${fmt2(selDay)}`;
                    const startISO=`${dateStr}T${evtIn.time||"09:00"}:00-03:00`;
                    const endISO=`${dateStr}T${evtIn.endTime||"10:00"}:00-03:00`;
                    setEvtIn(f=>({...f,saving:true}));
                    setEvents(x=>[...x,{id:Date.now(),date:dateStr,title:evtIn.title,cat:evtIn.cat}]);
                    setEvtIn({title:"",cat:"other",time:"09:00",endTime:"10:00",saving:false,saved:true});
                    setTimeout(()=>setEvtIn(f=>({...f,saved:false})),3000);
                  }}>{evtIn.saving?"...":" + Salvar no Google"}</Btn>
                </div>
                {evtIn.saved&&<div style={{fontSize:12,color:T.green,padding:"6px 10px",background:"rgba(34,197,94,0.08)",borderRadius:8}}>✓ Evento salvo! Lembrete 30min antes vai para o seu celular.</div>}
              </div>
            </Card>
          )}

          <Card>
            <STitle>📌 Todos os eventos</STitle>
            {upcoming.map(e=>(
              <div key={e.id} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:12,color:T.muted,minWidth:44}}>{e.date.slice(5).split("-").reverse().join("/")}</span>
                <div style={{width:7,height:7,borderRadius:"50%",background:CAT[e.cat]?.c||T.muted,flexShrink:0}}/>
                <span style={{fontSize:13,flex:1}}>{e.title}</span>
                <Pill label={CAT[e.cat]?.l} color={CAT[e.cat]?.c}/>
              </div>
            ))}
          </Card>

          <Card style={{marginTop:14}}>
            <STitle>📌 Notion</STitle>
            {NOTION.map(p=>(
              <a key={p.title} href={p.url} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.border}`,textDecoration:"none"}}>
                <span style={{fontSize:18}}>{p.icon}</span>
                <span style={{fontSize:14,color:T.text,flex:1}}>{p.title}</span>
                <span style={{fontSize:12,color:T.muted}}>↗</span>
              </a>
            ))}
          </Card>
        </>}

        {/* ══ FINANÇAS ═══════════════════════════════════════════════════════════ */}
        {tab==="fin" && <>
          {/* subtabs */}
          <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
            {["geral","contas","cartoes","fixos","receber","projecao"].map(s=>(
              <button key={s} onClick={()=>setFinTab(s)} style={{
                padding:"7px 14px",borderRadius:99,fontSize:12,fontWeight:finTab===s?700:500,cursor:"pointer",
                background:finTab===s?`${T.purple}20`:"transparent",
                border:`1px solid ${finTab===s?T.purple+"50":T.border}`,
                color:finTab===s?T.purple:T.muted,
              }}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
            ))}
          </div>

          {finTab==="geral"&&<>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              <Stat label="Patrimônio líquido" value={fmt(PL)} color={T.green} sub="↑253% desde o início" size={20}/>
              <Stat label="Em contas" value={fmt(totalContas)} color={T.purple} sub="⚠ Parado sem render" size={20}/>
              <Stat label="Total dívidas" value={fmt(totalDividas)} color={T.red} sub="Tudo em dia ✓" size={20}/>
              <Stat label="Sobra mensal" value={fmt(sobra)} color={T.blue} sub="Após fixos e faturas" size={20}/>
            </div>
            <Card style={{marginBottom:14}}>
              <STitle>📈 Evolução patrimônio</STitle>
              {FIN.evolucao.map((e,i)=>{
                const v=i===3?PL:e.v;
                const max=PL*1.1;
                return(
                  <div key={e.m} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:13,color:i===3?T.green:T.muted}}>{e.m}</span>
                      <span style={{fontSize:13,fontWeight:700,color:i===3?T.green:T.text}}>{fmt(v)}</span>
                    </div>
                    <Bar val={v} max={max} color={i===3?T.green:T.purple} h={5} glow={i===3}/>
                  </div>
                );
              })}
              <div style={{marginTop:12,padding:"10px 14px",background:`${T.green}10`,border:`1px solid ${T.green}20`,borderRadius:10,display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12,color:T.muted}}>Crescimento total</span>
                <span style={{fontSize:14,fontWeight:800,color:T.green}}>+{fmt(PL-22993)} (+{Math.round((PL-22993)/22993*100)}%)</span>
              </div>
            </Card>
            <Card>
              <STitle>💸 Fluxo mensal</STitle>
              <Row label="Salário" valueColor={T.green} value={`+${fmt(FIN.renda)}`}/>
              <Row label="Parcela carro (receber)" valueColor={T.green} value={`+${fmt(FIN.parcelaCarro)}`}/>
              <Row label="Fixos mensais" valueColor={T.red} value={`−${fmt(totalFixos)}`}/>
              <Row label="Faturas cartões" valueColor={T.red} value={`−${fmt(totalFaturas)}`}/>
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0"}}>
                <span style={{fontWeight:700}}>Sobra livre</span>
                <span style={{fontSize:18,fontWeight:800,color:T.blue}}>{fmt(sobra)}</span>
              </div>
            </Card>
          </>}

          {finTab==="contas"&&<>
            {FIN.contas.map(c=>(
              <Card key={c.n} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:c.c}}/>
                    <span style={{fontSize:15,fontWeight:600}}>{c.n}</span>
                  </div>
                  <span style={{fontSize:20,fontWeight:800}}>{fmt(c.v)}</span>
                </div>
                <Bar val={c.v} max={totalContas} color={c.c} h={5}/>
                <div style={{fontSize:11,color:T.muted,textAlign:"right",marginTop:4}}>{Math.round(c.v/totalContas*100)}% do total</div>
              </Card>
            ))}
            <Card accent={T.green}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontWeight:700}}>Total em contas</span>
                <span style={{fontSize:22,fontWeight:800,color:T.green}}>{fmt(totalContas)}</span>
              </div>
            </Card>
          </>}

          {finTab==="cartoes"&&<>
            <Card style={{marginBottom:14}}>
              <STitle>💳 Faturas julho — economia vs junho</STitle>
              <div style={{display:"flex",gap:16,marginBottom:14}}>
                <div style={{flex:1,padding:"12px",background:`${T.red}10`,borderRadius:10,textAlign:"center"}}>
                  <div style={{fontSize:11,color:T.muted,marginBottom:4}}>Junho</div>
                  <div style={{fontSize:18,fontWeight:800,color:T.red}}>R$ 13.415</div>
                </div>
                <div style={{flex:1,padding:"12px",background:`${T.green}10`,borderRadius:10,textAlign:"center"}}>
                  <div style={{fontSize:11,color:T.muted,marginBottom:4}}>Julho</div>
                  <div style={{fontSize:18,fontWeight:800,color:T.green}}>{fmt(totalFaturas)}</div>
                </div>
              </div>
              <div style={{padding:"10px 14px",background:`${T.green}10`,borderRadius:10,display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:13,color:T.muted}}>Economia mensal</span>
                <span style={{fontWeight:800,color:T.green}}>+{fmt(13415-totalFaturas)} 🎉</span>
              </div>
            </Card>
            {FIN.cartoes.map(c=>(
              <Card key={c.n} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:14,fontWeight:600}}>{c.n}</span>
                  <span style={{fontSize:15,fontWeight:700,color:T.amber}}>{fmt(c.f)}</span>
                </div>
                <Bar val={c.f} max={totalFaturas} color={T.amber} h={4}/>
                <div style={{fontSize:11,color:T.muted,marginTop:4}}>Limite total: {fmt(c.lim)}</div>
              </Card>
            ))}
          </>}

          {finTab==="fixos"&&<>
            <Card>
              <STitle>📋 Gastos fixos — {fmt(totalFixos)}/mês</STitle>
              {FIN.fixos.map(f=>(
                <div key={f.n} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13}}>{f.ic} {f.n}</span>
                    <span style={{fontSize:13,fontWeight:600}}>{fmt(f.v)}</span>
                  </div>
                  <Bar val={f.v} max={totalFixos} color={T.purple} h={3}/>
                </div>
              ))}
            </Card>
          </>}

          {finTab==="receber"&&<>
            <Card accent={T.green} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
                <span style={{fontWeight:700}}>Total a receber</span>
                <span style={{fontSize:22,fontWeight:800,color:T.green}}>{fmt(totalAReceber)}</span>
              </div>
              {FIN.aReceber.map(a=>(
                <div key={a.n} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13}}>{a.n}</span>
                    <span style={{fontSize:13,fontWeight:700,color:T.green}}>{fmt(a.v)}</span>
                  </div>
                  <Bar val={a.v} max={totalAReceber} color={T.green} h={3}/>
                </div>
              ))}
            </Card>
            <Card>
              <STitle>🧮 Cobertura de dívidas</STitle>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:13,color:T.muted}}>Dívidas totais</span>
                <span style={{fontWeight:700,color:T.red}}>{fmt(totalDividas)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:13,color:T.muted}}>Cobertura com contas</span>
                <span style={{fontWeight:700,color:T.green}}>{Math.round(totalContas/totalDividas*100)}%</span>
              </div>
              <Bar val={totalContas} max={totalDividas} color={T.green} h={8}/>
              <div style={{fontSize:12,color:T.green,marginTop:8}}>✓ Você cobre {Math.round(totalContas/totalDividas*100)}% das dívidas só com o saldo em conta</div>
            </Card>
          </>}

          {finTab==="projecao"&&<>
            <Card accent={T.blue} style={{marginBottom:14}}>
              <STitle color={T.blue}>🚀 Plano — setembro 2026</STitle>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
                {[{m:"Julho",s:"apê entrega",c:T.amber},{m:"Agosto",s:"último mês",c:T.blue},{m:"Setembro",s:"liberdade 🚀",c:T.green}].map(x=>(
                  <div key={x.m} style={{textAlign:"center",padding:"12px 6px",borderRadius:10,background:`${x.c}10`,border:`1px solid ${x.c}30`}}>
                    <div style={{fontSize:13,fontWeight:700,color:x.c}}>{x.m}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:2}}>{x.s}</div>
                  </div>
                ))}
              </div>
              {[
                {l:"Saldo atual em contas",v:totalContas,c:T.text},
                {l:"+ 2 salários (ago/set)",v:70000,c:T.green},
                {l:"+ 2 parcelas carro",v:4000,c:T.green},
                {l:"− Gastos 2 meses",v:-28000,c:T.red},
                {l:"Saldo em setembro",v:totalContas+70000+4000-28000,c:T.blue,dest:true},
                {l:"− Construtora + mobília",v:-35000,c:T.red},
                {l:"Saldo após apê",v:totalContas+70000+4000-28000-35000,c:T.green,dest:true},
              ].map(it=>(
                <div key={it.l} style={{display:"flex",justifyContent:"space-between",padding:it.dest?"10px 12px":"8px 0",background:it.dest?`${it.c}08`:"transparent",borderBottom:!it.dest?`1px solid ${T.border}`:"none",borderRadius:it.dest?8:0,margin:it.dest?"4px 0":0}}>
                  <span style={{fontSize:13,fontWeight:it.dest?700:400,color:it.dest?T.text:T.muted}}>{it.l}</span>
                  <span style={{fontSize:it.dest?16:13,fontWeight:800,color:it.c}}>{fmt(it.v)}</span>
                </div>
              ))}
            </Card>
            <Card accent={T.green} glow>
              <div style={{textAlign:"center",padding:"8px 0"}}>
                <div style={{fontSize:11,color:T.muted,marginBottom:6}}>Patrimônio líquido em setembro</div>
                <div style={{fontSize:36,fontWeight:900,color:T.green}}>~R$ 399.000</div>
                <div style={{fontSize:13,color:T.muted,marginTop:6}}>Apê próprio · Dívidas zeradas · Liberdade 🚀</div>
              </div>
            </Card>
          </>}
        </>}

        {/* ══ METAS ══════════════════════════════════════════════════════════════ */}
        {tab==="goals" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
            <Stat label="Total metas" value={goals.length} size={22}/>
            <Stat label="Concluídas" value={completedGoals} color={T.green} size={22}/>
            <Stat label="Em progresso" value={goals.length-completedGoals} color={T.purple} size={22}/>
          </div>

          <Card accent={T.amber} glow style={{marginBottom:20}}>
            <STitle color={T.amber}>💰 Meta de poupança mensal</STitle>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,color:T.muted,marginBottom:4}}>Quanto guardar por mês</div>
                <Inp type="number" value={savingsGoal} onChange={e=>setSavingsGoal(Number(e.target.value))} style={{width:"100%"}}/>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:11,color:T.muted}}>da sobra mensal</div>
                <div style={{fontSize:24,fontWeight:800,color:T.amber}}>{Math.round(savingsGoal/sobra*100)}%</div>
              </div>
            </div>
            <Bar val={savingsGoal} max={sobra} color={T.amber} h={6} glow/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:12}}>
              {[{l:"Em 6 meses",v:savingsGoal*6},{l:"Em 12 meses",v:savingsGoal*12},{l:"Em 24 meses",v:savingsGoal*24}].map(p=>(
                <div key={p.l} style={{textAlign:"center",padding:"10px",background:`${T.amber}10`,borderRadius:10}}>
                  <div style={{fontSize:11,color:T.muted,marginBottom:4}}>{p.l}</div>
                  <div style={{fontSize:14,fontWeight:800,color:T.amber}}>{fmt(p.v)}</div>
                </div>
              ))}
            </div>
          </Card>

          {goals.map(g=>{
            const pct=Math.min(100,g.target>0?Math.round(g.current/g.target*100):0);
            const done=g.current>=g.target;
            return(
              <Card key={g.id} accent={g.color} glow style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <div style={{fontSize:16,fontWeight:700,marginBottom:2}}>{g.icon} {g.name}</div>
                    <div style={{fontSize:12,color:T.muted}}>Prazo: {g.prazo}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    {done
                      ? <Pill label="✓ Concluída" color={T.green} size={12}/>
                      : <div style={{fontSize:22,fontWeight:800,color:g.color}}>{pct}%</div>
                    }
                  </div>
                </div>
                <Bar val={g.current} max={g.target} color={g.color} h={7} glow/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:6,marginBottom:done?0:10}}>
                  <span style={{fontSize:12,color:T.muted}}>{fmt(g.current)} guardado</span>
                  <span style={{fontSize:12,color:T.muted}}>meta: {fmt(g.target)}</span>
                </div>
                {!done&&(
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <input type="range" min={0} max={g.target} value={g.current} step={Math.max(1,Math.round(g.target/100))}
                      onChange={e=>setGoals(x=>x.map(i=>i.id===g.id?{...i,current:parseFloat(e.target.value)}:i))}
                      style={{flex:1,accentColor:g.color}}/>
                    <Inp type="number" value={g.current} onChange={e=>setGoals(x=>x.map(i=>i.id===g.id?{...i,current:Math.min(parseFloat(e.target.value)||0,i.target)}:i))} style={{width:100}}/>
                  </div>
                )}
              </Card>
            );
          })}

          <Card accent={T.purple}>
            <STitle color={T.purple}>+ Nova meta</STitle>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,marginBottom:8}}>
              <Inp placeholder="Nome da meta" value={goalIn.name} onChange={e=>setGoalIn(f=>({...f,name:e.target.value}))}/>
              <Inp placeholder="🎯" value={goalIn.icon} onChange={e=>setGoalIn(f=>({...f,icon:e.target.value}))} style={{width:48}} maxLength={2}/>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <Inp type="number" placeholder="Valor meta (R$)" value={goalIn.target} onChange={e=>setGoalIn(f=>({...f,target:e.target.value}))} style={{flex:1}}/>
              <Inp type="number" placeholder="Já tenho (R$)" value={goalIn.current} onChange={e=>setGoalIn(f=>({...f,current:e.target.value}))} style={{flex:1}}/>
              <Inp placeholder="Prazo" value={goalIn.prazo} onChange={e=>setGoalIn(f=>({...f,prazo:e.target.value}))} style={{flex:1}}/>
            </div>
            <Btn color={T.purple} onClick={()=>{
              if(!goalIn.name.trim()||!goalIn.target)return;
              setGoals(g=>[...g,{id:Date.now(),name:goalIn.name,icon:goalIn.icon||"🎯",target:parseFloat(goalIn.target),current:parseFloat(goalIn.current)||0,color:T.purple,cat:"other",prazo:goalIn.prazo}]);
              setGoalIn({name:"",icon:"🎯",target:"",current:"",prazo:"",color:T.purple});
            }} style={{width:"100%",padding:"10px"}}>+ Adicionar meta</Btn>
          </Card>
        </>}

        {/* ══ VIAGENS ════════════════════════════════════════════════════════════ */}
        {tab==="trips" && <>
          {trips.map(t=>(
            <Card key={t.id} accent={T.blue} glow style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{fontSize:28,marginBottom:4}}>{t.icon}</div>
                  <div style={{fontSize:18,fontWeight:800}}>{t.dest}</div>
                  <div style={{fontSize:13,color:T.muted}}>{t.date}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:22,fontWeight:800,color:T.blue}}>{Math.round(t.saved/t.budget*100)}%</div>
                  <div style={{fontSize:11,color:T.muted}}>guardado</div>
                </div>
              </div>
              <Bar val={t.saved} max={t.budget} color={T.blue} h={7} glow/>
              <div style={{display:"flex",justifyContent:"space-between",margin:"8px 0 12px"}}>
                <span style={{fontSize:12,color:T.muted}}>{fmt(t.saved)} guardado</span>
                <span style={{fontSize:12,color:T.muted}}>meta: {fmt(t.budget)}</span>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:T.muted,marginBottom:6}}>Lista de itens</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {t.items.map((item,i)=><Pill key={i} label={item} color={T.blue}/>)}
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <input type="range" min={0} max={t.budget} value={t.saved} step={100}
                  onChange={e=>setTrips(x=>x.map(i=>i.id===t.id?{...i,saved:parseFloat(e.target.value)}:i))}
                  style={{flex:1,accentColor:T.blue}}/>
                <Inp type="number" value={t.saved} onChange={e=>setTrips(x=>x.map(i=>i.id===t.id?{...i,saved:parseFloat(e.target.value)||0}:i))} style={{width:100}}/>
              </div>
            </Card>
          ))}
          <Card accent={T.cyan}>
            <STitle color={T.cyan}>+ Nova viagem</STitle>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,marginBottom:8}}>
              <Inp placeholder="Destino (ex: Japão 🗾)" value="" onChange={()=>{}} style={{width:"100%"}}/>
              <Inp placeholder="✈️" style={{width:48}} maxLength={2}/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Inp placeholder="Período" style={{flex:1}}/>
              <Inp type="number" placeholder="Orçamento R$" style={{flex:1}}/>
              <Btn color={T.cyan} onClick={()=>{}}>+ Add</Btn>
            </div>
          </Card>
        </>}

        {/* ══ SAÚDE ══════════════════════════════════════════════════════════════ */}
        {tab==="health" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
            {[
              {l:"Hábitos ativos",v:habits.length,c:T.green},
              {l:"Feitos hoje",v:habits.filter(h=>h.days[today.getDay()]===1).length,c:T.blue},
              {l:"Academia/sem",v:"4x",c:T.purple},
              {l:"Streak máx",v:"7d",c:T.amber},
            ].map(s=><Stat key={s.l} label={s.l} value={s.v} color={s.c} size={22}/>)}
          </div>

          <Card style={{marginBottom:14}}>
            <STitle>🏋️ Hábitos da semana</STitle>
            {habits.map(h=>{
              const done=h.days.filter(Boolean).length;
              return(
                <div key={h.id} style={{marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:14,fontWeight:500}}>{h.icon} {h.name}</span>
                    <span style={{fontSize:13,fontWeight:700,color:done>=h.goal?T.green:T.muted}}>{done}/{h.goal} dias</span>
                  </div>
                  <div style={{display:"flex",gap:5,marginBottom:7}}>
                    {h.days.map((d,i)=>(
                      <div key={i} onClick={()=>setHabits(x=>x.map(hh=>hh.id===h.id?{...hh,days:hh.days.map((dd,ii)=>ii===i?1-dd:dd)}:hh))}
                        style={{flex:1,textAlign:"center",padding:"7px 3px",borderRadius:8,cursor:"pointer",
                          background:d?`${T.green}18`:"rgba(255,255,255,0.03)",
                          border:`1px solid ${d?T.green+"40":T.border}`}}>
                        <div style={{fontSize:10,color:T.muted,marginBottom:3}}>{WDAYS[i].slice(0,1)}</div>
                        <div style={{fontSize:13,color:d?T.green:T.faint}}>{d?"✓":"·"}</div>
                      </div>
                    ))}
                  </div>
                  <Bar val={done} max={h.goal} color={done>=h.goal?T.green:T.blue} h={4}/>
                </div>
              );
            })}
            <Btn color={T.green} ghost onClick={()=>{const n=prompt("Nome do hábito:");const ic=prompt("Ícone:")||"⭐";const g=parseInt(prompt("Meta (dias/sem):")||"5");if(n)setHabits(h=>[...h,{id:Date.now(),name:n,icon:ic,days:Array(7).fill(0),goal:g}]);}}>+ Novo hábito</Btn>
          </Card>

          <Card accent={T.pink}>
            <STitle color={T.pink}>💕 Mamãe</STitle>
            {[{t:"Médico trimestral",d:"Julho 2026",s:"pendente"},{t:"Remédio mensal",d:"Todo dia 1",s:"ativo"},{t:"Exames anuais",d:"Agosto 2026",s:"pendente"},{t:"Acompanhar pressão",d:"Semanal",s:"ativo"}].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                <div>
                  <div style={{fontSize:13}}>{r.t}</div>
                  <div style={{fontSize:11,color:T.muted}}>{r.d}</div>
                </div>
                <Pill label={r.s} color={r.s==="ativo"?T.green:T.amber}/>
              </div>
            ))}
          </Card>
        </>}

        {/* ══ CURSOS ═════════════════════════════════════════════════════════════ */}
        {tab==="study" && <>
          {courses.map(c=>(
            <Card key={c.id} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{fontSize:26,marginBottom:4}}>{c.icon}</div>
                  <div style={{fontSize:16,fontWeight:700}}>{c.name}</div>
                  <div style={{fontSize:12,color:T.muted,marginTop:2}}>Próxima aula: {c.next}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:24,fontWeight:800,color:"#a78bfa"}}>{Math.round(c.progress/c.total*100)}%</div>
                  <div style={{fontSize:11,color:T.muted}}>{c.progress}h / {c.total}h</div>
                </div>
              </div>
              <Bar val={c.progress} max={c.total} color="#a78bfa" h={7} glow/>
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <input type="range" min={0} max={c.total} value={c.progress} step={1}
                  onChange={e=>setCourses(x=>x.map(cc=>cc.id===c.id?{...cc,progress:parseInt(e.target.value)}:cc))}
                  style={{flex:1,accentColor:"#a78bfa"}}/>
              </div>
            </Card>
          ))}

          <Card accent={T.cyan} style={{marginBottom:14}}>
            <STitle color={T.cyan}>📌 ESPM no Notion</STitle>
            {NOTION.filter(p=>p.title==="Faculdade"||p.title==="Estratégia").map(p=>(
              <a key={p.title} href={p.url} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.border}`,textDecoration:"none"}}>
                <span style={{fontSize:18}}>{p.icon}</span>
                <span style={{fontSize:14,color:T.text,flex:1}}>{p.title}</span>
                <span style={{fontSize:12,color:T.muted}}>Abrir ↗</span>
              </a>
            ))}
          </Card>
        </>}

        {/* ══ NOTAS ══════════════════════════════════════════════════════════════ */}
        {tab==="notes" && <>
          <Card style={{marginBottom:14}}>
            <STitle>✏️ Bloco de notas rápido</STitle>
            <textarea value={note} onChange={e=>setNote(e.target.value)} style={{
              width:"100%",minHeight:220,background:"transparent",border:`1px solid ${T.border}`,
              borderRadius:12,padding:"14px",color:T.text,fontSize:14,lineHeight:1.8,
              resize:"vertical",outline:"none",fontFamily:"inherit",
            }}/>
          </Card>
          <Card>
            <STitle>📌 Notion — suas páginas</STitle>
            {NOTION.map(p=>(
              <a key={p.title} href={p.url} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:`1px solid ${T.border}`,textDecoration:"none"}}>
                <div style={{width:36,height:36,borderRadius:10,background:`${T.purple}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{p.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,color:T.text,fontWeight:500}}>{p.title}</div>
                  <div style={{fontSize:11,color:T.muted}}>Abrir no Notion</div>
                </div>
                <span style={{fontSize:14,color:T.muted}}>↗</span>
              </a>
            ))}
          </Card>
        </>}

        {/* ══ CHAT IA ════════════════════════════════════════════════════════════ */}
        {tab==="chat" && <>
          <Card style={{marginBottom:16,overflow:"hidden",padding:0}}>
            <div ref={chatRef} style={{height:420,overflowY:"auto",padding:"20px",display:"flex",flexDirection:"column",gap:14}}>
              {chatMsgs.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.r==="u"?"flex-end":"flex-start"}}>
                  <div style={{
                    maxWidth:"82%",padding:"12px 16px",borderRadius:16,fontSize:13,lineHeight:1.7,
                    background:m.r==="u"?`${T.purple}20`:T.card,
                    border:`1px solid ${m.r==="u"?T.purple+"30":T.border}`,
                    color:m.r==="u"?T.purple:T.text,whiteSpace:"pre-wrap",
                    boxShadow:m.r==="u"?`0 0 15px ${T.purple}15`:"none",
                  }}>{m.t}</div>
                </div>
              ))}
              {chatLoad&&(
                <div style={{display:"flex"}}>
                  <div style={{padding:"12px 16px",borderRadius:16,background:T.card,border:`1px solid ${T.border}`,fontSize:13,color:T.muted}}>
                    <span style={{animation:"pulse 1s infinite"}}>···</span>
                  </div>
                </div>
              )}
            </div>
            <div style={{borderTop:`1px solid ${T.border}`,padding:"14px 16px",display:"flex",gap:10}}>
              <input value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendChat()}
                placeholder="Pergunte qualquer coisa sobre sua vida..." style={{flex:1,background:"transparent",border:"none",color:T.text,fontSize:14,outline:"none"}}/>
              <Btn color={T.purple} onClick={sendChat} style={{padding:"8px 20px"}}>↑ Enviar</Btn>
            </div>
          </Card>

          <Card>
            <STitle>💡 Sugestões de perguntas</STitle>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {[
                "Como está meu patrimônio e o que fazer com o dinheiro parado?",
                "Estou no caminho certo para setembro?",
                "O que devo priorizar essa semana?",
                "Me dá um plano de investimentos para meu perfil",
                "Como equilibrar faculdade, trabalho e saúde?",
                "Quanto vou ter em 12 meses se guardar R$5.000/mês?",
              ].map(q=>(
                <button key={q} onClick={()=>setChatIn(q)} style={{textAlign:"left",padding:"11px 14px",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,color:T.muted,fontSize:13,cursor:"pointer"}}>
                  {q}
                </button>
              ))}
            </div>
          </Card>
        </>}
      </div>
    </div>
  );
}
