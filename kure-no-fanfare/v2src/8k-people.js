/* =========================================================
   人の物語を増やす: 柴原・北見のその後、他の二つの馬主（アルカディア・北辰）、
   勝利騎手インタビューの言葉
   ========================================================= */
Object.assign(PEOPLE0,{
  saotome:{n:'早乙女 玲司',role:'アルカディア・レーシング代表',trust:10,col:'#1d6f8a',ini:'早'},
  otaka:{n:'大鷹 源三',role:'北辰ファーム場主',trust:10,col:'#1d8a4a',ini:'大'}});
function ensurePeople2(){if(!S)return;['saotome','otaka'].forEach(id=>{if(!S.people[id])S.people[id]={...PEOPLE0[id],met:false,t1:null};});S.flags.pv=S.flags.pv||{};}
render=(o=>function(){ensurePeople2();return o.apply(this,arguments);})(render);
const pvDone=k=>S.flags.pv&&S.flags.pv[k],pvSet=k=>{ensurePeople2();S.flags.pv[k]=S.t;};
const ownH=()=>racing().filter(h=>h.status==='現役');
const rivalOf=own=>S.rivals.filter(r=>r.owner===own&&r.status==='現役').sort((a,b)=>bestAb(b)-bestAb(a))[0];

/* ---------------- 柴原 ---------------- */
EV.shib2={r:()=>{const h=ownH().sort((a,b)=>bestAb(b)-bestAb(a))[0];return {p:'shibahara',from:'柴原 誠',title:'砂を試してみないか',
  body:`柴原だ。調教の帰りに、あんたの${h?h.name:'馬'}の追い切りを見た。\n\n走り方が、どうも芝だけの馬に見えん。脚の回転が速くて、砂を蹴る力がある。\n\n…余計なお世話かもしれんが、一度ダートの適性を見てやろうか。うちの砂の坂路で走らせれば、すぐわかる。`,
  ch:['お願いします','芝で行くと決めているので','考えておきます'],hid:h&&h.id};},
  f:(d,i)=>{pvSet('shib2');const h=ownH().sort((a,b)=>bestAb(b)-bestAb(a))[0];
    if(i===0){trust('shibahara',8);if(h){h.known.going=true;h.known.dist=true;}return h?`数日後、柴原から電話があった。\n\n「${h.name}は${h.surf==='ダ'?'砂のほうが合う。間違いない':'やっぱり芝の馬だ。砂は向かん、無理に使うな'}。距離は${h.dist}m前後がいい」\n\n${h.name}の得意な条件が分かった。`:'柴原は「馬が来たら、いつでも言え」と笑った。';}
    if(i===1){trust('shibahara',-2);return '「そうか。まあ、そういう馬主も嫌いじゃない」';}
    trust('shibahara',2);return '「気が向いたら言ってくれ」';}};
EV.shib3={r:()=>({p:'shibahara',from:'柴原 誠',title:'砂の王',body:`ちょっと飲もう、と柴原に誘われた。\n\n「二十年前、うちにダートで負けなしの馬がいた。G1の前の日に脚を痛めてな。…出るはずだった大一番を、テレビで見たよ。勝ったのは、うちの馬が全部負かしてきた馬だった」\n\n柴原はグラスを見つめたまま言った。「あれから、無理だけはさせんと決めた。勝てる馬ほど、慎重になる。…あんたは、どう思う」`,
  ch:['勝つためには、時に無理も必要だ','馬が無事なのが一番です','柴原さんのやり方を信じます']}),
  f:(d,i)=>{pvSet('shib3');if(i===0){trust('shibahara',-6);return '「…そうか。そういう考えもあるな」柴原は、それ以上何も言わなかった。';}
    trust('shibahara',i===1?10:8);S.trainers.shibahara.care=Math.min(95,S.trainers.shibahara.care+4);return '柴原は、少しだけ笑った。「あんたとは、長い付き合いになりそうだ」\n\n（柴原厩舎の馬が、故障しにくくなった）';}};

