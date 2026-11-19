/* =========================================================
   頭数: fields of different sizes, as in real racing —
   big G1s fill to 18, small summer tracks and lower grades run smaller fields;
   and the race caller says the words the way people do
   ========================================================= */
function fieldSize(race){const k=race.key||race.name||'',small=['札幌','函館','福島','小倉'].includes(race.course);
  const seed=(hash(k+S.t)*1000)|0,pick=(lo,hi)=>lo+seed%(hi-lo+1);
  if(race.key==='有馬記念')return 16;
  if(/ダービー|東京優駿|オークス|菊花賞|天皇賞|ジャパンC|宝塚|安田|マイルCS|スプリンターズ|ヴィクトリア|NHKマイル|桜花賞|皐月賞|エリザベス|高松宮|秋華賞|朝日杯|阪神JF|ホープフル|チャンピオンズ|フェブラリー/.test(k))return small?16:pick(16,18);
  if(race.grade==='G1')return pick(16,18);
  if(race.grade==='G2'||race.grade==='G3')return Math.min(small?16:18,pick(11,18));
  if(race.grade==='新馬')return Math.min(small?14:18,pick(8,16));
  if(race.grade==='未勝利')return Math.min(small?16:18,pick(12,18));
  if(race.grade==='OP')return pick(8,16);
  return Math.min(small?16:18,pick(9,16));}
buildField=(o=>function(race,ents){if(!race.nSet){race.nSet=1;race.n=Math.max(fieldSize(race),(ents||[]).length+2);}return o.apply(this,arguments);})(buildField);

/* 読み: the device voice misreads racing words and riders' names; give it the reading */
const YOMI=[['鞍上','あんじょう'],['末脚','すえあし'],['好位','こうい'],['縦長','たてなが'],['稍重','ややおも'],['不良馬場','ふりょうばば'],['内から','うちから'],['内を','うちを'],['内で','うちで'],['内に','うちに'],['最内','さいうち'],['大外','おおそと'],['外から','そとから'],['外に','そとに'],['逃げ','にげ'],['行き場','いきば'],['手応え','てごたえ'],['持ったまま','もったまま'],['仕掛け','しかけ'],['馬群','ばぐん'],['先行争い','せんこうあらそい'],['中団','ちゅうだん'],['最後方','さいこうほう'],['番手','ばんて'],['馬身','ばしん'],['頭差','あたまさ'],['ハナ差','はなさ'],['単騎','たんき'],['淀','よど'],['小倉','こくら'],['府中','ふちゅう'],
  ['鷲尾','わしお'],['日向','ひなた'],['城戸','きど'],['真田','さなだ'],['桐生','きりゅう'],['大庭','おおば'],['小森','こもり'],['黒岩','くろいわ'],['新井','あらい'],['丸山','まるやま'],['佐伯','さえき'],['森田','もりた'],['菅原','すがわら'],['岡部','おかべ'],['西村','にしむら'],['荻野','おぎの'],['今井','いまい'],['永瀬','ながせ'],['津田','つだ'],['国分','こくぶ'],['古賀','こが'],['石動','いするぎ'],['白川','しらかわ'],['坂東','ばんどう'],['真壁','まかべ'],['高森','たかもり'],['早川','はやかわ'],['久住','くすみ'],['藤代','ふじしろ'],['柏木','かしわぎ'],['森永','もりなが'],['上原','うえはら'],['吉岡','よしおか'],['浅野','あさの'],['宮下','みやした'],['滝本','たきもと'],['水谷','みずたに'],['黒田','くろだ'],['三國','みくに'],['九条','くじょう'],['中原','なかはら'],['戸川','とがわ'],['早瀬','はやせ'],['柴原','しばはら'],['北見','きたみ'],['小柳','こやなぎ']];
function yomi(t){let s=String(t);YOMI.forEach(([a,b])=>{s=s.split(a).join(b);});return s.replace(/(\d+)番/g,'$1ばん').replace(/(\d+)頭/g,'$1とう');}
speak=(o=>function(t,f){return o.call(this,yomi(t),f);})(speak);

/* 男性の声: prefer a male Japanese voice (Otoya, Hattori, and the iOS 17 voices Reed / Rocko / Eddy);
   if the device only has a female one, read lower so the call sounds like a race caller */
const MALE_PREF=['Otoya','Hattori','Reed','Rocko','Eddy','Grandpa','Daichi','Keita','Ichiro','Naoki','Takumi'];
pickMaleVoice=(o=>function(v){let saved=null;try{saved=localStorage.getItem('kure-voice-name');}catch(e){}const s=saved&&v.find(x=>x.name===saved);if(s)return {v:s,male:MALE_RE.test(s.name)||MALE_PREF.some(n=>s.name.includes(n))};
  for(const n of MALE_PREF){const m=v.find(x=>x.name.includes(n));if(m)return {v:m,male:true};}return o.apply(this,arguments);})(pickMaleVoice);
if(typeof SpeechSynthesisUtterance!=='undefined'){const SU=SpeechSynthesisUtterance;window.SpeechSynthesisUtterance=function(t){const u=new SU(t);
  setTimeout(()=>{},0);const fix=()=>{try{const v=u.voice||null,male=v&&(MALE_RE.test(v.name)||MALE_PREF.some(n=>v.name.includes(n)));if(!male){u.pitch=Math.min(u.pitch||1,.62);u.rate=(u.rate||1)*.96;}}catch(e){}};
  const sp=speechSynthesis.speak.bind(speechSynthesis);u.__fix=fix;return u;};window.SpeechSynthesisUtterance.prototype=SU.prototype;
  const sp0=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=u=>{try{u.__fix&&u.__fix();}catch(e){}return sp0(u);};}

