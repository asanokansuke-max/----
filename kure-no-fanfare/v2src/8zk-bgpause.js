/* =========================================================
   別のアプリやタブに移ったら、音を全部止める（戻ったら再開）:
   iPhoneで音が途切れないように流している無音のオーディオが「再生中」のままだと、
   バックグラウンドでもBGMが鳴り続けていた。画面が隠れたら、無音のオーディオ・効果音とBGM・実況の声・
   「止まーれ」の音声を止め、そのあいだは音の再開を受け付けない。
   ========================================================= */
(function(){const AC=[window.AudioContext,window.webkitAudioContext].filter(Boolean);
  AC.forEach(C=>{const r0=C.prototype.resume;if(!r0||r0.__bg)return;const r=function(){if(document.hidden)return Promise.resolve();return r0.apply(this,arguments);};r.__bg=1;C.prototype.resume=r;});
  const ctxs=()=>{const L=[];try{if(SND&&SND.ac)L.push(SND.ac);}catch(e){}try{if(AUD&&AUD.ac&&!L.includes(AUD.ac))L.push(AUD.ac);}catch(e){}return L;};
  let wasSpeaking=false;
  const pause=()=>{ctxs().forEach(ac=>{try{if(ac.state==='running')ac.suspend();}catch(e){}});
    try{const k=window.__keepAud;if(k&&!k.paused)k.pause();}catch(e){}
    try{if(typeof TOMARE_EL!=='undefined'&&TOMARE_EL&&!TOMARE_EL.paused)TOMARE_EL.pause();}catch(e){}
    try{const ss=window.speechSynthesis;if(ss&&(ss.speaking||ss.pending)){wasSpeaking=true;ss.cancel();}if(typeof SPQ!=='undefined'){SPQ.q=[];SPQ.busy=false;}}catch(e){}
    document.querySelectorAll('iframe').forEach(f=>{try{f.contentWindow.postMessage({type:'bgpause',on:true},'*');}catch(e){}});};
  const resume=()=>{ctxs().forEach(ac=>{try{if(ac.state==='suspended')ac.resume();}catch(e){}});
    try{const k=window.__keepAud;if(k&&k.paused){const p=k.play();if(p&&p.catch)p.catch(()=>{});}}catch(e){}
    document.querySelectorAll('iframe').forEach(f=>{try{f.contentWindow.postMessage({type:'bgpause',on:false},'*');}catch(e){}});};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else resume();});
  window.addEventListener('pagehide',pause);window.addEventListener('blur',()=>{if(document.hidden)pause();});})();
