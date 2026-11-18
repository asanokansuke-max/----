/* =========================================================
   秘書を選ぶ: four candidates at the start. The secretary keeps the story slot 'mikuni'
   (so every event still works) but has their own name, look, background, perk,
   gift taste, personal story and memories of your father. Story text that says
   「三國」 is rewritten to the chosen secretary's name on the way to the screen.
   ========================================================= */
const SECS={
 mikuni:{n:'三國 透',sn:'三國',ini:'三',col:'#3d5a80',role:'秘書・レーシングマネージャー',bg:'元厩務員',perk:'馬の体調管理：毎月、現役馬の疲れが少し抜ける',
   pitch:'「馬のそばにいたかったんです。体調のことなら任せてください」'},
 shiraishi:{n:'白石 あかり',sn:'白石',ini:'白',col:'#c0566e',role:'秘書・広報担当',bg:'元競馬記者',perk:'情報網：馬主の格が上がりやすく、噂話がよく届く',
   pitch:'「記者席から十年、競馬を見てきました。人の噂なら任せてください」',
   prof:{age:29,from:'東京・浅草',trait:'早口で好奇心旺盛。メモ魔',hobby:'古い競馬新聞を集めること',secret:'記者時代、ある馬主の疑惑を記事にして、会社に居場所をなくした'},
   gift:{like:['珈琲豆','洋菓子'],bad:['日本酒']},
   self:'「記者だった頃、毎週末スタンドの記者席にいました。\n勝った馬より、負けた馬の厩舎のほうが、記事になる話が多いんです。…だから負けた日こそ、そばにいたいんですよ」',
   father:f=>[`「記事にできない人でした」`,`「${f}さんは、記者の私に一度も“書くな”と言わなかった人です」`,`「${f}さんが言ったんです。“負けた日のことも書いてくれ。それも、うちの歴史だ”って」`]},
 sakaki:{n:'榊 源一郎',sn:'榊',ini:'榊',col:'#6b5b3e',role:'秘書・馬事顧問',bg:'元・大牧場の番頭',perk:'相馬眼：セリで落札すると、値切り交渉で1割が戻る',
   pitch:'「四十年、馬を見てまいりました。高い買い物はさせません」',
   prof:{age:61,from:'北海道・静内',trait:'穏やかだが頑固。歩き方で馬を見る',hobby:'早朝の散歩と俳句',secret:'若い頃に見出した馬を、牧場の都合で手放した。その馬は後に大レースを勝った'},
   gift:{like:['日本酒','和菓子'],bad:['ワイン']},
   self:'「四十年、牧場で馬を見てまいりました。\n…人を見るほうは、まだまだでございますが」',
   father:f=>[`「立派な方でした」`,`「${f}さんは、馬を見る前に、まず牧場の人に頭を下げる方でした」`,`「${f}さんは“あんたの目を信じる”とだけ言って、大きなセリに私一人を行かせてくださった。…あの日の手の震えは、忘れません」`]},
 sakuraba:{n:'桜庭 ミナ',sn:'桜庭',ini:'桜',col:'#2a7f62',role:'秘書・経理担当',bg:'元銀行の融資担当',perk:'経費管理：毎月の預託料などの経費が1割安くなる',
   pitch:'「お金のことは私に。勝負どころで使えるように、普段は締めます」',
   prof:{age:26,from:'大阪・北浜',trait:'数字に厳しい。たまに関西弁が出る',hobby:'家計簿アプリと筋トレ',secret:'実家の小さな町工場を、銀行員として救えなかった'},
   gift:{like:['果物','高級肉'],bad:['焼酎']},
   self:'「銀行では、数字の向こうに人がいるって教わりました。\n…競馬は、数字の向こうに馬がいるんですね。ちょっと、ずるいです」',
   father:f=>[`「お世話になりました」`,`「${f}さんの帳簿、実は全部手書きだったんです。字、きれいでしたよ」`,`「${f}さん、どんな赤字の月でも、厩舎へのお歳暮だけは絶対に削らせなかったんです」`]},
};
function secSub(t){try{if(typeof S==='undefined'||!S||!S.sec||S.sec==='mikuni'||!SECS[S.sec])return t;const sc=SECS[S.sec];return t.indexOf('三國')<0?t:t.replace(/三國 透/g,sc.n).replace(/三國/g,sc.sn);}catch(e){return t;}}
toast=(o=>function(t){return o.call(this,secSub(String(t)));})(toast);

