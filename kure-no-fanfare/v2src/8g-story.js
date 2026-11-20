/* =========================================================
   はじまり: a proper opening, the first horse has to be earned,
   two more trainers, and 三國 shows a newcomer the ropes
   ========================================================= */

/* ---------------- two more trainers ---------------- */
Object.assign(PEOPLE0,{
  shibahara:{n:'柴原 誠',role:'調教師（美浦・ダートと短距離の名門）',trust:20,col:'#3a6b8c',ini:'柴'},
  kitami:{n:'北見 玲子',role:'調教師（栗東・リーディング上位）',trust:10,col:'#6b3a5a',ini:'北'}});
Object.assign(TRAINERS0,{
  shibahara:{sk:86,care:80,eye:'spd',policy:'many',fee:12,loc:'美浦',jk:'arai'},
  kitami:{sk:93,care:84,eye:'sta',policy:'spaced',fee:28,loc:'栗東',jk:'sanada'}});
Object.assign(VOICE,{
 shibahara:{greet:['「おう、柴原だ」','「ダートの話なら、いくらでも付き合うぞ」','「今日は何の用だ」'],
   evRoom:['まだ幼い。ここから化けるぞ','伸びしろはある','完成は近い','今が一番いい'],evTop:'{stat}が武器だな',evHot:'気が強い。砂をかぶると怒るタイプかもしれん',evGood:'状態はいい',evBad:'少し元気がない',
   pad:['「仕上げた。ダッシュは利くぞ」','「いつも通りだ」','「正直、デキはひと息だ」'],
   look:'「{h}か。{sf}の{d}m前後だな。{grow}。{stat}は{sym}だ」',grow:{晩成:'晩成だな。じっくりいく',早熟:'早熟だ。早いうちに稼ごう',普通:'素直に育つタイプだ'},
   target:'「{h}の次は{list}を狙う」',targetNone:'「短いところとダートなら、うちに任せろ」',targetCls:'「まずはクラスを上げるぞ」',
   consult:'「{h}、今月の{r}に使いたい。仕上がりは{c}だ。\n\n騎手はどうする？」',
   injMinor:'「{h}に{k}が出た。二、三か月で戻る」',injFrac:'「{h}、骨折だ。すまん。長くかかる」',injEnd:'「…{h}は競走能力喪失だ。命に別状はない」',
   leg:'「{h}の脚元に少し熱がある。使うかどうか、あんたが決めてくれ」',legYes:'「わかった」',legNo:'「…毎日見る」',
   retAge:'「{h}も{a}歳だ。先のことを考える時期だな」',retForced:'「{h}は、もう走れる歳じゃない」',retUnraced:'「すまん。{h}が出られる未勝利戦は、もうない」',
   news:['「{h}、砂の坂路で一番時計を出したぞ」','「{h}は{like}に目がない」','「{h}の追い切りは{w}。いい手応えだった」'],
   giftLike:'「お、気が利くな」',giftMeh:'「ありがとうよ」',giftBad:'「甘いのは苦手でな…」'},
 kitami:{greet:['「北見です。手短にお願いします」','「お待ちしていました」','「今日はどんなお話でしょう」'],
   evRoom:['まだ完成には遠いですね','伸びしろは十分あります','完成が近いです','いまが充実期です'],evTop:'{stat}が一級品です',evHot:'気性に課題があります。乗り役を選びます',evGood:'状態は良好です',evBad:'少し疲れが見えます',
   pad:['「ここに照準を合わせて仕上げました」','「いつも通りです」','「デキは八分。無理はさせません」'],
   look:'「{h}ですね。{sf}の{d}mが本領でしょう。{grow}。{stat}は{sym}です」',grow:{晩成:'晩成型です。古馬になってからが本番',早熟:'早熟型。3歳春までが勝負です',普通:'順調に育つタイプです'},
   target:'「{h}は{list}を目標にします」',targetNone:'「預かる以上は、大きいところを狙います」',targetCls:'「まずは条件戦を確実に」',
   consult:'「{h}を今月の{r}に。仕上がりは{c}です。\n\n騎手のご希望は？」',
   injMinor:'「{h}に{k}。二、三か月の休養で戻せます」',injFrac:'「{h}は骨折です。申し訳ありません」',injEnd:'「{h}は競走能力喪失と診断されました」',
   leg:'「{h}の脚元に熱感があります。判断をお任せします」',legYes:'「承知しました」',legNo:'「では、慎重に様子を見ます」',
   retAge:'「{h}も{a}歳です。次の道を考えましょう」',retForced:'「{h}は、競走馬としての時間を終える歳です」',retUnraced:'「{h}が出走できる未勝利戦はもうありません」',
   news:['「{h}、併せ馬で3馬身先着。順調です」','「{h}は{like}が好物のようです」','「{h}の追い切りは{w}。上々です」'],
   giftLike:'「…ありがとうございます。うれしいです」',giftMeh:'「お気遣いありがとうございます」',giftBad:'「お気持ちだけ、いただきます」'}});
