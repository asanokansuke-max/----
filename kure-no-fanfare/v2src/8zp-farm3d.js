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
  if(FH.done)FH.farmRun=1;}catch(e){console.error('farm3d',e);}}
addEventListener('message',e=>{const d=e.data||{};if(d.type!=='race3d-farmready')return;const f=document.getElementById('farmif');if(!f||f.contentWindow!==e.source)return;f.style.opacity=1;if(FH.done)farmRun();});
function farmRun(){const f=document.getElementById('farmif');if(f)try{f.contentWindow.postMessage({type:'farm',cmd:'run'},'*');}catch(e){}}
/* open: the 3D farm comes up in the picture's place; the run is passed on when the grey breaks */
fhRender=(o=>function(txt){const had=!!document.getElementById('farmif');const r=o.apply(this,arguments);try{if(!had)farmMount();if(FH.done&&!FH.ranSent&&document.getElementById('farmif')){FH.ranSent=1;farmRun();}}catch(e){}return r;})(fhRender);
fhOpen=(o=>function(){FH.ranSent=0;return o.apply(this,arguments);})(fhOpen);
(function(){const st=document.createElement('style');st.textContent=`.fhv{position:relative;border-radius:12px;overflow:hidden}`;document.head.appendChild(st);})();
