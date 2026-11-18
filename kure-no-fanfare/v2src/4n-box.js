/* =========================================================
   馬主席 v4 (after the photo): a bright room, rows of white counters
   with small monitors, a low pale ceiling with vents, and the whole
   home straight through the glass — crowd on the apron, real horses
   ========================================================= */
function boxAnim(){
  const cv=$('#obox');if(!cv)return;const c=cv.getContext('2d');
  const W=cv.clientWidth,H=Math.round(clamp(W*.95,280,520)),dpr=window.devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';c.scale(dpr,dpr);
  const RC=UI.race,r=RC.race,mon=M(S.t),SK=sky(mon),t0=performance.now();
  const wy0=H*.13,wy1=H*.6;                       // window band
  const yTop=wy0+H*.02,ySky=wy0+H*.13,yInf=ySky+H*.03,yDirt=wy0+H*.255,yTurf=wy0+H*.29,yRail=wy0+H*.375,yApron=wy0+H*.385;
  const bg=document.createElement('canvas');bg.width=W*dpr;bg.height=H*dpr;const b=bg.getContext('2d');b.scale(dpr,dpr);
  /* outside */
  const g=b.createLinearGradient(0,wy0,0,ySky);g.addColorStop(0,mon===12?SK[1]:'#cfe2f2');g.addColorStop(1,mon===12?SK[2]:'#eef4f8');b.fillStyle=g;b.fillRect(0,wy0,W,wy1-wy0);
  for(let i=0;i<46;i++){const x=i*W/46,bh=H*(.012+hh('sk'+i)*.05);b.fillStyle=hh('sc'+i)<.5?'#b9c3c9':'#a7b2b9';b.fillRect(x,ySky-bh,W/52,bh);b.fillStyle='rgba(255,255,255,.5)';for(let k=0;k<bh/5;k++)b.fillRect(x+2,ySky-bh+3+k*5,W/52-4,1);}
  b.fillStyle='#6f8f67';for(let i=0;i<40;i++){b.beginPath();b.ellipse(i*W/38,ySky+H*.004,W*.03,H*.012,0,0,7);b.fill();}
  // infield lawn, hedges, big vision + tote board
  b.fillStyle='#86b56e';b.fillRect(0,yInf,W,yDirt-yInf);for(let i=0;i<6;i++){b.fillStyle='rgba(255,255,255,.05)';b.fillRect(0,yInf+i*(yDirt-yInf)/6,W,(yDirt-yInf)/12);}
  b.fillStyle='#55804f';for(let i=0;i<9;i++){b.beginPath();b.ellipse(W*(.55+i*.05),yInf+H*.012,W*.03,H*.008,0,0,7);b.fill();}
  const vx=W*.12,vy=ySky-H*.085,vw=W*.62,vh=H*.095;b.fillStyle='#2b2f33';b.fillRect(vx-3,vy-3,vw+6,vh+6);b.fillRect(vx+vw*.15,vy+vh,4,yInf-vy-vh+H*.01);b.fillRect(vx+vw*.85,vy+vh,4,yInf-vy-vh+H*.01);
  const vL=vw*.56;   // left: the picture, right: the result / odds panel (like the real turf vision)
  // dirt course + its rails
  b.fillStyle='#b9a58b';b.fillRect(0,yDirt,W,yTurf-yDirt);b.fillStyle='rgba(255,255,255,.9)';b.fillRect(0,yDirt,W,1.5);b.fillRect(0,yTurf-2,W,1.5);
  // turf course (near) with mowing bands and the white running rail
  b.fillStyle='#5aa848';b.fillRect(0,yTurf,W,yRail-yTurf);for(let i=0;i<12;i++){b.fillStyle=i%2?'rgba(255,255,255,.06)':'rgba(0,0,0,.035)';b.fillRect(i*W/12,yTurf,W/12,yRail-yTurf);}
  b.fillStyle='#fff';b.fillRect(0,yTurf+2,W,1.6);for(let x=0;x<W;x+=W/40)b.fillRect(x,yTurf+2,1.2,H*.008);
  b.fillStyle='#f4f4f0';b.fillRect(0,yRail-H*.01,W,2.2);for(let x=0;x<W;x+=W/28)b.fillRect(x,yRail-H*.01,1.6,H*.012);
  // apron + crowd (heads and coats), getting bigger toward us
  b.fillStyle='#c9c6bd';b.fillRect(0,yRail,W,wy1-yRail);
  for(let row=0;row<7;row++){const y=yApron+row*(wy1-yApron)/7,sz=2.2+row*.75;for(let x=-4;x<W+6;x+=sz*2.1){const h=hh('cr'+row+'.'+Math.round(x));if(h<.25)continue;const jx=(hh('jx'+x+row)-.5)*sz;
    b.fillStyle=['#2b3a55','#3a3a3a','#6b4a3a','#e2ddd2','#5a2d2d','#2e4a3f','#9a7b52','#b33a35'][Math.floor(h*8)%8];b.fillRect(x+jx-sz*.7,y+sz*.6,sz*1.4,sz*1.6);
    b.fillStyle=h<.4?'#cfcfcf':h<.7?'#241b16':'#3b2a20';b.beginPath();b.arc(x+jx,y+sz*.25,sz*.55,0,7);b.fill();}}
  // glass: faint green tint at edges, reflections
  const gl=b.createLinearGradient(0,0,W,0);gl.addColorStop(0,'rgba(120,190,170,.18)');gl.addColorStop(.15,'rgba(120,190,170,0)');gl.addColorStop(.85,'rgba(120,190,170,0)');gl.addColorStop(1,'rgba(120,190,170,.18)');b.fillStyle=gl;b.fillRect(0,wy0,W,wy1-wy0);
  b.fillStyle='rgba(255,255,255,.07)';b.beginPath();b.moveTo(W*.35,wy0);b.lineTo(W*.42,wy0);b.lineTo(W*.3,wy1);b.lineTo(W*.23,wy1);b.fill();
  for(let i=1;i<6;i++){const x=W*i/6;b.fillStyle='rgba(200,215,210,.55)';b.fillRect(x-1,wy0,2,wy1-wy0);}
  b.fillStyle='#e7ebe8';b.fillRect(0,wy1-2,W,5);
  /* ceiling: low, pale sage, vent grilles and round downlights */
  const cg=b.createLinearGradient(0,0,0,wy0);cg.addColorStop(0,'#cfd8d2');cg.addColorStop(1,'#aebdb4');b.fillStyle=cg;b.fillRect(0,0,W,wy0);
  b.fillStyle='#9fb0a6';b.fillRect(0,wy0-H*.03,W,H*.03);
  [[.05,.28],[.62,.95]].forEach(([a,z])=>{b.fillStyle='#4a5752';b.fillRect(W*a,wy0-H*.07,W*(z-a),H*.035);b.fillStyle='rgba(255,255,255,.12)';for(let x=W*a;x<W*z;x+=4)b.fillRect(x,wy0-H*.07,1,H*.035);});
  for(let i=0;i<6;i++){const x=W*(.36+i*.05);b.fillStyle='#e9eee9';b.beginPath();b.arc(x,wy0-H*.052,H*.012,0,7);b.fill();b.fillStyle='#4a5752';b.beginPath();b.arc(x,wy0-H*.052,H*.006,0,7);b.fill();}
  for(let i=0;i<4;i++){b.fillStyle='rgba(255,255,240,.95)';b.beginPath();b.arc(W*(.12+i*.25),H*.03,H*.009,0,7);b.fill();}
  /* the room: rows of white counters seen from behind and above */
  const fl=b.createLinearGradient(0,wy1,0,H);fl.addColorStop(0,'#5f6264');fl.addColorStop(1,'#3e4143');b.fillStyle=fl;b.fillRect(0,wy1+3,W,H-wy1);
  const rows=[{y:.625,s:.5},{y:.69,s:.64},{y:.775,s:.82},{y:.885,s:1.05}];const seats=[];
  rows.forEach((rw,ri)=>{const y=H*rw.y,s=rw.s,dw=W*.17*s,gap=W*.012*s,n=Math.ceil(W/(dw+gap))+2,off=(ri%2)*dw*.4-dw*.3;
    for(let k=0;k<n;k++){const x=off+k*(dw+gap);const top=H*.045*s,front=H*.06*s;
      // desk top
      b.fillStyle='#e9e5da';b.beginPath();b.moveTo(x+dw*.06,y);b.lineTo(x+dw*.94,y);b.lineTo(x+dw,y+top);b.lineTo(x,y+top);b.closePath();b.fill();
      b.fillStyle='rgba(0,0,0,.06)';b.fillRect(x,y+top-1,dw,1.5);
      // front panel (the side we see), slightly shaded
      const fg=b.createLinearGradient(0,y+top,0,y+top+front);fg.addColorStop(0,'#d8d4c9');fg.addColorStop(1,'#bdb8ad');b.fillStyle=fg;b.fillRect(x,y+top,dw,front);
      b.fillStyle='rgba(0,0,0,.08)';b.fillRect(x+dw-2,y+top,2,front);
      // monitor on its stand with the yellow label on top
      const mw=dw*.34,mh=H*.038*s,mx=x+dw*.55;b.fillStyle='#c9c6be';b.fillRect(mx-mw/2-2,y-mh-2,mw+4,mh+4);b.fillStyle='#4a6a4a';b.fillRect(mx-mw/2,y-mh,mw,mh);
      b.fillStyle='#7fae6c';b.fillRect(mx-mw/2,y-mh*.45,mw,mh*.45);b.fillStyle='#e8e05a';b.fillRect(mx-mw/2,y-mh-H*.012*s,mw,H*.01*s);
      seats.push({x:x+dw*.35,y:y+top+front,s,ri,k});}});
  // chair backs (grey) and a few seated people
  seats.forEach(p=>{const {x,y,s}=p,cw=W*.05*s,ch=H*.06*s;b.fillStyle='#7d8286';b.beginPath();b.moveTo(x-cw,y+ch);b.lineTo(x-cw*.9,y);b.quadraticCurveTo(x,y-ch*.12,x+cw*.9,y);b.lineTo(x+cw,y+ch);b.closePath();b.fill();
    if(hh('o'+p.ri+'.'+p.k)<.3){b.fillStyle=['#2b3a55','#3a3a3a','#6b5a4a','#24303a'][p.k%4];b.fillRect(x-cw*.8,y-ch*.25,cw*1.6,ch*.4);b.fillStyle=hh('hc'+p.k+p.ri)<.3?'#bdbdbd':'#221a15';b.beginPath();b.arc(x,y-ch*.45,cw*.42,0,7);b.fill();}});
  const vg=b.createRadialGradient(W/2,H*.45,H*.3,W/2,H*.5,W*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.18)');b.fillStyle=vg;b.fillRect(0,0,W,H);
  const mySeat=seats.filter(p=>p.ri===2&&p.x>W*.35&&p.x<W*.65)[0]||seats[seats.length-3];
  /* live: real horses cantering along the turf (返し馬) and the big vision picture */
  const F=RC.field.slice(0,8);const runners=F.map((f,i)=>({f,o:hh('rn'+i),coat:f.coat||(f.h?f.h.coat:'鹿毛'),sp:.55+hh('sp'+i)*.35}));
  const loop=now=>{if(!document.getElementById('obox'))return;const t=(now-t0)/1000;
    c.drawImage(bg,0,0,W,H);
    c.save();c.beginPath();c.rect(0,wy0,W,wy1-wy0);c.clip();
    // turf vision: left half shows the paddock/warm-up picture, right half the numbers
    c.save();c.beginPath();c.rect(vx,vy,vw,vh);c.clip();
    c.fillStyle='#9fc0d6';c.fillRect(vx,vy,vL,vh*.5);c.fillStyle='#c9b38c';c.fillRect(vx,vy+vh*.5,vL,vh*.5);
    drawHorse(c,vx+vL*.55,vy+vh*.9,vh/95,t*4,runners[0].coat,runners[0].f.silks,runners[0].f.no,false,{walk:true,nj:true,rug:true});
    c.fillStyle='rgba(20,40,120,.85)';c.fillRect(vx,vy,vL,vh*.16);c.fillStyle='#fff';c.font=`bold ${Math.max(6,vh*.12)}px sans-serif`;c.textAlign='left';c.fillText(`${r.course} ${r.g?11:9}R ${r.name}`,vx+3,vy+vh*.125);
    c.fillStyle='rgba(0,0,0,.65)';c.fillRect(vx,vy+vh*.82,vL,vh*.18);c.fillStyle='#ffd166';c.font=`bold ${Math.max(6,vh*.12)}px sans-serif`;c.fillText(`${runners[0].f.no} ${runners[0].f.name}`,vx+3,vy+vh*.95);
    const px0=vx+vL+2,pw=vw-vL-2;c.fillStyle='#050607';c.fillRect(px0,vy,pw,vh);
    c.fillStyle='#1c7a3c';c.fillRect(px0+2,vy+2,pw*.48,vh*.14);c.fillStyle='#fff';c.font=`bold ${Math.max(6,vh*.11)}px sans-serif`;c.fillText(`${r.course}${r.g?11:9}R 単勝`,px0+4,vy+vh*.12);
    const top=RC.field.slice().sort((a,b)=>a.odds-b.odds).slice(0,4);
    top.forEach((f,i)=>{const yy=vy+vh*(.36+i*.19);c.fillStyle=FRAMEC[wakuOf(f.no,RC.field.length)-1];c.fillRect(px0+4,yy-vh*.13,vh*.14,vh*.14);c.fillStyle='#ffb02e';c.font=`600 ${vh*.16}px Oswald,sans-serif`;c.textAlign='left';c.fillText(String(f.no),px0+4+vh*.18,yy);c.textAlign='right';
      const o=Math.min(999.9,f.odds*(1+Math.sin(t*.7+i)*.01)).toFixed(1);c.fillText(o,px0+pw*.48,yy);});
    c.fillStyle='#ffb02e';c.font=`600 ${vh*.17}px Oswald,sans-serif`;c.textAlign='center';top.slice(0,4).forEach((f,i)=>c.fillText(String(f.no),px0+pw*.77,vy+vh*(.36+i*.19)));
    c.fillStyle='#d4141c';c.fillRect(px0+pw*.58,vy+2,pw*.38,vh*.15);c.fillStyle='#fff';c.font=`bold ${Math.max(6,vh*.11)}px sans-serif`;c.fillText('締切前',px0+pw*.77,vy+vh*.12);
    c.fillStyle='rgba(0,0,0,.07)';for(let yy=vy;yy<vy+vh;yy+=2)c.fillRect(vx,yy,vw,1);c.restore();
    // horses on the turf, running right→left as in the photo
    const sc=(yRail-yTurf)/70;
    runners.forEach((h,i)=>{const span=W*1.4,x=W*1.2-((t*W*.07*h.sp+h.o*span)%span),y=yTurf+(yRail-yTurf)*(.55+(i%3)*.14);
      drawHorse(c,x,y,sc*(.9+(i%3)*.06),t*Math.PI*2*1.6*h.sp+i,h.coat,h.f.silks,h.f.no,false,{flip:true});});
    c.restore();
    // monitors refresh
    if(Math.floor(t*1.5)%4===0){c.fillStyle='rgba(255,255,255,.08)';seats.forEach(p=>{if(p.ri>1)c.fillRect(p.x+W*.17*p.s*.2-W*.03*p.s,p.y-H*.14*p.s,W*.06*p.s,H*.03*p.s);});}
    // your seat
    const p=mySeat,pul=.6+.4*Math.sin(t*3);c.strokeStyle=`rgba(230,150,40,${pul})`;c.lineWidth=2.5;c.beginPath();c.ellipse(p.x,p.y+H*.025*p.s,W*.06*p.s,H*.04*p.s,0,0,7);c.stroke();
    c.font=`bold ${Math.max(10,H*.03)}px sans-serif`;const lb='あなたの席',tw=c.measureText(lb).width+14,lx=clamp(p.x,tw/2+6,W-tw/2-6),ly=p.y-H*.11*p.s-H*.045;
    c.fillStyle='rgba(196,120,47,.95)';c.fillRect(lx-tw/2,ly,tw,H*.045);c.beginPath();c.moveTo(p.x-5,ly+H*.045);c.lineTo(p.x+5,ly+H*.045);c.lineTo(p.x,ly+H*.045+6);c.fill();c.fillStyle='#fff';c.textAlign='center';c.fillText(lb,lx,ly+H*.032);
    requestAnimationFrame(loop);};
  requestAnimationFrame(loop);
}
