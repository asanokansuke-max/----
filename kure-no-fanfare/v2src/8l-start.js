/* =========================================================
   はじまりの流れ: タイトル → オープニング → あなたの設定 → 物語を始める
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
.ttlpage{position:relative;min-height:100%;display:grid;place-items:center;padding:40px 22px calc(40px + env(safe-area-inset-bottom,0px));background:radial-gradient(120% 70% at 50% 115%,#4a3220 0%,#1a1a22 45%,#07090d 80%);color:#efe9da;text-align:center;overflow:hidden}
.ttlpage .in{display:grid;gap:18px;justify-items:center;max-width:520px;position:relative}
.ttlpage .kick{font:600 12px "Zen Kaku Gothic New",sans-serif;letter-spacing:.5em;color:#c9a75e}
.ttlpage h1{margin:0;font-family:"Shippori Mincho B1",serif;font-weight:800;font-size:min(56px,10.5vw);letter-spacing:.08em;line-height:1.25;background:linear-gradient(180deg,#fff3d0,#d9a441 60%,#9b6a1d);-webkit-background-clip:text;background-clip:text;color:transparent}
.ttlpage .en{font:500 11px "Zen Kaku Gothic New",sans-serif;letter-spacing:.5em;color:#a99f88}
.ttlpage .lead{font-family:"Shippori Mincho B1",serif;font-size:14px;line-height:2;color:#d8cfbb;margin:6px 0 10px}
.ttlpage .go{min-width:220px;min-height:52px;border-radius:999px;border:1px solid #c9a75e;background:linear-gradient(180deg,rgba(201,167,94,.28),rgba(201,167,94,.08));color:#fff3d0;font:700 16px "Zen Kaku Gothic New",sans-serif;letter-spacing:.3em;padding-left:.3em}
.ttlpage .sub{background:none;border:0;color:#a99f88;font:500 12px "Zen Kaku Gothic New",sans-serif;letter-spacing:.2em;text-decoration:underline;text-underline-offset:4px}
.ttlpage .glow{position:absolute;left:50%;bottom:-20vmin;width:90vmin;height:60vmin;margin-left:-45vmin;border-radius:50%;background:radial-gradient(ellipse,rgba(255,170,90,.28),rgba(255,170,90,0) 70%);pointer-events:none}
.setup{max-width:520px;margin:0 auto;padding:28px 18px calc(28px + env(safe-area-inset-bottom,0px));display:grid;gap:16px}
.setup .hd{text-align:center;display:grid;gap:4px}.setup .hd small{font-size:11px;letter-spacing:.4em;color:var(--muted)}
.setup .hd h2{margin:0;font-family:"Shippori Mincho B1",serif;font-size:24px;letter-spacing:.1em}
.setup .card{border:1px solid var(--line);border-radius:16px;background:var(--panel);padding:16px;display:grid;gap:14px}
.setup label.l{display:block;font-size:12px;font-weight:700;color:var(--muted);margin-bottom:6px;letter-spacing:.08em}
.setup input[type=text]{width:100%;min-height:48px;border-radius:12px;border:1px solid var(--line);background:var(--bg,#fff);color:inherit;font:600 17px "Zen Kaku Gothic New",sans-serif;padding:0 14px;box-sizing:border-box}
.setup .hint{font-size:11.5px;color:var(--muted);margin-top:5px}
.setup .silkrow{display:grid;grid-template-columns:96px 1fr;gap:14px;align-items:center}
.setup .silkrow .pv{display:grid;place-items:center;background:color-mix(in srgb,var(--ink,#222) 5%,transparent);border-radius:14px;padding:8px}
.setup .sws{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:8px}
.setup .sws .sw{width:28px;height:28px;border-radius:50%;border:2px solid rgba(0,0,0,.12);padding:0}
.setup .sws .sw[aria-pressed=true]{box-shadow:0 0 0 2px var(--bg,#fff),0 0 0 4px #c9a227}
.setup .pats{display:flex;flex-wrap:wrap;gap:6px}.setup .pats button{min-height:32px;padding:0 10px;border-radius:999px;border:1px solid var(--line);background:transparent;color:inherit;font:700 12px "Zen Kaku Gothic New",sans-serif}
.setup .pats button[aria-pressed=true]{background:#1f7a48;color:#fff;border-color:#1f7a48}
.setup .tiny{font-size:11px;color:var(--muted);margin:0 0 5px}
.setup .begin{min-height:54px;border-radius:14px;border:0;background:#1f7a48;color:#fff;font:800 17px "Zen Kaku Gothic New",sans-serif;letter-spacing:.2em}
.setup .back{background:none;border:0;color:var(--muted);font-size:12px;justify-self:center}`;document.head.appendChild(st);})();
let START_STEP='title';
renderStart=(o=>function(){if(START_STEP==='setup'){renderSetup();return;}
  let L=null;try{L=typeof legLoad==='function'?legLoad():null;}catch(e){}const hasRec=L&&((L.runs||[]).length||Object.keys(L.titles||{}).length);
  $('#app').innerHTML=`<div class="ttlpage"><div class="glow"></div><div class="in">
    <div class="kick">親子二代の馬主物語</div><h1>暮れの<br>ファンファーレ</h1><div class="en">KURE NO FANFARE</div>
    <p class="lead">いつか、自分の勝負服で<br>暮れの中山の直線を。</p>
    <button class="go" data-act="startOpen">はじめる</button>
    ${hasRec?'<button class="sub" data-act="startRecord">これまでの物語</button>':''}
    <button class="sub" data-act="startSkipOp">オープニングを飛ばす</button></div></div>`;})(renderStart);
function renderSetup(){const sw=w=>Object.entries(SILK_COLORS).map(([n,c])=>`<button class="sw" style="background:${c}" aria-label="${n}" aria-pressed="${START.silks[w]===c}" data-act="sw" data-w="${w}" data-c="${c}"></button>`).join('');
  $('#app').innerHTML=`<div class="setup"><div class="hd"><small>STEP</small><h2>あなたの物語</h2></div>
   <div class="card"><div><label class="l" for="f-name">あなたの名前（名字）</label><input type="text" id="f-name" maxlength="10" value="${esc(START.name)}" placeholder="例：高瀬" autocomplete="off"></div>
    <div><label class="l" for="f-kan">冠名</label><input type="text" id="f-kan" maxlength="5" value="${esc(START.kanmei)}" autocomplete="off"><div class="hint">あなたの馬の名前の頭につく言葉。例：アケボノ○○</div></div></div>
   <div class="card"><label class="l" style="margin:0">勝負服<span style="font-weight:500">　子の代にも受け継がれます</span></label>
    <div class="silkrow"><div class="pv">${silk(START.silks,80)}</div><div><p class="tiny">胴の色</p><div class="sws">${sw('a')}</div><p class="tiny">袖・柄の色</p><div class="sws">${sw('b')}</div></div></div>
    <div><p class="tiny">柄</p><div class="pats">${PATTERNS.map(p=>`<button aria-pressed="${START.silks.p===p}" data-act="pat" data-p="${p}">${p}</button>`).join('')}</div></div></div>
   <button class="begin" data-act="beginStory">物語を始める</button><button class="back" data-act="startBack">タイトルへ戻る</button></div>`;}
ACT.sw=d=>{syncStart();START.silks[d.w]=d.c;renderStart();};
ACT.pat=d=>{syncStart();START.silks.p=d.p;renderStart();};
ACT.startOpen=()=>{try{showOpening(()=>{START_STEP='setup';renderStart();},'あなた');}catch(e){START_STEP='setup';renderStart();}};
ACT.startSkipOp=()=>{START_STEP='setup';renderStart();};
ACT.startBack=()=>{syncStart();START_STEP='title';renderStart();};
ACT.startRecord=()=>{try{const L=legLoad(),ks=Object.keys(L.titles||{});openModal(`<h2>これまでの物語</h2>${(L.runs||[]).slice(0,8).map(x=>`<div class="row" style="gap:8px;flex-wrap:wrap"><b>${esc(x.title||x.kind)}</b><span class="muted" style="font-size:12px">${x.y}年・${esc(x.owner)}${x.horse?'・'+esc(x.horse):''}</span></div>`).join('')||'<p class="muted">まだありません</p>'}
  ${ks.length?`<div class="row" style="flex-wrap:wrap;gap:6px">${ks.map(k=>`<span class="chip">${esc(TITLES[k]||k)}</span>`).join('')}</div>`:''}<div class="row"><span class="sp"></span><button class="btn pri" data-act="close">閉じる</button></div>`);}catch(e){}};
ACT.beginStory=()=>{syncStart();START.noOpening=1;START_STEP='title';ACT.newGame();};
if(typeof S==='undefined'||!S){try{renderStart();}catch(e){}}
