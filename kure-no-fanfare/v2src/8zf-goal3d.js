/* =========================================================
   写真判定のないレースも、掲示板の横の絵は3Dで:
   勝ち馬がゴール板を駆け抜ける瞬間（スタンド側から）を3Dのコースで撮る。
   中継を見ていれば中継の中で、結果だけのときは掲示板の枠の中で3Dが最後の数秒を再生して撮る。
   ========================================================= */
r3dInput=(o=>function(RC){const inp=o.apply(this,arguments);try{if(RC&&RC.order)inp.goal=1;}catch(e){}return inp;})(r3dInput);
/* only a picture that really decodes is kept (a broken one would show as an empty frame with a "?") */
addEventListener('message',e=>{const d=e.data||{};if(d.type!=='race3d-goal')return;const RC=(typeof R3D!=='undefined'&&R3D&&R3D.RC)||UI.shotRC||UI.race;if(!RC||typeof d.img!=='string'||d.img.length<4000)return;
  const im=new Image();im.onload=()=>{if(!im.naturalWidth)return;RC.goalShot=d.img;RC.goalOk=1;if(UI.race===RC)goalDraw(RC,im);};im.onerror=()=>{console.error('goal picture did not decode');};im.src=d.img;});
/* the picture is decoded first and drawn onto a canvas (no <img> element: a picture that would not show can't leave an empty "?" frame) */
function goalPlace(RC){if(!RC||RC.photo||!RC.goalShot)return;const src=RC.goalShot;const im=new Image();
  im.onload=()=>{if(!im.naturalWidth||RC.goalShot!==src){if(!im.naturalWidth)goalRetake(RC);return;}RC.goalOk=1;goalDraw(RC,im);};im.onerror=()=>goalRetake(RC);im.src=src;}
function goalDraw(RC,im){if(UI.race!==RC)return;const cv=document.getElementById('pfcv');const wrap=cv?cv.parentNode:document.querySelector('#sheet .pfwrap.goal3d');if(!wrap)return;
  wrap.classList.remove('small');wrap.classList.add('goal3d');const fresh=!RC.goalShown;RC.goalShown=1;wrap.querySelectorAll('canvas,.pfwait').forEach(x=>x.remove());
  const c=document.createElement('canvas');c.className='goalim';c.width=im.naturalWidth;c.height=im.naturalHeight;c.setAttribute('aria-label','ゴールの瞬間');c.style.cssText=`display:block;width:100%;height:auto;aspect-ratio:${im.naturalWidth}/${im.naturalHeight};position:relative;z-index:2;${fresh?'opacity:0;transition:opacity .6s':''}`;
  try{c.getContext('2d').drawImage(im,0,0);}catch(e){goalRetake(RC);return;}wrap.prepend(c);if(fresh)requestAnimationFrame(()=>requestAnimationFrame(()=>{c.style.opacity=1;}));}
showBoard=(o=>function(){const RC=UI.race;const r=o.apply(this,arguments);try{if(RC&&RC.order&&!RC.photo){const cv=document.getElementById('pfcv');if(cv){const w=cv.parentNode;w.classList.remove('small');w.classList.add('goal3d');
    if(RC.goalShot)setTimeout(()=>goalPlace(RC),30);
    else if(!RC.goalAsked&&typeof R3D_HTML==='string'&&!window.__noShot){RC.goalAsked=1;w.style.position='relative';w.insertAdjacentHTML('beforeend','<div class="pfwait gw">3Dでゴールの瞬間を再生中…</div>');mountShot(RC,w);}}}}catch(e){console.error('goal3d',e);}return r;})(showBoard);
(function(){const st=document.createElement('style');st.textContent=`.pfwrap.goal3d{width:100%;opacity:1}.pfwait.gw{font-size:12px;letter-spacing:.08em;z-index:2}`;document.head.appendChild(st);})();
function goalRetake(RC){RC.goalShot=null;RC.goalOk=0;if(RC.goalRetook||window.__noShot||typeof R3D_HTML!=='string')return;const cv=document.getElementById('pfcv');if(!cv||UI.race!==RC)return;RC.goalRetook=1;const w=cv.parentNode;w.style.position='relative';if(!w.querySelector('.pfwait'))w.insertAdjacentHTML('beforeend','<div class="pfwait gw">3Dでゴールの瞬間を再生中…</div>');mountShot(RC,w);}
