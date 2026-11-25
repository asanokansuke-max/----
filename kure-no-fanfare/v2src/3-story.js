/* =========================================================
   story: events, conversations, horse interactions, endings
   ========================================================= */
const fName=()=>S.parent.name, cName=()=>S.child?S.child.name:'';
const who=id=>P(id)?P(id).n:'';
const bestRacer=()=>racing().filter(h=>h.status!=='引退').sort((a,b)=>bestAb(b)-bestAb(a))[0];
const tier=id=>{const v=P(id).t1??P(id).trust;return v>=60?2:v>=35?1:0;};

/* ---------- 月初の出来事 ---------- */
function storyTriggers(first){
  const f=S.flags;
  if(S.part===1){
    const t=S.t-S.startT;
    if(first){pushEv('prologue');pushEv('firstHorse');return;}
    if(t===1)pushEv('meetTrainer2');
    if(t===4)pushEv('party');
    if(t===5)pushEv('hinataAsk');
    if(t===8)pushEv('washioMeet');
    const JI={2:'kiryu',3:'kido',6:'kuroiwa',9:'rossi',10:'oba',13:'arai',14:'dubois',17:'sanada',26:'komori'};
    if(JI[t])pushEv('jIntro',{id:JI[t]});
    if(t===15)pushEv('farmVisit');
    if(t===21&&!S.br.farm)pushEv('farmCrisis');
    if(S.br.farm==='abandon'&&!f.reunion&&f.farmClosedT!=null&&S.t===f.farmClosedT+18)pushEv('reunion');
    if(f.kujoOfferPending&&!S.br.kujoSale){const h=HZ(f.kujoOfferPending);f.kujoOfferPending=null;if(h&&h.owner==='me')pushEv('kujoOffer',{hid:h.id,price:Math.round(value(h)*2.6/1000)*1000});}
    if(t===48)pushEv('cough');
    if(t===54)pushEv('health',{n:1});
    if(t===70)pushEv('health',{n:2});
    if(t===88)pushEv('health',{n:3});
    if(t===30||t===66)pushEv('kujoParty');
    if(S.t>=S.parent.collapseT&&!S.parent.collapsed&&!f.collapseQ){f.collapseQ=1;pushEv('collapse');return;}
  }else{
    const u=S.t-S.p2T;
    if(u===1)pushEv('p2guide');
    if(u===2)pushEv('hinataTop');
    if(u===4)pushEv('reiMeet');
    if(u===6)pushEv('washioTrainer');
    if(S.parent.fate==='dead'&&[3,10,20].includes(u))pushEv('letter',{n:[3,10,20].indexOf(u)+1});
    if(S.parent.fate==='rest'&&u>0&&u%8===4)pushEv('parentCall');
    if(u===18&&!S.br.rei)pushEv('reiChoice');
    racing().filter(h=>h.bredBy==='parent'&&h.status==='現役'&&!h.fbShown&&h.starts===0).forEach(h=>{h.fbShown=1;pushEv('fatherBred',{hid:h.id});});
    S.rivals.filter(r=>r.fromSold&&!r.shown&&ageOf(r)===2&&M(S.t)===6).slice(0,1).forEach(r=>{r.shown=1;pushEv('soldBlood',{name:r.name});});
    if(M(S.t)===12){
      const ok=racing().filter(h=>ageOf(h)>=3&&(h.fans>=40000||h.earn>=20000||h.g1>0));
      if(ok.length&&!S.br.hinataLeft&&S.br.hinataKept>=1&&!f.payback){f.payback=1;pushEv('hinataPayback',{hid:ok[0].id});}
      if(ok.length&&S.br.rei==='ally'&&S.rivals.some(r=>r.owner==='九条'&&r.target==='有馬記念')&&f.dilemmaY!==Y(S.t)){f.dilemmaY=Y(S.t);pushEv('reiDilemma');}
    }
  }
  if(f.hinataLeavePending){f.hinataLeavePending=0;pushEv('hinataLeave');}
  if(S.money<3000&&(f.lowT==null||S.t-f.lowT>=12)){f.lowT=S.t;pushEv('lowMoney');}
  racing().filter(h=>h.status==='現役'&&ageOf(h)===3&&M(S.t)>=10&&h.wins===0&&!h.unr).slice(0,1).forEach(h=>{h.unr=1;pushEv('retireTalk',{hid:h.id,forced:true,unraced:true});});
  racing().filter(h=>h.status==='現役'&&ageOf(h)>=6&&!h.rtY&&R()<.12).slice(0,1).forEach(h=>{h.rtY=Y(S.t);pushEv('retireTalk',{hid:h.id});});
  if(S.inbox.length<2&&R()<.35){
    const pool=[];
    const act=racing().filter(h=>h.status==='現役');
    if(act.some(h=>h.fat>40))pool.push(()=>{const h=pick(act.filter(h=>h.fat>40));pushEv('legWorry',{hid:h.id});});
    if(act.some(h=>h.fans>3000))pool.push(()=>{const h=pick(act.filter(h=>h.fans>3000));pushEv('fanLetter',{hid:h.id});});
    if(act.length)pool.push(()=>{const h=pick(act);pushEv('stableNews',{hid:h.id,k:Math.floor(R()*4)});});
    if(atFarm().length)pool.push(()=>pushEv('farmNews',{hid:pick(atFarm()).id}));
    if(pool.length)pick(pool)();
  }
}

