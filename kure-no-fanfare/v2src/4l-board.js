/* =========================================================
   場内の電光掲示板: the first place you see the result.
   left: the goal-cam still on the big screen, right: 着順・着差・タイム, then 確定 lights up
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
.board-pair{display:grid;grid-template-columns:1fr minmax(0,50%);gap:10px;align-items:end;margin-bottom:22px}
.bview canvas{display:block;width:100%;border-radius:4px;box-shadow:0 0 0 3px #2b2f33}
.bboard canvas{display:block;width:100%}
.bview{position:relative}.bview::after{content:"ターフビジョン";position:absolute;left:0;right:0;bottom:-18px;text-align:center;font-size:10px;color:var(--muted)}
.board-cap{font-size:13px;color:var(--muted);text-align:center;margin-top:-4px}
`;document.head.appendChild(st);})();
function marginSeg(m){return String(m||'').replace('･',' ').replace('1/2','½').replace('3/4','¾').replace('1/4','¼');}
function showBoard(){
  const RC=UI.race;if(!RC||RC.applied){showResult();return;}
  if(!RC.watched){showResult();return;}
  const r=RC.race;
  openModal(`<div class="from-line">${dstr(S.t)}　${esc(r.course)}競馬場　${RC.tv?'テレビ中継':'場内'}</div>${raceHead(r)}
    <div class="board-pair"><div class="bview"><canvas id="bview" aria-label="ターフビジョンのリプレイ"></canvas></div><div class="bboard"><canvas id="board" aria-label="場内の着順掲示板"></canvas></div></div>
    <div class="board-cap" id="boardcap">${RC.photo?'写真判定中…　場内がざわめいている':'掲示板に着順が灯る…'}</div>
    <div class="row"><span class="sp"></span><button class="btn pri" data-act="boardNext" id="boardnext" disabled>払戻金・結果へ</button></div>`,{wide:true,lock:true});
  boardAnim();
}
ACT.boardNext=()=>{UI.race.boardDone=true;showResult();};
/* LED dot-matrix text: render the string small, then light one LED per pixel */
const LEDC={};
const G57={'0':['01110','10001','10011','10101','11001','10001','01110'],'1':['00100','01100','00100','00100','00100','00100','01110'],'2':['01110','10001','00001','00010','00100','01000','11111'],'3':['11111','00010','00100','00010','00001','10001','01110'],'4':['00010','00110','01010','10010','11111','00010','00010'],'5':['11111','10000','11110','00001','00001','10001','01110'],'6':['00110','01000','10000','11110','10001','10001','01110'],'7':['11111','00001','00010','00100','01000','01000','01000'],'8':['01110','10001','10001','01110','10001','10001','01110'],'9':['01110','10001','10001','01111','00001','00010','01100'],'.':['00','00','00','00','00','11','11'],'/':['00001','00010','00010','00100','01000','01000','10000'],' ':['000','000','000','000','000','000','000'],'R':['11110','10001','10001','11110','10100','10010','10001'],'F':['11111','10000','10000','11110','10000','10000','10000']};
function ledMask(str,rows,bold){
  if(/^[0-9.\/ RF]+$/.test(str)){const key='g|'+str;if(LEDC[key])return LEDC[key];const m=[[],[],[],[],[],[],[]];
    [...str].forEach((ch,i)=>{const g=G57[ch];for(let yy=0;yy<7;yy++){if(i)m[yy].push(0);for(const b of g[yy])m[yy].push(b==='1'?1:0);}});
    const z=()=>Array(m[0].length).fill(0);m.unshift(z());m.push(z(),z());return LEDC[key]={m,w:m[0].length,h:10};}
  rows=Math.max(rows,12);
const key=str+'|'+rows+'|'+bold;if(LEDC[key])return LEDC[key];
  const o=document.createElement('canvas'),x=o.getContext('2d');x.font=`${bold?900:700} ${rows}px "Zen Kaku Gothic New","Oswald",sans-serif`;const w=Math.ceil(x.measureText(str).width)+2;o.width=w;o.height=rows+2;
  x.font=`${bold?900:700} ${rows}px "Zen Kaku Gothic New","Oswald",sans-serif`;x.textBaseline='top';x.fillStyle='#fff';x.fillText(str,1,1);
  const d=x.getImageData(0,0,w,rows+2).data,m=[];for(let yy=0;yy<rows+2;yy++){const r=[];for(let xx=0;xx<w;xx++)r.push(d[(yy*w+xx)*4+3]>110?1:0);m.push(r);}
  return LEDC[key]={m,w,h:rows+2};}
