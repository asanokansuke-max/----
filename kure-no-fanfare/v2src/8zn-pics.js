/* =========================================================
   自分の馬の3D写真を、ゲームのあちこちの絵に使う:
   レースのたびに3Dで撮っているゴールの写真（結果カードの絵）を、その馬の「最新の写真」として残す
   （小さく縮めて保存）。スポーツ紙の写真・朝刊一面の写真（自分の馬が本命のとき）・引退記念カードの絵は、
   写真があればそれを使い、なければこれまでの絵のまま。
   ========================================================= */
function picShrink(src,maxW,q){return new Promise(res=>{const im=new Image();im.onload=()=>{try{const k=Math.min(1,maxW/im.naturalWidth),c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);
  c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',q||.72));}catch(e){res(null);}};im.onerror=()=>res(null);im.src=src;});}
function picLoad(src){return new Promise(res=>{if(!src)return res(null);const im=new Image();im.onload=()=>res(im.naturalWidth?im:null);im.onerror=()=>res(null);im.src=src;});}
/* draw an image to fill a box (cropped to its shape) */
function picCover(c,im,x,y,w,h,fx){const r=Math.max(w/im.naturalWidth,h/im.naturalHeight),sw=w/r,sh=h/r,sx=(im.naturalWidth-sw)*(fx??.5),sy=(im.naturalHeight-sh)*.5;c.drawImage(im,sx,sy,sw,sh,x,y,w,h);}
const latestPic=()=>{const L=S.horses.filter(h=>h.owner==='me'&&h.pic).sort((a,b)=>(b.picT||0)-(a.picT||0));return L[0]||null;};
/* keep the shot on the horse it shows */
addEventListener('message',e=>{const d=e.data||{};if(d.type!=='race3d-mine'||typeof d.img!=='string'||d.img.length<4000)return;const RC=(typeof R3D!=='undefined'&&R3D&&R3D.RC)||UI.shotRC||UI.race;if(!RC)return;
  const f=(RC.field||[]).find(x=>x.mine&&(d.no==null||x.no===d.no))||(RC.field||[]).find(x=>x.mine);const h=f&&f.h;if(!h)return;
  picShrink(d.img,520,.74).then(u=>{if(u){h.pic=u;h.picT=S.t;h.picWon=!!d.won;try{save();}catch(x){}}});});
/* スポーツ紙: the winner's photo, halftoned like newsprint */
ACT.pressOpen=(o=>function(){const r=o.apply(this,arguments);try{const RC=UI.race,w=RC&&RC.order&&RC.order[0],h=w&&w.h;const src=(h&&h.pic)||RC.mineShot;if(src)picLoad(src).then(im=>{const cv=$('#ypc');if(!im||!cv)return;const c=cv.getContext('2d'),dpr=window.devicePixelRatio||1,W=cv.width/dpr,H=cv.height/dpr;c.save();c.setTransform(dpr,0,0,dpr,0,0);
  picCover(c,im,0,0,W,H,.55);c.globalCompositeOperation='saturation';c.fillStyle='rgba(128,128,128,.55)';c.fillRect(0,0,W,H);c.globalCompositeOperation='multiply';c.fillStyle='rgba(120,110,95,.25)';for(let y=0;y<H;y+=3)for(let x=(y/3%2)*1.5;x<W;x+=3){c.beginPath();c.arc(x,y,.55,0,7);c.fill();}c.restore();});}catch(e){}return r;})(ACT.pressOpen);
/* 朝刊一面: when the ◎ is your horse and it has a photo */
drawFrontPhoto=(o=>function(){const r=o.apply(this,arguments);try{const RC=UI.race,F=RC.field,d=paperData(RC),h1=F[d.marks.findIndex(x=>x[0]==='◎')];const h=h1&&h1.mine&&h1.h;if(h&&h.pic)picLoad(h.pic).then(im=>{const cv=$('#fpphoto');if(!im||!cv)return;const c=cv.getContext('2d');c.save();c.setTransform(1,0,0,1,0,0);
  picCover(c,im,0,0,cv.width,cv.height,.62);c.globalCompositeOperation='multiply';c.fillStyle='rgba(180,160,130,.25)';c.fillRect(0,0,cv.width,cv.height);c.restore();});}catch(e){}return r;})(drawFrontPhoto);
/* 月替わり: keeps its own seasonal picture (the race photo there read as the result screen coming back) */
/* 引退記念カード: the horse's own photo in the picture frame */
retireCardData=(o=>function(h,dest){const d=o.apply(this,arguments);try{if(h&&h.pic)d.pic=h.pic;}catch(e){}return d;})(retireCardData);
retireCardOpen=(o=>function(d){if(!d||!d.pic)return o.apply(this,arguments);picLoad(d.pic).then(im=>{if(!im){const dd={...d};delete dd.pic;return o.call(this,dd);}
  const c0=retireCardCanvas;retireCardCanvas=function(dd){const c=c0(dd),x=c.getContext('2d'),W=c.width,py=206,ph=470;x.save();x.beginPath();x.rect(90,py,W-180,ph);x.clip();picCover(x,im,90,py,W-180,ph,.55);
    const g=x.createLinearGradient(0,py+ph*.6,0,py+ph);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.35)');x.fillStyle=g;x.fillRect(90,py,W-180,ph);x.restore();x.strokeStyle='#c9a24a';x.lineWidth=3;x.strokeRect(90,py,W-180,ph);return c;};
  try{o.call(this,d);}finally{retireCardCanvas=c0;}});})(retireCardOpen);
