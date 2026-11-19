/* =========================================================
   ゲーム性: decisions that change the race while it runs,
   a review that explains why it went the way it did,
   and a goal for each year
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
#r3d .dec{border-radius:12px;border:1px solid #e2b93b;background:linear-gradient(180deg,rgba(226,185,59,.18),rgba(226,185,59,.04));padding:9px 10px;display:grid;gap:7px;animation:decin .3s ease}
@keyframes decin{from{opacity:0;transform:translateY(6px)}}
#r3d .dec .h{display:flex;align-items:center;gap:8px;font:800 13px "Zen Kaku Gothic New",sans-serif}
#r3d .dec .h small{margin-left:auto;font:700 11px Oswald,sans-serif;color:#f3d27a}
#r3d .dec .q{font-size:11.5px;line-height:1.5;color:#dfe7e2}
#r3d .dec .bt{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
#r3d .dec .bt button{min-height:44px;border-radius:9px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font:800 12.5px/1.25 "Zen Kaku Gothic New",sans-serif;padding:4px}
#r3d .dec .bt button small{display:block;font-weight:500;font-size:9.5px;opacity:.7}
#r3d .dec .bar{height:3px;border-radius:2px;background:rgba(255,255,255,.12);overflow:hidden}#r3d .dec .bar i{display:block;height:100%;background:#e2b93b;width:100%;transition:width .2s linear}
#r3d.wide .dec{padding:6px 8px;gap:5px}#r3d.wide .dec .bt button{min-height:34px;font-size:11px}#r3d.wide .dec .bt button small{display:none}#r3d.wide .dec .q{font-size:10.5px;line-height:1.4}
#r3d.wide .side:has(.dec) .card:not(.calls){display:none}#r3d .side:has(.dec) .calls{display:none}
.rv{border:1px solid var(--line);border-radius:12px;padding:10px 12px;display:grid;gap:6px;background:var(--panel)}
.rv h3{margin:0;font-size:14px;display:flex;align-items:center;gap:8px}.rv h3 small{font-weight:500;color:var(--muted);font-size:11px}
.rv .it{display:grid;grid-template-columns:22px 1fr;gap:6px;font-size:13px;line-height:1.5;align-items:start}
.rv .it b{display:grid;place-items:center;width:20px;height:20px;border-radius:5px;font:800 12px Oswald,sans-serif;color:#fff}
.rv .it b.p{background:#1f7a48}.rv .it b.m{background:#b5121b}.rv .it b.n{background:#7d7a70}
.rv .nx{margin-top:2px;padding:7px 9px;border-radius:8px;background:color-mix(in srgb,var(--accent,#c9a227) 14%,transparent);font-size:13px;line-height:1.5}
.goalcard{border:1px solid var(--line);border-radius:12px;padding:10px 12px;display:grid;gap:7px;background:var(--panel);margin-bottom:12px}
.goalcard h3{margin:0;font-size:14px;display:flex;align-items:center;gap:8px}.goalcard h3 small{margin-left:auto;font-weight:500;color:var(--muted);font-size:11px}
.goalcard .g{display:grid;grid-template-columns:1fr auto;gap:2px 10px;font-size:13px;align-items:center}
.goalcard .g .pb{grid-column:1/3;height:6px;border-radius:3px;background:color-mix(in srgb,var(--ink,#222) 10%,transparent);overflow:hidden}
.goalcard .g .pb i{display:block;height:100%;background:linear-gradient(90deg,#1f7a48,#c9a227)}
.goalcard .g.done .pb i{background:#c9a227}.goalcard .g .rw{font-size:11px;color:var(--muted)}
.goalcard .g.done span:first-child{text-decoration:line-through;opacity:.7}`;document.head.appendChild(st);})();

/* ---------------- 1. the race: one call at the third corner, and when you shout ---------------- */
// no free boost when the 3D race opens any more: what you decide there is what counts
open3D=(o=>function(RC){if(RC&&!RC.r3dSpurt)RC.r3dSpurt=1;return o.apply(this,arguments);})(open3D);
function r3dRegap(RC,extra){reorder(RC);const g={};RC.field.forEach(f=>g[f.no]=f.gapL||0);const f=document.getElementById('r3dif');try{f.contentWindow.postMessage(Object.assign({type:'regap',gaps:g},extra||{}),'*');}catch(e){}}
function decMine(RC){return RC.field.filter(f=>f.mine);}
function decHint(RC,f){const p=RC.pace,u=f.used,j=(f.jname||'').split(' ')[0]||'鞍上';
  const t=p==='スロー'?'前が楽をしています。早めに動かないと届かないかも':p==='ハイ'?'前は苦しくなるはず。外から差せます':'流れは平均的。どこを通すか次第です';
  const ps=R3D&&R3D.mePos||f.pos;return `${RC.pace}ペース・いま${ps}番手。${j}「${t}」`;}
