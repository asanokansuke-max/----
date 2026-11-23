/* =========================================================
   同じ月にもう1戦（中1〜2週）: レースに出す月に、2戦目を足せる。
   ・1戦目の疲れが残ったまま走るので、力は出し切りにくい（疲れはそのまま能力に響く）
   ・走ったあとは疲れが大きく、調子を落としやすく、故障もしやすい
   ・間隔をあける方針の調教師は、よほど信頼がないと引き受けない。疲れが残っている馬は誰も引き受けない
   ・2戦目は、その月のレースが全部終わったあとに走る
   調教師に任せた馬の G1: G1 で戦える力がある馬には、格下のレースより G1 の相談を優先して持ってくる
   （天皇賞（秋）→ジャパンカップ→有馬記念のように、毎月続いても相談が来る）
   ========================================================= */
function r2Block(h){const o=S.month.orders[h.id],tr=TR(h.trainer),tn=P(h.trainer)?P(h.trainer).n.split(' ')[0]:'調教師';
  if(!o||o.type!=='race')return 'まず今月の1戦目を決めてください。';
  if((h.fat||0)>40)return `${tn}「疲れが抜けきっていません。今月もう1戦は無理です」`;
  if(tr&&tr.policy==='spaced'&&(P(h.trainer).trust||0)<70)return `${tn}「間隔が詰まりすぎます。うちのやり方では、この馬のためになりません」`;
  return '';}
function r2Races(h){const o=S.month.orders[h.id],taken=new Set(Object.values(S.month.orders).filter(x=>x&&x.type==='race'&&x.race).map(x=>x.race.key));
  return racesFor(h).filter(r=>r.key!==(o&&o.race&&o.race.key)&&!taken.has(r.key)&&entryStatus(h,r).st!=='不可');}
orderBox=(o=>function(h,omk){let s=o.apply(this,arguments);try{const od=S.month&&S.month.orders[h.id];if(!omk&&h.status==='現役'&&h.mode!=='omakase'&&od&&od.type==='race'){const o2=(S.month.orders2||{})[h.id];
  const ui=o2?`<div class="r2line"><span class="chip warn">2戦目</span> ${esc(o2.race.name)}<small class="muted">（中2週・騎手 ${esc(JNAME(o2.j))}）</small><button class="btn sm" data-act="race2x" data-hid="${h.id}">やめる</button></div>`
    :`<div class="r2line"><button class="btn sm" data-act="race2" data-hid="${h.id}">同じ月にもう1戦（中2週）</button></div>`;
  s=s+ui;}}catch(e){}return s;})(orderBox);
ACT.race2=d=>{const h=HZ(+d.hid);if(!h)return;const blk=r2Block(h);const tn=P(h.trainer)?P(h.trainer).n.split(' ')[0]:'調教師';
  if(blk){openModal(`<div class="from-line">同じ月にもう1戦</div><h2>${esc(h.name)}</h2><div class="letter">${esc(blk)}</div><div class="row"><span class="sp"></span><button class="btn" data-act="close">わかった</button></div>`);return;}
  const L=r2Races(h);const tr=TR(h.trainer);
  openModal(`<div class="from-line">同じ月にもう1戦（中2週）</div><h2>${esc(h.name)}の2戦目</h2>
    <div class="letter">${esc(tr&&tr.policy==='spaced'?`${tn}「本当は間隔をあけたいところですが…オーナーがそう言うなら。疲れが残るのは覚悟してください」`:`${tn}「使って良くなるタイプなら、ありです。ただ、1戦目の疲れは残りますし、脚元のリスクも上がります」`)}</div>
    <p class="muted" style="font-size:12px">1戦目の疲れが残ったまま走る。走ったあとは調子を落としやすく、故障もしやすい。</p>
    <div class="choices">${L.length?L.map(r=>{const st=entryStatus(h,r);return `<button class="btn" data-act="race2Set" data-hid="${h.id}" data-key="${esc(r.key)}">${gradeBadge(r.grade)} ${esc(r.name)}<small class="muted">　${r.course} ${r.surf==='ダ'?'ダ':'芝'}${r.dist}m${st.why?'・'+esc(st.why):''}</small></button>`;}).join(''):'<p class="muted">今月、ほかに出られるレースがない。</p>'}</div>
    <div class="row"><button class="btn" data-act="close">やめる</button></div>`);};
ACT.race2Set=d=>{const h=HZ(+d.hid);if(!h)return;const race=r2Races(h).find(r=>r.key===d.key);if(!race)return;const st=entryStatus(h,race);
  if(st.st==='抽選'&&R()>(st.p||.35)){toast(`${race.name}は抽選で外れてしまった`);closeModal();return;}
  const o=S.month.orders[h.id];let j='stable';for(const jid of [o&&o.j,h.mainJ,'stable'].filter(Boolean)){if(jid==='stable'||askJockey(jid,h,race)[0]){j=jid;break;}}
  S.month.orders2=S.month.orders2||{};S.month.orders2[h.id]={race,j,tac:'おまかせ'};save();closeModal();render();toast(`${h.name}、2戦目は${race.name}（騎手 ${JNAME(j)}）`);};
ACT.race2x=d=>{if(S.month.orders2)delete S.month.orders2[+d.hid];save();render();};
/* the month's races run first; the second starts are added at the end of the card */
nextRace=(o=>function(){try{if(typeof RQ!=='undefined'&&!RQ.length&&S.month&&S.month.orders2&&!S.month.r2q){S.month.r2q=1;const notes=[];
    for(const [hid,o2] of Object.entries(S.month.orders2)){const h=HZ(+hid);if(!h||h.status!=='現役'||!o2.race)continue;const st=entryStatus(h,o2.race);
      if(st.ex&&R()<st.ex){h.exN=(h.exN||0)+1;notes.push(`${h.name}は${o2.race.name}を除外になった`);continue;}h.r2=S.t;RQ.push({race:{...o2.race,r2:1},ents:[{h,j:o2.j,tac:o2.tac}]});}
    if(notes.length)toast(notes.join('・'));}}catch(e){console.error('r2',e);}return o.apply(this,arguments);})(nextRace);
