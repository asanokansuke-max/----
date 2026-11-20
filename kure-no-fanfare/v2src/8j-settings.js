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

/* 本馬場入場の行進曲 (an original march): brass melody over strings, walking bass and a light drum */
INST.brass=function(ac,d,t,m,len,v){const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(700,t);lp.frequency.linearRampToValueAtTime(2600,t+.06);lp.frequency.setTargetAtTime(1400,t+.08,.2);
  const g=ac.createGain();env(g,t,.03,.2*v,.25,.13*v,t+len);lp.connect(g);g.connect(d);
  [[0,'sawtooth',.5],[7,'sawtooth',.35],[-1200,'square',.12]].forEach(([dt,ty,a])=>{const o=ac.createOscillator();o.type=ty;o.frequency.value=fq(m);o.detune.value=dt===-1200?-1200:dt;const og=ac.createGain();og.gain.value=a;o.connect(og);og.connect(lp);o.start(t);o.stop(t+len+.4);});};
THEMES.parade={bpm:112,ch:[C(46,58,62,65),C(45,57,60,65),C(43,58,62,67),C(39,58,63,67),C(46,58,62,65),C(48,55,60,63),C(41,57,63,65),C(46,58,62,65)],
  mel:[[70,1],[74,.5],[77,.5],[82,2],[81,1.5],[79,.5],[77,1],[72,1],[74,1],[79,1],[77,1.5],[74,.5],[75,2],[null,1],[70,1],
       [74,1],[77,.5],[82,.5],[86,2],[84,1],[82,.5],[79,.5],[75,1],[79,1],[77,1.5],[75,.5],[72,1],[76,1],[77,3],[null,1]],
  parts:{str:1,bass:'pulse',drums:1,timp:1,melI:'brass'}};
showParade=(o=>function(){const r=o.apply(this,arguments);try{ensureAC();AUD.over='parade';bgmApply();}catch(e){}return r;})(showParade);

/* ================= BGM のバリエーション =================
   more original pieces: the home theme changes with the season, each person has a talk theme of their own feel,
   the farm has its own tune, G1 paddocks are grander, and parades / sales / story scenes alternate */
