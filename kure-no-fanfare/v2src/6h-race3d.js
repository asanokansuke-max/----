/* =========================================================
   3D中継: watch the race in the 3D broadcast view (an iframe made from the
   embedded 3D page, R3D_HTML). The result has already been decided by runSim;
   the 3D view just shows it, then hands back to the result board.
   ========================================================= */
const R3D_CRS={東京:'tokyo',中山:'nakayama',京都:'kyoto',阪神:'hanshin',札幌:'sapporo',福島:'fukushima',中京:'chukyo',新潟:'niigata',小倉:'kokura',函館:'hakodate'};
function r3dGrade(r){const n=r.name||'';if(r.grade==='G1'){if(/ダービー|東京優駿/.test(n))return 'derby';if(/皐月賞|菊花賞|桜花賞|オークス|優駿牝馬/.test(n))return 'classic';return 'G1';}
  if(r.grade==='G2'||r.grade==='G3')return r.grade;if(r.grade==='OP'||/特別|ステークス|カップ|賞$/.test(n))return 'special';return 'ordinary';}
function r3dOn(){return true;}   // the race is always shown in 3D (the 2D view is retired)
function r3dDoc(RC,mode){const inp=r3dInput(RC);inp.mode=mode||'race';return R3D_HTML.replace('<script type="importmap">','<script>window.RACE_IN='+JSON.stringify(inp).replace(/</g,'\\u003c')+';<\/script><script type="importmap">');}
function r3dInput(RC){const r=RC.race,hex=c=>/^#[0-9a-f]{6}$/i.test(c||'')?c:'#888888';
  return {course:R3D_CRS[r.course]||'tokyo',dist:r.dist,surf:r.surf,going:r.going||'良',grade:r3dGrade(r),race:r.key==='有馬記念'?'arima':'',time:r.key==='有馬記念'?'evening':'',
    title:r.name,leadNo:RC.leadNo,shape:RC.shape,
    field:[...RC.field].sort((a,b)=>a.no-b.no).map(f=>({no:f.no,name:f.name,a:hex(f.silks&&f.silks.a),b:hex(f.silks&&f.silks.b),p:f.silks&&f.silks.p,coat:f.coat||(f.h&&f.h.coat)||'鹿毛',used:f.used||f.style,j:f.jname||'',gapL:f.gapL||0,odds:f.odds,mine:!!f.mine}))};}
