/* =========================================================
   人間関係の作り込み
   1) 信頼の記録: trust changes are logged with the reason (what you did)
   2) 人物どうしの関係: NPC↔NPC ties that shift over time; gossip reaches the phone,
      and getting close to someone ripples to their friends (and their rivals)
   3) 一人ひとりの物語: three-chapter personal arcs unlocked by trust
   4) 相関図 + 人物手帳 in the 人脈 tab
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`
.corr{position:relative;padding:6px 0 0}
.corr svg{display:block;width:100%;height:auto;max-width:560px;margin:0 auto;touch-action:manipulation}
.corr .lg{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;font-size:11px;color:var(--muted);margin-top:4px}
.corr .lg i{display:inline-block;width:18px;height:3px;border-radius:2px;vertical-align:middle;margin-right:4px}
.nb-sec{margin-top:12px}
.nb-sec h3{font-size:13px;margin:0 0 6px;letter-spacing:.05em;opacity:.75}
.nb-prof{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;font-size:13px}
.nb-prof dt{opacity:.6}
.nb-prof dd{margin:0}
.nb-arc{display:flex;flex-direction:column;gap:6px}
.nb-arc .ch{display:flex;gap:8px;align-items:baseline;font-size:13px}
.nb-arc .ch b{flex:none;width:3.6em;opacity:.6;font-weight:600}
.nb-arc .ch.lock{opacity:.45}
.nb-rel{display:flex;flex-direction:column;gap:6px}
.nb-rel .r{display:flex;gap:8px;align-items:center;font-size:13px}
.nb-rel .k{flex:none;font-size:11px;border-radius:9px;padding:1px 8px;color:#fff}
.nb-log{font-size:12px;display:flex;flex-direction:column;gap:3px;max-height:180px;overflow:auto}
.nb-log .l{display:flex;gap:8px}
.nb-log .l .m{flex:none;width:5.5em;opacity:.55}
.nb-log .l .d{flex:none;width:2.6em;text-align:right;font-weight:700}
.nb-log .l .d.u{color:#2a9d5c}.nb-log .l .d.n{color:#d0453a}
.person .nbbtn{margin-right:6px}
`;document.head.appendChild(st);})();

/* ---------- 人物の素顔 ---------- */
const PROF={
 mikuni:{age:38,from:'千葉・船橋',trait:'几帳面。手帳を手放さない',hobby:'厩舎の仔猫の世話',secret:'雨の日は古傷の膝が痛む。誰にも言っていない'},
 togawa:{age:66,from:'茨城・美浦',trait:'無口。馬の脚元しか見ない',hobby:'日本酒と将棋',secret:'三十年前、有馬記念をハナ差で逃した。その馬は翌年脚を折った'},
 hayase:{age:34,from:'兵庫・宝塚',trait:'負けず嫌い。数字に強い',hobby:'ケーキ屋めぐり',secret:'若い頃、戸川厩舎で調教助手をしていた'},
 washio:{age:41,from:'北海道・浦河',trait:'口が悪い。だが馬には優しい',hobby:'焼き鳥屋のカウンター',secret:'落馬の後遺症で、右手に痺れが残っている'},
 hinata:{age:22,from:'福島・いわき',trait:'まっすぐ。泣き虫',hobby:'鷲尾の騎乗ビデオを見ること',secret:'母一人に育てられた。勝つたびに仕送りしている'},
 kido:{age:36,from:'東京・府中',trait:'堅実。人の話をよく聞く',hobby:'家庭菜園',secret:'重賞は、デビュー三年目に一度勝ったきり'},
 rossi:{age:33,from:'イタリア・ミラノ',trait:'陽気。勝負どころで冷徹',hobby:'ワインとサッカー',secret:'日本の和菓子が実は好き'},
 sanada:{age:29,from:'神奈川・横浜',trait:'冷静。感情を表に出さない',hobby:'珈琲を自分で淹れること',secret:'子どもの頃は乗馬クラブで落ちてばかりいた'},
 kiryu:{age:24,from:'岐阜・笠松',trait:'勝ち気。差し・追込が得意',hobby:'焼肉の食べ歩き',secret:'父は地方競馬の騎手だった'},
 oba:{age:45,from:'大阪・岸和田',trait:'豪快。ハナを切ったら譲らない',hobby:'たこ焼きと阪神タイガース',secret:'息子が競馬学校を受験しようとしている'},
 dubois:{age:31,from:'フランス・シャンティイ',trait:'紳士。雨の日に強い',hobby:'ワインと日本の温泉',secret:'ロッシとは見習い時代からの因縁がある'},
 komori:{age:19,from:'静岡・浜松',trait:'素直。怖がりだが粘り強い',hobby:'お菓子作り',secret:'騎手になると言ったとき、家族全員に反対された'},
 kuroiwa:{age:48,from:'北海道・日高',trait:'寡黙。夏の北海道では負けない',hobby:'釣り',secret:'馬に乗ることを、中原牧場で覚えた'},
 arai:{age:39,from:'大分・別府',trait:'職人気質。砂を読む',hobby:'温泉と肉',secret:'芝のG1を一度でいいから勝ちたい'},
 nakahara:{age:68,from:'北海道・日高',trait:'頑固。馬の目を見て値を決める',hobby:'夜中の仔馬の見回り',secret:'九条から何度も牧場の買収話を持ちかけられている'},
 kujo:{age:58,from:'東京・田園調布',trait:'尊大。だが勝負には誠実',hobby:'書斎で古いレースを見返すこと',secret:'若い頃、中原牧場の馬に一目惚れして断られたことがある'},
 koyanagi:{age:35,from:'茨城・美浦',trait:'慎重。戸川の教えを守る',hobby:'馬房の掃除',secret:'戸川の看板の重さに、夜眠れない日がある'},
 mio:{age:27,from:'北海道・日高',trait:'明るい。行動が早い',hobby:'仔馬の写真を撮ること',secret:'東京の会社を辞めて牧場に戻った'},
 rei:{age:31,from:'東京',trait:'理知的。父とは違う道を探している',hobby:'珈琲',secret:'父の書斎のライバルの写真を、ずっと気にしている'},
};