(function(){
  const add=(k,th)=>{THEMES[k]=th;};
  add('home_spring',{bpm:92,ch:[C(53,60,65,69),C(48,60,64,67),C(50,57,62,65),C(46,58,62,65),C(53,60,65,69),C(45,57,60,64),C(46,58,62,67),C(48,58,64,67)],mel:null,parts:{keys:'broken',bass:'root',hat:'soft'}});
  add('home_summer',{bpm:104,ch:[C(50,57,62,66),C(47,54,59,62),C(43,55,59,62),C(45,57,61,64),C(50,57,62,66),C(42,57,61,66),C(43,55,59,64),C(45,57,61,67)],mel:null,parts:{arp:'pluck',bass:'pulse',drums:1}});
  add('home_autumn',{bpm:78,ch:[C(45,57,60,64),C(41,57,60,65),C(48,55,60,64),C(43,55,59,62),C(45,57,60,64),C(38,57,62,65),C(40,56,59,64),C(45,57,60,64)],mel:null,parts:{pad:1,keys:'broken',bass:'root'}});
  add('farm',{bpm:80,ch:[C(43,55,59,62),C(48,55,60,64),C(43,55,59,62),C(50,57,62,66),C(40,55,59,64),C(48,55,60,64),C(50,57,62,66),C(43,55,59,62)],mel:null,parts:{arp:'mbox',bass:'root',pad:1}});
  add('talk_warm',{bpm:72,ch:[C(48,55,60,64),C(45,57,60,64),C(41,57,60,65),C(43,55,59,62)],mel:null,parts:{keys:'broken',bass:'root'}});
  add('talk_bright',{bpm:88,ch:[C(50,57,62,66),C(55,59,62,67),C(52,59,64,67),C(45,57,61,64)],mel:null,parts:{arp:'pluck',bass:'root',hat:'soft'}});
  add('talk_tense',{bpm:68,ch:[C(45,57,60,64),C(46,58,62,65),C(40,56,59,64),C(45,57,60,64)],mel:null,parts:{pad:1,pizz:1,bass:'root'}});
  add('paddock_g1',{bpm:84,ch:[C(50,57,62,65),C(46,58,62,65),C(43,55,58,62),C(45,57,61,64),C(50,57,62,65),C(41,57,60,65),C(43,55,58,64),C(45,57,61,64)],mel:null,parts:{str:1,bass:'pulse',timp:1,melI:'brass'}});
  add('paddock2',{bpm:96,ch:[C(48,55,60,64),C(45,57,60,64),C(50,57,62,65),C(43,55,59,62)],mel:null,parts:{pizz:1,bass:'pulse',hat:'soft'}});
  add('sale2',{bpm:124,ch:[C(43,55,58,62),C(39,55,58,63),C(41,57,60,65),C(38,54,57,62)],mel:null,parts:{pizz:1,bass:'pulse',drums:1,str:1}});
  add('story2',{bpm:58,ch:[C(48,55,60,63),C(44,56,60,63),C(41,56,60,65),C(43,55,59,62)],mel:null,parts:{str:1,melI:'keys',bass:'root'}});
  add('parade2',{bpm:116,ch:[C(51,58,63,67),C(46,58,62,65),C(48,55,60,63),C(44,56,60,63),C(51,58,63,67),C(41,56,60,65),C(46,58,62,65),C(51,58,63,67)],
    mel:[[75,1],[79,.5],[82,.5],[87,2],[86,1],[84,1],[82,2],[80,1],[84,1],[82,1],[79,1],[77,3],[null,1],[75,1],[79,.5],[82,.5],[87,2],[89,1],[87,1],[84,2],[82,1],[80,1],[77,1],[74,1],[75,3],[null,1]],
    parts:{str:1,bass:'pulse',drums:1,melI:'brass'}});
  add('parade3',{bpm:108,ch:[C(53,60,65,69),C(50,57,62,65),C(46,58,62,65),C(48,58,64,67),C(53,60,65,69),C(45,57,60,64),C(46,58,62,65),C(48,58,64,67)],mel:null,parts:{str:1,bass:'pulse',drums:1,timp:1,melI:'brass'}});
  // a melody for each new piece without one: chord tones on a fixed seed so the loop always repeats the same way
  Object.entries(THEMES).forEach(([k,th])=>{if(th.mel)return;let seed=hash(k)*1e6;const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280;};
    th.mel=[];th.ch.forEach((ch,bi)=>{const tones=ch.slice(1).map(m=>m+12);const rh=[[1,1,2],[1.5,.5,2],[2,1,1],[1,1,1,1],[.5,.5,1,2]][Math.floor(rnd()*5)];let last=null;
      rh.forEach((b,j)=>{let m=tones[Math.floor(rnd()*tones.length)];if(last!=null&&Math.abs(m-last)>7)m=tones.reduce((a,x)=>Math.abs(x-last)<Math.abs(a-last)?x:a,tones[0]);th.mel.push([rnd()<.1&&j>0?null:m,b]);last=m;});});
    th.parts.melI=th.parts.melI||'pluck';});
})();
const BGM_VAR={
  home:()=>{const m=S?M(S.t):4;return m>=3&&m<=5?'home_spring':m>=6&&m<=8?'home_summer':m>=9&&m<=11?'home_autumn':'home';},
  talk:()=>{const id=UI.talk&&UI.talk.id||'';return ['kujo','rei','washio'].includes(id)?'talk_tense':['hayase','hinata','komori','kiryu','mio'].includes(id)?'talk_bright':['togawa','nakahara','mikuni','kitami','shibahara','koyanagi'].includes(id)?'talk_warm':'talk';},
  paddock:()=>{const r=UI.race&&UI.race.race;return r&&r.grade==='G1'?'paddock_g1':(S&&S.t%2)?'paddock2':'paddock';},
  sale:()=>S&&Y(S.t)%2?'sale2':'sale',
  story:()=>S&&S.t%2?'story2':'story',
  parade:()=>{const r=UI.race&&UI.race.race;const k=r?Math.floor(hash(r.name)*3):0;return ['parade','parade2','parade3'][k];}};
startTheme=(o=>function(name){const f=BGM_VAR[name];let n=name;try{if(f){n=f();if(!THEMES[n])n=name;}}catch(e){}return o.call(this,n);})(startTheme);
/* bgmApply compares the scene name with the running piece; keep the scene name on the running piece so it doesn't restart */
startTheme=(o=>function(name){const r=o.apply(this,arguments);if(AUD.cur){AUD.cur.variant=AUD.cur.name;AUD.cur.name=name;}return r;})(startTheme);
bgmApply=(o=>function(){try{const w=sceneNow(),c=AUD.cur;if(c&&c.name===w&&BGM_VAR[w]){const v=BGM_VAR[w]();if(THEMES[v]&&c.variant!==v)c.name='';}}catch(e){}return o.apply(this,arguments);})(bgmApply);
render=(o=>function(){const r=o.apply(this,arguments);try{if(S&&UI.tab==='farm'&&AUD.base!=='farm'){AUD.base='farm';bgmApply();}}catch(e){}return r;})(render);
