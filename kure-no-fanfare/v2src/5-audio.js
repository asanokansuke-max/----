/* =========================================================
   audio: original generative BGM + UI sound effects (all synthesized, no files)
   ========================================================= */
const AUD={bgm:true,se:true,vol:.8,ac:null,mus:null,fx:null,rev:null,cur:null,base:'title',over:null,timer:null};
try{const a=JSON.parse(localStorage.getItem('kure-aud')||'{}');Object.assign(AUD,{bgm:a.bgm!==false,se:a.se!==false,vol:a.vol??.8});}catch(e){}
SND.on=AUD.se;
function audSave(){try{localStorage.setItem('kure-aud',JSON.stringify({bgm:AUD.bgm,se:AUD.se,vol:AUD.vol}));}catch(e){}}
function ensureAC(){
  try{if(!SND.ac)SND.ac=new (window.AudioContext||window.webkitAudioContext)();if(SND.ac.state==='suspended')SND.ac.resume();}catch(e){return null;}
  const ac=SND.ac;AUD.ac=ac;
  if(!AUD.mus){
    AUD.rev=ac.createConvolver();const ir=ac.createBuffer(2,ac.sampleRate*2.4,ac.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3)*.6;}AUD.rev.buffer=ir;
    const rg=ac.createGain();rg.gain.value=.28;AUD.rev.connect(rg);rg.connect(ac.destination);
    AUD.mus=ac.createGain();AUD.mus.gain.value=AUD.bgm?.22*AUD.vol:0;AUD.mus.connect(ac.destination);AUD.mus.connect(AUD.rev);
    AUD.fx=ac.createGain();AUD.fx.gain.value=AUD.se?.5*AUD.vol:0;AUD.fx.connect(ac.destination);
  }
  return ac;
}
const fq=m=>440*Math.pow(2,(m-69)/12);
function env(g,t,a,peak,dec,sus,end){g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.setTargetAtTime(sus,t+a,dec);g.gain.setValueAtTime(sus,Math.max(t+a+.01,end));g.gain.linearRampToValueAtTime(0,end+.25);}
/* ---- instruments (dest = bus) ---- */
const INST={
  keys(ac,d,t,m,len,v){const g=ac.createGain();env(g,t,.006,.32*v,.35,.06*v,t+len);[[1,'sine',1],[2,'triangle',.22],[3,'sine',.06]].forEach(([h,ty,a])=>{const o=ac.createOscillator();o.type=ty;o.frequency.value=fq(m)*h;const og=ac.createGain();og.gain.value=a;o.connect(og);og.connect(g);o.start(t);o.stop(t+len+.4);});g.connect(d);},
  pad(ac,d,t,ms,len,v){const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=900;const g=ac.createGain();env(g,t,Math.min(.9,len*.3),.05*v,1,.045*v,t+len-.2);lp.connect(g);g.connect(d);ms.forEach(m=>[-7,7].forEach(dt=>{const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=fq(m);o.detune.value=dt;o.connect(lp);o.start(t);o.stop(t+len+.4);}));},
  str(ac,d,t,ms,len,v){const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(600,t);lp.frequency.linearRampToValueAtTime(1800,t+len*.7);const g=ac.createGain();env(g,t,len*.45,.08*v,1,.08*v,t+len-.1);lp.connect(g);g.connect(d);ms.forEach(m=>{const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=fq(m);const lf=ac.createOscillator();lf.frequency.value=5;const lg=ac.createGain();lg.gain.value=5;lf.connect(lg);lg.connect(o.detune);o.connect(lp);o.start(t);o.stop(t+len+.4);lf.start(t);lf.stop(t+len+.4);});},
  bass(ac,d,t,m,len,v){const g=ac.createGain();env(g,t,.01,.26*v,.4,.13*v,t+len*.9);const o=ac.createOscillator();o.type='triangle';o.frequency.value=fq(m);o.connect(g);g.connect(d);o.start(t);o.stop(t+len+.3);},
  pluck(ac,d,t,m,len,v){const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(3200,t);lp.frequency.exponentialRampToValueAtTime(500,t+.4);const g=ac.createGain();g.gain.setValueAtTime(.22*v,t);g.gain.exponentialRampToValueAtTime(.001,t+Math.max(.5,len));const o=ac.createOscillator();o.type='triangle';o.frequency.value=fq(m);const o2=ac.createOscillator();o2.type='sawtooth';o2.frequency.value=fq(m);const g2=ac.createGain();g2.gain.value=.25;o.connect(lp);o2.connect(g2);g2.connect(lp);lp.connect(g);g.connect(d);o.start(t);o2.start(t);o.stop(t+len+.6);o2.stop(t+len+.6);},
  mbox(ac,d,t,m,len,v){[[1,.18],[3,.04],[4.2,.02]].forEach(([h,a])=>{const o=ac.createOscillator();o.type='sine';o.frequency.value=fq(m)*h;const g=ac.createGain();g.gain.setValueAtTime(a*v,t);g.gain.exponentialRampToValueAtTime(.0005,t+1.6/h+.3);o.connect(g);g.connect(d);o.start(t);o.stop(t+2);});},
  pizz(ac,d,t,m,len,v){const g=ac.createGain();g.gain.setValueAtTime(.28*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.22);const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1800;const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=fq(m);o.connect(lp);lp.connect(g);g.connect(d);o.start(t);o.stop(t+.3);},
  kick(ac,d,t,v){const o=ac.createOscillator();o.frequency.setValueAtTime(120,t);o.frequency.exponentialRampToValueAtTime(42,t+.18);const g=ac.createGain();g.gain.setValueAtTime(.55*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g);g.connect(d);o.start(t);o.stop(t+.32);},
  hat(ac,d,t,v){const b=ac.createBuffer(1,ac.sampleRate*.05,ac.sampleRate),x=b.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=(Math.random()*2-1)*(1-i/x.length);const s=ac.createBufferSource();s.buffer=b;const hp=ac.createBiquadFilter();hp.type='highpass';hp.frequency.value=7000;const g=ac.createGain();g.gain.value=.12*v;s.connect(hp);hp.connect(g);g.connect(d);s.start(t);},
};
/* ---- themes (original compositions) ----
   ch: one chord per bar (midi). mel: [midi|null, beats]. parts: which accompaniment to play */