/* ---------- 人物どうしの関係 ---------- */
const RELS0=[
 {a:'togawa',b:'hayase',k:'元師弟',v:30,note:'早瀬は若い頃、戸川厩舎の調教助手だった'},
 {a:'hayase',b:'kiryu',k:'所属',v:55,note:'桐生は早瀬厩舎の所属騎手'},
 {a:'washio',b:'hinata',k:'憧れ',v:5,note:'日向は鷲尾に憧れているが、鷲尾は相手にしない'},
 {a:'washio',b:'sanada',k:'宿敵',v:-35,note:'リーディングを争う二人。口もきかない'},
 {a:'togawa',b:'washio',k:'恩人',v:35,note:'若い鷲尾を最初に乗せたのが戸川だった'},
 {a:'hinata',b:'kiryu',k:'同期',v:15,note:'同じ年にデビュー。勝ち星を競い合う'},
 {a:'kido',b:'komori',k:'兄弟子',v:35,note:'城戸が新人の小森の面倒を見ている'},
 {a:'kido',b:'oba',k:'飲み仲間',v:45,note:'東西の中堅とベテラン。よく一緒に飲む'},
 {a:'rossi',b:'dubois',k:'因縁',v:-25,note:'見習い時代からの張り合い。日本でも譲らない'},
 {a:'nakahara',b:'kujo',k:'確執',v:-50,note:'九条は中原牧場の買収を何度も持ちかけてきた'},
 {a:'kuroiwa',b:'nakahara',k:'恩義',v:45,note:'黒岩は中原牧場で馬に乗ることを覚えた'},
 {a:'kujo',b:'sanada',k:'主戦',v:45,note:'真田は九条の馬の主戦騎手'},
 {a:'oba',b:'arai',k:'張り合い',v:-10,note:'ダートの逃げ馬を取り合う、関西の二人'},
 {a:'mikuni',b:'togawa',k:'旧知',v:25,note:'三國が厩務員だった頃からの顔見知り'},
 {a:'koyanagi',b:'togawa',k:'師弟',v:70,note:'戸川厩舎を継いだ一番弟子',p2:1},
 {a:'mio',b:'nakahara',k:'親子',v:45,note:'牧場の二代目。父とはよくぶつかる',p2:1},
 {a:'rei',b:'kujo',k:'親子',v:-10,note:'父のやり方に反発している',p2:1},
];
const relKey=(a,b)=>[a,b].sort().join('|');
function RS(){if(!S.rels){S.rels={};RELS0.forEach(r=>S.rels[relKey(r.a,r.b)]=r.v);}return S.rels;}
function relsOf(id){return RELS0.filter(r=>(r.a===id||r.b===id)&&P(r.a)&&P(r.b)).map(r=>({...r,o:r.a===id?r.b:r.a,v:RS()[relKey(r.a,r.b)]??r.v}));}
function relAdd(a,b,d){const k=relKey(a,b);const R=RS();if(R[k]==null)return;R[k]=clamp(R[k]+d,-100,100);}
const relCol=v=>v>=30?'#2a9d5c':v<=-20?'#d0453a':'#8a8f98';
const relWord=v=>v>=60?'固い絆':v>=30?'良好':v<=-50?'犬猿':v<=-20?'険悪':'微妙';

/* ---------- 信頼の記録 + 波及 ---------- */
let TCTX=null,RIPPLE=false;
trust=(o=>function(id,d){const p=P(id);if(!p||!d)return o.apply(this,arguments);const b=p.trust;const r=o.apply(this,arguments);const real=p.trust-b;
  if(Math.abs(real)>=.5){S.tlog=S.tlog||{};const L=S.tlog[id]=S.tlog[id]||[];L.unshift({t:S.t,d:Math.round(real*10)/10,w:TCTX||'日々のこと'});if(L.length>24)L.length=24;}
  if(!RIPPLE&&real>=3){RIPPLE=true;try{const by=who(id).split(' ')[0];
    relsOf(id).forEach(x=>{const q=P(x.o);if(!q||!q.met)return;const save=TCTX;
      if(x.v>=30){TCTX=`${by}と親しいから`;trust(x.o,real*.25);}
      else if(x.v<=-30){TCTX=`${by}と折り合いが悪いから`;trust(x.o,-real*.15);}
      TCTX=save;});}finally{RIPPLE=false;}}
  return r;})(trust);
const withCtx=(fn,ctx)=>function(){const s=TCTX;TCTX=typeof ctx==='function'?ctx.apply(this,arguments):ctx;try{return fn.apply(this,arguments);}finally{TCTX=s;}};
ACT.reply=withCtx(ACT.reply,()=>'世間話の返事');
ACT.gift=withCtx(ACT.gift,d=>`手土産（${d.g}）`);
ACT.topic=withCtx(ACT.topic,d=>{const t=UI.talk;const tp=t&&(TOPICS[t.id]||[]).find(x=>x.id===d.tp);return tp?'会って：'+tp.label.replace(/[「」]/g,''):'会って話した';});
ACT.evc=withCtx(ACT.evc,d=>{const e=S.inbox.find(x=>x.id===+d.id);const v=e&&EV[e.type]&&EV[e.type].r(e.data);return v?'出来事：'+v.title:'出来事';});
ACT.phReply=withCtx(ACT.phReply,()=>{const m=UI.phone&&UI.phone.mail;return m?'メッセージ：'+(m.subj||'').slice(0,16):'メッセージ';});
if(ACT.callCh)ACT.callCh=withCtx(ACT.callCh,'電話で');

