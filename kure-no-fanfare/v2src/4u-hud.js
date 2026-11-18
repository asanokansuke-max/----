/* =========================================================
   TV broadcast graphics, after the real feed:
   bottom-left race card + top-3 in the betting, centre position
   tracker, bottom-right course map with distance & speed,
   elapsed time top-right
   ========================================================= */
const COURSE_EN2={東京:'Tokyo',中山:'Nakayama',京都:'Kyoto',阪神:'Hanshin',中京:'Chukyo',新潟:'Niigata',福島:'Fukushima',小倉:'Kokura',札幌:'Sapporo',函館:'Hakodate'};
function drawBroadcastHUD(c,W,H,o){const {fld,posX,tau,lead,tail,m0,cur,RC,race,D,MIR,pre,now,goalT}=o;
  const bh=clamp(H*.2,62,96),by=H-bh;
  const g=c.createLinearGradient(0,by-14,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.35,'rgba(0,0,0,.38)');g.addColorStop(1,'rgba(0,0,0,.6)');c.fillStyle=g;c.fillRect(0,by-14,W,bh+14);
  const sh=(t,x,y)=>{c.lineWidth=2.5;c.strokeStyle='rgba(0,0,0,.55)';c.strokeText(t,x,y);c.fillText(t,x,y);};
  const fs=clamp(W/42,8,12);
  // race card
  const cx=W*.105;c.textAlign='center';c.fillStyle='#fff';
  c.beginPath();c.arc(cx,by+bh*.2,fs*.9,0,7);c.strokeStyle='#fff';c.lineWidth=1.2;c.stroke();c.font=`bold ${fs*.8}px sans-serif`;c.fillText('馬',cx,by+bh*.2+fs*.3);
  c.font=`bold ${fs}px sans-serif`;const nm=race.name.length>7?race.name.slice(0,7):race.name;sh(nm,cx,by+bh*.5);
  c.font=`${fs*.8}px sans-serif`;sh(`${race.course} ${COURSE_EN2[race.course]||''}`,cx,by+bh*.73);
  // the three favourites: frame box, silks, odds
  const pop=[...fld].sort((a,b)=>a.pop-b.pop).slice(0,3),px=W*.215,rowH=bh*.24;
  pop.forEach((f,i)=>{const y=by+bh*.12+i*rowH*1.15,wk=wakuOf(f.no,fld.length),bs=rowH*.9;
    c.fillStyle=FRAMEC[wk-1];c.fillRect(px,y,bs,bs);c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=.8;c.strokeRect(px,y,bs,bs);c.fillStyle=FRAMET[wk-1];c.font=`600 ${bs*.8}px Oswald,sans-serif`;c.textAlign='center';c.fillText(f.no,px+bs/2,y+bs*.82);
    const sx=px+bs+4;c.fillStyle=f.silks.a;c.beginPath();c.moveTo(sx,y+bs);c.lineTo(sx+bs*.15,y+bs*.15);c.lineTo(sx+bs*.85,y+bs*.15);c.lineTo(sx+bs,y+bs);c.closePath();c.fill();c.fillStyle=f.silks.b;c.fillRect(sx+bs*.15,y+bs*.45,bs*.7,bs*.18);c.beginPath();c.arc(sx+bs/2,y+bs*.1,bs*.17,0,7);c.fill();
    c.fillStyle=f.mine?'#ffd166':'#fff';c.font=`600 ${fs}px Oswald,sans-serif`;c.textAlign='left';sh(f.odds.toFixed(1),sx+bs+5,y+bs*.85);});
  // position tracker
  if(!pre){const x0=W*.43,x1=W*.74,rr=clamp(W/70,5.5,9),y0=by+bh*.28,span=Math.max(18,lead-tail);const rows=[[],[],[]],placed=[];
    [...fld].map(f=>({f,x:posX(f)})).sort((a,b)=>b.x-a.x).forEach(q=>{const p=MIR?x0+(lead-q.x)/span*(x1-x0):x1-(lead-q.x)/span*(x1-x0);let r=0;while(r<2&&rows[r].some(v=>Math.abs(v-p)<rr*2+1))r++;rows[r].push(p);placed.push({f:q.f,px:p,py:y0+r*(rr*2+1)});});
    placed.sort((a,b)=>a.f.mine-b.f.mine).forEach(q=>{const wk=wakuOf(q.f.no,fld.length);c.beginPath();c.arc(q.px,q.py,rr,0,7);c.fillStyle=FRAMEC[wk-1];c.fill();c.lineWidth=1;c.strokeStyle=wk===1?'#999':'rgba(255,255,255,.85)';c.stroke();
      if(q.f.mine){c.lineWidth=2.2;c.strokeStyle='#ffd166';c.beginPath();c.arc(q.px,q.py,rr+2.4,0,7);c.stroke();}
      c.fillStyle=FRAMET[wk-1];c.font=`600 ${rr*1.3}px Oswald,sans-serif`;c.textAlign='center';c.fillText(q.f.no,q.px,q.py+rr*.46);});
    c.fillStyle='rgba(255,255,255,.75)';c.font=`bold ${rr*1.6}px sans-serif`;c.textAlign='center';sh('》',MIR?x0-rr*2.4:x1+rr*2.6,y0+rr*1.6);
    if(m0){const pos=cur.indexOf(m0)+1;c.font=`bold ${fs*.9}px sans-serif`;c.textAlign='left';const t=`${m0.name}　${pos}番手`;const tw=c.measureText(t).width+10;c.fillStyle='rgba(196,120,47,.92)';c.fillRect(x0,by-6,tw,fs+5);c.fillStyle='#fff';c.fillText(t,x0+5,by-6+fs+1);}}
  // course map with the leader's position, distance and speed
  let mw=Math.min(W*.22,140);const maxH=bh*.58;{const m0c=courseMap(race.course,race.surf,mw);if(m0c.h>maxH)mw=Math.floor(mw*maxH/m0c.h);}const my=by+bh*.02,mh=drawCourseMap(c,W-mw-8,my,mw,race,D,lead,pre);
  c.fillStyle='#fff';c.textAlign='right';c.font=`600 ${fs*.9}px Oswald,sans-serif`;sh(`${race.surf==='ダ'?'DIRT':'TURF'} ${D.toLocaleString()}m`,W-8,my+mh+fs*1.2);
  const v=pre?0:goalT?0:(D/RC.time)*3.6*(tau<.06?tau/.06:1)*(tau>.85?1.03:tau>.4?.97:1)+Math.sin(now/700)*.3;
  c.font=`${fs*.85}px Oswald,sans-serif`;sh(`${(race.going||'良')}　${v.toFixed(1)}km/h`,W-8,my+mh+fs*2.4);
  // elapsed time, top right
  if(!pre){const t=Math.min(RC.time,RC.time*Math.min(tau,1));const ts=`${Math.floor(t/60)}.${String(Math.floor(t%60)).padStart(2,'0')}`;c.font=`600 ${clamp(W/18,16,30)}px Oswald,sans-serif`;c.textAlign='right';c.fillStyle='#fff';c.lineWidth=3;c.strokeStyle='rgba(0,0,0,.5)';c.strokeText(ts,W-12,o.lh+clamp(W/18,16,30)+4);c.fillText(ts,W-12,o.lh+clamp(W/18,16,30)+4);}
}