const C=(...m)=>m;
const THEMES={
  title:{bpm:72,ch:[C(50,57,62,66),C(49,57,61,64),C(47,54,59,62),C(43,55,59,62),C(40,55,59,64),C(45,57,61,64),C(50,57,62,66),C(50,57,62,69)],
    mel:[[69,2],[66,1],[69,1],[76,2],[74,1],[73,1],[74,3],[71,1],[69,2],[67,1],[66,1],[67,2],[71,1],[76,1],[74,1],[73,1],[71,1],[69,1],[78,2],[76,1],[74,1],[74,4]],
    parts:{pad:1,bass:'root',arp:'pluck',melI:'keys'}},
  ending:{bpm:66,ch:[C(50,57,62,66),C(49,57,61,64),C(47,54,59,62),C(43,55,59,62),C(40,55,59,64),C(45,57,61,64),C(50,57,62,66),C(50,57,62,69)],
    mel:[[69,2],[66,1],[69,1],[76,2],[74,1],[73,1],[74,3],[71,1],[69,2],[67,1],[66,1],[67,2],[71,1],[76,1],[74,1],[73,1],[71,1],[69,1],[78,2],[76,1],[74,1],[74,4]],
    parts:{str:1,bass:'root',arp:'pluck',melI:'keys',mel8:1}},
  home:{bpm:84,ch:[C(53,57,60,64),C(57,60,64,67),C(46,57,62,65),C(48,55,60,64),C(53,57,60,64),C(50,57,60,65),C(46,55,62,65),C(48,55,58,64)],
    mel:[[72,1.5],[69,.5],[72,1],[74,1],[76,2],[72,2],[74,1.5],[72,.5],[70,1],[69,1],[67,4],[69,1.5],[72,.5],[77,1],[76,1],[74,2],[72,2],[70,1],[69,1],[67,1],[70,1],[72,4]],
    parts:{keys:'broken',bass:'root',melI:'keys',hat:'soft'}},
  winter:{bpm:70,ch:[C(53,57,60,64),C(57,60,64,67),C(46,57,62,65),C(48,55,60,64),C(53,57,60,64),C(50,57,60,65),C(46,55,62,65),C(48,55,58,64)],
    mel:[[72,1.5],[69,.5],[72,1],[74,1],[76,2],[72,2],[74,1.5],[72,.5],[70,1],[69,1],[67,4],[69,1.5],[72,.5],[77,1],[76,1],[74,2],[72,2],[70,1],[69,1],[67,1],[70,1],[72,4]],
    parts:{pad:1,bass:'root',melI:'mbox',arp:'mbox'}},
  talk:{bpm:76,ch:[C(43,55,59,62),C(40,55,59,64),C(48,55,60,64),C(50,57,62,66)],mel:null,parts:{pad:1,arp:'pluck',bass:'root'}},
  touch:{bpm:64,ch:[C(48,55,60,64),C(45,57,60,64),C(41,57,60,65),C(43,55,59,62)],
    mel:[[76,1],[79,1],[84,2],[81,1],[79,1],[76,2],[77,1],[76,1],[74,1],[72,1],[74,4]],parts:{pad:1,melI:'mbox',bass:'root'}},
  sale:{bpm:118,ch:[C(45,57,60,64),C(41,57,60,65),C(50,57,62,65),C(40,56,59,64)],mel:null,parts:{pizz:1,bass:'pulse',drums:1,str:1}},
  paddock:{bpm:92,ch:[C(50,57,62,65),C(46,58,62,65),C(48,55,60,64),C(45,57,61,64)],mel:null,parts:{str:1,bass:'pulse',hat:'soft',timp:1}},
  story:{bpm:62,ch:[C(51,58,63,67),C(48,58,63,67),C(44,56,60,63),C(46,58,62,65)],
    mel:[[75,2],[74,1],[72,1],[70,3],[67,1],[68,2],[72,1],[75,1],[74,4]],parts:{pad:1,melI:'keys',bass:'root'}},
};
/* generated melodies for themes without one (fixed seed so the loop repeats) */
Object.entries(THEMES).forEach(([k,th])=>{if(th.mel)return;let seed=hash(k)*1e6;const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280;};
  th.mel=[];th.ch.forEach(ch=>{const tones=ch.slice(1).map(m=>m+12);const rh=[[1,1,2],[1.5,.5,2],[2,1,1],[1,1,1,1]][Math.floor(rnd()*4)];rh.forEach(b=>th.mel.push([rnd()<.12?null:tones[Math.floor(rnd()*tones.length)],b]));});
  th.parts.melI=th.parts.melI||(k==='sale'?'pizz':'pluck');});
