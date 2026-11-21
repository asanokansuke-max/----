/* =========================================================
   若手騎手の重賞制覇: when one of the young riders (日向・小森・桐生, or any rider still on the way up)
   wins a graded race on your horse, the press mob them in front of the weighing room,
   and the next morning's sports paper puts the rider on the front page.
   ========================================================= */
const PRESS_YOUNG={hinata:{tag:'若武者',a:['「…まだ、実感がないです。最後まで、馬が諦めないでいてくれました」','「母に、いちばんに電話したいです」'],k:'涙の'},
  komori:{tag:'新人',a:['「あ、あの…ほんとに、勝ったんですか…？」','「牧場のみんなと、家族に…ありがとうって言いたいです」'],k:'19歳'},
  kiryu:{tag:'女性騎手',a:['「女性騎手だから、じゃなくて。騎手として勝てたのが、いちばん嬉しいです」','「早瀬先生に、やっと恩返しができました」'],k:'快挙'}};
function pressYoung(f){if(!f||!f.jid||f.jid==='stable')return false;if(PRESS_YOUNG[f.jid])return true;const j=JK(f.jid);return !!(j&&j.grow&&(PROF[f.jid]?.age||40)<30);}
function pressData(RC,f){const id=f.jid,P0=PRESS_YOUNG[id]||{tag:'若手',a:['「信じられないです。馬に感謝しかありません」','「応援してくださった皆さんのおかげです」'],k:'殊勲の'};
  S.jkG=S.jkG||{};const k=id+'|'+(RC.race.grade==='G1'?'G1':'g');S.jkG[k]=(S.jkG[k]||0)+1;const n=S.jkG[k],g1=RC.race.grade==='G1';
  const nm=JNAME(id),sur=nm.split(/[ 　]/)[0],age=(PROF[id]&&PROF[id].age)||'',own=S.part===1?S.parent.name:(S.child&&S.child.name)||'';
  const head=g1?(n===1?`${sur} G1初制覇`:`${sur} G1${n}勝目`):(n===1?`${sur} 重賞初V`:`${sur} 重賞${n}勝目`);
  const sub=`${age?age+'歳の':''}${P0.tag} ${f.name}と${n===1?'つかんだ':'また'}${g1?'頂点':'大舞台'}`;
  const q=[[`記者「${g1?'G1':'重賞'}${n===1?'初制覇':'制覇'}、おめでとうございます！ 今の気持ちは？」`,`${sur}${P0.a[0]}`],
    [`記者「ゴール前、何を考えていましたか」`,`${sur}「${pick(['とにかく、まっすぐ走らせることだけ考えてました','先頭に立ってからが長かったです。でも、馬がまだ余力を残してました','外から来たのが見えて…でも、この馬なら残せると思いました'])}」`],
    [`記者「オーナーに一言」`,`${sur}「${own}さんが、僕${id==='kiryu'?'…いえ、私':''}を乗せ続けてくれたおかげです。${P0.a[1].replace(/^「|」$/g,'')}」`]];
  return {id,nm,sur,head,sub,q,g1,n,race:RC.race.name,grade:RC.race.grade,horse:f.name,coat:f.coat||(f.h&&f.h.coat)||'鹿毛',silks:f.silks,no:f.no,kicker:P0.k,y:Y(S.t),m:M(S.t),own};}
