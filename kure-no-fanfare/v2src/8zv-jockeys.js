/* =========================================================
   騎手を増やす: 5人。どの騎手も、手紙で知り合ってから依頼できる（これまでの騎手と同じ）。
   ・辻 修平　…関西の中堅。先行策が得意
   ・水沢 遥　…デビュー2年目の若手。減量の恩恵があり、伸び盛り
   ・石神 大吾…長距離の名手。ベテラン
   ・速水 蓮　…短距離のスペシャリスト
   ・R.ハミルトン…イギリスのトップ騎手。1〜2月だけ来日（馬主の格が上がってから出会う）
   どの騎手も、ほかの馬（相手の馬）にも乗る。得意・不得意が依頼と走りに出る。
   ========================================================= */
const NEWJ={
  tsuji:{p:{n:'辻 修平',role:'騎手（関西の中堅・先行策）',trust:20,col:'#2a6f97',ini:'辻'},j:{sk:76,need:14,tag:'先行が得意'},
    face:{sx:'m',age:34,skin:'#e3b48e',hair:'#1f1a17',hs:'short',eye:'round',brow:2,mouth:'calm',wear:'jacket',cloth:'#2a6f97'},
    prof:{age:34,from:'京都・伏見',trait:'理屈っぽい。ラップを全部覚えている',hobby:'自転車',secret:'デビュー戦は落馬だった'},
    gift:{like:['和菓子','お茶'],bad:['ワイン']},catch:['好位の職人','先行策の名手'],at:7,
    intro:{from:'栗東トレーニングセンター',body:'坂路の下で、ストップウォッチを手にした騎手が声をかけてきた。\n\n「辻です。関西で乗ってます。…あ、今の馬、ラスト1ハロン12秒1でしたね」\n\n「前に行って、そのまま粘らせる競馬が得意です。気分屋の馬より、真面目な馬のほうが合います。機会があれば」',ch:[['「前に行く馬なら頼みたい」','「ええ、任せてください。好位は僕の席です」',5],['「よろしく」','辻は軽く頭を下げ、またストップウォッチに目を落とした。',3]]},
    v:{greet:['「辻です」','「どうも。今日のラップ、見ました？」'],accept:'「わかりました。前で運びます」',acceptMain:'「この馬は、僕が一番わかってます」',decline:'「すみません、その日は先約があって」',win:'「計算どおりです」',winBig:'「…計算以上でした。この馬に、ありがとうと言いたいです」',near:'「あと半馬身、どこかで詰められました」',mid:'「ペースは合ってました。もう少し時間をください」',bad:'「すみません。位置取りを誤りました」',self:'「実家は和菓子屋なんです。継がずに騎手になって、親父とは三年口をききませんでした」',mainAsk:'辻です。\n\n{h}、また乗せてもらえませんか。あの馬の走り方、まだ詰められると思うんです。'}},
  mizusawa:{p:{n:'水沢 遥',role:'騎手（2年目の若手・減量）',trust:20,col:'#e76f51',ini:'水'},j:{sk:64,need:0,grow:true,cap:87,tag:'減量・伸び盛り'},
    face:{sx:'f',age:20,skin:'#f3cfb0',hair:'#2a1c14',hs:'pony',eye:'big',brow:1,mouth:'smile',wear:'wind',cloth:'#e76f51'},
    prof:{age:20,from:'青森・八戸',trait:'明るい。物おじしない',hobby:'朝ごはんを作ること',secret:'馬に乗るのが怖かった時期がある'},
    gift:{like:['果物','洋菓子'],bad:['日本酒','焼酎','ワイン']},catch:['2年目の新鋭','減量を生かす若手'],at:4,
    intro:{from:'美浦トレーニングセンター',body:'厩舎の前で、元気な声が飛んできた。\n\n「水沢 遥です！ 2年目です！ まだ減量があるので、斤量は軽くできます！」\n\n「どんな馬でも乗ります。勝ちたいんです。乗せてください！」',ch:[['「機会があれば頼むよ」','「ほんとですか！ 待ってます！」',6],['「頑張って」','「はい！」水沢は大きく頭を下げて、走っていった。',3]]},
    v:{greet:['「水沢です！」','「おはようございます！」'],accept:'「乗ります！ ありがとうございます！」',acceptMain:'「この子は、わたしが一番好きです！」',decline:'「すみません、その日はもう…」',win:'「やった…！ やりました！」',winBig:'「夢みたいです…この子のおかげです…！」',near:'「くやしいです…次は勝ちます！」',mid:'「この子、もっと走れます。わたしがまだ下手で…」',bad:'「ごめんなさい…わたしのせいです」',self:'「中学のとき落馬して、半年乗れなかったんです。でも、また乗りたくて」',mainAsk:'水沢です！\n\n{h}に、また乗せてもらえませんか。お願いします！'}},
  ishigami:{p:{n:'石神 大吾',role:'騎手（長距離の名手・ベテラン）',trust:15,col:'#495057',ini:'石'},j:{sk:82,need:26,tag:'長距離'},
    face:{sx:'m',age:51,skin:'#d7a37c',hair:'#8d8a85',hs:'short',eye:'narrow',brow:3,mouth:'stern',wrinkle:2,wear:'jumper',cloth:'#495057'},
    prof:{age:51,from:'宮崎・都城',trait:'無口。長丁場ほど落ち着く',hobby:'登山',secret:'菊花賞を三回、二着で負けている'},
    gift:{like:['焼酎'],bad:['洋菓子']},catch:['長距離の名手','ステイヤーの手綱'],at:16,
    intro:{from:'京都競馬場',body:'検量室の片隅で、年配の騎手が黙って鞍を磨いていた。\n\n「…石神だ。三千メートルを乗らせたら、まだ若いのには負けん」\n\n「長い距離はな、馬と話しながら走るもんだ。急かさんことだ。そういう馬がいたら、声をかけてくれ」',ch:[['「長い距離なら頼みたい」','「…ああ」石神は少しだけ笑った。',5],['「よろしくお願いします」','石神は鞍から目を上げずに、うなずいた。',3]]},
    v:{greet:['「…石神だ」','「座れ」'],accept:'「…乗ろう」',acceptMain:'「この馬は、おれが最後まで乗る」',decline:'「その日は、先に頼まれている」',win:'「…よし」',winBig:'「長いこと乗ってきたが…こういう日のためだった」',near:'「惜しかった。馬はよく走った」',mid:'「この馬は、まだ長いところで良くなる」',bad:'「すまん。急かしすぎた」',self:'「若い頃は短いところばかり乗っていた。長い距離に回されて、ようやく馬の気持ちがわかった」',mainAsk:'石神だ。\n\n{h}、もう一度乗せてくれんか。あの馬は、もっと長いところで走れる。'}},
  hayami:{p:{n:'速水 蓮',role:'騎手（短距離のスペシャリスト）',trust:15,col:'#9d4edd',ini:'速'},j:{sk:79,need:20,tag:'短距離'},
    face:{sx:'m',age:28,skin:'#ecc3a0',hair:'#3a2a20',hs:'side',eye:'sharp',brow:1,mouth:'smile',wear:'leather',cloth:'#5a189a'},
    prof:{age:28,from:'福岡・博多',trait:'せっかち。スタートの名手',hobby:'スニーカー集め',secret:'千メートル直線のレースがいちばん好き'},
    gift:{like:['高級肉'],bad:['お茶']},catch:['スプリントの申し子','スタートの名手'],at:11,
    intro:{from:'新潟競馬場',body:'千直のレースが終わったあと、派手な勝負服の騎手が駆け寄ってきた。\n\n「速水っす！ 短いところなら、誰にも負けないっす」\n\n「ゲートが開いた瞬間がいちばん好きなんすよ。速い馬いたら、ぜひ！」',ch:[['「短距離の馬なら頼む」','「よっしゃ！ 待ってるっす！」',5],['「よろしく」','速水は親指を立てて、また走っていった。',3]]},
    v:{greet:['「速水っす」','「どもっす！」'],accept:'「乗るっす！」',acceptMain:'「この馬のスタートは、オレがいちばんわかってるっす」',decline:'「すんません、その日はもう埋まってて」',win:'「よっしゃあ！」',winBig:'「最高っす…！ 一生忘れないっす！」',near:'「くっそー、あとちょいだったっす」',mid:'「この馬、もっと短いほうがいいかもっす」',bad:'「すんません、スタートで遅れたっす」',self:'「陸上部だったんすよ。百メートル。走るの速いやつが好きなんす、人でも馬でも」',mainAsk:'速水っす。\n\n{h}、また乗せてもらえないっすか。あの馬の一歩目、最高なんす。'}},
  hamilton:{p:{n:'R.ハミルトン',role:'騎手（イギリス・1〜2月に来日）',trust:10,col:'#1d3557',ini:'ハ'},j:{sk:88,need:42,season:[1,2],tag:'冬だけ来日・追える'},
    face:{sx:'m',age:37,skin:'#f2d3bf',hair:'#c9a36a',hs:'swept',eye:'round',brow:2,mouth:'calm',wear:'suit',cloth:'#1d3557',tie:'#9b2335'},
    prof:{age:37,from:'イギリス・ニューマーケット',trait:'礼儀正しい。直線で別人になる',hobby:'紅茶とクリケット',secret:'日本の冬の澄んだ空気が好きで、毎年来ている'},
    gift:{like:['お茶','和菓子'],bad:['焼酎']},catch:['英国のトップジョッキー','直線で追える男'],at:20,gate:()=>S.fame>=18,
    intro:{from:'中山競馬場',body:'冬の中山。検量室の前で、背の高い外国人騎手が丁寧に会釈した。\n\n「はじめまして。ロバート・ハミルトンです。イギリスから、冬のあいだだけ乗りに来ています」\n\n「日本の馬は、最後まであきらめない。わたしは、そういう馬を追うのが好きです」',ch:[['「冬はお願いしたい」','「Of course. 喜んで」',5],['「腕を見せてほしい」','「では日曜日に。…見ていてください」',3]]},
    v:{greet:['「Good morning. ハミルトンです」','「お会いできてうれしいです」'],accept:'「喜んで乗ります」',acceptMain:'「この馬は、わたしの冬の楽しみです」',decline:'「申し訳ない、その日は先約が」',win:'「Brilliant. いい馬です」',winBig:'「日本で、こんな勝ち方ができるとは…ありがとう」',near:'「あと少し。でも、誇れる走りでした」',mid:'「この馬には、まだ伸びしろがあります」',bad:'「わたしのミスです。申し訳ない」',self:'「父は厩務員でした。ニューマーケットの朝の霧の中で、馬を引いて歩くのが好きだった」',mainAsk:'ハミルトンです。\n\n{h}に、また乗りたい。あの馬の直線は、美しかった。'}}};