function sceneNow(){return AUD.over||AUD.base;}
function bgmBase(s){AUD.base=s;bgmApply();}
function bgmOver(s){AUD.over=s;bgmApply();}
function bgmApply(){
  const want=sceneNow();if(!AUD.ac||!AUD.mus)return;
  if(AUD.cur&&AUD.cur.name===want)return;
  if(AUD.cur){const old=AUD.cur;clearInterval(old.timer);const t=AUD.ac.currentTime;old.bus.gain.setTargetAtTime(0,t,.5);setTimeout(()=>{try{old.bus.disconnect();}catch(e){}},3000);AUD.cur=null;}
  if(!want||want==='none'||!THEMES[want])return;
  startTheme(want);
}
function startTheme(name){
  const ac=AUD.ac,th=THEMES[name];const bus=ac.createGain();bus.gain.value=0;bus.gain.setTargetAtTime(1,ac.currentTime,.6);bus.connect(AUD.mus);
  const st={name,bus,beat:60/th.bpm,step:0,t:ac.currentTime+.15,mi:0,mt:0};
  st.timer=setInterval(()=>themeTick(ac,th,st,bus,ac.currentTime+.25),60);
  AUD.cur=st;
}
function themeTick(ac,th,st,bus,until){
    const name=st.name,totalBeats=th.ch.length*4,melLen=th.mel.reduce((a,x)=>a+x[1],0);
    const p=th.parts;
    while(st.t<until){
      const s8=st.step%8,bar=Math.floor(st.step/8)%th.ch.length,ch=th.ch[bar],t=st.t,b=st.beat,beatPos=(st.step/2)%totalBeats;
      if(s8===0){
        if(p.pad)INST.pad(ac,bus,t,ch.slice(1),b*4,1);
        if(p.str)INST.str(ac,bus,t,ch.slice(1).map(m=>m+(name==='paddock'?0:12)),b*4,name==='ending'?1.2:1);
        if(p.bass==='root')INST.bass(ac,bus,t,ch[0]-12,b*3.6,1);
        if(p.timp&&bar%2===1)INST.kick(ac,bus,t+b*3,.6);
      }
      if(p.bass==='pulse'&&s8%2===0)INST.bass(ac,bus,t,ch[0]-12,b*.9,.8);
      if(p.keys==='broken'&&s8%2===0)INST.keys(ac,bus,t,ch[1+(s8/2)%(ch.length-1)],b*1.6,.45);
      if(p.arp&&s8%1===0&&(p.arp!=='mbox'||s8%2===0)){const tones=ch.slice(1);const m=tones[s8%tones.length]+(p.arp==='mbox'?24:12);INST[p.arp](ac,bus,t,m,b*.9,p.arp==='mbox'?.5:.35);}
      if(p.pizz&&[0,2,3,5,6].includes(s8))INST.pizz(ac,bus,t,ch[1+(s8%3)]+12,b*.4,.7);
      if(p.drums){if(s8===0||s8===4)INST.kick(ac,bus,t,.7);if(s8%2===1)INST.hat(ac,bus,t,.8);}
      if(p.hat==='soft'&&(s8===2||s8===6))INST.hat(ac,bus,t,.5);
      // melody (independent clock in beats)
      while(st.mt<beatPos+.499&&!(st.mt===0&&beatPos>0&&st.mi>0)){
        const [m,len]=th.mel[st.mi%th.mel.length];
        const off=(st.mt-beatPos)*b;
        if(m!=null){INST[p.melI](ac,bus,t+off,m,len*b*.95,name==='ending'?1:.85);if(p.mel8)INST.keys(ac,bus,t+off,m-12,len*b*.9,.35);}
        st.mi++;st.mt+=len;if(st.mi%th.mel.length===0){st.mt=0;break;}
      }
      if(st.mt>=melLen-.001){st.mt=0;}
      st.step++;st.t+=b/2;
      if(st.step%(th.ch.length*8)===0){st.mi=0;st.mt=0;}
    }
}
/* ---- sound effects ---- */
function fxNoise(t,len,f,q,v,type){const ac=AUD.ac;const b=ac.createBuffer(1,Math.floor(ac.sampleRate*len),ac.sampleRate),x=b.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=(Math.random()*2-1)*Math.pow(1-i/x.length,2);const s=ac.createBufferSource();s.buffer=b;const fl=ac.createBiquadFilter();fl.type=type||'bandpass';fl.frequency.value=f;fl.Q.value=q;const g=ac.createGain();g.gain.value=v;s.connect(fl);fl.connect(g);g.connect(AUD.fx);s.start(t);}
function fxTone(t,m,len,v,type){const ac=AUD.ac;const o=ac.createOscillator();o.type=type||'sine';o.frequency.value=fq(m);const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.0005,t+len);o.connect(g);g.connect(AUD.fx);o.start(t);o.stop(t+len+.05);}
const SE={
  tick(t){fxTone(t,84,.06,.08,'triangle');},
  tab(t){fxNoise(t,.06,2400,1.5,.25);fxTone(t,79,.08,.05);},
  select(t){fxTone(t,76,.12,.1);fxTone(t+.05,83,.15,.08);},
  paper(t){fxNoise(t,.22,1800,.6,.4);fxNoise(t+.12,.15,3000,.8,.25);},
  turn(t){fxNoise(t,.45,900,.4,.35,'lowpass');[72,79,84].forEach((m,i)=>fxTone(t+.25+i*.09,m,1.2,.08));},
  up(t){[79,84,88,91].forEach((m,i)=>fxTone(t+i*.06,m,.5,.07));},
  down(t){fxTone(t,52,.5,.18,'triangle');fxTone(t+.08,47,.6,.14,'triangle');},
  coin(t){[88,95].forEach((m,i)=>{fxTone(t+i*.08,m,.35,.09,'square');fxTone(t+i*.08,m+12,.25,.03);});},
  gavel(t){fxTone(t,45,.15,.4,'sine');fxNoise(t,.08,700,2,.6);fxTone(t+.18,45,.12,.25);fxNoise(t+.18,.06,700,2,.4);},
  bid(t){fxTone(t,81,.08,.1,'square');},
  nicker(t){const ac=AUD.ac;const o=ac.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(220,t);o.frequency.linearRampToValueAtTime(180,t+.5);const l=ac.createOscillator();l.frequency.value=18;const lg=ac.createGain();lg.gain.value=40;l.connect(lg);lg.connect(o.frequency);const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=700;bp.Q.value=2;const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.18,t+.05);g.gain.exponentialRampToValueAtTime(.001,t+.55);o.connect(bp);bp.connect(g);g.connect(AUD.fx);o.start(t);l.start(t);o.stop(t+.6);l.stop(t+.6);},
  snort(t){fxNoise(t,.35,500,.8,.7);},
  brush(t){for(let i=0;i<3;i++)fxNoise(t+i*.13,.12,2600,.7,.3);},
  chew(t){for(let i=0;i<4;i++)fxNoise(t+i*.11,.06,1200,3,.5);},
  birth(t){[67,71,74,79,83].forEach((m,i)=>fxTone(t+i*.12,m,1.6,.07));},
  hit(t){fxTone(t,38,1.2,.4,'sine');fxNoise(t,.6,200,.5,.5,'lowpass');},
  win(t){[[72,0],[76,.12],[79,.24],[84,.36]].forEach(([m,s])=>fxTone(t+s,m,.5,.12,'triangle'));[72,76,79,84].forEach(m=>fxTone(t+.6,m,2,.07,'triangle'));},
  lose(t){[[69,0,1],[67,.4,1],[65,.8,1],[64,1.2,2.2]].forEach(([m,s,l])=>fxTone(t+s,m,l,.08,'sine'));},
};
function se(name,delay=0){if(!AUD.se||!ensureAC())return;try{SE[name](AUD.ac.currentTime+.02+delay);}catch(e){}}