function ensureNew(){if(!S)return;['shibahara','kitami'].forEach(id=>{if(!S.people[id])S.people[id]={...PEOPLE0[id],met:false,t1:null};if(!S.trainers[id])S.trainers[id]=JSON.parse(JSON.stringify(TRAINERS0[id]));});if(!S.flags.tipSeen)S.flags.tipSeen={};}
trainersAvail=(o=>function(){ensureNew();const L=o.apply(this,arguments);if(S.people.shibahara.met)L.push('shibahara');if(S.people.kitami.met&&S.fame>=20)L.push('kitami');return L;})(trainersAvail);
render=(o=>function(){ensureNew();return o.apply(this,arguments);})(render);

/* ---------------- the first horse has to be earned ---------------- */
EV.firstHorse={r:()=>({p:'nakahara',from:'中原 修造',title:'最初の一頭',body:`遠いところをよく来なさった。中原です。\n\nうちは繁殖牝馬が四頭の、小さな牧場でね。大きいところのセリには、なかなか出せん。\n\n…こいつだ。芦毛の2歳。母はうちで生まれて、うちで死んだ。気が強くて、セリでは誰も手を挙げなかった。\n\nそれが先週、九条さんのところの人が来てな。「1500万で引き取る」と。\n\n正直に言う。金はほしい。だが、わしはこいつを、ただの数字として扱う人には渡したくない。\n\n…あんたは、なんで馬主になりたい？`,
  ch:['「九条の倍、3000万出す」','「この馬の母の話を、聞かせてほしい」','「しばらく、ここで働かせてほしい」']}),
  f:(d,i)=>{S.flags.fh=i;S.flags.fh2T=S.t+1;
    if(i===0){trust('nakahara',-6);return '中原は、しばらく黙っていた。\n\n「…金の話なら、九条さんと同じだ」\n\n帰りの車で、三國がぽつりと言った。「来月、もう一度行きましょう。手ぶらで」';}
    if(i===1){trust('nakahara',8);return '中原は縁側に腰を下ろし、ゆっくり話しはじめた。\n\n雪の朝に生まれた母馬のこと。一度も勝てなかったが、誰よりも人を信じる馬だったこと。最後の出産のあと、静かに眠るように逝ったこと。\n\n日が傾いたころ、中原は言った。「…来月、もう一度来なさい。こいつの顔を見に」';}
    trust('nakahara',10);return '翌朝から、泥だらけになって寝わらを運んだ。中原は何も言わなかった。\n\n五日目の夕方、芦毛の2歳が、柵ごしにあなたの肩へ鼻を押しつけてきた。\n\n「…そいつが人に寄っていくのは、初めて見た」中原は背を向けたまま言った。「来月、話をしよう」';}};
EV.firstHorse2={r:()=>{const k=S.flags.fh,price=k===0?1600:k===1?800:600;S.flags.fhPrice=price;
  return {p:'nakahara',from:'中原 修造',title:'譲る',body:(k===0?`来たか。\n\n…九条さんには断りを入れた。あんたが先月の帰りぎわ、馬房の前で一度だけ振り返ったのを見とった。\n\n値段は1600万。それ以上はいらん。`:k===1?`来たか。\n\n九条さんには、断りを入れた。\n\nあの話を最後まで黙って聞いてくれたのは、あんたが初めてだ。800万でいい。`:`来たか。\n\n九条さんには断った。こいつが選んだんだ、わしは何も言えん。\n\n600万でいい。…大事にしてやってくれ。`)+`\n\nどこの厩舎に預けるかは、あんたが決めてくれ。\n戸川さん（美浦のベテラン。無理をさせず大きいところを狙う）か、早瀬さん（栗東の若手。数を使って経験を積ませる）か。`,
  ch:[`戸川厩舎に預ける（${price}万円）`,`早瀬厩舎に預ける（${price}万円）`]};},
  f:(d,i)=>{const price=S.flags.fhPrice||800,k=S.flags.fh;const h=genHorse({by:Y(S.t)-2,sire:'echo',pot:83,dist:2400,surf:'芝',growth:'晩成',temper:'気難しい',style:'差し',coat:'芦毛',breeder:'中原',sex:'牡',status:'現役',owner:'me'});
    h.id=S.nid++;h.name=S.kanmei+'ハツユキ';if(usedName(h.name)||h.name.length>9)h.name=makeName(S.kanmei);h.needName=1;h.nameHint=h.name;h.silks=S.silks;h.trainer=i===0?'togawa':'hayase';h.first=true;h.bond=k===2?18:k===1?10:5;S.horses.push(h);S.money-=price;
    S.people[h.trainer].met=true;trust(h.trainer,5);trust('nakahara',5);log(`最初の一頭、${h.name}を中原牧場から迎える`);
    return `中原は、芦毛の首をぽんと叩いた。「名前は、あんたが付けてやってくれ」\n\n${who(h.trainer).split(" ")[0]}厩舎に入ることになった。デビューは6月から。\n厩舎タブの「会いに行く」で、馬と触れ合える。`;}};