/* ---------- 一人ひとりの物語 ---------- */
const bondTr=(tr,d)=>S.horses.filter(h=>h.owner==='me'&&h.trainer===tr).forEach(h=>h.bond=Math.min(100,(h.bond||0)+d));
const skUp=(id,d)=>{const j=JK(id);if(j)j.sk=Math.min(j.cap||96,j.sk+d);};
const ARCS={
 mikuni:{parts:[1,2],ch:[
  {need:62,title:'雨の日の膝',body:()=>`朝から冷たい雨。事務所に入ってきた三國さんが、ほんの少し右脚を引きずっていた。\n\n「…なんでもありません。昔の古傷が、雨の日だけ少し」\n\n厩務員時代に担当馬に蹴られた膝だ。三國さんは何事もなかったように、今月の出走予定を読み上げ始めた。`,
   ch:[['「今日はもう帰って休んでくれ」',()=>{trust('mikuni',5);return '「…では、お言葉に甘えて。午後には戻ります」\n結局、三國さんは午後に戻ってきた。手には温かいお茶が二つあった。';}],
       ['「いい整形外科を知ってる。紹介する」',()=>{trust('mikuni',7);S.flags.mikuniKnee=1;return '翌週、三國さんから短いメモが届いた。\n「行ってきました。…ありがとうございます。誰かに膝のことを言ったのは、初めてです」';}],
       ['気づかないふりをする',()=>{trust('mikuni',1);return '三國さんは最後まで、何も言わなかった。\nたぶん、それが三國さんの望んだことだった。';}]]},
  {need:74,title:'あの馬の仔',body:()=>`「すみません、私用で一日お休みをいただけますか」\n\n珍しいことだった。聞けば、三國さんが厩務員時代に最後に担当した牝馬の仔が、地方の小さな競馬場で走るのだという。\n\n「勝てる馬じゃないんです。でも…見ておきたくて」`,
   ch:[['「一緒に行こう」',()=>{trust('mikuni',9);S.money-=20;S.fame+=.3;return '小さなスタンドで、二人並んで見た。その馬は七頭立ての五着だった。\n\n三國さんはゴールの後もしばらく馬場を見ていた。\n「…母親にそっくりな走り方でした」';}],
       ['「ゆっくり見てきてくれ」',()=>{trust('mikuni',6);return '翌日、三國さんの机に地方競馬の小さな記念タオルが置いてあった。「お土産です」とだけ付箋が貼ってあった。';}]]},
  {need:88,title:'三國の手帳',body:()=>`三國さんが席を外している間に、机の上の手帳が開いたままになっていた。\n\nどの馬の、どの日の体重。調教のタイム。飼い葉を残した日。そして余白に、小さな字で──\n\n「オーナー、今日は${pick(['ずっと黙って馬を見ていた','馬の脚を先に見た','負けた馬に先に声をかけた'])}」`,
   ch:[['「…ありがとう」とだけ言う',()=>{trust('mikuni',10);S.horses.filter(h=>h.owner==='me').forEach(h=>h.bond=Math.min(100,(h.bond||0)+3));return '戻ってきた三國さんは、手帳を見て、こちらを見て、少しだけ笑った。\n「全部、覚えておきたいんです。この仕事の、全部を」';}],
       ['黙って手帳を閉じておく',()=>{trust('mikuni',6);return 'その日から、三國さんの手帳がどこに置いてあっても、もう開くことはなかった。\n書かれていることは、きっと全部、知っている。';}]]},
 ]},
 togawa:{parts:[1],ch:[
  {need:35,title:'朝四時の厩舎',body:()=>`「あんた、朝は強いか」\n\n戸川先生からの電話はそれだけだった。翌朝四時の美浦。まだ暗い厩舎の前で、先生は白い息を吐きながら馬たちの脚元を一頭ずつ触っていた。\n\n「脚は嘘をつかん。人間はつくがな」`,
   ch:[['一緒に脚元を見せてもらう',()=>{trust('togawa',7);bondTr('togawa',3);return '先生は一頭ごとに、熱の持ち方、腱の張りを黙って指で示した。\n朝日が昇るころ、「…筋がいい」とだけ言った。';}],
       ['邪魔にならないよう遠くで見る',()=>{trust('togawa',4);return '帰り際、先生が缶コーヒーを投げてよこした。\n「次は近くで見ろ」';}]]},
  {need:52,title:'引退の二文字',body:()=>`将棋盤を挟んで、戸川先生がぽつりと言った。\n\n「…あと何年できるかな、と思うことがある。目が、昔ほど利かん」\n\n「弟子の小柳ってのがいる。腕はまだまだだが、馬の声を聞く耳はある。わしが辞めたら、あいつに看板を譲るつもりだ」`,
   ch:[['「辞める前に、先生の馬で大きいところを獲りましょう」',()=>{trust('togawa',8);S.flags.togawaVow=1;return '先生は駒を置く手を止めて、しばらく黙った。\n「…生意気を言う」\nそう言って、少しだけ笑った。';}],
       ['「小柳さんのこと、覚えておきます」',()=>{trust('togawa',6);if(P('koyanagi'))P('koyanagi').trust=Math.min(100,P('koyanagi').trust+8);return '「頼む。あいつは、わしより馬に優しい」\nそれが先生の、精一杯の弟子自慢だった。';}]]},
  {need:72,title:'ハナ差の有馬',body:()=>`厩舎の奥の小さな事務室に、色褪せた写真が一枚だけ飾ってある。三十年前の有馬記念。ハナ差の二着。\n\n「こいつは次の年に脚を折った。わしが使い詰めにしたからだ」\n\n先生は写真から目を離さずに言った。「だからあんたの馬には、無理をさせん。…恨むなよ」`,
   ch:[['「先生のやり方を信じます」',()=>{trust('togawa',10);bondTr('togawa',5);return '先生は何も言わずに、写真の額の埃を指で払った。\nその日から、戸川厩舎の調教報告が、少しだけ長くなった。';}],
       ['写真の馬の名前を聞く',()=>{trust('togawa',8);S.flags.togawaPhoto=1;return '「…ユキノハナ、という」\n先生がその名前を口にしたのは、三十年ぶりだったのかもしれない。';}]]},
 ]},
 hayase:{parts:[1,2],ch:[
  {need:35,title:'断られた預託',body:()=>`早瀬さんが珍しく沈んだ声で電話してきた。\n\n「…ある馬主さんに、“若い女の厩舎には大事な馬は預けられない”って。面と向かって言われたの、久しぶりで」\n\n電話の向こうで、無理に笑う気配がした。`,
   ch:[['「うちの次の馬は、早瀬さんに預ける」',()=>{trust('hayase',8);S.flags.hayaseNext=1;return '「…本当ですか？ 本当ですね？ 録音しましたからね」\n声が、いつもの早瀬さんに戻っていた。';}],
       ['「結果で黙らせよう」',()=>{trust('hayase',5);return '「…はい。はい！ そうですよね」\n翌朝の調教報告は、いつもの倍の長さだった。';}]]},
  {need:55,title:'桐生の引き抜き',body:()=>`「桐生に、大きな厩舎から“うちに来ないか”って声がかかってるんです」\n\n早瀬さんはケーキに手をつけずに言った。\n\n「あの子のためを思えば、送り出すべきなんですよね。…でも、うちの厩舎はあの子と一緒に大きくなってきたから」`,
   ch:[['「本人に好きに選ばせればいい」',()=>{trust('hayase',4);trust('kiryu',6);relAdd('hayase','kiryu',8);return '後日、桐生から短い連絡が来た。\n「残ります。早瀬先生の馬で、勝ちたいので」\n早瀬さんは、その日一日中機嫌がよかったらしい。';}],
       ['「残ってほしいと、ちゃんと言うべきだ」',()=>{trust('hayase',7);trust('kiryu',2);relAdd('hayase','kiryu',15);return '「…言えました。“あんたがいないと困る”って」\n電話の向こうで、早瀬さんは少し泣いていた。';}]]},
  {need:74,title:'調教師会の夜',body:()=>`調教師会の懇親会で、早瀬さんが年配の調教師たちに「坂路の使い方が古い」と言い切ってしまった。\n\n場が凍りついた。その中には、戸川先生の顔もあった。\n\n帰り道、早瀬さんは「言い過ぎました？」と小さく聞いた。`,
   ch:[['「間違ったことは言っていない」',()=>{trust('hayase',10);trust('togawa',-3);relAdd('togawa','hayase',-15);return '「…ですよね！」\n早瀬さんは晴れやかに笑った。ただ、その月の戸川先生からの調教報告は、いつもより短かった。';}],
       ['「戸川先生には、明日頭を下げに行こう」',()=>{trust('hayase',5);trust('togawa',4);relAdd('togawa','hayase',15);return '翌朝、二人で美浦へ行った。\n戸川先生は早瀬さんの顔を見るなり言った。「…お前は昔から、言うことだけは正しい」\n早瀬さんは深々と頭を下げた。';}]]},
 ]},
 hinata:{parts:[1,2],ch:[
  {need:28,title:'減量',body:()=>`調教のあと、日向くんがサウナの前で座り込んでいた。顔が真っ白だ。\n\n「…大丈夫です。あと五百グラムなんで」\n\n若い騎手にとって減量は毎週の戦いだ。それでも、限度はある。`,
   ch:[['「飯を食え。体が資本だ」',()=>{trust('hinata',6);return '近くの定食屋で、日向くんは焼肉定食を半分だけ食べた。\n「…半分だけです。でも、うまいっす」\n目が少し潤んでいた。';}],
       ['「プロだろう。自分で管理しろ」',()=>{trust('hinata',2);skUp('hinata',1);return '「…はい」\n日向くんは立ち上がって、もう一度サウナに入っていった。\n翌週、彼は斤量ぴったりで勝った。';}]]},
  {need:48,title:'鷲尾さんの背中',body:()=>`「鷲尾さんに、弟子にしてくださいって頭を下げたんです」\n\n日向くんは苦笑いした。\n\n「“俺は弟子は取らねえ。ビデオでも見てろ”って。…もう百回見てますって言ったら、笑われました」`,
   ch:[['鷲尾さんに口をきいてやる',()=>{if(P('washio').trust>=30){relAdd('washio','hinata',25);trust('hinata',6);trust('washio',2);return '焼き鳥屋で鷲尾さんに切り出すと、鷲尾さんはしばらく串を回していた。\n「…朝の調教、一回だけなら見てやる」\n日向くんは、その夜眠れなかったらしい。';}
         relAdd('washio','hinata',5);trust('washio',-3);trust('hinata',3);return '鷲尾さんは「余計なお世話だ」と吐き捨てた。\nまだ、口をきけるほどの仲ではなかったらしい。';}],
       ['「自分の乗り方を見つけろ」',()=>{trust('hinata',5);skUp('hinata',1.2);return '「…自分の乗り方」\n日向くんはしばらくその言葉を繰り返していた。\nそれから、鷲尾さんのビデオを見る回数が減ったらしい。';}]]},
  {need:72,title:'母からの電話',body:()=>`レース前日の夜、日向くんから電話がかかってきた。声が震えていた。\n\n「母が、倒れたって。いわきの病院で…。でも、明日は${(bestRacer()||{name:'うちの馬'}).name}に乗る約束で」`,
   ch:[['「行ってこい。馬は待ってる」',()=>{trust('hinata',12);return '日向くんは最終の新幹線に飛び乗った。\n幸い、お母さんは軽い貧血だった。\n一週間後、戻ってきた日向くんは、厩舎の誰よりも早く馬場に出ていた。';}],
       ['「お母さんは、乗れと言うと思う」',()=>{trust('hinata',3);skUp('hinata',1);return '翌日、日向くんは乗った。\nレースの後、真っ先に病院へ向かった。お母さんは病室のテレビで見ていた。\n「…“ちゃんと乗れてた”って、言われました」';}]]},
 ]},
 kiryu:{parts:[1,2],ch:[
  {need:25,title:'斤量の陰口',body:()=>`検量室の前で、桐生さんが年上の騎手に何か言われていた。\n\n「女は斤量が軽くて得だよな」\n\n桐生さんは黙って頭を下げ、こちらに気づくと、悔しそうに唇を噛んだ。`,
   ch:[['「次、うちの馬に乗ってくれ」',()=>{trust('kiryu',8);return '「…いいんですか」\n桐生さんは一度だけ目をこすって、「勝ちます」と言った。';}],
       ['「勝てば誰も何も言わなくなる」',()=>{trust('kiryu',5);skUp('kiryu',.8);return '「…わかってます」\nその日の最終レース、桐生さんは直線一気で差し切った。\n検量室の前では、もう誰も何も言わなかった。';}]]},
  {need:45,title:'同期の背中',body:()=>`「日向に、勝ち星で抜かれました」\n\n桐生さんは焼肉の網を見つめたまま言った。\n\n「同期なんです。デビュー戦も同じ日で。…あいつには、絶対負けたくない」`,
   ch:[['「二人とも、うちの馬で育てる」',()=>{trust('kiryu',4);trust('hinata',3);relAdd('hinata','kiryu',15);return '「…ずるいですね、そういうの」\n桐生さんは笑って、肉を一枚、こちらの皿に乗せた。\n後で聞くと、日向くんとは時々一緒に飯を食うようになったらしい。';}],
       ['「負けるな」',()=>{trust('kiryu',6);skUp('kiryu',.8);relAdd('hinata','kiryu',-8);return '「はい」\n短い返事だったが、目は燃えていた。\nその月、桐生さんは日向くんを勝ち星でまた抜き返した。';}]]},
  {need:70,title:'シャンティイへの誘い',body:()=>`「フランスで、ひと夏乗らないかって誘われてるんです。デュボワさんの紹介で」\n\n桐生さんは迷っている顔だった。\n\n「行けば、日本の夏のレースは全部乗れません。…早瀬先生にも、まだ言えてなくて」`,
   ch:[['「行ってこい。必ず強くなって帰ってくる」',()=>{trust('kiryu',8);const j=JK('kiryu');if(j){j.cap=Math.min(96,(j.cap||90)+3);skUp('kiryu',2);}return '桐生さんは夏の間、シャンティイで乗った。\n秋に帰ってきた彼女の騎乗は、見違えるほど落ち着いていた。\n「向こうの馬場、雨ばっかりでした」と笑った。';}],
       ['「早瀬さんと、まず話すべきだ」',()=>{trust('kiryu',5);trust('hayase',4);relAdd('hayase','kiryu',10);return '二人は一晩話し合ったらしい。\n桐生さんは、来年の夏に行くことに決めた。\n「先生の馬で、一つ大きいのを勝ってから行きます」';}]]},
 ]},
 kido:{parts:[1,2],ch:[
  {need:35,title:'乗り替わり',body:()=>`城戸さんが、ずっと乗ってきた有力馬を若手に乗り替わられた、と聞いた。\n\n調教スタンドで会った城戸さんは、いつもと同じ穏やかな顔だった。\n\n「よくあることですよ。…ただ、あの馬の癖を一番知ってるのは、僕だったんですけどね」`,
   ch:[['「城戸さんの堅実な騎乗が好きなんだ」',()=>{trust('kido',7);return '「…ありがとうございます。そう言ってもらえるのが、一番効きます」\n城戸さんは少しだけ照れた顔で、家庭菜園のトマトをくれた。';}],
       ['大庭さんも呼んで飲みに行く',()=>{trust('kido',5);trust('oba',3);relAdd('kido','oba',8);S.money-=10;return '大庭さんは「そんなもん、次で見返したったらええねん！」と三回言った。\n城戸さんは、その夜ずっと笑っていた。';}]]},
  {need:55,title:'小森の相談',body:()=>`「小森が、最近思い詰めてるみたいで」\n\n城戸さんは自分のことより、後輩の心配をしていた。\n\n「勝てない時期って、一番怖いんです。誰かが乗せてあげないと、そのまま消えていく若い子も多いので」`,
   ch:[['「小森さんを、うちの馬に乗せたい」',()=>{trust('kido',5);if(P('komori')){P('komori').met=true;trust('komori',6);}relAdd('kido','komori',10);return '「本当ですか。…あいつ、きっと泣きますよ」\n実際、小森さんは泣いた。城戸さんも、少しだけ泣いていた。';}],
       ['「城戸さんが見てやってくれ」',()=>{trust('kido',4);relAdd('kido','komori',12);return '「もちろんです。…兄弟子なんで」\nその月から、城戸さんと小森さんが朝の調教で並んで乗る姿がよく見られるようになった。';}]]},
  {need:75,title:'十三年ぶりの重賞',body:()=>`城戸さんがぽつりと言った。\n\n「重賞、デビュー三年目に一度勝ったきりなんです。もう十三年になるかな」\n\n「娘が、“パパが勝つところをテレビで見たい”って。…中堅って、そういうチャンスがなかなか回ってこないんですよね」`,
   ch:[['「次の重賞、城戸さんに頼む」',()=>{trust('kido',10);const h=bestRacer();S.flags.kidoVow=1;return `「…え」\n城戸さんはしばらく言葉が出なかった。\n「${h?h.name:'あの馬'}で。…必ず、娘に見せます」`;}],
       ['「チャンスは自分で掴むものだ」',()=>{trust('kido',4);skUp('kido',1);return '「…そうですね。そうでした」\n城戸さんは静かに頷いた。\nその秋、城戸さんは他の厩舎の馬で、十三年ぶりの重賞を勝った。';}]]},
 ]},
 oba:{parts:[1,2],ch:[
  {need:25,title:'岸和田のたこ焼き',body:()=>`「オーナー、たこ焼き好きか？ 好きやろ？ 好きやな！」\n\n有無を言わさず連れていかれたのは、岸和田の小さな屋台だった。\n\n「ここのが日本一や。…騎手になってから、勝っても負けてもここで食うねん」`,
   ch:[['「日本一だ」と言う',()=>{trust('oba',7);return '「せやろ！！」\n大庭さんは店のおっちゃんの背中をばんばん叩いた。\nおっちゃんは「こいつ、負けた日は二皿食うねん」と笑った。';}],
       ['正直に「熱すぎる」と言う',()=>{trust('oba',5);return '「それがええねん！ 熱いうちに食わな、たこ焼きに失礼や」\nなぜか大庭さんは、さっきより機嫌がよかった。';}]]},
  {need:45,title:'逃げの哲学',body:()=>`「逃げは臆病者の戦法や、って言うやつがおる」\n\n大庭さんは珍しく真顔だった。\n\n「ちゃうねん。逃げは、一番最初に風を受けて、一番最初に心臓が苦しなる。それでも前におる。…一番しんどい乗り方なんや」`,
   ch:[['「うちの逃げ馬は、大庭さんに任せたい」',()=>{trust('oba',7);skUp('oba',.6);return '「…ほんまか。ほな、ハナは絶対譲らん」\n大庭さんはこぶしを握った。';}],
       ['「新井さんとは、どっちが上手い？」',()=>{trust('oba',3);relAdd('oba','arai',-6);return '「新井ぃ？ あいつは砂の上でしか逃げられへん！」\nそれから一時間、新井さんの悪口と、実は認めているところを交互に聞かされた。';}]]},
  {need:70,title:'息子の受験',body:()=>`「息子がな、競馬学校受けるって言いだしてん」\n\n大庭さんはジョッキを置いた。\n\n「反対はせえへん。せえへんけど…落ちたら、あいつ泣くやろな。受かっても、この世界はしんどいで」`,
   ch:[['「受かったら、うちの馬でデビューさせよう」',()=>{trust('oba',10);S.flags.obaSon=1;return '大庭さんはしばらく黙って、それから大声で泣き出した。\n「あかん、酒のせいや」\n息子さんは、その春、合格した。';}],
       ['「父親の背中を見て決めたんだろう」',()=>{trust('oba',7);return '「…そうかぁ。そうなんかなぁ」\n大庭さんは、照れくさそうに頭をかいた。\nその次のレース、大庭さんは逃げ切って、ゴール後に派手なガッツポーズをした。';}]]},
 ]},
 komori:{parts:[1,2],ch:[
  {need:28,title:'初勝利',body:()=>`「勝ちました…勝ちました！！」\n\n小森さんの初勝利は、平日の小さな未勝利戦だった。検量室の前で、泣きながら何度も頭を下げている。\n\n「反対してた家族に、今日、電話してもいいですかね」`,
   ch:[['「今すぐかけろ」',()=>{trust('komori',7);return '小森さんは震える手で電話をかけた。\n電話の向こうで、お母さんが泣いているのが聞こえた。\n「…“おめでとう”って言われました。はじめて」';}],
       ['お祝いにケーキを贈る',()=>{trust('komori',8);S.money-=3;return '「えっ、ケーキ！？ …私、お菓子作るの趣味なんです。今度、お返しに焼いてきます！」\n翌週、少し焦げたマドレーヌが事務所に届いた。';}]]},
  {need:48,title:'落馬のあと',body:()=>`小森さんが調教中に落馬した。幸い怪我は軽かったが、それから馬に跨ると手が震えるのだという。\n\n「…怖いんです。こんなの、騎手失格ですよね」`,
   ch:[['「乗れるようになるまで、待つ」',()=>{trust('komori',9);relAdd('kido','komori',5);return '三週間後、小森さんはまた乗り始めた。\n城戸さんが毎朝、隣で並んで乗ってくれていたらしい。';}],
       ['「怖さを知った騎手は強くなる」',()=>{trust('komori',6);skUp('komori',1.2);return '「…強く、なれますか」\n「なれる」と言うと、小森さんはまっすぐこちらを見た。\n翌月、彼女の騎乗から無駄な力みが消えていた。';}]]},
  {need:70,title:'この勝負服で',body:()=>`「お願いがあります」\n\n小森さんはいつになく真剣な顔だった。\n\n「いつか、オーナーの勝負服で重賞に乗りたいんです。…今すぐじゃなくていいです。それまでに、ちゃんと上手くなります」`,
   ch:[['「約束する」',()=>{trust('komori',10);S.flags.komoriVow=1;return '小森さんは深く頭を下げた。\n顔を上げたとき、もう泣いてはいなかった。';}],
       ['「上手くなったら、こっちから頼む」',()=>{trust('komori',7);skUp('komori',1);return '「…はい！ 絶対に頼ませてみせます」\nその言葉どおり、小森さんの勝ち星はその年から目に見えて増えた。';}]]},
 ]},
 nakahara:{parts:[1],ch:[
  {need:45,title:'九条からの手紙',body:()=>`中原牧場の事務所の机に、九条グループの封筒が置いてあった。\n\n「牧場を買いたいそうだ。…もう五回目になる」\n\n中原さんはその封筒を、読みもせずに引き出しにしまった。「若い頃からの付き合いでな。あいつは昔、うちの馬に一目惚れして、わしが売らなかった」`,
   ch:[['「売らないでください」',()=>{trust('nakahara',8);relAdd('nakahara','kujo',-8);return '「売らんよ。…売るもんか」\n中原さんは窓の外の放牧地を見た。仔馬が一頭、母馬のまわりを跳ね回っていた。';}],
       ['「九条さんとは、一度話してみては」',()=>{trust('nakahara',3);relAdd('nakahara','kujo',10);return '「…あんたまで、そう言うか」\n中原さんは渋い顔をしたが、数か月後、二人がセリの会場で短く言葉を交わしているのを見た者がいたらしい。';}]]},
  {need:65,title:'老いた繁殖牝馬',body:()=>`夜中に電話が鳴った。中原牧場で一番長生きの繁殖牝馬が、もう立てないのだという。\n\n「あんたに、知らせておきたくてな。…最初にあんたに売った芦毛の、祖母にあたる馬だ」`,
   ch:[['夜通し車を走らせて、立ち会う',()=>{trust('nakahara',12);return '夜明け前、その牝馬は静かに息を引き取った。\n中原さんはずっと首筋を撫でていた。\n「…来てくれて、ありがとうよ」\n中原さんが礼を言うのを、初めて聞いた。';}],
       ['電話で、最後まで話を聞く',()=>{trust('nakahara',7);return '中原さんは一晩中、その牝馬の話をした。\n何頭産んだか。どの仔が一番走ったか。\n明け方、「…すまんな、こんな時間まで」と言って、電話が切れた。';}]]},
  {need:82,title:'澪のこと',body:()=>`「娘がな、東京の会社を辞めて、牧場を継ぐと言うとる」\n\n中原さんは焼酎のグラスを揺らした。\n\n「こんな小さい牧場、継がせたくない。苦労するのが目に見えとる。…けどな、あいつは馬の目を見るのが、わしより上手い」`,
   ch:[['「澪さんに任せてみては」',()=>{trust('nakahara',9);S.flags.mioEarly=1;if(P('mio'))P('mio').trust=Math.min(100,P('mio').trust+10);return '「…あんたが言うなら、そうするか」\n中原さんは窓の外の放牧地を見た。\n「わしが育てた馬を、あいつが見る。…悪くないかもしれんな」';}],
       ['「中原さんが決めればいい」',()=>{trust('nakahara',5);return '「…そうだな」\nその夜、中原さんは珍しく、娘に電話をかけたらしい。';}]]},
 ]},
 washio:{parts:[1],ch:[
  {need:22,title:'右手の痺れ',body:()=>`レース後の検量室。鷲尾さんが、ほんの一瞬、右手を握ったり開いたりしていた。\n\n目が合うと、鷲尾さんは手をポケットに突っ込んだ。\n\n「…見たか。誰にも言うなよ」`,
   ch:[['「言いません」',()=>{trust('washio',10);S.flags.washioHand=1;return '鷲尾さんは何も言わずに背を向けた。\n帰り際、肩越しに一言だけ。\n「…借りにしとく」';}],
       ['「医者に診せたほうがいい」',()=>{trust('washio',3);return '「余計なお世話だ」\n鷲尾さんはそう言って出ていった。\nただ、翌月、鷲尾さんが整形外科から出てくるのを見たという噂が流れた。';}]]},
  {need:45,title:'戸川の恩',body:()=>`焼き鳥屋のカウンターで、鷲尾さんが珍しく昔話をした。\n\n「俺を最初に乗せたのは、戸川のおやじだ。誰も乗せたがらねえガキだった俺をな」\n\n「…もう何年も、まともに口きいてねえ。勝つようになってから、なんとなくな」`,
   ch:[['「三人で飲みましょう」',()=>{trust('washio',5);trust('togawa',4);relAdd('togawa','washio',20);return '戸川先生は最初、「酒は飲まん」と言った。\nそれでも結局、三人で焼き鳥屋のカウンターに並んだ。\n二人はほとんど喋らなかった。でも、帰り際、戸川先生が鷲尾さんの肩を一度だけ叩いた。';}],
       ['「今度、戸川厩舎の馬に乗ってやってくれ」',()=>{trust('washio',6);relAdd('togawa','washio',10);return '「…考えとく」\nその月、戸川厩舎の調教欄に、久しぶりに鷲尾の名前があった。';}]]},
 ]},
 sanada:{parts:[1,2],ch:[
  {need:20,title:'珈琲一杯',body:()=>`調教スタンドの片隅で、真田さんが自分で淹れた珈琲を飲んでいた。\n\n「…どうぞ」\n\nカップを差し出された。リーディングジョッキーは、思っていたより静かな人だった。\n\n「勝つ馬に乗る。それだけです。期待されるのは、あまり得意ではないので」`,
   ch:[['黙って珈琲を味わう',()=>{trust('sanada',7);return 'しばらく二人で、朝の馬場を見ていた。\n「…珈琲の味がわかる人は、馬の調子もわかる」\n真田さんが、少しだけ笑った気がした。';}],
       ['「いつか、うちの馬にも乗ってほしい」',()=>{trust('sanada',4);return '「…勝てる馬なら」\n真田さんはそれだけ言って、カップを片付けた。\n断られた気は、しなかった。';}]]},
  {need:40,title:'落ちてばかりの少年',body:()=>`「子どもの頃、乗馬クラブで落ちてばかりいたんです」\n\n真田さんは、意外なことを言った。\n\n「天才だと言われるのは、落ちた数を誰も知らないからです。…鷲尾さんは、それを知っている数少ない人です。だから、あの人には負けたくない」`,
   ch:[['「鷲尾さんも、同じことを言っていた」',()=>{trust('sanada',6);relAdd('washio','sanada',12);return '「…そうですか」\n真田さんは窓の外を見た。\n「あの人に、そう言われるなら、悪くない」';}],
       ['「二人の勝負を、ずっと見ていたい」',()=>{trust('sanada',5);skUp('sanada',.5);return '「では、見ていてください。…次の大きいところで」\n真田さんの声に、はじめて熱がこもっていた。';}]]},
  {need:65,title:'主戦の重さ',body:()=>`「九条さんの馬に乗り続けるのは、正直、重いです」\n\n真田さんは珈琲カップを両手で包んだ。\n\n「勝って当然。負ければ僕のせい。…一度でいいから、勝っても負けても、“ありがとう”と言われる馬に乗ってみたい」`,
   ch:[['「うちの馬に乗ってくれ。結果は問わない」',()=>{trust('sanada',10);const j=JK('sanada');if(j)j.need=Math.max(20,j.need-15);relAdd('kujo','sanada',-10);return '真田さんは長い間、黙っていた。\n「…ずるい誘い方ですね」\nそう言って、はじめて声を出して笑った。\n（真田への騎乗依頼が通りやすくなった）';}],
       ['「九条さんも、本当は感謝しているはずだ」',()=>{trust('sanada',5);relAdd('kujo','sanada',10);return '「…そうだといいんですけど」\n数週間後、九条さんが真田さんの誕生日に珈琲豆を贈ったという噂を聞いた。';}]]},
 ]},
};
function arcState(id){S.arc=S.arc||{};return S.arc[id]||0;}
function nextArc(id){const a=ARCS[id];if(!a||!a.parts.includes(S.part))return null;const n=arcState(id);return a.ch[n]?{n,c:a.ch[n]}:null;}
EV.arc={r:d=>{const a=ARCS[d.id];const c=a&&a.ch[d.n];if(!c)return null;d.body=d.body||c.body();
  return{p:d.id,from:`${who(d.id)}の物語　第${'一二三'[d.n]}話`,title:c.title,body:d.body,ch:c.ch.map(x=>x[0])};},
  f:(d,i)=>{const c=ARCS[d.id].ch[d.n];S.arc=S.arc||{};S.arc[d.id]=d.n+1;S.flags.arcT=S.t;const out=c.ch[i][1]();
    (S.arcLog=S.arcLog||{})[d.id]=[...((S.arcLog||{})[d.id]||[]),{n:d.n,pick:c.ch[i][0].replace(/[「」]/g,'')}];return out;}};
