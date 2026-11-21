/* =========================================================
   口取り写真 v3: the horse stands at a steep angle, face forward,
   cooler with the race name on its side, everyone holding the red-white rope
   ========================================================= */
function photoHorseFront(c,x,y,hw,p){
  /* the horse stands at a steep angle: chest and face toward the camera, head poking forward,
     only a short foreshortened slice of the barrel (with the cooler) visible behind on the right */
  const u=hw/100,co=COATS[p.coat]||COATS['鹿毛'],dk=shade(co.c,-.28),lt=shade(co.c,.16),XS=1.2,HS=1.14;
  c.save();c.translate(x,y);c.scale(XS,1);
  c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(26*u,1*u,60*u,6*u,0,0,7);c.fill();
  const leg=(x0,top,w,col,sc=1)=>{c.fillStyle=col;c.beginPath();c.moveTo(x0-w*u,top);c.quadraticCurveTo(x0-w*.8*u,-36*u*sc,x0-w*.55*u,-28*u*sc);c.lineTo(x0-w*.5*u,-6*u*sc);c.lineTo(x0+w*.5*u,-6*u*sc);c.lineTo(x0+w*.55*u,-28*u*sc);c.quadraticCurveTo(x0+w*.8*u,-36*u*sc,x0+w*u,top);c.closePath();c.fill();
    c.fillStyle='#1d1814';c.beginPath();c.moveTo(x0-w*.6*u,-6*u*sc);c.lineTo(x0+w*.6*u,-6*u*sc);c.lineTo(x0+w*.7*u,0);c.lineTo(x0-w*.7*u,0);c.closePath();c.fill();};
  // far hind leg + tail peeking out behind
  c.save();c.translate(0,-8*u);leg(64*u,-56*u,5.5,dk,.86);c.restore();
  c.strokeStyle=co.m;c.lineWidth=5*u;c.lineCap='round';c.beginPath();c.moveTo(76*u,-96*u);c.quadraticCurveTo(84*u,-74*u,79*u,-48*u);c.stroke();
  // short, foreshortened barrel
  const bg=c.createLinearGradient(0,-114*u,0,-58*u);bg.addColorStop(0,lt);bg.addColorStop(.6,co.c);bg.addColorStop(1,dk);c.fillStyle=bg;
  c.beginPath();c.moveTo(4*u,-110*u);c.bezierCurveTo(28*u,-116*u,60*u,-114*u,72*u,-108*u);c.bezierCurveTo(84*u,-100*u,84*u,-74*u,72*u,-66*u);c.bezierCurveTo(50*u,-60*u,24*u,-60*u,6*u,-62*u);c.closePath();c.fill();
  // cooler with the race name, seen from the side at an angle
  const big=!!p.g1,rc=big?'#7a1f2b':(p.grade?'#1f4f7a':'#2f5d43');
  const rg=c.createLinearGradient(0,-114*u,0,-60*u);rg.addColorStop(0,shade(rc,.12));rg.addColorStop(1,shade(rc,-.25));c.fillStyle=rg;
  c.beginPath();c.moveTo(12*u,-112*u);c.bezierCurveTo(34*u,-117*u,60*u,-115*u,72*u,-109*u);c.bezierCurveTo(81*u,-98*u,81*u,-78*u,74*u,-66*u);c.bezierCurveTo(52*u,-61*u,30*u,-60*u,14*u,-61*u);c.bezierCurveTo(10*u,-76*u,9*u,-96*u,12*u,-112*u);c.closePath();c.fill();
  c.strokeStyle='#e5bd45';c.lineWidth=1.5*u;c.beginPath();c.moveTo(14*u,-61.5*u);c.bezierCurveTo(30*u,-60.5*u,52*u,-61.5*u,74*u,-66.5*u);c.stroke();
  if(big){c.lineWidth=.8*u;for(let fx=15;fx<=73;fx+=2){const yy=-61*u-(fx>52?(fx-52)*.25*u:0);c.beginPath();c.moveTo(fx*u,yy);c.lineTo(fx*u,yy+4.5*u);c.stroke();}}
  c.save();c.translate(51*u,-88*u);c.transform(.62,-.06,0,1,0,0);c.fillStyle='#f3d36e';c.textAlign='center';c.textBaseline='middle';
  const nm=p.race,fs=Math.min(14*u,72*u/Math.max(3,nm.length));c.font=`900 ${fs}px "Shippori Mincho B1",serif`;c.fillText(nm,0,-3*u);
  c.font=`600 ${7*u}px Oswald,sans-serif`;c.fillText(String(p.y),0,fs*.5+4*u);c.restore();c.textBaseline='alphabetic';
  // front legs + broad chest, square to the camera
  leg(-12*u,-66*u,7.5,dk);leg(12*u,-66*u,7.5,co.c);
  const cg=c.createRadialGradient(-6*u,-94*u,4*u,0,-86*u,30*u);cg.addColorStop(0,lt);cg.addColorStop(1,dk);c.fillStyle=cg;
  c.beginPath();c.ellipse(0,-87*u,25*u,28*u,0,0,7);c.fill();
  // neck going straight back/up behind the face
  c.fillStyle=co.c;c.beginPath();c.moveTo(-19*u,-102*u);c.bezierCurveTo(-18*u,-122*u,-15*u,-138*u,-12*u,-150*u);c.lineTo(12*u,-150*u);c.bezierCurveTo(15*u,-138*u,19*u,-122*u,22*u,-102*u);c.closePath();c.fill();
  c.fillStyle=co.m;c.beginPath();c.moveTo(12*u,-150*u);c.bezierCurveTo(16*u,-136*u,20*u,-120*u,23*u,-104*u);c.lineTo(19*u,-104*u);c.bezierCurveTo(16*u,-120*u,13*u,-136*u,9*u,-150*u);c.fill();
  // the face pokes forward toward the lens: drawn a little larger and lower over the chest
  c.save();c.translate(0,-104*u);c.scale(HS,HS);c.translate(0,112*u);
  // head, facing the camera
  const hg=c.createLinearGradient(-12*u,0,12*u,0);hg.addColorStop(0,dk);hg.addColorStop(.4,lt);hg.addColorStop(1,co.c);c.fillStyle=hg;
  c.beginPath();c.moveTo(-12*u,-170*u);c.bezierCurveTo(-14*u,-150*u,-9*u,-128*u,-8*u,-116*u);c.bezierCurveTo(-8*u,-108*u,8*u,-108*u,8*u,-116*u);c.bezierCurveTo(9*u,-128*u,14*u,-150*u,12*u,-170*u);c.quadraticCurveTo(0,-176*u,-12*u,-170*u);c.fill();
  // ears + forelock
  c.fillStyle=co.c;c.beginPath();c.moveTo(-11*u,-168*u);c.lineTo(-13*u,-184*u);c.lineTo(-5*u,-172*u);c.fill();c.beginPath();c.moveTo(11*u,-168*u);c.lineTo(13*u,-184*u);c.lineTo(5*u,-172*u);c.fill();
  c.fillStyle=co.m;c.beginPath();c.moveTo(-5*u,-174*u);c.quadraticCurveTo(0,-160*u,3*u,-158*u);c.quadraticCurveTo(4*u,-166*u,5*u,-174*u);c.fill();
  if(p.blaze!==false){c.fillStyle='#f4f1ea';c.beginPath();c.moveTo(-2*u,-160*u);c.quadraticCurveTo(-3.5*u,-130*u,-3*u,-114*u);c.lineTo(3*u,-114*u);c.quadraticCurveTo(3.5*u,-130*u,2*u,-160*u);c.fill();}
  // eyes, muzzle, nostrils
  c.fillStyle='#120c08';c.beginPath();c.ellipse(-11.5*u,-152*u,1.6*u,2.2*u,0,0,7);c.ellipse(11.5*u,-152*u,1.6*u,2.2*u,0,0,7);c.fill();
  c.fillStyle='rgba(30,20,15,.45)';c.beginPath();c.ellipse(0,-112*u,8.5*u,5*u,0,0,7);c.fill();
  c.fillStyle='#120c08';c.beginPath();c.ellipse(-4.2*u,-113*u,1.5*u,2.2*u,.3,0,7);c.ellipse(4.2*u,-113*u,1.5*u,2.2*u,-.3,0,7);c.fill();
  // bridle
  c.strokeStyle='#2a1d14';c.lineWidth=1.8*u;c.beginPath();
  c.moveTo(-12*u,-162*u);c.quadraticCurveTo(0,-158*u,12*u,-162*u);
  c.moveTo(-12.5*u,-164*u);c.lineTo(-9.5*u,-122*u);c.moveTo(12.5*u,-164*u);c.lineTo(9.5*u,-122*u);
  c.moveTo(-10*u,-126*u);c.quadraticCurveTo(0,-122*u,10*u,-126*u);c.stroke();
  c.fillStyle='#c9ccd0';c.beginPath();c.arc(-9*u,-118*u,1.8*u,0,7);c.arc(9*u,-118*u,1.8*u,0,7);c.fill();
  c.restore();
  c.restore();
  const by=y-104*u+(-118+112)*u*HS;
  return {l:{x:x-9*u*HS*XS,y:by},r:{x:x+9*u*HS*XS,y:by}};
}
function rope(c,pts,w){
  if(pts.length<2)return;const path=()=>{c.beginPath();c.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],d=Math.hypot(b.x-a.x,b.y-a.y);c.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2+d*.12,b.x,b.y);}};
  c.lineCap='round';c.lineWidth=w+1;c.strokeStyle='rgba(0,0,0,.25)';path();c.stroke();
  c.lineWidth=w;c.strokeStyle='#d0242c';path();c.stroke();
  c.setLineDash([w*1.1,w*1.1]);c.strokeStyle='#fbf8f2';path();c.stroke();c.setLineDash([]);
}
function drawKuchi(c,W,H,p){
  const sk=c.createLinearGradient(0,0,0,H*.5);sk.addColorStop(0,'#8fbde3');sk.addColorStop(1,'#e4eef4');c.fillStyle=sk;c.fillRect(0,0,W,H);
  // trees and the judge's tower behind
  c.fillStyle='#6f8a6a';for(let i=0;i<22;i++){const tx=W*i/21,ty=H*(.36-hash('t'+i)*.12);c.beginPath();c.ellipse(tx,ty+H*.08,W*.05,H*.14,0,0,7);c.fill();}
  c.strokeStyle='#d8dcd6';c.lineWidth=Math.max(2,W*.005);const tx=W*.3;c.beginPath();for(let k=0;k<5;k++){const y0=H*(.04+k*.08);c.moveTo(tx,y0);c.lineTo(tx+W*.08,y0);c.moveTo(tx,y0);c.lineTo(tx+W*.08,y0+H*.08);}c.moveTo(tx,0);c.lineTo(tx,H*.45);c.moveTo(tx+W*.08,0);c.lineTo(tx+W*.08,H*.45);c.stroke();
  c.fillStyle='#ece9e1';c.fillRect(W*.6,H*.2,W*.3,H*.2);c.fillStyle='#8b8f8c';c.beginPath();c.moveTo(W*.58,H*.21);c.lineTo(W*.75,H*.12);c.lineTo(W*.92,H*.21);c.fill();
  c.fillStyle='#a9bccb';for(let i=0;i<5;i++)c.fillRect(W*(.62+i*.055),H*.25,W*.04,H*.07);
  // turf
  c.fillStyle='#7fb46f';c.fillRect(0,H*.42,W,H*.58);c.fillStyle='rgba(255,255,255,.06)';for(let i=0;i<10;i+=2){c.beginPath();c.moveTo(W*i/10,H*.42);c.lineTo(W*(i+1)/10,H*.42);c.lineTo(W*(i+1.8)/10,H);c.lineTo(W*(i+.8)/10,H);c.fill();}
  // line-up: [left people…] jockey  HORSE  groom  [right people…]
  const base=H*.89,ph=H*.52,hw=ph*.64,hx=W*.45,hu=hw/100*1.2;
  const ppl=p.people||[],k=Math.min(2,Math.floor(ppl.length/2)),Rr=ppl.slice(ppl.length-k),L=ppl.slice(0,ppl.length-k);
  const bit=photoHorseFront(c,hx,base-ph*.03,hw,p);
  const jx=hx-W*.15,lstep=Math.min(W*.095,(jx-W*.06)/Math.max(1,L.length));
  const gx=hx+92*hu,rstep=Math.min(W*.095,(W*.95-gx)/Math.max(1,k));
  const left=[],right=[];
  for(let i=L.length;i>=1;i--){const q=L[L.length-i],x=jx-i*lstep,h=ph*(q.small?.94:1);photoPerson(c,x,base+(i%2)*2,h,q);left.push({x:x+14.5*h/100,y:base-47.5*h/100},{x:x-14.5*h/100,y:base-47.5*h/100});}
  left.sort((a,b)=>b.x-a.x);
  for(let i=k;i>=1;i--){const q=Rr[i-1],x=gx+i*rstep,h=ph*(q.small?.94:1);photoPerson(c,x,base+(i%2)*2,h,q);right.push({x:x-14.5*h/100,y:base-47.5*h/100},{x:x+14.5*h/100,y:base-47.5*h/100});}
  right.sort((a,b)=>a.x-b.x);
  const jh=ph*.9;photoJockey(c,jx,base+2,jh,p);
  const gh=ph*.97;photoPerson(c,gx,base+1,gh,{suit:'#f4f4f0',pants:'#2a2f36',shirt:'#f4f4f0',tie:'#2b3a55',cap:'#1f2328'});
  const gL={x:gx-14.5*gh/100,y:base-47.5*gh/100},gR={x:gx+14.5*gh/100,y:base-47.5*gh/100};
  c.strokeStyle='#2a1d14';c.lineWidth=Math.max(1,ph*.01);c.beginPath();c.moveTo(bit.r.x,bit.r.y);c.quadraticCurveTo(hx+30*hu,base-ph*.18,gL.x,gL.y);c.stroke();
  const rw=Math.max(2,ph*.022);
  rope(c,[bit.l,{x:jx+12*jh/100,y:base-60*jh/100},{x:jx-12*jh/100,y:base-60*jh/100},...left,{x:-10,y:base-ph*.42}],rw);
  rope(c,[bit.r,{x:hx+16*hu,y:base-ph*.26},gL,gR,...right,{x:W+10,y:base-ph*.42}],rw);
  const vg=c.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,W*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.18)');c.fillStyle=vg;c.fillRect(0,0,W,H);
  c.fillStyle='#ff9a2e';c.font=`600 ${Math.max(9,H*.04)}px Oswald,monospace`;c.textAlign='right';c.fillText(`'${String(p.y).slice(2)} ${String(p.m).padStart(2,'0')}`,W-10,H*.075);
  if(!p.nocap&&W>=480){
  c.fillStyle='rgba(255,255,255,.92)';c.fillRect(0,H*.905,W,H*.095);c.fillStyle='#222';c.textAlign='left';c.font=`bold ${Math.max(9,H*.036)}px sans-serif`;
  c.fillText(`${p.race}${p.grade&&/^G/.test(p.grade)?`（${p.grade}）`:''}　${p.name}`,10,H*.945);
  c.font=`${Math.max(8,H*.028)}px sans-serif`;c.fillStyle='#555';c.fillText(`左から ${[...L.map(q=>q.label),`${p.jname}騎手`,'（馬）','厩務員',...Rr.map(q=>q.label)].join('・')}`,10,H*.98);
  }
}
