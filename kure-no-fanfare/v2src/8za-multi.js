/* =========================================================
   自分の馬が同じレースに2頭以上: 3D中継の横の「自分の馬」欄に全頭を並べ、それぞれの位置を出す
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`#r3d .me+.me{margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.1)}
#r3d .card.multi .me .pos{font-size:22px}`;document.head.appendChild(st);})();
open3D=(o=>function(RC){const r=o.apply(this,arguments);try{const my=RC.field.filter(f=>f.mine).sort((a,b)=>a.no-b.no);const first=document.querySelector('#r3d .card .me');
  if(my.length>1&&first){const card=first.parentNode;card.classList.add('multi');
    const rows=my.map(f=>`<div class="me">${typeof silk==='function'?silk(f.silks,30):''}<span class="nm">${esc(f.name)}</span><span class="pos" id="r3dpos-${f.no}">—<small>番手</small></span><span class="sub">${f.no}番・${esc(f.jname||'')}</span></div>`).join('');
    first.outerHTML=rows;}}catch(e){console.error('multi',e);}return r;})(open3D);
r3dState=(o=>function(d){const r=o.apply(this,arguments);try{if(d&&d.mes&&d.mes.length>1){const live=d.phase==='race'||d.phase==='after';d.mes.forEach(m=>{const el=document.getElementById('r3dpos-'+m.no);if(el)el.innerHTML=`${live?m.pos:'—'}<small>番手 / ${d.n}頭</small>`;});}}catch(e){}return r;})(r3dState);
