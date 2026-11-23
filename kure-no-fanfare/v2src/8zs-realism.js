/* =========================================================
   中央競馬は、そう簡単には走れない:
   ・新馬戦・未勝利戦は出走馬が多く、出馬投票しても除外されることがある（夏〜秋の3歳未勝利は特に）。
     除外されると次は優先して出られる。前走5着以内の馬も優先。
   ・重賞（G2・G3）は収得賞金が足りないと抽選。
   ・デビューの前にゲート試験。落ちたら翌月に受け直し（最初の一頭だけは、一度で受かる）。
   ・3歳の9月で未勝利戦が終わる。勝てていない馬は、格上挑戦・地方へ移籍・引退のどれかを決める。
   ・厩舎の馬房には限りがあり、自分の馬を預けられる頭数に上限がある（名前が売れると一頭増える）。
   ========================================================= */
/* ---------- 除外 ---------- */
function exPrio(h,r){if((h.exN||0)>0)return '除外明けの優先出走';const l=(h.rec||[])[0];if(l&&S.t-l.t<=2&&l.pos<=5&&(l.gr==='新馬'||l.gr==='未勝利'))return '前走5着以内で優先出走';return '';}
function exChance(h,r){if(!r||r.g||r.abroad||r.local||r.jump)return 0;const m=M(S.t),a=ageOf(h);let p=0;
  if(r.kakuage)p=.5;
  else if(r.grade==='新馬')p=a===2?(m<=8?.18:.3):.42;
  else if(r.grade==='未勝利')p=a===2?.25:(m<=6?.35:.55);
  else return 0;
  const pr=exPrio(h,r);if(pr)p*=(h.exN||0)>=2?0:.3;return p;}
/* ---------- 重賞の抽選 ---------- */
function gradedLot(h,r){if(!r||!r.g||r.grade==='G1'||r.abroad||r.local||r.jump)return null;const th=r.grp==='2'?900:r.grp==='3'?1500:2800;
  if((h.earn||0)>=th||(h.g1||0)>0||(h.pri&&h.pri[r.key]))return null;return{st:'抽選',why:'収得賞金が足りず抽選（当選率およそ45%）',p:.45};}
entryStatus=(o=>function(h,r){const st=o.apply(this,arguments);try{if(st.st!=='確定'||st.why)return st;const gl=gradedLot(h,r);if(gl)return gl;
  const p=exChance(h,r);if(p>0){const pr=exPrio(h,r);return{st:'確定',why:pr?`${pr}（除外の心配はほぼない）`:`頭数が多く、除外の可能性 約${Math.round(p*100)}%`,ex:p};}}catch(e){}return st;})(entryStatus);
/* the registration list: the exclusion note in amber, not green */
drawReg=(o=>function(){const r=o.apply(this,arguments);try{document.querySelectorAll('.chip.good').forEach(c=>{if(/除外の可能性/.test(c.textContent)){c.classList.remove('good');c.classList.add('warn');}});}catch(e){}return r;})(drawReg);
/* 出馬投票: on race day the field is drawn — excluded horses train instead, and are first in line next time */
let EXQ=null;
beginRaces=(o=>function(){const out=[];try{for(const [hid,od] of Object.entries(S.month.orders||{})){if(!od||od.type!=='race'||!od.race)continue;const h=HZ(+hid);if(!h||h.owner!=='me'||h.status!=='現役')continue;
    const st=entryStatus(h,od.race);
    if(st.st==='抽選'&&!od.lotOk&&od.race.grade!=='G1'){if(R()>(st.p||.45)){out.push({h,race:od.race,why:'抽選に外れた'});S.month.orders[hid]={type:'train',int:'普通'};continue;}od.lotOk=1;}
    if(st.ex&&R()<st.ex){h.exN=(h.exN||0)+1;out.push({h,race:od.race,why:'除外'});S.month.orders[hid]={type:'train',int:'普通'};continue;}
    h.exN=0;}}catch(e){console.error('ex',e);}
  if(!out.length)return o.apply(this,arguments);
  EXQ=()=>o.apply(this,[]);
  const lines=out.map(x=>x.why==='除外'?`・${x.h.name}（${x.race.name}）…出走希望が多く、除外。${(x.h.exN||0)>=2?'次は必ず出られる。':'次は優先して出られる。'}`:`・${x.h.name}（${x.race.name}）…収得賞金が足りず抽選になり、外れた。`);
  const tn=(()=>{const h=out[0].h;return P(h.trainer)?P(h.trainer).n.split(' ')[0]:'調教師';})();
  openModal(`<div class="from-line">出馬投票の結果　${dstr(S.t)}</div><h2>今月は出られない馬がいる</h2><div class="letter">${esc(lines.join('\n'))}\n\n${esc(tn)}「${esc(vpk('exq'+S.t,['仕方ありません。この時期はどこも馬が多くて。','残念ですが、次は優先されます。仕上がりは落とさずにいきます。','除外も競馬のうちです。調教で一本、いいのを入れておきます。']))}」\n\n出られなかった馬は、今月は調教にあてる。</div>
    <div class="row"><span class="sp"></span><button class="btn pri" data-act="exGo">わかった</button></div>`,{lock:true});
  return undefined;})(beginRaces);