/* personal stories for the other three (三國's own stays as written) */
const SEC_ARCS={
 shiraishi:{parts:[1,2],ch:[
  {need:62,title:'特ダネ',body:()=>`「昔の同僚から電話がありました。うちの馬に故障の噂がある、記事にするかもしれないって」\n\n白石さんは手帳を握りしめていた。\n\n「…デマです。でも、記者が一度“噂がある”と書けば、それだけで傷がつく。私が、一番よく知ってます」`,
   ch:[['「止めなくていい。事実じゃなければ、事実が勝つ」',()=>{trust('mikuni',6);S.fame+=.5;return '記事は結局出なかった。\n後で聞くと、白石さんが元同僚に調教の時計を全部見せたらしい。\n「記者って、数字には弱いんですよ」と白石さんは笑った。';}],
       ['「白石さんの判断に任せる」',()=>{trust('mikuni',8);return '「…任されました」\n翌日、白石さんは朝一番で新聞社に向かった。\n帰ってきたときには、なぜか向こうの記者と飲みに行く約束までしていた。';}]]},
  {need:74,title:'干された理由',body:()=>`遅くまで残っていた白石さんが、ぽつりと話し始めた。\n\n「記者を辞めたの、ある馬主さんの疑惑を記事にしたからなんです。全部本当のことでした。\n\n…でも、会社には居場所がなくなりました。正しいことを書いて、居場所をなくすって、変ですよね」`,
   ch:[['「正しいことをしたんだ」',()=>{trust('mikuni',9);return '「…はい」\n白石さんは少しだけ泣いて、それから「お腹すきました」と言った。\nその夜は、二人で屋台のラーメンを食べた。';}],
       ['「ここでは、言いたいことを言っていい」',()=>{trust('mikuni',7);S.flags.secFrank=1;return '「本当ですか？ じゃあ言いますけど、オーナーの勝負服、もうちょっと派手でもいいと思います」\n…言いたいことを、本当に言う人だった。';}]]},
  {need:88,title:'書きかけの原稿',body:()=>`白石さんの机の引き出しに、色褪せた原稿用紙の束があった。\n\n題は「暮れの中山」。最後の一枚は、白紙のままだった。\n\n「記者の頃に書きかけたんです。…いつか、ちゃんと最後まで書ける日が来たらいいなって」`,
   ch:[['「有馬を勝ったら、その続きを書いてくれ」',()=>{trust('mikuni',10);S.flags.secManuscript=1;return '「…約束ですよ。泣きながら書きますからね」\n白石さんは原稿用紙の束を、そっと引き出しに戻した。';}],
       ['「今の気持ちで、書いてみたらいい」',()=>{trust('mikuni',6);S.fame+=1;return '一週間後、競馬雑誌の小さなコラム欄に、白石さんの文章が載った。\n馬主の名前は書かれていなかった。でも、読めばすぐにわかる文章だった。';}]]},
 ]},
 sakaki:{parts:[1,2],ch:[
  {need:62,title:'朝の放牧地',body:()=>`まだ暗いうちから、榊さんは放牧地の柵にもたれていた。\n\n「お早うございます。…馬は、朝がいちばん正直でございます」\n\n手帳には、短い俳句が一つ書いてあった。「白息の　仔馬の背にも　陽の来たり」`,
   ch:[['一緒に柵にもたれて、馬を見る',()=>{trust('mikuni',7);S.horses.filter(h=>h.owner==='me'&&['当歳','1歳','育成','繁殖'].includes(h.status)).forEach(h=>h.bond=Math.min(100,(h.bond||0)+3));return '一時間、二人とも何も言わなかった。\n帰り際、榊さんが言った。「…いい朝でございました」';}],
       ['「いい句ですね」',()=>{trust('mikuni',5);return '「いや、お恥ずかしい」\n榊さんは手帳を閉じた。耳が少し赤かった。';}]]},
  {need:74,title:'手放した馬',body:()=>`「若い頃、私が見つけた馬がおりました」\n\n榊さんは湯呑みを置いた。\n\n「牧場が苦しくて、セリで売られました。その馬は、何年かして大きなレースを勝った。…テレビで見ておりました。私の手の中には、もう何もなかった」`,
   ch:[['「うちの馬は、最後まで手放さない」',()=>{trust('mikuni',9);S.flags.secKeep=1;return '榊さんは長いこと黙っていた。\n「…その言葉を、四十年待っておりました」';}],
       ['「その目を、うちで使ってほしい」',()=>{trust('mikuni',7);return '「…年寄りの目でよろしければ」\n次のセリの日、榊さんは朝四時から会場の下見に出かけていった。';}]]},
  {need:88,title:'相馬眼',body:()=>`「どうやって馬を見ているのか、とお尋ねでしたな」\n\n榊さんは、放牧地を歩く一頭を指さした。\n\n「目と、歩くときの後脚の踏み込み。それだけでございます。…あとは、四十年分の失敗でございますな」`,
   ch:[['「教えてほしい」',()=>{trust('mikuni',8);S.flags.secEye=1;return 'その日から、セリの下見には二人で行くようになった。\n「…筋は悪くございません」と言われたのは、半年後のことだった。';}],
       ['「榊さんがいてくれれば、十分だ」',()=>{trust('mikuni',10);return '「…もったいないお言葉で」\n榊さんは深く頭を下げた。顔を上げたとき、目尻が少し光っていた。';}]]},
 ]},
 sakuraba:{parts:[1,2],ch:[
  {need:62,title:'赤字の月',body:()=>`夜十一時。事務所の明かりがまだついていた。\n\n桜庭さんが電卓と帳簿を並べて、眉間にしわを寄せている。\n\n「あ、オーナー。…今月、ちょっと赤字なんです。どこ削ったらええかなって。すみません、つい」`,
   ch:[['「無理するな。今日はもう帰ろう」',()=>{trust('mikuni',6);return '「…はい。でも明日の朝いちでやりますからね」\n翌朝、帳簿はきれいに締まっていた。';}],
       ['「どこを削ればいい？ 一緒に見よう」',()=>{trust('mikuni',7);S.money+=50;return '二人で一時間、帳簿を見た。\n使っていない駐車場の契約がひとつ見つかった。\n「…50万、浮きました！」桜庭さんは小さくガッツポーズをした。';}]]},
  {need:74,title:'町工場',body:()=>`「実家、町工場やったんです」\n\n桜庭さんは缶コーヒーを両手で包んだ。\n\n「銀行に入って、最初に担当したのが、うちでした。…融資、通せませんでした。数字が、どうしても足りなくて」`,
   ch:[['「数字で救えるものも、きっとある」',()=>{trust('mikuni',9);return '「…はい。だから、ここでは絶対に数字で負けたくないんです」\n桜庭さんの帳簿の字が、その日から少しだけ大きくなった。';}],
       ['「今度、実家に顔を出してくれ。休みはちゃんと取れ」',()=>{trust('mikuni',7);return '翌月、桜庭さんは三日間の休みを取った。\n戻ってきた彼女の机には、工場で作ったという小さな蹄鉄型の文鎮が置いてあった。';}]]},
  {need:88,title:'勝負のお金',body:()=>`大レースを前に、桜庭さんが分厚い資料を持ってきた。\n\n「…正直に言います。数字だけ見たら、反対です」\n\n「でも、勝負どころでお金を使うのを止めるのは、私の仕事やないと思うんです。私の仕事は、勝負できるお金を残しておくこと。…それだけです」`,
   ch:[['「一緒に夢を見てくれ」',()=>{trust('mikuni',10);return '「…しゃあないですね」\n桜庭さんは資料を閉じて、笑った。\n「その代わり、勝ったら焼肉ですよ。いちばん高いやつ」';}],
       ['「反対してくれる人がいるから、安心して勝負できる」',()=>{trust('mikuni',9);return '桜庭さんは一瞬きょとんとして、それから吹き出した。\n「ずるいなあ。…わかりました。全力で反対しながら、全力で応援します」';}]]},
 ]},
};

