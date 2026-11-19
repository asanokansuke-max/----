/* =========================================================
   語り継がれるもの: a lifetime record kept across playthroughs,
   titles earned along the way, and a second run that inherits
   money and the bloodline of the best horses.
   Also: the paper's own bets you can follow, with a betting record.
   ========================================================= */
const LEG_KEY='kure-legacy-v1';
function legLoad(){try{return JSON.parse(localStorage.getItem(LEG_KEY))||{runs:[],titles:{},stallions:[],carry:0,round:0};}catch(e){return {runs:[],titles:{},stallions:[],carry:0,round:0};}}
function legSave(L){try{localStorage.setItem(LEG_KEY,JSON.stringify(L));}catch(e){}}
const TITLES={first:'初勝利',graded:'重賞ウイナー',g1:'G1オーナー',arima1:'有馬記念制覇（父の代）',arima2:'有馬記念制覇（子の代）',both:'親子二代の夢',ten:'通算10勝',fifty:'通算50勝',g13:'G1・3勝',round2:'二度目の物語',betHit:'万馬券的中'};
function legTitle(k){const L=legLoad();if(L.titles[k])return;L.titles[k]={y:S?Y(S.t):0};legSave(L);setTimeout(()=>{try{toast(`称号「${TITLES[k]}」を獲得`);}catch(e){}},2600);}
applyRace=(o=>function(RC){const r=o.apply(this,arguments);try{const L=legLoad();L.wins=L.wins||0;L.g1=L.g1||0;
  RC.order.filter(f=>f.mine&&f.pos===1).forEach(f=>{L.wins++;if(RC.race.grade==='G1')L.g1++;});legSave(L);
  if(L.wins>=1)legTitle('first');if(RC.order.some(f=>f.mine&&f.pos===1&&RC.race.g))legTitle('graded');if(RC.order.some(f=>f.mine&&f.pos===1&&RC.race.grade==='G1'))legTitle('g1');
  if(L.wins>=10)legTitle('ten');if(L.wins>=50)legTitle('fifty');if(L.g1>=3)legTitle('g13');}catch(e){}return r;})(applyRace);
function legRecordRun(kind,title){const L=legLoad();const best=[...S.horses].filter(h=>h.owner==='me').sort((a,b)=>(b.g1-a.g1)||(b.earn-a.earn))[0];
  L.runs.unshift({round:(S.flags.round||0)+1,kind,title:title||'',y:Y(S.t),owner:S.part===2&&S.child?S.child.name:S.parent.name,horse:best?best.name:'',money:Math.round(S.money),date:Date.now()});L.runs=L.runs.slice(0,30);legSave(L);}
showEnding=(o=>function(e){try{if(!S.flags.endRec||S.flags.endRec!==S.part){S.flags.endRec=S.part;legRecordRun(S.part===2?'子の代':'父の代',e.title);legTitle(S.part===2?'arima2':'arima1');if(S.part===2&&S.won.parent)legTitle('both');}}catch(x){}
  const r=o.apply(this,arguments);
  if(S.part===2){const row=document.querySelector('#sheet .ending .row');if(row&&!row.querySelector('[data-act=ngPlus]'))row.insertAdjacentHTML('afterbegin','<button class="btn pri" data-act="ngPlus">二周目へ（血統と資金を引き継ぐ）</button>');}
  return r;})(showEnding);
