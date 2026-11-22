/* =========================================================
   イベントの「使い回し感」をなくす:
   (1) 頻度 — 同じ種類の知らせは間をあける。一度きりのものは本当に一度きり
   (2) 文面 — 出産・入厩・牧場の写真・厩舎だより・セール・庭先・ファンの手紙などに書き出しや場面の違いを増やす
       （どの文面になるかは馬や年で決まるので、同じ知らせを開き直しても文面は変わらない）
   ========================================================= */
const vpk=(seed,arr)=>arr[Math.floor(hash(String(seed))*arr.length)%arr.length];
/* ---- (1) frequency ---- */
const MCAP={oldLetter:[999,1],horseName:[24,3],spam:[24,0],magazine:[12,0],photo:[3,0],trNote:[3,0],gossip:[4,0],farmLetter:[4,0],owners:[4,0],mikuniTip:[6,0],jkNote:[3,0],report:[3,0],fan:[4,0]};
Object.entries(MCAP).forEach(([k,[gap,max]])=>{const m=MAILS[k];if(!m)return;const w=m.w;m.w=()=>{const x=w();if(!x)return 0;const T=(S.flags.mT||{})[k],N=(S.flags.mN||{})[k]||0;if(max&&N>=max)return 0;if(T!=null&&S.t-T<gap)return 0;return x;};});
sendMail=(o=>function(type,d,quiet){try{S.flags.mT=S.flags.mT||{};S.flags.mN=S.flags.mN||{};
    /* 日向の「今日はすみません」は3か月に1度まで（勝った日の報告はいつでも） */
    if(type==='hinataLine'&&!(d&&d.pos===1)&&S.flags.mT.hinataLine!=null&&S.t-S.flags.mT.hinataLine<3)return;
    S.flags.mT[type]=S.t;S.flags.mN[type]=(S.flags.mN[type]||0)+1;
    /* 毎月の予定メールは、通知を出さずに届くだけにする */
    if(type==='plan')return o.call(this,type,d,true);}catch(e){}return o.apply(this,arguments);})(sendMail);
capEv('niwasaki',12,'nwT');capEv('fanLetter',6,'flT');
/* ---- (2) wording ---- */
const season=()=>{const m=M(S.t);return m<=2||m===12?'w':m<=5?'sp':m<=8?'su':'au';};
if(EV.birth){const b0=EV.birth;EV.birth={...b0,r:d=>{const v=b0.r(d);if(!v)return v;const h=HZ(d.hid);if(!h)return v;const s=h.id,dam=h.damName;
  const open=vpk(s+'o',[`夜中の二時に、${dam}が産気づいた。`,`明け方の四時、${dam}が横になった。外はまだ雪が残っとった。`,`昼すぎに、${dam}がそわそわしだしてな。放牧地から戻したら、すぐだった。`,`雨の夜だった。${dam}は静かに横になって、あっという間に産んだ。`,`夕方の飼い葉のあと、${dam}が産気づいた。かみさんと二人で見守った。`,`満月の夜に、${dam}が産気づいた。厩舎の窓から、月がよう見えた。`,`朝の見回りに行ったら、もう生まれとった。${dam}が、得意げな顔でこっちを見とった。`]);
  const up=vpk(s+'u',['三十分で立ち上がって、もう乳を探しとる。','一時間かかって立ち上がった。脚はしっかりしとる。','生まれてすぐ首を上げて、こっちを見た。','何度も転んだが、自分の力で立った。負けん気が強い。','立ち上がるなり、母親の後ろをついて歩いとる。','立つのは遅かったが、乳を飲む勢いはすごい。']);
  const end=vpk(s+'e',['会いに来てやってくれ。','暇ができたら、顔を見に来てくれ。','春のうちに一度、見に来るといい。','名前、考えといてくれよ。']);
  return {...v,body:v.body.replace(`夜中の二時に、${dam}が産気づいた。`,open).replace('三十分で立ち上がって、もう乳を探しとる。',up).replace('会いに来てやってくれ。',end)};}};}
