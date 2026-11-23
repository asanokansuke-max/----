/* =========================================================
   最初の一頭は「馬に選ばれる」:
   日高・中原牧場の放牧地。夕方、2歳が三頭。柵にもたれて、じっと待つ／声をかける／手を差し出す。
   あわてて手を出すと芦毛は離れていく。待てば少しずつ寄ってくる。芦毛が自分から鼻を押しつけてきたら、その馬が最初の一頭。
   寄ってくるまでの付き合い方で、最初の絆が決まる。そのあと預ける厩舎を選ぶ（600万円）。
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`.fhs{display:grid;gap:10px}
.fhs canvas{display:block;width:100%;aspect-ratio:16/10;border-radius:12px;background:#9fc1e0}
.fhs .nar{min-height:9.5em;font-size:14px;line-height:1.75;white-space:pre-wrap}
.fhs .nar b{color:var(--gold,#b8862a)}
.fhs .acts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.fhs .acts .btn{min-height:48px;padding:6px 4px;font-size:14px}
.fhs .acts.two{grid-template-columns:1fr}
.fhs .fhact{min-height:112px}
.fhs .hint{font-size:11px;opacity:.6;text-align:center}`;document.head.appendChild(st);})();

EV.firstHorse={r:()=>({p:'nakahara',from:'中原 修造',title:'最初の一頭',body:`日高。中原牧場は、海の見える丘の上にあった。\n\n「中原です。遠いところをよく来なさった」\n\n日焼けした男は、それだけ言うと放牧地のほうへ顎をしゃくった。\n\n「うちで生まれた2歳が三頭おる。…わしが選ぶより、馬に選ばせたほうがいい」`,ch:['放牧地へ行く']}),
  f:()=>{S.flags.fhScene=1;setTimeout(()=>fhOpen(),30);return '';}};

const FH={};
function fhOpen(){if(!S||S.horses.some(h=>h.first)){if(S)S.flags.fhScene=0;return;}
  Object.assign(FH,{ready:0,d:1,turn:0,miss:0,call:0,done:false,stable:0,ph:0,gz:null,gxx:null,chX:.25,chZ:.35,chDir:1,bayX:.42,handT:0,nuzzle:0});
  if(FH.seen){FH.done=true;FH.ready=1;FH.d=0;FH.gz=.97;FH.bond=15;FH.nuzzle=performance.now();fhRender('芦毛は、柵の前であなたを待っていた。\n\n中原「こいつが選んだんだ。600万でいい。預ける厩舎は、あんたが決めてくれ」');fhLoop();return;}FH.seen=1;
  fhRender('柵にもたれると、草の匂いがした。\n\n鹿毛は草を食んでいる。栗毛は落ち着きなく歩き回っている。\n奥の芦毛だけが、じっとこちらを見ていた。');fhLoop();
  /* no waiting game: after a moment the grey runs up to the fence by itself */
  const run=FH.run=(FH.run||0)+1;FH.go=()=>{FH.go=null;setTimeout(()=>{if(FH.run!==run||FH.stable)return;FH.done=true;FH.d=0;FH.nuzzle=performance.now();FH.bond=15;
    fhRender('芦毛が、ふいに駆け出した。\nまっすぐこちらへ。');
    setTimeout(()=>{if(FH.run!==run||FH.stable)return;FH.ready=1;FH.nuzzle=performance.now();fhRender('柵の前で止まると、鼻先を押しつけてきた。温かい息。\n\n中原は、しばらく黙っていた。\n<b>「…そいつが人に寄っていくのは、初めて見た」</b>\n「こいつが選んだんだ。600万でいい。預ける厩舎は、あんたが決めてくれ」');},2300);},1600);};/* with the 3D field, the grey waits until the field is up */if(!FH.wait3d)FH.go();}
function fhRender(txt){const acts=!FH.ready?'':FH.done?`<div class="acts two">${FH.stable?'':`<button class="btn pri" data-act="fhStable" data-i="0">戸川厩舎に預ける（美浦・大舞台をじっくり狙う）</button><button class="btn pri" data-act="fhStable" data-i="1">早瀬厩舎に預ける（栗東・数を使って鍛える）</button>`}</div>`
   :`<div class="acts"><button class="btn" data-act="fhDo" data-k="wait">じっと待つ</button><button class="btn" data-act="fhDo" data-k="call">声をかける</button><button class="btn pri" data-act="fhDo" data-k="hand">手を差し出す</button></div><div class="hint">あわてると、馬は逃げていく</div>`;
  const box=document.querySelector('#sheet .fhs');if(box&&document.getElementById('fhcv')){box.querySelector('.nar').innerHTML=txt;const ac=box.querySelector('.fhact');if(ac)ac.innerHTML=acts;return;}
  openModal(`<div class="from-line">日高・中原牧場　放牧地</div><div class="fhs"><canvas id="fhcv" width="640" height="400"></canvas><div class="nar">${txt}</div><div class="fhact">${acts}</div></div>`,{lock:true,keepScroll:true});}
