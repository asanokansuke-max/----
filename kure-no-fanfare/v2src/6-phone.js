/* =========================================================
   phone: mails (with replies & deadlines) and sudden calls
   ========================================================= */
Object.assign(SE,{
  mail(t){fxTone(t,88,.18,.1);fxTone(t+.12,93,.3,.1);},
  ring(t){for(let r=0;r<2;r++)for(let i=0;i<8;i++){fxTone(t+r*.5+i*.05,i%2?81:86,.06,.07,'square');}},
  pickup(t){fxTone(t,76,.08,.08);fxTone(t+.07,83,.12,.08);},
  hangup(t){fxTone(t,64,.15,.1);fxTone(t+.15,64,.15,.1);fxTone(t+.3,64,.15,.1);},
});
function PH(){if(!S.phone)S.phone={mails:[],hist:[],out:[]};return S.phone;}
const pname=id=>id&&P(id)?P(id).n:id;
const anyHorse=()=>racing().filter(h=>h.status==='現役');
const farmFoal=()=>atFarm().filter(h=>['当歳','1歳'].includes(h.status));

/* ---------- メール ---------- */
/* r: [label, effect()->reaction text]. ig: effect when the deadline passes unanswered */
const MAILS={
  photo:{w:()=>farmFoal().length?3:0,mk:d=>{const h=d.hid&&HZ(d.hid)?HZ(d.hid):pick(farmFoal());d.hid=h.id;return{from:S.part===2&&S.br.farm==='support'?'mio':'nakahara',subj:`${h.name}の近況`,hid:h.id,
     body:S.part===2&&S.br.farm==='support'?`${h.name}、最近は放牧地でいちばん走り回ってます！ 写真送りますね。\n\n${h.temper==='気難しい'?'他の子にちょっかい出して、母馬に怒られてました（笑）':'人が来ると、真っ先に寄ってくるんですよ。'}`:`写真を送る。${h.name}だ。\n\n${h.temper==='気難しい'?'気が強くて、わしの帽子をまた取られた。':'人懐っこい。誰に似たんだか。'}\n\n${h.eye?`見立ては変わらず「${h.eye.g}」だ。`:''}`,
     r:[['「かわいいですね」',()=>{trust(this_from(),3);h.bond=Math.min(100,h.bond+4);return '「だろう」と短い返信が来た。';}],['「元気そうで安心しました」',()=>{trust(this_from(),2);return '「おう」とだけ返ってきた。';}]]};}},
  hinataLine:{w:()=>0,mk:d=>{const h=HZ(d.hid);const pos=d.pos;return{from:'hinata',subj:pos===1?'勝ちました！！':'今日はすみません',
     body:pos===1?`${h?h.name:'あの馬'}、最後までよく伸びてくれました！\n\nゴールした瞬間、オーナーの顔が浮かびました。ありがとうございました！！`:`${h?h.name:'あの馬'}、${pos}着でした。\n\n直線、もっと早く追い出せばよかった。全部僕の判断ミスです。次は絶対に勝たせます。`,
     r:pos===1?[['「最高の騎乗だった」',()=>{trust('hinata',5);return '「うれしすぎて眠れません！」スタンプが3つ連続で届いた。';}],['「次も頼む」',()=>{trust('hinata',3);return '「はい！！」';}]]:[['「気にするな。次がある」',()=>{trust('hinata',5);return '「…ありがとうございます。明日も朝いちで乗りに行きます」';}],['「確かに、仕掛けが遅かった」',()=>{trust('hinata',-2);JK('hinata').sk=Math.min(94,JK('hinata').sk+.6);return '「…はい。ビデオ、見直します」少し間があってから返信が来た。';}]]};}},
  invite:{w:()=>S.part===1&&P('kujo').met&&!S.month.invited?1.2:0,dl:1,mk:()=>({from:'kujo',subj:'【ご招待】九条グループ 秋の懇親会',body:`${ownerName()}様\n\n平素より格別のご高配を賜り…と、形式的な挨拶は省略する。\n\n来月、九条グループの懇親会を開く。馬主、調教師、騎手、多く集まる。顔を出すかどうかは、あなた次第だ。\n\n※今月中にご返信ください。\n\n九条 隆臣　（代筆：秘書室）`,
     r:[['出席と返信する',()=>{trust('kujo',5);['washio','sanada','rossi','oba'].forEach(j=>trust(j,2));S.fame+=1;return '会場では大勢の関係者と名刺を交換した。何人かの騎手の顔と名前が一致した。';}],['欠席と返信する',()=>{trust('kujo',-1);return '「承知いたしました」と秘書室から事務的な返信が来た。';}]],
     ig:()=>{trust('kujo',-4);return '九条からの招待状に、返事をしないままになってしまった。';}})},
  spam:{w:()=>.6,mk:()=>({from:'unknown',fromName:'【重要】競馬当選事務局',subj:'★★おめでとうございます！ 3連単的中情報に当選しました★★',body:'厳正なる抽選の結果、あなた様が「絶対的中！3連単情報」の無料会員に選ばれました！\n\n今すぐ下記URLから登録を完了してください。登録料はたったの9,800円！\n\nhttps://zettai-tekichu.example\n\n※本メールは送信専用です',
     r:[['削除する',()=>'迷惑メールを削除した。'],['三國に転送する',()=>{trust('mikuni',2);return '三國から返信「迷惑メールです。開かないでくださいね」…絵文字が一つだけ付いていた。';}]]})},
  weekly:{w:()=>1,mk:()=>{const b=bestRacer();const up=b?GR.filter(g=>g.m===((M(S.t))%12)+1&&g.surf===b.surf&&ageOk(g.age,ageOf(b))&&Math.abs(g.dist-b.dist)<=500):[];
     return{from:'mikuni',subj:`来月の重賞の予定（${(M(S.t))%12+1}月）`,body:`お疲れさまです。来月の重賞をまとめました。\n\n${GR.filter(g=>g.m===((M(S.t))%12)+1).map(g=>`・${g.gr} ${g.n}（${g.course}${g.surf}${g.dist}m）`).join('\n')}\n\n${b&&up.length?`${b.name}なら、${up.map(g=>g.n).join('、')}が候補になると思います。`:''}\n\n三國`};}},
  fan:{w:()=>anyHorse().some(h=>h.fans>2000)?1:0,mk:d=>{const h=d.hid&&HZ(d.hid)?HZ(d.hid):pick(anyHorse().filter(h=>h.fans>2000));d.hid=h.id;const L=[`はじめてメールします。中学生です。${h.name}が大好きで、部屋にポスターを貼っています。`,`病院のベッドで${h.name}のレースを見ています。次のレースまで、がんばって生きようと思えます。`,`定年退職して、初めて競馬場に行った日に${h.name}を見ました。それから毎週通っています。`];
     return{from:'fan',fromName:'ファンの方',subj:`${h.name}を応援しています`,body:pick(L)+'\n\nこれからも応援しています。',hid:h.id,r:[['お礼の返事を書く',()=>{h.fans+=300;S.fame+=.5;return '後日、「返事が来た！」というSNSの投稿が少し話題になった。';}],['厩舎に転送する',()=>{h.bond=Math.min(100,h.bond+3);trust(h.trainer,1);return '厩舎の壁に、プリントアウトされたメールが貼られたらしい。';}]]};}},
  report:{w:()=>anyHorse().some(h=>h.work.length)?1.2:0,mk:()=>{const h=pick(anyHorse().filter(h=>h.work.length));const w=h.work[0];return{from:h.trainer,subj:`${h.name} 調教報告`,
     body:`${h.name}の今週の追い切りです。\n\n坂路 4F ${w.t4} － 1F ${w.t1}（${w.int}）\n\n${V(TV(h.trainer),'evRoom',{i:2})}。${h.cond>=4?'状態はいいです。':h.cond<=2?'少し疲れが見えます。':''}`.replace('。。','。')};}},
  catalog:{w:()=>M(S.t)===6||M(S.t)===3?3:0,mk:()=>{const sel=M(S.t)===6;return{from:'mikuni',subj:`${sel?'セレクトセール':'2歳トレーニングセール'}のカタログが届きました`,body:`来月の${sel?'セレクトセール':'トレーニングセール'}のカタログが届きました。\n\n今年は${pick(S.stallions).n}産駒の評判がいいようです。${S.restPenalty>0?'\n\n…療養中ですので、今回は見送りになりそうですね。':''}\n\n${sel?'中原さんも「何頭か見ておきたい」とおっしゃっていました。':''}`};}},
  magazine:{w:()=>S.fame>15?.7:0,dl:1,mk:()=>({from:'press',fromName:'月刊ターフ 編集部',subj:'取材のお願い',body:`${ownerName()}様\n\n「月刊ターフ」編集部です。「いま注目の馬主」という特集で、ぜひお話を伺えないでしょうか。\n\n今月中にご返信いただけますと幸いです。`,
     r:[['受ける',()=>{S.fame+=2;anyHorse().forEach(h=>h.fans+=800);return '翌月号に、勝負服の写真付きで4ページの記事が載った。';}],['お断りする',()=>'丁寧な返信が来た。']],ig:()=>'雑誌の取材依頼に返事をしないうちに、締め切りが過ぎていた。'})},
  rei:{w:()=>S.part===2&&P('rei').met?.8:0,mk:()=>({from:'rei',subj:'先日の件',body:pick(['先日のレース、見ていました。あなたの馬、最後まで止まりませんでしたね。\n\n…父が「あの家の馬は、いつも最後に伸びる」と言っていました。','今夜、父が珍しく昔のアルバムを出してきました。${f}さんと並んで写っている写真がありました。\n\nお互い、若いですね。'.replace('${f}',S.parent.name)]),r:[['「ありがとう」',()=>{trust('rei',3);return '「どういたしまして」とだけ返ってきた。';}],['「今度、ゆっくり話そう」',()=>{trust('rei',5);return '「…はい。楽しみにしています」';}]]})},
  lowFunds:{w:()=>S.money<5000?2:0,mk:()=>({from:'bank',fromName:'みなと銀行 法人営業部',subj:'ご融資のご案内',body:`いつもお世話になっております。\n\nご資金のことでお困りでしたら、当行の事業者向け融資をご検討ください。\n\n※ご融資額 5,000万円　年利 4.8%（12か月で毎月約440万円のご返済）`,r:[['融資を受ける',()=>{S.money+=5000;S.loan={left:12,pay:440};return '5000万円が振り込まれた。来月から12か月、毎月440万円を返済する。';}],['断る',()=>'「またのご用命をお待ちしております」']]})},
};
function this_from(){return UI.phone&&UI.phone.mail?UI.phone.mail.from:'mikuni';}
function sendMail(type,d={},quiet){
  const m=MAILS[type].mk(d);if(!m)return;const ph=PH();
  ph.mails.unshift({id:S.nid++,type,t:S.t,read:false,answered:false,from:m.from,fromName:m.fromName||null,subj:m.subj,body:m.body,hid:m.hid||null,dl:MAILS[type].dl?S.t:null,d,rLabels:m.r?m.r.map(x=>x[0]):null});
  if(ph.mails.length>60)ph.mails.length=60;
  if(!quiet){se('mail');toast(`新着メール：${m.fromName||pname(m.from)}「${m.subj}」`);}
  updatePhoneBadge();
}
function mailReplies(mail){const m=MAILS[mail.type].mk(mail.d);return m&&m.r?m.r:null;}
function monthlyMails(){
  const ph=PH();
  ph.mails.filter(m=>m.dl!=null&&!m.answered&&m.dl<S.t).forEach(m=>{m.answered=true;m.missed=true;const ig=MAILS[m.type].mk(m.d).ig;if(ig){const t=ig();ph.out.push(t);}});
  if(S.loan&&S.loan.left>0){S.money-=S.loan.pay;S.loan.left--;}
  const n=R()<.5?1:R()<.7?2:0;
  for(let i=0;i<n;i++){const ws=Object.entries(MAILS).map(([k,v])=>[k,v.w()]).filter(x=>x[1]>0);let tot=ws.reduce((a,x)=>a+x[1],0),r=R()*tot;for(const [k,w] of ws){r-=w;if(r<=0){sendMail(k,{},true);break;}}}
}