/* course maps from each track's real dimensions (perimeter & home straight), 右回り mirrored */
const CDIM={東京:[2083,525],中山:[1840,310],京都:[1894,404],阪神:[2089,474],中京:[1706,412],新潟:[2223,659],福島:[1600,292],小倉:[1615,293],札幌:[1641,266],函館:[1627,262]};
const CDIMD={東京:[1899,502],中山:[1493,308],京都:[1608,329],阪神:[1518,352],中京:[1530,411],新潟:[1472,354],福島:[1444,296],小倉:[1445,291],札幌:[1487,264],函館:[1476,260]};
function courseGeom(course,surf,mw){const [P,L]=(surf==='ダ'?CDIMD:CDIM)[course]||[1800,400];const r=(P-2*L)/(2*Math.PI),k=(mw-8)/(L+2*r);
  return {r:r*k,Ls:L*k,cx:mw/2,cy:r*k+3,P:P*k,sf:L*k*.96,k,h:2*r*k+6};}

/* =========================================================
   course maps traced from each track's layout (top-down, home straight at the bottom).
   loop: bottom straight → far turn → back straight → near turn; extras drawn for context
   ========================================================= */
const CSHAPE={
  東京:{L:1.25,rA:.42,rB:.42,g:.86,ex:['chuteTopR','pocketBotR'],dirtIn:.8},
  中山:{L:.62,rA:.48,rB:.52,g:.8,ex:['outerTop'],dirtIn:.78},
  京都:{L:1.05,rA:.36,rB:.46,g:.72,ex:['outerEndL','chuteTopR'],dirtIn:.8},
  阪神:{L:.75,rA:.24,rB:.56,g:.66,ex:['outerEndL','chuteTopR'],dirtIn:.78},
  中京:{L:.95,rA:.4,rB:.48,g:.82,ex:['chuteTopR'],dirtIn:.8},
  新潟:{L:.8,rA:.4,rB:.4,g:.86,ex:['outerEndL','straight1000'],dirtIn:.8},
  札幌:{L:.5,rA:.52,rB:.52,g:.6,ex:['chuteTopR'],dirtIn:.8},
  福島:{L:.85,rA:.36,rB:.42,g:.72,ex:['chuteStraightR','chuteStraightR2'],dirtIn:.8},
  小倉:{L:.8,rA:.42,rB:.46,g:.7,ex:['chuteStraightR','extBotR'],dirtIn:.8},
  函館:{L:1,rA:.36,rB:.36,g:.72,ex:['chuteStraightR'],dirtIn:.8}
};
function loopPts(L,rA,rB,sq){// pre-mirror: start at bottom-left, run right
  const pts=[],xL=0,xR=L,N=40,arc=(cx,r,a0,a1)=>{for(let i=1;i<=N;i++){const a=a0+(a1-a0)*i/N;let x=Math.cos(a),y=Math.sin(a);if(sq){const k=1+sq*(Math.abs(Math.sin(2*a))*.35);x*=k;y*=k;}pts.push([cx+r*x,r*y]);}};
  pts.push([xL,rB]);for(let i=1;i<=20;i++)pts.push([xL+(xR-xL)*i/20,rB+(rA-rB)*i/20]);
  arc(xR,rA,Math.PI/2,-Math.PI/2);
  for(let i=1;i<=20;i++)pts.push([xR-(xR-xL)*i/20,-rA+(rA-rB)*i/20]);
  arc(xL,rB,-Math.PI/2,-Math.PI*1.5);return pts;}
