/* =========================================================
   主戦は簡単には替わらない / デビュー戦の騎手は自分で選ぶ
   ・「また乗せてください」の申し出は、主戦がいない馬か、主戦がしばらく（直近3戦）乗っていない馬にだけ来る
   ・騎乗依頼の取り合いの電話は年に1回まで。出られなかったときに主戦が外れることはない
   ・どの馬もデビューの前に、調教師から「鞍上をどうするか」の相談が来る。騎手を選ぶと、その騎手が主戦になる
   ========================================================= */
if(EV.mainAsk){const h0=EV.mainAsk;EV.mainAsk={...h0,r:d=>{const h=HZ(d.hid);if(h&&h.mainJ&&h.mainJ!=='stable'&&P(h.mainJ)){const n=P(h.mainJ).n;if((h.rec||[]).slice(0,3).some(x=>x.j===n))return null;}return h0.r(d);}};}
if(CALLS.bargain)CALLS.bargain.miss=d=>{trust(d.who,-2);return '騎手から着信があったようだ。折り返すと「今回は、そちらを優先します」とのことだった。';};
/* the debut: pick the rider */
function debutJs(h){const L=jockeysAvail().filter(j=>j!=='stable'&&JK(j)&&!(JK(j).ban>S.t)&&!(typeof jockeyAway==='function'&&jockeyAway(j)));
  const tr=TR(h.trainer)&&TR(h.trainer).jk;const score=j=>(j===h.mainJ?1000:0)+(j==='hinata'?300:0)+(j===tr?200:0)+(P(j)?P(j).trust:0)+JK(j).sk*.5;return L.sort((a,b)=>score(b)-score(a)).slice(0,4);}
function debutLabel(j){return `${JNAME(j)}（${typeof jTier==='function'?jTier(j):''}${JK(j).tag?'・'+JK(j).tag:''}）`;}
EV.debutTalk=(o=>({...o,r:d=>{const v=o.r(d);if(!v)return v;const h=HZ(d.hid);d.js=d.js||debutJs(h);return {...v,body:v.body,ch:[...d.js.map(j=>`${debutLabel(j)}に頼む`),'騎手は、厩舎に任せる']};},
  f:(d,i)=>{const h=HZ(d.hid);if(!h)return '';h.debutTalked=1;trust(h.trainer,3);const j=(d.js||[])[i];
    if(j){h.mainJ=j;trust(j,6);return `${j==='hinata'?'日向「…ありがとうございます！ 絶対に、いい競馬をします」':`${JNAME(j)}「デビュー戦、任せてください」`}\n\n${h.name}の主戦は${JNAME(j)}に決まった。厩舎タブで「レース」を選び、メイクデビュー戦に出走させよう。`;}
    return '厩舎タブで「レース」を選び、メイクデビュー戦に出走させよう。';}}))(EV.debutTalk);
EV.debutJ={r:d=>{const h=HZ(d.hid);if(!h||h.starts>0||h.status!=='現役'||h.debutTalked)return null;const tr=h.trainer,tn=P(tr)?P(tr).n.split(' ')[0]:'調教師';d.js=d.js||debutJs(h);
  return{p:tr,from:who(tr),title:`${h.name}、デビューへ`,body:`${tn}です。${h.name}がゲート試験に受かりました。そろそろデビューです。\n\n鞍上は、どうしましょう。`,ch:[...d.js.map(j=>`${debutLabel(j)}に頼む`),'厩舎に任せる']};},
  f:(d,i)=>{const h=HZ(d.hid);if(!h)return '';h.debutTalked=1;const j=(d.js||[])[i];if(j){h.mainJ=j;trust(j,4);return `${h.name}の主戦は${JNAME(j)}に決まった。`;}return '';}};
storyTriggers=(o=>function(first){const r=o.apply(this,arguments);try{racing().filter(h=>h.owner==='me'&&!h.first&&h.status==='現役'&&h.starts===0&&!h.debutTalked&&!h.mainJ).slice(0,2).forEach(h=>{
  if(racesFor(h).some(x=>x.debut)&&!S.inbox.some(e=>e.type==='debutJ'&&e.data.hid===h.id))pushEv('debutJ',{hid:h.id});});}catch(e){}return r;})(storyTriggers);
/* the rider chosen for the debut also rides this month: the trainer may already have entered the horse (with another jockey)
   before the letter was read, so that entry is switched to the new main rider (if he is free) */
function debutApplyJ(h){try{const o=S.month&&S.month.orders&&S.month.orders[h.id];if(!o||o.type!=='race'||!h.mainJ||o.j===h.mainJ)return;
  const race=racesFor(h).find(r=>r.key===(o.race&&o.race.key))||o.race;const [ok]=askJockey(h.mainJ,h,race);if(ok)o.j=h.mainJ;}catch(e){}}
['debutTalk','debutJ'].forEach(k=>{const e=EV[k];if(!e)return;const f0=e.f;e.f=(d,i)=>{const r=f0(d,i);const h=HZ(d.hid);if(h)debutApplyJ(h);return r;};});
/* and every month, an entry the trainer made keeps to the main rider whenever he can ride */
planOmakase=(o=>function(){const r=o.apply(this,arguments);try{Object.entries(S.month.orders||{}).forEach(([k,od])=>{const h=HZ(+k);if(h&&od.type==='race'&&od.by==='trainer')debutApplyJ(h);});}catch(e){}return r;})(planOmakase);
/* who would actually take the ride: a top jockey doesn't ride an unraced horse of an owner nobody knows.
   The same yardstick as a normal riding request (trust, the owner's standing, what the horse has shown), without the dice */
function wouldRide(j,h){if(j==='stable')return true;const p=P(j),k=JK(j);if(!p||!k)return false;if(h.mainJ===j)return true;
  const tr=TR(h.trainer);if(tr&&tr.jk===j)return true;if(j==='hinata'&&(p.trust>=40||k.sk<80))return true;
  const ab=Math.max(0,ability(h,h.dist||1800,h.surf||'芝')-50)*.8;const score=p.trust*.6+(S.fame||0)*.3+ab+(h.g1||0)*10+(h.wins||0)*2+6;return score>=(k.need??20);}
debutJs=(o=>function(h){const all=jockeysAvail().filter(j=>j!=='stable'&&JK(j)&&!(JK(j).ban>S.t)&&!(typeof jockeyAway==='function'&&jockeyAway(j)));
  const ok=all.filter(j=>wouldRide(j,h));const tr=TR(h.trainer)&&TR(h.trainer).jk;const score=j=>(j===h.mainJ?1000:0)+(j==='hinata'?300:0)+(j===tr?200:0)+(P(j)?P(j).trust:0)+JK(j).sk*.3;
  return ok.sort((a,b)=>score(b)-score(a)).slice(0,4);})(debutJs);
if(CALLS.jkAsk){const s0=CALLS.jkAsk.setup;CALLS.jkAsk.setup=()=>{const d=s0();if(!d)return d;const h=HZ(d.hid);if(!h)return null;
  if(wouldRide(d.who,h))return d;const js=jockeysAvail().filter(j=>j!=='stable'&&wouldRide(j,h)&&j!==TR(h.trainer)?.jk);if(!js.length)return null;d.who=pick(js);return d;};}
