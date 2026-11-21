/* =========================================================
   月替わりの演出: the old calendar page tears away, the new month
   appears over a seasonal scene with what this month holds
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
#mturn{position:fixed;inset:0;z-index:45;display:flex;align-items:center;justify-content:center;background:rgba(8,14,11,.82);cursor:pointer;animation:mtIn .3s ease-out}
@keyframes mtIn{from{opacity:0}}
#mturn.out{animation:mtOut .45s ease-in forwards}@keyframes mtOut{to{opacity:0}}
.mt-card{position:relative;width:min(88vw,360px);perspective:900px}
.mt-scene{display:block;width:100%;border-radius:14px 14px 0 0}
.mt-page{position:relative;background:#fbf8f0;border-radius:0 0 14px 14px;padding:14px 16px 16px;box-shadow:0 20px 50px rgba(0,0,0,.5)}
.mt-rings{position:absolute;top:-8px;left:0;right:0;display:flex;justify-content:space-around;padding:0 30px}.mt-rings i{width:8px;height:16px;border-radius:4px;background:#888;box-shadow:inset 0 2px 2px rgba(0,0,0,.4)}
.mt-y{font-family:Oswald,sans-serif;font-size:13px;color:#8a7f6a;letter-spacing:.2em}
.mt-m{font-family:"Shippori Mincho B1",serif;font-weight:900;font-size:64px;line-height:1;color:#1d1a14;display:flex;align-items:baseline;gap:6px}
.mt-m small{font-size:22px}.mt-m em{font-style:normal;font-size:15px;color:#8a7f6a;margin-left:auto;font-family:var(--f-body)}
.mt-list{margin-top:10px;display:grid;gap:5px;font-size:13px;color:#2a2418}
.mt-list div{display:flex;gap:8px;align-items:baseline;opacity:0;animation:mtLine .35s ease-out forwards}
.mt-list b{flex:none;font-size:10px;background:#1d1a14;color:#fbf8f0;padding:1px 6px;border-radius:3px}
.mt-list b.r{background:#c8161d}.mt-list b.g{background:#2f6e3a}
@keyframes mtLine{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.mt-old{position:absolute;inset:0;background:#fbf8f0;border-radius:14px;transform-origin:50% 0;animation:mtTear .7s cubic-bezier(.5,0,.8,.4) .35s forwards;box-shadow:0 10px 30px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:2}
.mt-old span{font-family:"Shippori Mincho B1",serif;font-weight:900;font-size:80px;color:#1d1a14}
@keyframes mtTear{0%{transform:rotateX(0) rotate(0)}30%{transform:rotateX(-12deg) rotate(-2deg)}100%{transform:translateY(120vh) rotateX(-70deg) rotate(-14deg);opacity:.6}}
.mt-tap{position:absolute;bottom:-28px;left:0;right:0;text-align:center;font-size:11px;color:rgba(255,255,255,.6)}
`;document.head.appendChild(st);})();
const SEASON={1:'新春',2:'厳冬',3:'早春',4:'春',5:'初夏',6:'梅雨',7:'盛夏',8:'晩夏',9:'初秋',10:'秋',11:'晩秋',12:'師走'};
function mtLines(){const t=S.t,m=M(t),L=[];
  const big=GR.filter(g=>g.m===m&&g.gr==='G1'&&!g.abroad&&!g.local).map(g=>g.n);if(big.length)L.push(['r','G1',big.join('・')]);
  const run=(typeof racing==='function'?racing():[]).filter(h=>h.status==='現役');
  run.slice(0,3).forEach(h=>L.push(['g','愛馬',`${h.name}　${['絶不調','不調','普通','好調','絶好調'][clamp((h.cond||3)-1,0,4)]}${h.fat>50?'・疲れ気味':''}`]));
  if(S.sale&&!S.sale.blocked)L.push(['','セリ',`${S.sale.kind||'セリ'}が開かれる`]);
  if(S.inbox&&S.inbox.length)L.push(['','出来事',`${S.inbox.length}件の知らせが届いている`]);
  if(m!==12){const n=(12-m+12)%12;L.push(['','有馬',`有馬記念まで あと${n}か月`]);}else L.push(['r','有馬','今月、暮れの中山']);
  return L.slice(0,5);}
function drawSeason(cv,m){const W=cv.clientWidth,H=Math.round(W*.42),dpr=window.devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';const c=cv.getContext('2d');c.scale(dpr,dpr);
  const sky={1:['#9fb6cf','#e6eef5'],2:['#8ea6bf','#dfe8f0'],3:['#a9c9e6','#f3e9ee'],4:['#8cc2ea','#f6e6ee'],5:['#6fb3e6','#e6f4ff'],6:['#9aa7b0','#d5dbdf'],7:['#3f9be0','#cfeaff'],8:['#4f9fdc','#ffe2b8'],9:['#7fb0d8','#f1e3c8'],10:['#7aa6cf','#f3d9b0'],11:['#8a9fb8','#efcfa6'],12:['#2b3a62','#f0a35e']}[m];
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,sky[0]);g.addColorStop(1,sky[1]);c.fillStyle=g;c.fillRect(0,0,W,H);
  const grass={1:'#cfd8cf',2:'#e8eef0',3:'#9cc28a',4:'#7fbf6a',5:'#5fae55',6:'#4f9a50',7:'#4a9a45',8:'#6aa04a',9:'#8aa65a',10:'#b59b52',11:'#a38652',12:'#7f8f6a'}[m];
  c.fillStyle='rgba(90,110,100,.6)';c.beginPath();c.moveTo(0,H*.62);for(let x=0;x<=W;x+=8)c.lineTo(x,H*.52-Math.sin(x*.02)*H*.05-Math.sin(x*.007+1)*H*.06);c.lineTo(W,H*.7);c.lineTo(0,H*.7);c.fill();
  c.fillStyle=grass;c.fillRect(0,H*.66,W,H*.34);
  // paddock fence
  c.strokeStyle='#f4f1ea';c.lineWidth=2;for(const y of [H*.74,H*.8]){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}for(let x=10;x<W;x+=W/9){c.fillStyle='#e8e2d4';c.fillRect(x,H*.71,3,H*.13);}
  // a grazing horse
  const coat=((typeof mine==='function'&&mine()[0])||{}).coat||'鹿毛';drawHorse(c,W*.62,H*.93,H/150,1.2,coat,{a:'#333',b:'#333',p:''},'',false,{walk:true,nj:true});
  // seasonal touch
  if(m<=2||m===12){c.fillStyle='rgba(255,255,255,.9)';for(let i=0;i<50;i++){c.beginPath();c.arc(hash('s'+i)*W,hash('t'+i)*H,1+hash('u'+i)*1.8,0,7);c.fill();}}
  if(m===3||m===4){c.fillStyle='rgba(255,190,210,.9)';for(let i=0;i<40;i++){c.beginPath();c.ellipse(hash('p'+i)*W,hash('q'+i)*H*.9,2.2,1.4,hash('r'+i)*3,0,7);c.fill();}}
  if(m===6){c.strokeStyle='rgba(255,255,255,.5)';c.beginPath();for(let i=0;i<60;i++){const x=hash('a'+i)*W,y=hash('b'+i)*H;c.moveTo(x,y);c.lineTo(x-2,y+8);}c.stroke();}
  if(m===7||m===8){c.fillStyle='rgba(255,240,180,.9)';c.beginPath();c.arc(W*.85,H*.2,H*.1,0,7);c.fill();}
  if(m===10||m===11){c.fillStyle='rgba(205,110,40,.85)';for(let i=0;i<30;i++){c.beginPath();c.ellipse(hash('l'+i)*W,hash('m'+i)*H,2.4,1.4,hash('n'+i)*3,0,7);c.fill();}}
}
function showMonthTurn(done){const prevM=M(S.t-1),m=M(S.t);let el=$('#mturn');if(el)el.remove();el=document.createElement('div');el.id='mturn';
  el.innerHTML=`<div class="mt-card"><canvas class="mt-scene" id="mtcv"></canvas><div class="mt-page"><div class="mt-rings"><i></i><i></i><i></i><i></i></div>
    <div class="mt-y">${Y(S.t)}　${S.part===1?'第一部':'第二部'}</div><div class="mt-m">${m}<small>月</small><em>${SEASON[m]}</em></div>
    <div class="mt-list">${mtLines().map((l,i)=>`<div style="animation-delay:${1+i*.18}s"><b class="${l[0]}">${esc(l[1])}</b><span>${esc(l[2])}</span></div>`).join('')}</div></div>
    <div class="mt-old"><span>${prevM}<small style="font-size:24px">月</small></span></div><div class="mt-tap">タップして進む</div></div>`;
  document.body.appendChild(el);drawSeason($('#mtcv'),m);try{se('turn');}catch(e){}
  let gone=false;const go=()=>{if(gone)return;gone=true;el.classList.add('out');setTimeout(()=>{el.remove();done&&done();setTimeout(()=>{try{flushNotif();}catch(e){}},1500);},420);};
  el.addEventListener('click',go);setTimeout(go,4200);}
ACT.repOk=(o=>function(){closeModal();showMonthTurn(()=>o.apply(this,[]));})(ACT.repOk);
/* race-day sheet: tighter so it fits a phone screen without scrolling */
(function(){const st=document.createElement('style');st.textContent=`
.rdopts{gap:6px}
.rdopt{padding:8px 12px;min-height:54px;gap:10px;border-radius:10px}
.rdopt b{font-size:15px}.rdopt small{font-size:11.5px;line-height:1.4;margin-top:1px}
.rdopt .ic{width:34px;height:34px}.rdopt .ic svg{width:18px;height:18px}
.papers{gap:6px}.papers .paperbtn{padding:6px 9px;gap:3px}.papers .paperbtn b{font-size:12px}.papers .paperbtn small{font-size:10px}.papers .paperbtn .mk{font-size:13px}
.sheet .debutnote,.sheet .cnote{margin:-4px 0 0}
`;document.head.appendChild(st);})();
showRaceDay=(o=>function(){const r=o.apply(this,arguments);const p=$('#sheet .panel.row');if(p){p.style.padding='8px 12px';const sv=p.querySelector('svg');if(sv){sv.setAttribute('width','36');sv.setAttribute('height','36');}}return r;})(showRaceDay);
