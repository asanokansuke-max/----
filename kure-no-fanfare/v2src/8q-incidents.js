/* =========================================================
   レース中の出来事: 出遅れ, 落馬・競走中止, 鼻出血, 失格 (審議・降着 already happen on the board),
   and 出走取消 before the race. They change the result, the jockey's words, the news, and the 3D call.
   ========================================================= */
function incRecount(RC){const ord=RC.order,ok=ord.filter(f=>!f.out).sort((a,b)=>b.perf-a.perf),out=ord.filter(f=>f.out);
  const all=[...ok,...out];all.forEach((f,i)=>{f.pos=i+1;if(f.out){f.margin=f.out;f.gapL=Math.max(12,(ok.length?(ok[0].perf-(ok[ok.length-1].perf))*.3:0)+6);}else{f.gapL=i?(ok[0].perf-f.perf)*.3:0;f.margin=i?marginStr((ok[i-1].perf-f.perf)*.3):'';}});
  RC.order=all;try{photoCall(RC);}catch(e){}}
runSim=(o=>function(RC){const r=o.apply(this,arguments);try{if(RC.incDone)return r;RC.incDone=1;let ch=false;const n=RC.order.length;
  RC.order.forEach(f=>{
    const hot=f.temper==='気難しい';
    if(R()<.03+(hot?.04:0)){const x=2.2+R()*2.2;f.perf-=x;f.ev='出遅れ';f.late=1;ch=true;}                      // a slow start (the gates open, it doesn't)
    if(R()<.0014){f.out='中止';f.ev='競走中止';f.stop=1;ch=true;}                                                   // a fall or pulled up
    else if(R()<.0016){f.perf-=7;f.ev='鼻出血';ch=true;}                                                            // bled: stops to nothing in the straight
  });
  // a rough ride that the stewards cannot let stand: disqualified (rarer than a demotion)
  if(R()<.004){const top=RC.order.filter(f=>!f.out).sort((a,b)=>b.perf-a.perf).slice(0,5);const f=top[Math.floor(R()*top.length)];if(f){f.out='失格';f.ev='失格';ch=true;}}
  if(ch)incRecount(RC);
  }catch(e){console.error('incidents',e);}return r;})(runSim);
/* what it does to your horse and rider */
applyRace=(o=>function(RC){const r=o.apply(this,arguments);try{(RC.order||[]).filter(f=>f.mine&&f.ev).forEach(f=>{const h=f.h;if(!h)return;
  if(f.ev==='競走中止'){news(`${RC.race.name}　${h.name}は競走中止（${f.jname}騎手が落馬）`);if(f.jid&&f.jid!=='stable'&&R()<.5){const j=JK(f.jid);if(j)j.ban=Math.max(j.ban||0,S.t+1+Math.floor(R()*2));}
    if(R()<.25&&h.status==='現役'){h.status='休養';h.rest=3;}}
  if(f.ev==='鼻出血'){news(`${RC.race.name}　${h.name}は鼻出血を発症`);if(h.status==='現役'){h.status='休養';h.rest=Math.max(h.rest||0,1);}}
  if(f.ev==='失格')news(`${RC.race.name}　${h.name}は斜行により失格`);
  if(f.ev==='出遅れ'&&f.pos<=3)news(`${RC.race.name}　${h.name}、出遅れから${f.pos}着`);});}catch(e){}return r;})(applyRace);
jockeyComment=(o=>function(f){let s=o.apply(this,arguments);try{
  if(f.ev==='出遅れ')s=pick(['「ゲートで立ち遅れてしまいました。あれで流れに乗れなかった」','「スタートで後手を踏みました。申し訳ないです」','「ゲートの中でうるさくて…出遅れが全てです」'])+' '+s;
  if(f.ev==='競走中止')s=pick(['「…申し訳ありません。3コーナーでつまずいて、落ちてしまいました。馬は無事です」','「途中で様子がおかしくて止めました。大事に至らなければいいんですが」']);
  if(f.ev==='鼻出血')s='「直線で急に脚が止まって…鼻出血です。しばらく休ませてあげてください」';
  if(f.ev==='失格')s='「…斜行してしまいました。完全に僕のミスです。申し訳ありません」';}catch(e){}return s;})(jockeyComment);
/* the result screen says what happened */
showResult=(o=>function(){const RC=UI.race;const r=o.apply(this,arguments);try{const ev=(RC&&RC.order||[]).filter(f=>f.ev&&['出遅れ','競走中止','鼻出血','失格'].includes(f.ev));
  if(ev.length&&!document.querySelector('#sheet .incid')){const ban=document.querySelector('#sheet .result-banner');if(ban)ban.insertAdjacentHTML('afterend',`<div class="comment warnc incid">${ev.map(f=>`${f.no}番 ${esc(f.name)}${f.mine?'（あなたの馬）':''}は${f.ev==='出遅れ'?'大きく出遅れた':f.ev==='競走中止'?'競走中止（落馬）':f.ev==='鼻出血'?'鼻出血を発症':'斜行により失格'}`).join('。<br>')}。</div>`);}}catch(e){}return r;})(showResult);
/* 出走取消: now and then a runner is withdrawn on the morning of the race (not yours) */
buildField=(o=>function(race,ents){const fld=o.apply(this,arguments);try{if(fld.length>8&&R()<.06){const c=fld.filter(f=>!f.mine&&!f.rival);if(c.length){const x=c[Math.floor(R()*c.length)];
  fld.splice(fld.indexOf(x),1);fld.forEach((f,i)=>f.no=i+1);RC_SUB.push(`${x.name}は${pick(['跛行','発熱','疝痛'])}のため出走取消。`);[...fld].sort((a,b)=>a.odds-b.odds).forEach((f,i)=>f.pop=i+1);}}}catch(e){}return fld;})(buildField);
/* the 3D call knows about a slow start and a horse pulled up */
r3dInput=(o=>function(RC){const inp=o.apply(this,arguments);try{inp.field.forEach(x=>{const f=RC.field.find(y=>y.no===x.no);if(f){if(f.late)x.late=1;if(f.stop)x.stop=1;}});}catch(e){}return inp;})(r3dInput);
