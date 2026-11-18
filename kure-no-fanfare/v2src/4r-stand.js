/* =========================================================
   race backdrop: a proper grandstand full of people, and a
   turf-vision screen showing the live pictures
   ========================================================= */
const CROWD={};
function crowdTile(sz,rows,seed){const key=sz+'|'+rows+'|'+seed;if(CROWD[key])return CROWD[key];
  const dpr=window.devicePixelRatio||1,tw=Math.round(sz*24),th=Math.round(sz*rows*1.15),o=document.createElement('canvas');o.width=tw*dpr;o.height=th*dpr;const c=o.getContext('2d');c.scale(dpr,dpr);
  const coats=['#2b3a55','#3a3a3a','#6b4a3a','#e2ddd2','#5a2d2d','#2e4a3f','#9a7b52','#b33a35','#d9d2c3','#41506b','#7a6a58','#1f2a33'];
  for(let r=0;r<rows;r++){const y=r*sz*1.15,d=1-r/rows*.25;
    c.fillStyle=`rgba(0,0,0,${.18+r*.01})`;c.fillRect(0,y+sz*.95,tw,sz*.2);                  // seat step
    const stp=tw/Math.round(tw/(sz*(.92+((r*7)%3)*.04)));for(let x=0;x<tw-1;x+=stp){const h=hash(seed+'.'+r+'.'+Math.round(x));if(h<.12)continue;const jx=(hash('j'+r+x)-.5)*sz*.25;const px0=((x+jx)%tw+tw)%tw;for(const px of [px0,px0-tw,px0+tw]){
      const col=coats[Math.floor(h*coats.length)%coats.length];
      // shoulders/torso
      c.fillStyle=col;c.beginPath();c.moveTo(px-sz*.42,y+sz*1.1);c.quadraticCurveTo(px-sz*.4,y+sz*.5,px,y+sz*.48);c.quadraticCurveTo(px+sz*.4,y+sz*.5,px+sz*.42,y+sz*1.1);c.closePath();c.fill();
      c.fillStyle='rgba(255,255,255,.08)';c.fillRect(px-sz*.3,y+sz*.55,sz*.18,sz*.4);
      // head, hair / cap
      c.fillStyle=hash('sk'+h)<.85?'#e3c3a2':'#c79c76';c.beginPath();c.arc(px,y+sz*.32,sz*.21,0,7);c.fill();
      const hr=hash('hr'+h);c.fillStyle=hr<.3?'#1d1714':hr<.5?'#3b2a20':hr<.62?'#bfbfbf':hr<.75?'#b8402f':hr<.85?'#2b3a55':'#1d1714';
      if(hr>=.62&&hr<.85){c.beginPath();c.arc(px,y+sz*.28,sz*.23,Math.PI,0);c.fill();c.fillRect(px,y+sz*.25,sz*.26,sz*.06);}else{c.beginPath();c.arc(px,y+sz*.27,sz*.22,Math.PI*1.05,-.05);c.fill();}
      if(hash('nw'+h)<.08){c.fillStyle='#f2f2ee';c.fillRect(px-sz*.2,y+sz*.55,sz*.4,sz*.28);}            // a newspaper held up
    }}}
  return CROWD[key]=o;}
