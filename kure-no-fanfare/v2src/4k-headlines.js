/* =========================================================
   1面のコピー: lots of situation-aware (fictional) headlines,
   upright digits in vertical text (縦中横), a display face
   ========================================================= */
(function(){
  const ring=(r,col)=>{const a=[];for(let i=0;i<16;i++){const t=i/16*Math.PI*2;a.push(`${(Math.cos(t)*r).toFixed(1)}px ${(Math.sin(t)*r).toFixed(1)}px 0 ${col}`);}return a.join(',');};
  const st=document.createElement('style');st.textContent=`
.tcy{text-combine-upright:all;-webkit-text-combine:horizontal}
.fp .vtxt{font-family:"Dela Gothic One","Zen Kaku Gothic New",sans-serif;font-weight:400;-webkit-text-stroke:0;letter-spacing:-.02em;font-feature-settings:"vpal" 1,"vert" 1;text-orientation:mixed}
.fp .h-red{color:#e3261b;text-shadow:${ring(2.5,'#fff')},${ring(4,'#6e0a05')},4px 5px 0 rgba(0,0,0,.35)}
.fp .h-blue{color:#1b2fa3;text-shadow:${ring(4,'#fff')},${ring(6.5,'#0b1650')},6px 7px 0 rgba(0,0,0,.3)}
.fp .h-white{color:#fff;text-shadow:${ring(4,'#1b2fa3')},${ring(6.5,'#0b1650')},6px 7px 0 rgba(0,0,0,.3)}
.fp .h-sub{color:#1b2fa3;font-size:22px;text-shadow:${ring(1.6,'#fff')}}
.fp .h-gold{color:#ffd400;text-shadow:${ring(2,'#7a3b00')},3px 3px 0 rgba(0,0,0,.3)}
.fp .tease{font-family:"Dela Gothic One",sans-serif;font-weight:400;font-size:25px;letter-spacing:-.03em;text-shadow:${ring(1.4,'#fff')}}
.fp .tease em{font-family:"Dela Gothic One",sans-serif;font-size:29px}
.fp .nobadge{font-family:Oswald,sans-serif;-webkit-text-stroke:0;text-shadow:${ring(1.8,'#7d0b45')}}
.fp .cap1,.fp .cap2,.fp .sbox h5,.fp .ad2 .f{font-family:"Dela Gothic One",sans-serif;font-weight:400;letter-spacing:-.01em}
.fp .cap1{font-size:12.5px}.fp .cap2{font-size:11.5px}
.fp .ad2 .f{-webkit-text-stroke:0;text-shadow:${ring(1.4,'#fff')}}
.fp .ad2 .p{-webkit-text-stroke:0;text-shadow:${ring(2,'#c8161d')}}
.fp .col .nm,.ub .nm .v,.ub .cm .v{text-orientation:mixed}
`;document.head.appendChild(st);})();

/* wrap short Latin/digit runs (and !! / !?) so they stand upright in vertical text */
function tcy(s){return esc(s).replace(/[!?！？]{2}|[0-9]{1,3}(?![0-9])|[A-Za-z][0-9A-Za-z]{0,1}(?![0-9A-Za-z])/g,m=>`<span class="tcy">${m.replace(/！/g,'!').replace(/？/g,'?')}</span>`);}

