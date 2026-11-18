/* =========================================================
   4コーナーのカメラ: the field comes round the final turn toward the lens,
   then swings side-on into the straight (perspective camera on the stand side)
   ========================================================= */
function drawCornerShot(c,W,H,o){const {fld,remOf,st,R,gph,SK,trackCol,dirt,now,m0,RH,race,away}=o;
  if(RH){c.save();c.translate(W,0);c.scale(-1,1);}
  // world: straight along +x from the corner exit (x=0), turn centred at (0,R) on the infield side, camera on the stand side
  const lw=1.5,cam={x:st*.92,y:16,z:-28};   // high on the stand near the post, looking back up the straight
  // aim at the middle of the pack, smoothed
  const pos=f=>{const d=remOf(f)-st,l=(f.lane||0)*lw;if(d<=0)return {x:-d,z:-l,hx:away?-1:1,hz:0};const ph=Math.min(Math.PI,d/R),r=R+l,sg=away?-1:1;return {x:-r*Math.sin(ph),z:R-r*Math.cos(ph),hx:sg*Math.cos(ph),hz:-sg*Math.sin(ph)};};
  const P=fld.map(pos),mx=P.reduce((a,p)=>a+p.x,0)/P.length,mz=P.reduce((a,p)=>a+p.z,0)/P.length;
  const st_=drawCornerShot.s||(drawCornerShot.s={tx:mx,tz:mz});st_.tx+=(mx-st_.tx)*.2;st_.tz+=(mz-st_.tz)*.2;
  let fx=st_.tx-cam.x,fz=st_.tz-cam.z,fl=Math.hypot(fx,fz);fx/=fl;fz/=fl;const rx=fz,rz=-fx;   // looking back up the straight, the infield is on the right   // forward & right on the ground
  const tilt=Math.atan2(cam.y,fl)*.55,ct=Math.cos(tilt),stt=Math.sin(tilt),F=clamp(W*.19*fl/2.6,W*1.4,W*26);   // long lens: the pack fills the frame
  const shk=Math.sin(now/37)*.6+Math.sin(now/53)*.5;
  const proj=(x,y,z)=>{const dx=x-cam.x,dy=y-cam.y,dz=z-cam.z;const X=dx*rx+dz*rz,Zf=dx*fx+dz*fz;const Zc=Zf*ct-dy*stt,Yc=Zf*stt+dy*ct;if(Zc<1)return null;return [W/2+F*X/Zc+shk,H*.2-F*Yc/Zc+shk*.6,Zc];};
  // sky + far scenery
  const g=c.createLinearGradient(0,0,0,H*.4);g.addColorStop(0,SK[0]);g.addColorStop(1,SK[2]);c.fillStyle=g;c.fillRect(0,0,W,H);
  const hz=proj(st_.tx+fx*3000,0,st_.tz+fz*3000);const hy=hz?hz[1]:H*.25;
  c.fillStyle='#6b8378';c.beginPath();c.moveTo(0,hy+2);for(let x=0;x<=W;x+=10)c.lineTo(x,hy-H*.03-Math.sin(x*.02+fx*3)*H*.015);c.lineTo(W,hy+2);c.fill();
  c.fillStyle='#4f7a54';for(let i=0;i<16;i++){c.beginPath();c.ellipse(i*W/15+(fx*80)%(W/15),hy,W*.04,H*.025,0,0,7);c.fill();}
  c.fillStyle='#78b06c';c.fillRect(0,hy,W,H-hy);
  // far scenery around the turn: the backstretch rail, a tree line and town beyond it
  {const far=[];for(let a=-.4;a<=Math.PI+.6;a+=.05){const r=R*4.5;far.push([-(r)*Math.sin(a)+(a<0?-a*R:0),R-r*Math.cos(a)]);}
   const top=far.map((q,i)=>proj(q[0],7+hash('fh'+i)*5,q[1])),bot=far.map(q=>proj(q[0],0,q[1]));
   if(top.every(Boolean)&&bot.every(Boolean)){c.fillStyle='#4f7752';c.beginPath();top.forEach((q,i)=>i?c.quadraticCurveTo((top[i-1][0]+q[0])/2,Math.min(top[i-1][1],q[1])-2,q[0],q[1]):c.moveTo(q[0],q[1]));[...bot].reverse().forEach(q=>c.lineTo(q[0],q[1]));c.closePath();c.fill();
     c.fillStyle='rgba(255,255,255,.07)';top.forEach((q,i)=>{if(i%3)return;c.beginPath();c.ellipse(q[0],q[1]+2,4,2,0,0,7);c.fill();});}
   const bs=[];for(let x=-R*1.2;x<=st;x+=8)bs.push([x,2*R+lw*9+2]);c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=1;c.beginPath();let f2=false;bs.forEach(q=>{const p=proj(q[0],1,q[1]);if(!p)return;f2?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);f2=true;});c.stroke();}
  // infield trees & the tote board (on the infield side), the grandstand along the outside of the straight
  const drawAt=(wx,wz,fn)=>{const p=proj(wx,0,wz);if(p&&p[0]>-80&&p[0]<W+80)fn(p,F/p[2]);};
  const trees=drawCornerShot.trees||(drawCornerShot.trees=[...Array(40)].map((_,i)=>({x:-R*1.1+hash('cx'+i)*(st+R*1.3),z:R*.35+hash('cz'+i)*R*1.6,h:6+hash('ch'+i)*6})));
  trees.filter(t=>{const d=Math.hypot(t.x,t.z-R);return t.x>0?t.z>12:d<R-10;}).map(t=>({t,p:proj(t.x,0,t.z)})).filter(q=>q.p&&q.p[2]>260).sort((a,b)=>b.p[2]-a.p[2]).forEach(({t,p})=>{const s2=Math.min(F/p[2],H*.01);c.fillStyle='#5a4632';c.fillRect(p[0]-s2*.3,p[1]-t.h*s2*.35,s2*.6,t.h*s2*.35);c.fillStyle=hash('tc'+t.x)<.5?'#3f6b47':'#4a7a4f';c.beginPath();c.ellipse(p[0],p[1]-t.h*s2*.6,t.h*s2*.38,t.h*s2*.42,0,0,7);c.fill();});
  // grandstand: a raked bank of seats along the outside of the straight, full of people
  {const z0=-(lw*9+7),rows=9,rowD=2.2,rowH=1.1;const face=[proj(st+30,0,z0),proj(-10,0,z0),proj(-10,rows*rowH+4,z0-rows*rowD),proj(st+30,rows*rowH+4,z0-rows*rowD)];
   if(face.every(Boolean)){c.fillStyle='#8c9196';c.beginPath();face.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();c.fill();
     const roof=[proj(st+30,rows*rowH+9,z0-rows*rowD+3),proj(-10,rows*rowH+9,z0-rows*rowD+3),proj(-10,rows*rowH+8,z0-rows*rowD-6),proj(st+30,rows*rowH+8,z0-rows*rowD-6)];
     if(roof.every(Boolean)){c.fillStyle='#e4e6e3';c.beginPath();roof.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();c.fill();}
     const cols=['#2b3a55','#3a3a3a','#6b4a3a','#e2ddd2','#5a2d2d','#2e4a3f','#9a7b52','#b33a35','#d9d2c3'];
     for(let r=rows-1;r>=0;r--)for(let x=-6;x<st+28;x+=1.6){const p=proj(x+(r%2)*.8,r*rowH+.6,z0-r*rowD-.8);if(!p||p[0]<-5||p[0]>W+5)continue;const s2=F/p[2]*.55;if(s2<.6)continue;const h=hash('sp'+r+'.'+Math.round(x*10));if(h<.08)continue;
       c.fillStyle=cols[Math.floor(h*cols.length)%cols.length];c.fillRect(p[0]-s2*.45,p[1]-s2*.2,s2*.9,s2*.8);c.fillStyle=h<.6?'#2a211c':'#d9c4a8';c.beginPath();c.arc(p[0],p[1]-s2*.45,s2*.3,0,7);c.fill();}}}
  // track ribbon: inner and outer edges along turn + straight
  const edge=l=>{const pts=[];for(let d=R*Math.PI;d>=0;d-=6){const ph=d/R,r=R+l;pts.push([-r*Math.sin(ph),R-r*Math.cos(ph)]);}for(let x=0;x<=st+60;x+=10)pts.push([x,-l]);return pts;};
  const inner=edge(-.5),outer=edge(lw*9+1);
  const poly=(a,b)=>{c.beginPath();let st2=false;a.forEach(q=>{const p=proj(q[0],0,q[1]);if(!p)return;st2?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);st2=true;});[...b].reverse().forEach(q=>{const p=proj(q[0],0,q[1]);if(p)c.lineTo(p[0],p[1]);});c.closePath();};
  // the other course: the dirt track inside a turf race (as on TV), or the turf course outside a dirt race
  const o1=dirt?edge(lw*9+5):edge(-23),o2=dirt?edge(lw*9+26):edge(-5);
  c.fillStyle=dirt?'#5f9c5f':'#b8916a';poly(o1,o2);c.fill();
  {c.save();poly(o1,o2);c.clip();c.strokeStyle=dirt?'rgba(255,255,255,.06)':'rgba(255,255,255,.10)';c.lineWidth=1;
   for(let l=dirt?lw*9+7:-21;l<(dirt?lw*9+25:-6);l+=dirt?3:1.6){c.beginPath();let f=false;edge(l).forEach(q=>{const p=proj(q[0],0,q[1]);if(!p)return;f?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);f=true;});c.stroke();}
   c.restore();}
  c.fillStyle=dirt?'rgba(80,130,80,.0)':'#6fa866';poly(edge(-5),edge(-.5));c.fill();   // grass verge between the two rails
  c.fillStyle=trackCol;poly(inner,outer);c.fill();c.strokeStyle='rgba(0,0,0,.15)';c.lineWidth=1;c.stroke();
  // mower stripes running with the track, and the worn line along the inside rail
  {c.save();poly(inner,outer);c.clip();
   for(let l=-.5,i=0;l<lw*9+1;l+=1.6,i++){if(i%2)continue;c.fillStyle=dirt?'rgba(255,255,255,.035)':'rgba(255,255,255,.06)';poly(edge(l),edge(Math.min(lw*9+1,l+1.6)));c.fill();}
   c.fillStyle=dirt?'rgba(90,60,30,.14)':'rgba(150,120,70,.16)';poly(edge(-.5),edge(4.5));c.fill();
   c.fillStyle=dirt?'rgba(90,60,30,.08)':'rgba(150,120,70,.08)';poly(edge(4.5),edge(8));c.fill();
   c.restore();}
  if(!dirt){c.save();poly(inner,outer);c.clip();for(let d=0;d<R*Math.PI+st;d+=24){const a=d<R*Math.PI?[(()=>{const ph=(R*Math.PI-d)/R;return [-(R+5)*Math.sin(ph),R-(R+5)*Math.cos(ph)];})()]:[[d-R*Math.PI,-5]];const p=proj(a[0][0],0,a[0][1]);if(p){c.fillStyle='rgba(255,255,255,.05)';c.fillRect(p[0]-F*6/p[2],p[1]-F*9/p[2],F*12/p[2],F*18/p[2]);}}c.restore();}
  // rails as short segments so they can be depth-sorted with the horses (the far rail goes behind them)
  const railSegs=(pts,col,hgt)=>{const out=[];for(let i=0;i<pts.length-1;i++){const a=proj(pts[i][0],hgt,pts[i][1]),b=proj(pts[i+1][0],hgt,pts[i+1][1]);if(!a||!b)continue;const g=i%3?null:proj(pts[i][0],0,pts[i][1]);
    out.push({z:(a[2]+b[2])/2,d:()=>{c.strokeStyle=col;c.lineCap='round';c.lineWidth=2;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();if(g){c.lineWidth=1;c.beginPath();c.moveTo(g[0],g[1]);c.lineTo(a[0],a[1]);c.stroke();}c.lineCap='butt';}});}return out;};
  // horses, far to near; side sprite foreshortened by how much they face the lens
  const items=fld.map((f,i)=>{const p=P[i],q=proj(p.x,0,p.z);return q?{f,p,q}:null;}).filter(Boolean).sort((a,b)=>b.q[2]-a.q[2]);
  const drawIt=it=>{const {f,p,q}=it,sc=F*2.6/q[2]/60,side=p.hx*rx+p.hz*rz,toward=-(p.hx*fx+p.hz*fz),fs=Math.max(.32,Math.abs(side));
    // ground shadow laid along the horse's heading (sells the 3D)
    {const q2=proj(p.x+p.hx*2.2,0,p.z+p.hz*2.2),q1=proj(p.x-p.hx*2.2,0,p.z-p.hz*2.2);if(q1&&q2){const ang=Math.atan2(q2[1]-q1[1],q2[0]-q1[0]),len=Math.hypot(q2[0]-q1[0],q2[1]-q1[1]);c.save();c.translate(q[0],q[1]+1);c.rotate(ang);const sg=c.createRadialGradient(0,0,1,0,0,Math.max(len*.6,sc*20));sg.addColorStop(0,'rgba(0,0,0,.35)');sg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=sg;c.beginPath();c.ellipse(0,0,Math.max(len*.65,sc*14),Math.max(4,sc*7),0,0,7);c.fill();c.restore();}}
    // volume: the side view is extruded across the horse's width (far flank darker), and cross-faded
    // into a true front / rear view as the horse turns toward or away from the lens
    const ph=gph+f.no*1.7,as=Math.abs(side),wq=proj(p.x-p.hz*.55,0,p.z+p.hx*.55),wdx=wq?(wq[0]-q[0]):0,wdy=wq?(wq[1]-q[1]):0;
    const fr=toward>0,sideA=fr?clamp((as-.74)/.08,0,1):clamp((as-.22)/.33,0,1),endA=fr?1-clamp((as-.79)/.06,0,1):1-clamp((as-.38)/.3,0,1);
    if(endA>0){const s3=sc*34;c.save();c.globalAlpha=endA;c.translate(q[0],q[1]);if(!fr)c.transform(1,0,-side*.3,1,0,0);
      if(fr)drawHorseFront(c,0,0,s3*.95,ph,f.coat,f.silks,f.no,false,clamp(side*1.2,-1,1),RH);else drawHorseRear(c,0,0,s3,ph,f.coat,f.silks,f.no);c.restore();}
    if(sideA>0){const sk=toward*.18*Math.sign(side);
      {const co=COATS[f.coat]||COATS['鹿毛'];c.save();c.globalAlpha=sideA;c.translate(q[0]+wdx,q[1]+wdy);c.transform(fs,sk,0,1,0,0);if(side<0)c.scale(-1,1);if(RH)c.scale(-1,1);c.fillStyle=shade(co.c,-.55);c.beginPath();c.ellipse(-2*sc,-33*sc,25*sc,10*sc,0,0,7);c.fill();c.beginPath();c.moveTo(12*sc,-40*sc);c.lineTo(34*sc,-58*sc);c.lineTo(40*sc,-50*sc);c.lineTo(24*sc,-28*sc);c.fill();c.restore();}
      c.save();c.globalAlpha=sideA;c.translate(q[0],q[1]);c.transform(fs,sk,0,1,0,0);drawHorse(c,0,0,sc,ph,f.coat,f.silks,f.no,f.mine,{flip:side<0,mir:RH});c.restore();}
    // turf flying off the hooves
    if(Math.random()<.5){const n=3;for(let i=0;i<n;i++){const kx=q[0]-p.hx*rx*sc*20*Math.sign(side||1)+(Math.random()-.5)*sc*18,ky=q[1]-Math.random()*sc*10;c.fillStyle=dirt?'rgba(140,100,60,.6)':'rgba(70,110,60,.55)';c.fillRect(kx,ky,Math.max(1.5,sc*2.2),Math.max(1.5,sc*1.6));}}
    if(f.mine){c.strokeStyle='rgba(255,209,102,.95)';c.lineWidth=2;c.beginPath();c.ellipse(q[0],q[1]+1,30*sc*fs+4,6*sc+2,0,0,7);c.stroke();}};
  [...items.map(it=>({z:it.q[2],d:()=>drawIt(it)})),...railSegs(inner,'#ffffff',1.1),...railSegs(dirt?edge(lw*9+5):edge(-5),'#e8eef2',.9),...railSegs(dirt?edge(lw*9+26):edge(-23),'#9bb7c9',.8),...railSegs(outer,'#f4f4f0',1.1)].sort((a,b)=>b.z-a.z).forEach(o=>o.d());
  if(RH)c.restore();
  // my horse label (unmirrored)
  const mi=items.find(it=>it.f.mine);if(mi){let x=mi.q[0];if(RH)x=W-x;const y=mi.q[1]-F*2.6/mi.q[2]*1.25;c.font='bold 12px sans-serif';const tw=c.measureText(mi.f.name).width+12;c.fillStyle='rgba(0,0,0,.75)';c.fillRect(x-tw/2,y-16,tw,18);c.fillStyle='#ffd166';c.textAlign='center';c.fillText(mi.f.name,x,y-3);}
}