if(EV.nyukyu){const n0=EV.nyukyu;EV.nyukyu={...n0,r:d=>{const v=n0.r(d);if(!v)return v;const h=HZ(d.hid);if(!h)return v;
  const o=vpk(h.id+'nk',[`${h.name}が2歳になり、トレセンに入る時期です。`,`${h.name}の育成が終わりました。いよいよトレセン入りです。`,`育成牧場から「${h.name}に、もう教えることはありません」と連絡がありました。入厩先を決めましょう。`,`${h.name}、ゲート練習も終えて、入厩の準備が整ったそうです。`,`${h.name}を見た育成の担当者が「早く走らせてみたい」と言っていました。入厩の時期です。`]);
  return {...v,body:v.body.replace(`${h.name}が2歳になり、トレセンに入る時期です。`,o)};}};}
if(MAILS.photo){const p0=MAILS.photo.mk;MAILS.photo.mk=d=>{const m=p0(d);if(!m)return m;const h=HZ(m.hid);if(!h)return m;const sd=h.id+'|'+S.t;
  const lead={w:[`雪の中の${h.name}だ。寒さには強いらしい。`,`${h.name}の写真だ。吐く息が白い。`],sp:[`新緑の放牧地で撮った。${h.name}だ。`,`${h.name}、このひと月でまた大きくなった。写真を送る。`],su:[`夏草の中の${h.name}だ。日陰を見つけるのがうまい。`,`${h.name}の写真だ。夕方の涼しい時間に撮った。`],au:[`${h.name}の写真だ。冬毛が生えてきた。`,`夕焼けの放牧地で撮った。${h.name}だ。逆光ですまん。`]}[season()];
  const wild=['気が強くて、わしの帽子をまた取られた。','隣の仔にちょっかいを出して、蹴り返されとった。','寝わらを全部ひっくり返す。手がかかる。','柵を噛むくせがある。歯がかゆいんだろう。'];
  const kind=['人懐っこい。誰に似たんだか。','呼ぶと走ってくる。','ほかの仔の面倒を見とる。大人びたやつだ。','人の後ろをずっとついてくる。仕事にならん。'];
  m.body=m.body.replace(`写真を送る。${h.name}だ。`,vpk(sd+'l',[`写真を送る。${h.name}だ。`,...lead])).replace('気が強くて、わしの帽子をまた取られた。',vpk(sd+'t',wild)).replace('人懐っこい。誰に似たんだか。',vpk(sd+'t',kind));return m;};}
if(EV.stableNews){const s0=EV.stableNews;EV.stableNews={...s0,r:d=>{const v=s0.r(d);if(!v)return v;const h=HZ(d.hid);if(!h||d.k===1)return v;
  if(hash(h.id+'sn'+S.t)<.5)return v;
  const tx=vpk(h.id+'|'+S.t,[`「${h.name}の馬房の前に、厩務員さんが手作りの名札をかけてくれました」`,`「${h.name}、雨の日の調教が好きみたいで、ご機嫌でした」`,`「${h.name}、坂路の帰りに、ほかの馬に道を譲ってました。紳士ですよ」`,`「${h.name}の飼い葉、最近は残さず食べるようになりました」`,`「${h.name}、ゲート練習で一度も嫌がりませんでした」`,`「${h.name}が昼寝してるとき、いびきが聞こえるんです」`,`「${h.name}、プールで泳ぐのが下手で…でも楽しそうでした」`,`「${h.name}、厩舎の猫と仲良くなりました。毎朝、馬房の前で待ってます」`,`「${h.name}の蹄、装蹄師さんが『いい形だ』って褒めてました」`,`「${h.name}、カメラを向けると耳を立てるんです。撮られ慣れてますね」`,`「${h.name}、冬毛でもこもこです」`,`「${h.name}、併せ馬で相手を見ると燃えるタイプです」`]);
  return {...v,body:tx};}};}