function polyLen(p){const cum=[0];for(let i=1;i<p.length;i++)cum.push(cum[i-1]+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]));return cum;}
function polyAt(p,cum,s){const T=cum[cum.length-1];s=((s%T)+T)%T;let i=1;while(i<cum.length-1&&cum[i]<s)i++;const t=(s-cum[i-1])/((cum[i]-cum[i-1])||1);return [p[i-1][0]+(p[i][0]-p[i-1][0])*t,p[i-1][1]+(p[i][1]-p[i-1][1])*t];}
const CMAPC={};
function courseMap(course,surf,mw){const key=course+surf+mw;if(CMAPC[key])return CMAPC[key];
  const sh=CSHAPE[course]||{L:.7,rA:.42,rB:.42,g:.78,ex:[],dirtIn:.8},RH=RHC.includes(course);
  let loop=loopPts(sh.L,sh.rA,sh.rB,sh.sq),dirt=loopPts(sh.L,sh.rA*sh.dirtIn,sh.rB*sh.dirtIn,sh.sq);
  const ex=[],rA=sh.rA,rB=sh.rB,L=sh.L;
  sh.ex.forEach(e=>{
    if(e==='outerTop'){const a=[];const p0=[-rB*.7,-rB*.71],p1=[L+rA*.7,-rA*.71];for(let i=0;i<=30;i++){const t=i/30,x=p0[0]+(p1[0]-p0[0])*t;a.push([x,p0[1]+(p1[1]-p0[1])*t-.42*Math.sin(Math.PI*t)]);}ex.push(a);ex.push([[p0[0]-.02,p0[1]-.1],[p0[0]-.5,p0[1]-.55]]);}
    if(e==='outerEndL'){const a=[];for(let i=0;i<=30;i++){const th=-Math.PI/2-Math.PI*i/30;a.push([Math.cos(th)*rB*1.35-rB*.25,Math.sin(th)*rB*1.18]);}ex.push(a);}
    if(e==='chuteTopR')ex.push([[L*.7,-rA*.98],[L+rA*.9,-rA-.3]]);
    if(e==='chuteTopL')ex.push([[L*.15,-rB*.98],[-rB*.6,-rB-.38]]);
    if(e==='chuteStraightR')ex.push([[L*.75,-rA],[L+rA*1.15,-rA]]);
    if(e==='chuteStraightR2')ex.push([[L*.85,-rA+.1],[L+rA*1.15,-rA+.1]]);
    if(e==='extBotR')ex.push([[L*.9,rA],[L+rA*1.15,rA]]);
    if(e==='pocketBotR')ex.push([[L*.95,rA],[L+rA*.6,rA+.18]]);
    if(e==='straight1000')ex.push([[L+rA*.3,rB+.12],[-rB-.6,rB+.12]]);});
  // fit to the box (mirror right-handed courses)
  const all=[...loop,...ex.flat()];let x0=Math.min(...all.map(q=>q[0])),x1=Math.max(...all.map(q=>q[0])),y0=Math.min(...all.map(q=>q[1])),y1=Math.max(...all.map(q=>q[1]));
  const k=(mw-8)/(x1-x0),T=q=>{let x=(q[0]-x0)*k+4,y=(q[1]-y0)*k+4;if(RH)x=mw-x;return [x,y];};
  loop=loop.map(T);dirt=dirt.map(T);const exs=ex.map(a=>a.map(T)),h=(y1-y0)*k+8;
  const run=surf==='ダ'?dirt:loop,cum=polyLen(run),gs=cum[21]*sh.g;   // goal along the home straight
  const P=((surf==='ダ'?CDIMD:CDIM)[course]||[1800])[0];
  return CMAPC[key]={loop,dirt,exs,h,run,cum,gs,mpp:cum[cum.length-1]/P};}
