/* =========================================================
   owner's view of race day: 馬主席 + odds terminal + 応援馬券, 口取り式, 記念アルバム
   ========================================================= */
const FRAMEC=['#f5f5f5','#1b1b1b','#d62828','#1f4ea3','#f2d21b','#1d8a4a','#ee7f26','#f29bb7'];
const FRAMET=['#111','#fff','#fff','#fff','#111','#fff','#fff','#111'];
/* ---------- odds terminal ---------- */
function termHTML(RC){
  const n=RC.field.length,f=[...RC.field].sort((a,b)=>a.no-b.no),m=f.find(x=>x.mine);
  const rows=f.map(x=>{const w=wakuOf(x.no,n);const fk=fukuRange(x);return `<tr class="${x.mine?'me':''}"><td><i class="wk" style="background:${FRAMEC[w-1]};color:${FRAMET[w-1]}">${w}</i></td><td class="tno">${x.no}</td><td class="tnm">${esc(x.name.slice(0,7))}</td><td class="to" data-o="${x.no}">${x.odds.toFixed(1)}</td><td class="tf">${fk}</td></tr>`;}).join('');
  const uren=m?f.filter(x=>x!==m).map(x=>{const v=Math.max(2,Math.round(m.odds*x.odds*.62*10)/10);return `<span><b>${Math.min(m.no,x.no)}-${Math.max(m.no,x.no)}</b><em data-u="${x.no}">${v>999?Math.round(v):v.toFixed(1)}</em></span>`;}).join(''):'';
  return `<div class="term" aria-label="オッズ板"><div class="term-h"><span>${esc(RC.race.course)}　<b>${RC.race.g?'11':'9'}</b>R　${esc(RC.race.name)}</span><span>締切 <b id="tmin">10</b>分前</span></div>
   <div class="term-b"><table><thead><tr><th>枠</th><th>番</th><th>馬名</th><th>単勝</th><th>複勝</th></tr></thead><tbody>${rows}</tbody></table>
   ${m?`<div class="term-u"><div class="tu-h">馬連　<b>${m.no}</b>番から</div><div class="tu-g">${uren}</div></div>`:''}</div>
   <div class="term-f">合計票数　単勝 <b id="tvote">${(380000+Math.round(R()*200000)).toLocaleString()}</b>　複勝 <b>${(600000+Math.round(R()*200000)).toLocaleString()}</b>（100円単位）</div></div>`;
}
function fukuRange(x){const lo=Math.max(1.0,x.odds*.22),hi=Math.max(lo+.2,x.odds*.38);return `${lo.toFixed(1)}-${hi.toFixed(1)}`;}
let TERM=null;
function termLive(){
  clearInterval(TERM);let min=10;
  TERM=setInterval(()=>{const t=$('#tmin');if(!t){clearInterval(TERM);return;}
    if(min>1&&R()<.5)min--;t.textContent=min;
    document.querySelectorAll('.term .to').forEach(el=>{if(R()<.35){const v=parseFloat(el.textContent);const nv=Math.max(1.1,v*(1+(R()-.5)*.06));el.textContent=nv.toFixed(1);el.classList.remove('up','dn');void el.offsetWidth;el.classList.add(nv<v?'dn':'up');}});
    const tv=$('#tvote');if(tv)tv.textContent=(parseInt(tv.textContent.replace(/,/g,''))+Math.round(R()*900)).toLocaleString();
  },1400);
}
/* ---------- 馬主席 ---------- */
function showOwnerBox(next){
  const RC=UI.race,r=RC.race,my=RC.field.filter(f=>f.mine),m0=my[0];
  const riv=RC.field.filter(f=>f.rival&&f.h.owner==='九条');
  const lines=[];
  lines.push(S.part===1?'三國「お席はこちらです。…窓から、ちょうど返し馬が見えますね」':'三國「お父様も、いつもこの席から見ていました」');
  if(riv.length&&P(S.part===1?'kujo':'rei').met)lines.push(`${S.part===1?'九条 隆臣':'九条 怜'}が、少し離れた席からこちらに会釈した。${riv[0].name}の馬主だ。`);
  if(m0&&m0.h.fans>20000)lines.push(`隣の席の老紳士「${m0.name}のオーナーさんですか。応援してますよ」`);
  lines.push(pick(['双眼鏡を構えた馬主たちが、黙って馬場を見つめている。','場内に、次のレースの出走馬を告げるアナウンスが流れる。','テーブルの端末で、オッズが刻々と動いている。']));
  const bet=RC.bet;
  openModal(`<div class="from-line">${dstr(S.t)}　${esc(r.course)}競馬場　馬主席</div>${raceHead(r)}
   <div class="bc"><canvas id="obox" aria-label="馬主席からの眺め"></canvas></div>
   <div class="boxlines">${lines.map(l=>`<p>${esc(l)}</p>`).join('')}</div>
   ${termHTML(RC)}
   ${m0?`<div class="panel betp"><div class="row" style="gap:8px"><b>応援馬券</b><span class="muted" style="font-size:12px">${esc(m0.name)}（${m0.no}番）</span></div>
     ${bet?`<div class="betdone">${bet.type==='tan'?'単勝':'複勝'} ${m0.no}番　${yen(bet.amt)} を購入済み</div>`:`<div class="seggroup betg"><button class="seg" data-act="bet" data-ty="tan" data-a="1">単勝 1万</button><button class="seg" data-act="bet" data-ty="tan" data-a="10">単勝 10万</button><button class="seg" data-act="bet" data-ty="fuku" data-a="10">複勝 10万</button><button class="seg" data-act="bet" data-ty="tan" data-a="100">単勝 100万</button></div>`}</div>`:''}
   <div class="row"><button class="btn pri" data-act="boxGo" data-next="${next}">${next==='paddock'?'パドックへ降りる':'馬主席からレースを観る'}</button></div>`,{wide:true,lock:true});
  boxAnim();termLive();
}
function boxAnim(){
  const cv=$('#obox');if(!cv)return;const c=cv.getContext('2d');const W=cv.clientWidth,H=Math.round(clamp(W*.5,170,300)),dpr=window.devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';c.scale(dpr,dpr);
  const SK=sky(M(S.t)),t0=performance.now();
  const loop=now=>{if(!document.getElementById('obox'))return;const t=(now-t0)/1000;
    // outside: sky, far stands, track
    const g=c.createLinearGradient(0,0,0,H*.5);g.addColorStop(0,SK[0]);g.addColorStop(1,SK[2]);c.fillStyle=g;c.fillRect(0,0,W,H*.55);
    c.fillStyle='#5b7a6a';c.fillRect(0,H*.36,W,H*.08);
    c.fillStyle='#14181c';c.fillRect(W*.62,H*.16,W*.22,H*.14);c.fillStyle='#1d8a4a';c.fillRect(W*.63,H*.17,W*.2,H*.12);c.fillStyle='#ffd166';c.font=`bold ${Math.max(8,W*.018)}px sans-serif`;c.textAlign='center';c.fillText(UI.race.race.name,W*.73,H*.245);
    c.fillStyle='#6fa368';c.fillRect(0,H*.44,W,H*.12);c.fillStyle='#4f9a5e';c.fillRect(0,H*.47,W,H*.06);c.fillStyle='#fff';c.fillRect(0,H*.47,W,1);c.fillRect(0,H*.53,W,1);
    for(let i=0;i<6;i++){const x=((t*28+i*90)%(W+60))-30;c.fillStyle=['#7a4a2a','#2b2522','#b5682c','#bdbcb6','#4e3020','#8b5a32'][i];c.fillRect(x,H*.495,9,3);c.fillRect(x+7,H*.488,3,4);}
    // window frame
    c.fillStyle='rgba(255,255,255,.06)';c.fillRect(0,0,W,H*.56);c.fillStyle='#d8dcd9';for(let x=0;x<=W;x+=W/4)c.fillRect(x-2,0,4,H*.56);c.fillRect(0,H*.555,W,5);
    // room: floor, desks with monitors, chairs, people
    c.fillStyle='#e9e7e1';c.fillRect(0,H*.57,W,H*.43);
    for(let row=0;row<2;row++){const y=H*(.66+row*.17),sc=1+row*.25;for(let i=0;i<5;i++){const x=W*(.08+i*.2)+row*W*.04;
      c.fillStyle='#f4f3ef';c.fillRect(x,y,W*.15*sc,H*.05);c.fillStyle='#c9c8c2';c.fillRect(x,y+H*.05,W*.15*sc,H*.012);
      c.fillStyle='#2b2f33';c.fillRect(x+W*.02,y-H*.06*sc,W*.06*sc,H*.055*sc);c.fillStyle=(Math.floor(t*2+i)%3?'#1b5e3b':'#0f3a26');c.fillRect(x+W*.023,y-H*.056*sc,W*.054*sc,H*.047*sc);
      if((i+row)%3===0){const px=x+W*.11*sc,py=y-H*.02;c.fillStyle='#22282e';c.fillRect(px-6*sc,py-18*sc,12*sc,22*sc);c.fillStyle='#e8c9a8';c.beginPath();c.arc(px,py-24*sc,6*sc,0,7);c.fill();c.fillStyle='#111';c.fillRect(px-7*sc,py-28*sc,14*sc,5*sc);}}}
    requestAnimationFrame(loop);};
  requestAnimationFrame(loop);
}
ACT.bet=d=>{const RC=UI.race;if(RC.bet)return;const amt=+d.a;if(S.money<amt){toast('資金が足りない');return;}S.money-=amt;RC.bet={type:d.ty,amt};save();try{se('coin');}catch(e){}
  const p=document.querySelector('.betp');if(p){p.querySelector('.betg').outerHTML=`<div class="betdone">${d.ty==='tan'?'単勝':'複勝'} ${RC.field.find(f=>f.mine).no}番　${yen(amt)} を購入した</div>`;}};