/* apply the chosen secretary to the story slot */
const SEC0={prof:PROF.mikuni,gift:GIFT_PREF.mikuni,arcs:ARCS.mikuni,dlg:DLG.mikuni,self:null};
let SEC_APPLIED=null;
function applySec(){if(!S)return;const id=S.sec||'mikuni';if(SEC_APPLIED===id+S.t&&P('mikuni').n===SECS[id].n)return;const sc=SECS[id],p=P('mikuni');
  if(p){p.n=sc.n;p.ini=sc.ini;p.col=sc.col;p.role=sc.role;}
  const self=(TOPICS.mikuni||[]).find(t=>t.id==='self');if(self){if(!SEC0.self)SEC0.self=self.run;self.run=id==='mikuni'?SEC0.self:()=>({text:sc.self,d:8});}
  PROF.mikuni=id==='mikuni'?SEC0.prof:sc.prof;GIFT_PREF.mikuni=id==='mikuni'?SEC0.gift:sc.gift;ARCS.mikuni=id==='mikuni'?SEC0.arcs:SEC_ARCS[id];
  DLG.mikuni=id==='mikuni'?SEC0.dlg:SEC0.dlg.filter(d=>!/担当|厩務員/.test(d.q+JSON.stringify(d.r)));
  const rl=RELS0.find(r=>r.a==='mikuni'&&r.b==='togawa');if(rl){if(!SEC0.rel)SEC0.rel=rl.note;rl.note={mikuni:SEC0.rel,shiraishi:'記者時代、白石は戸川厩舎に何度も取材に通った',sakaki:'牧場時代からの古い付き合い。戸川は榊の目を信用している',sakuraba:'銀行員時代、桜庭が戸川厩舎の融資を担当した'}[id];}
  SEC_APPLIED=id+S.t;}