if(EV.mareSale){const m0=EV.mareSale;EV.mareSale={...m0,r:d=>{const v=m0.r(d);if(!v)return v;return {...v,body:v.body.replace('年末の繁殖牝馬セールのカタログです。気になる馬を三頭、選んでおきました。',vpk(Y(S.t)+'ms',['年末の繁殖牝馬セールのカタログです。気になる馬を三頭、選んでおきました。','繁殖牝馬セールの季節です。中原さんとも相談して、三頭に絞りました。','今年の繁殖牝馬セール、目を引く馬がいます。候補の三頭です。','セールのカタログ、付箋だらけになってしまいました。最後に残った三頭です。','繁殖牝馬セールです。今年は良血の引退馬が多く出ています。三頭、挙げておきます。']))};}};}
if(EV.niwasaki){const w0=EV.niwasaki;EV.niwasaki={...w0,r:d=>{const v=w0.r(d);if(!v)return v;const sd=(d.sid||'')+Y(S.t);
  return {...v,body:v.body.replace('日高の知り合いの牧場が',vpk(sd+'a',['日高の知り合いの牧場が','浦河の古い友人の牧場が','新冠の小さな牧場が','静内の顔なじみの牧場が','門別の若い牧場主が'])).replace('セリに出す前の話だ。',vpk(sd+'b',['セリに出す前の話だ。','跡継ぎがいなくて、馬を減らしとるそうだ。','セリに出すと値がつかんかもしれんと心配しとる。','見立てを信じてくれる人に譲りたい、と言っとる。','牧場の改装で金が要るらしい。']))};}};}
if(MAILS.horseName){const h0=MAILS.horseName.mk;MAILS.horseName.mk=d=>{const m=h0(d);if(!m)return m;const sd=(m.hid||0)+'|'+S.t;
  m.body=m.body.replace('ぼくは小学3年生です。',vpk(sd,['ぼくは小学3年生です。','わたしは小学1年生です。','ぼくは小学5年生です。','わたしは小学4年生です。おとうさんと けいばを みています。','ぼくは小学2年生です。うまが だいすきです。']));m.fromName=vpk(sd+'f',['ファンの小学生','ちいさなファン','ファンの子ども']);return m;};}
if(MAILS.spam){const sp0=MAILS.spam.mk;MAILS.spam.mk=d=>{const m=sp0(d);const k=vpk(S.t+'sp',[0,1,2,3]);if(k===0)return m;
  const V2=[null,{fromName:'馬主様専用 投資クラブ',subj:'【極秘】年利300%の競走馬ファンド',body:'選ばれた馬主様だけにご案内しております。\n\n必ず勝つ馬に投資する、年利300%のファンドです。元本保証！\n\n今週中のお申し込みで、手数料無料。\n\n※本メールは送信専用です'},
    {fromName:'JRA…ではない事務局',subj:'【至急】馬主登録の更新手続きのお願い',body:'お客様の馬主登録の有効期限が迫っています。\n\n下記URLからカード情報を入力し、更新手続きを完了してください。\n\nhttps://bannushi-koushin.example\n\n※三國から「絶対に開かないでください」と付箋がついていた'},
    {fromName:'幸運の蹄鉄 販売センター',subj:'これを持つだけで勝つ！ 幸運の蹄鉄（限定3個）',body:'有名G1馬が実際に履いていた（かもしれない）蹄鉄を、特別価格29,800円でお譲りします！\n\n持つだけで勝率アップ！\n\n※効果には個人差があります'}];
  return {...m,...V2[k]};};}
if(MAILS.magazine){const g0=MAILS.magazine.mk;MAILS.magazine.mk=d=>{const m=g0(d);if(!m)return m;const nm=vpk(Y(S.t)+'mg',['月刊ターフ','季刊サラブレッドライフ','競馬の友','ホースマン通信']);if(nm==='月刊ターフ')return m;
  return {...m,fromName:`${nm} 編集部`,body:m.body.split('月刊ターフ').join(nm)};};}
