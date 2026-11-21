/* =========================================================
   口取り写真: a carefully drawn winner's-circle photo
   (replaces the rough drawKuchi in 4d-owner.js)
   ========================================================= */
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(v+(amt<0?v*amt:(255-v)*amt))));return `rgb(${f(r)},${f(g)},${f(b)})`;}
function photoPerson(c,x,y,h,o){
  const u=h/100;c.save();c.translate(x,y);
  const suit=o.suit||'#3a4250',skin=o.skin||'#efcfae',hair=o.hair||'#2a211c';
  // shadow
  c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(0,0,16*u,3*u,0,0,7);c.fill();
  // legs & shoes
  const pants=o.pants||shade(suit,-.15);
  c.fillStyle=pants;
  c.beginPath();c.moveTo(-9*u,-47*u);c.lineTo(-1*u,-47*u);c.lineTo(-2*u,-2*u);c.lineTo(-8.5*u,-2*u);c.closePath();c.fill();
  c.beginPath();c.moveTo(1*u,-47*u);c.lineTo(9*u,-47*u);c.lineTo(8.5*u,-2*u);c.lineTo(2*u,-2*u);c.closePath();c.fill();
  if(o.dress){c.fillStyle=o.dress;c.beginPath();c.moveTo(-11*u,-62*u);c.lineTo(11*u,-62*u);c.quadraticCurveTo(15*u,-40*u,16*u,-30*u);c.lineTo(-16*u,-30*u);c.quadraticCurveTo(-15*u,-40*u,-11*u,-62*u);c.fill();}
  c.fillStyle='#16130f';c.beginPath();c.ellipse(-5.5*u,-1.5*u,5*u,2*u,0,0,7);c.fill();c.beginPath();c.ellipse(5.5*u,-1.5*u,5*u,2*u,0,0,7);c.fill();
  // torso (jacket)
  const gr=c.createLinearGradient(-14*u,0,14*u,0);gr.addColorStop(0,shade(suit,.12));gr.addColorStop(1,shade(suit,-.18));
  c.fillStyle=gr;c.beginPath();c.moveTo(-13*u,-80*u);c.quadraticCurveTo(-15*u,-82*u,-14*u,-74*u);c.lineTo(-11.5*u,-45*u);c.lineTo(11.5*u,-45*u);c.lineTo(14*u,-74*u);c.quadraticCurveTo(15*u,-82*u,13*u,-80*u);c.quadraticCurveTo(0,-84*u,-13*u,-80*u);c.fill();
  // shirt + tie
  c.fillStyle=o.shirt||'#f6f6f2';c.beginPath();c.moveTo(-4.5*u,-81*u);c.lineTo(4.5*u,-81*u);c.lineTo(0,-63*u);c.closePath();c.fill();
  if(!o.noTie){c.fillStyle=o.tie||'#7a2335';c.beginPath();c.moveTo(-1.4*u,-80*u);c.lineTo(1.4*u,-80*u);c.lineTo(1.8*u,-66*u);c.lineTo(0,-63.5*u);c.lineTo(-1.8*u,-66*u);c.closePath();c.fill();}
  c.strokeStyle=shade(suit,-.35);c.lineWidth=.8*u;c.beginPath();c.moveTo(-4.5*u,-81*u);c.lineTo(-1*u,-60*u);c.moveTo(4.5*u,-81*u);c.lineTo(1*u,-60*u);c.stroke();
  // arms & hands
  c.strokeStyle=shade(suit,-.08);c.lineWidth=5.5*u;c.lineCap='round';
  c.beginPath();c.moveTo(-13*u,-77*u);c.quadraticCurveTo(-16*u,-62*u,-14.5*u,-49*u);c.stroke();
  c.beginPath();c.moveTo(13*u,-77*u);c.quadraticCurveTo(16*u,-62*u,14.5*u,-49*u);c.stroke();
  c.fillStyle=skin;c.beginPath();c.arc(-14.5*u,-47.5*u,2.6*u,0,7);c.fill();c.beginPath();c.arc(14.5*u,-47.5*u,2.6*u,0,7);c.fill();
  // rosette
  if(o.rosette){c.fillStyle='#c81d2e';c.beginPath();c.moveTo(-8*u,-70*u);c.lineTo(-10.5*u,-60*u);c.lineTo(-8*u,-62*u);c.lineTo(-6*u,-59.5*u);c.lineTo(-6.5*u,-70*u);c.fill();
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;c.beginPath();c.arc(-7.5*u+Math.cos(a)*2.4*u,-72*u+Math.sin(a)*2.4*u,1.6*u,0,7);c.fill();}c.fillStyle='#f2c230';c.beginPath();c.arc(-7.5*u,-72*u,1.3*u,0,7);c.fill();}
  // neck & head
  c.fillStyle=shade(skin,-.08);c.fillRect(-2.6*u,-86*u,5.2*u,5*u);
  if(o.portrait){c.fillStyle='#1b1b1b';c.fillRect(-8*u,-102*u,16*u,20*u);c.fillStyle='#d9d4c7';c.fillRect(-6.5*u,-100.5*u,13*u,17*u);c.fillStyle='#555';c.beginPath();c.arc(0,-94*u,3.5*u,0,7);c.fill();c.fillRect(-4.5*u,-90*u,9*u,5*u);
    c.fillStyle='#111';c.beginPath();c.moveTo(-8*u,-102*u);c.lineTo(8*u,-102*u);c.lineTo(0,-106*u);c.fill();}
  else{
    c.fillStyle=skin;c.beginPath();c.ellipse(0,-93*u,7*u,8.3*u,0,0,7);c.fill();
    c.beginPath();c.ellipse(-7*u,-93*u,1.4*u,2.2*u,0,0,7);c.ellipse(7*u,-93*u,1.4*u,2.2*u,0,0,7);c.fill();
    c.fillStyle=hair;c.beginPath();
    if(o.long){c.moveTo(-7.6*u,-92*u);c.quadraticCurveTo(-8.5*u,-103*u,0,-102.5*u);c.quadraticCurveTo(8.5*u,-103*u,7.6*u,-92*u);c.lineTo(8*u,-82*u);c.lineTo(5.5*u,-84*u);c.quadraticCurveTo(5*u,-97*u,0,-97.5*u);c.quadraticCurveTo(-5*u,-97*u,-5.5*u,-84*u);c.lineTo(-8*u,-82*u);c.closePath();}
    else{c.moveTo(-7.4*u,-92*u);c.quadraticCurveTo(-8*u,-102.5*u,0,-102*u);c.quadraticCurveTo(8*u,-102.5*u,7.4*u,-92*u);c.quadraticCurveTo(5*u,-97.5*u,0,-97*u);c.quadraticCurveTo(-5*u,-97.5*u,-7.4*u,-92*u);}
    c.fill();
    c.fillStyle='#2a221c';c.beginPath();c.arc(-2.6*u,-92.5*u,.75*u,0,7);c.arc(2.6*u,-92.5*u,.75*u,0,7);c.fill();
    c.strokeStyle=shade(skin,-.35);c.lineWidth=.6*u;c.beginPath();c.arc(0,-89.6*u,1.8*u,.15*Math.PI,.85*Math.PI);c.stroke();
    if(o.cap){c.fillStyle=o.cap;c.beginPath();c.arc(0,-96*u,7.6*u,Math.PI,0);c.fill();c.fillRect(-9*u,-96*u,9*u,1.6*u);}
  }
  c.restore();
}
function photoHorse(c,x,y,hw,p,t){
  /* standing horse, facing left. hw = withers height in px */
  const u=hw/100,co=COATS[p.coat]||COATS['鹿毛'],dk=shade(co.c,-.25),lt=shade(co.c,.15),sl=p.silks||S.silks;
  c.save();c.translate(x,y);
  c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(-5*u,1*u,70*u,6*u,0,0,7);c.fill();
  const leg=(x0,top,kneeDx,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(x0-6*u,top);c.quadraticCurveTo(x0-5*u,-38*u,x0-3.6*u+kneeDx,-30*u);c.lineTo(x0-3.2*u+kneeDx,-6*u);c.lineTo(x0+3.6*u+kneeDx,-6*u);c.lineTo(x0+3.8*u+kneeDx,-30*u);c.quadraticCurveTo(x0+6*u,-40*u,x0+6.5*u,top);c.closePath();c.fill();
    c.fillStyle='#1d1814';c.beginPath();c.moveTo(x0-4*u+kneeDx,-6*u);c.lineTo(x0+4.5*u+kneeDx,-6*u);c.lineTo(x0+5.5*u+kneeDx,0);c.lineTo(x0-4.5*u+kneeDx,0);c.closePath();c.fill();};
  // far legs
  leg(-32*u,-62*u,1.5*u,dk);leg(54*u,-66*u,-1*u,dk);
  // tail
  c.strokeStyle=co.m;c.lineWidth=7*u;c.lineCap='round';c.beginPath();c.moveTo(60*u,-90*u);c.quadraticCurveTo(74*u,-70*u,68*u,-36*u);c.stroke();c.lineWidth=4*u;c.beginPath();c.moveTo(62*u,-86*u);c.quadraticCurveTo(78*u,-60*u,74*u,-34*u);c.stroke();
  // body
  const bg=c.createLinearGradient(0,-105*u,0,-50*u);bg.addColorStop(0,lt);bg.addColorStop(.6,co.c);bg.addColorStop(1,dk);c.fillStyle=bg;
  c.beginPath();c.moveTo(-50*u,-96*u);c.bezierCurveTo(-30*u,-104*u,20*u,-100*u,42*u,-102*u);c.bezierCurveTo(60*u,-104*u,68*u,-88*u,64*u,-72*u);c.bezierCurveTo(60*u,-60*u,48*u,-58*u,40*u,-60*u);
  c.bezierCurveTo(20*u,-54*u,-20*u,-54*u,-38*u,-60*u);c.bezierCurveTo(-56*u,-64*u,-62*u,-80*u,-56*u,-92*u);c.closePath();c.fill();
  // neck
  c.beginPath();c.moveTo(-50*u,-97*u);c.bezierCurveTo(-56*u,-118*u,-66*u,-138*u,-76*u,-150*u);c.lineTo(-88*u,-140*u);c.bezierCurveTo(-82*u,-122*u,-74*u,-96*u,-60*u,-76*u);c.closePath();c.fill();
  // head
  const hg=c.createLinearGradient(-110*u,0,-70*u,0);hg.addColorStop(0,co.c);hg.addColorStop(1,lt);c.fillStyle=hg;
  c.beginPath();c.moveTo(-74*u,-152*u);c.bezierCurveTo(-82*u,-156*u,-90*u,-150*u,-94*u,-138*u);c.bezierCurveTo(-100*u,-124*u,-106*u,-116*u,-108*u,-110*u);c.bezierCurveTo(-109*u,-104*u,-101*u,-100*u,-96*u,-104*u);
  c.bezierCurveTo(-90*u,-110*u,-84*u,-122*u,-78*u,-130*u);c.closePath();c.fill();
  if(p.blaze!==false){c.fillStyle='#f4f1ea';c.beginPath();c.moveTo(-84*u,-150*u);c.quadraticCurveTo(-95*u,-130*u,-104*u,-112*u);c.lineTo(-100*u,-110*u);c.quadraticCurveTo(-92*u,-130*u,-81*u,-148*u);c.fill();}
  c.fillStyle=co.c;c.beginPath();c.moveTo(-76*u,-150*u);c.lineTo(-74*u,-166*u);c.lineTo(-70*u,-151*u);c.fill();c.beginPath();c.moveTo(-80*u,-150*u);c.lineTo(-80*u,-165*u);c.lineTo(-75*u,-151*u);c.fill();
  c.fillStyle='#120c08';c.beginPath();c.ellipse(-86*u,-138*u,2*u,1.5*u,-.5,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(-86.6*u,-138.6*u,.6*u,0,7);c.fill();
  c.fillStyle='rgba(0,0,0,.55)';c.beginPath();c.ellipse(-105*u,-109*u,1.6*u,1.1*u,-.4,0,7);c.fill();
  // mane
  c.strokeStyle=co.m;c.lineWidth=4.5*u;c.beginPath();c.moveTo(-52*u,-99*u);c.bezierCurveTo(-58*u,-118*u,-66*u,-138*u,-74*u,-152*u);c.stroke();
  // bridle
  c.strokeStyle='#3a2a1e';c.lineWidth=1.4*u;c.beginPath();c.moveTo(-78*u,-150*u);c.lineTo(-94*u,-120*u);c.moveTo(-104*u,-112*u);c.quadraticCurveTo(-96*u,-118*u,-86*u,-120*u);c.moveTo(-88*u,-140*u);c.lineTo(-99*u,-122*u);c.stroke();
  // near legs
  leg(-46*u,-62*u,0,co.c);leg(40*u,-64*u,1*u,co.c);
  // after the race the jockey has dismounted: G1 = cooler (馬服) + lei, otherwise a plain pad
  if(p.g1){
    const cg=c.createLinearGradient(0,-104*u,0,-60*u);cg.addColorStop(0,'#6a35a0');cg.addColorStop(1,'#46206b');c.fillStyle=cg;
    c.beginPath();c.moveTo(-40*u,-101*u);c.bezierCurveTo(-10*u,-106*u,30*u,-104*u,50*u,-100*u);c.bezierCurveTo(60*u,-90*u,60*u,-74*u,54*u,-62*u);c.lineTo(-42*u,-60*u);c.bezierCurveTo(-48*u,-74*u,-48*u,-90*u,-40*u,-101*u);c.closePath();c.fill();
    c.strokeStyle='#e3be4a';c.lineWidth=1.8*u;c.beginPath();c.moveTo(-42*u,-60*u);c.lineTo(54*u,-62*u);c.stroke();
    for(let fx=-41;fx<=53;fx+=3){c.beginPath();c.moveTo(fx*u,-61*u);c.lineTo(fx*u,-55*u);c.stroke();}
    c.fillStyle='#e3be4a';c.textAlign='center';c.font=`bold ${7.5*u}px "Shippori Mincho B1",serif`;c.fillText(p.race.slice(0,8),6*u,-82*u);c.font=`600 ${6*u}px Oswald,sans-serif`;c.fillText(String(p.y),6*u,-70*u);
    // lei round the neck
    c.fillStyle='#5b2a86';c.beginPath();c.moveTo(-56*u,-108*u);c.bezierCurveTo(-64*u,-92*u,-62*u,-80*u,-54*u,-70*u);c.lineTo(-46*u,-72*u);c.bezierCurveTo(-52*u,-84*u,-52*u,-96*u,-46*u,-106*u);c.closePath();c.fill();
    c.strokeStyle='#e3be4a';c.lineWidth=1.2*u;c.stroke();
  }else{
    c.fillStyle='#f6f3ea';c.beginPath();c.moveTo(-22*u,-102*u);c.lineTo(8*u,-101*u);c.lineTo(9*u,-80*u);c.lineTo(-22*u,-82*u);c.closePath();c.fill();
    c.fillStyle='#2b2018';c.beginPath();c.ellipse(-7*u,-102*u,13*u,3.5*u,0,0,7);c.fill();
    c.strokeStyle='#2b2018';c.lineWidth=1.2*u;c.beginPath();c.moveTo(-4*u,-100*u);c.lineTo(-3*u,-66*u);c.stroke();
  }
  c.restore();
}
function drawKuchi(c,W,H,p){
  // sky
  const sk=c.createLinearGradient(0,0,0,H*.5);sk.addColorStop(0,'#8fbde3');sk.addColorStop(1,'#e4eef4');c.fillStyle=sk;c.fillRect(0,0,W,H);
  c.fillStyle='rgba(255,255,255,.75)';[[.72,.12,.08],[.8,.1,.06],[.88,.13,.07]].forEach(([x,y,r])=>{c.beginPath();c.ellipse(W*x,H*y,W*r,H*r*.45,0,0,7);c.fill();});
  // hills & trees (right)
  c.fillStyle='#7f9a83';c.beginPath();c.moveTo(W*.5,H*.5);c.bezierCurveTo(W*.62,H*.28,W*.82,H*.3,W,H*.32);c.lineTo(W,H*.55);c.closePath();c.fill();
  c.fillStyle='#5e7e62';for(let i=0;i<14;i++){const tx=W*(.52+i*.036),ty=H*(.46-Math.sin(i*1.3)*.03);c.beginPath();c.ellipse(tx,ty,W*.03,H*.06,0,0,7);c.fill();}
  // grandstand (left)
  const gx=0,gw=W*.56,gt=H*.08,gb=H*.5;
  c.fillStyle='#dfe3e6';c.fillRect(gx,gt,gw,gb-gt);
  c.fillStyle='#b9c4cc';c.beginPath();c.moveTo(gx,gt);c.lineTo(gw+W*.04,gt-H*.02);c.lineTo(gw+W*.04,gt+H*.015);c.lineTo(gx,gt+H*.035);c.fill();
  for(let f=0;f<4;f++){const fy=gt+H*.05+f*H*.095;const glass=c.createLinearGradient(0,fy,0,fy+H*.06);glass.addColorStop(0,'#9fb7c7');glass.addColorStop(1,'#cfdce4');c.fillStyle=glass;c.fillRect(gx+W*.01,fy,gw-W*.02,H*.06);
    c.fillStyle='#e9edf0';for(let x=gx+W*.01;x<gw;x+=W*.045)c.fillRect(x,fy,W*.004,H*.06);}
  // hedge with flowers
  c.fillStyle='#3f7a45';c.fillRect(0,H*.49,W,H*.05);for(let x=0;x<W;x+=W*.012){c.fillStyle=(Math.floor(x)%3?'#d6455a':'#f2c230');c.beginPath();c.arc(x+(hash(x)*4),H*.495+hash(x+'f')*H*.02,W*.0035,0,7);c.fill();}
  // turf with mowing stripes
  c.fillStyle='#78b26c';c.fillRect(0,H*.54,W,H*.46);c.fillStyle='rgba(255,255,255,.07)';for(let i=0;i<8;i+=2){c.beginPath();c.moveTo(W*i/8,H*.54);c.lineTo(W*(i+1)/8,H*.54);c.lineTo(W*(i+1.6)/8,H);c.lineTo(W*(i+.6)/8,H);c.fill();}
  // composition
  const base=H*.86,ph=H*.47,hw=ph*.9;
  const hx=W*.6;
  // people row on the left
  const ppl=p.people||[];const right=hx-108*hw/100-ph*.12,left=W*.035,step=(right-left)/Math.max(1,ppl.length);
  // horse & groom
  photoHorse(c,hx,base,hw,p);
  photoPerson(c,hx-112*hw/100,base+2,ph*.96,{suit:'#20262c',pants:'#20262c',shirt:'#20262c',noTie:true,cap:'#20262c'});
  c.strokeStyle='#3a2a1e';c.lineWidth=Math.max(1,ph*.012);c.beginPath();c.moveTo(hx-112*hw/100+ph*.14,base-ph*.48);c.quadraticCurveTo(hx-104*hw/100,base-ph*.6,hx-100*hw/100,base-ph*1.1);c.stroke();
  ppl.forEach((q,i)=>photoPerson(c,left+i*step+step/2,base+3+(i%2)*2,ph*(q.child?.7:1)*(q.small?.94:1),q));
  // the jockey, dismounted, holding the number cloth
  photoJockey(c,W*.895,base+3,ph*.9,p);
  // soft vignette
  const vg=c.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,W*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.18)');c.fillStyle=vg;c.fillRect(0,0,W,H);
  // date stamp (like a camera print)
  c.fillStyle='#ff9a2e';c.font=`600 ${Math.max(9,H*.04)}px Oswald,monospace`;c.textAlign='right';c.fillText(`'${String(p.y).slice(2)} ${String(p.m).padStart(2,'0')}`,W-10,H*.075);
  // caption bar
  c.fillStyle='rgba(255,255,255,.92)';c.fillRect(0,H*.905,W,H*.095);c.fillStyle='#222';c.textAlign='left';c.font=`bold ${Math.max(9,H*.036)}px sans-serif`;
  c.fillText(`${p.race}${p.grade&&/^G/.test(p.grade)?`（${p.grade}）`:''}　${p.name}`,10,H*.945);
  c.font=`${Math.max(8,H*.028)}px sans-serif`;c.fillStyle='#555';c.fillText(`左から ${ppl.map(q=>q.label).join('・')}・厩務員・${p.jname}騎手`,10,H*.98);
}
/* richer people for the photo */
kuchiPeople=function(){
  const own=S.part===1?S.parent.name:S.child.name;
  const L=[{label:'三國',suit:'#2b3a55',tie:'#1f4ea3',hair:'#2a211c'}];
  if(S.part===2&&S.parent.fate==='rest')L.push({label:`${S.parent.name}（父）`,suit:'#4b4f57',hair:'#d2d2d2',rosette:true,tie:'#7a2335'});
  L.push({label:`${own}（馬主）`,suit:S.part===1?'#3d434c':'#33404f',hair:S.part===1?'#8d8d8d':'#2a211c',rosette:true,tie:S.silks.b});
  if(S.part===2&&S.parent.fate==='dead')L.push({label:'父（遺影）',suit:'#2b2b2b',portrait:true,noTie:true});
  if(S.flags.mikuniWed)L.push({label:'三國の妻',suit:'#c47a8c',dress:'#c47a8c',long:true,hair:'#3b2a20',noTie:true,small:true});
  return L;
};

