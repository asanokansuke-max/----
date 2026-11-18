/* =========================================================
   顔: an illustrated portrait for every person (original, drawn from parts).
   avatar() now shows the face; the secretary slot shows whoever you hired.
   ========================================================= */
const FACES={
 mikuni:   {sx:'m',age:38,skin:'#f1c9a5',hair:'#1d1a18',hs:'side',eye:'round',brow:1,mouth:'calm',glasses:'#2b2f36',wear:'suit',cloth:'#2b3a55',tie:'#3d5a80'},
 shiraishi:{sx:'f',age:29,skin:'#f6d2b6',hair:'#6b3f26',hs:'bob',eye:'big',brow:1,mouth:'smile',wear:'blouse',cloth:'#f3e6d8',acc:'pen'},
 sakaki:   {sx:'m',age:61,skin:'#e8bf98',hair:'#b9b6b0',hs:'swept',eye:'narrow',brow:2,mouth:'smile',wrinkle:2,wear:'cardigan',cloth:'#6b5b3e'},
 sakuraba: {sx:'f',age:26,skin:'#f4cfb0',hair:'#221a17',hs:'pony',eye:'sharp',brow:1,mouth:'calm',wear:'jacket',cloth:'#2a4d43'},
 togawa:   {sx:'m',age:66,skin:'#d9a57c',hair:'#9c9893',hs:'bald',eye:'narrow',brow:3,mouth:'stern',wrinkle:3,wear:'jumper',cloth:'#4b5a3a'},
 hayase:   {sx:'f',age:34,skin:'#f3ccab',hair:'#3a2418',hs:'long',eye:'sharp',brow:1,mouth:'smile',wear:'wind',cloth:'#b5476a'},
 washio:   {sx:'m',age:41,skin:'#d8a47c',hair:'#151313',hs:'buzz',eye:'sharp',brow:3,mouth:'stern',beard:'stubble',scar:1,wear:'leather',cloth:'#2a2420'},
 hinata:   {sx:'m',age:22,skin:'#f3cdaa',hair:'#7a4a22',hs:'fluffy',eye:'big',brow:1,mouth:'grin',blush:1,wear:'hoodie',cloth:'#d08c2a'},
 kido:     {sx:'m',age:36,skin:'#eec39d',hair:'#2a221c',hs:'short',eye:'round',brow:1,mouth:'smile',wear:'polo',cloth:'#577590'},
 rossi:    {sx:'m',age:33,skin:'#d9a97f',hair:'#2a1c14',hs:'wavy',eye:'round',brow:2,mouth:'grin',beard:'trim',wear:'open',cloth:'#9d2a2a'},
 sanada:   {sx:'m',age:29,skin:'#f0caa8',hair:'#0f0f12',hs:'sleek',eye:'narrow',brow:1,mouth:'calm',wear:'turtle',cloth:'#33415c'},
 kiryu:    {sx:'f',age:24,skin:'#f0c7a2',hair:'#7b2d1d',hs:'boyish',eye:'sharp',brow:2,mouth:'smirk',wear:'track',cloth:'#c1121f'},
 oba:      {sx:'m',age:45,skin:'#c98d62',hair:'#1c1714',hs:'perm',eye:'round',brow:3,mouth:'grin',wear:'polo',cloth:'#bc6c25',round:1},
 dubois:   {sx:'m',age:31,skin:'#f6dcc6',hair:'#d9b56a',hs:'swept',eye:'round',brow:1,mouth:'smile',wear:'scarf',cloth:'#386fa4',eyeCol:'#3f6e9e'},
 komori:   {sx:'f',age:19,skin:'#f8d6bd',hair:'#4a2b1d',hs:'bobclip',eye:'big',brow:1,mouth:'shy',blush:1,wear:'hoodie',cloth:'#e07a9a'},
 kuroiwa:  {sx:'m',age:48,skin:'#b98058',hair:'#3a3734',hs:'cap',eye:'narrow',brow:2,mouth:'calm',beard:'stubble',wrinkle:1,wear:'work',cloth:'#606c38',capCol:'#2f3a22'},
 arai:     {sx:'m',age:39,skin:'#cf9a70',hair:'#181412',hs:'crew',eye:'sharp',brow:3,mouth:'calm',wear:'jacket',cloth:'#8d6346'},
 nakahara: {sx:'m',age:68,skin:'#cf9670',hair:'#e9e6e0',hs:'short',eye:'narrow',brow:2,mouth:'calm',must:1,wrinkle:3,wear:'flannel',cloth:'#4a7c59'},
 kujo:     {sx:'m',age:58,skin:'#e8c3a0',hair:'#7d7a78',hs:'slick',eye:'sharp',brow:2,mouth:'smirk',must:1,wrinkle:1,wear:'suit',cloth:'#1d1626',tie:'#5b2a86'},
 koyanagi: {sx:'m',age:35,skin:'#efc6a3',hair:'#2b211b',hs:'short',eye:'round',brow:1,mouth:'calm',glasses:'#6b4a2e',wear:'jumper',cloth:'#8a5a3a'},
 mio:      {sx:'f',age:27,skin:'#f0c5a1',hair:'#3a2418',hs:'pony',eye:'big',brow:1,mouth:'grin',blush:1,wear:'work',cloth:'#3f9a6a'},
 rei:      {sx:'m',age:31,skin:'#f2d0b2',hair:'#14121a',hs:'slick',eye:'narrow',brow:1,mouth:'calm',glasses:'#1b1b22',wear:'suit',cloth:'#22202c',tie:'#7b2cbf'},
};
function faceKey(id){return id==='mikuni'&&typeof S!=='undefined'&&S&&S.sec?S.sec:id;}
function faceSVG(key,bg,mood){let F=FACES[key];if(!F)return '';
  // mood: happy (smiles), cold (stern), sad (worried brows, mouth turned down), joy (big grin)
  if(mood){F={...F};if(mood==='happy')F.mouth=F.mouth==='grin'?'grin':'smile';else if(mood==='joy')F.mouth='grin';else if(mood==='cold'){F.mouth='stern';F.brow=Math.max(2,F.brow||1);}else if(mood==='sad'){F.mouth='frown';F.worry=1;}}const k=key,sk=F.skin,sd=shade(sk,-.18),hc=F.hair,hd=shade(hc,-.25),hl=shade(hc,.25);
  const old=F.age>=55,f=F.sx==='f',rx=F.round?19:f?16:17.2,ry=f?19.5:20.5,cx=50,cy=47;let s='';
  // background
  s+=`<circle cx="50" cy="50" r="50" fill="${bg||'#cfd6dc'}"/><circle cx="50" cy="38" r="40" fill="rgba(255,255,255,.18)"/>`;
  s+='<g transform="translate(50 57) scale(1.24) translate(-50 -52)">';
  // long hair behind
  if(F.hs==='long')s+=`<path d="M30 44 C28 70 30 86 36 92 L64 92 C70 86 72 70 70 44 Z" fill="${hd}"/>`;
  if(F.hs==='bob'||F.hs==='bobclip')s+=`<path d="M31 42 C29 58 31 66 35 68 L65 68 C69 66 71 58 69 42 Z" fill="${hd}"/>`;
  if(F.hs==='pony')s+=`<path d="M64 34 C78 36 80 52 74 66 C72 58 70 48 64 44 Z" fill="${hd}"/>`;
  // clothes & shoulders
  const cl=F.cloth,cd=shade(cl,-.22);
  s+=`<path d="M6 102 C8 84 24 77 50 77 C76 77 92 84 94 102 Z" fill="${cl}"/>`;
  s+=`<rect x="44" y="60" width="12" height="19" rx="5" fill="${sd}"/>`;
  const W=F.wear;
  if(W==='suit')s+=`<path d="M38 78 L50 96 L62 78 L56 77 L50 86 L44 77 Z" fill="#f5f3ee"/><path d="M48 82 L52 82 L53 98 L50 101 L47 98 Z" fill="${F.tie}"/><path d="M38 78 L46 100 L30 100 Z M62 78 L54 100 L70 100 Z" fill="${cd}" opacity=".55"/>`;
  if(W==='blouse')s+=`<path d="M41 78 L50 90 L59 78 Z" fill="${sk}"/><path d="M41 78 L50 90 L59 78" fill="none" stroke="${cd}" stroke-width="1.4"/>`;
  if(W==='cardigan')s+=`<path d="M42 78 L50 92 L58 78 Z" fill="#e8e2d4"/><path d="M50 92 L50 102" stroke="${cd}" stroke-width="1.5"/><circle cx="47" cy="96" r="1.1" fill="${cd}"/><circle cx="53" cy="99" r="1.1" fill="${cd}"/>`;
  if(W==='jacket')s+=`<path d="M40 78 L50 92 L60 78 Z" fill="#f2efe8"/><path d="M40 78 L47 100 L32 100 Z M60 78 L53 100 L68 100 Z" fill="${cd}" opacity=".6"/>`;
  if(W==='jumper'||W==='wind'||W==='track')s+=`<path d="M42 77 C44 82 56 82 58 77" fill="none" stroke="${cd}" stroke-width="3"/><path d="M50 81 L50 102" stroke="${cd}" stroke-width="1.6"/>${W==='track'?`<path d="M24 86 L32 102 M76 86 L68 102" stroke="#fff" stroke-width="2.5"/>`:''}`;
  if(W==='leather')s+=`<path d="M40 77 L46 96 L36 100 Z M60 77 L54 96 L64 100 Z" fill="${shade(cl,.15)}"/><path d="M44 78 L50 88 L56 78 Z" fill="#3a3a3a"/>`;
  if(W==='hoodie')s+=`<path d="M34 80 C38 74 62 74 66 80 C60 84 40 84 34 80 Z" fill="${cd}"/><path d="M46 84 L45 96 M54 84 L55 96" stroke="#fff" stroke-width="1.2"/>`;
  if(W==='polo')s+=`<path d="M41 77 L50 84 L59 77 L58 82 L50 88 L42 82 Z" fill="${shade(cl,.2)}"/><path d="M50 86 L50 94" stroke="${cd}" stroke-width="1.4"/>`;
  if(W==='open')s+=`<path d="M42 77 L50 90 L58 77 Z" fill="${sd}"/><path d="M42 77 L48 92 L38 96 Z M58 77 L52 92 L62 96 Z" fill="#f4f1ea"/>`;
  if(W==='turtle')s+=`<rect x="41" y="70" width="18" height="11" rx="5" fill="${shade(cl,.1)}"/>`;
  if(W==='scarf')s+=`<path d="M38 76 C44 82 56 82 62 76 L60 84 C54 88 46 88 40 84 Z" fill="#e3d6b2"/><path d="M52 84 L56 100 L50 100 Z" fill="#d1c39a"/>`;
  if(W==='work')s+=`<path d="M41 77 L50 85 L59 77 L58 83 L50 90 L42 83 Z" fill="${shade(cl,.25)}"/><rect x="34" y="88" width="9" height="7" rx="1" fill="${cd}"/>`;
  if(W==='flannel')s+=`<path d="M41 77 L50 85 L59 77 L58 83 L50 90 L42 83 Z" fill="${shade(cl,.25)}"/><g stroke="${cd}" stroke-width="1.2" opacity=".7"><path d="M14 92 H86 M18 86 H82 M30 80 V102 M70 80 V102 M40 88 V102 M60 88 V102"/></g>`;
  // ears
  s+=`<ellipse cx="${cx-rx}" cy="${cy+2}" rx="3.2" ry="4.6" fill="${sd}"/><ellipse cx="${cx+rx}" cy="${cy+2}" rx="3.2" ry="4.6" fill="${sd}"/>`;
  // head
  s+=`<path d="M${cx-rx} ${cy-4} C${cx-rx} ${cy-ry-2} ${cx+rx} ${cy-ry-2} ${cx+rx} ${cy-4} C${cx+rx} ${cy+10} ${cx+rx*.62} ${cy+ry} ${cx} ${cy+ry} C${cx-rx*.62} ${cy+ry} ${cx-rx} ${cy+10} ${cx-rx} ${cy-4} Z" fill="${sk}"/>`;
  s+=`<path d="M${cx+rx*.55} ${cy+ry*.65} C${cx+rx*.3} ${cy+ry*.95} ${cx-rx*.3} ${cy+ry*.95} ${cx-rx*.55} ${cy+ry*.65} C${cx-rx*.2} ${cy+ry*1.02} ${cx+rx*.2} ${cy+ry*1.02} ${cx+rx*.55} ${cy+ry*.65} Z" fill="${sd}" opacity=".35"/>`;
  // stubble / beard under features
  if(F.beard==='stubble')s+=`<path d="M${cx-rx+1} ${cy+4} C${cx-rx+2} ${cy+14} ${cx-8} ${cy+ry} ${cx} ${cy+ry} C${cx+8} ${cy+ry} ${cx+rx-2} ${cy+14} ${cx+rx-1} ${cy+4} C${cx+10} ${cy+12} ${cx-10} ${cy+12} ${cx-rx+1} ${cy+4} Z" fill="#2a2420" opacity=".22"/>`;
  if(F.beard==='trim')s+=`<path d="M${cx-rx+1} ${cy+3} C${cx-rx+2} ${cy+15} ${cx-8} ${cy+ry+1} ${cx} ${cy+ry+1} C${cx+8} ${cy+ry+1} ${cx+rx-2} ${cy+15} ${cx+rx-1} ${cy+3} C${cx+9} ${cy+16} ${cx-9} ${cy+16} ${cx-rx+1} ${cy+3} Z" fill="${hc}" opacity=".85"/>`;
  // cheeks
  if(F.blush||f)s+=`<ellipse cx="${cx-10}" cy="${cy+8}" rx="3.6" ry="2" fill="#ef8f86" opacity="${F.blush?.4:.22}"/><ellipse cx="${cx+10}" cy="${cy+8}" rx="3.6" ry="2" fill="#ef8f86" opacity="${F.blush?.4:.22}"/>`;
  // eyes
  const ey=cy+1,ex=7.2,ec=F.eyeCol||'#1c1612';
  const eye=x=>{if(F.eye==='narrow')return `<path d="M${x-3.2} ${ey} Q${x} ${ey-2.2} ${x+3.2} ${ey}" fill="none" stroke="${ec}" stroke-width="1.7" stroke-linecap="round"/>`;
    if(F.eye==='sharp')return `<path d="M${x-3.6} ${ey+.3} Q${x} ${ey-3.2} ${x+3.6} ${ey-.6} Q${x} ${ey+2.2} ${x-3.6} ${ey+.3} Z" fill="${ec}"/><circle cx="${x+.8}" cy="${ey-.8}" r=".8" fill="#fff"/>`;
    const r=F.eye==='big'?3.1:2.4;return `<ellipse cx="${x}" cy="${ey}" rx="${r*.85}" ry="${r}" fill="${ec}"/><circle cx="${x+.9}" cy="${ey-1}" r="${r*.33}" fill="#fff"/>${f?`<path d="M${x-r-.6} ${ey-r*.5} Q${x} ${ey-r-1.6} ${x+r+.6} ${ey-r*.6}" fill="none" stroke="#1c1612" stroke-width="1.1"/>`:''}`;};
  s+=eye(cx-ex)+eye(cx+ex);
  // brows
  const bw=[0,1.3,1.8,2.6][F.brow||1],bc=old&&F.hs!=='slick'?shade(hc,-.1):hd,st=F.mouth==='stern'?1.6:F.worry?-2.2:0;
  s+=`<path d="M${cx-ex-3.6} ${ey-5+(F.eye==='sharp'?.4:0)} Q${cx-ex} ${ey-7} ${cx-ex+3.4} ${ey-5.4+st}" fill="none" stroke="${bc}" stroke-width="${bw}" stroke-linecap="round"/><path d="M${cx+ex+3.6} ${ey-5+(F.eye==='sharp'?.4:0)} Q${cx+ex} ${ey-7} ${cx+ex-3.4} ${ey-5.4+st}" fill="none" stroke="${bc}" stroke-width="${bw}" stroke-linecap="round"/>`;
  // nose
  s+=`<path d="M${cx+.6} ${cy+3} Q${cx+2.4} ${cy+8} ${cx-.6} ${cy+9}" fill="none" stroke="${shade(sk,-.3)}" stroke-width="1.2" stroke-linecap="round"/>`;
  // mustache
  if(F.must)s+=`<path d="M${cx-6} ${cy+12.2} Q${cx} ${cy+9.2} ${cx+6} ${cy+12.2} Q${cx} ${cy+11.2} ${cx-6} ${cy+12.2} Z" fill="${F.hs==='slick'?hd:hc}" stroke="${F.hs==='slick'?hd:shade(hc,-.15)}" stroke-width="1.2"/>`;
  // mouth
  const my=cy+13.4,M=F.mouth;
  if(M==='grin')s+=`<path d="M${cx-5} ${my-1} Q${cx} ${my+5} ${cx+5} ${my-1} Z" fill="#7a2e2a"/><path d="M${cx-4} ${my-.6} H${cx+4}" stroke="#fff" stroke-width="1.2"/>`;
  else if(M==='smile')s+=`<path d="M${cx-4.4} ${my-.6} Q${cx} ${my+3.2} ${cx+4.4} ${my-.6}" fill="none" stroke="#8a3d34" stroke-width="1.5" stroke-linecap="round"/>`;
  else if(M==='smirk')s+=`<path d="M${cx-4} ${my+.4} Q${cx+1} ${my+1.6} ${cx+4.4} ${my-1.4}" fill="none" stroke="#8a3d34" stroke-width="1.5" stroke-linecap="round"/>`;
  else if(M==='stern')s+=`<path d="M${cx-4.2} ${my+.8} Q${cx} ${my-.6} ${cx+4.2} ${my+.8}" fill="none" stroke="#7a3a30" stroke-width="1.6" stroke-linecap="round"/>`;
  else if(M==='frown')s+=`<path d="M${cx-4} ${my+1.4} Q${cx} ${my-1.8} ${cx+4} ${my+1.4}" fill="none" stroke="#7a3a30" stroke-width="1.5" stroke-linecap="round"/>`;
  else if(M==='shy')s+=`<path d="M${cx-2.6} ${my} Q${cx} ${my+1.8} ${cx+2.6} ${my}" fill="none" stroke="#8a3d34" stroke-width="1.4" stroke-linecap="round"/>`;
  else s+=`<path d="M${cx-3.8} ${my} H${cx+3.8}" stroke="#8a3d34" stroke-width="1.5" stroke-linecap="round"/>`;
  // wrinkles
  if(F.wrinkle){s+=`<g fill="none" stroke="${shade(sk,-.32)}" stroke-width=".9" stroke-linecap="round" opacity=".7">`;
    s+=`<path d="M${cx-8} ${cy+8} Q${cx-9} ${cy+12} ${cx-6} ${cy+15}"/><path d="M${cx+8} ${cy+8} Q${cx+9} ${cy+12} ${cx+6} ${cy+15}"/>`;
    if(F.wrinkle>=2)s+=`<path d="M${cx-7} ${cy-12} H${cx+7}"/><path d="M${cx-11} ${ey+.5} l-2 -1.2 M${cx+11} ${ey+.5} l2 -1.2"/>`;
    if(F.wrinkle>=3)s+=`<path d="M${cx-6} ${cy-15} H${cx+6}"/><path d="M${cx-12} ${ey+2.2} l-2 .3 M${cx+12} ${ey+2.2} l2 .3"/>`;s+='</g>';}
  if(F.scar)s+=`<path d="M${cx+11} ${cy-8} L${cx+7} ${cy-2}" stroke="${shade(sk,-.35)}" stroke-width="1.2" stroke-linecap="round"/>`;
  // front hair
  const top=cy-ry-1.5,L=cx-rx-.6,R=cx+rx+.6;
  const cap=(hl,vol,fill)=>`<path d="M${L-1.2} ${cy+2} C${L-2.5} ${top-vol-6} ${R+2.5} ${top-vol-6} ${R+1.2} ${cy+2} L${R-1.6} ${cy+2} C${R-2} ${cy-hl+3} ${cx+10} ${cy-hl} ${cx} ${cy-hl} C${cx-10} ${cy-hl} ${L+2} ${cy-hl+3} ${L+1.6} ${cy+2} Z" fill="${fill||hc}"/>`;
  const scal=(n,amp,vol,hl)=>{const pts=[];for(let i=0;i<=n;i++){const a=Math.PI*(1.0+i/n);const r=1+(i%2?amp/rx:-amp*.15/rx);pts.push([cx+Math.cos(a)*(rx+vol*.6)*r,cy-1+Math.sin(a)*(ry+vol)*r]);}
    let d=`M${L-1} ${cy+2} L${pts[0][0]} ${pts[0][1]}`;for(let i=1;i<pts.length;i++){const [x0,y0]=pts[i-1],[x1,y1]=pts[i],mx=(x0+x1)/2,my=(y0+y1)/2,ox=(mx-cx)*.16,oy=(my-cy)*.16;d+=` Q${mx+ox} ${my+oy} ${x1} ${y1}`;}
    d+=` L${R+1} ${cy+2} L${R-1.6} ${cy+2} C${R-2} ${cy-hl+3} ${cx+10} ${cy-hl} ${cx} ${cy-hl} C${cx-10} ${cy-hl} ${L+2} ${cy-hl+3} ${L+1.6} ${cy+2} Z`;return `<path d="${d}" fill="${hc}"/>`;};
  const shine=(y)=>`<path d="M${cx-9} ${y} Q${cx} ${y-3.5} ${cx+9} ${y}" stroke="${hl}" stroke-width="1.6" fill="none" opacity=".45" stroke-linecap="round"/>`;
  const hp=.25*(cy+2)+.75*(top-9),H=F.hs;   // hp: just under the crown of the hair
  if(H==='side')s+=cap(9,3)+`<path d="M${cx+12} ${cy-10} C${cx} ${cy-16} ${L+3} ${cy-12} ${L+1.4} ${cy-2} L${L+3.4} ${cy-6} C${L+7} ${cy-11} ${cx-4} ${cy-12} ${cx+12} ${cy-10} Z" fill="${hc}"/><path d="M${cx-3} ${top-1} L${cx-5} ${cy-11}" stroke="${hd}" stroke-width="1"/>`+shine(hp+4);
  else if(H==='short')s+=cap(10,2.5)+`<path d="M${L+3} ${cy-7} Q${cx-6} ${cy-14} ${cx+1} ${cy-10} Q${cx+8} ${cy-15} ${R-3} ${cy-7} L${R-3} ${cy-11} Q${cx} ${cy-17} ${L+3} ${cy-11} Z" fill="${hc}"/>`+shine(hp+4);
  else if(H==='crew')s+=cap(12,1.4);
  else if(H==='buzz')s+=`<g opacity=".9">${cap(12,.8)}</g>`;
  else if(H==='bald')s+=`<path d="M${L-.6} ${cy+1} C${L-1.5} ${cy-8} ${L+1} ${cy-12} ${L+4.5} ${cy-13} L${L+5} ${cy+1} Z M${R+.6} ${cy+1} C${R+1.5} ${cy-8} ${R-1} ${cy-12} ${R-4.5} ${cy-13} L${R-5} ${cy+1} Z" fill="${hc}"/><ellipse cx="${cx-5}" cy="${cy-ry*.75+1}" rx="5.5" ry="2.4" fill="#fff" opacity=".28"/>`;
  else if(H==='swept')s+=cap(13,4.5)+`<g stroke="${hl}" stroke-width="1.1" fill="none" opacity=".6" stroke-linecap="round"><path d="M${cx-12} ${cy-12} Q${cx-4} ${top-2} ${cx+12} ${top}"/><path d="M${cx-5} ${cy-13} Q${cx+2} ${top+1} ${cx+15} ${cy-15}"/><path d="M${cx+2} ${cy-13} Q${cx+8} ${cy-17} ${R} ${cy-10}"/></g>`;
  else if(H==='slick')s+=cap(13,3.2)+`<g stroke="${hl}" stroke-width="1" fill="none" opacity=".65" stroke-linecap="round"><path d="M${L+3} ${cy-9} Q${cx} ${top-3} ${R-3} ${cy-9}"/><path d="M${L+6} ${cy-5} Q${cx} ${top+1} ${R-6} ${cy-5}"/></g>`;
  else if(H==='sleek')s+=cap(8,3)+`<path d="M${cx+12} ${top+1} C${cx-4} ${top+3} ${L+2} ${cy-8} ${L+1} ${cy+3} L${L+4} ${cy-1} C${cx-10} ${cy-7} ${cx+2} ${cy-9} ${R-2} ${cy-5} Z" fill="${hc}"/>`+shine(hp+4);
  else if(H==='fluffy')s+=scal(12,2.8,4.5,9)+`<path d="M${L+2} ${cy-7} L${L+6} ${cy-3} L${cx-8} ${cy-8} L${cx-4} ${cy-2} L${cx} ${cy-8} L${cx+5} ${cy-3} L${cx+8} ${cy-9} L${R-5} ${cy-4} L${R-2} ${cy-8} L${R-2} ${cy-12} L${L+2} ${cy-12} Z" fill="${hc}"/>`+shine(hp+4);
  else if(H==='wavy')s+=scal(10,2.4,4,10)+`<path d="M${cx-9} ${cy-11} q4.5 4 9 0 q4.5 -4 9 0" stroke="${hc}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  else if(H==='perm')s+=scal(16,1.9,3.6,11);
  else if(H==='bob'||H==='bobclip')s+=cap(8,2.5)+`<path d="M${L-.6} ${cy-4} L${L-.6} ${cy+14} L${L+3} ${cy+14} L${L+3} ${cy-6} Z M${R+.6} ${cy-4} L${R+.6} ${cy+14} L${R-3} ${cy+14} L${R-3} ${cy-6} Z" fill="${hc}"/><path d="M${L+2} ${cy-6} Q${cx} ${cy-10} ${R-2} ${cy-6} L${R-2} ${cy-10} Q${cx} ${cy-15} ${L+2} ${cy-10} Z" fill="${hc}"/>${H==='bobclip'?`<rect x="${cx+6}" y="${cy-13}" width="7" height="2.6" rx="1.3" fill="#ffd166" transform="rotate(-18 ${cx+9} ${cy-12})"/>`:''}`+shine(hp+4);
  else if(H==='pony')s+=cap(9,3)+`<path d="M${cx-2} ${top+1} C${cx-10} ${top+4} ${L+1} ${cy-8} ${L+.5} ${cy} L${L+3} ${cy-5} C${L+6} ${cy-10} ${cx-6} ${cy-11} ${cx+2} ${cy-10} C${cx+8} ${cy-11} ${R-4} ${cy-9} ${R-3} ${cy-5} L${R-.5} ${cy-1} C${R} ${cy-8} ${cx+8} ${top+3} ${cx-2} ${top+1} Z" fill="${hc}"/><circle cx="${R-.5}" cy="${cy-13}" r="2.4" fill="#d14b6b"/>`+shine(hp+4);
  else if(H==='long')s+=cap(9,3)+`<path d="M${cx+2} ${top+1} C${cx-10} ${top+3} ${L} ${cy-6} ${L-1} ${cy+12} L${L+3} ${cy+10} C${L+4} ${cy-6} ${cx-6} ${cy-10} ${cx+4} ${cy-11} C${cx+10} ${cy-10} ${R-4} ${cy-6} ${R-3} ${cy+10} L${R+1} ${cy+12} C${R} ${cy-6} ${cx+12} ${top+3} ${cx+2} ${top+1} Z" fill="${hc}"/>`+shine(hp+4);
  else if(H==='boyish')s+=cap(9,3)+`<path d="M${R-1} ${cy-8} C${cx+4} ${cy-15} ${cx-10} ${cy-11} ${L+1} ${cy} L${L+.5} ${cy-6} C${L+4} ${cy-15} ${cx+6} ${top-2} ${R} ${cy-9} Z" fill="${hc}"/>`+shine(hp+4);
  else if(H==='cap')s+=`<path d="M${L-.6} ${cy+1} C${L-.6} ${cy-8} ${L+2} ${cy-10} ${L+4} ${cy-10} L${L+4} ${cy+2} Z M${R+.6} ${cy+1} C${R+.6} ${cy-8} ${R-2} ${cy-10} ${R-4} ${cy-10} L${R-4} ${cy+2} Z" fill="${hc}"/><path d="M${L-1.5} ${cy-7} C${L-1.5} ${top-5} ${R+1.5} ${top-5} ${R+1.5} ${cy-7} Z" fill="${F.capCol}"/><path d="M${L-2} ${cy-7} Q${cx} ${cy-11} ${R+10} ${cy-5} Q${cx} ${cy-3.5} ${L-2} ${cy-7} Z" fill="${shade(F.capCol,-.25)}"/><circle cx="${cx}" cy="${top-2}" r="1.5" fill="${shade(F.capCol,-.3)}"/>`;
  // glasses
  if(F.glasses)s+=`<g fill="rgba(255,255,255,.12)" stroke="${F.glasses}" stroke-width="1.3"><rect x="${cx-ex-4.8}" y="${ey-3.8}" width="9.6" height="7.2" rx="2.4"/><rect x="${cx+ex-4.8}" y="${ey-3.8}" width="9.6" height="7.2" rx="2.4"/></g><path d="M${cx-2.4} ${ey-1} Q${cx} ${ey-2.4} ${cx+2.4} ${ey-1} M${cx-ex-4.8} ${ey-1.4} L${L} ${ey-2.4} M${cx+ex+4.8} ${ey-1.4} L${R} ${ey-2.4}" stroke="${F.glasses}" stroke-width="1.2" fill="none"/>`;
  if(F.acc==='pen')s+=`<path d="M${R-1} ${cy-2} L${R+6} ${cy-14}" stroke="#2b5fa8" stroke-width="2" stroke-linecap="round"/>`;
  s+='</g>';
  return s;}
function faceMood(id){const p=P(id);if(typeof UI!=='undefined'&&UI.talk&&UI.talk.id===id&&UI.talk.mood)return UI.talk.mood;if(!p||!p.met)return null;return p.trust>=70?'happy':p.trust<=8?'cold':null;}
function faceMarkup(id,size,mood){const k=faceKey(id);if(!FACES[k])return null;const p=P(id);mood=mood||faceMood(id);const bg=shade((p&&p.col)||(SECS[k]&&SECS[k].col)||'#888888',.55);
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" style="display:block;border-radius:50%" aria-hidden="true"><clipPath id="fc${k}${size}"><circle cx="50" cy="50" r="50"/></clipPath><g clip-path="url(#fc${k}${size})">${faceSVG(k,bg,mood)}</g></svg>`;}
avatar=(o=>function(id,size=44){const m=P(id)&&faceMarkup(id,size);if(!m)return o.apply(this,arguments);return `<span class="av face" style="width:${size}px;height:${size}px;background:none;overflow:hidden">${m}</span>`;})(avatar);
secAvatar=function(id,s){const bg=shade(SECS[id].col,.55);return `<span class="av face" style="width:${s}px;height:${s}px;overflow:hidden"><svg viewBox="0 0 100 100" width="${s}" height="${s}" style="display:block;border-radius:50%"><clipPath id="fcs${id}${s}"><circle cx="50" cy="50" r="50"/></clipPath><g clip-path="url(#fcs${id}${s})">${faceSVG(id,bg)}</g></svg></span>`;};
if(document.querySelector('#app .start .panel.form'))renderStart();

/* the face reacts to what you just said / gave */
['reply','gift','topic'].forEach(a=>{ACT[a]=(o=>function(d){const t=UI.talk,id=t&&t.id,b=id&&P(id)?P(id).trust:null;const r=o.apply(this,arguments);
  if(UI.talk&&b!=null){const dv=P(id).trust-b;UI.talk.mood=dv>=6?'joy':dv>0?'happy':dv<0?'sad':null;drawTalk();}return r;})(ACT[a]);});