showGameOver=(o=>function(){try{if(!S.flags.endRec){S.flags.endRec='over';legRecordRun('資金難で終幕','夢の途中で');}}catch(x){}return o.apply(this,arguments);})(showGameOver);
ACT.ngPlus=()=>{const L=legLoad();
  const best=[...S.horses].filter(h=>h.owner==='me'&&h.sex==='牡'&&(h.g1>0||h.gw.length>0)).sort((a,b)=>(b.g1-a.g1)||(b.earn-a.earn)).slice(0,2);
  best.forEach(h=>{const q=Math.max(76,Math.min(93,Math.round(h.pot+2+h.g1)));L.stallions=L.stallions.filter(s=>s.n!==h.name);
    L.stallions.push({id:'leg'+h.id+'_'+Date.now()%100000,n:h.name,q,dist:h.dist,surf:h.surf,g:h.growth,tp:h.temper==='気難しい'?'気難しい':'素直',fee:Math.min(2500,Math.round(60*Math.exp((q-70)/6)/10)*10),desc:'前の物語で走った血',legacy:true});});
  L.stallions=L.stallions.slice(-4);L.carry=Math.max(0,Math.min(10000,Math.round(S.money*.1/100)*100));L.round=(S.flags.round||0)+1;legSave(L);legTitle('round2');
  try{localStorage.removeItem(SAVE_KEY);}catch(e){}S=null;closeModal();UI.tab='stable';render();window.scrollTo(0,0);toast('二周目の準備ができました');};
newGame=(o=>function(f){const r=o.apply(this,arguments);try{const L=legLoad();if(L.round>0){S.flags.round=L.round;
  if(L.carry){S.money+=L.carry;log(`前の物語から ${yen(L.carry)} を引き継いだ`);L.carry=0;legSave(L);}
  (L.stallions||[]).forEach(s=>{if(!S.stallions.some(x=>x.id===s.id))S.stallions.push({...s});});
  if((L.stallions||[]).length)log(`前の物語の名馬（${L.stallions.map(s=>s.n).join('・')}）が種牡馬として待っている`);}}catch(e){}return r;})(newGame);
renderStart=(o=>function(){const r=o.apply(this,arguments);try{const L=legLoad(),ks=Object.keys(L.titles||{});if(!L.runs.length&&!ks.length)return r;
  const st=$('#app .start');if(!st)return r;
  st.insertAdjacentHTML('beforeend',`<div class="panel legacy"><h3 class="h3">これまでの物語${L.round?`<span class="chip good" style="margin-left:8px">${L.round+1}周目</span>`:''}</h3>
    ${L.runs.slice(0,6).map(x=>`<div class="lg"><b>${esc(x.title||x.kind)}</b><span class="muted">${x.y}年・${esc(x.owner)}${x.horse?`・${esc(x.horse)}`:''}</span></div>`).join('')}
    ${ks.length?`<div class="tt">${ks.map(k=>`<span class="chip">${esc(TITLES[k]||k)}</span>`).join('')}</div>`:''}
    <div class="muted" style="font-size:12px">通算 ${L.wins||0}勝・G1 ${L.g1||0}勝${(L.stallions||[]).length?`　引き継ぐ種牡馬：${L.stallions.map(s=>esc(s.n)).join('・')}`:''}</div></div>`);}catch(e){}return r;})(renderStart);
(function(){const st=document.createElement('style');st.textContent=`.legacy{display:grid;gap:6px;margin-top:12px}.legacy .lg{display:flex;flex-wrap:wrap;gap:4px 10px;font-size:13px;align-items:baseline}.legacy .tt{display:flex;flex-wrap:wrap;gap:5px}
.pbet{display:grid;gap:6px}.pbet .btn{min-height:42px}.pbet .rec{font-size:12px;color:var(--muted)}`;document.head.appendChild(st);})();

/* ---------------- the paper's bets ---------------- */
function paperPicks(RC){const d=paperData(RC),F=RC.field;const by=m=>F.filter((f,i)=>d.marks[i][0]===m);return [...by('◎'),...by('○'),...by('▲'),...by('△'),...by('☆')].slice(0,5);}
function betRecTxt(){const b=S.betRec;if(!b||!b.n)return '馬券の通算成績：まだ買っていません';return `馬券の通算 ${b.n}回・的中${b.hit}回・回収率 ${Math.round(b.ret/Math.max(1,b.spent)*100)}%`;}
function paperBetBox(){const RC=UI.race;if(!RC||RC.applied)return '';const pk=paperPicks(RC);if(pk.length<3)return '';const A=pk[0],O=pk.slice(1);
  const unit=10,cost=unit*O.length;if(RC.pbet)return `<div class="npbox pbet" style="margin-top:8px"><h4 class="red"><span>本紙の買い目</span><span>購入済み</span></h4><p>馬連 ${A.no}-${O.map(f=>f.no).join('.')}　各${yen(unit)}</p><div class="rec">${betRecTxt()}</div></div>`;
  return `<div class="npbox pbet" style="margin-top:8px"><h4 class="red"><span>本紙の買い目に乗る</span><span>高木の予想</span></h4><p>馬連 ◎${A.no}番から ${O.map(f=>f.no).join('・')}番へ流し（${O.length}点×${yen(unit)}）</p>
    <button class="btn pri" data-act="paperBet">${yen(cost)}で買う</button><div class="rec">${betRecTxt()}</div></div>`;}
