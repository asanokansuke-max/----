/* =========================================================
   山場を増やす: 祝勝会, 有馬前夜, 引退式, 宿命の対決, 馬の個性, 年末の振り返り, おまかせで読む, セーブスロット
   ========================================================= */
const ownerNm=()=>S.part===1?S.parent.name:(S.child&&S.child.name)||'';
/* ---- 1. 祝勝会: the first win, the first graded win, the first G1 ---- */
applyRace=(o=>function(RC){const r=o.apply(this,arguments);try{const w=(RC.order||[])[0];if(w&&w.mine&&w.h&&!w.out){const g=RC.race,kind=g.grade==='G1'&&!S.flags.party_g1?'g1':g.g&&!S.flags.party_gr?'gr':!S.flags.party_1?'first':null;
  if(kind){S.flags.party_1=1;if(g.g)S.flags.party_gr=1;if(g.grade==='G1')S.flags.party_g1=1;pushEv('party',{kind,hid:w.h.id,name:w.h.name,race:g.name,jid:w.jid&&w.jid!=='stable'?w.jid:null,jname:w.jname,tr:w.h.trainer});}}}catch(e){}return r;})(applyRace);
EV.party={r:d=>{const tn=P(d.tr)?P(d.tr).n.split(' ')[0]:'調教師',jn=(d.jname||'').split(' ')[0],ttl=d.kind==='g1'?'G1の夜':d.kind==='gr'?'重賞の祝杯':'はじめての勝利';
  const body=d.kind==='first'?`${d.race}で${d.name}が勝った夜。三國が、駅前の小さな焼き鳥屋を予約していた。\n\n${tn}「…勝つっていうのは、何度経験してもいいもんですな」\n${jn?`${jn}「ゴール板を過ぎたとき、${d.name}が首を上げたんです。わかってるんですよ、あいつ」\n`:''}三國「${ownerNm()}さんの、最初の一勝です。…今日のことは、ずっと覚えておきましょう」\n\n乾杯の音が、店の中に小さく響いた。`
   :d.kind==='gr'?`${d.race}を勝った夜、ホテルの宴会場で関係者が集まった。生産者の中原も、日高から駆けつけてくれた。\n\n中原「…あの子が、重賞を。わしは何もしとらん。あんたたちが育てたんだ」\n${jn?`${jn}「次は、もっと大きいところで」\n`:''}${tn}「浮かれるのは今夜だけです。明日からまた調教ですよ」`
   :`${d.race}。G1の表彰台に立った夜は、なかなか眠れなかった。\n\n携帯には、何十件ものメッセージ。知らない番号からもあった。\n\n三國が、そっとグラスを差し出した。「${S.part===1?'お父様に、報告しましょう':'お父様にも、届いていますよ'}」\n\n窓の外に、${d.race.includes('有馬')?'暮れの中山':'競馬場'}の灯りがまだ残っていた。`;
  return{p:'mikuni',from:'三國 透',title:ttl,body,ch:['乾杯する']};},f:(d)=>{trust(d.tr,4);if(d.jid)trust(d.jid,4);trust('mikuni',3);const h=HZ(d.hid);if(h)h.bond=clamp((h.bond||0)+5,0,100);return '';}};
/* ---- 2. 有馬記念の前夜 (after the draw) ---- */
showArimaPrelude=(o=>function(){const RC=UI.race;if(RC&&RC.drawn&&!RC.eveDone){RC.eveDone=1;const me=RC.field.find(f=>f.mine);if(me){const h=me.h,tn=P(h.trainer)?P(h.trainer).n.split(' ')[0]:'調教師';
  openModal(`<div class="from-line">有馬記念の前夜</div><h2 class="arima-t">前夜</h2><div class="letter">${esc(`夜十時。電話が鳴った。\n\n${tn}「${h.name}、カイバは全部食べました。いつもより落ち着いています。…やれることは、全部やりました」\n\n電話を切ると、すぐにまた鳴った。中原だった。\n「…あの芦毛の母親がな、生きとったら、なんと言うかと思ってな。それだけだ。寝てくれ」\n\n${S.part===1?'窓の外は冷え込んでいた。四十年前のあの日も、こんな夜だったのだろうか。父は、前の晩に何を考えていたのだろう。':'机の上に、父の古い馬券が一枚置いてある。四十年前の、有馬記念の単勝。'}\n\n明日、暮れの中山へ行く。`)}</div><div class="row"><span class="sp"></span><button class="btn gold" data-act="eveGo">当日の朝へ</button></div>`,{lock:true});return;}}return o.apply(this,arguments);})(showArimaPrelude);
