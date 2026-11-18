/* =========================================================
   スマホの通知: banners that drop in from the top like a real phone,
   and chats that arrive bubble by bubble with a typing indicator
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
#nbanner{position:fixed;left:50%;top:calc(8px + env(safe-area-inset-top,0px));z-index:60;width:min(94vw,400px);transform:translate(-50%,-140%);transition:transform .38s cubic-bezier(.2,.9,.25,1.05),opacity .3s;opacity:0;cursor:pointer;touch-action:none}
#nbanner.on{transform:translate(-50%,0);opacity:1}
#nbanner .nb{display:flex;gap:10px;align-items:flex-start;padding:11px 12px;border-radius:20px;background:rgba(245,245,247,.86);backdrop-filter:blur(18px) saturate(1.6);-webkit-backdrop-filter:blur(18px) saturate(1.6);box-shadow:0 10px 30px rgba(0,0,0,.25);color:#111;font-family:-apple-system,"Hiragino Sans","Zen Kaku Gothic New",sans-serif}
@media (prefers-color-scheme:dark){#nbanner .nb{background:rgba(40,40,44,.86);color:#f2f2f7}}
#nbanner .ic{flex:none;width:38px;height:38px;border-radius:9px;background:linear-gradient(180deg,#5ef07a,#20c24a);display:grid;place-items:center;color:#fff}
#nbanner .ic.call{background:linear-gradient(180deg,#ff6b5e,#e8322a)}
#nbanner .nmid{flex:1;min-width:0}
#nbanner .ntop{display:flex;justify-content:space-between;font-size:12px;opacity:.6;margin-bottom:1px}
#nbanner .nnm{font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#nbanner .ntx{font-size:14px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
#nbanner .nmore{font-size:11px;opacity:.55;margin-top:3px}
#nbanner .av{flex:none}
.phbtn.ping{animation:phping .9s ease-in-out 2}
@keyframes phping{0%,100%{transform:rotate(0)}15%{transform:rotate(-12deg)}30%{transform:rotate(12deg)}45%{transform:rotate(-8deg)}60%{transform:rotate(0)}}
.bub.anim,.pread.anim,.typing.anim{opacity:0;animation:bubIn .28s ease-out forwards;animation-delay:var(--d)}
@keyframes bubIn{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}
.typing{align-self:flex-start;background:#e5e5ea;border-radius:18px;padding:10px 14px;display:flex;gap:4px}
.typing i{width:7px;height:7px;border-radius:50%;background:#8e8e93;animation:tdot 1s infinite}
.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}
@keyframes tdot{0%,60%,100%{opacity:.35;transform:none}30%{opacity:1;transform:translateY(-3px)}}
.typing.anim{animation:bubIn .2s ease-out forwards,tgone .2s ease-in forwards;animation-delay:var(--d),var(--e)}
@keyframes tgone{to{opacity:0;height:0;padding:0;margin:-3px 0}}
`;document.head.appendChild(st);})();

const NQ=[];let NB=null;
let NQUIET=0;
function notifIdle(){return !document.getElementById('mturn')&&$('#modal').hidden&&!CALL&&!(UI&&UI.phone)&&S&&Date.now()>NQUIET;}
const NSEEN=new Set();
function queueNotif(m){if(!m||NSEEN.has(m.id))return;NSEEN.add(m.id);NQ.push(m);setTimeout(flushNotif,900);}
let NLAST=0;
function flushNotif(){if(NB||!NQ.length)return;if(!notifIdle()){return;}
  // one banner per batch, and not too often: the rest just waits quietly in the inbox (badge)
  if(Date.now()-NLAST<30000){setTimeout(flushNotif,30000-(Date.now()-NLAST)+200);return;}
  const pri=x=>(x.rLabels&&!x.answered?2:0)+(x.from&&P(x.from)?1:0);
  const batch=NQ.splice(0).filter(x=>!x.read);if(!batch.length)return;batch.sort((a,b)=>pri(b)-pri(a));
  const m=batch[0],more=batch.length-1;NLAST=Date.now();let el=$('#nbanner');if(!el){el=document.createElement('div');el.id='nbanner';document.body.appendChild(el);
    el.addEventListener('click',()=>{const id=+el.dataset.id;hideNotif(true);NQ.length=0;const mm=PH().mails.find(x=>x.id===id)||null;UI.phone={mail:mm,anim:mm&&!mm.read?'open':null};drawPhone();});
    let sy=null;el.addEventListener('touchstart',e=>{sy=e.touches[0].clientY;},{passive:true});el.addEventListener('touchmove',e=>{if(sy!=null&&e.touches[0].clientY-sy<-20){sy=null;hideNotif();}},{passive:true});}
  const av=m.from&&P(m.from)?avatar(m.from,34):'';
  el.dataset.id=m.id;el.innerHTML=`<div class="nb"><span class="ic">${PHI.msg}</span><div class="nmid"><div class="ntop"><span>メッセージ</span><span>今</span></div><div class="nnm">${esc(m.fromName||pname(m.from))}</div><div class="ntx">${esc(m.subj)}　${esc((m.body||'').replace(/\s+/g,' ').slice(0,70))}</div>${more?`<div class="nmore">ほか${more}件のメッセージ</div>`:''}</div>${av}</div>`;
  requestAnimationFrame(()=>el.classList.add('on'));NB=setTimeout(()=>hideNotif(),4200);
  try{se('mail');if(navigator.vibrate)navigator.vibrate([60,40,60]);}catch(e){}
  const b=$('#phbtn');if(b){b.classList.remove('ping');void b.offsetWidth;b.classList.add('ping');}}
function hideNotif(tapped){const el=$('#nbanner');if(el)el.classList.remove('on');clearTimeout(NB);NB=null;}
/* every new mail becomes a notification (the monthly ones too, once the screen is free) */
sendMail=(o=>function(type,d,quiet){const before=PH().mails[0];const toast0=window.toast;window.toast=()=>{};let r;try{r=o.call(this,type,d,true);}finally{window.toast=toast0;}
  const m=PH().mails[0];if(m&&m!==before)queueNotif(m);return r;})(sendMail);
