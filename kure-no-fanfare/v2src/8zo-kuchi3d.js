/* =========================================================
   口取り式の写真を3Dで: 口取り式の画面を開くと、写真の枠の中で3Dのコースが開き、スタンド前に勝ち馬（騎手が乗って）・
   引き手の厩務員・馬主たちが並んだところを1枚撮る。撮れたら枠の絵がその写真に変わり、アルバムにもその写真が残る。
   3Dが間に合わなければ、これまでの絵のまま（あとから届けば、アルバムの写真だけ差し替わる）。
   ========================================================= */
r3dInput=(o=>function(RC){const inp=o.apply(this,arguments);try{if(RC&&RC.__kuchi){inp.kuchi=RC.__kuchi;inp.warmed=true;}}catch(e){}return inp;})(r3dInput);
function kuchiMount(RC,photo){try{if(typeof R3D_HTML!=='string'||window.__noShot)return;const host=document.querySelector('#sheet .bc.kuchi');if(!host)return;
  RC.__kuchi={no:photo.no,people:(photo.people||[]).map(q=>({suit:q.suit,hair:q.hair,skin:q.skin,rosette:!!q.rosette,child:!!q.child,dress:!!q.dress})),g1:!!photo.g1};
  const doc=r3dDoc(RC,'kuchi');delete RC.__kuchi;document.querySelectorAll('#kuchif').forEach(x=>x.remove());
  host.style.position='relative';host.classList.add('w3d');const f=document.createElement('iframe');f.id='kuchif';f.setAttribute('aria-hidden','true');f.tabIndex=-1;f.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;pointer-events:none;z-index:1;background:#0b120e;opacity:0;transition:opacity .5s';
  host.appendChild(f);host.insertAdjacentHTML('beforeend','<div class="kprep">3Dで撮影の準備中…</div>');f.srcdoc=doc;UI.kuchiWait=photo;
  /* no drawn picture meanwhile; if the 3D never comes up, the drawn one after all */
  setTimeout(()=>{if(!UI.kuchiOk3d){host.classList.remove('w3d');}},15000);
  setTimeout(()=>{const x=document.getElementById('kuchif');if(x)x.remove();document.querySelectorAll('.kprep').forEach(e=>e.remove());host.classList.remove('w3d');},60000);UI.kuchiOk3d=0;}catch(e){console.error('kuchi3d',e);}}
addEventListener('message',e=>{const d=e.data||{};if(d.type!=='race3d-kuchiready')return;const f=document.getElementById('kuchif');if(!f||f.contentWindow!==e.source)return;UI.kuchiOk3d=1;f.style.opacity=1;document.querySelectorAll('.kprep').forEach(x=>x.textContent='撮影中…');});
ACT.kuchi=(o=>function(){const r=o.apply(this,arguments);try{const RC=UI.race;if(RC&&UI.kuchi)kuchiMount(RC,UI.kuchi);}catch(e){}return r;})(ACT.kuchi);
addEventListener('message',e=>{const d=e.data||{};if(d.type!=='race3d-kuchi'||typeof d.img!=='string'||d.img.length<4000)return;const photo=UI.kuchiWait;if(!photo)return;
  picShrink(d.img,520,.72).then(u=>{if(!u)return;photo.img=u;/* already in the album (the shutter was pressed first): the album copy gets it too */
    (S.album||[]).forEach(a=>{if(!a.img&&a.y===photo.y&&a.m===photo.m&&a.race===photo.race&&a.name===photo.name)a.img=u;});try{save();}catch(x){}
    picLoad(u).then(im=>{const cv=document.getElementById('kcv');if(im&&cv){const c=cv.getContext('2d'),dpr=window.devicePixelRatio||1;c.save();c.setTransform(dpr,0,0,dpr,0,0);picCover(c,im,0,0,cv.width/dpr,cv.height/dpr);c.restore();}
      const f=document.getElementById('kuchif');if(f)f.remove();document.querySelectorAll('.kprep').forEach(x=>x.remove());document.querySelectorAll('.bc.kuchi.w3d').forEach(x=>x.classList.remove('w3d'));});});});
/* the album shows the 3D print when there is one */
render=(o=>function(){const r=o.apply(this,arguments);try{document.querySelectorAll('canvas[data-photo]').forEach(cv=>{const p=(S.album||[])[+cv.dataset.photo];if(!p||!p.img)return;picLoad(p.img).then(im=>{if(!im||!cv.isConnected)return;const c=cv.getContext('2d'),dpr=window.devicePixelRatio||1;c.save();c.setTransform(1,0,0,1,0,0);picCover(c,im,0,0,cv.width,cv.height);c.restore();});});}catch(e){}return r;})(render);
(function(){const st=document.createElement('style');st.textContent=`.bc.kuchi.w3d{background:#0b120e}.bc.kuchi.w3d canvas{visibility:hidden}.kprep{position:absolute;left:0;right:0;bottom:8px;z-index:2;text-align:center;color:#fff;font:700 12px "Zen Kaku Gothic New",sans-serif;letter-spacing:.08em;text-shadow:0 1px 3px rgba(0,0,0,.8);pointer-events:none}`;document.head.appendChild(st);})();
