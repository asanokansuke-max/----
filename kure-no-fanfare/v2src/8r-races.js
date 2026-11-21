/* =========================================================
   レースの種類を広げる:
   ・斤量 — every runner carries a weight; ハンデ戦 the handicapper loads the good ones; 減量騎手 (▲△☆) in ordinary races
   ・障害レース — a horse can switch to jumping (障害未勝利 → 障害OP → J・G1 中山大障害/中山グランドジャンプ)
   ・地方交流重賞 — 帝王賞, JBCクラシック, 東京大賞典, 川崎記念, ジャパンダートクラシック (大井・川崎)
   ・海外遠征 — ドバイ, 凱旋門賞, 香港: for proven horses, with the cost of the trip
   ========================================================= */
/* ---- the calendar ---- */
const HC_NAMES=['中山金杯','京都金杯','日経新春杯','愛知杯','小倉大賞典','ダービー卿CT','目黒記念','七夕賞','函館記念','新潟記念','福島記念','アルゼンチン共和国杯','中日新聞杯','ターコイズS'];
const addGR=g=>{if(!GR.some(x=>x.n===g.n))GR.push({sex:0,...g});};
addGR({m:1,n:'日経新春杯',gr:'G2',surf:'芝',dist:2400,course:'京都',age:'4+',p:5700});
addGR({m:5,n:'目黒記念',gr:'G2',surf:'芝',dist:2500,course:'東京',age:'4+',p:5700});
GR.forEach(g=>{if(HC_NAMES.includes(g.n))g.hc=1;});
// jumps
[[3,'阪神スプリングジャンプ','J・G2',3900,'阪神','4+',3600],[4,'中山グランドジャンプ','J・G1',4250,'中山','4+',6600],[6,'東京ジャンプS','J・G3',3110,'東京','3+',3000],
 [10,'東京ハイジャンプ','J・G2',3110,'東京','3+',3600],[12,'中山大障害','J・G1',4100,'中山','3+',6600]].forEach(([m,n,gr,dist,course,age,p])=>addGR({m,n,gr,surf:'芝',dist,course,age,p,jump:1}));
// exchange races at the local tracks
[[1,'川崎記念',2100,'川崎','4+',8000],[6,'帝王賞',2000,'大井','4+',10000],[7,'ジャパンダートクラシック',2000,'大井','3',7000],[11,'JBCクラシック',2000,'大井','3+',10000],[12,'東京大賞典',2000,'大井','3+',10000]]
 .forEach(([m,n,dist,course,age,p])=>addGR({m,n,gr:'G1',surf:'ダ',dist,course,age,p,local:1}));
// overseas (prize money converted to 万円; the trip costs money)
[[3,'ドバイシーマクラシック','芝',2410,'メイダン','4+',50000,'UAE',3500],[3,'ドバイワールドカップ','ダ',2000,'メイダン','4+',100000,'UAE',3500],
 [10,'凱旋門賞','芝',2400,'ロンシャン','3+',28000,'FRA',4500],[12,'香港ヴァーズ','芝',2400,'シャティン','3+',15000,'HKG',2500],[12,'香港カップ','芝',2000,'シャティン','3+',34000,'HKG',2500]]
 .forEach(([m,n,surf,dist,course,age,p,c,cost])=>addGR({m,n,gr:'G1',surf,dist,course,age,p,abroad:c,cost}));
gradedRace=(o=>function(g){const r=o.apply(this,arguments);if(g.hc)r.hc=1;
  if(g.jump){r.jump=1;r.mean=g.gr==='J・G1'?72:g.gr==='J・G2'?70:68;r.n=g.gr==='J・G1'?14:12;r.sd=4.5;}
  if(g.local){r.local=1;r.n=13;r.mean=Math.max(r.mean-1.5,74);}
  if(g.abroad){r.abroad=g.abroad;r.cost=g.cost;r.mean=g.n==='凱旋門賞'?81.5:g.n==='ドバイワールドカップ'?81:79.5;r.n=g.abroad==='FRA'?14:12;if(g.abroad==='FRA'&&!r.going)r.going=R()<.5?'重':'稍重';}
  return r;})(gradedRace);
const canAbroad=h=>h.cls>=5&&((h.g1||0)>0||(h.gw||[]).length>=2||(h.fans||0)>=50000);
racesFor=(o=>function(h){let out=o.apply(this,arguments);try{
  if(h.jump){const a=ageOf(h),m=M(S.t),L=[];if(h.status!=='現役'||a<3)return [];
    const jw=h.jwins||0,crs=['中山','阪神','東京','京都','小倉','福島','新潟'][(S.t+3)%7];
    L.push({key:jw?'c-jop':'c-jmi',name:jw?'障害オープン':'障害未勝利',grade:jw?'OP':'未勝利',surf:'芝',dist:jw?3200:2880,course:crs,grp:'3+',mean:jw?66:62,sd:4.5,n:12,prize:jw?1800:1000,g:false,jump:1});
    if(jw)GR.filter(g=>g.m===m&&g.jump&&ageOk(g.age,a)).forEach(g=>L.push(gradedRace(g)));
    return L;}
  out=out.filter(r=>!r.jump&&(!r.abroad||canAbroad(h)));}catch(e){}return out;})(racesFor);