let R3D=null;
(function(){const st=document.createElement('style');st.textContent=`
#r3d{position:fixed;inset:0;z-index:80;background:radial-gradient(120% 80% at 50% 0%,#17301f,#070d09 70%);color:#eef3ef;display:flex;font-family:"Zen Kaku Gothic New",sans-serif;
  padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)}
#r3d.tall{flex-direction:column}#r3d.wide{flex-direction:row}
#r3d .hd{display:flex;align-items:center;gap:8px;padding:10px 14px 8px}
#r3d .hd .gb{flex:none;font:800 12px/1 Oswald,sans-serif;padding:4px 6px;border-radius:4px;background:#1c2463;color:#fff}
#r3d .hd .gb.G2{background:#7d1220}#r3d .hd .gb.G3{background:#11502c}#r3d .hd .gb.OP{background:#333}
#r3d .hd b{font-family:"Shippori Mincho B1",serif;font-size:18px;letter-spacing:.04em;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#r3d .hd small{font-size:11px;opacity:.75;white-space:nowrap}
#r3d .live{display:inline-flex;align-items:center;gap:4px;font:700 10px/1 Oswald,sans-serif;letter-spacing:.1em;color:#ff5a5a}
#r3d .live i{width:7px;height:7px;border-radius:50%;background:#ff3b30;animation:r3dlv 1.2s infinite}@keyframes r3dlv{50%{opacity:.25}}
#r3d .vid{position:relative;flex:none;margin:0 auto;border-radius:10px;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.12),0 10px 30px rgba(0,0,0,.6);background:#000}
#r3d .vid iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#070d09;opacity:0;transition:opacity .5s}
#r3d .vid iframe.on,iframe.r3demb.on{opacity:1}iframe.r3demb{opacity:0;transition:opacity .5s}
#r3d .prep{position:absolute;inset:0;display:grid;place-items:center;align-content:center;gap:10px;color:#9fb3a6;font-size:11px;letter-spacing:.25em}
#r3d .prep i{width:26px;height:26px;border-radius:50%;border:3px solid rgba(255,255,255,.15);border-top-color:#c9a227;animation:r3dsp 1s linear infinite}@keyframes r3dsp{to{transform:rotate(360deg)}}
#r3d{transition:opacity .45s}#r3d.out{opacity:0;pointer-events:none}
.bcwrap3d{position:relative;background:#070d09;border-radius:6px}.bcwrap3d .prep{position:absolute;inset:0;display:grid;place-items:center;align-content:center;gap:8px;color:#9fb3a6;font-size:11px;letter-spacing:.25em}
.bcwrap3d .prep i{width:22px;height:22px;border-radius:50%;border:3px solid rgba(255,255,255,.15);border-top-color:#c9a227;animation:r3dsp 1s linear infinite}
#r3d .side{flex:1;min-height:0;min-width:0;display:flex;flex-direction:column;gap:8px;padding:10px 14px 12px;overflow:auto}
#r3d.wide .side{max-width:260px;padding-left:4px}#r3d.wide .hd{padding:2px 0 0;flex-wrap:wrap}#r3d.wide .hd b{font-size:15px;flex-basis:70%}#r3d.wide .calls{font-size:11px}#r3d.wide .ctl button{min-height:34px;font-size:11px}#r3d.wide .cheer{min-height:38px;font-size:15px}#r3d.wide .card{padding:7px 9px}#r3d.wide .side{gap:6px;padding-top:8px;overflow:hidden}#r3d.wide .calls{flex:1;min-height:0;overflow:hidden;justify-content:flex-end}#r3d.wide .hd small{font-size:10px}#r3d.wide .live{display:none}#r3d.wide .me .pos{font-size:22px}#r3d.wide .bar{margin-top:5px}
#r3d .ctl{display:flex;gap:6px}
#r3d.tall .side{overflow:hidden}#r3d.tall .calls{flex:1 1 auto;min-height:0;overflow:hidden;justify-content:flex-end}#r3d .calls .lb{flex:none}#r3d.tall .cheer{flex:none}
#r3d .ctl button{flex:1;min-width:0;white-space:nowrap;padding:0 2px;min-height:42px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);color:#eef3ef;font:700 13px "Zen Kaku Gothic New",sans-serif}
#r3d .ctl button.on{background:#c9a227;color:#111;border-color:#c9a227}
#r3d .ctl button.pri{background:#1f7a48;border-color:#1f7a48}
#r3d .card{border-radius:12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);padding:10px 12px}
#r3d .me{display:grid;grid-template-columns:auto 1fr auto;gap:2px 10px;align-items:center}
#r3d .me .nm{font-weight:800;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#r3d .me .sub{grid-column:2;font-size:11px;opacity:.7}
#r3d .me .pos{grid-row:1/3;grid-column:3;text-align:right;font:700 28px/1 Oswald,sans-serif;color:#ffd166}
#r3d .me .pos small{display:block;font:500 10px/1.4 "Zen Kaku Gothic New";color:#cfd6d2}
#r3d .bar{height:6px;border-radius:3px;background:rgba(255,255,255,.12);overflow:hidden;margin-top:8px}
#r3d .bar i{display:block;height:100%;background:linear-gradient(90deg,#1f7a48,#c9a227);width:0}
#r3d .rem{display:flex;justify-content:space-between;font-size:11px;opacity:.75;margin-top:4px}
#r3d .calls{font-size:13px;line-height:1.55;display:flex;flex-direction:column;gap:2px}
#r3d .calls p{margin:0;opacity:.5}#r3d .calls p:last-child{opacity:1;font-weight:700}
#r3d .calls .lb{font-size:10px;letter-spacing:.15em;opacity:.6;margin-bottom:2px}
#r3d .cheer{min-height:48px;border-radius:12px;border:0;background:linear-gradient(180deg,#e2503c,#b5121b);color:#fff;font:900 18px "Zen Kaku Gothic New";letter-spacing:.08em;box-shadow:0 4px 12px rgba(181,18,27,.4)}
#r3d .cheer:active{transform:scale(.97)}#r3d .credit{margin-top:auto;font-size:9px;opacity:.28;text-align:right;letter-spacing:.02em}#r3d .cheer:disabled{background:rgba(255,255,255,.08);color:rgba(255,255,255,.45);box-shadow:none;font-size:13px;letter-spacing:.02em}
#r3d .shout{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);font:900 clamp(20px,6vw,40px) "Zen Kaku Gothic New";color:#fff;text-shadow:0 2px 0 #b5121b,0 0 12px rgba(0,0,0,.6);pointer-events:none;animation:r3dsh .9s ease-out forwards}
@keyframes r3dsh{from{opacity:0;transform:translate(-50%,-30%) scale(.7)}25%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}to{opacity:0;transform:translate(-50%,-70%) scale(1)}}
`;document.head.appendChild(st);})();
function open3D(RC){
  // the rider makes his own move in 3D (no spurt mini-game)
  if(!RC.r3dSpurt){RC.r3dSpurt=1;RC.field.filter(f=>f.mine).forEach(f=>f.perf+=.3);if(typeof reorder==='function')reorder(RC);}
  const r=RC.race,me=RC.field.find(f=>f.mine),gcls=r.grade==='G1'||r.grade==='G2'||r.grade==='G3'?r.grade:'OP';
  const ov=document.createElement('div');ov.id='r3d';
  ov.innerHTML=`<div class="hd"><span class="gb ${gcls}">${esc(r.grade||'')}</span><b>${esc(r.name)}</b><small>${esc(r.course)} ${r.surf==='ダ'?'ダ':'芝'}${r.dist}m・${esc(r.going||'良')}</small><span class="live"><i></i>LIVE</span></div>
    <div class="vid" id="r3dvid"><div class="prep"><i></i>中継準備中</div><iframe id="r3dif" allow="autoplay; fullscreen"></iframe></div>
    <div class="side">
      <div class="ctl"><button id="r3dff">早送り</button><button id="r3dsk">スキップ</button><button id="r3dsnd" class="${SND.on?'on':''}" style="flex:.55">音</button><button id="r3dvc" class="${VOICE_ON?'on':''}" style="flex:.7">実況</button></div>
      <div class="cams" id="r3dcams"></div>
      ${me?`<div class="card"><div class="me">${typeof silk==='function'?silk(me.silks,34):''}<span class="nm">${esc(me.name)}</span><span class="pos" id="r3dpos">—<small>番手</small></span><span class="sub">${me.no}番・${esc(me.jname||'')}</span></div>
        <div class="bar"><i id="r3dbar"></i></div><div class="rem"><span id="r3dph">発走前</span><span id="r3drem">${r.dist}m</span></div></div>`:''}
      <div class="card calls" id="r3dcalls"><div class="lb">実況</div><p>まもなく発走です</p></div>
      ${me?'<button class="cheer" id="r3dcheer" disabled>直線で応援できます</button>':''}
      <div class="credit">3D horse model: mirada (ro.me) / three.js examples</div>
    </div>`;
  document.body.appendChild(ov);const f=document.getElementById('r3dif');
  const inp=r3dInput(RC);inp.mode='race';inp.ui='outer';f.srcdoc=R3D_HTML.replace('<script type="importmap">','<script>window.RACE_IN='+JSON.stringify(inp).replace(/</g,'\\u003c')+';<\/script><script type="importmap">');
  R3D={ov,RC,ff:false};
  const fit=()=>{const W=innerWidth,H=innerHeight,tall=H>W*.9;ov.className=tall?'tall':'wide';const v=document.getElementById('r3dvid');if(!v)return;const hd=ov.querySelector('.hd'),sd=ov.querySelector('.side');if(tall){if(hd.parentNode!==ov)ov.insertBefore(hd,v);}else if(hd.parentNode!==sd)sd.insertBefore(hd,sd.firstChild);
    let w,h;if(tall){w=W-16;h=w*9/16;}else{h=H-12;w=h*16/9;const room=W-w;if(room<230){w=W-240;h=w*9/16;}}v.style.width=Math.round(w)+'px';v.style.height=Math.round(h)+'px';v.style.margin=tall?'0 auto':'auto 0 auto 6px';};
  fit();addEventListener('resize',fit);R3D.fit=fit;
  const post=m=>{try{f.contentWindow.postMessage(m,'*');}catch(e){}};
  document.getElementById('r3dff').onclick=e=>{R3D.ff=!R3D.ff;e.target.classList.toggle('on',R3D.ff);e.target.textContent=R3D.ff?'通常速度':'早送り';post({type:'ff',on:R3D.ff});if(R3D.snd)R3D.snd.cad=2.15*(R3D.ff?1.6:1);};
  document.getElementById('r3dvc').onclick=e=>{VOICE_ON=!VOICE_ON;try{localStorage.setItem('kure-voice',VOICE_ON?'1':'0');}catch(x){}e.target.classList.toggle('on',VOICE_ON);if(!VOICE_ON)spStop();else{if(!SND.on){SND.on=true;try{localStorage.setItem('kure-snd','1');}catch(x){}document.getElementById('r3dsnd').classList.add('on');try{sndInit();sndStart();}catch(x){}}r3dVoiceUnlock();speak('実況をお伝えします');}};
  document.getElementById('r3dsnd').onclick=e=>{SND.on=!SND.on;try{localStorage.setItem('kure-snd',SND.on?'1':'0');}catch(x){}e.target.classList.toggle('on',SND.on);if(!SND.on)sndStop();else{sndInit();sndStart();}};
  document.getElementById('r3dsk').onclick=()=>post({type:'skip'});
  const ch=document.getElementById('r3dcheer');if(ch)ch.onclick=()=>{const v=document.getElementById('r3dvid'),d=document.createElement('div');d.className='shout';d.textContent=pick(['行けー！！','差せー！！','そのまま！！','粘れー！！']);v.appendChild(d);setTimeout(()=>d.remove(),950);try{sndCrowd(.6);}catch(e){}try{se&&se('select');if(navigator.vibrate)navigator.vibrate(30);}catch(e){}};
  try{sndStop&&sndStop();}catch(e){}
  r3dCams(RC);
  try{sndInit();}catch(e){}if(VOICE_ON)r3dVoiceUnlock();R3D.hoofT=setInterval(()=>{if(R3D&&R3D.snd&&SND.nodes)sndHoofs(R3D.snd.run,R3D.snd.cad,R3D.snd.vol);},90);}