fatherTalk=(o=>function(id){if(id==='mikuni'&&S.sec&&S.sec!=='mikuni')return SECS[S.sec].father(S.parent.name)[tier(id)];return o.apply(this,arguments);})(fatherTalk);
render=(o=>function(){try{applySec();}catch(e){}return o.apply(this,arguments);})(render);
newGame=(o=>function(f){const r=o.apply(this,arguments);S.sec=START.sec||'mikuni';SEC_APPLIED=null;applySec();return r;})(newGame);

/* perks */
monthlyCost=(o=>function(){const c=o.apply(this,arguments);return S&&S.sec==='sakuraba'?Math.round(c*.9):c;})(monthlyCost);
lotAward=(o=>function(l,w,price){const r=o.apply(this,arguments);if(w==='me'&&S.sec==='sakaki'){const back=Math.round(price*.1);S.money+=back;log(`榊が売り手と交渉し、${yen(back)}を値引きさせた`);setTimeout(()=>toast(`榊さんの交渉で ${yen(back)} 値引き`),600);}return r;})(lotAward);
storyTriggers=(o=>function(first){const r=o.apply(this,arguments);if(!first&&S){if(S.sec==='mikuni'||!S.sec)racing().filter(h=>h.status==='現役').forEach(h=>h.fat=Math.max(0,(h.fat||0)-3));if(S.sec==='shiraishi')S.fame=Math.min(100,S.fame+.3);}return r;})(storyTriggers);
if(MAILS.gossip){const gw=MAILS.gossip.w;MAILS.gossip.w=()=>gw()*(S&&S.sec==='shiraishi'?2:1);}