ACT.eveGo=()=>showArimaPrelude();
/* ---- 3. 引退式 for the good ones ---- */
retireHorse=(o=>function(h){const big=h&&((h.g1||0)>0||(h.gw||[]).length>=2||(h.fans||0)>=60000);const r=o.apply(this,arguments);try{if(big)pushEv('retireCeremony',{hid:h.id,name:h.name,g1:h.g1||0,gw:(h.gw||[]).slice(-3),fans:h.fans||0,starts:h.starts,wins:h.wins,coat:h.coat});}catch(e){}return r;})(retireHorse);
EV.retireCeremony={r:d=>({p:'mikuni',from:'中山競馬場',title:`${d.name} 引退式`,body:`最終レースのあと、${d.name}の引退式が行われた。\n\nスタンドには、${Math.max(3000,Math.round(d.fans/8/1000)*1000).toLocaleString()}人を超えるファンが残っていた。ターフビジョンに、${d.gw.length?d.gw.join('、')+'の':'これまでの'}映像が流れる。\n\n通算${d.starts}戦${d.wins}勝${d.g1?`、G1 ${d.g1}勝`:''}。\n\n最後に、ゼッケンを着けて直線を一度だけ走った。${d.coat==='芦毛'?'白い馬体が、冬の陽を受けて光っていた。':'たてがみが、風になびいていた。'}拍手が、いつまでも止まなかった。`,ch:['手を振って見送る']}),
  f:(d)=>{S.fame+=1.5;log(`${d.name}の引退式`);return `${d.name}は、静かに馬運車に乗り込んだ。`;}};
/* ---- 4. 宿命の対決: a running record against the rival, shown before the race and in the paper ---- */
function rivalRec(name){const L=(S.rivalLog||[]).filter(x=>x.h===name);return {n:L.length,w:L.filter(x=>x.meWon).length};}
const rivalBanner=()=>{try{const RC=UI.race;if(!RC)return;const rv=typeof ensureRival==='function'?ensureRival(RC):null;if(!rv)return;const rec=rivalRec(rv.name);if(rec.n<2||$('#sheet .fate'))return;const me=RC.field.find(f=>f.mine);
  const hd=$('#sheet .racehead');if(hd)hd.insertAdjacentHTML('afterend',`<div class="fate"><b>宿命の対決</b><span>${esc(me?me.name:'')} <i>vs</i> ${esc(rv.name)}</span><small>これまで ${rec.w}勝${rec.n-rec.w}敗${rec.n>=4?'　ファンもこの一戦に注目している':''}</small></div>`);}catch(e){}};
showRaceDay=(o=>function(){const r=o.apply(this,arguments);rivalBanner();return r;})(showRaceDay);
showTrackGate=(o=>function(){const r=o.apply(this,arguments);rivalBanner();return r;})(showTrackGate);
(function(){const st=document.createElement('style');st.textContent=`.fate{display:grid;gap:2px;padding:9px 12px;border-radius:12px;background:linear-gradient(90deg,#3a0f14,#1c1d2e);color:#f6e7b0;margin:4px 0}
.fate b{font:800 12px "Zen Kaku Gothic New",sans-serif;letter-spacing:.3em;color:#ff8f7a}.fate span{font:800 15px "Zen Kaku Gothic New",sans-serif}.fate span i{font-style:normal;color:#ff8f7a;margin:0 6px}.fate small{font-size:11px;color:#cfc6b5}
.trait{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.trait span{font-size:11px;padding:2px 8px;border-radius:999px;background:color-mix(in srgb,#1f7a48 14%,var(--panel));border:1px solid color-mix(in srgb,#1f7a48 40%,var(--line))}
.yrv{display:grid;gap:10px}.yrv .hd{font:800 22px "Shippori Mincho B1",serif;text-align:center}.yrv .nums{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.yrv .nums div{text-align:center;padding:8px 4px;border-radius:10px;background:color-mix(in srgb,var(--ink) 5%,var(--panel))}.yrv .nums b{display:block;font:700 22px Oswald,sans-serif}.yrv .nums small{font-size:11px;color:var(--muted)}
.yrv .best{padding:10px 12px;border-radius:12px;border:1px solid #d9a441;background:color-mix(in srgb,#d9a441 10%,var(--panel))}.yrv ul{margin:0;padding-left:1.1em;font-size:13px;line-height:1.8}`;document.head.appendChild(st);})();
applyRace=(o=>function(RC){const rv=RC&&RC.rivalF,me=RC&&(RC.order||[]).find(f=>f.mine);const r=o.apply(this,arguments);try{if(rv&&me&&RC.race.g){const rec=rivalRec(rv.name);if(rec.n>=3)news(`【宿命の対決】${me.name}と${rv.name}、通算${rec.w}勝${rec.n-rec.w}敗（${RC.race.name}）`);}}catch(e){}return r;})(applyRace);
/* ---- 5. 馬の個性: left/right-handed, the rain, the hill — found out race by race ---- */
const LEFTC=['東京','中京','新潟'],HILLC=['中山','阪神','中京'];
function traitsOf(h){if(!h.tr)h.tr={lh:Math.round((hash(h.name+'lh')-.5)*4)/2,hill:Math.round((hash(h.name+'hl')-.5)*4)/2,cold:Math.round((hash(h.name+'cd')-.5)*3)/2};h.trK=h.trK||{};return h.tr;}
mkRunner=(o=>function(x,race){const r=o.apply(this,arguments);try{const h=x&&x.h;if(h&&x.mine){const t=traitsOf(h),left=LEFTC.includes(race.course);r.exp+=(left?t.lh:-t.lh)*.7+(HILLC.includes(race.course)?t.hill*.6:0)+([12,1,2].includes(M(S.t))?t.cold*.5:0);}}catch(e){}return r;})(mkRunner);
applyRace=(o=>function(RC){const r=o.apply(this,arguments);try{(RC.order||[]).filter(f=>f.mine&&f.h).forEach(f=>{const h=f.h,t=traitsOf(h),K=h.trK,c=RC.race.course,notes=[];
  if(!K.lh&&Math.abs(t.lh)>=.5&&R()<.5){K.lh=1;notes.push(t.lh>0?'左回りのほうが走る':'右回りのほうが走る');}
  if(!K.hill&&HILLC.includes(c)&&Math.abs(t.hill)>=.5&&R()<.5){K.hill=1;notes.push(t.hill>0?'ゴール前の坂を苦にしない':'急な坂は得意ではない');}
  if(!K.cold&&[12,1,2].includes(M(S.t))&&Math.abs(t.cold)>=.5&&R()<.5){K.cold=1;notes.push(t.cold>0?'寒い時期に調子を上げる':'冬場は動きが硬い');}
  if(notes.length&&S.rep)S.rep.lines.push(`${h.name}の個性がわかった：${notes.join('・')}`);});}catch(e){}return r;})(applyRace);
