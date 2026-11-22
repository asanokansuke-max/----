/* =========================================================
   写真判定のないレースも、掲示板の横の絵は3Dで:
   勝ち馬がゴール板を駆け抜ける瞬間（スタンド側から）を3Dのコースで撮る。
   中継を見ていれば中継の中で、結果だけのときは掲示板の枠の中で3Dが最後の数秒を再生して撮る。
   ========================================================= */
r3dInput=(o=>function(RC){const inp=o.apply(this,arguments);try{if(RC&&RC.order)inp.goal=1;}catch(e){}return inp;})(r3dInput);
addEventListener('message',e=>{const d=e.data||{};if(d.type!=='race3d-goal')return;const RC=(typeof R3D!=='undefined'&&R3D&&R3D.RC)||UI.shotRC||UI.race;if(!RC)return;RC.goalShot=d.img;if(UI.race===RC)goalPlace(RC);});
function goalPlace(RC){if(!RC||RC.photo||!RC.goalShot)return;const cv=document.getElementById('pfcv');const wrap=cv?cv.parentNode:document.querySelector('#sheet .pfwrap.goal3d');if(!wrap)return;
  wrap.classList.remove('small');wrap.classList.add('goal3d');const fresh=!RC.goalShown;RC.goalShown=1;wrap.querySelectorAll('canvas,.pfwait,img.goalim').forEach(x=>x.remove());/* the 3D run keeps going underneath (it still takes your horse's picture for the result card) */
  wrap.insertAdjacentHTML('afterbegin',`<img class="goalim" src="${RC.goalShot}" alt="ゴールの瞬間" style="display:block;width:100%;position:relative;z-index:2;${fresh?'opacity:0;transition:opacity .6s':''}">`);if(fresh){const im=wrap.querySelector('img.goalim');requestAnimationFrame(()=>requestAnimationFrame(()=>{im.style.opacity=1;}));}}
showBoard=(o=>function(){const RC=UI.race;const r=o.apply(this,arguments);try{if(RC&&RC.order&&!RC.photo){const cv=document.getElementById('pfcv');if(cv){const w=cv.parentNode;w.classList.remove('small');w.classList.add('goal3d');
    if(RC.goalShot)setTimeout(()=>goalPlace(RC),30);
    else if(!RC.goalAsked&&typeof R3D_HTML==='string'&&!window.__noShot){RC.goalAsked=1;w.style.position='relative';w.insertAdjacentHTML('beforeend','<div class="pfwait gw">3Dでゴールの瞬間を再生中…</div>');mountShot(RC,w);}}}}catch(e){console.error('goal3d',e);}return r;})(showBoard);
(function(){const st=document.createElement('style');st.textContent=`.pfwrap.goal3d{width:100%;opacity:1}.pfwait.gw{font-size:12px;letter-spacing:.08em;z-index:2}`;document.head.appendChild(st);})();