ACT.exGo=()=>{closeModal();const f=EXQ;EXQ=null;if(f)f();};
/* the G1 shortcut in the registration already draws the lot; a graded race's lot is drawn there too, at its own odds */
ACT.regOk=(o=>function(){const rg=UI.reg,h=rg&&HZ(rg.hid),race=h&&racesFor(h).find(r=>r.key===rg.key);if(!race||!rg.j)return o.apply(this,arguments);
  const st=entryStatus(h,race);if(st.st!=='抽選'||race.grade==='G1')return o.apply(this,arguments);
  if(R()>(st.p||.45)){S.month.lot=S.month.lot||{};S.month.lot[h.id+race.key]=1;rg.key=null;rg.j=null;save();drawReg();toast(`${race.name}は抽選で外れてしまった`);return;}
  toast(`抽選を突破。${race.name}に出られる`);S.month.orders[h.id]={type:'race',race,j:rg.j,tac:'おまかせ',lotOk:1};save();closeModal();render();})(ACT.regOk);
/* ---------- ゲート試験 ---------- */
let GATE_BYPASS=false;
racesFor=(o=>function(h){if(GATE_BYPASS||!h||h.owner!=='me')return o.apply(this,arguments);
  if(h.starts>0||h.debutTalked)h.gateOk=1;
  if(h.starts===0&&!h.gateOk)return [];
  /* 未勝利戦が終わった馬の格上挑戦: 1勝クラスに出られる（ただし除外されやすい） */
  if(h.kakuage&&h.wins===0&&h.status==='現役'){const L=o.call(this,{...h,wins:1,cls:Math.max(2,h.cls||0)}).filter(r=>!r.g);L.forEach(r=>{r.kakuage=1;r.key='k-'+r.key;});return L;}
  return o.apply(this,arguments);})(racesFor);
EV.gateFail={r:d=>{const h=HZ(d.hid);if(!h||h.status!=='現役'||h.gateOk)return null;const tr=h.trainer,tn=P(tr)?P(tr).n.split(' ')[0]:'調教師';
  const why=vpk(h.id+'gf'+S.t,[`ゲートの中でじっとしていられず、暴れてしまいました。`,`ゲートは出たのですが、出が遅くて合格の基準に届きませんでした。`,`枠入りを嫌がって、なかなか入ってくれませんでした。`,`中で立ち上がってしまって…。怪我はありません。`]);
  return{p:tr,from:who(tr),title:`${h.name}、ゲート試験は不合格`,body:`${tn}です。\n\n${h.name}のゲート試験、今回は落ちてしまいました。${why}\n\n${(h.gateFail||0)>=2?'少し時間がかかっていますが、練習のたびに良くなっています。':'珍しいことではありません。'}もう一度練習して、来月受け直します。`,ch:['「焦らず、もう一度」']};},
  f:(d,i)=>{const h=HZ(d.hid);if(h&&h.trainer)trust(h.trainer,1);return '来月、もう一度ゲート試験を受ける。';}};
