/* =========================================================
   決勝写真 (photo-finish print): slit-scan look, LED marquee,
   horses at the line spaced by the real margins, 1着/2着 tags
   ========================================================= */
function drawPhotoFinish(cv,RC){const W=cv.clientWidth,H=Math.round(W*.42),dpr=window.devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';const c=cv.getContext('2d');c.scale(dpr,dpr);
  const ord=RC.order,r=RC.race,seed=r.name+S.t;
  // slit-scan background: horizontal streaks (the camera sees one vertical line over time)
  const bands=['#6f7a6c','#808c79','#5d6a5c','#94a08c','#727d6f','#a3ab9a','#66705f'];
  for(let y=0;y<H;y+=2){const h=hash(seed+'y'+y);c.fillStyle=bands[Math.floor(h*bands.length)];c.fillRect(0,y,W,2);}
  c.fillStyle='rgba(170,150,190,.18)';c.fillRect(0,0,W,H);
  // far rail streaks and turf streaks
  c.fillStyle='rgba(240,240,235,.55)';c.fillRect(0,H*.27,W,3);c.fillRect(0,H*.31,W,1.5);
  // LED marquee across the top
  c.fillStyle='#1a0d10';c.fillRect(0,H*.1,W,H*.075);c.fillStyle='#ff3046';c.shadowColor='#ff3046';c.shadowBlur=6;c.font=`bold ${H*.05}px "Zen Kaku Gothic New",sans-serif`;c.textAlign='left';
  const mq=`${r.course} ${M(S.t)}-${1+Math.floor(hash(seed)*27)}  R${r.g?11:9}  `;let mx=-((performance.now()/40)%200);while(mx<W){c.fillText(mq,mx,H*.157);mx+=c.measureText(mq).width;}c.shadowBlur=0;
  // horses at the line: nose positions from the margins (sprite nose→buttock is ~80 units)
  const BODY=80;
  // the photo is about the close finish: centred on the pair the judge had to split (1st-2nd, or 2nd-3rd when the winner was clear)
  const K=RC.photo?(RC.photoK||0):0,g0=(ord[K]&&ord[K].gapL)||0,rg=f=>Math.max(0,(f.gapL||0)-g0);
  const lineX=W*.8,shown=ord.slice(K,Math.min(K+2,ord.length));   // only the pair the judge had to split
  const lanes=shown.map((f,i)=>({f,i})).sort((a,b)=>(a.f.lane||0)-(b.f.lane||0));
  lanes.forEach((o,k)=>{const f=o.f,y=H*(.74+k*.11),sc=H/112*(.84+k*.06),nose=lineX-Math.min(4,rg(f))*BODY*sc;   // one length = one horse's body at that depth
    c.save();c.filter='saturate(.7) contrast(1.08)';drawHorse(c,nose-53*sc,y,sc,.7+o.i*.9,f.coat||(f.h?f.h.coat:'鹿毛'),f.silks,f.no,false,{});c.restore();});
  // the slit: thin vertical lines over everything, and the finish line itself
  c.fillStyle='rgba(120,90,150,.10)';for(let x=0;x<W;x+=3)c.fillRect(x,0,1,H);
  c.fillStyle='rgba(255,255,255,.55)';c.fillRect(lineX,H*.2,1.5,H*.8);
  // tags
  const tag=(t,x,y)=>{const F=`bold ${H*.05}px "Zen Kaku Gothic New",sans-serif`;c.font=F;const [p1,no,p2]=t.split('\u0000');if(no==null){const tw=c.measureText(t).width+16;c.fillStyle='#fff';c.fillRect(x-tw/2,y-H*.045,tw,H*.065);c.strokeStyle='#333';c.lineWidth=1;c.strokeRect(x-tw/2,y-H*.045,tw,H*.065);c.fillStyle='#111';c.textAlign='center';c.fillText(t,x,y+H*.005);return;}
    const cr=H*.027,w1=c.measureText(p1).width,w2=c.measureText(p2).width,tw=w1+w2+cr*2+28;const x0=x-tw/2;c.fillStyle='#fff';c.fillRect(x0,y-H*.045,tw,H*.065);c.strokeStyle='#333';c.lineWidth=1;c.strokeRect(x0,y-H*.045,tw,H*.065);
    c.fillStyle='#111';c.textAlign='left';c.fillText(p1,x0+8,y+H*.005);const cx=x0+12+w1+cr,cy=y-H*.012;c.beginPath();c.arc(cx,cy,cr,0,7);c.strokeStyle='#111';c.lineWidth=1.2;c.stroke();c.textAlign='center';c.font=`bold ${H*(+no>=10?.03:.036)}px Oswald,"Zen Kaku Gothic New",sans-serif`;const ls=c.letterSpacing;try{c.letterSpacing='0px';}catch(e){}c.fillText(no,cx,cy+H*.012);try{c.letterSpacing=ls;}catch(e){}c.font=F;c.textAlign='left';c.fillText(p2,cx+cr+6,y+H*.005);};
  const circ='①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱';
  const yOf=f=>{const k=lanes.findIndex(o=>o.f===f);return H*(.74+k*.11);};
  const noseOf=f=>{const k=lanes.findIndex(o=>o.f===f);return lineX-Math.min(4,rg(f))*BODY*H/112*(.84+k*.06);};
  [K,K+1].forEach(i=>{const f=ord[i];if(!f)return;{const k=lanes.findIndex(o=>o.f===f),sc=H/112*(.84+k*.06);tag(`${i+1}着 \u0000${f.no}\u0000 ${f.name}`,clamp(noseOf(f)-BODY*sc*.55,W*.17,W*.72),yOf(f)-34*sc);}});
  // course / race tag top-left
  c.fillStyle='#101010';c.fillRect(0,0,W*.14,H*.075);c.fillStyle='#1f5fd1';c.beginPath();c.moveTo(W*.14,0);c.lineTo(W*.17,0);c.lineTo(W*.15,H*.075);c.lineTo(W*.12,H*.075);c.fill();c.fillStyle='#101010';c.fillRect(W*.16,0,W*.09,H*.075);
  c.fillStyle='#fff';c.font=`bold ${H*.05}px "Zen Kaku Gothic New",sans-serif`;c.textAlign='left';c.fillText(r.course,W*.015,H*.057);c.fillText(`${r.g?11:9}R`,W*.175,H*.057);
  if(RC.photo){const lb=K?`${K+1}着 写真判定`:'写真判定';c.font=`bold ${H*.05}px "Zen Kaku Gothic New",sans-serif`;const lw=c.measureText(lb).width+16;c.fillStyle='#d9a400';c.fillRect(W-lw-6,4,lw,H*.07);c.fillStyle='#000';c.textAlign='center';c.fillText(lb,W-6-lw/2,H*.058);}
  if(K>0&&ord[0]){c.fillStyle='rgba(0,0,0,.6)';c.fillRect(W*.27,0,W*.4,H*.075);c.fillStyle='#fff';c.textAlign='left';c.fillText(`1着 ${ord[0].no}番 ${ord[0].name}（先着）`,W*.28,H*.057);}
}
showBoard=(o=>function(){const r=o.apply(this,arguments);const RC=UI.race,pr=$('#sheet .board-pair');if(RC&&pr&&!$('#pfcv')){pr.insertAdjacentHTML('beforebegin','<div class="pfwrap '+(RC.photo?'big':'small')+'" style="border-radius:6px;overflow:hidden;box-shadow:0 0 0 2px #2b2f33"><canvas id="pfcv" style="display:block;width:100%" aria-label="決勝写真"></canvas></div>');
  const cv=$('#pfcv');const loop=()=>{if(!document.getElementById('pfcv'))return;drawPhotoFinish(cv,RC);setTimeout(()=>requestAnimationFrame(loop),80);};loop();}return r;})(showBoard);
