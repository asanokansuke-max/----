/* =========================================================
   UI
   ========================================================= */
let sid=0;
function silk(sl,size=30){
  sl=sl||{a:'#888',b:'#ccc',p:'無地'};const id='sk'+(sid++),a=sl.a,b=sl.b;let pat='';
  switch(sl.p){
    case '縦縞':pat=[12,18,24].map(x=>`<rect x="${x}" y="0" width="3.2" height="40" fill="${b}"/>`).join('');break;
    case '襷':pat=`<path d="M10 6 L15 6 L31 38 L25 38Z" fill="${b}"/>`;break;
    case '一本輪':pat=`<rect x="0" y="18" width="40" height="6" fill="${b}"/>`;break;
    case '山形':pat=`<path d="M8 21 L20 13 L32 21 L32 26 L20 18 L8 26Z" fill="${b}"/>`;break;
    case '水玉':pat=[[15,14],[25,14],[20,22],[15,30],[25,30]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.3" fill="${b}"/>`).join('');break;
  }
  const body='M12 6 L16 4 Q20 7.5 24 4 L28 6 L30 38 L10 38Z';
  return `<svg class="silk" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true"><defs><clipPath id="${id}"><path d="${body}"/></clipPath></defs><path d="M12 6 L3 16 L7 21 L11.5 15Z" fill="${b}" stroke="rgba(0,0,0,.45)" stroke-width=".8"/><path d="M28 6 L37 16 L33 21 L28.5 15Z" fill="${b}" stroke="rgba(0,0,0,.45)" stroke-width=".8"/><g clip-path="url(#${id})"><rect width="40" height="40" fill="${a}"/>${pat}</g><path d="${body}" fill="none" stroke="rgba(0,0,0,.45)" stroke-width=".8"/></svg>`;
}
function horseSVG(h,size=88){
  const c=COATS[h.coat]||COATS['鹿毛'];const foal=['当歳','1歳'].includes(h.status);
  const halter=(h.silks||S.silks).a;
  const sc=foal?' transform="translate(8 14) scale(.86)"':'';
  return `<svg class="hsvg" width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true"><g${sc}>
  <path d="M66 30 C76 40 82 62 84 100 L64 100 C62 82 62 66 66 56Z" fill="${c.m}"/>
  <path d="M60 22 L61 5 L68 19Z" fill="${c.c}" stroke="${c.m}" stroke-width="1"/><path d="M65 25 L72 9 L73 27Z" fill="${c.c}" stroke="${c.m}" stroke-width="1"/>
  <path d="M62 100 C61 82 62 68 66 57 C70 47 70 38 65 29 L59 21 C54 15 46 14 40 18 C32 24 25 36 19 47 C15 55 14 62 18 66 C22 70 30 70 37 66 C43 62 47 61 50 63 C54 68 54 82 52 100Z" fill="${c.c}"/>
  ${h.blaze?'<path d="M51 19 C47 27 37 42 27 56 L31 59 C41 46 50 31 54 21Z" fill="#f4f1ea" opacity=".95"/>':''}
  <path d="M60 22 C58 18 54 17 52 19 C56 19 58 21 60 22Z" fill="${c.m}"/>
  <circle cx="47" cy="31" r="2.8" fill="#120c08"/><circle cx="46" cy="30" r=".9" fill="#fff"/>
  <ellipse cx="21" cy="60" rx="2.2" ry="1.4" fill="#120c08" opacity=".8"/><path d="M18 66 C22 67 26 66 29 64" stroke="#120c08" stroke-width="1" fill="none" opacity=".6"/>
  <path d="M27 52 L50 40 L58 25" stroke="${halter}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M22 53 C27 49 33 50 34 57" stroke="${halter}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  </g></svg>`;
}
function avatar(id,size=44){const p=P(id);if(!p)return '';return `<span class="av" style="width:${size}px;height:${size}px;background:${p.col};font-size:${size*.42}px" aria-hidden="true">${p.ini}</span>`;}
function gradeBadge(g){return `<span class="gr ${/^G/.test(g)?g:g==='OP'?'OP':'c'}">${g}</span>`;}
function toast(s){const el=$('#toast');el.textContent=s;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2200);}
function trustBar(v,w=90){return `<span class="tbar" style="width:${w}px"><i style="width:${clamp(v,0,100)}%"></i></span>`;}
const hearts=b=>'<span class="hearts" aria-label="なつき '+Math.round(b)+'">'+[20,45,70,90].map(x=>`<i class="${b>=x?'on':''}">♥</i>`).join('')+'</span>';

const nb=t=>String(t).split('　').map(x=>`<span class="nw">${esc(x)}</span>`).join('　');
let MLOCK=false;
function openModal(html,o={}){const sh=$('#sheet');sh.className='sheet'+(o.wide?' wide':'');sh.innerHTML=html;$('#modal').hidden=false;MLOCK=!!o.lock;$('#modal').scrollTop=0;}
function closeModal(){$('#modal').hidden=true;$('#sheet').innerHTML='';MLOCK=false;}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal'&&!MLOCK){if(UI.bid&&!UI.bid.done){ACT.pass();return;}closeModal();render();}});

/* ---------- main render ---------- */
function arimaCountdown(){const n=(12-M(S.t))%12;return n===0?'今月、有馬記念':`有馬記念まで あと${n}か月`;}
const ICON={
  stable:'<path d="M3 11 12 4l9 7v9H3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 20v-6h6v6" fill="none" stroke="currentColor" stroke-width="2"/>',
  farm:'<path d="M3 20c3-6 6-9 9-9s6 3 9 9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="6" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/>',
  people:'<circle cx="9" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 20c1-4 4-6 7-6s6 2 7 6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/>',
  more:'<circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/>',
  gear:'<circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2"/>'};