function photoJockey(c,x,y,h,p){
  const u=h/100,sl=p.silks||S.silks,a=sl.a,b=sl.b;c.save();c.translate(x,y);
  c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(0,0,16*u,3*u,0,0,7);c.fill();
  // boots & breeches
  c.fillStyle='#16130f';c.fillRect(-8.5*u,-24*u,7*u,24*u);c.fillRect(1.5*u,-24*u,7*u,24*u);
  c.fillStyle='#f4f2ec';c.beginPath();c.moveTo(-9.5*u,-50*u);c.lineTo(-.5*u,-50*u);c.lineTo(-1.5*u,-24*u);c.lineTo(-8.5*u,-24*u);c.closePath();c.fill();c.beginPath();c.moveTo(.5*u,-50*u);c.lineTo(9.5*u,-50*u);c.lineTo(8.5*u,-24*u);c.lineTo(1.5*u,-24*u);c.closePath();c.fill();
  // silks top
  c.fillStyle=a;c.beginPath();c.moveTo(-12*u,-80*u);c.quadraticCurveTo(0,-83*u,12*u,-80*u);c.lineTo(10.5*u,-48*u);c.lineTo(-10.5*u,-48*u);c.closePath();c.fill();
  c.save();c.clip();c.fillStyle=b;
  if(sl.p==='縦縞'){for(let i=-10;i<12;i+=5)c.fillRect(i*u,-84*u,2*u,40*u);}else if(sl.p==='一本輪'){c.fillRect(-14*u,-68*u,28*u,5*u);}else if(sl.p==='襷'){c.beginPath();c.moveTo(-12*u,-80*u);c.lineTo(-6*u,-80*u);c.lineTo(11*u,-48*u);c.lineTo(5*u,-48*u);c.fill();}
  else if(sl.p==='山形'){c.beginPath();c.moveTo(-12*u,-62*u);c.lineTo(0,-72*u);c.lineTo(12*u,-62*u);c.lineTo(12*u,-57*u);c.lineTo(0,-67*u);c.lineTo(-12*u,-57*u);c.fill();}else if(sl.p==='水玉'){[[-5,-72],[5,-72],[0,-62],[-5,-53],[5,-53]].forEach(([qx,qy])=>{c.beginPath();c.arc(qx*u,qy*u,2*u,0,7);c.fill();});}
  c.restore();
  // sleeves
  c.strokeStyle=b;c.lineWidth=5*u;c.lineCap='round';c.beginPath();c.moveTo(-12*u,-77*u);c.quadraticCurveTo(-15*u,-64*u,-10*u,-52*u);c.moveTo(12*u,-77*u);c.quadraticCurveTo(15*u,-64*u,10*u,-52*u);c.stroke();
  // head & helmet
  c.fillStyle='#efcfae';c.fillRect(-2.4*u,-85*u,4.8*u,5*u);c.beginPath();c.ellipse(0,-91*u,6.5*u,7.8*u,0,0,7);c.fill();
  c.fillStyle='#2a221c';c.beginPath();c.arc(-2.4*u,-91*u,.7*u,0,7);c.arc(2.4*u,-91*u,.7*u,0,7);c.fill();
  c.strokeStyle='#9a6b4f';c.lineWidth=.7*u;c.beginPath();c.arc(0,-88.4*u,2.2*u,.1*Math.PI,.9*Math.PI);c.stroke();
  c.fillStyle=b;c.beginPath();c.arc(0,-94*u,7.6*u,Math.PI,0);c.fill();c.fillRect(-9*u,-94.6*u,10*u,1.8*u);
  // number cloth held in front
  if(!p.noCloth){
  const bw=30*u,bh=34*u,bx=-bw/2,by=-62*u;
  // the cloth in the race's colour (G1 deep blue, G2 deep red, G3 deep green, others white), bound with a contrasting edge
  const CC={G1:['#22356f','#16244f','#fff','#d9dce6'],G2:['#86222f','#5e1620','#fff','#e8d4d6'],G3:['#1f6a3d','#145a33','#fff','#d5e6da']}[p.grade]||['#f7f6f1','#e4e2da','#1a1a1a','#3a3a3a'];
  const g=c.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,CC[0]);g.addColorStop(1,CC[1]);c.fillStyle=g;
  const shape=()=>{c.beginPath();c.moveTo(bx,by);c.lineTo(bx+bw,by);c.lineTo(bx+bw,by+bh*.74);c.quadraticCurveTo(0,by+bh*1.05,bx,by+bh*.74);c.closePath();};shape();c.fill();
  c.strokeStyle=CC[3];c.lineWidth=Math.max(.6,.9*u);c.save();c.translate(0,0);shape();c.stroke();c.restore();
  c.fillStyle=CC[2];c.textAlign='center';c.font=`600 ${bh*.48}px Oswald,sans-serif`;c.fillText(p.no,0,by+bh*.5);
  // the name always inside the cloth: as large as fits, then narrowed if it is long
  {const nm=String(p.name||''),maxW=bw*.84,F='"Hiragino Kaku Gothic StdN","Hiragino Sans","Noto Sans JP",sans-serif';let fs=bh*.15;c.font=`800 ${fs}px ${F}`;let tw=c.measureText(nm).width;
   if(tw>maxW){fs=Math.max(bh*.1,fs*maxW/tw);c.font=`800 ${fs}px ${F}`;tw=c.measureText(nm).width;}
   c.save();c.translate(0,by+bh*.7);c.scale(Math.min(1,maxW/Math.max(1,tw)),1);c.fillText(nm,0,0);c.restore();}
  c.fillStyle='#efcfae';c.beginPath();c.arc(bx+2*u,by+2*u,2.4*u,0,7);c.arc(bx+bw-2*u,by+2*u,2.4*u,0,7);c.fill();
  }
  c.restore();
}
