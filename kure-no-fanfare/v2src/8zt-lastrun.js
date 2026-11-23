/* =========================================================
   ラストラン: 引退を決めるときに、すぐやめるのではなく「最後のレース」を決められる。
   ・調教師からの引退の相談に「○○をラストランにする」「次のレースを最後に」の選択肢
   ・自分で引退させるときも「ラストランを決める」から、この先半年の大きなレース（G1・G2）か次のレースを選べる
   ・ラストランを走り終えたら、引退式をして送り出すかを選んで引退
   ・そのレースに出られないまま過ぎたら（ファン投票に漏れた・除外・故障など）、このまま引退か、次のレースを最後にするかを決める
   （3歳で勝てないままの馬の相談は「未勝利戦の終わり」のほうで来るので、古い「引退の相談」は出さない）
   ========================================================= */
function lrCands(h){const out=[],a0=ageOf(h),m0=M(S.t);for(let k=0;k<=6;k++){const m=(m0-1+k)%12+1,a=a0+(m0+k>12?1:0);
    GR.filter(g=>g.m===m&&(g.gr==='G1'||g.gr==='G2')&&!g.abroad&&!g.jump&&!g.local&&ageOk(g.age,a)&&!(g.sex&&h.sex!=='牝')).forEach(g=>out.push({n:g.n,gr:g.gr,m,k}));}
  return out.sort((x,y)=>(x.gr==='G1'?0:1)-(y.gr==='G1'?0:1)||x.k-y.k).slice(0,5).sort((x,y)=>x.k-y.k);}
/* the one the trainer suggests: the Grand Prix if it falls in the next half year, else the first G1 from next month on */
function lrBest(h){const L=lrCands(h);return L.find(x=>x.n==='有馬記念')||L.find(x=>x.gr==='G1'&&x.k>=1)||L.find(x=>x.gr==='G1')||L[0]||null;}
function lrSet(h,c){h.lastRun=c?{n:c.n,until:S.t+c.k}:{n:'',until:S.t+3};h.lastRunMissed=0;log(`${h.name}のラストランを${c?`${c.n}（${c.m}月）`:'次のレース'}に決めた`);}
/* 調教師からの相談 */
if(EV.retireTalk){const r0=EV.retireTalk.r,f0=EV.retireTalk.f;
  EV.retireTalk.r=d=>{if(d.unraced)return null;const v=r0(d);if(!v)return v;const h=HZ(d.hid);if(!h||h.status!=='現役'&&h.status!=='放牧')return v;const b=lrBest(h);d.lrb=b?{n:b.n,m:b.m,k:b.k}:null;
    return{...v,ch:[v.ch[0],...(b?[`「${b.n}」（${b.m}月）をラストランにして引退`]:[]),'次のレースを最後に引退',...v.ch.slice(1)]};};
  EV.retireTalk.f=(d,i)=>{const h=HZ(d.hid);if(i===0||!h)return f0(d,0);const nb=d.lrb?1:0;
    if(d.lrb&&i===1){lrSet(h,d.lrb);return `${h.name}のラストランは${d.lrb.n}に決まった。\n\n${P(h.trainer)?P(h.trainer).n.split(' ')[0]:'調教師'}「最高の状態で送り出します」`;}
    if(i===1+nb){lrSet(h,null);return `${h.name}は、次のレースを最後に引退する。\n\n${P(h.trainer)?P(h.trainer).n.split(' ')[0]:'調教師'}「わかりました。悔いのないように仕上げます」`;}
    return f0(d,i-1-nb);};}
/* 自分で引退させるとき */
ACT.retire=(o=>function(d){const r=o.apply(this,arguments);try{const h=HZ(d.hid);if(h&&['現役','放牧'].includes(h.status)&&!h.lastRun){const row=document.querySelector('#sheet .row');if(row)row.insertAdjacentHTML('beforebegin',`<p class="muted" style="font-size:13px">すぐにやめず、最後のレースを決めてから引退させることもできる。</p><div class="row" style="margin-bottom:8px"><button class="btn" data-act="lrPick" data-hid="${h.id}">ラストランを決める</button></div>`);}}catch(e){}return r;})(ACT.retire);
ACT.lrPick=d=>{const h=HZ(+d.hid);if(!h)return;const L=lrCands(h);
  openModal(`<div class="from-line">ラストラン</div><h2>${esc(h.name)}の最後のレース</h2><p class="muted">走り終えたら引退する。出られないまま過ぎたら、そのとき改めて決める。</p>
    <div class="choices">${L.map(c=>`<button class="btn" data-act="lrSet" data-hid="${h.id}" data-n="${esc(c.n)}">${esc(c.n)}<small class="muted">　${c.m}月・${c.gr}${c.n==='有馬記念'?'（ファン投票で選ばれたら）':''}</small></button>`).join('')}
    <button class="btn" data-act="lrSet" data-hid="${h.id}" data-n="">次に走るレース</button></div><div class="row"><button class="btn" data-act="close">やめる</button></div>`);};
