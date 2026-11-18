/* =========================================================
   スマホ画面: a real-looking phone (bezel, status bar, chat
   bubbles, tab bar, home indicator) for mails and calls
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
#modal.phonemode{align-items:center;padding:calc(10px + env(safe-area-inset-top,0px)) 10px calc(10px + env(safe-area-inset-bottom,0px));background:rgba(4,8,6,.72);backdrop-filter:blur(3px)}
#modal.phonemode #sheet{all:unset;box-sizing:border-box;display:block;width:min(100%,384px);height:min(100%,780px);background:#0b0b0c;border-radius:48px;padding:11px;box-shadow:0 0 0 2px #3a3c40,0 0 0 4px #17181a,0 30px 80px rgba(0,0,0,.6);position:relative;animation:phup .28s cubic-bezier(.2,.8,.2,1)}
@keyframes phup{from{transform:translateY(40px) scale(.96);opacity:0}}
.pscr{position:relative;height:100%;border-radius:38px;overflow:hidden;background:#f2f2f7;color:#111;display:flex;flex-direction:column;font-family:-apple-system,"Hiragino Sans","Zen Kaku Gothic New",sans-serif}
.pscr.dark{background:#000;color:#fff}
.psb{flex:none;height:46px;display:flex;align-items:center;justify-content:space-between;padding:6px 26px 0 30px;font-weight:600;font-size:15px;position:relative;z-index:3}
.psb .isl{position:absolute;left:50%;top:9px;width:104px;height:30px;margin-left:-52px;background:#000;border-radius:16px}
.psb .ic{display:flex;gap:5px;align-items:center}
.pnav{flex:none;display:flex;align-items:center;gap:6px;padding:4px 12px 8px;min-height:40px;border-bottom:.5px solid rgba(0,0,0,.12);background:rgba(248,248,250,.94)}
.pnav .back{border:0;background:none;color:#0a7cff;font-size:16px;display:flex;align-items:center;gap:2px;padding:6px 4px;min-height:40px}
.pnav .who{flex:1;display:flex;flex-direction:column;align-items:center;font-size:12px;gap:2px;margin-right:56px}
.pnav .who .av{box-shadow:none}
.pbig{flex:none;padding:2px 18px 8px}
.pbig h3{font-family:inherit;font-size:30px;font-weight:800;letter-spacing:0;margin:0}
.psearch{margin-top:8px;background:rgba(118,118,128,.12);border-radius:10px;padding:8px 10px;color:#8a8a8e;font-size:15px}
.pbody{flex:1;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
.plist{background:#fff}
.prow{display:flex;gap:11px;align-items:center;width:100%;border:0;background:#fff;text-align:left;padding:10px 14px 10px 8px;position:relative;color:#111;min-height:68px}
.prow .dot{flex:none;width:9px;height:9px;border-radius:50%;background:transparent}
.prow.unread .dot{background:#0a7cff}
.prow .m{flex:1;min-width:0;border-bottom:.5px solid rgba(60,60,67,.2);padding-bottom:10px;margin-bottom:-10px}
.prow .t1{display:flex;align-items:baseline;gap:6px}
.prow .t1 b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:16px}
.prow .tm{color:#8a8a8e;font-size:13px;flex:none}
.prow .s{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:#6b6b70;font-size:14px;line-height:1.35}
.prow .tag{display:inline-block;font-size:11px;color:#fff;background:#ff9500;border-radius:5px;padding:0 5px;margin-right:4px;vertical-align:1px}
.pempty{padding:40px 20px;text-align:center;color:#8a8a8e}
.pchat{padding:12px 12px 16px;display:flex;flex-direction:column;gap:6px}
.pday{align-self:center;font-size:11px;color:#8a8a8e;margin:4px 0 6px}
.pday b{color:#3a3a3c}
.bub{max-width:78%;padding:9px 13px;border-radius:19px;font-size:15px;line-height:1.5;white-space:pre-wrap;word-break:break-word}
.bub.l{align-self:flex-start;background:#e5e5ea;color:#111;border-bottom-left-radius:6px}
.bub.r{align-self:flex-end;background:#0a7cff;color:#fff;border-bottom-right-radius:6px}
.bub.subj{font-weight:700}
.bub.msg{max-width:86%}
.bub .msubj2{display:block;font-weight:700;margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid rgba(0,0,0,.08)}
.bub.img{padding:4px;background:linear-gradient(180deg,#bfe0f3,#9fd08e)}
.psys{align-self:center;font-size:12px;color:#8a8a8e;background:rgba(0,0,0,.05);border-radius:10px;padding:3px 10px;margin-top:4px}
.pread{align-self:flex-end;font-size:11px;color:#8a8a8e;margin-top:-2px}
.preply{flex:none;background:rgba(248,248,250,.97);border-top:.5px solid rgba(0,0,0,.12);padding:8px 10px 6px;display:grid;gap:6px}
.preply .lab{font-size:11px;color:#8a8a8e;text-align:center}
.preply button{border:1px solid #0a7cff;background:#fff;color:#0a7cff;border-radius:18px;padding:8px 14px;font-size:14px;text-align:left;min-height:40px}
.preply button:first-of-type{background:#0a7cff;color:#fff}
.pinput{flex:none;display:flex;align-items:center;gap:8px;padding:6px 10px 4px;background:rgba(248,248,250,.97)}
.pinput span{flex:1;border:1px solid #c7c7cc;border-radius:18px;padding:7px 12px;color:#b0b0b5;font-size:14px}
.ptab{flex:none;display:grid;grid-template-columns:1fr 1fr;background:rgba(248,248,250,.97);border-top:.5px solid rgba(0,0,0,.15);padding-top:4px}
.ptab button{border:0;background:none;color:#8a8a8e;display:flex;flex-direction:column;align-items:center;gap:1px;font-size:10px;position:relative;min-height:44px}
.ptab button.on{color:#0a7cff}
.ptab .bd{position:absolute;top:0;left:calc(50% + 6px);background:#ff3b30;color:#fff;border-radius:9px;font-size:11px;min-width:18px;height:18px;line-height:18px;padding:0 5px}
.phome{flex:none;height:26px;display:flex;align-items:center;justify-content:center;border:0;background:transparent;width:100%;padding:0}
.phome i{display:block;width:134px;height:5px;border-radius:3px;background:#111}
.pscr.dark .phome i{background:#fff}
.pclose{position:absolute;right:12px;top:52px;z-index:4;border:0;background:rgba(118,118,128,.16);color:#3a3a3c;border-radius:14px;padding:4px 10px;font-size:12px;min-height:28px}
.hrow{display:flex;align-items:center;gap:11px;padding:10px 16px;background:#fff;border-bottom:.5px solid rgba(60,60,67,.2)}
.hrow b{flex:1;font-size:16px}.hrow.miss b{color:#ff3b30}
.hrow .tm{color:#8a8a8e;font-size:13px}
/* incoming / in-call screen */
.call-ov.phonecall{background:rgba(4,8,6,.72);backdrop-filter:blur(3px)}
.call-ov.phonecall .pdev{width:min(100%,384px);height:min(100%,780px);background:#0b0b0c;border-radius:48px;padding:11px;box-shadow:0 0 0 2px #3a3c40,0 0 0 4px #17181a,0 30px 80px rgba(0,0,0,.6)}
.cscr{height:100%;border-radius:38px;overflow:hidden;display:flex;flex-direction:column;color:#fff;background:radial-gradient(120% 70% at 50% 0%,#3d5a4e 0%,#1a2622 55%,#0b0f0d 100%)}
.cscr .cmid{flex:1;display:flex;flex-direction:column;align-items:center;padding:28px 18px 0;gap:6px;min-height:0}
.cscr .cnm{font-size:30px;font-weight:600;text-align:center;letter-spacing:.02em}
.cscr .csub{font-size:15px;opacity:.75}
.cscr .cav{margin-top:18px}
.cscr .cbot{flex:none;display:flex;justify-content:space-around;padding:0 36px 26px}
.cscr .cb{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:13px;border:0;background:none;color:#fff}
.cscr .cb i{width:74px;height:74px;border-radius:50%;display:grid;place-items:center}
.cscr .cb.yes i{background:#34c759}.cscr .cb.no i{background:#ff3b30}
.cscr .cb.no svg{transform:rotate(135deg)}
.cscr.ringing .cb.yes i{animation:cring 1.1s ease-in-out infinite}
@keyframes cring{0%,100%{transform:rotate(0)}10%{transform:rotate(-14deg)}20%{transform:rotate(14deg)}30%{transform:rotate(-10deg)}40%{transform:rotate(0)}}
.cscr .clog{flex:1;width:100%;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding:12px 2px;min-height:0}
.cscr .clog .line{font-size:15px;line-height:1.55;padding:9px 13px;border-radius:18px;max-width:86%;border:0}
.cscr .clog .line.them{align-self:flex-start;background:rgba(255,255,255,.14);color:#fff}
.cscr .clog .line.me{align-self:flex-end;background:#34c759;color:#fff;font-size:14px;text-align:left}
.cscr .clog .line.me::before{content:none}
.cscr .cch{flex:none;display:grid;gap:6px;padding:0 16px 10px;width:100%;box-sizing:border-box}
.cscr .cch button{border:0;background:rgba(255,255,255,.16);color:#fff;border-radius:16px;padding:10px 14px;font-size:14px;text-align:left;min-height:44px}
.cscr .cch button:first-child{background:rgba(52,199,89,.85)}
.cscr .cch button:disabled{opacity:.4}
.cscr .ctools{display:grid;grid-template-columns:repeat(3,1fr);gap:10px 18px;margin:8px 0 4px;opacity:.85}
.cscr .ctools span{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px}
.cscr .ctools span i{width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.14);display:grid;place-items:center}
`;document.head.appendChild(st);})();

const PHI={
  sig:'<svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor"/></svg>',
  wifi:'<svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 5.6 8.9a3.4 3.4 0 0 1 4.8 0z M3.5 6.8a6.4 6.4 0 0 1 9 0l-1.4 1.4a4.4 4.4 0 0 0-6.2 0z M1.3 4.6a9.6 9.6 0 0 1 13.4 0l-1.4 1.4a7.6 7.6 0 0 0-10.6 0z" fill="currentColor"/></svg>',
  bat:'<svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".45"/><rect x="2.5" y="2.5" width="15" height="8" rx="2" fill="currentColor"/><rect x="24" y="4.5" width="2" height="4" rx="1" fill="currentColor" opacity=".45"/></svg>',
  msg:'<svg width="24" height="22" viewBox="0 0 24 22"><path d="M12 2C6.5 2 2 5.7 2 10.2c0 2.6 1.5 4.9 3.8 6.4L5 20.5l4.3-2.4c.9.2 1.8.3 2.7.3 5.5 0 10-3.7 10-8.2S17.5 2 12 2z" fill="currentColor"/></svg>',
  tel:'<svg width="24" height="24" viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" fill="currentColor"/></svg>',
  chev:'<svg width="12" height="20" viewBox="0 0 12 20"><path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
function phClock(){const t=S?S.t:0;const h=19+Math.floor(hash('c'+t)*4),m=Math.floor(hash('m'+t)*60);return `${h}:${String(m).padStart(2,'0')}`;}
function phDay(m){return `${M(m.t)}月${1+Math.floor(hash('d'+m.id)*27)}日`;}
function phStatus(dark){return `<div class="psb"><span>${phClock()}</span><span class="isl"></span><span class="ic">${PHI.sig}${PHI.wifi}${PHI.bat}</span></div>`;}
function phAv(m,s){return m.from&&P(m.from)?avatar(m.from,s):`<span class="av unk" style="width:${s}px;height:${s}px;font-size:${s*.42}px">${m.from==='bank'?'銀':m.from==='press'?'誌':m.from==='fan'?'♥':'？'}</span>`;}
function phPreview(m){return (m.body||'').replace(/\s+/g,' ').slice(0,60);}

function drawPhone(){
  const ph=PH(),u=UI.phone;u.tab=u.tab||'msg';
  const unread=ph.mails.filter(m=>!m.read).length;
  let inner;
  if(u.mail){const m=u.mail;m.read=true;const reps=!m.answered&&m.rLabels?mailReplies(m):null;
    const paras=(m.body||'').split(/\n{2,}/).filter(Boolean);
    const name=esc(m.fromName||pname(m.from));
    inner=`<div class="pnav"><button class="back" data-act="phBack">${PHI.chev}<span>${unread||''}</span></button><div class="who">${phAv(m,30)}<span>${name}</span></div></div>
      <div class="pbody" id="pbody"><div class="pchat">
        <div class="pday"><b>${phDay(m)}</b>　${phClock()}</div>
        ${m.hid&&HZ(m.hid)&&m.type==='photo'?`<div class="bub l img">${horseSVG(HZ(m.hid),150)}</div>`:''}
        <div class="bub l msg">${m.subj?`<b class="msubj2">${esc(m.subj)}</b>`:''}${esc(paras.join('\n\n'))}</div>
        ${m.reply?`<div class="bub r">${esc(m.reply)}</div><div class="pread">既読</div>${m.react?`<div class="bub l">${esc(m.react)}</div>`:''}`:''}
        ${m.missed?'<div class="psys">返信期限を過ぎました</div>':''}
      </div></div>
      ${reps?`<div class="preply"><div class="lab">返信を選ぶ</div>${reps.map((r,i)=>`<button data-act="phReply" data-i="${i}">${esc(r[0].replace(/[「」]/g,''))}</button>`).join('')}</div>`
        :`<div class="pinput"><span>メッセージ</span></div>`}`;}
  else if(u.tab==='call'){
    inner=`<div class="pbig"><h3>履歴</h3></div><div class="pbody">${ph.hist.length?ph.hist.slice(0,30).map(h=>`<div class="hrow ${h.missed?'miss':''}"><span style="color:${h.missed?'#ff3b30':'#8a8a8e'}">${PHI.tel}</span><b>${esc(h.name)}</b><span class="tm">${M(h.t)}月${h.missed?'・不在':''}</span></div>`).join(''):'<div class="pempty">着信履歴はありません</div>'}</div>`;}
  else{
    inner=`<div class="pbig"><h3>メッセージ</h3><div class="psearch">検索</div></div>
      <div class="pbody"><div class="plist">${ph.mails.map(m=>`<button class="prow ${m.read?'':'unread'}" data-act="phOpen" data-id="${m.id}"><span class="dot"></span>${phAv(m,46)}<span class="m"><span class="t1"><b>${esc(m.fromName||pname(m.from))}</b><span class="tm">${phDay(m)}</span></span><span class="s">${m.rLabels&&!m.answered?`<span class="tag">${m.dl!=null?'今月中に返信':'返信できる'}</span>`:''}${esc(m.subj)}　${esc(phPreview(m))}</span></span></button>`).join('')||'<div class="pempty">メッセージはありません</div>'}</div></div>`;}
  const tabs=u.mail?'':`<div class="ptab"><button class="${u.tab==='msg'?'on':''}" data-act="phTab" data-t="msg">${PHI.msg}メッセージ${unread?`<span class="bd">${unread}</span>`:''}</button><button class="${u.tab==='call'?'on':''}" data-act="phTab" data-t="call">${PHI.tel}履歴</button></div>`;
  openModal(`<div class="pscr">${phStatus()}<button class="pclose" data-act="phClose">閉じる</button>${inner}${tabs}<button class="phome" data-act="phClose" aria-label="スマホを閉じる"><i></i></button></div>`);
  $('#modal').classList.add('phonemode');
  if(u.mail){const b=$('#pbody');if(b)b.scrollTop=b.scrollHeight;}
  if(u.mail)$('.pclose').hidden=true;
  updatePhoneBadge();save();
}
ACT.phTab=d=>{UI.phone.tab=d.t;UI.phone.mail=null;drawPhone();};
ACT.phBack=()=>{const t=UI.phone.tab;UI.phone.mail=null;UI.phone.tab=t;drawPhone();};
closeModal=(o=>function(){$('#modal').classList.remove('phonemode');if(UI.phone)UI.phone=null;return o.apply(this,arguments);})(closeModal);

function drawCall(){
  let el=$('#call-ov');if(!el){el=document.createElement('div');el.id='call-ov';el.className='call-ov phonecall';document.body.appendChild(el);}
  el.classList.add('phonecall');
  if(!CALL){el.hidden=true;el.innerHTML='';return;}
  el.hidden=false;const c=CALLS[CALL.type],d=CALL.d;
  const av=s=>d.who&&P(d.who)?avatar(d.who,s):`<span class="av unk" style="width:${s}px;height:${s}px;font-size:${s*.42}px">？</span>`;
  const role=d.who&&P(d.who)?esc(P(d.who).role):'携帯電話';
  const sb=`<div class="psb" style="color:#fff"><span>${d.night?'2:14':phClock()}</span><span class="isl"></span><span class="ic">${PHI.sig}${PHI.wifi}${PHI.bat}</span></div>`;
  if(CALL.stage==='ring'){
    el.innerHTML=`<div class="pdev"><div class="cscr ringing">${sb}<div class="cmid"><div class="csub">${role}</div><div class="cnm">${esc(callName(d))}</div><div class="csub">着信中…</div><div class="cav">${av(120)}</div></div>
      <div class="cbot"><button class="cb no" data-act="callNo"><i>${PHI.tel}</i>拒否</button><button class="cb yes" data-act="callYes"><i>${PHI.tel}</i>応答</button></div><div style="height:20px"></div></div></div>`;return;}
  const ch=c.ch.map((x,i)=>{const sm=x[2]&&x[2].summon;const dis=sm&&(S.month.met||S.restPenalty>0);return `<button data-act="callCh" data-i="${i}" ${dis?"disabled":""}>${esc(x[0].replace(/[「」]/g,""))}${sm?'（今月の「人に会う」を使う）':''}</button>`;}).join('');
  el.innerHTML=`<div class="pdev"><div class="cscr">${sb}<div class="cmid" style="padding-top:8px"><div style="display:flex;align-items:center;gap:10px">${av(40)}<div><div style="font-size:18px;font-weight:600">${esc(callName(d))}</div><div class="csub" style="font-size:13px"><span id="calltm">0:00</span></div></div></div>
      <div class="call-log clog">${CALL.log.join('')}</div></div>
      ${CALL.stage==='talk'?`<div class="cch">${ch}</div>`:`<div class="cbot" style="padding-top:8px"><button class="cb no" data-act="callEnd"><i>${PHI.tel}</i>終了</button></div>`}<div style="height:16px"></div></div></div>`;
  const lg=el.querySelector('.call-log');if(lg)lg.scrollTop=lg.scrollHeight;
}