function showDecision(RC){if(RC.dec||!R3D)return;const me=decMine(RC);if(!me.length)return;RC.dec={k:null};const f=me[0];
  const side=document.querySelector('#r3d .side'),calls=document.getElementById('r3dcalls');if(!side||!calls)return;
  const el=document.createElement('div');el.className='dec';el.id='r3ddec';
  el.innerHTML=`<div class="h">3コーナー　騎手に指示<small id="r3ddect">8</small></div><div class="q">${esc(decHint(RC,f))}</div>
    <div class="bt"><button data-k="out">外に出す<small>確実に伸ばす</small></button><button data-k="in">内を突く<small>当たれば大きい</small></button><button data-k="early">早めに動く<small>先に押し上げる</small></button></div><div class="bar"><i id="r3ddecb"></i></div>`;
  calls.before(el);let left=8;const T=setInterval(()=>{left-=.2;const b=document.getElementById('r3ddecb'),t=document.getElementById('r3ddect');if(b)b.style.width=Math.max(0,left/8*100)+'%';if(t)t.textContent=Math.max(0,Math.ceil(left));if(left<=0){clearInterval(T);decide(RC,'auto');}},200);
  el.onclick=e=>{const b=e.target.closest('button');if(!b)return;clearInterval(T);decide(RC,b.dataset.k);};}
function decide(RC,k){if(!RC.dec||RC.dec.k)return;RC.dec.k=k;const el=document.getElementById('r3ddec');
  const msgs=[];const extra={wide:{},go:{}};
  decMine(RC).forEach(f=>{let d=0,txt='';const u=f.used,closer=u==='差し'||u==='追込',p=RC.pace,jsk=f.jsk||70;
    if(k==='out'){d=closer?.6:.15;extra.wide[f.no]=3.6;txt=`${f.name}、大外に持ち出した！`;}
    else if(k==='in'){const ok=R()<.48+(jsk-70)*.012;d=ok?2.1:-1.8;extra.wide[f.no]=0;txt=ok?`${f.name}、内からスルスルと！ 進路が開いた！`:`${f.name}、内で前が壁！ 行き場がない！`;f.why&&(f.why.dec=d);}
    else if(k==='early'){d=p==='スロー'||!closer?1.2:p==='ハイ'?-1.1:.3;extra.go[f.no]=820;txt=d>0?`${f.name}、早めに動いて先頭集団へ！`:`${f.name}、早めに動いたが脚を使わされたか`;}
    else{txt='';}
    f.perf+=d;if(f.why)f.why.dec=d;RC.dec.d=d;if(txt)msgs.push(txt);});
  if(el){el.innerHTML=k==='auto'?'<div class="q">指示は出さず、騎手に任せた。</div>':`<div class="q"><b>指示：${{out:'外に出す',in:'内を突く',early:'早めに動く'}[k]}</b></div>`;setTimeout(()=>el.remove(),2600);}
  if(k!=='auto')r3dRegap(RC,extra);msgs.forEach(m=>{try{r3dCall(m);}catch(e){}});}
function cheerTiming(RC,rem){if(RC.cheer)return;const q=rem>=180&&rem<=380?'best':rem>380?'early':'late',d={best:.6,early:-.25,late:.15}[q];RC.cheer={q,rem:Math.round(rem),d};
  decMine(RC).forEach(f=>{f.perf+=d;if(f.why)f.why.cheer=d;});r3dRegap(RC);}
r3dState=(o=>function(d){const R0=R3D&&R3D.RC;if(R3D&&d.me)R3D.mePos=d.me.pos;const r=o.apply(this,arguments);if(!R0)return r;
  const D=R0.race.dist,trig=Math.min(950,D*.46);if(d.phase==='race'&&d.rem!=null&&d.rem<trig&&d.rem>420&&!R0.dec)showDecision(R0);
  if(!R0.cheerHook){const cb=document.getElementById('r3dcheer');if(cb){R0.cheerHook=1;cb.addEventListener('click',()=>{if(R3D&&R3D.rem!=null)cheerTiming(R0,R3D.rem);});}}
  return r;})(r3dState);