function r3dSound(d){if(!SND.on)return;const R=R3D;if(!SND.ac)sndInit();if(!SND.nodes)sndStart();
  if(d.phase==='race'&&!R.gated){R.gated=1;try{sGate();}catch(e){}}
  R.snd={run:d.phase==='race'||(d.phase==='after'&&!R.eased),cad:2.15*(R.ff?1.6:1),vol:d.phase==='after'?.6:.85};
  const D=R.RC.race.dist,c=d.phase==='gate'?.012:d.phase==='race'?(d.rem>600?.03:.03+(600-d.rem)/600*.45):d.phase==='after'?Math.max(.06,.45-(d.t-(R.goalT||(R.goalT=d.t)))*.08):.05;sndCrowd(c);
  if(d.phase==='after'&&!R.won){R.won=1;if(R.RC.order&&R.RC.order[0]&&R.RC.order[0].mine)try{sWin();}catch(e){}setTimeout(()=>{if(R3D)R3D.eased=1;},4000);}}
function r3dState(d){if(!R3D)return;if(d.rem!=null)R3D.rem=d.rem;try{r3dSound(d);}catch(e){}const pos=document.getElementById('r3dpos'),bar=document.getElementById('r3dbar'),ph=document.getElementById('r3dph'),rem=document.getElementById('r3drem'),D=R3D.RC.race.dist;
  if(pos&&d.me)pos.innerHTML=`${d.phase==='race'||d.phase==='after'?d.me.pos:'—'}<small>番手 / ${d.n}頭</small>`;
  if(bar)bar.style.width=(d.phase==='race'?(1-d.rem/D)*100:d.phase==='after'?100:0)+'%';
  if(ph)ph.textContent={race:'レース中',gate:'ゲートイン完了',after:'ゴール',load:'ゲートイン',canter:'返し馬',starter:'ファンファーレ'}[d.phase]||'発走前';
  {const cb=document.getElementById('r3dcheer');if(cb){const on=d.phase==='race'&&d.rem<600;if(on!==!cb.disabled){cb.disabled=!on;cb.textContent=on?'行けー！！':d.phase==='after'?'ゴール！':'直線で応援できます';}}}
  if(rem)rem.textContent=d.phase==='race'?`残り ${d.rem}m`:d.phase==='after'?'確定待ち':`${D}m`;}
