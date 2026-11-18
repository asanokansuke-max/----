/* =========================================================
   odds close, winning-jockey interview, watching the work-out
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
.tclosed{background:#b8141c;color:#fff;font-weight:900;text-align:center;padding:4px;letter-spacing:.3em;animation:tcb .6s ease-in-out 3}
@keyframes tcb{50%{opacity:.35}}
.intv{border-radius:12px;background:linear-gradient(160deg,#10243c,#183455);color:#eef4fb;padding:10px 12px;display:grid;gap:6px}
.intv .h{display:flex;align-items:center;gap:8px;font-weight:900;font-size:13px}.intv .h span{background:#e0262d;color:#fff;font-size:10px;padding:1px 6px;border-radius:3px}
.intv .q{font-size:12px;opacity:.75}.intv .a{font-size:14px;line-height:1.7;font-family:var(--f-disp)}
.wkbox{display:grid;gap:10px}.wkbox canvas{display:block;width:100%;border-radius:10px}
.wkres{font-family:Oswald,sans-serif;font-size:22px;text-align:center}
`;document.head.appendChild(st);})();
/* odds: the clock ticks down to the off; at 0 the windows close */
termLive=(o=>function(){const r=o.apply(this,arguments);const RC=UI.race;let sec=75;clearInterval(RC&&RC.closeT);
  if(RC)RC.closeT=setInterval(()=>{const t=$('#tmin');if(!t){clearInterval(RC.closeT);return;}sec--;t.textContent=Math.max(0,Math.ceil(sec/7.5));
    if(sec<=0){clearInterval(RC.closeT);clearInterval(TERM);const h=$('.term .term-h');if(h&&!$('.tclosed'))h.insertAdjacentHTML('afterend','<div class="tclosed">締切ました</div>');
      document.querySelectorAll('[data-act=bet]').forEach(b=>{b.disabled=true;});try{se('bid');}catch(e){}}},1000);return r;})(termLive);
/* the winning jockey's interview */
showResult=(o=>function(){const RC=UI.race;const r=o.apply(this,arguments);try{const m=RC.order.find(f=>f.mine);
  if(m&&m.pos===1&&RC.watched&&!$('#sheet .intv')){const j=m.jname.split(' ')[0],seed=RC.race.name+S.t;
    const a1=m.jid&&m.jid!=='stable'?V(m.jid,RC.race.grade==='G1'?'winBig':'win',{h:m.name}):pick2(['ホッとしています。','最高の気分です。'],seed);
    const a2={逃げ:'自分のリズムで行けたのが全て。最後まで脚は残っていました',先行:'いい位置が取れたので、直線は自信を持って追えました',差し:'じっくり脚をためて、直線は弾けてくれました',追込:'後ろからになりましたが、この馬の末脚を信じていました'}[m.used||m.style]||'馬が頑張ってくれました';
    const a3=pick2([`${m.name}はまだまだ強くなります。応援よろしくお願いします`,'関係者の皆さんに感謝したいです',RC.race.key==='有馬記念'?'この馬と、この景色を見られて幸せです':'次はもっと大きな舞台で'],seed+'a3');
    const at=$('#sheet .rivend')||$('#sheet .betres')||$('#sheet .result-banner');
    if(at)at.insertAdjacentHTML('afterend',`<div class="intv"><div class="h"><span>LIVE</span>勝利騎手インタビュー　${esc(m.jname)}騎手</div>
      <div class="q">── おめでとうございます。今の気持ちは？</div><div class="a">「${esc(String(a1).replace(/^「|」$/g,""))}」</div>
      <div class="q">── 直線の手応えは？</div><div class="a">「${esc(a2)}」</div>
      <div class="q">── ファンの皆さんに一言</div><div class="a">「${esc(a3)}」</div></div>`);}}catch(e){}return r;})(showResult);
/* 追い切り見学: from the horse's visit screen */
drawTouch=(o=>function(){const r=o.apply(this,arguments);const h=HZ(UI.touch&&UI.touch.hid);
  if(h&&h.status==='現役'){const ft=$('#sheet>.row:last-child');if(ft&&!ft.querySelector('[data-act=workWatch]'))ft.insertAdjacentHTML('afterbegin',`<button class="btn" data-act="workWatch" data-hid="${h.id}">追い切りを見る</button>`);}return r;})(drawTouch);
