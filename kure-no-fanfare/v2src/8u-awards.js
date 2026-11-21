/* =========================================================
   表彰・人・馬券:
   ・JRA賞 — every January the previous year's champions are named (年度代表馬 and the categories); your horses can win them
   ・世代交代 — veteran riders hang up their boots (a farewell), and rookies come in
   ・枠連 — on the tote alongside the others
   ・WIN5 — pick the winners of five designated races in the month; paid next month
   ========================================================= */
/* ---- JRA賞 ---- */
const AWD=[['nendo','年度代表馬'],['y2c','最優秀2歳牡馬'],['y2f','最優秀2歳牝馬'],['y3c','最優秀3歳牡馬'],['y3f','最優秀3歳牝馬'],['oc','最優秀4歳以上牡馬'],['of','最優秀4歳以上牝馬'],['sp','最優秀短距離馬'],['dt','最優秀ダートホース'],['jp','最優秀障害馬']];
function awardYear(y){const out={};const score=h=>{let s=0;(h.rec||[]).forEach(r=>{if(Y(r.t)!==y)return;if(r.pos===1)s+=r.gr==='G1'?(['有馬記念','ジャパンカップ','天皇賞（秋）','日本ダービー'].includes(r.n)?14:10):r.gr==='G2'?3:r.gr==='G3'?2:/^J・G1/.test(r.gr||'')?8:.5;else if(r.pos<=3&&r.gr==='G1')s+=2;});return s;};
  const cand=mine().filter(h=>h.rec&&h.rec.some(r=>Y(r.t)===y));const cat=h=>{const a=ageOf(h)-(Y(S.t)-y),sx=h.sex==='牝'?'f':'c',rs=(h.rec||[]).filter(r=>Y(r.t)===y);
    if(rs.some(r=>/^J・/.test(r.gr||'')||r.n.includes('障害')))return 'jp';if(rs.length&&rs.every(r=>r.s==='ダ'))return 'dt';if(rs.length&&rs.every(r=>r.d<=1400))return 'sp';return a<=2?'y2'+sx:a===3?'y3'+sx:'o'+sx;};
  cand.forEach(h=>{const s=score(h);if(s<8)return;const k=cat(h);if(!out[k]||out[k].s<s)out[k]={h,s};});
  const best=Object.values(out).sort((a,b)=>b.s-a.s)[0];if(best&&best.s>=20)out.nendo={h:best.h,s:best.s};return out;}
newYear=(o=>function(){const r=o.apply(this,arguments);try{const py=Y(S.t)-1;if(S.t-S.startT>=11){const a=awardYear(py);const list=AWD.map(([k,n])=>{const x=a[k];return {k,n,mine:!!x,name:x?x.h.name:(()=>{let nm=makeName();for(let t=0;t<8&&/牡馬|代表/.test(n)&&/クイーン|レディ|ヒメ|プリンセス|ガール/.test(nm);t++)nm=makeName();for(let t=0;t<8&&/牝馬/.test(n)&&/キング|ボーイ|オー$/.test(nm);t++)nm=makeName();return nm;})(),hid:x?x.h.id:null};});
  pushEv('jraAward',{y:py,list});}}catch(e){console.error('award',e);}return r;})(newYear);
EV.jraAward={r:d=>{const mineW=d.list.filter(x=>x.mine);return{p:'mikuni',from:'JRA賞 授賞式',title:`${d.y}年度 JRA賞`,body:`${d.y}年度のJRA賞が発表されました。\n\n${d.list.map(x=>`${x.n}　${x.name}${x.mine?'　◀ あなたの馬':''}`).join('\n')}\n\n${mineW.length?`三國「${mineW.map(x=>x.name).join('、')}が選ばれました。…授賞式、行きましょう。スーツは新調してあります」`:'三國「来年は、この中にうちの馬の名前を入れましょう」'}`,ch:[mineW.length?'授賞式に出る':'わかった']};},
  f:d=>{const m=d.list.filter(x=>x.mine);if(!m.length)return '';m.forEach(x=>{const h=HZ(x.hid);if(h){h.fans=(h.fans||0)+(x.k==='nendo'?40000:15000);h.awards=(h.awards||[]).concat(`${d.y}年${x.n}`);}});
    S.fame+=m.some(x=>x.k==='nendo')?6:3;log(`${d.y}年度JRA賞：${m.map(x=>`${x.name}（${x.n}）`).join('、')}`);
    const nd=m.find(x=>x.k==='nendo');return nd?`壇上で、${nd.name}の名前が読み上げられた。会場が拍手に包まれる。\n\nあの日、父と見た有馬記念から、ここまで来た。`:`授賞式の会場で、${m[0].name}の名前が呼ばれた。トロフィーは思ったより重かった。`;}};
