/* =========================================================
   race day: 競馬場へ向かう / 自宅のテレビで観る / 結果だけ聞く
   + a realistic vertical 馬柱 layout for 「ターフ新報」
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
.rdopts{display:grid;gap:8px}
.rdopt{display:flex;gap:12px;align-items:center;width:100%;text-align:left;border:1px solid var(--line);background:var(--panel);border-radius:12px;padding:12px 14px;color:var(--ink);min-height:64px}
.rdopt b{display:block;font-size:16px}
.rdopt small{display:block;color:var(--muted);font-size:12px;line-height:1.5;margin-top:2px}
.rdopt .ic{flex:none;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--accent-soft);color:var(--accent)}
.rdopt.go{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent) inset}
.rdopt.go .ic{background:var(--accent);color:#fff}
/* ---- newspaper ---- */
.np{width:min(100%,760px);max-height:100%;background:#f1ecdf;color:#141210;border-radius:14px 14px 0 0;display:flex;flex-direction:column;box-shadow:0 -10px 40px rgba(0,0,0,.4);overflow:hidden;animation:phup .25s ease-out;font-family:"Zen Kaku Gothic New",sans-serif}
.np .scroll{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:10px 10px 6px;background:#f1ecdf url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Ccircle cx='1' cy='1' r='.5' fill='rgba(0,0,0,.05)'/%3E%3C/svg%3E")}
.nphead{display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:stretch;border-bottom:2px solid #141210;padding-bottom:6px}
.nprn{background:#141210;color:#f1ecdf;font-family:Oswald,sans-serif;font-weight:700;font-size:30px;line-height:1;padding:6px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.nprn small{font-size:10px;font-family:"Zen Kaku Gothic New",sans-serif;font-weight:700;letter-spacing:.1em}
.nptt{min-width:0}
.nptt .gr{display:inline-block;background:#c8161d;color:#fff;font-family:Oswald,sans-serif;font-size:12px;padding:0 5px;margin-right:4px;vertical-align:4px}
.nptt h3{display:inline;font-family:"Shippori Mincho B1",serif;font-weight:900;font-size:24px;letter-spacing:.02em}
.nptt .cond{font-size:10.5px;line-height:1.45;color:#3a352c;margin-top:2px}
.nptt .cond b{color:#141210}
.npmast{display:flex;align-items:baseline;justify-content:space-between;background:#141210;color:#ffd400;font-family:"Shippori Mincho B1",serif;font-weight:900;font-size:22px;padding:4px 10px;letter-spacing:.06em;border-bottom:3px solid #c8161d;margin:-10px -10px 4px}.npmast .s{font-size:10px;color:#f1ecdf;font-family:"Zen Kaku Gothic New",sans-serif;letter-spacing:.1em;font-weight:500}
.npdate{display:flex;justify-content:space-between;font-size:10px;color:#3a352c;padding:3px 0;border-bottom:1px solid #141210;margin-bottom:6px}
.nphl{display:flex;gap:8px;align-items:stretch;margin-bottom:6px}
.nphl .big{flex:1;font-family:"Shippori Mincho B1",serif;font-weight:900;font-size:18px;line-height:1.35;border:2px solid #141210;padding:5px 8px;background:#fff9e8}
.nphl .big em{font-style:normal;color:#c8161d}
.nphl svg{flex:none}
.umabashira{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1.5px solid #141210;background:#faf6ea;position:relative}
.ub{border-collapse:collapse;font-size:9.5px;line-height:1.25}
.ub td,.ub th{border-left:1px solid #a89f88;border-bottom:1px solid #cfc6ae;padding:2px 2px;text-align:center;vertical-align:top;width:78px;min-width:78px;max-width:78px}
.ub th.lab{position:sticky;right:0;z-index:2;background:#141210;color:#f1ecdf;width:20px;min-width:20px;max-width:20px;writing-mode:vertical-rl;font-weight:700;font-size:9.5px;letter-spacing:.15em;padding:3px 1px;border:0;vertical-align:middle}
.ub tr.sep td{border-bottom:1.5px solid #141210}
.ub td.me{background:rgba(255,220,80,.42)}
.ub .wk{font-family:Oswald,sans-serif;font-weight:700;font-size:13px;padding:1px 0}
.ub .no{font-family:Oswald,sans-serif;font-weight:700;font-size:20px;line-height:1.1}
.ub .mk{font-family:"Shippori Mincho B1",serif;font-weight:900;font-size:15px;line-height:1.05;color:#141210;height:17px}
.ub .mk.r{color:#c8161d}
.ub .nm{height:122px;padding:4px 0;overflow:hidden}.ub .nm>.v{max-height:114px;overflow:hidden}
.ub .nm .v{writing-mode:vertical-rl;display:inline-block;height:100%;text-align:start}
.ub .nm .sire{font-size:9px;color:#3a352c;margin-left:2px}
.ub .nm .hn{font-family:"Shippori Mincho B1",serif;font-weight:900;font-size:15px;letter-spacing:.02em}
.ub .nm .dam{font-size:9px;color:#3a352c;margin-right:2px}
.ub .sm{font-size:9px;color:#3a352c}
.ub .jk{font-weight:700;font-size:10.5px}
.ub .rec{font-family:Oswald,sans-serif;font-size:11px}
.ub .pp{height:100px;text-align:left;padding:3px 4px;font-size:9px;line-height:1.32;white-space:nowrap;overflow:hidden}
.ub .pp .pph{display:flex;justify-content:space-between;align-items:flex-start;color:#3a352c;font-size:8.5px;height:24px}
.ub .pp .pl{font-family:Oswald,sans-serif;font-weight:700;font-size:24px;line-height:.95;color:#141210}
.ub .pp .pl.w{color:#c8161d}
.ub .pp .rn{font-weight:900;font-size:10px;letter-spacing:-.02em;color:#141210;margin-top:-3px}
.ub .pp .ln{color:#3a352c;font-size:8.8px}
.ub .pp .ln i{font-style:normal;margin-left:2px;padding:0 2px;border:1px solid #8a8170;font-size:7.5px;vertical-align:1px}
.ub .pp .tm{font-family:Oswald,sans-serif;font-weight:600;font-size:12px;color:#141210;letter-spacing:.01em}
.ub .pp .tm small{font-family:Oswald,sans-serif;font-weight:500;font-size:9.5px;color:#3a352c;margin-left:3px}
.ub tbody tr:nth-child(even) td:not(.me){background:rgba(0,0,0,.018)}
.ub .nm .v{margin:0 1px}
.ub .pp .none{color:#8a8170;text-align:center;padding-top:36px;font-size:10px;letter-spacing:.2em}
.ub .oi{font-size:9px;text-align:left;padding:2px 3px;height:40px;overflow:hidden;white-space:nowrap}
.ub .oi b{font-family:Oswald,sans-serif;font-size:10.5px}
.ub .od{font-family:Oswald,sans-serif;font-size:13px;font-weight:600}
.ub .cm{height:112px;padding:4px 2px;overflow:hidden;white-space:normal}.ub .cm .v{writing-mode:vertical-rl;display:block;width:100%;height:104px;font-size:10px;line-height:1.45;text-align:start;font-family:"Shippori Mincho B1",serif;overflow:hidden}
.npnote{font-size:9.5px;color:#5a5240;margin:4px 0 8px;display:flex;justify-content:space-between}
.npcols{display:grid;gap:8px;grid-template-columns:1fr}
@media(min-width:520px){.npcols{grid-template-columns:1.5fr 1fr}}
.npbox{border:1.5px solid #141210;background:#faf6ea}
.npbox h4{margin:0;background:#141210;color:#f1ecdf;font-size:12px;padding:3px 8px;display:flex;justify-content:space-between;font-family:"Zen Kaku Gothic New",sans-serif}
.npbox h4.red{background:#c8161d}
.npbox p{margin:0;padding:6px 8px;font-family:"Shippori Mincho B1",serif;font-size:12.5px;line-height:1.75;text-align:justify}
.npbox .bets{padding:6px 8px;font-size:11px;line-height:1.9}
.npbox .bets b{font-family:Oswald,sans-serif;font-size:15px;margin-left:4px}
.npbox .bets .cir{display:inline-block;min-width:18px;height:18px;border-radius:9px;padding:0 5px;background:#c8161d;color:#fff;text-align:center;line-height:18px;font-size:10px;margin-right:4px}
.nptbl{width:100%;border-collapse:collapse;font-size:10.5px}
.nptbl td{border-top:1px solid #cfc6ae;padding:3px 6px}
.nptbl td:first-child{white-space:nowrap;font-weight:700}
.npad{margin-top:8px;border:1px dashed #8a8170;padding:6px 8px;font-size:10px;color:#5a5240;display:flex;justify-content:space-between;gap:8px}
`;document.head.appendChild(st);})();

/* ---------- race day choice ---------- */
const RDI={
  track:'<svg width="22" height="22" viewBox="0 0 24 24"><path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  tv:'<svg width="22" height="22" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="2"/></svg>',
  phone:'<svg width="22" height="22" viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="18" r="1.2" fill="currentColor"/></svg>'
};
function nextRace(){
  if(!RQ.length){finishMonth();return;}
  const g=RQ.shift();
  UI.race={race:g.race,field:buildField(g.race,g.ents)};
  UI.race.watched=S.restPenalty<=0;
  if(S.restPenalty>0){showTrackGate();return;}
  if(g.race.key==='有馬記念'){showArimaPrelude();return;}
  if(!g.race.g&&S.flags.condResultOnly){showTrackGate();return;}
  showRaceDay();
}
function showRaceDay(){
  const RC=UI.race,r=RC.race,my=RC.field.filter(f=>f.mine);
  const far=!['中山','東京'].includes(r.course);
  openModal(`<div class="from-line">${dstr(S.t)}　レース当日</div>${raceHead(r)}
    ${my.map(f=>`<div class="panel row">${horseSVG(f.h,44)}<div style="min-width:0;flex:1"><b>${esc(f.name)}</b>　<span class="chip">${f.pop}番人気</span><div class="muted" style="font-size:13px">騎手 ${esc(f.jname)}　${RC.field.length}頭立て　1着 ${yen(r.prize)}</div></div></div>`).join('')}
    ${paperBtn()}
    <div class="rdopts">
      <button class="rdopt go" data-act="rdGo" data-m="track"><span class="ic">${RDI.track}</span><span><b>${esc(r.course)}競馬場へ向かう</b><small>馬主席から観戦。パドックで愛馬を見届け、騎手に声をかけてから席へ。応援馬券、勝てば口取り式。${far?'遠征なので一日がかり。':''}</small></span></button>
      <button class="rdopt" data-act="rdGo" data-m="tv"><span class="ic">${RDI.tv}</span><span><b>自宅のテレビで観る</b><small>中継でレースだけ観る。口取り式には立ち会えない。</small></span></button>
      <button class="rdopt" data-act="rdGo" data-m="none"><span class="ic">${RDI.phone}</span><span><b>結果だけ聞く</b><small>あとで調教師から電話で報告を受ける。</small></span></button>
    </div>`,{wide:true,lock:true});
}
ACT.rdGo=d=>{const RC=UI.race;
  if(d.m==='none'){runSim(RC);RC.watched=false;showResult();return;}
  if(d.m==='tv'){RC.tv=true;RC.boxSeen=true;showTrackGate();return;}
  showPaddock();};   // at the track you go down to the paddock for every race, not just the big ones
/* the TV route: no 口取り, a different line on the gate screen and the race header */
showTrackGate=(o=>function(){const r=o.apply(this,arguments);const RC=UI.race;
  if(RC&&RC.tv){const b=$('#sheet [data-act=watch][data-w="1"]');if(b)b.textContent='テレビで観る';const fl=$('#sheet .from-line');if(fl)fl.textContent=`${dstr(S.t)}　自宅・テレビ中継`;
    const p=$('#sheet .panel .muted');if(p)p.textContent=`騎手 ${UI.race.field.find(f=>f.mine)?.jname||''}　ソファに座って、中継の画面を見つめる。`;}
  return r;})(showTrackGate);
showRaceView=(o=>function(){const r=o.apply(this,arguments);const RC=UI.race;if(RC&&RC.tv){const w=$('#sheet .watchfrom');if(w)w.textContent='自宅のテレビ';}return r;})(showRaceView);
showResult=(o=>function(){const r=o.apply(this,arguments);const RC=UI.race;if(RC&&RC.tv){const k=$('#sheet [data-act=kuchi]');if(k)k.remove();
  const m=RC.order&&RC.order.find(f=>f.mine);if(m&&m.pos===1){const ban=$('#sheet .result-banner');if(ban&&!$('#sheet .tvnote'))ban.insertAdjacentHTML('afterend','<div class="comment tvnote">テレビの前で、思わず立ち上がった。画面の向こうで、口取り式が始まっている。</div>');}}
  return r;})(showResult);

/* ---------- 馬柱 newspaper ---------- */
const NPTR=['(美)高村','(栗)松永','(美)尾上','(栗)角田','(美)堀内','(栗)石坂','(美)萩原','(栗)友永','(美)木戸','(栗)須崎','(美)相沢','(栗)矢野'];
const NPOW=['ターフクラブ','(有)北斗牧場','山城 正和','小田切 健','(株)ブルーライン','早瀬 恵子','岡村 勝','(有)青雲ファーム','サンライズHC','千葉 一郎'];
function npPrev(RC,f,i){
  const d=paperData(RC),seed=RC.race.name+S.t+f.no;
  const own=f.h&&f.h.rec?f.h.rec.slice(0,3):[];
  return [0,1,2].map(k=>{
    const o=own[k];const hv=hh(seed+'p'+k);
    if(f.h&&f.h.rec&&!o)return null;
    const p=o?o.pos:d.prev[i][k].p,of=o?o.of:d.prev[i][k].of,nm=o?o.n:d.prev[i][k].n;
    const dist=o?o.d:RC.race.dist+[-200,0,200,400][Math.floor(hv*4)],surf=o?o.s:RC.race.surf;
    const t=o?o.t:S.t-1-k*(1+Math.floor(hv*2));const mo=((t%12)+12)%12+1;
    const crs=pick2(['中山','東京','京都','阪神','中京','新潟','福島'],seed+k+'c');
    const tm=dist/(16.35-(p-1)*.04-(surf==='ダ'?.6:0))+hv*.6,mm=Math.floor(tm/60),ss=(tm-mm*60).toFixed(1).padStart(4,'0');
    const up=(surf==='ダ'?36.4:34.4)+(p-1)*.12+(hh(seed+k+'u')-.5)*1.4;
    const st={逃げ:[1,1,1],先行:[3,3,2],差し:[8,7,5],追込:[12,12,9]}[f.style]||[6,6,6];
    const corner=st.map(x=>clamp(x+Math.round((hh(seed+k+x)-.5)*3),1,of)).map(x=>'①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯'[x-1]).join('');
    const pop=o?o.pop:clamp(Math.round(p+(hv-.5)*6),1,of);
    return {p,of,nm:nm.replace(/ステークス/,'S'),dist,surf,going:o?o.going:pick2(['良','良','良','稍','重'],seed+k+'g'),tm:`${mm}.${ss}`,up:up.toFixed(1),corner,pop,mo,day:1+Math.floor(hv*27),crs:o?'':((typeof GR!=='undefined'&&GR.find&&(GR.find(g=>g.n===nm)||{}).course)||crs),j:o?o.j:f.jname};});
}
function courseSVG(r){const dirt=r.surf==='ダ';return `<svg width="74" height="52" viewBox="0 0 74 52" aria-hidden="true"><rect x="1" y="1" width="72" height="50" fill="#faf6ea" stroke="#141210"/><rect x="8" y="10" width="58" height="30" rx="15" fill="none" stroke="${dirt?'#9a7a52':'#2f6e3a'}" stroke-width="5"/><rect x="8" y="10" width="58" height="30" rx="15" fill="none" stroke="#141210" stroke-width=".6"/><path d="M50 40l-8 0" stroke="#c8161d" stroke-width="2"/><path d="M44 37l-3 3 3 3" fill="none" stroke="#c8161d" stroke-width="1.5"/><text x="37" y="28" font-size="8" text-anchor="middle" font-family="sans-serif" fill="#141210">${r.dist}m</text><text x="37" y="50" font-size="6" text-anchor="middle" font-family="sans-serif" fill="#3a352c">${esc(r.course)} ${dirt?'ダ':'芝'}</text></svg>`;}
ACT.paper=()=>{const RC=UI.race,r=RC.race,F=RC.field,d=paperData(RC),n=F.length;
  let el=$('#paper-ov');if(!el){el=document.createElement('div');el.id='paper-ov';el.className='paper-ov';document.body.appendChild(el);
    el.addEventListener('click',e=>{if(e.target===el)ACT.paperClose();});el.addEventListener('touchmove',e=>{if(!e.target.closest('.scroll'))e.preventDefault();},{passive:false});}
  const mon=M(S.t),day=1+Math.floor(hh('day'+S.t+r.name)*27),wd=['土','日'][Math.floor(hh('wd'+S.t+r.name)*2)];
  const rno=r.g?11:pick2([3,4,5,6,7,8,9,10],r.name+S.t);
  const post=`${r.g?'15':'1'+(2+Math.floor(rno/3))}:${pick2(['05','25','35','40','45'],r.name)}`;
  const cls=r.grade==='G1'||r.grade==='G2'||r.grade==='G3'?`${/2歳/.test(r.name)?'2歳':/3歳/.test(r.name)||r.sex?'3歳':'3歳以上'}オープン（国際）（指定）${r.grade==='G1'?'定量':'別定'}`:`${/2歳/.test(r.name)?'2歳':/3歳/.test(r.name)?'3歳':'3歳以上'}${r.grade==='新馬'?'新馬':r.grade==='未勝利'?'未勝利':r.grade}（混合）馬齢`;
  const order=F.map((f,i)=>i).reverse();   // newspapers run right-to-left: 1番 sits at the right edge
  const prevs=F.map((f,i)=>npPrev(RC,f,i));
  const info=F.map((f,i)=>{const h=f.h,sex=h?h.sex:pick2(['牡','牡','牝','セ'],r.name+f.no),fa=/2歳/.test(r.name)?2:/3歳/.test(r.name)?3:0,age=h?ageOf(h):fa||3+Math.floor(hh(f.no+'a'+r.name)*3);
    const coat=h?h.coat:pick2(['鹿毛','黒鹿毛','栗毛','芦毛','青鹿毛','栃栗毛'],r.name+f.no+'co');
    const kin=r.grade==='G1'?(sex==='牝'?56:58):(sex==='牝'?54:56)+(hh(f.no+'k')<.3?1:0);
    const sire=h&&ST(h.sire)?ST(h.sire).n:pick2(S.stallions.map(x=>x.n),r.name+f.no+'s');
    const dam=h&&h.damName?h.damName:pick2(['ミスティローズ','サクラノユメ','ブルーメロディ','ハルカゼ','レディアリス','シロガネノヒメ','ノーブルラン','ユメミグサ'],r.name+f.no+'d');
    const bms=pick2(S.stallions.map(x=>x.n),r.name+f.no+'b');
    const tr=f.mine&&h&&P(h.trainer)?`(${pick2(['美','栗'],h.trainer)})${P(h.trainer).n.split(' ')[0]}`:pick2(NPTR,r.name+f.no+'t');
    const ow=f.mine?ownerName():f.rival&&h&&OWN[h.owner]?OWN[h.owner].n:pick2(NPOW,r.name+f.no+'o');
    const w=h?h.wins||0:Math.floor(hh(f.no+'w'+r.name)*(r.g?5:2));const st=h?h.starts||0:w+3+Math.floor(hh(f.no+'s'+r.name)*12);
    const s2=Math.floor((st-w)*hh(f.no+'2'+r.name)*.3),s3=Math.floor((st-w-s2)*hh(f.no+'3'+r.name)*.3);
    const tv=hh(r.name+f.no+'tr'),tq=f.cond+(f.mine?0:(tv-.5)*2.4),crs=pick2(['栗坂','美坂','栗CW','美W'],r.name+f.no+'tc'),saka=/坂/.test(crs);
    const t4=(saka?52.4:(crs==='美W'?66.6:82.6))-(tq-3)*(saka?1.1:1.4)+(tv-.5),last=(12.6-(tq-3)*.25+(hh(f.no+'l'+r.name)-.5)*.4);
    const trn=[crs,`${saka?'4F':crs==='美W'?'5F':'6F'} ${t4.toFixed(1)}-${last.toFixed(1)}`,pick2(['強','一杯','馬也','G前仕掛'],r.name+f.no+'tk')];
    return {sex,age,coat,kin,sire,dam,bms,tr,ow,rec:`${w}.${s2}.${s3}.${Math.max(0,st-w-s2-s3)}`,trn,grade:f.mine||f.rival?d.tr[i]:['C','C','B','B','A'][Math.floor(tv*5)]};});
  const cell=(i,html,cls='')=>`<td class="${cls} ${F[i].mine?'me':''}">${html}</td>`;
  const row=(lab,fn,cls='',sep)=>`<tr class="${sep?'sep':''}">${order.map(i=>cell(i,fn(i),cls)).join('')}<th class="lab">${lab}</th></tr>`;
  const marksRows=PAPER_REP.map((p,k)=>row(p.k,i=>d.marks[i][k]||'',`mk ${k===0?'r':''}`,k===PAPER_REP.length-1)).join('');
  const prevRow=k=>row(['前走','2走前','3走前'][k],i=>{const p=prevs[i][k];if(!p)return `<div class="none">${k===0&&!prevs[i][1]?'初出走':'—'}</div>`;
    return `<div class="pph"><span>${p.mo}.${p.day}${p.crs?'<br>'+p.crs:''}</span><b class="pl ${p.p===1?'w':''}">${p.p}</b></div><div class="rn">${esc(ubAbbr(p.nm))}</div><div class="ln">${p.surf==='ダ'?'ダ':'芝'}${p.dist}<i>${p.going.slice(0,1)}</i></div><div class="tm">${p.tm}<small>${p.up}</small></div><div class="ln">${esc(p.j.split(' ')[0].slice(0,5))}　${p.corner}</div><div class="ln">${p.of}頭 ${p.pop}番人気</div>`;},'pp',k===2);
  el.innerHTML=`<div class="np" role="dialog" aria-label="競馬新聞"><div class="scroll">
    <div class="npmast"><span>競馬ファンファーレ</span><span class="s">競馬専門紙　創刊1958年</span></div><div class="npdate"><span>${Y(S.t)}年（令和${Y(S.t)-2018}年）${mon}月${day}日（${wd}曜日）</span><span>${esc(r.course)}版　定価500円</span></div>
    <div class="nphead"><div class="nprn">${rno}<small>R</small></div>
      <div class="nptt">${/^G/.test(r.grade)?`<span class="gr">${r.grade}</span>`:''}<h3>${esc(r.name)}</h3>
        <div class="cond"><b>${r.surf==='ダ'?'ダート':'芝'}${r.dist}m</b>（${pick2(['右','右','左'],r.course)}${r.surf==='ダ'?'':'・外'}）　${cls}<br>発走 <b>${post}</b>　馬場 <b>${r.going||'良'}</b>　${n}頭　本賞金 1着 <b>${yen(r.prize)}</b> 2着 ${yen(Math.round(r.prize*.4))}</div></div></div>
    <div class="nphl" style="margin-top:6px"><div class="big">${esc(d.head).replace(/◎/,'<em>◎</em>')}</div>${courseSVG(r)}</div>
    <div class="umabashira" id="ubwrap"><table class="ub"><tbody>
      ${row('枠',i=>{const w=wakuOf(F[i].no,n);return `<div class="wk" style="background:${FRAMEC[w-1]};color:${FRAMET[w-1]}">${w}</div>`;})}
      ${row('馬番',i=>F[i].no,'no',true)}
      ${marksRows}
      ${row('馬名',i=>{const L=F[i].name.length,fs=Math.min(16,Math.floor(112/Math.max(1,L)));const sm=t=>{const l=t.length;return Math.min(9,Math.floor(110/Math.max(1,l)));};const bm=`（${info[i].bms}）`;
        return `<span class="v dam" style="font-size:${sm(bm)}px">${esc(bm)}</span><span class="v dam" style="font-size:${sm(info[i].dam)}px">${esc(info[i].dam)}</span><span class="v hn" style="font-size:${fs}px !important">${esc(F[i].name)}</span><span class="v sire" style="font-size:${sm(info[i].sire)}px">${esc(info[i].sire)}</span>`;},'nm',true)}
      ${row('性齢',i=>`${info[i].sex}${info[i].age} ${info[i].coat}<br><span class="sm">${F[i].style}</span>`)}
      ${row('騎手',i=>`<span class="jk">${esc(F[i].jname.split(' ')[0])}</span><br>${info[i].kin}.0`)}
      ${row('厩舎',i=>`<span class="sm">${esc(info[i].tr)}</span>`)}
      ${row('馬主',i=>`<span class="sm">${esc(ubOwner(info[i].ow))}</span>`)}
      ${row('成績',i=>`<span class="rec">${info[i].rec}</span>`,'',true)}
      ${prevRow(0)}${prevRow(1)}${prevRow(2)}
      ${row('追切',i=>`<span class="sm">${info[i].trn[0]}　${info[i].trn[2]}</span><br><b>${info[i].trn[1]}</b><br>評価 <b style="color:${'SA'.includes(info[i].grade)?'#c8161d':'#141210'}">${info[i].grade}</b>`,'oi',true)}
      ${row("短評",i=>`<span class="v">${tcy(d.comm[i])}</span>`,'cm')}
      ${row('予想',i=>`${F[i].odds.toFixed(1)}<br><span class="sm">${F[i].pop}人気</span>`,'od')}
    </tbody></table></div>
    <div class="npnote"><span>← 横にスクロール（1番は右端）</span><span>◎本命 ○対抗 ▲単穴 △連下 ☆穴</span></div>
    <div class="npcols">
      <div class="npbox"><h4 class="red"><span>本紙の見解</span><span>本紙・高木</span></h4><p>${esc(d.view)}</p></div>
      <div class="npbox"><h4><span>本紙の推奨</span></h4><div class="bets">${(()=>{const b=['◎','○','▲'].map(m=>F[d.marks.findIndex(x=>x[0]===m)]);return `<span class="cir">単</span><b>${b[0].no}</b><br><span class="cir">馬連</span><b>${b[0].no}-${b[1].no}</b><b>${b[0].no}-${b[2].no}</b><br><span class="cir">3複</span><b>${b.map(x=>x.no).sort((a,c)=>a-c).join('-')}</b>`;})()}</div>
        <table class="nptbl"><tr><td>展開</td><td>${F.filter(f=>f.style==='逃げ').map(f=>f.no).join('・')||'—'}がハナ争い</td></tr><tr><td>穴</td><td>${(()=>{const a=d.marks.findIndex(x=>x.includes('☆'));return a>=0?`${F[a].no} ${esc(F[a].name)}`:'—';})()}</td></tr></table></div>
    </div>
    ${d.col?`<div class="npbox" style="margin-top:8px"><h4><span>トレセン便り</span><span>厩舎情報</span></h4><p>${esc(d.col)}</p></div>`:''}
    <div class="npad"><span>【PR】馬主の皆様へ　鞍・勝負服の仕立て承ります　中山・府中に店舗</span><span>☎ 047-xxx-xxxx</span></div>
    </div><div class="pfoot"><button class="btn pri" data-act="paperClose">新聞をたたむ</button></div></div>`;
  el.hidden=false;
  const w=$('#ubwrap');if(w)requestAnimationFrame(()=>{w.scrollLeft=w.scrollWidth;});
};

/* tidy, fixed-length labels the way real papers abbreviate them (no ellipses) */
const UB_AB={'アルゼンチン共和国杯':'AR共和国杯','セントライト記念':'セントライト','エリザベス女王杯':'エ女王杯','マイルチャンピオンシップ':'マイルCS','ジャパンカップ':'ジャパンC','天皇賞（秋）':'天皇賞秋','天皇賞（春）':'天皇賞春','天皇賞(秋)':'天皇賞秋','天皇賞(春)':'天皇賞春',
  '1勝クラス':'1勝クラス','2勝クラス':'2勝クラス','3勝クラス':'3勝クラス','チャンピオンズカップ':'チャンピオンズC','スプリンターズステークス':'スプリンターズ','朝日杯フューチュリティステークス':'朝日杯FS','阪神ジュベナイルフィリーズ':'阪神JF','ヴィクトリアマイル':'VマイルS',
  '日本ダービー':'ダービー','東京優駿':'ダービー','優駿牝馬':'オークス','NHKマイルカップ':'NHKマイルC','ホープフルステークス':'ホープフルS','京都大賞典':'京都大賞典','日経新春杯':'日経新春杯','オールカマー':'オールカマー'};
function ubAbbr(n){n=String(n||'');if(UB_AB[n])return UB_AB[n];let t=n.replace(/（[^）]*）|\([^)]*\)/g,'').replace(/ステークス$/,'S').replace(/カップ$/,'C').replace(/フューチュリティ/,'F');if(t.length>6)t=t.replace(/記念$/,'記');if(t.length>6)t=t.slice(0,6);return t;}
function ubOwner(o){let t=String(o||'').replace(/^\((有|株)\)|\((有|株)\)$/g,'').replace(/\s+/g,'');if(t.length>7)t=t.slice(0,6);return t.replace(/[・ー]$/,'');}
