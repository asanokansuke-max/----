/* =========================================================
   ・出来事の結果は、選んだのと同じ画面に出す: 手紙の本文はそのまま残し、選択肢のところが「選んだ答え」と「その結果」に変わる。
     （短い結果を画面上の通知で流すのもやめる）
   ・騎手と知り合うのは、ゆっくり: 自分の馬が一度走ってから。そのあとも3か月に一人くらいずつ
   ========================================================= */
ACT.evc=(o=>function(d){let head='',picked='';try{const sh=document.getElementById('sheet');const eh=sh&&sh.querySelector('.evhead'),lt=sh&&sh.querySelector('.letter');
    if(eh&&lt)head=eh.outerHTML+lt.outerHTML;const b=sh&&sh.querySelector(`[data-act="evc"][data-i="${d.i}"]`);picked=b?b.textContent.trim():'';}catch(e){}
  const om=openModal;openModal=function(html,opt){try{if(head&&/^<div class="letter">/.test(html||'')&&/data-act="evnext"/.test(html)){const m=/^<div class="letter">([\s\S]*?)<\/div>(<div class="row">[\s\S]*)$/.exec(html);
      if(m)html=`${head}<div class="evpick"><span class="evpk">${esc(picked)}</span></div><div class="letter evres">${m[1]}</div>${m[2]}`;}}catch(e){}return om.call(this,html,opt);};
  try{return o.apply(this,arguments);}finally{openModal=om;}})(ACT.evc);
(function(){const st=document.createElement('style');st.textContent=`.evpick{display:flex;justify-content:flex-end;margin:10px 0 6px}.evpick .evpk{background:#2f8f5b;color:#fff;border-radius:16px 16px 4px 16px;padding:7px 13px;font-size:13.5px;max-width:85%}
.letter.evres{border-left:3px solid var(--accent);padding-left:12px;margin-top:4px;animation:evres .35s ease-out}@keyframes evres{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`;document.head.appendChild(st);})();
/* ---------- 騎手との出会いは、ゆっくり ---------- */
let JQ_RELEASE=false;
pushEv=(o=>function(type,data){try{if(type==='jIntro'&&data&&!JQ_RELEASE&&S&&S.flags){S.flags.jq=S.flags.jq||[];if(!S.flags.jq.includes(data.id)&&!(P(data.id)&&P(data.id).met))S.flags.jq.push(data.id);return;}}catch(e){}return o.apply(this,arguments);})(pushEv);
storyTriggers=(o=>function(first){const r=o.apply(this,arguments);try{if(first||!S.flags.jq||!S.flags.jq.length)return r;
  const raced=S.horses.some(h=>h.owner==='me'&&h.starts>0);if(!raced)return r;if(S.inbox.some(e=>e.type==='jIntro'))return r;
  /* a jockey who is only here for a season is met while he is here, whatever the spacing */
  const inSeason=id=>{const j=JK(id);return !(j&&j.season)||j.season.includes(M(S.t));};const seasonal=S.flags.jq.find(id=>JK(id)&&JK(id).season&&inSeason(id)&&!(P(id)&&P(id).met));
  if(!seasonal&&S.flags.jqT!=null&&S.t-S.flags.jqT<3)return r;
  /* the jockeys of your own trainers' stables first (you'd meet them at the yard), then the rest in the order they came along */
  const tj=new Set(S.horses.filter(h=>h.owner==='me'&&h.trainer).map(h=>TR(h.trainer)&&TR(h.trainer).jk).filter(Boolean));
  const L=S.flags.jq.filter(id=>!(P(id)&&P(id).met));S.flags.jq=L;const ok=L.filter(inSeason);if(!ok.length)return r;const id=seasonal||ok.find(x=>tj.has(x))||ok[0];S.flags.jq=L.filter(x=>x!==id);S.flags.jqT=S.t;
  JQ_RELEASE=true;try{pushEv('jIntro',{id});}finally{JQ_RELEASE=false;}}catch(e){console.error('jq',e);}return r;})(storyTriggers);
/* ---------- 実況の読み上げ: 読み間違えやすい漢字は、読み上げるときだけひらがなに（画面の字幕はそのまま） ---------- */
const READ_FIX=[[/行った/g,'いった'],[/行って/g,'いって'],[/行き/g,'いき'],[/行く/g,'いく'],[/行か/g,'いか'],[/行け/g,'いけ'],[/最内/g,'さいうち'],[/内ラチ/g,'うちラチ'],[/内を/g,'うちを'],[/内から/g,'うちから'],[/内で/g,'うちで'],
  [/大外/g,'おおそと'],[/外から/g,'そとから'],[/外を/g,'そとを'],[/外に/g,'そとに'],[/鞍上/g,'あんじょう'],[/出負け/g,'でまけ'],[/手応え/g,'てごたえ'],[/逃げ脚/g,'にげあし'],[/脚色/g,'あしいろ'],[/末脚/g,'すえあし'],
  [/一杯/g,'いっぱい'],[/上がり/g,'あがり'],[/後続/g,'こうぞく'],[/馬群/g,'ばぐん'],[/叩き合い/g,'たたきあい'],[/淀/g,'よど'],[/府中/g,'ふちゅう'],[/仁川/g,'にがわ'],[/人気薄/g,'にんきうす'],[/番手/g,'ばんて'],
  [/単騎/g,'たんき'],[/大逃げ/g,'おおにげ'],[/捲/g,'まく'],[/経済コース/g,'けいざいコース'],[/重馬場/g,'おもばば'],[/稍重/g,'ややおも'],[/不良/g,'ふりょう'],[/牝馬/g,'ひんば'],[/牡馬/g,'ぼば'],[/本馬場/g,'ほんばば'],[/返し馬/g,'かえしうま']];
speak=(o=>function(t,fast){let s=String(t||'');try{READ_FIX.forEach(([a,b])=>{s=s.replace(a,b);});}catch(e){}return o.call(this,s,fast);})(speak);