const EV={
 prologue:{r:()=>({p:'mikuni',from:'三國 透',title:'はじめまして',body:`はじめまして。三國 透と申します。今日から${fName()}さんの馬のことを、すべてお手伝いさせていただきます。\n\n会社を一代で大きくされた${fName()}さんが、なぜ今になって馬主に──と、正直に申し上げると、不思議に思っていました。\n\n「子どもの頃、親父に連れられて暮れの中山へ行った。あの直線を、いつか自分の勝負服が先頭で駆け抜ける」\n\n面接の日にそう伺って、腹が決まりました。お供します。\n\n毎月、まず厩舎の馬たちに指示を出していただきます。それから、月にお一人だけ、誰かに会いに行けます。人とのご縁は、馬と同じくらい大事な財産です。`,ch:['よろしく頼む']}),f:()=>'三國は手帳を開いた。「まずは日高の中原さんの牧場へ。お見せしたい馬がいるそうです」'},
 firstHorse:{r:()=>({p:'nakahara',from:'中原 修造',title:'最初の一頭',body:`遠いところをよく来なさった。中原です。\n\nうちは繁殖牝馬が四頭の、小さな牧場でね。大きいところのセリには、なかなか出せん。\n\nこいつを見てほしい。芦毛の2歳。母はうちで生まれて、うちで死んだ。気が強くて、セリでは誰も手を挙げなかった。\n\nだが、わしはこいつの目が好きでね。…800万でいい。どこの厩舎に預けるかは、あんたが決めてくれ。\n\n戸川さん（美浦のベテラン。無理をさせず大きいところを狙う）か、早瀬さん（栗東の若手。数を使って経験を積ませる）か。`,ch:['戸川厩舎に預ける（800万円）','早瀬厩舎に預ける（800万円）']}),
   f:(d,i)=>{const h=genHorse({by:Y(S.t)-2,sire:'echo',pot:80,dist:2400,surf:'芝',growth:'晩成',temper:'気難しい',style:'差し',coat:'芦毛',breeder:'中原',sex:'牡',status:'現役',owner:'me'});
     h.id=S.nid++;h.name=S.kanmei+'ハツユキ';if(usedName(h.name)||h.name.length>9)h.name=makeName(S.kanmei);h.silks=S.silks;h.trainer=i===0?'togawa':'hayase';h.first=true;h.bond=5;S.horses.push(h);S.money-=800;
     S.people[h.trainer].met=true;trust(h.trainer,5);trust('nakahara',5);log(`最初の一頭、${h.name}を中原牧場から迎える`);
     return `「${h.name}。いい名前だ」中原は目を細めた。\n\n${h.name}は${who(h.trainer)}厩舎に入った。デビューは6月から。\n厩舎タブの「会いに行く」で、馬と触れ合える。`;}},
 meetTrainer2:{r:()=>{const o=S.horses.find(h=>h.first);const id=o&&o.trainer==='togawa'?'hayase':'togawa';return{p:id,from:who(id),title:'ごあいさつ',body:id==='togawa'?`戸川です。中原さんから話は聞いとります。\n\n馬は生き物だ。使い詰めにすれば壊れる。わしの厩舎は、間隔をあけて、ここというところだけを狙う。\n\nいつか、あんたの馬を預かることがあれば。`:`はじめまして、早瀬さくらです！ 栗東で厩舎を開いて3年目です。\n\nまだ重賞は勝ったことがないんですけど、馬を見る目には自信があります。特にスピードの資質は外しません。\n\nいつか、${fName()}さんの馬を預からせてください！`,ch:['次の馬はぜひお願いしたい','そのときは、よろしく']};},
   f:(d,i)=>{const o=S.horses.find(h=>h.first);const id=o&&o.trainer==='togawa'?'hayase':'togawa';S.people[id].met=true;trust(id,i===0?8:3);return i===0?'「…約束ですよ」':'軽く会釈を交わした。';}},
 party:{r:()=>({p:'kujo',from:'馬主協会 懇親会',title:'九条 隆臣',body:`ホテルの宴会場。グラスを持った男が近づいてきた。九条グループ代表、九条 隆臣。生産から競走まで自前でこなす、日本最大級の馬主だ。\n\n「${fName()}さん、でしたか。中原牧場の芦毛を800万で。…いや、失礼。いい買い物をなさった」\n\n周りから小さな笑いが起きる。\n\n「馬は金で買える。だが勝ち方は金では買えない。暮れの中山でお会いできるといいですな」`,ch:['「有馬で、あなたの馬を負かします」','「勉強させていただきます」','黙ってグラスを上げる']}),
   f:(d,i)=>{S.people.kujo.met=true;if(i===0){trust('kujo',6);S.fame+=1;S.flags.vow=1;return '九条は一瞬だけ目を見開き、それから笑った。「…楽しみにしておこう」\n会場がざわめいた。';}if(i===1){trust('kujo',4);return '「謙虚な方だ」九条はそれだけ言って去った。';}trust('kujo',8);return '九条もグラスを上げた。言葉はいらなかった。';}},
 hinataAsk:{r:()=>({p:'hinata',from:'日向 翔',title:'乗せてください',body:`あの、${fName()}さんですよね。日向 翔といいます。デビュー2年目の騎手です。\n\n${S.horses.find(h=>h.first)?.name||'あの芦毛'}の調教、毎朝見てました。気が荒くて、みんな手を焼いてるけど…あの馬、背中がすごくいいんです。\n\n僕に乗せてもらえませんか。勝てなかったら、すぐ降ろしてもらって構いません。`,ch:['乗ってもらおう（主戦に）','考えておく']}),
   f:(d,i)=>{S.people.hinata.met=true;const h=S.horses.find(h=>h.first);if(i===0){trust('hinata',22);if(h)h.mainJ='hinata';return `日向は深く頭を下げた。「絶対に、後悔させません」\n${h?h.name+'の主戦は日向 翔。':''}`;}trust('hinata',3);return '「…はい。待ってます」';}},
 washioMeet:{r:()=>({p:'washio',from:'美浦トレーニングセンター',title:'鷲尾 剛',body:`朝の調教が終わったスタンドで、白髪まじりの男が煙草をくわえていた。G1を三十勝以上している名手、鷲尾 剛。九条の看板馬の主戦でもある。\n\n「あんたが中原の芦毛の馬主か」\n\n「素人の道楽に付き合うほど暇じゃねえ。俺に乗ってほしけりゃ、乗りたいと思わせる馬を連れてこい」`,ch:['「必ず連れてきます」','「勉強させてください」と頭を下げる','「九条の馬しか乗らないんですか」']}),
   f:(d,i)=>{S.people.washio.met=true;if(i===0){trust('washio',7);return '鷲尾は鼻で笑ったが、去り際に一度だけ振り返った。';}if(i===1){trust('washio',4);return '「…頭を下げる相手を間違えるな。下げるなら馬にだ」';}trust('washio',-2);S.flags.washioSpark=1;return '「九条は勝てる馬を持ってくる。それだけだ」鷲尾の目が、少しだけ笑った。';}},
 farmVisit:{r:()=>({p:'nakahara',from:'中原 修造',title:'牧場に来んか',body:`春の日高は、仔馬が生まれる季節でね。よかったら見に来んか。\n\n…実はな、牧場の経営が、少しばかり苦しい。いや、あんたに言うことじゃなかった。忘れてくれ。`,ch:['牧場の仕事を一日手伝う','話をゆっくり聞く']}),
   f:(d,i)=>{if(i===0){trust('nakahara',10);return '泥だらけになって寝わらを運んだ。中原は何も言わなかったが、帰り際に缶コーヒーを投げてよこした。';}trust('nakahara',6);S.flags.farmHint=1;return '借金は、思っていたより大きいようだった。中原の娘、澪が「父さんは意地っ張りだから」と苦笑した。';}},
 farmCrisis:{r:()=>({p:'nakahara',from:'中原 修造',title:'牧場を閉めることにした',body:`電話ですまん。\n\n銀行が、もう待てんと言ってきた。6000万。それが払えなければ、今年いっぱいで牧場を閉める。\n\n…あんたに頼むつもりで電話したんじゃない。報告だ。世話になった人には、自分の口から言いたかった。\n\n（三國「支援すれば、中原さんの牧場は残ります。ただ、楽な額ではありません」）`,ch:['支援する（6000万円）','支援しない']}),
   f:(d,i)=>{if(i===0){S.money-=6000;S.br.farm='support';trust('nakahara',30);trust('mikuni',4);log('中原牧場を支援。牧場は存続した');return '電話の向こうで、長い沈黙があった。\n「…この恩は、馬で返す」\n\n中原牧場は残った。繁殖牝馬を安く預けられ、中原の見立ても頼りにできる。';}
     S.br.farm='abandon';S.flags.farmClosedT=S.t;trust('nakahara',-30);log('中原牧場が閉鎖された');return '「そうか。いや、当たり前だ。気にせんでくれ」\n\n年末、中原牧場は閉鎖された。これから繁殖牝馬は大手牧場に預けることになる。預託料は高い。';}},
 reunion:{r:()=>({p:'nakahara',from:'三國 透',title:'中原さんを見かけました',body:`日高の大手牧場に、馬の様子を見に行ったときのことです。\n\n厩舎の奥で、中原さんが寝わらを運んでいました。雇われで働いているそうです。\n\n私に気づくと、黙って会釈をして、奥へ行ってしまいました。`,ch:['会いに行って、頭を下げる','そっとしておく']}),
   f:(d,i)=>{if(i===0){S.flags.reunion=1;trust('nakahara',22);return '「あんたが謝ることじゃない」\n中原は寝わらのフォークを置いた。\n「…あんたの馬のことは、ずっと新聞で追っとった」\n\n中原とまた話せるようになった。';}trust('nakahara',-3);return '三國は何も言わずにうなずいた。';}},
 kujoOffer:{r:d=>{const h=HZ(d.hid);if(!h)return null;return{p:'kujo',from:'九条 隆臣',title:`${h.name}を譲ってほしい`,body:`G1制覇、おめでとう。正直に言おう。見くびっていた。\n\n${h.name}を${yen(d.price)}で譲ってほしい。うちの牧場で種牡馬にすれば、この血は日本中に広がる。あなたの手元に置いておくより、この馬のためになる。\n\n返事は急がない。…いや、急いでほしい。`,ch:[`売る（${yen(d.price)}）`,'断る']};},
   f:(d,i)=>{const h=HZ(d.hid);if(i===0){S.money+=d.price;S.br.kujoSale='sold';S.br.soldId=h.id;S.horses=S.horses.filter(x=>x!==h);h.owner='九条';h.silks=OWN['九条'].silks;h.j='washio';h.cls=5;S.rivals.push(h);log(`${h.name}を九条グループへ${yen(d.price)}で売却`);return `${h.name}は九条の勝負服を着ることになった。\n\n厩舎を出るとき、${h.name}は一度だけこちらを振り返った。`;}
     S.br.kujoSale='refused';trust('kujo',15);S.fame+=2;log(`九条からの${h.name}買い取りの申し出を断る`);return '「…そうか」九条は少し笑った。「あなたのお父上も、同じ顔で断ったんだろうな」\n\n九条が、あなたに一目置くようになった。';}},
 kujoParty:{r:()=>({p:'kujo',from:'九条グループ',title:'招待状',body:`九条グループの新年会への招待状が届いた。関係者が集まる大きな会だ。\n\n（三國「顔を出せば、いろんな方とお話ができます。ただ、九条さんの“庭”ですから」）`,ch:['出席する','欠席する']}),
   f:(d,i)=>{if(i===0){trust('kujo',5);trust('washio',3);trust('rossi',4);S.fame+=1;return '会場では鷲尾がひとりで隅に立ち、ロッシは陽気に挨拶して回っていた。九条は遠くからグラスを上げてみせた。';}return '三國「賢明かもしれません」';}},
 cough:{r:()=>({p:'mikuni',from:'三國 透',title:'咳が',body:`${fName()}さん、最近、咳が続いていませんか。\n\n先週のパドックでも、ずっと。…差し出がましいのは承知の上です。一度、病院で診てもらってください。`,ch:['「大丈夫だ。誰にも言うな」','「わかった、行くよ」']}),
   f:(d,i)=>{S.flags.coughKnown=1;trust('mikuni',i===0?3:6);return i===0?'三國は唇を噛んで、黙ってうなずいた。':'「…ありがとうございます」三國はほっとしたように笑った。';}},
 health:{r:d=>{const b=bestRacer();const n=d.n;const texts=[
   `検査の結果が出た。医者は言葉を選んでいた。\n\n「今すぐどうこうではありません。ただ、無理を続ければ、どうなるかは保証できない。数か月、仕事も馬も離れて療養してください」\n\n三國だけが、診察室の外で待っていた。`,
   `また数値が悪くなっていた。\n\n「前回、休まれましたか？」医者の目がまっすぐこちらを見る。\n\n${b?`今年は${b.name}が大きいところを狙える年だ。療養すれば、人にも会えず、セリにも行けない。`:'療養すれば、人にも会えず、セリにも行けない。'}`,
   `夜中に目が覚めて、しばらく息ができなかった。\n\n「これが最後の忠告です」医者は静かに言った。「休んでください」\n\n三國が泣きそうな顔で立っていた。「お願いです。休んでください」`][n-1];
   return{p:'mikuni',from:'病院',title:['療養のすすめ','二度目の警告','最後の忠告'][n-1],body:texts,ch:['休む（4か月、人に会えずセリにも行けない）','続ける']};},
   f:(d,i)=>{if(i===0){S.br.health.push('rest');S.restPenalty=4;trust('mikuni',5);log(`${fName()}、療養のため4か月休む`);return '三國「…よかった。厩舎のことは、私がしっかり見ておきます」';}S.br.health.push('cont');log(`${fName()}、医者の忠告を振り切る`);return '三國は何か言いかけて、やめた。\n「…わかりました。でも、私は知っていますから」';}},
 collapse:{r:()=>{const rests=S.br.health.filter(x=>x==='rest').length;return{p:'mikuni',from:'',title:'暮れの前に',body:`その朝、${fName()}は厩舎の前で倒れた。\n\n馬房の中で、${bestRacer()?.name||'馬'}が、落ち着かなく前搔きをしていた。\n\n${rests>=2?'命は取り留めた。だが医者は、もう馬主の仕事は続けられないと言った。':'救急車の中で、三國の手を握ったまま、それきり目を覚まさなかった。'}`,ch:['…']};},
   f:()=>({next:'interlude'})},
 jIntro:{r:d=>{const x=JINTRO[d.id];return{p:d.id,from:x.from,title:who(d.id),body:x.body,ch:x.ch.map(c=>c[0])};},
   f:(d,i)=>{const x=JINTRO[d.id];P(d.id).met=true;if(d.id==='komori')S.flags.komori=1;trust(d.id,x.ch[i][2]);return x.ch[i][1];}},
 /* part 2 */
 p2guide:{r:()=>({p:'mikuni',from:'三國 透',title:'これから',body:`${cName()}さん。最初はわからないことだらけで当然です。\n\n厩舎の馬は、馬ごとに「調教師にお任せ」にできます。調教とレース選びは調教師が決めてくれます。G1に出すかどうかと騎手だけは、必ず相談が来ます。\n\n慣れてきたら、少しずつご自分で決めてみてください。\n\nそれから…皆さん、${S.parent.name}さんの話を${cName()}さんにしたがっています。会いに行ってあげてください。`,ch:['わかった']}),f:()=>''},
 hinataTop:{r:()=>({p:'hinata',from:'日向 翔',title:S.br.hinataLeft?'お久しぶりです':'今度は僕が',body:S.br.hinataLeft?`…日向です。お父さんのこと、聞きました。\n\n僕は、お父さんの馬から降ろされた騎手です。恨んでるわけじゃない。あの判断は、たぶん正しかった。\n\nでも、あなたの馬に乗ることは、もうないと思います。`:`${cName()}さん。日向 翔です。\n\n去年、リーディング2位になりました。\n\nデビューしたての僕を、${S.parent.name}さんだけが信じてくれた。どんなに負けても、降ろさなかった。\n\n今度は、僕が恩を返す番です。いつでも呼んでください。`,ch:[S.br.hinataLeft?'…わかった':'よろしく頼む']}),
   f:()=>{S.people.hinata.met=true;if(!S.br.hinataLeft)trust('hinata',10);return '';}},
 reiMeet:{r:()=>({p:'rei',from:'九条 怜',title:'二代目',body:`九条 怜です。父から、グループの代表を継ぎました。\n\n${S.parent.name}さんのことは、父からよく聞いています。${S.br.kujoSale==='refused'?'「あの男は、俺の申し出を断った唯一の馬主だ」と。':S.br.kujoSale==='sold'?'「あの男から買った馬が、うちの血統を変えた」と。':'「暮れの中山で、何度もやり合った」と。'}\n\n僕は父ほど甘くない。お互い、いい馬を作りましょう。`,ch:['「負けません」','「よろしくお願いします」']}),
   f:(d,i)=>{S.people.rei.met=true;trust('rei',i===0?4:7);return i===0?'怜は少しだけ口角を上げた。「そう言うと思った」':'「…父の言ったとおりの家だ」';}},
 washioTrainer:{r:()=>({p:'washio',from:'鷲尾 剛',title:'厩舎を開いた',body:`鞭を置いた。今年から調教師だ。\n\n${tier('washio')>=1?`あんたの親父の馬には、何度も乗った。不器用な馬ばかりだったが、どれも最後まで諦めなかった。`:`あんたの親父の馬には、結局一度も乗ってやれなかった。それが、少しだけ心残りでな。`}\n\n一頭、預けてみねえか。`,ch:['「お願いします」','「考えさせてください」']}),
   f:(d,i)=>{S.flags.washioTrainer=1;S.people.washio.role='調教師（美浦・新規開業）';trust('washio',i===0?10:3);return '鷲尾厩舎が選べるようになった（根性を見る目が確か）。';}},
 letter:{r:d=>{const n=d.n;const top=Object.entries(S.people).filter(([id,p])=>p.t1!=null&&id!=='mikuni').sort((a,b)=>b[1].t1-a[1].t1)[0];const tp=top?top[1]:null;
   const bodies=[
   `${cName()}へ\n\nお前に手紙を書くのは初めてだな。たぶん、これが最後になる。\n\nお前の母さんが死んでから、俺は仕事と馬に逃げた。お前の運動会にも、卒業式にも行かなかった。言い訳はしない。\n\nただ、ひとつだけ知っておいてほしい。暮れの中山は、子どものころ俺が親父と見た、唯一の景色だ。お前とも、一度だけでいいから見たかった。`,
   `${cName()}へ\n\n${tp?`困ったら${tp.n}さんを頼れ。俺がいちばん世話になった人だ。口は悪いかもしれんが、嘘はつかない。`:'困ったら三國を頼れ。あいつは俺より、お前のことをわかっている。'}\n\n馬は、話しかければ応える。人間も同じだと、馬に教わった。`,
   `${cName()}へ\n\n${S.horses.some(h=>h.bredBy==='parent')?'俺が最後に種付けを決めた馬たちのことを、頼む。走らなくても、怒らないでやってくれ。':'馬のことは、三國に聞け。'}\n\n有馬を勝て、とは書かない。\nお前が、お前の夢を見つけてくれたら、それでいい。\n\n──父より`][n-1];
   return{p:'mikuni',from:'遺された手紙',title:`父の手紙（${n}通目）`,body:bodies,ch:['手紙をしまう']};},f:()=>'三國が、黙ってお茶を淹れてくれた。'},
 parentCall:{r:()=>{const h=bestRacer();return{p:'mikuni',from:`${S.parent.name}（療養中）`,title:'電話',body:`おう、俺だ。体はまあまあだ。\n\n${h?`新聞で${h.name}を見た。あの馬は${h.dist>=2200?'距離が延びていい':h.dist<=1600?'距離は短いほうがいい':'2000前後がいちばんいい'}。脚質は${h.style}だな。${h.heavy>=1?'それと、雨が降っても気にするな。重い馬場は得意なはずだ。':''}`:'馬の話を聞かせてくれ。'}\n\n…お前の声が聞けて、よかった。`,ch:['「また電話する」']};},
   f:()=>{const h=bestRacer();if(h){h.known.dist=true;h.known.style=true;h.known.going=true;}trust('mikuni',2);return '電話を切ったあと、しばらく受話器を握ったままだった。';}},
 reiChoice:{r:()=>({p:'rei',from:'九条 怜',title:'組みませんか',body:`率直に言います。うちと組みませんか。\n\n九条の種牡馬を、${cName()}さんの牝馬に格安で付けてもいい。代わりに、生まれた馬の何頭かは、うちの牧場で一緒に育てたい。\n\n父と${S.parent.name}さんは、最後まで張り合った。僕は、それが少しもったいなかったと思っています。${S.br.kujoSale==='refused'?'\n\n…父が一目置いた家とだから、こう言えるんです。':''}`,ch:['組む','張り合う']}),
   f:(d,i)=>{if(i===0){S.br.rei='ally';trust('rei',20);log('九条家と手を組む');return '怜は手を差し出した。「同じ夢を見ましょう」\n\n九条家の種牡馬の種付け料が4割になった。';}S.br.rei='rival';trust('rei',-5);S.fame+=2;log('九条家と張り合う道を選ぶ');return '「…父と同じ答えだ」怜は笑った。「なら、中山で決着をつけましょう」';}},
 fatherBred:{r:d=>{const h=HZ(d.hid);if(!h)return null;return{p:'mikuni',from:'三國 透',title:'お父様が選んだ血',body:`${h.name}が、そろそろデビューします。\n\nこの馬の種付けは、${S.parent.name}さんが決めました。母は${h.damName}。中原さんと何時間も話し込んで、「これだ」と。\n\n${S.parent.fate==='rest'?'お父様にも、報告しておきますね。':'…見せてあげたかったです'}`,ch:['大事に育てよう']};},f:(d)=>{const h=HZ(d.hid);if(h)h.bond=Math.min(100,h.bond+10);return '';}},
 soldBlood:{r:d=>({p:'rei',from:'競馬新聞',title:'手放した血',body:`今年の2歳戦に、九条グループの${d.name}がデビューする。\n\n父は、${S.parent.name}がかつて九条に売った、あの馬だ。\n\n三國「…いい馬に育ったようですね。複雑です」`,ch:['負けられない']}),f:()=>''},
 hinataPayback:{r:d=>{const h=HZ(d.hid);return{p:'hinata',from:'日向 翔',title:'断りました',body:`九条さんから、有馬記念の騎乗依頼がありました。勝てる馬です。\n\n断りました。\n\n僕は${h?h.name:'あなたの馬'}に乗ります。${S.parent.name}さんが、デビューしたての僕を一度も降ろさなかったように。\n\n乗せてください。`,ch:['「頼む」']};},
   f:(d)=>{const h=HZ(d.hid);if(h)h.mainJ='hinata';trust('hinata',15);S.flags.hinataOath=1;return '日向は笑った。「暮れの中山で、恩を返します」';}},
 reiDilemma:{r:()=>({p:'rei',from:'九条 怜',title:'同じレースに',body:`今年の有馬記念、うちの馬も出ます。\n\n組んでいる家どうしで、同じレースを走る。父の代なら考えられなかった。\n\n${cName()}さんは、どうしますか。僕は、正面からぶつかりたい。`,ch:['正面から戦う','今年は回避する']}),
   f:(d,i)=>{if(i===0){trust('rei',6);return '「それでこそ」怜はうなずいた。';}S.flags.arimaSkipY=Y(S.t);trust('rei',12);return 'あなたの馬は、今年の有馬記念を見送ることになった。';}},
 /* generic */
 mainAsk:{r:d=>{const h=HZ(d.hid);if(!h||h.mainJ===d.jid)return null;return{p:d.jid,from:who(d.jid),title:`${h.name}に、また乗せてください`,body:V(d.jid,'mainAsk',{h:h.name}),ch:['主戦をお願いする','今は決めない']};},
   f:(d,i)=>{const h=HZ(d.hid);if(i===0){const prev=h.mainJ;h.mainJ=d.jid;trust(d.jid,10);if(prev==='hinata'&&d.jid!=='hinata'){trust('hinata',-15);S.br.hinataSwitch++;if(S.br.hinataSwitch>=2&&!S.br.hinataLeft)S.flags.hinataLeavePending=1;}return `${who(d.jid)}が${h.name}の主戦になった。主戦騎手は基本的に依頼を断らない。`;}trust(d.jid,-2);if(h){h.askNo=h.askNo||{};h.askNo[d.jid]=S.t;}return '「…わかりました」';}},
 hinataLeave:{r:()=>({p:'hinata',from:'日向 翔',title:'お世話になりました',body:`大事なレースで降ろされるのは、二度目です。\n\nわかってます。勝つためには、上手い騎手を乗せたほうがいい。僕でもそうする。\n\n…別の厩舎から、主戦の話をもらいました。お世話になりました。`,ch:['引き留めない','「待ってくれ」']}),
   f:(d,i)=>{S.br.hinataLeft=true;racing().forEach(h=>{if(h.mainJ==='hinata')h.mainJ=null;});log('日向 翔が離れていった');return i===0?'日向は深く頭を下げて、去っていった。':'「…もう、決めたんです」日向は振り返らなかった。';}},
 g1consult:{r:d=>{const h=HZ(d.hid);if(!h||h.status!=='現役')return null;const race=racesFor(h).find(r=>r.key===d.key);if(!race)return null;
   if(!d.js){d.js=[];for(const jid of [h.mainJ,TR(h.trainer)?.jk,...jockeysAvail().filter(x=>x!=='stable').sort((a,b)=>JK(b).sk-JK(a).sk),'stable'].filter((x,i,a)=>x&&a.indexOf(x)===i)){if(d.js.length>=3)break;if(askJockey(jid,h,race)[0])d.js.push(jid);}}
   return{p:h.trainer,from:who(h.trainer),title:`${h.name}を${race.name}へ`,body:V(TV(h.trainer),'consult',{h:h.name,r:`${race.name}（${race.course}${race.surf}${race.dist}m）`,c:COND[h.cond-1]}),ch:[...d.js.map(j=>`出走する（騎手：${JNAME(j)}${h.mainJ===j?'・主戦':''}）`),'今回は回避する']};},
   f:(d,i)=>{const h=HZ(d.hid);const race=racesFor(h).find(r=>r.key===d.key);if(i<d.js.length&&race){const st=entryStatus(h,race);if(st.st==='不可')return '出走条件を満たせなかった。';S.month.orders[h.id]={type:'race',race,j:d.js[i],tac:'おまかせ',by:'trainer'};trust(h.trainer,2);return `${h.name}は${race.name}に向かう。`;}return '「わかりました。次を狙いましょう」';}},
 breeding:{r:d=>{const mr=HZ(d.hid);if(!mr||mr.status!=='繁殖'||mr.preg)return null;const w=S.part===2&&S.br.farm==='support'?'mio':'nakahara';const first=!S.flags.firstBreed;
   return{p:w,from:S.br.farm==='abandon'&&!S.flags.reunion?'大手牧場 繁殖担当':who(w),title:`${mr.name}の種付け`,body:`${first?'いよいよ、あんたの牝馬の初めての種付けだ。どの種牡馬を付けるかで、何年も先が決まる。わしなりに考えてきた。\n\n':''}${mr.name}（${mr.dist}m前後・${mr.temper}）に合いそうなのは、この三頭だ。\n\n${d.list.map((x,i)=>`${['一','二','三'][i]}、${ST(x.id).n}（${yen(x.fee)}）\n　${ST(x.id).desc}。${x.why}`).join('\n\n')}`,ch:[...d.list.map(x=>`${ST(x.id).n}を付ける（${yen(x.fee)}）`),'今年は見送る']};},
   f:(d,i)=>{const mr=HZ(d.hid);S.flags.firstBreed=1;if(i<d.list.length){if(!S.rep)startMonthReport();breed(mr,d.list[i].id);trust(S.part===2&&S.br.farm==='support'?'mio':'nakahara',2);return `${mr.name}に${ST(d.list[i].id).n}を付けた。来年の春、仔馬が生まれる。`;}return '今年は種付けを見送った。';}},
 birth:{r:d=>{const h=HZ(d.hid);if(!h)return null;const w=S.part===2&&S.br.farm==='support'?'mio':'nakahara';const eye=nakaharaEye(h);return{p:w,from:S.br.farm==='abandon'?'大手牧場':who(w),title:'生まれた',body:`夜中の二時に、${h.damName}が産気づいた。\n\n${h.coat}の${h.sex==='牡'?'牡':'牝'}馬。父は${ST(h.sire).n}。三十分で立ち上がって、もう乳を探しとる。\n\n${eye.notes.slice(0,2).join('。')}。\n\n見立ては「${eye.g}」だ。会いに来てやってくれ。`,ch:['名前を考えておく']};},
   f:(d)=>{const h=HZ(d.hid);if(h)h.eye=nakaharaEye(h);return '牧場タブから、仔馬に会いに行ける。';}},
 nyukyu:{r:d=>{const h=HZ(d.hid);if(!h||h.status!=='育成')return null;const tl=trainersAvail();return{p:'mikuni',from:'三國 透',title:`${h.name}の入厩`,body:`${h.name}が2歳になり、トレセンに入る時期です。どちらの厩舎に預けますか。\n\n${tl.map(id=>`${who(id)}：${TR(id).policy==='spaced'?'間隔をあけて大きいところを狙う':'数を使って経験を積ませる'}。${SL[TR(id).eye]}を見る目が確か。`).join('\n')}`,ch:tl.map(id=>`${who(id)}厩舎へ`)};},
   f:(d,i)=>{const h=HZ(d.hid);const id=trainersAvail()[i];h.trainer=id;h.status='現役';h.ev=evalHorse(h);trust(id,3);if(h.unnamed)return `${h.name}は${who(id)}厩舎に入った。厩舎タブで名前を付けよう。`;return `${h.name}は${who(id)}厩舎に入った。デビューは6月から。`;}},
 retireTalk:{r:d=>{const h=HZ(d.hid);if(!h||!['現役','放牧','休養'].includes(h.status))return null;return{p:h.trainer,from:who(h.trainer),title:`${h.name}のこれから`,body:`${V(TV(h.trainer),d.unraced?'retUnraced':d.forced?'retForced':'retAge',{h:h.name,a:ageOf(h)})}\n\n（三國「${h.sex==='牝'?'牝馬ですから、繁殖に上げる道があります。この血を残せます':h.gw.length?'重賞を勝っていますから、種牡馬の話も来るでしょう':studTier(h)===2?'重賞はありませんが、これだけ走った馬です。小さな牧場なら、種牡馬として迎えてくれるはずです':'引退すれば、乗馬クラブが引き取ってくれます'}」）`,ch:[h.sex==='牝'?'引退して繁殖牝馬にする':studTier(h)?'引退して種牡馬に':'引退させる',...(d.forced?[]:['まだ走らせる'])]};},
   f:(d,i)=>{const h=HZ(d.hid);if(i===0)return retireHorse(h,'auto');return '「わかりました。もうひと花、咲かせましょう」';}},
 injury:{r:d=>{const h=HZ(d.hid);if(!h)return null;return{p:h.trainer,from:who(h.trainer),title:`${h.name}、${d.kind}`,body:V(TV(h.trainer),d.kind==='競走能力喪失'?'injEnd':d.kind==='骨折'?'injFrac':'injMinor',{h:h.name,k:d.kind})+(d.kind==='競走能力喪失'&&h.sex==='牝'?'\n\n（三國「繁殖牝馬として、牧場に帰してあげましょう」）':''),ch:['わかった']};},
   f:d=>{const h=HZ(d.hid);if(h&&d.kind==='競走能力喪失'&&h.sex==='牝'){h.status='繁殖';h.mainJ=null;log(`${h.name}が繁殖牝馬になる`);}return '';}},
 legWorry:{r:d=>{const h=HZ(d.hid);if(!h||h.status!=='現役')return null;return{p:h.trainer,from:who(h.trainer),title:`${h.name}の脚元`,body:V(TV(h.trainer),'leg',{h:h.name}),ch:['今月は休ませる','様子を見ながら使う']};},
   f:(d,i)=>{const h=HZ(d.hid);if(i===0){S.month.orders[h.id]={type:'rest'};trust(h.trainer,3);return V(TV(h.trainer),'legYes');}h.risk=1;trust(h.trainer,-2);return V(TV(h.trainer),'legNo')+'（次のレースは故障のリスクが高い）';}},
 tv:{r:d=>{const h=HZ(d.hid);if(!h)return null;return{p:'mikuni',from:'テレビ局',title:'密着取材の依頼',body:`${h.name}と陣営に、週末の競馬番組で密着させていただけませんか。\n\n${S.part===1?'一代で会社を築いた馬主が、小さな牧場の馬で夢を追う──':'父の夢を継いだ馬主──'}きっと多くの方が応援したくなります。`,ch:['受ける','断る']};},
   f:(d,i)=>{const h=HZ(d.hid);if(i===0){h.fans+=6000;S.fame+=2;if(R()<.4)h.cond=clamp(h.cond-1,1,5);return `放送は好評だった。${h.name}のファンが増えた。（カメラに囲まれて、馬は少し落ち着かなかったようだ）`;}return '三國「静かに仕上げたいですものね」';}},
 fanLetter:{r:d=>{const h=HZ(d.hid);if(!h)return null;const L=[`小学生の娘が、${h.name}の絵を描きました。毎週、テレビの前で応援しています。`,`入院中の父が、${h.name}のレースの日だけは起き上がってテレビを見ます。`,`仕事で失敗した日、${h.name}の追い込みを見て泣きました。ありがとうございます。`];return{p:'mikuni',from:'ファンレター',title:`${h.name}へ`,body:pick(L)+'\n\n（三國「厩舎に貼っておきましょうか」）',ch:['厩舎に貼ってもらう']};},f:d=>{const h=HZ(d.hid);if(h)h.bond=Math.min(100,h.bond+3);return '';}},
 stableNews:{r:d=>{const h=HZ(d.hid);if(!h||!h.trainer)return null;const k=d.k;const tx=V(TV(h.trainer),'news',{i:k,h:h.name,like:h.likes,w:h.work[0]?`坂路${h.work[0].t4}秒`:'まだこれから'});
   return{p:h.trainer,from:who(h.trainer),title:'厩舎だより',body:tx,ch:['ありがとう']};},f:d=>{const h=HZ(d.hid);if(h&&d.k===1&&!h.knownLikes.includes('好き:'+h.likes))h.knownLikes.push('好き:'+h.likes);trust(h?.trainer||'mikuni',1);return '';}},
 farmNews:{r:d=>{const h=HZ(d.hid);if(!h)return null;return{p:S.part===2&&S.br.farm==='support'?'mio':'nakahara',from:S.br.farm==='abandon'&&!S.flags.reunion?'大手牧場':'中原牧場',title:'牧場から',body:h.status==='繁殖'?`${h.name}は元気です。${h.preg?'お腹の子も順調。':'今は放牧地でのんびりしています。'}`:`${h.name}は放牧地で一番はしゃいでいます。${h.temper==='気難しい'?'ほかの仔馬を追いかけ回して困ります。':'人懐っこくて、すぐ寄ってきます。'}`,ch:['写真を送ってもらう']};},f:d=>{const h=HZ(d.hid);if(h)h.bond=Math.min(100,h.bond+2);return '';}},
 fanVote:{r:d=>({p:'mikuni',from:'有馬記念 ファン投票',title:`${Y(S.t)}年 有馬記念 ファン投票`,body:d.list.map((x,i)=>`${i+1}位　${x.n}${x.me?'　◀ あなたの馬':''}　${x.f.toLocaleString()}票`).join('\n')+`\n\n${d.ok.length?`${d.ok.join('、')}は有馬記念に出走できます。暮れの中山へ。`:'今年は、あなたの馬は届きませんでした。ファン4万人、獲得賞金2億円、G1勝ちのどれかが必要です。'}`,ch:['よし']}),f:()=>''},
 lowMoney:{r:()=>({p:'mikuni',from:'三國 透',title:'資金のことで',body:`資金が心もとなくなってきました。現在${yen(S.money)}です。\n\n毎月の預託料だけで${yen(monthlyCost())}かかります。成績の上がらない馬を手放すことも考えましょう。マイナス5000万円を下回ると、馬主を続けられなくなります。`,ch:['わかった']}),f:()=>''},
};
function retireHorse(h,how){
  if(!h)return '';
  h.mainJ=null;
  if(h.sex==='牝'){h.status='繁殖';log(`${h.name}が引退し、繁殖牝馬に`);return `${h.name}は牧場に帰り、繁殖牝馬になった。来年の春から、種付けの相談が来る。`;}
  if(h.gw.length){const v=h.g1?20000+h.g1*12000:2000+h.gw.length*1200;S.money+=v;h.status='引退';addStallion(h,true);log(`${h.name}が種牡馬入り`);return `${h.name}は種牡馬になった。シンジケートで${yen(v)}を得た。あなたの牝馬にも付けられる。`;}
  // no graded win, but an open-class horse or a proven winner: a small stud takes him (a modest syndicate, a modest fee)
  if(studTier(h)===2){const v=300+h.wins*80+Math.round((h.earn||0)*.02);S.money+=v;h.status='引退';addStallion(h,true,clamp(Math.round(h.pot-3),62,80));log(`${h.name}が種牡馬入り（地方の牧場で供用）`);
    return `${h.name}は、日高の小さな牧場で種牡馬になった。${yen(v)}で権利が売れた。\n\n重賞は勝てなかったが、走りを覚えていてくれた生産者がいた。種付け料は安いが、あなたの牝馬にも付けられる。`;}
  h.status='引退';S.money+=100;log(`${h.name}が引退`);return `${h.name}は乗馬として第二の馬生へ。`;
}
/* can a colt stand at stud?  1 = graded winner (a real syndicate), 2 = open class or a proven winner (a small stud), 0 = no */
function studTier(h){if(!h||h.sex==='牝')return 0;if(h.gw&&h.gw.length)return 1;if((h.cls||0)>=5||(h.wins||0)>=4||(h.earn||0)>=8000)return 2;return 0;}