/* ---------- 未勝利戦の終わり ---------- */
EV.misho={r:d=>{const h=HZ(d.hid);if(!h||h.status!=='現役'||h.wins>0||h.mslDone)return null;const tr=h.trainer,tn=P(tr)?P(tr).n.split(' ')[0]:'調教師';
  return{p:tr,from:who(tr),title:`${h.name}の、これから`,body:`${tn}です。\n\n3歳の未勝利戦が、先月で終わりました。${h.name}は${h.starts?`${h.starts}戦して、勝てずじまいでした。`:'結局、一度も走れませんでした。'}\n\n道は三つです。\n・1勝クラスに格上挑戦する（出られても相手は強く、除外も多い）\n・地方競馬へ移籍させる（向こうで2勝すれば、中央に戻ってこられます）\n・ここで引退させる\n\nオーナーが決めてください。`,
    ch:['「1勝クラスに挑戦させる」','「地方へ移籍させる」','「引退させる」']};},
  f:(d,i)=>{const h=HZ(d.hid);if(!h)return '';h.mslDone=1;
    if(i===0){h.kakuage=1;return `${h.name}は1勝クラスへの格上挑戦を続ける。除外されやすいが、出られれば勝つチャンスはある。`;}
    if(i===1){h.status='移籍';h.mainJ=null;S.money+=50;log(`${h.name}が地方競馬へ移籍`);return `${h.name}は地方競馬へ移籍した（移籍先から50万円）。向こうで元気に走ってくれるといい。`;}
    return retireHorse(h);}};
/* ---------- 月の初めに ---------- */
beginMonth=(o=>function(first){try{if(S&&!first){
    /* ゲート試験 (before the debut letters go out) */
    mine().filter(h=>h.status==='現役'&&h.starts===0&&!h.gateOk&&!h.debutTalked).forEach(h=>{GATE_BYPASS=true;let can=false;try{can=racesFor(h).length>0;}finally{GATE_BYPASS=false;}if(!can)return;
      const n=h.gateFail||0,p=h.first&&!n?1:Math.min(.95,(.74+n*.1)-(h.temper==='気難しい'?.15:0));
      if(R()<p){h.gateOk=1;}else{h.gateFail=n+1;pushEv('gateFail',{hid:h.id});}});
    /* 未勝利戦の終わり: 3歳10月（またはそれ以降）で未勝利の馬 */
    const m=M(S.t);mine().filter(h=>h.status==='現役'&&h.wins===0&&!h.mslDone&&!h.kakuage&&(ageOf(h)>3||(ageOf(h)===3&&m>=10))).forEach(h=>{if(!S.inbox.some(e=>e.type==='misho'&&e.data.hid===h.id))pushEv('misho',{hid:h.id});});
  }}catch(e){console.error('realism',e);}return o.apply(this,arguments);})(beginMonth);
/* ---------- 厩舎の馬房 ---------- */
const STALLS={togawa:2,hayase:3,koyanagi:3,washio:2,shibahara:3,kitami:2};
function stallRoom(id){const cap=(STALLS[id]||3)+((S.fame||0)>=40?1:0),n=mine().filter(h=>h.trainer===id&&['現役','放牧','休養'].includes(h.status)).length;return cap-n;}
if(EV.nyukyu){const n0=EV.nyukyu;EV.nyukyu={...n0,r:d=>{const v=n0.r(d);if(!v)return v;const tl=trainersAvail();let ok=tl.filter(id=>stallRoom(id)>0);if(!ok.length)ok=[tl.slice().sort((a,b)=>stallRoom(b)-stallRoom(a))[0]];d.tl=ok;
    const no=tl.filter(id=>!ok.includes(id));return{...v,body:v.body+(no.length?`\n\n${no.map(id=>`${who(id)}厩舎は、オーナーの馬ですでに馬房が埋まっていて、今回は預かれないそうです。`).join('\n')}`:''),ch:ok.map(id=>`${who(id)}厩舎へ`)};},
  f:(d,i)=>{const h=HZ(d.hid);const id=(d.tl||trainersAvail())[i]||(d.tl||trainersAvail())[0];h.trainer=id;h.status='現役';h.ev=evalHorse(h);trust(id,3);if(h.unnamed)return `${h.name}は${who(id)}厩舎に入った。厩舎タブで名前を付けよう。`;return `${h.name}は${who(id)}厩舎に入った。ゲート試験に受かれば、6月からデビューできる。`;}};}
