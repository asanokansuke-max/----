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