/* ---------------- 2. after the race: why it went that way ---------------- */
function reviewOf(RC,f){const W=f.why||{},r=RC.race,it=[],cc=typeof courseChar==='function'?courseChar(r):{st:350};
  const add=(v,pos,neg,mid)=>{if(v>=.5)it.push(['p',pos,v]);else if(v<=-.5)it.push(['m',neg,v]);else if(mid)it.push(['n',mid,v]);};
  const shapeN={単騎:'単騎逃げ',競り合い:'先行争いの激しい流れ',大逃げ:'大逃げ',押し出し:'押し出された逃げ'}[RC.shape]||'';
  add((W.pace||0)+(W.shape||0),`${RC.pace}ペースの${shapeN}。${f.used}の${f.name}に展開が向いた`,`${RC.pace}ペースの${shapeN}。${f.used}には展開が向かなかった`,`${RC.pace}ペース。展開の有利不利は小さかった`);
  if(f.tac&&f.tac!=='おまかせ')add(W.tac||0,`作戦「${f.tac}」が脚質に合っていた`,`作戦「${f.tac}」は本来の${f.style}と合わなかった`);
  add(W.course||0,`直線${cc.st}mのコースが${f.used}に合っていた`,`直線${cc.st}mのコースは${f.used}には不向きだった`);
  add(W.hill||0,'ゴール前の坂をパワーで押し切った','ゴール前の坂でパワー不足が出た');
  add(W.jk||0,`${f.jname.split(' ')[0]}騎手の得意な条件だった`,'');
  add(W.temper||0,'気性が落ち着いていて、力を出し切れた','気の強さが出て、力を出し切れなかった');
  if(f.cond<=2)it.push(['m','状態がひと息だった',-1]);else if(f.cond>=5)it.push(['p','状態は絶好だった',1]);
  if(f.fat>45)it.push(['m','疲れが残っていた',-1]);
  if(RC.dec&&RC.dec.k){const k=RC.dec.k,d=W.dec||0;if(k==='auto')it.push(['n','3コーナーでは騎手に任せた',0]);else add(d,`3コーナーの指示「${{out:'外に出す',in:'内を突く',early:'早めに動く'}[k]}」が当たった`,`3コーナーの指示「${{out:'外に出す',in:'内を突く',early:'早めに動く'}[k]}」は裏目に出た`,`3コーナーの指示「${{out:'外に出す',in:'内を突く',early:'早めに動く'}[k]}」`);}
  if(RC.cheer)it.push([RC.cheer.q==='best'?'p':RC.cheer.q==='early'?'m':'n',RC.cheer.q==='best'?`残り${RC.cheer.rem}mの「行けー！」がぴたりとはまった`:RC.cheer.q==='early'?`残り${RC.cheer.rem}mの「行けー！」は早すぎた`:`残り${RC.cheer.rem}mの「行けー！」は少し遅かった`,RC.cheer.d]);
  else if(RC.dec)it.push(['n','直線で「行けー！」を押さなかった（残り380〜180mが勝負どころ）',0]);
  if(W.luck>0)it.push(['p','人気以上の激走だった',W.luck]);else if(W.luck<0)it.push(['m',f.ev==='不利'?'道中で不利を受けた':'伸びきれなかった（展開のあや）',W.luck]);
  // the biggest minus → one piece of advice for next time
  const worst=[...it].filter(x=>x[0]==='m').sort((a,b)=>a[2]-b[2])[0];let nx='';
  if(worst){const t=worst[1];
    nx=/展開/.test(t)?(RC.pace==='スロー'?'前が残る流れになりやすい組み合わせ。逃げ・先行の作戦を試すか、3コーナーで早めに動く手も。':'前が競り合う流れ。中団で脚をためて、3コーナーは外に出すのが向く。')
      :/直線/.test(t)?(['逃げ','先行'].includes(f.used)?'直線の短いコース（中山・小倉・札幌など）を選ぶと持ち味が生きる。':'直線の長いコース（東京・新潟・阪神外回りなど）を選ぶと末脚が生きる。')
      :/作戦/.test(t)?`作戦は脚質どおり「${f.style}」か「おまかせ」に。`
      :/坂/.test(t)?'坂のある中山・阪神は避けるか、調教でパワーをつけてから。'
      :/気性/.test(t)?'ふれあいでなつかせるか、信頼の厚い騎手を乗せると落ち着く。'
      :/状態|疲れ/.test(t)?'間隔をあけて、状態が上がってから使いたい。'
      :/早すぎ|遅かった/.test(t)?'「行けー！」は残り380〜180mで押すのがいちばん効く。'
      :/裏目/.test(t)?'3コーナーの指示は、ペースと脚質を見て。スローなら早め、ハイなら外。':'';}
  return {it,nx};}