EV.meetShibahara={r:()=>({p:'shibahara',from:'柴原 誠',title:'ごあいさつ',body:`柴原だ。美浦で厩舎をやってる。\n\nうちはダートと短いところが専門でな。芝の長いところで夢を見る馬主さんは多いが、砂の千二で勝つ馬も、同じ一勝だ。\n\nスピードのある馬が手に入ったら、声をかけてくれ。`,ch:['ぜひ、そのときは','覚えておきます']}),f:(d,i)=>{S.people.shibahara.met=true;trust('shibahara',i===0?8:3);return '柴原は無骨に頭を下げた。これからは新しく入る馬を柴原厩舎にも預けられる。';}};
EV.meetKitami={r:()=>({p:'kitami',from:'北見 玲子',title:'栗東の名門',body:`北見です。栗東で厩舎を預かっています。\n\n率直に申し上げます。うちは預託の枠が限られていて、実績のある馬主さんからお受けしています。\n\n${ownerName()}さんの馬は、拝見しています。もう少し結果が出れば──馬主の格が20を超えたら、ぜひお話をさせてください。`,ch:['必ず、その日を','肝に銘じます']}),f:(d,i)=>{S.people.kitami.met=true;trust('kitami',i===0?6:3);return S.fame>=20?'北見はわずかにほほえんだ。「…もう、その資格はお持ちですね」北見厩舎に馬を預けられるようになった。':'「お待ちしています」北見は静かに一礼した。（馬主の格20で、北見厩舎に預けられる）';}};
storyTriggers=(o=>function(first){const r=o.apply(this,arguments);if(S.part!==1)return r;const t=S.t-S.startT;
  if(S.flags.fh2T===S.t&&!S.horses.some(h=>h.first)){S.inbox.unshift({id:S.nid++,type:'firstHorse2',data:{}});}
  if(t===1){const i=S.inbox.findIndex(e=>e.type==='meetTrainer2');if(i>=0){const e=S.inbox.splice(i,1)[0];S.flags.mt2=1;S.inbox.push(e);}}
  if(t===3&&!S.people.shibahara.met)pushEv('meetShibahara');
  if(t===7&&!S.people.kitami.met)pushEv('meetKitami');
  return r;})(storyTriggers);
if(typeof STORY_EV!=='undefined')STORY_EV.push('firstHorse2');