/* ---------------- 北見 ---------------- */
EV.kit2={r:()=>({p:'kitami',from:'北見 玲子',title:'条件があります',body:`北見です。${ownerName()}さんの馬を、お預かりする準備が整いました。\n\nひとつだけ、条件があります。うちに預けた馬の使い方は、私に任せていただきたいのです。レース選びも、調教の強さも。\n\nそのかわり、結果でお応えします。`,
  ch:['お任せします','相談しながら決めたい']}),
  f:(d,i)=>{pvSet('kit2');if(i===0){trust('kitami',10);S.trainers.kitami.sk=Math.min(97,S.trainers.kitami.sk+2);S.flags.kitamiTrust=1;return '「ありがとうございます。必ず」\n\n（北見厩舎の馬が、少し伸びやすくなった。北見厩舎の馬は「調教師に任せる」がおすすめ）';}
    trust('kitami',2);return '「…承知しました。では、こまめにご報告します」';}};
EV.kit3={r:()=>({p:'kitami',from:'北見 玲子',title:'一頭、見ていただきたい馬が',body:`北見です。知り合いの牧場に、まだ買い手のついていない2歳がいます。\n\n血統は地味ですが、歩き方が違う。私が見てきた中で、五本の指に入ります。\n\n3000万円。お預かりは、もちろん私が。…ご判断をお任せします。`,
  ch:['買う（3000万円）','今回は見送る']}),
  f:(d,i)=>{pvSet('kit3');if(i===1){return '「承知しました。またご縁があれば」';}if(S.money<3000)return '資金が足りなかった。北見は「またの機会に」と静かに言った。';
    const h=genHorse({by:Y(S.t)-2,pot:86+R()*3,status:'現役',owner:'me'});h.id=S.nid++;h.name=makeName(S.kanmei);h.silks=S.silks;h.trainer='kitami';h.cls=0;S.horses.push(h);S.money-=3000;trust('kitami',8);log(`${h.name}を北見調教師の紹介で迎える`);
    return `${h.name}が北見厩舎に入った。\n\n「いい買い物でした。あとは、私の仕事です」`;}};

/* ---------------- アルカディア・レーシング（早乙女） ---------------- */
EV.arc1={r:()=>({p:'saotome',from:'早乙女 玲司',title:'データの人',body:`馬主の集まりで、細身の男に声をかけられた。アルカディア・レーシングの早乙女だという。\n\n「${ownerName()}さん、ですね。あなたの馬の走破データ、全部見ていますよ。ラップの刻み方が面白い」\n\n「私は勘も情も信じない。数字だけです。…あなたは、何で馬を選びますか」`,
  ch:['数字も大事だが、最後は人と馬だ','あなたのやり方を学びたい','直感です']}),
  f:(d,i)=>{pvSet('arc1');S.people.saotome.met=true;trust('saotome',i===1?8:i===0?3:-2);
    return i===0?'早乙女は肩をすくめた。「その非合理が、たまに数字を超える。だから競馬は面白い」':i===1?'「光栄です。では、ひとつだけ。人気は数字ではありません。オッズの歪みを探してください」':'「直感、ですか。…いずれ数字で負かしてみせますよ」';}};
EV.arc2={r:d=>({p:'saotome',from:'早乙女 玲司',title:'計算外',body:`早乙女からメッセージが届いた。\n\n「先日の${d.race}。${d.mine}に、うちの${d.rv}が負けました。私の予測では、勝率は12%でした」\n\n「計算外を起こす馬は、数字にとって一番の敵で、一番の宝です。…よければ、うちの分析データを差し上げます。次は本気で勝ちに行くので、そのお礼です」`,
  ch:['ありがたく受け取る','自分の目で見るから結構']}),
  f:(d,i)=>{pvSet('arc2');if(i===0){trust('saotome',6);ownH().forEach(h=>{h.known.dist=true;h.known.style=true;});return '早乙女の分析データで、手持ちの馬の適性距離と脚質がはっきりした。';}trust('saotome',2);return '「いい答えです。では、コースで」';}};
EV.arc3={r:()=>{const rv=rivalOf('アルカディア');return {p:'saotome',from:'早乙女 玲司',title:'共同の夢',body:`早乙女から、思いがけない提案があった。\n\n「うちの${rv?rv.name:'エース'}が引退したら、種牡馬にします。その最初の年の種付け権を、あなたに優先で回したい」\n\n「条件はひとつ。生まれた子の走りのデータを、全部共有してください。…血の可能性を、数字で確かめたいんです」`,ch:['受ける','断る']};},
  f:(d,i)=>{pvSet('arc3');if(i===0){trust('saotome',8);S.flags.arcShare=1;return '早乙女と握手を交わした。\n\n（アルカディアの種牡馬の種付け料が安くなる）';}trust('saotome',-2);return '「残念です。まあ、ライバルでいるのも悪くない」';}};

