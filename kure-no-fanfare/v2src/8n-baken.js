/* =========================================================
   馬券: buy any ticket for the race — 単勝・複勝・馬連・馬単・ワイド・3連複・3連単 —
   on any runner, as a box (all combinations of the horses you tick), several tickets per race.
   Paid out from the official dividends (payouts) when the result is in.
   ========================================================= */
const BK_TYPES=[{k:'tan',n:'単勝',need:1},{k:'fuku',n:'複勝',need:1},{k:'uren',n:'馬連',need:2},{k:'utan',n:'馬単',need:2,ord:true},{k:'wide',n:'ワイド',need:2},{k:'fuku3',n:'3連複',need:3},{k:'tan3',n:'3連単',need:3,ord:true}];
const BK_AMT=[1,5,10,50,100];
function bkType(k){return BK_TYPES.find(t=>t.k===k)||BK_TYPES[0];}
/* every combination (or ordered arrangement) of the ticked horses */
function bkCombos(type,sel){const t=bkType(type),s=[...sel].sort((a,b)=>a-b),out=[];
  if(t.need===1)return s.map(x=>[x]);
  const rec=(cur,rest)=>{if(cur.length===t.need){out.push(cur);return;}rest.forEach((x,i)=>rec([...cur,x],t.ord?rest.filter(y=>y!==x):rest.slice(i+1)));};rec([],s);return out;}
function bkKey(type,c){const s2=[...c].sort((a,b)=>a-b);return type==='utan'?`${c[0]} → ${c[1]}`:type==='tan3'?`${c[0]} → ${c[1]} → ${c[2]}`:s2.join(' - ');}
/* a rough idea of the odds before the off (same model as the dividends) */
function bkProb(RC){const fld=RC.field,tot=fld.reduce((a,f)=>a+.8/f.odds,0),pri=f=>1/(Math.pow(f.pop,1.15)+1.6),pt=fld.reduce((a,f)=>a+pri(f),0),p={};
  fld.forEach(f=>p[f.no]=.45*(.8/f.odds)/tot+.55*pri(f)/pt);const P2=(i,j)=>p[i]*p[j]/(1-p[i]),P3=(i,j,k)=>p[i]*p[j]/(1-p[i])*p[k]/(1-p[i]-p[j]);
  const perms=a=>a.length<2?[a]:a.flatMap((x,i)=>perms(a.filter((_,j)=>j!==i)).map(r=>[x,...r]));
  return (type,c)=>{const n=fld.length;if(type==='tan')return {o:fld.find(f=>f.no===c[0]).odds};
    if(type==='fuku'){const f=fld.find(x=>x.no===c[0]);return {o:Math.max(1.1,Math.round(f.odds*.3*10)/10)};}
    const pr=type==='uren'?P2(c[0],c[1])+P2(c[1],c[0]):type==='utan'?P2(c[0],c[1]):type==='wide'?Math.min(.95,(P2(c[0],c[1])+P2(c[1],c[0]))*(n>=8?2.6:1.8)):type==='fuku3'?perms(c).reduce((a,q)=>a+P3(...q),0):P3(c[0],c[1],c[2]);
    const tk=type==='tan3'?.725:type==='fuku3'?.75:.775;return {o:Math.max(1.1,Math.round(tk/Math.max(pr,1e-6)*10)/10)};};}
