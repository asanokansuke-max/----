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
.bk .bkr{display:grid;grid-template-columns:30px 1fr auto auto;align-items:center;gap:8px;padding:7px 8px;border:1px solid var(--line);border-radius:10px;background:var(--panel);text-align:left;font:inherit;color:inherit}
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
.bksum{font-size:13px;color:var(--ink)!important;line-height:1.6}.bksum .bko{color:var(--muted);font-size:12px}`;document.head.appendChild(st);})();
function showBaken(back){const RC=UI.race;if(!RC||RC.order&&RC.applied){toast('このレースの発売は締め切りました');return;}
  UI.bk=UI.bk&&UI.bk.rc===RC?UI.bk:{rc:RC,type:'tan',sel:[],amt:1};if(back)UI.bkBack=back;const B=UI.bk,t=bkType(B.type),n=RC.field.length;
  const est=bkProb(RC),cs=bkCombos(B.type,B.sel),pts=B.sel.length>=t.need?cs.length:0,ods=cs.map(c=>est(B.type,c).o);
  const range=pts?(pts===1?bkOddsTxt(ods[0])+'倍':`${bkOddsTxt(Math.min(...ods))}〜${bkOddsTxt(Math.max(...ods))}倍`):'—';
  const F=[...RC.field].sort((a,b)=>a.no-b.no),tix=RC.tickets||[];
  openModal(`<div class="from-line">${dstr(S.t)}　${esc(RC.race.course)}　馬券売り場</div>${raceHead(RC.race)}
   <div class="bk">
    ${tix.length?`<div class="tix"><b style="font-size:13px">購入済み</b>${tix.map(x=>`<div><span>${bkType(x.type).n}　${x.sel.join('・')}${x.pts>1?`（${x.pts}点）`:''}</span><span>${yen(x.amt*x.pts)}</span></div>`).join('')}</div>`:''}
    <div class="bkt">${BK_TYPES.map(x=>`<button aria-pressed="${x.k===B.type}" data-act="bkType" data-k="${x.k}">${x.n}</button>`).join('')}</div>
    <div class="bkh">${t.need===1?'買いたい馬を選ぶ（複数選ぶと、1頭ずつの馬券になる）':`${t.need}頭以上を選ぶと、その組み合わせ全部を買う「ボックス」${t.ord?'（着順も全通り）':''}`}</div>
    <div class="bks"><div class="amt">${BK_AMT.map(a=>`<button aria-pressed="${a===B.amt}" data-act="bkAmt" data-a="${a}">1点 ${yen(a)}</button>`).join('')}</div></div>
    <div class="bkl">${F.map(f=>{const w=wakuOf(f.no,n),on=B.sel.includes(f.no);return `<button class="bkr ${f.mine?'me':''}" aria-pressed="${on}" data-act="bkSel" data-no="${f.no}"><span class="wk" style="background:${FRAMEC[w-1]};color:${FRAMET[w-1]}">${f.no}</span><span class="nm"><b>${esc(f.name)}</b><small>${esc(f.jname)}${f.mine?'　あなたの馬':''}</small></span><span class="od">${bkOddsTxt(f.odds)}<small>${f.pop}番人気</small></span><span class="ck"></span></button>`;}).join('')}</div>
   </div>
   <div class="row"><span class="muted bksum"><b>${t.n}</b>　${B.sel.length?B.sel.slice().sort((a,b)=>a-b).join('・'):'馬を選んでください'}　<b>${pts}点</b> × ${yen(B.amt)} ＝ <b>${yen(pts*B.amt)}</b>${pts?`　<span class="bko">推定 ${range}</span>`:''}</span><button class="btn" data-act="bkBack">戻る</button><button class="btn gold" data-act="bkBuy" ${pts?'':'disabled'}>購入する</button></div>`,{wide:true,lock:true,keepScroll:true});}
ACT.bkType=d=>{const B=UI.bk;B.type=d.k;const t=bkType(d.k);showBaken();};
ACT.bkSel=d=>{const B=UI.bk,no=+d.no;B.sel=B.sel.includes(no)?B.sel.filter(x=>x!==no):[...B.sel,no];const sh=$('#sheet'),top=sh?sh.scrollTop:0;showBaken();const s2=$('#sheet');if(s2){s2.scrollTop=top;requestAnimationFrame(()=>{s2.scrollTop=top;});}};
ACT.bkAmt=d=>{UI.bk.amt=+d.a;const sh=$('#sheet'),top=sh?sh.scrollTop:0;showBaken();const s2=$('#sheet');if(s2){s2.scrollTop=top;requestAnimationFrame(()=>{s2.scrollTop=top;});}};
ACT.bkBuy=()=>{const RC=UI.race,B=UI.bk,t=bkType(B.type);if(B.sel.length<t.need)return;const pts=bkCombos(B.type,B.sel).length,cost=pts*B.amt;
  if(S.money<cost){toast('資金が足りない');return;}S.money-=cost;RC.tickets=RC.tickets||[];RC.tickets.push({type:B.type,sel:B.sel.slice().sort((a,b)=>a-b),amt:B.amt,pts});
  S.betRec=S.betRec||{n:0,hit:0,spent:0,ret:0};S.betRec.n++;S.betRec.spent+=cost;save();try{se('coin');}catch(e){}toast(`${t.n}を${pts}点、${yen(cost)}購入した`);B.sel=[];showBaken();};
ACT.bkBack=()=>{const b=UI.bkBack;UI.bkBack=null;if(typeof b==='function')b();else closeModal();};
/* where you can buy: on the morning of the race, and in the owners' box */
showRaceDay=(o=>function(){const r=o.apply(this,arguments);try{const op=$('#sheet .rdopts');if(op&&UI.race&&!UI.race.applied)op.insertAdjacentHTML('beforebegin',`<button class="btn bkbtn" data-act="bkOpen" data-from="day">馬券を買う${(UI.race.tickets||[]).length?`（${UI.race.tickets.length}件購入済み）`:''}</button>`);}catch(e){}return r;})(showRaceDay);
showOwnerBox=(o=>function(next){const r=o.apply(this,arguments);try{const bp=$('#sheet .betp');if(bp&&UI.race&&!UI.race.applied){bp.insertAdjacentHTML('beforeend',`<button class="btn bkbtn" data-act="bkOpen" data-from="box" data-next="${next||''}">ほかの馬券も買う${(UI.race.tickets||[]).length?`（${UI.race.tickets.length}件購入済み）`:''}</button>`);}}catch(e){}return r;})(showOwnerBox);
ACT.bkOpen=d=>{const nx=d.next;showBaken(d.from==='box'?()=>{clearInterval(TERM);showOwnerBox(nx);}:()=>showRaceDay());};
/* the result: every ticket is checked against the official dividends */
showResult=(o=>function(){const RC=UI.race;const r=o.apply(this,arguments);try{
  if(RC&&RC.order&&(RC.tickets||[]).length&&!RC.tixPaid){RC.tixPaid=true;const po=payouts(RC);let total=0,spent=0;const rows=[];
    RC.tickets.forEach(x=>{const win=(po[x.type]||[]).map(z=>[z[0],z[1]]);let pay=0,hits=[];
      bkCombos(x.type,x.sel).forEach(c=>{const k=bkKey(x.type,c),w=win.find(z=>z[0]===k);if(w){pay+=x.amt*w[1]/100;hits.push(`${k}（${w[1].toLocaleString()}円）`);}});
      pay=Math.round(pay);total+=pay;spent+=x.amt*x.pts;rows.push({x,pay,hits});});
    S.money+=total;S.betRec=S.betRec||{n:0,hit:0,spent:0,ret:0};S.betRec.ret+=total;if(total>0)S.betRec.hit++;
    if(S.rep)S.rep.lines.push(`馬券（${RC.race.name}）　購入 ${yen(spent)}　払戻 ${total?yen(total):'なし'}`);save();
    const ban=document.querySelector('#sheet .result-banner');
    if(ban)ban.insertAdjacentHTML('afterend',`<div class="bkres"><div><b>馬券</b><span>購入 ${yen(spent)}　払戻 <b>${total?yen(total):'0'}</b></span></div>${rows.map(q=>`<div class="${q.pay?'hit':''}"><span>${bkType(q.x.type).n}　${q.x.sel.join('・')}${q.x.pts>1?`（${q.x.pts}点×${yen(q.x.amt)}）`:`　${yen(q.x.amt)}`}${q.hits.length?`<br><small>的中 ${esc(q.hits.join('、'))}</small>`:''}</span><span>${q.pay?yen(q.pay):'はずれ'}</span></div>`).join('')}</div>`);
    if(total>0){try{se('coin');}catch(e){}}}
  }catch(e){console.error('baken',e);}return r;})(showResult);
