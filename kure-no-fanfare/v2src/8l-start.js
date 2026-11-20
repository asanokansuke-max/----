/* =========================================================
   はじまりの流れ: タイトル → オープニング → あなたの設定 → 物語を始める
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
.ttlpage{position:relative;min-height:100%;display:grid;place-items:center;padding:40px 22px calc(40px + env(safe-area-inset-bottom,0px));background:radial-gradient(120% 70% at 50% 115%,#4a3220 0%,#1a1a22 45%,#07090d 80%);color:#efe9da;text-align:center;overflow:hidden}
.ttlpage .in{display:grid;gap:18px;justify-items:center;max-width:520px;position:relative}
.ttlpage .lead,.ttlpage .kick,.ttlpage .en{white-space:nowrap}
.ttlpage .kick{font:600 12px "Zen Kaku Gothic New",sans-serif;letter-spacing:.5em;color:#c9a75e}
.ttlpage h1{margin:0;white-space:nowrap;font-family:"Shippori Mincho B1",serif;font-weight:800;font-size:min(52px,9.6vw);letter-spacing:.04em;line-height:1.25;background:linear-gradient(180deg,#fff3d0,#d9a441 60%,#9b6a1d);-webkit-background-clip:text;background-clip:text;color:transparent}
.ttlpage .en{font:500 11px "Zen Kaku Gothic New",sans-serif;letter-spacing:.4em;color:#a99f88}
.ttlpage .lead{font-family:"Shippori Mincho B1",serif;font-size:14px;line-height:2;color:#d8cfbb;margin:6px 0 10px}
.ttlpage .go{min-width:220px;min-height:52px;border-radius:999px;border:1px solid #c9a75e;background:linear-gradient(180deg,rgba(201,167,94,.28),rgba(201,167,94,.08));color:#fff3d0;font:700 16px "Zen Kaku Gothic New",sans-serif;letter-spacing:.3em;padding-left:.3em}
.ttlpage .sub{background:none;border:0;color:#a99f88;font:500 12px "Zen Kaku Gothic New",sans-serif;letter-spacing:.2em;text-decoration:underline;text-underline-offset:4px}
.ttlpage .glow{position:absolute;left:50%;bottom:-20vmin;width:90vmin;height:60vmin;margin-left:-45vmin;border-radius:50%;background:radial-gradient(ellipse,rgba(255,170,90,.28),rgba(255,170,90,0) 70%);pointer-events:none}
.setupwrap,.ttlwrap{flex:1;min-height:0;width:100%;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;height:100%}
.setup .begin{position:sticky;bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:2;box-shadow:0 6px 18px rgba(0,0,0,.35)}
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
  $('#app').innerHTML=`<div class="ttlwrap"><div class="ttlpage"><div class="glow"></div><div class="in">
    <div class="kick">親子二代の馬主物語</div><h1>暮れの<br>ファンファーレ</h1><div class="en">KURE NO FANFARE</div>
    <p class="lead">いつか、自分の勝負服で<br>暮れの中山の直線を。</p>
    <button class="go" data-act="startOpen">はじめる</button>
    ${hasRec?'<button class="sub" data-act="startRecord">これまでの物語</button>':''}
    <button class="sub" data-act="startSkipOp">オープニングを飛ばす</button></div></div></div>`;})(renderStart);
function renderSetup(){const sw=w=>Object.entries(SILK_COLORS).map(([n,c])=>`<button class="sw" style="background:${c}" aria-label="${n}" aria-pressed="${START.silks[w]===c}" data-act="sw" data-w="${w}" data-c="${c}"></button>`).join('');
  $('#app').innerHTML=`<div class="setupwrap"><div class="setup"><div class="hd"><small>STEP</small><h2>あなたの物語</h2></div>
   <div class="card"><div><label class="l" for="f-name">あなたの名前（名字）</label><input type="text" id="f-name" maxlength="10" value="${esc(START.name)}" placeholder="例：高瀬" autocomplete="off"></div>
    <div><label class="l" for="f-kan">冠名</label><input type="text" id="f-kan" maxlength="5" value="${esc(START.kanmei)}" autocomplete="off"><div class="hint">あなたの馬の名前の頭につく言葉。例：アケボノ○○</div></div></div>
   <div class="card"><label class="l" style="margin:0">勝負服<span style="font-weight:500">　子の代にも受け継がれます</span></label>
    <div class="silkrow"><div class="pv">${silk(START.silks,80)}</div><div><p class="tiny">胴の色</p><div class="sws">${sw('a')}</div><p class="tiny">袖・柄の色</p><div class="sws">${sw('b')}</div></div></div>
    <div><p class="tiny">柄</p><div class="pats">${PATTERNS.map(p=>`<button aria-pressed="${START.silks.p===p}" data-act="pat" data-p="${p}">${p}</button>`).join('')}</div></div></div>
   <button class="begin" data-act="beginStory">物語を始める</button><button class="back" data-act="startBack">タイトルへ戻る</button></div></div>`;}
ACT.sw=d=>{syncStart();START.silks[d.w]=d.c;renderStart();};
ACT.pat=d=>{syncStart();START.silks.p=d.p;renderStart();};
ACT.startOpen=()=>{try{showOpening(()=>{if(S)return;START_STEP='setup';renderStart();},'あなた');}catch(e){START_STEP='setup';renderStart();}};
ACT.startSkipOp=()=>{START_STEP='setup';renderStart();};
ACT.startBack=()=>{syncStart();START_STEP='title';renderStart();};
ACT.startRecord=()=>{try{const L=legLoad(),ks=Object.keys(L.titles||{});openModal(`<h2>これまでの物語</h2>${(L.runs||[]).slice(0,8).map(x=>`<div class="row" style="gap:8px;flex-wrap:wrap"><b>${esc(x.title||x.kind)}</b><span class="muted" style="font-size:12px">${x.y}年・${esc(x.owner)}${x.horse?'・'+esc(x.horse):''}</span></div>`).join('')||'<p class="muted">まだありません</p>'}
  ${ks.length?`<div class="row" style="flex-wrap:wrap;gap:6px">${ks.map(k=>`<span class="chip">${esc(TITLES[k]||k)}</span>`).join('')}</div>`:''}<div class="row"><span class="sp"></span><button class="btn pri" data-act="close">閉じる</button></div>`);}catch(e){}};
ACT.beginStory=()=>{syncStart();START.noOpening=1;START_STEP='title';ACT.newGame();};
if(typeof S==='undefined'||!S){try{renderStart();}catch(e){}}
/* title music from the first moment: quietly, as soon as the browser lets sound play (the first touch anywhere on the title or setup page) */
startTheme=(o=>function(name){const r=o.apply(this,arguments);try{if(name==='title'&&AUD.cur)AUD.cur.bus.gain.setTargetAtTime(.5,AUD.ac.currentTime,.8);}catch(e){}return r;})(startTheme);
(function(){const go=()=>{try{if(S)return;ensureAC();AUD.over=null;AUD.base='title';bgmApply();}catch(e){}};
  const tap=()=>{go();if(AUD.cur){document.removeEventListener('pointerdown',tap,true);document.removeEventListener('touchend',tap,true);}};
  document.addEventListener('pointerdown',tap,true);document.addEventListener('touchend',tap,true);go();})();