/* ---------- 電話 ---------- */
/* each call: who(), cond(), open text, ch: [label, fn()->text, opts{summon}], miss: fn()->text */
const CALLS={
  colic:{w:()=>anyHorse().length?.9:0,setup:()=>{const h=pick(anyHorse());return{who:h.trainer,hid:h.id,night:true};},
    open:d=>{const h=HZ(d.hid);return d.who==='togawa'?`「夜分にすまん。${h.name}が疝痛を起こした。獣医は呼んである。…来られるか」`:d.who==='hayase'?`「夜遅くにごめんなさい！ ${h.name}が疝痛で、ずっと寝転がろうとしてて…獣医さんは呼びました！」`:`「すみません、${h.name}が疝痛です。獣医は呼びました」`;},
    ch:[['「すぐ行く」',d=>{const h=HZ(d.hid);h.bond=Math.min(100,h.bond+15);trust(d.who,6);S.month.met=true;return `深夜の厩舎で、${h.name}の首をずっとなでていた。明け方、獣医が「もう大丈夫」と言った。\n${h.name}は、あなたの肩に鼻先を押しつけて眠った。\n（今月はもう人に会いに行けない）`;},{summon:1}],
        ['「先生に任せます」',d=>{const h=HZ(d.hid);trust(d.who,1);if(R()<.35){h.cond=Math.max(1,h.cond-2);h.fat=Math.min(100,h.fat+20);return `朝になって連絡が来た。${h.name}は持ち直したが、だいぶ体力を消耗したらしい。`;}return '朝になって「落ち着きました」と連絡が来た。';}]],
    miss:d=>{const h=HZ(d.hid);trust(d.who,-3);h.cond=Math.max(1,h.cond-1);return `留守電が入っていた。「${h.name}が疝痛でした。…なんとか持ち直しました」少し疲れた声だった。`;}},
  foaling:{w:()=>[3,4,5].includes(M(S.t))&&mine().some(h=>h.status==='繁殖'&&h.preg&&h.preg.due-S.t<=1)?3:0,setup:()=>({who:S.part===2&&S.br.farm==='support'?'mio':'nakahara',night:true}),
    open:d=>d.who==='mio'?'「もしもし！ 生まれそうです！ 今夜です、たぶん。来られますか？」':'「…わしだ。生まれそうだ。今夜だな。来るか」',
    ch:[['「始発で行きます」',d=>{trust(d.who,8);S.flags.foalWitness=Y(S.t);S.month.met=true;return '夜明け前の厩舎で、母馬が静かに横たわった。\n小さな前脚が見えて、中原と二人で息を止めた。\n生まれた仔馬が、ふらふらと立ち上がる。外が明るくなっていた。\n（生まれた仔馬が、あなたによく懐くだろう。今月はもう人に会えない）';},{summon:1}],['「写真を送ってください」',d=>{trust(d.who,1);return '「…おう」少し寂しそうな声だった。';}]],
    miss:d=>{trust(d.who,-2);return '朝、留守電が入っていた。「…生まれたぞ。元気な子だ」';}},
  dinner:{w:()=>(P('kujo').met&&S.part===1)||(P('rei').met&&S.part===2)?.8:0,setup:()=>({who:S.part===1?'kujo':'rei'}),
    open:d=>d.who==='kujo'?'「九条だ。今夜、空いているか。銀座にいい店がある。一杯付き合え」':'「九条です。突然すみません。今夜、少しだけ時間をもらえませんか」',
    ch:[['「伺います」',d=>{trust(d.who,8);S.month.met=true;const r=S.rivals.filter(x=>x.owner==='九条'&&x.status==='現役').sort((a,b)=>bestAb(b)-bestAb(a))[0];return (d.who==='kujo'?'カウンターだけの小さな店だった。九条は昔の名馬の話ばかりした。':'ホテルのラウンジ。怜は、跡継ぎとしての重圧を少しだけ話した。')+(r?`\n帰り際にぽつりと「${r.name}は${r.dist>=2200?'有馬':'秋の天皇賞'}を狙う。${r.heavy<0?'雨は嫌いだがな':''}」`:'')+'\n（今月はもう人に会えない）';},{summon:1}],['「今夜は先約が」',d=>{trust(d.who,-1);return d.who==='kujo'?'「そうか。また誘う」':'「…そうですか。またの機会に」';}]],
    miss:d=>{trust(d.who,-1);return '九条家から着信があったようだ。';}},
  scam:{w:()=>.7,setup:()=>({who:'unknown',name:'非通知'}),
    open:()=>'「もしもし、馬主さんですよね？ ここだけの話、来週“絶対に来る”馬の情報があるんです。関係者筋の確かな話でして…情報料はたったの30万円！」',
    ch:[['「払う」',()=>{S.money-=30;S.flags.scammed=(S.flags.scammed||0)+1;return '振込先を伝えられた。…翌週、教えられた馬は12着だった。電話は二度とつながらなかった。';}],['「三國に代わります」',()=>{trust('mikuni',2);return '三國が受話器を取ると、相手は無言で切った。「…馬主さんを狙う詐欺です。気をつけてくださいね」';}],['黙って切る',()=>'電話を切った。']],miss:()=>'非通知の着信があった。'},
  reporter:{w:()=>S.fame>8?.8:0,setup:()=>({who:'unknown',name:'スポーツ報知新聞 記者'}),
    open:()=>{const b=bestRacer();return `「スポーツ報知の者です、突然すみません！ ${b?b.name+'の次走について':'今後の目標について'}、ひと言いただけませんか」`;},
    ch:[['「目標は有馬記念です」',()=>{S.fame+=2;anyHorse().forEach(h=>h.fans+=500);trust('kujo',-1);return '翌朝の紙面に「新興馬主、有馬宣言」の見出しが躍った。';}],['「馬の状態次第です」',()=>{const b=bestRacer();if(b)trust(b.trainer,2);return '翌朝、小さな記事が載った。調教師から「ありがとうございます」とメールが来た。';}],['「ノーコメントで」',()=>'「…わかりました」記者は残念そうに電話を切った。']],miss:()=>'見知らぬ番号から着信があった。'},
  bargain:{w:()=>anyHorse().some(h=>h.mainJ&&h.mainJ!=='hinata')?.8:0,setup:()=>{const h=pick(anyHorse().filter(h=>h.mainJ&&h.mainJ!=='hinata'));return{who:h.mainJ,hid:h.id};},
    open:d=>{const h=HZ(d.hid);return `${V(d.who,'greet',{i:1})} …実は、来月の騎乗のことで。別の陣営からも${h.name}と同じレースで依頼されていて、正直迷っています。`;},
    ch:[['「うちを優先してほしい」',d=>{if(P(d.who).trust>=50){trust(d.who,3);return V(d.who,'acceptMain',{h:HZ(d.hid).name});}const h=HZ(d.hid);h.mainJ=null;trust(d.who,-3);return `「…すみません。今回は向こうに乗ります」\n${h.name}の主戦がいなくなった。`;}],
        ['「騎乗ボーナスを出す（200万円）」',d=>{S.money-=200;trust(d.who,8);return V(d.who,'acceptMain',{h:HZ(d.hid).name});}],
        ['「向こうに乗っていい」',d=>{const h=HZ(d.hid);h.mainJ=null;trust(d.who,4);return `「…ありがとうございます。この恩は忘れません」\n${h.name}の主戦は空いた。`;}]],
    miss:d=>{const h=HZ(d.hid);if(R()<.5){h.mainJ=null;return `留守電が入っていた。「すみません、今回は別の馬に乗ることにしました」\n${h.name}の主戦がいなくなった。`;}return '騎手から着信があったようだ。';}},
  tv:{w:()=>S.rivals.some(r=>r.status==='現役'&&r.g1>0)?.6:0,setup:()=>({who:'mikuni'}),
    open:()=>'「すみません、今すぐテレビをつけてください！」',
    ch:[['テレビをつける',()=>{const r=pick(S.rivals.filter(r=>r.status==='現役'&&r.g1>0));if(R()<.5){r.status='休養';r.rest=4;return `ニュースが流れていた。「${r.name}、右前脚の骨折が判明。復帰には4か月以上かかる見込み」\n三國「…ライバルが一頭、減りました。でも、喜べませんね」`;}r.fans+=5000;return `「${r.name}、${OWN[r.owner].n}が海外遠征を発表」とテロップが流れていた。\n三國「すごい話題ですね。…うちも負けていられません」`;}]],miss:()=>'三國から着信があった。'},
  workout:{w:()=>anyHorse().some(h=>h.cond>=4)?.9:0,setup:()=>{const h=pick(anyHorse().filter(h=>h.cond>=4));return{who:h.trainer,hid:h.id};},
    open:d=>{const h=HZ(d.hid);return d.who==='hayase'?`「おはようございます！ 聞いてください、${h.name}の今朝の追い切り、すごかったんです！」`:d.who==='togawa'?`「わしだ。${h.name}、今朝はいい動きだった。…それだけだ」`:`「朝早くすみません。${h.name}、今朝すごくいい動きでした」`;},
    ch:[['「詳しく聞かせて」',d=>{const h=HZ(d.hid);h.known.style=true;trust(d.who,3);const top=STATS.slice().sort((a,b)=>h.st[b]-h.st[a])[0];return `${SL[top]}が光っていたらしい。脚質は${h.style}が合いそうだ、とも。\n（${h.name}の脚質がわかった）`;}],['「ありがとう、楽しみだ」',d=>{trust(d.who,2);return '弾んだ声で電話が切れた。';}]],miss:d=>'調教師から着信があったようだ。'},
  wrong:{w:()=>.35,setup:()=>({who:'unknown',name:'見知らぬ番号'}),
    open:()=>'「あ、もしもし！ 特上寿司を三人前、いつもの時間にお願いしたいんですけど」',
    ch:[['「間違い電話ですよ」',()=>'「えっ、すみません！」慌てて切れた。'],['「…ご注文ありがとうございます」',()=>{S.flags.sushi=1;return '「え？」と相手が固まったところで笑って訂正した。三國に話したら、珍しく声を出して笑っていた。';}]],miss:()=>'見知らぬ番号から着信があった。'},
  invest:{w:()=>anyHorse().some(h=>h.g1===0&&h.cls>=4&&!h.share)?.4:0,setup:()=>{const h=pick(anyHorse().filter(h=>h.g1===0&&h.cls>=4&&!h.share));return{who:'unknown',name:'投資会社 担当者',hid:h.id,price:roundInc(value(h)*.4)};},
    open:d=>{const h=HZ(d.hid);return `「突然失礼します。${h.name}の権利を3割、共同馬主として持たせていただけませんか。${yen(d.price)}ご用意しています」`;},
    ch:[['「お受けします」',d=>{const h=HZ(d.hid);S.money+=d.price;h.share=.3;return `${yen(d.price)}が振り込まれた。これから${h.name}の賞金の3割は、共同馬主に渡る。`;}],['「お断りします」',()=>'「残念です。気が変わりましたら」']],miss:()=>'投資会社から着信があった。'},
  school:{w:()=>S.fame>20?.5:0,setup:()=>({who:'unknown',name:'市立あおば小学校'}),
    open:()=>'「突然のお電話失礼します、あおば小学校の教頭です。子どもたちに“夢を追う大人”のお話をしていただけないかと…」',
    ch:[['「喜んで」',()=>{S.fame+=3;S.month.met=true;const b=bestRacer();if(b)b.fans+=2000;return `体育館で、勝負服を見せながら話をした。最前列の女の子が「馬の名前、なんていうの」と聞いた。\n${b?`「${b.name}だよ」と答えると、子どもたちが一斉に名前を叫んだ。`:''}\n（今月はもう人に会えない）`;},{summon:1}],['「今は忙しくて」',()=>'「そうですよね…またぜひ」']],miss:()=>'小学校から着信があった。'},
  hinataNight:{w:()=>!S.br.hinataLeft&&P('hinata').met&&mine().some(h=>h.rec[0]&&h.rec[0].t===S.t-1&&h.rec[0].j===P('hinata').n&&h.rec[0].pos>3)?3:0,setup:()=>({who:'hinata',night:true}),
    open:()=>'「…あ、すみません、こんな時間に。日向です。今日の負けが悔しくて、眠れなくて…誰かと話したくて」',
    ch:[['「気が済むまで聞くよ」',()=>{trust('hinata',P('hinata').trust>=40?9:5);return '一時間、日向は直線の話をした。最後に「…すっきりしました。明日も乗ります」と笑った。';}],['「次は勝て。それだけだ」',()=>{trust('hinata',2);JK('hinata').sk=Math.min(94,JK('hinata').sk+.5);return '「…はい！」声に少し力が戻った。';}],['「次は乗り替わりも考える」',()=>{trust('hinata',-8);JK('hinata').sk=Math.min(94,JK('hinata').sk+1);return '長い沈黙のあと、「…わかりました」とだけ言って電話は切れた。';}]],
    miss:()=>{trust('hinata',-2);return '夜中に日向から着信があった。留守電は入っていなかった。';}},
};
let CALL=null;
function maybeCall(){
  if(!S||S.over||CALL||!$('#modal').hidden||S.inbox.length||S.month.called)return;
  if(S.t-S.startT<2)return;
  if(R()>.18)return;
  const ws=Object.entries(CALLS).map(([k,v])=>[k,v.w()]).filter(x=>x[1]>0);if(!ws.length)return;
  let r=R()*ws.reduce((a,x)=>a+x[1],0),type=ws[0][0];for(const [k,w] of ws){r-=w;if(r<=0){type=k;break;}}
  const d=CALLS[type].setup();if(!d)return;
  S.month.called=true;CALL={type,d,stage:'ring',log:[]};drawCall();
  ringLoop();
}
function ringLoop(){if(!CALL||CALL.stage!=='ring')return;se('ring');if(navigator.vibrate)try{navigator.vibrate([400,200,400]);}catch(e){}CALL.rt=setTimeout(ringLoop,2200);CALL.n=(CALL.n||0)+1;if(CALL.n>6){callMiss();}}
function callName(d){return d.name||pname(d.who);}
function drawCall(){
  let el=$('#call-ov');if(!el){el=document.createElement('div');el.id='call-ov';el.className='call-ov';document.body.appendChild(el);}
  if(!CALL){el.hidden=true;el.innerHTML='';return;}
  el.hidden=false;const c=CALLS[CALL.type],d=CALL.d;
  const av=d.who&&P(d.who)?avatar(d.who,96):`<span class="av unk" style="width:96px;height:96px;font-size:40px">？</span>`;
  if(CALL.stage==='ring'){el.innerHTML=`<div class="call-card ringing"><div class="call-sub">${d.night?'深夜 2:14　':''}着信</div>${av}<div class="call-name">${esc(callName(d))}</div><div class="call-sub">${d.who&&P(d.who)?esc(P(d.who).role):''}</div>
    <div class="call-btns"><button class="cbtn no" data-act="callNo" aria-label="出ない">出ない</button><button class="cbtn yes" data-act="callYes" aria-label="出る">出る</button></div></div>`;return;}
  const ch=c.ch.map((x,i)=>{const sm=x[2]&&x[2].summon;const dis=sm&&(S.month.met||S.restPenalty>0);return `<button class="btn ${i===0?'pri':''}" data-act="callCh" data-i="${i}" ${dis?'disabled':''}>${esc(x[0])}${sm?'（今月の「人に会う」を使う）':''}</button>`;}).join('');
  el.innerHTML=`<div class="call-card"><div class="row" style="gap:12px">${d.who&&P(d.who)?avatar(d.who,52):'<span class="av unk" style="width:52px;height:52px;font-size:22px">？</span>'}<div><div class="call-name" style="font-size:20px">${esc(callName(d))}</div><div class="call-sub">通話中 <span id="calltm">0:00</span></div></div></div>
    <div class="call-log">${CALL.log.join('')}</div>
    ${CALL.stage==='talk'?`<div class="choices">${ch}</div>`:`<div class="row"><span class="sp"></span><button class="cbtn no sm" data-act="callEnd">切る</button></div>`}</div>`;
  const lg=el.querySelector('.call-log');if(lg)lg.scrollTop=lg.scrollHeight;
}
function callMiss(){clearTimeout(CALL.rt);const c=CALLS[CALL.type];const t=c.miss(CALL.d);PH().hist.unshift({t:S.t,name:callName(CALL.d),missed:true});CALL=null;drawCall();if(t){PH().out.push(t);deliverOut();}save();render();}
function deliverOut(){const ph=PH();while(ph.out.length){const t=ph.out.shift();ph.mails.unshift({id:S.nid++,type:'_note',t:S.t,read:false,answered:true,from:'mikuni',fromName:'留守番電話・お知らせ',subj:t.split('\n')[0].slice(0,30),body:t,d:{}});se('mail');}updatePhoneBadge();}
ACT.callYes=()=>{clearTimeout(CALL.rt);se('pickup');CALL.stage='talk';CALL.start=Date.now();CALL.log.push(`<p class="line them">${esc(CALLS[CALL.type].open(CALL.d))}</p>`);drawCall();callTimer();};
ACT.callNo=()=>{se('hangup');callMiss();};
ACT.callCh=d=>{const c=CALLS[CALL.type];const x=c.ch[+d.i];CALL.log.push(`<p class="line me">${esc(x[0])}</p><p class="line them">${esc(x[1](CALL.d))}</p>`);CALL.stage='done';PH().hist.unshift({t:S.t,name:callName(CALL.d),missed:false});save();drawCall();};
ACT.callEnd=()=>{se('hangup');CALL=null;drawCall();render();};
function callTimer(){if(!CALL||CALL.stage==='ring')return;const el=$('#calltm');if(el){const s=Math.floor((Date.now()-CALL.start)/1000);el.textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}setTimeout(callTimer,1000);}