function ledText(c,str,x,y,h,col,align,rows=10,dim=true){const mk=ledMask(str,rows,true),p=h/mk.h,r=p*.36,W=mk.w*p;let x0=align==='right'?x-W:align==='center'?x-W/2:x;
  for(let yy=0;yy<mk.h;yy++)for(let xx=0;xx<mk.w;xx++){const on=mk.m[yy][xx];if(!on&&!dim)continue;c.fillStyle=on?col:'rgba(255,255,255,.035)';c.beginPath();c.arc(x0+xx*p+p/2,y+yy*p+p/2,on?r*1.12:r*.8,0,7);c.fill();}
  return W;}
function ledGrid(c,x,y,w,h,p){c.fillStyle='rgba(255,255,255,.028)';for(let yy=y+p/2;yy<y+h;yy+=p)for(let xx=x+p/2;xx<x+w;xx+=p){c.fillRect(xx-.6,yy-.6,1.2,1.2);}}
/* 7-segment digits like the real result board */
const SEGS={'0':'abcdef','1':'bc','2':'abged','3':'abgcd','4':'fgbc','5':'afgcd','6':'afgedc','7':'abc','8':'abcdefg','9':'abcdfg','-':'g',' ':''};
const LEDP={};
function ledPat(c,col,pitch){const dpr=window.devicePixelRatio||1,pp=Math.max(2,Math.round(pitch*dpr)),key=col+'|'+pp;if(LEDP[key])return LEDP[key];
  const o=document.createElement('canvas');o.width=o.height=pp;const x=o.getContext('2d');x.fillStyle=col;x.beginPath();x.arc(pp/2,pp/2,pp*.47,0,7);x.fill();
  const pat=c.createPattern(o,'repeat');if(pat.setTransform)pat.setTransform(new DOMMatrix().scale(1/dpr));return LEDP[key]=pat;}
function seg7(c,ch,x,y,w,h,col,dim){const t=Math.max(1.6,w*.17),g=t*.12,hh=h/2,on=SEGS[ch]||'';
  const P={a:[[x+g+t*.5,y],[x+w-g-t*.5,y],[x+w-g-t,y+t],[x+g+t,y+t]],
    d:[[x+g+t,y+h-t],[x+w-g-t,y+h-t],[x+w-g-t*.5,y+h],[x+g+t*.5,y+h]],
    g:[[x+g+t*.6,y+hh],[x+g+t,y+hh-t/2],[x+w-g-t,y+hh-t/2],[x+w-g-t*.6,y+hh],[x+w-g-t,y+hh+t/2],[x+g+t,y+hh+t/2]],
    f:[[x,y+g+t*.5],[x+t,y+g+t],[x+t,y+hh-g-t*.5],[x,y+hh-g]],e:[[x,y+hh+g],[x+t,y+hh+g+t*.5],[x+t,y+h-g-t],[x,y+h-g-t*.5]],
    b:[[x+w,y+g+t*.5],[x+w,y+hh-g],[x+w-t,y+hh-g-t*.5],[x+w-t,y+g+t]],c:[[x+w,y+hh+g],[x+w,y+h-g-t*.5],[x+w-t,y+h-g-t],[x+w-t,y+hh+g+t*.5]]};
  const pitch=Math.max(1.5,h/19);for(const k in P){const lit=on.includes(k);if(!lit&&!dim)continue;c.fillStyle=lit?ledPat(c,col,pitch):ledPat(c,'rgba(255,174,58,.045)',pitch);c.beginPath();P[k].forEach(([px,py],i)=>i?c.lineTo(px,py):c.moveTo(px,py));c.closePath();c.fill();}}
