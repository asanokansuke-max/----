/* =========================================================
   side-camera backdrop: looking across the infield from the stand
   (distant town & hills → far tree line → backstretch with its rails →
    infield lawn with pond, hedges, flower beds, one turf vision, tote board)
   ========================================================= */
function drawInfieldBG(c,W,H,o){const {camX,k,D,race,fld,now,gph,MIR,dirt}=o;
  const X=(wx,par)=>W*.5+(wx-camX)*k*par;          // world metres → screen x at a given parallax depth
  const rep=(par,step,fn)=>{const w0=camX-(W*.6)/(k*par),w1=camX+(W*.6)/(k*par);for(let wx=Math.floor(w0/step)*step;wx<=w1+step;wx+=step)fn(wx,X(wx,par));};
  // distant hills + town
  c.fillStyle='#7d9189';c.beginPath();c.moveTo(0,H*.36);for(let x=0;x<=W;x+=8){const wx=x/(k*.03)+camX;c.lineTo(x,H*.3-Math.sin(wx*.004)*H*.02-Math.sin(wx*.0013)*H*.03);}c.lineTo(W,H*.36);c.fill();
  rep(.05,22,(wx,x)=>{const h=hash('town'+wx),bh=H*(.012+h*.04),bw=12+h*14;c.fillStyle=h<.5?'#93a1a4':'#a6b2b4';c.fillRect(x,H*.335-bh,bw,bh);c.fillStyle='rgba(255,255,255,.35)';for(let yy=H*.335-bh+3;yy<H*.333;yy+=4)c.fillRect(x+2,yy,bw-4,1);});
  // far tree line beyond the backstretch
  rep(.09,14,(wx,x)=>{const h=hash('ft'+wx);c.fillStyle=h<.5?'#4c7350':'#577f58';c.beginPath();c.ellipse(x,H*.338,9+h*7,H*(.014+h*.012),0,0,7);c.fill();});
  // backstretch: outer rail, turf band, dirt band, inner rail (thin, far away)
  const yb=H*.342;c.fillStyle='#e9ece8';c.fillRect(0,yb,W,1.2);c.fillStyle='#5a9e58';c.fillRect(0,yb+1.2,W,H*.008);c.fillStyle='#a88660';c.fillRect(0,yb+1.2+H*.008,W,H*.006);c.fillStyle='#e9ece8';c.fillRect(0,yb+1.2+H*.014,W,1);
  rep(.12,10,(wx,x)=>{c.fillStyle='rgba(240,240,236,.8)';c.fillRect(x,yb,1,H*.006);});
  // infield lawn with mowing stripes in perspective
  const y0=yb+2+H*.015,y1=H*.5;const lg=c.createLinearGradient(0,y0,0,y1);lg.addColorStop(0,'#6fa865');lg.addColorStop(1,'#5b9a5f');c.fillStyle=lg;c.fillRect(0,y0,W,y1-y0);
  rep(.22,30,(wx,x)=>{const x2=X(wx,.42);if(Math.floor(wx/30)%2)return;c.fillStyle='rgba(255,255,255,.045)';c.beginPath();c.moveTo(x,y0);c.lineTo(x+30*k*.22,y0);c.lineTo(x2+30*k*.42,y1);c.lineTo(x2,y1);c.closePath();c.fill();});
  // infield features placed along the course (each exists once)
  const feat=(wx,par,fn)=>{const x=X(wx,par);if(x>-W*.4&&x<W*1.4)fn(x);};
  feat(D*.5,.2,x=>{c.fillStyle='#7fb3cf';c.beginPath();c.ellipse(x,H*.385,W*.14,H*.014,0,0,7);c.fill();c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(x-W*.04,H*.382,W*.04,H*.003,0,0,7);c.fill();});
  feat(D*.25,.25,x=>{for(let i=0;i<6;i++){c.fillStyle=['#d9536b','#f2c230','#e9e4f0'][i%3];c.fillRect(x+i*W*.018,H*.418,W*.016,H*.006);}});
  feat(D*.8,.25,x=>{c.fillStyle='#3f6f45';c.fillRect(x-W*.12,H*.412,W*.24,H*.01);});
  // mid-depth infield trees in clumps (not a regular row)
  rep(.3,55,(wx,x)=>{const h=hash('it'+wx);if(h<.45)return;const n=1+Math.floor(h*3);for(let t=0;t<n;t++){const tx=x+(t-1)*12+hash('ix'+wx+t)*8,th=H*(.04+hash('ih'+wx+t)*.03);c.fillStyle='#5a4632';c.fillRect(tx-1.5,H*.4-th*.3,3,th*.3);c.fillStyle=t%2?'#3f6b47':'#4a7a4f';c.beginPath();c.ellipse(tx,H*.4-th*.55,th*.42,th*.55,0,0,7);c.fill();c.fillStyle='rgba(255,255,255,.08)';c.beginPath();c.ellipse(tx-th*.12,H*.4-th*.7,th*.2,th*.25,0,0,7);c.fill();}});
  // tote board and the single turf vision
  feat(MIR!==RHC.includes(race.course)?D*.3:D-560,.3,x=>{c.fillStyle='#2b2f33';c.fillRect(x,H*.33,W*.07,H*.06);c.fillRect(x+W*.03,H*.39,3,H*.02);c.fillStyle='#ffb02e';for(let i=0;i<4;i++)c.fillRect(x+4,H*.34+i*H*.011,W*.07*(.4+hash('tb'+i)*.5),1.5);});
  {const vx=X(MIR!==RHC.includes(race.course)?D*.45:D-260,.3);drawVision(c,W,H,vx,race,fld,now,gph,MIR);}
  // near infield edge before the inner rail
  c.fillStyle='rgba(0,0,0,.06)';c.fillRect(0,H*.49,W,H*.01);
}