function arcTrigger(){
  if(S.inbox.some(e=>e.type==='arc'))return;
  if(S.flags.arcT!=null&&S.t-S.flags.arcT<3)return;
  const ready=Object.keys(ARCS).filter(id=>P(id)&&P(id).met).map(id=>({id,x:nextArc(id)})).filter(o=>o.x&&P(o.id).trust>=o.x.c.need);
  if(!ready.length)return;
  ready.sort((a,b)=>(P(b.id).trust-b.x.c.need)-(P(a.id).trust-a.x.c.need));
  pushEv('arc',{id:ready[0].id,n:ready[0].x.n});
}

/* ---------- 噂: how the others are getting on, by phone ---------- */
const GOSSIP={
 'hayase|togawa':[['調教師会で、早瀬さんと戸川先生が並んで座っていたそうです。昔話で盛り上がっていたとか。',8],['早瀬さんが戸川先生の坂路の使い方を「古い」と言ったらしく、ちょっとした騒ぎになっています。',-10]],
 'hayase|kiryu':[['早瀬厩舎の忘年会、桐生さんが幹事だったそうです。早瀬さんが一番はしゃいでいたとか。',6],['桐生さんが騎乗のことで早瀬さんと言い合いになったと聞きました。すぐに収まったそうですが。',-8]],
 'hinata|washio':[['鷲尾さんが、日向くんの騎乗について「悪くねえ」と言ったそうです。日向くん、三日くらい浮かれていました。',10],['日向くんが鷲尾さんに騎乗のことで質問して、「自分で考えろ」と一喝されたそうです。',-6]],
 'sanada|washio':[['先週のレース、鷲尾さんと真田さんが直線で競り合って、検量室でも睨み合っていたそうです。',-8],['真田さんが、鷲尾さんの落馬のとき、真っ先に駆け寄っていたそうです。誰にも言わないでくれ、と言っていたとか。',10]],
 'togawa|washio':[['鷲尾さんが久しぶりに戸川厩舎の朝の調教に顔を出したそうです。',10],['戸川先生が、鷲尾さんの強引な騎乗を新聞で苦言を呈していました。',-8]],
 'hinata|kiryu':[['日向くんと桐生さん、同期会で飲み比べをして、二人ともつぶれたそうです。',8],['日向くんが桐生さんの進路を締めたとかで、レース後にちょっと揉めたそうです。',-10]],
 'kido|komori':[['城戸さんが小森さんに、自分の古い鞭を譲ったそうです。',10],['小森さんが城戸さんの乗る予定だった馬に乗り替わることになって、少し気まずいようです。',-8]],
 'kido|oba':[['城戸さんと大庭さん、また朝まで飲んでいたそうです。翌日の調教は二人とも顔色が悪かったとか。',6],['大庭さんの逃げ馬に城戸さんが絡んで、大庭さんがレース後に怒鳴っていたそうです。',-8]],
 'dubois|rossi':[['ロッシ騎手とデュボワ騎手、空港で鉢合わせして、なぜか二人でワインを飲みに行ったそうです。',10],['ロッシ騎手が、デュボワ騎手の重馬場の騎乗を「ただの運」と言って、記者の前で言い合いになりました。',-10]],
 'kujo|nakahara':[['九条さんが、また中原牧場に買収の話を持ちかけたそうです。中原さん、門前払いだったとか。',-8],['セリの会場で、九条さんが中原さんに頭を下げているのを見た人がいるそうです。何があったんでしょう。',12]],
 'kuroiwa|nakahara':[['黒岩騎手が、夏の開催の合間に中原牧場の手伝いに行っていたそうです。',8]],
 'kujo|sanada':[['九条さんが、真田さんの負けたレースのあと、記者の前で厳しいことを言ったそうです。',-10],['九条さんが真田さんのために、特別に珈琲豆を取り寄せたそうです。',8]],
 'arai|oba':[['大庭さんと新井さん、ダートの重賞でハナを奪い合って、二頭ともバテたそうです。',-8],['新井さんが、大庭さんの逃げを「あれは芸術や」と褒めていたそうです。大庭さんは照れていたとか。',10]],
 'mikuni|togawa':[['戸川先生が、三國さんの仕事ぶりを珍しく褒めていたそうです。三國さんは「たまたまです」と言っていましたが。',6]],
};
MAILS.gossip={w:()=>Object.keys(GOSSIP).some(k=>k.split('|').every(id=>P(id)&&P(id).met))?.6:0,
  mk:d=>{if(!d.k){const ks=Object.keys(GOSSIP).filter(k=>k.split('|').every(id=>P(id)&&P(id).met));if(!ks.length)return null;d.k=pick(ks);const L=GOSSIP[d.k];
      const v=RS()[d.k]??0;const pool=L.filter(g=>(v<-20?g[1]<0||R()<.3:v>40?g[1]>0||R()<.3:true));const g=pick(pool.length?pool:L);d.txt=g[0];d.dv=g[1];relAdd(...d.k.split('|'),d.dv);}
    const [a,b]=d.k.split('|');const neg=d.dv<0;
    return{from:'mikuni',subj:`噂話：${who(a).split(' ')[0]}さんと${who(b).split(' ')[0]}さん`,body:`${d.txt}\n\n（${who(a)}と${who(b)}の関係：${relWord(RS()[d.k])}）\n\n三國`,
      r:neg?[['二人の間に入って話を聞く',()=>{relAdd(a,b,12);if(R()<.7){trust(a,2);trust(b,2);return '両方の話を聞いた。どちらも、言い過ぎたと思っていたらしい。少しだけ空気がやわらいだ。';}return '両方の話を聞いた。すぐには元どおりとはいかないが、少なくとも、こじれずには済んだ。';}],['そっとしておく',()=>{trust('mikuni',1);return '「それがいいと思います。時間が解決することもありますから」';}]]
        :[['「いい話だ」と返す',()=>{trust('mikuni',1);return '「ですよね。こういう話を聞くと、少しほっとします」';}],['二人を食事に誘う（10万円）',()=>{S.money-=10;relAdd(a,b,8);trust(a,3);trust(b,3);return '三人で食事をした。二人とも、いつもより口数が多かった。';}]]};}};