/* the fanfare without a hitch: the hall reverb is computed once (ahead of time, while the screen is still), and the notes are built a little ahead of when they sound instead of all at once */
function brassIR(ac){if(SND._ir&&SND._ir.ctx===ac)return SND._ir.buf;const ir=ac.createBuffer(2,ac.sampleRate*1.6,ac.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c),L=d.length;for(let i=0;i<L;i++){const x=1-i/L;d[i]=(Math.random()*2-1)*x*x*Math.sqrt(x)*.5;}}const rv=ac.createConvolver();rv.buffer=ir;const wet=ac.createGain();wet.gain.value=.35;rv.connect(wet);wet.connect(ac.destination);SND._ir={ctx:ac,buf:ir,rv};return ir;}
brass=function(notes,bpm,vol){
  if(!SND.ac||!SND.on)return;const ac=SND.ac,t0=ac.currentTime+.08,b=60/bpm;
  const out=ac.createGain();out.gain.value=vol;brassIR(ac);out.connect(ac.destination);out.connect(SND._ir.rv);
  const N=notes.slice().sort((a,c)=>a[1]-c[1]);let i=0;
  const make=([m,st,ln,v=1])=>{const ts=Math.max(t0+st*b,ac.currentTime+.02),te=t0+(st+ln)*b;
    const lp=ac.createBiquadFilter();lp.type='lowpass';lp.Q.value=1.2;lp.frequency.setValueAtTime(500,ts);lp.frequency.linearRampToValueAtTime(2600*v,ts+.06);lp.frequency.setTargetAtTime(1500,ts+.1,.3);
    const g=ac.createGain();g.gain.setValueAtTime(0,ts);g.gain.linearRampToValueAtTime(.22*v,ts+.035);g.gain.setTargetAtTime(.16*v,ts+.06,.15);g.gain.setValueAtTime(.16*v,Math.max(ts+.06,te-.06));g.gain.linearRampToValueAtTime(0,te+.08);
    [[-6,'sawtooth',.5],[6,'sawtooth',.5],[0,'square',.18]].forEach(([dt,ty,a])=>{const o=ac.createOscillator();o.type=ty;o.frequency.value=mf(m);o.detune.value=dt;if(ln>1.5){const vib=ac.createOscillator();vib.frequency.value=5.2;const vg=ac.createGain();vg.gain.value=4;vib.connect(vg);vg.connect(o.detune);vib.start(ts);vib.stop(te+.15);}const og=ac.createGain();og.gain.value=a;o.connect(og);og.connect(lp);o.start(ts);o.stop(te+.15);});
    lp.connect(g);g.connect(out);};
  const pump=()=>{const lim=ac.currentTime+.9;let k=0;while(i<N.length&&(t0+N[i][1]*b<lim||k<2)&&k<4){make(N[i++]);k++;}if(i<N.length)setTimeout(pump,i<6?40:200);};pump();};