function fpFacts(RC,f){
  const r=RC.race,h=f.h,rec=h&&h.rec?h.rec:[];
  let streak=0;for(const x of rec){if(x.pos===1)streak++;else break;}
  const js=f.jname.split(' ')[0],jk=f.jid&&f.jid!=='stable'?JK(f.jid):null;
  return {r,f,h,age:h?ageOf(h):3+Math.floor(hh(f.name)*3),sex:h?h.sex:'牡',pop:f.pop,style:f.style,js,star:jk&&jk.sk>=82,
    g1:h&&h.g1?h.g1:0,streak,last:rec[0]?rec[0].pos:null,lastRace:rec[0]?String(rec[0].n).replace(/（[^）]*）|\([^)]*\)/g,''):null,cond:f.cond,going:r.going||'良',
    big:r.grade==='G1',arima:r.key==='有馬記念',mon:M(S.t),course:r.course,dist:r.dist,mine:!!f.mine,part:S.part};
}
/* pick from the candidates whose condition holds; the race+month seeds the choice so the page is stable */
function fpPick(list,seed){const ok=list.filter(x=>x[0]);return ok.length?pick2(ok.map(x=>x[1]),seed):'';}
function fpCopy(RC,h1,me,d){ensureRival(RC);
  const x=fpFacts(RC,h1),r=x.r,seed=r.name+S.t+h1.no,meTop=me&&me===h1,tr=h1.mine&&h1.h&&P(h1.h.trainer)?P(h1.h.trainer).n.split(' ')[0]:pick2(['高村','松永','尾上','角田','堀内','須崎','友永'],seed+'tr');
  const CRS={中山:['急坂で決める!!','中山の申し子!!'],東京:[x.style==='差し'||x.style==='追込'?'府中で差す!!':'府中の主役!!','長い直線で!!'],京都:['淀で輝く!!','淀の坂越えて!!'],阪神:['仁川で輝く!!','仁川の主役!!'],中京:['尾張の主役!!'],新潟:['越後の主役!!'],福島:['みちのくで!!'],小倉:['小倉の主役!!'],札幌:['北の大地で!!'],函館:['函館の主役!!']}[x.course]||['主役は譲らん!!'];
  const red=fpPick([
    [meTop,'夢を背負って!!'],[meTop,'オーナー悲願!!'],[meTop&&x.part===2,'親子の夢乗せ!!'],[meTop&&x.part===2,'父の夢を継ぐ!!'],[meTop,'本紙◎に乗れ!!'],
    [!meTop,'本紙◎に乗れ!!'],[!meTop,'迷わず狙え!!'],[true,'勝負気配!!'],[true,'満を持して!!'],[true,'頂点へ!!'],[true,'ここは譲れん!!'],[true,'今が最盛期!!'],
    [x.pop===1,'鉄板!!'],[x.pop===1,'死角なし!!'],[x.pop===1,'堂々主役!!'],[x.pop>=6,'穴党集合!!'],[x.pop>=6,'大駆けある!!'],[x.pop>=6,'波乱の主役!!'],[x.pop>=8,'万券の匂い!!'],
    [meTop&&RC.rivalF,'宿敵を倒せ!!'],[meTop&&RC.rivalF,'因縁に決着!!'],[h1.rival&&me,'因縁の対決!!'],[h1.rival&&me,'格の違い見せる!!'],    [x.g1>0,'王者の貫禄!!'],[x.g1>0,'格の違い!!'],[x.g1>0,`G1・${x.g1+1}勝目!!`],[x.big&&!x.g1,'初戴冠へ!!'],
    [x.last>=2&&x.last<=3,'雪辱だ!!'],[x.last>=2&&x.last<=5,'今度こそ!!'],[x.last>=6,'巻き返す!!'],[x.streak>=2,`${x.streak+1}連勝で頂点!!`],[x.streak>=3,'止まらない!!'],
    [x.sex==='牝','女王の座へ!!'],[x.sex==='牝'&&x.big,'女傑誕生!!'],[x.going==='重'||x.going==='不良','道悪歓迎!!'],[x.going!=='良','雨も味方!!'],
    [x.arima,'暮れの中山で!!'],[x.arima,'グランプリ制覇!!'],[x.mon===12&&!x.arima,'年の瀬の主役!!'],
    [x.style==='逃げ','逃げ切る!!'],[x.style==='逃げ','ハナ譲らん!!'],[x.style==='追込','大外一気!!'],[x.style==='差し'||x.style==='追込','豪脚炸裂!!'],[x.star,`名手${x.js}!!`],[true,`${x.js}で勝つ!!`],
    [true,CRS[0]],[!!CRS[1],CRS[1]||'']],seed+'red');
  const sub=fpPick([
    [true,`${x.age}歳${pick2(['充実','本格化','円熟','上昇','健在'],seed+'ag')}`],[x.age>=7,`${x.age}歳健在`],[x.age===3,'3歳の勢い'],
    [x.streak>=2,`${x.streak}連勝中`],[x.g1>0,`G1・${x.g1+1}勝目へ`],[x.big&&!x.g1,'初G1奪取へ'],[!x.big&&r.g,'重賞初Vへ'],
    [x.cond>=5,'坂路一番時計'],[x.cond>=4,'状態絶好'],[x.star,`${x.js}騎手 自信`],[true,`${x.course}の主役`],[x.big,'悲願の頂へ'],[x.lastRace,`前走${String(x.lastRace).slice(0,4)}${x.last}着`]],seed+'sub');
  const raceP=['AR共和国杯','京王杯','毎日王冠','オールカマー','中山記念','阪神大賞典','京成杯','愛知杯','福島記念','新潟記念','函館記念','金鯱賞','武蔵野S','富士S'];
  const lg=pick2(raceP,seed+'lg'),bt=pick2(['3連単','馬連','3連複','ワイド','馬単'],seed+'bt'),amt=pick2(['29万','12万','8万','47万','5万','103万','16万','63万'],seed+'am');
  const tease=fpPick([[true,`先週${lg}<em>${bt}</em>${amt}円ズバッ`],[true,`本紙・高木<em>${pick2(['3','4','5'],seed+'w')}週連続</em>万券的中`],[true,`<em>${bt}</em>${amt}円 的中御礼`],
    [true,`${pick2(['秋','冬','春','夏'],seed+'ss')}の${x.course}で<em>${bt}</em>${amt}円`],[true,`先週も<em>◎</em>${lg}で大当たり`],[x.big,`<em>G1</em>的中率${pick2(['42','38','51'],seed+'p')}%の本紙`]],seed+'tz');
  const flag=pick2(['あす荒れる','大一番','万券予報','的中宣言','本紙予想','勝負週'],seed+'fl');
  const cap1=x.cond>=5?fpPick([[true,'坂路で一番時計 文句なしの動き'],[true,'ここ目標に万全の仕上がり「今が最盛期」'],[true,`${tr}調教師「過去最高のデキ」`],[true,'併せ馬で3馬身先着 気配絶好']],seed+'c1')
    :x.cond>=4?fpPick([[true,'馬なりで楽々先着 気配上々'],[true,'中間じっくり乗り込み 上積み十分'],[true,`${tr}調教師「順調そのもの」`],[true,'毛ヅヤ良好 叩いて上昇']],seed+'c1')
    :fpPick([[true,'攻め控えめも陣営は強気'],[true,'馬体に余裕 当日の気配がカギ'],[true,`${tr}調教師「状態は上向き」`]],seed+'c1');
  const q=fpPick([[true,'手応えは十分'],[true,'この馬を信じて乗るだけ'],[true,'スタートさえ決まれば'],[true,'乗るたびに良くなっている'],[x.last>=2&&x.last<=5,'前走の借りを返す'],[x.big,'G1を勝てる馬'],[x.style==='逃げ','自分の形に持ち込む'],[x.style==='追込','直線に懸ける'],[x.going!=='良','雨は気にしない']],seed+'q');
  const cap2=`${x.js}騎手「${q}」`;
  const wk=wakuOf(h1.no,RC.field.length);
  const STAT=[
    ['荒れる荒れる!? '+r.name.slice(0,6),`過去10年で${pick2(['1','2','3'],seed+'s1')}番人気が${pick2(['4','5','6','7'],seed+'s2')}勝。<b>穴党</b>注目の一戦だ。`],
    [`${wk}枠は好相性`,`過去10年で${pick2(['3','4','5'],seed+'s3')}勝。データは<b>${h1.no}番</b>を後押しする。`],
    ['データ班が斬る',`${x.style}馬の3着内率は<b>${pick2(['38','42','27','51'],seed+'s4')}%</b>。展開ひとつで浮上も。`],
    ['上がり最速に注目',`上がり最速馬が<b>${pick2(['5','6','7'],seed+'s5')}年連続</b>で連対中。末脚自慢を狙え。`],
    [`${x.age}歳馬の天下`,`${x.age}歳馬が<b>${pick2(['3','4'],seed+'s6')}連勝中</b>。世代の勢いは侮れない。`],
    ['1番人気の鬼門',`1番人気は<b>${pick2(['3','4','5'],seed+'s7')}連敗中</b>。波乱の歴史が再び？`],
    [`前走${(x.lastRace||'重賞').slice(0,5)}組`,`前走${(x.lastRace||'重賞').slice(0,5)}組は<b>好走率${pick2(['4','5'],seed+'s8')}割</b>。ローテに妙味。`]];
  const i1=Math.floor(hh(seed+'st1')*STAT.length);let i2=Math.floor(hh(seed+'st2')*STAT.length);if(i2===i1)i2=(i1+1)%STAT.length;
  const AD=[{n:'居酒屋 ひづめ',f:'ハイボール祭',p:'290',bg:'linear-gradient(135deg,#ff9a1f,#ffd84a)'},{n:'焼肉 蹄鉄',f:'ランチ定食',p:'980',bg:'linear-gradient(135deg,#d0342c,#ff8a3d)'},
    {n:'酒場 第4コーナー',f:'生ビール半額',p:'330',bg:'linear-gradient(135deg,#ffb100,#fff17a)'},{n:'日帰り温泉 馬頭の湯',f:'平日割',p:'800',bg:'linear-gradient(135deg,#2a8fbd,#9fe0ff)'},
    {n:'牛丼 ゴール前',f:'大盛り無料',p:'450',bg:'linear-gradient(135deg,#e2572b,#ffc24a)'},{n:'珈琲 パドック',f:'モーニング',p:'500',bg:'linear-gradient(135deg,#7a4a2a,#e6b87a)'}];
  const ad=AD[Math.floor(hh(seed+'ad')*AD.length)];
  const B1=fpPick([[true,`${x.course}${x.dist}mで行われる${r.name}。本紙の見立ては${h1.name}だ。`],[true,`${r.name}の主役は${h1.name}で決まりだ。`],[x.big,`いよいよG1、${r.name}。本紙が自信を持って推すのは${h1.name}。`],[x.pop>=6,`人気の盲点、${h1.name}に本紙は◎を打つ。`]],seed+'b1');
  const B2=`${tr}調教師は「${x.cond>=4?pick2(['ここを目標に仕上げてきた。今が一番いい','動きは文句なし。あとは結果だけ','これ以上ない状態で送り出せる'],seed+'b2'):pick2(['状態は上向き。あとは展開ひとつ','まだ良くなる余地はあるが、力は通用する'],seed+'b2')}」と胸を張る。`;
  const B3=me&&!meTop?`一方、${me.name}（${me.no}番）は${d.marks[RC.field.indexOf(me)].filter(Boolean).length?'記者の間でも評価が分かれる存在。':'無印ながら陣営は静かに自信をのぞかせる。'}`:meTop?`オーナーは「${pick2(['ここまで来られただけで幸せ。でも、勝ちたい','この馬に夢を見させてもらっている','最後まで信じて応援するだけ'],seed+'b3')}」と言葉に力を込めた。`:'';
  const body=B1+d.comm[RC.field.indexOf(h1)]+B2+B3+d.view;
  return {red,sub,tease,flag,cap1,cap2,s1:STAT[i1],s2:STAT[i2],ad,body};
}
/* rebuild the front page with the richer copy */
frontHTML=(o=>function(){
  const html=o.apply(this,arguments);
  const RC=UI.race,F=RC.field,d=paperData(RC),h1=F[d.marks.findIndex(x=>x[0]==='◎')],me=F.find(f=>f.mine);
  const cp=fpCopy(RC,h1,me,d);
  const tpl=document.createElement('div');tpl.innerHTML=html;
  const q=s=>tpl.querySelector(s);
  // red catch (resize to fit) / sub / tease / flag / captions / side boxes / ad / body
  const red=q('.h-red');if(red){const len=cp.red.replace(/!!/,'!').length;red.style.fontSize=Math.min(62,Math.floor(430/len))+'px';red.innerHTML=tcy(cp.red);}
  const sub=q('.h-sub');if(sub)sub.innerHTML=tcy(cp.sub);
  const tz=q('.tease');if(tz)tz.innerHTML=cp.tease;
  const fl=q('.logo .l2');if(fl)fl.innerHTML=[...cp.flag].map((c,i)=>`<span class="${i%3===2?'y':''}">${c}</span>`).join('');
  const c1=q('.cap1');if(c1)c1.textContent=cp.cap1;const c2=q('.cap2');if(c2)c2.textContent=cp.cap2;
  const sb=tpl.querySelectorAll('.sbox');if(sb[0])sb[0].innerHTML=`<h5 class="r">${esc(cp.s1[0])}</h5><p>${cp.s1[1]}</p>`;if(sb[1])sb[1].innerHTML=`<h5>${esc(cp.s2[0])}</h5><p>${cp.s2[1]}</p>`;
  const ad=q('.ad2');if(ad){ad.style.background=cp.ad.bg;ad.innerHTML=`<span class="n">${esc(cp.ad.n)}</span><div class="f">${esc(cp.ad.f)}</div><div class="gl"><i></i><i></i><i></i></div><div class="p">${cp.ad.p}<small>円</small></div>`;}
  const bd=q('.body');if(bd)bd.textContent=cp.body;
  // vertical bits in the mini 馬柱 header: keep the digits upright
  const hd=q('.strip .hd .t');if(hd)hd.innerHTML=`発走<span class="tcy">15</span>時<span class="tcy">40</span>分`;
  tpl.querySelectorAll('.h-blue,.h-white').forEach(e=>{e.innerHTML=tcy(e.textContent);});
  return tpl.innerHTML;})(frontHTML);

