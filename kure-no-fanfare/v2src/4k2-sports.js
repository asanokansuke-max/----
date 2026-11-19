/* =========================================================
   スポーツ紙 1面、もう一段: a proper masthead and dateline, headlines with a
   gradient fill over heavy double outlines and a drop, a screen-tone burst behind
   the name, a 激走 star, and the paper's own 本紙予想 box with the bets
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
.fp .topbar{background:#fff;border-bottom:4px solid #c8161d;box-shadow:0 2px 0 #141210}
.fp .ad1.dl{background:#fff;color:#141210;border:2px solid #141210;flex-direction:column;align-items:stretch;justify-content:center;padding:1px 4px;letter-spacing:0;font-family:"Zen Kaku Gothic New",sans-serif}
.fp .dl .y{font:700 8px/1.1 "Zen Kaku Gothic New",sans-serif;display:flex;justify-content:space-between}
.fp .dl .d{font:700 21px/1 Oswald,sans-serif;letter-spacing:.01em;display:flex;align-items:baseline;gap:3px;justify-content:center}
.fp .dl .d i{font-style:normal;font:900 11px/1 "Zen Kaku Gothic New";background:#c8161d;color:#fff;padding:1px 2px;border-radius:2px}
.fp .dl .g{font:700 7px/1.2 "Zen Kaku Gothic New";display:flex;justify-content:space-between;border-top:1px solid #141210;margin-top:1px;padding-top:1px}
.fp .logo .l1{font-family:"Dela Gothic One",sans-serif;font-weight:400;font-style:italic;letter-spacing:.02em;font-size:23px;background:linear-gradient(180deg,#e8231b,#a80f12);box-shadow:inset 0 -3px 0 rgba(0,0,0,.25),2px 2px 0 #141210;transform:skewX(-6deg)}
.fp .logo .l2 span{font-family:"Dela Gothic One",sans-serif;font-weight:400;box-shadow:1px 1px 0 #141210}
.fp .tease{font-family:"Dela Gothic One",sans-serif}
/* headline: an outline layer underneath and a gradient fill layer on top */
.fp .vtxt.gfill{text-shadow:none!important;-webkit-text-stroke:0!important;color:transparent!important;-webkit-background-clip:text;background-clip:text;pointer-events:none}
.fp .h-blue.gfill{background-image:linear-gradient(90deg,#7d96ff 0%,#2a44c9 38%,#14259a 70%,#0a1560 100%)}
.fp .mainhl .h-white{color:#fff!important;-webkit-text-stroke:6px #14259a!important;paint-order:stroke fill;text-shadow:6px 7px 0 #0b1650!important}
.fp .h-red.gfill{background-image:linear-gradient(90deg,#ffd23a 0%,#ff7a1a 22%,#e3261b 55%,#9d0d07 100%)}
.fp .h-red{text-shadow:0 0 0 #fff,${(()=>{const a=[];for(let i=0;i<16;i++){const t=i/16*Math.PI*2;a.push(`${(Math.cos(t)*2.6).toFixed(1)}px ${(Math.sin(t)*2.6).toFixed(1)}px 0 #fff`);}for(let i=0;i<16;i++){const t=i/16*Math.PI*2;a.push(`${(Math.cos(t)*4.6).toFixed(1)}px ${(Math.sin(t)*4.6).toFixed(1)}px 0 #3a0503`);}return a.join(',');})()},5px 6px 0 rgba(0,0,0,.4)!important}
/* screen-tone burst behind the name */
.fp .burst{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(circle,rgba(27,47,163,.16) 1.1px,transparent 1.4px) 0 0/6px 6px,
  repeating-conic-gradient(from 0deg at 62% 42%,rgba(255,212,0,.32) 0 5deg,rgba(255,255,255,0) 5deg 12deg);
  -webkit-mask-image:radial-gradient(ellipse 70% 62% at 62% 42%,#000 35%,transparent 78%);mask-image:radial-gradient(ellipse 70% 62% at 62% 42%,#000 35%,transparent 78%)}
.fp .star{position:absolute;width:66px;height:66px;z-index:3;display:grid;place-items:center;filter:drop-shadow(2px 3px 0 rgba(0,0,0,.35));transform:rotate(-10deg)}
.fp .star svg{position:absolute;inset:0;width:100%;height:100%}
.fp .star b{position:relative;font:400 16px/1 "Dela Gothic One",sans-serif;color:#c8161d;text-align:center;letter-spacing:-.04em}
.fp .star b small{display:block;font-size:10px;color:#141210;letter-spacing:0}
/* 本紙予想 */
.fp .yoso{border:2px solid #c8161d;background:#fff}
.fp .yoso h5{margin:0;background:#c8161d;color:#fff;font:400 11px/1.5 "Dela Gothic One",sans-serif;padding:0 4px;display:flex;justify-content:space-between}
.fp .yoso h5 span{font-family:"Zen Kaku Gothic New";font-weight:900;font-size:8px}
.fp .yoso ul{list-style:none;margin:0;padding:2px 4px 1px;display:grid;gap:1px}
.fp .yoso li{display:grid;grid-template-columns:14px 15px 1fr;align-items:center;gap:3px;font-size:9px;font-weight:900;line-height:12px;white-space:nowrap;overflow:hidden}
.fp .yoso li .m{color:#c8161d;font-size:11px;text-align:center}
.fp .yoso li .n{font:700 9px/12px Oswald,sans-serif;text-align:center;border-radius:2px}
.fp .yoso li.tp{font-size:10.5px}.fp .yoso li.tp .m{font-size:13px}.fp .side .ad2{min-height:34px}
.fp .yoso .bet{border-top:1px dashed #c8161d;margin:1px 4px 0;padding:2px 0 3px;font-size:8px;font-weight:900;line-height:1.35;color:#141210}
.fp .yoso .bet b{color:#c8161d;font-family:"Dela Gothic One",sans-serif;font-weight:400;font-size:8.5px;margin-right:3px}
`;document.head.appendChild(st);})();

/* the race-day date: the Sunday of the month the game is on (3rd Sunday; the Arima on the 4th) */
function fpDate(r){const y=Y(S.t),m=M(S.t),d0=new Date(y,m-1,1),first=(7-d0.getDay())%7+1,nth=r.key==='有馬記念'?3:2;const day=first+7*nth;
  const reiwa=y-2018;return {y,m,d:Math.min(day,28),reiwa,no:(y-1990)*365+m*30+day+7000};}

frontHTML=(o=>function(){
  const html=o.apply(this,arguments);const RC=UI.race,r=RC.race,F=RC.field,d=paperData(RC),n=F.length;
  const tpl=document.createElement('div');tpl.innerHTML=html;const q=s=>tpl.querySelector(s);
  // masthead dateline instead of the club ad
  const dt=fpDate(r),ad1=q('.topbar .ad1');
  if(ad1){ad1.className='ad1 dl';ad1.innerHTML=`<div class="y"><span>${dt.y}年</span><span>令和${dt.reiwa}年</span></div><div class="d">${dt.m}.${dt.d}<i>日</i></div><div class="g"><span>第${dt.no.toLocaleString()}号</span><span>160円</span></div>`;}
  const l1=q('.logo .l1');if(l1)l1.innerHTML='ターフスポーツ';
  // headlines: duplicate each as a gradient fill on top of its outlined self
  tpl.querySelectorAll('.mainhl .h-blue,.mainhl .h-red').forEach(e=>{const c=e.cloneNode(true);c.classList.add('gfill');c.removeAttribute('id');e.after(c);});
  const mh=q('.mainhl');
  if(mh){mh.insertAdjacentHTML('afterbegin','<div class="burst"></div>');
    const hi=d.marks.findIndex(x=>x[0]==='◎'),h1=F[hi],seed=r.name+S.t+'star';
    const word=h1.pop>=6?['激走','必至']:h1.pop===1?['鉄板','宣言']:['V','宣言'];
    const nb=mh.querySelector('.nobadge'),nR=nb?parseFloat(nb.style.right)||0:0,nT=nb?parseFloat(nb.style.top)||300:300;
    mh.insertAdjacentHTML('beforeend',`<div class="star" style="right:${Math.min(292-66,nR+62)}px;top:${Math.max(0,nT-46)}px;left:auto;bottom:auto"><svg viewBox="0 0 100 100"><polygon points="${[...Array(24)].map((_,k)=>{const a=k/24*Math.PI*2-Math.PI/2,rr=k%2?36:50;return (50+Math.cos(a)*rr).toFixed(1)+','+(50+Math.sin(a)*rr).toFixed(1);}).join(' ')}" fill="#ffd400" stroke="#c8161d" stroke-width="3"/></svg><b>${word[0]}<small>${word[1]}</small></b></div>`);}
  // the number badge in the horse's frame colour (枠色): white 1枠 with a black number, black 2枠, red 3枠 … pink 8枠
  {const nb=q('.mainhl .nobadge'),hi=d.marks.findIndex(x=>x[0]==='◎'),h1=F[hi];if(nb&&h1){const w=wakuOf(h1.no,n),c=FRAMEC[w-1],t=FRAMET[w-1];
    const sh=(hex,k)=>{const v=parseInt(hex.slice(1),16),f=x=>Math.max(0,Math.min(255,Math.round(x*k)));return `rgb(${f(v>>16)},${f((v>>8)&255)},${f(v&255)})`;};
    const ring=w===1?'#141210':sh(c,.55),hiC=w===2?'#555':sh(c,1.25);
    nb.style.background=`radial-gradient(circle at 38% 32%,${hiC},${c} 58%,${sh(c,w===1?.86:.78)} 100%)`;nb.style.color=t;
    nb.style.boxShadow=`0 0 0 3px ${ring},4px 4px 0 3px rgba(0,0,0,.28)`;nb.style.webkitTextStroke=`1.5px ${t==='#fff'?ring:'#fff'}`;nb.style.textShadow='none';}}
  // 本紙予想 replaces the second side box
  const sb=tpl.querySelectorAll('.side .sbox');
  if(sb[1]){const by=m=>F.map((f,i)=>({f,m:d.marks[i][0]})).filter(x=>x.m===m).map(x=>x.f);
    const rows=[['◎',by('◎')],['○',by('○')],['▲',by('▲')],['△',by('△')],['☆',by('☆')]].flatMap(([m,fs])=>fs.map(f=>({m,f}))).slice(0,5);
    const li=rows.map(({m,f},k)=>{const w=wakuOf(f.no,n);return `<li class="${k?'':'tp'}"><span class="m">${m}</span><span class="n" style="background:${FRAMEC[w-1]};color:${FRAMET[w-1]}">${f.no}</span><span>${esc(f.name)}</span></li>`;}).join('');
    const A=rows[0]&&rows[0].f.no,others=rows.slice(1).map(x=>x.f.no),o2=others.slice(0,2);
    const bet=A?`<b>馬連</b>${A}-${others.join('.')}<br><b>3連単</b>${A}→${o2.join('.')}→${others.join('.')}`:'';
    sb[1].outerHTML=`<div class="sbox yoso"><h5>本紙予想<span>高木 ◎的中率${(20+Math.floor(hh(r.name+'yo')*16))}%</span></h5><ul>${li}</ul><div class="bet">${bet}</div></div>`;}
  return tpl.innerHTML;})(frontHTML);
/* the photo caption bars and the article column stop short of the headline block, and the headline sits on top */
(function(){const st=document.createElement('style');st.textContent=`
.fp .mainhl{z-index:4}
.fp .cap1{width:244px}.fp .cap2{width:244px}
.fp .body{width:120px}`;document.head.appendChild(st);})();
/* centre the number in the badge by its actual ink (the display face sits its digits off the em box's centre) */
function fpCenterBadge(){const nb=document.querySelector('#fpwrap .nobadge');if(!nb)return;const cs=getComputedStyle(nb),font=`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const go=()=>{const c=document.createElement('canvas').getContext('2d');c.font=font;c.textAlign='center';c.textBaseline='alphabetic';const t=nb.textContent.trim(),m=c.measureText(t);
    const fA=m.fontBoundingBoxAscent,fD=m.fontBoundingBoxDescent,A=m.actualBoundingBoxAscent,D=m.actualBoundingBoxDescent;if(!(fA>0))return;
    const dy=-((fA-fD)/2+(D-A)/2),dx=-(m.actualBoundingBoxRight-m.actualBoundingBoxLeft)/2;
    nb.innerHTML=`<span style="display:block;line-height:1;transform:translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)">${t}</span>`;
    const sp=nb.firstChild,lh=parseFloat(cs.fontSize);sp.style.lineHeight=(fA+fD)/lh;};
  (document.fonts&&document.fonts.load?document.fonts.load(font).then(go,go):go());}
{const pa=ACT.paper;ACT.paper=d=>{const r=pa(d);fpCenterBadge();return r;};}