/* after the second start: tired, condition dips, the legs are at risk */
applyRace=(o=>function(RC){const L=RC&&RC.race&&RC.race.r2?(RC.order||[]).filter(f=>f.mine&&f.h&&f.h.r2===S.t).map(f=>f.h):[];const r=o.apply(this,arguments);
  try{L.forEach(h=>{if(h.status!=='現役')return;h.fat=Math.min(100,(h.fat||0)+12);if(R()<.5)h.cond=Math.max(1,(h.cond||3)-1);const inj=injuryRoll(h,.8);if(inj){pushEv('injury',{hid:h.id,kind:inj});}});}catch(e){}return r;})(applyRace);
(function(){const st=document.createElement('style');st.textContent=`.r2line{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:6px 0 2px;font-size:13px}.r2line .btn{margin-left:auto}`;document.head.appendChild(st);})();
/* ---------- 調教師に任せた馬の G1 ---------- */
planOmakase=(o=>function(only){const r=o.apply(this,arguments);try{for(const h of (only||racing()).filter(h=>h.mode==='omakase'&&h.status==='現役'&&h.trainer)){
    const od=S.month.orders[h.id];if(!od||od.type==='rest'||(h.fat||0)>50)continue;if(od.type==='race'&&od.race&&od.race.grade==='G1')continue;
    if(S.inbox.some(e=>e.type==='g1consult'&&e.data.hid===h.id))continue;
    const tru=P(h.trainer).trust;const g1=racesFor(h).filter(x=>x.grade==='G1'&&!x.abroad&&!x.local&&entryStatus(h,x).st!=='不可').map(x=>({x,s:ability(h,x.dist,x.surf)+randn()*Math.max(.5,(100-tru)*.04)-x.mean})).map(v=>({...v,s:v.s+(v.x.key==='有馬記念'&&S.flags.arimaSkipY!==Y(S.t)?2.5:0)})).sort((a,b)=>b.s-a.s)[0];
    if(!g1||g1.s<-3)continue;
    if(g1.x.key==='有馬記念'&&S.flags.arimaSkipY===Y(S.t))continue;
    pushEv('g1consult',{hid:h.id,key:g1.x.key,arima:g1.x.key==='有馬記念'?1:undefined});S.month.orders[h.id]={type:'train',int:'普通',by:'trainer'};}}catch(e){console.error('omk g1',e);}return r;})(planOmakase);
/* ---------- one rider, one horse: two of your horses in the same race can't share a jockey ---------- */
function jBookedElsewhere(jid,h,race){if(!jid||jid==='stable'||!race||!S.month)return null;const all=[...Object.entries(S.month.orders||{}),...Object.entries(S.month.orders2||{}).map(([k,v])=>[k,{...v,type:'race'}])];
  for(const [hid,o] of all){if(+hid===h.id||!o||o.type!=='race'||!o.race||o.j!==jid)continue;if(o.race.key===race.key)return HZ(+hid);}return null;}
askJockey=(o=>function(jid,h,race){const other=jBookedElsewhere(jid,h,race);if(other)return [false,`「そのレースは、${other.name}に乗せてもらうことになっています。2頭には乗れません」`];return o.apply(this,arguments);})(askJockey);
/* and on race day, whatever slipped through (a rider chosen in a letter, a trainer's entry): the second horse gets another rider */
buildField=(o=>function(race,ents){try{const seen=new Set();(ents||[]).forEach(e=>{if(!e||!e.h||!e.j||e.j==='stable'){return;}if(!seen.has(e.j)){seen.add(e.j);return;}
    const was=e.j;let nj='stable';for(const c of [e.h.mainJ,TR(e.h.trainer)&&TR(e.h.trainer).jk,...jockeysAvail()].filter(x=>x&&x!=='stable'&&!seen.has(x))){try{if(o2ask(c,e.h,race)){nj=c;break;}}catch(x){}}
    e.j=nj;if(nj!=='stable')seen.add(nj);RC_SUB.push(`${JNAME(was)}騎手は${(ents.find(x=>x.j===was)||{}).h?.name||'もう1頭'}に騎乗するため、${e.h.name}は${JNAME(nj)}騎手に乗り替わり。`);});}catch(e){console.error('dupJ',e);}return o.apply(this,arguments);})(buildField);
function o2ask(c,h,race){const j=JK(c);if(!j||(j.ban>S.t)||(typeof jockeyAway==='function'&&jockeyAway(c)))return false;return true;}
/* the trainer's letters: a rider already booked for another of your horses in that race is not offered again */
if(EV.g1consult){const r0=EV.g1consult.r,f0=EV.g1consult.f;
  EV.g1consult.r=d=>{try{const h=HZ(d.hid),race=h&&racesFor(h).find(r=>r.key===d.key);if(h&&race&&d.js&&d.js.some(j=>jBookedElsewhere(j,h,race)))delete d.js;}catch(e){}return r0(d);};
  EV.g1consult.f=(d,i)=>{try{const h=HZ(d.hid),race=h&&racesFor(h).find(r=>r.key===d.key);const j=d.js&&d.js[i];if(h&&race&&j&&jBookedElsewhere(j,h,race)){d.js=d.js.slice();d.js[i]='stable';}}catch(e){}return f0(d,i);};}