/* the 3D commentary is read aloud with the device's Japanese voice (same queue as the 2D race) */
function r3dVoiceUnlock(){try{const ss=window.speechSynthesis;if(!ss||r3dVoiceUnlock.done)return;r3dVoiceUnlock.done=1;const u=new SpeechSynthesisUtterance(' ');u.volume=0;u.lang='ja-JP';ss.speak(u);}catch(e){}}
function r3dCall(t){if(!R3D||!t)return;try{speak(t,(R3D.rem!=null&&R3D.rem<600)||/ゴール/.test(t));}catch(e){}const c=document.getElementById('r3dcalls');if(!c)return;const p=document.createElement('p');p.textContent=t;c.appendChild(p);const ps=c.querySelectorAll('p');if(ps.length>3)ps[0].remove();}
function close3D(){if(!R3D)return;clearInterval(R3D.hoofT);try{sndStop();}catch(e){}removeEventListener('resize',R3D.fit);R3D.ov.remove();R3D=null;}
addEventListener('message',e=>{const d=e.data||{};if(d.type==='race3d-ready'){document.querySelectorAll('#r3dif,iframe.r3demb').forEach(f=>{if(f.contentWindow===e.source){f.classList.add('on');const pr=f.parentNode.querySelector('.prep');if(pr)setTimeout(()=>pr.remove(),500);}});return;}if(!R3D)return;if(d.type==='race3d-done'){const o=R3D.ov;clearInterval(R3D.hoofT);try{sndStop();}catch(e){}removeEventListener('resize',R3D.fit);R3D=null;showBoard();requestAnimationFrame(()=>o.classList.add('out'));setTimeout(()=>o.remove(),500);}else if(d.type==='race3d-state')r3dState(d);else if(d.type==='race3d-call')r3dCall(d.text);else if(d.type==='race3d-replay')r3dReplay(d.frames);});
showRaceView=(o=>function(long){const RC=UI.race;if(RC)RC.long=long;
  if(RC&&r3dOn()&&typeof R3D_HTML==='string'){if(typeof ensureRival==='function')ensureRival(RC);closeModal();open3D(RC);return;}
  const r=o.apply(this,arguments);
  // a "3D" switch in the 2D race footer
  const ft=document.querySelector('#sheet .racefoot');if(ft&&typeof R3D_HTML==='string'&&!ft.querySelector('[data-act=r3d]')){const b=document.createElement('button');b.className='btn sm';b.dataset.act='r3d';b.textContent='3D中継';b.style.cssText='background:#1f6b45;color:#fff;border-color:#1f6b45';ft.insertBefore(b,ft.firstChild);}
  return r;})(showRaceView);