const ico=k=>`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;
const MORE_TABS=[['blood','血統'],['sched','日程'],['book','記録']];
function actBar(){
  const nIn=S.inbox.length,m=M(S.t),nxt=M(S.t+1);
  const races=Object.values(S.month.orders).filter(o=>o.type==='race');
  const toArima=(12-m+12)%12;
  const prog=Math.round(((m-1)/11)*100);
  let main,sub,cls='';
  if(nIn){main='お知らせを読む';sub=`まだ目を通していない出来事が ${nIn}件`;cls='warn';}
  else if(races.length){main='レースへ';sub=`出走 ${races.length}頭${races.some(o=>o.race.g)?`・${races.filter(o=>o.race.g).map(o=>o.race.name).join('・')}`:''}`;cls='race';}
  else{main=`${nxt}月へ進む`;sub=S.month.met?'今月は人にも会った':'まだ誰にも会っていない';}
  return `<button class="actbar ${cls}" data-act="advance">
    <span class="ab-cal"><small>${Y(S.t)}</small><b>${m}<i>月</i></b></span>
    <span class="ab-txt"><b>${main}</b><small>${esc(sub)}</small>
      <span class="ab-meta"><span class="ab-prog" aria-hidden="true"><i style="width:${prog}%"></i></span><em>${toArima?`有馬まで ${toArima}か月`:'今月 有馬記念'}</em></span></span>
    <span class="ab-go" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  </button>`;
}
function render(){
  if(!S){renderStart();return;}
  const nIn=S.inbox.length;
  const navTab=['stable','farm','people'].includes(UI.tab)?UI.tab:'more';
  const sub=['blood','sched','book','sale'].includes(UI.tab)?`<div class="subtabs">${[...(S.sale?[['sale','セリ']]:[]),...MORE_TABS].map(([k,l])=>`<button class="stab" data-act="tab" data-tab="${k}" aria-current="${UI.tab===k}">${l}</button>`).join('')}</div>`:'';
  $('#app').innerHTML=`<header class="top"><div class="top-in">
    <div class="hd1">${silk(S.silks,30)}<div class="hd-t"><b class="num">${dstr(S.t)}</b><small>${S.part===1?'第一部 父の代':'第二部 子の代'}・${yearNo()}年目</small></div><span class="sp"></span><div class="hd-money"><small>資金</small><b class="num">${yen(S.money)}</b></div></div>
    <div class="hd2"><span class="countdown">${arimaCountdown()}</span><span class="hd-fame">馬主の格 ${Math.round(S.fame)}</span><span class="sp"></span><span id="hdslot"></span><button class="iconbtn" data-act="settings" aria-label="設定">${ico('gear')}</button></div></div></header>
    <main>${sub}${({stable:vStable,farm:vFarm,people:vPeople,blood:vBlood,sched:vSched,book:vBook,sale:vSale}[UI.tab]||vStable)()}</main>
    <div class="dock">${actBar()}
    <nav class="bnav4" aria-label="画面">
      ${[['stable','厩舎'],['farm','牧場'],['people','人脈'],['more','その他']].map(([k,l])=>`<button class="bn-i" data-act="tab" data-tab="${k==='more'?(S.sale?'sale':'book'):k}" aria-current="${navTab===k}">${ico(k)}<span>${l}</span>${k==='stable'&&nIn?`<i class="dotb">${nIn}</i>`:''}${k==='more'&&S.sale?'<i class="dotb">!</i>':''}</button>`).join('')}
    </nav></div>`;
}
function openSettings(){openModal(`<h2>設定</h2><div class="field"><label>サウンド</label><div id="audslot"></div></div>
  <div class="field"><label>進行</label><div class="muted" style="font-size:13px">進行はこのブラウザに自動で保存されます。</div></div>
  <div class="choices"><button class="btn" data-act="quitAsk">馬主を退く</button><button class="btn warn" data-act="resetAsk">最初からやり直す</button></div>
  <div class="row"><span class="sp"></span><button class="btn pri" data-act="close">閉じる</button></div>`);if(typeof audioBar==="function")audioBar();}
function steps(){
  const nIn=S.inbox.length,nRace=Object.values(S.month.orders).filter(o=>o.type==='race').length;
  const met=S.month.met||S.restPenalty>0;
  return `<ol class="steps"><li class="${nIn?'now':'done'}">出来事${nIn?`<small>${nIn}件</small>`:''}</li><li class="${nIn?'':'now'}">厩舎の指示${nRace?`<small>出走${nRace}</small>`:''}</li><li class="${met?'done':''}">人に会う${S.restPenalty>0?'<small>療養中</small>':''}</li><li>月を進める</li></ol>`;
}
function vStable(){
  const nIn=S.inbox.length;
  const act=racing().filter(h=>h.status!=='引退');
  return `${steps()}${nIn?`<section class="sec"><h2>月初の出来事<small>すべて目を通すと、月を進められます</small></h2><div class="mails">${S.inbox.map(e=>{const v=EV[e.type].r(e.data);if(!v)return'';return `<button class="mail" data-act="ev" data-id="${e.id}">${v.p?avatar(v.p,38):''}<span style="min-width:0"><span class="from">${esc(v.from)}</span><br><span class="ttl">${esc(v.title)}</span></span></button>`;}).join('')}</div></section>`:''}
  ${S.sale?`<div class="panel banner"><b>${S.sale.kind}</b><span class="muted">${S.sale.blocked?'療養中のため参加できない':'今月だけ開催'}</span><span class="sp"></span><button class="btn gold" data-act="tab" data-tab="sale">セリ会場へ</button></div>`:''}
  ${S.restPenalty>0?`<div class="panel banner warnb">${esc(S.parent.name)}は療養中（あと${S.restPenalty}か月）。人に会えず、セリにも行けない。本業の収入も半分になる。</div>`:''}
  <section class="sec"><h2>厩舎<small>馬ごとに今月の指示を出す。月々の預託料 ${yen(monthlyCost())}</small></h2>
  ${act.length?`<div class="grid2">${act.map(hCard).join('')}</div>`:'<div class="panel muted">現役の馬がいません。セリ（4月・7月）か、牧場の馬の入厩を待ちましょう。</div>'}</section>
  <section class="sec"><h2>ニュース</h2><div class="panel news"><ul>${S.news.slice(0,10).map(n=>`<li><span class="num">${dstr(n.t)}</span><span>${esc(n.s)}</span></li>`).join('')||'<li class="muted">まだ何もない</li>'}</ul></div></section>`;
}
function knownText(h){
  const k=h.known,out=[];
  out.push(`距離 ${k.dist?`${h.surf==='ダ'?'ダート':'芝'}${h.dist}m前後`:'？'}`);
  out.push(`脚質 ${k.style?h.style:'？'}`);
  out.push(`気性 ${k.temper?h.temper:'？'}`);
  out.push(`成長 ${k.growth?h.growth:'？'}`);
  if(k.going)out.push(`重馬場 ${h.heavy>=1?'得意':h.heavy<=-1?'苦手':'普通'}`);
  return out.join('　');
}
function workText(h){
  if(!h.work.length)return '<span class="muted">まだ追い切りの記録がない</span>';
  return h.work.slice(0,3).map((w,i)=>`<span class="${i?'muted':''}">${i?'':'<b>'}坂路 <span class="num">${w.t4}</span>－<span class="num">${w.t1}</span>${i?'':'</b>'}（${w.int}）</span>`).join('　');
}
function orderBox(h,omk){
  const o=S.month.orders[h.id];if(!o)return '';
  const who=omk?`${esc(P(h.trainer).n.split(' ')[0])}の判断`:'今月の指示';
  const kind=o.type==='race'?'出走':o.type==='rest'?'放牧':'調教';
  const rows=o.type==='race'?[['レース',`${gradeBadge(o.race.grade)} ${esc(o.race.name)}`],['コース',`${o.race.course}　${o.race.surf==='ダ'?'ダート':'芝'}${o.race.dist}m`],['騎手',esc(JNAME(o.j))]]
    :o.type==='rest'?[['内容','牧場で疲れを取る（1か月）']]:[['内容',`${o.int}で乗る`]];
  const note=omk&&typeof PH==='function'&&PH().mails.some(m=>m.type==='plan'&&m.t===S.t&&m.d&&m.d.items.some(x=>x.hid===h.id)&&!m.read)?'<span class="chip warn">スマホに連絡あり</span>':'';
  return `<div class="planbox"><div class="pb-h"><span>${who}</span><b>${kind}</b>${note}</div><dl>${rows.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`;
}
function orderText(h){
  const o=S.month.orders[h.id];if(!o)return '';
  if(o.type==='race')return `<span class="nw">${gradeBadge(o.race.grade)} <b>${esc(o.race.name)}</b></span> <span class="nw">${o.race.course}${o.race.surf}${o.race.dist}m</span>　<span class="nw">騎手 ${esc(JNAME(o.j))}</span>`;
  if(o.type==='rest')return '放牧に出して休ませる';
  return `調教（${o.int}）`;
}
function hCard(h){
  const a=ageOf(h),o=S.month.orders[h.id],ev=h.ev;
  const status=h.status==='現役'?'':`<span class="chip ${h.status==='休養'?'bad':'warn'}">${h.status}${h.rest?`・あと${h.rest}か月`:''}</span>`;
  const evh=ev?`<div class="evgrid">${STATS.map(k=>`<span><small>${SL[k]}</small><b>${ev.sym[k]}</b></span>`).join('')}</div><div class="evc">${avatar(h.trainer,22)} 「${esc(ev.comment)}」</div>`:'<div class="muted">調教師の評価は来月から</div>';
  const omk=h.mode==='omakase';
  const orderUI=h.status!=='現役'?'':omk?orderBox(h,true):
    `<div class="ctl-l">今月の指示</div><div class="order-ctl seggroup" role="group" aria-label="今月の指示">
      ${['軽め','普通','強め'].map(x=>`<button class="seg ${o&&o.type==='train'&&o.int===x?'on':''}" data-act="ord" data-hid="${h.id}" data-ty="train" data-int="${x}" aria-label="調教${x}">${x}</button>`).join('')}
      <button class="seg ${o&&o.type==='rest'?'on':''}" data-act="ord" data-hid="${h.id}" data-ty="rest">放牧</button>
      <button class="seg ${o&&o.type==='race'?'on':''}" data-act="reg" data-hid="${h.id}" ${racesFor(h).length?'':'disabled'}>出走</button></div>
      ${o&&o.type==='race'?orderBox(h,false):''}`;
  return `<article class="panel horse">
   <div class="hhead"><button class="portrait" data-act="touch" data-hid="${h.id}" aria-label="${esc(h.name)}に会いに行く">${horseSVG(h,72)}</button><div style="min-width:0;flex:1"><h3>${esc(h.name)}</h3><div class="meta">${nb(`${h.sex}${a}・${h.coat}　${CLSN[h.cls]}　父 ${ST(h.sire)?.n||''}`)}</div><div class="row" style="gap:6px;margin-top:4px">${status}<span class="chip">${esc(P(h.trainer)?.n||'厩舎未定')}</span>${h.mainJ?`<span class="chip">主戦 ${esc(JNAME(h.mainJ))}</span>`:''}${h.g1?`<span class="gr G1">G1 ${h.g1}勝</span>`:''}${hearts(h.bond)}</div></div></div>
   ${evh}
   <details class="more"><summary>くわしく（追い切り・わかったこと・戦績）</summary><dl class="kv"><dt>追い切り</dt><dd>${workText(h)}</dd><dt>わかったこと</dt><dd>${knownText(h)}</dd>${h.knownLikes.length?`<dt>好き嫌い</dt><dd>${h.knownLikes.map(x=>esc(x)).join('　')}</dd>`:''}<dt>戦績</dt><dd>${h.starts}戦${h.wins}勝　獲得 ${yen(h.earn)}　ファン ${h.fans.toLocaleString()}人${h.gw.length?`<br><span class="muted">${esc(h.gw.slice(-4).join('・'))}</span>`:''}</dd></dl></details>
   <div class="mode2 seggroup"><button class="seg sm ${omk?'':'on'}" data-act="mode" data-hid="${h.id}" data-m="self">自分で決める</button><button class="seg sm ${omk?'on':''}" data-act="mode" data-hid="${h.id}" data-m="omakase">調教師にお任せ</button></div>
   ${orderUI}
   <div class="cardfoot"><button class="btn pri2" data-act="touch" data-hid="${h.id}">会いに行く<span class="cnt">${S.month.touched[h.id]||0}/3</span></button><button class="btn" data-act="manage" data-hid="${h.id}">管理</button></div>
  </article>`;
}
function vFarm(){
  const farmName=S.br.farm==='abandon'?'大手牧場（預託）':'中原牧場';
  const mares=mine().filter(h=>h.status==='繁殖');
  const young=mine().filter(h=>['当歳','1歳','育成'].includes(h.status));
  const fc=(h)=>`<article class="panel horse farm">
    <div class="hhead"><button class="portrait" data-act="touch" data-hid="${h.id}" aria-label="${esc(h.name)}に会いに行く">${horseSVG(h,64)}</button><div style="min-width:0;flex:1"><h3>${esc(h.name)}</h3><div class="meta">${nb(`${h.sex}${ageOf(h)}・${h.coat}　${h.status}　父 ${ST(h.sire)?.n||''}　母 ${h.damName}`)}</div><div class="row" style="gap:6px;margin-top:4px">${h.breeder==='中原'?'<span class="chip">中原牧場生まれ</span>':''}${h.bredBy?`<span class="chip">${h.bredBy==='parent'?'父が配合':'子が配合'}</span>`:''}${hearts(h.bond)}</div></div></div>
    ${h.status==='繁殖'?`<div>${h.preg?`<b>受胎中</b>　<span class="nw">父 ${esc(ST(h.preg.sire).n)}</span>　<span class="nw">${dstr(h.preg.due)}ごろ出産予定</span>`:'空胎。2〜5月に種付けの相談が来る'}${h.tip?`<br><span class="muted">中原のおすすめ：${esc(ST(h.tip)?.n||'')}</span>`:''}</div><div class="muted">競走成績 ${h.starts}戦${h.wins}勝　${esc(h.gw.join('・'))}　子：${mine().filter(x=>x.dam===h.id).map(x=>esc(x.name)).join('、')||'まだいない'}</div>`:
      `${h.eye?`<div class="eyebox"><div class="eyehd">${avatar(h.eye.who,24)}<span>${esc(P(h.eye.who).n.split(' ')[0])}の見立て</span><b class="evalg">${h.eye.g}</b></div><div class="eyetx">${esc(h.eye.notes.join('。'))}。</div></div>`:''}<div class="muted">${h.status==='育成'?'4月にトレセンへ入厩する':h.status==='1歳'?'来年、2歳の春に入厩':'まだ母のそばにいる'}</div>`}
    <div class="cardfoot ${h.unnamed||(h.status!=='繁殖'&&h.starts===0)?'':'solo'}"><button class="btn pri2" data-act="touch" data-hid="${h.id}">会いに行く<span class="cnt">${S.month.touched[h.id]||0}/3</span></button>${h.unnamed||(h.status!=='繁殖'&&h.starts===0)?`<button class="btn" data-act="rename" data-hid="${h.id}">名前</button>`:''}</div></article>`;
  return `<section class="sec"><h2>${farmName}<small>月々 1頭 ${yen(S.br.farm==='abandon'?55:30)}</small></h2>
    ${S.br.farm==='abandon'?'<div class="panel muted">中原牧場は閉鎖された。繁殖牝馬と若駒は大手牧場に預けている。</div>':''}</section>
   <section class="sec"><h2>繁殖牝馬<small>引退した牝馬を繁殖に上げられる</small></h2>${mares.length?`<div class="grid2">${mares.map(fc).join('')}</div>`:'<div class="panel muted">まだいません。牝馬が引退するとき「繁殖牝馬にする」を選ぶと、ここに来ます。</div>'}</section>
   <section class="sec"><h2>仔馬・デビュー前の馬</h2>${young.length?`<div class="grid2">${young.map(fc).join('')}</div>`:'<div class="panel muted">いません。</div>'}</section>`;
}
function vPeople(){
  return `<section class="sec"><h2>人脈<small>月に一人だけ会いに行ける。信頼が深いほど、話が深くなる</small></h2>
   <div class="grid3">${peopleList().map(id=>{const p=P(id),why=canMeet(id);return `<article class="panel person">
     <div class="row">${avatar(id,46)}<div style="min-width:0;flex:1"><b>${esc(p.n)}</b><div class="meta">${esc(p.role)}</div></div></div>
     <div class="row" style="gap:8px"><span class="muted" style="font-size:12px">信頼</span>${trustBar(p.trust)}<span class="num">${Math.round(p.trust)}</span>${S.part===2&&p.t1!=null&&id!=='mikuni'?`<span class="muted" style="font-size:11px">父の代 ${Math.round(p.t1)}</span>`:''}</div>
     <div class="row"><span class="muted" style="font-size:12px">${esc(why)}</span><span class="sp"></span><button class="btn sm" data-act="meet" data-id="${id}" ${why?'disabled':''}>会いに行く</button></div></article>`;}).join('')}</div></section>
   <section class="sec"><h2>騎手の腕</h2><div class="panel muted" style="font-size:13px">${Object.keys(S.jockeys).filter(id=>!(S.part===2&&id==='washio')&&!(id==='komori'&&!S.flags.komori)).sort((a,b)=>JK(b).sk-JK(a).sk).map(id=>`<b>${esc(P(id).n)}</b>　${jTier(id)}・${esc(JK(id).tag||'')}　あなたの馬で ${JK(id).rides}騎乗${JK(id).wins}勝${P(id).met?'':'　<span class="chip">まだ面識がない</span>'}`).join('<br>')}</div></section>`;
}
function vBlood(){
  const all=mine();const byDam={};all.forEach(h=>{if(h.dam!=null)(byDam[h.dam]=byDam[h.dam]||[]).push(h);});
  const roots=all.filter(h=>h.dam==null||!HZ(h.dam)).filter(h=>byDam[h.id]||h.status==='繁殖'||h.sex==='牝');
  const node=(h,d)=>`<li><span class="bn">${horseSVG(h,26)}<b>${esc(h.name)}</b><span class="muted">${h.sex}・父 ${esc(ST(h.sire)?.n||'')}</span>${h.bredBy?`<span class="chip">${h.bredBy==='parent'?'父の配合':'子の配合'}</span>`:''}${h.g1?`<span class="gr G1">G1</span>`:''}<span class="muted">${h.status}</span></span>${byDam[h.id]?`<ul>${byDam[h.id].map(c=>node(c,d+1)).join('')}</ul>`:''}</li>`;
  const studs=S.stallions.filter(s=>s.own||s.fromSold);
  return `<section class="sec"><h2>血統<small>母から子へ、二代かけて血がつながる</small></h2>
   ${roots.length?`<div class="panel tree"><ul>${roots.map(r=>node(r,0)).join('')}</ul></div>`:'<div class="panel muted">まだ家系図はありません。牝馬を繁殖に上げ、種付けをすると、ここに血のつながりが描かれていきます。</div>'}</section>
   ${studs.length?`<section class="sec"><h2>ゆかりの種牡馬</h2><div class="panel news"><ul>${studs.map(s=>`<li><span><b>${esc(s.n)}</b>　${s.fromSold?'九条に売った馬':'あなたが育てた馬'}　種付け料 ${yen(stallionFee(s))}</span></li>`).join('')}</ul></div></section>`:''}`;
}
function vSched(){
  const act=racing().filter(h=>h.status!=='引退');
  return `<section class="sec"><h2>重賞・G1の日程</h2><div class="sched">${Array.from({length:12},(_,i)=>i+1).map(m=>`<div class="panel mon ${m===M(S.t)?'cur':''}"><div class="mh">${m}月${m===M(S.t)?'<span class="chip">今月</span>':''}</div>${GR.filter(g=>g.m===m).map(g=>{const fit=act.filter(h=>ageOk(g.age,ageOf(h)+(m<M(S.t)?1:0))&&(!g.sex||h.sex==='牝')&&g.surf===h.surf&&(!h.known.dist||Math.abs(g.dist-h.dist)<=500));return `<div class="sr ${g.n==='有馬記念'?'arima':''}">${gradeBadge(g.gr)} ${esc(g.n)} <span class="muted num">${g.course}${g.surf}${g.dist}</span>${fit.length&&g.gr==='G1'?`<span class="fit">${fit.map(h=>esc(h.name)).join('・')}</span>`:''}</div>`;}).join('')}</div>`).join('')}</div></section>`;
}
function vBook(){
  const gone=mine().filter(h=>['引退','売却','移籍'].includes(h.status));
  const riv=S.rivals.filter(r=>r.status==='現役').sort((a,b)=>b.fans-a.fans).slice(0,12);
  return `<section class="sec"><h2>有馬記念の記録</h2><div class="panel news"><ul>${S.arima.map(a=>`<li><span class="num">${a.y}年</span><span>${a.me?'<b class="gold">':''}${esc(a.w)}${a.me?'</b>':''}　${esc(a.o)}</span></li>`).join('')||'<li class="muted">まだありません</li>'}</ul></div></section>
  <section class="sec"><h2>できごとの年表</h2><div class="panel news"><ul>${S.log.slice(0,60).map(l=>`<li><span class="num">${dstr(l.t)}</span><span>${l.part===2?'<span class="chip">子</span> ':''}${esc(l.text)}</span></li>`).join('')}</ul></div></section>
  <section class="sec"><h2>ライバル</h2><div class="tbl-wrap"><table><thead><tr><th>馬名</th><th>馬主</th><th>性齢</th><th>得意</th><th>成績</th><th class="r">ファン</th></tr></thead><tbody>${riv.map(r=>`<tr><td>${silk(r.silks,16)} <b>${esc(r.name)}</b>${r.fromSold?' <span class="chip">手放した血</span>':''}</td><td>${OWN[r.owner].n}</td><td>${r.sex}${ageOf(r)}</td><td>${r.surf}${r.dist} ${r.style}</td><td>${r.starts}戦${r.wins}勝 ${esc(r.gw.slice(-2).join('・'))}</td><td class="r num">${r.fans.toLocaleString()}</td></tr>`).join('')}</tbody></table></div></section>
  ${gone.length?`<section class="sec"><h2>引退した馬・去った馬</h2><div class="panel news"><ul>${gone.map(h=>`<li><span>${horseSVG(h,22)}</span><span><b>${esc(h.name)}</b>　${h.starts}戦${h.wins}勝　${esc(h.gw.join('・'))}（${h.status}）</span></li>`).join('')}</ul></div></section>`:''}
  <section class="sec"><div class="row"><span class="muted" style="font-size:12px">進行はこのブラウザに自動で保存されます。</span><span class="sp"></span>${S.flags.condResultOnly?'<button class="btn sm" data-act="condWatch">条件戦も観に行く</button>':''}<button class="btn sm" data-act="quitAsk">馬主を退く</button><button class="btn sm warn" data-act="resetAsk">最初からやり直す</button></div></section>`;
}
function vSale(){
  if(!S.sale)return '<div class="panel muted">セリは開かれていません。</div>';
  const blk=S.sale.blocked;
  return `<section class="sec"><h2>${S.sale.kind}<small>${blk?'療養中のため参加できない':'今月だけ。参加しなかった馬は他の馬主が落札する'}</small></h2>
   <div class="grid2">${S.sale.lots.map(l=>{const h=l.h;return `<article class="panel lot"><div class="row"><span class="no">${l.no}</span>${horseSVG(h,54)}<div style="min-width:0;flex:1"><b>父 ${esc(ST(h.sire).n)}</b><div class="meta">母 ${esc(h.damName)}　${h.sex}${ageOf(h)}・${h.coat}</div></div><div style="text-align:center"><div class="evalg">${l.eye.g}</div><div class="meta">${esc(P(l.eye.who).n.split(' ')[0])}の見立て</div></div></div>
    <ul class="notes">${l.eye.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>
    <div class="row"><span>予想 <b class="num">${yen(l.lo)}〜${yen(l.hi)}</b></span><span class="sp"></span>${l.res?`<span class="chip ${l.res.w==='me'?'good':''}">${l.res.w==='me'?'落札（あなた）':l.res.w?`${OWN[l.res.w].n}が落札`:'主取り'} ${l.res.price?yen(l.res.price):''}</span>`:`<button class="btn gold" data-act="lot" data-no="${l.no}" ${blk?'disabled':''}>競りに参加</button>`}</div></article>`;}).join('')}</div></section>`;
}

/* ---------- registration ---------- */
const jTier=id=>{const k=JK(id).sk;return k>=88?'超一流':k>=80?'一流':k>=72?'中堅':'若手';};
function drawReg(){
  const rg=UI.reg,h=HZ(rg.hid);const races=racesFor(h);const race=races.find(r=>r.key===rg.key);
  const rlist=races.map(r=>{
    const st=entryStatus(h,r);const tru=P(h.trainer).trust;
    const diff=ability(h,r.dist,r.surf)-r.mean+(hash(h.id+r.key+S.t)-.5)*Math.max(2,(100-tru)*.12);
    const lv=diff>5?['楽な相手','good']:diff>1?['勝負になる','good']:diff>-3?['互角','']:diff>-7?['苦戦しそう','warn']:['格上挑戦','bad'];
    const failed=S.month.lot&&S.month.lot[h.id+r.key];
    return `<button class="mail" data-act="regRace" data-key="${esc(r.key)}" ${st.st==='不可'||failed?'disabled':''} style="${rg.key===r.key?'border-color:var(--accent);background:var(--accent-soft)':''}">
      <span style="min-width:0;flex:1"><span class="ttl">${gradeBadge(r.grade)} ${esc(r.name)}</span> <span class="muted num">${r.course} ${r.surf==='ダ'?'ダ':'芝'}${r.dist}m</span><br>
      <span class="row" style="font-size:12px;gap:6px"><span class="chip ${lv[1]}">${lv[0]}</span><span class="muted">1着 ${yen(r.prize)}</span>${st.why?`<span class="chip ${st.st==='確定'?'good':st.st==='抽選'?'warn':'bad'}">${esc(st.why)}</span>`:''}${failed?'<span class="chip bad">抽選に外れた</span>':''}</span></span></button>`;}).join('');
  let jsec='';
  if(race){
    jsec=`<h3 class="h3">騎手を依頼する</h3><div class="jlist">${jockeysAvail().map(jid=>{
      const key=h.id+'-'+jid+'-'+race.key,res=S.month.asked&&S.month.asked[key];
      const tags=[h.mainJ===jid?'主戦':'',TR(h.trainer)&&TR(h.trainer).jk===jid?'厩舎の主戦':''].filter(Boolean);
      return `<div class="jrow ${rg.j===jid?'on':''}">${jid==='stable'?'<span class="av" style="width:30px;height:30px;background:var(--muted);font-size:13px">厩</span>':avatar(jid,30)}<div class="jinfo"><b>${esc(JNAME(jid))}</b><span class="jmeta">${jid!=='stable'?`${jTier(jid)}・${esc(JK(jid).tag||'')}・信頼 ${Math.round(P(jid).trust)}`:'いつでも乗れる'}${tags.length?`　${tags.join('・')}`:''}</span></div>
        <div class="jact">${rg.j===jid?'<span class="chip good">騎乗決定</span>':res?'<span class="chip bad">断られた</span>':jid!=='stable'&&jockeyAway(jid)?'<span class="chip">不在</span>':`<button class="btn sm" data-act="askJ" data-jid="${jid}">依頼する</button>`}</div></div>`;}).join('')}</div>${rg.msg?`<div class="comment">${esc(rg.msg)}</div>`:''}
      ${race.grade==='G1'&&h.mainJ==='hinata'&&rg.j&&rg.j!=='hinata'?'<div class="comment warnc">主戦の日向を、G1で降ろすことになる。</div>':''}`;
  }
  openModal(`<div class="from-line">出走の相談　${dstr(S.t)}</div><div class="row">${horseSVG(h,40)}<h2>${esc(h.name)}</h2><span class="chip">${COND[h.cond-1]}</span><span class="chip ${h.fat>45?'warn':''}">疲れ ${h.fat>60?'大':h.fat>35?'中':'小'}</span></div>
   <div class="muted" style="font-size:12px">${knownText(h)}　（相手関係は調教師の見立て。信頼が低いとぼやける）</div>
   <div class="mails">${rlist||'<div class="muted">今月出られるレースはない</div>'}</div>${jsec}
   <div class="row"><button class="btn" data-act="close">閉じる</button><span class="sp"></span><button class="btn pri" data-act="regOk" ${race&&rg.j?'':'disabled'}>この内容で出走</button></div>`,{wide:true});
}

/* ---------- conversation ---------- */
function drawTalk(){
  const t=UI.talk,p=P(t.id),MAX=3;
  const vid=(t.id==='washio'&&S.part===2)?'washio_t':t.id;
  if(!t.greet){const g=V(vid,'greet',{i:tierNow(t.id)});const sg=situGreet(t.id);t.greet=[g,sg].filter(Boolean);}
  let ctl='';
  if(t.pending){ctl=`<div class="choices">${t.pending.r.map((x,i)=>`<button class="btn" data-act="reply" data-i="${i}">${esc(x[0])}</button>`).join('')}</div>`;}
  else if(t.giftPick){ctl=`<div class="touchbtns">${GIFTS.map(g=>`<button class="btn" data-act="gift" data-g="${g}">${g}</button>`).join('')}</div><div class="row"><span class="sp"></span><button class="btn sm" data-act="giftCancel">やめる</button></div>`;}
  else if(t.done<MAX){
    const tps=topicsFor(t.id).filter(tp=>!t.used.includes(tp.id)).slice(0,3);
    const dl=!t.small&&dialogFor(t.id);
    ctl=`<div class="choices">${dl?'<button class="btn pri" data-act="small">世間話をする</button>':''}${tps.map(tp=>`<button class="btn" data-act="topic" data-tp="${tp.id}">${esc(tp.label)}</button>`).join('')}${!t.gift&&GIFT_PREF[t.id]?`<button class="btn" data-act="giftOpen" ${S.money<30?'disabled':''}>手土産を渡す（30万円）</button>`:''}</div>`;
  }
  openModal(`<div class="talkhead">${avatar(t.id,64)}<div><div class="from-line">${esc(p.role)}</div><h2>${esc(p.n)}</h2><div class="row" style="gap:6px"><span class="muted" style="font-size:12px">信頼</span>${trustBar(p.trust)}<span class="num">${Math.round(p.trust)}</span></div></div></div>
   <div class="talklog">${[...t.greet.map(g=>`<p class="line them">${esc(g)}</p>`),...t.log].join('')}</div>
   ${ctl}
   <div class="row"><span class="muted" style="font-size:12px">${t.pending?'どう返す？':t.done>=MAX?'そろそろ時間だ。':`あと${MAX-t.done}つ話せる`}</span><span class="sp"></span>${t.pending||t.giftPick?'':`<button class="btn ${t.done?'pri':''}" data-act="talkEnd">${t.done?'別れる':'今日はやめておく'}</button>`}</div>`,{lock:true});
  const lg=$('.talklog');if(lg)lg.scrollTop=lg.scrollHeight;
}
/* ---------- touching ---------- */
function drawTouch(){
  const t=UI.touch,h=HZ(t.hid);const used=S.month.touched[h.id]||0;
  const acts=TOUCH.filter(a=>!(['当歳'].includes(h.status)&&a==='曳き運動'));
  const place=['当歳','1歳','育成','繁殖'].includes(h.status)?(S.br.farm==='abandon'?'大手牧場の放牧地':'中原牧場の放牧地'):h.status==='放牧'?'放牧先の牧場':`${P(h.trainer)?.n.split(' ')[0]||''}厩舎の馬房`;
  openModal(`<div class="from-line">${esc(place)}</div>
   <div class="touchstage">${horseSVG(h,150)}<div style="min-width:0"><h2>${esc(h.name)}</h2><div class="meta">${h.sex}${ageOf(h)}・${h.coat}${h.blaze?'・流星':''}</div><div class="row" style="gap:6px;margin-top:6px"><span class="muted" style="font-size:12px">なつき</span>${hearts(h.bond)}</div>
   ${h.knownLikes.length?`<div class="muted" style="font-size:12px;margin-top:6px">${h.knownLikes.map(esc).join('　')}</div>`:'<div class="muted" style="font-size:12px;margin-top:6px">何が好きなのか、まだわからない</div>'}</div></div>
   <div class="talklog">${t.log.join('')||`<p class="line">${esc(h.status==='繁殖'?`${h.name}がゆっくりと顔を上げた。`:h.bond>=60?`あなたの足音に気づいて、${h.name}が顔を出した。`:`${h.name}は、こちらをじっと見ている。`)}</p>`}</div>
   <div class="touchbtns">${acts.map(a=>`<button class="btn" data-act="touchDo" data-a="${a}" ${used>=3?'disabled':''}>${a==='にんじん'||a==='りんご'?a+'をあげる':a==='曳き運動'?'いっしょに歩く':a}</button>`).join('')}</div>
   <div class="row"><span class="muted" style="font-size:12px">${used>=3?'今月はたっぷり触れ合った。':`今月はあと${3-used}回`}　なつくと調子が上がりやすく、気難しい馬もレースで落ち着く</span><span class="sp"></span><button class="btn pri" data-act="touchEnd">戻る</button></div>`,{lock:true});
  const lg=$('.talklog');if(lg)lg.scrollTop=lg.scrollHeight;
}

/* ---------- auction ---------- */
function drawBid(){
  const b=UI.bid,l=S.sale.lots.find(x=>x.no===b.no),h=l.h,inc=incOf(b.price);
  const leaderName=b.leader==='me'?'あなた':b.leader?OWN[b.leader].n:'—';
  const next=b.leader?b.price+inc:b.price;
  openModal(`<div class="from-line">${S.sale.kind}　上場番号 ${l.no}</div><div class="bidhd">${horseSVG(h,56)}<div style="min-width:0"><h2>父 ${esc(ST(h.sire).n)}　${h.sex}</h2><div class="muted"><span class="nw">母 ${esc(h.damName)}</span>　<span class="nw">見立て <b>${l.eye.g}</b></span><br><span class="nw">予想 ${yen(l.lo)}〜${yen(l.hi)}</span></div></div></div>
   <div class="board"><div class="who">${b.done?'落札':'現在の価格'}</div><div class="price">${yen(b.price)}</div><div class="who">${b.done?(b.leader==='me'?'あなたが落札しました':b.leader?`${leaderName}が落札`:'主取り（買い手なし）'):`最高入札：${leaderName}`}</div></div>
   <div class="bidlog">${[...b.log].reverse().map(x=>`<div>${esc(x)}</div>`).join('')}</div>
   ${b.done?`<div class="row"><span class="sp"></span><button class="btn pri" data-act="closeBid">${b.leader==='me'?'牧場・厩舎を見る':'セリ会場へ戻る'}</button></div>`:
   `<div class="row bidfoot"><span class="muted">手持ち ${yen(S.money)}</span>
     ${b.leader==='me'?'<span class="btn gold" aria-disabled="true">あなたが最高入札中</span>':`<button class="btn gold bidmain" data-act="bid" data-to="${next}" ${next>S.money?'disabled':''}>手を挙げる　<b class="num">${yen(next)}</b></button>`}
     <button class="btn" data-act="bid" data-to="${roundInc(next+5000)}" ${next+5000>S.money||b.leader==='me'?'disabled':''}>＋5000万円</button>
     <button class="btn" data-act="pass">${b.leader==='me'?'ハンマーを待つ':'見送る'}</button></div>`}`,{lock:true});
}
function rivalsRespond(){
  const b=UI.bid,l=S.sale.lots.find(x=>x.no===b.no);
  const rs=l.rv.filter(r=>r.max>=b.price+incOf(b.price)).sort((x,y)=>y.max-x.max);
  if(!rs.length){hammer('me');return;}
  const top=rs[0];let np=b.price+incOf(b.price);
  if(rs[1]&&R()<.5){np=Math.max(np,roundInc(Math.min(top.max,rs[1].max)));b.log.push(`${OWN[rs[1].o].n}も手を挙げる…`);}
  if(top.o==='九条'&&R()<.3&&top.max>np*1.3){np=roundInc(Math.min(top.max,np*1.2));b.log.push('九条の代理人が、一気に値を吊り上げた');}
  b.price=np;b.leader=top.o;b.log.push(`${OWN[top.o].n}　${yen(np)}`);
}
function hammer(w){const b=UI.bid,l=S.sale.lots.find(x=>x.no===b.no);b.done=true;b.leader=w;b.log.push(w==='me'?`カン、と木槌が鳴った。${yen(b.price)}であなたが落札`:'主取り');if(w==='me')lotAward(l,'me',b.price);save();}

/* ---------- races ---------- */
let RQ=[];
function raceHead(r){return `<div class="racehead">${gradeBadge(r.grade)}<h2>${esc(r.name)}</h2><span class="course num">${r.course} ${r.surf==='ダ'?'ダート':'芝'}${r.dist}m・${r.going||'良'}</span></div>`;}
function beginRaces(){
  const groups={};
  for(const [hid,o] of Object.entries(S.month.orders)){if(o.type!=='race')continue;const h=HZ(hid);if(!h||h.status!=='現役')continue;
    if(o.race.key==='有馬記念'&&S.flags.arimaSkipY===Y(S.t))continue;
    (groups[o.race.key]=groups[o.race.key]||{race:{...o.race},ents:[]}).ents.push({h,j:o.j,tac:o.tac});}
  const list=Object.values(groups);
  const rank=g=>g.race.key==='有馬記念'?3:g.race.grade==='G1'?2:g.race.g?1:0;
  RQ=list.sort((a,b)=>rank(a)-rank(b));
  nextRace();
}
function nextRace(){
  if(!RQ.length){finishMonth();return;}
  const g=RQ.shift();
  UI.race={race:g.race,field:buildField(g.race,g.ents)};
  UI.race.watched=S.restPenalty<=0;
  if(g.race.key==='有馬記念')showArimaPrelude();
  else if(g.race.grade==='G1')showPaddock();
  else showTrackGate();
}
/* 条件戦・重賞: 競馬場へ行くか、結果だけ聞くか */
function showTrackGate(){
  const RC=UI.race,r=RC.race,my=RC.field.filter(f=>f.mine);
  if(!r.g&&S.flags.condResultOnly){runSim(RC);RC.watched=false;showResult();return;}
  const sick=S.restPenalty>0;
  const rows=RC.field.map(f=>`<tr class="${f.mine?'me':''}"><td class="num">${f.no}</td><td>${f.mine||f.rival?silk(f.silks,16):''} ${esc(f.name)}</td><td>${esc(f.jname)}</td><td class="r num">${f.odds.toFixed(1)}</td><td class="r num">${f.pop}</td></tr>`).join('');
  openModal(`<div class="from-line">${dstr(S.t)}　${esc(r.course)}競馬場</div>${raceHead(r)}
   ${my.map(f=>`<div class="panel row">${horseSVG(f.h,44)}<div style="min-width:0;flex:1"><b>${esc(f.name)}</b>　<span class="chip">${f.pop}番人気</span><div class="muted" style="font-size:13px">騎手 ${esc(f.jname)}　${f.h.bond>=60?`${esc(f.name)}が、パドックであなたを見つけて首を振った。`:f.h.cond>=4?'毛づやがいい。気配は上々だ。':f.h.cond<=2?'少し元気がないように見える。':'落ち着いて周回している。'}</div></div></div>`).join('')}
   ${sick?'<div class="comment warnc">療養中のため、病室のテレビで観戦する。</div>':''}
   <div class="tbl-wrap"><table><thead><tr><th>馬番</th><th>馬名</th><th>騎手</th><th class="r">単勝</th><th class="r">人気</th></tr></thead><tbody>${rows}</tbody></table></div>
   <div class="row">${!r.g?'<label class="muted" style="font-size:12px"><input type="checkbox" id="condskip"> 次から条件戦は結果だけ聞く</label>':''}<span class="sp"></span><button class="btn" data-act="watch" data-w="0">結果だけ聞く</button><button class="btn pri" data-act="watch" data-w="1">${sick?'テレビで観る':'レースを観る'}</button></div>`,{wide:true,lock:true});
}
function showArimaPrelude(){
  const my=UI.race.field.find(f=>f.mine);
  const txt=S.part===1?`十二月の中山。冬の陽が、もうスタンドの屋根の向こうに傾きかけている。\n\n${S.parent.name}は、パドックの柵をつかんだまま動かなかった。子どもの頃、父親に手を引かれて、同じ柵の前に立った。\n\n三國が隣で言った。「${my.name}、いい顔をしています」`:
    S.parent.fate==='rest'?`十二月の中山。\n\n三國が押す車椅子で、${S.parent.name}がスタンドに来ていた。医者は止めたが、聞かなかったらしい。\n\n「${cName()}」父が、初めて名前を呼んだ気がした。「…楽しんでこい」`:
    `十二月の中山。\n\n三國が、小さな写真立てを胸に抱いていた。${S.parent.name}の写真だ。\n\n「お父様、きっとどこかで見ています」\n\n胸ポケットの手紙が、少しだけ重く感じた。`;
  openModal(`<div class="from-line">有馬記念当日</div><h2 class="arima-t">暮れの中山</h2><div class="letter">${esc(txt)}</div><div class="row"><span class="sp"></span><button class="btn gold" data-act="paddock">パドックへ</button></div>`,{lock:true});
}
function showPaddock(){
  const RC=UI.race,r=RC.race,my=RC.field.filter(f=>f.mine);
  const rows=RC.field.map(f=>`<tr class="${f.mine?'me':''}"><td class="num">${f.no}</td><td>${f.mine||f.rival?silk(f.silks,16):''} ${esc(f.name)}${f.rival&&f.h.fromSold?' <span class="chip">手放した血</span>':''}</td><td>${esc(f.jname)}</td><td class="r num">${f.odds.toFixed(1)}</td><td class="r num">${f.pop}</td></tr>`).join('');
  const pad=my.map(f=>{const h=f.h,tr=h.trainer;const say=V(TV(tr),'pad',{i:h.cond>=4?0:h.cond<=2?2:1});
    return `<div class="panel" style="display:grid;gap:8px"><div class="row">${horseSVG(h,44)}<b>${esc(h.name)}</b><span class="chip">${f.pop}番人気</span><span class="chip">${COND[h.cond-1]}</span></div><div class="comment">${avatar(tr,22)} ${esc(P(tr).n)}：${esc(say)}</div>${h.bond>=60?`<div class="muted" style="font-size:13px">パドックを回りながら、${esc(h.name)}がこちらを見つけて首を振った。</div>`:''}</div>`;}).join('');
  openModal(`<div class="from-line">${dstr(S.t)}　パドック</div>${raceHead(r)}<div class="muted">1着賞金 ${yen(r.prize)}　${RC.field.length}頭立て</div>${pad}
   <div class="tbl-wrap"><table><thead><tr><th>馬番</th><th>馬名</th><th>騎手</th><th class="r">単勝</th><th class="r">人気</th></tr></thead><tbody>${rows}</tbody></table></div>
   <div class="row"><span class="sp"></span><button class="btn pri" data-act="warmup">返し馬へ</button></div>`,{wide:true,lock:true});
}
function showWarmup(){
  const RC=UI.race,my=RC.field.filter(f=>f.mine);
  const html=my.map(f=>{const h=f.h,jid=f.jid;
    const v=(k,x={})=>V(jid||'stable',k,{h:h.name,...x});
    const feel=v(h.cond>=4?'feelGood':h.cond<=2?'feelBad':'feelOk');
    const tmp=h.temper==='気難しい'?v(h.bond>=50||jid==='washio'?'hotCalm':'hotWarn'):'';
    const sty=h.known.style?v('styleGo',{s:h.style}):v('styleAsk');
    return `<div class="panel" style="display:grid;gap:8px"><div class="row">${jid&&jid!=='stable'?avatar(jid,32):''}<b>${esc(JNAME(jid))}</b><span class="muted">${esc(h.name)}</span></div>
     <div class="comment">${esc(feel)} ${esc(tmp)} ${esc(sty)}</div>
     <div class="tac" role="radiogroup" aria-label="作戦">${['おまかせ',...STY].map(s=>`<label><input type="radio" name="tac-${h.id}" value="${s}" ${s==='おまかせ'?'checked':''}>${s==='おまかせ'?'騎手に任せる':s}</label>`).join('')}</div></div>`;}).join('');
  openModal(`<div class="from-line">返し馬</div>${raceHead(RC.race)}${html}<div class="muted" style="font-size:12px">直線に入ると「追い出せ！」のバーが出ます。残り距離の印が金色の範囲に入ったら押してください。</div><div class="row"><span class="sp"></span><button class="btn pri" data-act="go">ゲートへ</button></div>`,{wide:true,lock:true});
}
let ANIM=null;
function geom(W,Hh){const r=Hh*.36,Ls=W-2*r-36,cx=W/2,cy=Hh/2;return{r,Ls,cx,cy,P:2*Ls+2*Math.PI*r,sf:Ls*.8};}
function ptAt(g,s,off){
  s=((s%g.P)+g.P)%g.P;const{r,Ls,cx,cy}=g;let x,y,nx,ny;const PR=Math.PI*r;
  if(s<Ls){x=cx-Ls/2+s;y=cy+r;nx=0;ny=1;}
  else if(s<Ls+PR){const th=(s-Ls)/r;nx=Math.sin(th);ny=Math.cos(th);x=cx+Ls/2+r*nx;y=cy+r*ny;}
  else if(s<2*Ls+PR){x=cx+Ls/2-(s-Ls-PR);y=cy-r;nx=0;ny=-1;}
  else{const th=(s-2*Ls-PR)/r;nx=-Math.sin(th);ny=-Math.cos(th);x=cx-Ls/2+r*nx;y=cy+r*ny;}
  return[x+nx*off,y+ny*off];
}
function showResult(){
  const RC=UI.race,race=RC.race,ord=RC.order;
  if(RC.applied)return;RC.applied=true;
  if(race.key==='有馬記念'&&ord[0].mine){
    if(ord.some(f=>f.rival&&f.h.fromSold))S.flags.beatSold=1;
    if(S.part===2&&ord.some(f=>f.rival&&f.h.owner==='九条'))S.flags.beatRei=1;
  }
  const notes=applyRace(RC);if(!RC.boardDone)setTimeout(()=>{try{sKakutei();}catch(e){}},250);
  const greet=RC.watched?ord.filter(f=>f.mine).map(f=>{const h=f.h,b=f.pos===1?6:3;h.bond=clamp(h.bond+b,0,100);
    return f.pos===1?(race.g?`表彰式のあと、口取りの写真に収まった。${h.name}は誇らしげに鼻を鳴らした。`:`ウィナーズサークルで${h.name}を迎えた。汗ばんだ首をなでると、得意げに首を上下させた。`)
      :f.pos<=3?`検量室の前で${h.name}を出迎えた。まだ息は荒いが、目は負けていない。`:`引き上げてきた${h.name}の首を、黙ってなでた。`;}):[];
  save();
  const best=ord.find(f=>f.mine);const win=best&&best.pos===1;
  const rows=ord.map(f=>`<tr class="${f.mine?'me':''}"><td class="num">${f.pos}</td><td class="num">${f.no}</td><td>${f.mine||f.rival?silk(f.silks,16):''} ${esc(f.name)}</td><td>${esc(f.jname)}</td><td class="num">${f.pos===1?timeStr(RC.time):esc(f.margin)}</td><td class="r num">${f.pop}</td></tr>`).join('');
  const arimaLose=race.key==='有馬記念'&&!win;
  openModal(`<div class="from-line">${dstr(S.t)}　確定</div>${raceHead(race)}
   <div class="result-banner ${win?'win':''}"><div class="big">${win?(race.grade==='G1'?`${esc(race.name)}、制覇`:'勝利！'):best?best.pos+'着':''}</div><div class="muted">勝ちタイム ${timeStr(RC.time)}　ペース ${RC.pace}　馬場 ${race.going}</div></div>
   ${payBoard(RC)}
   ${arimaLose?`<div class="letter">${esc(S.part===1?`届かなかった。\n${S.parent.name}は、しばらくゴール板を見つめていた。「…来年だ」三國に、というより、自分に言い聞かせるように。`:`届かなかった。\n${S.parent.fate==='rest'?`車椅子の父が、「いいレースだった」と笑った。`:'三國が、写真立てをそっと胸にしまった。'}`)}</div>`:''}
   ${notes.length?`<div class="panel">${notes.map(n=>`<div>${esc(n)}</div>`).join('')}</div>`:''}
   ${greet.length?`<div class="letter" style="font-size:14px">${greet.map(esc).join('\n')}</div>`:''}
   ${ord.filter(f=>f.mine).map(f=>`<div class="panel" style="display:grid;gap:6px"><div class="row">${horseSVG(f.h,34)}<b>${esc(f.name)}</b><span class="chip">${f.pos}着</span>${f.prize?`<span class="chip good">賞金 ${yen(f.prize)}（取り分 ${yen(f.prize*.8)}）</span>`:''}</div><div class="comment">${f.jid&&f.jid!=='stable'?avatar(f.jid,22):''} <span class="muted">${esc(f.jname)}：</span>${esc(f.comment||'')}</div></div>`).join('')}
   <div class="tbl-wrap"><table><thead><tr><th>着</th><th>馬番</th><th>馬名</th><th>騎手</th><th>着差</th><th class="r">人気</th></tr></thead><tbody>${rows}</tbody></table></div>
   <div class="row"><span class="sp"></span><button class="btn pri" data-act="rnext">${RQ.length?'次のレースへ':'月末へ'}</button></div>`,{wide:true,lock:true});
}
function finishMonth(){
  const w=S.flags.arimaWinPending;
  if(w){S.flags.arimaWinPending=null;const h=HZ(w.hid);const e=makeEnding(h,w.jid,w.time);
    if(S.part===1)S.won.parent={y:Y(S.t),h:h.name,j:JNAME(w.jid),title:e.title};else S.won.child={y:Y(S.t),h:h.name,j:JNAME(w.jid),title:e.title};
    log(`${h.name}、有馬記念制覇。「${e.title}」`);save();showEnding(e);return;}
  const rep=endMonth();
  UI.tab='stable';render();window.scrollTo(0,0);
  if(S.over){showGameOver();return;}
  showReport(rep);
}
function showReport(rep){
  const net=rep.prize+rep.income-rep.cost;
  openModal(`<div class="from-line">月末の報告　三國 透</div><h2>${dstr(rep.t)}の報告</h2>
   <div class="money"><div><span>賞金（取り分）</span><b class="num">${yen(rep.prize)}</b></div><div><span>${S.part===1?'本業からの資金':'収入'}</span><b class="num">${yen(rep.income)}</b></div><div><span>預託料・種付け料など</span><b class="num">−${yen(rep.cost)}</b></div><div class="tot"><span>今月の収支</span><b class="num ${net<0?'neg':''}">${net<0?'':'+'}${yen(net)}</b></div></div>
   ${rep.lines.length?`<div class="panel"><h3 class="h3">レースと厩舎</h3>${rep.lines.map(l=>`<div class="rl">${nb(l)}</div>`).join('')}</div>`:''}
   ${rep.grow.length?`<div class="panel"><h3 class="h3">成長</h3>${rep.grow.map(l=>`<div class="rl">${esc(l)}</div>`).join('')}</div>`:''}
   ${rep.inj.length?`<div class="panel"><h3 class="h3">ケガ</h3>${rep.inj.map(l=>`<div class="rl">${esc(l)}</div>`).join('')}</div>`:''}
   <div class="row"><span class="sp"></span><button class="btn pri" data-act="repOk">${dstr(S.t)}へ</button></div>`,{lock:true});
}
function showEnding(e){
  const final=S.part===2;
  openModal(`<div class="ending"><div class="from-line">${Y(S.t)}年12月　中山競馬場</div>
   <div class="end-silk">${silk(S.silks,72)}</div>
   <div class="end-title">${esc(e.title)}</div>
   <div class="letter end-text">${esc(e.goal)}</div><hr><div class="letter end-text">${esc(e.stand)}</div><hr><div class="letter end-text">${esc(e.after)}</div>
   <p class="muted">${final?'子の代':'父の代'}　${yearNo()}年目　資金 ${yen(S.money)}${e.conds.length>1?`<br>重なった条件：${e.conds.map(esc).join('・')}`:''}</p>
   <div class="row" style="justify-content:center">${final?'<button class="btn" data-act="resetAsk">最初から（別の結末を探す）</button>':''}<button class="btn gold" data-act="endOk">${final?'このまま続ける':'物語は続く'}</button></div></div>`,{lock:true});
}
function showGameOver(){
  openModal(`<div class="ending"><div class="end-title" style="color:var(--bad)">夢の途中で</div><p class="letter end-text">資金が尽きた。\n勝負服は、箪笥の奥にしまわれた。\n\n「…また、いつか」三國はそう言って、深く頭を下げた。</p><div class="row" style="justify-content:center"><button class="btn pri" data-act="resetOk">最初からやり直す</button></div></div>`,{lock:true});
}
function showInterlude(){
  const dead=S.br.health.filter(x=>x==='rest').length<2;
  openModal(`<div class="from-line">幕間</div><h2>三國が、あなたを訪ねてきた</h2>
   <div class="letter">東京の、小さな設計事務所。\n\n${S.parent.name}の子であるあなたは、三十二歳。母を早くに亡くし、父は仕事と馬ばかりの人だった。大学から東京に出て、それきり、ほとんど話していない。\n\n喫茶店の向かいで、三國と名乗る人が頭を下げた。\n\n「${dead?`お父様が、亡くなりました。`:`お父様が倒れられました。命に別状はありませんが、もう馬の仕事はできません。`}\n\nお父様の馬たちを、引き継いでいただけないでしょうか。\n…お父様は、最後まで暮れの中山を見ていました」</div>
   <div class="field"><label for="cname">あなた（子）の名前</label><input type="text" id="cname" maxlength="10" placeholder="例：遥"></div>
   <div class="choices">
    <button class="btn pri" data-act="inherit" data-c="all">全部引き継ぐ（資金は苦しい）</button>
    <button class="btn" data-act="inherit" data-c="sell">一部を手放して引き継ぐ（有力な2頭と牧場の馬を残す）</button>
    <button class="btn" data-act="inherit" data-c="mikuni">三國さんに任せる（序盤はお任せ中心。人との距離が縮まりにくい）</button>
   </div>`,{lock:true});
}

/* ---------- start ---------- */
const START={name:'',kanmei:'アケボノ',silks:{a:SILK_COLORS['紺'],b:SILK_COLORS['橙'],p:'山形'}};
function renderStart(){
  const sw=w=>Object.entries(SILK_COLORS).map(([n,c])=>`<button class="sw" style="background:${c}" aria-label="${n}" aria-pressed="${START.silks[w]===c}" data-act="sw" data-w="${w}" data-c="${c}"></button>`).join('');
  $('#app').innerHTML=`<div class="start">
   <div class="hero"><div class="kicker">親子二代の馬主物語</div><h1><span class="nw">暮れの</span><br><span class="nw">ファンファーレ</span></h1>
    <p>子どもの頃、父親に手を引かれて見た、十二月の中山競馬場。<br>一代で会社を築いたあなたは、還暦を前に馬主になった。<br>小さな牧場の芦毛から、すべてが始まる。</p></div>
   <div class="panel form">
    <div class="field"><label for="f-name">あなた（父）の名前</label><input type="text" id="f-name" maxlength="10" value="${esc(START.name)}" placeholder="例：浅野"></div>
    <div class="field"><label for="f-kan">冠名（馬の名前の頭につける言葉）</label><input type="text" id="f-kan" maxlength="5" value="${esc(START.kanmei)}"></div>
    <div class="field"><label>勝負服（子の代にも受け継がれる）</label>
     <div class="silkprev">${silk(START.silks,76)}</div>
     <div class="muted" style="font-size:12px">胴</div><div class="swatches">${sw('a')}</div>
     <div class="muted" style="font-size:12px">袖・柄</div><div class="swatches">${sw('b')}</div>
     <div class="swatches">${PATTERNS.map(p=>`<button class="btn sm ${START.silks.p===p?'on-b':''}" aria-pressed="${START.silks.p===p}" data-act="pat" data-p="${p}">${p}</button>`).join('')}</div></div>
    <div class="row"><span class="sp"></span><button class="btn pri big-btn" data-act="newGame">馬主になる</button></div>
   </div>
   <div class="muted howto">1ターン＝1か月。毎月、厩舎の馬に指示を出し、月に一人だけ誰かに会いに行く。能力は数字で見えない。調教師の評価、追い切りの時計、騎手のコメント、牧場主の見立てから読み解く。父の代で、あるいは子の代で、有馬記念を勝てば物語は結末を迎える。</div></div>`;
}
function syncStart(){const o=$('#f-name'),k=$('#f-kan');if(o)START.name=o.value;if(k)START.kanmei=k.value;}

/* ---------- actions ---------- */
function openNextEvent(){const nx=S.inbox[0];if(nx)ACT.ev({id:nx.id});else{closeModal();render();}}
function openManage(hid){const h=HZ(hid);const canName=h.starts===0||h.unnamed;
  openModal(`<div class="row" style="gap:12px">${horseSVG(h,52)}<div><h2>${esc(h.name)}</h2><div class="muted" style="font-size:13px">${nb(`${h.sex}${ageOf(h)}　${CLSN[h.cls]}　推定価値 ${yen(value(h))}`)}</div></div></div>
   <div class="choices">${canName?`<button class="btn" data-act="rename" data-hid="${h.id}">名前を変える</button>`:''}<button class="btn" data-act="sell" data-hid="${h.id}">売却する</button><button class="btn warn" data-act="retire" data-hid="${h.id}">引退させる</button></div>
   <div class="row"><button class="btn" data-act="close">閉じる</button></div>`);}
const ACT={
  manage:d=>openManage(+d.hid),
  tab:d=>{UI.tab=d.tab;render();window.scrollTo(0,0);},
  close:()=>{closeModal();render();},
  sw:d=>{syncStart();START.silks[d.w]=d.c;renderStart();},
  pat:d=>{syncStart();START.silks.p=d.p;renderStart();},
  newGame:()=>{syncStart();newGame({name:START.name.trim()||'浅野',kanmei:(START.kanmei.trim()||'アケボノ').slice(0,5),silks:{...START.silks}});startMonthReport();UI.tab='stable';render();openNextEvent();},
  ev:d=>{const e=S.inbox.find(x=>x.id===+d.id);if(!e)return;const v=EV[e.type].r(e.data);
    if(!v){S.inbox=S.inbox.filter(x=>x!==e);save();openNextEvent();return;}
    openModal(`<div class="evhead">${v.p?avatar(v.p,56):''}<div><div class="from-line">${esc(v.from)}</div><h2>${esc(v.title)}</h2></div></div><div class="letter">${esc(v.body)}</div><div class="choices">${v.ch.map((c,i)=>`<button class="btn ${i===0?'pri':''}" data-act="evc" data-id="${e.id}" data-i="${i}">${esc(c)}</button>`).join('')}</div>`,{lock:true});},
  evc:d=>{const e=S.inbox.find(x=>x.id===+d.id);if(!e)return;const out=EV[e.type].f(e.data,+d.i);S.inbox=S.inbox.filter(x=>x!==e);save();
    if(out&&out.next==='interlude'){render();showInterlude();return;}
    render();
    if(out)openModal(`<div class="letter">${esc(out)}</div><div class="row"><span class="sp"></span><button class="btn pri" data-act="evnext">${S.inbox.length?'次へ':'閉じる'}</button></div>`,{lock:true});
    else openNextEvent();},
  evnext:()=>openNextEvent(),
  inherit:d=>{const n=($('#cname').value||'').trim()||'遥';startPart2(n,d.c);save();UI.tab='stable';render();openNextEvent();toast('第二部　子の代');},
  advance:()=>{if(S.inbox.length){toast('先に月初の出来事に目を通してください');openNextEvent();return;}beginRaces();},
  ord:d=>{const h=HZ(d.hid);S.month.orders[h.id]=d.ty==='train'?{type:'train',int:d.int}:{type:'rest'};save();render();},
  mode:d=>{const h=HZ(d.hid);h.mode=d.m;if(d.m==='omakase'){delete S.month.orders[h.id];planOmakaseOne(h);}else S.month.orders[h.id]={type:'train',int:'普通'};save();render();},
  reg:d=>{UI.reg={hid:+d.hid,key:null,j:null,msg:''};drawReg();},
  regRace:d=>{const rg=UI.reg,h=HZ(rg.hid);rg.key=d.key;rg.j=null;rg.msg='';
    const race=racesFor(h).find(r=>r.key===d.key);
    for(const jid of [h.mainJ,TR(h.trainer)&&TR(h.trainer).jk].filter(Boolean)){if(!jockeysAvail().includes(jid))continue;const[ok,msg]=askJockey(jid,h,race);if(ok){rg.j=jid;rg.msg=`${JNAME(jid)}：${msg}`;break;}}
    drawReg();},
  askJ:d=>{const rg=UI.reg,h=HZ(rg.hid),race=racesFor(h).find(r=>r.key===rg.key);
    const key=h.id+'-'+d.jid+'-'+race.key;const[ok,msg]=askJockey(d.jid,h,race);S.month.asked=S.month.asked||{};
    if(ok)rg.j=d.jid;else S.month.asked[key]=1;rg.msg=`${JNAME(d.jid)}：${msg}`;drawReg();},
  regOk:()=>{const rg=UI.reg,h=HZ(rg.hid),race=racesFor(h).find(r=>r.key===rg.key);if(!race||!rg.j)return;
    const st=entryStatus(h,race);
    if(st.st==='抽選'){if(R()>.35){S.month.lot=S.month.lot||{};S.month.lot[h.id+race.key]=1;rg.key=null;rg.j=null;save();drawReg();toast(`${race.name}は抽選で外れてしまった`);return;}toast(`抽選を突破。${race.name}に出られる`);}
    if(race.grade==='G1'&&h.mainJ==='hinata'&&rg.j!=='hinata'){}
    S.month.orders[h.id]={type:'race',race,j:rg.j,tac:'おまかせ'};save();closeModal();render();},
  touch:d=>{UI.touch={hid:+d.hid,log:[]};drawTouch();},
  touchDo:d=>{const h=HZ(UI.touch.hid);const n=S.month.touched[h.id]||0;if(n>=3)return;S.month.touched[h.id]=n+1;const r=touchReact(h,d.a);
    UI.touch.log.push(`<p class="line me">${esc({なでる:'なでた',ブラッシング:'ブラシをかけた',話しかける:'話しかけた',曳き運動:'いっしょに歩いた',にんじん:'にんじんをあげた',りんご:'りんごをあげた'}[d.a])}</p><p class="line">${esc(r.txt)}</p>${r.ms?`<p class="line ms">${esc(r.ms)}</p>`:''}`);save();drawTouch();},
  touchEnd:()=>{UI.touch=null;closeModal();render();},
  meet:d=>{const why=canMeet(d.id);if(why){toast(why);return;}UI.talk={id:d.id,log:[],used:[],done:0};S.month.met=true;S.people[d.id].met=true;save();drawTalk();},
  small:()=>{const t=UI.talk;const dl=dialogFor(t.id);if(!dl)return;t.small=true;t.pending=dl;t.done++;t.log.push(`<p class="line them">${esc(fillQ(dl.q))}</p>`);drawTalk();},
  reply:d=>{const t=UI.talk,dl=t.pending,x=dl.r[+d.i];trust(t.id,x[2]);(S.flags.dlgSeen=S.flags.dlgSeen||{})[t.id]=[...(S.flags.dlgSeen[t.id]||[]),dl.i];
    t.log.push(`<p class="line me">${esc(x[0])}</p><p class="line them">${esc(fillQ(x[1]))}</p>${x[2]>=6?'<p class="line ms">少し、距離が縮まった気がする。</p>':x[2]<0?'<p class="line ng">…少し、気まずい空気が流れた。</p>':''}`);t.pending=null;save();drawTalk();},
  giftOpen:()=>{UI.talk.giftPick=true;drawTalk();},
  giftCancel:()=>{UI.talk.giftPick=false;drawTalk();},
  gift:d=>{const t=UI.talk;S.money-=30;t.gift=true;t.giftPick=false;const r=giftReact(t.id,d.g);trust(t.id,r.d);
    t.log.push(`<p class="line me">${esc(d.g)}を渡した</p><p class="line them">${esc(r.t)}</p>${r.d>=6?'<p class="line ms">好みに合ったようだ。</p>':''}`);save();drawTalk();},
  topic:d=>{const t=UI.talk;const tp=(TOPICS[t.id]||[]).find(x=>x.id===d.tp);if(!tp)return;const r=tp.run();
    trust(t.id,r.d||0);S.topicT[t.id]=S.topicT[t.id]||{};S.topicT[t.id][tp.id]=S.t;t.used.push(tp.id);t.done++;
    t.log.push(`<p class="line me">${esc(tp.label)}</p><p class="line them">${esc(fillQ(r.text))}</p>${r.d>=6?'<p class="line ms">少し、距離が縮まった気がする。</p>':''}`);save();drawTalk();},
  talkEnd:()=>{const t=UI.talk;if(!t.done){S.month.met=false;}UI.talk=null;save();closeModal();render();},
  rename:d=>{const h=HZ(d.hid);openModal(`<h2>名前を付ける</h2><div class="row">${horseSVG(h,60)}<div class="muted">父 ${esc(ST(h.sire).n)}／母 ${esc(h.damName)}</div></div><div class="field"><label for="nm">馬名（9文字まで。カタカナが競馬らしい）</label><input type="text" id="nm" maxlength="9" value="${esc(h.unnamed?S.kanmei:h.name)}"></div>
    <div class="row"><button class="btn" data-act="close">やめる</button><span class="sp"></span><button class="btn pri" data-act="renameOk" data-hid="${h.id}">決定</button></div>`);},
  renameOk:d=>{const h=HZ(d.hid),v=$('#nm').value.trim();if(!v){toast('馬名を入れてください');return;}if(v!==h.name&&usedName(v)){toast('その名前はもう使われています');return;}h.name=v;h.unnamed=false;save();closeModal();render();},
  sell:d=>{const h=HZ(d.hid);const v=roundInc(value(h)*(.85+R()*.25));openModal(`<h2>${esc(h.name)}を手放す</h2><p>買い手から <b>${yen(v)}</b> の提示があった。</p>${h.bond>=60?`<p class="muted">${esc(h.name)}は、あなたにずいぶん懐いている。</p>`:''}<div class="row"><button class="btn" data-act="close">やめる</button><span class="sp"></span><button class="btn warn" data-act="sellOk" data-hid="${h.id}" data-v="${v}">売却する</button></div>`);},
  sellOk:d=>{const h=HZ(d.hid);S.money+=+d.v;h.status='売却';delete S.month.orders[h.id];log(`${h.name}を${yen(+d.v)}で売却`);save();closeModal();render();},
  retire:d=>{const h=HZ(d.hid);openModal(`<h2>${esc(h.name)}を引退させる</h2><p>${h.sex==='牝'?'牧場に帰して、繁殖牝馬にする。この血を次の世代へつなげる。':h.gw.length?'種牡馬として迎えたいという話がある。':'乗馬クラブが引き取ってくれる。'}</p><div class="row"><button class="btn" data-act="close">やめる</button><span class="sp"></span><button class="btn warn" data-act="retireOk" data-hid="${h.id}">引退させる</button></div>`);},
  retireOk:d=>{const h=HZ(d.hid);delete S.month.orders[h.id];const msg=retireHorse(h);save();openModal(`<div class="letter">${esc(msg)}</div><div class="row"><span class="sp"></span><button class="btn pri" data-act="close">閉じる</button></div>`);},
  lot:d=>{const l=S.sale.lots.find(x=>x.no===+d.no);if(!l||l.res||S.sale.blocked)return;UI.bid={no:l.no,price:l.start,leader:null,log:[`上場番号${l.no}、${yen(l.start)}からスタート`],done:false};drawBid();},
  bid:d=>{const b=UI.bid;const to=+d.to;if(to>S.money){toast('資金が足りない');return;}b.price=to;b.leader='me';b.log.push(`あなたが手を挙げた　${yen(to)}`);rivalsRespond();drawBid();},
  pass:()=>{const b=UI.bid,l=S.sale.lots.find(x=>x.no===b.no);
    if(b.leader==='me'){hammer('me');drawBid();return;}
    const floor=b.leader?b.price:l.start;const rs=l.rv.filter(r=>r.max>=floor).sort((x,y)=>y.max-x.max);
    if(!rs.length&&!b.leader){l.res={w:null,price:0};b.done=true;b.leader=null;b.log.push('買い手がつかず、主取り');}
    else{const w=b.leader||rs[0].o;const price=b.leader?b.price:(rs[1]?Math.max(floor,roundInc(Math.min(rs[0].max,rs[1].max+incOf(rs[1].max)))):floor);b.price=price;lotAward(l,w,price);b.done=true;b.leader=w;b.log.push(`${OWN[w].n}が${yen(price)}で落札`);}
    save();drawBid();},
  closeBid:()=>{const me=UI.bid.leader==='me';const l=S.sale.lots.find(x=>x.no===UI.bid.no);UI.bid=null;closeModal();
    if(me){const h=l.h;if(h.status==='現役'&&!h.trainer){S.inbox.unshift({id:S.nid++,type:'nyukyu',data:{hid:h.id}});h.status='育成';}UI.tab=h.status==='1歳'?'farm':'stable';}render();if(me)openNextEvent();},
  paddock:()=>showPaddock(),
  warmup:()=>showWarmup(),
  watch:d=>{const cb=$('#condskip');if(cb&&cb.checked)S.flags.condResultOnly=1;runSim(UI.race);if(d.w==='1')showRaceView(false);else{UI.race.watched=false;showResult();}},
  condWatch:()=>{S.flags.condResultOnly=0;save();render();toast('条件戦もまた観に行く');},
  go:()=>{const RC=UI.race;RC.field.filter(f=>f.mine).forEach(f=>{const el=document.querySelector(`input[name="tac-${f.h.id}"]:checked`);f.tac=el?el.value:'おまかせ';});runSim(RC);showRaceView(true);},
  fast:()=>{ANIM&&ANIM.fast();},
  skip:()=>{ANIM&&ANIM.skip();},
  rnext:()=>nextRace(),
  repOk:()=>{closeModal();UI.tab='stable';render();window.scrollTo(0,0);openNextEvent();},
  endOk:()=>{const rep=endMonth();UI.tab='stable';render();window.scrollTo(0,0);if(S.over){showGameOver();return;}showReport(rep);},
  quitAsk:()=>openModal(`<h2>馬主を退きますか</h2><p>有馬記念には届かないまま、物語を終えます。</p><div class="row"><button class="btn" data-act="close">やめる</button><span class="sp"></span><button class="btn warn" data-act="quitOk">退く</button></div>`),
  quitOk:()=>openModal(`<div class="ending"><div class="end-title">届かなかった夢</div><p class="letter end-text">最後の日、${esc(ownerName())}は厩舎を回って、一頭ずつ首をなでた。\n\n暮れの中山には、とうとう届かなかった。\nそれでも、この${yearNo()}年で出会った人と馬の顔が、ひとつずつ浮かんでは消えた。\n\n三國が言った。「いい夢でした」</p><div class="row" style="justify-content:center"><button class="btn pri" data-act="resetOk">最初から</button></div></div>`,{lock:true}),
  resetAsk:()=>openModal(`<h2>最初からやり直しますか？</h2><p>今の進行は消えます。</p><div class="row"><button class="btn" data-act="close">やめる</button><span class="sp"></span><button class="btn warn" data-act="resetOk">やり直す</button></div>`),
  resetOk:()=>{try{localStorage.removeItem(SAVE_KEY);}catch(e){}S=null;closeModal();UI.tab='stable';render();},
};
function planOmakaseOne(h){planOmakase([h]);if(!S.month.orders[h.id])S.month.orders[h.id]={type:'train',int:'普通',by:'trainer'};}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const f=ACT[b.dataset.act];if(f)f(b.dataset,b);});
load();if(S&&!S.rep)startMonthReport();render();
