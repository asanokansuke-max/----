/* =========================================================
   引退記念カード: 自分の馬が引退するとき、その馬の一枚を作って画像として保存できる。
   馬の絵（勝負服の騎手）・馬名・血統・通算成績・獲得賞金・主な勝ち鞍・主戦・調教師・行き先。
   保存は、共有メニュー（iPhoneは「画像を保存」）か、ダウンロード。どちらも使えないときは、画像を長押しで保存。
   引退した馬の記念カードは、あとからでも開ける（馬の詳細の「記念カード」）。
   ========================================================= */
function retireCardData(h,dest){const best=[...(h.rec||[])].sort((a,b)=>(a.pos||99)-(b.pos||99));
  const gw=(h.gw||[]).slice();const big=gw.length?[...new Set(gw)].slice(-4).reverse():best.filter(r=>r.pos===1).slice(0,3).map(r=>r.nm||r.name||'').filter(Boolean);
  return {name:h.name,sex:h.sex,coat:h.coat,by:h.by,last:Y(S.t),sire:(ST(h.sire)||{}).n||'',dam:h.damName||'',starts:h.starts||0,wins:h.wins||0,earn:h.earn||0,g1:h.g1||0,gw:gw.length,big,
    jk:h.mainJ&&P(h.mainJ)?P(h.mainJ).n:'',tr:h.trainer&&P(h.trainer)?P(h.trainer).n:'',owner:ownerName(),silks:h.silks||S.silks,dest:dest||(h.status==='繁殖'?'繁殖牝馬として牧場へ':h.status==='種牡馬'||/種牡馬/.test(dest||'')?'種牡馬として':'第二の馬生へ'),first:!!h.first};}
function retireCardCanvas(d){const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0e2a1c');g.addColorStop(.55,'#123522');g.addColorStop(1,'#0a1d13');x.fillStyle=g;x.fillRect(0,0,W,H);
  /* gold frame */
  x.strokeStyle='#c9a24a';x.lineWidth=6;x.strokeRect(36,36,W-72,H-72);x.strokeStyle='rgba(201,162,74,.45)';x.lineWidth=2;x.strokeRect(54,54,W-108,H-108);
  const serif='"Shippori Mincho B1","Hiragino Mincho ProN","Yu Mincho",serif',sans='"Zen Kaku Gothic New","Hiragino Sans","Noto Sans JP",sans-serif';
  x.textAlign='center';x.fillStyle='#d9b45a';x.font=`600 30px ${sans}`;x.fillText('T H E   L A S T   R U N',W/2,128);
  x.fillStyle='rgba(246,231,176,.8)';x.font=`500 28px ${serif}`;x.fillText('引 退 記 念',W/2,172);
  /* the picture: turf at dusk and the horse with its rider in the colours */
  const py=206,ph=470;g=x.createLinearGradient(0,py,0,py+ph);g.addColorStop(0,'#e9b87a');g.addColorStop(.45,'#f3d6a2');g.addColorStop(.46,'#6f9a4a');g.addColorStop(1,'#3f6d2c');
  x.save();x.beginPath();x.rect(90,py,W-180,ph);x.clip();x.fillStyle=g;x.fillRect(90,py,W-180,ph);
  x.fillStyle='rgba(255,240,200,.9)';x.beginPath();x.arc(W*.74,py+ph*.3,46,0,7);x.fill();
  x.fillStyle='#f4f1e8';for(let k=0;k<2;k++)x.fillRect(90,py+ph*.52+k*14,W-180,5);
  try{drawHorse(x,W/2+40,py+ph*.9,5.6,1.15,d.coat||'鹿毛',d.silks,'',true,{});}catch(e){}
  x.restore();x.strokeStyle='#c9a24a';x.lineWidth=3;x.strokeRect(90,py,W-180,ph);
  /* name */
  x.fillStyle='#fff';x.font=`800 ${d.name.length>7?78:92}px ${serif}`;x.fillText(d.name,W/2,py+ph+104);
  x.fillStyle='rgba(255,255,255,.72)';x.font=`500 28px ${sans}`;x.fillText(`${d.sex==='牝'?'牝':'牡'}・${d.coat||''}　父 ${d.sire}　母 ${d.dam}`,W/2,py+ph+150);
  x.fillStyle='#d9b45a';x.font=`600 26px ${sans}`;x.fillText(`${d.by+2}年 デビュー　—　${d.last}年 引退`,W/2,py+ph+190);
  /* record */
  const ry=py+ph+226;x.strokeStyle='rgba(201,162,74,.5)';x.lineWidth=2;x.beginPath();x.moveTo(140,ry);x.lineTo(W-140,ry);x.stroke();
  const stat=(cx,lab,val)=>{x.fillStyle='rgba(255,255,255,.6)';x.font=`500 24px ${sans}`;x.fillText(lab,cx,ry+48);x.fillStyle='#fff';x.font=`700 48px Oswald,${sans}`;x.fillText(val,cx,ry+104);};
  stat(W*.22,'通算成績',`${d.starts}戦${d.wins}勝`);stat(W*.5,'獲得賞金',yen(d.earn));stat(W*.78,'重賞勝ち',d.g1?`G1 ${d.g1}勝`:`${d.gw}勝`);
  x.fillStyle='rgba(255,255,255,.6)';x.font=`500 24px ${sans}`;x.fillText('主な勝ち鞍',W/2,ry+156);
  x.fillStyle='#f6e7b0';x.font=`700 32px ${serif}`;const bl=d.big.length?d.big.join('　'):(d.wins?'—':'勝利には届かなかったが、最後まで走り抜いた');x.fillText(bl.length>28?bl.slice(0,28)+'…':bl,W/2,ry+200);
  x.fillStyle='rgba(255,255,255,.75)';x.font=`500 26px ${sans}`;x.fillText([d.jk?`主戦 ${d.jk}`:'',d.tr?`調教師 ${d.tr}`:''].filter(Boolean).join('　／　'),W/2,ry+254);
  x.fillStyle='rgba(255,255,255,.55)';x.font=`500 24px ${sans}`;x.fillText(`馬主 ${d.owner}　｜　${d.dest}`,W/2,H-96);
  x.fillStyle='rgba(217,180,90,.7)';x.font=`600 22px ${serif}`;x.fillText('暮れのファンファーレ',W/2,H-60);
  return c;}