ACT.r3d=()=>{const RC=UI.race;if(!RC)return;S.flags.r3d=1;save();const cv=document.getElementById('cv');if(cv)cv.remove();closeModal();open3D(RC);};

/* 3D for the warm-up and the owners' box: swap their canvas for a live 3D view */
function embed3DIn(id,mode,ratio){const cv=document.getElementById(id);if(!cv||!UI.race||typeof R3D_HTML!=='string'||!r3dOn())return false;
  const W=cv.clientWidth||cv.parentNode.clientWidth||340,H=Math.round(W*9/16);
  const wrap=document.createElement('div');wrap.className='bcwrap3d';wrap.innerHTML='<div class="prep"><i></i>中継準備中</div>';const f=document.createElement('iframe');f.className='r3demb';f.id=id;f.setAttribute('aria-label',mode==='box'?'馬主席からの眺め':'返し馬');f.style.cssText=`display:block;width:100%;height:${H}px;border:0;border-radius:6px;background:#000`;
  cv.replaceWith(wrap);wrap.appendChild(f);f.srcdoc=r3dDoc(UI.race,mode);return true;}
boxAnim=(o=>function(){if(embed3DIn('obox','box',.62))return;return o.apply(this,arguments);})(boxAnim);
showWarmup=(o=>function(){const r=o.apply(this,arguments);embed3DIn('wup','warmup',.56);return r;})(showWarmup);
showPaddock=(o=>function(){const r=o.apply(this,arguments);embed3DIn('pdk','paddock',.62);return r;})(showPaddock);
showParade=(o=>function(){const r=o.apply(this,arguments);embed3DIn('prd','parade',.56);return r;})(showParade);
ACT.tomare=(o=>function(){const f=document.querySelector('iframe#pdk');if(f&&f.contentWindow)f.contentWindow.postMessage({type:'tomare'},'*');return o.apply(this,arguments);})(ACT.tomare);
/* while the 3D broadcast is on screen the rest of the game holds still: no BGM (only the course sounds),
   no phone calls or notification banners queued up behind it */