/* ---------------- the opening ---------------- */
(function(){const st=document.createElement('style');st.textContent=`
#opening{position:fixed;inset:0;z-index:200;contain:strict;transform:translateZ(0);background:#05070b;color:#efe9da;overflow:hidden;font-family:"Shippori Mincho B1",serif;cursor:pointer}
#opening .sky{position:absolute;inset:0;background:radial-gradient(120% 70% at 50% 110%,#3a2a1e 0%,#1a1520 38%,#05070b 75%)}
#opening .sky2{position:absolute;inset:0;background:radial-gradient(120% 70% at 50% 110%,#5a4030 0%,#2a2030 38%,#0a0d14 75%);opacity:0;transition:opacity 2s;will-change:opacity}
#opening .sun{position:absolute;left:50%;bottom:22%;width:56vmin;height:56vmin;margin-left:-28vmin;border-radius:50%;background:radial-gradient(circle,rgba(255,170,90,.55),rgba(255,120,60,.12) 45%,rgba(0,0,0,0) 70%);opacity:0;transition:opacity 3s;will-change:opacity}
#opening .stand{position:absolute;left:-5%;right:-5%;bottom:20%;height:16vmin;background:linear-gradient(180deg,#0d0f14,#07080b);clip-path:polygon(0 60%,8% 30%,30% 22%,55% 18%,80% 22%,100% 40%,100% 100%,0 100%);opacity:0;transition:opacity 2.5s}
#opening .stand{will-change:opacity}#opening .stand i{position:absolute;width:4px;height:4px;border-radius:50%;background:radial-gradient(circle,#fff3cf,#ffb45a 45%,rgba(255,180,90,0) 70%);opacity:0;animation:optw 3s infinite;will-change:opacity}
@keyframes optw{50%{opacity:.9}}
#opening .turf{position:absolute;left:0;right:0;bottom:0;height:20%;background:linear-gradient(180deg,#1d3a1f,#0b170c);opacity:0;transition:opacity 2.5s;will-change:opacity}
#opening .snow i{position:absolute;top:-4%;width:3px;height:3px;border-radius:50%;background:#fff;opacity:.7;animation:opsn linear infinite;will-change:transform}
@keyframes opsn{from{transform:translate3d(0,0,0)}to{transform:translate3d(-6vw,110vh,0)}}
#opening .txt{position:absolute;left:8%;right:8%;top:50%;transform:translateY(-50%);text-align:center;font-size:clamp(17px,4.6vmin,30px);line-height:2;letter-spacing:.08em;text-shadow:0 2px 12px #000;white-space:pre;opacity:0;transition:opacity 1.4s;will-change:opacity}
#opening .txt.on{opacity:1}
#opening .ttl{position:absolute;left:0;right:0;top:40%;text-align:center;opacity:0;transition:opacity 2.5s;will-change:opacity}
#opening .ttl b{display:block;white-space:nowrap;font-size:min(64px,8.4vw);letter-spacing:.06em;font-weight:800;background:linear-gradient(180deg,#fff3d0,#d9a441 60%,#9b6a1d);-webkit-background-clip:text;background-clip:text;color:transparent;}
#opening .ttl small{display:block;margin-top:10px;font-size:clamp(11px,2.6vmin,15px);letter-spacing:.5em;color:#cdbf9d}
#opening .skip{position:absolute;right:14px;top:calc(12px + env(safe-area-inset-top,0px));border:1px solid rgba(255,255,255,.3);background:rgba(0,0,0,.3);color:#ddd;border-radius:999px;padding:6px 14px;font:600 12px "Zen Kaku Gothic New",sans-serif}
#opening .tap{position:absolute;left:0;right:0;bottom:calc(20px + env(safe-area-inset-bottom,0px));text-align:center;font:500 11px "Zen Kaku Gothic New",sans-serif;letter-spacing:.3em;color:#9a917f;opacity:.0;transition:opacity 1s}
#opening.out{opacity:0;transition:opacity 1.2s}`;document.head.appendChild(st);})();
function showOpening(done,nm0){const nm=nm0||(S&&S.parent.name)||'あなた';
  const SC=[
    {t:'昭和の終わり、十二月。\n千葉・中山競馬場。',sky:1,snow:1,ch:'一九八八年　冬'},
    {t:'父の大きな手を握って、\nスタンドのいちばん上から見下ろした。\n\n十万を超える人の白い息が、\n夕暮れの空にのぼっていった。',sky:1,snow:1,sun:1},
    {t:'ファンファーレが鳴った瞬間、\nスタンドが揺れた。\n\nあんな音を、\nあとにも先にも聞いたことがない。',sky:1,sun:1,stand:1},
    {run:1,t:'最後の直線。\n一頭の芦毛が、\n大外から飛んできた。\n\nゴール板を過ぎたとき、\n父は泣いていた。',sun:1,stand:1,turf:1},
    {t:'「いつか、うちの勝負服で──」\n\n帰りの電車で、そう言った。\n父は、笑っただけだった。',sun:1,stand:1,turf:1},
    {ch:'そして、四十年後',t:`四十年後。\n\n${nm==="あなた"?"":nm+"は、"}小さな町工場を\n一代で大きな会社にした。\n\n父は、もういない。`},
    {t:`そして今日、\n${nm}は馬主になる。`,sun:1,stand:1,turf:1},
    {ttl:1,sun:1,stand:1,turf:1,snow:1}];
  const el=document.createElement('div');el.id='opening';
  el.innerHTML=`<div class="sky"></div><div class="sky2"></div><div class="dusk"></div><div class="sun"></div><div class="stand">${opStandSVG()}</div><div class="turf"><i class="apron"></i><i class="frail"></i></div><div class="snow"></div>
    <div class="txt"></div><div class="ttl"><i style="position:absolute;left:15%;right:15%;top:-30%;bottom:-30%;background:radial-gradient(ellipse,rgba(255,180,80,.22),rgba(255,180,80,0) 70%)"></i><b style="position:relative">暮れのファンファーレ</b><small>KURE NO FANFARE</small></div><div class="runner"><canvas width="360" height="220"></canvas></div><div class="nrail"></div><div class="lb t"></div><div class="lb b"></div><div class="chap"></div><div class="dots"></div><button class="skip">スキップ</button><div class="tap">タップで進む</div>`;
  document.body.appendChild(el);const q=s=>el.querySelector(s);let k=-1,busy=false,T=null;
  const snow=on=>{q('.snow').innerHTML=on?Array.from({length:22},()=>`<i style="left:${(Math.random()*110).toFixed(0)}%;animation-duration:${(6+Math.random()*8).toFixed(1)}s;animation-delay:${(-Math.random()*10).toFixed(1)}s;width:${(2+Math.random()*3).toFixed(0)}px;height:${(2+Math.random()*3).toFixed(0)}px"></i>`).join(''):'';};
  snow(true);q('.snow').style.cssText='opacity:0;transition:opacity 1.5s';
  let dead=false;const end=()=>{if(dead)return;dead=true;clearTimeout(T);el.classList.add('out');setTimeout(()=>{el.remove();done&&done();},1200);};
  q('.dots').innerHTML=SC.map(()=>'<i></i>').join('');
  const next=()=>{if(busy||dead)return;k++;if(k>=SC.length){end();return;}busy=true;const s=SC[k],tx=q('.txt');tx.classList.remove('on');q('.chap').classList.remove('on');
    q('.dots').querySelectorAll('i').forEach((d,j)=>d.classList.toggle('on',j<=k));
    setTimeout(()=>{if(dead)return;q('.sun').style.opacity=s.sun?1:0;q('.stand').style.opacity=s.stand?1:0;q('.turf').style.opacity=s.turf?1:0;q('.nrail').style.opacity=s.turf?1:0;q('.dusk').style.opacity=s.stand?1:0;q('.sky2').style.opacity=s.sky?1:0;
      q('.snow').style.opacity=s.snow?1:0;
      if(s.ch){q('.chap').textContent=s.ch;q('.chap').classList.add('on');}
      if(s.run){const r=q('.runner');r.classList.remove('go');void r.offsetWidth;r.classList.add('go');opGallop(r.querySelector('canvas'));}
      el.classList.toggle('ttlmode',!!s.ttl);if(s.ttl){q('.ttl').style.opacity=1;}else{tx.textContent=s.t;const mx=Math.max(...s.t.split('\n').map(l=>l.length)),fw=el.clientWidth*.84;tx.style.fontSize=Math.min(Math.max(15,Math.min(30,Math.min(innerWidth,innerHeight)*.046)),fw/(mx*1.14))+'px';tx.classList.add('on');}
      q('.tap').style.opacity=.8;busy=false;clearTimeout(T);T=setTimeout(next,s.ttl?4200:Math.max(4200,s.t.length*120));},k?900:700);
    if(k===2&&!dead){try{if(AUD.mus&&AUD.ac){AUD.mus.gain.setTargetAtTime(.02,AUD.ac.currentTime,.2);setTimeout(()=>{try{AUD.mus.gain.setTargetAtTime(AUD.bgm?.22*AUD.vol:0,AUD.ac.currentTime,1.2);}catch(e){}},7000);}}catch(e){}try{if(!SND.ac)sndInit();if(SND.ac.state==='suspended')SND.ac.resume();const on=SND.on;SND.on=true;fanfare({grade:'G1',key:'有馬記念',g:1});SND.on=on;}catch(e){}}};
  el.onclick=e=>{try{if(!SND.ac)sndInit();if(SND.ac&&SND.ac.state==='suspended')SND.ac.resume();}catch(x){}if(e.target.closest('.skip')){end();return;}next();};next();}
