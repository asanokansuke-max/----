/* =========================================================
   本物に近づける（その2）:
   ・連戦の疲れ: 続けて走るほど、ひと月では抜けない疲れがたまる（4戦続けると目に見えて重くなり、調子も落ちやすく、故障もしやすい）。
     放牧に出すか、ひと月あけるとだんだん抜ける。調教師に任せていれば、たまってきたら放牧に出す。自分で使うときは、たまってくると調教師が知らせる
   ・出走手当: 着順に関係なく、走るたびに出走手当（40万円、障害は50万円）が入る
   ・セリの予想価格が0円になる馬を直す
   ========================================================= */
applyRace=(o=>function(RC){const mineF=(RC&&RC.order||[]).filter(f=>f.mine&&f.h);const r=o.apply(this,arguments);
  try{let n=0;mineF.forEach(f=>{const h=f.h;n++;const al=RC.race.jump?50:40;S.money+=al;if(S.rep){S.rep.prize+=al;}
      h.wear=(h.wear||0)+1;if(h.wear>=4){h.fat=Math.min(100,(h.fat||0)+8+(h.wear-4)*5);if(R()<.35)h.cond=Math.max(1,(h.cond||3)-1);}
      if(h.wear>=4&&h.mode!=='omakase'&&!h.wearWarned){h.wearWarned=1;pushEv('wearWarn',{hid:h.id});}});
    if(n&&S.rep&&S.rep.lines)S.rep.lines.push(`出走手当 ${n}頭分（${yen(n*(RC.race.jump?50:40))}）`);}catch(e){console.error('wear',e);}return r;})(applyRace);
tickHorse=(o=>function(h,isMine){const r=o.apply(this,arguments);try{if(isMine&&h.wear){if(h.status==='放牧'||h.status==='休養')h.wear=Math.max(0,h.wear-2);else if(h.last==null||h.last<S.t-1)h.wear=Math.max(0,h.wear-.6);if(h.wear<3)h.wearWarned=0;}}catch(e){}return r;})(tickHorse);
injuryRoll=(o=>function(h,mult){return o.call(this,h,(mult==null?1:mult)*(1+Math.min(.6,Math.max(0,(h.wear||0)-3)*.2)));})(injuryRoll);
planOmakase=(o=>function(only){const r=o.apply(this,arguments);try{for(const h of (only||racing()).filter(h=>h.mode==='omakase'&&h.status==='現役')){const od=S.month.orders[h.id];
    if((h.wear||0)>=4&&!(od&&od.type==='race'&&od.race&&od.race.grade==='G1')){S.month.orders[h.id]={type:'rest',by:'trainer'};if(S.month.orders2)delete S.month.orders2[h.id];}}}catch(e){}return r;})(planOmakase);
EV.wearWarn={r:d=>{const h=HZ(d.hid);if(!h||h.status!=='現役')return null;const tn=P(h.trainer)?P(h.trainer).n.split(' ')[0]:'調教師';
  return{p:h.trainer,from:who(h.trainer),title:`${h.name}、連戦の疲れ`,body:TQ(h.trainer,'wear',{h:h.name}),ch:['「放牧に出そう」','「次のレースまでは使う」']};},
  f:(d,i)=>{const h=HZ(d.hid);if(!h)return '';if(i===0){S.month.orders[h.id]={type:'rest'};if(S.month.orders2)delete S.month.orders2[h.id];trust(h.trainer,2);return `「${TQ(h.trainer,'wearYes')}」\n\n${h.name}は、今月は放牧に出る。`;}trust(h.trainer,-1);return `「${TQ(h.trainer,'wearNo')}」`;}};
hCard=(o=>function(h){let s=o.apply(this,arguments);try{if(h.status==='現役'&&(h.wear||0)>=3){s=s.replace('<div class="row" style="gap:6px;margin-top:4px">',`<div class="row" style="gap:6px;margin-top:4px"><span class="chip ${h.wear>=4?'bad':'warn'}">連戦の疲れ${h.wear>=4?'・大':''}</span>`);}}catch(e){}return s;})(hCard);
/* セリ: the lowest estimate is never below a few hundred */
makeSale=(o=>function(kind){const s=o.apply(this,arguments);try{s.lots.forEach(l=>{const fl=kind==='セレクトセール'?600:200;if(!(l.lo>=fl))l.lo=fl;if(!(l.hi>l.lo))l.hi=roundInc(l.lo*1.8)||l.lo*2;});}catch(e){}return s;})(makeSale);