const r3dLive=()=>{const o=document.getElementById('r3d');return !!o&&!o.classList.contains('out');};
bgmApply=(o=>function(){if(r3dLive())AUD.over='none';return o.apply(this,arguments);})(bgmApply);
notifIdle=(o=>function(){return !r3dLive()&&o.apply(this,arguments);})(notifIdle);
maybeCall=(o=>function(){if(r3dLive())return;return o.apply(this,arguments);})(maybeCall);
open3D=(o=>function(){const r=o.apply(this,arguments);try{AUD.over='none';bgmApply();}catch(e){}return r;})(open3D);

/* the result board's turf vision plays the 3D finish back in slow motion (frames sent by the broadcast just before it hands back) */
function r3dReplay(frames){const RC=R3D&&R3D.RC||UI.race;if(!RC||!frames||!frames.length)return;const imgs=frames.map(src=>{const i=new Image();i.src=src;return i;});
  const cv=document.createElement('canvas');cv.width=384;cv.height=216;const x=cv.getContext('2d');let k=0,hold=0;
  const t0=Date.now(),tick=()=>{if(RC.boardDone||Date.now()-t0>300000)return;const im=imgs[Math.floor(k)];if(im&&im.complete&&im.naturalWidth)x.drawImage(im,0,0,384,216);
    if(k>=imgs.length-1){if(++hold>14){k=0;hold=0;}}else k+=.5;setTimeout(tick,110);};tick();
  RC.goalShot={cv,full:true,W:384,H:216};}

/* camera switcher: one camera button — each tap cuts to the next camera (the broadcast, then the head-on, close, aerial
   cameras, then the jockey cams and the chase cam); the button shows which one is on air, and the picture flashes its name */