deliverOut=(o=>function(){const ph=PH(),n0=ph.mails.length;const r=o.apply(this,arguments);const added=ph.mails.slice(0,ph.mails.length-n0);added.reverse().forEach(queueNotif);return r;})(deliverOut);
closeModal=(o=>function(){const r=o.apply(this,arguments);setTimeout(flushNotif,1200);return r;})(closeModal);
render=(o=>function(){const r=o.apply(this,arguments);setTimeout(flushNotif,1500);return r;})(render);

/* chats arrive bubble by bubble */
ACT.phOpen=(o=>function(d){const m=PH().mails.find(x=>x.id===+d.id);UI.phone.anim=m&&!m.read?'open':null;return o.apply(this,arguments);})(ACT.phOpen);
ACT.phReply=(o=>function(){UI.phone.anim='reply';return o.apply(this,arguments);})(ACT.phReply);
drawPhone=(o=>function(){const an=UI.phone&&UI.phone.anim;if(UI.phone)UI.phone.anim=null;const r=o.apply(this,arguments);
  const chat=$('#sheet .pchat');if(!chat||!an)return r;
  const typing=(d,e)=>{const t=document.createElement('div');t.className='typing anim';t.innerHTML='<i></i><i></i><i></i>';t.style.setProperty('--d',d+'s');t.style.setProperty('--e',e+'s');return t;};
  if(an==='open'){const bs=[...chat.querySelectorAll('.bub.l')];let t=.5;chat.insertBefore(typing(.05,.5),bs[0]||null);
    bs.forEach((b,i)=>{b.classList.add('anim');b.style.setProperty('--d',t+'s');t+=Math.min(1.1,.35+b.textContent.length*.012);});}
  if(an==='reply'){const me=chat.querySelector('.bub.r');if(me){me.classList.add('anim');me.style.setProperty('--d','.05s');
    const rd=chat.querySelector('.pread');if(rd){rd.classList.add('anim');rd.style.setProperty('--d','.7s');}
    let n=me.nextElementSibling;while(n&&!n.classList.contains('bub'))n=n.nextElementSibling;
    const rest=[];let x=n;while(x){if(x.classList.contains('bub'))rest.push(x);x=x.nextElementSibling;}
    if(rest.length){chat.insertBefore(typing(.9,1.9),rest[0]);let t=1.9;rest.forEach(b=>{b.classList.add('anim');b.style.setProperty('--d',t+'s');t+=.6;});}}}
  const pb=$('#pbody');if(pb)setTimeout(()=>{pb.scrollTo({top:pb.scrollHeight,behavior:'smooth'});},an==='reply'?2000:400);
  return r;})(drawPhone);