showResult=(o=>function(){const RC=UI.race;const r=o.apply(this,arguments);try{const me=RC&&RC.order.filter(f=>f.mine);const ban=$('#sheet .result-banner');
  if(me&&me.length&&ban&&!$('#sheet .rv')){const f=me[0],{it,nx}=reviewOf(RC,f);
    ban.insertAdjacentHTML('afterend',`<div class="rv"><h3>レースの振り返り<small>${esc(f.name)}・${f.pos}着</small></h3>${it.slice(0,6).map(([c,t])=>`<div class="it"><b class="${c}">${c==='p'?'＋':c==='m'?'−':'・'}</b><span>${esc(t)}</span></div>`).join('')}${nx?`<div class="nx"><b>次へ：</b>${esc(nx)}</div>`:''}</div>`);}}catch(e){}
  return r;})(showResult);

/* ---------------- 3. a goal for each year ---------------- */
function goalYear(){return Y(S.t);}
function makeGoals(){const act=mine().filter(h=>['現役','放牧','休養'].includes(h.status)).length,y=goalYear();
  if(!act){S.goals={y,list:[{id:'own',txt:'新しい馬を迎える（セリ・生産・購入）',need:1,have:0,rew:500},{id:'meet',txt:'牧場か調教師を訪ねる',need:1,have:0,rew:100}]};return;}
  const gw=mine().some(h=>(h.gw||[]).length>0),g1=mine().some(h=>h.g1>0),L=[];
  const w=Math.max(1,Math.round(act*1.3));L.push({id:'win',txt:`年間${w}勝`,need:w,have:0,rew:200*w});
  if(g1)L.push({id:'g1',txt:'G1をもう一度勝つ',need:1,have:0,rew:3000});else if(gw)L.push({id:'g1',txt:'G1を勝つ',need:1,have:0,rew:3000});else L.push({id:'gr',txt:'重賞を勝つ',need:1,have:0,rew:1000});
  const pz=Math.max(1000,Math.round(act*900/500)*500);L.push({id:'prize',txt:`年間賞金 ${yen(pz)}`,need:pz,have:0,rew:Math.round(pz*.15/100)*100});
  S.goals={y,list:L};}
function goalTick(RC){if(!S.goals||S.goals.y!==goalYear())makeGoals();const r=RC.race;
  RC.order.filter(f=>f.mine).forEach(f=>{S.goals.list.forEach(g=>{if(g.done)return;
    if(g.id==='win'&&f.pos===1)g.have++;if(g.id==='gr'&&f.pos===1&&r.g)g.have++;if(g.id==='g1'&&f.pos===1&&r.grade==='G1')g.have++;if(g.id==='prize')g.have+=f.prize||0;
    if(g.have>=g.need){g.done=1;S.money+=g.rew;log(`今年の目標「${g.txt}」を達成。ボーナス ${yen(g.rew)}`);setTimeout(()=>{try{toast(`目標達成！「${g.txt}」 ボーナス ${yen(g.rew)}`);se&&se('coin');}catch(e){}},1600);}});});}
applyRace=(o=>function(RC){const r=o.apply(this,arguments);try{goalTick(RC);}catch(e){}return r;})(applyRace);
newYear=(o=>function(){try{if(S.goals&&S.goals.list){const d=S.goals.list.filter(g=>g.done).length;log(`${S.goals.y}年の目標：${S.goals.list.length}つ中${d}つ達成`);}}catch(e){}const r=o.apply(this,arguments);makeGoals();return r;})(newYear);
function goalCard(){if(!S)return '';if(!S.goals||S.goals.y!==goalYear())makeGoals();const G=S.goals;
  G.list.forEach(g=>{if(g.done)return;const ok=g.id==='own'?mine().some(h=>['現役','育成','1歳','当歳','放牧','休養'].includes(h.status)):g.id==='meet'?S.month&&S.month.met:false;
    if(ok){g.have=1;g.done=1;S.money+=g.rew;log(`今年の目標「${g.txt}」を達成。ボーナス ${yen(g.rew)}`);setTimeout(()=>{try{toast(`目標達成！「${g.txt}」`);}catch(e){}},400);}});
  return `<div class="goalcard"><h3>${G.y}年の目標<small>達成でボーナス</small></h3>${G.list.map(g=>{const pc=Math.min(100,g.have/g.need*100);const hv=g.id==='prize'?yen(g.have):g.have+'/'+g.need;
    return `<div class="g ${g.done?'done':''}"><span>${esc(g.txt)}</span><span class="rw">${g.done?'達成':hv}・${yen(g.rew)}</span><div class="pb"><i style="width:${pc}%"></i></div></div>`;}).join('')}</div>`;}
vStable=(o=>function(){return goalCard()+o.apply(this,arguments);})(vStable);