function traitTags(h){const t=traitsOf(h),K=h.trK,L=[];if(K.lh)L.push(t.lh>0?'左回り◎':'右回り◎');if(K.hill)L.push(t.hill>0?'坂◎':'坂△');if(K.cold)L.push(t.cold>0?'冬◎':'冬△');if(h.known&&h.known.going)L.push(h.heavy>=1?'道悪◎':h.heavy<=-1?'道悪△':'馬場不問');if(h.known&&h.known.dist)L.push(`${h.dist}m前後`);return L;}
openManage=(o=>function(hid){const r=o.apply(this,arguments);try{const h=HZ(hid);const L=traitTags(h);const ch=document.querySelector('#sheet .choices');if(ch)ch.insertAdjacentHTML('beforebegin',`<div><b style="font-size:13px">わかった個性</b><div class="trait">${L.length?L.map(x=>`<span>${x}</span>`).join(''):'<small class="muted">まだわからない。走るたびに見えてくる</small>'}</div></div>`);}catch(e){}return r;})(openManage);
/* ---- 6. 年末の振り返り ---- */
newYear=(o=>function(){const py=Y(S.t)-1,m0=S.yrMoney;const r=o.apply(this,arguments);try{if(S.t-S.startT>=11){const recs=[];mine().forEach(h=>(h.rec||[]).forEach(x=>{if(Y(x.t)===py)recs.push({...x,h:h.name});}));
  const st=recs.length,wi=recs.filter(x=>x.pos===1).length,gr=recs.filter(x=>x.pos===1&&/G/.test(x.gr||'')).length;const best=recs.filter(x=>x.pos<=3).sort((a,b)=>((b.gr==='G1')-(a.gr==='G1'))||(/G/.test(b.gr||'')-/G/.test(a.gr||''))||(a.pos-b.pos))[0];
  pushEv('yearReview',{y:py,st,wi,gr,best:best?{h:best.h,n:best.n,pos:best.pos,gr:best.gr}:null,dm:m0!=null?Math.round(S.money-m0):null,top:recs.filter(x=>x.pos===1).slice(0,5).map(x=>`${x.h}　${x.n}`)});}S.yrMoney=S.money;}catch(e){}return r;})(newYear);