ACT.lrSet=d=>{const h=HZ(+d.hid);if(!h)return;const c=d.n?lrCands(h).find(x=>x.n===d.n):null;lrSet(h,c||null);save();closeModal();render();toast(`${h.name}のラストラン：${c?c.n:'次のレース'}`);};
/* 厩舎のカードに */
hCard=(o=>function(h){let s=o.apply(this,arguments);try{if(h.lastRun&&!h.lastRunDone){const ch=`<span class="chip warn">ラストラン：${esc(h.lastRun.n||'次のレース')}</span>`;s=s.replace('<div class="row" style="gap:6px;margin-top:4px">','<div class="row" style="gap:6px;margin-top:4px">'+ch);}}catch(e){}return s;})(hCard);
/* 走り終えたら */
applyRace=(o=>function(RC){const L=(RC&&RC.order||[]).filter(f=>f.mine&&f.h&&f.h.lastRun&&!f.h.lastRunDone);const r=o.apply(this,arguments);
  try{L.forEach(f=>{const h=f.h;if(h.lastRun.n&&h.lastRun.n!==RC.race.name)return;h.lastRunDone={race:RC.race.name,pos:f.pos};pushEv('lastRunDone',{hid:h.id});});}catch(e){}return r;})(applyRace);
racesFor=(o=>function(h){if(h&&h.lastRunDone)return [];return o.apply(this,arguments);})(racesFor);
EV.lastRunDone={r:d=>{const h=HZ(d.hid);if(!h||!h.lastRunDone||!['現役','放牧','休養'].includes(h.status))return null;const x=h.lastRunDone;
  return{p:h.trainer,from:who(h.trainer),title:`${h.name}、ラストラン`,body:`${x.race}、${x.pos}着。${x.pos===1?'最後の最後に、勝って終わった。':x.pos<=3?'最後まで、しっかり走り切った。':'結果はともかく、最後まで無事に走り切った。'}\n\n通算${h.starts}戦${h.wins}勝。これで${h.name}の競走生活は終わる。\n\n${P(h.trainer)?P(h.trainer).n.split(' ')[0]:'調教師'}「…ありがとうございました。いい馬でした」`,
    ch:['引退式をして送り出す','そのまま送り出す']};},
  f:(d,i)=>{const h=HZ(d.hid);if(!h)return '';h.lastRun=null;let t=retireHorse(h);if(i===0){h.fans=(h.fans||0)+3000;S.fame+=1;t=`最終レースのあと、${h.name}の引退式が行われた。ゼッケンをつけた${h.name}がターフに戻ると、スタンドに残った大勢のファンが名前を呼んだ。\n\n`+t;}return t;}};
EV.lastRunMiss={r:d=>{const h=HZ(d.hid);if(!h||!h.lastRun||h.lastRunDone||['引退','繁殖','種牡馬','功労馬','売却','移籍'].includes(h.status))return null;
  return{p:h.trainer,from:who(h.trainer),title:`${h.name}のラストラン`,body:`${h.lastRun.n?`予定していた${h.lastRun.n}には、出られずに終わりました。`:'最後のレースに、まだ出られていません。'}\n\nこのまま引退させるか、次のレースを最後にするか、決めてください。`,ch:['このまま引退させる','次のレースを最後にする']};},
  f:(d,i)=>{const h=HZ(d.hid);if(!h)return '';if(i===0){h.lastRun=null;return retireHorse(h);}lrSet(h,null);return `${h.name}は、次のレースを最後に引退する。`;}};
beginMonth=(o=>function(first){const r=o.apply(this,arguments);try{if(!first)mine().filter(h=>h.lastRun&&!h.lastRunDone&&!h.lastRunMissed&&S.t>h.lastRun.until).forEach(h=>{h.lastRunMissed=1;pushEv('lastRunMiss',{hid:h.id});});}catch(e){}return r;})(beginMonth);
