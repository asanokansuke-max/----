/* =========================================================
   スマホを閉じやすく: a big close button under the device (thumb zone),
   swipe the phone down / flick the home bar up to put it away, Esc,
   and a quick slide-away animation.
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
#modal.phonemode{padding-bottom:calc(78px + env(safe-area-inset-bottom,0px))}
#modal.phonemode #sheet{height:min(100%,760px);transition:transform .22s cubic-bezier(.2,.8,.2,1),opacity .22s}
#modal.phonemode #sheet.drag{transition:none}
#modal.phonemode #sheet.out{transform:translateY(110%)!important;opacity:.2}
.pclose{display:none!important}
.pdone{position:absolute;left:50%;bottom:-66px;transform:translateX(-50%);z-index:5;display:flex;align-items:center;gap:8px;height:50px;padding:0 22px 0 16px;border-radius:25px;border:1px solid rgba(255,255,255,.25);background:rgba(250,250,252,.95);color:#111;font-size:16px;font-weight:700;box-shadow:0 6px 20px rgba(0,0,0,.35);font-family:-apple-system,"Hiragino Sans","Zen Kaku Gothic New",sans-serif}
.pdone i{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#1c1c1e;color:#fff;font-style:normal;font-size:15px;line-height:1}
.pdone:active{transform:translateX(-50%) scale(.96)}
.phome{height:34px!important;cursor:grab;touch-action:none}
.psb{cursor:grab}
`;document.head.appendChild(st);})();

function phPutAway(){const sh=$('#sheet');if(!sh||!$('#modal').classList.contains('phonemode')){ACT.phClose0();return;}
  sh.classList.add('out');setTimeout(()=>{sh.classList.remove('out','drag');sh.style.transform='';ACT.phClose0();},200);}
ACT.phClose0=ACT.phClose;ACT.phClose=()=>phPutAway();
drawPhone=(o=>function(){const r=o.apply(this,arguments);const sh=$('#sheet');
  if(sh&&!sh.querySelector('.pdone')){const b=document.createElement('button');b.className='pdone';b.dataset.act='phClose';b.setAttribute('aria-label','スマホを閉じる');b.innerHTML='<i>✕</i>閉じる';sh.appendChild(b);}
  return r;})(drawPhone);
// tap outside the phone also puts it away (with the animation)
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal'&&$('#modal').classList.contains('phonemode')){e.stopImmediatePropagation();phPutAway();}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#modal').classList.contains('phonemode'))phPutAway();});
// swipe: drag the phone down from its top bar (or anywhere when the list is scrolled to the top), or flick the home bar up
(function(){let y0=null,dy=0,mode=null;
  const on=()=>$('#modal').classList.contains('phonemode');
  document.addEventListener('touchstart',e=>{if(!on())return;const t=e.target,sh=$('#sheet');if(!sh||!sh.contains(t))return;
    if(t.closest('.phome')){mode='up';}
    else if(t.closest('.psb,.pnav,.pbig')||(t.closest('.pbody')&&t.closest('.pbody').scrollTop<=0&&!t.closest('.preply,button'))){mode='down';}
    else return;y0=e.touches[0].clientY;dy=0;sh.classList.add('drag');},{passive:true});
  document.addEventListener('touchmove',e=>{if(y0==null)return;dy=e.touches[0].clientY-y0;const sh=$('#sheet');if(!sh)return;
    if(mode==='down')sh.style.transform=`translateY(${Math.max(0,dy)}px)`;else sh.style.transform=`translateY(${Math.min(0,dy)*.35}px)`;},{passive:true});
  document.addEventListener('touchend',()=>{if(y0==null)return;const sh=$('#sheet');y0=null;if(!sh)return;sh.classList.remove('drag');
    if((mode==='down'&&dy>110)||(mode==='up'&&dy<-40))phPutAway();else sh.style.transform='';mode=null;},{passive:true});})();
/* opening the phone means you've seen what's waiting: drop queued banners, and don't pop one
   the moment you put the phone away */
drawPhone=(o=>function(){NQ.length=0;hideNotif();return o.apply(this,arguments);})(drawPhone);
ACT.phClose0=(o=>function(){const r=o.apply(this,arguments);NQUIET=Date.now()+8000;return r;})(ACT.phClose0);