/* ---- hooks into the game ---- */
const STORY_EV=['prologue','firstHorse','farmCrisis','reunion','kujoOffer','cough','health','collapse','letter','parentCall','hinataLeave','hinataPayback','reiChoice','fatherBred','soldBlood','p2guide','hinataTop'];
const homeScene=()=>S&&[12,1,2].includes(M(S.t))?'winter':'home';
// functions are global bindings, so reassigning them reroutes every call site
renderStart=(o=>function(){AUD.over=null;AUD.base='title';bgmApply();return o.apply(this,arguments);})(renderStart);
render=(o=>function(){const r=o.apply(this,arguments);if(S){AUD.base=UI.tab==='sale'?'sale':homeScene();bgmApply();audioBar();}return r;})(render);
closeModal=(o=>function(){AUD.over=null;bgmApply();return o.apply(this,arguments);})(closeModal);
drawTalk=(o=>function(){AUD.over='talk';bgmApply();return o.apply(this,arguments);})(drawTalk);
drawTouch=(o=>function(){AUD.over='touch';bgmApply();return o.apply(this,arguments);})(drawTouch);
drawBid=(o=>function(){const b=UI.bid;if(b&&b.done&&!b._sfx){b._sfx=1;se('gavel');if(b.leader==='me')se('coin',.4);}AUD.over='sale';bgmApply();return o.apply(this,arguments);})(drawBid);
showTrackGate=(o=>function(){AUD.over='paddock';bgmApply();return o.apply(this,arguments);})(showTrackGate);
showPaddock=(o=>function(){AUD.over=UI.race&&UI.race.race.key==='有馬記念'?'title':'paddock';bgmApply();return o.apply(this,arguments);})(showPaddock);
showArimaPrelude=(o=>function(){AUD.over='title';bgmApply();return o.apply(this,arguments);})(showArimaPrelude);
showRaceView=(o=>function(){AUD.over='none';bgmApply();return o.apply(this,arguments);})(showRaceView);
showResult=(o=>function(){AUD.over='none';bgmApply();const RC=UI.race;const r=o.apply(this,arguments);const b=RC&&RC.order&&RC.order.find(f=>f.mine);if(b)se(b.pos===1?'win':b.pos<=3?'select':'lose',.9);return r;})(showResult);
showReport=(o=>function(rep){AUD.over=null;bgmApply();se('turn');if(rep&&rep.prize>0)se('coin',.6);return o.apply(this,arguments);})(showReport);
showEnding=(o=>function(){AUD.over='ending';bgmApply();return o.apply(this,arguments);})(showEnding);
showInterlude=(o=>function(){AUD.over='story';bgmApply();return o.apply(this,arguments);})(showInterlude);
showGameOver=(o=>function(){AUD.over='story';bgmApply();return o.apply(this,arguments);})(showGameOver);
['ev','evc','reply','gift','topic','touchDo','bid','lot','tab'].forEach(k=>{const o=ACT[k];ACT[k]=function(d,b){
  let before=null;
  if(k==='reply'||k==='gift'||k==='topic')before=UI.talk?P(UI.talk.id).trust:null;
  if(k==='touchDo')before=UI.touch?HZ(UI.touch.hid).bond:null;
  if(k==='ev'){const e=S.inbox.find(x=>x.id===+d.id);if(e){if(STORY_EV.includes(e.type)){AUD.over='story';bgmApply();}se(e.type==='birth'?'birth':e.type==='injury'||e.type==='collapse'?'hit':'paper');}}
  const r=o.apply(this,arguments);
  if(before!=null&&(k==='reply'||k==='gift'||k==='topic')){const dlt=P(UI.talk?UI.talk.id:'mikuni').trust-before;se(dlt>=5?'up':dlt<0?'down':'select');}
  if(before!=null&&k==='touchDo'){const h=HZ(UI.touch.hid),dl=h.bond-before;se(d.a==='ブラッシング'?'brush':d.a==='にんじん'||d.a==='りんご'?'chew':'tick');se(dl>=7?'nicker':dl<0?'snort':'tick',.45);if(dl>=7)se('up',.8);}
  if(k==='bid')se('bid');if(k==='tab')se('tab');if(k==='evc')se('select');
  return r;};});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;const first=!AUD.ac;ensureAC();if(first){AUD.base=S?homeScene():'title';bgmApply();}
  const a=b.dataset.act;if(!a||['ev','evc','reply','gift','topic','touchDo','bid','lot','tab','aud','advance','spurt','go'].includes(a))return;se('tick');},true);
