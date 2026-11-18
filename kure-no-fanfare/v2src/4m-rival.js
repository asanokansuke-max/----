/* =========================================================
   宿敵: the rival owner's showdown before a race
   「スピード、スタミナ、センス、そして脚。うちの馬が負けるわけがない」
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
.rivbox{border-radius:14px;overflow:hidden;background:linear-gradient(160deg,#1a1024,#2a1838 55%,#120b19);color:#f3eefa;box-shadow:0 6px 20px rgba(40,10,60,.35)}
.rivhd{display:flex;align-items:center;gap:8px;padding:8px 12px;background:rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.1)}
.rivhd .tag{flex:none;white-space:nowrap;background:#c8161d;color:#fff;font-weight:900;font-size:11px;padding:2px 7px;border-radius:3px;letter-spacing:.1em}
.rivhd b{font-size:14px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rivhd small{margin-left:auto;flex:none;white-space:nowrap;font-size:11px;opacity:.7}
.rivsay{display:flex;gap:10px;padding:12px 12px 4px;align-items:flex-start}
.rivsay .q{font-family:var(--f-disp);font-size:15px;line-height:1.75;font-weight:700}
.rivsay .who{font-size:11px;opacity:.7;margin-bottom:2px}
.rivcmp{display:grid;grid-template-columns:1fr auto 1fr;gap:4px 8px;padding:8px 12px 10px;align-items:center}
.rivcmp .nm{font-weight:700;font-size:13px;display:flex;align-items:center;gap:5px;min-width:0}
.rivcmp .nm span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rivcmp .nm.r{justify-content:flex-end;text-align:right}
.rivcmp .lab{font-size:11px;opacity:.8;text-align:center;min-width:44px}
.rivbar{height:10px;background:rgba(255,255,255,.1);border-radius:5px;position:relative;overflow:hidden}
.rivbar i{position:absolute;top:0;bottom:0;border-radius:5px}
.rivbar.me i{right:0;background:linear-gradient(90deg,#c4782f,#ffd166)}
.rivbar.rv i{left:0;background:linear-gradient(90deg,#a06bff,#5b2a86)}
.rivbar em{position:absolute;top:-1px;font-style:normal;font-size:9px;font-weight:900;color:#fff;text-shadow:0 0 3px #000}
.rivbar.me em{left:4px}.rivbar.rv em{right:4px}
.rivbar.unk i{background:repeating-linear-gradient(90deg,rgba(255,209,102,.35) 0 4px,transparent 4px 8px)}
.rivch{display:grid;gap:6px;padding:4px 12px 12px}
.rivch button{border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;border-radius:10px;padding:9px 12px;text-align:left;font-size:14px;min-height:44px}
.rivch button:first-child{background:rgba(196,120,47,.85);border-color:transparent}
.rivans{padding:4px 12px 12px;font-size:13px;line-height:1.7}
.rivans .me{opacity:.8}
.rivend{margin:6px 0;border-left:4px solid #7b2cbf;background:rgba(123,44,191,.08);padding:8px 12px;border-radius:0 8px 8px 0;font-size:14px;line-height:1.7}
`;document.head.appendChild(st);})();

const RIV_STATS=[['spd','スピード'],['sta','スタミナ'],['wis','センス'],['kick','末脚']];
function rivGrade(v){return v>=96?'S':v>=88?'A':v>=80?'B':v>=72?'C':v>=64?'D':'E';}
function rivStats(h){const s=h.st&&h.st.spd!=null?h.st:h.cap;return Object.fromEntries(RIV_STATS.map(([k])=>[k,Math.round(s[k]||60)]));}
function ensureRival(RC){if(!RC||RC.rivalChecked)return RC&&RC.rivalF;RC.rivalChecked=true;
  const me=RC.field.find(f=>f.mine);if(!me){RC.rivalF=null;return null;}
  const rv=RC.field.filter(f=>f.rival&&f.h).sort((a,b)=>(b.h.owner==='九条')-(a.h.owner==='九条')||b.exp-a.exp)[0];
  RC.rivalF=rv||null;return RC.rivalF;}
function rivSpeaker(rv){if(rv.h.owner==='九条'){const id=S.part===1?'kujo':'rei';return {id,name:P(id).n};}const o=OWN[rv.h.owner];return {id:null,name:`${o?o.n:'相手陣営'}の代表`};}
function rivLine(RC,rv,me){const sp=rivSpeaker(rv),h=rv.h,seed=RC.race.name+S.t,kujo=rv.h.owner==='九条';
  const rs=rivStats(h),best=RIV_STATS.slice().sort((a,b)=>rs[b[0]]-rs[a[0]])[0][1];
  const beatBefore=(S.rivalLog||[]).some(x=>x.h===h.name&&x.meWon),lostBefore=(S.rivalLog||[]).some(x=>x.h===h.name&&!x.meWon);
  const L=[
    [true,'スピード、スタミナ、センス、そして脚。どれを取っても、うちの馬が負けるわけがない。'],
    [true,`${h.name}の${best}を見たかね。あれは、金と時間をかけて作り上げたものだ。`],
    [kujo&&S.part===1,'血統、調教、騎手。全部、最高のものを揃えた。君の馬は――まあ、頑張りたまえ。'],
    [kujo&&S.part===2,`父の代からの因縁ですね。${h.name}で、ここで終わらせます。`],
    [kujo&&S.part===2,'あなたのお父様には敬意を払っています。だからこそ、手は抜きません。'],
    [beatBefore,'前回はまぐれだ。二度は続かんよ。'],[lostBefore,'また会ったな。結果は、前と同じだ。'],
    [RC.race.grade==='G1','G1は"良い馬"では勝てない。"強い馬"が勝つ。'],
    [me.pop<rv.pop,`${me.name}が人気か。新聞屋は何も分かっていない。`],
    [me.pop>rv.pop,'人気は正直だ。見たまえ、オッズがすべてを語っている。'],
    [!kujo,'いい馬を連れてきたね。でも、今日は相手が悪い。']
  ].filter(x=>x[0]).map(x=>x[1]);
  return {sp,q:pick2(L,seed+'rq')};}
function rivPanel(){const RC=UI.race;const rv=ensureRival(RC);if(!rv)return '';const me=RC.field.find(f=>f.mine);
  const {sp,q}=RC.rivQ||(RC.rivQ=rivLine(RC,rv,me));
  const rs=rivStats(rv.h),ms=rivStats(me.h),knows=me.h.starts>=2||me.h.known&&me.h.known.style;
  const rows=RIV_STATS.map(([k,l])=>{const mv=ms[k],rvv=rs[k],w=v=>clamp((v-50)/50*100,8,100);const unk=!knows&&(k==='wis'||k==='kick');
    return `<div class="rivbar me ${unk?'unk':''}"><i style="width:${w(mv)}%"></i><em>${unk?'?':rivGrade(mv)}</em></div><div class="lab">${l}</div><div class="rivbar rv"><i style="width:${w(rvv)}%"></i><em>${rivGrade(rvv)}</em></div>`;}).join('');
  const av=sp.id?avatar(sp.id,40):`<span class="av unk" style="width:40px;height:40px;font-size:16px">敵</span>`;
  const body=RC.rivAns?`<div class="rivans"><div class="me">あなた：${esc(RC.rivAns[0])}</div><div>${esc(sp.name.split(' ')[0])}：${esc(RC.rivAns[1])}</div></div>`
    :`<div class="rivch"><button data-act="rivReply" data-i="0">「勝負は走ってみないと分からない」</button><button data-act="rivReply" data-i="1">「うちの馬の脚を見てから言ってください」</button><button data-act="rivReply" data-i="2">黙って会釈する</button></div>`;
  return `<div class="rivbox" id="rivbox"><div class="rivhd"><span class="tag">宿敵</span><b>${silk(rv.silks,16)} ${esc(rv.name)}</b><small>${rv.pop}番人気</small></div>
    <div class="rivsay">${av}<div><div class="who">${esc(sp.name)}</div><div class="q">「${esc(q)}」</div></div></div>
    <div class="rivcmp"><div class="nm"><span>${esc(me.name)}</span></div><div></div><div class="nm r"><span>${esc(rv.name)}</span></div>${rows}</div>${body}</div>`;}
ACT.rivReply=d=>{const RC=UI.race,rv=RC.rivalF,me=RC.field.find(f=>f.mine);if(!rv||RC.rivAns)return;const i=+d.i,ms=rivStats(me.h);
  const strongKick=ms.kick>=rivStats(rv.h).kick;
  if(i===0){me.exp+=.5;rv.exp+=.3;RC.rivAns=['勝負は走ってみないと分からない','…いい目だ。楽しみにしているよ。'];}
  else if(i===1){if(strongKick){me.exp+=.8;rv.exp-=.3;RC.rivAns=['うちの馬の脚を見てから言ってください','…ほう。ならば直線で見せてもらおう。'];}
    else{me.exp-=.2;rv.exp+=.4;RC.rivAns=['うちの馬の脚を見てから言ってください','脚？ 笑わせる。数字は嘘をつかない。'];}}
  else{RC.rivAns=['（黙って会釈した）','ふん。賢明だ。'];}
  try{se&&se('select');}catch(e){}
  const b=$('#rivbox');if(b)b.outerHTML=rivPanel();};
function insertRiv(){const RC=UI.race;if(!RC||RC.rivShown)return;if(!ensureRival(RC))return;const sh=$('#sheet');if(!sh)return;
  const at=sh.querySelector('.rdopts')||sh.querySelector('.tbl-wrap');if(!at)return;RC.rivShown=true;at.insertAdjacentHTML('beforebegin',rivPanel());}
showRaceDay=(o=>function(){const r=o.apply(this,arguments);insertRiv();return r;})(showRaceDay);
showPaddock=(o=>function(){const r=o.apply(this,arguments);if(!$('#obox'))insertRiv();return r;})(showPaddock);
showTrackGate=(o=>function(){const r=o.apply(this,arguments);if(!$('#obox')&&!$('#cv'))insertRiv();return r;})(showTrackGate);
showRaceView=(o=>function(){ensureRival(UI.race);return o.apply(this,arguments);})(showRaceView);
/* after the race: the rival owner's reaction */
showResult=(o=>function(){const RC=UI.race;const r=o.apply(this,arguments);try{const rv=RC&&RC.rivalF,me=RC&&RC.order.find(f=>f.mine);
  if(rv&&me&&!$("#sheet .rivend")){const sp=rivSpeaker(rv),won=me.pos<rv.pos;
    S.rivalLog=(S.rivalLog||[]);if(!RC.rivLogged){RC.rivLogged=true;S.rivalLog.push({t:S.t,h:rv.h.name,meWon:won});if(S.rivalLog.length>30)S.rivalLog.shift();save();}
    const L=won?(me.pos===1?['…今日のところは、だ。次は、こうはいかない。','いい馬だ。認めよう。――今日だけはな。','（無言で席を立った。扉の閉まる音が、少しだけ大きかった）']:['うちの馬の前で入線したか。覚えておこう。','運が良かったな。'])
      :(rv.pos===1?['言っただろう。負けるわけがない、と。','数字は嘘をつかない。君もそろそろ分かっただろう。']:['…どちらも、まだ足りないということか。','次だ。次は必ず仕留める。']);
    const ban=$('#sheet .result-banner');if(ban)ban.insertAdjacentHTML('afterend',`<div class="rivend">${sp.id?avatar(sp.id,22):''} <b>${esc(sp.name)}</b>「${esc(pick2(L,RC.race.name+S.t+'re'))}」<br><span class="muted" style="font-size:12px">${esc(me.name)} ${me.pos}着 ／ 宿敵 ${esc(rv.name)} ${rv.pos}着</span></div>`);}}catch(e){}return r;})(showResult);
jockeyComment=(o=>function(f){let s=o.apply(this,arguments);if(f.ev==='不利')s+=' 直線で前が壁になって…あれがなければ。';else if(f.ev==='伸びず')s+=' 今日は最後に反応がなかった。';else if(f.ev==='激走'&&f.pos<=3)s+=' 今日は馬が別物でした。';return s;})(jockeyComment);
