/* size a scene canvas so the whole sheet fits the screen without a scroll (never below min) */
function fitH(cv,H,min=180){try{const md=document.getElementById('modal'),sh=document.getElementById('sheet');if(!md||md.hidden||!sh||!sh.contains(cv))return H;
  const cs=getComputedStyle(md),avail=md.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom),others=sh.scrollHeight-cv.offsetHeight;
  return Math.max(min,Math.min(H,Math.floor(avail-others-2)));}catch(e){return H;}}
/* =========================================================
   race broadcast: side-view, galloping horses, commentary, sound
   ========================================================= */
const SND={ac:null,on:true,nodes:null};
try{SND.on=localStorage.getItem('kure-snd')!=='0';}catch(e){}
function sndInit(){if(!SND.on)return;try{SND.ac=SND.ac||new (window.AudioContext||window.webkitAudioContext)();if(SND.ac.resume)SND.ac.resume();}catch(e){SND.ac=null;}}
function sndStart(){
  if(!SND.ac||!SND.on||SND.nodes)return;const ac=SND.ac,sr=ac.sampleRate;
  // hoof thud: low pitched "ドン" (sine sweep 120->45Hz) + a tiny dull knock, no hiss
  const mkThud=(f0,f1,len,knock)=>{const n=Math.floor(sr*len),b=ac.createBuffer(1,n,sr),d=b.getChannelData(0);let ph=0,lp=0;
    for(let i=0;i<n;i++){const t=i/sr,e=Math.exp(-t/(len*.28));const f=f1+(f0-f1)*Math.exp(-t/.025);ph+=2*Math.PI*f/sr;
      lp+=((Math.random()*2-1)-lp)*.05;d[i]=Math.sin(ph)*e+lp*knock*Math.exp(-t/.008);}return b;};
  const th=[mkThud(120,48,.16,1.2),mkThud(105,44,.18,1),mkThud(140,52,.2,1.4)];
  const master=ac.createGain();master.gain.value=.7;master.connect(ac.destination);
  const comp=ac.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=4;comp.connect(master);
  const hoofBus=ac.createGain();hoofBus.gain.value=0;const hlp=ac.createBiquadFilter();hlp.type='lowpass';hlp.frequency.value=380;hoofBus.connect(hlp);hlp.connect(comp);
  // crowd: distant, muffled murmur only (heavily low-passed, slow swell)
  const nb=ac.createBuffer(1,sr*4,sr),nd=nb.getChannelData(0);let br=0;for(let i=0;i<nd.length;i++){br=(br+.04*(Math.random()*2-1))/1.04;nd[i]=br*4;}
  const cs=ac.createBufferSource();cs.buffer=nb;cs.loop=true;const clp=ac.createBiquadFilter();clp.type='lowpass';clp.frequency.value=480;clp.Q.value=.3;
  const cg=ac.createGain();cg.gain.value=0;cs.connect(clp);clp.connect(cg);cg.connect(master);cs.start();
  SND.nodes={cs,cg,clp,hoofBus,th,master,next:ac.currentTime+.1};
}
function sndHoofs(running,cad,vol){
  const n=SND.nodes;if(!n)return;const ac=SND.ac;
  n.hoofBus.gain.setTargetAtTime(running?vol:0,ac.currentTime,.12);
  if(!running){n.next=ac.currentTime+.05;return;}
  const T=1/cad;
  // gallop: ド・ド・ドン ... (3 beats close together, then the suspension phase)
  const beats=[[0,.55,0],[.17,.7,1],[.33,1,2]];
  while(n.next<ac.currentTime+.3){
    for(let h=0;h<2;h++){const base=n.next+(h?.012+Math.random()*.012:0);
      beats.forEach(([o,v,ti])=>{const src=ac.createBufferSource();src.buffer=n.th[ti];src.playbackRate.value=.92+Math.random()*.16;const g=ac.createGain();g.gain.value=v*(h?.35:1);src.connect(g);g.connect(n.hoofBus);src.start(base+o*T*.62);});}
    n.next+=T;
  }
}
function sndClap(){if(!SND.ac||!SND.on)return;const ac=SND.ac,t0=ac.currentTime;for(let i=0;i<14;i++){const t=t0+Math.random()*.05,len=.04,b=ac.createBuffer(1,ac.sampleRate*len,ac.sampleRate),x=b.getChannelData(0);for(let j=0;j<x.length;j++)x[j]=(Math.random()*2-1)*Math.pow(1-j/x.length,3);const s=ac.createBufferSource();s.buffer=b;const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=1200+Math.random()*1400;f.Q.value=1.2;const g=ac.createGain();g.gain.value=.05;s.connect(f);f.connect(g);g.connect(ac.destination);s.start(t);}}
function sndCrowd(v){const n=SND.nodes;if(!n)return;const t=SND.ac.currentTime;n.cg.gain.setTargetAtTime(v,t,.6);n.clp.frequency.setTargetAtTime(380+v*1400,t,.6);}
function sndStop(){if(!SND.nodes)return;const n=SND.nodes,t=SND.ac.currentTime;n.master.gain.setTargetAtTime(0,t,.8);SND.nodes=null;setTimeout(()=>{try{n.cs.stop();}catch(e){}},4000);spStop();}
let VOICE_ON=false;try{VOICE_ON=localStorage.getItem('kure-voice')==='1';}catch(e){}
const SPQ={q:[],busy:false};
function spStop(){SPQ.q=[];SPQ.busy=false;try{speechSynthesis.cancel();}catch(e){}}
function speak(t,fast){if(!SND.on||!VOICE_ON)return;try{const ss=window.speechSynthesis;if(!ss)return;
  const urgent=fast&&/ゴール|か！/.test(t);
  if(urgent){SPQ.q=[];ss.cancel();SPQ.busy=false;}
  SPQ.q.push([t,fast]);if(SPQ.q.length>2)SPQ.q.splice(0,SPQ.q.length-2);   // keep only the newest lines, never chop a word in half
  if(!SPQ.busy&&!ss.speaking)spNext();}catch(e){}}
function spNext(){const ss=window.speechSynthesis;const it=SPQ.q.shift();if(!it){SPQ.busy=false;return;}SPQ.busy=true;
  const u=new SpeechSynthesisUtterance(it[0].replace(/[「」]/g,'').replace(/、/g,'、 '));u.lang='ja-JP';u.rate=it[1]?1.4:1.15;u.pitch=1.05;u.volume=.95;const jv=ss.getVoices().filter(v=>/ja/i.test(v.lang));const pv=typeof pickMaleVoice==='function'?pickMaleVoice(jv).v:jv[0];if(pv)u.voice=pv;
  u.onend=u.onerror=()=>{SPQ.busy=false;spNext();};ss.speak(u);}
function tone(seq,type,vol){if(!SND.ac||!SND.on)return;const ac=SND.ac,t0=ac.currentTime+.05;
  seq.forEach(([f,s,d])=>{const o=ac.createOscillator();o.type=type;o.frequency.value=f;const g=ac.createGain();g.gain.setValueAtTime(0,t0+s);g.gain.linearRampToValueAtTime(vol,t0+s+.02);g.gain.setValueAtTime(vol,t0+s+Math.max(.03,d-.06));g.gain.linearRampToValueAtTime(0,t0+s+d);o.connect(g);g.connect(ac.destination);o.start(t0+s);o.stop(t0+s+d+.05);});}
/* original brass fanfare (not the JRA melody). notes: [midi, start(beats), length(beats), vel] */
const mf=m=>440*Math.pow(2,(m-69)/12);
function brass(notes,bpm,vol){
  if(!SND.ac||!SND.on)return;const ac=SND.ac,t0=ac.currentTime+.08,b=60/bpm;
  const out=ac.createGain();out.gain.value=vol;const rv=ac.createConvolver();
  const ir=ac.createBuffer(2,ac.sampleRate*1.6,ac.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2.5)*.5;}
  rv.buffer=ir;const wet=ac.createGain();wet.gain.value=.35;out.connect(ac.destination);out.connect(rv);rv.connect(wet);wet.connect(ac.destination);
  notes.forEach(([m,st,ln,v=1])=>{const ts=t0+st*b,te=ts+ln*b;
    const lp=ac.createBiquadFilter();lp.type='lowpass';lp.Q.value=1.2;lp.frequency.setValueAtTime(500,ts);lp.frequency.linearRampToValueAtTime(2600*v,ts+.06);lp.frequency.setTargetAtTime(1500,ts+.1,.3);
    const g=ac.createGain();g.gain.setValueAtTime(0,ts);g.gain.linearRampToValueAtTime(.22*v,ts+.035);g.gain.setTargetAtTime(.16*v,ts+.06,.15);g.gain.setValueAtTime(.16*v,Math.max(ts+.06,te-.06));g.gain.linearRampToValueAtTime(0,te+.08);
    [[-6,'sawtooth',.5],[6,'sawtooth',.5],[0,'square',.18]].forEach(([dt,ty,a])=>{const o=ac.createOscillator();o.type=ty;o.frequency.value=mf(m);o.detune.value=dt;const vib=ac.createOscillator();vib.frequency.value=5.2;const vg=ac.createGain();vg.gain.value=ln>1.5?4:0;vib.connect(vg);vg.connect(o.detune);const og=ac.createGain();og.gain.value=a;o.connect(og);og.connect(lp);o.start(ts);o.stop(te+.15);vib.start(ts);vib.stop(te+.15);});
    lp.connect(g);g.connect(out);});
}
function timp(times,bpm,vol){if(!SND.ac||!SND.on)return;const ac=SND.ac,t0=ac.currentTime+.08,b=60/bpm;
  times.forEach(([st,v])=>{const ts=t0+st*b;const o=ac.createOscillator();o.type='sine';o.frequency.setValueAtTime(110,ts);o.frequency.exponentialRampToValueAtTime(58,ts+.25);const g=ac.createGain();g.gain.setValueAtTime(vol*v,ts);g.gain.exponentialRampToValueAtTime(.001,ts+.7);o.connect(g);g.connect(ac.destination);o.start(ts);o.stop(ts+.75);});}