ACT.workWatch=d=>{const h=HZ(+d.hid);if(!h)return;const w=workout(h,'普通'),tr=P(h.trainer);
  openModal(`<div class="from-line">${dstr(S.t)}　トレセン・坂路コース</div><h2>${esc(h.name)}の追い切り</h2>
    <div class="wkbox"><canvas id="wkcv" aria-label="坂路の追い切り"></canvas><div class="wkres" id="wkres">0.0</div><div class="comment" id="wkcm" hidden></div></div>
    <div class="row"><span class="sp"></span><button class="btn pri" data-act="touchBack" data-hid="${h.id}">戻る</button></div>`,{lock:true});
  const cv=$('#wkcv'),c=cv.getContext('2d'),W=cv.clientWidth,H=Math.round(W*.6),dpr=window.devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';c.scale(dpr,dpr);
  const T=+w.t4,t0=performance.now(),dur=6000;let done=false;
  const loop=now=>{if(!document.getElementById('wkcv'))return;const k=Math.min(1,(now-t0)/dur);
    const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#cfe0ea');g.addColorStop(1,'#eef3f5');c.fillStyle=g;c.fillRect(0,0,W,H);
    c.fillStyle='#6f8f72';for(let i=0;i<14;i++){c.beginPath();c.ellipse(i*W/12,H*.32-i*H*.012,W*.06,H*.08,0,0,7);c.fill();}
    // the uphill woodchip course
    const y0=H*.92,y1=H*.42;c.fillStyle='#8a6a48';c.beginPath();c.moveTo(0,y0);c.lineTo(W,y1);c.lineTo(W,y1+H*.14);c.lineTo(0,y0+H*.14);c.closePath();c.fill();
    c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.moveTo(0,y0-H*.02);c.lineTo(W,y1-H*.02);c.stroke();
    for(let m=0;m<=4;m++){const x=W*m/4,y=y0+(y1-y0)*m/4;c.fillStyle='#fff';c.fillRect(x-1,y-H*.1,2,H*.08);c.fillStyle='#c0392b';c.fillRect(x-12,y-H*.13,24,11);c.fillStyle='#fff';c.font='bold 8px sans-serif';c.textAlign='center';c.fillText(`${(4-m)*200}`,x,y-H*.13+9);}
    const x=W*(.08+k*.75),y=y0+(y1-y0)*(.08+k*.75)+H*.08;c.save();c.translate(x,y);c.rotate(Math.atan2(y1-y0,W));drawHorse(c,0,0,H/170,now/1000*Math.PI*2*2.1,h.coat,{a:'#2a3550',b:'#2a3550',p:''},'',false,{});c.restore();
    const el=$('#wkres');if(el&&!done)el.textContent=(T*k).toFixed(1);
    if(k>=1&&!done){done=true;if(el)el.textContent=`4F ${w.t4}　1F ${w.t1}`;const cm=$('#wkcm');if(cm){cm.hidden=false;cm.textContent=`${tr?tr.n:'調教師'}：「${+w.t4<52.5?'動きは文句なし。仕上がってきた':+w.t4<54.5?'まずまず。もう一段上がってくれれば':'まだ物足りない。次も強めにやる'}」`;}try{se('select');}catch(e){}}
    requestAnimationFrame(loop);};requestAnimationFrame(loop);};
ACT.touchBack=d=>{ACT.touch({hid:+d.hid});};
/* メイクデビュー: the first start feels like an occasion */
showRaceDay=(o=>function(){const r=o.apply(this,arguments);const RC=UI.race;if(RC&&RC.race.debut){const m=RC.field.find(f=>f.mine);const hd=$('#sheet .racehead');
  if(hd&&m&&!$('#sheet .debutnote'))hd.insertAdjacentHTML('afterend',`<div class="comment debutnote">いよいよ${esc(m.name)}のデビュー戦。生まれた日から見てきた馬が、初めてゲートに入る。</div>`);}return r;})(showRaceDay);
showResult=(o=>function(){const RC=UI.race;const r=o.apply(this,arguments);try{if(RC.race.debut){const m=RC.order.find(f=>f.mine);const ban=$('#sheet .result-banner');
  if(m&&ban&&!$('#sheet .debutres'))ban.insertAdjacentHTML('afterend',`<div class="comment debutres">${m.pos===1?`${esc(m.name)}、デビュー戦を白星で飾った！`:m.pos<=3?`デビュー戦は${m.pos}着。素質の片鱗は見せた。`:`デビュー戦は${m.pos}着。ここからだ。`}</div>`);}}catch(e){}return r;})(showResult);
/* the course note on race day: what this track asks of a horse */
function courseNote(race,h){const cc=courseChar(race),out=[];
  out.push(`直線${cc.st}m${cc.long?'（長い：差し・追込に向く）':cc.short?'（短い：逃げ・先行が有利）':''}`);
  if(cc.hs>=2)out.push(`ゴール前に${cc.hill}（パワーと根性が問われる）`);else if(cc.hs===1&&cc.hill)out.push(`直線に${cc.hill}`);else if(cc.kyoto)out.push('3コーナーに淀の坂（下りで勢いがつく）');else out.push('平坦');
  let fit='';if(h){const st=h.style;fit=(cc.long&&(st==='差し'||st==='追込'))||(cc.short&&(st==='逃げ'||st==='先行'))?'脚質は合う':(cc.long&&st==='逃げ')||(cc.short&&st==='追込')?'脚質は不向き':'';}
  return out.join('・')+(fit?`　→ ${h.name}の${fit}`:'');}
showRaceDay=(o=>function(){const r=o.apply(this,arguments);const RC=UI.race;const m=RC&&RC.field.find(f=>f.mine);const hd=$('#sheet .racehead');
  if(hd&&!$('#sheet .cnote'))hd.insertAdjacentHTML('afterend',`<div class="muted cnote" style="font-size:12px">コース：${esc(courseNote(RC.race,m&&m.h&&m.h.known&&m.h.known.style?m.h:null))}</div>`);return r;})(showRaceDay);
/* old messages stop nagging: anything from two months ago or earlier counts as seen,
   except a message still waiting for your reply this month */
function phAge(){const ph=PH();let n=0;ph.mails.forEach(m=>{if(!m.read&&m.t<=S.t-2&&!(m.rLabels&&!m.answered&&m.dl!=null&&m.dl>=S.t)){m.read=true;m.aged=true;n++;}});return n;}
beginMonth=(o=>function(){const r=o.apply(this,arguments);try{if(S&&S.phone){phAge();updatePhoneBadge();}}catch(e){}return r;})(beginMonth);
