/* =========================================================
   最初の一頭の放牧地を3Dで: 放牧地の場面を開くと、絵の枠の中で3Dの放牧地（夕方・木の柵・騎手のいない2歳が三頭）が開く。
   芦毛が駆け出す合図で、3Dの芦毛が柵の前まで走ってくる。3Dが開くまでは、これまでの絵。
   ========================================================= */
function farmDoc(){const hex=c=>/^#[0-9a-f]{6}$/i.test(c||'')?c:'#888888',sk=S.silks||{a:'#1f3a8a',b:'#f2b705',p:''};
  const fld=[['鹿毛','#2f5d3a','#f2f2ee'],['栗毛','#7a1f24','#f2f2ee'],['芦毛',hex(sk.a),hex(sk.b)]].map(([coat,a,b],i)=>({no:i+1,name:'',a,b,p:'',coat,used:'先行',j:'',bl:null,mg:'',gapL:0,odds:5,mine:i===2}));
  const inp={course:'sapporo',dist:1800,surf:'芝',going:'良',grade:'',race:'',tod:'evening',title:'',mon:M(S.t),field:fld,mode:'farm',warmed:true};
  return R3D_HTML.replace('<script type="importmap">','<script>window.RACE_IN='+JSON.stringify(inp).replace(/</g,'\\u003c')+';<\/script><script type="importmap">');}
function farmMount(){try{if(typeof R3D_HTML!=='string'||window.__noShot)return;const cv=document.getElementById('fhcv');if(!cv||document.getElementById('farmif'))return;
  const box=document.createElement('div');box.className='fhv';cv.parentNode.insertBefore(box,cv);box.appendChild(cv);
  const f=document.createElement('iframe');f.id='farmif';f.setAttribute('aria-hidden','true');f.tabIndex=-1;f.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;pointer-events:none;opacity:0;transition:opacity .6s;border-radius:12px';box.appendChild(f);f.srcdoc=farmDoc();
  /* no drawn picture in the meantime: a dusk-coloured frame says the field is coming; the grey waits for the 3D field */
  cv.style.visibility='hidden';box.insertAdjacentHTML('beforeend','<div class="fhwait">放牧地へ…</div>');FH.wait3d=true;
  clearTimeout(FH.w3t);FH.w3t=setTimeout(()=>{if(!FH.ok3d){cv.style.visibility='';box.querySelectorAll('.fhwait').forEach(x=>x.remove());const x=document.getElementById('farmif');if(x)x.remove();FH.wait3d=false;if(FH.go)FH.go();}},12000);
  }catch(e){console.error('farm3d',e);}}
addEventListener('message',e=>{const d=e.data||{};if(d.type!=='race3d-farmready')return;const f=document.getElementById('farmif');if(!f||f.contentWindow!==e.source)return;FH.ok3d=1;f.style.opacity=1;document.querySelectorAll('.fhwait').forEach(x=>x.remove());FH.wait3d=false;if(FH.done)farmRun();else if(FH.go)setTimeout(()=>{if(FH.go)FH.go();},700);});
function farmRun(){const f=document.getElementById('farmif');if(f)try{f.contentWindow.postMessage({type:'farm',cmd:'run'},'*');}catch(e){}}
/* open: the 3D farm comes up in the picture's place; the run is passed on when the grey breaks */
fhRender=(o=>function(txt){const had=!!document.getElementById('farmif');const r=o.apply(this,arguments);try{if(!had)farmMount();if(FH.done&&!FH.ranSent&&document.getElementById('farmif')){FH.ranSent=1;farmRun();}}catch(e){}return r;})(fhRender);
fhOpen=(o=>function(){FH.ranSent=0;FH.wait3d=false;FH.ok3d=0;return o.apply(this,arguments);})(fhOpen);
(function(){const st=document.createElement('style');st.textContent=`.fhv{position:relative;border-radius:12px;overflow:hidden;background:linear-gradient(#e9c9a0,#a88e6a 55%,#4c6b3d 56%,#33502a)}.fhwait{position:absolute;left:0;right:0;bottom:12px;text-align:center;color:#fff;font:700 13px "Zen Kaku Gothic New",sans-serif;letter-spacing:.12em;text-shadow:0 1px 3px rgba(0,0,0,.6);animation:fhw 1.4s ease-in-out infinite}@keyframes fhw{50%{opacity:.4}}`;document.head.appendChild(st);})();