function bkOddsTxt(o){return o>=1000?Math.round(o).toLocaleString():o.toFixed(1);}
(function(){const st=document.createElement('style');st.textContent=`
.bk{display:grid;gap:12px}
.bk .bkt{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.bk .bkt button{min-height:40px;border-radius:10px;border:1px solid var(--line);background:var(--panel2,#f3f1ea);font:700 13px "Zen Kaku Gothic New",sans-serif;color:var(--ink)}
.bk .bkt button[aria-pressed=true]{background:#1f7a48;color:#fff;border-color:#1f7a48}
.bk .bkh{font-size:12px;color:var(--muted)}
.bk .bkl{display:grid;gap:4px}
.bk .bkr{display:grid;grid-template-columns:30px 1fr auto;align-items:center;gap:8px;padding:7px 8px;border:1px solid var(--line);border-radius:10px;background:var(--panel);text-align:left;font:inherit;color:inherit}
.bk .bkr[aria-pressed=true]{border-color:#1f7a48;box-shadow:0 0 0 2px rgba(31,122,72,.35) inset;background:color-mix(in srgb,#1f7a48 10%,var(--panel))}
.bk .bkr .wk{display:grid;place-items:center;width:28px;height:28px;border-radius:6px;font:800 14px Oswald,sans-serif;border:1px solid rgba(0,0,0,.2)}
.bk .bkr .nm{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bk .bkr .nm small{display:block;font-size:11px;color:var(--muted)}
.bk .bkr .od{font:600 14px Oswald,sans-serif;text-align:right}.bk .bkr .od small{display:block;font:500 10px "Zen Kaku Gothic New",sans-serif;color:var(--muted)}
.bk .bkr .ck{width:20px;height:20px;border-radius:6px;border:2px solid #9aa59e}.bk .bkr[aria-pressed=true] .ck{background:#1f7a48;border-color:#1f7a48;box-shadow:inset 0 0 0 3px var(--panel)}
.bk .bkr.me .nm b{color:#b8862b}
.bk .bks{border:1px dashed var(--line);border-radius:12px;padding:10px 12px;display:grid;gap:8px;font-size:13px}
.bk .bks .amt{display:flex;flex-wrap:wrap;gap:6px}.bk .bks .amt button{padding:6px 10px;border-radius:999px;border:1px solid var(--line);background:var(--panel);font:600 12px inherit;color:inherit}
.bk .bks .amt button[aria-pressed=true]{background:#2b3a55;color:#fff;border-color:#2b3a55}
.bk .tix{display:grid;gap:4px}.bk .tix div,.bkres div{display:flex;justify-content:space-between;gap:8px;font-size:13px;padding:6px 10px;border-radius:8px;background:color-mix(in srgb,#2b3a55 8%,var(--panel))}
.bkres{display:grid;gap:4px;margin-top:2px}.bkres .hit{background:color-mix(in srgb,#d9a441 22%,var(--panel));font-weight:700}
.bkbtn{width:100%;margin-top:6px}
.bk .bkm{display:flex;flex-wrap:wrap;gap:6px}.bk .bkm button{padding:7px 12px;border-radius:999px;border:1px solid var(--line);background:var(--panel);font:700 12px "Zen Kaku Gothic New",sans-serif;color:var(--ink)}
.bk .bkm button[aria-pressed=true]{background:#7a1f2a;color:#fff;border-color:#7a1f2a}.bk .bkm .mul{margin-left:auto}.bk .bkm .mul[aria-pressed=true]{background:#b8862b;border-color:#b8862b}
.bk .bkr.multi{grid-template-columns:30px 1fr auto}.bk .bkr .cols{display:flex;gap:4px}
.bk .bkr .cb{min-width:42px;padding:7px 6px;border-radius:8px;border:1.5px solid #9aa59e;background:var(--panel);font:700 11px "Zen Kaku Gothic New",sans-serif;color:var(--muted)}
.bk .bkr .cb.on{background:#1f7a48;border-color:#1f7a48;color:#fff}
.bksum small{font-size:11px;color:var(--muted)}.bksum{font-size:13px;color:var(--ink)!important;line-height:1.6}.bksum .bko{color:var(--muted);font-size:12px}`;document.head.appendChild(st);})();
/* 買い方: ボックス / 流し (軸から相手へ。馬単・3連単はマルチも) / フォーメーション (着順・列ごとに馬を選ぶ) */
const BK_MODES=[{k:'box',n:'ボックス'},{k:'nagashi',n:'流し'},{k:'form',n:'フォーメーション'}];
function bkPerms(a){return a.length<2?[a]:a.flatMap((x,i)=>bkPerms(a.filter((_,j)=>j!==i)).map(r=>[x,...r]));}
function bkPairs(a){const o=[];a.forEach((x,i)=>a.slice(i+1).forEach(y=>o.push([x,y])));return o;}
function bkBuild(type,mode,cols,multi){const t=bkType(type),uniq=new Map(),add=c=>{if(new Set(c).size!==c.length)return;const k=bkKey(type,c);if(!uniq.has(k))uniq.set(k,t.ord?c:[...c].sort((a,b)=>a-b));};
  const C=cols.map(x=>[...new Set(x)].sort((a,b)=>a-b));
  if(t.need===1||mode==='box'){bkCombos(type,C[0]||[]).forEach(add);return [...uniq.values()];}
  if(mode==='nagashi'){const A=C[0]||[],O=(C[1]||[]).filter(x=>!A.includes(x));if(!A.length||!O.length)return [];
    if(t.need===2){const a=A[0];O.forEach(o=>{add([a,o]);if(t.ord&&multi)add([o,a]);});}
    else if(A.length===1){const a=A[0];bkPairs(O).forEach(([x,y])=>{if(!t.ord)add([a,x,y]);else if(multi)bkPerms([a,x,y]).forEach(add);else{add([a,x,y]);add([a,y,x]);}});}
    else{const[a,b]=A;O.forEach(o=>{if(!t.ord)add([a,b,o]);else if(multi)bkPerms([a,b,o]).forEach(add);else{add([a,b,o]);add([b,a,o]);}});}
    return [...uniq.values()];}
  // formation
  const L=C.slice(0,t.need);if(L.length<t.need||L.some(x=>!x.length))return [];
  if(t.need===2)L[0].forEach(x=>L[1].forEach(y=>add([x,y])));else L[0].forEach(x=>L[1].forEach(y=>L[2].forEach(z=>add([x,y,z]))));
  return [...uniq.values()];}