/* ---- 世代交代: veteran riders retire (with a farewell), rookies arrive ---- */
const RETIRE_PLAN=[['kuroiwa',5,'「三十年、夏の北海道で乗ってきた。最後に、あんたの馬に乗れてよかったべ」'],['oba',7,'「前に行く馬しか乗らん男やったけど、悔いはないわ。…ほな、達者でな」'],['kido',9,'「崩れない騎手でいられたのは、乗せてくれる人がいたからです。ありがとうございました」']];
newYear=(o=>function(){const r=o.apply(this,arguments);try{const yn=Math.floor((S.t-S.startT)/12);RETIRE_PLAN.forEach(([id,yr,line])=>{const j=JK(id);if(j&&!j.retired&&yn>=yr&&P(id)&&P(id).met){pushEv('jkRetire',{id,line});}});
  news(`新人騎手${pick(['6','7','8','9'])}名がデビュー。競馬学校の卒業生たち`);}catch(e){}return r;})(newYear);
EV.jkRetire={r:d=>({p:d.id,from:who(d.id),title:'引退します',body:`${P(d.id).n}騎手が、今年いっぱいで…いえ、この春で鞭を置くことになりました。\n\n${d.line}\n\n最終騎乗の日、検量室の前には花束を持った人の列ができていた。`,ch:['花束を渡しに行く','手紙を書く']}),
  f:(d,i)=>{const j=JK(d.id);if(j){j.retired=1;}S.horses.forEach(h=>{if(h.mainJ===d.id)h.mainJ=null;});trust(d.id,6);log(`${P(d.id).n}騎手が引退`);news(`${P(d.id).n}騎手が引退。長い間、お疲れさまでした`);
    return i===0?`花束を渡すと、${P(d.id).n.split(' ')[0]}さんは少し照れて笑った。「…ありがとう。大事にします」`:'手紙は、翌週、丁寧な礼状になって返ってきた。';}};
jockeyAway=(o=>function(id){const j=JK(id);if(j&&j.retired)return true;return o.apply(this,arguments);})(jockeyAway);
jockeysAvail=(o=>function(){return o.apply(this,arguments).filter(id=>!(JK(id)&&JK(id).retired));})(jockeysAvail);
/* ---- 枠連 on the tote ---- */
BK_TYPES.splice(2,0,{k:'waku',n:'枠連',need:2});
bkKey=(o=>function(type,c){if(type==='waku'){const s=[...c].sort((a,b)=>a-b);return `${s[0]} - ${s[1]}`;}return o.apply(this,arguments);})(bkKey);
bkBuild=(o=>function(type,mode,cols,multi){if(type!=='waku')return o.apply(this,arguments);const RC=UI.race,n=RC?RC.field.length:12;if(n<9)return [];
  const pairs=o.call(this,'uren',mode,cols,multi),seen=new Map();pairs.forEach(([a,b])=>{const w=[wakuOf(a,n),wakuOf(b,n)].sort((x,y)=>x-y),k=w.join(' - ');if(!seen.has(k))seen.set(k,w);});return [...seen.values()];})(bkBuild);
bkProb=(o=>function(RC){const f=o.apply(this,arguments);return (type,c)=>{if(type!=='waku')return f(type,c);const n=RC.field.length;let best=1e9;RC.field.forEach(x=>RC.field.forEach(y=>{if(x.no>=y.no)return;const w=[wakuOf(x.no,n),wakuOf(y.no,n)].sort((p,q)=>p-q);if(w[0]===c[0]&&w[1]===c[1])best=Math.min(best,f('uren',[x.no,y.no]).o);}));return {o:Math.max(1.1,Math.round(best*.8*10)/10)};};})(bkProb);
/* ---- WIN5: five races of the month, pick a winner (or several) in each ---- */
function win5Make(){const m=M(S.t),crs=courseSet(m),names=GR.filter(g=>g.m===m&&!g.abroad&&!g.jump).map(g=>g.n);
  const pool=[...names.slice(0,2),...['特別','ステークス','カップ','賞'].map(x=>pick(['春雷','秋風','白梅','若葉','緑風','紅葉','初霜','銀嶺','潮騒'])+x)];
  return pool.slice(0,5).map((nm,i)=>{const n=10+Math.floor(R()*7),fld=Array.from({length:n},(_,k)=>({no:k+1,name:makeName(),p:Math.exp(randn()*.9)}));const s=fld.reduce((a,x)=>a+x.p,0);fld.forEach(x=>{x.pr=x.p/s;x.odds=Math.max(1.3,Math.round(.8/x.pr*10)/10);});
    return {name:nm,course:crs[i%crs.length],fld};});}
