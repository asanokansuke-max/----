/* =========================================================
   自分の馬が同じレースに2頭以上: 3D中継の横の「自分の馬」欄に全頭を並べ、それぞれの位置を出す
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`#r3d .me+.me{margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.1)}
#r3d .card.multi{padding:8px 10px}
#r3d .card.multi .me{grid-template-columns:auto auto 1fr auto;gap:0 8px}
#r3d .card.multi .me+.me{margin-top:5px;padding-top:5px}
#r3d .card.multi .me .no{font:800 13px/1 Oswald,sans-serif;min-width:22px;height:20px;display:grid;place-items:center;border-radius:3px}
#r3d .card.multi .me .nm{font-size:14px}
#r3d .card.multi .me .sub{display:none}
#r3d .card.multi .me .pos{grid-row:auto;grid-column:auto;font-size:20px;display:flex;align-items:baseline;gap:3px}
#r3d .card.multi .me .pos small{display:inline;font-size:10px}
#r3d .card.multi .bar{margin-top:6px}`;document.head.appendChild(st);})();
open3D=(o=>function(RC){const r=o.apply(this,arguments);try{const my=RC.field.filter(f=>f.mine).sort((a,b)=>a.no-b.no);const first=document.querySelector('#r3d .card .me');
  if(my.length>1&&first){const card=first.parentNode;card.classList.add('multi');
    const rows=my.map(f=>{const w=wakuOf(f.no,RC.field.length);return `<div class="me">${typeof silk==='function'?silk(f.silks,22):''}<span class="no" style="background:${FRAMEC[w-1]};color:${FRAMET[w-1]}">${f.no}</span><span class="nm">${esc(f.name)}</span><span class="pos" id="r3dpos-${f.no}">—<small>番手</small></span></div>`;}).join('');
    first.outerHTML=rows;}}catch(e){console.error('multi',e);}return r;})(open3D);
r3dState=(o=>function(d){const r=o.apply(this,arguments);try{if(d&&d.mes&&d.mes.length>1){const live=d.phase==='race'||d.phase==='after';d.mes.forEach(m=>{const el=document.getElementById('r3dpos-'+m.no);if(el)el.innerHTML=`${live?m.pos:'—'}<small>番手</small>`;});}}catch(e){}return r;})(r3dState);