/* a run of digits ('.' becomes a dot); returns the width used */
function seg7s(c,str,x,y,h,col,dim,align,wr=.52){const w=h*wr,gap=h*.14,dot=h*.16;let W=0;for(const ch of str)W+=ch==='.'?dot+gap:w+gap;W-=gap;let cx=align==='right'?x-W:align==='center'?x-W/2:x;
  const x0=cx;c.save();c.shadowColor=col;c.shadowBlur=h*.25;for(const ch of str){if(ch==='.'){c.fillStyle=ledPat(c,col,Math.max(1.6,h/15));c.fillRect(cx,y+h-dot,dot,dot);cx+=dot+gap;}else{seg7(c,ch,cx,y,w,h,col,dim);cx+=w+gap;}}c.restore();return W;}
/* Ⅰ〜Ⅴ the way the board shows them: strokes joined by a bar on top and bottom */
function roman(c,n,cx,cy,s,col){// the numeral characters themselves (Ⅰ〜Ⅴ) in a Japanese serif face: the bars are part of the glyph
  c.save();c.fillStyle=col;c.font=`700 ${s*1.15}px "BIZ UDPGothic","MS Gothic",sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText('ⅠⅡⅢⅣⅤ'[n-1],cx,cy+s*.05);c.restore();}
/* the real board's number slot: a narrow 'one' bar for the tens (fields never exceed 18) + one full digit */
function slotDims(h){const w=h*.66,t=Math.max(1.6,w*.17);return {w,t,gap:h*.28,pad:h*.12,W:h*.12*2+t+h*.28+w};}
function numSlot(c,no,x,y,h,col){const d=slotDims(h),ghost='rgba(255,159,28,.05)',pitch=Math.max(1.5,h/19);
  const bx=x+d.pad,tens=no>=10,g=d.t*.12,hh=h/2;
  c.save();c.shadowColor=col;c.shadowBlur=tens?h*.25:0;c.fillStyle=ledPat(c,tens?col:ghost,pitch);
  [[[bx,y+g+d.t*.3],[bx+d.t,y+g],[bx+d.t,y+hh-g],[bx,y+hh-g-d.t*.3]],[[bx,y+hh+g+d.t*.3],[bx+d.t,y+hh+g],[bx+d.t,y+h-g],[bx,y+h-g-d.t*.3]]].forEach(P=>{c.beginPath();P.forEach(([px,py],i)=>i?c.lineTo(px,py):c.moveTo(px,py));c.closePath();c.fill();});
  c.restore();
  seg7s(c,no==null?'8':String(no%10),bx+d.t+d.gap,y,h,no==null?ghost:col,1,'left',.66);}
/* text that fills its cell: drawn smooth at full resolution, then cut into fine LED dots (no blocky glyphs) */
const FLC={};let BSQ=1;
function fitLed(c,txt,x,y,w,h,col){const dpr=window.devicePixelRatio||1,pw=Math.max(4,Math.round(w*BSQ*dpr)),ph=Math.max(4,Math.round(h*dpr)),key=[txt,pw,ph,col].join('|');
  let o=FLC[key];
  if(!o){o=document.createElement('canvas');o.width=pw;o.height=ph;const x2=o.getContext('2d');
    let fs=ph*.92;x2.font=`900 ${fs}px "Zen Kaku Gothic New",sans-serif`;const mw=x2.measureText(txt).width;if(mw>pw*.94)fs*=pw*.94/mw;
    x2.font=`900 ${fs}px "Zen Kaku Gothic New",sans-serif`;x2.textAlign='center';x2.textBaseline='middle';x2.fillStyle=col;x2.fillText(txt,pw/2,ph/2+fs*.05);
    const pp=Math.max(2,Math.round(fs/13)),dc=document.createElement('canvas');dc.width=dc.height=pp;const dx=dc.getContext('2d');dx.fillStyle='#000';dx.beginPath();dx.arc(pp/2,pp/2,pp*.46,0,7);dx.fill();
    x2.globalCompositeOperation='destination-in';x2.fillStyle=x2.createPattern(dc,'repeat');x2.fillRect(0,0,pw,ph);FLC[key]=o;}
  c.save();c.shadowColor=col;c.shadowBlur=h*.18;c.drawImage(o,x,y,w,h);c.restore();}
function boardAnim(){
  const RC=UI.race,cv=$('#board'),vv=$('#bview');if(!cv)return;const c=cv.getContext('2d'),dpr=window.devicePixelRatio||1;
  const ord=RC.order,r=RC.race,t0=performance.now(),wait=1300,per=420;
  /* 写真判定: the places that were clear light up first; the two in the photo wait until the print is read */
  const pk=RC.photo?(RC.photoK||0):-1,photoEnd=pk>=0?wait+5*per+4800:0,pend=i=>pk>=0&&(i===pk||i===pk+1);
  const onAt=i=>pend(i)?photoEnd+(i-pk)*per:wait+i*per;
  if(RC.inq==null){RC.inq=R()<.08;RC.inqK=Math.floor(R()*3);RC.inqDemote=RC.inq&&R()<.3;}
  const allOn=Math.max(wait+5*per,photoEnd+2*per),inqEnd=allOn+4200,conf=RC.inq?inqEnd+900:allOn+800;let lit=false;
  // ---- the board: a tall panel laid out like the real one (units of 1/100 of its width)
  const SQ=1,SQY=.76;BSQ=SQ;const CW=cv.clientWidth,BW=CW/SQ,BH=Math.round(BW*1.66),u=BW/100;cv.width=CW*dpr;cv.height=Math.round(BH*SQY)*dpr;cv.style.height=Math.round(BH*SQY)+'px';c.scale(dpr*SQ,dpr*SQY);   // a squatter board than before (it read too tall and thin)   // drawn on a wider grid, then squeezed: a slimmer board like the real one
  // ---- the turf vision next to it: same height, replay of the finish
  let v=null,VW=0,VH=0;if(vv){v=vv.getContext('2d');VW=vv.clientWidth;VH=Math.min(Math.round(BH*SQY),Math.round(VW*1.1));vv.width=VW*dpr;vv.height=VH*dpr;vv.style.height=VH+'px';v.scale(dpr,dpr);}
  const OR='#ff9f1c',CELL='#202020',WH='#f6f6f2',BLUE='#2367d8';
  const romans=['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ'];
  const going=(r.going||'良'),gShort=going;
  const t=RC.time,timeS=`${Math.floor(t/60)}.${(t%60).toFixed(1).padStart(4,'0')}`;
  const f3=(r.surf==='ダ'?36.4:34.6)+(70-(r.mean||70))*.03+(hash(r.name+S.t)-.5)*1.2,f4=f3+(r.surf==='ダ'?12.4:11.8)+(hash(r.name+'4f')-.5)*.6;
  const cn=(({ロンシャン:'パリ',シャティン:'香港',メイダン:'ドバイ'})[r.course]||r.course).split('');
  const jp=(txt,x,y,sz,col,al='center',w=700)=>{c.fillStyle=col;c.font=`${w} ${sz}px "Zen Kaku Gothic New",sans-serif`;c.textAlign=al;c.fillText(txt,x,y);};
  const glowText=(txt,x,y,h,al,rows=13)=>{c.save();c.shadowColor=OR;c.shadowBlur=h*.25;ledText(c,txt,x,y,h,OR,al,rows,false);c.restore();};
  const loop=now=>{if(!document.getElementById('board'))return;const a=now-t0;
    // frame + black face
    c.fillStyle='#a2a2a2';c.fillRect(0,0,BW,BH);c.fillStyle='#000';c.fillRect(u*3,u*3,BW-u*6,BH-u*6);
    // header: 東/京 stacked, [11] R, 確定
    {const k=Math.ceil(cn.length/2),l1=cn.slice(0,k).join(''),l2=cn.slice(k).join(''),fs=u*10*Math.min(1,2/Math.max(l1.length,l2.length,1));jp(l1,u*12,u*14,fs,WH,'center',500);jp(l2,u*12,u*25,fs,WH,'center',500);}
    {const h=u*15,d=slotDims(h);c.fillStyle=CELL;c.fillRect(u*21,u*6.5,d.W,u*18);numSlot(c,r.g?11:9,u*21,u*8,h,OR);var hdrEnd=u*21+d.W;}
    c.fillStyle=WH;c.font=`600 ${u*9}px Oswald,sans-serif`;c.textAlign='left';c.fillText('R',hdrEnd+u*1.5,u*24);
    const confirmed=a>=conf;
    c.fillStyle=confirmed?'#e33a2c':'#151515';c.fillRect(u*53,u*7,u*42,u*19);if(confirmed){c.save();c.shadowColor='rgba(255,255,255,.6)';c.shadowBlur=u*1.5;jp('確定',u*74,u*22.5,u*15.5,'#fff','center',500);c.restore();}
    if(confirmed&&!lit){lit=true;try{sKakutei();}catch(e){}const bn=$('#boardnext');if(bn)bn.disabled=false;const cp=$('#boardcap');if(cp&&!RC.inq)cp.textContent=`確定。${ord[0].mine?'場内から大きな拍手が湧いた。':'場内に、ため息と歓声が入り混じる。'}`;}
    // Ⅰ〜Ⅴ: blue disc, number cell; between rows a chevron and the margin cell
    for(let i=0;i<5;i++){const y=u*31+i*u*16.2,f=ord[i];if(!f)break;
      c.fillStyle=BLUE;c.beginPath();c.ellipse(u*11.5,y+u*6.5,u*6.4/SQ*SQ+u*6.4*(1/SQ-1),u*6.4,0,0,7);c.fill();c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=u*.5;c.stroke();
      c.save();c.translate(u*11.5,0);c.scale(1/SQ,1);roman(c,i+1,0,y+u*6.5,u*7.6,'#fff');c.restore();
      const sd=slotDims(u*11.5);c.fillStyle=CELL;c.fillRect(u*21,y,sd.W,u*13.5);
      const on=a>onAt(i),blink=on&&a<onAt(i)+300&&Math.floor(a/80)%2;
      numSlot(c,on&&!blink?f.no:null,u*21,y+u*1,u*11.5,f.mine?'#ffe14d':OR);
      if(i<4&&ord[i+1]){const my=y+u*9.5;
        c.strokeStyle='#3b3b3b';c.lineWidth=u*1.6;c.lineJoin='miter';c.beginPath();const chx=u*21+sd.W+u*4;c.moveTo(chx,my);c.lineTo(chx+u*7,my+u*4);c.lineTo(chx,my+u*8);c.stroke();
        const mw=u*17,mh=u*9.5;c.fillStyle=CELL;c.fillRect(chx+u*10,my-u*.8,mw,mh);
        if(a>Math.max(onAt(i),onAt(i+1))){const mg=marginSeg(String(ord[i+1].margin).replace('･','')).replace(' ','');fitLed(c,mg,chx+u*10,my-u*.8,mw,mh,OR);}}}
    // bottom: 芝 / ダート going, spare lamp, タイム 4F 3F
    jp('芝',u*17,u*118,u*8.4,WH,'center',500);
    c.fillStyle=CELL;c.fillRect(u*4,u*120,u*26,u*15);if(r.surf!=='ダ')fitLed(c,gShort,u*4,u*120,u*26,u*15,OR);
    jp('ダート',u*17,u*145,u*7.6,WH,'center',500);
    c.fillStyle=CELL;c.fillRect(u*4,u*147,u*26,u*15);fitLed(c,r.surf==='ダ'?gShort:(going==='良'?'良':going==='不良'?'重':going),u*4,u*147,u*26,u*15,OR);
    const ph=pk>=0&&a<photoEnd&&Math.floor(a/450)%2===0;if(pk>=0&&a>=photoEnd&&!RC.photoMsg){RC.photoMsg=1;const cp=$('#boardcap');if(cp)cp.textContent=`写真判定の結果、${ord[pk].no}番 ${ord[pk].name}が${ord[pk+1].margin}差で${pk+1}着。`;}c.fillStyle=ph?'#d9a400':CELL;c.fillRect(u*57,u*110,u*25,u*9);if(ph)jp('写真',u*69.5,u*117.5,u*7,'#000','center',900);
    if(RC.inq){const on=a>allOn&&a<inqEnd&&Math.floor(a/500)%2===0;if(a>allOn&&a<inqEnd){c.fillStyle=on?'#1f5fd1':CELL;c.fillRect(u*57,u*110,u*25,u*9);if(on)jp('審議',u*69.5,u*117.5,u*7,'#fff','center',900);const cp=$('#boardcap');if(cp&&!RC.inqMsg){RC.inqMsg=1;cp.textContent='審議ランプが点灯。直線で斜行があったようだ…';}}
      if(a>=inqEnd&&!RC.inqDone){RC.inqDone=1;const k=RC.inqK;if(ord[k+1]&&ord[k+1].gapL-ord[k].gapL>1.5)RC.inqDemote=false;if(RC.inqDemote&&ord[k+1]){const A=ord[k],B=ord[k+1],m1=A.margin,m2=B.margin;ord[k]=B;ord[k+1]=A;B.pos=k+1;A.pos=k+2;B.margin=m1;A.margin=m2;A.ev='降着';const g=B.gapL;B.gapL=A.gapL;A.gapL=g;}
        const cp=$('#boardcap');if(cp)cp.textContent=RC.inqDemote?`審議の結果、${ord[k+1].no}番 ${ord[k+1].name}は${k+2}着に降着。`:'審議の結果、着順通り確定。';}}
    jp('タイム',u*42,u*131,u*6.2,WH,'center',500);jp('4F',u*46,u*146,u*6.2,WH,'center',500);jp('3F',u*46,u*160,u*6.2,WH,'center',500);
    if(a>wait+5*per){seg7s(c,timeS,u*96,u*121.5,u*11,OR,1,'right',.6);seg7s(c,f4.toFixed(1),u*96,u*136.5,u*11,OR,1,'right',.6);seg7s(c,f3.toFixed(1),u*96,u*150.5,u*11,OR,1,'right',.6);}
    else{['8.88.8','88.8','88.8'].forEach((g,k)=>seg7s(c,g,u*96,u*(121.5+k*15),u*11,'rgba(255,159,28,.07)',1,'right',.6));}
    // turf vision: the replay of the finish
    if(v){v.fillStyle='#111';v.fillRect(0,0,VW,VH);const g=RC.goalShot;
      if(g&&g.full){const gw=g.cv.width,gh=g.cv.height*.84,gy=g.cv.height*.08,sa=gw/gh,da=VW/VH;let cw=gw,ch=gh,cx=0,cy=gy;if(sa>da){cw=gh*da;cx=(gw-cw)/2;}else{ch=gw/da;cy=gy+(gh-ch)/2;}v.drawImage(g.cv,cx,cy,cw,ch,0,0,VW,VH);}
      else{v.fillStyle='#0f3a24';v.fillRect(0,0,VW,VH);}
      v.fillStyle='rgba(0,0,0,.09)';for(let yy=0;yy<VH;yy+=3)v.fillRect(0,yy,VW,1);
      v.fillStyle='#e0262d';v.fillRect(6,6,58,18);v.fillStyle='#fff';v.font='bold 11px sans-serif';v.textAlign='center';v.fillText('リプレイ',35,19);
      v.fillStyle='rgba(0,0,0,.75)';v.fillRect(0,VH-26,VW,26);v.textAlign='left';v.fillStyle='#ffd166';v.font=`bold ${Math.min(13,VW/(ord[0].name.length+4))}px sans-serif`;v.fillText(`${ord[0].no} ${ord[0].name}`,6,VH-9);}
    requestAnimationFrame(loop);};
  requestAnimationFrame(loop);
}
