/* =========================================================
   ・地方への移籍: 未勝利のまま中央の未勝利戦が終わった馬を、地方競馬の厩舎に預ける（手放さない。預託料は月10万円）。
     毎月のように地方で走り、2勝すれば中央の1勝クラスに戻せる。1年半たっても2勝できなければ、引退か続けるかを決める
   ・馬主どうしの付き合い（3人の馬主はどれも架空）:
     馬主協会の懇親会（春・秋）、手放したい現役馬の話、G1を勝ったときのお祝い
   ========================================================= */
const LOCAL_TRACKS=['大井','船橋','川崎','浦和','門別','名古屋','園田','高知','佐賀','金沢','笠松','盛岡'];
if(EV.misho){const f0=EV.misho.f;EV.misho.f=(d,i)=>{const h=HZ(d.hid);if(i!==1||!h)return f0(d,i);
  h.mslDone=1;h.status='地方';h.local={t:S.t,w:0,n:0,trk:pick(LOCAL_TRACKS),last:null};log(`${h.name}を地方の${h.local.trk}競馬へ移籍`);
  return `${h.name}は、${h.local.trk}競馬の厩舎に預けることになった。\n\n向こうで2勝すれば、中央の1勝クラスに戻ってこられる。地方での成績は、そのつど知らせが来る。（預託料は月10万円）`;};}
monthlyCost=(o=>function(){return o.apply(this,arguments)+mine().filter(h=>h.status==='地方').length*10;})(monthlyCost);
beginMonth=(o=>function(first){const r=o.apply(this,arguments);try{if(first)return r;mine().filter(h=>h.status==='地方'&&h.local).forEach(h=>{const L=h.local;if(S.t-L.t<1||R()>.75)return;
    L.n++;const p=clamp(.1+((h.pot||60)-55)*.013,.08,.48);const pos=R()<p?1:R()<.45?2+Math.floor(R()*2):4+Math.floor(R()*7);if(pos===1)L.w++;L.last=pos;
    if(S.rep&&S.rep.lines)S.rep.lines.push(`地方の${L.trk}で走った${h.name}、${pos}着${pos===1?`（地方${L.w}勝目）`:''}`);
    if(L.w>=2&&!L.backAsked){L.backAsked=1;pushEv('localBack',{hid:h.id});}
    else if(S.t-L.t>=18&&L.w<2&&!L.endAsked){L.endAsked=1;pushEv('localEnd',{hid:h.id});}});}catch(e){console.error('local',e);}return r;})(beginMonth);
EV.localBack={r:d=>{const h=HZ(d.hid);if(!h||h.status!=='地方')return null;const L=h.local;
  return{p:h.trainer||'mikuni',from:`${L.trk}競馬の厩舎`,title:`${h.name}、地方で2勝`,body:`${L.trk}の厩舎から連絡があった。\n\n「${h.name}、${L.n}戦目で2勝目を挙げました。中央に戻る条件を満たしています。こちらの水が合ったのか、見違えるように走るようになりましたよ」\n\n中央に戻せば、1勝クラスからの出直しになる。`,
    ch:['「中央に戻そう」','「このまま地方で走らせる」']};},
  f:(d,i)=>{const h=HZ(d.hid);if(!h)return '';if(i===1)return `${h.name}は、もうしばらく${h.local.trk}で走ることになった。`;
    h.status='現役';h.wins=Math.max(1,h.wins||0);h.cls=Math.max(2,h.cls||0);h.kakuage=0;h.fat=20;h.ev=evalHorse(h);h.localWins=(h.localWins||0)+h.local.w;const trk=h.local.trk;h.local=null;log(`${h.name}が地方から中央へ戻る`);
    if(h.trainer)trust(h.trainer,3);return `${h.name}が、中央の${P(h.trainer)?P(h.trainer).n.split(' ')[0]+'厩舎':'厩舎'}に戻ってきた。\n\n${P(h.trainer)?P(h.trainer).n.split(' ')[0]:'調教師'}「${trk}で、たくましくなって帰ってきましたね。1勝クラスから、もう一度やりましょう」`;}};