ACT.fhDo=d=>{if(FH.done)return;const k=d.k;FH.turn++;let t='';
  if(k==='wait'){FH.d=Math.max(0,FH.d-.28-Math.random()*.06);t=FH.d>.6?'息をひそめて待つ。\n芦毛の耳が、ぴんとこちらを向いた。':FH.d>.3?'芦毛が、一歩、また一歩と近づいてくる。\n蹄が草を踏む音だけが聞こえる。':'芦毛は柵のすぐ向こうで立ち止まった。\n小さく鼻を鳴らしている。…今かもしれない。';}
  else if(k==='call'){FH.call++;if(FH.d>.6){FH.d-=.12;FH.chZ=Math.min(.8,FH.chZ+.3);t='声をかけると、芦毛は首を上げた。\n…先に寄ってきたのは栗毛のほうだった。\n中原「そいつは誰にでも寄っていく」';}else{FH.d=Math.max(0,FH.d-.1);t='低い声で、ゆっくり話しかける。\n芦毛の耳が、こちらを向いたまま動かない。';}}
  else{if(FH.d<=.36){fhWin(false);return;}FH.miss++;FH.d=Math.min(1,FH.d+.25);FH.handT=performance.now();t=FH.miss>1?'また手を伸ばしてしまった。\n芦毛は首を振って、放牧地の奥へ戻っていく。\n中原「…馬は、待つ人のところに来る」':'手を伸ばした瞬間、芦毛はびくっと首を振って離れた。\n中原「…あわてるな」';}
  if(!FH.done&&FH.turn>=7){FH.d=0;fhWin(true);return;}
  fhRender(t);};
function fhWin(late){FH.done=true;FH.d=0;FH.nuzzle=performance.now();FH.bond=late?10:Math.max(8,22-FH.miss*5-(FH.call>2?2:0));
  fhRender((late?'日が傾いてきた。\nあきらめかけたとき、芦毛が自分から柵のところまで来た。\n':'')+'芦毛が、ふいに駆け出した。\nまっすぐこちらへ。柵の前で止まると、鼻先を押しつけてきた。温かい息。\n\n中原は、しばらく黙っていた。\n<b>「…そいつが人に寄っていくのは、初めて見た」</b>\n「こいつが選んだんだ。600万でいい。預ける厩舎は、あんたが決めてくれ」');}
ACT.fhStable=d=>{if(FH.stable)return;FH.stable=1;S.flags.fh=2;S.flags.fhPrice=600;S.flags.fh2T=-1;S.flags.fhScene=0;let out='';
  try{out=EV.firstHorse2.f({},+d.i);const h=S.horses.find(x=>x.first);if(h)h.bond=FH.bond||12;}catch(e){console.error('fh',e);}
  FH.stop=1;save();render();openModal(`<div class="letter">${esc(out)}</div><div class="row"><span class="sp"></span><button class="btn pri" data-act="evnext">${S.inbox.length?'次へ':'閉じる'}</button></div>`,{lock:true});};
/* reload in the middle: the paddock opens again */
render=(o=>function(){const r=o.apply(this,arguments);try{if(S&&S.flags&&S.flags.fhScene&&!S.horses.some(h=>h.first)&&$('#modal').hidden&&!document.getElementById('opening')&&!FH.on)setTimeout(()=>{if($('#modal').hidden&&!FH.on)fhOpen();},60);}catch(e){}return r;})(render);

