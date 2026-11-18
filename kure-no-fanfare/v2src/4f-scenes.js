/* =========================================================
   more realistic 馬主席 and パドック backgrounds
   (these declarations replace boxAnim / paddockAnim from 4c/4d)
   ========================================================= */
const COURSE_EN={東京:'TOKYO',中山:'NAKAYAMA',京都:'KYOTO',阪神:'HANSHIN',中京:'CHUKYO',新潟:'NIIGATA',福島:'FUKUSHIMA',小倉:'KOKURA',札幌:'SAPPORO',函館:'HAKODATE'};
function crowdFill(c,x0,y0,x1,y1,sz,seed){const rows=Math.max(1,Math.round((y1-y0)/(sz*1.15))),t=crowdTile(sz,rows,seed),tw=t.width/(window.devicePixelRatio||1);for(let x=x0-((x0%tw)+tw)%tw;x<x1;x+=tw)c.drawImage(t,Math.floor(x),Math.round(y0),Math.ceil(tw)+1,Math.round(y1-y0));}
function heads(c,x0,y0,x1,y1,sz,dens,seed){
  for(let y=y0;y<y1;y+=sz*1.15)for(let x=x0;x<x1;x+=sz*1.05){const h=hash(seed+'|'+Math.round(x)+'|'+Math.round(y));if(h>dens)continue;
    const jx=(hash(h)-.5)*sz*.6,jy=(hash(h+1)-.5)*sz*.4;
    c.fillStyle=['#2b3a55','#5a2d2d','#e9e4d8','#3f5d46','#1f1f1f','#8a6a4a','#b5473a','#d8c3a5'][Math.floor(h*8/dens)%8];c.fillRect(x+jx-sz*.45,y+jy+sz*.25,sz*.9,sz*.7);
    c.fillStyle=h<.25*dens?'#cfcfcf':h<.5*dens?'#2a211c':'#3b2a20';c.beginPath();c.arc(x+jx,y+jy,sz*.32,0,7);c.fill();}
}
function offscreen(W,H,draw){const dpr=window.devicePixelRatio||1;const o=document.createElement('canvas');o.width=W*dpr;o.height=H*dpr;const c=o.getContext('2d');c.scale(dpr,dpr);draw(c);return o;}
/* ---------- パドック ---------- */
function paddockAnim(){
  const RC=UI.race,fld=RC.field,cv=$('#pdk');if(!cv)return;const c=cv.getContext('2d');
  const W=cv.clientWidth,H=fitH(cv,Math.round(clamp(W*.72,250,430)),200),dpr=window.devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';c.scale(dpr,dpr);
  const cx=W*.53,cy=H*.66,rx=W*.45,ry=H*.27,n=fld.length,t0=performance.now();
  const name=COURSE_EN[RC.race.course]||'KEIBA';
  const bg=offscreen(W,H,c=>{
    const sk=c.createLinearGradient(0,0,0,H*.2);sk.addColorStop(0,'#a9cbe6');sk.addColorStop(1,'#e5eef4');c.fillStyle=sk;c.fillRect(0,0,W,H*.25);
    // grandstand facade (left/back) + roof
    c.fillStyle='#e9e6df';c.beginPath();c.moveTo(0,H*.02);c.lineTo(W*.55,H*.08);c.lineTo(W*.55,H*.3);c.lineTo(0,H*.42);c.closePath();c.fill();
    for(let f=0;f<4;f++){c.fillStyle=f%2?'#9eb3c2':'#b9c9d4';c.beginPath();const y0=H*(.06+f*.075),y1=y0+H*.035;c.moveTo(0,y0+H*.02);c.lineTo(W*.55,y0+H*.035);c.lineTo(W*.55,y1+H*.035);c.lineTo(0,y1+H*.02+H*.012*f);c.closePath();c.fill();}
    c.fillStyle='#cfd5d8';c.beginPath();c.moveTo(0,0);c.lineTo(W*.58,H*.06);c.lineTo(W*.58,H*.085);c.lineTo(0,H*.03);c.fill();
    // trees & big vision (right)
    c.fillStyle='#4f7a54';for(let i=0;i<9;i++){c.beginPath();c.ellipse(W*(.56+i*.055),H*(.2+hash(i)*.04),W*.045,H*.07,0,0,7);c.fill();}
    c.fillStyle='#2a2f33';c.fillRect(W*.6,H*.03,W*.34,H*.18);c.fillStyle='#0b0b0b';c.fillRect(W*.61,H*.045,W*.32,H*.15);
    c.font=`${Math.max(6,H*.022)}px Oswald,monospace`;c.textAlign='left';
    const fl=UI.race.field;for(let i=0;i<Math.min(fl.length,12);i++){const r=i%4,k=i/4|0,f=fl[i];c.fillStyle='#3be36a';c.fillText(String(f.no),W*(.62+k*.105),H*(.075+r*.024));c.fillStyle='#ff9a2e';c.fillText(f.odds.toFixed(1),W*(.645+k*.105),H*(.075+r*.024));}
    // crowd: behind the back rail and down the left side (tiered)
    crowdFill(c,0,H*.29,W,H*.385,Math.max(5,W*.014),'pb');
    c.save();c.beginPath();c.moveTo(0,H*.36);c.lineTo(W*.16,H*.38);c.lineTo(W*.05,H);c.lineTo(0,H);c.closePath();c.clip();crowdFill(c,0,H*.36,W*.17,H*.66,Math.max(6,W*.017),'pl1');crowdFill(c,0,H*.66,W*.17,H,Math.max(7,W*.021),'pl2');c.restore();
    c.save();c.beginPath();c.moveTo(W,H*.36);c.lineTo(W*.9,H*.38);c.lineTo(W*.98,H);c.lineTo(W,H);c.closePath();c.clip();crowdFill(c,W*.86,H*.36,W,H*.66,Math.max(6,W*.017),'pr1');crowdFill(c,W*.86,H*.66,W,H,Math.max(7,W*.021),'pr2');c.restore();
    // ground
    c.fillStyle='#6e9e66';c.beginPath();c.moveTo(W*.16,H*.38);c.lineTo(W*.9,H*.38);c.lineTo(W*.98,H);c.lineTo(W*.05,H);c.closePath();c.fill();
    // sand walking ring
    c.fillStyle='#d9c6a0';c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,7);c.fill();
    c.strokeStyle='rgba(120,90,50,.07)';c.lineWidth=1;for(let i=0;i<40;i++){c.beginPath();c.ellipse(cx,cy,rx*(.8+i*.005),ry*(.7+i*.008),0,0,7);c.stroke();}
    // inner lawn with mowing stripes + course name
    c.save();c.beginPath();c.ellipse(cx,cy,rx*.74,ry*.6,0,0,7);c.clip();
    c.fillStyle='#4e8f4d';c.fillRect(0,0,W,H);c.fillStyle='#5b9d58';for(let i=-10;i<20;i+=2){c.beginPath();c.moveTo(W*i/10,0);c.lineTo(W*(i+1)/10,0);c.lineTo(W*(i+.4)/10,H);c.lineTo(W*(i-.6)/10,H);c.fill();}
    c.translate(cx,cy);c.scale(1,.45);c.fillStyle='rgba(255,255,255,.9)';c.font=`900 ${rx*.22}px "Oswald",sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(name.split('').join(String.fromCharCode(8202)),0,0);c.restore();
    c.strokeStyle='#f4f4f0';c.lineWidth=2;c.beginPath();c.ellipse(cx,cy,rx*.74,ry*.6,0,0,7);c.stroke();
    // outer white rail with posts
    c.strokeStyle='#fbfbf7';c.lineWidth=2.5;c.beginPath();c.ellipse(cx,cy,rx+4,ry+4,0,0,7);c.stroke();
    for(let a=0;a<Math.PI*2;a+=.12){c.fillStyle='#fbfbf7';c.fillRect(cx+(rx+4)*Math.cos(a)-1,cy+(ry+4)*Math.sin(a)-6,2,6);}
    // foreground spectators (silhouettes at the bottom rail)
    c.fillStyle='#e8e4da';c.fillRect(0,H*.95,W,3);
    c.save();c.filter='brightness(.75)';crowdFill(c,-10,H*.93,W+10,H*1.04,Math.max(9,W*.03),'pf');c.restore();
  });
  const castEl=$('#padcast');
  const showNote=()=>{const x=PDK.notes[PDK.ni%PDK.notes.length];PDK.ni++;if(!castEl)return;castEl.innerHTML=`<span class="pc-l">パドック解説</span>${x.f?`<b>${x.f.no}番 ${esc(x.f.name)}</b>　`:''}${esc(x.t)}`;castEl.classList.remove('fade');void castEl.offsetWidth;castEl.classList.add('fade');};
  showNote();let lastNote=performance.now();
  const loop=now=>{
    if(!document.getElementById('pdk')||!PDK)return;
    if(now-lastNote>3200&&!PDK.mount){showNote();lastNote=now;}
    const t=now-t0;
    c.drawImage(bg,0,0,W,H);
    // odds overlay for our horse on the big vision
    const m0=fld.find(f=>f.mine);
    if(m0){const bw=bodyWeight(m0);c.fillStyle='rgba(0,0,0,.85)';c.fillRect(W*.61,H*.165,W*.32,H*.032);c.fillStyle='#ffd166';c.font=`bold ${Math.max(7,H*.022)}px sans-serif`;c.textAlign="left";c.fillText(`${m0.no} ${m0.name.slice(0,7)}  ${m0.odds.toFixed(1)}倍  ${bw.w}kg(${bw.d>=0?'+':''}${bw.d})`,W*.615,H*.188);}
    // horses + handlers walking the ring (clockwise in view)
    // 止まーれ: each lead hand pulls up their horse in their own time, then the jockeys come over one by one
    const dt=Math.min(.05,(t-(PDK.lt||t))/1000);PDK.lt=t;if(!PDK.th)PDK.th={};
    const items=fld.map((f,i)=>{const sAt=PDK.mount?PDK.mount+400+hash('st'+f.no)*2200:Infinity;
      const v=now<sAt?.09:Math.max(0,.09*(1-(now-sAt)/900));      // ease to a stop over ~0.9s, staggered
      PDK.th[f.no]=(PDK.th[f.no]??(i/n*Math.PI*2))+v*dt;f._stopT=now-sAt;f._mountAt=sAt+900+600+hash('mt'+f.no)*2600;
      const th=PDK.th[f.no];return{f,th,v,x:cx+rx*.87*Math.cos(th),y:cy+ry*.82*Math.sin(th)};}).sort((a,b)=>a.y-b.y);
    for(const it of items){const f=it.f,depth=(Math.sin(it.th)+1)/2,s=(W/560)*(.32+.3*depth);const flip=Math.sin(it.th)>0;
      f._ph=(f._ph??f.no)+(it.v/.09)*dt*Math.PI*2*.75;const ph=f._ph;
      const toss=it.v<.01&&f._stopT>0?Math.sin(now/400+f.no)*.15:0;   // a standing horse shifts its weight
      const hx=it.x+(flip?-1:1)*34*s,hy=it.y+2*s;
      // long winter shadows thrown toward the lower right
      c.fillStyle='rgba(40,30,20,.22)';c.save();c.translate(it.x,it.y+2*s);c.transform(1,0,-1.1,.35,0,0);c.beginPath();c.ellipse(-8*s,-30*s,30*s,26*s,0,0,7);c.fill();c.restore();
      c.save();c.translate(hx,hy);c.transform(1,0,-1.1,.35,0,0);c.fillRect(-5*s,-70*s,10*s,70*s);c.restore();
      if(depth<.5)photoPerson(c,hx,hy,70*s,{suit:'#22282e',pants:'#22282e',shirt:'#22282e',noTie:true,cap:'#22282e'});
      const mounted=PDK.mount&&now>f._mountAt;
      // a jockey walking over to the horse before getting a leg-up
      if(PDK.mount&&!mounted&&now>f._mountAt-1600){const k=clamp(1-(f._mountAt-now)/1600,0,1),jx=it.x+(flip?1:-1)*(60-40*k)*s;photoJockey(c,jx,it.y+2*s,62*s,{silks:f.silks,no:f.no,name:'',noCloth:true});}
      drawHorse(c,it.x,it.y,s,ph+toss,f.coat||(f.coat=f.h?f.h.coat:pick(Object.keys(COATS))),f.silks,f.no,f.mine,{walk:true,flip,nj:!mounted,rug:!mounted});
      if(depth>=.5)photoPerson(c,hx,hy,70*s,{suit:'#22282e',pants:'#22282e',shirt:'#22282e',noTie:true,cap:'#22282e'});
      if(f.mine){c.font='bold 11px sans-serif';const tw=c.measureText(f.name).width+10;c.fillStyle='rgba(0,0,0,.7)';c.fillRect(it.x-tw/2,it.y-70*s-20,tw,16);c.fillStyle='#ffd166';c.textAlign='center';c.fillText(f.name,it.x,it.y-70*s-8);}}
    if(PDK.mount){const a=(now-PDK.mount)/1000;
      for(let i=0;i<3;i++){if(R()<.15){c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.arc(W*(.02+R()*.15),H*(.4+R()*.5),2+R()*2,0,7);c.fill();}}
      if(a<1.8){c.font=`900 ${clamp(W/12,22,40)}px "Shippori Mincho B1",serif`;c.textAlign='center';c.lineWidth=5;c.strokeStyle='rgba(0,0,0,.55)';c.strokeText('止まーれー！',W/2,H*.5);c.fillStyle='#fff';c.fillText('止まーれー！',W/2,H*.5);}}
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
/* ---------- 馬主席 ---------- */
function boxAnim(){
  const cv=$('#obox');if(!cv)return;const c=cv.getContext('2d');const W=cv.clientWidth,H=Math.round(clamp(W*.66,220,380)),dpr=window.devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';c.scale(dpr,dpr);
  const SK=sky(M(S.t)),RC=UI.race,winY=H*.46,t0=performance.now();
  const dirt=RC.race.surf==='ダ';
  const bg=offscreen(W,H,c=>{
    // outside view through the glass
    const g=c.createLinearGradient(0,0,0,winY);g.addColorStop(0,SK[0]);g.addColorStop(.7,SK[1]);g.addColorStop(1,SK[2]);c.fillStyle=g;c.fillRect(0,0,W,winY);
    c.fillStyle='#8aa0a8';for(let i=0;i<12;i++){const bw=W*(.03+hash(i)*.04),bh=H*(.03+hash(i+5)*.06);c.fillRect(W*i/12,H*.15-bh,bw,bh);}
    c.fillStyle='#6f8f72';c.fillRect(0,H*.15,W,H*.03);
    // course seen from above: dirt + turf ovals, infield with pond
    const ccx=W*.5,ccy=H*.32;
    c.fillStyle='#b48a5a';c.beginPath();c.ellipse(ccx,ccy,W*.62,H*.15,0,0,7);c.fill();
    c.fillStyle='#5aa45f';c.beginPath();c.ellipse(ccx,ccy,W*.58,H*.135,0,0,7);c.fill();
    c.strokeStyle='#fff';c.lineWidth=1;c.beginPath();c.ellipse(ccx,ccy,W*.58,H*.135,0,0,7);c.stroke();c.beginPath();c.ellipse(ccx,ccy,W*.5,H*.105,0,0,7);c.stroke();
    c.fillStyle='#6db466';c.beginPath();c.ellipse(ccx,ccy,W*.5,H*.105,0,0,7);c.fill();
    c.fillStyle='#7fb3d6';c.beginPath();c.ellipse(ccx-W*.08,ccy,W*.12,H*.03,0,0,7);c.fill();
    c.fillStyle='#4f7a54';for(let i=0;i<8;i++){c.beginPath();c.arc(ccx+W*(.05+i*.035),ccy-H*.01+hash(i)*H*.02,W*.012,0,7);c.fill();}
    // home straight (near)
    c.fillStyle=dirt?'#b48a5a':'#4f9a5e';c.fillRect(0,H*.4,W,winY-H*.4);c.fillStyle='#fff';c.fillRect(0,H*.4,W,1.5);c.fillRect(0,winY-3,W,1.5);
    // big vision
    c.fillStyle='#222';c.fillRect(W*.06,H*.06,W*.24,H*.11);c.fillStyle='#0d3a22';c.fillRect(W*.065,H*.067,W*.23,H*.096);c.fillStyle='#ffd166';c.font=`bold ${Math.max(8,H*.034)}px sans-serif`;c.textAlign='center';c.fillText(RC.race.name,W*.18,H*.11);c.fillStyle='#fff';c.font=`${Math.max(7,H*.024)}px sans-serif`;c.fillText(`${RC.race.course} ${RC.race.surf}${RC.race.dist}m`,W*.18,H*.145);
    // glass: reflection + frames
    const rf=c.createLinearGradient(0,0,W,winY);rf.addColorStop(0,'rgba(255,255,255,0)');rf.addColorStop(.45,'rgba(255,255,255,.12)');rf.addColorStop(.55,'rgba(255,255,255,0)');c.fillStyle=rf;c.fillRect(0,0,W,winY);
    c.fillStyle='#c9cdcc';for(let i=0;i<=5;i++)c.fillRect(W*i/5-2,0,4,winY);c.fillRect(0,winY-4,W,8);
    // room: ceiling band, floor
    c.fillStyle='#f1efe9';c.fillRect(0,winY+4,W,H-winY);
    const fl=c.createLinearGradient(0,winY,0,H);fl.addColorStop(0,'#e6e2d8');fl.addColorStop(1,'#d3cdbf');c.fillStyle=fl;c.fillRect(0,winY+4,W,H-winY);
    // desk rows in perspective (far → near)
    const vp={x:W*.5,y:winY-H*.05};
    const rows=[{y:.53,d:.45,n:6},{y:.62,d:.62,n:5},{y:.73,d:.82,n:4},{y:.87,d:1.05,n:3}];
    rows.forEach((r,ri)=>{const y=H*r.y,d=r.d,dw=W*.2*d,gap=W*.04*d,total=r.n*dw+(r.n-1)*gap,x0=W/2-total/2;
      for(let i=0;i<r.n;i++){const x=x0+i*(dw+gap),xc=x+dw/2;const lean=(xc-vp.x)*.06;
        // desk top
        c.fillStyle='#fbfaf6';c.beginPath();c.moveTo(x+lean*.5,y);c.lineTo(x+dw+lean*.5,y);c.lineTo(x+dw,y+H*.035*d);c.lineTo(x,y+H*.035*d);c.closePath();c.fill();
        c.fillStyle='#dcd8ce';c.fillRect(x,y+H*.035*d,dw,H*.03*d);
        // monitor (tilted) + yellow name card
        c.fillStyle='#3a3f44';c.beginPath();c.moveTo(xc-dw*.18,y+H*.012*d);c.lineTo(xc+dw*.18,y+H*.012*d);c.lineTo(xc+dw*.15,y-H*.05*d);c.lineTo(xc-dw*.15,y-H*.05*d);c.closePath();c.fill();
        c.fillStyle='#0e3b24';c.beginPath();c.moveTo(xc-dw*.15,y+H*.004*d);c.lineTo(xc+dw*.15,y+H*.004*d);c.lineTo(xc+dw*.13,y-H*.043*d);c.lineTo(xc-dw*.13,y-H*.043*d);c.closePath();c.fill();
        c.fillStyle='#ff9a2e';for(let l=0;l<3;l++)c.fillRect(xc-dw*.1,y-H*.034*d+l*H*.011*d,dw*(.08+hash(ri*10+i+l)*.12),H*.004*d);
        c.fillStyle='#f2d36b';c.fillRect(x+dw*.72,y+H*.004*d,dw*.16,H*.016*d);
        c.fillStyle='#d23b3b';c.beginPath();c.arc(x+dw*.15,y+H*.014*d,H*.008*d,0,7);c.fill();
        // chair back (between the viewer and the desk)
        c.fillStyle='#596069';c.beginPath();c.moveTo(xc-dw*.2,y+H*.075*d);c.quadraticCurveTo(xc,y+H*.055*d,xc+dw*.2,y+H*.075*d);c.lineTo(xc+dw*.18,y+H*.12*d);c.lineTo(xc-dw*.18,y+H*.12*d);c.closePath();c.fill();
        // seated owners (back of the head)
        if(hash(ri*7+i*3)<.45&&!(ri===3&&i===1)){c.fillStyle=['#2b3a55','#3d434c','#5a2d2d','#2e3b2f'][i%4];c.fillRect(xc-dw*.13,y+H*.05*d,dw*.26,H*.035*d);c.fillStyle=hash(i+ri)<.4?'#cfcfcf':'#2a211c';c.beginPath();c.arc(xc,y+H*.04*d,H*.022*d,0,7);c.fill();}
      }});
    // a man at the window with binoculars
    const mx=W*.82,my=winY+H*.02;c.fillStyle='#2b3a55';c.fillRect(mx-7,my-34,14,34);c.fillStyle='#efcfae';c.beginPath();c.arc(mx,my-40,6,0,7);c.fill();c.fillStyle='#bbb';c.beginPath();c.arc(mx,my-43,6.3,Math.PI,0);c.fill();c.fillStyle='#111';c.fillRect(mx-6,my-42,12,4);c.strokeStyle='#2b3a55';c.lineWidth=4;c.beginPath();c.moveTo(mx-6,my-30);c.lineTo(mx-5,my-40);c.moveTo(mx+6,my-30);c.lineTo(mx+5,my-40);c.stroke();
  });
  // our seat marker position
  const seat={x:W/2-(3*W*.2*1.05+2*W*.04*1.05)/2+(W*.2*1.05+W*.04*1.05)+W*.2*1.05/2,y:H*.87};
  const loop=now=>{if(!document.getElementById('obox'))return;const t=(now-t0)/1000;
    c.drawImage(bg,0,0,W,H);
    // horses cantering down the home straight (warm-up)
    for(let i=0;i<5;i++){const x=((t*36+i*W*.22)%(W+40))-20,y=H*.42+(i%3)*H*.01;c.fillStyle=['#7a4a2a','#2b2522','#b5682c','#bdbcb6','#4e3020'][i];c.beginPath();c.ellipse(x,y,6,2.5,0,0,7);c.fill();c.fillRect(x+4,y-4,2,4);c.fillStyle=['#c8262e','#1f4ea3','#f2c230','#1d8a4a','#6b3fa0'][i];c.fillRect(x-1,y-5,3,3);}
    // our seat
    c.fillStyle='rgba(196,120,47,.95)';c.font=`bold ${Math.max(9,H*.032)}px sans-serif`;const lb='あなたの席';const tw=c.measureText(lb).width+12;c.fillRect(seat.x-tw/2,seat.y-H*.12,tw,H*.05);c.fillStyle='#fff';c.textAlign='center';c.fillText(lb,seat.x,seat.y-H*.085);
    requestAnimationFrame(loop);};
  requestAnimationFrame(loop);
}
