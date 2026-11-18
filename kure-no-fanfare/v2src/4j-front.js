/* =========================================================
   ターフ新報 1面: a sports-paper style front page
   (huge vertical headline, number badge, training photo,
   mini 馬柱 strip, side boxes and an ad), plus tabs 1面 / 馬柱
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
.nptabs{flex:none;display:grid;grid-template-columns:1fr 1fr;background:#141210;padding:6px 8px 0;gap:4px}
.nptabs button{border:0;border-radius:8px 8px 0 0;background:#3a352c;color:#d8d0bc;font-weight:700;font-size:14px;min-height:40px}
.nptabs button.on{background:#f1ecdf;color:#141210}
.fpwrap{position:relative;overflow:hidden;border:1px solid #141210;background:#fff}
.fpwrap.zoom{overflow:auto;-webkit-overflow-scrolling:touch}
.fp{position:absolute;left:0;top:0;width:720px;height:520px;transform-origin:0 0;background:#fdfcf8;color:#111;font-family:"Zen Kaku Gothic New",sans-serif;overflow:hidden}
.fpwrap.zoom .fp{position:relative}
.fp *{box-sizing:border-box}
.fp .topbar{position:absolute;left:0;right:0;top:0;height:58px;display:flex;gap:6px;padding:4px;background:#fff;border-bottom:3px solid #c8161d}
.fp .ad1{width:118px;background:#0f3b2e;color:#e9f2ec;display:flex;align-items:center;justify-content:center;font-family:Oswald,sans-serif;font-weight:700;font-size:20px;letter-spacing:.12em}
.fp .ad1 small{display:block;font-size:8px;letter-spacing:.1em;font-family:"Zen Kaku Gothic New",sans-serif;text-align:center}
.fp .badge{width:74px;background:radial-gradient(circle at 50% 35%,#ffe27a,#d39b16 70%,#7a5208);border-radius:6px;color:#3b1d00;font-weight:900;font-size:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.15;text-align:center;padding:2px}
.fp .badge b{font-size:13px}
.fp .tease{flex:1;min-width:0;font-weight:900;font-size:27px;line-height:50px;white-space:nowrap;overflow:hidden;letter-spacing:-.02em;color:#1b2f7a}
.fp .tease em{font-style:normal;color:#c8161d;font-family:Oswald,sans-serif;font-size:32px}
.fp .logo{width:168px;position:relative}
.fp .logo .l1{position:absolute;right:0;top:0;height:30px;width:168px;background:#c8161d;color:#fff;font-weight:900;font-size:24px;line-height:30px;text-align:center;letter-spacing:.06em;border-radius:15px 4px 4px 15px;font-family:"Shippori Mincho B1",serif}
.fp .logo .l1 i{font-style:normal;display:inline-block;width:22px;height:22px;border-radius:50%;background:#fff;color:#c8161d;font-size:15px;line-height:22px;margin-left:4px;vertical-align:2px}
.fp .logo .l2{position:absolute;right:0;bottom:0;display:flex;gap:2px}
.fp .logo .l2 span{background:#c8161d;color:#fff;font-weight:900;font-size:15px;padding:0 3px;line-height:22px}
.fp .logo .l2 span.y{background:#ffd400;color:#c8161d}
.fp .strip{position:absolute;left:4px;top:64px;width:416px;height:214px;border:1px solid #141210;display:flex;flex-direction:row-reverse;background:#fff}
.fp .strip .hd{width:28px;background:#fff;border-left:1px solid #141210;display:flex;flex-direction:column;align-items:center;font-weight:900}
.fp .strip .hd .c{font-size:13px;writing-mode:vertical-rl;padding:2px 0}
.fp .strip .hd .r{background:#c8161d;color:#fff;font-family:Oswald,sans-serif;font-size:22px;width:100%;text-align:center;line-height:1.1}
.fp .strip .hd .t{font-size:8px;writing-mode:vertical-rl;margin-top:4px;color:#333}
.fp .strip .hd .wk{margin-top:6px;writing-mode:vertical-rl;background:#c8161d;color:#fff;font-size:10px;padding:3px 1px}
.fp .col{flex:1;min-width:0;border-left:1px solid #b8b8b8;display:flex;flex-direction:column;align-items:stretch;font-size:6.5px;line-height:1.15;text-align:center}
.fp .col.me{background:#fff3a8}
.fp .col .wk{font-family:Oswald,sans-serif;font-weight:700;font-size:9px;line-height:12px}
.fp .col .mk{font-size:10px;color:#c8161d;font-weight:900;height:12px;line-height:12px}
.fp .col .nm{flex:none;height:78px;writing-mode:vertical-rl;margin:0 auto;font-weight:900;font-size:9.5px;letter-spacing:-.04em;overflow:hidden;font-family:"Shippori Mincho B1",serif}
.fp .col .sm{color:#444;height:9px;overflow:hidden;white-space:nowrap}
.fp .col .lines{flex:1;background:repeating-linear-gradient(180deg,#fff 0 3px,#dcdcdc 3px 4px);margin:2px 1px;position:relative}
.fp .col .lines b{position:absolute;left:0;right:0;font-family:Oswald,sans-serif;font-size:10px;color:#111;background:#fff}
.fp .col .lines b.w{color:#c8161d}
.fp .col .od{font-family:Oswald,sans-serif;font-size:9px;font-weight:700;border-top:1px solid #b8b8b8}
.fp .mainhl{position:absolute;right:4px;top:62px;width:292px;height:454px}
.fp .vtxt{position:absolute;writing-mode:vertical-rl;font-weight:900;line-height:1;white-space:nowrap;letter-spacing:-.04em}
.fp .h-red{right:2px;top:2px;font-size:62px;color:#e8371b;-webkit-text-stroke:2px #fff;paint-order:stroke fill;text-shadow:3px 3px 0 #7a0d06,0 0 1px #000}
.fp .h-blue{font-size:132px;color:#1d34a8;-webkit-text-stroke:5px #fff;paint-order:stroke fill;text-shadow:5px 5px 0 #0b1650}
.fp .h-white{font-size:132px;color:#fff;-webkit-text-stroke:5px #1d34a8;paint-order:stroke fill;text-shadow:5px 5px 0 #0b1650}
.fp .h-sub{font-size:22px;color:#1d34a8;-webkit-text-stroke:1px #fff;paint-order:stroke fill;background:transparent}
.fp .nobadge{position:absolute;width:86px;height:86px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#ff8fc2,#e5157a 70%);border:4px solid #fff;box-shadow:0 0 0 2px #e5157a,3px 3px 0 3px rgba(0,0,0,.25);color:#fff;font-family:Oswald,sans-serif;font-weight:700;font-size:54px;display:grid;place-items:center;-webkit-text-stroke:1.5px #6d0a3a;paint-order:stroke fill}
.fp .wakuv{position:absolute;writing-mode:vertical-rl;background:#c8161d;color:#fff;font-weight:900;font-size:16px;padding:6px 3px;letter-spacing:.1em}
.fp .photo{position:absolute;left:176px;top:304px;width:122px;height:190px;overflow:hidden;background:#cbb79a}
.fp .photo canvas{display:block;width:100%;height:100%}
.fp .cap1{position:absolute;left:176px;top:282px;width:300px;height:22px;background:linear-gradient(90deg,#e6f6ff,#fff);color:#0f6ea8;font-weight:900;font-size:13px;line-height:22px;padding-left:6px;white-space:nowrap;overflow:hidden;z-index:2}
.fp .cap2{position:absolute;left:176px;bottom:4px;width:262px;height:20px;background:linear-gradient(90deg,#0f8f8a,#5bc7b3);color:#fff;font-weight:900;font-size:12px;line-height:20px;padding-left:6px;white-space:nowrap;overflow:hidden;z-index:2}
.fp .body{position:absolute;left:300px;top:304px;width:136px;height:186px;column-count:2;column-gap:6px;font-size:7.5px;line-height:1.5;color:#222;text-align:justify;background:rgba(253,252,248,.92);padding:3px;z-index:1}
.fp .side{position:absolute;left:4px;top:284px;width:168px;bottom:4px;display:flex;flex-direction:column;gap:4px}
.fp .sbox{border:1px solid #141210;background:#fff}
.fp .sbox h5{margin:0;font-size:10.5px;font-weight:900;background:#141210;color:#fff;padding:2px 4px;white-space:nowrap;overflow:hidden}
.fp .sbox h5.r{background:#c8161d}
.fp .sbox p{margin:0;padding:3px 4px;font-size:7.5px;line-height:1.5;color:#222}
.fp .sbox p b{color:#c8161d;font-size:9px}
.fp .ad2{flex:1;min-height:60px;background:linear-gradient(135deg,#ff9a1f,#ffd84a);border:1px solid #141210;position:relative;overflow:hidden;padding:4px}
.fp .ad2 .n{background:#7a1a12;color:#fff;font-weight:900;font-size:10px;padding:1px 4px;display:inline-block;font-family:"Shippori Mincho B1",serif}
.fp .ad2 .f{font-weight:900;color:#c8161d;font-size:22px;-webkit-text-stroke:1px #fff;paint-order:stroke fill;line-height:1.1}
.fp .ad2 .p{position:absolute;right:6px;bottom:4px;font-family:Oswald,sans-serif;font-weight:700;font-size:28px;color:#fff;-webkit-text-stroke:2px #c8161d;paint-order:stroke fill}
.fp .ad2 .p small{font-size:12px}
.fp .ad2 .gl{position:absolute;left:10px;bottom:4px;display:flex;gap:4px}
.fp .ad2 .gl i{width:16px;height:26px;border-radius:2px 2px 4px 4px;background:linear-gradient(180deg,#fff 0 18%,#f6e27a 18%);border:1px solid #c99a1a}
.fpctl{display:flex;justify-content:space-between;align-items:center;margin-top:6px;font-size:10.5px;color:#5a5240}
.fpctl button{border:1px solid #8a8170;background:#faf6ea;border-radius:999px;padding:4px 12px;font-size:12px;min-height:32px}
`;document.head.appendChild(st);})();

const paperUB=ACT.paper;
ACT.paper=d=>{const t=(d&&d.t)||'front';if(t==='ub'){paperUB();addPaperTabs('ub');return;}
  paperUB();const el=$('#paper-ov'),sc=el.querySelector('.np .scroll');sc.innerHTML=frontHTML();addPaperTabs('front');fitFront();drawFrontPhoto();};
function addPaperTabs(on){const np=$('#paper-ov .np');if(!np||np.querySelector('.nptabs'))return;
  np.insertAdjacentHTML('afterbegin',`<div class="nptabs"><button class="${on==='front'?'on':''}" data-act="paper" data-t="front">スポーツ紙</button><button class="${on==='ub'?'on':''}" data-act="paper" data-t="ub">競馬専門紙</button></div>`);}
ACT.fpZoom=()=>{const w=$('#fpwrap');if(!w)return;w.classList.toggle('zoom');fitFront();};
function fitFront(){const w=$('#fpwrap'),fp=w&&w.querySelector('.fp');if(!fp)return;
  if(w.classList.contains('zoom')){fp.style.transform='';w.style.height='520px';w.scrollLeft=720;return;}
  const s=w.clientWidth/720;fp.style.transform=`scale(${s})`;w.style.height=520*s+'px';}
window.addEventListener('resize',()=>{if($('#fpwrap'))fitFront();});
function frontHTML(){
  const RC=UI.race,r=RC.race,F=RC.field,d=paperData(RC),n=F.length;
  const hi=d.marks.findIndex(x=>x[0]==='◎'),h1=F[hi],me=F.find(f=>f.mine),meTop=me&&h1===me;
  const seed=r.name+S.t;
  const nm=h1.name,half=nm.length>5?Math.ceil(nm.length/2):nm.length;
  const c1=nm.slice(0,half),c2=nm.slice(half);
  const fs=Math.min(120,Math.floor(360/Math.max(c1.length,c2.length||1)));
  const age=h1.h?ageOf(h1.h):4,sex=h1.h?h1.h.sex:'牡';
  const red=meTop?pick2(['本紙◎に乗れ!!','夢の続きを!!','オーナーの悲願へ!!'],seed):h1.rival&&h1.h&&h1.h.g1?pick2(['王者の貫禄!!','格の違い見せる!!'],seed):pick2(['本紙◎に乗れ!!','万券の使者!!',`${r.course}で輝く!!`],seed);
  const sub=h1.h&&h1.h.g1?`G1・${h1.h.g1+1}勝目へ`:`${age}歳 ${pick2(['充実','上昇一途','本格化','健在'],seed+'a')}`;
  const tw=['3連単','馬連','3連複','ワイド'],lastG=pick2(['AR共和国杯','京王杯','毎日王冠','オールカマー','中山記念','阪神大賞典','京成杯','愛知杯'],seed+'g');
  const tease=`先週${lastG}<em>${pick2(tw,seed+'t')}</em>${pick2(['29万','12万','8万','47万','5万'],seed+'m')}円ズバッ`;
  const w=wakuOf(h1.no,n);
  const tr=h1.mine&&h1.h&&P(h1.h.trainer)?P(h1.h.trainer).n.split(' ')[0]:pick2(['高村','松永','尾上','角田','堀内'],seed+'tr');
  const cap1=h1.cond>=4?'ここ目標に万全の仕上がり「今が最盛期」':'「状態は上向き」陣営に手応え';
  const cap2=`${h1.jname.split(' ')[0]}騎手「${pick2(['手応えは十分','チャンスは大きい','この馬を信じる'],seed+'j')}」`;
  const rfs=Math.min(62,Math.floor(440/red.length)),subH=sub.length*22+8;
  let wTop=4,subR=76+2*fs,subT=4;if(!c2||subR+26>292){subR=76+fs;subT=4;wTop=subH+6;}
  const wR=76+fs,bTop=c2?Math.min(454-88,wTop+c2.length*fs+6):subT+subH+6,bR=c2?wR+fs/2-43:wR+4;
  const mainHL=`<div class="vtxt h-red" style="font-size:${rfs}px">${esc(red)}</div>
      <div class="vtxt h-blue" style="right:76px;top:4px;font-size:${fs}px">${esc(c1)}</div>
      ${c2?`<div class="vtxt h-white" style="right:${wR}px;top:${wTop}px;font-size:${fs}px">${esc(c2)}</div>`:''}
      <div class="vtxt h-sub" style="right:${subR}px;top:${subT}px">${esc(sub)}</div>
      <div class="nobadge" style="right:${bR}px;top:${bTop}px">${h1.no}</div>`;
  const strip=[...F].map((f,i)=>{const wk=wakuOf(f.no,n),mk=d.marks[i];const p=(d.prev[i]||[])[0];
    return `<div class="col ${f.mine?'me':''}"><div class="wk" style="background:${FRAMEC[wk-1]};color:${FRAMET[wk-1]}">${f.no}</div><div class="mk">${mk[0]||''}</div><div class="mk" style="color:#111">${mk[1]||''}</div><div class="nm">${esc(f.name)}</div><div class="sm">${esc(f.jname.split(' ')[0])}</div><div class="sm">${f.h?ageOf(f.h):''}</div><div class="lines">${p?`<b class="${p.p===1?'w':''}" style="top:2px">${p.p}着</b>`:''}${d.prev[i]&&d.prev[i][1]?`<b class="${d.prev[i][1].p===1?'w':''}" style="top:40%">${d.prev[i][1].p}着</b>`:''}</div><div class="od">${f.odds.toFixed(1)}</div></div>`;}).join('');
  const stat1=`過去10年で${pick2(['1','2','3'],seed+'s1')}番人気が${pick2(['5','6','7'],seed+'s2')}勝`,stat2=`${h1.no}番枠は${pick2(['勝率3割','連対率5割','3着内率6割'],seed+'s3')}`;
  const body=`${r.course}${r.dist}mで行われる${r.name}。本紙の見立ては${h1.name}だ。${d.comm[hi]}${tr}調教師は「${h1.cond>=4?'ここを目標に仕上げてきた。今が一番いい':'状態は上向き。あとは展開ひとつ'}」と胸を張る。${me&&!meTop?`一方、${me.name}（${me.no}番）は${d.marks[F.indexOf(me)].filter(Boolean).length?'記者の間でも評価が分かれる存在。':'無印ながら陣営は静かに自信をのぞかせる。'}`:''}${d.view}`;
  return `<div class="fpwrap" id="fpwrap"><div class="fp">
    <div class="topbar"><div class="ad1"><span>TURF<small>HORSE CLUB</small></span></div><div class="badge"><span>第${Y(S.t)-1955}回</span><b>${esc(r.grade||'')}</b><span>${esc(r.name.slice(0,6))}</span></div>
      <div class="tease">${tease}</div>
      <div class="logo"><div class="l1">ターフスポ<i>馬</i></div><div class="l2">${[...'あす荒れる'].map((c,i)=>`<span class="${i===2||i===3?'y':''}">${c}</span>`).join('')}</div></div></div>
    <div class="strip">${''}<div class="hd"><span class="c">${esc(r.course)}</span><span class="r">${r.g?11:9}</span><span class="t">発走 15:40</span><span class="wk">枠順確定</span></div>${strip}</div>
    <div class="side"><div class="sbox"><h5 class="r">荒れる荒れる!? ${esc(r.name.slice(0,6))}</h5><p>${esc(stat1)}。<b>穴党</b>注目の一戦だ。</p></div><div class="sbox"><h5>${esc(stat2)}</h5><p>データは<b>${h1.no}番</b>を後押しする。</p></div>
      <div class="ad2"><span class="n">居酒屋 ひづめ</span><div class="f">ハイボール祭</div><div class="gl"><i></i><i></i><i></i></div><div class="p">290<small>円</small></div></div></div>
    <div class="photo"><canvas id="fpphoto"></canvas></div><div class="cap1">${esc(cap1)}</div><div class="cap2">${esc(cap2)}</div>
    <div class="body">${esc(body)}</div>
    <div class="mainhl">${mainHL}</div>
  </div></div>
  <div class="fpctl"><span>${Y(S.t)}年${M(S.t)}月　ターフスポーツ 競馬面</span><button data-act="fpZoom">拡大して読む</button></div>
  <div class="npbox" style="margin-top:8px"><h4 class="red"><span>本紙の見解</span><span>本紙・高木</span></h4><p>${esc(d.view)}</p></div>
  ${d.col?`<div class="npbox" style="margin-top:8px"><h4><span>トレセン便り</span><span>厩舎情報</span></h4><p>${esc(d.col)}</p></div>`:''}`;
}
/* the training photo: the ◎ horse in a work-out, galloping at the camera's left */
function drawFrontPhoto(){const cv=$('#fpphoto');if(!cv)return;const RC=UI.race,F=RC.field,d=paperData(RC),h1=F[d.marks.findIndex(x=>x[0]==='◎')];
  const W=122,H=190,dpr=2;cv.width=W*dpr;cv.height=H*dpr;const c=cv.getContext('2d');c.scale(dpr,dpr);
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#8a7a64');g.addColorStop(.35,'#b39a78');g.addColorStop(1,'#d8c3a2');c.fillStyle=g;c.fillRect(0,0,W,H);
  // blurred trees / rail
  c.fillStyle='rgba(60,80,50,.55)';for(let i=0;i<5;i++){c.beginPath();c.ellipse(i*30+10,30,26,30,0,0,7);c.fill();}
  c.fillStyle='rgba(255,255,255,.85)';c.fillRect(0,60,W,3);for(let x=0;x<W;x+=22)c.fillRect(x,60,2,12);
  // woodchip speckles + motion streaks
  for(let i=0;i<500;i++){c.fillStyle=`rgba(${90+R()*60|0},${70+R()*40|0},${50+R()*30|0},.35)`;c.fillRect(R()*W,80+R()*(H-80),2+R()*6,1);}
  c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=1;for(let i=0;i<10;i++){const y=80+R()*100;c.beginPath();c.moveTo(R()*20,y);c.lineTo(40+R()*60,y);c.stroke();}
  // the horse, big, with a work rider (dark jacket & helmet)
  const coat=h1.coat||(h1.h&&h1.h.coat)||'芦毛';
  drawHorse(c,64,170,1.45,1.1,coat,{a:'#1f2a44',b:'#1f2a44',p:''},h1.no,false,{});
  // dust kicked up
  c.fillStyle='rgba(222,205,175,.55)';for(let i=0;i<30;i++){c.beginPath();c.arc(10+R()*60,166+R()*20,2+R()*5,0,7);c.fill();}
  // photo credit
  c.fillStyle='rgba(255,255,255,.9)';c.font='bold 8px sans-serif';c.textAlign='right';c.font='bold 7px sans-serif';c.fillText('最終追い切り（撮影・本紙）',W-3,H-4);
}