Object.entries(NEWJ).forEach(([id,x])=>{PEOPLE0[id]=x.p;JOCKEYS0[id]=x.j;if(typeof FACES!=='undefined')FACES[id]=x.face;if(typeof PROF!=='undefined')PROF[id]=x.prof;GIFT_PREF[id]=x.gift;
  if(typeof JK_CATCH!=='undefined')JK_CATCH[id]=x.catch;JINTRO[id]=x.intro;VOICE[id]=x.v;TOPICS[id]=jockeyTopics(id);if(x.gate&&typeof JGATE!=='undefined')JGATE[id]=x.gate;});
/* old saves: add them */
function ensureNewJ(){if(!S||!S.people||!S.jockeys)return;Object.entries(NEWJ).forEach(([id,x])=>{if(!S.people[id])S.people[id]={...x.p,met:false,t1:null};if(!S.jockeys[id])S.jockeys[id]={...x.j,rides:0,wins:0};});}
/* the introductions, spread over the years (months from the start; a later save meets them as soon as their time has come) */
storyTriggers=(o=>function(first){const r=o.apply(this,arguments);try{ensureNewJ();if(first||!S.startT&&S.startT!==0)return r;const t=S.t-S.startT;S.flags.jx=S.flags.jx||{};
  const due=Object.entries(NEWJ).find(([id,x])=>!S.flags.jx[id]&&!(P(id)&&P(id).met)&&t>=x.at&&(!x.j.season||x.j.season.includes(M(S.t))));
  if(due&&!S.inbox.some(e=>e.type==='jIntro')){S.flags.jx[due[0]]=1;pushEv('jIntro',{id:due[0]});}}catch(e){console.error('newJ',e);}return r;})(storyTriggers);
/* their strengths in the race and in the asking */
jFit=(o=>function(jid,h,race){const r=o.apply(this,arguments);try{const t=(JK(jid)&&JK(jid).tag)||'';
  if(/長距離/.test(t)&&race){if(race.dist>=2400)r.v+=.9;else if(race.dist<=1400){r.v-=.8;r.why=r.why||'短いところは、おれの出番じゃない';}}
  if(/短距離/.test(t)&&race){if(race.dist<=1400)r.v+=.9;else if(race.dist>=2200){r.v-=.8;r.why=r.why||'長いところは、ちょっと自信ないっす';}}
  if(/先行が得意/.test(t)&&h){if(h.style==='先行'||h.style==='逃げ')r.v+=.6;else if(h.style==='追込')r.v-=.5;}
  if(/減量/.test(t)&&race&&!race.g)r.v+=.5;}catch(e){}return r;})(jFit);