const FAN={
  g1:{bpm:112,len:15.5,n:[[67,0,.5],[67,.5,.5],[72,1,1],[76,2,1],[79,3,2],[76,5,.5],[77,5.5,.5],[79,6,1],[81,7,1],[79,8,2],[84,10,1],[83,11,.5],[81,11.5,.5],[79,12,1],[76,13,1],[74,14,1],[77,14,1,.6],[72,15,3.5,1.1],[76,15,3.5,.7],[79,15,3.5,.7],[64,15,3.5,.6],[60,15,3.5,.6],
       [64,2,1,.5],[67,3,2,.5],[72,8,2,.5],[76,10,1,.5],[74,12,1,.4],[72,13,1,.4]],
      timp:[[0,.6],[3,.7],[8,.7],[13,.6],[14,.8],[14.25,.6],[14.5,.7],[14.75,.8],[15,1.1]]},
  g2:{bpm:120,len:8,n:[[67,0,.5],[67,.5,.5],[72,1,1],[76,2,1],[79,3,1],[77,4,.5],[76,4.5,.5],[74,5,1],[72,6,2.5,1.1],[76,6,2.5,.7],[79,6,2.5,.7],[60,6,2.5,.6]],timp:[[0,.5],[5,.6],[5.5,.6],[6,1]]},
};
function fanfare(race){const f=race.grade==='G1'?FAN.g1:race.g?FAN.g2:null;if(!f||!SND.ac||!SND.on)return 0;brass(f.n,f.bpm,race.key==='有馬記念'?.62:.5);timp(f.timp,f.bpm,.5);return f.len*60/f.bpm;}
/* 確定の合図 (original chime) */
function sKakutei(){if(!SND.ac||!SND.on)return;const ac=SND.ac,t0=ac.currentTime+.05;
  [[88,0],[84,.32],[91,.64]].forEach(([m,st])=>{[1,2.76,5.4].forEach((h,i)=>{const o=ac.createOscillator();o.type='sine';o.frequency.value=mf(m)*h;const g=ac.createGain();const a=[.16,.05,.02][i];g.gain.setValueAtTime(0,t0+st);g.gain.linearRampToValueAtTime(a,t0+st+.01);g.gain.exponentialRampToValueAtTime(.0005,t0+st+1.4);o.connect(g);g.connect(ac.destination);o.start(t0+st);o.stop(t0+st+1.5);});});}
const sGate=()=>{tone([[180,0,.05],[140,.02,.08]],'square',.08);if(!SND.ac||!SND.on)return;const ac=SND.ac;const b=ac.createBuffer(1,ac.sampleRate*.25,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(ac.sampleRate*.05));const s=ac.createBufferSource();s.buffer=b;const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=2200;f.Q.value=3;const g=ac.createGain();g.gain.value=.5;s.connect(f);f.connect(g);g.connect(ac.destination);s.start();};
const sWin=()=>tone([[784,0,.12],[988,.13,.12],[1175,.26,.12],[1568,.4,.7]],'triangle',.12);
const sSpurt=()=>tone([[660,0,.08],[990,.09,.14]],'square',.05);

function showRaceView(long){
  const r=UI.race.race;sndInit();
  openModal(`<div class="from-line">${dstr(S.t)}　${esc(r.course)}競馬場</div>${raceHead(r)}
   <div class="bc"><canvas id="cv" aria-label="レース中継"></canvas></div>
   <div class="spurt-slot"><div class="spurt" id="spurt" hidden><div class="sp-head" id="sphead">仕掛けどき：白い印が<b class="gold">金色</b>に入ったら押す</div><div class="sp-row"><div class="meter2"><b id="zone"></b><i id="needle"></i><span class="ml">早い</span><span class="mr">遅い</span></div><button class="btn gold" data-act="spurt">追い出せ！</button></div><div class="sp-help" id="sphelp"></div>
    <div class="sptut" id="sptut" hidden><span>一時停止中。残り距離の印が金色に入ったら「追い出せ！」。早すぎると失速します。</span><button class="btn pri sm" data-act="spurtOk">わかった</button></div></div></div>
   <p class="sr-only" id="call" aria-live="polite"></p>
   <div class="row racefoot"><button class="btn sm tog ${SND.on?'on':''}" data-act="snd" aria-pressed="${SND.on}">音</button><button class="btn sm tog ${VOICE_ON?'on':''}" data-act="voice" aria-pressed="${VOICE_ON}">実況</button><button class="btn sm" data-act="fast">早送り</button><button class="btn sm" data-act="skip">結果へ</button></div>`,{wide:true,lock:true});
  animate(long);
}
function reorder(RC){
  const ord=[...RC.field].sort((a,b)=>b.perf-a.perf);
  ord.forEach((f,i)=>{f.pos=i+1;f.gapL=i?(ord[0].perf-f.perf)*.3:0;f.margin=i?marginStr((ord[i-1].perf-f.perf)*.3):'';});
  RC.order=ord;
}
const sky=m=>m===12?['#27355e','#7d5a7a','#f0a35e']:m>=11||m<=2?['#5b7fb2','#a9c3de','#e9eef2']:m>=6&&m<=8?['#3f8fd8','#8fc3ef','#e7f3fb']:['#5f98d4','#a7cdee','#eef5fb'];
function drawHorse(c,x,y,sc,ph,coat,silks,num,mine,opt={}){
  const co=COATS[coat]||COATS['鹿毛'];const amp=opt.walk?.42:.85;
  c.save();c.translate(x,y+Math.sin(ph*2)*(opt.walk?.4:1.2)*sc);c.scale(opt.flip?-sc:sc,sc);
  if(!opt.walk||true){const sh=c.createRadialGradient(0,2,2,0,2,34);sh.addColorStop(0,'rgba(0,0,0,.32)');sh.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=sh;c.beginPath();c.ellipse(-4,2,36,5,0,0,7);c.fill();}
  const shade=(hex,a)=>{const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(a<0?v*(1+a):v+(255-v)*a)));return `rgb(${f(r)},${f(g)},${f(b)})`;};
  const hi=shade(co.c,.28),lo=shade(co.c,-.4),farC=shade(co.m,-.25);
  const leg=(x0,y0,a,b,col)=>{const x1=x0+Math.sin(a)*14,y1=y0+Math.cos(a)*14,x2=x1+Math.sin(a+b)*15,y2=y1+Math.cos(a+b)*15;c.strokeStyle=col;c.lineWidth=4.2;c.lineCap='round';c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.lineTo(x2,y2);c.stroke();};
  const dark='rgba(0,0,0,.35)';
  const L=(o,fr)=>{const p=ph+o;return[Math.sin(p)*amp,fr?-Math.max(0,Math.cos(p))*1.5:Math.max(0,Math.cos(p))*1.3];};
  let a;a=L(.3,0);leg(-18,-27,a[0],a[1],farC);a=L(Math.PI+.2,1);leg(16,-27,a[0],a[1],farC);
  // body
  const bg=c.createLinearGradient(0,-44,0,-21);bg.addColorStop(0,hi);bg.addColorStop(.45,co.c);bg.addColorStop(1,lo);c.fillStyle=bg;
  c.beginPath();c.ellipse(0,-32,24,10,0,0,7);c.fill();
  c.beginPath();c.arc(-16,-33,11,0,7);c.fill();c.beginPath();c.arc(15,-31,10,0,7);c.fill();
  // muscle highlights: hindquarter & shoulder, belly shadow
  c.fillStyle='rgba(255,255,255,.13)';c.beginPath();c.ellipse(-17,-37,7,4,-.3,0,7);c.fill();c.beginPath();c.ellipse(13,-36,6,3.5,.4,0,7);c.fill();
  c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(0,-24,18,3,0,0,7);c.fill();
  c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=1;c.beginPath();c.arc(-16,-33,10,.9,2.4);c.stroke();
  // tail
  c.strokeStyle=co.m;c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(-26,-37);c.quadraticCurveTo(-36,-36+Math.sin(ph)*3,-42,-27+Math.sin(ph)*4);c.stroke();
  // neck + head: stretched forward and down while galloping
  c.save();c.translate(14,-36);c.rotate(Math.sin(ph*2)*.07);c.translate(-14,36);
  const ng=c.createLinearGradient(15,-52,30,-30);ng.addColorStop(0,hi);ng.addColorStop(1,co.c);c.fillStyle=ng;c.beginPath();c.moveTo(9,-39);c.lineTo(29,-53);c.lineTo(38,-46);c.lineTo(25,-25);c.closePath();c.fill();c.fillStyle=co.c;
  c.beginPath();c.moveTo(27,-53);c.lineTo(34,-57);c.quadraticCurveTo(46,-50,53,-42);c.lineTo(51,-37);c.quadraticCurveTo(44,-37,40,-39);c.lineTo(35,-44);c.closePath();c.fill();
  c.beginPath();c.moveTo(30,-55);c.lineTo(29,-62);c.lineTo(34,-56);c.fill();
  c.strokeStyle=co.m;c.lineWidth=3.2;c.beginPath();c.moveTo(9,-41);c.quadraticCurveTo(20,-49,30,-56);c.stroke();
  c.fillStyle='#120c08';c.beginPath();c.arc(37,-50,1.3,0,7);c.fill();c.beginPath();c.arc(51,-40,.9,0,7);c.fill();
  c.restore();
  a=L(.9,0);leg(-14,-26,a[0],a[1],co.c);a=L(Math.PI+.8,1);leg(17,-25,a[0],a[1],co.c);
  c.fillStyle='rgba(30,22,16,.85)';[[-14,-26,.9],[17,-25,Math.PI+.8]].forEach(([x0,y0,o])=>{const p=ph+o,a1=Math.sin(p)*amp,b1=o>2?-Math.max(0,Math.cos(p))*1.5:Math.max(0,Math.cos(p))*1.3;const x2=x0+Math.sin(a1)*14+Math.sin(a1+b1)*15,y2=y0+Math.cos(a1)*14+Math.cos(a1+b1)*15;c.beginPath();c.arc(x2,y2,2.4,0,7);c.fill();});
  // saddle cloth
  c.fillStyle='#f6f3ea';c.fillRect(-9,-41,15,10);c.fillStyle='#222';c.font='bold 8px sans-serif';c.textAlign='center';if(!!opt.flip!==!!opt.mir){c.save();c.translate(-1.5,-33);c.scale(-1,1);c.fillText(num,0,0);c.restore();}else c.fillText(num,-1.5,-33);
  if(opt.rug){c.fillStyle='#22324f';c.beginPath();c.moveTo(-24,-41);c.quadraticCurveTo(-4,-46,13,-41);c.lineTo(15,-27);c.quadraticCurveTo(-4,-23,-26,-27);c.closePath();c.fill();
    c.strokeStyle=silks.b;c.lineWidth=1.4;c.stroke();c.fillStyle='#f6f3ea';c.fillRect(-9,-38,14,9);c.fillStyle='#222';c.font='bold 8px sans-serif';c.textAlign='center';
    if(!!opt.flip!==!!opt.mir){c.save();c.translate(-2,-31);c.scale(-1,1);c.fillText(num,0,0);c.restore();}else c.fillText(num,-2,-31);}
  if(opt.nj){c.restore();return;}
  // jockey: knee-up racing crouch at the gallop, upright seat at the walk; arms pump with the stride
  {const run=!opt.walk,pmp=run?Math.sin(ph*2):0,bob=run?Math.cos(ph*2)*.8:0,sa=silks.a,sb=silks.b;
   const J=run?{boot:[4,-34],knee:[13,-45+bob*.3],hip:[0,-49+bob],sh:[15,-55+bob],head:[20,-58+bob],hand:[27+pmp*2.5,-47+bob*.5]}
              :{boot:[3,-33],knee:[8,-41],hip:[-2,-46],sh:[3,-61],head:[5,-67],hand:[15,-49]};
   const ln=(p,q,w,col)=>{c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();};
   // reins
   c.strokeStyle='rgba(30,20,12,.7)';c.lineWidth=.8;c.beginPath();c.moveTo(J.hand[0],J.hand[1]);c.quadraticCurveTo((J.hand[0]+45)/2,J.hand[1]+3,45,-41);c.stroke();
   // leg: white breeches thigh + shin, black boot
   ln(J.hip,J.knee,4.4,'#efece4');ln(J.knee,[J.boot[0]+1,J.boot[1]-3],3.6,'#efece4');
   c.fillStyle='#161412';c.beginPath();c.moveTo(J.knee[0]-1,J.knee[1]+3);c.lineTo(J.knee[0]+2,J.knee[1]+4);c.lineTo(J.boot[0]+3,J.boot[1]+1);c.lineTo(J.boot[0]-2,J.boot[1]+1);c.closePath();c.fill();
   c.strokeStyle='#9aa0a6';c.lineWidth=.8;c.beginPath();c.moveTo(J.boot[0]-2,J.boot[1]+1.5);c.lineTo(J.boot[0]+3,J.boot[1]+1.5);c.stroke();
   // torso (silks), with the sleeve colour on the back arm
   const tx=J.sh[0]-J.hip[0],ty=J.sh[1]-J.hip[1],L=Math.hypot(tx,ty),nx=-ty/L,ny=tx/L;
   c.fillStyle=sa;c.beginPath();c.moveTo(J.hip[0]+nx*3.6,J.hip[1]+ny*3.6);c.lineTo(J.sh[0]+nx*3.4,J.sh[1]+ny*3.4);c.quadraticCurveTo(J.sh[0]+tx/L*2.5,J.sh[1]+ty/L*2.5,J.sh[0]-nx*3.2,J.sh[1]-ny*3.2);c.lineTo(J.hip[0]-nx*3.8,J.hip[1]-ny*3.8);c.closePath();c.fill();
   if(silks.p){c.save();c.clip();c.fillStyle=sb;const mx=(J.hip[0]+J.sh[0])/2,my=(J.hip[1]+J.sh[1])/2;
     if(silks.p==='一本輪'||silks.p==='山形'){c.fillRect(mx-8,my-1.6,16,3.2);}else if(silks.p==='縦縞'){for(let k=-8;k<8;k+=3)c.fillRect(mx+k,my-10,1.2,20);}else if(silks.p==='襷'){c.beginPath();c.moveTo(J.hip[0],J.hip[1]-3);c.lineTo(J.sh[0]+2,J.sh[1]+4);c.lineTo(J.sh[0]+4,J.sh[1]+1);c.lineTo(J.hip[0]+2,J.hip[1]-6);c.fill();}else if(silks.p==='水玉'){[[-3,0],[3,-2],[0,3]].forEach(([dx,dy])=>{c.beginPath();c.arc(mx+dx,my+dy,1.2,0,7);c.fill();});}
     c.restore();}
   c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.moveTo(J.hip[0]-nx*3.8,J.hip[1]-ny*3.8);c.lineTo(J.sh[0]-nx*3.2,J.sh[1]-ny*3.2);c.lineTo(J.sh[0]-nx*1,J.sh[1]-ny*1);c.lineTo(J.hip[0]-nx*1.5,J.hip[1]-ny*1.5);c.closePath();c.fill();
   // arm: upper (sleeve) + forearm, glove
   const el=[(J.sh[0]+J.hand[0])/2+1,(J.sh[1]+J.hand[1])/2+3+pmp*.8];ln(J.sh,el,2.8,sb);ln(el,J.hand,2.4,sb);c.fillStyle='#f2efe8';c.beginPath();c.arc(J.hand[0],J.hand[1],1.3,0,7);c.fill();
   // neck, face, helmet with peak, goggles
   c.fillStyle='#e8c8a6';c.beginPath();c.arc(J.head[0]+.6,J.head[1]+1.4,2.2,0,7);c.fill();
   c.fillStyle=sb;c.beginPath();c.arc(J.head[0],J.head[1]-.6,3.4,Math.PI*.95,Math.PI*2.15);c.closePath();c.fill();c.fillRect(J.head[0]+1,J.head[1]-1.2,4,1.2);
   c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.arc(J.head[0]-1,J.head[1]-2.2,1,0,7);c.fill();
   c.fillStyle='#2a2f35';c.fillRect(J.head[0]+1.4,J.head[1]+.1,2.2,1);
   // whip carried down the shoulder
   if(run){c.strokeStyle='#2a2522';c.lineWidth=.7;c.beginPath();c.moveTo(J.hand[0],J.hand[1]);c.lineTo(J.hand[0]-12,J.hand[1]-6+pmp);c.stroke();}}
  c.restore();
}
/* what people actually shout: the name without the owner's prefix (アケボノハツユキ → ハツユキ) */
function hNick(nm){const pre=[S.kanmei,...Object.values(OWN).map(o=>o.pre)].filter(Boolean).sort((a,b)=>b.length-a.length);
  for(const p of pre)if(nm.startsWith(p)&&nm.length-p.length>=2)return nm.slice(p.length);return nm;}
