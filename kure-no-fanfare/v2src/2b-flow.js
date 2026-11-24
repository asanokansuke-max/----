/* =========================================================
   レース展開のバリエーション: ペースと隊形（単騎・競り合い・大逃げ・押し出し）に加えて、
   ・馬場の傾向: 内が止まらない／外差しが決まる（雨や開催の進み具合で）
   ・流れ: スローの瞬発力勝負（切れる脚が物を言う）／ハイペースの消耗戦（スタミナと根性）
   ・まくり: 長い距離で、後ろの馬が3コーナーから一気に上がっていく（スタミナがあれば決まる）
   ・内ラチ突き: 内枠の先行・差し馬が、ロスなく内を突く
   レースの計算（着順）のすぐあと、写真判定・事故の判定より前に入る。実況もこれを読む（RC.flow）。
   ========================================================= */
function flowApply(RC){const fr=RC.field,race=RC.race||{},D=race.dist||1600,n=fr.length;if(!n||RC.flowDone)return;RC.flowDone=1;
  const stat=(f,k)=>{const s=f.h&&f.h.st;return s&&s[k]!=null?s[k]:64+hash(f.name+k)*16;};
  const fl={};const b=hash((race.name||'')+S.t+'bias');
  if(race.going&&race.going!=='良'&&b<.45)fl.bias='外';else if(b<.16)fl.bias='内';else if(b<.28)fl.bias='外';
  if(RC.pace==='スロー'&&D>=1600&&R()<.55)fl.tempo='瞬発力勝負';else if(RC.pace==='ハイ'&&R()<.6)fl.tempo='消耗戦';
  if(D>=1800&&R()<.22){const c=fr.filter(f=>f.used==='差し'||f.used==='追込').sort((a,b)=>stat(b,'sta')-stat(a,'sta'))[0];if(c)fl.makuri=c.no;}
  if(R()<.25){const c=fr.filter(f=>(f.used==='先行'||f.used==='差し')&&f.no<=Math.ceil(n/3)&&f.no!==fl.makuri);if(c.length)fl.rail=pick(c).no;}
  fr.forEach(f=>{let a=0;
    if(fl.bias==='内')a+=({逃げ:.6,先行:.5,差し:-.2,追込:-.5}[f.used]||0)+(f.no<=n/3?.4:f.no>n*2/3?-.3:0);
    if(fl.bias==='外')a+=({逃げ:-.6,先行:-.3,差し:.4,追込:.7}[f.used]||0);
    if(fl.tempo==='瞬発力勝負')a+=(stat(f,'kick')-72)*.05;
    if(fl.tempo==='消耗戦')a+=((stat(f,'sta')+stat(f,'guts'))/2-72)*.05;
    if(fl.makuri===f.no)a+=stat(f,'sta')>=75?1.6:-.4;
    if(fl.rail===f.no)a+=1;
    f.perf+=a;f.flowAdj=a;});
  RC.flow=fl;
  const ord=[...fr].sort((a,b)=>b.perf-a.perf);
  ord.forEach((f,i)=>{f.pos=i+1;f.gapL=i?(ord[0].perf-f.perf)*.3:0;f.margin=i?marginStr((ord[i-1].perf-f.perf)*.3):'';});
  RC.order=ord;const w=ord[0];const v=16.2+(race.mean-60)*.035+(w.perf-race.mean)*.02-(race.surf==='ダ'?.6:0)-(race.going==='重'?.25:0);RC.time=race.dist/v;}
runSim=(o=>function(RC){const r=o.apply(this,arguments);try{flowApply(RC);}catch(e){console.error('flow',e);}return r;})(runSim);