(function(){const st=document.createElement('style');st.textContent=`
.pressin{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:linear-gradient(90deg,#1b2433,#2b3a55);color:#fff;margin:6px 0}
.pressin b{font-size:14px}.pressin small{display:block;font-size:11px;color:#c9d4e3}.pressin .btn{margin-left:auto;background:#ffd166;color:#1b2433;border:0;font-weight:800;white-space:nowrap}
#pressov{position:fixed;inset:0;z-index:60;background:rgba(6,12,9,.7);display:flex;align-items:flex-end;justify-content:center;padding-top:calc(24px + env(safe-area-inset-top,0px))}
#pressov>.sheet{max-height:100%;overflow-y:auto;overscroll-behavior:contain}
.press{display:grid;gap:12px}
.press .mob{position:relative;height:210px;border-radius:12px;overflow:hidden;background:radial-gradient(120% 90% at 50% 100%,#3a4356,#11151d 70%)}
.press .mob .av{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);filter:drop-shadow(0 6px 12px rgba(0,0,0,.6))}
.press .mob .mic{position:absolute;width:12px;height:46px;border-radius:6px 6px 3px 3px;background:linear-gradient(180deg,#2a2a2a 0 32%,#c9c9c9 32%);transform-origin:50% 100%}
.press .mob .mic i{position:absolute;left:-8px;top:14px;width:28px;height:12px;border-radius:2px;font:700 7px/12px sans-serif;color:#fff;text-align:center}
.press .mob .ppl{position:absolute;bottom:-8px;width:44px;height:64px;border-radius:22px 22px 0 0;background:#0b0e14}
.press .mob .fl{position:absolute;width:90px;height:90px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.95),rgba(255,255,255,0) 60%);opacity:0;animation:pfl 2.6s infinite}
@keyframes pfl{0%,100%{opacity:0}4%{opacity:1}12%{opacity:0}}
.press .mob .cap{position:absolute;left:10px;top:8px;font:700 11px "Zen Kaku Gothic New",sans-serif;color:#ffd166;letter-spacing:.2em}
.press .qa{display:grid;gap:6px;font-size:14px;line-height:1.7}.press .qa p{margin:0}.press .qa .rq{color:var(--muted);font-size:13px}
.ypaper{background:#f7f4ec;color:#141210;border-radius:4px;padding:10px;box-shadow:0 10px 24px rgba(0,0,0,.35);transform:rotate(-.7deg);display:grid;gap:8px;font-family:"Zen Kaku Gothic New",sans-serif}
.ypaper .mh{display:flex;align-items:center;gap:8px;border-bottom:4px solid #c8161d;padding-bottom:4px}
.ypaper .mh b{font:400 22px/1 "Dela Gothic One",sans-serif;color:#fff;background:linear-gradient(180deg,#e8231b,#a80f12);padding:3px 8px;transform:skewX(-6deg);font-style:italic}
.ypaper .mh small{margin-left:auto;font:700 11px Oswald,sans-serif}
.ypaper .body{display:grid;grid-template-columns:auto 1fr;gap:10px;min-height:250px}
.ypaper .hl{writing-mode:vertical-rl;font:400 clamp(30px,8.6vw,44px)/1.05 "Dela Gothic One",sans-serif;color:#e3261b;-webkit-text-stroke:1.4px #6e0a05;letter-spacing:-.02em;text-shadow:3px 3px 0 rgba(0,0,0,.18)}
.ypaper .hl .kk{display:inline-block;font-size:.55em;color:#1b2fa3;-webkit-text-stroke:.8px #0b1650}
.ypaper .rt{display:grid;gap:6px;align-content:start;min-width:0}
.ypaper .sub{font:900 15px/1.35 "Zen Kaku Gothic New",sans-serif;background:#141210;color:#ffd23a;padding:5px 8px}
.ypaper canvas{width:100%;display:block;border:2px solid #141210}
.ypaper .art{font-size:11.5px;line-height:1.7;color:#2a2520}`;document.head.appendChild(st);})();
showResult=(o=>function(){const RC=UI.race;const r=o.apply(this,arguments);try{
  const w=RC&&RC.order&&RC.order[0];if(w&&w.mine&&RC.race.g&&pressYoung(w)&&!RC.pressDone){RC.pressDone=1;const d=RC.press=pressData(RC,w);
    trust(d.id,6);try{skUp(d.id,.6);}catch(e){}if(w.h)w.h.fans=(w.h.fans||0)+(d.g1?6000:2500);S.fame+=d.g1?1.5:.6;
    S.pressLog=S.pressLog||[];S.pressLog.unshift({t:S.t,head:d.head,sub:d.sub});log(`スポーツ紙1面「${d.head}」`);save();}
  if(RC&&RC.press){const ban=document.querySelector('#sheet .result-banner');if(ban&&!document.querySelector('#sheet .pressin'))ban.insertAdjacentHTML('afterend',`<div class="pressin"><span><b>検量室前に記者が殺到！</b><small>${esc(RC.press.nm)}騎手、${esc(RC.press.g1?'G1':'重賞')}${RC.press.n===1?'初制覇':'制覇'}</small></span><button class="btn sm" data-act="pressOpen">囲み取材を見る</button></div>`);}
  }catch(e){console.error('press',e);}return r;})(showResult);