function win5UI(){const W=S.win5;if(!W||W.t!==S.t){S.win5={t:S.t,races:win5Make(),sel:[[],[],[],[],[]],bought:0};}const w=S.win5,pts=w.sel.reduce((a,s)=>a*s.length,1);
  openModal(`<div class="from-line">${dstr(S.t)}　WIN5</div><h2>WIN5<small style="font-size:12px;margin-left:8px">指定5レースの勝ち馬を当てる（1点100円）</small></h2>
   ${w.bought?`<div class="comment">購入済み：${w.bought}点（${w.bought*100}円）。来月のはじめに結果が出る</div>`:''}
   ${w.races.map((r,i)=>`<div class="panel w5"><b>${i+1}レース目　${esc(r.course)}　${esc(r.name)}</b><div class="w5l">${r.fld.slice().sort((a,b)=>a.odds-b.odds).map(x=>`<button class="w5b ${w.sel[i].includes(x.no)?'on':''}" data-act="w5Sel" data-i="${i}" data-no="${x.no}" ${w.bought?'disabled':''}><b>${x.no}</b> ${esc(x.name)}<small>${x.odds.toFixed(1)}</small></button>`).join('')}</div></div>`).join('')}
   <div class="row"><span class="muted bksum">${pts}点 × 100円 ＝ ${pts*100}円</span><button class="btn" data-act="close">閉じる</button><button class="btn gold" data-act="w5Buy" ${pts&&!w.bought?'':'disabled'}>購入する</button></div>`,{wide:true,keepScroll:true});}
(function(){const st=document.createElement('style');st.textContent=`.w5 b{font-size:13px}.w5l{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.w5b{padding:6px 8px;border-radius:8px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:500 12px "Zen Kaku Gothic New",sans-serif;text-align:left}
.w5b b{font:700 12px Oswald,sans-serif;margin-right:2px}.w5b small{margin-left:4px;color:var(--muted)}.w5b.on{background:#1f7a48;border-color:#1f7a48;color:#fff}.w5b.on small{color:#d6f0e0}`;document.head.appendChild(st);})();
ACT.win5=()=>win5UI();
ACT.w5Sel=d=>{const w=S.win5,i=+d.i,no=+d.no;w.sel[i]=w.sel[i].includes(no)?w.sel[i].filter(x=>x!==no):[...w.sel[i],no];const sh=$('#sheet'),t=sh?sh.scrollTop:0;win5UI();const s2=$('#sheet');if(s2){s2.scrollTop=t;requestAnimationFrame(()=>{s2.scrollTop=t;});}};
ACT.w5Buy=()=>{const w=S.win5,pts=w.sel.reduce((a,s)=>a*s.length,1);if(!pts||w.bought)return;const cost=pts*.01;if(S.money<cost){toast('資金が足りない');return;}S.money-=cost;w.bought=pts;save();toast(`WIN5を${pts}点購入した`);win5UI();};
beginMonth=(o=>function(first){const W=S&&S.win5;const r=o.apply(this,arguments);try{if(W&&W.bought&&W.t<S.t&&!W.done){W.done=1;
  const win=W.races.map(rc=>{let u=R(),acc=0;for(const x of rc.fld){acc+=x.pr;if(u<=acc)return x;}return rc.fld[0];});const hit=win.every((x,i)=>W.sel[i].includes(x.no));
  const pay=Math.round(win.reduce((a,x)=>a*x.odds,1)*.7*100/10)*10;const yenPay=hit?pay:0;if(hit){S.money+=yenPay/10000;}
  S.rep&&S.rep.lines.push(`WIN5（${W.bought}点）　${hit?`的中！ 払戻 ${yenPay.toLocaleString()}円`:'はずれ'}　勝ち馬：${win.map(x=>x.no).join('-')}`);if(hit)news(`WIN5的中！ 配当${yenPay.toLocaleString()}円`);}}catch(e){console.error('win5',e);}return r;})(beginMonth);
vSched=(o=>function(){const h=o.apply(this,arguments);return `<section class="sec"><button class="btn bkbtn" data-act="win5">今月のWIN5を買う${S.win5&&S.win5.t===S.t&&S.win5.bought?'（購入済み）':''}</button></section>`+h;})(vSched);