ACT.boxGo=d=>{clearInterval(TERM);UI.race.boxSeen=true;if(d.next==='paddock')showPaddock();else showTrackGate();};
showPaddock=(o=>function(){const RC=UI.race;if(RC&&!RC.boxSeen&&RC.watched){showOwnerBox('paddock');return;}return o.apply(this,arguments);})(showPaddock);
showTrackGate=(o=>function(){const RC=UI.race;if(RC&&RC.race.g&&!RC.boxSeen&&RC.watched&&!S.flags.condResultOnly){showOwnerBox('gate');return;}return o.apply(this,arguments);})(showTrackGate);

/* ---------- 応援馬券の払い戻し + 口取り式への導線 ---------- */
showResult=(o=>function(){
  const RC=UI.race;const r=o.apply(this,arguments);
  try{
    const m=RC.order.find(f=>f.mine);
    if(RC.bet&&m&&!RC.betPaid){RC.betPaid=true;const po=payouts(RC);let pay=0;
      if(RC.bet.type==='tan'&&m.pos===1)pay=RC.bet.amt*po.tan[0][1]/100;
      if(RC.bet.type==='fuku'){const x=po.fuku.find(z=>+z[0]===m.no);if(x)pay=RC.bet.amt*x[1]/100;}
      pay=Math.round(pay);S.money+=pay;if(S.rep)S.rep.lines.push(`応援馬券（${RC.bet.type==='tan'?'単勝':'複勝'}${m.no}番 ${yen(RC.bet.amt)}）　${pay?`的中 ${yen(pay)}`:'はずれ'}`);save();
      const ban=document.querySelector('#sheet .result-banner');if(ban)ban.insertAdjacentHTML('afterend',`<div class="betres ${pay?'hit':''}">応援馬券　${RC.bet.type==='tan'?'単勝':'複勝'} ${m.no}番 ${yen(RC.bet.amt)}　→　${pay?`<b>的中！ ${yen(pay)}</b>`:'はずれ'}</div>`);}
    if(m&&m.pos===1&&RC.watched){const ft=document.querySelector('#sheet>.row:last-child');if(ft&&!ft.querySelector('[data-act=kuchi]'))ft.insertAdjacentHTML('afterbegin','<button class="btn gold" data-act="kuchi">口取り式へ</button>');}
  }catch(e){}
  return r;})(showResult);

