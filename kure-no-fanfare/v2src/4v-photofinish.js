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
  const lineX=W*.8,shown=ord.slice(0,Math.min(3,ord.length));
  const lanes=shown.map((f,i)=>({f,i})).sort((a,b)=>(a.f.lane||0)-(b.f.lane||0));
  lanes.forEach((o,k)=>{const f=o.f,y=H*(.74+k*.11),sc=H/112*(.84+k*.06),nose=lineX-Math.min(4,(f.gapL||0))*BODY*sc;   // one length = one horse's body at that depth
    c.save();c.filter='saturate(.7) contrast(1.08)';drawHorse(c,nose-53*sc,y,sc,.7+o.i*.9,f.coat||(f.h?f.h.coat:'鹿毛'),f.silks,f.no,false,{});c.restore();});
  // the slit: thin vertical lines over everything, and the finish line itself
  c.fillStyle='rgba(120,90,150,.10)';for(let x=0;x<W;x+=3)c.fillRect(x,0,1,H);
  c.fillStyle='rgba(255,255,255,.55)';c.fillRect(lineX,H*.2,1.5,H*.8);
  // tags
  const tag=(t,x,y)=>{c.font=`bold ${H*.05}px "Zen Kaku Gothic New",sans-serif`;const tw=c.measureText(t).width+16;c.fillStyle='#fff';c.fillRect(x-tw/2,y-H*.045,tw,H*.065);c.strokeStyle='#333';c.lineWidth=1;c.strokeRect(x-tw/2,y-H*.045,tw,H*.065);c.fillStyle='#111';c.textAlign='center';c.fillText(t,x,y+H*.005);};
  const circ='①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱';
  const yOf=f=>{const k=lanes.findIndex(o=>o.f===f);return H*(.74+k*.11);};
  const noseOf=f=>{const k=lanes.findIndex(o=>o.f===f);return lineX-Math.min(4,(f.gapL||0))*BODY*H/112*(.84+k*.06);};
  [0,1].forEach(i=>{const f=ord[i];if(!f)return;{const k=lanes.findIndex(o=>o.f===f),sc=H/112*(.84+k*.06);tag(`${i+1}着 ${circ[f.no-1]} ${f.name}`,clamp(noseOf(f)-BODY*sc*1.3,W*.17,W*.62),yOf(f)-28*sc);}});
  // course / race tag top-left
  c.fillStyle='#101010';c.fillRect(0,0,W*.14,H*.075);c.fillStyle='#1f5fd1';c.beginPath();c.moveTo(W*.14,0);c.lineTo(W*.17,0);c.lineTo(W*.15,H*.075);c.lineTo(W*.12,H*.075);c.fill();c.fillStyle='#101010';c.fillRect(W*.16,0,W*.09,H*.075);
  c.fillStyle='#fff';c.font=`bold ${H*.05}px "Zen Kaku Gothic New",sans-serif`;c.textAlign='left';c.fillText(r.course,W*.015,H*.057);c.fillText(`${r.g?11:9}R`,W*.175,H*.057);
  if(RC.photo){c.fillStyle='#d9a400';c.fillRect(W-W*.17,4,W*.16,H*.07);c.fillStyle='#000';c.textAlign='center';c.fillText('写真判定',W-W*.09,H*.058);}
}
showBoard=(o=>function(){const r=o.apply(this,arguments);const RC=UI.race,pr=$('#sheet .board-pair');if(RC&&pr&&!$('#pfcv')){pr.insertAdjacentHTML('beforebegin','<div style="border-radius:6px;overflow:hidden;box-shadow:0 0 0 2px #2b2f33"><canvas id="pfcv" style="display:block;width:100%" aria-label="決勝写真"></canvas></div>');
  const cv=$('#pfcv');const loop=()=>{if(!document.getElementById('pfcv'))return;drawPhotoFinish(cv,RC);setTimeout(()=>requestAnimationFrame(loop),80);};loop();}return r;})(showBoard);