/* ---------- スマホ画面 ---------- */
function updatePhoneBadge(){const b=$('#phbadge');if(!b||!S)return;const n=PH().mails.filter(m=>!m.read).length;b.textContent=n;b.hidden=!n;}
function phoneBtn(){const top=$('#hdslot');if(!top||$('#phbtn'))return;const b=document.createElement('button');b.id='phbtn';b.className='phbtn';b.dataset.act='phone';b.setAttribute('aria-label','スマホ');
  b.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="18" r="1.2" fill="currentColor"/></svg><span>スマホ</span><span class="badge" id="phbadge" hidden>0</span>';top.appendChild(b);updatePhoneBadge();}
function drawPhone(){
  const ph=PH(),u=UI.phone;
  const fromAv=m=>m.from&&P(m.from)?avatar(m.from,34):`<span class="av unk" style="width:34px;height:34px;font-size:14px">${m.from==='bank'?'銀':m.from==='press'?'誌':m.from==='fan'?'♥':'？'}</span>`;
  let body;
  if(u.mail){const m=u.mail;m.read=true;const reps=!m.answered&&m.rLabels?mailReplies(m):null;
    body=`<button class="btn sm" data-act="phBack">← 受信箱</button>
     <div class="row" style="gap:10px">${fromAv(m)}<div><b>${esc(m.fromName||pname(m.from))}</b><div class="muted" style="font-size:12px">${dstr(m.t)}</div></div></div>
     <h3 style="font-family:var(--f-body);font-size:16px">${esc(m.subj)}</h3>
     ${m.hid&&HZ(m.hid)&&m.type==='photo'?`<div class="mailphoto">${horseSVG(HZ(m.hid),130)}</div>`:''}
     <div class="letter" style="font-size:14px">${esc(m.body)}</div>
     ${m.reply?`<div class="sent"><span class="muted">あなたの返信：</span>${esc(m.reply)}</div><div class="letter" style="font-size:14px">${esc(m.react||'')}</div>`:''}
     ${m.missed?'<div class="muted">返信期限を過ぎた</div>':''}
     ${reps?`<div class="choices">${reps.map((r,i)=>`<button class="btn ${i===0?'pri':''}" data-act="phReply" data-i="${i}">${esc(r[0])}</button>`).join('')}</div>`:''}`;}
  else body=`<div class="phtabs"><b>メール</b><span class="muted" style="font-size:12px">着信履歴：${ph.hist.slice(0,5).map(h=>`${esc(h.name)}${h.missed?'（不在）':''}`).join('、')||'なし'}</span></div>
     <div class="maillist">${ph.mails.map(m=>`<button class="mrow ${m.read?'':'unread'}" data-act="phOpen" data-id="${m.id}">${fromAv(m)}<span style="min-width:0;flex:1"><span class="row" style="gap:6px"><b>${esc(m.fromName||pname(m.from))}</b><span class="muted" style="font-size:11px">${dstr(m.t)}</span>${m.rLabels&&!m.answered?`<span class="chip warn">${m.dl!=null?'今月中に返信':'返信できる'}</span>`:''}</span><span class="msubj">${esc(m.subj)}</span></span></button>`).join('')||'<div class="muted">メールはありません</div>'}</div>`;
  openModal(`<div class="phone"><div class="phbar"><span>${dstr(S.t)}</span><span>${esc(ownerName())}</span></div>${body}<div class="row"><span class="sp"></span><button class="btn" data-act="phClose">閉じる</button></div></div>`);
  updatePhoneBadge();save();
}
ACT.phone=()=>{UI.phone={mail:null};drawPhone();};
ACT.phOpen=d=>{UI.phone.mail=PH().mails.find(m=>m.id===+d.id);drawPhone();};
ACT.phBack=()=>{UI.phone.mail=null;drawPhone();};
ACT.phClose=()=>{UI.phone=null;closeModal();render();};
ACT.phReply=d=>{const m=UI.phone.mail;const r=mailReplies(m)[+d.i];const before=m.from&&P(m.from)?P(m.from).trust:null;m.react=r[1]();m.reply=r[0].replace(/[「」]/g,'');m.answered=true;if(before!=null)se(P(m.from).trust>before?'up':P(m.from).trust<before?'down':'select');else se('select');save();drawPhone();};

/* ---------- hooks ---------- */
beginMonth=(o=>function(){const r=o.apply(this,arguments);if(S&&S.month){monthlyMails();}return r;})(beginMonth);
closeModal=(o=>function(){const r=o.apply(this,arguments);if(S&&!UI.phone){setTimeout(()=>{deliverOut();maybeCall();},1800+R()*2500);}return r;})(closeModal);
render=(o=>function(){const r=o.apply(this,arguments);if(S){phoneBtn();updatePhoneBadge();}return r;})(render);
showResult=(o=>function(){const RC=UI.race;const r=o.apply(this,arguments);try{const f=RC.order.find(x=>x.mine&&x.jid==='hinata');if(f&&R()<.6)PH().pend=[{type:'hinataLine',d:{hid:f.h.id,pos:f.pos}}];}catch(e){}return r;})(showResult);
deliverOut=(o=>function(){const ph=PH();if(ph.pend&&ph.pend.length){ph.pend.forEach(x=>sendMail(x.type,x.d));ph.pend=[];}return o.apply(this,arguments);})(deliverOut);
/* prize share for co-owned horses */
applyRace=(o=>function(RC){const sh=RC.order.filter(f=>f.mine&&f.h.share).map(f=>[f.h,f.h.earn]);const m0=S.money;const r=o.apply(this,arguments);sh.forEach(([h,e0])=>{const got=(h.earn-e0)*.8*h.share;S.money-=got;S.rep.prize-=got;});return r;})(applyRace);
if(S)phoneBtn();
