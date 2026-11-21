/* =========================================================
   有馬記念 公開枠順抽選会: before the Arima, the draw on the stage — horses are drawn one by one onto the
   8-frame board; when your turn comes you pick a capsule yourself, and the number it holds is your gate.
   At Nakayama 2500 an inside gate helps and the outside hurts.
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
.drw{display:grid;gap:10px}
.drw .stage{border-radius:14px;padding:12px;background:radial-gradient(120% 90% at 50% 0%,#3a2a12,#160f08 70%);box-shadow:inset 0 0 0 2px #b8862b;color:#f6e7b0}
.drw .ttl{text-align:center;font:800 clamp(15px,4.2vw,20px) "Shippori Mincho B1",serif;letter-spacing:.12em}.drw .ttl small{display:block;font:600 10px "Zen Kaku Gothic New",sans-serif;color:#d9b45a;letter-spacing:.3em}
.drw .board{display:grid;grid-template-columns:repeat(8,1fr);gap:3px;margin-top:10px;background:#0f3d24;padding:5px;border-radius:6px;box-shadow:0 0 0 2px #d9b45a}
.drw .col{display:grid;grid-template-rows:auto 1fr 1fr;gap:3px}.drw .wk{text-align:center;font:800 12px Oswald,sans-serif;border-radius:2px;padding:1px 0}
.drw .slot{min-height:92px;background:#f7f4ec;border-radius:2px;writing-mode:vertical-rl;display:flex;align-items:center;justify-content:flex-start;padding:4px 0;font:700 10.5px "Zen Kaku Gothic New",sans-serif;color:#141210;position:relative;overflow:hidden}
.drw .slot b{writing-mode:horizontal-tb;font:800 11px Oswald,sans-serif;color:#7a1f2a;margin-bottom:3px}
.drw .slot.new{animation:dnew .7s ease-out}.drw .slot.me{background:#fff3c4;box-shadow:inset 0 0 0 2px #c8231c}
@keyframes dnew{0%{background:#ffd166;transform:scale(1.08)}100%{background:#f7f4ec;transform:none}}
.drw .now{min-height:42px;text-align:center;font-size:13px;color:#f6e7b0}.drw .now b{font-size:16px;color:#fff}
.drw .balls{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:10px;border-radius:14px;background:radial-gradient(circle at 50% 30%,rgba(255,255,255,.18),rgba(255,255,255,.04) 70%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.2)}
.drw .ball{aspect-ratio:1;border-radius:50%;border:0;background:radial-gradient(circle at 35% 30%,#8a8f96,#2b2f35 60%,#121417);box-shadow:0 4px 8px rgba(0,0,0,.5),inset 0 -3px 6px rgba(0,0,0,.5);cursor:pointer}
.drw .ball:active{transform:scale(.92)}
.drw .reveal{text-align:center;padding:10px;border-radius:12px;background:#fff;color:#141210}.drw .reveal .num{display:inline-grid;place-items:center;min-width:64px;height:48px;background:#c8231c;color:#fff;font:800 34px Oswald,sans-serif;border-radius:6px;margin:6px 0}
.drw .reveal p{margin:4px 0;font-size:13px}`;document.head.appendChild(st);})();
function arimaDrawStart(){const RC=UI.race,F=[...RC.field],n=F.length,mine=F.filter(f=>f.mine);if(!mine.length){RC.drawn=1;showArimaPrelude();return;}
  const order=[...F].sort(()=>R()-.5);const myIdx=order.indexOf(mine[0]);if(myIdx<4){order.splice(myIdx,1);order.splice(4+Math.floor(R()*Math.max(1,n-6)),0,mine[0]);}
  UI.drw={order,k:0,shown:{},turn:false,picked:null,done:false,pk:[]};drawRender();drawTick();}
function drawRender(){const RC=UI.race,D=UI.drw,n=RC.field.length,ed=Y(S.t)-1955,cols=Array.from({length:8},(_,i)=>i+1);
  const byNo={};RC.field.forEach(f=>{if(D.shown[f.no])byNo[f.no]=f;});
  const slotsFor=w=>{const L=[];for(let no=1;no<=n;no++)if(wakuOf(no,n)===w)L.push(no);return L;};
  const me=D.turnF||D.lastPick||RC.field.find(f=>f.mine);
  const html=`<div class="from-line">${dstr(S.t)}　都内ホテル　特設会場</div>
   <div class="drw"><div class="stage"><div class="ttl"><small>THE ${ed}th ARIMA KINEN</small>第${ed}回 有馬記念 公開枠順抽選会</div>
    <div class="board">${cols.map(w=>{const sl=slotsFor(w);return `<div class="col"><div class="wk" style="background:${FRAMEC[w-1]};color:${FRAMET[w-1]}">${w}</div>${[0,1].map(j=>{const no=sl[j];if(!no)return '<div class="slot" style="opacity:.25"></div>';const f=byNo[no];return `<div class="slot ${f&&f===D.last?'new':''} ${f&&f.mine?'me':''}">${f?`<b>${no}</b>${esc(f.name)}`:`<b style="color:#bbb">${no}</b>`}</div>`;}).join('')}</div>`;}).join('')}</div>
    <div class="now">${D.done?'すべての枠順が決まりました':D.turn?`<b>${esc(me.name)}</b>の番です。カプセルを一つ選んでください`:D.last?`${esc(D.last.name)}（${esc(D.last.jname)}騎手）は <b>${D.last.no}番</b>`:'抽選を始めます'}</div></div>
    ${D.turn?`<div class="balls">${RC.field.filter(f=>!D.shown[f.no]).map((f,i)=>`<button class="ball" data-act="drawPick" data-i="${i}" aria-label="カプセル"></button>`).join('')}</div>`:''}
    ${D.picked&&!D.turn?`<div class="reveal"><div class="muted" style="font-size:12px">${esc(me.jname)}騎手が引いたカプセルは…</div><div class="num">${me.no}</div><p>${me.no<=4?'内枠！ 中山の2500mでは、ロスなく運べる絶好の枠です。':me.no>=13?'外枠…。中山の2500mでは、外を回らされる苦しい枠です。':'真ん中の枠。悪くはありません。'}</p></div>`:''}
   </div>
   <div class="row"><span class="sp"></span>${D.done?'<button class="btn pri" data-act="drawEnd">そして、有馬記念の当日へ</button>':D.turn?'':'<button class="btn" data-act="drawSkip">抽選を早送りする</button>'}</div>`;
  openModal(html,{wide:true,lock:true,keepScroll:true});}
function drawTick(){const D=UI.drw;if(!D||D.done||D.turn)return;clearTimeout(D.tm);D.tm=setTimeout(()=>{if(UI.drw!==D||!document.querySelector('.drw'))return;const f=D.order[D.k];if(!f){D.done=true;drawRender();return;}
  if(f.mine&&!D.pk.includes(f)){D.turn=true;D.turnF=f;drawRender();return;}D.shown[f.no]=1;D.last=f;D.k++;if(D.k>=D.order.length)D.done=true;drawRender();drawTick();},D.fast?120:900);}
ACT.drawSkip=()=>{const D=UI.drw;if(D){D.fast=true;}};
ACT.drawPick=d=>{const RC=UI.race,D=UI.drw;if(!D||!D.turnF)return;const me=D.turnF,free=RC.field.filter(f=>!D.shown[f.no]),pickF=free[+d.i];if(!pickF)return;
  // the capsule decides the gate: swap numbers with the horse that held it
  if(pickF!==me){const a=me.no;me.no=pickF.no;pickF.no=a;}
  D.shown[me.no]=1;D.last=me;D.picked=true;D.turn=false;D.pk.push(me);D.lastPick=me;D.turnF=null;D.k++;if(D.k>=D.order.length)D.done=true;try{se('up');}catch(e){}drawRender();setTimeout(()=>drawTick(),1400);};
ACT.drawEnd=()=>{const RC=UI.race;RC.drawn=1;
  // Nakayama 2500: an inside draw is worth something, the outside costs
  RC.field.forEach(f=>{f.exp+=f.no<=4?.5:f.no>=13?-.5:0;});RC.field.sort((a,b)=>a.no-b.no);RC.field.filter(f=>f.mine).forEach(me=>log(`有馬記念の枠順抽選会。${me.name}は${wakuOf(me.no,RC.field.length)}枠${me.no}番`));
  UI.drw=null;showArimaPrelude();};
showArimaPrelude=(o=>function(){const RC=UI.race;if(RC&&RC.race&&RC.race.key==='有馬記念'&&!RC.drawn&&!RC.order){arimaDrawStart();return;}return o.apply(this,arguments);})(showArimaPrelude);