/* ---------- 口取り式 ---------- */
function person(c,x,y,h,o){
  const s=h/100;c.save();c.translate(x,y);
  c.fillStyle=o.pants||'#2b2f36';c.fillRect(-9*s,-46*s,7*s,46*s);c.fillRect(2*s,-46*s,7*s,46*s);
  c.fillStyle=o.suit||'#3a4250';c.beginPath();c.moveTo(-15*s,-80*s);c.lineTo(15*s,-80*s);c.lineTo(13*s,-42*s);c.lineTo(-13*s,-42*s);c.closePath();c.fill();
  if(o.dress){c.beginPath();c.moveTo(-14*s,-60*s);c.lineTo(14*s,-60*s);c.lineTo(18*s,-30*s);c.lineTo(-18*s,-30*s);c.fill();}
  c.fillStyle=o.shirt||'#f2f2f2';c.beginPath();c.moveTo(-4*s,-80*s);c.lineTo(4*s,-80*s);c.lineTo(0,-64*s);c.closePath();c.fill();
  c.fillStyle=o.skin||'#e8c9a8';c.beginPath();c.arc(0,-90*s,10*s,0,7);c.fill();
  c.fillStyle=o.hair||'#1f1a17';c.beginPath();c.arc(0,-93*s,10.5*s,Math.PI,0);c.fill();
  if(o.helmet){c.fillStyle=o.helmet;c.beginPath();c.arc(0,-93*s,11*s,Math.PI,0);c.fill();}
  if(o.rosette){c.fillStyle='#d62828';c.beginPath();c.arc(-7*s,-72*s,4*s,0,7);c.fill();c.fillRect(-9*s,-70*s,4*s,8*s);}
  c.restore();
  if(o.label){c.font=`bold ${Math.max(9,11*s)}px sans-serif`;c.textAlign='center';c.fillStyle='rgba(0,0,0,.55)';const tw=c.measureText(o.label).width+8;c.fillRect(x-tw/2,y+4,tw,14*Math.max(1,s*1.1));c.fillStyle='#fff';c.fillText(o.label,x,y+15*Math.max(1,s*1.05));}
}
function drawKuchi(c,W,H,p){
  const g=c.createLinearGradient(0,0,0,H*.55);g.addColorStop(0,'#9cc7e8');g.addColorStop(1,'#e8f1f6');c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle='#6e7f78';c.beginPath();c.moveTo(W*.55,H*.42);for(let x=W*.55;x<=W;x+=10)c.lineTo(x,H*.3-Math.sin(x*.02)*H*.04);c.lineTo(W,H*.5);c.lineTo(W*.55,H*.5);c.fill();
  c.fillStyle='#c9d0d4';c.fillRect(0,H*.08,W*.5,H*.44);c.fillStyle='#8fa7b8';for(let yy=H*.1;yy<H*.5;yy+=H*.07)c.fillRect(0,yy,W*.5,H*.035);
  c.fillStyle='#6fa368';c.fillRect(0,H*.52,W,H*.48);c.fillStyle='#5c9658';c.fillRect(0,H*.52,W,H*.03);
  const base=H*.86,hs=H*.0088;
  // horse with lei (faces left, toward the people)
  const hx=W*.66;
  drawHorse(c,hx,base,hs,0,p.coat,p.silks,p.no,true,{walk:true,flip:true});
  if(p.g1){c.save();c.translate(hx,base);c.scale(-hs,hs);c.translate(17,-2);c.scale(.75,.9);c.fillStyle='#5b2a86';c.beginPath();c.moveTo(14,-44);c.quadraticCurveTo(0,-30,-14,-44);c.lineTo(-18,-20);c.quadraticCurveTo(0,-12,18,-20);c.closePath();c.fill();c.strokeStyle='#e8c34a';c.lineWidth=2;c.stroke();for(let i=-16;i<=16;i+=3){c.beginPath();c.moveTo(i,-18+Math.abs(i)*.1);c.lineTo(i,-13+Math.abs(i)*.1);c.stroke();}
    c.scale(-1,1);c.fillStyle='#e8c34a';c.font='bold 6px sans-serif';c.textAlign='center';c.fillText(String(p.y),0,-24);c.restore();}
  // groom at the head
  const ph=H*.44;
  person(c,hx-46*hs,base+2,ph,{suit:'#1e2328',pants:'#1e2328',shirt:'#1e2328'});
  // people row (left)
  const ppl=p.people;const left=W*.03,span=Math.max(W*.3,hx-50*hs-W*.06-left),step=span/Math.max(1,ppl.length);
  ppl.forEach((q,i)=>person(c,left+i*step+step/2,base+4,ph*(q.child?.7:1)*(1-.03*((i+1)%2)),{...q,label:null}));
  // number cloth board
  const bx=W*.845,by=base-H*.3,bw=W*.14,bh=H*.3;c.fillStyle='#1d6b3e';c.beginPath();c.moveTo(bx,by);c.lineTo(bx+bw,by);c.lineTo(bx+bw,by+bh*.75);c.quadraticCurveTo(bx+bw/2,by+bh*1.05,bx,by+bh*.75);c.closePath();c.fill();
  c.fillStyle='#fff';c.textAlign='center';c.font=`bold ${bh*.4}px Oswald,sans-serif`;c.fillText(p.no,bx+bw/2,by+bh*.45);c.font=`bold ${Math.max(7,bh*.085)}px sans-serif`;c.fillText(p.name.slice(0,9),bx+bw/2,by+bh*.66);
  // names strip
  c.fillStyle='rgba(0,0,0,.55)';c.fillRect(0,H*.9,W,H*.1);c.fillStyle='#fff';c.font=`${Math.max(8,H*.034)}px sans-serif`;c.textAlign='left';
  c.fillText(`左から ${ppl.map(q=>q.label).join('・')}・厩務員　騎乗 ${p.jname}`,8,H*.965);
  // caption strip
  c.fillStyle='rgba(0,0,0,.55)';c.fillRect(0,0,W,H*.075);c.fillStyle='#fff';c.font=`bold ${Math.max(9,H*.04)}px sans-serif`;c.textAlign='left';c.fillText(`${p.y}年${p.m}月　${p.race}${p.grade&&/^G/.test(p.grade)?`（${p.grade}）`:''}　${p.name}`,8,H*.052);
}
function kuchiPeople(){
  const own=S.part===1?S.parent.name:S.child.name;
  const L=[{label:'三國',suit:'#28344a'}];
  if(S.part===2&&S.parent.fate==='rest')L.push({label:`${S.parent.name}（父）`,suit:'#5a5a5a',hair:'#cfcfcf',rosette:true});
  L.push({label:`${own}（馬主）`,suit:'#4a4f58',rosette:true});
  if(S.part===2&&S.parent.fate==='dead')L.push({label:'（遺影）',suit:'#111',hair:'#111',skin:'#d9d4c7'});
  if(S.flags.mikuniWed)L.push({label:'三國の妻',suit:'#b46a7e',dress:true,hair:'#3b2a20'});
  return L;
}
ACT.kuchi=()=>{
  const RC=UI.race,m=RC.order.find(f=>f.mine),h=m.h;const tr=h.trainer;
  const ppl=[...kuchiPeople(),{label:P(tr).n.split(' ')[0]+'調教師',suit:'#2e3b2f',rosette:true}];
  const photo={y:Y(S.t),m:M(S.t),race:RC.race.name,grade:RC.race.grade,g1:RC.race.grade==='G1',name:h.name,no:m.no,coat:h.coat,silks:m.silks,jname:m.jname,people:ppl,part:S.part};
  openModal(`<div class="from-line">${dstr(S.t)}　${esc(RC.race.course)}競馬場　ウィナーズサークル</div><h2>口取り式</h2>
   <div class="bc kuchi"><canvas id="kcv" aria-label="口取り写真"></canvas><div class="flash" id="kflash"></div></div>
   <p class="letter" id="ktxt" style="font-size:14px">「はい、撮りまーす。目線こちらにお願いしまーす」\nカメラマンの声に、${esc(m.jname)}が馬上で手綱を握り直した。${h.bond>=60?`\n${esc(h.name)}が、あなたの肩に鼻先をすり寄せてくる。`:''}</p>
   <div class="row"><button class="btn gold" data-act="shutter" id="shbtn">撮影する</button></div>`,{lock:true});
  const cv=$('#kcv'),c=cv.getContext('2d');const W=cv.clientWidth,H=Math.round(W*.66),dpr=window.devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';c.scale(dpr,dpr);drawKuchi(c,W,H,photo);
  UI.kuchi=photo;
};
ACT.shutter=()=>{
  const p=UI.kuchi;if(!p||p.taken){nextRace();return;}p.taken=true;
  const f=$('#kflash');if(f){f.classList.remove('go');void f.offsetWidth;f.classList.add('go');}
  try{tone([[1800,0,.03],[900,.04,.05]],'square',.06);}catch(e){}
  S.album=S.album||[];S.album.unshift({...p,taken:undefined});save();
  const t=$('#ktxt');if(t)t.textContent=`パシャ。\n\n記念写真が「記録」のアルバムに加わった。${p.g1?'\n\n優勝レイの重みを、あなたは一生忘れないだろう。':''}`;
  const b=$('#shbtn');if(b){b.textContent=RQ.length?'次のレースへ':'月末へ';}
};
/* ---------- アルバム（記録タブ） ---------- */
vBook=(o=>function(){const al=S.album||[];return (al.length?`<section class="sec"><h2>記念アルバム<small>口取り写真 ${al.length}枚</small></h2><div class="album">${al.map((p,i)=>`<figure class="photo"><canvas data-photo="${i}"></canvas><figcaption>${esc(`${p.y}年${p.m}月 ${p.race}`)}</figcaption></figure>`).join('')}</div></section>`:'')+o.apply(this,arguments);})(vBook);
render=(o=>function(){const r=o.apply(this,arguments);document.querySelectorAll('canvas[data-photo]').forEach(cv=>{const p=(S.album||[])[+cv.dataset.photo];if(!p)return;const W=cv.clientWidth||160,H=Math.round(W*.66),dpr=window.devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';const c=cv.getContext('2d');c.scale(dpr,dpr);drawKuchi(c,W,H,p);});return r;})(render);