entryStatus=(o=>function(h,r){if(r&&(r.abroad||r.local||r.jump))return{st:'確定',why:r.abroad?'招待を受けて出走':r.jump?'障害の出走枠':'交流重賞の中央枠'};return o.apply(this,arguments);})(entryStatus);
/* ---- 斤量 and handicaps; apprentice allowances ---- */
const APPR={komori:[3,'▲'],hinata:[1,'☆']};
mkRunner=(o=>function(x,race,going){const r=o.apply(this,arguments);try{
  const fem=x.h?x.h.sex==='牝':R()<.2,base=race.grp==='2'?55:race.grp==='3'?57:58;let kg=base-(fem?2:0);
  if(race.hc){kg=Math.round(clamp(55+(r.exp-race.mean)*.55,49,59.5)*2)/2;r.exp-=(kg-55)*.55;}
  if(!race.g&&!race.jump){const ap=x.jid&&APPR[x.jid];if(ap&&!(x.jid==='hinata'&&JK('hinata')&&JK('hinata').sk>=76)){kg-=ap[0];r.exp+=ap[0]*.4;r.jmark=ap[1];}
    else if(!x.jid&&R()<.12){const k=pick([[3,'▲'],[2,'△'],[1,'☆']]);kg-=k[0];r.exp+=k[0]*.4;r.jmark=k[1];}}
  if(race.jump){r.kg=fem?61:63;if(x.h){const js=x.h.jskill||0;r.exp+=-4+js;}}else r.kg=kg;
  if(race.abroad&&!x.mine&&!x.rival&&!x.jid)r.jname=pick(['P.ルブラン','T.マーティン','R.ガルシア','S.ハーパー','D.モロー','K.チャン','B.ウォン','L.アンドレ','H.シュミット','M.コスタ']);
  }catch(e){}return r;})(mkRunner);
raceHead=(o=>function(r){let s=o.apply(this,arguments);try{const tags=[r.hc?'ハンデ':'',r.jump?'障害':'',r.local?'交流重賞':'',r.abroad?({UAE:'海外・ドバイ',FRA:'海外・フランス',HKG:'海外・香港'}[r.abroad]):''].filter(Boolean);
  if(tags.length)s=s.replace('</h2>',`</h2>${tags.map(t=>`<span class="chip rtag">${t}</span>`).join('')}`);}catch(e){}return s;})(raceHead);
(function(){const st=document.createElement('style');st.textContent=`.racehead .rtag{font-size:11px;padding:2px 7px;margin-left:4px;background:#7a1f2a;color:#fff;border:0;vertical-align:middle}
.gr.jg{background:#5b3a1f;color:#fff}`;document.head.appendChild(st);})();
/* ---- jump racing: a switch in the horse's menu, experience over fences, more falls ---- */
openManage=(o=>function(hid){const r=o.apply(this,arguments);try{const h=HZ(hid);if(h&&h.status==='現役'&&ageOf(h)>=3){const row=document.querySelector('#sheet .choices');
  if(row)row.insertAdjacentHTML('beforeend',`<button class="btn" data-act="jumpConv" data-hid="${h.id}">${h.jump?'平地に戻す':'障害に転向する'}</button>`);}}catch(e){}return r;})(openManage);
ACT.jumpConv=d=>{const h=HZ(d.hid);if(!h)return;h.jump=!h.jump;if(h.jump){h.jskill=h.jskill||0;log(`${h.name}が障害に転向`);}save();closeModal();render();
  toast(h.jump?`${h.name}は障害に転向した。障害未勝利から、飛越の経験を積んでいく`:`${h.name}は平地に戻った`);};
applyRace=(o=>function(RC){const r=o.apply(this,arguments);try{const race=RC.race;(RC.order||[]).filter(f=>f.mine&&f.h).forEach(f=>{const h=f.h;
  if(race.jump){h.jskill=Math.min(12,(h.jskill||0)+2);if(f.pos===1)h.jwins=(h.jwins||0)+1;}
  if(race.abroad&&!RC.tripPaid){RC.tripPaid=1;S.money-=race.cost;if(S.rep)S.rep.cost+=race.cost;news(`${h.name}、海外遠征（${race.name}・遠征費 ${yen(race.cost)}）で${f.pos}着`);if(f.pos===1){S.fame+=4;h.fans=(h.fans||0)+30000;log(`${h.name}、${race.name}制覇！ 日本馬の快挙`);}}});}catch(e){console.error('races',e);}return r;})(applyRace);
runSim=(o=>function(RC){const r=o.apply(this,arguments);try{if(RC.race.jump&&!RC.jumpInc){RC.jumpInc=1;let ch=false;RC.order.forEach(f=>{if(!f.out&&R()<.025){f.out='中止';f.ev='競走中止';f.stop=1;ch=true;}});if(ch)incRecount(RC);}}catch(e){}return r;})(runSim);
/* the 3D view: jumps and the new tracks */
Object.assign(R3D_CRS,{大井:'ooi',川崎:'kawasaki',メイダン:'meydan',ロンシャン:'longchamp',シャティン:'shatin'});
r3dInput=(o=>function(RC){const inp=o.apply(this,arguments);try{if(RC.race.jump)inp.jump=1;if(RC.race.abroad)inp.abroad=RC.race.abroad;inp.field.forEach(x=>{const f=RC.field.find(y=>y.no===x.no);if(f&&f.kg)x.kg=f.kg;});}catch(e){}return inp;})(r3dInput);
gradeBadge=(o=>function(g){if(/^J・/.test(g||''))return `<span class="gr jg">${g}</span>`;return o.apply(this,arguments);})(gradeBadge);

/* a jump race doesn't change the horse's flat class */
applyRace=(o=>function(RC){const keep=(RC&&RC.race&&RC.race.jump)?(RC.order||[]).filter(f=>f.mine&&f.h).map(f=>[f.h,f.h.cls]):[];const r=o.apply(this,arguments);keep.forEach(([h,c])=>{h.cls=c;});return r;})(applyRace);