ACT.paperBet=()=>{const RC=UI.race;if(!RC||RC.pbet||RC.applied)return;const pk=paperPicks(RC),A=pk[0],O=pk.slice(1),unit=10,cost=unit*O.length;if(S.money<cost){toast('資金が足りない');return;}
  S.money-=cost;RC.pbet={pairs:O.map(f=>[A.no,f.no]),unit,cost};S.betRec=S.betRec||{n:0,hit:0,spent:0,ret:0};S.betRec.n++;S.betRec.spent+=cost;save();try{se('coin');}catch(e){}
  const b=document.querySelector('.pbet');if(b)b.outerHTML=paperBetBox();toast('本紙の買い目を購入した');};
ACT.bet=(o=>function(d){const RC=UI.race;const had=RC&&RC.bet;const r=o.apply(this,arguments);if(RC&&RC.bet&&!had){S.betRec=S.betRec||{n:0,hit:0,spent:0,ret:0};S.betRec.n++;S.betRec.spent+=RC.bet.amt;}return r;})(ACT.bet);
showResult=(o=>function(){const RC=UI.race;const money0=S.money;const r=o.apply(this,arguments);try{
  if(RC&&RC.pbet&&!RC.pbetPaid){RC.pbetPaid=1;const po=payouts(RC),[a,b]=RC.order.slice(0,2).map(f=>f.no),hit=RC.pbet.pairs.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));
    const pay=hit?Math.round(RC.pbet.unit*po.uren[0][1]/100):0;S.money+=pay;S.betRec.ret+=pay;if(hit){S.betRec.hit++;if(po.uren[0][1]>=10000)legTitle('betHit');}
    const ban=$('#sheet .result-banner');if(ban)ban.insertAdjacentHTML('afterend',`<div class="panel" style="font-size:13px">本紙の買い目（馬連 ${RC.pbet.pairs[0][0]}-${RC.pbet.pairs.map(p=>p[1]).join('.')}）　${hit?`<b style="color:var(--good,#1f7a48)">的中！ ${po.uren[0][0]}　${yen(pay)}</b>`:'はずれ'}<div class="muted" style="font-size:12px">${betRecTxt()}</div></div>`);save();}
  if(RC&&RC.bet&&!RC.betRecDone){RC.betRecDone=1;const m=RC.order.find(f=>f.mine);if(m){const po=payouts(RC);let pay=0;if(RC.bet.type==='tan'&&m.pos===1)pay=RC.bet.amt*po.tan[0][1]/100;if(RC.bet.type==='fuku'){const x=po.fuku.find(z=>+z[0]===m.no);if(x)pay=RC.bet.amt*x[1]/100;}
    if(pay>0){S.betRec.hit++;S.betRec.ret+=Math.round(pay);}save();}}}catch(e){}return r;})(showResult);
frontHTML=(o=>function(){return o.apply(this,arguments)+paperBetBox();})(frontHTML);
/* timers that fire after the game was reset must not touch a missing save */
['deliverOut','maybeCall','flushNotif'].forEach(n=>{try{const o=window[n]||eval(n);if(typeof o==='function')eval(`${n}=(o=>function(){if(!S)return;return o.apply(this,arguments);})(${n})`);}catch(e){}});