const RHC=['中山','京都','阪神','札幌','函館','福島','小倉'];   // 右回り
function animate(long){
  const RC=UI.race,race=RC.race,D=race.dist,arima=race.key==='有馬記念';
  const cv=$('#cv'),c=cv.getContext('2d');
  const W=cv.clientWidth,H=fitH(cv,Math.round(W<560?clamp(W*.9,290,480):clamp(W*.58,250,500)),230),dpr=window.devicePixelRatio||1;
  cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';c.scale(dpr,dpr);
  const fld=RC.field,my=fld.filter(f=>f.mine),m0=my[0];
  const lanes=[...Array(fld.length).keys()].sort(()=>R()-.5);
  const PM={ハイ:1.35,ミドル:1,スロー:.7}[RC.pace]||1;
  const SH=RC.shape||'単騎',LD=fld.find(f=>f.no===RC.leadNo)||null,LEN=2.4;
  // the lead the front-runner opens up: a length or so, a few lengths when alone, a huge gap when it bolts
  const G0=SH==='大逃げ'?(9+R()*8)*LEN:SH==='単騎'?(1.5+R()*2.5)*LEN:SH==='競り合い'?(2+R()*2)*LEN:(.6+R()*.8)*LEN;
  fld.forEach((f,i)=>{f.early=f===LD?0:SH==='競り合い'&&f.used==='逃げ'?R()*1.5:({逃げ:1,先行:2,差し:12,追込:23}[f.used]+R()*6)*(SH==='大逃げ'?1:PM);f.g0=f===LD||(SH==='競り合い'&&f.used==='逃げ')?0:G0;f.gl=fld.length>1?(f.no-1)/(fld.length-1)*7.5:3;f.lane=f.gl;
    f.tl={逃げ:.2,先行:1.3,差し:2.6,追込:3.6}[f.used]+R()*1.4;f.wide={逃げ:0,先行:.6,差し:1.8,追込:2.8}[f.used]+R()*.8;f.jph=R()*7;f.gapCur=f.gapL;f.coat=f.h?f.h.coat:pick(Object.keys(COATS));});
  const sm=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
  /* realistic shape: positions taken in the first furlongs, a settled formation down the back,
     then the order is decided only in the last ~600m (closers surge late, faders drop back) */
  const lateF=Math.max(.45,1-(long?750:600)/D);
  const posX=(f,tau)=>{const s0=sm(lateF,1,tau),cl=f.early>15?Math.pow(s0,1.7):f.early<3?Math.pow(s0,.8):s0;
    const drift=Math.sin(tau*D/180+f.jph)*.7*sm(.06,.15,tau)*(1-s0);
    return D*tau-(f.early*(1-cl)*sm(0,.09,tau)+f.g0*(1-cl)*sm(0,SH==='大逃げ'?.35:.12,tau)+f.gapCur*(2.4+1.7*sm(.86,1,tau))*cl)+drift;};   // by the line one length = one drawn horse (~4.1m at this scale)
  const laneAt=(f,tau)=>{const a=sm(0,.12,tau),rem=D*(1-tau),w=sm(520,300,rem);return clamp(f.gl*(1-a)+f.tl*a+f.wide*w,0,7.5);};
  RC.rain=RC.rain??((race.going||'良')!=='良'&&hash(race.name+S.t+'rain')<.7);const SK=RC.rain?['#5d6670','#8a939b','#aab1b6']:sky(M(S.t)),dirt=race.surf==='ダ';
  const trackCol=dirt?(race.going==='良'?'#b48a5a':'#8f6a45'):(race.going==='良'?'#4f9a5e':race.going==='稍重'?'#478a55':'#3d7a4b');
  const trackCol2=dirt?'#a67d50':'#468c55';
  let call='',callT=0;const callEl=$('#call');
  const say=s=>{call=s;callT=performance.now();if(callEl)callEl.textContent=s;speak(s,tau>.8);};
  const pos=(cur,f)=>cur.indexOf(f)+1;
  const lenJ=L=>{const n=Math.round(L*2)/2,w=Math.floor(n);return n<1?'半馬身':`${w}馬身${n-w?'半':''}`;};
  const fN=f=>`${f.name}`,num=f=>`${f.no}番`;
  const half=Math.round(D/2/100)*100,t1000=RC.time*(1000/D)*(RC.pace==='ハイ'?.975:RC.pace==='スロー'?1.03:1);
  const ts=t=>{const s=t.toFixed(1);return t<60?`${s.replace('.','秒')}`:`${Math.floor(t/60)}分${(t%60).toFixed(1).replace('.','秒')}`;};
  const CALLS=[[0,()=>race.debut?`スタートしました！ 若駒たちのデビュー戦！`:pick([`スタートしました！`,`ゲートが開きました！ ${race.name}、スタート！`,`各馬そろったスタート！`])],
    [.035,cur=>{const late=fld.slice().sort((a,b)=>b.early-a.early)[0];return pick([`${num(late)}${fN(late)}は、やや出負けしたか`,`まずは各馬、横一線の飛び出し`]);}],
    [.07,cur=>`さあ、何が行くか。内から${fN(cur[0])}、${fN(cur[1])}もいい出足`],
    [.13,cur=>{const L=LD||cur[0];if(SH==='大逃げ')return `${num(L)}${fN(L)}が行った！ これは大逃げだ！ 後続をぐんぐん引き離していく！`;
      if(SH==='競り合い'){const b=fld.filter(f=>f.used==='逃げ'&&f!==L)[0]||cur[1];return `${fN(L)}と${fN(b)}が競り合ってハナ争い！ 前は激しくやり合っている！`;}
      if(SH==='押し出し')return `行く馬がいない。押し出されるように${num(L)}${fN(L)}が先頭に立ちました`;
      return `${num(L)}${fN(L)}がすんなりハナを切りました。単騎の逃げ、リードは${lenJ(G0/LEN)}`;}],
    [.2,cur=>SH==='大逃げ'?`2番手グループは${fN(cur[1])}、${fN(cur[2])}。先頭とはもう${lenJ((posX(cur[0],tau)-posX(cur[1],tau))/LEN)}以上の差！`:`2番手に${fN(cur[1])}、3番手${fN(cur[2])}。その外${fN(cur[3])}`],
    [.27,cur=>m0?(()=>{const p=pos(cur,m0),n=cur.length;return `${fN(m0)}は${p<=4?'好位の':p>=n-3?'後方':'中団の'}${p}番手。${m0.jname.split(' ')[0]}騎手、${p<=4?'いい位置を取りました':'じっくり構えています'}`;})():`中団に${fN(cur[Math.floor(cur.length/2)])}`],
    [.34,cur=>`後方には${fN(cur[cur.length-2])}、そして最後方に${fN(cur[cur.length-1])}`]];
  if(D>=1400)CALLS.push([1000/D,()=>`1000メートルの通過は${ts(t1000)}。${RC.pace==='ハイ'?'速い流れ！':RC.pace==='スロー'?'ゆったりとした流れです':'平均的なペース'}`]);
  if(long)CALLS.push([.52,cur=>{const g=(posX(cur[0],tau)-posX(cur[1],tau))/LEN;return `向こう正面に入って、先頭は依然${fN(cur[0])}。後続との差は${g>=10?'10馬身以上！ 場内がざわつく':g<.8?'わずか':lenJ(g)}`;}],[.6,cur=>`隊列は縦長。${fN(cur[0])}、${fN(cur[1])}、${fN(cur[2])}と続いて…`]);
  const TR=r=>1-r/D;
  if(courseChar(race).kyoto&&D>=1800)CALLS.push([TR(long?1000:820),cur=>`3コーナー、淀の坂の上り！ ここはゆっくり上って、ゆっくり下る`]);
  CALLS.push([TR(long?900:700),cur=>`3コーナーカーブ！ ${pos(cur,m0||cur[4])>5?'後方各馬も一斉に進出開始':'各馬の手が動き始めた'}`],
    [TR(long?640:520),cur=>`${fN(cur[0])}、まだ手応え十分か。外から${fN(cur[2])}が並びかけて4コーナー`],
    [TR(long?560:420),()=>{const cc=courseChar(race);return cc.long?`4コーナーを回って、${race.course}の長い直線！ ここからが長い！`:cc.short?`4コーナーを回って、${race.course}の短い直線！ 前は止まらないか！`:'さあ4コーナーを回って、直線コースに向いた！';}],
    [TR(380),cur=>m0&&cur[0]===m0?`${fN(m0)}先頭！ ${fN(m0)}が先頭に立った！ 後続を突き放しにかかる！`:m0?`${fN(cur[0])}先頭！ ${fN(m0)}は${pos(cur,m0)}番手、${pos(cur,m0)<=3?'並びかける！':'外から追い込んでくる！'}`:`${fN(cur[0])}先頭！ ${fN(cur[1])}が迫る！`],
    [TR(320),cur=>{if(!LD||(m0&&m0!==LD&&R()<.4))return '';const p=pos(cur,LD);if(SH==='大逃げ')return p===1?`大逃げの${fN(LD)}、まだリードがある！ 後続は届くのか！`:`大逃げの${fN(LD)}、ここで一杯になった！ 後続が飲み込む！`;
      return p===1?`${fN(LD)}、逃げる逃げる！ 粘れるか！`:p<=3?`逃げた${fN(LD)}、まだ粘っている！`:`逃げた${fN(LD)}は苦しくなった`;}],
    [TR(275),cur=>{const rv=RC.rivalF;if(!rv)return `${fN(cur[1])}、懸命に追う！ 内で${fN(cur[2])}も粘る！`;const p=pos(cur,rv);return p===1?`${fN(rv)}が先頭！ 宿敵が伸びる！`:`宿敵${fN(rv)}、${p}番手から${p<=3?'並びかける！':'大外から追い込む！'}`;}],
    [TR(200),cur=>{const cc=courseChar(race);return cc.hs>=2?`急坂！ ${cc.hill}を駆け上がる！ 先頭は${fN(cur[0])}！ 脚が上がるか！`:cc.hs===1&&cc.hill?`${cc.hill}を越えて、残り200！ 先頭は${fN(cur[0])}！`:`残り200を切った！ 先頭は${fN(cur[0])}！`;}],
    [TR(160),cur=>{const ls=cur.slice(0,3).filter(f=>f.pop>=8&&(f.ev==='激走'||f.pos<=3));if(ls.length)return `人気薄の${fN(ls[0])}が突っ込んでくる！ これは波乱か！`;const fav=fld.find(f=>f.pop===1);const p=pos(cur,fav);return p>4?`1番人気${fN(fav)}は${p}番手、伸びない！ 場内がどよめく！`:`${fN(cur[0])}、懸命に粘る！`;}],
    [TR(110),cur=>{const ord=RC.order,lead=(ord[1].gapL-ord[0].gapL);if(lead>1.6)return `${fN(ord[0])}、${lead>4?'独走！ これは強い！':'抜け出した！ リードは'+lenJ(lead)+'！'} 2着争いは${fN(ord[1])}と${fN(ord[2])}！`;
      return `${fN(ord[0])}か、${fN(ord[1])}か！ ${m0&&m0.pos<=4&&m0.pos>2?fN(m0)+'も来ている！':'内から'+fN(ord[2])+'！'}`;}],
    [TR(45),cur=>{const ord=RC.order,lead=ord[1].gapL-ord[0].gapL,l23=ord[2].gapL-ord[1].gapL;if(lead<.6)return `${fN(ord[0])}、${fN(ord[1])}、並んで…！`;
      return `${fN(ord[0])}、${lead>2.5?'悠々先頭！':'先頭！'} 2着は${fN(ord[1])}か${fN(ord[2])}か${l23<.5?'、横並び！':'！'}`;}]);
  let fired=0,speed=1,prev=performance.now(),tau=0,camX=0,k=6,goalT=0,photo=false,spurtDone=!m0,spurtMsg='',spurtT=0,parts=[];
  const midTS=long?3:3.8,realFrom=D-(long?520:360);
  const lerp=(a,b,t)=>a+(b-a)*clamp(t,0,1);
  const tsAt=d=>d<80?1:d<180?lerp(1,midTS,(d-80)/100):d<realFrom-160?midTS:d<realFrom?lerp(midTS,1,(d-(realFrom-160))/160):d>D-170?.6:d>D-230?lerp(1,.6,(d-(D-230))/60):1;
  let MIR=false,cutT=0,SHOT=null;let dl=0,gph=0,tutT=0,zc=null,gcam=null,splitTxt='',splitM=0;
  const spEl=$('#spurt'),needle=$('#needle'),zone=$('#zone'),spBtn=spEl&&spEl.querySelector('[data-act=spurt]');
  let spOpen=false;
  if(spEl&&m0){spEl.hidden=false;spEl.classList.add('idle');if(spBtn)spBtn.disabled=true;const h=$('#sphelp');if(h)h.textContent=`直線に入ると仕掛けられる（${m0.name}）`;}
  const jsk=m0?m0.jsk:70,jtr=m0&&m0.jid&&m0.jid!=='stable'?P(m0.jid).trust:30;
  const ideal=m0?({逃げ:420,先行:370,差し:300,追込:250}[m0.used||m0.style]||320)+(long?40:0):300;
  const zw=clamp(70+(jsk-60)*2.5+jtr*.4,70,190);
  const R0=ideal+zw/2+220,R1=Math.max(60,ideal-zw/2-60);
  const mpos=rem=>clamp((R0-rem)/(R0-R1),0,1);
  if(zone){zone.style.left=`${mpos(ideal+zw/2)*100}%`;zone.style.width=`${(mpos(ideal-zw/2)-mpos(ideal+zw/2))*100}%`;}
  let paused=false;
  const doSpurt=(q)=>{if(spurtDone)return;spurtDone=true;if(spEl){spEl.classList.remove('now');spEl.classList.remove('idle');if(spBtn){spBtn.disabled=false;spBtn.dataset.act='cheer';spBtn.textContent='行けー！！';}const h=$('#sphelp');if(h)h.textContent={perfect:'完璧な仕掛け！',good:'いいタイミング！',miss:'早すぎた…',auto:'騎手が自分の判断で仕掛けた'}[q];}
    const add={perfect:1.8,good:.9,miss:-.6,auto:.3}[q];m0.perf+=add;reorder(RC);
    spurtMsg={perfect:`完璧な仕掛け！ ${m0.jname}の手が動いた！`,good:`いいタイミング！ ${m0.name}が伸びる！`,miss:'早すぎた…！ ゴール前で脚が鈍る',auto:`${m0.jname}が自分の判断で追い出した`}[q];spurtT=performance.now();if(q!=='auto')sSpurt();};
  // the owner on their feet in the stand: shout bubbles (automatic at key moments + the cheer button)
  let shouts=[],cheers=0;const ownerNm=()=>S.part===1?S.parent.name.split(' ')[0]:cName();
  const shout=(txt,who,big)=>{shouts.push({txt,who,t:performance.now(),side:shouts.length%2,big});if(shouts.length>4)shouts.shift();};
  ANIM={cheer:()=>{if(!m0||goalT)return;cheers++;const p=RC.order?pos([...fld].sort((a,b)=>posX(b,tau)-posX(a,tau)),m0):9;
      shout(pick(p===1?['そのまま！そのまま！！','行けー！！','押し切れー！！']:p<=3?['行けー！！','差せー！！','届けー！！',`${hNick(m0.name)}ー！！`]:['行けーっ！！','まだだ！まだ届く！！','頼む…！行け！！']),'あなた',true);
      if(cheers<=6){m0.perf+=.05;reorder(RC);}try{sndCrowd(.4);}catch(e){}},
    fast:()=>speed=speed===1?3:1,skip:()=>{if(!spurtDone)doSpurt('auto');tau=1.06;dl=D*1.06;goalT=1;},
    spurt:()=>{if(spurtDone||paused||D-dl>R0)return;const rem=D-dl,d=Math.abs(rem-ideal);doSpurt(d<zw/4?'perfect':d<=zw/2?'good':'miss');},
    resume:()=>{paused=false;const t=$('#sptut');if(t)t.hidden=true;}};
  const fl=fanfare(race);
  const big=race.grade==='G1',midR=race.g;
  const T0=performance.now(),fanMs=fl?fl*1000+500:400;
  const stepMs=big?950:midR?650:420;
  const loadOrd=[...fld].sort((a,b)=>((b.no%2)-(a.no%2))||a.no-b.no);
  const balk=fld.find(f=>f.mine&&f.h.temper==='気難しい'&&f.h.bond<50&&R()<.55)||(big&&R()<.4?pick(fld.filter(f=>!f.mine)):null);
  let tl=fanMs+(big?1600:900);
  loadOrd.forEach(f=>{if(f===balk)return;f.loadAt=T0+tl;tl+=stepMs;});
  if(balk){tl+=big?2200:900;balk.loadAt=T0+tl;tl+=stepMs;}
  const lastF=[...fld].sort((a,b)=>b.loadAt-a.loadAt)[0];
  const readyAt=T0+tl+900,startAt=readyAt+(big?2000:1300);
  let started=startAt;
  const PRE=[[T0,fl?(race.key==='有馬記念'?'暮れの中山に、ファンファーレが鳴り響く──':`${race.course}競馬場、${race.name}。ファンファーレです`):'各馬、ゲート裏に集まってきました'],
    [T0+fanMs+300,big?'各馬、ゲート入りが始まりました':'ゲートイン']];
  const firstEven=loadOrd.find(f=>f.no%2===0&&f!==balk);if(firstEven&&fld.length>3)PRE.push([firstEven.loadAt-500,'奇数番の各馬が収まって、続いて偶数番']);
  if(m0&&m0!==balk&&big)PRE.push([m0.loadAt+150,`${m0.name}、すんなりと${m0.no}番ゲートへ`]);
  if(balk){PRE.push([balk.loadAt-(big?2000:800),`${balk.name}が、ゲート入りを嫌がっています…！`]);PRE.push([balk.loadAt+250,big?'係員に促されて、なんとか収まりました':'なんとか収まった']);}
  if(big)PRE.push([lastF.loadAt+150,`最後に${lastF.no===fld.length?'大外':''}${lastF.no}番、${lastF.name}が収まって──`]);
  PRE.push([readyAt,'態勢完了──']);
  PRE.sort((a,b)=>a[0]-b[0]);let preI=0;
  setTimeout(()=>{sGate();sndStart();},startAt-performance.now());
  const preX=(f,now)=>{const mill=-9-(f.no%4)*3.4+Math.sin(now/1100+f.no)*1.6;if(!f.loadAt)return mill;const t=clamp((now-(f.loadAt-1200))/1200,0,1);return mill+(0.2-mill)*t*t*(3-2*t);};
  let SL=1.15;   // lane slant: oblique at the gate, nearly square-on once racing so outside horses don't look ahead
  let BS=false;const vl=l=>BS?8.6-l:l;   // backstretch: seen from the stand side, the inside rail is the near side
  const yLane=l=>BS?H*.795-l*H*.027:H*.535+l*H*.034;
  const frame=now=>{
    if(!document.getElementById('cv')){sndStop();return;}
    const dt=Math.min(60,now-prev);prev=now;
    const ts=tsAt(dl);
    const inWin=!spurtDone&&D-dl<=R0;
    if(now>started&&!goalT&&!paused){dl=Math.min(D,dl+dt/1000*16.6*ts*speed);tau=dl/D;}
    const gcOn=goalT&&goalT!==1&&now-goalT<1900;
    if(goalT&&goalT!==1&&!gcOn){dl+=dt/1000*16.6*.3;tau=Math.min(1.06,dl/D);}
    const gs=Math.min(1,ts)*(goalT?.5:1);if(!gcOn)gph+=dt/1000*Math.PI*2*(now>started&&tau<1.04?1.85*gs*(speed>1?1.2:1):.6);
    fld.forEach(f=>{f.gapCur+=(f.gapL-f.gapCur)*(tau>.9?.25:.06);});   // the picture must match the result by the line
    const pre=now<started;const xOf=f=>pre?preX(f,now):posX(f,tau);
    if(!pre)fld.forEach(f=>{f.lane=laneAt(f,Math.min(tau,1));});
    while(preI<PRE.length&&now>=PRE[preI][0]){say(PRE[preI][1]);preI++;}
    const xs=fld.map(xOf);const cur=[...fld].sort((a,b)=>xOf(b)-xOf(a));
    while(fired<CALLS.length&&tau>=CALLS[fired][0]&&now>started){{const t=CALLS[fired][1](cur);if(t)say(t);}fired++;}
    if(!spurtDone&&D-dl<=R0&&spEl&&!spOpen){spOpen=true;spEl.classList.remove('idle');if(spBtn)spBtn.disabled=false;say(`${m0.name}、仕掛けどころが近づく！`);
      if(!S.flags.spurtTut){S.flags.spurtTut=1;tutT=now;}}
    if(!spurtDone&&D-dl<ideal-zw/2)doSpurt('auto');
    if(needle&&!spurtDone&&spOpen){const rem=D-dl;needle.style.left=`${mpos(rem)*100}%`;const h=$('#sphelp');if(h)h.textContent=rem>ideal+zw/2?`残り${Math.round(rem/10)*10}m　まだ早い…金色に入るのを待て`:`残り${Math.round(rem/10)*10}m　今だ！`;
      spEl.classList.toggle('now',rem<=ideal+zw/2);}
    // finish
    if(tau>=1&&!goalT){goalT=now;fld.forEach(f=>f.gapCur=f.gapL);const g=(RC.order[1].perf-RC.order[0].perf);photo=Math.abs(RC.order[0].perf-RC.order[1].perf)*.3<.15;RC.photo=photo;say(`${RC.order[0].name}、ゴールイン！`+(RC.order[0].pop>=7?` ${RC.order[0].pop}番人気の大駆け、大波乱！`:'')+(RC.photo?` 2着${RC.order[1].name}と際どい！`:(RC.order[1].gapL>3?` ${lenJ(RC.order[1].gapL)}差の圧勝！`:` 2着に${RC.order[1].name}`))+`。${RC.order[0].mine?(arima?'　暮れの中山に、あの勝負服が帰ってきた！':'　やった！'):''}`);if(RC.order[0].mine)sWin();}
    // camera
    const lead=Math.max(...xs),tail=Math.min(...xs);
    const focus=m0?posX(m0,tau):lead;
    const tgt=tau<.78?(lead*.5+focus*.5-4):(Math.max(lead,focus)*.55+Math.min(lead,focus)*.45);
    if(pre){camX+=((now>T0+fanMs?1:-5)-camX)*.05;}else camX+=(tgt-camX)*(tau<.02?.12:.4);
    const wide=ts>1.6;const spread=wide?clamp(lead-tail+12,40,110):clamp(Math.abs(lead-focus)+16,22,95);
    if(pre)k+=((W/(big?22:28))-k)*.05;else k+=((clamp((W<560?1.05:.8)*W/spread,4,16))-k)*.05;
    if(gcOn){const w0=RC.order[0],a=(now-goalT)/1000;if(!gcam)gcam={x:posX(w0,tau),l:w0.lane};k=(W<560?W/12:W/17)*(1+a*.05);camX=clamp(gcam.x,D-.5,D+2.5)+(gcam.l-3.75)*SL+.6;}
    SL=pre?1.15:1.15-.93*sm(0,.1,Math.min(tau,1));
    const SX=x=>W*.5+(x-camX)*k-3.75*k*SL;
    const lsh=l=>l*k*SL;
    // broadcast camera: on the backstretch the TV cuts to the far-side camera (horses run right→left)
    // where the leader is on the lap: home straight → 1-2 turn → backstretch → 3-4 turn (seen from the far side) → 4th-turn camera → straight
    const ccB=courseChar(race),Plap=((race.surf==='ダ'?CDIMD:CDIM)[race.course]||[1800])[0],turnL=Math.max(150,(Plap-2*ccB.st)/2),
      bsEnd=ccB.st+Math.max(85,Math.min(130,ccB.st*.25))*Math.PI*.45,remMod=((D-lead)%Plap+Plap)%Plap,
      pastB=(Plap-remMod)%Plap,R12b=Math.max(80,Math.max(85,Math.min(130,ccB.st*.25))*.9),inRunout=pastB<100+R12b*Math.PI*.9+15,
      bsAt=L=>{const rm=((D-L)%Plap+Plap)%Plap,pb=(Plap-rm)%Plap;return rm>(D>=1200?bsEnd:ccB.st+20)&&!(pb<100+R12b*Math.PI*.9+15);},
      // after the 1-2 turn it stays on the far-side camera until the 4th turn; the opening stretch (up to 350m) takes the direction
      // the field is about to settle into, so the start never faces one way and flips right after the jump
      bsOn=!goalT&&bsAt(Math.max(lead,Math.min(350,D*.3)));BS=bsOn;
    // right-handed courses: the home straight runs right→left on TV, the backstretch left→right
    const wantMir=RHC.includes(race.course)?!bsOn:bsOn;if(wantMir!==MIR){MIR=wantMir;if(!pre)cutT=now;}
    c.save();if(MIR){c.translate(W,0);c.scale(-1,1);}
    // sky with drifting clouds
    const g=c.createLinearGradient(0,0,0,H*.42);g.addColorStop(0,SK[0]);g.addColorStop(.6,SK[1]);g.addColorStop(1,SK[2]);c.fillStyle=g;c.fillRect(0,0,W,H*.42);
    if(M(S.t)===12){const sg=c.createRadialGradient(W*.82,H*.34,0,W*.82,H*.34,H*.2);sg.addColorStop(0,'rgba(255,214,150,.95)');sg.addColorStop(.35,'rgba(255,170,90,.5)');sg.addColorStop(1,'rgba(255,170,90,0)');c.fillStyle=sg;c.fillRect(0,0,W,H*.42);}
    c.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<6;i++){const cx0=((i*W*.37-camX*k*.02-now*.004)%(W*1.6)+W*1.6)%(W*1.6)-W*.3,cy0=H*(.06+(i%3)*.05);c.beginPath();c.ellipse(cx0,cy0,W*.09,H*.018,0,0,7);c.ellipse(cx0+W*.05,cy0-H*.01,W*.06,H*.02,0,0,7);c.fill();}
    drawInfieldBG(c,W,H,{camX,k,D,race,fld,now,gph,MIR,dirt});
    // track: base, soft mowing bands, worn racing line, speckle texture
    c.fillStyle=trackCol;c.fillRect(0,H*.5,W,H*.43);
    const band=dirt?0:30;
    if(band){for(let wx=Math.floor((camX-W/k)/(band*2))*band*2;wx<camX+W/k+band*2;wx+=band*2){const x0=SX(wx),x1=SX(wx+band);c.fillStyle='rgba(255,255,255,.045)';c.beginPath();c.moveTo(x0+lsh(0),H*.53);c.lineTo(x1+lsh(0),H*.53);c.lineTo(x1+lsh(8.5),H*.93);c.lineTo(x0+lsh(8.5),H*.93);c.closePath();c.fill();}}
    const wl=BS?c.createLinearGradient(0,H*.93,0,H*.53):c.createLinearGradient(0,H*.53,0,H*.93);wl.addColorStop(0,'rgba(0,0,0,0)');wl.addColorStop(.12,dirt?'rgba(90,60,30,.12)':'rgba(120,100,60,.10)');wl.addColorStop(.4,'rgba(0,0,0,0)');c.fillStyle=wl;c.fillRect(0,H*.53,W,H*.4);
    for(let i=0;i<70;i++){const wx=Math.floor(camX-W/k)+((i*37.3)%(W/k*2));const h0=hash('s'+i+Math.floor(camX/(W/k*2)));const x=SX(Math.floor((camX-W/k)/7)*7+i*7);const y=H*(.54+h0*.38);c.fillStyle=dirt?'rgba(80,55,30,.18)':'rgba(30,60,30,.14)';c.fillRect(x+lsh(h0*8),y,3+h0*5,1.2);}
    // inner rail: shadow, two white bars, evenly spaced posts (spacing adapts to zoom so it never turns into a barcode)
    c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,H*.535,W,3);
    const pStep=[2,4,5,10,20,40,80].find(p=>p*k>=16)||80;
    c.fillStyle='#e9ece8';if(!BS)for(let wx=Math.floor((camX-W/k)/pStep)*pStep;wx<camX+W/k+pStep;wx+=pStep){const x=Math.round(SX(wx));c.fillRect(x-1,H*.497,2.4,H*.038);}
    c.fillStyle='#ffffff';c.fillRect(0,H*.495,W,3);c.fillStyle='rgba(255,255,255,.75)';c.fillRect(0,H*.515,W,1.6);
    // distance poles
    for(let r=200;r<=D;r+=200){const x=SX(D-r);if(x<-30||x>W+30)continue;c.fillStyle='#fff';c.fillRect(x-1.5,H*.43,3,H*.08);c.fillStyle=r%400?'#c0392b':'#1a4fa0';c.fillRect(x-14,H*.41,28,13);c.fillStyle='#fff';c.font='bold 9px sans-serif';c.textAlign='center';(MIR?(c.save(),c.translate(x,0),c.scale(-1,1),c.fillText(r,0,H*.41+10),c.restore()):c.fillText(r,x,H*.41+10));}
    // goal post
    const gx=SX(D);if(gx>-60&&gx<W+60+lsh(8.5)){
      // finish line painted across the (slanted) track, then the striped post on the inner rail
      c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=Math.max(1.5,k*.12);c.beginPath();c.moveTo(gx+lsh(-.4),H*.53);c.lineTo(gx+lsh(8.6),H*.93);c.stroke();
      const ph=H*.25,py=H*.28;c.fillStyle='rgba(0,0,0,.25)';c.fillRect(gx-1,H*.535,Math.max(4,k*.25),4);
      c.fillStyle='#fff';c.fillRect(gx-2,py,4,ph);for(let yy=py;yy<py+ph;yy+=10){c.fillStyle='#d62828';c.fillRect(gx-2,yy,4,5);}
      c.fillStyle='#d62828';c.beginPath();c.arc(gx,py,Math.max(6,k*.3),0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(gx,py,Math.max(3,k*.15),0,7);c.fill();}
    // particles
    if(tau>0&&tau<1.06){for(const f of fld){if(R()<.35){const x=SX(posX(f,tau))+lsh(vl(f.lane))-22*k/25;parts.push({x,y:yLane(f.lane)+2,vx:-1-R()*2,vy:-R()*1.5,l:1});}}}
    parts=parts.filter(p=>(p.l-=.04)>0);c.fillStyle=dirt?'rgba(120,85,50,.5)':'rgba(70,110,60,.45)';parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.08;c.globalAlpha=p.l*.8;c.fillRect(p.x,p.y,2.2,2.2);});c.globalAlpha=1;
    // horses back to front
    const sc=k*2.5/50;
    const gx0=SX(0),gateOn=gx0>-160&&gx0<W+60;const openT=now-startAt;
    const stall=(f,front)=>{const s2=sc*(.86+vl(f.gl)*.035),y=yLane(f.gl),hg=64*s2,bx=SX(-3.0)+lsh(vl(f.gl)),fx=SX(1.1)+lsh(vl(f.gl));
      if(!front){c.fillStyle='#9aa4ad';c.fillRect(bx-2*s2,y-hg,4*s2,hg);c.fillStyle='#c3cad1';c.fillRect(bx,y-hg,fx-bx,4*s2);
        c.fillStyle='#2e6e4c';c.fillRect(bx+(fx-bx)*.35,y-hg-9*s2,(fx-bx)*.4,9*s2);c.fillStyle='#fff';c.font=`bold ${Math.max(8,9*s2)}px sans-serif`;c.textAlign='center';(MIR?(c.save(),c.translate(bx+(fx-bx)*.55,0),c.scale(-1,1),c.fillText(f.no,0,y-hg-1.5*s2),c.restore()):c.fillText(f.no,bx+(fx-bx)*.55,y-hg-1.5*s2));return;}
      c.fillStyle='#9aa4ad';c.fillRect(fx-2*s2,y-hg,4*s2,hg);
      if(openT<0){c.fillStyle='#3d8a60';c.fillRect(fx,y-hg*.8,5*s2,hg*.72);c.fillStyle='rgba(255,255,255,.7)';c.fillRect(fx+1*s2,y-hg*.62,3*s2,2*s2);c.fillRect(fx+1*s2,y-hg*.35,3*s2,2*s2);}
      else if(openT<450){const o=openT/450;c.save();c.translate(fx,y-hg*.8);c.fillStyle='#3d8a60';c.fillRect(0,0,(5+18*o)*s2,hg*.72*(1-o*.5));c.restore();}};
    const pins=[];const ux=x=>MIR?W-x:x;
    [...fld].sort((a,b)=>vl(a.lane)-vl(b.lane)).forEach(f=>{const x=xOf(f);const px=SX(x)+lsh(vl(f.lane));
      if(gateOn&&tau<.12)stall(f,false);
      if(px<-80||px>W+80){if(gateOn&&tau<.12)stall(f,true);return;}
      const s2=sc*(.8+vl(f.lane)*.05);const walkPre=pre&&!(f.loadAt&&now>f.loadAt);const bk=pre&&f.balk&&now<f.loadAt&&now>f.loadAt-2200;
      drawHorse(c,px+(bk?Math.sin(now/90)*3:0),yLane(f.lane),s2,pre?(walkPre?now/1000*Math.PI*2*.9+f.no:f.no):gph+f.no*1.7,f.coat,f.silks,f.no,f.mine,{walk:pre,mir:MIR,drive:pre?0:clamp((tau-(1-430/D))*D/230,0,1)*(tau<1.004?1:0)});
      if(gateOn&&tau<.12)stall(f,true);
      if(f.mine)pins.push({f,x:ux(px+(bk?Math.sin(now/90)*3:0)+14*s2),y:yLane(f.lane)-57*s2,gx:ux(px+(bk?Math.sin(now/90)*3:0)),gy:yLane(f.lane),s2});});
    if(BS){// the inside rail, nearest the camera: posts and two bars across the horses' legs
      const ry=H*.805,rh=H*.062;c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,ry+rh*.15,W,4);
      c.fillStyle='#e9ece8';for(let wx=Math.floor((camX-W/k)/pStep)*pStep;wx<camX+W/k+pStep;wx+=pStep){const x=Math.round(SX(wx)+lsh(8.6));c.fillRect(x-1.5,ry-rh,3.4,rh);}
      c.fillStyle='#ffffff';c.fillRect(0,ry-rh,W,4.5);c.fillStyle='rgba(255,255,255,.8)';c.fillRect(0,ry-rh*.45,W,2.2);}
    c.restore();
    // alternate broadcast shots: the field sweeping round the 4th turn, and head-on down the straight
    const ccS=courseChar(race),turnR=Math.max(85,Math.min(130,ccS.st*.25)),remL=D-lead;
    const Pl2=((race.surf==='ダ'?CDIMD:CDIM)[race.course]||[1800])[0],past=((Pl2-((remL%Pl2)+Pl2)%Pl2)%Pl2),R12=Math.max(80,turnR*.9);
    const shot=pre||goalT?null:(D>=1200&&remL<ccS.st+turnR*Math.PI*.45&&remL>ccS.st-Math.min(110,ccS.st*.35))?'corner':(lead>past+20&&past>70&&past<100+R12*Math.PI*.9&&remL>ccS.st+turnR*Math.PI)?'corner12':null;
    window.__cam={remL,shot,MIR,lead:Math.round(lead)};
    if(shot!==SHOT){SHOT=shot;cutT=now;drawCornerShot.s=null;drawCornerShot.trees=null;}
    if(shot==='corner12')drawCornerShot(c,W,H,{fld,remOf:f=>160+((Pl2-(((D-posX(f,tau))%Pl2)+Pl2)%Pl2)%Pl2)-100,st:160,R:R12,gph,SK,trackCol,dirt,now,m0,RH:!RHC.includes(race.course),race,away:true});
    if(shot==='corner')drawCornerShot(c,W,H,{fld,remOf:f=>D-posX(f,tau),st:ccS.st,R:turnR,gph,SK,trackCol,dirt,now,m0,RH:RHC.includes(race.course),race});
    if(shot==='turn')drawTurnShot(c,W,H,fld,f=>posX(f,tau),lead,tail,gph,SK,trackCol,now,dirt);
    if(shot==='head')drawHeadShot(c,W,H,fld,f=>posX(f,tau),D,gph,SK,trackCol,now,dirt,M(S.t));
    if(RC.rain)drawRain(c,W,H,now);
    // name pins drawn last so no other horse covers them; the tip points at the rider's cap
    for(const q of (gcOn||SHOT?[]:pins)){const f=q.f;c.font='bold 12px sans-serif';const tw=c.measureText(f.name).width+12,tipY=q.y-1,ty=tipY-26;
      c.save();c.strokeStyle='rgba(255,209,102,.95)';c.lineWidth=2;c.shadowColor='#ffd166';c.shadowBlur=6;c.beginPath();c.ellipse(q.gx,q.gy+1,32*q.s2,6*q.s2,0,0,7);c.stroke();c.restore();
      let lx=clamp(q.x,tw/2+4,W-tw/2-4);if(ty<H*.2+19*(W<520?4:6)+10&&lx-tw/2<168)lx=Math.max(lx,168+tw/2);
      c.strokeStyle='rgba(255,209,102,.9)';c.lineWidth=1.5;c.beginPath();c.moveTo(q.x,ty+4);c.lineTo(q.x,tipY);c.stroke();
      c.fillStyle='#ffd166';c.beginPath();c.arc(q.x,tipY,2.5,0,7);c.fill();
      c.fillStyle='rgba(0,0,0,.75)';c.fillRect(lx-tw/2,ty-14,tw,18);c.fillStyle='#ffd166';c.fillRect(lx-tw/2,ty+3,tw,1.5);c.textAlign='center';c.fillText(f.name,lx,ty);}
    // outer rail (foreground, fast parallax) with a hint of motion blur
    {const pk=k*1.15,ps=[2,4,5,10,20].find(p=>p*pk>=22)||20;const blur=!pre&&tau<1.02?clamp(ts*speed*.6,0,4):0;
     c.fillStyle='#3e7a46';c.fillRect(0,H*.95,W,H*.05);
     for(let wx=Math.floor((camX*1.15-W/pk)/ps)*ps;wx<camX*1.15+W/pk+ps;wx+=ps){const x=Math.round(W*.5+(wx-camX*1.15)*pk);c.fillStyle='rgba(244,244,240,.95)';c.fillRect(x-1.5,H*.93,3+blur,H*.07);if(blur){c.fillStyle='rgba(244,244,240,.25)';c.fillRect(x+1.5,H*.93,blur*3,H*.07);}}
     c.fillStyle='#f6f6f2';c.fillRect(0,H*.925,W,4);c.fillStyle='rgba(0,0,0,.15)';c.fillRect(0,H*.925+4,W,2);}
    if(cutT&&now-cutT<260){c.fillStyle=`rgba(0,0,0,${.85*(1-(now-cutT)/260)})`;c.fillRect(0,0,W,H);}
    // the finish: freeze the moment the winner hits the line and push in on it
    if(gcOn&&!zc&&now-goalT>80){zc=document.createElement('canvas');zc.width=cv.width;zc.height=cv.height;zc.getContext('2d').drawImage(cv,0,0);RC.goalShot={cv:zc,full:true,W,H};}
    const rem=Math.max(0,Math.round((D-lead)/10)*10);
    if(m0&&!pre&&!goalT){const rem2=D-dl;[[330,'a'],[210,'b'],[110,'c'],[45,'d']].forEach(([r,k])=>{if(rem2<r&&!RC['sh'+k]){RC['sh'+k]=1;const p=pos(cur,m0),n=cur.length;
      const own=p===1?pick(['そのまま…そのまま！','行けー！！そのまま！！','粘れー！！']):p<=3?pick(['行けー！！','差せ！差せー！！',`${hNick(m0.name)}ー！！`]):p<=6?pick(['まだ届く！行けー！！','外だ！外から来い！！']):pick(['頼む……！','まだだ、まだ…！']);
      shout(own,ownerNm(),true);if(k==='b'||k==='d')setTimeout(()=>shout(pick([`${m0.jname.split(' ')[0]}さん、頼む！！`,'来てる、来てます！！','行け、行けーっ！！']),'三國',false),500);}});}
    shouts=shouts.filter(q=>now-q.t<1600);
    shouts.forEach((q,i)=>{const a=(now-q.t)/1600,sc2=a<.12?.6+a/.12*.45:1.05-Math.max(0,a-.12)*.05,al=a>.75?1-(a-.75)/.25:1;
      const fsz=Math.min(q.big?clamp(W/16,18,34):clamp(W/24,13,22),W*.36/Math.max(3,q.txt.length))*sc2,x=q.side?W*.71:W*.29,y=H*(.24+(i%2)*.1);c.save();c.globalAlpha=al;c.translate(x,y);c.rotate(q.side?.05:-.05);
      c.font=`900 ${fsz}px "Dela Gothic One","Zen Kaku Gothic New",sans-serif`;const tw=c.measureText(q.txt).width;
      // jagged shout balloon
      c.fillStyle=q.big?'#fff':'#fff6dc';c.strokeStyle='#111';c.lineWidth=2.5;c.beginPath();const rx=tw/2+fsz*.7,ry=fsz*1.05;for(let k=0;k<=24;k++){const th=k/24*Math.PI*2,rr=k%2?.86:1.08;const px=Math.cos(th)*rx*rr,py=Math.sin(th)*ry*rr;k?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();c.fill();c.stroke();
      c.fillStyle=q.big?'#d0242c':'#1b2fa3';c.textAlign='center';c.textBaseline='middle';c.fillText(q.txt,0,1);c.textBaseline='alphabetic';
      c.font=`bold ${Math.max(9,fsz*.38)}px sans-serif`;c.fillStyle='#111';c.fillText(q.who,-rx*.55,-ry*.75);c.restore();});
    // broadcast graphics (bottom band like the real TV feed) + elapsed time
    if(!gcOn)drawBroadcastHUD(c,W,H,{fld,posX:f=>posX(f,tau),tau,lead,tail,m0,cur,RC,race,D,MIR,pre,now,goalT,lh:Math.max(40,H*.12)});
    if(tutT&&now-tutT<4500){const t='残り距離の印が金色に入ったら「追い出せ！」';c.font='bold 13px sans-serif';const tw=Math.min(W-20,c.measureText(t).width+20);c.fillStyle='rgba(196,120,47,.95)';c.fillRect(W/2-tw/2,H*.4,tw,26);c.fillStyle='#fff';c.textAlign='center';c.fillText(t,W/2,H*.4+18);}
    if(gcOn){c.fillStyle='rgba(0,0,0,.88)';c.fillRect(0,0,W,H*.08);c.fillRect(0,H*.92,W,H*.08);c.fillStyle='#e0262d';c.beginPath();c.arc(16,H*.04,4,0,7);c.fill();c.fillStyle='#fff';c.font='bold 11px sans-serif';c.textAlign='left';c.fillText('GOAL CAM',24,H*.04+4);c.textAlign='right';c.fillText(`${RC.order[0].no}  ${RC.order[0].name}`,W-12,H*.04+4);}
    // lower third commentary
    if(call){const lh=Math.max(40,H*.12);c.save();c.translate(0,-(H-lh));c.fillStyle='rgba(8,16,12,.5)';c.fillRect(0,H-lh,W,lh);c.fillStyle='#c4782f';c.fillRect(0,H-lh,4,lh);
      c.fillStyle='#fff';c.font=`bold ${Math.max(11,Math.min(clamp(W/34,13,20),(W-30)/Math.max(1,call.length)*1.02))}px "Shippori Mincho B1",serif`;c.textAlign='left';const age=(now-callT)/1000;const n=Math.min(call.length,Math.floor(age*28)+1);{const txt=call.slice(0,n),fs=parseFloat(c.font.match(/(\d+(\.\d+)?)px/)[1]);if(c.measureText(call).width>W-28){const cut=Math.ceil(call.length/2);const ln1=txt.slice(0,cut),ln2=txt.slice(cut);c.font=c.font.replace(/[\d.]+px/,Math.max(11,Math.min(fs*1.15,(W-30)/cut*1.02))+'px');c.fillText(ln1,16,H-lh/2-2);c.fillText(ln2,16,H-lh/2+fs+1);}else c.fillText(txt,16,H-lh/2+6);}}c.restore();
    if(spurtMsg&&now-spurtT<1800){c.fillStyle='rgba(196,120,47,.9)';c.font='bold 15px sans-serif';const tw=c.measureText(spurtMsg).width+20;c.fillRect(W/2-tw/2,H*.27,tw,26);c.fillStyle='#fff';c.textAlign='center';c.fillText(spurtMsg,W/2,H*.27+18);}
    // goal flash
    if(goalT&&goalT!==1){const a=(now-goalT)/1000;if(a<.18){c.fillStyle=`rgba(255,255,255,${.8-a*4})`;c.fillRect(0,0,W,H);}
      c.textAlign='center';c.font=`900 ${clamp(W/9,34,72)}px "Shippori Mincho B1",serif`;c.lineWidth=6;c.strokeStyle='rgba(0,0,0,.6)';const tx=photo&&a>1.1?'写真判定…':'ゴール！';c.strokeText(tx,W/2,H*.3);c.fillStyle=RC.order[0].mine?'#ffd166':'#fff';c.fillText(tx,W/2,H*.3);}
    // sound
    const running=now>started&&tau<1.04;
    if(pre&&SND.nodes){const roar=big&&now>T0+fanMs-400&&now<T0+fanMs+2600;sndCrowd(roar?.34:now>readyAt?.01:.05);if(big&&fl&&now<T0+fanMs-500&&now-(RC.clapT||0)>420){RC.clapT=now;sndClap();}}
    sndHoofs(running&&!paused,2.15*Math.min(1,ts)*(goalT?.5:1),running?clamp(.55+(k-4)*.06,.45,1.1)*(goalT?.7:1):0);
    sndCrowd(now<started?(now>readyAt?.012:.05):tau<.75?.025:tau<1?.025+(tau-.75)*(ts>1?.2:.6):Math.max(.03,.2-((now-(goalT||now))/1000)*.04));
    if(speed>1&&!goalT){c.fillStyle='rgba(0,0,0,.5)';c.fillRect(W-74,H*.3,66,16);c.fillStyle='#fff';c.font='bold 10px sans-serif';c.textAlign='center';c.fillText('早送り中',W-41,H*.3+12);}
    const endAt=goalT&&goalT!==1?(photo?5000:3900):0;
    if(goalT===1||(goalT&&now-goalT>endAt)){ANIM=null;sndStop();setTimeout(showBoard,goalT===1?0:200);return;}
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
ACT.spurt=()=>{ANIM&&ANIM.spurt&&ANIM.spurt();};
ACT.cheer=()=>{ANIM&&ANIM.cheer&&ANIM.cheer();};
ACT.spurtOk=()=>{ANIM&&ANIM.resume&&ANIM.resume();};
ACT.snd=(d,b)=>{SND.on=!SND.on;try{localStorage.setItem('kure-snd',SND.on?'1':'0');}catch(e){}if(!SND.on)sndStop();else{sndInit();sndStart();}if(b){b.classList.toggle('on',SND.on);b.setAttribute('aria-pressed',SND.on);}};
document.addEventListener('keydown',e=>{if((e.code==='Space'||e.key==='Enter')&&ANIM&&$('#spurt')&&!$('#spurt').hidden&&!$('#spurt').classList.contains('idle')){e.preventDefault();if($('#sptut')&&!$('#sptut').hidden)ACT.spurtOk();else ACT.spurt();}});

ACT.voice=(d,b)=>{VOICE_ON=!VOICE_ON;try{localStorage.setItem('kure-voice',VOICE_ON?'1':'0');}catch(e){}if(!VOICE_ON)spStop();if(b){b.classList.toggle('on',VOICE_ON);b.setAttribute('aria-pressed',VOICE_ON);}};

/* ---------- 払戻金 ---------- */
function wakuOf(no,n){if(n<=8)return no;const ex=n-8;let c=0;for(let w=1;w<=8;w++){c+=w>8-ex?2:1;if(no<=c)return w;}return 8;}
function payouts(RC){
  const fld=RC.field,n=fld.length,ord=RC.order;
  const tot=fld.reduce((a,f)=>a+.8/f.odds,0);const pri=f=>1/(Math.pow(f.pop,1.15)+1.6);const ptot=fld.reduce((a,f)=>a+pri(f),0);
  const p={};fld.forEach(f=>p[f.no]=.45*(.8/f.odds)/tot+.55*pri(f)/ptot);
  const P2=(i,j)=>p[i]*p[j]/(1-p[i]);
  const P3=(i,j,k)=>p[i]*p[j]/(1-p[i])*p[k]/(1-p[i]-p[j]);
  const yen=(pr,tk=.775)=>Math.max(100,Math.round(tk/Math.max(pr,1e-6)*100/10)*10);
  const [a,b,c]=ord.slice(0,3).map(f=>f.no);const show=n>=8?3:2;
  const plc=no=>{let s=0;fld.forEach(x=>{if(x.no===no)return;s+=P2(x.no,no);});return Math.min(.97,p[no]+s+(show===3?p[no]*.9:0));};
  const out={};
  out.tan=[[String(a),Math.max(110,Math.round(ord[0].odds*10)*10)]];
  out.fuku=ord.slice(0,show).map(f=>[String(f.no),Math.max(110,Math.round(.8/plc(f.no)*100/10)*10)]);
  const wa=wakuOf(a,n),wb=wakuOf(b,n);const w1=Math.min(wa,wb),w2=Math.max(wa,wb);
  let pw=0;fld.forEach(x=>fld.forEach(y=>{if(x.no===y.no)return;const u=wakuOf(x.no,n),v=wakuOf(y.no,n);if(Math.min(u,v)===w1&&Math.max(u,v)===w2)pw+=P2(x.no,y.no);}));
  out.waku=n>=9?[[`${w1} - ${w2}`,yen(pw)]]:null;
  const s2=(i,j)=>[Math.min(i,j),Math.max(i,j)].join(' - ');
  out.uren=[[s2(a,b),yen(P2(a,b)+P2(b,a))]];
  const wide=(i,j)=>{let s=P2(i,j)+P2(j,i);fld.forEach(x=>{if(x.no===i||x.no===j)return;s+=P3(i,j,x.no)+P3(j,i,x.no)+P3(i,x.no,j)+P3(j,x.no,i)+P3(x.no,i,j)+P3(x.no,j,i);});return s;};
  out.wide=[[s2(a,b),yen(wide(a,b))],[s2(a,c),yen(wide(a,c))],[s2(b,c),yen(wide(b,c))]];
  out.utan=[[`${a} → ${b}`,yen(P2(a,b))]];
  const t=[a,b,c].sort((x,y)=>x-y);
  out.fuku3=[[t.join(' - '),yen(P3(a,b,c)+P3(a,c,b)+P3(b,a,c)+P3(b,c,a)+P3(c,a,b)+P3(c,b,a),.75)]];
  out.tan3=[[`${a} → ${b} → ${c}`,yen(P3(a,b,c),.725)]];
  return out;
}
function payBoard(RC){
  const po=payouts(RC);const m=RC.field.find(f=>f.mine);const mno=m?m.no:-1;
  const hit=s=>m&&s.split(/[^0-9]+/).filter(Boolean).map(Number).includes(mno);
  const rows=(lab,cls,list)=>list?list.map((x,i)=>`<div class="pr">${i===0?`<span class="pl ${cls}" style="grid-row:span ${list.length}">${lab}</span>`:''}<span class="pc ${hit(x[0])&&cls!=='wk'?'hit':''}">${x[0]}</span><span class="pv num">${x[1].toLocaleString()}円</span></div>`).join(''):'';
  return `<div class="payboard" aria-label="払戻金"><div class="ph"><span>${esc(RC.race.course)}　${esc(RC.race.name)}${RC.race.g?`（${RC.race.grade}）`:''}</span><span>払戻金</span></div>
   <div class="pg2"><div>${rows('単 勝','c-tan',po.tan)}${rows('複 勝','c-fuku',po.fuku)}</div><div>${po.waku?rows('枠 連','c-waku',po.waku):''}${rows('ワイド','c-wide',po.wide)}</div></div>
   ${rows('馬 連','c-uren',po.uren)}${rows('馬 単','c-utan',po.utan)}${rows('3連複','c-f3',po.fuku3)}${rows('3連単','c-t3',po.tan3)}
   <div class="pk">確定</div></div>`;
}