/* two papers on the stand: the sports paper's racing page, and the specialist racing paper */
(function(){const st=document.createElement('style');st.textContent=`
.papers{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.papers .paperbtn{flex-direction:column;align-items:stretch;gap:6px;padding:8px 10px;min-height:0}
.papers .paperbtn .pm{align-self:flex-start}
.papers .paperbtn.sp{background:#fff;border-color:#e3b6b6}
.papers .paperbtn.sp .pm{background:#c8161d;font-family:"Dela Gothic One",sans-serif;font-weight:400}
.papers .paperbtn.kb .pm{background:#141210;color:#ffd400}
.papers .paperbtn b{display:block;font-size:13px;line-height:1.35;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.papers .paperbtn.sp b{font-family:"Dela Gothic One",sans-serif;font-weight:400;color:#1b2fa3}
.papers .paperbtn .mk{margin:0;font-size:15px;letter-spacing:1px}
.papers .paperbtn small{font-size:10.5px}
`;document.head.appendChild(st);})();
function paperBtn(){const RC=UI.race;if(!RC)return '';const d=paperData(RC),F=RC.field,me=F.find(f=>f.mine);
  const h1=F[d.marks.findIndex(x=>x[0]==='◎')],cp=fpCopy(RC,h1,me,d);
  const mk=me?d.marks[F.indexOf(me)].map(m=>m||'－').join(''):'';
  return `<div class="papers"><button class="paperbtn sp" data-act="paper" data-t="front"><span class="pm">ターフスポ</span><b>${esc(h1.name)} ${esc(cp.red)}</b><small>スポーツ紙・競馬面　160円</small></button>
    <button class="paperbtn kb" data-act="paper" data-t="ub"><span class="pm">競馬ファンファーレ</span><b>${esc(d.head)}</b>${me?`<span class="mk" aria-label="自分の馬への印">${mk}</span>`:''}<small>競馬専門紙・馬柱　500円</small></button></div>`;}
