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
  ['鷲尾','わしお'],['日向','ひなた'],['城戸','きど'],['真田','さなだ'],['桐生','きりゅう'],['大庭','おおば'],['小森','こもり'],['黒岩','くろいわ'],['新井','あらい'],['丸山','まるやま'],['佐伯','さえき'],['森田','もりた'],['菅原','すがわら'],['岡部','おかべ'],['西村','にしむら'],['荻野','おぎの'],['今井','いまい'],['永瀬','ながせ'],['津田','つだ'],['国分','こくぶ'],['古賀','こが'],['石動','いするぎ'],['白川','しらかわ'],['坂東','ばんどう'],['真壁','まかべ'],['高森','たかもり'],['早川','はやかわ'],['久住','くすみ'],['藤代','ふじしろ'],['柏木','かしわぎ'],['森永','もりなが'],['上原','うえはら'],['吉岡','よしおか'],['岩城','いわき'],['高瀬','たかせ'],['宮下','みやした'],['滝本','たきもと'],['水谷','みずたに'],['黒田','くろだ'],['三國','みくに'],['九条','くじょう'],['中原','なかはら'],['戸川','とがわ'],['早瀬','はやせ'],['柴原','しばはら'],['北見','きたみ'],['小柳','こやなぎ']];
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

/* ファン投票: the vote is among all of Japan's racehorses, not just the handful the story knows; the board shows the top 10
   and where your horse actually stands */
fanVoteEvent=function(){const y=Y(S.t);
  const known=[...S.rivals.filter(r=>r.status==='現役'&&ageOf(r)>=3).map(r=>({n:r.name,f:r.fans,me:false})),...racing().filter(h=>ageOf(h)>=3&&h.status!=='引退').map(h=>({n:h.name,f:h.fans,me:true}))];
  const top=Math.max(420000,...known.map(x=>x.f*1.05)),others=[];
  for(let i=0;i<260;i++){const v=Math.round(top*.92*Math.pow(i+1,-.95)*(.85+hash(y+'fv'+i)*.3)/10)*10;others.push({n:i<14?makeName():'',f:v,me:false});}
  const all=[...known,...others].sort((a,b)=>b.f-a.f);all.forEach((x,i)=>x.rank=i+1);
  const list=all.slice(0,10).map(x=>({n:x.n||makeName(),f:x.f,me:x.me}));
  const mine0=all.filter(x=>x.me).map(x=>({n:x.n,f:x.f,rank:x.rank}));
  const ok=racing().filter(h=>ageOf(h)>=3&&(h.fans>=40000||h.earn>=20000||h.g1>0));
  const why=h=>{const m=all.find(x=>x.me&&x.n===h.name),rk=m?m.rank:999,oku=(h.earn/10000).toFixed(1).replace(/\.0$/,'');
    if(rk<=10)return `ファン投票${rk}位。上位10頭の優先出走権で選出`;
    const gw=(h.gw||[]).filter(n=>GR.some(g=>g.n===n&&g.gr==='G1')),net=yen(Math.round(h.earn*.8));
    if(h.g1>0&&h.earn<20000)return `ファン投票は${rk}位。投票上位10頭のほかは賞金の多い順に枠が決まり、G1（${gw.join('・')||'G1'}）を勝っている馬はその上位に入るので選出。獲得賞金は${yen(h.earn)}（馬主の手取りは8割の${net}）`;
    if(h.earn>=20000)return `ファン投票は${rk}位。投票上位10頭のほかは賞金の多い順に枠が決まり、獲得賞金${yen(h.earn)}が上位のため選出（賞金は総額。馬主の手取りは8割の${net}で、残りは調教師・騎手・厩務員へ）`;
    if(h.g1>0)return `ファン投票は${rk}位。G1（${gw.join('・')||'G1'}）を勝っているので、賞金順の枠で選出。獲得賞金は${yen(h.earn)}（手取り${net}）`;
    return `ファン投票は${rk}位。上位馬の回避が続き、繰り上がりで出走枠に`;};
  pushEv('fanVote',{list,mine:mine0,ok:ok.map(h=>h.name),okWhy:ok.map(h=>({n:h.name,w:why(h)}))});};
EV.fanVote.r=d=>({p:'mikuni',from:'有馬記念 ファン投票',title:`${Y(S.t)}年 有馬記念 ファン投票`,
  body:'【最終結果　上位10頭】\n'+d.list.map((x,i)=>`${i+1}位　${x.n}${x.me?'　◀ あなたの馬':''}　${x.f.toLocaleString()}票`).join('\n')
    +((d.mine||[]).filter(m=>m.rank>10).length?'\n\n【あなたの馬】\n'+d.mine.filter(m=>m.rank>10).map(m=>`${m.rank}位　${m.n}　${m.f.toLocaleString()}票`).join('\n'):'')
    +'\n\n【出走の決まり方】\nファン投票の上位10頭に優先出走権。残りの枠は、獲得賞金の多い順に決まります。'+`\n\n${d.ok.length?(d.okWhy?d.okWhy.map(x=>`◆ ${x.n}\n${x.w}`).join('\n')+'\n\n':'')+`${d.ok.join('、')}は有馬記念に出走できます。暮れの中山へ。`:'今年は、あなたの馬は届きませんでした。ファン投票10位以内か、獲得賞金の上位（目安2億円、またはG1勝ち）が必要です。'}`,ch:['よし']});

/* 開催: which tracks race in which month, as the real calendar runs (summer in the north, winter at Chukyo and Kokura) */
const MEET={1:['中山','京都','中京','小倉'],2:['東京','京都','小倉','中京'],3:['中山','阪神','中京','福島'],4:['中山','阪神','福島','東京'],5:['東京','京都','新潟','東京'],6:['東京','阪神','函館','京都'],
  7:['福島','小倉','函館','中京'],8:['札幌','新潟','小倉','札幌'],9:['中山','阪神','札幌','中京'],10:['東京','京都','新潟','東京'],11:['東京','京都','福島','阪神'],12:['中山','阪神','中京','中山']};
courseSet=function(m){return MEET[m]||['東京','京都','阪神','中山'];};

/* a photo is called when two of the first places are separated by a nose or a head */
function photoCall(RC){RC.photo=false;RC.photoK=null;for(let i=0;i<3&&RC.order[i+1];i++){const m=RC.order[i+1].margin;if(m==='ハナ'||m==='アタマ'){RC.photo=true;RC.photoK=i;break;}}}
runSim=(o=>function(RC){const r=o.apply(this,arguments);try{photoCall(RC);}catch(e){}return r;})(runSim);
showBoard=(o=>function(){try{const RC=UI.race;if(RC&&RC.order&&!RC.boardShown){RC.boardShown=1;photoCall(RC);}}catch(e){}return o.apply(this,arguments);})(showBoard);
