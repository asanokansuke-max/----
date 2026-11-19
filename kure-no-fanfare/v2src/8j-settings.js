/* =========================================================
   設定: grouped sections with switches, the race caller's voice,
   guidance, the record of past stories, and data at the bottom
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
.stg{display:grid;gap:14px}
.stg h2{margin:0;display:flex;align-items:center;gap:10px}
.stg .grp{border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--panel)}
.stg .gh{padding:10px 14px 6px;font-size:11px;font-weight:700;letter-spacing:.18em;color:var(--muted)}
.stg .ro{display:flex;align-items:center;gap:12px;padding:11px 14px;border-top:1px solid var(--line);min-height:52px}
.stg .ro:first-of-type{border-top:0}
.stg .ro .tx{flex:1;min-width:0}.stg .ro .tx b{display:block;font-size:14.5px}.stg .ro .tx small{display:block;font-size:11.5px;color:var(--muted);margin-top:2px;line-height:1.4}
.stg .sw{flex:none;width:50px;height:30px;border-radius:15px;border:0;background:color-mix(in srgb,var(--ink,#222) 18%,transparent);position:relative;transition:background .2s;padding:0}
.stg .sw:after{content:"";position:absolute;left:3px;top:3px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .2s}
.stg .sw,.stg .sw[aria-pressed]{outline:none!important;box-shadow:none!important;border:0!important}.stg .sw:focus-visible{outline:2px solid #1f7a48;outline-offset:2px}.stg .sw.on{background:#1f7a48}.stg .sw.on:after{transform:translateX(20px)}
.stg input[type=range]{flex:1;accent-color:#1f7a48}
.stg select{flex:1;min-width:0;min-height:38px;border-radius:9px;border:1px solid var(--line);background:var(--bg,#fff);color:inherit;padding:0 8px;font:inherit;font-size:13px}
.stg .sm{flex:none;min-height:34px;padding:0 12px;border-radius:9px;border:1px solid var(--line);background:transparent;color:inherit;font:700 12.5px "Zen Kaku Gothic New",sans-serif}
.stg .rec{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:6px 14px 12px}
.stg .rec div{border-radius:10px;background:color-mix(in srgb,var(--ink,#222) 5%,transparent);padding:8px;text-align:center}
.stg .rec b{display:block;font:700 20px Oswald,sans-serif}.stg .rec small{font-size:11px;color:var(--muted)}
.stg .tt{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 12px}
.stg .tt span{font-size:11.5px;padding:3px 8px;border-radius:999px;border:1px solid #c9a227;color:#8a6a10}
.stg .danger .ro b{color:var(--bad,#b5121b)}
.stg .note{font-size:11.5px;color:var(--muted);text-align:center}`;document.head.appendChild(st);})();
function stgVoices(){const v=window.speechSynthesis?speechSynthesis.getVoices().filter(x=>/ja/i.test(x.lang)):[];let saved=null;try{saved=localStorage.getItem('kure-voice-name');}catch(e){}
  const cur=saved||(v.length?pickMaleVoice(v).v?.name:'');
  return `<select id="stgv" aria-label="実況の声">${v.length?v.map(x=>`<option ${x.name===cur?'selected':''}>${esc(x.name)}</option>`).join(''):'<option>端末の標準</option>'}</select>`;}
openSettings=function(){const L=typeof legLoad==='function'?legLoad():{titles:{}};const tk=Object.keys(L.titles||{});ensureNew&&ensureNew();
  const tips=TIPS&&S?TIPS.every(t=>S.flags.tipSeen[t.k]):true,sw=(k,on)=>`<button class="sw ${on?'on':''}" data-act="stgSw" data-k="${k}" aria-pressed="${on}"></button>`;
  openModal(`<div class="stg"><h2>${typeof ico==='function'?ico('gear'):''}設定</h2>
   <div class="grp"><div class="gh">サウンド</div>
    <div class="ro"><div class="tx"><b>BGM</b><small>場面ごとの音楽</small></div>${sw('bgm',AUD.bgm)}</div>
    <div class="ro"><div class="tx"><b>効果音・競馬場の音</b><small>歓声、蹄の音、ファンファーレ</small></div>${sw('se',AUD.se)}</div>
    <div class="ro"><div class="tx" style="flex:none;width:60px"><b>音量</b></div><input type="range" id="stgvol" min="0" max="100" value="${Math.round(AUD.vol*100)}" aria-label="音量"></div></div>
   <div class="grp"><div class="gh">実況</div>
    <div class="ro"><div class="tx"><b>実況を読み上げる</b><small>レース中、端末の声で実況します</small></div>${sw('voice',typeof VOICE_ON!=='undefined'&&VOICE_ON)}</div>
    <div class="ro"><div class="tx" style="flex:none;width:60px"><b>声</b></div>${stgVoices()}<button class="sm" data-act="stgTest">試す</button></div>
    <div class="ro"><div class="tx"><small>男性の声は、iPhoneの「設定」→アクセシビリティ→読み上げコンテンツ→声→日本語 から追加できます（Otoyaなど）。ない場合は低めの声で読みます。</small></div></div></div>
   ${S?`<div class="grp"><div class="gh">遊び方</div>
    <div class="ro"><div class="tx"><b>三國の案内</b><small>最初の数か月、厩舎画面にひとこと案内を出します</small></div>${sw('tips',!tips)}</div></div>`:''}
   <div class="grp"><div class="gh">これまでの記録</div>
    <div class="rec"><div><b>${L.wins||0}</b><small>通算勝利</small></div><div><b>${L.g1||0}</b><small>G1勝利</small></div><div><b>${(L.runs||[]).length}</b><small>見届けた物語</small></div></div>
    ${tk.length?`<div class="tt">${tk.map(k=>`<span>${esc(TITLES[k]||k)}</span>`).join('')}</div>`:'<div class="tt"><small class="muted">称号はまだありません</small></div>'}</div>
   ${S?`<div class="grp danger"><div class="gh">データ</div>
    <div class="ro"><div class="tx"><small>進行はこのブラウザに自動で保存されます</small></div></div>
    <div class="ro"><div class="tx"><b>馬主を退く</b><small>物語をここで終える</small></div><button class="sm" data-act="quitAsk">退く</button></div>
    <div class="ro"><div class="tx"><b>最初からやり直す</b><small>今の進行は消えます（記録と称号は残ります）</small></div><button class="sm" data-act="resetAsk">やり直す</button></div></div>`:''}
   <div class="note">暮れのファンファーレ</div>
   <div class="row"><span class="sp"></span><button class="btn pri" data-act="close">閉じる</button></div></div>`,{wide:false});
  const vol=$('#stgvol');if(vol)vol.addEventListener('input',e=>{AUD.vol=e.target.value/100;ensureAC();if(AUD.mus){AUD.mus.gain.value=AUD.bgm?.22*AUD.vol:0;AUD.fx.gain.value=AUD.se?.5*AUD.vol:0;}audSave();});
  const sel=$('#stgv');if(sel){sel.onchange=()=>{try{localStorage.setItem('kure-voice-name',sel.value);}catch(e){}};if(window.speechSynthesis&&!speechSynthesis.getVoices().length)setTimeout(()=>{if($('#stgv')&&speechSynthesis.getVoices().length){sel.outerHTML=stgVoices();}},900);}};
ACT.stgSw=(d,b)=>{const k=d.k;let on;
  if(k==='bgm'||k==='se'){ACT.aud({k},document.createElement('button'));on=AUD[k];}
  else if(k==='voice'){VOICE_ON=!VOICE_ON;try{localStorage.setItem('kure-voice',VOICE_ON?'1':'0');}catch(e){}if(!VOICE_ON&&typeof spStop==='function')spStop();on=VOICE_ON;}
  else if(k==='tips'){const all=TIPS.every(t=>S.flags.tipSeen[t.k]);if(all)S.flags.tipSeen={};else TIPS.forEach(t=>S.flags.tipSeen[t.k]=1);save();on=all;}
  if(b){b.classList.toggle('on',!!on);b.setAttribute('aria-pressed',!!on);}};
ACT.stgTest=()=>{try{ensureAC();const was=VOICE_ON,snd=SND.on;VOICE_ON=true;SND.on=true;speak('最後の直線！ 内から、アケボノハツユキが伸びてくる！');VOICE_ON=was;SND.on=snd;}catch(e){toast('この端末では読み上げできません');}};
