/* =========================================================
   surprises: more calls & mails, irregular monthly happenings, cooldowns
   ========================================================= */
const best=()=>bestRacer();
const someTrainer=()=>{const h=anyHorse()[0];return h?h.trainer:(S.part===1?'togawa':'koyanagi');};
/* ---------- more calls ---------- */
Object.assign(CALLS,{
  loose:{w:()=>anyHorse().length?.6:0,setup:()=>{const h=pick(anyHorse());return{who:h.trainer,hid:h.id};},
    open:d=>{const h=HZ(d.hid);return d.who==='hayase'?`「たいへんです！ ${h.name}が朝の調教で騎手を落として、放馬しちゃって…！ 今、コースを一頭で走り回ってます！」`:`「${h.name}が放馬した。今、厩務員総出で追いかけとる」`;},
    ch:[['「ケガだけはさせないで」',d=>{const h=HZ(d.hid);trust(d.who,3);if(R()<.75)return `二十分後に連絡が来た。「捕まえました！ 本人はけろっとしてます」\n（${h.name}は、どうやら体力が有り余っているらしい）`;h.cond=Math.max(1,h.cond-1);h.fat=Math.min(100,h.fat+15);return `捕まったときには、だいぶ汗をかいていたらしい。今月は少し疲れが残りそうだ。`;}],
        ['「今から行く」',d=>{const h=HZ(d.hid);h.bond=Math.min(100,h.bond+12);S.month.met=true;return `トレセンに着くと、${h.name}はあなたを見つけて、自分から歩いて寄ってきた。\n厩務員たちが「オーナーにだけは素直なんだから」と笑った。\n（今月はもう人に会えない）`;},{summon:1}]],
    miss:d=>`留守電「${HZ(d.hid).name}が放馬しましたが、無事捕まえました」`},
  celeb:{w:()=>mine().some(h=>h.unnamed||(h.status==='1歳'&&h.starts===0))?.5:0,setup:()=>{const h=mine().find(h=>h.unnamed||(h.status==='1歳'&&h.starts===0));return{who:'unknown',name:'芸能事務所 マネージャー',hid:h.id,price:1000};},
    open:d=>`「お世話になります！ うちのタレントが競馬にハマっておりまして。${HZ(d.hid).name}の命名権を、1000万円で譲っていただけないかと…！ 名前はもう決めてあるそうです」`,
    ch:[['「お譲りします」',d=>{const h=HZ(d.hid);const nn=pick(['キラキラダイナマイト','ミラクルオムライス','ハッピーパンケーキ','スーパーノヴァちゃん','ゴールデンタピオカ']);const n2=usedName(nn)?nn.slice(0,7)+'II':nn;h.name=n2.slice(0,9);h.unnamed=false;S.money+=1000;h.fans+=8000;return `1000万円が振り込まれた。馬の名前は「${h.name}」になった。\n…三國が、なんとも言えない顔をしていた。ただ、ファンは一気に増えた。`;}],['「名前は自分で付けます」',()=>'「ですよね！ 失礼しました！」']],miss:()=>'芸能事務所から着信があった。'},
  overseas:{w:()=>anyHorse().some(h=>h.g1>0||h.gw.length>=2)?.4:0,setup:()=>{const h=anyHorse().filter(h=>h.g1>0||h.gw.length>=2).sort((a,b)=>value(b)-value(a))[0];return{who:'unknown',name:'国際電話（香港）',hid:h.id,price:roundInc(value(h)*2.4)};},
    open:d=>`「Hello… こちら、香港の馬主の代理人です。${HZ(d.hid).name}を、${yen(d.price)}で購入したい。香港のビッグレースで走らせたいのです」`,
    ch:[['「売ります」',d=>{const h=HZ(d.hid);S.money+=d.price;h.status='移籍';delete S.month.orders[h.id];log(`${h.name}を香港の馬主へ${yen(d.price)}で売却`);return `${yen(d.price)}が振り込まれた。${h.name}は、海を渡ることになった。\n空港で、${h.name}は一度だけ振り返った…ように見えた。`;}],['「この馬は売りません」',d=>{S.fame+=2;trust(HZ(d.hid).trainer,4);return '「残念です。…いい馬主だ」と電話は切れた。調教師がその話を聞いて、少しうれしそうだった。';}]],miss:()=>'海外からの着信があった。'},
  bargainHorse:{w:()=>S.rivals.some(r=>r.owner!=='九条'&&r.status==='現役'&&ageOf(r)>=3&&ageOf(r)<=5&&r.g1===0)&&S.money>3000?.4:0,
    setup:()=>{const r=pick(S.rivals.filter(r=>r.owner!=='九条'&&r.status==='現役'&&ageOf(r)>=3&&ageOf(r)<=5&&r.g1===0));return{who:'unknown',name:`${OWN[r.owner].n} 担当者`,rid:r.id,price:roundInc(value(r)*.75)};},
    open:d=>{const r=S.rivals.find(x=>x.id===d.rid);return `「突然すみません。うちで持っている${r.name}を、手放すことになりまして。オーナーの事業の都合で…。${yen(d.price)}でいかがでしょう。今日中にお返事を」`;},
    ch:[['「買います」',d=>{const r=S.rivals.find(x=>x.id===d.rid);if(!r||S.money<d.price)return '資金が足りなかった。';S.money-=d.price;S.rivals=S.rivals.filter(x=>x!==r);r.owner='me';r.silks=S.silks;r.trainer=trainersAvail()[0];r.mainJ=null;r.known={dist:true,style:true,temper:false,growth:false,going:false};r.knownLikes=[];r.bond=0;r.work=[];r.mode='self';r.pri={};r.target=null;r.rec=r.rec||[];r.cls=5;S.horses.push(r);log(`${r.name}をライバル陣営から${yen(d.price)}で購入`);return `${r.name}が、あなたの勝負服を着ることになった。${P(r.trainer).n}厩舎に入る。\n昨日までの敵が、今日から仲間だ。`;}],['「見送ります」',()=>'「わかりました。他を当たります」']],miss:()=>'見知らぬ番号から着信があった。'},
  jockeyHurt:{w:()=>anyHorse().some(h=>h.mainJ&&!(JK(h.mainJ).ban>S.t))?.45:0,setup:()=>{const h=pick(anyHorse().filter(h=>h.mainJ));return{who:'mikuni',hid:h.id,jid:h.mainJ};},
    open:d=>`「…落ち着いて聞いてください。${P(d.jid).n}騎手が、今日のレースで落馬しました。鎖骨の骨折で、2か月は乗れないそうです」`,
    ch:[['「お見舞いに行く」',d=>{JK(d.jid).ban=S.t+2;trust(d.jid,12);S.month.met=true;return `病室の${P(d.jid).n}は、包帯だらけで笑っていた。「${HZ(d.hid)?.name||'あの馬'}、他の人に取られないでくださいよ」\n（${P(d.jid).n}は2か月騎乗できない。今月はもう人に会えない）`;},{summon:1}],['「花を贈っておいてくれ」',d=>{JK(d.jid).ban=S.t+2;trust(d.jid,3);return `三國が手配してくれた。（${P(d.jid).n}は2か月騎乗できない）`;}]],
    miss:d=>{JK(d.jid).ban=S.t+2;return `留守電「${P(d.jid).n}騎手が落馬で骨折、2か月休養とのことです」`;}},
  marry:{w:()=>!S.flags.mikuniWed&&yearNo()>=3&&S.part===1?.5:0,setup:()=>({who:'mikuni'}),
    open:()=>'「あの…お仕事の話じゃないんです。実は、その…結婚することになりまして。式に、来ていただけないでしょうか」',
    ch:[['「もちろん行く。おめでとう」',()=>{S.flags.mikuniWed=1;trust('mikuni',15);S.money-=100;return '小さな式だった。スピーチを頼まれて、競馬の話ばかりしてしまった。三國は泣きながら笑っていた。\n（ご祝儀 100万円）';}],['「おめでとう。仕事は続けるのか？」',()=>{S.flags.mikuniWed=1;trust('mikuni',3);return '「…はい、もちろんです」三國は少し寂しそうに笑った。';}]],miss:()=>{S.flags.mikuniWed=1;trust('mikuni',-3);return '三國から着信があった。翌日、照れくさそうに結婚の報告をされた。';}},
  fortune:{w:()=>.3,setup:()=>({who:'unknown',name:'見知らぬ番号'}),
    open:()=>'「突然ごめんなさいね。私、占い師をしている者です。あなたの馬に…白い光が見えたの。気になって、電話しちゃった」',
    ch:[['「…詳しく聞かせてください」',()=>{const h=best();if(h)h.cond=Math.min(5,h.cond+1);return `「${h?h.name.slice(0,2)+'…という名前の子':'あなたの馬'}ね。次は、勝つわよ」\nなぜ名前を知っているのか。三國に話すと「…競馬新聞を見たんでしょう」と言われた。`;}],['「切りますね」',()=>'電話を切った。なんだか少し、気になった。']],miss:()=>'見知らぬ番号から着信があった。'},
  dog:{w:()=>!S.flags.dog&&anyHorse().length?.4:0,setup:()=>({who:someTrainer()}),
    open:d=>d.who==='hayase'?'「あの、厩舎に迷い犬が来ちゃって…。馬たちがすごく懐いてるんです。飼ってもいいですか？」':'「厩舎に野良犬が居ついた。馬が落ち着く。…置いといていいか」',
    ch:[['「飼おう。名前は“アリマ”で」',d=>{S.flags.dog='アリマ';trust(d.who,5);return '厩舎に新しい仲間が増えた。“アリマ”は毎朝、馬房を一つずつ回って挨拶するらしい。\n（厩舎の馬たちが、少しずつ落ち着きやすくなる）';}],['「飼おう。名前は任せる」',d=>{S.flags.dog=d.who==='hayase'?'さくらもち':'クロ';trust(d.who,4);return `犬は「${S.flags.dog}」と名付けられた。（厩舎の馬たちが落ち着きやすくなる）`;}],['「保健所に…」',d=>{trust(d.who,-5);return '「…わかりました」電話の向こうの声が冷たかった。';}]],miss:()=>'調教師から着信があった。'},
  typhoon:{w:()=>[8,9].includes(M(S.t))&&atFarm().length?1.2:0,setup:()=>({who:S.part===2&&S.br.farm==='support'?'mio':S.br.farm==='abandon'?'unknown':'nakahara',name:S.br.farm==='abandon'?'大手牧場 事務所':null}),
    open:d=>d.who==='unknown'?'「台風で放牧地の柵が倒れまして、修繕費のご負担をお願いしたく…」':'「台風で、厩舎の屋根が飛ばされた。馬は無事だ。…だが、修理する金がない」',
    ch:[['「修理費を出す（1500万円）」',d=>{S.money-=1500;if(d.who!=='unknown')trust(d.who,10);atFarm().forEach(h=>h.bond=Math.min(100,h.bond+3));return '修理はすぐに終わった。仔馬たちは何事もなかったように走り回っている。';}],['「半分出す（750万円）」',d=>{S.money-=750;if(d.who!=='unknown')trust(d.who,4);return '修理は少し時間がかかりそうだ。';}],['「自分たちで何とかしてほしい」',d=>{if(d.who!=='unknown')trust(d.who,-8);atFarm().forEach(h=>h.bond=Math.max(0,h.bond-5));return '電話の向こうで、長い沈黙があった。';}]],miss:d=>{if(d.who!=='unknown')trust(d.who,-3);return '牧場から何度も着信があった。台風の被害の連絡だったらしい。';}},
});
/* ---------- more mails ---------- */
Object.assign(MAILS,{
  taunt:{w:()=>S.part===1&&P('kujo').met&&mine().some(h=>h.rec[0]&&h.rec[0].t===S.t-1&&h.rec[0].gr&&/^G/.test(h.rec[0].gr)&&h.rec[0].pos>1)?2:0,mk:()=>({from:'kujo',subj:'先日のレース',body:pick(['見せてもらった。悪くない。だが、まだ足りない。\n\n直線であと半歩。その半歩が、私とあなたの差だ。','あの騎乗で勝てると思っているなら、考えを改めたほうがいい。\n\n…いや、余計な世話だったな。']),r:[['「次は勝ちます」',()=>{trust('kujo',4);return '「楽しみにしている」とだけ返ってきた。';}],['返信しない',()=>{trust('kujo',-1);return '返信はしなかった。';}]]})},
  oldLetter:{w:()=>S.part===1&&!S.flags.oldLetter&&yearNo()>=2?.6:0,mk:()=>({from:'unknown',fromName:'差出人：大垣 正三',subj:'突然のお便りをお許しください',body:`${S.parent.name}様\n\n私は、五十年前に騎手をしておりました大垣と申します。\n\nあなたのお父上、つまり先代の${S.parent.name}さんに、一度だけ中山で馬を見せていただいたことがあります。暮れの中山でした。\n\n新聞であなたの勝負服を見て、筆を取りました。もしよろしければ、古い写真をお送りしたいのですが。`,r:[['「ぜひ送ってください」',()=>{S.flags.oldLetter=1;S.flags.oldLetterT=S.t;return '「ありがとうございます。近いうちにお送りします」と丁寧な返信が来た。';}],['「お気持ちだけで」',()=>{S.flags.oldLetter=2;return '「承知いたしました。ご健勝をお祈りします」';}]]})},
  oldPhoto:{w:()=>S.flags.oldLetter===1&&S.t-S.flags.oldLetterT>=1?5:0,mk:()=>({from:'unknown',fromName:'大垣 正三',subj:'写真をお送りします',body:`古い写真です。\n\n中山のパドックで、子どものあなたが、お父上に肩車されています。あなたは馬を指さして、何か叫んでいる。\n\n裏に、お父上の字でこう書いてありました。\n「いつか、この子の勝負服で」\n\nお父上の夢は、ずっと続いていたのですね。`,r:[['「…ありがとうございます」',()=>{S.flags.oldLetter=3;S.fame+=3;trust('mikuni',5);return '写真は、事務所のいちばん目立つところに飾った。三國が黙って額を磨いていた。';}]]})},
  vet:{w:()=>anyHorse().length?.5:0,mk:()=>{const h=pick(anyHorse());const c=pick([80,120,150]);S.money-=c;return{from:'unknown',fromName:'美浦・栗東 診療所',subj:`【ご請求】${h.name} 診療費`,body:`${h.name}の診療費をご請求申し上げます。\n\n・歯の治療（歯石除去）\n・蹄の手入れ\n\n合計 ${c}万円（ご指定の口座より引き落としました）`};}},
  lottery:{w:()=>M(S.t)===1&&!S.flags.lotteryY?1:0,mk:()=>{S.flags.lotteryY=Y(S.t);const win=R()<.15;if(win)S.money+=1000;return{from:'mikuni',subj:win?'あの、年末ジャンボが…':'年末ジャンボの結果',body:win?'お正月に事務所のみんなで買った年末ジャンボ、なんと当たってしまいました！ 1000万円です。\n\n…みんなで話し合って、馬たちのために使ってほしい、と。':'事務所のみんなで買った年末ジャンボ、全部外れでした。\n\n来年こそ、ですね。…あ、有馬記念のほうも。'};}},
  groupChat:{w:()=>yearNo()>=2&&!S.flags.gchat?.35:0,mk:()=>{S.flags.gchat=1;const a=pick(['oba','kido','arai','kuroiwa']),b=pick(['kiryu','hinata','komori','sanada'].filter(x=>x!==a));return{from:a,subj:'（騎手会 グループトーク）',body:`※間違えてグループに招待されたようだ\n\n${P(a).n}：今度の飲み会、どこにする？\n${P(b).n}：焼肉がいいです\n${P(a).n}：そういえば、あのオーナーの馬どう思う？\n${P(b).n}：${best()?best().name+'、背中いいですよね':'いい馬持ってますよね'}\n${P(a).n}：あ、オーナー入ってるやん\n${P(a).n}：失礼しました！！！\n\n（${P(a).n}がグループを退出しました）`,r:[['「焼肉、僕も行っていい？」',()=>{trust(a,6);trust(b,4);return `「ぜひ！！」と即レスが来た。後日の焼肉会は、なぜかあなたのおごりになった。（${P(a).n}と${P(b).n}との距離が縮まった）`;}],['そっとしておく',()=>'何も見なかったことにした。']]};}},
  horseName:{w:()=>mine().some(h=>h.unnamed)?1:0,mk:()=>{const h=mine().find(h=>h.unnamed);const n=S.kanmei+pick(FR);return{from:'fan',fromName:'ファンの小学生',subj:'うまのなまえ',body:`こんにちは。ぼくは小学3年生です。\n${h.name}のなまえを かんがえました。\n「${n}」がいいとおもいます。\nかっこいいとおもいます。`,hid:h.id,r:[['この名前にする',()=>{if(!usedName(n)&&n.length<=9){h.name=n;h.unnamed=false;h.fans+=1500;return `${h.name}と名付けた。お礼の手紙を送ったら、後日「ともだちにじまんした」と返事が来た。`;}return '残念ながら、その名前はもう使われていた。';}],['お礼だけ返す',()=>'丁寧にお礼の返事を書いた。']]};}},
});
/* ---------- irregular monthly happenings (月初) ---------- */
Object.assign(EV,{
  snow:{r:()=>({p:'mikuni',from:'三國 透',title:'大雪で開催中止',body:'記録的な大雪で、今月の中央競馬は開催中止が決まりました。\n\n出走予定だった馬は、調教だけになります。…こればかりは、どうしようもありませんね。',ch:['しかたない']}),f:()=>{S.month.snow=1;return '今月はレースに出られない。';}},
  flu:{r:d=>({p:d.tr,from:who(d.tr),title:'厩舎で馬インフルエンザ',body:V(TV(d.tr),'leg',{h:'厩舎の馬'}).replace(/右前に.*?熱/,'何頭かに熱')+'\n\n（三國「検疫のため、今月は'+who(d.tr)+'厩舎の馬は出走できません」）',ch:['わかった']}),f:d=>{S.month.flu=d.tr;return '';}},
  awaken:{r:d=>{const h=HZ(d.hid);if(!h)return null;return{p:h.trainer,from:who(h.trainer),title:`${h.name}、何かが変わった`,body:V(TV(h.trainer),'news',{i:2,h:h.name,like:h.likes,w:'坂路で自己ベストを2秒更新'})+`\n\n（三國「先生が興奮して電話してくるなんて、初めてです」）`,ch:['見に行く']};},f:d=>{const h=HZ(d.hid);for(const k of STATS)h.cap[k]=Math.min(108,h.cap[k]+4);h.bond=Math.min(100,h.bond+5);log(`${h.name}が覚醒の気配を見せる`);return `坂路を駆け上がる${h.name}は、まるで別の馬だった。\n（${h.name}の素質が大きく伸びた）`;}},
  ban:{r:d=>({p:d.jid,from:'三國 透',title:`${P(d.jid).n}騎手、騎乗停止`,body:`${P(d.jid).n}騎手が、先週のレースで斜行して、2か月の騎乗停止処分を受けました。\n\n${d.hid?`${HZ(d.hid)?.name}の騎手を、探し直す必要があります。`:''}`,ch:['しかたない','励ましの連絡を入れる']}),f:(d,i)=>{JK(d.jid).ban=S.t+2;if(i===1){trust(d.jid,6);return `${P(d.jid).n}から返事が来た。${V(d.jid,'acceptMain',{h:'あの馬'})}`;}return '';}},
  stallionDeath:{r:d=>({p:'mikuni',from:'ニュース',title:`種牡馬 ${d.n} 急死`,body:`種牡馬の${d.n}が、放牧中の事故で急死しました。\n\n今年生まれた産駒が、最後の世代になります。${mine().some(h=>h.sire===d.id&&['当歳','1歳'].includes(h.status))?'\n\n（三國「うちの牧場にも、${d.n}の子がいますね…大事に育てましょう」）'.replace('${d.n}',d.n):''}`,ch:['…']}),f:d=>{const s=ST(d.id);if(s)s.dead=true;mine().filter(h=>h.sire===d.id).forEach(h=>h.bond=Math.min(100,h.bond+5));return '';}},
  horseshoe:{r:d=>({p:'mikuni',from:'三國 透',title:'蹄鉄',body:`厩舎の掃除をしていたら、古い蹄鉄が出てきたそうです。\n\n調べてみたら、${S.part===1?'先代':'お父様'}が昔持っていた馬のものでした。厩舎の入り口に、U字を上にして飾っておきますね。幸運が溜まるように。`,ch:['いい話だ']}),f:()=>{anyHorse().forEach(h=>h.cond=Math.min(5,h.cond+1));return '（厩舎の馬たちの調子が、少し上向いた）';}},
  rumor:{r:d=>({p:'mikuni',from:'三國 透',title:'妙な噂',body:`競馬記者のあいだで、「${d.name}の陣営が、有馬記念を回避するらしい」という噂が流れています。\n\n本当なら、ライバルが一頭減ることになりますが…。`,ch:['噂は噂だ','確かめてもらう']}),f:(d,i)=>{if(i===1){const r=S.rivals.find(x=>x.name===d.name);return r&&R()<.5?'三國が調べたところ、ただの噂だった。むしろ、陣営は有馬に向けて仕上げに入っているらしい。':'三國が調べたところ、本当だった。陣営は海外遠征を考えているらしい。';}return '';}},
});
function irregularEvents(){
  if(S.inbox.length>=3||R()>.22)return;
  const m=M(S.t),pool=[];
  if([1,2].includes(m)&&!S.flags.snowY)pool.push(['snow',1.2,{}]);
  const trs=[...new Set(anyHorse().map(h=>h.trainer))];if(trs.length)pool.push(['flu',.6,{tr:pick(trs)}]);
  const aw=anyHorse().filter(h=>ageOf(h)>=4&&!h.awoke);if(aw.length)pool.push(['awaken',.5,{hid:pick(aw).id}]);
  const jb=anyHorse().filter(h=>h.mainJ&&!(JK(h.mainJ).ban>S.t));if(jb.length){const h=pick(jb);pool.push(['ban',.6,{jid:h.mainJ,hid:h.id}]);}
  const st=S.stallions.filter(s=>!s.dead&&!s.own&&s.bornY==null);if(st.length&&yearNo()>=3)pool.push(['stallionDeath',.3,{...(()=>{const s=pick(st);return{id:s.id,n:s.n};})()}]);
  pool.push(['horseshoe',.4,{}]);
  const rv=S.rivals.filter(r=>r.status==='現役'&&r.g1>0);if(rv.length&&m>=9)pool.push(['rumor',.5,{name:pick(rv).name}]);
  let r=R()*pool.reduce((a,x)=>a+x[1],0);for(const [k,w,d] of pool){r-=w;if(r<=0){if(k==='snow')S.flags.snowY=Y(S.t);if(k==='awaken')HZ(d.hid).awoke=1;pushEv(k,d);break;}}
}
/* ---------- cooldowns so contacts don't repeat ---------- */
const CD_CALL=6,CD_MAIL={weekly:3,report:2,spam:5,fan:3,photo:2,vet:4,hinataLine:0,taunt:3};
Object.entries(CALLS).forEach(([k,c])=>{const w=c.w,su=c.setup;c.w=()=>{const cd=PH().cd||{};return cd[k]!=null&&S.t-cd[k]<CD_CALL?0:w();};c.setup=(...a)=>{const ph=PH();ph.cd=ph.cd||{};ph.cd[k]=S.t;return su(...a);};});
Object.entries(MAILS).forEach(([k,m])=>{const w=m.w;m.w=()=>{const cd=PH().mcd||{};const lim=CD_MAIL[k]??3;return cd[k]!=null&&S.t-cd[k]<lim?0:w();};});
sendMail=(o=>function(type){const ph=PH();ph.mcd=ph.mcd||{};ph.mcd[type]=S.t;return o.apply(this,arguments);})(sendMail);
/* ---------- hooks ---------- */
storyTriggers=(o=>function(first){const r=o.apply(this,arguments);if(!first&&S.month)irregularEvents();return r;})(storyTriggers);
racesFor=(o=>function(h){if(S.month&&(S.month.snow||(S.month.flu&&S.month.flu===h.trainer)))return [];return o.apply(this,arguments);})(racesFor);
jockeysAvail=(o=>function(){return o.apply(this,arguments).filter(id=>id==='stable'||!(JK(id).ban>S.t));})(jockeysAvail);
beginMonth=(o=>function(){const r=o.apply(this,arguments);if(S.flags.dog)anyHorse().forEach(h=>{h.bond=Math.min(100,h.bond+1);if(R()<.15)h.cond=Math.min(5,h.cond+1);});return r;})(beginMonth);
/* tell the player about a forced change of rider on race day */
showRaceDay=(o=>function(){const r=o.apply(this,arguments);if(RC_SUB.length){const hd=$('#sheet .racehead');if(hd)hd.insertAdjacentHTML('afterend',`<div class="comment warnc">${RC_SUB.map(esc).join('<br>')}</div>`);RC_SUB=[];}return r;})(showRaceDay);
showTrackGate=(o=>function(){const r=o.apply(this,arguments);if(RC_SUB.length){const hd=$('#sheet .racehead');if(hd)hd.insertAdjacentHTML('afterend',`<div class="comment warnc">${RC_SUB.map(esc).join('<br>')}</div>`);RC_SUB=[];}return r;})(showTrackGate);