/* パドック解説: one clear board instead of a caption that keeps fading in and out */
(function(){const st=document.createElement('style');st.textContent=`
.padrep{border-radius:12px;overflow:hidden;border:1px solid #1f3a2a;background:#0f1d15;color:#eef3ef}
.padrep .hd{display:flex;align-items:center;gap:8px;padding:8px 12px;background:linear-gradient(180deg,#1d5a37,#164a2d);font-weight:800;font-size:13px}
.padrep .hd small{margin-left:auto;font-weight:500;font-size:11px;opacity:.8}
.padrep .pi{display:grid!important;grid-template-columns:26px minmax(0,1fr) 40px;gap:3px 10px;align-items:center;text-align:left;padding:9px 12px;border-top:1px solid rgba(255,255,255,.08)}
.padrep .pi.me{background:rgba(242,183,5,.12);box-shadow:inset 3px 0 0 #f2b705}
.padrep .no{grid-column:1;grid-row:1/3;width:24px;height:24px;border-radius:4px;display:grid;place-items:center;font:700 13px Oswald,sans-serif;box-shadow:0 0 0 1px rgba(0,0,0,.4)}
.padrep .nm{grid-column:2;grid-row:1;font-weight:800;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.padrep .nm small{font-weight:500;font-size:11px;opacity:.7;margin-left:6px}
.padrep .kh{grid-column:3;grid-row:1/3;text-align:center;font:700 10px "Zen Kaku Gothic New",sans-serif;opacity:.85}
.padrep .kh b{display:block;font:700 20px/1 Oswald,sans-serif}
.padrep .kh.A b{color:#7ee08a}.padrep .kh.B b{color:#cfe78a}.padrep .kh.C b{color:#f2d27a}.padrep .kh.D b{color:#f29a7a}
.padrep .cm{grid-column:2;grid-row:2;font-size:12.5px;line-height:1.5;color:#cfdad3}
.padrep .bw{font:600 11px Oswald,sans-serif;opacity:.85;margin-right:6px}.padrep .bw .up{color:#7cc6ff}.padrep .bw .dn{color:#ff9f80}
.padrep .ft{padding:8px 12px;font-size:12px;line-height:1.5;color:#cfdad3;border-top:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03)}`;document.head.appendChild(st);})();
function padGrade(f){const c=f.cond,t=f.temper==='気難しい'?-1:0,bw=bodyWeight(f),big=Math.abs(bw.d)>=8?-1:0,v=c+t+big;return v>=5?'A':v>=4?'B':v>=3?'C':'D';}
showPaddock=(o=>function(){const r=o.apply(this,arguments);try{const RC=UI.race,F=RC.field,n=F.length,cast=$('#padcast');if(!cast||!PDK)return r;
  const pick=[...F].sort((a,b)=>a.pop-b.pop).slice(0,4);F.filter(f=>f.mine||f.rival).forEach(f=>{if(!pick.includes(f))pick.push(f);});pick.sort((a,b)=>a.no-b.no);
  const note=f=>PDK.notes.find(x=>x.f===f)?.t||padNote(f);const extra=PDK.notes.find(x=>!x.f);
  const rows=pick.map(f=>{const w=wakuOf(f.no,n),bw=bodyWeight(f),g=padGrade(f);return `<div class="pi ${f.mine?'me':''}"><span class="no" style="background:${FRAMEC[w-1]};color:${FRAMET[w-1]}">${f.no}</span>
    <span class="nm">${esc(f.name)}<small>${f.pop}番人気</small></span><span class="kh ${g}"><b>${g}</b>気配</span>
    <span class="cm"><span class="bw">${bw.w}kg <span class="${bw.d>0?'up':bw.d<0?'dn':''}">(${bw.d>=0?'+':''}${bw.d})</span></span>${esc(note(f))}</span></div>`;}).join('');
  cast.outerHTML=`<div class="padrep" id="padrep"><div class="hd">パドック解説<small>気配 A＝絶好 〜 D＝物足りない</small></div>${rows}${extra?`<div class="ft">${esc(extra.t)}</div>`:''}</div><div id="padcast" hidden></div>`;}catch(e){}return r;})(showPaddock);

/* paddock comments that fit each horse, not the same line for half the field */
padNote=(o=>function(f){const c=f.cond,bw=bodyWeight(f),h=f.h,sx=h?h.sex:(hash(f.name)<.3?'牝':'牡'),u=f.style||'',k=hash(f.name+S.t);const P=a=>a[Math.floor(k*a.length)];const L=[];
  L.push(c>=5?P(['毛ヅヤがピカピカ。文句なしの仕上がり','トモの張りが素晴らしい。気配は最高','パドックで一番目立つ好馬体'])
   :c>=4?P(['馬体が締まって見えます','踏み込みがしっかりしている','落ち着いて周回、いい雰囲気','首を使って力強く歩いています'])
   :c<=2?P(['少し覇気がないように見えます','やや太め残りか','気合いが乗り切っていない','歩様に硬さが見えます'])
   :P(['平行線の仕上がり','落ち着いて周回しています','いつも通りの雰囲気','可もなく不可もなし']));
  if(f.temper==='気難しい')L.push(P(['少しチャカつき気味','首を上げてイレ込み加減','引き手を引っ張って気合い十分']));
  else if(u==='逃げ'&&c>=4)L.push('前向きさが出ている');else if((u==='追込'||u==='差し')&&c>=4)L.push('ゆったり歩けていて終いに期待');
  if(sx==='牝'&&c>=4&&k<.5)L.push('牝馬らしいしなやかさ');
  if(Math.abs(bw.d)>=8)L.push(bw.d>0?(c>=4?'馬体重増は成長分か':'馬体重は大幅増'):(c>=4?'馬体を絞ってきた':'馬体重は大幅減'));
  return L.join('。');})(padNote);
