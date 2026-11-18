/* =========================================================
   競馬新聞「ターフ新報」 + 馬主席 for every race you attend
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
.paperbtn{display:flex;align-items:center;gap:10px;width:100%;border:1px solid #cbbf9f;background:#f6f0de;color:#2a2418;border-radius:10px;padding:8px 12px;text-align:left;min-height:46px}
.paperbtn .pm{flex:none;background:#c0262d;color:#fff;font-family:var(--f-disp);font-weight:900;font-size:13px;padding:3px 6px;border-radius:3px;letter-spacing:.06em}
.paperbtn small{display:block;color:#7a6c4f;font-size:11px}
.paperbtn .mk{margin-left:auto;font-family:var(--f-disp);font-size:20px;color:#c0262d;font-weight:900;letter-spacing:2px}
.paper-ov{position:fixed;inset:0;z-index:35;background:rgba(10,10,8,.7);display:flex;align-items:flex-end;justify-content:center;padding-top:calc(16px + env(safe-area-inset-top,0px))}
.paper{width:min(100%,640px);max-height:100%;background:#f3eddc;color:#1d1a14;border-radius:14px 14px 0 0;display:flex;flex-direction:column;box-shadow:0 -10px 40px rgba(0,0,0,.4);font-family:"Shippori Mincho B1",serif;overflow:hidden;animation:phup .25s ease-out}
.paper .scroll{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:12px 12px 8px;background-image:radial-gradient(rgba(0,0,0,.035) 1px,transparent 1px);background-size:3px 3px}
.mast{display:flex;align-items:stretch;gap:10px;border-bottom:3px double #1d1a14;padding-bottom:8px}
.mast .logo{background:#c0262d;color:#fff;font-weight:900;font-size:24px;padding:4px 10px;letter-spacing:.08em;display:flex;align-items:center;line-height:1}
.mast .ed{font-family:var(--f-body);font-size:11px;line-height:1.5;color:#4a4232;flex:1;min-width:0}
.mast .ed b{color:#1d1a14;font-size:12px}
.mast .price{font-family:var(--f-body);font-size:10px;color:#4a4232;text-align:right;align-self:flex-end}
.ptitle{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin:10px 0 4px}
.ptitle .rn{font-size:26px;font-weight:900;letter-spacing:.04em}
.ptitle .gb{background:#1d1a14;color:#f3eddc;font-family:Oswald,sans-serif;font-size:13px;padding:1px 6px}
.ptitle .cd{font-family:var(--f-body);font-size:12px;color:#4a4232}
.pheadline{font-weight:900;font-size:17px;border-left:6px solid #c0262d;padding:2px 0 2px 8px;margin:6px 0 10px;line-height:1.45}
.ptbl-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1.5px solid #1d1a14;background:#fbf7ea}
.ptbl{border-collapse:collapse;min-width:620px;width:100%;font-family:var(--f-body);font-size:11px}
.ptbl th{background:#1d1a14;color:#f3eddc;font-weight:700;padding:3px 2px;font-size:10px;white-space:nowrap}
.ptbl td{border-bottom:1px solid #b9ae92;border-right:1px dotted #c9bfa4;padding:4px 3px;vertical-align:middle}
.ptbl tr.me td{background:rgba(255,214,64,.38)}
.ptbl .wk{width:20px;text-align:center;font-weight:700;font-family:Oswald,sans-serif;font-size:12px}
.ptbl .no{width:22px;text-align:center;font-family:Oswald,sans-serif;font-size:15px;font-weight:600}
.ptbl .mk{width:18px;text-align:center;font-size:15px;color:#c0262d;font-weight:900;font-family:"Shippori Mincho B1",serif}
.ptbl .mk.b{color:#1d1a14}
.ptbl .hn{min-width:118px}
.ptbl .hn b{font-family:"Shippori Mincho B1",serif;font-size:14px;font-weight:900;display:block;white-space:nowrap}
.ptbl .hn small{color:#5a5040;font-size:10px;white-space:nowrap}
.ptbl .jk{white-space:nowrap;font-size:11px}
.ptbl .pr{width:58px;font-size:10px;line-height:1.25;white-space:nowrap}
.ptbl .pr .p{font-family:Oswald,sans-serif;font-size:15px;font-weight:600;display:block}
.ptbl .pr .p.w{color:#c0262d}
.ptbl .cm{min-width:120px;font-size:10.5px;line-height:1.35}
.ptbl .od{text-align:right;font-family:Oswald,sans-serif;font-size:13px;white-space:nowrap}
.ptbl .tr{text-align:center;font-family:Oswald,sans-serif;font-weight:700;font-size:13px}
.pcols{display:grid;gap:10px;margin-top:12px}
@media(min-width:560px){.pcols{grid-template-columns:1.4fr 1fr}}
.pbox{border:1.5px solid #1d1a14;padding:8px 10px;background:#fbf7ea}
.pbox h4{margin:0 0 6px;font-size:14px;font-weight:900;display:flex;gap:6px;align-items:center}
.pbox h4 i{font-style:normal;background:#c0262d;color:#fff;font-size:11px;padding:1px 5px}
.pbox p{margin:0;font-size:13px;line-height:1.75;text-align:justify}
.pbet{font-family:var(--f-body);font-size:12px;line-height:1.8}
.pbet b{font-family:Oswald,sans-serif;font-size:14px}
.pnote{font-family:var(--f-body);font-size:10px;color:#6a5f48;margin-top:8px}
.pfoot{flex:none;padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:#e9e1c8;border-top:1px solid #cbbf9f;display:flex}
.pfoot .btn{flex:1}
.watchfrom{display:inline-block;margin-left:6px;font-size:11px;background:rgba(196,120,47,.15);color:var(--accent);border-radius:999px;padding:1px 8px;vertical-align:1px}
`;document.head.appendChild(st);})();

function hh(v){let x=(hash(v)*4294967296)>>>0;x^=x>>>16;x=Math.imul(x,0x45d9f3b);x^=x>>>16;x=Math.imul(x,0x45d9f3b);x^=x>>>16;return (x>>>0)/4294967296;}
const PAPER_REP=[{n:'本紙・高木',k:'本紙'},{n:'加納',k:'加納'},{n:'村瀬',k:'村瀬'},{n:'坂口',k:'坂口'}];
const MKS=['◎','○','▲','△','△','☆'];
function paperData(RC){
  if(RC.paper)return RC.paper;
  const F=RC.field,n=F.length,seed=RC.race.name+S.t;
  const marks=F.map(()=>PAPER_REP.map(()=>''));
  PAPER_REP.forEach((rp,ri)=>{const sc=F.map((f,i)=>({i,v:f.exp+(hh(seed+rp.n+f.no)-.5)*(ri===0?3.2:5)+(ri===3&&f.style==='追込'?1.2:0)}));
    sc.sort((a,b)=>b.v-a.v).slice(0,6).forEach((x,k)=>marks[x.i][ri]=MKS[k]);});
  const RN=['若葉S','すみれS','白百合S','ホープフルS','セントライト記念','オールカマー','アルゼンチン共和国杯','金鯱賞','日経新春杯','中山記念','毎日王冠','京都大賞典','ジャパンC','天皇賞(秋)','菊花賞','宝塚記念','1勝クラス','2勝クラス','3勝クラス','未勝利'];
  const prev=F.map(f=>{
    const own=f.h&&f.h.rec&&f.h.rec.length?f.h.rec.slice(0,3).map(r=>({p:r.pos,n:r.n,of:r.of})):null;
    if(own)return own;
    return [0,1,2].map(k=>{const hv=hh(seed+'p'+f.no+k);const p=clamp(Math.round(f.pop*.55+hv*7-2+k),1,16);return {p,n:RN[Math.floor(hh(f.no+'r'+k+RC.race.grade)*(RC.race.g?16:20))],of:14+(hv>.5?2:0)};});});
  const comm=F.map((f,i)=>{const h=f.h,c=f.cond,top=marks[i].filter(Boolean).length;
    const A=c>=5?['坂路で一番時計。文句なし','追って抜群の反応。充実一途','気配絶好、ここは勝負']:c>=4?['毛ヅヤ良く仕上がり上々','攻め馬の動き軽快','叩き2戦目で上積み']:c<=2?['攻め控えめで割引','馬体に余裕残す','気配ひと息、様子見']:['平行線の仕上がり','調整は順調だが決め手に課題','展開ひとつで'];
    const B={逃げ:'マイペースなら粘り込む',先行:'好位から安定した立ち回り',差し:'速い流れなら末脚が生きる',追込:'展開待ちだが一発ある'}[f.style]||'';
    let t=pick2(A,seed+i)+'。'+B+'。';
    if(f.rival&&h&&h.g1)t=`G1を${h.g1}勝の実績馬。${B}。`;
    if(f.mine&&h&&h.bond>=60)t+='厩舎の雰囲気も良い。';
    if(f.temper==='気難しい')t+='気性に課題。';
    return t;});
  const tr=F.map(f=>['D','C','B','A','S'][clamp(f.cond-1,0,4)]);
  const ord=F.map((f,i)=>i).filter(i=>marks[i][0]);const by=m=>F[marks.findIndex(x=>x[0]===m)];
  const h1=by('◎'),h2=by('○'),h3=by('▲');
  const pace=F.filter(f=>f.style==='逃げ').length>=3?'ハイペース':F.filter(f=>f.style==='逃げ').length<=1?'スローペース':'平均ペース';
  const view=`◎は${h1.name}。${comm[F.indexOf(h1)].split('。')[0]}。${h1.style==='逃げ'||h1.style==='先行'?'先行力を生かして押し切る':'直線は外から差し切る'}とみる。対抗○に${h2.name}、単穴▲は${h3.name}。展開は${pace}が濃厚で、${pace==='ハイペース'?'差し・追込勢に流れが向く':pace==='スローペース'?'前に行ける馬が有利':'力通りの決着'}だろう。`;
  const me=F.find(f=>f.mine);let col='';
  if(me){const mi=F.indexOf(me),mk=marks[mi].filter(Boolean),best=mk.length?mk.reduce((a,b)=>MKS.indexOf(a)<MKS.indexOf(b)?a:b):'無印';
    col=best==='◎'?`陣営の自信は本物。${me.name}は本紙も◎。${me.jname}騎手「状態は${me.cond>=4?'最高です':'悪くない'}。チャンスはある」`:
      mk.length?`${me.name}は印が${mk.length}つ。記者の評価は割れたが、${me.cond>=4?'追い切りの動きは目立っていた':'気配はまずまず'}。${me.jname}騎手の腕に期待。`:
      `${me.name}は記者全員が無印。だが厩舎関係者は「ここは試金石。見ていてほしい」と静かに語る。人気薄の一発に注意。`;}
  const betTxt=h1&&h2&&h3?`<div class="pbet">単勝　<b>${h1.no}</b><br>馬連　<b>${h1.no}-${h2.no}</b>　<b>${h1.no}-${h3.no}</b><br>3連複　<b>${[h1.no,h2.no,h3.no].sort((a,b)=>a-b).join('-')}</b></div>`:'';
  const head=me&&marks[F.indexOf(me)][0]==='◎'?`${me.name}、本紙◎！ ${RC.race.name}は譲れない`:h1.rival&&h1.h&&h1.h.g1?`実績上位 ${h1.name}、貫禄示す`:`${h1.name}が主役 ${RC.race.course}${RC.race.dist}m を制す`;
  return RC.paper={marks,prev,comm,tr,view,col,betTxt,head};
}
function pick2(a,s){return a[Math.floor(hh(s)*a.length)];}
function paperBtn(){const RC=UI.race;if(!RC)return '';const d=paperData(RC);const me=RC.field.find(f=>f.mine);const mk=me?d.marks[RC.field.indexOf(me)].map(m=>m||'－').join(''):'';
  return `<button class="paperbtn" data-act="paper"><span class="pm">ターフ新報</span><span style="min-width:0"><b style="font-size:14px">${esc(d.head)}</b><small>競馬新聞を開く・記者の印と短評</small></span>${me?`<span class="mk" aria-label="自分の馬への印">${mk}</span>`:''}</button>`;}
ACT.paper=()=>{const RC=UI.race,r=RC.race,F=RC.field,d=paperData(RC);
  let el=$('#paper-ov');if(!el){el=document.createElement('div');el.id='paper-ov';el.className='paper-ov';document.body.appendChild(el);
    el.addEventListener('click',e=>{if(e.target===el)ACT.paperClose();});el.addEventListener('touchmove',e=>{if(!e.target.closest('.scroll'))e.preventDefault();},{passive:false});}
  const mon=M(S.t),day=1+Math.floor(hh('day'+S.t+r.name)*27);
  const rows=F.map((f,i)=>{const w=wakuOf(f.no,F.length),h=f.h,sex=h?h.sex:pick2(['牡','牡','牝','セ'],r.name+f.no),fa=/2歳/.test(r.name)?2:/3歳/.test(r.name)?3:0,age=h?ageOf(h):fa||3+Math.floor(hh(f.no+'a')*3);
    const kin=r.grade==='G1'?(sex==='牝'?56:58):(sex==='牝'?54:56)+(hh(f.no+'k')<.3?1:0);
    const sire=h&&ST(h.sire)?ST(h.sire).n:pick2(S.stallions.map(x=>x.n),r.name+f.no+'s');
    return `<tr class="${f.mine?'me':''}"><td class="wk" style="background:${FRAMEC[w-1]};color:${FRAMET[w-1]}">${w}</td><td class="no">${f.no}</td>
      ${d.marks[i].map((m,k)=>`<td class="mk ${k?'b':''}">${m}</td>`).join('')}
      <td class="hn"><b>${esc(f.name)}</b><small>${sex}${age}　父 ${esc(sire)}　${f.style}</small></td>
      <td class="jk">${esc(f.jname)}<br><small>${kin}.0kg</small></td>
      ${d.prev[i].map(p=>`<td class="pr"><span class="p ${p.p===1?'w':''}">${p.p}着</span>${esc(p.n)}</td>`).join('')}
      <td class="tr">${d.tr[i]}</td><td class="cm">${esc(d.comm[i])}</td><td class="od">${f.odds.toFixed(1)}<br><small>${f.pop}人</small></td></tr>`;}).join('');
  el.innerHTML=`<div class="paper" role="dialog" aria-label="競馬新聞"><div class="scroll">
    <div class="mast"><div class="logo">ターフ新報</div><div class="ed"><b>${Y(S.t)}年${mon}月${day}日</b>　${esc(r.course)}版<br>第${1+Math.floor(hh(r.name)*5)}回${esc(r.course)} ${1+Math.floor(hh(r.name+'d')*8)}日目　11R</div><div class="price">定価 500円</div></div>
    <div class="ptitle">${/^G/.test(r.grade)?`<span class="gb">${r.grade}</span>`:''}<span class="rn">${esc(r.name)}</span><span class="cd">${r.surf==='ダ'?'ダート':'芝'}${r.dist}m　${r.going||'良'}　${F.length}頭　1着 ${yen(r.prize)}</span></div>
    <div class="pheadline">${esc(d.head)}</div>
    <div class="ptbl-wrap"><table class="ptbl"><thead><tr><th>枠</th><th>馬番</th>${PAPER_REP.map(p=>`<th>${p.k}</th>`).join('')}<th>馬名</th><th>騎手</th><th>前走</th><th>2走前</th><th>3走前</th><th>調教</th><th>短評</th><th>予想</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="pnote">← 表は横にスクロールできます　◎本命 ○対抗 ▲単穴 △連下 ☆穴</div>
    <div class="pcols"><div class="pbox"><h4><i>本紙</i>本紙の見解</h4><p>${esc(d.view)}</p></div><div class="pbox"><h4><i>買い目</i>本紙・高木の推奨</h4>${d.betTxt}</div></div>
    ${d.col?`<div class="pbox" style="margin-top:10px"><h4><i>厩舎</i>トレセン便り</h4><p>${esc(d.col)}</p></div>`:''}
    </div><div class="pfoot"><button class="btn pri" data-act="paperClose">新聞をたたむ</button></div></div>`;
  el.hidden=false;
};
ACT.paperClose=()=>{const el=$('#paper-ov');if(el){el.hidden=true;el.innerHTML='';}};
/* put the paper into the pre-race screens */
function insertPaper(){const sh=$('#sheet');if(!sh||sh.querySelector('.paperbtn'))return;const at=sh.querySelector('.boxlines')||sh.querySelector('.tbl-wrap');if(!at)return;at.insertAdjacentHTML('beforebegin',paperBtn());}
showOwnerBox=(o=>function(){const r=o.apply(this,arguments);insertPaper();return r;})(showOwnerBox);
showPaddock=(o=>function(){const r=o.apply(this,arguments);if(!$('#obox'))insertPaper();return r;})(showPaddock);
showTrackGate=(o=>function(){const r=o.apply(this,arguments);if(!$('#obox')&&!$('#cv'))insertPaper();return r;})(showTrackGate);
closeModal=(o=>function(){ACT.paperClose();return o.apply(this,arguments);})(closeModal);
/* 馬主席: every race you go and watch starts from your seat, not just graded races */
showTrackGate=(o=>function(){const RC=UI.race;if(RC&&!RC.race.g&&!RC.boxSeen&&RC.watched&&!S.flags.condResultOnly){showOwnerBox('gate');return;}return o.apply(this,arguments);})(showTrackGate);
/* make clear where the race is watched from */
showRaceView=(o=>function(){const r=o.apply(this,arguments);const fl=$('#sheet .from-line');if(fl&&UI.race)fl.insertAdjacentHTML('beforeend',`<span class="watchfrom">${S.restPenalty>0?'病室のテレビ':UI.race.boxSeen?'馬主席・場内モニター':'場内モニター'}</span>`);return r;})(showRaceView);