function retireCardOpen(d){const c=retireCardCanvas(d),url=c.toDataURL('image/png');UI.rcd={d,url};
  openModal(`<div class="from-line">引退記念カード</div><img class="rcdimg" src="${url}" alt="${esc(d.name)} 引退記念カード">
   <div class="muted" style="font-size:12px;text-align:center;margin-top:6px">保存できないときは、画像を長押しして「写真に保存」</div>
   <div class="row"><button class="btn" data-act="close">閉じる</button><span class="sp"></span><button class="btn pri" data-act="rcdSave">画像を保存</button></div>`,{wide:true});}
ACT.rcdSave=async()=>{const R=UI.rcd;if(!R)return;const fn=`${R.d.name}_引退記念.png`;
  /* inside claude.ai the page offers the file through the viewer's save prompt */
  try{if(window.claude&&typeof window.claude.use==='function'){const dl=await window.claude.use('downloads');if(dl){const blob=await (await fetch(R.url)).blob();try{await dl.save({filename:fn,data:blob});return;}catch(e){if(e&&e.code==='declined')return;}}}}catch(e){}
  try{const blob=await (await fetch(R.url)).blob();const file=new File([blob],fn,{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:`${R.d.name} 引退記念`});return;}}catch(e){if(e&&e.name==='AbortError')return;}
  try{const a=document.createElement('a');a.href=R.url;a.download=fn;document.body.appendChild(a);a.click();a.remove();toast('画像を保存しました');}catch(e){toast('画像を長押しして保存してください');}};
(function(){const st=document.createElement('style');st.textContent=`.rcdimg{display:block;width:100%;max-width:440px;margin:0 auto;border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,.35);-webkit-touch-callout:default;-webkit-user-select:auto;user-select:auto}`;document.head.appendChild(st);})();
/* on retirement: a letter offering the card */
retireHorse=(o=>function(h,how){const mine=h&&h.owner==='me'&&(h.starts||0)>0,jk0=h&&h.mainJ;const r=o.apply(this,arguments);try{if(mine){if(jk0&&!h.mainJ)h.mainJ=jk0;h.rcard=retireCardData(h,typeof r==='string'?(/種牡馬/.test(r)?'種牡馬として':/繁殖/.test(r)?'繁殖牝馬として牧場へ':/乗馬/.test(r)?'乗馬として第二の馬生へ':''):'');if(jk0)h.mainJ=null;pushEv('retireCard',{hid:h.id});}}catch(e){console.error('rcard',e);}return r;})(retireHorse);
EV.retireCard={r:d=>{const h=HZ(d.hid);if(!h||!h.rcard)return null;const c=h.rcard;return{p:'mikuni',from:'三國 透',title:`${c.name}、おつかれさま`,body:`${c.name}の引退にあたって、記念のカードを作りました。\n\n通算${c.starts}戦${c.wins}勝。${c.big.length?c.big.slice(0,2).join('、')+'。':''}\n\n…手元に、残しておいてください。`,ch:['記念カードを見る','あとで見る']};},
  f:(d,i)=>{const h=HZ(d.hid);if(i===0&&h&&h.rcard)setTimeout(()=>retireCardOpen(h.rcard),60);return i===0?'':'馬の詳細から、いつでも記念カードを開ける。';}};
ACT.rcdOpen=d=>{const h=HZ(+d.hid);if(h&&h.rcard)retireCardOpen(h.rcard);};