/* ---------- 人に会う ---------- */
const GREET={};
function tierNow(id){const v=P(id).trust;return v>=60?2:v>=30?1:0;}
function fatherTalk(id){
  const d=tier(id),f=S.parent.name;
  const T={
   mikuni:[`「${f}さんは…不器用な人でした。それだけです」`,`「${f}さんは、私を拾ってくれた人です。厩務員を辞めて途方に暮れていたときに」`,`「${f}さんは、毎年、${cName()}さんの誕生日に電話をかけようとして、結局かけられずにいました。受話器を持ったまま、一時間も。…私はずっと、それを見ていたんです」`],
   koyanagi:[`「戸川先生から少し聞いてます。馬を大事にする人だったって」`,`「戸川先生がよく言ってました。“あの馬主は、勝っても負けても、まず馬の脚を見る”って」`,`「戸川先生、引退の日に泣いてたんです。“${f}さんの馬で有馬を獲らせてやれなかった”って。先生が泣くの、初めて見ました」`],
   togawa:[`「…覚えとらん」`,`「いい馬主だった」`,`「あの人は、わしが一番苦しかったときに、馬を預けてくれた」`],
   hayase:[`「お父様には、何度か馬を見ていただきました」`,`「重賞を勝てない私に、“焦るな”って言ってくれたのは、${f}さんだけでした」`,`「私が初めて重賞を勝った夜、${f}さんが厩舎の全員に寿司を取ってくれたんです。自分の馬じゃないのに。…あの人、そういう人でした」`],
   washio:[`「知らねえよ」`,`「…頑固な男だった」`,`「あんたの親父はな、俺が落馬して干されてたとき、黙って騎乗依頼をよこした。勝てる馬じゃなかった。でも、あれで俺は戻れた」`],
   hinata:[`「お世話になりました」`,`「デビューしたての僕を、${f}さんだけが信じてくれました」`,`「負けて泣いてた僕に、${f}さんは何も言わずに缶コーヒーを渡してくれました。“次も乗れ”って、それだけ。…あの味、忘れません」`],
   nakahara:[`「…いい客だった」`,`「あいつは、わしの牧場の馬を見て、値段より先に名前を聞いた。そんな奴は初めてだった」`,`「あいつとはな、夜中に仔馬が生まれるのを、二人で何度も待った。酒も飲まずに、ただ黙って。…あんな友達は、もうできん」`],
   mio:[`「父がよく話してました」`,`「${f}さん、仔馬が生まれると、子どもみたいにはしゃいでたんですよ」`,`「${f}さんが最後に牧場に来たとき、放牧地の柵にもたれて、ずっと仔馬を見てました。“${cName()}にも見せたかった”って」`],
   kujo:[`「好敵手だった」`,`「あの男の馬に負けた年の有馬は、今でも夢に見る」`,`「あいつだけは、私の金に一度も頭を下げなかった。…羨ましかったんだろうな、私は」`],
   rei:[`「父が話していました」`,`「父は、${f}さんの話をするときだけ、楽しそうでした」`,`「父の書斎に、${f}さんの勝負服の写真が飾ってあるんです。ライバルの写真を飾る人なんて、他に知りません」`],
  };
  return (T[id]||[`「いい人でした」`,`「いい人でした」`,`「いい人でした」`])[d];
}
const TOPICS={
 mikuni:[
  {id:'status',label:'最近の様子を聞く',run:()=>{const b=bestRacer();const up=b?GR.filter(g=>g.gr==='G1'&&g.m>=M(S.t)&&g.m<=M(S.t)+3&&g.surf===b.surf&&Math.abs(g.dist-b.dist)<=500&&ageOk(g.age,ageOf(b))).map(g=>`${g.m}月の${g.n}`):[];return{text:`「資金は${yen(S.money)}、月々の出費は${yen(monthlyCost())}です。${b?`いちばん期待できるのは${b.name}。${up.length?up.join('、')+'あたりが狙えるかもしれません':'今は力をつける時期ですね'}。`:''}」`,d:2};}},
  {id:'self',label:'三國さん自身のことを聞く',once:true,cond:()=>P('mikuni').trust>=45,run:()=>({text:'「私、昔は厩務員だったんです。担当馬に蹴られて膝を壊して、それきり。\n…馬のそばにいたかった。だから、この仕事はありがたいんです」',d:10})},
  {id:'health',label:'「体のこと、誰にも言わないでくれ」',once:true,cond:()=>S.part===1&&S.flags.coughKnown,run:()=>({text:'三國はしばらく黙っていた。\n「言いません。…でも、約束してください。いちばん大事なときは、ご自分を選んでください」',d:6})},
  {id:'father',label:'父のことを聞く',once:true,cond:()=>S.part===2,run:()=>({text:fatherTalk('mikuni'),d:6})},
  {id:'rival',label:'九条の馬について聞く',run:()=>{const r=S.rivals.filter(x=>x.owner==='九条'&&x.status==='現役').sort((a,b)=>bestAb(b)-bestAb(a))[0];return{text:r?`「九条さんのところで一番手強いのは${r.name}です。${r.surf}の${r.dist}m前後、${r.style}。${r.g1?`G1を${r.g1}つ勝っています。`:''}主戦は${r.j&&P(r.j)?P(r.j).n:'外国人騎手'}」`:'「今は目立つ馬はいません」',d:1};}},
  {id:'advice',label:'馬のことを相談する',run:()=>{const h=racing().find(h=>!h.known.dist||!h.known.style);if(!h)return{text:'「どの馬も、だいぶわかってきましたね」',d:1};h.known.style=true;return{text:`「${h.name}は、レースを見ていると${h.style}の形が合っているように思います。${h.rec.length>=2?`それと、${h.dist>=2200?'距離は長いほうが':'距離は延ばさないほうが'}いい気がします。`:''}」`,d:2};}},
 ],
 togawa:[
  {id:'look',label:'馬を見てもらう',run:()=>lookTalk('togawa')},
  {id:'past',label:'昔の話を聞く',once:true,cond:()=>P('togawa').trust>=30,run:()=>({text:'「三十年前、有馬で二着だった。ハナ差だ。\nあの馬は次の年に脚を折った。わしが使い詰めにしたからだ。\n…それから、馬に無理をさせるのをやめた」',d:10})},
  {id:'target',label:'次の目標を相談する',run:()=>targetTalk('togawa')},
  {id:'drink',label:'一杯どうですか',run:()=>P('togawa').trust>=25?{text:'「…一杯だけだぞ」\n戸川は日本酒をなめるように飲みながら、昔の名馬の話を二時間した。',d:6}:{text:'「酒は飲まん。馬が起きる時間に起きられなくなる」',d:1}},
 ],
 koyanagi:[
  {id:'look',label:'馬を見てもらう',run:()=>lookTalk('koyanagi')},
  {id:'target',label:'次の目標を相談する',run:()=>targetTalk('koyanagi')},
  {id:'father',label:'父のことを聞く',once:true,run:()=>({text:fatherTalk('koyanagi'),d:6})},
  {id:'self',label:'厩舎を継いだ気持ちを聞く',once:true,run:()=>({text:'「正直、怖いです。先生の看板、重くて。\nでも、先生が最後に言ったんです。“馬の声を聞け。人の声はその次でいい”って」',d:8})},
 ],
 hayase:[
  {id:'look',label:'馬を見てもらう',run:()=>lookTalk('hayase')},
  {id:'dream',label:'早瀬さんの夢を聞く',once:true,cond:()=>P('hayase').trust>=25,run:()=>({text:'「女だから、若いから、って言われ続けてきました。\nだから、G1を勝ちたい。勝って、“早瀬の馬だから”って言われたいんです」',d:10})},
  {id:'target',label:'次の目標を相談する',run:()=>targetTalk('hayase')},
  {id:'father',label:'父のことを聞く',once:true,cond:()=>S.part===2,run:()=>({text:fatherTalk('hayase'),d:6})},
  {id:'praise',label:'仕上げを褒める',run:()=>({text:'「えっ、本当ですか！ …もっと頑張ります」\n早瀬の頬が少し赤くなった。',d:4})},
 ],
 washio:[
  {id:'ask',label:'G1で乗ってほしいと頼む',cond:()=>S.part===1,run:()=>{const h=bestRacer();if(!h||h.cls<5)return{text:'「G1に出られる馬もいねえのに、何を頼むんだ」',d:0};if(P('washio').trust<50)return{text:`「${h.name}か。…まだだ。俺を口説くには早い」`,d:2};S.flags.washioPromise={hid:h.id};return{text:`「${h.name}か。…いいだろう。次のG1、空けといてやる」\n（鷲尾がG1で${h.name}に乗ってくれる約束をした）`,d:5};}},
  {id:'drink',label:'飲みに誘う',run:()=>P('washio').trust<20?{text:'「あんたと飲む酒はねえ」',d:2}:{text:'焼き鳥屋のカウンターで、鷲尾はほとんど喋らなかった。\n帰り際、ぽつりと言った。\n「…馬主ってのは、負けたときに何を言うかで決まる」',d:6}},
  {id:'kujo',label:'九条の馬について聞く',cond:()=>S.part===1,run:()=>{const r=S.rivals.filter(x=>x.owner==='九条'&&x.status==='現役').sort((a,b)=>bestAb(b)-bestAb(a))[0];return{text:r?`「${r.name}か。強えよ。だが${r.heavy<0?'雨が降ったら脆い':r.style==='先行'||r.style==='逃げ'?'ハイペースになれば止まる':'直線の短い中山は得意じゃねえ'}」`:'「今は大した馬はいねえ」',d:2};}},
  {id:'future',label:'これからのことを聞く',once:true,cond:()=>S.part===1&&P('washio').trust>=50&&yearNo()>=5,run:()=>({text:'「…あと何年も乗れねえ。体がな。\n辞めたら、調教師になる。俺が乗りたいと思う馬を、自分で作る」',d:8})},
  {id:'look',label:'馬を見てもらう',cond:()=>S.part===2&&S.flags.washioTrainer,run:()=>lookTalk('washio')},
  {id:'father',label:'父のことを聞く',once:true,cond:()=>S.part===2,run:()=>({text:fatherTalk('washio'),d:6})},
 ],
 hinata:[
  {id:'cheer',label:'調子を聞く',run:()=>{JK('hinata').sk=Math.min(94,JK('hinata').sk+.3);return{text:pick(['「最近、少しずつ勝てるようになってきました」','「鷲尾さんの騎乗、ビデオで百回は見ました」','「朝、${h}の調教に乗るのが楽しみなんです」'.replace('${h}',bestRacer()?.name||'馬')]),d:4};}},
  {id:'dream',label:'夢を聞く',once:true,cond:()=>P('hinata').trust>=30,run:()=>({text:'「有馬記念です。あの勝負服で。\n…笑わないでくださいね。デビューした日から、ずっとそれだけ考えてるんです」',d:10})},
  {id:'promise',label:'「次の大舞台、頼むぞ」',cond:()=>!!bestRacer(),run:()=>{const h=bestRacer();if(h.mainJ==='hinata')return{text:'「もちろんです。任せてください」',d:3};h.mainJ='hinata';return{text:`「…僕でいいんですか」\n日向の目が赤くなった。\n（${h.name}の主戦を日向に）`,d:8};}},
  {id:'father',label:'父のことを聞く',once:true,cond:()=>S.part===2,run:()=>({text:fatherTalk('hinata'),d:6})},
 ],
 nakahara:[
  {id:'farm',label:'牧場の様子を聞く',run:()=>{const h=atFarm().filter(h=>h.status!=='繁殖')[0];if(!h)return{text:'「今は静かなもんだ。繁殖の母さんたちも元気だよ」',d:3};h.eye=nakaharaEye(h);h.known.growth=true;return{text:`「${h.name}か。${h.eye.notes.join('。')}。見立てで言えば「${h.eye.g}」だな」`,d:3};}},
  {id:'blood',label:'血統の話を聞く',cond:()=>mine().some(h=>h.status==='繁殖'),run:()=>{const mr=mine().find(h=>h.status==='繁殖');const best=S.stallions.filter(s=>!s.dead).sort((a,b)=>(b.q*.55+nick(mr,b))-(a.q*.55+nick(mr,a)))[0];const tr=P('nakahara').trust;const sug=tr>=50?best:pick(S.stallions);mr.tip=sug.id;return{text:`「${mr.name}には、${sug.n}が合うと思う。${tr>=50?'これは自信がある':'…まあ、勘だがな'}」`,d:4};}},
  {id:'help',label:'牧場の仕事を手伝う',cond:()=>S.flags.helpY!==Y(S.t),run:()=>{S.flags.helpY=Y(S.t);atFarm().forEach(h=>h.bond=Math.min(100,h.bond+4));return{text:'一日、寝わらを運び、仔馬の手入れをした。夕方、中原が黙って缶コーヒーを差し出した。',d:8};}},
  {id:'daughter',label:'娘さんの話を聞く',once:true,cond:()=>P('nakahara').trust>=40,run:()=>({text:'「澪は、東京の大学を出て、戻ってきおった。牧場を継ぐと言ってな。\n…やめとけと言ったんだが。わしに似て、頑固でな」',d:6})},
  {id:'father',label:'父のことを聞く',once:true,cond:()=>S.part===2,run:()=>({text:fatherTalk('nakahara'),d:6})},
 ],
 mio:[
  {id:'farm',label:'牧場の様子を聞く',run:()=>TOPICS.nakahara[0].run()},
  {id:'blood',label:'血統の話を聞く',cond:()=>mine().some(h=>h.status==='繁殖'),run:()=>TOPICS.nakahara[1].run()},
  {id:'father',label:'父のことを聞く',once:true,run:()=>({text:fatherTalk('mio'),d:6})},
  {id:'self',label:'牧場を継いだ理由を聞く',once:true,run:()=>({text:'「父さんの背中を見て育ったから、かな。\n…それと、${f}さんが牧場を残してくれたから。あのお金がなかったら、ここはもうないんです」'.replace('${f}',S.parent.name),d:8})},
 ],
 kujo:[
  {id:'greet',label:'あいさつする',run:()=>({text:pick(['「最近、あなたの馬の名前をよく聞く」','「勝つ馬主は、負けた日の顔でわかる」','「金はいくらあっても、時間は買えん」']),d:3})},
  {id:'probe',label:'探りを入れる',run:()=>{const r=S.rivals.filter(x=>x.owner==='九条'&&x.status==='現役').sort((a,b)=>bestAb(b)-bestAb(a))[0];return{text:r?`「${r.name}は、${r.dist>=2200?'有馬':'秋の天皇賞'}を狙う。隠すことでもない」`:'「今年は静かにしておくよ」',d:1};}},
  {id:'past',label:'九条さんの昔の話を聞く',once:true,cond:()=>P('kujo').trust>=30,run:()=>({text:'「私の父は、競馬で財産を失った。\nだから私は、負けない仕組みを作った。生産も、育成も、騎手も、全部自前でな。\n…それでも、有馬だけは思い通りにならん」',d:8})},
  {id:'father',label:'父のことを聞く',once:true,cond:()=>S.part===2,run:()=>({text:fatherTalk('kujo'),d:6})},
 ],
 rei:[
  {id:'greet',label:'あいさつする',run:()=>({text:pick(['「父は今でも、毎朝新聞の馬柱を見ています」','「九条の看板は、重いです」','「あなたの厩舎、雰囲気がいいですね」']),d:3})},
  {id:'probe',label:'探りを入れる',run:()=>TOPICS.kujo[1].run()},
  {id:'talk',label:'二代目どうしの話をする',once:true,cond:()=>P('rei').trust>=25,run:()=>({text:'「父と比べられるのは、もう慣れました。\nでも時々、全部投げ出したくなる。…あなたは、どうやって折り合いをつけてるんですか」',d:10})},
  {id:'father',label:'父のことを聞く',once:true,run:()=>({text:fatherTalk('rei'),d:6})},
 ],
};
['kido','rossi','sanada','kiryu','oba','dubois','komori','kuroiwa','arai'].forEach(id=>{TOPICS[id]=jockeyTopics(id);});
TOPICS.hinata.push(...jockeyTopics('hinata').filter(t=>t.id==='horse'));
TOPICS.washio.push(...jockeyTopics('washio').filter(t=>t.id!=='ride').map(t=>({...t,cond:()=>S.part===1&&(!t.cond||t.cond())})));
function lookTalk(id){
  const tv=TV(id);
  const h=racing().filter(h=>h.trainer===id).sort((a,b)=>(a.known.dist?1:0)-(b.known.dist?1:0))[0];
  if(!h)return{text:V(tv,'targetNone'),d:0};
  const saved=P(id).trust;P(id).trust=Math.max(saved,85);h.ev=evalHorse(h);P(id).trust=saved;
  h.known.dist=true;h.known.growth=true;
  const g=V(tv,'grow');
  return{text:V(tv,'look',{h:h.name,sf:h.surf==='芝'?'芝':'ダート',d:h.dist,grow:g[h.growth],stat:SL[TR(id).eye],sym:sym(h.st[TR(id).eye])})+`\n（${h.name}の評価が正確になった）`,d:3};
}
function targetTalk(id){
  const tv=TV(id);
  const h=racing().filter(h=>h.trainer===id)[0];
  if(!h)return{text:V(tv,'targetNone'),d:1};
  const a=ageOf(h);
  const gs=GR.filter(g=>ageOk(g.age,a+(g.m<M(S.t)?1:0))&&(!g.sex||h.sex==='牝')&&g.surf===h.surf&&Math.abs(g.dist-h.dist)<=400).sort((x,y)=>((x.m-M(S.t)+12)%12)-((y.m-M(S.t)+12)%12)).slice(0,2);
  return{text:(gs.length?V(tv,'target',{h:h.name,list:gs.map(g=>`${g.m}月の${g.n}（${g.gr}）`).join('、')}):V(tv,'targetCls'))+(gs.length&&h.cls<5?' '+V(tv,'targetCls'):''),d:3};
}
function peopleList(){
  const ids=S.part===1?['mikuni','togawa','hayase','nakahara','kujo']:['mikuni','koyanagi','hayase','washio','nakahara','mio','kujo','rei'];
  const js=Object.keys(S.jockeys).filter(id=>!(S.part===2&&id==='washio')).sort((a,b)=>JK(b).sk-JK(a).sk);
  return [...ids,...js].filter(id=>P(id).met);
}
function canMeet(id){
  if(S.restPenalty>0)return '療養中のため、人に会えない';
  if(S.month.met)return '今月はもう人に会った';
  if(JK(id)&&JK(id).season&&!JK(id).season.includes(M(S.t))&&!(id==='washio'&&S.part===2))return `今は来日していない（${JK(id).season[0]}〜${JK(id).season[JK(id).season.length-1]}月）`;
  if(id==='nakahara'&&S.br.farm==='abandon'&&!S.flags.reunion)return '連絡がつかない';
  if(id==='hinata'&&S.br.hinataLeft&&P('hinata').trust<40)return '会ってもらえない';
  return '';
}
function topicsFor(id){
  const used=S.topicT[id]||{};
  return (TOPICS[id]||[]).filter(tp=>(!tp.cond||tp.cond())&&!(tp.once&&used[tp.id]!=null)&&!(used[tp.id]!=null&&S.t-used[tp.id]<3));
}