EV.localEnd={r:d=>{const h=HZ(d.hid);if(!h||h.status!=='地方')return null;const L=h.local;
  return{p:'mikuni',from:`${L.trk}競馬の厩舎`,title:`${h.name}のこれから`,body:`${L.trk}の厩舎から連絡があった。\n\n「${h.name}、${L.n}戦${L.w}勝です。よく頑張っていますが、中央に戻るのは難しいかもしれません」`,ch:['「引退させる」','「もう少し走らせる」']};},
  f:(d,i)=>{const h=HZ(d.hid);if(!h)return '';if(i===0){h.local=null;return retireHorse(h);}h.local.t=S.t;h.local.endAsked=0;return `${h.name}は、もう少し${h.local.trk}で走る。`;}};
/* 引退・去った馬の一覧で「地方」と分かるように（厩舎のカードには出ない） */
/* ---------------- 馬主どうしの付き合い ---------------- */
const OWNERS2=[
  {n:'桜井 正道',d:'建設会社の会長。馬主歴三十年の大ベテラン',party:'「若いのに、いい馬を持っとるそうじゃないか。わしも最初の一頭は、未勝利で終わったもんだ」',congrats:'「G1とは恐れ入った。三十年やって、わしはまだ一つも勝っとらん。…次は負けんぞ」',sell:'事業を息子に譲るので、持ち馬を減らすことにした'},
  {n:'早乙女 ルミ',d:'IT企業の社長。去年馬主になったばかり',party:'「はじめまして！ 馬主って、思ってたより人間関係が大事なんですね。いろいろ教えてください」',congrats:'「G1おめでとうございます！ 私、ゴール前で叫びすぎて声が出ません！」',sell:'海外の事業が忙しくなって、面倒を見きれなくなった'},
  {n:'大河内 源三',d:'箱根の老舗旅館の主人。馬は道楽',party:'「馬はええ。勝っても負けても、酒がうまい。今度、うちの旅館にも来なされ」',congrats:'「いやあ、ええもんを見せてもろうた。今夜はうちの露天で祝杯じゃな」',sell:'旅館の改装で、ちと物入りでな'}];
const ownerPick=k=>OWNERS2[Math.floor(hash(k)*OWNERS2.length)];
EV.ownerParty={r:d=>{const o=OWNERS2[d.o];return{p:'mikuni',from:'馬主協会',title:`馬主協会の懇親会（${d.season}）`,body:`馬主協会から、${d.season}の懇親会の案内が届いた。会費は10万円。\n\n三國「顔を出しておくと、いろいろな話が入ってきます。去年は、${o.n}さん（${o.d}）もいらしていました」`,ch:['参加する（10万円）','今回は欠席する']};},
  f:(d,i)=>{if(i!==0)return '三國「わかりました。欠席のお返事を出しておきます」';S.money-=10;if(S.rep)S.rep.cost+=10;S.fame=Math.min(100,(S.fame||0)+1);const o=OWNERS2[d.o];const x=R();let tail='';
    if(x<.35){const tr=pick(trainersAvail());trust(tr,3);tail=`${who(tr)}も来ていて、馬の話で盛り上がった。`;}
    else if(x<.7&&typeof FARMS!=='undefined'){const fid=pick(Object.keys(FARMS).filter(k=>!FARMS[k].noNiwa));S.farmRel=S.farmRel||{};S.farmRel[fid]=(S.farmRel[fid]||0)+1;tail=`${FARMS[fid].n}の${FARMS[fid].who}さんと知り合った。「いい仔が生まれたら、声をかけます」`;}
    else{const tr=pick(trainersAvail());trust(tr,2);tail=`帰り道、${who(tr)}から「今日は来てくださってよかった」と電話があった。`;}
    return `ホテルの宴会場には、大勢の馬主が集まっていた。\n\n${o.n}さん${o.party}\n\n${tail}`;}};
