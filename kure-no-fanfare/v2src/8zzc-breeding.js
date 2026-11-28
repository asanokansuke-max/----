/* =========================================================
   生産を本物に近く:
   ・種付けしても、必ず受胎するとは限らない（若い牝馬で8割台、年を取るほど下がる）。
     受胎しなかったら翌月に知らせが来て、種付け料は戻る。春のうちなら、もう一度種付けの相談が来る
   ・受胎しても、出産までに流産・死産になることがある（数%）
   ・20歳を過ぎた繁殖牝馬は、繁殖から引退する相談が来る
   生まれた子馬には、その場で名前を付けられる（あとで付けることもできる）
   ========================================================= */
const concRate=m=>{const a=ageOf(m);return a<=12?.84:a<=15?.76:a<=18?.66:.55;};
breed=(o=>function(mare,sid){const m0=S.money;const r=o.apply(this,arguments);try{if(mare.preg&&R()>concRate(mare)){mare.preg.fail=1;mare.preg.checkT=S.t+1;mare.preg.fee=m0-S.money;}}catch(e){}return r;})(breed);
beginMonth=(o=>function(first){try{if(S&&!first){
    mine().filter(h=>h.status==='繁殖'&&h.preg).forEach(mr=>{const pg=mr.preg;
      /* not in foal: found at the check a month on; the fee comes back; in spring, another try */
      if(pg.fail&&S.t>=pg.checkT){const fee=pg.fee||0,sire=ST(pg.sire)?ST(pg.sire).n:'';S.money+=fee;mr.preg=null;if(M(S.t)<=5)mr.propY=null;pushEv('nonPreg',{hid:mr.id,sire,fee,again:M(S.t)<=5});return;}
      /* lost before the foal came */
      if(!pg.fail&&pg.due<=S.t&&!pg.lossChecked){pg.lossChecked=1;if(R()<.05){const sire=ST(pg.sire)?ST(pg.sire).n:'';mr.preg=null;mr.propY=null;pushEv('foalLoss',{hid:mr.id,sire});}}});
    /* old mares */
    mine().filter(h=>h.status==='繁殖'&&!h.preg&&ageOf(h)>=20&&!h.oldAsked).forEach(mr=>{mr.oldAsked=1;pushEv('mareOld',{hid:mr.id});});}}catch(e){console.error('breed2',e);}
  return o.apply(this,arguments);})(beginMonth);
const farmer=()=>S.part===2&&S.br&&S.br.farm==='support'?'mio':'nakahara';
EV.nonPreg={r:d=>{const mr=HZ(d.hid);if(!mr)return null;return{p:farmer(),from:who(farmer()),title:`${mr.name}、不受胎`,body:farmer()==='mio'?`${mr.name}の検査の結果が出た。\n\n澪「…残念だけど、${d.sire}の仔は宿っていませんでした。種付け料（${yen(d.fee)}）は戻ってきます」\n\n${d.again?'まだ春のうちです。もう一度、種付けの相談をしましょう。':'今年はもう時期を過ぎちゃいました。来年、また考えましょう。'}`:`${mr.name}の検査の結果が出た。\n\n中原「…残念だが、${d.sire}の仔は宿っとらんかった。種付け料（${yen(d.fee)}）は戻ってくる」\n\n${d.again?'まだ春のうちだ。もう一度、種付けの相談をしよう。':'今年はもう時期を過ぎた。来年、また考えよう。'}`,ch:['わかった']};},f:()=>''};
EV.foalLoss={r:d=>{const mr=HZ(d.hid);if(!mr)return null;return{p:farmer(),from:who(farmer()),title:`${mr.name}のこと`,body:`牧場から、静かな声で電話があった。\n\n${farmer()==='mio'?`澪「${mr.name}の仔（父 ${d.sire}）…産まれてはきたんですけど、立ち上がれなくて。お母さんは無事です。…ごめんなさい」`:`中原「${mr.name}の仔（父 ${d.sire}）…産まれてはきたが、立ち上がれなかった。母馬は無事だ。…すまん」`}\n\nこういうことも、生産の世界にはある。`,ch:['「母馬を、よろしく頼む」']};},
  f:d=>{const mr=HZ(d.hid);if(mr)mr.bond=Math.min(100,(mr.bond||0)+5);trust(farmer(),2);return '来年の春、また種付けの相談が来る。';}};
EV.mareOld={r:d=>{const mr=HZ(d.hid);if(!mr||mr.status!=='繁殖')return null;return{p:farmer(),from:who(farmer()),title:`${mr.name}も、もう${ageOf(mr)}歳`,body:`${mr.name}も、もう${ageOf(mr)}歳になった。\n\n${farmer()==='mio'?'澪「受胎もしにくくなってきました。そろそろ繁殖からは上げて、ゆっくりさせてあげませんか」':'中原「受胎もしにくくなってきた。そろそろ繁殖からは上げて、ゆっくりさせてやったらどうだ」'}`,
  ch:['繁殖から引退させ、牧場で余生を（毎月10万円）','もう少し続ける']};},
  f:(d,i)=>{const mr=HZ(d.hid);if(!mr)return '';if(i===0){mr.status='功労馬';log(`${mr.name}が繁殖を引退`);return `${mr.name}は繁殖から引退した。牧場の一番いい放牧地で、のんびり過ごす。`;}return farmer()==='mio'?'澪「わかりました。体と相談しながら、ですね」':'中原「わかった。体と相談しながらな」';}};
/* 生まれたら、すぐ名前を付けられる */
if(EV.birth){const r0=EV.birth.r,f0=EV.birth.f;EV.birth.r=d=>{const v=r0(d);if(!v)return v;return{...v,ch:['名前を付ける','名前はあとで考える']};};
  EV.birth.f=(d,i)=>{const t=f0(d,0);const h=HZ(d.hid);if(i===0&&h){h.needName=1;h.nameHint=makeName(S.kanmei);}return t;};}
ACT.nmOk=(o=>function(d){const h=HZ(d.hid),before=h&&h.name;const r=o.apply(this,arguments);try{if(h&&h.name!==before&&h.unnamed)delete h.unnamed;}catch(e){}return r;})(ACT.nmOk);