/* ---------- 馬とふれあう ---------- */
const TOUCH=['なでる','ブラッシング','にんじん','りんご','話しかける','曳き運動'];
const TOUCH_KEY={なでる:'なでる',ブラッシング:'ブラッシング',にんじん:'にんじん',りんご:'りんご',話しかける:'話しかける',曳き運動:'曳き運動'};
function touchReact(h,act){
  const foal=['当歳','1歳'].includes(h.status);
  const liked=h.likes===act,dis=h.dislikes===act,b=h.bond,tp=h.temper;
  const LK={なでる:'首すじをなでると、目を細めて頭を預けてきた。どうやら、なでられるのが大好きらしい。',ブラッシング:'ブラシをかけると、気持ちよさそうに首を伸ばし、下唇をぷるぷる震わせた。ブラッシングが大好きらしい。',にんじん:'にんじんを見せた瞬間、鼻を鳴らして前搔きを始めた。ばりばりと一瞬で平らげ、もっとくれと袖をくわえてくる。',りんご:'りんごの匂いに耳がぴんと立った。しゃくしゃくと噛みしめるように食べて、手のひらまでなめてくる。',話しかける:'静かに話しかけると、耳をこちらに向けて、じっと聞いているようだった。最後に、小さく鼻を鳴らした。',曳き運動:'引き手を持って歩き出すと、うれしそうに足取りが軽くなった。並んで歩くのが好きらしい。'};
  const DS={なでる:'手を伸ばすと、首を振って避けられた。顔のまわりを触られるのは、あまり好きじゃないみたいだ。',ブラッシング:'ブラシを当てると、皮膚をぴくぴくさせて体をよじった。ブラッシングは苦手らしい。',にんじん:'にんじんの匂いを嗅いで、ぷいと横を向いた。にんじんは好きじゃないらしい。',りんご:'りんごをくわえて、ぽとりと落とした。りんごはお気に召さないようだ。',話しかける:'話しかけると、耳を後ろに倒してしまった。今はそっとしておいてほしいらしい。',曳き運動:'引き手を持つと、その場で踏ん張って動かなくなった。歩く気分じゃないらしい。'};
  let txt,d;
  if(liked){txt=LK[act];d=8;}
  else if(dis){txt=DS[act];d=-2;}
  else{
    if(tp==='気難しい'&&b<30){txt=pick(['耳を絞って、こちらの様子をうかがっている。まだ心を許してはいないらしい。','一歩下がって、じっとこちらをにらんでいる。気の強い目だ。']);d=2;}
    else if(tp==='素直'){txt=pick(['おとなしく受け入れてくれた。穏やかな目をしている。','鼻先をそっと寄せてきた。人が好きな馬だ。']);d=4;}
    else{txt=pick(['しばらくすると、こちらに体を預けてきた。','ふん、と鼻を鳴らした。まんざらでもないらしい。','落ち着いた様子で、されるがままになっている。']);d=3;}
  }
  if(foal&&!dis)txt=txt.replace('首すじ','小さな首すじ')+(R()<.5?' 母馬が、少し離れたところから見守っている。':'');
  const before=h.bond;h.bond=clamp(h.bond+d,0,100);
  const tag=(liked?'好き:':dis?'苦手:':'')+act;
  if((liked||dis)&&!h.knownLikes.includes(tag))h.knownLikes.push(tag);
  if(liked&&h.status==='現役'&&R()<.35)h.cond=clamp(h.cond+1,1,5);
  let ms='';
  if(before<30&&h.bond>=30)ms=`${h.name}が、あなたの顔を覚えたようだ。`;
  if(before<60&&h.bond>=60)ms=`${h.name}が、あなたの足音を聞くと、馬房から顔を出して待つようになった。`;
  if(before<90&&h.bond>=90)ms=`${h.name}は、あなたが帰ろうとすると、袖をくわえて離さない。`;
  return{txt,d,ms};
}

