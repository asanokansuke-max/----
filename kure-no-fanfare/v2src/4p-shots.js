/* =========================================================
   extra broadcast shots: 4th-turn camera, head-on camera, rain
   ========================================================= */
function drawRain(c,W,H,now){c.fillStyle='rgba(40,50,60,.12)';c.fillRect(0,0,W,H);c.strokeStyle='rgba(220,230,240,.35)';c.lineWidth=1;c.beginPath();
  for(let i=0;i<120;i++){const x=(hash('rx'+i)*W*1.3+now*.35)%(W*1.3)-W*.15,y=(hash('ry'+i)*H+now*.9*(.8+hash('rs'+i)*.4))%H;c.moveTo(x,y);c.lineTo(x-3,y+10);}c.stroke();}
/* the field going round the turn, seen from high in the stand */
function drawTurnShot(c,W,H,fld,px,lead,tail,gph,SK,trackCol,now,dirt){
  const g=c.createLinearGradient(0,0,0,H*.35);g.addColorStop(0,SK[0]);g.addColorStop(1,SK[2]);c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle='#6b8378';c.fillRect(0,H*.22,W,H*.08);c.fillStyle='#4f7a54';for(let i=0;i<20;i++){c.beginPath();c.ellipse(i*W/18,H*.29,W*.04,H*.03,0,0,7);c.fill();}
  const cx=W*.5,cy=H*1.55,R1=H*.95,R2=H*1.38,mid=(lead+tail)/2+4,kA=.0085;
  c.fillStyle='#5f9e64';c.fillRect(0,H*.3,W,H*.7);
  c.fillStyle=trackCol;c.beginPath();c.arc(cx,cy,R2,Math.PI*1.05,Math.PI*1.95);c.arc(cx,cy,R1,Math.PI*1.95,Math.PI*1.05,true);c.closePath();c.fill();
  if(!dirt){for(let i=0;i<20;i++){const a0=Math.PI*1.5+((i*12-mid)%240)*kA;c.strokeStyle='rgba(255,255,255,.05)';c.lineWidth=(R2-R1);c.beginPath();c.arc(cx,cy,(R1+R2)/2,a0,a0+6*kA);c.stroke();}}
  const rail=(R,w)=>{c.strokeStyle='#fff';c.lineWidth=w;c.beginPath();c.arc(cx,cy,R,Math.PI*1.05,Math.PI*1.95);c.stroke();};
  rail(R1,2.5);rail(R2+2,3);
  for(let m=Math.floor((mid-200)/8)*8;m<mid+200;m+=8){const a=Math.PI*1.5+(m-mid)*kA;if(a<Math.PI*1.05||a>Math.PI*1.95)continue;c.fillStyle='#e9ece8';c.fillRect(cx+Math.cos(a)*R1-1,cy+Math.sin(a)*R1,2,H*.025);}
  c.fillStyle='#3e7a46';c.beginPath();c.arc(cx,cy,R1-2,0,7);c.fill();c.fillStyle='rgba(255,255,255,.04)';c.beginPath();c.arc(cx,cy,R1*.85,0,7);c.fill();
  const items=fld.map(f=>{const a=Math.PI*1.5+(px(f)-mid)*kA,r=R1+(f.lane+.6)*(R2-R1)/9.2;return {f,a,r,x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r};}).sort((p,q)=>p.r-q.r);
  items.forEach(it=>{const s=(H/330)*(.55+.35*(it.r-R1)/(R2-R1));c.save();c.translate(it.x,it.y);c.rotate(it.a+Math.PI/2);
    drawHorse(c,0,0,s,gph+it.f.no*1.7,it.f.coat,it.f.silks,it.f.no,it.f.mine,{});c.restore();
    if(it.f.mine){c.strokeStyle='rgba(255,209,102,.95)';c.lineWidth=2;c.beginPath();c.arc(it.x,it.y-28*s,6,0,7);c.stroke();}});
}
function drawHeadShot(c,W,H,fld,px,D,gph,SK,trackCol,now,dirt,mon){
  const hz=H*.3,vx=W*.48;
  const g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,SK[0]);g.addColorStop(1,SK[2]);c.fillStyle=g;c.fillRect(0,0,W,hz);
  c.fillStyle='#6b8378';c.beginPath();c.moveTo(0,hz);for(let x=0;x<=W;x+=10)c.lineTo(x,hz-H*.03-Math.sin(x*.02)*H*.01);c.lineTo(W,hz);c.fill();
  // grandstand along the right, receding
  c.fillStyle='#5d6268';c.beginPath();c.moveTo(W*.62,hz-H*.03);c.lineTo(W*1.05,hz-H*.22);c.lineTo(W*1.05,H*.62);c.lineTo(W*.62,hz+H*.005);c.closePath();c.fill();
  for(let i=0;i<300;i++){const t=hash('gs'+i),u=hash('gu'+i);const x=W*.62+t*W*.43,top=hz-H*.03-(t)*H*.19,bot=hz+t*H*.6;c.fillStyle=['#d8c3a5','#b8402f','#2c3e50','#ecf0f1'][Math.floor(u*4)];c.fillRect(x,top+(bot-top)*hash('gv'+i)*.85,1.5+t*2,1.5+t*2);}
  // infield on the left, track as a trapezoid toward the vanishing point
  c.fillStyle='#5b9a5f';c.fillRect(0,hz,W*.62,H-hz);
  const F=H*9,P=(u,z)=>{const s=F/z;return [vx+u*s,hz+2.6*s];};
  const quad=(u0,u1,col)=>{const a=P(u0,400),b=P(u1,400),cc=P(u1,3),d=P(u0,3);c.fillStyle=col;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(cc[0],cc[1]);c.lineTo(d[0],d[1]);c.closePath();c.fill();};
  quad(-6.2,6,trackCol);if(!dirt)for(let z=4;z<400;z*=1.35){const a=P(-6.2,z),b=P(5.8,z),a2=P(-6.2,z*1.15),b2=P(5.8,z*1.15);c.fillStyle='rgba(255,255,255,.04)';c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(b2[0],b2[1]);c.lineTo(a2[0],a2[1]);c.fill();}
  const railL=(u,w)=>{c.strokeStyle='#fff';c.lineWidth=w;c.beginPath();for(let z=400;z>=3;z*=.8){const q=P(u,z),hgt=F/z;z===400?c.moveTo(q[0],q[1]-hgt):c.lineTo(q[0],q[1]-hgt);}c.stroke();};
  railL(-6.3,3);railL(6,3);
  // horses: nearer = bigger; camera ~9m in front of the line
  const items=fld.map(f=>({f,z:Math.max(3,D-px(f)+11),u:-5.4+f.lane*1.2})).sort((a,b)=>b.z-a.z);
  items.forEach(it=>{const s=F/it.z,[x,y]=P(it.u,it.z);drawHorseFront(c,x,y,s,gph+it.f.no*1.7,it.f.coat,it.f.silks,it.f.no,it.f.mine);});
  // a little of the finish post in the near corner
  c.fillStyle='#fff';c.fillRect(W*.06,H*.1,5,H*.9);for(let y=H*.1;y<H;y+=14){c.fillStyle='#d62828';c.fillRect(W*.06,y,5,7);}
}

