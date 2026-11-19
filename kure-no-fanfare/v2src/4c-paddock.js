/* =========================================================
   big-race build-up: animated paddock (with 止まーれ) and 返し馬
   these declarations replace the plain versions in 4-ui.js
   ========================================================= */
let PDK=null;
function bodyWeight(f){
  if(f.bw)return f.bw;
  const base=f.h?(f.h.bw||(f.h.bw=440+Math.round(R()*70))):430+Math.round(R()*80);
  const d=Math.round(randn()*4+(f.fat>50?-4:0)+(f.cond>=4?2:0))*2/2;
  if(f.h&&f.mine)f.h.bw=base+d;
  f.bw={w:base+d,d};return f.bw;
}
function padNote(f){
  const c=f.cond,o=[];
  if(c>=5)o.push(pick(['毛ヅヤがピカピカ。文句なしの仕上がり','トモの張りが素晴らしい。気配は最高']));
  else if(c>=4)o.push(pick(['馬体が締まって見えます','踏み込みがしっかりしている','落ち着いて周回、いい雰囲気']));
  else if(c<=2)o.push(pick(['少し覇気がないように見えます','やや太め残りか','気合いが乗り切っていない']));
  else o.push(pick(['平行線の仕上がり','落ち着いて周回しています','いつも通りの雰囲気']));
  if(f.temper==='気難しい')o.push(pick(['少しチャカつき気味','首を上げてイレ込み加減']));
  const bw=bodyWeight(f);if(Math.abs(bw.d)>=8)o.push(bw.d>0?'馬体重は大幅増':'馬体重は大幅減');
  return o.join('。');
}
function showPaddock(){
  const RC=UI.race,r=RC.race,my=RC.field.filter(f=>f.mine);
  RC.field.forEach(bodyWeight);
  const picks=[...RC.field].sort((a,b)=>a.pop-b.pop).slice(0,3);my.forEach(m=>{if(!picks.includes(m))picks.push(m);});
  const notes=picks.map(f=>({f,t:padNote(f)}));
  if(r.key==='有馬記念')notes.push({f:null,t:S.part===1?`パドックの柵の前に、勝負服と同じ色のマフラーを巻いた初老の男性。${S.parent.name}オーナーです`:S.parent.fate==='rest'?`車椅子の${S.parent.name}さんが、パドックの最前列で${my[0]?.name||'愛馬'}を見つめています`:`${S.child.name}オーナーが、胸ポケットに手を当てて${my[0]?.name||'愛馬'}を見つめています`});
  const rows=RC.field.map(f=>{const bw=bodyWeight(f);return `<tr class="${f.mine?'me':''}"><td class="num">${f.no}</td><td>${f.mine||f.rival?silk(f.silks,16):''} ${esc(f.name)}</td><td class="num">${bw.w}<small>(${bw.d>=0?'+':''}${bw.d})</small></td><td>${esc(f.jname)}</td><td class="r num">${f.odds.toFixed(1)}</td><td class="r num">${f.pop}</td></tr>`;}).join('');
  const tr=my[0]?my[0].h.trainer:null;
  openModal(`<div class="from-line">${dstr(S.t)}　${esc(r.course)}競馬場　パドック</div>${raceHead(r)}
   <div class="bc"><canvas id="pdk" aria-label="パドックの様子"></canvas></div>
   <div class="padcast" id="padcast" aria-live="polite"></div>
   ${my.map(f=>{const bw=bodyWeight(f);return `<div class="panel padme"><div class="row">${horseSVG(f.h,40)}<b>${esc(f.name)}</b><span class="chip">${f.pop}番人気</span><span class="chip num">${bw.w}kg（${bw.d>=0?'+':''}${bw.d}）</span></div>
     <div class="comment">${avatar(f.h.trainer,22)} ${esc(P(f.h.trainer).n)}：${esc(V(TV(f.h.trainer),'pad',{i:f.h.cond>=4?0:f.h.cond<=2?2:1}))}</div>${f.h.bond>=60?`<div class="muted" style="font-size:13px">周回しながら、${esc(f.name)}がこちらを見つけて首を振った。</div>`:''}</div>`;}).join('')}
   <details class="more"><summary>出馬表・オッズ（${RC.field.length}頭）</summary><div class="tbl-wrap"><table><thead><tr><th>馬番</th><th>馬名</th><th>馬体重</th><th>騎手</th><th class="r">単勝</th><th class="r">人気</th></tr></thead><tbody>${rows}</tbody></table></div></details>
   <div class="row"><button class="btn pri" data-act="tomare" id="tomare">止まーれ（騎乗命令）</button></div>`,{wide:true,lock:true});
  PDK={notes,ni:0,nt:0,mount:0};paddockAnim();
}
function paddockAnim(){
  const RC=UI.race,fld=RC.field,cv=$('#pdk');if(!cv)return;const c=cv.getContext('2d');
  const W=cv.clientWidth,H=Math.round(clamp(W*.62,220,380)),dpr=window.devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';c.scale(dpr,dpr);
  const cx=W/2,cy=H*.62,rx=W*.4,ry=H*.24,n=fld.length;const t0=performance.now();let frozen=null;
  const castEl=$('#padcast');
  const showNote=()=>{const x=PDK.notes[PDK.ni%PDK.notes.length];PDK.ni++;if(!castEl)return;castEl.innerHTML=`<span class="pc-l">パドック解説</span>${x.f?`<b>${x.f.no}番 ${esc(x.f.name)}</b>　`:''}${esc(x.t)}`;castEl.classList.remove('fade');void castEl.offsetWidth;castEl.classList.add('fade');};
  showNote();let lastNote=performance.now();
  const loop=now=>{
    if(!document.getElementById('pdk')||!PDK)return;
    if(now-lastNote>3200&&!PDK.mount){showNote();lastNote=now;}
    const t=(frozen??now)-t0;
    // stands & crowd
    const g=c.createLinearGradient(0,0,0,H*.35);g.addColorStop(0,'#38424c');g.addColorStop(1,'#59636c');c.fillStyle=g;c.fillRect(0,0,W,H*.35);
    for(let y=6;y<H*.33;y+=5)for(let x=2;x<W;x+=5){const hs=hash(x+'|'+y);c.fillStyle=hs<.3?'#d8c3a5':hs<.5?'#b5473a':hs<.7?'#2c3e50':hs<.8?'#e9e4d8':'#6a7a5a';c.fillRect(x+(PDK.mount&&hs<.15?Math.sin(now/120+hs*40):0),y,3,3);}
    c.fillStyle='#2d3a33';c.fillRect(0,H*.33,W,H*.04);
    // odds board
    const m0=fld.find(f=>f.mine);
    if(m0){const bw=bodyWeight(m0);const bx=W-128,by=6;c.fillStyle='#111';c.fillRect(bx,by,120,40);c.strokeStyle='#444';c.strokeRect(bx,by,120,40);c.font='bold 10px sans-serif';c.fillStyle='#ffb000';c.textAlign='left';c.fillText(`${m0.no}番 単勝`,bx+6,by+14);c.font='bold 16px Oswald,monospace';c.fillText(m0.odds.toFixed(1),bx+66,by+16);c.font='bold 10px sans-serif';c.fillStyle='#7cf';c.fillText(`馬体重 ${bw.w}(${bw.d>=0?'+':''}${bw.d})`,bx+6,by+33);}
    // ground, ring, fence
    c.fillStyle='#6fa368';c.fillRect(0,H*.37,W,H);
    c.fillStyle='#d9c7a2';c.beginPath();c.ellipse(cx,cy,rx+18,ry+12,0,0,7);c.fill();
    c.fillStyle='#5f9a5c';c.beginPath();c.ellipse(cx,cy,rx-18,ry-12,0,0,7);c.fill();
    c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.ellipse(cx,cy,rx+20,ry+14,0,0,7);c.stroke();
    // horses + handlers
    const sp=PDK.mount?0:.11;
    const items=fld.map((f,i)=>{const th=i/n*Math.PI*2+t/1000*sp;return{f,th,x:cx+rx*Math.cos(th),y:cy+ry*Math.sin(th)};}).sort((a,b)=>a.y-b.y);
    for(const it of items){const f=it.f,depth=(Math.sin(it.th)+1)/2,s=(W/560)*(.42+.3*depth)*1.0;const flip=Math.sin(it.th)>0;
      const ph=PDK.mount?f.no:(t/1000)*Math.PI*2*.8+f.no;
      // handler
      const hx=it.x+(flip?-1:1)*30*s,hy=it.y;c.fillStyle='#22282e';c.fillRect(hx-3*s,hy-26*s,6*s,24*s);c.fillStyle='#e8c9a8';c.beginPath();c.arc(hx,hy-30*s,4*s,0,7);c.fill();
      drawHorse(c,it.x,it.y,s,ph,f.coat||(f.coat=f.h?f.h.coat:pick(Object.keys(COATS))),f.silks,f.no,f.mine,{walk:true,flip,nj:!PDK.mount||now-PDK.mount<(f.no*60)});
      if(f.mine){c.font='bold 11px sans-serif';const tw=c.measureText(f.name).width+10;c.fillStyle='rgba(0,0,0,.7)';c.fillRect(it.x-tw/2,it.y-72*s-20,tw,16);c.fillStyle='#ffd166';c.textAlign='center';c.fillText(f.name,it.x,it.y-72*s-8);}}
    if(PDK.mount){const a=(now-PDK.mount)/1000;if(a<1.8){c.font=`900 ${clamp(W/12,22,40)}px "Shippori Mincho B1",serif`;c.textAlign='center';c.lineWidth=5;c.strokeStyle='rgba(0,0,0,.55)';c.strokeText('止まーれー！',W/2,H*.3);c.fillStyle='#fff';c.fillText('止まーれー！',W/2,H*.3);}}
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
ACT.tomare=()=>{if(!PDK||PDK.mount)return;PDK.mount=performance.now();const castEl=$('#padcast');if(castEl)castEl.innerHTML='<span class="pc-l">パドック</span>騎乗命令。騎手たちが一斉に駆け出し、それぞれの馬にまたがった。';
  try{se('select');}catch(e){}const b=$('#tomare');if(b){b.textContent='返し馬へ';b.dataset.act='warmup';}};
let WUP=null;
function showWarmup(){
  PDK=null;const RC=UI.race,my=RC.field.filter(f=>f.mine);
  const html=my.map(f=>{const h=f.h,jid=f.jid;
    const v=(k,x={})=>V(jid||'stable',k,{h:h.name,...x});
    const feel=v(h.cond>=4?'feelGood':h.cond<=2?'feelBad':'feelOk');
    const tmp=h.temper==='気難しい'?v(h.bond>=50||jid==='washio'?'hotCalm':'hotWarn'):'';
    const sty=h.known.style?v('styleGo',{s:h.style}):v('styleAsk');
    return `<div class="panel" style="display:grid;gap:8px"><div class="row">${jid&&jid!=='stable'?avatar(jid,32):''}<b>${esc(JNAME(jid))}</b><span class="muted">${esc(h.name)}</span></div>
     <div class="comment">「${esc([feel,tmp,sty].filter(Boolean).map(x=>x.replace(/^「|」$/g,'').replace(/([^。！？])$/,'$1。')).join(''))}」</div>
     <div class="ctl-l">作戦</div><div class="seggroup tacg" role="radiogroup" aria-label="作戦">${['おまかせ',...STY].map(s=>`<label class="seg ${s==='おまかせ'?'on':''}"><input type="radio" name="tac-${h.id}" value="${s}" ${s==='おまかせ'?'checked':''}>${s==='おまかせ'?'任せる':s}</label>`).join('')}</div></div>`;}).join('');
  openModal(`<div class="from-line">返し馬</div>${raceHead(RC.race)}<div class="bc"><canvas id="wup" aria-label="返し馬"></canvas></div>${html}<div class="muted" style="font-size:12px">レース中、3コーナーで騎手に指示を出せます。</div><div class="row"><button class="btn pri" data-act="go">ゲートへ</button></div>`,{wide:true,lock:true});
  document.querySelectorAll('.tacg').forEach(g=>g.addEventListener('change',()=>g.querySelectorAll('label').forEach(l=>l.classList.toggle('on',l.querySelector('input').checked))));
  const cv=$('#wup');if(!cv||!my[0])return;const c=cv.getContext('2d');const W=cv.clientWidth,H=fitH(cv,Math.round(clamp(W*.56,190,330)),150),dpr=window.devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';c.scale(dpr,dpr);
  const f=my[0],SK=sky(M(S.t)),t0=performance.now(),dirt=RC.race.surf==='ダ';
  const others=RC.field.filter(x=>!x.mine).slice(0,4).map((o,i)=>({o,off:W*(.3+i*.55),sp:.85+i*.07,y:H*(.7+(i%2)*.1)}));
  const loop=now=>{if(!document.getElementById('wup'))return;const t=(now-t0)/1000,cam=t*W*.28;   // camera pans with our horse
    const g=c.createLinearGradient(0,0,0,H*.4);g.addColorStop(0,SK[0]);g.addColorStop(1,SK[2]);c.fillStyle=g;c.fillRect(0,0,W,H*.42);
    const st0=-((cam*.35)%1600)-400;drawStand(c,W,H,st0,st0+3200,now,0);
    c.fillStyle='#cfc9ba';c.fillRect(0,H*.4,W,H*.03);
    c.fillStyle=dirt?'#b48a5a':'#4f9a5e';c.fillRect(0,H*.43,W,H*.57);
    if(!dirt)for(let i=-1;i<12;i++){const x=i*W/6-((cam)%(W/3));c.fillStyle='rgba(255,255,255,.05)';c.fillRect(x,H*.47,W/6,H*.53);}
    c.fillStyle='#f6f6f2';c.fillRect(0,H*.45,W,3);for(let i=-1;i<30;i++){const x=i*W/24-((cam)%(W/24));c.fillRect(x,H*.45,2,H*.035);}
    // other runners cantering past at their own pace
    const items=others.map(r=>({f:r.o,x:((r.off+t*W*.28*(r.sp-1))%(W*1.6)+W*1.6)%(W*1.6)-W*.3,y:r.y,ph:t*Math.PI*2*1.3*r.sp}));
    items.push({f,x:W*.5,y:H*.82,ph:t*Math.PI*2*1.3});
    items.sort((a,b)=>a.y-b.y).forEach(it=>{const s=H/215*(1+(it.y-H*.7)/H);drawHorse(c,it.x,it.y,s,it.ph,it.f.coat||(it.f.h?it.f.h.coat:'鹿毛'),it.f.silks,it.f.no,it.f.mine,{});
      if(R()<.4){c.fillStyle=dirt?'rgba(150,110,70,.35)':'rgba(70,110,60,.3)';c.fillRect(it.x-25*s-R()*10,it.y-2-R()*4,2.5,2.5);}});
    c.fillStyle='rgba(0,0,0,.6)';c.fillRect(W*.5-60,H*.82-H*.42,120,18);c.fillStyle='#ffd166';c.font='bold 11px sans-serif';c.textAlign='center';c.fillText(`${f.no} ${f.name}`,W*.5,H*.82-H*.42+13);
    requestAnimationFrame(loop);};
  requestAnimationFrame(loop);
}