/* ---------- endings ---------- */
function bloodOfParent(h){let x=h,n=0;while(x&&n<6){if(x.bredBy==='parent')return true;x=x.dam!=null?HZ(x.dam):null;n++;}return false;}
function makeEnding(h,jid,time){
  const p=S.part,alive=S.parent.fate==='rest',both=p===2&&S.won.parent;
  const conds=[];
  if(p===2){
    const pb=bloodOfParent(h),hidaka=h.breeder==='中原',hin=jid==='hinata';
    if(pb&&hidaka&&hin&&alive)conds.push('真のエンディング');
    if(both)conds.push('二代の夢');
    if(S.flags.beatSold)conds.push('手放した血');
    if(S.br.rei==='rival'&&S.flags.beatRei)conds.push('因縁の直線');
    if(S.br.rei==='ally'&&ST(h.sire)?.owner==='九条')conds.push('同じ夢を見た家');
    if(pb)conds.push('血は続く');
    if(hidaka)conds.push('日高の朝');
    if(hin)conds.push('約束の鞍');
    conds.push(alive?'スタンドの父':'父の勝負服');
  }else conds.push('夢が叶った日');
  const title=conds[0];
  const owner=ownerName(),y=Y(S.t);
  const goal=`第${y-1955}回 有馬記念。\n\n中山の直線、急坂を駆け上がって、${h.name}が先頭に立った。鞍上は${JNAME(jid)}。${h.breeder==='中原'?'日高の小さな牧場で生まれた馬だ。':''}${bloodOfParent(h)&&p===2?`${S.parent.name}が種付けを決めた血が、いま先頭でゴール板を駆け抜ける。`:''}\n\n勝ちタイム ${time}。`;
  let stand;
  if(p===1)stand=`スタンドで、${S.parent.name}は声も出せずに立ち尽くしていた。三國が隣で、子どものように泣いていた。\n\n子どもの頃、父親に手を引かれて見た、あの暮れの中山。その景色の真ん中を、いま自分の勝負服が走っている。`;
  else if(alive)stand=`車椅子の${S.parent.name}が、スタンドの最前列にいた。三國が付き添っている。\n\nゴールの瞬間、${S.parent.name}は立ち上がろうとして、三國に止められた。それでも手すりを握って、${cName()}の名前を叫んでいた。\n\n口取りの写真に、親子が初めて並んだ。`;
  else stand=`スタンドの${cName()}の胸ポケットには、父の手紙が入っていた。\n\n「お前が、お前の夢を見つけてくれたら、それでいい」\n\n三國が、遺影を抱いて隣に立っていた。${both?'父がかつて勝ったのと同じ、暮れの中山で。':''}`;
  const after=[];
  if(S.br.farm==='support')after.push(p===2?`中原牧場では、澪が仔馬たちに${h.name}のゼッケンを見せて回っている。修造は「わしの見立てどおりだ」と言い張っている。`:'中原牧場では、修造が一升瓶を抱えて、放牧地の真ん中で寝ていたらしい。');
  else after.push('中原は、雇われ先の牧場の休憩室で、ひとりテレビを見ていた。ゴールの瞬間、誰もいない部屋で拍手をした。');
  if(S.br.kujoSale==='refused')after.push('九条 隆臣から、短い電報が届いた。「見事」');
  if(S.br.kujoSale==='sold')after.push('九条は、かつて買った馬の写真を見ながら、「あの男の目は正しかった」とつぶやいた。');
  if(p===2&&S.br.rei==='ally')after.push('怜は、口取りの輪の端で、自分のことのように笑っていた。');
  if(p===2&&S.br.rei==='rival')after.push('怜は、二着の馬を迎えに行く前に、こちらに向かって一度だけ頭を下げた。');
  if(jid==='hinata')after.push('日向は、検量室の前でヘルメットを抱えて泣いていた。「恩、返せましたか」');
  else if(S.br.hinataLeft)after.push('別の厩舎の勝負服を着た日向が、遠くから小さく拍手を送っていた。');
  if(p===2&&S.people.washio.met)after.push('鷲尾は、厩舎で「…やりやがった」とだけ言って、煙草に火をつけた。');
  return{title,goal,stand,after:after.join('\n\n'),conds};
}

