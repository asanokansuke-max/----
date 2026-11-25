/* =========================================================
   テンポを詰める:
   ・月末の報告 — レース結果（もう結果画面で見た）と帰厩だけの月は画面を出さず、賞金と収支を一行で表示して次の月へ（成長の一言も添える）。ケガやそのほかの知らせがある月だけ報告画面を出す
   ・出来事を選んだあとの短い返事（一行）— 別画面にせず画面下に表示して、そのまま次の出来事へ
   ・「蹄鉄」の小話は一度きり、「牧場から」の近況は半年に一度まで
   ========================================================= */
function toastLong(s,ms){toast(s);clearTimeout(toast.t);toast.t=setTimeout(()=>{const el=$('#toast');if(el)el.hidden=true;},ms||3400);}
showReport=(o=>function(rep){try{const L=rep&&(rep.lines||[]),other=L?L.filter(l=>!/着／\d+頭/.test(l)&&!/厩舎に戻ってきた/.test(l)):[];
  if(rep&&!other.length&&!(rep.inj||[]).length&&!S.over){
  const net=rep.prize+rep.income-rep.cost,back=L.filter(l=>/厩舎に戻ってきた/.test(l));toastLong(`${dstr(rep.t)}　${rep.prize?'賞金 '+yen(rep.prize)+'・':L.length?'':'レースなし・'}収支 ${net>=0?'+':'−'}${yen(Math.abs(net))}${back.length?'　'+back.join('、'):''}${(rep.grow||[]).length?'　'+rep.grow[0]:''}`,3200);try{se('turn');}catch(e){}
  setTimeout(()=>{try{ACT.repOk();}catch(e){console.error(e);}},0);return;}}catch(e){}return o.apply(this,arguments);})(showReport);
ACT.evc=(o=>function(d){const om=openModal;let caught=null;
  openModal=function(html){const m=/^<div class="letter">([\s\S]*?)<\/div><div class="row"><span class="sp"><\/span><button class="btn pri" data-act="evnext">/.exec(html||'');
    if(m&&caught==null){const t=document.createElement('div');t.innerHTML=m[1];const txt=t.textContent||'';if(false&&txt.length<=60&&!/\n/.test(txt)){caught=txt;return;}/* (no longer: the result now shows in the same window as the choice) */}return om.apply(this,arguments);};
  try{return o.apply(this,arguments);}finally{openModal=om;if(caught!=null){toastLong(caught);openNextEvent();}}})(ACT.evc);
if(EV.horseshoe){const h=EV.horseshoe;EV.horseshoe={...h,r:d=>S.flags.shoeDone?null:h.r(d),f:(d,i)=>{S.flags.shoeDone=1;return h.f(d,i);}};}
if(EV.farmNews){const h=EV.farmNews;EV.farmNews={...h,r:d=>S.flags.fnT!=null&&S.t-S.flags.fnT<6?null:h.r(d),f:(d,i)=>{S.flags.fnT=S.t;return h.f(d,i);}};}
/* how often the routine letters may come: 厩舎だより every 4 months at most, a stable's flu once a year */
const capEv=(k,gap,key)=>{if(!EV[k])return;const h=EV[k];EV[k]={...h,r:d=>S.flags[key]!=null&&S.t-S.flags[key]<gap?null:h.r(d),f:(d,i)=>{S.flags[key]=S.t;return h.f(d,i);}};};
capEv('stableNews',4,'snT');capEv('flu',12,'fluT');