/* ---------------- 北辰ファーム（大鷹） ---------------- */
EV.hok1={r:()=>({p:'otaka',from:'大鷹 源三',title:'北辰ファーム',body:`日高の北、北辰ファームを訪ねた。ダートの名馬を何頭も出してきた牧場だ。\n\n場主の大鷹は、日焼けした顔で笑った。「中原んとこの芦毛を買った人だな。あそこの親父とは、昔は同じセリで競り合った仲だ」\n\n「うちは砂の馬しか作らん。芝の華やかさはないが、砂で勝つ馬は、しぶといぞ」`,ch:['砂の馬の話を聞かせてください','中原さんとは、どんな関係で？']}),
  f:(d,i)=>{pvSet('hok1');S.people.otaka.met=true;trust('otaka',6);if(i===1)trust('nakahara',2);
    return i===0?'大鷹は、ダートで勝つ馬の見分け方を語った。「首が太くて、前脚の掻き込みが強い。それと、気が強いこと。砂をかぶって怯まん馬だ」':'「若い頃はな、ライバルだった。…今は、あいつの牧場が続いてくれるのを願っとるよ。口には出さんがな」';}};
EV.hok2={r:d=>({p:'otaka',from:'大鷹 源三',title:'砂で負けた',body:`大鷹から電話があった。\n\n「${d.race}、見たぞ。うちの${d.rv}が砂で負けるとはな」\n\n電話の向こうで、大鷹は豪快に笑った。「悔しいが、いい馬だ。…今度、うちの牧場に来い。いい酒がある」`,ch:['ぜひ伺います','次も負けません']}),
  f:(d,i)=>{pvSet('hok2');trust('otaka',i===0?8:5);return i===0?'北辰ファームで、大鷹と夜遅くまで飲んだ。馬の話だけで、朝になった。':'「言うじゃないか。こっちも本気で作るぞ」';}};
EV.hok3={r:()=>({p:'otaka',from:'大鷹 源三',title:'一頭、譲ろう',body:`大鷹から手紙が届いた。\n\n「うちの繁殖牝馬を一頭、あんたに譲りたい。ダートで重賞を勝った母の娘だ。うちの血を、別の牧場で試してみたくなった」\n\n「2000万でいい。…中原のところで繋いでやってくれ」`,ch:['譲ってもらう（2000万円）','気持ちだけ受け取る']}),
  f:(d,i)=>{pvSet('hok3');if(i===1){trust('otaka',2);return '「そうか。まあ、気が変わったら言え」';}if(S.money<2000)return '資金が足りなかった。大鷹は「出世払いでもいいんだぞ」と笑った。';
    const m=genHorse({by:Y(S.t)-6,pot:80+R()*4,surf:'ダ',sex:'牝',status:'繁殖',owner:'me'});m.id=S.nid++;m.name=makeName('ホクシン');m.silks=S.silks;S.horses.push(m);S.money-=2000;trust('otaka',8);log(`北辰ファームから繁殖牝馬${m.name}を迎える`);
    return `${m.name}が牧場にやってきた。砂の血を引く牝馬だ。\n\n（春から種付けできる）`;}};

/* when, and to whom */
storyTriggers=(o=>function(first){const r=o.apply(this,arguments);if(first||!S)return r;ensurePeople2();const t=S.t-S.startT,pr=id=>S.people[id];
  const q=(k,ok,data)=>{if(!pvDone(k)&&!S.inbox.some(e=>e.type===k)&&ok){pushEv(k,data||{});S.flags.pv[k]=-1;}};
  if(S.inbox.length>=4)return r;
  q('arc1',t>=6);q('hok1',t>=9&&pvDone('arc1'));
  q('shib2',pr('shibahara').met&&t>=10&&ownH().length>0);q('shib3',pvDone('shib2')&&pr('shibahara').trust>=40&&t>=20);
  q('kit2',pr('kitami').met&&S.fame>=20);q('kit3',pvDone('kit2')&&pr('kitami').trust>=35&&M(S.t)>=4&&M(S.t)<=9);
  q('arc3',pvDone('arc2')&&pr('saotome').trust>=25&&t>=24);q('hok3',pvDone('hok2')&&pr('otaka').trust>=25&&M(S.t)<=3);
  return r;})(storyTriggers);