ACT.pressOpen=()=>{const RC=UI.race,d=RC&&RC.press;if(!d)return;
  const mics=['JRT','TSP','KNB','日刊','報知','中スポ','サンス','デイリ'].map((t,i)=>{const x=8+i*11.5,rot=(x-50)*.55,col=['#c8161d','#1f4ea3','#1d8a4a','#e07a2a','#7a1f2a','#2b3a55','#b8862b','#6b3a5a'][i];return `<span class="mic" style="left:${x}%;bottom:${4+Math.abs(x-50)*.25}px;transform:rotate(${rot}deg)"><i style="background:${col}">${t}</i></span>`;}).join('');
  const ppl=Array.from({length:9},(_,i)=>`<span class="ppl" style="left:${i*11.5-2}%;height:${54+((i*37)%5)*6}px"></span>`).join('');
  const fl=Array.from({length:7},(_,i)=>`<span class="fl" style="left:${(i*17+5)%92}%;top:${(i*29)%55}%;animation-delay:${(i*.37).toFixed(2)}s"></span>`).join('');
  // shown over the result (the result underneath stays as it is)
  const ov=document.createElement('div');ov.id='pressov';document.body.appendChild(ov);
  ov.innerHTML=(`<div class="sheet wide"><div class="from-line">${dstr(S.t)}　検量室前</div><h2>囲み取材</h2>
   <div class="press"><div class="mob"><span class="cap">PRESS</span>${fl}<div class="av">${avatar(d.id,110)}</div>${ppl}${mics}</div>
    <div class="qa">${d.q.map(([q,a])=>`<p class="rq">${esc(q)}</p><p>${esc(a)}</p>`).join('')}</div>
    <div class="from-line" style="margin-top:4px">翌朝のスポーツ紙</div>
    <div class="ypaper"><div class="mh"><b>ターフスポーツ</b><span style="font:700 11px sans-serif">${d.g1?'G1':'重賞'}速報</span><small>${d.y}.${String(d.m).padStart(2,'0')}</small></div>
     <div class="body"><div class="hl"><span class="kk">${esc(d.kicker)}</span>${tcy(d.head)}</div>
      <div class="rt"><div class="sub">${esc(d.sub)}</div><canvas id="ypc"></canvas>
       <div class="art">${esc(d.race)}${/^G/.test(d.grade||'')?`（${esc(d.grade)}）`:''}は、${esc(d.nm)}騎手騎乗の${esc(d.horse)}が制した。${d.n===1?`${esc(d.sur)}にとって、これが${d.g1?'G1':'重賞'}初勝利。`:''}検量室前には報道陣が詰めかけ、${esc(d.sur)}は${d.n===1?'少し照れくさそうに':'落ち着いた様子で'}質問に答えた。オーナーの${esc(d.own)}氏も「${pick(['ジョッキーがよく乗ってくれた','これからも任せたい','馬も騎手も、まだまだ伸びる'])}」と目を細めた。</div></div></div></div></div>
   <div class="row"><button class="btn pri" data-act="pressBack">結果に戻る</button></div></div>`);
  try{const cv=$('#ypc'),c=cv.getContext('2d'),W=cv.clientWidth||200,H=Math.round(W*.62),dpr=window.devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';c.scale(dpr,dpr);
    const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#cfd8dc');g.addColorStop(.45,'#e9ecec');g.addColorStop(.46,'#6f9b62');g.addColorStop(1,'#4f7d45');c.fillStyle=g;c.fillRect(0,0,W,H);
    c.fillStyle='#f4f4f0';c.fillRect(0,H*.5,W,2);drawHorse(c,W*.55,H*.86,H/150,1.2,d.coat,d.silks,d.no,true,{});
    // halftone, like a newspaper photo
    c.globalCompositeOperation='multiply';c.fillStyle='rgba(120,110,95,.25)';for(let y=0;y<H;y+=3)for(let x=(y/3%2)*1.5;x<W;x+=3){c.beginPath();c.arc(x,y,.55,0,7);c.fill();}c.globalCompositeOperation='source-over';
    c.fillStyle='rgba(0,0,0,.65)';c.fillRect(0,H-16,W,16);c.fillStyle='#fff';c.font='bold 10px sans-serif';c.fillText(`ゴール前、ガッツポーズの${d.sur}騎手`,6,H-5);}catch(e){}};
ACT.pressBack=()=>{const o=document.getElementById('pressov');if(o)o.remove();};