/* ---------- monthly hook ---------- */
storyTriggers=(o=>function(first){const r=o.apply(this,arguments);if(!first){try{RS();arcTrigger();}catch(e){console.error(e);}}return r;})(storyTriggers);

/* ---------- 相関図 ---------- */
function corrSVG(){
  const ORD=['mikuni','togawa','koyanagi','hayase','kiryu','hinata','washio','sanada','amagi','kujo','rei','nakahara','mio','kuroiwa','arai','oba','kido','komori','rossi','dubois'];
  const ids=peopleList().filter(id=>P(id)).sort((a,b)=>(ORD.indexOf(a)+99)%118-(ORD.indexOf(b)+99)%118);const met=ids.filter(id=>P(id).met);
  const W=360,H=360,cx=W/2,cy=H/2,Rr=138;const pos={};
  ids.forEach((id,i)=>{const a=-Math.PI/2+i/ids.length*Math.PI*2;pos[id]=[cx+Math.cos(a)*Rr,cy+Math.sin(a)*Rr];});
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="人物相関図">`;
  // NPC ↔ NPC ties (only between people you know)
  RELS0.filter(r=>pos[r.a]&&pos[r.b]&&P(r.a).met&&P(r.b).met).forEach(r=>{const v=RS()[relKey(r.a,r.b)];const [x1,y1]=pos[r.a],[x2,y2]=pos[r.b];const ox=(x1+x2)/2,oy=(y1+y2)/2,mx=ox+(cx-ox)*.18,my=oy+(cy-oy)*.18;
    s+=`<path d="M${x1} ${y1}Q${(mx*2-(x1+x2)/2).toFixed(1)} ${(my*2-(y1+y2)/2).toFixed(1)} ${x2} ${y2}" fill="none" stroke="${relCol(v)}" stroke-width="1.6" stroke-dasharray="${v<=-20?'4 3':'0'}" opacity=".85"/>`;
    s+=`<text x="${mx.toFixed(1)}" y="${(my+3).toFixed(1)}" font-size="8.5" text-anchor="middle" fill="${relCol(v)}" paint-order="stroke" style="stroke:var(--panel,#fff);stroke-width:3px">${esc(r.k)}</text>`;});
  // you ↔ them
  met.forEach(id=>{const [x,y]=pos[id],t=P(id).trust;s+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${t>=60?'#d4a017':t>=30?'#7aa6c2':'#c9ccd1'}" stroke-width="${(1+t/22).toFixed(1)}" opacity=".55"/>`;});
  s+=`<circle cx="${cx}" cy="${cy}" r="26" fill="${S.silks.a}" stroke="${S.silks.b}" stroke-width="4"/><text x="${cx}" y="${cy+4}" font-size="11" font-weight="700" text-anchor="middle" fill="#fff" paint-order="stroke" stroke="rgba(0,0,0,.45)" stroke-width="2">あなた</text>`;
  ids.forEach(id=>{const [x,y]=pos[id],p=P(id),m=p.met,nx=nextArc(id),ready=m&&nx&&p.trust>=nx.c.need;
    s+=`<g data-act="nbOpen" data-id="${id}" style="cursor:pointer">${m&&typeof faceSVG==='function'&&FACES[faceKey(id)]?`<svg x="${x-17}" y="${y-17}" width="34" height="34" viewBox="0 0 100 100"><clipPath id="cc${id}"><circle cx="50" cy="50" r="50"/></clipPath><g clip-path="url(#cc${id})">${faceSVG(faceKey(id),shade(p.col,.55))}</g></svg><circle cx="${x}" cy="${y}" r="17" fill="none" stroke="#fff" stroke-width="2"/>`:`<circle cx="${x}" cy="${y}" r="17" fill="${m?p.col:'#c9ccd1'}" stroke="#fff" stroke-width="2"/><text x="${x}" y="${y+5}" font-size="14" font-weight="700" text-anchor="middle" fill="#fff">${m?esc(p.ini):'？'}</text>`}
      <text x="${x}" y="${y+30}" font-size="9.5" text-anchor="middle" fill="currentColor" opacity="${m?.9:.45}">${m?esc(p.n.split(' ')[0]):'未対面'}</text>${m?`<text x="${x}" y="${y+40}" font-size="8.5" text-anchor="middle" fill="currentColor" opacity=".6">信頼${Math.round(p.trust)}</text>`:''}
      ${ready?`<circle cx="${x+13}" cy="${y-13}" r="5" fill="#ff3b30"/>`:''}</g>`;});
  return s+'</svg>';}