/* beating their horses brings a letter */
applyRace=(o=>function(RC){const r=o.apply(this,arguments);try{ensurePeople2();const me=RC.order.find(f=>f.mine);if(!me)return r;
  RC.order.forEach(f=>{if(!f.rival||!f.h||f.pos<=me.pos)return;const own=f.h.owner;
    if(own==='アルカディア'&&!pvDone('arc2')&&pvDone('arc1')){S.flags.pv.arc2=-1;pushEv('arc2',{race:RC.race.name,mine:me.name,rv:f.name});}
    if(own==='北辰'&&RC.race.surf==='ダ'&&!pvDone('hok2')&&pvDone('hok1')){S.flags.pv.hok2=-1;pushEv('hok2',{race:RC.race.name,rv:f.name});}});}catch(e){}return r;})(applyRace);
if(typeof stallionFee==='function')stallionFee=(o=>function(s){const f=o.apply(this,arguments);return S&&S.flags.arcShare&&s.owner==='アル'?Math.round(f*.6):f;})(stallionFee);

/* ---------------- 勝利騎手インタビュー: more questions and answers that fit the race ---------------- */
showResult=(o=>function(){const RC=UI.race;const r=o.apply(this,arguments);try{const iv=$('#sheet .intv');const m=RC&&RC.order.find(f=>f.mine);if(!iv||!m||iv.dataset.v2)return r;iv.dataset.v2=1;
  const sd=RC.race.name+S.t+m.no,P2=a=>pick2(a,sd+a.length),sec=RC.order[1],mg=sec?sec.margin:'',close=['ハナ','アタマ','クビ'].includes(mg),big=/^[3-9]|大差/.test(mg),pop=m.pop||5,tr=m.h&&P(m.h.trainer)?P(m.h.trainer).n.split(' ')[0]:'';
  const QA=[];
  QA.push(['── おめでとうございます。今の気持ちは？',RC.race.grade==='G1'?P2(['言葉が出ません。この馬に乗せてもらえて、本当に幸せです','夢みたいです。ずっと、この景色が見たかった','最高です。馬に「ありがとう」と言いたいです']):pop>=6?P2(['人気はなかったですけど、この馬の力を信じていました','見返せたかな、と思います','やってやりました']):P2(['ホッとしています。勝たなきゃいけない馬だったので','うれしいです。期待に応えられてよかった','最高の気分です'])]);
  QA.push(['── レースを振り返って',({逃げ:P2(['ハナを取れれば、と思っていました。マイペースで行けました','行き切ってしまおうと決めていました']),先行:P2(['いい位置が取れたので、あとは追い出すタイミングだけでした','好位で折り合ってくれたのが勝因です']),差し:P2(['中団でじっと我慢して、直線にかけました','前が速くなったので、展開も向きました']),追込:P2(['後ろからになりましたが、末脚を信じていました','直線、外に出してからは一気でした'])})[m.used||m.style]||'馬が頑張ってくれました']);
  QA.push(['── ゴール前は？',close?P2([`${mg}差ですか。最後は本当にわからなかったです`,'並ばれてから、もうひと伸びしてくれました。根性があります']):big?P2(['手応えがあったので、最後は流すくらいでした','直線に向いた時点で、勝てると思いました']):P2(['最後までしっかり伸びてくれました','手応えどおり、きっちり脚を使ってくれました'])]);
  if(tr)QA.push(['── 陣営への言葉を',P2([`${tr}先生が完璧に仕上げてくれました`,`厩舎のスタッフの皆さんのおかげです。${tr}先生に感謝しています`,`${ownerName()}オーナーに、いい報告ができます`])]);
  QA.push(['── 最後にファンの皆さんへ',RC.race.key==='有馬記念'?'この馬と、この景色を見られて幸せです。応援ありがとうございました':P2([`${m.name}はまだまだ強くなります。応援よろしくお願いします`,'次はもっと大きな舞台で、また勝ちます','応援ありがとうございました。これからも見守ってください'])]);
  const h=iv.querySelector('.h');iv.innerHTML='';if(h)iv.appendChild(h);
  QA.forEach(([q,a])=>iv.insertAdjacentHTML('beforeend',`<div class="q">${esc(q)}</div><div class="a">「${esc(a)}」</div>`));}catch(e){}return r;})(showResult);