function drawStand(c,W,H,st0,st1,now,tau){
  const top=H*.165,roofB=H*.195,glassB=H*.24,upB=H*.312,midB=H*.324,lowB=H*.402;
  const x0=Math.max(-20,st0),x1=Math.min(W+20,st1);
  // structure
  c.fillStyle='#8c9196';c.fillRect(st0,top,st1-st0,lowB-top);
  // roof canopy with its shadow
  c.fillStyle='#e4e6e3';c.beginPath();c.moveTo(st0-14,top+H*.012);c.lineTo(st1+14,top+H*.012);c.lineTo(st1+6,top-H*.012);c.lineTo(st0-6,top-H*.012);c.closePath();c.fill();
  c.fillStyle='#b9bdbd';c.fillRect(st0-14,top+H*.012,st1-st0+28,H*.008);
  c.fillStyle='rgba(0,0,0,.28)';c.fillRect(st0,top+H*.02,st1-st0,H*.02);
  // owners' / restaurant floor: glass with warm lights
  const gg=c.createLinearGradient(0,roofB,0,glassB);gg.addColorStop(0,'#6f8a9c');gg.addColorStop(1,'#a9c2cf');c.fillStyle=gg;c.fillRect(st0,roofB,st1-st0,glassB-roofB);
  c.fillStyle='rgba(255,236,190,.55)';for(let x=Math.max(st0,-40)+((st0%26)+26)%26;x<x1;x+=26)c.fillRect(x+3,roofB+H*.006,10,H*.006);
  c.fillStyle='#d9dcda';for(let x=st0;x<st1;x+=26){if(x<-30||x>W+30)continue;c.fillRect(x,roofB,2,glassB-roofB);}
  c.fillRect(st0,glassB-2,st1-st0,3);
  // upper tier crowd (smaller), lower tier crowd (bigger): repeating tiles scroll with the stand
  const tile=(sz,rows,yA,yB,seed)=>{const t=crowdTile(sz,rows,seed),tw=t.width/(window.devicePixelRatio||1),th=yB-yA;c.save();c.beginPath();c.rect(x0,yA,x1-x0,th);c.clip();
    for(let x=st0+(Math.floor((x0-st0)/tw))*tw;x<x1;x+=tw)c.drawImage(t,Math.floor(x),Math.round(yA),Math.ceil(tw)+1,Math.round(th));c.restore();};
  const s1=Math.max(3,H*.0115),s2=Math.max(4,H*.0145);
  tile(s1,Math.max(3,Math.round((upB-glassB)/(s1*1.15))),glassB,upB,'u');
  c.fillStyle='#cfd2cf';c.fillRect(st0,upB,st1-st0,midB-upB);c.fillStyle='#9aa09d';for(let x=st0;x<st1;x+=8){if(x<-10||x>W+10)continue;c.fillRect(x,upB-H*.006,1,H*.006);}c.fillRect(st0,upB-H*.006,st1-st0,1);
  tile(s2,Math.max(3,Math.round((lowB-midB)/(s2*1.15))),midB,lowB,'l');
  // pillars holding the roof
  c.fillStyle='rgba(90,95,100,.85)';for(let x=st0+40;x<st1;x+=120){if(x<-10||x>W+10)continue;c.fillRect(Math.round(x),top+H*.015,4,glassB-top);c.fillStyle='rgba(90,95,100,.85)';}
  // the stretch run: people on their feet, arms up, camera flashes
  if(tau>.75){const n=Math.floor((x1-x0)/22);for(let i=0;i<n;i++){const h=hash('arm'+i);if(h>.3)continue;const x=x0+((h*9973)%1)*(x1-x0),y=midB+s2*.6+(hash('ay'+i)*.7)*(lowB-midB);
      const up=Math.sin(now/160+i*1.7)*.5+.5,hx=x+(h-.15)*6,hy=y-s2*(.55+up*.45);c.strokeStyle=['#e2ddd2','#2b3a55','#5a2d2d','#3a3a3a'][i%4];c.lineWidth=Math.max(1.2,s2*.2);c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(hx,hy);c.stroke();
      c.fillStyle='#e3c3a2';c.beginPath();c.arc(hx,hy,Math.max(.9,s2*.13),0,7);c.fill();}
    for(let i=0;i<5;i++)if(R()<.3){c.fillStyle='rgba(255,255,245,.95)';c.beginPath();c.arc(x0+R()*(x1-x0),glassB+R()*(lowB-glassB),1.5+R()*2.2,0,7);c.fill();}}
  // front rail of the apron
  c.fillStyle='#f0f0ec';c.fillRect(st0,lowB-H*.004,st1-st0,H*.004);
}
function drawVision(c,W,H,vx,race,fld,now,gph,mir){const vw=W*.26,vh=H*.13,vy=H*.225;if(vx<-vw-20||vx>W+20)return;if(mir){c.save();c.translate(2*vx+vw,0);c.scale(-1,1);drawVision(c,W,H,vx,race,fld,now,gph,false);c.restore();return;}
  // legs and frame
  c.fillStyle='#3b4045';c.fillRect(vx+vw*.18,vy+vh,5,H*.4-vy-vh);c.fillRect(vx+vw*.78,vy+vh,5,H*.4-vy-vh);c.fillRect(vx+vw*.18,vy+vh+H*.02,vw*.6+5,3);
  c.fillStyle='#1d2124';c.fillRect(vx-4,vy-4,vw+8,vh+8);c.fillStyle='#2f3539';c.fillRect(vx-4,vy+vh+4,vw+8,H*.018);
  c.fillStyle='#c8102e';c.fillRect(vx-4,vy+vh+4,vw*.35,H*.018);c.fillStyle='#fff';c.font=`bold ${Math.max(6,H*.012)}px sans-serif`;c.textAlign='left';c.fillText('TURF VISION',vx,vy+vh+4+H*.014);
  // screen: live picture of the field
  c.save();c.beginPath();c.rect(vx,vy,vw,vh);c.clip();
  const sk=c.createLinearGradient(0,vy,0,vy+vh*.45);sk.addColorStop(0,'#8fb9d8');sk.addColorStop(1,'#cfe1ec');c.fillStyle=sk;c.fillRect(vx,vy,vw,vh);
  c.fillStyle='#5a7a5f';c.fillRect(vx,vy+vh*.42,vw,vh*.06);c.fillStyle='#5aa858';c.fillRect(vx,vy+vh*.48,vw,vh*.52);c.fillStyle='#fff';c.fillRect(vx,vy+vh*.5,vw,1);
  const sc=vh/95;fld.slice(0,6).forEach((f,i)=>{const x=vx+vw*(.15+((i*.13+now*.00003)%1)*.75),y=vy+vh*(.82+(i%3)*.05);drawHorse(c,x,y,sc,gph+i*1.7,f.coat||'鹿毛',f.silks,'',false,{});});
  c.fillStyle='rgba(0,0,0,.08)';for(let y=vy;y<vy+vh;y+=2)c.fillRect(vx,y,vw,1);
  c.fillStyle='rgba(0,0,0,.6)';c.fillRect(vx,vy,vw,vh*.17);c.fillStyle='#fff';c.font=`bold ${Math.max(7,vh*.12)}px sans-serif`;c.fillText(race.name,vx+4,vy+vh*.13);
  c.fillStyle='#e0262d';c.fillRect(vx+vw-vh*.32,vy+vh*.03,vh*.28,vh*.11);c.fillStyle='#fff';c.font=`bold ${Math.max(6,vh*.08)}px sans-serif`;c.textAlign='center';c.fillText('LIVE',vx+vw-vh*.18,vy+vh*.115);
  c.restore();
  const gl=c.createLinearGradient(vx,vy,vx+vw,vy+vh);gl.addColorStop(0,'rgba(255,255,255,.12)');gl.addColorStop(.3,'rgba(255,255,255,0)');c.fillStyle=gl;c.fillRect(vx,vy,vw,vh);
}
