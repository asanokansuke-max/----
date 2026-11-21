/* =========================================================
   馬の扱い: 去勢 (セン馬), 馬具 (ブリンカー・メンコ・シャドーロール), 転厩, 外厩, and the everyday illnesses (熱発・疝痛).
   One "手入れ・調整" button in the horse's menu opens them.
   ========================================================= */
openManage=(o=>function(hid){const r=o.apply(this,arguments);try{const h=HZ(hid);if(h&&['現役','放牧','休養'].includes(h.status)){const row=document.querySelector('#sheet .choices');
  if(row)row.insertAdjacentHTML('afterbegin',`<button class="btn pri2" data-act="careOpen" data-hid="${h.id}">手入れ・調整（馬具・去勢・転厩・外厩）</button>`);}}catch(e){}return r;})(openManage);
const GEAR=[['blink','ブリンカー','視界を絞って集中させる。気の散る馬、ズブい馬に'],['menko','メンコ','耳を覆って音を遮る。大観衆で入れ込む馬に'],['shadow','シャドーロール','足もとの影に驚かないように。物見をする馬に']];
function careHTML(h){const g=h.gear||{},tr=h.trainer&&P(h.trainer)?P(h.trainer).n:'—',others=careTrainers().filter(t=>t!==h.trainer);
  return `<div class="from-line">${esc(h.name)}</div><h2>手入れ・調整</h2>
   <div class="panel"><b>馬具</b><div class="muted" style="font-size:12px">次のレースから着ける。合う馬と合わない馬がいる</div>
    <div class="carel">${GEAR.map(([k,n,d])=>`<button class="careb ${g[k]?'on':''}" data-act="gearT" data-hid="${h.id}" data-k="${k}"><b>${n}</b><small>${d}</small><i>${g[k]?'着用中':'着けない'}</i></button>`).join('')}</div></div>
   ${h.sex==='牡'?`<div class="panel"><b>去勢（セン馬にする）</b><div class="muted" style="font-size:12px">気性が穏やかになり、レースに集中しやすくなる。ただし種牡馬にはなれず、クラシック（皐月賞・ダービー・菊花賞）にも出られなくなる。元には戻せない</div>
    <button class="btn warn" data-act="geld" data-hid="${h.id}">去勢する</button></div>`:''}
   <div class="panel"><b>転厩</b><div class="muted" style="font-size:12px">今は ${esc(tr)} 厩舎。厩舎を替えると、前の調教師とは気まずくなり、馬も環境に慣れるまで少し調子を落とす</div>
    <div class="row" style="flex-wrap:wrap;gap:6px">${others.map(t=>`<button class="btn sm" data-act="moveTr" data-hid="${h.id}" data-t="${t}">${esc(P(t).n)}厩舎へ</button>`).join('')||'<span class="muted">移れる厩舎がない</span>'}</div></div>
   <div class="panel"><b>外厩（民間の育成牧場）</b><div class="muted" style="font-size:12px">放牧・休養のときに、設備の整った外厩で調整する。早く・いい状態で戻ってくる。月55万円</div>
    <button class="btn ${h.gaikyu?'pri':''}" data-act="gaiT" data-hid="${h.id}">${h.gaikyu?'外厩を使っている（やめる）':'外厩を使う'}</button></div>
   <div class="row"><button class="btn" data-act="careBack" data-hid="${h.id}">戻る</button></div>`;}
function careTrainers(){const L=trainersAvail();try{if(S.people.shibahara&&S.people.shibahara.met&&!L.includes('shibahara'))L.push('shibahara');if(S.people.kitami&&S.people.kitami.met&&S.fame>=20&&!L.includes('kitami'))L.push('kitami');}catch(e){}return [...new Set(L)];}
(function(){const st=document.createElement('style');st.textContent=`.carel{display:grid;gap:6px;margin-top:8px}.careb{display:grid;grid-template-columns:1fr auto;gap:2px 8px;text-align:left;padding:9px 11px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit}
.careb small{grid-column:1;font-size:11px;color:var(--muted)}.careb i{grid-row:1/span 2;grid-column:2;align-self:center;font-style:normal;font-size:12px;color:var(--muted)}.careb.on{border-color:#1f7a48;background:color-mix(in srgb,#1f7a48 12%,var(--panel))}.careb.on i{color:#1f7a48;font-weight:700}`;document.head.appendChild(st);})();
ACT.careOpen=d=>{const h=HZ(d.hid);if(h)openModal(careHTML(h),{lock:true});};
ACT.careBack=d=>{openManage(+d.hid);};
ACT.gearT=d=>{const h=HZ(d.hid);if(!h)return;h.gear=h.gear||{};h.gear[d.k]=!h.gear[d.k];save();const sh=$('#sheet'),t=sh?sh.scrollTop:0;openModal(careHTML(h),{lock:true,keepScroll:true});if($('#sheet'))$('#sheet').scrollTop=t;};
ACT.geld=d=>{const h=HZ(d.hid);if(!h||h.sex!=='牡')return;openModal(`<h2>${esc(h.name)}を去勢する</h2><p>本当に去勢しますか。元には戻せません。種牡馬にはなれなくなります。</p><div class="row"><button class="btn" data-act="careOpen" data-hid="${h.id}">やめる</button><span class="sp"></span><button class="btn warn" data-act="geldOk" data-hid="${h.id}">去勢する</button></div>`,{lock:true});};
ACT.geldOk=d=>{const h=HZ(d.hid);if(!h)return;h.sex='セ';if(h.temper==='気難しい')h.temper='普通';h.gelded=S.t;h.cond=Math.max(1,(h.cond||3)-1);log(`${h.name}を去勢（セン馬に）`);save();
  openModal(`<div class="letter">${esc(h.name)}は去勢手術を受けた。\n\n${esc(P(h.trainer)?P(h.trainer).n.split(' ')[0]:'調教師')}「…これで、少しは落ち着いて走れるはずです。ここから化ける馬も多いですよ」</div><div class="row"><span class="sp"></span><button class="btn pri" data-act="careOpen" data-hid="${h.id}">閉じる</button></div>`,{lock:true});};