Object.assign(FACES,{
  shibahara:{sx:'m',age:55,skin:'#d4a27a',hair:'#3a332e',hs:'short',eye:'narrow',brow:3,mouth:'stern',wrinkle:2,wear:'jumper',cloth:'#3a6b8c'},
  kitami:{sx:'f',age:46,skin:'#efc8a6',hair:'#1c1715',hs:'bob',eye:'sharp',brow:2,mouth:'calm',wear:'jacket',cloth:'#4a2e44'},
  saotome:{sx:'m',age:42,skin:'#f0cba8',hair:'#151515',hs:'side',eye:'sharp',brow:1,mouth:'smirk',glasses:'#1d1d1d',wear:'suit',cloth:'#1d3c4a',tie:'#1d6f8a'},
  otaka:{sx:'m',age:63,skin:'#c98e62',hair:'#d0ccc4',hs:'swept',eye:'narrow',brow:3,mouth:'smile',wrinkle:3,wear:'work',cloth:'#2e5a36'}});

/* ================= 馬名を付ける =================
   every horse you bring in (the first one, a sale purchase, one from a trainer or another farm) is named by you */
lotAward=(o=>function(l,w,price){const r=o.apply(this,arguments);if(w==='me'&&l.h){l.h.needName=1;l.h.nameHint=l.h.name;}return r;})(lotAward);
ACT.evc=(o=>function(d){const before=new Set(S?S.horses.map(h=>h.id):[]);const r=o.apply(this,arguments);try{S.horses.forEach(h=>{if(h.owner==='me'&&!before.has(h.id)&&!['当歳'].includes(h.status)&&!h.unnamed&&h.needName==null){h.needName=1;h.nameHint=h.name;}});save();}catch(e){}return r;})(ACT.evc);
function nameDialog(h){const sug=[...new Set([h.nameHint,makeName(S.kanmei),makeName(S.kanmei),makeName()].filter(n=>n&&n.length<=9))].slice(0,4);
  const blood=h.sire&&ST(h.sire)?`父 ${esc(ST(h.sire).n)}${h.damName?`／母 ${esc(h.damName)}`:''}`:'';
  openModal(`<div class="from-line">新しい仲間</div><h2>名前を付ける</h2>
   <div class="row" style="gap:12px">${horseSVG(h,64)}<div><b>${h.sex||''}${ageOf(h)}歳・${esc(h.coat||'')}</b><div class="muted" style="font-size:12.5px">${blood}</div><div class="muted" style="font-size:12.5px">${h.trainer&&P(h.trainer)?esc(P(h.trainer).n.split(' ')[0])+'厩舎':h.status==='繁殖'?'繁殖牝馬':''}</div></div></div>
   <div class="field"><label for="nm2">馬名（9文字まで。冠名「${esc(S.kanmei)}」を付けるのもおすすめ）</label><input type="text" id="nm2" maxlength="9" value="${esc(h.nameHint||sug[1]||sug[0]||S.kanmei)}" autocomplete="off"></div>
   <div class="row" style="flex-wrap:wrap;gap:6px">${sug.map(n=>`<button class="btn sm" data-act="nmPick" data-n="${esc(n)}">${esc(n)}</button>`).join('')}</div>
   <div class="row"><span class="sp"></span><button class="btn pri" data-act="nmOk" data-hid="${h.id}">この名前にする</button></div>`,{lock:true});}
ACT.nmPick=d=>{const i=$('#nm2');if(i)i.value=d.n;};
ACT.nmOk=d=>{const h=HZ(d.hid),v=($('#nm2').value||'').trim();if(!h)return;if(!v){toast('馬名を入れてください');return;}if(v===S.kanmei){toast(`冠名「${S.kanmei}」のあとに、名前を続けてください`);return;}if(v.length<2){toast('2文字以上にしてください');return;}if(v.length>9){toast('9文字までです');return;}if(v!==h.name&&usedName(v)){toast('その名前はもう使われています');return;}
  const old=h.name;h.name=v;delete h.needName;delete h.nameHint;S.log.forEach(l=>{if(l.text&&old)l.text=l.text.split(old).join(v);});save();closeModal();toast(`「${v}」と名付けた`);render();};
render=(o=>function(){const r=o.apply(this,arguments);try{if(S&&$('#modal').hidden&&!document.getElementById('opening')){const h=S.horses.find(x=>x.owner==='me'&&x.needName);if(h)setTimeout(()=>{if($('#modal').hidden)nameDialog(h);},250);}}catch(e){}return r;})(render);