function bkColNames(t,mode){if(mode==='nagashi')return ['軸','相手'];if(mode==='form')return t.ord?['1着','2着','3着'].slice(0,t.need):['1頭目','2頭目','3頭目'].slice(0,t.need);return [''];}
function bkLabel(x){const t=bkType(x.type),j=a=>a.join('・');if(t.need===1||!x.mode||x.mode==='box')return `${x.mode&&t.need>1?'ボックス ':''}${j(x.cols?x.cols[0]:x.sel)}`;
  if(x.mode==='nagashi')return `流し 軸${j(x.cols[0])}→相手${j(x.cols[1])}${x.multi?'（マルチ）':''}`;return `フォーメーション ${x.cols.map(j).join(t.ord?' → ':' － ')}`;}
function showBaken(back){const RC=UI.race;if(!RC||RC.order&&RC.applied){toast('このレースの発売は締め切りました');return;}
  UI.bk=UI.bk&&UI.bk.rc===RC?UI.bk:{rc:RC,type:'tan',mode:'box',cols:[[],[],[]],multi:false,amt:1};if(back)UI.bkBack=back;const B=UI.bk,t=bkType(B.type),n=RC.field.length;
  if(t.need===1)B.mode='box';const mode=B.mode,names=bkColNames(t,mode);
  const est=bkProb(RC),cs=bkBuild(B.type,mode,B.cols,B.multi),pts=cs.length,ods=cs.map(c=>est(B.type,c).o);
  const range=pts?(pts===1?bkOddsTxt(ods[0])+'倍':`${bkOddsTxt(Math.min(...ods))}〜${bkOddsTxt(Math.max(...ods))}倍`):'—';
  const F=[...RC.field].sort((a,b)=>a.no-b.no),tix=RC.tickets||[];
  const hint=t.need===1?'買いたい馬を選ぶ（複数選ぶと、1頭ずつの馬券になる）':mode==='box'?`${t.need}頭以上を選ぶと、その組み合わせ全部を買う${t.ord?'（着順も全通り）':''}`
    :mode==='nagashi'?(t.need===2?`軸を1頭、相手を何頭か選ぶ。${t.ord?'軸が1着、相手が2着。マルチなら着順を問わない':''}`:`軸を1頭（または2頭）、相手を何頭か選ぶ。${t.ord?'軸1頭なら軸が1着固定、2頭なら1・2着固定。マルチなら着順を問わない':''}`)
    :`${t.ord?'着順':'列'}ごとに馬を選ぶ。同じ馬を何列に入れてもよい`;
  const mark=(no,c)=>(B.cols[c]||[]).includes(no);
  openModal(`<div class="from-line">${dstr(S.t)}　${esc(RC.race.course)}　馬券売り場</div>${raceHead(RC.race)}
   <div class="bk">
    ${tix.length?`<div class="tix"><b style="font-size:13px">購入済み</b>${tix.map(x=>`<div><span>${bkType(x.type).n}　${esc(bkLabel(x))}${x.pts>1?`（${x.pts}点）`:''}</span><span>${yen(x.amt*x.pts)}</span></div>`).join('')}</div>`:''}
    <div class="bkt">${BK_TYPES.map(x=>`<button aria-pressed="${x.k===B.type}" data-act="bkType" data-k="${x.k}">${x.n}</button>`).join('')}</div>
    ${t.need>1?`<div class="bkm">${BK_MODES.map(m=>`<button aria-pressed="${m.k===mode}" data-act="bkMode" data-m="${m.k}">${m.n}</button>`).join('')}${mode==='nagashi'&&t.ord?`<button class="mul" aria-pressed="${!!B.multi}" data-act="bkMulti">マルチ</button>`:''}</div>`:''}
    <div class="bkh">${hint}</div>
    <div class="bks"><div class="amt">${BK_AMT.map(a=>`<button aria-pressed="${a===B.amt}" data-act="bkAmt" data-a="${a}">1点 ${yen(a)}</button>`).join('')}</div></div>
    <div class="bkl">${F.map(f=>{const w=wakuOf(f.no,n),one=mode==='box'||t.need===1,on=one&&mark(f.no,0);
      const right=one?`<span class="ck"></span>`:`<span class="cols">${names.map((nm,c)=>`<button class="cb ${mark(f.no,c)?'on':''}" data-act="bkCol" data-c="${c}" data-no="${f.no}">${nm}</button>`).join('')}</span>`;
      const tag=one?'button':'div';return `<${tag} class="bkr ${f.mine?'me':''} ${one?'':'multi'}" ${one?`aria-pressed="${on}" data-act="bkCol" data-c="0" data-no="${f.no}"`:''}><span class="wk" style="background:${FRAMEC[w-1]};color:${FRAMET[w-1]}">${f.no}</span><span class="nm"><b>${esc(f.name)}</b><small>${esc(f.jname)}　${bkOddsTxt(f.odds)}倍 ${f.pop}番人気${f.mine?'　あなたの馬':''}</small></span>${right}</${tag}>`;}).join('')}</div>
   </div>
   <div class="row"><span class="muted bksum"><b>${t.n}</b>${t.need>1?`<small> ${BK_MODES.find(m=>m.k===mode).n}${mode==='nagashi'&&t.ord&&B.multi?'・マルチ':''}</small>`:''}　<b>${pts}点</b> × ${yen(B.amt)} ＝ <b>${yen(pts*B.amt)}</b>${pts?`　<span class="bko">推定 ${range}</span>`:''}</span><button class="btn" data-act="bkBack">戻る</button><button class="btn gold" data-act="bkBuy" ${pts?'':'disabled'}>購入する</button></div>`,{wide:true,lock:true,keepScroll:true});}