/* compute the reverb ahead: at the first touch, and when the opening starts (the screen is black then) */
(function(){const warm=()=>{try{if(SND.ac)setTimeout(()=>{try{brassIR(SND.ac);}catch(e){}},120);}catch(e){}};document.addEventListener('pointerdown',warm,{capture:true,once:true});setTimeout(warm,900);})();
/* the opening's grandstand is drawn and decoded ahead, on the title screen, so the curtain rises without a stutter */
(function(){const pre=()=>{try{if(window.__opStand)return;const h=opStandSVG();window.__opStand=h;const box=document.createElement('div');box.innerHTML=h;box.querySelectorAll('img').forEach(im=>{try{im.decode&&im.decode().catch(()=>{});}catch(e){}});window.__opStandImgs=box;}catch(e){}};
  opStandSVG=(o=>function(){if(window.__opStand){const h=window.__opStand;window.__opStand=null;return h;}return o.apply(this,arguments);})(opStandSVG);
  (window.requestIdleCallback||(f=>setTimeout(f,600)))(pre,{timeout:1500});})();
/* no page zoom: pinch and double-tap never zoom the game screen (iOS ignores user-scalable, so the gestures are stopped here too) */
(function(){try{const st=document.createElement('style');st.textContent='html,body,#app,#opening,.modal,.ov{touch-action:manipulation}';document.head.appendChild(st);
  try{let m=document.querySelector('meta[name=viewport]');if(!m){m=document.createElement('meta');m.name='viewport';document.head.appendChild(m);}m.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no';}catch(e){}
  const stop=e=>{if(e.cancelable)e.preventDefault();};
  ['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,stop,{passive:false}));
  document.addEventListener('touchmove',e=>{if(e.touches&&e.touches.length>1)stop(e);},{passive:false});
  document.addEventListener('dblclick',stop,{passive:false});}catch(e){}})();
