/* =========================================================
   正面〜斜め前の馬 (redrawn from broadcast references):
   long-lens, slightly high camera → a tall narrow column: low long head,
   crouched rider whose helmet & shoulders sit on top, white knees either side,
   one foreleg reaching, the other folded. yaw (-1..1) swings the body round so the
   barrel & quarters trail off to one side for the 3/4 look through the turn.
   ========================================================= */
function drawHorseFront(c,x,y,s,ph,coat,silks,num,mine,yaw,mir){
  yaw=Math.max(-1,Math.min(1,yaw||0));const ay=Math.abs(yaw),sg=yaw<0?-1:1;
  const co=COATS[coat]||COATS['鹿毛'],grey=coat==='芦毛',chest=coat==='栗毛';
  const base=co.c,hi=shade(base,grey?.25:.3),lo=shade(base,-.28),dk=shade(base,-.5),mn=co.m;
  const pt=grey?shade(base,-.12):chest?shade(base,-.2):'#1b1410';   // lower legs (bays have black points)
  const hex=v=>typeof v==='string'&&v[0]==='#'&&v.length===7?v:'#888888';
  const A=hex(silks.a),B=hex(silks.b);
  const D=.13*s,bob=D-(.5+.5*Math.sin(ph+1.2))*.04*s,jb=D+(bob-D)*.25,nod=Math.sin(ph+.5)*.03*s;
  const lift=o=>Math.max(0,Math.sin(ph+o));
  const blz=(num*7)%5;   // 0:none 1:star 2:blaze 3:stripe 4:none
  const E=(cx,cy,rx,ry,r)=>{c.beginPath();c.ellipse(cx,cy,Math.max(.1,rx),Math.max(.1,ry),r||0,0,7);};
  const limb=(x1,y1,x2,y2,w1,w2,col)=>{const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;c.fillStyle=col;c.beginPath();c.moveTo(x1+nx*w1,y1+ny*w1);c.lineTo(x2+nx*w2,y2+ny*w2);c.lineTo(x2-nx*w2,y2-ny*w2);c.lineTo(x1-nx*w1,y1-ny*w1);c.closePath();c.fill();c.beginPath();c.arc(x1,y1,w1,0,7);c.fill();c.beginPath();c.arc(x2,y2,w2,0,7);c.fill();};
  const lr=(x0,x1,c0,c1,c2)=>{const g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,c0);g.addColorStop(.45,c1);g.addColorStop(1,c2);return g;};
  c.save();c.translate(x,y);
  // the trailing body: where the quarters sit on screen (further away → a touch higher)
  const bx=-yaw*.62*s,by=-.05*s*ay,hx=yaw*.05*s;
  // shadow
  {const g=c.createRadialGradient(bx*.45,0,.02*s,bx*.45,0,.45*s+ay*.3*s);g.addColorStop(0,'rgba(0,0,0,.4)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;E(bx*.45,0,.36*s+ay*.38*s,.08*s);c.fill();}
  // ---- hind end (behind everything) ----
  {const hl=[[-1,0],[1,.55]];
   hl.forEach(([sx,o])=>{const l=lift(o),r=lift(o+Math.PI),lx=bx+sx*.07*s*(1-ay*.4)-sg*ay*.04*s*sx,top=-.95*s+bob+by;
     // driving leg reaches under (nearer), the trailing one kicks out behind (further: higher & off to the side)
     const back=r*ay,hk=[lx-sg*back*.14*s,-.42*s-l*.1*s-back*.08*s+by],ft=[lx-sg*back*.24*s+sg*l*ay*.06*s,-.03*s-l*.2*s-back*.12*s+by];
     limb(lx,top,hk[0],hk[1],.075*s,.034*s,dk);limb(hk[0],hk[1],ft[0],ft[1],.028*s,.022*s,pt);c.fillStyle='#120d0a';E(ft[0],ft[1]+.012*s,.03*s,.018*s);c.fill();});
   if(ay>.08){// tail streaming away behind
     c.strokeStyle=mn;c.lineCap='round';c.lineWidth=.038*s;c.beginPath();c.moveTo(bx-sg*.12*s,-1.18*s+bob+by);c.quadraticCurveTo(bx-sg*.3*s,-1.16*s+by+nod,bx-sg*.42*s,-1.0*s+by+nod*1.5);c.stroke();
     c.lineWidth=.022*s;c.beginPath();c.moveTo(bx-sg*.15*s,-1.13*s+bob+by);c.quadraticCurveTo(bx-sg*.33*s,-1.06*s+by,bx-sg*.4*s,-.92*s+by+nod);c.stroke();c.lineCap='butt';}
   // barrel + quarters, joined to the chest
   const qr=.16*s+ay*.03*s;c.fillStyle=lr(Math.min(0,bx)-.25*s,Math.max(0,bx)+.25*s,lo,base,dk);
   c.beginPath();c.moveTo(-.17*s,-1.2*s+bob);c.lineTo(bx-qr*.9,-1.2*s+bob+by);c.quadraticCurveTo(bx,-1.26*s+bob+by,bx+qr*.9,-1.2*s+bob+by);c.lineTo(.17*s,-1.2*s+bob);
   c.lineTo(.15*s,-.84*s+bob);c.lineTo(bx+qr*.8,-.86*s+bob+by);c.quadraticCurveTo(bx,-.78*s+bob+by,bx-qr*.8,-.86*s+bob+by);c.lineTo(-.15*s,-.84*s+bob);c.closePath();c.fill();
   E(bx,-1.04*s+bob+by,qr,.19*s);c.fill();
   // the near flank catches the light, the belly stays dark
   if(ay>.08){c.fillStyle='rgba(255,255,255,'+(.08*ay)+')';E(bx*.5,-1.12*s+bob+by*.5,Math.abs(bx)*.45+.04*s,.07*s);c.fill();
     c.fillStyle='rgba(0,0,0,.25)';E(bx*.5,-.86*s+bob+by*.5,Math.abs(bx)*.5+.05*s,.035*s);c.fill();
     // saddle cloth on the flank we can see, with the number
     const cx=bx*.42,cw=Math.max(.04*s,Math.abs(bx)*.38),cy=-1.12*s+bob+by*.4;
     c.fillStyle='#f4f1ea';c.beginPath();c.moveTo(cx-cw,cy-.1*s);c.lineTo(cx+cw,cy-.11*s);c.lineTo(cx+cw*.95,cy+.12*s);c.lineTo(cx-cw*.95,cy+.13*s);c.closePath();c.fill();
     c.fillStyle='rgba(0,0,0,.15)';c.fillRect(cx-cw,cy+.1*s,cw*2,.02*s);
     if(cw>.06*s){c.fillStyle='#222';c.font=`bold ${Math.min(cw*1.3,.12*s)}px sans-serif`;c.textAlign='center';c.textBaseline='middle';if(mir){c.save();c.translate(cx,cy+.01*s);c.scale(-1,1);c.fillText(num,0,0);c.restore();}else c.fillText(num,cx,cy+.01*s);c.textBaseline='alphabetic';}}}
  // ---- jockey's lower half: white knees out on the irons, black boots ----
  [-1,1].forEach(sx=>{const near=sx===-sg?1:0;const kx=sx*(.19*s)+hx*.5,ky=-1.31*s+jb,ix=sx*.2*s+hx*.3,iy=-1.1*s+bob;
    // saddle-cloth edge peeking under the knee
    c.fillStyle='#ebe7de';c.beginPath();c.moveTo(sx*.15*s,-1.2*s+bob);c.lineTo(sx*.215*s,-1.18*s+bob);c.lineTo(sx*.215*s,-1.02*s+bob);c.lineTo(sx*.16*s,-1.02*s+bob);c.closePath();c.fill();
    c.fillStyle='rgba(0,0,0,.18)';c.fillRect(sx>0?.15*s:-.215*s,-1.04*s+bob,.065*s,.02*s);
    limb(kx,ky+.03*s,ix,iy,.042*s,.03*s,'#15120f');                 // boot
    c.fillStyle='#aeb4ba';c.fillRect(ix-.04*s,iy+.01*s,.08*s,.014*s); // iron
    const kg=c.createRadialGradient(kx-.015*s,ky-.02*s,.005*s,kx,ky,.065*s);kg.addColorStop(0,'#f7f5f0');kg.addColorStop(1,'#b9b4aa');c.fillStyle=kg;E(kx,ky,.042*s,.056*s,sx*.35);c.fill();c.fillStyle='rgba(0,0,0,.12)';E(kx+sx*.012*s,ky+.025*s,.028*s,.02*s);c.fill();});
  // ---- chest: a narrow rounded column with two pectoral masses ----
  {const t=-1.22*s+bob,b=-.8*s+bob;const g=c.createRadialGradient(-.07*s+hx,t+.12*s,.02*s,hx*.5,t+.2*s,.3*s);g.addColorStop(0,hi);g.addColorStop(.55,base);g.addColorStop(1,lo);c.fillStyle=g;
   c.beginPath();c.moveTo(-.18*s,t+.04*s);c.quadraticCurveTo(-.2*s,t+.25*s,-.12*s,b);c.quadraticCurveTo(0,b+.05*s,.12*s,b);c.quadraticCurveTo(.2*s,t+.25*s,.18*s,t+.04*s);c.quadraticCurveTo(0,t-.06*s,-.18*s,t+.04*s);c.fill();
   c.strokeStyle='rgba(0,0,0,.3)';c.lineWidth=.014*s;c.beginPath();c.moveTo(hx*.4,t+.12*s);c.quadraticCurveTo(hx*.4+.006*s,t+.28*s,hx*.3,b+.01*s);c.stroke();
   c.fillStyle='rgba(0,0,0,.2)';E(-.165*s,t+.2*s,.035*s,.12*s,.2);c.fill();E(.165*s,t+.2*s,.035*s,.12*s,-.2);c.fill();
   if(!grey){c.fillStyle='rgba(255,240,220,.08)';E(-.08*s,t+.14*s,.05*s,.08*s,.3);c.fill();}}
  // ---- forelegs: one reaching for the ground, the other folded up under the chest ----
  [[-1,1.6],[1,2.2]].forEach(([sx,o])=>{const l=lift(o),r=lift(o+Math.PI),lx=sx*.09*s+hx*.4,m=l*l*(3-2*l);
    // folded: knee comes up & forward, hoof tucked under; reaching: hoof out in front (nearer → lower on screen)
    const top=[lx,-.86*s+bob],knee=[lx+sx*(.015+l*.02)*s,-.4*s-l*.2*s+(bob-D)*.5],
      fe=[lx+sx*.02*s*r,-.07*s+r*.05*s],ff=[knee[0]-sx*.01*s,knee[1]+.09*s],fet=[fe[0]+(ff[0]-fe[0])*m,fe[1]+(ff[1]-fe[1])*m],hoof=[fet[0]+sx*.004*s*(1-m),fet[1]+.05*s-.01*s*m];
    limb(top[0],top[1],knee[0],knee[1],.064*s,.04*s,sx<0?lo:base);
    c.fillStyle='rgba(255,255,255,.09)';c.fillRect(top[0]-.05*s,top[1]+.03*s,.02*s,(knee[1]-top[1])*.7);
    c.fillStyle=pt;E(knee[0],knee[1],.042*s,.036*s);c.fill();
    limb(knee[0],knee[1],fet[0],fet[1],.03*s,.027*s,pt);
    c.fillStyle=pt;E(fet[0],fet[1],.036*s,.03*s);c.fill();
    if(m>.5){c.fillStyle='#0e0a08';E(hoof[0],hoof[1]-.005*s,.04*s,.025*s);c.fill();c.fillStyle='#5a544c';E(hoof[0],hoof[1]-.002*s,.028*s,.014*s);c.fill();}   // sole flashing as it folds
    else{c.fillStyle='#0e0a08';c.beginPath();c.moveTo(hoof[0]-.04*s,hoof[1]-.035*s);c.lineTo(hoof[0]+.04*s,hoof[1]-.035*s);c.lineTo(hoof[0]+.046*s,hoof[1]+.008*s);c.quadraticCurveTo(hoof[0],hoof[1]+.024*s,hoof[0]-.046*s,hoof[1]+.008*s);c.closePath();c.fill();}});
  // ---- neck, mane to one side ----
  const nt=-1.44*s+bob+nod*.5,ntx=hx*1.6;
  c.fillStyle=lr(-.13*s,.13*s,lo,base,dk);c.beginPath();c.moveTo(-.14*s,-1.14*s+bob);c.quadraticCurveTo(-.13*s,-1.32*s+bob,ntx-.08*s,nt);c.lineTo(ntx+.08*s,nt);c.quadraticCurveTo(.13*s,-1.32*s+bob,.14*s,-1.14*s+bob);c.closePath();c.fill();
  {const ms=-sg||1;c.fillStyle=mn;c.beginPath();c.moveTo(ntx+ms*.06*s,nt-.01*s);c.quadraticCurveTo(ms*.16*s,-1.32*s+bob,ms*.15*s,-1.16*s+bob);c.lineTo(ms*.12*s,-1.17*s+bob);c.quadraticCurveTo(ms*.12*s,-1.3*s+bob,ntx+ms*.03*s,nt);c.closePath();c.fill();}
  // ---- jockey's upper half: crouched flat, so we see shoulders and the top of the back ----
  {const ty=-1.5*s+jb;
   const tg=c.createRadialGradient(-.05*s,ty-.04*s,.01*s,0,ty,.2*s);tg.addColorStop(0,shade(A,.2));tg.addColorStop(1,shade(A,-.3));c.fillStyle=tg;
   c.beginPath();c.moveTo(-.18*s,ty+.04*s);c.quadraticCurveTo(-.19*s,ty-.08*s,-.08*s,ty-.1*s);c.lineTo(.08*s,ty-.1*s);c.quadraticCurveTo(.19*s,ty-.08*s,.18*s,ty+.04*s);c.quadraticCurveTo(0,ty+.1*s,-.18*s,ty+.04*s);c.fill();
   c.save();c.clip();c.fillStyle=B;
   if(silks.p==='一本輪'||silks.p==='二本輪')c.fillRect(-.2*s,ty-.02*s,.4*s,.035*s);
   else if(silks.p==='山形'){c.beginPath();c.moveTo(-.2*s,ty-.06*s);c.lineTo(0,ty+.02*s);c.lineTo(.2*s,ty-.06*s);c.lineTo(.2*s,ty-.02*s);c.lineTo(0,ty+.06*s);c.lineTo(-.2*s,ty-.02*s);c.fill();}
   else if(silks.p==='縦縞')for(let k=-.2;k<.2;k+=.07)c.fillRect(k*s,ty-.12*s,.025*s,.24*s);
   else if(silks.p==='襷'){c.beginPath();c.moveTo(-.2*s,ty-.1*s);c.lineTo(-.12*s,ty-.1*s);c.lineTo(.2*s,ty+.08*s);c.lineTo(.12*s,ty+.08*s);c.fill();}
   else if(silks.p==='菱')for(let k=-.16;k<.2;k+=.1){c.beginPath();c.moveTo(k*s,ty-.06*s);c.lineTo(k*s+.035*s,ty-.01*s);c.lineTo(k*s,ty+.04*s);c.lineTo(k*s-.035*s,ty-.01*s);c.fill();}
   c.restore();
   // arms: down the sides of the neck to the hands pushing on it
   [-1,1].forEach(sx=>{const shx=sx*.15*s,shy=ty-.02*s,el=[sx*.17*s+hx*.3,ty+.09*s],hd=[sx*.055*s+ntx*.8,-1.36*s+bob*.7+nod*.4];
     limb(shx,shy,el[0],el[1],.04*s,.033*s,shade(A,-.12));limb(el[0],el[1],hd[0],hd[1],.032*s,.026*s,A);
     c.fillStyle=silks.p==='袖'?B:shade(B,.1);c.fillRect(Math.min(el[0],hd[0])-.002*s,(el[1]+hd[1])/2-.006*s,Math.abs(hd[0]-el[0])+.004*s,.012*s);
     c.fillStyle='#ece6da';E(hd[0],hd[1],.026*s,.024*s);c.fill();});
   // head tucked low: goggles and the coloured helmet are what you see
   const hy=ty-.13*s;c.fillStyle='#d9b493';E(0,hy+.075*s,.05*s,.04*s);c.fill();
   c.fillStyle='#1a1f25';c.beginPath();c.moveTo(-.068*s,hy+.02*s);c.lineTo(.068*s,hy+.02*s);c.lineTo(.062*s,hy+.068*s);c.lineTo(-.062*s,hy+.068*s);c.closePath();c.fill();
   const gg=c.createLinearGradient(0,hy+.025*s,0,hy+.065*s);gg.addColorStop(0,'rgba(190,220,240,.9)');gg.addColorStop(1,'rgba(70,110,150,.8)');c.fillStyle=gg;
   c.fillRect(-.058*s,hy+.028*s,.05*s,.032*s);c.fillRect(.008*s,hy+.028*s,.05*s,.032*s);
   const hg=c.createRadialGradient(-.03*s,hy-.04*s,.008*s,0,hy-.01*s,.1*s);hg.addColorStop(0,shade(B,.5));hg.addColorStop(.5,B);hg.addColorStop(1,shade(B,-.3));c.fillStyle=hg;
   c.beginPath();c.moveTo(-.082*s,hy+.025*s);c.bezierCurveTo(-.09*s,hy-.09*s,.09*s,hy-.09*s,.082*s,hy+.025*s);c.closePath();c.fill();
   c.fillStyle=shade(B,-.25);c.beginPath();c.moveTo(-.08*s,hy+.015*s);c.quadraticCurveTo(0,hy+.04*s,.08*s,hy+.015*s);c.lineTo(.07*s,hy+.03*s);c.quadraticCurveTo(0,hy+.05*s,-.07*s,hy+.03*s);c.fill();
   c.fillStyle='rgba(255,255,255,.45)';E(-.03*s,hy-.045*s,.025*s,.012*s,-.3);c.fill();}
  // ---- head: long and low, coming at the lens ----
  c.save();c.translate(ntx,nod);
  {const py=-1.47*s+bob,my=-1.06*s+bob,tw=.068*s,mw=.046*s,tx=yaw*.035*s;   // poll → muzzle
   // ears pricked/pinned
   [-1,1].forEach(sx=>{c.fillStyle=lo;c.beginPath();c.moveTo(sx*.03*s,py+.02*s);c.lineTo(sx*.07*s,py-.08*s);c.lineTo(sx*.065*s,py+.025*s);c.fill();c.fillStyle=dk;c.beginPath();c.moveTo(sx*.04*s,py+.015*s);c.lineTo(sx*.065*s,py-.055*s);c.lineTo(sx*.058*s,py+.02*s);c.fill();});
   const hg=lr(-tw,tw,lo,hi,yaw>0?base:lo);c.fillStyle=hg;
   c.beginPath();c.moveTo(-tw,py+.04*s);c.quadraticCurveTo(0,py-.02*s,tw,py+.04*s);c.quadraticCurveTo(tw+.008*s,py+.16*s,mw+tx,my-.07*s);c.quadraticCurveTo(mw+.01*s+tx,my+.01*s,tx,my+.025*s);c.quadraticCurveTo(-mw-.01*s+tx,my+.01*s,-mw+tx,my-.07*s);c.quadraticCurveTo(-tw-.008*s,py+.16*s,-tw,py+.04*s);c.fill();
   // forelock
   c.fillStyle=mn;c.beginPath();c.moveTo(-.025*s,py+.01*s);c.quadraticCurveTo(-.01*s,py+.1*s,.008*s,py+.11*s);c.quadraticCurveTo(.02*s,py+.06*s,.03*s,py+.01*s);c.fill();
   // face markings
   if(blz&&blz<4&&!grey){c.fillStyle='rgba(245,242,236,.95)';if(blz===1){E(0,py+.13*s,.016*s,.022*s);c.fill();}
     else{const w=blz===2?.022*s:.011*s;c.beginPath();c.moveTo(-w*.8,py+.1*s);c.quadraticCurveTo(-w*1.1+tx*.5,my-.12*s,-w*1.4+tx,my-.02*s);c.lineTo(w*1.4+tx,my-.02*s);c.quadraticCurveTo(w*1.1+tx*.5,my-.12*s,w*.8,py+.1*s);c.closePath();c.fill();}}
   // eyes on the sides, under the brow
   c.fillStyle='#0d0907';E(-tw+.006*s,py+.13*s,.011*s,.018*s,.5);c.fill();E(tw-.006*s,py+.13*s,.011*s,.018*s,-.5);c.fill();
   // bridle: browband, cheekpieces, white sheepskin noseband, bit rings
   c.strokeStyle='#1e1510';c.lineWidth=.014*s;c.beginPath();c.moveTo(-tw,py+.07*s);c.quadraticCurveTo(0,py+.1*s,tw,py+.07*s);c.moveTo(-tw+.004*s,py+.08*s);c.lineTo(-mw+tx-.004*s,my-.06*s);c.moveTo(tw-.004*s,py+.08*s);c.lineTo(mw+tx+.004*s,my-.06*s);c.stroke();
   if(num%2===0){c.strokeStyle='#f3f1ec';c.lineWidth=.03*s;c.beginPath();c.moveTo(-mw-.006*s+tx,my-.12*s);c.quadraticCurveTo(tx,my-.09*s,mw+.006*s+tx,my-.12*s);c.stroke();}
   else{c.strokeStyle='#1e1510';c.lineWidth=.012*s;c.beginPath();c.moveTo(-mw-.004*s+tx,my-.1*s);c.quadraticCurveTo(tx,my-.08*s,mw+.004*s+tx,my-.1*s);c.stroke();}
   c.fillStyle='#c4c8cc';E(-mw-.004*s+tx,my-.035*s,.013*s,.013*s);c.fill();E(mw+.004*s+tx,my-.035*s,.013*s,.013*s);c.fill();
   // muzzle & flared nostrils
   c.fillStyle=grey?'rgba(60,55,52,.55)':'rgba(25,18,14,.45)';E(tx,my-.01*s,mw*.95,.032*s);c.fill();
   c.fillStyle='#0b0806';E(-.022*s+tx,my-.012*s,.011*s,.017*s,.35);c.fill();E(.022*s+tx,my-.012*s,.011*s,.017*s,-.35);c.fill();
   // reins back up to the hands
   c.strokeStyle='rgba(30,20,14,.9)';c.lineWidth=.01*s;c.beginPath();c.moveTo(-mw+tx,my-.035*s);c.lineTo(-.055*s,-1.36*s+bob*.7-nod*.6);c.moveTo(mw+tx,my-.035*s);c.lineTo(.055*s,-1.36*s+bob*.7-nod*.6);c.stroke();}
  c.restore();
  if(mine){c.strokeStyle='rgba(255,209,102,.95)';c.lineWidth=2;E(bx*.45,0,.4*s+ay*.35*s,.1*s);c.stroke();}
  c.restore();}