const bkRedraw=()=>{const sh=$('#sheet'),top=sh?sh.scrollTop:0;showBaken();const s2=$('#sheet');if(s2){s2.scrollTop=top;requestAnimationFrame(()=>{s2.scrollTop=top;});}};
ACT.bkType=d=>{const B=UI.bk;B.type=d.k;B.cols=[[],[],[]];showBaken();};
ACT.bkMode=d=>{const B=UI.bk;B.mode=d.m;B.cols=[[],[],[]];bkRedraw();};
ACT.bkMulti=()=>{UI.bk.multi=!UI.bk.multi;bkRedraw();};
ACT.bkCol=d=>{const B=UI.bk,c=+d.c,no=+d.no,t=bkType(B.type),col=B.cols[c]=B.cols[c]||[];
  if(col.includes(no))B.cols[c]=col.filter(x=>x!==no);
  else{if(B.mode==='nagashi'&&c===0){const cap=t.need===2?1:2;if(col.length>=cap)col.shift();B.cols[1]=(B.cols[1]||[]).filter(x=>x!==no);}
    if(B.mode==='nagashi'&&c===1&&(B.cols[0]||[]).includes(no))return;col.push(no);}
  bkRedraw();};
ACT.bkSel=d=>ACT.bkCol({c:0,no:d.no});
ACT.bkAmt=d=>{UI.bk.amt=+d.a;bkRedraw();};
ACT.bkBuy=()=>{const RC=UI.race,B=UI.bk,t=bkType(B.type),mode=t.need===1?'box':B.mode,cs=bkBuild(B.type,mode,B.cols,B.multi),pts=cs.length,cost=pts*B.amt;if(!pts)return;
  if(S.money<cost){toast('資金が足りない');return;}S.money-=cost;RC.tickets=RC.tickets||[];
  RC.tickets.push({type:B.type,mode,cols:B.cols.map(x=>[...x].sort((a,b)=>a-b)).slice(0,mode==='box'?1:mode==='nagashi'?2:t.need),multi:!!B.multi&&mode==='nagashi',amt:B.amt,pts,combos:cs});
  S.betRec=S.betRec||{n:0,hit:0,spent:0,ret:0};S.betRec.n++;S.betRec.spent+=cost;save();try{se('coin');}catch(e){}toast(`${t.n}を${pts}点、${yen(cost)}購入した`);B.cols=[[],[],[]];bkRedraw();};