ACT.moveTr=d=>{const h=HZ(d.hid);if(!h)return;const old=h.trainer;h.trainer=d.t;if(old)trust(old,-8);trust(d.t,3);h.cond=Math.max(1,(h.cond||3)-1);delete S.month.orders[h.id];log(`${h.name}が${P(d.t).n}厩舎に転厩`);save();
  openModal(`<div class="letter">${esc(h.name)}は${esc(P(d.t).n)}厩舎に移った。\n\n${old&&P(old)?`${esc(P(old).n.split(' ')[0])}「…そうですか。わかりました」`:''}\n${esc(P(d.t).n.split(' ')[0])}「お預かりします。しばらくは環境に慣れさせます」</div><div class="row"><span class="sp"></span><button class="btn pri" data-act="close">閉じる</button></div>`,{lock:true});render();};
ACT.gaiT=d=>{const h=HZ(d.hid);if(!h)return;h.gaikyu=!h.gaikyu;save();openModal(careHTML(h),{lock:true});toast(h.gaikyu?'放牧・休養のときは外厩で調整する':'外厩をやめた');};
/* what the gear and the gelding do in a race */
mkRunner=(o=>function(x,race){const r=o.apply(this,arguments);try{const h=x&&x.h;if(h&&x.mine){const g=h.gear||{},hot=h.temper==='気難しい';
  if(g.blink){r.exp+=hot?.9:.35;r.gearB=1;}if(g.menko&&(race.grade==='G1'||race.g))r.exp+=hot?.7:.25;if(g.shadow)r.exp+=.3;
  if(h.gelded&&S.t-h.gelded<=12)r.exp+=.4;}}catch(e){}return r;})(mkRunner);
studTier=(o=>function(h){if(h&&h.sex==='セ')return 0;return o.apply(this,arguments);})(studTier);
racesFor=(o=>function(h){let out=o.apply(this,arguments);try{if(h.sex==='セ')out=out.filter(r=>!['皐月賞','日本ダービー','菊花賞'].includes(r.name));if(h.sickT===S.t)out=[];}catch(e){}return out;})(racesFor);
/* 外厩: faster, better recovery, for a fee */
tickHorse=(o=>function(h,isMine){const was=h.status;const r=o.apply(this,arguments);try{if(isMine&&h.gaikyu&&['放牧','休養'].includes(was)){h.fat=Math.max(0,h.fat-12);if(R()<.5)h.cond=clamp(h.cond+1,1,5);if(h.rest>0&&R()<.4){h.rest--;if(h.rest===0){h.status='現役';S.rep&&S.rep.lines.push(`${h.name}が外厩から帰厩した`);}}}
  // the everyday illnesses: a temperature (misses next month), colic (two months off)
  if(isMine&&h.status==='現役'&&R()<.022){h.sickT=S.t+1;S.rep&&S.rep.lines.push(`${h.name}が熱発。来月のレースは見送る`);}
  else if(isMine&&h.status==='現役'&&R()<.005){h.status='休養';h.rest=2;S.rep&&S.rep.lines.push(`${h.name}が疝痛を起こした。命に別状はないが、2か月休ませる`);news(`${h.name}、疝痛で休養`);}}catch(e){}return r;})(tickHorse);
monthlyCost=(o=>function(){return o.apply(this,arguments)+mine().filter(h=>h.gaikyu&&['放牧','休養'].includes(h.status)).length*55;})(monthlyCost);
