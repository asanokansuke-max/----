/* =========================================================
   本馬場入場 (big races): the field walks out onto the course one by one,
   each horse introduced by the course announcer, the stand roaring
   ========================================================= */
function showParade(){
  const RC=UI.race,r=RC.race,F=[...RC.field].sort((a,b)=>a.no-b.no);RC.paraded=true;
  openModal(`<div class="from-line">${dstr(S.t)}　${esc(r.course)}競馬場　本馬場入場</div>${raceHead(r)}
    <div class="bc"><canvas id="prd" aria-label="本馬場入場"></canvas></div>
    <div class="padcast" id="prdcast"><span class="pc-l">場内アナウンス</span>これより、${esc(r.name)}出走馬の本馬場入場です</div>
    <div class="row"><button class="btn" data-act="paradeSkip">入場を飛ばす</button><button class="btn pri" data-act="warmup" id="prdgo" disabled>返し馬へ</button></div>`,{wide:true,lock:true});
  const cv=$('#prd'),c=cv.getContext('2d'),W=cv.clientWidth,H=fitH(cv,Math.round(clamp(W*.62,220,420)),180),dpr=window.devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';c.scale(dpr,dpr);
  const SK=sky(M(S.t)),t0=performance.now(),gap=1250,lead=1800;let shown=-1;
  try{if(SND.on){sndInit();if(!SND.nodes)sndStart();sndCrowd(.08);}}catch(e){}
  const cast=$('#prdcast');
  const loop=now=>{if(!document.getElementById('prd'))return;const t=now-t0-(RC.prSkip?99999:0);
    const g=c.createLinearGradient(0,0,0,H*.4);g.addColorStop(0,SK[0]);g.addColorStop(1,SK[2]);c.fillStyle=g;c.fillRect(0,0,W,H*.42);
    drawStand(c,W,H,-40,W+40,now,0);
    c.fillStyle='#cfc9ba';c.fillRect(0,H*.4,W,H*.03);
    // the course: turf with the outer rail in front of the stand, the tunnel mouth on the left
    c.fillStyle='#4f9a5e';c.fillRect(0,H*.43,W,H*.57);for(let i=0;i<10;i++){c.fillStyle=i%2?'rgba(255,255,255,.05)':'rgba(0,0,0,.03)';c.fillRect(i*W/10,H*.43,W/10,H*.57);}
    c.fillStyle='#f6f6f2';c.fillRect(0,H*.45,W,3);for(let x=0;x<W;x+=W/26)c.fillRect(x,H*.45,2,H*.035);
    c.fillStyle='#2b2f33';c.fillRect(-10,H*.38,W*.1,H*.08);c.fillStyle='#111';c.fillRect(0,H*.395,W*.08,H*.065);
    // horses walk out in number order, each to the right and on towards the start
    const items=[];F.forEach((f,i)=>{const st=lead+i*gap,el=t-st;if(el<0)return;const sp=W*.00016;let x=W*.04+el*sp;const lane=i%2;
      const trot=el>2600;if(trot)x+=(el-2600)*sp*1.8;if(x>W+80)return;items.push({f,x,y:H*(.62+lane*.14),el,trot});});
    items.sort((a,b)=>a.y-b.y).forEach(it=>{const s=H/330*(1+(it.y-H*.6)/H*.8);drawHorse(c,it.x,it.y,s,it.el/1000*Math.PI*2*(it.trot?1.6:.8)+it.f.no,it.f.coat||(it.f.h?it.f.h.coat:'鹿毛'),it.f.silks,it.f.no,it.f.mine,{walk:!it.trot});
      if(it.f.mine){c.font='bold 11px sans-serif';const tw=c.measureText(it.f.name).width+10;c.fillStyle='rgba(0,0,0,.72)';c.fillRect(it.x-tw/2,it.y-70*s,tw,16);c.fillStyle='#ffd166';c.textAlign='center';c.fillText(it.f.name,it.x,it.y-70*s+12);}});
    // the announcer introduces each horse as it comes out
    const idx=RC.prd3d?-1:Math.floor((t-lead)/gap);if(idx>shown&&idx>=0&&idx<F.length){shown=idx;const f=F[idx];
      if(cast)cast.innerHTML=window.__castLine?window.__castLine(f):`<span class="pc-l">場内アナウンス</span><b>${f.no}番 ${esc(f.name)}</b>　${esc(f.jname)}騎手　${f.pop}番人気`;
      if(f.mine){try{se('up');}catch(e){}}}
    if(!RC.prd3d&&t>lead+F.length*gap+600){const b=$('#prdgo');if(b&&b.disabled){b.disabled=false;if(cast)cast.innerHTML='<span class="pc-l">場内アナウンス</span>以上、出走馬の本馬場入場でした';}}
    // lower third
    c.fillStyle='rgba(8,16,12,.7)';c.fillRect(0,H-26,W,26);c.fillStyle='#ffd166';c.font='bold 12px sans-serif';c.textAlign='left';c.fillText(`本馬場入場　${r.name}`,10,H-9);
    requestAnimationFrame(loop);};
  requestAnimationFrame(loop);
}
ACT.paradeSkip=()=>{UI.race.prSkip=true;const b=$('#prdgo');if(b)b.disabled=false;};
ACT.warmup=(o=>function(){const RC=UI.race;if(RC&&RC.race.grade==='G1'&&!RC.paraded){showParade();return;}try{sndCrowd(.02);}catch(e){}return o.apply(this,arguments);})(ACT.warmup);

/* with the 3D view, the announcer follows the horses on screen */
addEventListener('message',e=>{const d=e.data||{};if(d.type!=='race3d-parade')return;const RC=UI.race;if(!RC)return;const f=RC.field.find(x=>x.no===d.no),cast=$('#prdcast');
  if(f&&cast)cast.innerHTML=`<span class="pc-l">場内アナウンス</span><b>${f.no}番 ${esc(f.name)}</b>　${esc(f.jname)}騎手　${f.pop}番人気`;if(f&&f.mine){try{se('up');}catch(x){}}
  if(d.last)setTimeout(()=>{const b=$('#prdgo');if(b&&b.disabled){b.disabled=false;if(cast)cast.innerHTML='<span class="pc-l">場内アナウンス</span>以上、出走馬の本馬場入場でした';}},3000);});