/* ---- audio controls in the header ---- */
function audioBar(){
  const top=$('#audslot');if(!top||$('#audbar'))return;
  const d=document.createElement('div');d.id='audbar';d.className='audbar';
  d.innerHTML=`<button class="aud ${AUD.bgm?'on':''}" data-act="aud" data-k="bgm" aria-pressed="${AUD.bgm}">BGM</button><button class="aud ${AUD.se?'on':''}" data-act="aud" data-k="se" aria-pressed="${AUD.se}">効果音</button><input type="range" id="audvol" min="0" max="100" value="${Math.round(AUD.vol*100)}" aria-label="音量">`;
  d.insertAdjacentHTML('beforeend','<button class="aud" data-act="voiceTest">声のテスト</button><select id="vsel" class="aud" style="max-width:180px" aria-label="読み上げの声"></select><div id="vtmsg" class="muted" style="font-size:12px;flex-basis:100%"></div>');
  top.appendChild(d);fillVoiceSel();
  $('#audvol').addEventListener('input',e=>{AUD.vol=e.target.value/100;ensureAC();if(AUD.mus){AUD.mus.gain.value=AUD.bgm?.22*AUD.vol:0;AUD.fx.gain.value=AUD.se?.5*AUD.vol:0;}audSave();});
}
ACT.aud=(d,b)=>{AUD[d.k]=!AUD[d.k];ensureAC();if(AUD.mus){AUD.mus.gain.setTargetAtTime(AUD.bgm?.22*AUD.vol:0,AUD.ac.currentTime,.2);AUD.fx.gain.value=AUD.se?.5*AUD.vol:0;}
  if(d.k==='se'){SND.on=AUD.se;if(!AUD.se)sndStop();}audSave();b.classList.toggle('on',AUD[d.k]);b.setAttribute('aria-pressed',AUD[d.k]);if(d.k==='se'&&AUD.se)se('select');};
