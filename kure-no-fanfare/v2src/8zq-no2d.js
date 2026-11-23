/* =========================================================
   3Dを待つあいだに2Dの絵を出さない: 結果カードの絵・掲示板のゴールの絵／写真判定は、3Dを撮っているあいだは暗い枠
   （「3Dで…再生中」の文字だけ）にして、3Dの絵が来たらそのまま入れ替える。3Dが最後まで撮れなかったときだけ、これまでの絵を出す。
   ========================================================= */
mountShot=(o=>function(RC,host){const r=o.apply(this,arguments);try{if(host&&document.getElementById('shotif')){host.classList.add('w3d');clearTimeout(host.__w3t);host.__w3t=setTimeout(()=>host.classList.remove('w3d'),100000);}}catch(e){}return r;})(mountShot);
addEventListener('message',e=>{const d=e.data||{};if(d.type!=='race3d-shotdone')return;setTimeout(()=>{document.querySelectorAll('.w3d').forEach(x=>{if(x.classList.contains('kuchi'))return;x.classList.remove('w3d');});},1800);});
(function(){const st=document.createElement('style');st.textContent=`.w3d{background:#0b120e!important}.w3d>canvas{visibility:hidden}`;document.head.appendChild(st);})();
