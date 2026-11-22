/* =========================================================
   細かい詰め:
   ・2歳戦は2000mまで（実際の番組どおり。2400mの2歳戦は1800mに）
   ・騎乗停止の知らせは1年に1回まで
   ========================================================= */
racesFor=(o=>function(h){const L=o.apply(this,arguments);try{L.forEach(r=>{if(!r.g&&r.grp==='2'&&r.dist>2000){r.dist=1800;r.key=r.key.replace(/\d+$/,'1800');}});}catch(e){}return L;})(racesFor);
capEv('ban',12,'banT');
