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
EV.debutTalk=(o=>({...o,r:d=>{const v=o.r(d);if(!v)return v;const h=HZ(d.hid);d.js=d.js||debutJs(h);return {...v,body:v.body+'\n\n鞍上は、あなたが決めてください。',ch:[...d.js.map(j=>`${debutLabel(j)}に頼む`),'騎手は、厩舎に任せる']};},
  f:(d,i)=>{const h=HZ(d.hid);if(!h)return '';h.debutTalked=1;trust(h.trainer,3);const j=(d.js||[])[i];
    if(j){h.mainJ=j;trust(j,6);return `${j==='hinata'?'日向「…ありがとうございます！ 絶対に、いい競馬をします」':`${JNAME(j)}「デビュー戦、任せてください」`}\n\n${h.name}の主戦は${JNAME(j)}に決まった。厩舎タブで「レース」を選び、メイクデビュー戦に出走させよう。`;}
    return '厩舎タブで「レース」を選び、メイクデビュー戦に出走させよう。';}}))(EV.debutTalk);
EV.debutJ={r:d=>{const h=HZ(d.hid);if(!h||h.starts>0||h.status!=='現役'||h.debutTalked)return null;const tr=h.trainer,tn=P(tr)?P(tr).n.split(' ')[0]:'調教師';d.js=d.js||debutJs(h);
  return{p:tr,from:who(tr),title:`${h.name}、デビューへ`,body:`${tn}です。${h.name}がゲート試験に受かりました。そろそろデビューです。\n\n鞍上は、どうしましょう。`,ch:[...d.js.map(j=>`${debutLabel(j)}に頼む`),'厩舎に任せる']};},
  f:(d,i)=>{const h=HZ(d.hid);if(!h)return '';h.debutTalked=1;const j=(d.js||[])[i];if(j){h.mainJ=j;trust(j,4);return `${h.name}の主戦は${JNAME(j)}に決まった。`;}return '';}};
storyTriggers=(o=>function(first){const r=o.apply(this,arguments);try{racing().filter(h=>h.owner==='me'&&!h.first&&h.status==='現役'&&h.starts===0&&!h.debutTalked&&!h.mainJ).slice(0,2).forEach(h=>{
  if(racesFor(h).some(x=>x.debut)&&!S.inbox.some(e=>e.type==='debutJ'&&e.data.hid===h.id))pushEv('debutJ',{hid:h.id});});}catch(e){}return r;})(storyTriggers);