/* rear view: hindquarters, tail, hind legs driving, the rider's back */
function drawHorseRear(c,x,y,s,ph,coat,silks,num){c.save();c.translate(x,y);c.scale(1.1,.84);x=0;y=0;const co=COATS[coat]||COATS['鹿毛'];const bob=Math.sin(ph+1.2)*.035*s;c.save();c.translate(x,y);
  c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(0,0,.5*s,.1*s,0,0,7);c.fill();
  // legs: gaskin → hock → cannon → hoof, tucked in turn as they gallop
  const leg=(lx,o,col,w)=>{const lift=Math.max(0,Math.sin(ph+o))*.38,kx=lx*s*1.15,ky=(-.55-lift*.25)*s,fx=lx*s*.9,fy=(-lift*.6)*s;
    c.fillStyle=col;c.beginPath();c.moveTo(lx*s-w*s,-.95*s+bob);c.lineTo(lx*s+w*s,-.95*s+bob);c.lineTo(kx+w*.45*s,ky);c.lineTo(kx-w*.45*s,ky);c.closePath();c.fill();
    c.strokeStyle=col;c.lineWidth=w*.7*s;c.lineCap='round';c.beginPath();c.moveTo(kx,ky);c.lineTo(fx,fy);c.stroke();c.fillStyle='#1d1814';c.beginPath();c.ellipse(fx,fy+.02*s,w*.55*s,w*.35*s,0,0,7);c.fill();};
  const dk=shade(co.c,-.35);leg(-.13,Math.PI*.4,dk,.1);leg(.13,Math.PI*1.4,dk,.1);
  // the rump: two big rounded quarters with a shadowed groove, lit from above
  const g=c.createRadialGradient(-.08*s,-1.32*s+bob,.04*s,0,-1.1*s+bob,.5*s);g.addColorStop(0,shade(co.c,.3));g.addColorStop(.6,co.c);g.addColorStop(1,shade(co.c,-.4));c.fillStyle=g;
  c.beginPath();c.ellipse(-.13*s,-1.14*s+bob,.19*s,.29*s,.12,0,7);c.ellipse(.13*s,-1.14*s+bob,.19*s,.29*s,-.12,0,7);c.fill();c.fillStyle='rgba(255,255,255,.12)';c.beginPath();c.ellipse(-.16*s,-1.28*s+bob,.07*s,.1*s,0,0,7);c.ellipse(.1*s,-1.28*s+bob,.07*s,.1*s,0,0,7);c.fill();
  c.strokeStyle='rgba(0,0,0,.28)';c.lineWidth=.03*s;c.beginPath();c.moveTo(0,-1.38*s+bob);c.quadraticCurveTo(.01*s,-1.1*s+bob,0,-.86*s+bob);c.stroke();
  leg(-.1,Math.PI*1.1,co.c,.13);leg(.1,Math.PI*.1,co.c,.13);
  // tail streaming back toward us
  const tw=Math.sin(ph-.6)*.05*s;c.fillStyle=shade(co.m.length===7?co.m:'#555555',coat==='芦毛'?-.15:0);c.beginPath();c.moveTo(-.05*s,-1.38*s+bob);c.quadraticCurveTo(tw-.06*s,-1.05*s,tw*1.4-.04*s,-.8*s);c.lineTo(tw*1.4+.07*s,-.8*s);c.quadraticCurveTo(tw+.07*s,-1.05*s,.05*s,-1.38*s+bob);c.fill();
  // saddle cloth corners & jockey's back
  c.fillStyle='#f6f3ea';c.fillRect(-.4*s,-1.46*s+bob,.07*s,.16*s);c.fillRect(.33*s,-1.46*s+bob,.07*s,.16*s);
  c.fillStyle='#efece4';c.beginPath();c.ellipse(-.17*s,-1.5*s+bob,.07*s,.06*s,0,0,7);c.ellipse(.17*s,-1.5*s+bob,.07*s,.06*s,0,0,7);c.fill();
  c.fillStyle='#161412';c.fillRect(-.24*s,-1.5*s+bob,.05*s,.12*s);c.fillRect(.19*s,-1.5*s+bob,.05*s,.12*s);
  c.fillStyle=silks.a;c.beginPath();c.ellipse(0,-1.66*s+bob,.19*s,.14*s,0,0,7);c.fill();
  if(silks.p==='一本輪'||silks.p==='山形'){c.fillStyle=silks.b;c.fillRect(-.19*s,-1.68*s+bob,.38*s,.045*s);}
  c.strokeStyle=silks.b;c.lineWidth=.06*s;c.beginPath();c.moveTo(-.16*s,-1.7*s+bob);c.lineTo(-.25*s,-1.58*s+bob);c.moveTo(.16*s,-1.7*s+bob);c.lineTo(.25*s,-1.58*s+bob);c.stroke();
  c.fillStyle=silks.b;c.beginPath();c.arc(0,-1.83*s+bob,.09*s,0,7);c.fill();c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.arc(-.03*s,-1.86*s+bob,.03*s,0,7);c.fill();
  c.restore();c.restore();}
