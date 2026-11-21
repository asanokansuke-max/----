/* =========================================================
   ファンファーレ: 関東（東京・中山・新潟・福島・北海道ほか）と関西（京都・阪神・中京・小倉）で別の曲。
   G1 と 重賞でも別。どれもオリジナルの曲（JRAの実際の旋律は使っていない）で、
   実際の生演奏に近い響きにする: トランペットの旋律に、ホルン・トロンボーンの和音、
   ティンパニ、スネアのロール、最後のシンバル。音の出だしは少ししゃくり上げる（金管らしさ）。
   notes: [midi, start(beat), length(beat), vel]; chords: [start, length, [midi...]]
   ========================================================= */
const FAN2={
  eastG1:{bpm:108,len:24.5,
    lead:[[65,0,.25],[65,.25,.25],[65,.5,.25],[70,.75,1.25],[65,2,.25],[65,2.25,.25],[65,2.5,.25],[74,2.75,1.25],[65,4,.25],[70,4.25,.25],[74,4.5,.25],[77,4.75,2.25],
      [77,7,.5],[82,7.5,1],[81,8.5,.5],[79,9,.75],[77,9.75,.25],[75,10,.5],[74,10.5,.5],[72,11,1.5],
      [72,12.5,.5],[74,13,.75],[75,13.75,.25],[77,14,.75],[79,14.75,.25],[81,15,1],[82,16,.75],[84,16.75,.25],[86,17,2],[84,19,.5],[82,19.5,.5],[82,20,4.5,1.1]],
    key:[10,0,2,3,5,7,9],harmFrom:7,
    chords:[[.75,1.25,[46,53]],[2.75,1.25,[46,53]],[4.75,2.25,[46,53,58,62]],[7,2,[46,53,58,62]],[9,1,[51,58,63,67]],[10,1,[53,57,60]],[11,1.5,[41,53,57,60]],
      [12.5,1.5,[48,55,63]],[14,1,[53,57,60,63]],[15,1,[53,57,60]],[16,1,[51,58,63]],[17,2,[46,53,58,62]],[19,1,[53,57,60,63]],[20,4.5,[34,46,53,58,62,65]]],
    timp:[[.75,1,46],[2.75,1,46],[4.75,1,41],[7,.8,46],[11,.8,41],[17,.9,46],[20,1.2,46]],timpRoll:[[19,1,41]],
    snareRoll:[[0,.75,.35],[2,.75,.35],[4,.75,.45],[18.5,1.5,.8]],snare:[[.75,.7],[2.75,.7],[4.75,.8],[7,.5],[20,1]],cym:[[4.75,.6],[20,1]]},
  westG1:{bpm:96,len:21.5,
    low:[[51,0,.75],[58,.75,.25],[63,1,1],[62,2,.5],[60,2.5,.5],[58,3,2]],
    lead:[[70,5,.25],[70,5.25,.25],[75,5.5,1],[79,6.5,.5],[82,7,1.5],[80,8.5,.5],[79,9,.5],[77,9.5,.5],[79,10,2],
      [79,12,.75],[80,12.75,.25],[82,13,.75],[84,13.75,.25],[86,14,1.5],[84,15.5,.5],[82,16,1],[87,17,4.5,1.1]],
    key:[3,5,7,8,10,0,2],harmFrom:5,
    chords:[[5,1.5,[51,58,63]],[6.5,2,[51,58,63,67]],[8.5,1.5,[56,60,63]],[10,2,[51,58,63]],[12,1,[48,55,60,63]],[13,1,[56,60,63]],[14,2,[46,58,62,65]],[16,1,[46,58,62,68]],[17,4.5,[39,51,58,63,67,70,75]]],
    timp:[[1,1,39],[3,.9,46],[5,1,39],[7,.8,39],[10,.8,46],[14,.9,46],[17,1.2,39]],timpRoll:[[0,1,39],[16,1,46]],
    snareRoll:[[4,1,.5],[15.5,1.5,.85]],snare:[[5,.8],[12,.5],[17,1]],cym:[[5,.7],[17,1]]},
  eastG2:{bpm:126,len:8,
    lead:[[70,0,.25],[70,.25,.25],[74,.5,.5],[77,1,.5],[82,1.5,1],[81,2.5,.5],[79,3,.5],[77,3.5,.5],[79,4,.5],[81,4.5,.5],[82,5,3,1.1]],
    key:[10,0,2,3,5,7,9],harmFrom:1.5,
    chords:[[.5,1,[46,53]],[1.5,1.5,[46,53,58]],[3,1,[51,58,63]],[4,1,[53,57,60]],[5,3,[34,46,53,58,62]]],
    timp:[[.5,.8,46],[1.5,.8,46],[4,.7,41],[4.5,.8,41],[5,1.1,46]],timpRoll:[],snareRoll:[[4,1,.6]],snare:[[1.5,.6],[5,1]],cym:[[5,.8]]},
  westG2:{bpm:116,len:8,
    lead:[[63,0,.5],[70,.5,.5],[75,1,1],[74,2,.5],[72,2.5,.5],[74,3,.5],[75,3.5,.5],[77,4,1],[82,5,3,1.1]],
    key:[3,5,7,8,10,0,2],harmFrom:1,
    chords:[[0,1,[39,51]],[1,1,[51,58]],[2,1,[56,60]],[3,1,[53,58]],[4,1,[58,62,65]],[5,3,[39,51,58,63,67]]],
    timp:[[0,.8,39],[1,.8,39],[4,.9,46],[5,1.1,39]],timpRoll:[],snareRoll:[[4,1,.6]],snare:[[1,.5],[5,1]],cym:[[5,.8]]},
};
const FAN_WEST=['京都','阪神','中京','小倉'];
function fanKey(race){if(!race)return null;const g1=/G1/.test(race.grade||''),gr=g1||race.g||/G[23]/.test(race.grade||'');if(!gr)return null;
  const west=FAN_WEST.includes(race.course);return (west?'west':'east')+(g1?'G1':'G2');}