if(S)audioBar();
ACT.settings=()=>openSettings();

/* 「止まーれー！」: the official's call is spoken by the device's Japanese voice (a real voice, not a synth),
   then boots on the sand, snorts and the crowd stirring */
SE.tomare=function(t){
  for(let i=0;i<7;i++)fxNoise(t+1.6+i*.17+Math.random()*.1,.05,900+Math.random()*500,2.5,.18);
  fxNoise(t+1.9,.35,500,.8,.4);fxNoise(t+2.4,.3,450,.8,.3);fxNoise(t+1.5,1.8,700,.3,.12,'lowpass');};
/* robust speech: works even before the voice list has loaded, never cancels right before speaking (iOS drops it),
   and if no voice actually starts we fall back to a whistle so something is always heard */
try{if(window.speechSynthesis){speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=()=>speechSynthesis.getVoices();}}catch(e){}
function tomareVoice(onfail){try{const ss=window.speechSynthesis;if(!ss||typeof SpeechSynthesisUtterance==='undefined'){onfail&&onfail('この端末は読み上げに対応していません');return false;}
  if(ss.speaking||ss.pending)ss.cancel();if(ss.paused)ss.resume();
  const u=new SpeechSynthesisUtterance('とまーれー');u.lang='ja-JP';const v=ss.getVoices().filter(v=>/ja/i.test(v.lang));
  const pick=pickMaleVoice(v);if(!pick.male){onfail&&onfail(v.length?'男性の日本語音声が入っていません（女性の声は使わず、笛にしました）':'日本語の読み上げ音声が見つかりません');return false;}u.voice=pick.v;
  u.rate=.82;u.pitch=.9;u.volume=1;let started=false;u.onstart=()=>{started=true;};u.onerror=e=>{if(!started&&onfail)onfail('読み上げエラー：'+(e.error||''));};
  setTimeout(()=>{if(!started&&onfail)onfail(v.length?'声が再生されませんでした':'日本語の読み上げ音声が見つかりません');},1500);
  setTimeout(()=>ss.speak(u),30);return true;}catch(e){onfail&&onfail('読み上げ不可');return false;}}