vPeople=(o=>function(){const base=o.apply(this,arguments);
  const corr=`<section class="sec"><h2>相関図<small>人をタップすると手帳が開く。赤い点は物語の続きが近い人</small></h2><div class="panel corr">${corrSVG()}
    <div class="lg"><span><i style="background:#2a9d5c"></i>良好</span><span><i style="background:#8a8f98"></i>微妙</span><span><i style="background:#d0453a"></i>険悪</span><span><i style="background:#d4a017"></i>あなたと深い信頼</span></div></div></section>`;
  // add a 手帳 button to every person card
  const withNb=base.replace(/<button class="btn sm" data-act="meet" data-id="([a-z0-9_]+)"/g,'<button class="btn sm nbbtn" data-act="nbOpen" data-id="$1">手帳</button><button class="btn sm" data-act="meet" data-id="$1"');
  return corr+withNb;})(vPeople);

/* ---------- 人物手帳 ---------- */
function mName(t){return `${Y(t)}年${M(t)}月`;}
ACT.nbOpen=d=>{const id=d.id,p=P(id);if(!p)return;
  if(!p.met){openModal(`<div class="evhead"><span class="av unk" style="width:56px;height:56px;font-size:24px">？</span><div><div class="from-line">${esc(p.role)}</div><h2>${esc(p.n)}</h2></div></div><div class="letter">まだ会ったことがない。</div><div class="row"><span class="sp"></span><button class="btn pri" data-act="nbClose">閉じる</button></div>`);return;}
  const pr=PROF[id]||{},t=p.trust,gp=GIFT_PREF[id];
  const row=(k,v,need)=>`<dt>${k}</dt><dd>${t>=need?esc(v):`<span class="muted">信頼${need}で分かる</span>`}</dd>`;
  const prof=`<dl class="nb-prof">${id==='mikuni'&&typeof SECS!=='undefined'?`<dt>得意</dt><dd>${esc(SECS[S.sec||'mikuni'].perk)}</dd>`:''}${pr.age?row('年齢',`${pr.age+Math.max(0,yearNo()-1)}歳`,0):''}${pr.from?row('出身',pr.from,0):''}${pr.trait?row('人となり',pr.trait,15):''}${pr.hobby?row('好きなこと',pr.hobby,30):''}${gp?row('喜ぶ手土産',gp.like.join('・')||'特になし',40):''}${gp&&gp.bad.length?row('苦手なもの',gp.bad.join('・'),55):''}${pr.secret?row('秘密',pr.secret,75):''}</dl>`;
  const A=ARCS[id];let arc='';
  if(A&&A.parts.includes(S.part)){const n=arcState(id),lg=(S.arcLog||{})[id]||[];
    arc=`<div class="nb-sec"><h3>${esc(p.n.split(' ')[0])}の物語</h3><div class="nb-arc">${A.ch.map((c,i)=>i<n?`<div class="ch"><b>第${'一二三'[i]}話</b><span>${esc(c.title)}　<span class="muted">― ${esc((lg.find(x=>x.n===i)||{}).pick||'')}</span></span></div>`
      :i===n?`<div class="ch ${t>=c.need?'':'lock'}"><b>第${'一二三'[i]}話</b><span>${t>=c.need?'もうすぐ…（月初に届く）':`信頼 ${c.need} で続きが見られる`}</span></div>`:`<div class="ch lock"><b>第${'一二三'[i]}話</b><span>？？？</span></div>`).join('')}</div></div>`;}
  const rels=relsOf(id).filter(x=>!x.p2||S.part===2);
  const rel=rels.length?`<div class="nb-sec"><h3>まわりの人との関係</h3><div class="nb-rel">${rels.map(x=>{const q=P(x.o);const known=q.met;return `<div class="r">${known?avatar(x.o,26):'<span class="av unk" style="width:26px;height:26px;font-size:11px">？</span>'}<span style="flex:1;min-width:0">${known?esc(q.n):'（まだ知らない人）'}<br><span class="muted" style="font-size:11px">${known||t>=40?esc(x.note):'…'}</span></span><span class="k" style="background:${relCol(x.v)}">${esc(x.k)}・${relWord(x.v)}</span></div>`;}).join('')}</div></div>`:'';
  const L=(S.tlog||{})[id]||[];
  const log=`<div class="nb-sec"><h3>信頼の記録</h3>${L.length?`<div class="nb-log">${L.map(e=>`<div class="l"><span class="m">${mName(e.t)}</span><span class="d ${e.d>0?'u':'n'}">${e.d>0?'+':''}${Math.round(e.d)}</span><span>${esc(e.w)}</span></div>`).join('')}</div>`:'<div class="muted" style="font-size:12px">まだ記録はない。</div>'}</div>`;
  openModal(`<div class="talkhead">${avatar(id,96)}<div><div class="from-line">${esc(p.role)}</div><h2>${esc(p.n)}</h2><div class="row" style="gap:6px"><span class="muted" style="font-size:12px">信頼</span>${trustBar(t)}<span class="num">${Math.round(t)}</span></div></div></div>
    <div class="nb-sec">${prof}</div>${arc}${rel}${log}
    <div class="row" style="margin-top:12px"><span class="muted" style="font-size:12px">${esc(canMeet(id)||'今月会いに行ける')}</span><span class="sp"></span><button class="btn" data-act="nbClose">閉じる</button>${canMeet(id)?'':`<button class="btn pri" data-act="nbMeet" data-id="${id}">会いに行く</button>`}</div>`);};
ACT.nbClose=()=>{closeModal();render();};
ACT.nbMeet=d=>{closeModal();ACT.meet(d);};