const JINTRO={
 kiryu:{from:'早瀬厩舎',body:'早瀬の厩舎で、黙々と馬に乗っている若い女性騎手がいた。\n\n「桐生 玲奈です。早瀬先生のところに所属してます」\n\n汗をぬぐって、まっすぐこちらを見る。\n\n「いい馬を持ってるって聞きました。私、差し馬に乗るのが得意です。…覚えておいてください」',ch:[['「覚えておく」','「…はい。忘れないでくださいね」桐生は少しだけ笑った。',4],['「勝ってから売り込んでくれ」','「言われなくても、勝ちます」',2]]},
 kido:{from:'美浦トレーニングセンター',body:'調教スタンドで、穏やかそうな騎手が会釈してきた。\n\n「城戸です。戸川先生には、新人の頃からお世話になってます。\n\n派手な騎乗はできませんが、崩れない自信はあります。何かあれば、声をかけてください」',ch:[['「頼りにしてる」','「ありがとうございます。期待を裏切らないようにします」',5],['「よろしく」','城戸は丁寧に頭を下げた。',3]]},
 kuroiwa:{from:'函館競馬場',body:'夏の函館。海からの風が冷たい朝、日焼けした年配の騎手が話しかけてきた。\n\n「あんたが噂の新米オーナーかい。黒岩だ。夏の北海道じゃ、ちょっとは名の知れた男だべ」\n\n「北海道の馬場は、本州とは違う。洋芝はな、パワーがねえと走れねえんだ。夏に馬を連れてくるなら、おれに声かけな」',ch:[['「夏はお願いします」','「なんもなんも。任せれ」',5],['「そんなに違うんですか」','「違う違う。一回来てみればわかるべさ」',3]]},
 rossi:{from:'東京競馬場',body:'秋の東京競馬場。検量室の前で、陽気な外国人騎手が手を振ってきた。\n\n「Ciao! マルコ・ロッシ。イタリアから来たよ。毎年、秋だけ日本に乗りに来るんだ」\n\n「日本の秋の競馬は、世界でいちばん美しい。いい馬がいたら、僕に乗せてよ！」',ch:[['「来年も来てくれ」','「Certo! もちろんさ！」',5],['「腕を見せてくれ」','「OK! 日曜日、見ててね」ロッシはウインクした。',3]]},
 oba:{from:'阪神競馬場',body:'阪神の騎手控室の前で、声の大きなベテランに呼び止められた。\n\n「あんたか、中原んとこの芦毛の馬主は。大庭や、大庭 豪」\n\n「わしはな、前に行く馬しか乗らへん。後ろからちんたら差すのは性に合わんのや。逃げ馬がおったら、わしに回してや」',ch:[['「逃げ馬が出たら頼みます」','「おう、約束やで」',5],['「差し馬はダメですか」','「乗れんことはないけどな。顔に出るで」大庭は笑った。',3]]},
 arai:{from:'東京競馬場',body:'冬のダート戦のあと、砂だらけの騎手がヘルメットを脱いだ。\n\n「新井っす。ダートばっか乗ってるっす」\n\n「芝の重賞とか、正直よくわかんないっす。でも、砂の上なら誰にも負けないっす。ダートの馬がいたら、声かけてほしいっす」',ch:[['「ダートなら任せる」','「あざっす！」',5],['「芝も乗ればいいのに」','「芝は…いろいろあったんすよ」新井は目をそらした。',2]]},
 dubois:{from:'中山競馬場',body:'春の中山。パドックの脇で、外国人の騎手が丁寧に日本語で話しかけてきた。\n\n「はじめまして。クレマン・デュボワと申します。フランスから参りました。毎年、春の三か月だけ、日本で乗らせていただいています」\n\n「雨の日の競馬が得意です。フランスの馬場は、いつも重いので」',ch:[['「春はお願いします」','「Merci. 光栄です」',5],['「日本語が上手ですね」','「競馬のビデオで覚えました。実況の言葉ばかりですが」',4]]},
 sanada:{from:'東京競馬場',body:'G1の表彰式のあと、勝った騎手とすれ違った。真田 光。この数年、リーディングを独占している天才だ。\n\n目が合った。\n\n「…あなたが、中原牧場の馬主ですか」\n\n「勝てる馬を連れてきてください。そうすれば乗ります。それ以外の理由では、乗りません」',ch:[['「必ず連れてくる」','「…期待しないで待っています」',4],['「冷たいな」','「正直なだけです」',1]]},
 komori:{from:'美浦トレーニングセンター',body:'デビューしたばかりの新人騎手が、震える声で話しかけてきた。\n\n「あ、あの…小森 ゆいです。今年デビューしました」\n\n「実家が、日高の牧場で…中原さんのところの、近くなんです。あの芦毛の馬、小さいころ見に行ったことがあって…」\n\n「い、いつか、オーナーの馬に乗れたら…いえ、なんでもないです！」',ch:[['「いつか乗ってもらうよ」','「ほ、本当ですか…！ 私、がんばります！」',8],['「まずは勝てるようになって」','「…はい。がんばります」小森は小さくうなずいた。',3]]},
};