ACT.bkBack=()=>{const b=UI.bkBack;UI.bkBack=null;if(typeof b==='function')b();else closeModal();};
/* where you can buy: on the morning of the race, and in the owners' box */
showRaceDay=(o=>function(){const r=o.apply(this,arguments);try{const op=$('#sheet .rdopts');if(op&&UI.race&&!UI.race.applied)op.insertAdjacentHTML('beforebegin',`<button class="btn bkbtn" data-act="bkOpen" data-from="day">馬券を買う${(UI.race.tickets||[]).length?`（${UI.race.tickets.length}件購入済み）`:''}</button>`);}catch(e){}return r;})(showRaceDay);
showOwnerBox=(o=>function(next){const r=o.apply(this,arguments);try{const bp=$('#sheet .betp');if(bp&&UI.race&&!UI.race.applied){bp.insertAdjacentHTML('beforeend',`<button class="btn bkbtn" data-act="bkOpen" data-from="box" data-next="${next||''}">ほかの馬券も買う${(UI.race.tickets||[]).length?`（${UI.race.tickets.length}件購入済み）`:''}</button>`);}}catch(e){}return r;})(showOwnerBox);
ACT.bkOpen=d=>{const nx=d.next;showBaken(d.from==='box'?()=>{clearInterval(TERM);showOwnerBox(nx);}:()=>showRaceDay());};
/* the result: every ticket is checked against the official dividends */
showResult=(o=>function(){const RC=UI.race;const r=o.apply(this,arguments);try{
  if(RC&&RC.order&&(RC.tickets||[]).length&&!RC.tixPaid){RC.tixPaid=true;const po=payouts(RC);let total=0,spent=0;const rows=[];
    RC.tickets.forEach(x=>{const win=(po[x.type]||[]).map(z=>[z[0],z[1]]);let pay=0,hits=[];
      (x.combos||bkCombos(x.type,x.sel||[])).forEach(c=>{const k=bkKey(x.type,c),w=win.find(z=>z[0]===k);if(w){pay+=x.amt*w[1]/100;hits.push(`${k}（${w[1].toLocaleString()}円）`);}});
      pay=Math.round(pay);total+=pay;spent+=x.amt*x.pts;rows.push({x,pay,hits});});
    S.money+=total;S.betRec=S.betRec||{n:0,hit:0,spent:0,ret:0};S.betRec.ret+=total;if(total>0)S.betRec.hit++;
    if(S.rep)S.rep.lines.push(`馬券（${RC.race.name}）　購入 ${yen(spent)}　払戻 ${total?yen(total):'なし'}`);save();
    const ban=document.querySelector('#sheet .result-banner');
    if(ban)ban.insertAdjacentHTML('afterend',`<div class="bkres"><div><b>馬券</b><span>購入 ${yen(spent)}　払戻 <b>${total?yen(total):'0'}</b></span></div>${rows.map(q=>`<div class="${q.pay?'hit':''}"><span>${bkType(q.x.type).n}　${esc(bkLabel(q.x))}${q.x.pts>1?`（${q.x.pts}点×${yen(q.x.amt)}）`:`　${yen(q.x.amt)}`}${q.hits.length?`<br><small>的中 ${esc(q.hits.join('、'))}</small>`:''}</span><span>${q.pay?yen(q.pay):'はずれ'}</span></div>`).join('')}</div>`);
    if(total>0){try{se('coin');}catch(e){}}}
  }catch(e){console.error('baken',e);}return r;})(showResult);