EV.ownerSell={r:d=>{const o=OWNERS2[d.o];return{p:'mikuni',from:o.n,title:`${o.n}さんから、馬を譲りたいという話`,body:`${o.n}さん（${o.d}）から連絡があった。\n\n「${o.sell}。持ち馬の${d.name}（${d.sex}${d.age}・${d.wins}勝・${d.style}）を、信頼できる人に譲りたい。${yen(d.price)}でどうだろう」\n\n三國「現役の馬なので、すぐに走らせられます。預け先は${who(d.tr)}厩舎です」`,ch:[`譲ってもらう（${yen(d.price)}）`,'お断りする']};},
  f:(d,i)=>{const o=OWNERS2[d.o];if(i!==0)return `${o.n}さん「そうか。また何かあったら声をかけるよ」`;if(S.money<d.price)return '資金が足りなかった。';
    if(typeof stallRoom==='function'&&stallRoom(d.tr)<=0)return `${who(d.tr)}の馬房が埋まっていて、話はまとまらなかった。`;
    S.money-=d.price;if(S.rep)S.rep.cost+=d.price;const h=genHorse({by:Y(S.t)-d.age,pot:d.pot,status:'現役',owner:'me',style:d.style});h.id=S.nid++;h.name=d.name;h.sex=d.sex;h.silks=S.silks;h.trainer=d.tr;h.gateOk=1;
    h.starts=d.starts;h.wins=d.wins;h.cls=Math.min(5,1+d.wins);h.earn=d.wins*800+d.starts*60;h.st={...h.cap};h.fromOwner=o.n;h.ev=evalHorse(h);h.mode='omakase';S.horses.push(h);log(`${o.n}さんから${h.name}を${yen(d.price)}で譲り受ける`);
    return `${h.name}が、${who(d.tr)}厩舎にやってきた。\n\n${o.n}さん「大事にしてやってくれ。勝ったら、一杯おごってくれよ」`;}};
EV.ownerCongrats={r:d=>{const o=OWNERS2[d.o];return{p:'mikuni',from:o.n,title:`${o.n}さんから、お祝い`,body:`${d.horse}の${d.race}制覇の翌日、${o.n}さんから花束とメッセージが届いた。\n\n${o.n}さん${o.congrats}`,ch:['お礼の電話をする']};},
  f:d=>{S.fame=Math.min(100,(S.fame||0)+1);return `電話口の${OWNERS2[d.o].n}さんは、上機嫌だった。馬主仲間との付き合いが、少しずつ広がっていく。`;}};
beginMonth=(o=>function(first){const r=o.apply(this,arguments);try{if(first)return r;const m=M(S.t),yr=S.t-S.startT;S.flags.ownT=S.flags.ownT||{};
  if((m===3||m===11)&&yr>=5&&S.flags.ownT.party!==S.t&&R()<.6){S.flags.ownT.party=S.t;pushEv('ownerParty',{o:Math.floor(R()*OWNERS2.length),season:m===3?'春':'秋'});}
  if(yr>=8&&(S.flags.ownT.sell==null||S.t-S.flags.ownT.sell>=10)&&R()<.07){const tl=trainersAvail().filter(t=>typeof stallRoom!=='function'||stallRoom(t)>0);if(tl.length){S.flags.ownT.sell=S.t;
    const age=3+Math.floor(R()*2),wins=1+Math.floor(R()*2),starts=wins+3+Math.floor(R()*6),pot=Math.round(64+R()*14),price=Math.round(((pot-50)*(pot-50)*1.4+wins*600)/10)*10;
    pushEv('ownerSell',{o:Math.floor(R()*OWNERS2.length),name:makeName(),sex:R()<.5?'牡':'牝',age,wins,starts,pot,style:pick(['逃げ','先行','差し','追込']),price,tr:pick(tl)});}}}catch(e){console.error('owners',e);}return r;})(beginMonth);
applyRace=(o=>function(RC){const r=o.apply(this,arguments);try{const w=RC&&RC.order&&RC.order[0];if(w&&w.mine&&RC.race.grade==='G1'&&R()<.6)pushEv('ownerCongrats',{o:Math.floor(R()*OWNERS2.length),horse:w.h.name,race:RC.race.name});}catch(e){}return r;})(applyRace);
