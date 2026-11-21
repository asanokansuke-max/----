/* =========================================================
   結果カード: the result as a broadcast-style card — on the left your horse at the line (from the 3D view;
   if it won, the rider's fist in the air), on the right the race, your horse's place in huge figures,
   time, last 3F, running positions, distance behind the winner, and the top five (plus yours) on an LED-style list.
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
#sheet.hascard .result-banner{display:none}
.rcard{position:relative;display:grid;min-height:max-content;flex:none;grid-template-columns:1.05fr 1fr;border-radius:16px;overflow:hidden;background:linear-gradient(135deg,#13201a,#0b120e);box-shadow:0 0 0 1px #2c3a31,0 14px 30px rgba(0,0,0,.35);color:#eef2ee;margin:2px 0 6px}
.rcard .pic{position:relative;min-height:220px;background:#1d2a22}
.rcard .pic img,.rcard .pic canvas{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.rcard .pic .tw{position:absolute;left:10px;top:10px;display:flex;font:700 11px "Zen Kaku Gothic New",sans-serif;border-radius:4px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.4)}
.rcard .pic .tw b{background:#c8231c;color:#fff;padding:4px 8px;letter-spacing:.08em;font-family:Oswald,sans-serif}.rcard .pic .tw span{background:rgba(10,14,12,.82);padding:4px 8px}
.rcard .pic .cap{position:absolute;left:10px;bottom:8px;font:700 11px "Zen Kaku Gothic New",sans-serif;text-shadow:0 1px 3px #000}
.rcard .pic::after{content:"";position:absolute;top:0;bottom:0;right:-14px;width:28px;background:#1f7a48;transform:skewX(-6deg);box-shadow:-3px 0 0 #0b120e}
.rcard .inf{position:relative;padding:14px 14px 12px 22px;display:grid;gap:8px;align-content:start;background:repeating-linear-gradient(115deg,rgba(255,255,255,.018) 0 30px,rgba(0,0,0,0) 30px 60px)}
.rcard .kk{font:700 10px Oswald,sans-serif;letter-spacing:.28em;color:#7fc89b}
.rcard .rn{display:flex;align-items:center;gap:8px;font:800 clamp(16px,4.4vw,24px)/1.15 "Zen Kaku Gothic New",sans-serif}
.rcard .rn .gr{font-size:11px}
.rcard .rs{font-size:11px;color:#b9c6bd;margin-top:-4px}
.rcard .hr{height:1px;background:linear-gradient(90deg,rgba(255,255,255,.18),rgba(255,255,255,0))}
.rcard .me{display:flex;align-items:center;gap:7px;font:800 clamp(14px,3.8vw,19px) "Zen Kaku Gothic New",sans-serif}
.rcard .me .wk{display:grid;place-items:center;width:22px;height:22px;border-radius:3px;font:800 13px Oswald,sans-serif}
.rcard .pl{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;align-items:center}
.rcard .pl .big{font:700 clamp(58px,15vw,88px)/.9 Oswald,sans-serif;background:linear-gradient(180deg,#fff1c2,#f0b13c 55%,#b06d12);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 rgba(0,0,0,.4))}
.rcard .pl .big small{font:800 .34em "Zen Kaku Gothic New",sans-serif;color:#f2efe6;-webkit-text-fill-color:#f2efe6;margin-left:4px}
.rcard .pl .tm{font:700 clamp(20px,5.2vw,28px) Oswald,sans-serif;display:flex;align-items:center;gap:8px}
.rcard .pl .tm i{font:800 10px "Zen Kaku Gothic New",sans-serif;font-style:normal;background:#c8231c;color:#fff;padding:2px 6px;border-radius:3px}
.rcard .pl .sub{font-size:11px;color:#b9c6bd;line-height:1.5}.rcard .pl .sub b{color:#f0b13c;font-weight:700}
.rcard .lst{background:#070a09;border-radius:10px;padding:6px 8px;box-shadow:inset 0 0 0 1px #1f2a24}
.rcard .lst .hd{display:flex;align-items:center;gap:6px;font-size:10px;color:#8c9a91;padding:2px 2px 4px}.rcard .lst .hd .bd{margin-left:auto;display:flex;gap:5px}
.rcard .lst .hd .bd i{font-style:normal;font-weight:800;font-size:10px;color:#fff;background:#c8231c;border-radius:4px;padding:2px 7px;box-shadow:0 0 8px rgba(255,60,40,.6)}
.rcard .lst .r{display:grid;grid-template-columns:18px 6px 30px 1fr auto;align-items:center;gap:7px;padding:4px 4px;font-size:12.5px}
.rcard .lst .r .p{font:700 14px Oswald,sans-serif;text-align:center}.rcard .lst .r .bar{height:16px;border-radius:2px}
.rcard .lst .r .no{font:700 18px/1 Oswald,sans-serif;color:#ff9f1c;text-shadow:0 0 6px rgba(255,159,28,.55);letter-spacing:.04em}
.rcard .lst .r .nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:700}.rcard .lst .r .mg{font-size:11px;color:#ff9f1c;white-space:nowrap}
.rcard .lst .r.mine{border:1px solid #d9a441;border-radius:7px;background:rgba(217,164,65,.08)}.rcard .lst .r.mine .mg i{font-style:normal;background:#c8231c;color:#fff;border-radius:3px;padding:1px 5px;margin-right:5px;font-weight:800;font-size:10px}
.rcard .lst .dots{text-align:center;color:#59665e;font-size:10px;letter-spacing:.3em;line-height:.8}
@media (max-width:560px){.rcard{grid-template-columns:1fr}.rcard .pic{min-height:0;height:0;padding-top:56.25%}.rcard .pic::after{display:none}.rcard .inf{padding:12px 14px}}`;document.head.appendChild(st);})();
function rcardHTML(RC){const r=RC.race,ord=RC.order,n=ord.length,me=ord.filter(f=>f.mine).sort((a,b)=>a.pos-b.pos)[0];if(!me)return '';
  const w=wakuOf(me.no,n),t=RC.time+(me.out?0:(me.gapL||0)*.165),sec=(me.gapL||0)*.165,f3b=(r.surf==='ダ'?36.4:34.6)+(70-(r.mean||70))*.03+(hash(r.name+S.t)-.5)*1.2;
  const sty=me.used||me.style,f3=me.out?null:f3b+({逃げ:.6,先行:.3,差し:-.2,追込:-.4}[sty]||0)+Math.min(1.2,(me.gapL||0)*.06)+(hash(me.name+'3f')-.5)*.5;
  const pass=(()=>{const b={逃げ:1,先行:Math.max(2,Math.round(n*.2)),差し:Math.round(n*.55),追込:n-1}[sty]||Math.round(n/2);const a=clamp(b+Math.round((hash(me.name+'p1')-.5)*2),1,n),c=clamp(a+Math.round((hash(me.name+'p2')-.5)*3),1,n);return r.dist>=1800?`${a}-${a}-${c}`:`${a}-${c}`;})();
  const wd=dstr(S.t).replace(/^\d+年/,''),going=r.going||'良',sky=going==='良'?'晴':going==='稍重'?'曇':'雨';
  const row=f=>{const fw=wakuOf(f.no,n);return `<div class="r ${f.mine?'mine':''}"><span class="p">${f.pos}</span><span class="bar" style="background:${FRAMEC[fw-1]};${fw===1?'box-shadow:inset 0 0 0 1px #888':''}"></span><span class="no">${f.no}</span><span class="nm">${esc(f.name)}</span><span class="mg">${f.mine?`<i>${f.pos===1?'勝利':'あなたの馬'}</i>`:''}${f.pos===1?'':esc(f.margin||'')}${f.ev==='降着'?' 降着':''}</span></div>`;};
  const top=ord.slice(0,5),showMe=me.pos>5;
  return `<div class="rcard"><div class="pic">${RC.mineShot?`<img src="${RC.mineShot}" alt="">`:'<canvas id="rcpc"></canvas>'}<div class="tw"><b>● RESULT</b><span>${esc(wd)}　${esc(r.course)}</span></div><div class="cap">${me.pos===1?'ゴールの瞬間（1着・ガッツポーズ）':me.out?`${esc(me.ev||'')}`:`ゴールの瞬間（${me.pos}着）`}</div></div>
   <div class="inf"><div class="kk">YOUR HORSE · RESULT</div><div class="rn">${esc(r.name)}${gradeBadge(r.grade)}</div><div class="rs">${esc(r.course)} ${r.surf==='ダ'?'ダート':'芝'}${r.dist}m・${n}頭・${sky}・${going}</div><div class="hr"></div>
    <div class="me"><span class="wk" style="background:${FRAMEC[w-1]};color:${FRAMET[w-1]}">${me.no}</span>${silk(me.silks,22)}${esc(me.name)}</div>
    <div class="pl"><div class="big">${me.out?'—':me.pos}<small>${me.out?esc(me.out):'着'}</small></div><div><div class="tm">${me.out?'':timeStr(t)}${me.ev==='降着'?'<i>降着</i>':me.ev==='失格'?'<i>失格</i>':''}</div>
     <div class="sub">${f3?`上がり3F ${f3.toFixed(1)}・`:''}通過 ${pass}<br>${me.pos===1?`<b>2着に${esc(ord[1]&&ord[1].margin||'')}差</b>`:me.out?'':`<b>勝ち馬から${sec.toFixed(1)}秒（${esc(lenSay(me.gapL))}）</b>`}</div></div></div>
    <div class="lst"><div class="hd"><span>着順</span><span>馬番</span><span class="bd">${RC.inq?'<i>審議</i>':''}<i>確定</i></span></div>${top.map(row).join('')}${showMe?`<div class="dots">・・・</div>${row(me)}`:''}</div></div></div>`;}
function lenSay(L){L=L||0;if(L<.08)return 'ハナ差';if(L<.18)return 'アタマ差';if(L<.3)return 'クビ差';if(L<.7)return '半馬身';if(L>=10)return '大差';const v=Math.round(L*2)/2;return Number.isInteger(v)?`${v}馬身`:`${Math.floor(v)}馬身半`;}
showResult=(o=>function(){const RC=UI.race;const r=o.apply(this,arguments);try{const sh=$('#sheet');if(RC&&RC.order&&sh&&!sh.querySelector('.rcard')){const hd=sh.querySelector('.racehead');const html=rcardHTML(RC);if(html&&hd){hd.insertAdjacentHTML('afterend',html);sh.classList.add('hascard');
    const cv=$('#rcpc');if(cv){const me=RC.order.filter(f=>f.mine).sort((a,b)=>a.pos-b.pos)[0],c=cv.getContext('2d'),W=cv.clientWidth||320,H=cv.clientHeight||180,dpr=window.devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;c.scale(dpr,dpr);
      const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#9fb7c9');g.addColorStop(.42,'#dfe6e3');g.addColorStop(.43,'#6f9b62');g.addColorStop(1,'#3f6d39');c.fillStyle=g;c.fillRect(0,0,W,H);c.fillStyle='#f4f4f0';c.fillRect(0,H*.47,W,2);
      drawHorse(c,W*.5,H*.86,H/150,1.1,me.coat||(me.h&&me.h.coat)||'鹿毛',me.silks,me.no,true,{});}}}}catch(e){console.error('rcard',e);}return r;})(showResult);