(function(){const st=document.createElement('style');st.textContent=`
#r3d .cams{flex:none;display:flex;gap:6px;align-items:stretch}
#r3d .camcyc{flex:1;min-width:0;position:relative;display:grid;grid-template-columns:auto 1fr auto;align-items:center;column-gap:10px;min-height:46px;padding:5px 12px 5px 8px;border-radius:11px;
  border:1px solid #e2b93b;background:linear-gradient(180deg,rgba(226,185,59,.26),rgba(226,185,59,.06));box-shadow:0 0 0 1px rgba(226,185,59,.35),0 0 14px rgba(226,185,59,.22),inset 0 1px 0 rgba(255,255,255,.15);color:#fff;text-align:left;cursor:pointer}
#r3d .camcyc:active{transform:scale(.98)}
#r3d .camcyc .ic{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;background:#111a14;border:1px solid rgba(255,255,255,.18);position:relative}
#r3d .camcyc .ic svg{width:20px;height:20px}
#r3d .camcyc .ic:after{content:"";position:absolute;right:-2px;top:-2px;width:7px;height:7px;border-radius:50%;background:#ff3b30;box-shadow:0 0 6px #ff3b30;animation:r3dlv 1.2s infinite}
#r3d .camcyc .tx{min-width:0;display:grid;gap:1px}
#r3d .camcyc .t{font:700 9.5px/1.1 Oswald,sans-serif;letter-spacing:.14em;color:#f3d27a}
#r3d .camcyc .s{display:flex;align-items:center;gap:5px;font:800 13px/1.25 "Zen Kaku Gothic New",sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#r3d .camcyc .s i{font-style:normal;min-width:17px;padding:0 3px;border-radius:3px;font:700 10px/16px Oswald,sans-serif;text-align:center;box-shadow:0 0 0 1px rgba(0,0,0,.35)}
#r3d .camcyc .dots{display:flex;gap:3px;align-items:center}
#r3d .camcyc .dots b{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.25)}#r3d .camcyc .dots b.on{background:#f3d27a;box-shadow:0 0 4px #f3d27a}
#r3d .camback{flex:none;width:46px;border-radius:11px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#cfd8d2;font:700 10px/1.2 "Zen Kaku Gothic New",sans-serif;display:grid;place-items:center;padding:2px}
#r3d .camback svg{width:16px;height:16px;display:block;margin:0 auto 1px}
#r3d.wide .camcyc{min-height:38px;padding:3px 10px 3px 6px}#r3d.wide .camcyc .ic{width:28px;height:28px}#r3d.wide .camcyc .s{font-size:11.5px}#r3d.wide .camback{width:40px}
.camtoast{position:absolute;left:3%;top:16%;z-index:3;pointer-events:none;display:flex;align-items:center;gap:8px;padding:6px 12px 6px 8px;border-radius:6px;background:rgba(8,14,10,.72);border-left:3px solid #e2b93b;color:#fff;font:800 13px "Zen Kaku Gothic New",sans-serif;animation:camtoast 2.2s ease forwards}
.camtoast svg{width:16px;height:16px;color:#f3d27a}
@keyframes camtoast{0%{opacity:0;transform:translateX(-10px)}12%{opacity:1;transform:none}75%{opacity:1}100%{opacity:0}}`;document.head.appendChild(st);})();
const R3D_ICON={
  auto:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 21h8M12 18v3M7 3l5 3 5-3"/></svg>',
  fixed:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"/><path d="m16 11 5-3v10l-5-3"/><circle cx="6" cy="5" r="2"/><circle cx="12" cy="5" r="2"/></svg>',
  pov:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15a8 8 0 0 1 16 0"/><path d="M3 15h18M14 15v-3h6"/><circle cx="9" cy="11" r="1.4" fill="currentColor"/></svg>',
  chase:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="7" width="13" height="10" rx="2"/><path d="M15.5 10.5 21 7.5v9l-5.5-3"/></svg>'};
function r3dCams(RC){const box=document.getElementById('r3dcams');if(!box)return;const F=RC.field,me=F.find(f=>f.mine),fav=[...F].filter(f=>!f.mine).sort((a,b)=>(a.pop||99)-(b.pop||99))[0],riv=F.find(f=>f.rival&&!f.mine&&f!==fav);
  const wk=f=>{const w=wakuOf(f.no,F.length);return `<i style="background:${FRAMEC[w-1]};color:${FRAMET[w-1]}">${f.no}</i>`;};
  const opts=[{v:'auto',t:'BROADCAST',s:'中継'},{v:'fixed',name:'front',t:'HEAD-ON CAM',s:'正面カメラ'},{v:'fixed',name:'close',t:'CLOSE CAM',s:'並走カメラ'},{v:'fixed',name:'aerial',t:'AERIAL CAM',s:'空撮カメラ'}];
  if(me){opts.push({v:'pov',no:me.no,t:'JOCKEY CAM',s:wk(me)+'自分の馬'},{v:'chase',no:me.no,t:'CHASE CAM',s:wk(me)+'自分の馬'});}
  if(fav)opts.push({v:'pov',no:fav.no,t:'JOCKEY CAM',s:wk(fav)+'1番人気'});
  if(riv)opts.push({v:'pov',no:riv.no,t:'JOCKEY CAM',s:wk(riv)+'ライバル'});
  let cur=0;
  const paint=()=>{const o=opts[cur];box.innerHTML=`<button class="camcyc" id="r3dcamb" aria-label="カメラを切り替える"><span class="ic">${R3D_ICON[o.v]}</span><span class="tx"><span class="t">${o.t}　${cur+1}/${opts.length}</span><span class="s">${o.s}</span></span><span class="dots">${opts.map((_,k)=>`<b class="${k===cur?'on':''}"></b>`).join('')}</span></button>${cur?`<button class="camback" id="r3dcam0">${R3D_ICON.auto}中継へ</button>`:''}`;};
  const go=k=>{cur=k;paint();const o=opts[cur];const f=document.getElementById('r3dif');try{f.contentWindow.postMessage({type:'cam',view:o.v,no:o.no||0,name:o.name||''},'*');}catch(x){}
    const vid=document.getElementById('r3dvid');if(vid){vid.querySelectorAll('.camtoast').forEach(x=>x.remove());vid.insertAdjacentHTML('beforeend',`<div class="camtoast">${R3D_ICON[o.v]}${o.s}</div>`);const t=vid.lastElementChild;setTimeout(()=>t.remove(),2300);}};
  paint();box.onclick=e=>{if(!R3D)return;if(e.target.closest('#r3dcam0'))go(0);else if(e.target.closest('#r3dcamb'))go((cur+1)%opts.length);};}