/* the result board must fit on one screen: if the sheet would scroll, shrink the pictures (they keep their proportions);
   on a landscape phone the finish photo and the board sit side by side */
(function(){const st=document.createElement('style');st.textContent=`.pfwrap.small{width:56%;margin:0 auto;opacity:.92}.pfwrap.big{box-shadow:0 0 0 3px #d9a400!important}
.bboard canvas,.bview canvas{height:auto!important}.bview::after{white-space:nowrap}
.bland{display:grid;grid-template-columns:2.4fr 1fr;gap:12px;align-items:center;margin:0 auto 8px}.bland .board-pair{margin:0;grid-template-columns:1fr}.bland .bview{display:none}`;document.head.appendChild(st);})();
function boardFit(){const sh=$('#sheet'),pr=$('#sheet .board-pair');if(!sh||!pr||$('#modal').hidden)return;
  const pfw=$('#pfcv')?$('#pfcv').parentNode:null,land=innerWidth>innerHeight*1.3;
  if(land&&pfw&&!pr.closest('.bland')){const w=document.createElement('div');w.className='bland';pfw.parentNode.insertBefore(w,pfw);w.appendChild(pfw);w.appendChild(pr);}
  else if(!land&&pr.closest('.bland')){const w=pr.closest('.bland');w.parentNode.insertBefore(pfw,w);w.parentNode.insertBefore(pr,w);w.remove();}
  const box=pr.closest('.bland'),items=box?[box]:[pr,pfw];items.forEach(e=>{if(e){e.style.width='';e.style.marginLeft=e.style.marginRight='';}});
  let over=sh.scrollHeight-sh.clientHeight;if(over<=2)return;
  const shrink=(e,minK)=>{if(!e||over<=2)return;const h=e.offsetHeight;if(!h)return;const k=Math.max(minK,(h-over-6)/h);e.style.width=(k*100).toFixed(1)+'%';e.style.marginLeft=e.style.marginRight='auto';over-=h*(1-k);};
  if(box)shrink(box,.4);else{shrink(pr,.42);shrink(pfw,.42);}}
showBoard=(o=>function(){const r=o.apply(this,arguments);[30,200,600,1200].forEach(t=>setTimeout(boardFit,t));return r;})(showBoard);
addEventListener('resize',()=>{if(document.getElementById('board'))boardFit();});