function fanLenOf(race){const k=fanKey(race);if(!k)return 8;const f=FAN2[k];return f.len*60/f.bpm;}
/* a third below in the key (second trumpet) */
function third(m,key){for(let d=3;d<=4;d++){if(key.includes(((m-d)%12+12)%12))return m-d;}return m-3;}
function fanNoise(ac){if(SND._nz&&SND._nz.ctx===ac)return SND._nz.buf;const b=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;SND._nz={ctx:ac,buf:b};return b;}
function playFanfare(f,vol){if(!SND.ac||!SND.on)return 0;const ac=SND.ac,t0=ac.currentTime+.12,b=60/f.bpm;
  const comp=ac.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=5;comp.attack.value=.002;comp.release.value=.2;const lim=ac.createDynamicsCompressor();lim.threshold.value=-4;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=.001;lim.release.value=.1;const out=ac.createGain();out.gain.value=vol;out.connect(comp);comp.connect(lim);lim.connect(ac.destination);
  try{brassIR(ac);comp.connect(SND._ir.rv);}catch(e){}
  // the brass: [time, midi, length, vel, voice]
  const N=[];f.lead.forEach(([m,s,l,v=1])=>{N.push([s,m,l,v,'tp']);if(s>=f.harmFrom&&l>=.5)N.push([s,third(m,f.key),l,v*.6,'tp2']);});
  (f.low||[]).forEach(([m,s,l,v=1])=>{N.push([s,m,l,v,'tb']);N.push([s,m-12,l,v*.7,'tb']);});
  f.chords.forEach(([s,l,ms])=>ms.forEach(m=>N.push([s,m,l,m<50?.7:.55,m<55?'tb':'hn'])));
  N.sort((a,c)=>a[0]-c[0]);
  const VO={tp:{c:2900,q:1.4,g:.2,w:[[-7,'sawtooth',.5],[7,'sawtooth',.5],[0,'square',.15]]},tp2:{c:2300,q:1.2,g:.15,w:[[-5,'sawtooth',.5],[5,'sawtooth',.45]]},
    hn:{c:1100,q:.8,g:.12,w:[[-4,'sawtooth',.4],[0,'triangle',.6]]},tb:{c:900,q:1,g:.16,w:[[-5,'sawtooth',.55],[5,'sawtooth',.5]]}};
  const make=([s,m,l,v,vo])=>{const P=VO[vo],ts=Math.max(t0+s*b,ac.currentTime+.02),te=t0+(s+l)*b,fr=mf(m);
    const lp=ac.createBiquadFilter();lp.type='lowpass';lp.Q.value=P.q;lp.frequency.setValueAtTime(P.c*.25,ts);lp.frequency.linearRampToValueAtTime(P.c*v,ts+.05);lp.frequency.setTargetAtTime(P.c*.62,ts+.09,.25);
    const g=ac.createGain();g.gain.setValueAtTime(0,ts);g.gain.linearRampToValueAtTime(P.g*v*1.25,ts+.03);g.gain.setTargetAtTime(P.g*v,ts+.05,.12);
    if(l>1.4){g.gain.setTargetAtTime(P.g*v*1.15,ts+.4,.6);}g.gain.setValueAtTime(P.g*v,Math.max(ts+.06,te-.05));g.gain.linearRampToValueAtTime(0,te+.1);
    P.w.forEach(([dt,ty,a])=>{const o=ac.createOscillator();o.type=ty;o.frequency.setValueAtTime(fr*.985,ts);o.frequency.linearRampToValueAtTime(fr,ts+.045);o.detune.value=dt;
      if(l>1.4&&vo!=='tb'){const vib=ac.createOscillator();vib.frequency.value=5.4;const vg=ac.createGain();vg.gain.setValueAtTime(0,ts);vg.gain.linearRampToValueAtTime(5,ts+.7);vib.connect(vg);vg.connect(o.detune);vib.start(ts);vib.stop(te+.15);}
      const og=ac.createGain();og.gain.value=a;o.connect(og);og.connect(lp);o.start(ts);o.stop(te+.15);});
    lp.connect(g);g.connect(out);};
  let i=0;const pump=()=>{const lim=ac.currentTime+.9;let k=0;while(i<N.length&&(t0+N[i][0]*b<lim||k<3)&&k<8){make(N[i++]);k++;}if(i<N.length)setTimeout(pump,i<8?40:150);};pump();
  // percussion
  const nz=fanNoise(ac);
  const snare=(t,v)=>{const s=ac.createBufferSource();s.buffer=nz;s.playbackRate.value=.8+Math.random()*.4;const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=2400;bp.Q.value=.7;const hp=ac.createBiquadFilter();hp.type='highpass';hp.frequency.value=700;
    const g=ac.createGain();g.gain.setValueAtTime(.32*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.16);s.connect(bp);bp.connect(hp);hp.connect(g);g.connect(out);s.start(t,Math.random()*1.5);s.stop(t+.2);
    const o=ac.createOscillator();o.frequency.setValueAtTime(200,t);o.frequency.exponentialRampToValueAtTime(140,t+.06);const og=ac.createGain();og.gain.setValueAtTime(.18*v,t);og.gain.exponentialRampToValueAtTime(.001,t+.08);o.connect(og);og.connect(out);o.start(t);o.stop(t+.1);};
  const timpH=(t,v,m)=>{const fr=mf(m);[[1,.5],[1.5,.18],[1.98,.08]].forEach(([h,a])=>{const o=ac.createOscillator();o.type='sine';o.frequency.setValueAtTime(fr*h*1.02,t);o.frequency.exponentialRampToValueAtTime(fr*h,t+.12);const g=ac.createGain();g.gain.setValueAtTime(a*v,t);g.gain.exponentialRampToValueAtTime(.001,t+1.3);o.connect(g);g.connect(out);o.start(t);o.stop(t+1.35);});
    const s=ac.createBufferSource();s.buffer=nz;const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=600;const g=ac.createGain();g.gain.setValueAtTime(.12*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.07);s.connect(lp);lp.connect(g);g.connect(out);s.start(t,Math.random());s.stop(t+.1);};
  const cym=(t,v)=>{const s=ac.createBufferSource();s.buffer=nz;const hp=ac.createBiquadFilter();hp.type='highpass';hp.frequency.value=5200;const g=ac.createGain();g.gain.setValueAtTime(.2*v,t);g.gain.exponentialRampToValueAtTime(.001,t+2.6);s.connect(hp);hp.connect(g);g.connect(out);s.start(t);s.stop(t+2.7);};
  f.snareRoll.forEach(([s,l,v])=>{const n=Math.round(l*8);for(let k=0;k<n;k++)snare(t0+(s+k/8)*b,v*(.35+.65*k/n));});
  f.snare.forEach(([s,v])=>snare(t0+s*b,v));
  f.timp.forEach(([s,v,m])=>timpH(t0+s*b,v,m));
  f.timpRoll.forEach(([s,l,m])=>{const n=Math.round(l*6);for(let k=0;k<n;k++)timpH(t0+(s+k/6)*b,.25+.5*k/n,m);});
  f.cym.forEach(([s,v])=>cym(t0+s*b,v));
  return f.len*60/f.bpm;}
fanfare=function(race){const k=fanKey(race);if(!k||!SND.ac||!SND.on)return 0;return playFanfare(FAN2[k],race.key==='有馬記念'?.7:.58);};
r3dInput=(o=>function(RC){const inp=o.apply(this,arguments);try{inp.fanLen=fanLenOf(RC.race);}catch(e){}return inp;})(r3dInput);
/* 重賞 (not G1): the 3D broadcast has no starter scene, so the fanfare sounds as the gate-in begins */
r3dInput=(o=>function(RC){const inp=o.apply(this,arguments);try{const k=fanKey(RC.race);inp.fanG=!!k&&RC.race.grade!=='G1';}catch(e){}return inp;})(r3dInput);