/* the curtain goes up first; the game is set up behind it while the screen is still dark, so the heavy first render never lands mid-scene */
ACT.newGame=(o=>function(){const args=arguments;if(START.noOpening){START.noOpening=0;return o.apply(this,args);}try{syncStart();}catch(e){}const nm=(START.name||'').trim()||'高瀬';
  try{showOpening(null,nm);}catch(e){}
  setTimeout(()=>{o.apply(this,args);try{if(S){S.flags.opened=1;save();}}catch(e){}},80);})(ACT.newGame);

/* ---------------- 三國's guidance in the first months ---------------- */
(function(){const st=document.createElement('style');st.textContent=`
.tipcard{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:start;border:1px solid color-mix(in srgb,#3d5a80 45%,var(--line));border-left:4px solid #3d5a80;border-radius:12px;padding:10px 12px;margin-bottom:12px;background:color-mix(in srgb,#3d5a80 8%,var(--panel))}
.tipcard .b{font-size:13.5px;line-height:1.65}.tipcard .b b{display:block;font-size:12px;color:var(--muted);font-weight:700;margin-bottom:2px}
.tipcard .r{grid-column:2;display:flex;justify-content:flex-end;gap:8px}.tipcard .r .btn{min-height:34px;padding:4px 14px;font-size:12.5px}`;document.head.appendChild(st);})();
const TIPS=[
  {k:'start',c:()=>!mine().length,t:'まずは画面上の「月初の出来事」から、中原さんの牧場の話を読んでください。一頭目は、お金だけでは譲ってもらえないかもしれません。\n読み終えたら、下の「月を進める」で次の月へ進みます。'},
  {k:'orders',c:()=>racing().some(h=>h.status==='現役'),t:'厩舎の馬には、毎月「調教」「レース」「休養」の指示を出します。迷ったら「調教師に任せる」に。調教師が状態を見て決めてくれます。'},
  {k:'people',c:()=>S.t-S.startT>=1&&mine().length>0,t:'月に一人だけ、誰かに会いに行けます（下の「人」）。信頼が上がると、騎手が依頼を受けてくれたり、調教師の見立てが正確になったりします。'},
  {k:'race',c:()=>racing().some(h=>h.status==='現役'&&h.starts===0)&&M(S.t)>=5,t:'レースは中継で見られます。3コーナーで騎手に指示（外に出す・内を突く・早めに動く）が出せます。直線では「行けー！」で声援を送れます（結果は変わりません）。'},
  {k:'after',c:()=>racing().some(h=>h.starts>0),t:'レースのあとは「振り返り」で、勝ち負けを分けたものを確かめましょう。上の「今年の目標」を達成すると、ボーナスが入ります。競馬新聞も、相手関係を読むのに役立ちます。'}];
