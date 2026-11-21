/* =========================================================
   scroll lock: the page behind a sheet / race / call never scrolls
   ========================================================= */
const LOCK={on:false,y:0};
function lockScroll(){
  if(LOCK.on)return;LOCK.on=true;LOCK.y=window.scrollY||0;
  const b=document.body;b.style.position='fixed';b.style.top=`-${LOCK.y}px`;b.style.left='0';b.style.right='0';b.style.width='100%';
  document.documentElement.classList.add('locked');
}
function unlockScroll(){
  if(!LOCK.on)return;
  if(!$('#modal').hidden||(document.getElementById('call-ov')&&!document.getElementById('call-ov').hidden))return;
  LOCK.on=false;const b=document.body;b.style.position='';b.style.top='';b.style.left='';b.style.right='';b.style.width='';
  document.documentElement.classList.remove('locked');window.scrollTo(0,LOCK.y);
}
openModal=(o=>function(){const r=o.apply(this,arguments);lockScroll();return r;})(openModal);
closeModal=(o=>function(){const r=o.apply(this,arguments);unlockScroll();return r;})(closeModal);
drawCall=(o=>function(){const r=o.apply(this,arguments);if(CALL)lockScroll();else unlockScroll();return r;})(drawCall);
/* when the page jumps to the top while locked (tab change etc.), keep that as the restore point */
const _scrollTo=window.scrollTo.bind(window);
window.scrollTo=function(x,y){if(LOCK.on&&typeof y==='number'&&(typeof x==='number')){LOCK.y=y;return;}return _scrollTo.apply(window,arguments);};
/* stop touch-drags on the dimmed backdrop from scrolling anything */
['modal'].forEach(id=>{const el=document.getElementById(id);el.addEventListener('touchmove',e=>{if(e.target===el)e.preventDefault();},{passive:false});});
document.addEventListener('touchmove',e=>{const ov=document.getElementById('call-ov');if(ov&&!ov.hidden&&!e.target.closest('.call-log'))e.preventDefault();},{passive:false});
/* match the bottom padding of the page to the real height of the dock */
function fitDock(){const d=document.querySelector('.dock');if(d)document.documentElement.style.setProperty('--dock-h',d.offsetHeight+'px');}
render=(o=>function(){const r=o.apply(this,arguments);fitDock();return r;})(render);
window.addEventListener('resize',fitDock);
if(window.ResizeObserver){new ResizeObserver(fitDock).observe(document.body);}
fitDock();
/* ===== app shell: only <main> scrolls; keep its position across re-renders ===== */
const MS={tab:null,top:0};
render=(o=>function(){
  const m=document.querySelector('#app>main');
  if(m&&MS.tab===UI.tab)MS.top=m.scrollTop;else MS.top=0;
  const r=o.apply(this,arguments);
  const m2=document.querySelector('#app>main');
  if(m2){m2.scrollTop=MS.tab===UI.tab?MS.top:0;}
  MS.tab=UI.tab;document.documentElement.classList.toggle('shell',!!S);
  return r;})(render);
renderStart=(o=>function(){const r=o.apply(this,arguments);document.documentElement.classList.remove('shell');return r;})(renderStart);
/* window.scrollTo(0,0) after a tab change now means: scroll the content area to the top */
const _st2=window.scrollTo;
window.scrollTo=function(x,y){const m=document.querySelector('#app>main');if(m&&document.documentElement.classList.contains('shell')&&typeof y==='number'){if(!LOCK.on)m.scrollTop=y;return;}return _st2.apply(window,arguments);};
document.documentElement.classList.toggle('shell',!!S);
/* conversations fit on one screen: the sheet never scrolls, only the conversation log does (newest line kept in view) */
(function(){const st=document.createElement('style');st.textContent=`
.sheet.fit{display:flex;flex-direction:column;overflow:hidden;gap:12px}
.sheet.fit>*{flex:none;min-height:0}
.sheet.fit>.talklog{flex:1 1 auto;min-height:72px;max-height:none;overflow-y:auto;overscroll-behavior:contain}
.sheet.fit .choices{gap:6px}.sheet.fit .choices .btn{min-height:42px;padding-top:8px;padding-bottom:8px}`;document.head.appendChild(st);})();
function sheetFit(){const sh=$('#sheet');if(!sh||!sh.querySelector('.talklog'))return;sh.classList.add('fit');const lg=sh.querySelector('.talklog');if(lg)lg.scrollTop=lg.scrollHeight;}
drawTalk=(o=>function(){const r=o.apply(this,arguments);sheetFit();return r;})(drawTalk);
drawTouch=(o=>function(){const r=o.apply(this,arguments);sheetFit();return r;})(drawTouch);
/* letters and conversations always fit one screen: the header and the choices stay put; the letter tightens its type a little
   when it is only just too long, and scrolls inside itself (with a soft fade) only when it is really long */
(function(){const st=document.createElement('style');st.textContent=`
.sheet.lfit{display:flex;flex-direction:column;overflow:hidden}
.sheet.lfit>*{flex:none;min-height:0}
.sheet.lfit>.letter{flex:0 1 auto;overflow-y:auto;overscroll-behavior:contain}
.sheet.lfit>.letter.long{-webkit-mask-image:linear-gradient(180deg,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(180deg,#000 calc(100% - 28px),transparent)}`;document.head.appendChild(st);})();
function letterFit(){const sh=$('#sheet');if(!sh)return;const lt=sh.querySelector(':scope>.letter');if(!lt||sh.querySelector('canvas,iframe')||sh.classList.contains('fit'))return;
  sh.classList.add('lfit');lt.style.fontSize='';lt.style.lineHeight='';lt.classList.remove('long');
  let fs=parseFloat(getComputedStyle(lt).fontSize),lh=parseFloat(getComputedStyle(lt).lineHeight)/fs||1.9;
  for(let i=0;i<8&&lt.scrollHeight>lt.clientHeight+1;i++){fs=Math.max(12.5,fs-.5);lh=Math.max(1.55,lh-.06);lt.style.fontSize=fs+'px';lt.style.lineHeight=lh;}
  if(lt.scrollHeight>lt.clientHeight+1)lt.classList.add('long');}
openModal=(o=>function(){const r=o.apply(this,arguments);try{requestAnimationFrame(letterFit);letterFit();}catch(e){}return r;})(openModal);
addEventListener('resize',()=>{try{letterFit();}catch(e){}});
/* the page never moves sideways (iOS lets you nudge it when anything is a hair too wide), and a long press doesn't
   start selecting text or pop the callout — it's a game, not a document */
(function(){const st=document.createElement('style');st.textContent=`
html,body{overflow-x:hidden;overflow-x:clip;max-width:100%;overscroll-behavior-x:none}
#app,main,.sheet,#modal,#r3d,#r3d .side,.paper,.paper .scroll{overflow-x:hidden;overflow-x:clip;max-width:100vw}
body,button,.sheet,#app,#r3d,#opening,.paper{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}
input,textarea,select,[contenteditable]{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}
img,canvas,svg{-webkit-user-drag:none;user-drag:none}`;document.head.appendChild(st);})();
document.addEventListener('contextmenu',e=>{if(!e.target.closest('input,textarea'))e.preventDefault();});

/* boot, once every part of the game is loaded: a saved game is drawn again now that all event types exist (an event saved by a later part could not be drawn by the first render) */
try{if(S){if(Array.isArray(S.inbox))S.inbox=S.inbox.filter(e=>{if(!e||!EV[e.type])return false;try{return !!EV[e.type].r(e.data);}catch(x){console.error('drop event',e.type,x);return false;}});render();}}catch(e){console.error(e);}