EV.yearReview={r:d=>({p:'mikuni',from:'三國 透',title:`${d.y}年の振り返り`,body:'',ch:['来年も、よろしく頼む']}),f:()=>'三國「こちらこそ。…いい年にしましょう」'};
ACT.ev=(o=>function(d){const e=S.inbox.find(x=>x.id===+d.id);const r=o.apply(this,arguments);try{if(e&&e.type==='yearReview'){const v=e.data,L=$('#sheet .letter');if(L)L.outerHTML=`<div class="yrv"><div class="hd">${v.y}年</div><div class="nums"><div><b>${v.st}</b><small>出走</small></div><div><b>${v.wi}</b><small>勝利</small></div><div><b>${v.gr}</b><small>重賞勝ち</small></div></div>
   ${v.best?`<div class="best"><small class="muted">今年の名場面</small><div><b>${esc(v.best.n)}</b>${v.best.gr&&/G/.test(v.best.gr)?`（${esc(v.best.gr)}）`:''}　${esc(v.best.h)} ${v.best.pos}着</div></div>`:''}
   ${v.top.length?`<div><small class="muted">勝ったレース</small><ul>${v.top.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}
   ${v.dm!=null?`<div class="muted" style="font-size:13px">資金の増減　<b style="color:${v.dm>=0?'#1f7a48':'#c8231c'}">${v.dm>=0?'+':''}${yen(v.dm)}</b></div>`:''}
   <div class="letter">三國「${v.wi?'いい一年でした。':'悔しい一年でした。でも、'}…来年は、もっと先へ行きましょう」</div></div>`;}}catch(x){}return r;})(ACT.ev);
/* ---- 7. おまかせで読む: events with only one answer are read in one go ---- */
ACT.readEasy=()=>{let n=0;for(const e of [...S.inbox]){try{if(!EV[e.type])continue;const v=EV[e.type].r(e.data);if(!v){S.inbox=S.inbox.filter(x=>x!==e);continue;}if((v.ch||[]).length!==1)continue;EV[e.type].f(e.data,0);S.inbox=S.inbox.filter(x=>x!==e);n++;}catch(x){}}save();render();toast(n?`${n}件をまとめて読んだ${S.inbox.length?`。残り${S.inbox.length}件は、選ぶ必要があります`:''}`:'まとめて読める出来事はありません');};
render=(o=>function(){const r=o.apply(this,arguments);try{if(S&&S.inbox.length>=2){const h=document.querySelector('#app .sec h2');const one=S.inbox.filter(e=>{try{const v=EV[e.type]&&EV[e.type].r(e.data);return v&&(v.ch||[]).length===1;}catch(x){return false;}}).length;
  if(h&&/月初の出来事/.test(h.textContent)&&one>=2&&!document.querySelector('#app .readeasy'))h.insertAdjacentHTML('afterend',`<button class="btn sm readeasy" data-act="readEasy" style="margin:-4px 0 8px">選ぶ必要のない${one}件を、まとめて読む</button>`);}}catch(e){}return r;})(render);
/* ---- 8. セーブスロット (3) in the settings ---- */
const SLOTK=i=>'kure-slot-'+i;
function slotInfo(i){try{const s=JSON.parse(localStorage.getItem(SLOTK(i))||'null');if(!s)return null;return `${Y(s.t)}年${M(s.t)}月・${s.part===1?s.parent.name:(s.child&&s.child.name)||''}・資金${yen(s.money)}`;}catch(e){return null;}}
openSettings=(o=>function(){const r=o.apply(this,arguments);try{if(!S)return r;const g=document.querySelector('.stg .grp.danger');if(g)g.insertAdjacentHTML('beforebegin',`<div class="grp"><div class="gh">セーブスロット</div>${[1,2,3].map(i=>{const inf=slotInfo(i);return `<div class="ro"><div class="tx"><b>スロット${i}</b><small>${inf?esc(inf):'空き'}</small></div><button class="sm" data-act="slotSave" data-i="${i}">保存</button>${inf?`<button class="sm" data-act="slotLoad" data-i="${i}">読み込む</button>`:''}</div>`;}).join('')}</div>`);}catch(e){}return r;})(openSettings);
ACT.slotSave=d=>{try{save();localStorage.setItem(SLOTK(d.i),localStorage.getItem(SAVE_KEY));toast(`スロット${d.i}に保存しました`);openSettings();}catch(e){toast('保存できませんでした');}};
ACT.slotLoad=d=>{const inf=slotInfo(d.i);openModal(`<h2>スロット${d.i}を読み込む</h2><p>${esc(inf||'')}</p><p class="muted">今の進行は、保存していなければ失われます。</p><div class="row"><button class="btn" data-act="close">やめる</button><span class="sp"></span><button class="btn warn" data-act="slotLoadOk" data-i="${d.i}">読み込む</button></div>`,{lock:true});};
ACT.slotLoadOk=d=>{try{const v=localStorage.getItem(SLOTK(d.i));if(!v)return;localStorage.setItem(SAVE_KEY,v);location.reload();}catch(e){toast('読み込めませんでした');}};