/* the paddock at evening */
function fhLoop(){FH.on=true;FH.stop=0;let last=performance.now();const step=now=>{const cv=document.getElementById('fhcv');if(!cv||FH.stop){FH.on=false;return;}const dt=Math.min(.05,(now-last)/1000);last=now;fhDraw(cv,now/1000,dt);requestAnimationFrame(step);};requestAnimationFrame(step);}
function fhDraw(cv,T,dt){const c=cv.getContext('2d'),W=cv.width,H=cv.height,HZ=H*.42;
  // sky and hills
  let g=c.createLinearGradient(0,0,0,HZ);g.addColorStop(0,'#7fa6cf');g.addColorStop(.6,'#e9c9a0');g.addColorStop(1,'#f4d7a6');c.fillStyle=g;c.fillRect(0,0,W,HZ+2);
  c.fillStyle='rgba(255,236,190,.85)';c.beginPath();c.arc(W*.82,HZ*.78,22,0,7);c.fill();
  c.fillStyle='#7c9a83';c.beginPath();c.moveTo(0,HZ);for(let x=0;x<=W;x+=20)c.lineTo(x,HZ-18-Math.sin(x/90)*10-Math.sin(x/37)*4);c.lineTo(W,HZ);c.fill();
  c.fillStyle='#5f8a5c';c.beginPath();c.moveTo(0,HZ+4);for(let x=0;x<=W;x+=20)c.lineTo(x,HZ-6-Math.sin(x/140+1)*8);c.lineTo(W,HZ+4);c.fill();
  g=c.createLinearGradient(0,HZ,0,H);g.addColorStop(0,'#86a85a');g.addColorStop(1,'#4f7a36');c.fillStyle=g;c.fillRect(0,HZ,W,H-HZ);
  // the far fence
  c.strokeStyle='rgba(250,245,235,.75)';c.lineWidth=1.5;c.beginPath();c.moveTo(0,HZ+10);c.lineTo(W,HZ+10);c.moveTo(0,HZ+16);c.lineTo(W,HZ+16);c.stroke();for(let x=10;x<W;x+=46){c.beginPath();c.moveTo(x,HZ+8);c.lineTo(x,HZ+20);c.stroke();}
  // horses: x 0..1 across, z 0 (far) .. 1 (at the fence)
  const yOf=z=>HZ+14+z*(H*.5),sOf=z=>.55+z*1.65;
  FH.chX+=FH.chDir*dt*.05;if(FH.chX>.5||FH.chX<.1)FH.chDir*=-1;FH.chZ+=(.35-FH.chZ)*dt*.15;
  /* the grey: walks a little closer each time you wait; when it chooses you it breaks into a canter and runs up to the fence; startled, it turns and trots off */
  const gz=FH.done?.97:.12+(1-FH.d)*.68;if(FH.gz==null)FH.gz=gz;const diff=gz-FH.gz,moving=Math.abs(diff)>.008,run=moving&&(FH.done||diff<-.05);
  FH.gz+=Math.sign(diff)*Math.min(Math.abs(diff),dt*(run?(FH.done?.42:.35):.14));FH.gflip=moving?diff>0:(FH.gflip??true);FH.grun=run;FH.ph+=dt*(run?10:moving?5:.6);
  FH.gxx=.8-FH.gz*.36;
  const list=[{x:FH.bayX+Math.sin(T*.1)*.02,z:.22,coat:'鹿毛',ph:T*.8,walk:true,flip:false},{x:FH.chX,z:FH.chZ,coat:'栗毛',ph:T*4.5,walk:true,flip:FH.chDir<0},{x:FH.gxx,z:FH.gz,coat:'芦毛',ph:FH.ph,walk:!FH.grun,flip:FH.gflip}];
  list.sort((a,b)=>a.z-b.z).forEach(h=>{try{drawHorse(c,h.x*W,yOf(h.z),sOf(h.z),h.ph,h.coat,null,0,false,{nj:true,bare:true,walk:h.walk,flip:h.flip});}catch(e){}});
  // the near fence (we lean on it)
  const fy=H*.86;c.fillStyle='#7a5a3a';c.fillRect(0,fy,W,10);c.fillRect(0,fy+26,W,10);c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,fy+8,W,3);c.fillRect(0,fy+34,W,3);
  c.fillStyle='#6a4c30';for(let x=30;x<W;x+=150)c.fillRect(x,fy-14,14,H-fy+14);
  // the hand reaching out
  /* no hand drawn: on success, only the grey's breath puffs at the fence */
  if(FH.done){const sc=sOf(FH.gz||.5),mx=FH.gxx*W-46*sc,my=yOf(FH.gz||.5)-34*sc,k=((performance.now()-FH.nuzzle)/1000)%1.6;if(k<1){c.fillStyle=`rgba(255,255,255,${.35*(1-k)})`;c.beginPath();c.arc(mx-k*18,my-k*6,4+k*10,0,7);c.fill();}}
  if(FH.done){const a=Math.min(1,(performance.now()-FH.nuzzle)/1500);c.fillStyle=`rgba(255,220,160,${.18*a})`;c.fillRect(0,0,W,H);}}
