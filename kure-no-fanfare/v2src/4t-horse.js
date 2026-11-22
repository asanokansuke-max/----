/* =========================================================
   horse v5: a proper silhouette (withers, back, croup, belly, chest),
   jointed tapering legs with a real gallop sequence, arched neck,
   modelled head, flowing mane and tail
   ========================================================= */
function drawHorse(c,x,y,sc,ph,coat,silks,num,mine,opt={}){
  const co=COATS[coat]||COATS['鹿毛'],walk=!!opt.walk;
  const shade=(hex,a)=>{const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(a<0?v*(1+a):v+(255-v)*a)));return `rgb(${f(r)},${f(g)},${f(b)})`;};
  const hi=shade(co.c,.3),lo=shade(co.c,-.42),far=shade(co.c,-.3),farM=shade(co.m,-.2);
  // body rocks through the stride
  const rock=walk?Math.sin(ph*2)*.012:Math.sin(ph)*.06,lift=walk?Math.abs(Math.sin(ph))*.6:Math.pow(.5+.5*Math.sin(ph+1.2),1.6)*1.7;
  c.save();c.translate(x,y);
  // ground shadow
  const sg=c.createRadialGradient(-2*sc,1.5,2,-2*sc,1.5,38*sc);sg.addColorStop(0,'rgba(0,0,0,.32)');sg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=sg;c.beginPath();c.ellipse(-2*sc,1.5,36*sc,4.5*sc,0,0,7);c.fill();
  c.scale(opt.flip?-sc:sc,sc);c.translate(0,-lift);c.rotate(rock);
  /* legs: [hip x, hip y, phase offset, fore?] — a rotary gallop: hind L, hind R, fore R, fore L */
  const legs=walk?[[-20,-32,0,0],[-17,-31,Math.PI,0],[15,-31,Math.PI*.5,1],[18,-30,Math.PI*1.5,1]]:[[-20,-32,0,0],[-17,-31,.55,0],[15,-31,1.6,1],[18,-30,2.15,1]];
  const amp=walk?.55:1;
  const leg=(L,col,hoof)=>{const [hx,hy,o,fore]=L,p=ph+o,sn=Math.sin(p),swing=Math.max(0,-Math.sin(p+.9));
    let a1,a2;if(fore){a1=.62*sn*amp;a2=a1-(1.9*swing*amp)+.12*amp;}else{a1=.5*sn*amp-.1;a2=a1+(1.5*Math.max(0,-Math.sin(p+1.3))*amp)-.35;}
    const l1=fore?14:15,l2=fore?13.5:14.5;
    const kx=hx+Math.sin(a1)*l1,ky=hy+Math.cos(a1)*l1,fx=kx+Math.sin(a2)*l2,fy=ky+Math.cos(a2)*l2;
    // upper: thick, tapering
    c.fillStyle=col;c.beginPath();const w1=fore?4:5.5,w2=2.2;const n1x=Math.cos(a1),n1y=-Math.sin(a1);
    c.moveTo(hx-n1x*w1,hy-n1y*w1);c.lineTo(hx+n1x*w1,hy+n1y*w1);c.lineTo(kx+n1x*w2,ky+n1y*w2);c.lineTo(kx-n1x*w2,ky-n1y*w2);c.closePath();c.fill();
    c.beginPath();c.arc(kx,ky,2.3,0,7);c.fill();
    // cannon + pastern, thin
    c.strokeStyle=col;c.lineWidth=2.6;c.lineCap='round';c.beginPath();c.moveTo(kx,ky);c.lineTo(fx,fy);c.stroke();
    c.fillStyle=hoof;c.beginPath();c.moveTo(fx-1.8,fy-1);c.lineTo(fx+2.6,fy-1);c.lineTo(fx+3,fy+1.6);c.lineTo(fx-2,fy+1.6);c.closePath();c.fill();};
  leg(legs[0],far,'#1a1410');leg(legs[3],far,'#1a1410');
  // tail streaming out behind
  const tw=walk?Math.sin(ph)*2:Math.sin(ph-.6)*2.2;c.fillStyle=farM;c.beginPath();c.moveTo(-28,-41);c.quadraticCurveTo(-40,-40+tw,-50,(walk?-24:-33)+tw);c.quadraticCurveTo(-44,(walk?-26:-30)+tw,-29,-35);c.closePath();c.fill();
  c.strokeStyle=co.m;c.lineWidth=1;for(let k=0;k<3;k++){c.beginPath();c.moveTo(-29,-39+k);c.quadraticCurveTo(-40,-38+tw+k*2,-49+k*2,(walk?-25:-32)+tw+k);c.stroke();}
  // body
  const bg=c.createLinearGradient(0,-47,0,-21);bg.addColorStop(0,hi);bg.addColorStop(.42,co.c);bg.addColorStop(1,lo);c.fillStyle=bg;
  c.beginPath();c.moveTo(22,-42);c.quadraticCurveTo(16,-46,9,-45.5);c.quadraticCurveTo(-4,-42,-14,-44);c.quadraticCurveTo(-24,-46,-29,-40);c.quadraticCurveTo(-31,-33,-27,-27);
  c.quadraticCurveTo(-22,-24,-17,-25);c.quadraticCurveTo(-4,-22,10,-23.5);c.quadraticCurveTo(19,-24,23,-29);c.quadraticCurveTo(26,-36,22,-42);c.closePath();c.fill();
  // muscle shading: hindquarter, shoulder, ribs, belly line
  c.fillStyle='rgba(255,255,255,.12)';c.beginPath();c.ellipse(-20,-38,7,4.5,-.4,0,7);c.fill();c.beginPath();c.ellipse(15,-37,5,6,.5,0,7);c.fill();
  c.strokeStyle='rgba(0,0,0,.16)';c.lineWidth=.9;c.beginPath();c.moveTo(-24,-30);c.quadraticCurveTo(-17,-35,-12,-29);c.stroke();c.beginPath();c.moveTo(11,-42);c.quadraticCurveTo(7,-34,12,-26);c.stroke();
  c.strokeStyle='rgba(0,0,0,.08)';for(let k=0;k<3;k++){c.beginPath();c.moveTo(-6+k*4,-36);c.quadraticCurveTo(-5+k*4,-30,-7+k*4,-25);c.stroke();}
  // neck: arched crest, stretched forward at the gallop
  const hb=walk?Math.sin(ph*2)*.8:Math.sin(ph+.4)*1.5;
  c.save();c.translate(14,-40);c.rotate(walk?-.05:.12+Math.sin(ph+.4)*.045);c.translate(-14,40);
  const ng=c.createLinearGradient(16,-58,30,-34);ng.addColorStop(0,hi);ng.addColorStop(1,co.c);c.fillStyle=ng;
  c.beginPath();c.moveTo(8,-44);c.quadraticCurveTo(20,-56,33,-60+hb);c.lineTo(41,-55+hb);c.quadraticCurveTo(32,-46,25,-31);c.quadraticCurveTo(18,-30,15,-34);c.closePath();c.fill();
  c.strokeStyle='rgba(0,0,0,.14)';c.lineWidth=1;c.beginPath();c.moveTo(24,-33);c.quadraticCurveTo(30,-44,38,-54+hb);c.stroke();
  // head: forehead, cheek, muzzle
  const hg=c.createLinearGradient(34,-62,52,-42);hg.addColorStop(0,hi);hg.addColorStop(1,co.c);c.fillStyle=hg;
  c.beginPath();c.moveTo(32,-60+hb);c.quadraticCurveTo(36,-64+hb,41,-60+hb);c.quadraticCurveTo(48,-53+hb,54,-47+hb);c.quadraticCurveTo(56,-44+hb,53,-42+hb);c.quadraticCurveTo(48,-41+hb,45,-44+hb);c.quadraticCurveTo(40,-46+hb,38,-50+hb);c.quadraticCurveTo(33,-52+hb,32,-60+hb);c.closePath();c.fill();
  c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(39,-52+hb,3.5,2.4,.6,0,7);c.fill();
  c.fillStyle=co.c;c.beginPath();c.moveTo(34,-61+hb);c.lineTo(33,-68+hb);c.lineTo(37,-62+hb);c.fill();c.fillStyle=lo;c.beginPath();c.moveTo(36,-61+hb);c.lineTo(36.5,-67+hb);c.lineTo(39,-61+hb);c.fill();
  c.fillStyle='#120c08';c.beginPath();c.ellipse(41,-55.5+hb,1.3,1,.4,0,7);c.fill();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.arc(41.3,-55.9+hb,.35,0,7);c.fill();
  c.fillStyle='rgba(0,0,0,.55)';c.beginPath();c.ellipse(53,-44.5+hb,1,.7,.4,0,7);c.fill();
  // bridle & bit
  c.strokeStyle='#2a1d14';c.lineWidth=.8;c.beginPath();c.moveTo(35,-60+hb);c.lineTo(44,-46+hb);c.moveTo(38,-57+hb);c.quadraticCurveTo(46,-52+hb,50,-47+hb);c.stroke();c.fillStyle='#c9ccd0';c.beginPath();c.arc(49,-46.5+hb,.9,0,7);c.fill();
  // mane flowing back
  c.strokeStyle=co.m;c.lineCap='round';c.lineWidth=2.6;c.beginPath();c.moveTo(9,-45);c.quadraticCurveTo(21,-56,33,-61+hb);c.stroke();
  c.lineWidth=1;for(let k=0;k<6;k++){const mx=12+k*4,my=-47-k*2.3+hb*.3;c.beginPath();c.moveTo(mx,my);c.lineTo(mx-3-(walk?0:2),my+2+Math.sin(ph*3+k)*.8);c.stroke();}
  c.restore();
  // near legs over the body
  leg(legs[1],co.c,'#1d1814');leg(legs[2],co.c,'#1d1814');
  // saddle cloth
  if(!opt.bare){c.fillStyle='#f6f3ea';c.beginPath();c.moveTo(-10,-44);c.lineTo(5,-44.5);c.lineTo(4,-35);c.quadraticCurveTo(-3,-34,-9,-35.5);c.closePath();c.fill();c.fillStyle='rgba(0,0,0,.12)';c.fillRect(-10,-36.5,14,1.2);
  c.fillStyle='#2a2018';c.beginPath();c.ellipse(-2,-45,7,1.8,0,0,7);c.fill();c.strokeStyle='#2a2018';c.lineWidth=.8;c.beginPath();c.moveTo(-1,-44);c.lineTo(0,-30);c.stroke();
  c.fillStyle='#222';c.font='bold 6.5px sans-serif';c.textAlign='center';if(!!opt.flip!==!!opt.mir){c.save();c.translate(-3,-37.5);c.scale(-1,1);c.fillText(num,0,0);c.restore();}else c.fillText(num,-3,-37.5);}
  if(opt.rug){c.fillStyle='#22324f';c.beginPath();c.moveTo(-24,-41);c.quadraticCurveTo(-4,-46,13,-41);c.lineTo(15,-27);c.quadraticCurveTo(-4,-23,-26,-27);c.closePath();c.fill();
    c.strokeStyle=silks.b;c.lineWidth=1.4;c.stroke();c.fillStyle='#f6f3ea';c.fillRect(-9,-38,14,9);c.fillStyle='#222';c.font='bold 8px sans-serif';c.textAlign='center';
    if(!!opt.flip!==!!opt.mir){c.save();c.translate(-2,-31);c.scale(-1,1);c.fillText(num,0,0);c.restore();}else c.fillText(num,-2,-31);}
  if(opt.nj){c.restore();return;}
  // jockey v2: proper race crouch — short stirrups, knees on the withers, flat back, elbows in, head up
  if(!opt.nj){const run=!opt.walk,pmp=run?Math.sin(ph+.3):0,bob=run?Math.cos(ph)*.35:0;
    JDRIVE=run?(opt.drive||0):0;drawJockeyFig(c,run,pmp,bob,hb,silks,ph);JDRIVE=0;}

  c.restore();
}
var JDRIVE=0;   // 0..1: how hard the rider is driving (last furlongs)
function drawJockeyFig(c,run,pmp,bob,hb,silks,ph){if(run&&JDRIVE>0){pmp*=1+JDRIVE*.9;bob*=1+JDRIVE*.9;}const sa=silks.a,sb=silks.b,P=silks.p;
  const shd=(hex,a)=>{if(!/^#[0-9a-f]{6}$/i.test(hex))return hex;const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(a<0?v*(1+a):v+(255-v)*a)));return `rgb(${f(r)},${f(g)},${f(b)})`;};
  const J=run?{ank:[5,-37],knee:[12.5,-46.5+bob*.3],hip:[-5,-51.5+bob],sh:[12,-56+bob],nk:[15.5,-57.5+bob],hd:[18.5,-60+bob],el:[15+pmp*1.2,-50.5+bob*.6],hand:[23+pmp*2.8,-48.5+bob*.4]}
             :{ank:[3,-35],knee:[8,-42.5],hip:[-3,-47.5],sh:[1,-61],nk:[2.2,-63],hd:[3.5,-66.5],el:[6,-54],hand:[13,-50]};
  const limb=(p,q,w1,w2,col)=>{const dx=q[0]-p[0],dy=q[1]-p[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;c.fillStyle=col;c.beginPath();c.moveTo(p[0]+nx*w1,p[1]+ny*w1);c.lineTo(q[0]+nx*w2,q[1]+ny*w2);c.lineTo(q[0]-nx*w2,q[1]-ny*w2);c.lineTo(p[0]-nx*w1,p[1]-ny*w1);c.closePath();c.fill();c.beginPath();c.arc(p[0],p[1],w1,0,7);c.fill();c.beginPath();c.arc(q[0],q[1],w2,0,7);c.fill();};
  // far arm (darker) behind the body
  limb(J.sh,[J.el[0]-1,J.el[1]-.6],1.7,1.3,shd(sb,-.35));limb([J.el[0]-1,J.el[1]-.6],[J.hand[0]-1.5,J.hand[1]-.8],1.3,1,shd(sb,-.35));
  // reins
  c.strokeStyle='rgba(40,28,18,.85)';c.lineWidth=.7;c.beginPath();c.moveTo(J.hand[0],J.hand[1]);c.quadraticCurveTo((J.hand[0]+49)/2,J.hand[1]+2.5,49,-47+hb);c.stroke();
  // stirrup leather + iron
  c.strokeStyle='#3a2a1e';c.lineWidth=.7;c.beginPath();c.moveTo(-1,-44.5);c.lineTo(J.ank[0],J.ank[1]+1);c.stroke();
  c.strokeStyle='#b8bec4';c.lineWidth=.9;c.beginPath();c.moveTo(J.ank[0]-2.2,J.ank[1]+1.6);c.lineTo(J.ank[0]+2.6,J.ank[1]+1.6);c.stroke();
  // boot (knee → ankle → toe), glossy
  const bg=c.createLinearGradient(J.knee[0]-2,0,J.knee[0]+3,0);bg.addColorStop(0,'#2a2622');bg.addColorStop(.4,'#0e0c0b');bg.addColorStop(1,'#1c1917');
  limb(J.knee,J.ank,2.2,1.4,bg);c.fillStyle='#0e0c0b';c.beginPath();c.ellipse(J.ank[0]+1.4,J.ank[1]+.9,2.6,1.1,.1,0,7);c.fill();
  c.fillStyle='rgba(255,255,255,.18)';c.fillRect(J.knee[0]-.3,J.knee[1]+2,.6,(J.ank[1]-J.knee[1])-3);
  // thigh in white breeches (hip → knee), rounded and shaded
  limb(J.hip,J.knee,3.3,2.4,'#f1eee6');c.fillStyle='rgba(0,0,0,.1)';limb([J.hip[0],J.hip[1]+1.6],[J.knee[0],J.knee[1]+1.4],1.4,1,'rgba(0,0,0,.1)');
  // torso: seat → flat back → rounded shoulders, chest underneath
  const tg=c.createLinearGradient(0,J.sh[1]-4,0,J.hip[1]+3);tg.addColorStop(0,shd(sa,.22));tg.addColorStop(.55,sa);tg.addColorStop(1,shd(sa,-.3));c.fillStyle=tg;
  {const dx=J.sh[0]-J.hip[0],dy=J.sh[1]-J.hip[1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;   // back on the n side
   c.beginPath();c.moveTo(J.hip[0]-ux*2+nx*3.4,J.hip[1]-uy*2+ny*3.4);
   c.quadraticCurveTo(J.hip[0]+dx*.5+nx*4.6,J.hip[1]+dy*.5+ny*4.6,J.sh[0]+nx*2.8,J.sh[1]+ny*2.8);   // back line (slight round)
   c.quadraticCurveTo(J.sh[0]+ux*3.4,J.sh[1]+uy*3.4,J.sh[0]-nx*2.6,J.sh[1]-ny*2.6);               // shoulder
   c.quadraticCurveTo(J.hip[0]+dx*.45-nx*3.4,J.hip[1]+dy*.45-ny*3.4,J.hip[0]-nx*2.6,J.hip[1]-ny*2.6);   // chest / belly
   c.quadraticCurveTo(J.hip[0]-ux*3.2,J.hip[1]-uy*3.2,J.hip[0]-ux*2+nx*3.4,J.hip[1]-uy*2+ny*3.4);c.closePath();c.fill();}
  // silks pattern on the body
  c.save();c.clip();c.fillStyle=sb;const mx=(J.hip[0]+J.sh[0])/2,my=(J.hip[1]+J.sh[1])/2;
  if(P==='一本輪'||P==='山形'){c.save();c.translate(mx,my);c.rotate(Math.atan2(J.sh[1]-J.hip[1],J.sh[0]-J.hip[0])+Math.PI/2);c.fillRect(-1.6,-12,3.2,24);c.restore();}
  else if(P==='縦縞'){c.save();c.translate(mx,my);c.rotate(Math.atan2(J.sh[1]-J.hip[1],J.sh[0]-J.hip[0]));for(let k=-12;k<12;k+=3)c.fillRect(k,-8,1.2,16);c.restore();}
  else if(P==='襷'){c.beginPath();c.moveTo(J.hip[0],J.hip[1]-2);c.lineTo(J.sh[0]+1,J.sh[1]+3);c.lineTo(J.sh[0]+3,J.sh[1]);c.lineTo(J.hip[0]+2.5,J.hip[1]-5);c.fill();}
  else if(P==='水玉'){[[-4,0],[2,-2],[6,1],[-1,2]].forEach(([dx,dy])=>{c.beginPath();c.arc(mx+dx,my+dy,1.1,0,7);c.fill();});}
  c.restore();
  // near arm: sleeve (shoulder → elbow) and forearm to the hands, glove
  const ag=shd(sb,.05);limb(J.sh,J.el,2.1,1.6,ag);limb(J.el,J.hand,1.6,1.15,ag);
  c.fillStyle='rgba(255,255,255,.15)';limb([J.sh[0],J.sh[1]-1],[J.el[0],J.el[1]-.8],.7,.5,'rgba(255,255,255,.18)');
  c.fillStyle='#f2efe8';c.beginPath();c.ellipse(J.hand[0]+.6,J.hand[1]+.2,1.5,1.2,0,0,7);c.fill();
  // collar, neck, face, chin strap, goggles, helmet with peak
  c.fillStyle='#e3c09c';c.beginPath();c.ellipse(J.nk[0],J.nk[1],1.4,1.6,0,0,7);c.fill();
  c.fillStyle='#e8c8a6';c.beginPath();c.ellipse(J.hd[0]+.4,J.hd[1]+1,2.5,2.6,0,0,7);c.fill();
  c.fillStyle='#d2ab86';c.beginPath();c.ellipse(J.hd[0]+1.6,J.hd[1]+2.4,1.3,1,0,0,7);c.fill();
  const hg=c.createRadialGradient(J.hd[0]-1,J.hd[1]-2.2,.3,J.hd[0],J.hd[1]-1,3.6);hg.addColorStop(0,shd(sb,.45));hg.addColorStop(1,sb);c.fillStyle=hg;
  c.beginPath();c.arc(J.hd[0],J.hd[1]-.4,3.1,Math.PI*.92,Math.PI*2.05);c.closePath();c.fill();
  c.beginPath();c.moveTo(J.hd[0]+1.5,J.hd[1]-.5);c.lineTo(J.hd[0]+5,J.hd[1]-.1);c.lineTo(J.hd[0]+1.5,J.hd[1]+.5);c.fill();
  c.fillStyle='#1d2228';c.fillRect(J.hd[0]+.6,J.hd[1]+.3,2.6,1.1);c.fillStyle='rgba(150,200,235,.75)';c.fillRect(J.hd[0]+1.6,J.hd[1]+.45,1.4,.7);
  c.strokeStyle='rgba(0,0,0,.45)';c.lineWidth=.35;c.beginPath();c.moveTo(J.hd[0]-1.5,J.hd[1]+.4);c.lineTo(J.hd[0]+.5,J.hd[1]+3.2);c.stroke();
  // whip held down the shoulder
  if(run){const sw=JDRIVE>.35?Math.max(0,Math.sin(ph*.5+silks.a.length+(silks.p||'').length)):0;   // under a drive the stick comes up and back every other stride
    const tx=J.hand[0]-12+sw*7,ty=J.hand[1]-5.5+pmp-sw*17;c.strokeStyle='#2a2522';c.lineWidth=.6+sw*.35;c.beginPath();c.moveTo(J.hand[0]-.5,J.hand[1]);c.quadraticCurveTo(J.hand[0]-5,J.hand[1]-3-sw*6,tx,ty);c.stroke();
    if(sw>.7){c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=.5;c.beginPath();c.arc(J.hand[0],J.hand[1],15,Math.PI*1.25,Math.PI*1.55);c.stroke();}}
}