/* start screen: pick your secretary */
START.sec=START.sec||'mikuni';
(function(){const st=document.createElement('style');st.textContent=`
.secgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.seccard{display:flex;flex-direction:column;gap:4px;text-align:left;border:2px solid var(--line);background:var(--panel);border-radius:12px;padding:10px;color:inherit;font:inherit;cursor:pointer;min-height:44px}
.seccard[aria-pressed="true"]{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 25%,transparent)}
.seccard .h{display:flex;gap:8px;align-items:center}
.seccard b{font-size:15px}
.seccard .bg{font-size:11px;color:var(--muted)}
.seccard .pk{font-size:11.5px;line-height:1.45}
.secpitch{font-size:13px;margin-top:8px;color:var(--ink-soft)}
`;document.head.appendChild(st);})();
function secAvatar(id,s){const c=SECS[id];return `<span class="av" style="width:${s}px;height:${s}px;background:${c.col};font-size:${s*.42}px" aria-hidden="true">${c.ini}</span>`;}
renderStart=(o=>function(){const r=o.apply(this,arguments);const form=document.querySelector('#app .start .panel.form');if(!form)return r;
  const btnRow=[...form.children].find(e=>e.classList.contains('row')&&e.querySelector('[data-act=newGame]'));
  const f=document.createElement('div');f.className='field';
  f.innerHTML=`<label>秘書（あなたを支える右腕。それぞれ得意なことと、物語がある）</label><div class="secgrid">${Object.entries(SECS).map(([id,c])=>`<button class="seccard" data-act="secPick" data-id="${id}" aria-pressed="${START.sec===id}"><span class="h">${secAvatar(id,34)}<span><b>${c.n}</b><br><span class="bg">${c.bg}</span></span></span><span class="pk">${c.perk}</span></button>`).join('')}</div><div class="secpitch">${SECS[START.sec].pitch}</div>`;
  form.insertBefore(f,btnRow||null);return r;})(renderStart);
ACT.secPick=d=>{if(typeof syncStart==='function')syncStart();START.sec=d.id;renderStart();};
if(document.querySelector('#app .start .panel.form'))renderStart();

/* ===== 結果画面を短く: compact payout board, top-5 + your horses with the rest folded away ===== */
(function(){const st=document.createElement('style');st.textContent=`
#sheet .result-banner{padding:8px 10px}
#sheet .result-banner .big{font-size:clamp(24px,7vw,34px);line-height:1.2}
#sheet .payboard{font-size:12px}
#sheet .payboard .pg2{grid-template-columns:1fr 1fr!important}
#sheet .payboard .pr{grid-template-columns:3.3em 1fr auto;min-height:20px}
#sheet .payboard .pc{padding:0 4px}
#sheet .payboard .pv{padding:0 5px;font-size:12px}
#sheet tr.rfold{display:none}
#sheet .tbl-wrap.open tr.rfold{display:table-row}
#sheet .rmore{display:block;width:100%;border:0;border-top:1px solid var(--line);background:var(--panel-2);color:var(--ink-soft);font:inherit;font-size:13px;padding:8px;min-height:40px;cursor:pointer}
`;document.head.appendChild(st);})();
showResult=(o=>function(){const r=o.apply(this,arguments);try{const w=[...document.querySelectorAll('#sheet .tbl-wrap')].find(e=>e.querySelector('th')&&e.querySelector('th').textContent==='着');
  if(w){const trs=[...w.querySelectorAll('tbody tr')];let n=0;trs.forEach((tr,i)=>{if(i>=5&&!tr.classList.contains('me')){tr.classList.add('rfold');n++;}});
    if(n){const b=document.createElement('button');b.className='rmore';b.dataset.act='resMore';b.textContent=`全着順を見る（ほか${n}頭）`;w.appendChild(b);}}}catch(e){}return r;})(showResult);
ACT.resMore=(d,b)=>{const w=b.closest('.tbl-wrap');w.classList.toggle('open');b.textContent=w.classList.contains('open')?'閉じる':`全着順を見る（ほか${w.querySelectorAll('tr.rfold').length}頭）`;};