ACT.tipOk=d=>{ensureNew();S.flags.tipSeen[d.k]=1;save();render();};
ACT.tipOff=()=>{ensureNew();TIPS.forEach(t=>S.flags.tipSeen[t.k]=1);save();render();};
function tipCard(){if(!S||S.part!==1)return '';ensureNew();const t=TIPS.find(x=>!S.flags.tipSeen[x.k]&&x.c());if(!t)return '';
  return `<div class="tipcard">${typeof avatar==='function'?avatar('mikuni',38):''}<div class="b"><b>三國より</b>${esc(t.t).replace(/\n/g,'<br>')}</div><div class="r"><button class="btn sm" data-act="tipOff">案内を消す</button><button class="btn sm pri" data-act="tipOk" data-k="${t.k}">わかった</button></div></div>`;}
vStable=(o=>function(){return tipCard()+o.apply(this,arguments);})(vStable);

(function(){const st=document.createElement('style');st.textContent=`
#opening .lb{position:absolute;left:0;right:0;height:7vh;background:#000;z-index:3;transition:transform 1.2s}
#opening .lb.t{top:0}#opening .lb.b{bottom:0}
#opening.ttlmode .lb.t{transform:translateY(-100%)}#opening.ttlmode .lb.b{transform:translateY(100%)}
#opening .sky,#opening .sky2{animation:opkb 40s ease-out forwards}@keyframes opkb{from{transform:scale(1.12)}to{transform:scale(1)}}
#opening .txt{font-weight:600;letter-spacing:.12em}
#opening .chap{position:absolute;left:0;right:0;top:calc(7vh + 64px);text-align:center;z-index:4;font:600 clamp(11px,2.8vmin,14px) "Zen Kaku Gothic New",sans-serif;letter-spacing:.6em;color:#c9a75e;opacity:0;transition:opacity 1.2s}
#opening .chap.on{opacity:.9}
#opening .chap:before,#opening .chap:after{content:"";display:inline-block;width:28px;height:1px;background:#c9a75e;vertical-align:middle;margin:0 12px;opacity:.6}
#opening .dots{position:absolute;left:0;right:0;bottom:calc(7vh + 16px);display:flex;justify-content:center;gap:7px;z-index:4}
#opening .dots i{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.18);transition:background .6s}#opening .dots i.on{background:#c9a75e}
#opening .tap{bottom:calc(7vh + 34px);z-index:4;letter-spacing:.35em;animation:optap 2.4s ease-in-out infinite}@keyframes optap{50%{opacity:.25}}
#opening.ttlmode .dots,#opening.ttlmode .chap{opacity:0}
#opening .skip{z-index:5;top:calc(7vh + 12px);background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.22);letter-spacing:.15em}
#opening .runner{position:absolute;bottom:15%;left:0;width:38vmin;transform:translate3d(-40vmin,0,0);z-index:1;opacity:.9;will-change:transform}
#opening .runner canvas{width:100%;display:block}
#opening .runner.go{animation:oprun 3.2s cubic-bezier(.3,.1,.4,1) forwards}
@keyframes oprun{0%{transform:translate3d(-40vmin,0,0)}100%{transform:translate3d(115vw,-1vh,0)}}
#opening .ttl small:after{content:"親子二代の馬主物語";display:block;margin-top:14px;letter-spacing:.4em;font-size:.95em;color:#e8dcc0;opacity:.8}
#opening .ttl b{animation:opttl 2.6s ease-out both}@keyframes opttl{from{letter-spacing:.3em;opacity:0}to{opacity:1}}
#opening .ttl:before{content:"";position:absolute;left:20%;right:20%;top:calc(100% + 6px);height:1px;background:linear-gradient(90deg,transparent,#c9a75e,transparent)}`;document.head.appendChild(st);})();