const MALE_RE=/Otoya|Ichiro|Keita|Hattori|Daichi|Naoki|Takumi|男性|男|male/i;
function pickMaleVoice(v){let saved=null;try{saved=localStorage.getItem('kure-voice-name');}catch(e){}
  const s=saved&&v.find(x=>x.name===saved);if(s)return {v:s,male:MALE_RE.test(s.name)};const m=v.find(x=>MALE_RE.test(x.name));return m?{v:m,male:true}:{v:v[0]||null,male:false};}
/* fallback cue: the official's whistle */
SE.whistle=function(t){const ac=AUD.ac;[0,.42].forEach((s,k)=>{const o=ac.createOscillator();o.type='sine';o.frequency.setValueAtTime(2850,t+s);const l=ac.createOscillator();l.frequency.value=38;const lg=ac.createGain();lg.gain.value=90;l.connect(lg);lg.connect(o.frequency);
  const g=ac.createGain();const len=k?.75:.32;g.gain.setValueAtTime(0,t+s);g.gain.linearRampToValueAtTime(.16,t+s+.02);g.gain.setValueAtTime(.16,t+s+len-.05);g.gain.linearRampToValueAtTime(0,t+s+len);o.connect(g);g.connect(AUD.fx||ac.destination);o.start(t+s);l.start(t+s);o.stop(t+s+len+.05);l.stop(t+s+len+.05);});};
ACT.tomare=(o=>function(){if(PDK&&!PDK.mount&&AUD.se){tomareVoice(()=>se('whistle'));se('tomare');}return o.apply(this,arguments);})(ACT.tomare);

ACT.voiceTest=()=>{const m=$('#vtmsg');if(m)m.textContent='再生中…（「とまーれー」と聞こえれば成功）';ensureAC();tomareVoice(msg=>{if(m)m.textContent=msg+'。代わりに笛の音を鳴らしました。';se('whistle');});};

function fillVoiceSel(){const sel=$('#vsel');if(!sel||!window.speechSynthesis)return;const v=speechSynthesis.getVoices().filter(x=>/ja/i.test(x.lang));const cur=pickMaleVoice(v).v;
  sel.innerHTML=v.length?v.map(x=>`<option value="${esc(x.name)}" ${cur&&cur.name===x.name?'selected':''}>${esc(x.name)}${MALE_RE.test(x.name)?'（男性）':''}</option>`).join(''):'<option>日本語の声なし</option>';
  sel.onchange=()=>{try{localStorage.setItem('kure-voice-name',sel.value);}catch(e){}ACT.voiceTest();};
  if(!v.length)setTimeout(()=>{if($('#vsel')&&speechSynthesis.getVoices().length)fillVoiceSel();},800);}
