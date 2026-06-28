"use client";
import{useState,useEffect,useCallback}from"react";
import Link from"next/link";
import{LogoIcon}from"@/components/ui/Logo";
const WHATSAPP_NUMBER="5511946851028";
const LEAD_ENDPOINT="/api/unicornio/lead";
const LS_ANSWERS_KEY="raiox_unicornio_answers";
const LS_PENDING_KEY="raiox_unicornio_pending_lead";
const LEVERS=["Posicionamento","Oferta","Modelo de Dinheiro","Marca & Prova","Aquisição","Experiência","Sistemas"]as const;
const LEVER_KEYS=["posicionamento","oferta","modelo","marca","aquisicao","experiencia","sistemas"]as const;
const PRESCRIPTIONS:Record<string,string>={
  posicionamento:"Estreite até ser dono de uma palavra. Pare de ser mais um dentista.",
  oferta:"Dê nome à sua oferta, adicione garantia e um mecanismo que ninguém possa comparar no preço.",
  modelo:"Instale uma escada de valor e um plano de recorrência. Um paciente deve financiar o próximo.",
  marca:"Faça terceiros falarem por você. O que você diz sobre você é fraco; o que descobrem é forte.",
  aquisicao:"Troque o boca a boca imprevisível por um sistema: conteúdo + tráfego + funil que pré-vende.",
  experiencia:"Desenhe 3–5 momentos memoráveis e embuta o pedido de indicação no pico da jornada.",
  sistemas:"Documente e delegue até a clínica rodar sem você — é o que a torna um ativo vendável.",
};
const ARCHETYPES=[
  {min:0,max:14,name:"Clínica Commodity",interpretation:"Presa na guerra de preço. O paciente decide pelo valor porque não enxerga diferença. O caminho não é anunciar mais — é mudar de nível nas alavancas de maior poder."},
  {min:15,max:25,name:"Em Transição",interpretation:"Você já saiu do commodity puro, mas ainda compete em terreno disputado. Algumas alavancas seguram seu ticket. Corrija as 2 mais fracas e o preço deixa de ser o argumento."},
  {min:26,max:35,name:"Marca em Formação",interpretation:"Sua clínica já tem identidade e prova. Falta sistematizar para virar ativo. As alavancas fracas hoje são o que separa você do topo da categoria."},
  {min:36,max:42,name:"Clínica Unicórnio",interpretation:"Você construiu um ativo, não um emprego. O foco agora é blindar o moat e escalar. Vamos achar o último ponto de vazamento."},
]as const;
interface Question{lever:number;text:string;options:{label:string;value:number}[];}
const QUESTIONS:Question[]=[
  {lever:0,text:"Se um paciente novo descrever o que sua clínica faz, ele diz:",options:[{label:"Tratamento dentário em geral",value:0},{label:"Vários serviços, com um carro-chefe",value:1},{label:"Uma especialidade clara",value:2},{label:"Uma especialidade + um diferencial único que só eu tenho",value:3}]},
  {lever:0,text:"Quando comparam sua clínica com a do lado, a diferença é:",options:[{label:"Basicamente o preço",value:0},{label:"Atendimento ou localização",value:1},{label:"A especialização",value:2},{label:"Sou categoria à parte — não há comparação direta",value:3}]},
  {lever:1,text:"Sua oferta principal é apresentada como:",options:[{label:"Preço por procedimento (tabela)",value:0},{label:"Procedimento + facilidade de pagamento",value:1},{label:"Um pacote/resultado com nome",value:2},{label:"Um protocolo nomeado, com garantia e mecanismo próprio",value:3}]},
  {lever:1,text:"Um paciente consegue comparar sua oferta com a de outra clínica no Google?",options:[{label:"Sim, fácil — mesmo procedimento, só muda o preço",value:0},{label:"Mais ou menos",value:1},{label:"Difícil — minha oferta é diferente",value:2},{label:"Não — não existe igual no mercado",value:3}]},
  {lever:2,text:"Depois do tratamento principal, o paciente:",options:[{label:"Some / só volta se der problema",value:0},{label:"Às vezes volta",value:1},{label:"Entra numa manutenção informal",value:2},{label:"Entra num plano de recorrência/recall pago e estruturado",value:3}]},
  {lever:2,text:"Você sabe quanto custa conquistar um paciente e em quanto tempo recupera esse custo?",options:[{label:"Não faço ideia",value:0},{label:"Tenho uma noção",value:1},{label:"Sei o custo, mas não o tempo de retorno",value:2},{label:"Sei os dois e recupero em ~30 dias",value:3}]},
  {lever:3,text:"Sua prova social hoje é:",options:[{label:"Quase nenhuma / poucas avaliações",value:0},{label:"Algumas avaliações no Google",value:1},{label:"Avaliações + antes/depois organizados",value:2},{label:"Avaliações, casos e terceiros (pacientes, colegas, imprensa) falando de mim",value:3}]},
  {lever:3,text:"Pessoas recomendam você espontaneamente?",options:[{label:"Raramente",value:0},{label:"De vez em quando",value:1},{label:"Com frequência",value:2},{label:"Constantemente — indicação é meu maior canal",value:3}]},
  {lever:4,text:"Seu fluxo de novos pacientes é:",options:[{label:"Imprevisível — uns meses cheios, outros vazios",value:0},{label:"Depende do boca a boca",value:1},{label:"Tenho anúncios rodando",value:2},{label:"Tenho um sistema previsível (conteúdo + tráfego + funil que pré-vende)",value:3}]},
  {lever:4,text:"Você mede seu marketing por:",options:[{label:"Não meço",value:0},{label:"Curtidas / seguidores / views",value:1},{label:"Custo por lead",value:2},{label:"Custo por consulta agendada / paciente fechado",value:3}]},
  {lever:5,text:"A experiência do paciente na sua clínica é:",options:[{label:"Funcional — entra, trata, sai",value:0},{label:"Atendimento acima da média",value:1},{label:"Tem alguns toques memoráveis",value:2},{label:"Uma jornada desenhada, com momentos dignos de foto/comentário",value:3}]},
  {lever:5,text:"Você pede indicação de forma estruturada?",options:[{label:"Nunca",value:0},{label:"Quando lembro",value:1},{label:"Às vezes, no fim do tratamento",value:2},{label:"Sim — embutido no momento de pico da jornada",value:3}]},
  {lever:6,text:"Se você tirar 30 dias de férias, sua clínica:",options:[{label:"Para / cai muito",value:0},{label:"Funciona com dificuldade",value:1},{label:"Funciona, mas eu preciso responder coisas",value:2},{label:"Roda sozinha — processos documentados e time treinado",value:3}]},
  {lever:6,text:"Sua clínica poderia ser vendida hoje como um ativo com valor de mercado?",options:[{label:"Não — sem mim não existe",value:0},{label:"Talvez, com desconto grande",value:1},{label:"Sim, mas dependo muito de mim",value:2},{label:"Sim — é um ativo que roda sem mim",value:3}]},
];
function calcLeverScores(a:(number|null)[]):number[]{return LEVERS.map((_,li)=>(a[li*2]??0)+(a[li*2+1]??0));}
function calcTotal(s:number[]):number{return s.reduce((a,b)=>a+b,0);}
function getArchetype(t:number){return ARCHETYPES.find(a=>t>=a.min&&t<=a.max)??ARCHETYPES[0];}
function getWeakestLevers(s:number[]):[number,number]{const r=s.map((sc,i)=>({sc,i})).sort((a,b)=>a.sc-b.sc||a.i-b.i);const[a,b]=[r[0].i,r[1].i].sort((x,y)=>x-y);return[a,b];}
function buildWaLink(arch:string,score:number,weak:[number,number]):string{
  const msg="Oi Komando! Fiz o Raio-X da Clínica Unicórnio. Minha clínica ficou como "+arch+" com "+score+"/42. Minhas alavancas mais fracas: "+LEVERS[weak[0]]+" e "+LEVERS[weak[1]]+". Quero o diagnóstico completo.";
  return"https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(msg);
}
function formatPhone(v:string):string{const d=v.replace(/[^0-9]/g,"").slice(0,11);if(d.length<=2)return d;if(d.length<=6)return"("+d.slice(0,2)+") "+d.slice(2);if(d.length<=10)return"("+d.slice(0,2)+") "+d.slice(2,6)+"-"+d.slice(6);return"("+d.slice(0,2)+") "+d.slice(2,7)+"-"+d.slice(7);}
function validatePhone(v:string):boolean{const d=v.replace(/[^0-9]/g,"");return d.length>=10&&d.length<=11;}
type Win=Window&{dataLayer?:unknown[];gtag?:(...a:unknown[])=>void;fbq?:(...a:unknown[])=>void};
function fireEvent(name:string,params?:Record<string,unknown>){
  if(typeof window==="undefined")return;
  const w=window as Win;
  if(w.dataLayer)w.dataLayer.push({event:name,...params});
  if(w.gtag)w.gtag("event",name,params);
  if(w.fbq){if(name==="raiox_lead_submitted")w.fbq("track","Lead");else if(name==="raiox_completed")w.fbq("trackCustom","RaioXCompleted");}
}
function PageHeader(){return(<header className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto w-full"><Link href="/" aria-label="LK Digital" className="inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A368] rounded"><LogoIcon className="w-6 h-6" color="#C5A368"/><span className="font-display text-base font-medium text-[#EDE8DF] tracking-tight">LK Digital</span></Link><span className="hidden sm:block text-xs text-[#6E6A63] uppercase tracking-[0.15em]">Raio-X da Clínica Unicórnio™</span></header>);}
function LeverBars({scores,blurred=false}:{scores:number[];blurred?:boolean}){
  return(<div className={blurred?"blur-sm pointer-events-none select-none":""} aria-hidden={blurred}>{LEVERS.map((lever,i)=>{const score=scores[i],pct=Math.round((score/6)*100),strong=score>=4;return(<div key={lever} className="mb-4"><div className="flex justify-between items-baseline mb-1.5"><span className="text-sm font-body text-[#EDE8DF]/80">{lever}</span><span className="text-xs font-body text-[#6E6A63]">{score}/6</span></div><div className="h-1.5 bg-[#EDE8DF]/10 rounded-full overflow-hidden"><div className={"h-full rounded-full transition-all duration-700 "+(strong?"bg-[#C5A368]":"bg-[#6E6A63]")} style={{width:pct+"%"}}/></div></div>);})}</div>);
}
function IntroScreen({onStart}:{onStart:()=>void}){return(
<div className="min-h-screen flex flex-col"><PageHeader/><div className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-2xl mx-auto w-full text-center">
<p className="text-xs uppercase tracking-[0.2em] text-[#C5A368] mb-6">Auto-diagnóstico · 7 Alavancas · Resultado imediato</p>
<h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.02em] text-[#EDE8DF] mb-6">Sua clínica é uma commodity ou um ativo?</h1>
<p className="text-[#EDE8DF]/70 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">Faça o Raio-X das 7 Alavancas e descubra exatamente onde sua clínica está deixando dinheiro na mesa — e o que muda de nível.</p>
<button onClick={onStart} className="bg-[#C5A368] text-[#0F0F0F] font-semibold px-10 py-4 text-lg rounded hover:bg-[#d4b47a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A368] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F]">Começar</button>
<p className="mt-5 text-[#6E6A63] text-sm">Leva ~3 minutos · Sem custo · Resultado imediato</p>
<p className="mt-2 text-[#6E6A63] text-xs">Seus dados ficam protegidos conforme a LGPD.</p>
</div></div>);}
function QuizScreen({qi,selectedOpt,onAnswer,onBack}:{qi:number;selectedOpt:number|null;onAnswer:(v:number)=>void;onBack:()=>void}){
  const q=QUESTIONS[qi],pct=Math.round((qi/14)*100);
  return(
    <div className="min-h-screen flex flex-col">
      <div className="h-0.5 bg-[#EDE8DF]/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={"Pergunta "+(qi+1)+" de 14"}>
        <div className="h-full bg-[#C5A368] transition-all duration-300" style={{width:pct+"%"}}/></div>
      <div className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto w-full">
        <button onClick={onBack} aria-label="Voltar" className="text-[#6E6A63] hover:text-[#EDE8DF] transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A368] rounded px-1">← Voltar</button>
        <span className="text-[#6E6A63] text-sm" aria-live="polite">{qi+1} / 14</span>
      </div>
      <div key={qi} className="flex-1 flex flex-col justify-center px-6 pb-16 max-w-2xl mx-auto w-full motion-safe:animate-fade-up">
        <p className="text-xs uppercase tracking-[0.2em] text-[#C5A368] mb-3">{LEVERS[q.lever]}</p>
        <h2 className="font-display text-[clamp(1.25rem,3vw,1.875rem)] leading-[1.25] text-[#EDE8DF] mb-8">{q.text}</h2>
        <div className="flex flex-col gap-3" role="group" aria-label="Opções de resposta">
          {q.options.map((opt,i)=>{const sel=selectedOpt===opt.value;return(
            <button key={i} onClick={()=>onAnswer(opt.value)} disabled={selectedOpt!==null} aria-pressed={sel}
              className={"w-full text-left px-5 py-4 rounded-lg border text-base font-body transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A368] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0F0F0F] disabled:cursor-wait "+(sel?"border-[#C5A368] bg-[#C5A368]/15 text-[#EDE8DF]":"border-[#EDE8DF]/15 bg-[#EDE8DF]/5 text-[#EDE8DF]/80 hover:border-[#C5A368]/50 hover:bg-[#C5A368]/8 hover:text-[#EDE8DF]")}>
              {opt.label}</button>);})}</div></div></div>);
}
interface LeadForm{nome:string;clinica:string;especialidade:string;cidade:string;whatsapp:string;email:string;consent:boolean;}
function ic(e?:string){return"w-full bg-[#EDE8DF]/5 border rounded-lg px-4 py-3 text-[#EDE8DF] placeholder:text-[#6E6A63] text-base focus:outline-none focus:border-[#C5A368] transition-colors "+(e?"border-red-400":"border-[#EDE8DF]/15");}
function GateScreen({archetype,total,leverScores,leadForm,formErrors,submitting,onFormChange,onSubmit}:{
  archetype:typeof ARCHETYPES[number];total:number;leverScores:number[];leadForm:LeadForm;
  formErrors:Partial<Record<keyof LeadForm,string>>;submitting:boolean;
  onFormChange:(f:keyof LeadForm,v:string|boolean)=>void;onSubmit:(e:React.FormEvent)=>void;}){
  return(<div className="min-h-screen flex flex-col"><PageHeader/>
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-2xl mx-auto w-full">
      <div className="w-full text-center mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#C5A368] mb-3">Sua clínica</p>
        <p className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-[#EDE8DF]">{archetype.name}</p>
        <p className="text-[#6E6A63] mt-1 text-lg font-body">{total}/42 pontos</p>
      </div>
      <div className="w-full mb-8 relative">
        <div className="rounded-xl border border-[#C5A368]/20 bg-[#EDE8DF]/3 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-[#6E6A63] mb-4">7 Alavancas — diagnóstico completo</p>
          <LeverBars scores={leverScores} blurred/></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-[#0F0F0F]/75 backdrop-blur-[2px]">
          <svg className="w-8 h-8 text-[#C5A368] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          <p className="text-[#EDE8DF] font-display text-lg text-center px-6">Preencha seus dados para desbloquear o diagnóstico completo</p>
        </div></div>
      <form onSubmit={onSubmit} noValidate className="w-full flex flex-col gap-4">
        <div><label htmlFor="u-nome" className="block text-sm text-[#EDE8DF]/70 mb-1.5">Seu nome <span aria-hidden className="text-[#C5A368]">*</span></label><input id="u-nome" type="text" autoComplete="name" value={leadForm.nome} placeholder="Dr(a). João Silva" onChange={e=>onFormChange("nome",e.target.value)} aria-invalid={!!formErrors.nome} className={ic(formErrors.nome)}/>{formErrors.nome&&<p role="alert" className="text-red-400 text-xs mt-1">{formErrors.nome}</p>}</div>
        <div><label htmlFor="u-clinica" className="block text-sm text-[#EDE8DF]/70 mb-1.5">Nome da clínica <span aria-hidden className="text-[#C5A368]">*</span></label><input id="u-clinica" type="text" value={leadForm.clinica} placeholder="Clínica Odonto Exemplo" onChange={e=>onFormChange("clinica",e.target.value)} aria-invalid={!!formErrors.clinica} className={ic(formErrors.clinica)}/>{formErrors.clinica&&<p role="alert" className="text-red-400 text-xs mt-1">{formErrors.clinica}</p>}</div>
        <div><label htmlFor="u-esp" className="block text-sm text-[#EDE8DF]/70 mb-1.5">Especialidade principal <span aria-hidden className="text-[#C5A368]">*</span></label><select id="u-esp" value={leadForm.especialidade} onChange={e=>onFormChange("especialidade",e.target.value)} aria-invalid={!!formErrors.especialidade} className={ic(formErrors.especialidade)+" bg-[#1a1a1a] appearance-none "+(leadForm.especialidade?"text-[#EDE8DF]":"text-[#6E6A63]")}><option value="" disabled>Selecione…</option><option value="Implante">Implante</option><option value="Harmonização orofacial">Harmonização orofacial</option><option value="Ortodontia">Ortodontia</option><option value="Clínica geral">Clínica geral</option><option value="Outra">Outra</option></select>{formErrors.especialidade&&<p role="alert" className="text-red-400 text-xs mt-1">{formErrors.especialidade}</p>}</div>
        <div><label htmlFor="u-cidade" className="block text-sm text-[#EDE8DF]/70 mb-1.5">Cidade / região <span aria-hidden className="text-[#C5A368]">*</span> <span className="text-[#6E6A63] text-xs">(exclusividade territorial)</span></label><input id="u-cidade" type="text" value={leadForm.cidade} placeholder="São Paulo – SP" onChange={e=>onFormChange("cidade",e.target.value)} aria-invalid={!!formErrors.cidade} className={ic(formErrors.cidade)}/>{formErrors.cidade&&<p role="alert" className="text-red-400 text-xs mt-1">{formErrors.cidade}</p>}</div>
        <div><label htmlFor="u-wa" className="block text-sm text-[#EDE8DF]/70 mb-1.5">WhatsApp <span aria-hidden className="text-[#C5A368]">*</span></label><input id="u-wa" type="tel" inputMode="numeric" autoComplete="tel" value={leadForm.whatsapp} placeholder="(11) 99999-9999" onChange={e=>onFormChange("whatsapp",formatPhone(e.target.value))} aria-invalid={!!formErrors.whatsapp} className={ic(formErrors.whatsapp)}/>{formErrors.whatsapp&&<p role="alert" className="text-red-400 text-xs mt-1">{formErrors.whatsapp}</p>}</div>
        <div><label htmlFor="u-email" className="block text-sm text-[#EDE8DF]/70 mb-1.5">E-mail <span className="text-[#6E6A63] text-xs">(opcional)</span></label><input id="u-email" type="email" autoComplete="email" value={leadForm.email} placeholder="voce@clinica.com.br" onChange={e=>onFormChange("email",e.target.value)} aria-invalid={!!formErrors.email} className={ic(formErrors.email)}/>{formErrors.email&&<p role="alert" className="text-red-400 text-xs mt-1">{formErrors.email}</p>}</div>
        <div><label className="flex items-start gap-3 cursor-pointer group"><input type="checkbox" checked={leadForm.consent} onChange={e=>onFormChange("consent",e.target.checked)} aria-invalid={!!formErrors.consent} className="mt-0.5 w-4 h-4 shrink-0 accent-[#C5A368] cursor-pointer"/><span className="text-xs text-[#6E6A63] leading-relaxed group-hover:text-[#EDE8DF]/60 transition-colors">Autorizo o contato da LK Digital sobre o resultado do Raio-X. (LGPD)</span></label>{formErrors.consent&&<p role="alert" className="text-red-400 text-xs mt-1">{formErrors.consent}</p>}</div>
        <button type="submit" disabled={submitting} className="w-full bg-[#C5A368] text-[#0F0F0F] font-semibold py-4 text-base rounded-lg hover:bg-[#d4b47a] transition-colors mt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A368] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F] disabled:opacity-60 disabled:cursor-wait">{submitting?"Aguarde…":"Desbloquear meu diagnóstico →"}</button>
      </form></div></div>);}
function ResultScreen({archetype,total,leverScores,weakLevers,onCTAClick}:{
  archetype:typeof ARCHETYPES[number];total:number;leverScores:number[];weakLevers:[number,number];onCTAClick:()=>void;}){
  const waLink=buildWaLink(archetype.name,total,weakLevers);
  const isUni=archetype.name==="Clínica Unicórnio";
  return(<div className="min-h-screen flex flex-col"><PageHeader/>
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-2xl mx-auto w-full motion-safe:animate-fade-up">
      <div className="w-full text-center mb-8"><p className="text-xs uppercase tracking-[0.2em] text-[#C5A368] mb-3">Resultado</p>
        <p className="font-display text-[clamp(2rem,5vw,3rem)] leading-tight text-[#EDE8DF]">{archetype.name}</p>
        <p className="text-[#6E6A63] mt-1.5 text-2xl font-body font-medium">{total}<span className="text-base">/42</span></p></div>
      <div className="w-full rounded-xl border border-[#C5A368]/20 bg-[#EDE8DF]/3 p-5 mb-8"><p className="text-[#EDE8DF]/80 text-base leading-relaxed">{archetype.interpretation}</p></div>
      <div className="w-full mb-8"><p className="text-xs uppercase tracking-[0.15em] text-[#6E6A63] mb-4">Diagnóstico por alavanca</p><LeverBars scores={leverScores}/></div>
      {!isUni&&(<div className="w-full mb-10"><p className="text-xs uppercase tracking-[0.15em] text-[#6E6A63] mb-4">Onde está vazando dinheiro</p>
        <div className="flex flex-col gap-3">{weakLevers.map(li=>(<div key={li} className="rounded-lg border border-[#C5A368]/30 bg-[#C5A368]/5 p-4">
          <p className="text-sm font-semibold text-[#C5A368] mb-1">{LEVERS[li]}</p>
          <p className="text-[#EDE8DF]/70 text-sm leading-relaxed">{PRESCRIPTIONS[LEVER_KEYS[li]]}</p>
        </div>))}</div></div>)}
      <div className="w-full">
        <a href={waLink} target="_blank" rel="noopener noreferrer" onClick={onCTAClick}
          className="flex items-center justify-center gap-2 w-full bg-[#C5A368] text-[#0F0F0F] font-semibold py-4 text-base rounded-lg hover:bg-[#d4b47a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A368] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F]">
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.114 1.526 5.84L.057 23.489a.75.75 0 00.921.921l5.648-1.47A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.73 9.73 0 01-4.96-1.355l-.355-.211-3.674.956.977-3.564-.231-.365A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
          </svg>Quero meu diagnóstico com a LK Digital</a>
        <p className="text-center text-[#6E6A63] text-xs mt-3">Abre o WhatsApp com sua pontuação preenchida automaticamente.</p>
      </div></div></div>);}
export default function ScoreQuiz(){
  const[phase,setPhase]=useState<0|1|2|3>(0);
  const[qi,setQi]=useState(0);
  const[answers,setAnswers]=useState<(number|null)[]>(Array(14).fill(null));
  const[selectedOpt,setSelectedOpt]=useState<number|null>(null);
  const[leadForm,setLeadForm]=useState<LeadForm>({nome:"",clinica:"",especialidade:"",cidade:"",whatsapp:"",email:"",consent:false});
  const[formErrors,setFormErrors]=useState<Partial<Record<keyof LeadForm,string>>>({});
  const[submitting,setSubmitting]=useState(false);
  const leverScores=calcLeverScores(answers);
  const total=calcTotal(leverScores);
  const archetype=getArchetype(total);
  const weakLevers=getWeakestLevers(leverScores);
  useEffect(()=>{
    const saved=localStorage.getItem(LS_ANSWERS_KEY);
    if(saved){try{const parsed:(number|null)[]=JSON.parse(saved);if(Array.isArray(parsed)&&parsed.length===14){setAnswers(parsed);const fn=parsed.findIndex(a=>a===null);if(fn===-1)setPhase(2);else if(fn>0){setQi(fn);setPhase(1);}}}catch{}}
    void(async()=>{const pd=localStorage.getItem(LS_PENDING_KEY);if(!pd)return;try{const r=await fetch(LEAD_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:pd});if(r.ok)localStorage.removeItem(LS_PENDING_KEY);}catch{}})();
  },[]);
  const handleStart=useCallback(()=>{fireEvent("raiox_start");setPhase(1);},[]);
  const handleAnswer=useCallback((value:number)=>{
    if(selectedOpt!==null)return;
    setSelectedOpt(value);
    setTimeout(()=>{
      setAnswers(prev=>{const next=[...prev];next[qi]=value;localStorage.setItem(LS_ANSWERS_KEY,JSON.stringify(next));return next;});
      fireEvent("raiox_question_answered",{question_index:qi});
      setSelectedOpt(null);
      if(qi===13){fireEvent("raiox_completed");setPhase(2);}else setQi(prev=>prev+1);
    },180);
  },[qi,selectedOpt]);
  const handleBack=useCallback(()=>{if(qi===0){setPhase(0);}else{setQi(prev=>prev-1);}},[qi]);
  const handleFormChange=useCallback((field:keyof LeadForm,value:string|boolean)=>{setLeadForm(prev=>({...prev,[field]:value}));setFormErrors(prev=>({...prev,[field]:undefined}));},[]);
  const handleSubmit=useCallback(async(e:React.FormEvent)=>{
    e.preventDefault();
    const err:typeof formErrors={};
    if(!leadForm.nome.trim()||leadForm.nome.trim().length<2)err.nome="Nome é obrigatório";
    if(!leadForm.clinica.trim()||leadForm.clinica.trim().length<2)err.clinica="Nome da clínica é obrigatório";
    if(!leadForm.especialidade)err.especialidade="Selecione uma especialidade";
    if(!leadForm.cidade.trim()||leadForm.cidade.trim().length<2)err.cidade="Cidade é obrigatória";
    if(!validatePhone(leadForm.whatsapp))err.whatsapp="WhatsApp inválido — ex: (11) 99999-9999";
    if(leadForm.email&&(leadForm.email.indexOf("@")<1||!leadForm.email.includes(".")))err.email="E-mail inválido";
    if(!leadForm.consent)err.consent="Necessário para receber o resultado";
    if(Object.keys(err).length>0){setFormErrors(err);return;}
    setSubmitting(true);
    const ls=calcLeverScores(answers),tot=calcTotal(ls),arch=getArchetype(tot),weak=getWeakestLevers(ls);
    const payload={timestamp:new Date().toISOString(),nome:leadForm.nome.trim(),clinica:leadForm.clinica.trim(),especialidade:leadForm.especialidade,cidade:leadForm.cidade.trim(),whatsapp:leadForm.whatsapp.replace(/[^0-9]/g,""),email:leadForm.email.trim()||"",total:tot,arquetipo:arch.name,scores:{posicionamento:ls[0],oferta:ls[1],modelo:ls[2],marca:ls[3],aquisicao:ls[4],experiencia:ls[5],sistemas:ls[6]},alavancas_fracas:[LEVER_KEYS[weak[0]],LEVER_KEYS[weak[1]]],respostas:answers.map(a=>a??0),consent:true as const,source:"raio-x"};
    try{const r=await fetch(LEAD_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});if(!r.ok)throw new Error("HTTP "+r.status);fireEvent("raiox_lead_submitted");localStorage.removeItem(LS_PENDING_KEY);}
    catch{localStorage.setItem(LS_PENDING_KEY,JSON.stringify(payload));}
    localStorage.removeItem(LS_ANSWERS_KEY);setSubmitting(false);setPhase(3);
  },[leadForm,answers]);
  return(<div className="min-h-screen bg-[#0F0F0F] text-[#EDE8DF] font-body selection:bg-[#C5A368]/30">
    {phase===0&&<IntroScreen onStart={handleStart}/>}
    {phase===1&&<QuizScreen qi={qi} selectedOpt={selectedOpt} onAnswer={handleAnswer} onBack={handleBack}/>}
    {phase===2&&<GateScreen archetype={archetype} total={total} leverScores={leverScores} leadForm={leadForm} formErrors={formErrors} submitting={submitting} onFormChange={handleFormChange} onSubmit={handleSubmit}/>}
    {phase===3&&<ResultScreen archetype={archetype} total={total} leverScores={leverScores} weakLevers={weakLevers} onCTAClick={()=>fireEvent("raiox_cta_whatsapp_click")}/>}
  </div>);}