/* the grey in the opening: drawn by the same horse renderer as the game, galloping, a rider in navy and gold, backlit by the low sun */
function opGallop(cv){if(!cv||typeof drawHorse!=='function')return;const c=cv.getContext('2d'),t0=performance.now();
  const step=now=>{if(!cv.isConnected)return;const t=(now-t0)/1000;if(t>3.6)return;c.clearRect(0,0,cv.width,cv.height);
    c.save();c.globalAlpha=.95;drawHorse(c,cv.width*.5,cv.height*.86,2.1,t*Math.PI*2*2.3,'芦毛',{a:'#1d2a5a',b:'#c9a227',p:'山形'},7,false,{});c.restore();
    // rim light from the sun behind
    c.save();c.globalCompositeOperation='source-atop';const g=c.createLinearGradient(0,0,cv.width,0);g.addColorStop(0,'rgba(255,170,90,0)');g.addColorStop(.7,'rgba(255,170,90,.12)');g.addColorStop(1,'rgba(255,190,120,.35)');c.fillStyle=g;c.fillRect(0,0,cv.width,cv.height);c.restore();
    requestAnimationFrame(step);};requestAnimationFrame(step);}
/* the title theme plays softly through the opening; it steps aside for the fanfare */
ACT.startOpen=(o=>function(){try{ensureAC();AUD.over=null;AUD.base='title';bgmApply();}catch(e){}return o.apply(this,arguments);})(ACT.startOpen);
/* full screen: no letterbox bars; every layer fills the whole screen (including the notch and home-bar areas) */
(function(){const st=document.createElement('style');st.textContent=`
#opening{position:fixed;left:0;top:0;width:100vw;height:100vh;height:100dvh;inset:0}
#opening .lb{display:none!important}
#opening .sky,#opening .sky2{inset:-2%}
#opening .chap{top:calc(env(safe-area-inset-top,0px) + 64px)}
#opening .skip{top:calc(env(safe-area-inset-top,0px) + 14px)}
#opening .dots{bottom:calc(env(safe-area-inset-bottom,0px) + 22px)}
#opening .tap{bottom:calc(env(safe-area-inset-bottom,0px) + 40px)}`;document.head.appendChild(st);})();

/* the racecourse at sunset, seen from the infield: the low sun setting beside the grandstand, light pouring through the gap under the roof onto a backlit crowd,
   the apron and the white outside rail in front of it, the turf course, and the inside rail in the foreground */