function drawCourseMap(c,mx,my,mw,race,D,lead,pre){const m=courseMap(race.course,race.surf,mw);c.save();c.translate(mx,my);
  const line=(p,w,col,close)=>{c.lineWidth=w;c.strokeStyle=col;c.lineJoin='round';c.lineCap='round';c.beginPath();p.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));if(close)c.closePath();c.stroke();};
  const tw=Math.max(4,mw*.055);
  m.exs.forEach(a=>line(a,tw,'#2f8f3c'));line(m.loop,tw,'#2f8f3c',true);m.exs.forEach(a=>line(a,1,'rgba(255,255,255,.7)'));line(m.loop,1,'rgba(255,255,255,.85)',true);
  line(m.dirt,tw*.8,'#9a7448',true);
  const s0=m.gs-D*m.mpp,sL=m.gs-(D-Math.min(lead,D))*m.mpp;
  if(!pre){const pts=[];for(let s=s0;s<=sL;s+=1.5)pts.push(polyAt(m.run,m.cum,s));if(pts.length>1)line(pts,tw*.8,'rgba(255,80,80,.9)');}
  const st=polyAt(m.run,m.cum,s0),gl=polyAt(m.run,m.cum,m.gs);c.fillStyle='#ff4d4d';c.beginPath();c.arc(st[0],st[1],tw*.45,0,7);c.fill();
  c.fillStyle='#ffd166';c.fillRect(gl[0]-1,gl[1]-tw,2,tw*2);
  if(!pre){const q=polyAt(m.run,m.cum,sL);c.fillStyle='#fff';c.beginPath();c.arc(q[0],q[1],tw*.6,0,7);c.fill();c.strokeStyle='#d0242c';c.lineWidth=1;c.stroke();}
  c.restore();return m.h;}