function opStandSVG(){const R=Math.random;let cols='',heads='',rows='',rays='',flags='',win='',trees='M0 200';
  for(let x=0;x<=1000;x+=14)trees+=` L${x} ${(176+Math.sin(x*.05)*4+R()*6).toFixed(0)}`;trees+=' L1000 200Z';
  for(let x=200;x<=990;x+=66)cols+=`<rect x="${x}" y="104" width="3" height="76" fill="#08070a"/>`;
  for(let r=0;r<5;r++){const y=124+r*11;rows+=`<rect x="170" y="${y+5}" width="830" height="1" fill="rgba(255,170,90,${(.14-r*.02).toFixed(2)})"/>`;
    for(let x=174;x<998;x+=3.6+R()*3){if(R()<.12)continue;const hy=y+2+R()*2,rr=1.1+R()*.6;heads+=`<ellipse cx="${x.toFixed(1)}" cy="${hy.toFixed(1)}" rx="${rr.toFixed(1)}" ry="${(rr*1.15).toFixed(1)}"/>`+(r<2?`<path d="M${(x-rr).toFixed(1)} ${(hy-.3).toFixed(1)}a${rr.toFixed(1)} ${rr.toFixed(1)} 0 0 1 ${(rr*2).toFixed(1)} 0" stroke="rgba(255,190,110,${(.7-r*.25).toFixed(2)})" stroke-width=".7" fill="none"/>`:'');}}
  for(let i=0;i<7;i++){const x=200+i*115+R()*40,w=14+R()*16;rays+=`<polygon class="ray" style="animation-delay:${(-R()*6).toFixed(1)}s" points="${x},106 ${x+w},106 ${x+w+60},180 ${x-10},180" fill="url(#opRay)"/>`;}
  for(const x of [260,400,560,720,880]){flags+=`<rect x="${x}" y="78" width="1.4" height="20" fill="#0a0a0e"/><path class="flag" d="M${x+1.4} 79 l11 2.5 l-11 2.5z" fill="#c8a24a" opacity=".9"/>`;}
  for(let x=486;x<700;x+=12)win+=`<rect x="${x}" y="88" width="7" height="3" fill="rgba(255,190,120,${(.35+R()*.4).toFixed(2)})"/>`;
  const head='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMax slice">';
  const body=`<defs><linearGradient id="opGap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf86"/><stop offset=".6" stop-color="#ff9448"/><stop offset="1" stop-color="#b9502a"/></linearGradient>
<radialGradient id="opSun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff4d2"/><stop offset=".25" stop-color="#ffd08a"/><stop offset=".55" stop-color="#ff9a50" stop-opacity=".5"/><stop offset="1" stop-color="#ff8040" stop-opacity="0"/></radialGradient>
<linearGradient id="opRay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc27a" stop-opacity=".2"/><stop offset="1" stop-color="#ffb060" stop-opacity="0"/></linearGradient>
<linearGradient id="opSeat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2317"/><stop offset=".6" stop-color="#181012"/><stop offset="1" stop-color="#0b0a0d"/></linearGradient></defs>
<circle cx="88" cy="176" r="70" fill="url(#opSun)"/><circle cx="88" cy="178" r="13" fill="#fff0c8"/>
<path d="${trees}" fill="#110e15"/>
<rect x="480" y="82" width="226" height="24" fill="#0c0b10"/>${win}<rect x="480" y="81" width="226" height="1.2" fill="#ffb466" opacity=".7"/>
<rect x="170" y="106" width="830" height="20" fill="url(#opGap)" opacity=".85"/>
<rect x="170" y="124" width="830" height="58" fill="url(#opSeat)"/>
<g fill="#0b0809">${heads}</g>${rows}${cols}
<polygon points="150,96 1000,96 1000,104 172,106" fill="#0a0a0e"/><rect x="150" y="95" width="850" height="1.3" fill="#ffb466" opacity=".85"/>
${flags}
<rect x="166" y="180" width="834" height="20" fill="#09080b"/><rect x="166" y="180" width="834" height="1" fill="rgba(255,170,90,.3)"/>
`;
  const img=(svg,c)=>`<img class="${c}" alt="" decoding="async" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}">`;
  return img(head+body+'</svg>','st')+img(head+body.split('</defs>')[0]+'</defs>'+rays.replace(/ class="ray" style="[^"]*"/g,'')+'</svg>','rays');}
(function(){const st=document.createElement('style');st.textContent=`
#opening .stand{left:0;right:0;bottom:calc(26% - 1px);height:min(21vw,26vh);background:none;clip-path:none;overflow:visible}
#opening .stand img{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none}
#opening .stand .rays{animation:opray 7s ease-in-out infinite;will-change:opacity}@keyframes opray{50%{opacity:.45}}
#opening .dusk{position:absolute;left:0;right:0;bottom:26%;height:46%;background:linear-gradient(0deg,rgba(255,138,70,.42),rgba(214,96,80,.2) 28%,rgba(90,50,80,.1) 60%,rgba(0,0,0,0));opacity:0;transition:opacity 2.5s;will-change:opacity;pointer-events:none}
#opening .turf{height:26%;background:
  linear-gradient(90deg,rgba(255,160,80,.16),rgba(255,160,80,0) 45%),
  repeating-linear-gradient(90deg,rgba(255,255,255,.016) 0 9vw,rgba(0,0,0,0) 9vw 18vw),
  linear-gradient(180deg,#2c4a29,#21401f 35%,#132a14 75%,#0b170c)}
#opening .turf .apron{position:absolute;left:0;right:0;top:0;height:9%;background:linear-gradient(180deg,#2a2420,#3a3028)}
#opening .turf .frail{position:absolute;left:0;right:0;top:9%;height:5px;background:linear-gradient(180deg,#f2ede0 0 2px,rgba(0,0,0,0) 2px),repeating-linear-gradient(90deg,#d9d3c4 0 2px,rgba(0,0,0,0) 2px 26px);opacity:.85}
#opening .nrail{position:absolute;left:0;right:0;bottom:12%;height:14px;z-index:2;opacity:0;transition:opacity 2.5s;will-change:opacity;pointer-events:none;
  background:linear-gradient(180deg,#f4efe2 0 4px,rgba(0,0,0,0) 4px),repeating-linear-gradient(90deg,#e6e0d0 0 4px,rgba(0,0,0,0) 4px 70px)}`;document.head.appendChild(st);})();
