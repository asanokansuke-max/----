/* =========================================================
   デビュー戦を物語に: before the first horse's first start the trainer talks it through (the race, the plan, who rides),
   and after any of your horses' debut the racing paper runs a short piece on it — the first horse's gets the full story.
   ========================================================= */
EV.debutTalk={r:d=>{const h=HZ(d.hid);if(!h||h.starts>0||h.status!=='現役')return null;const tr=h.trainer,tn=P(tr)?P(tr).n.split(' ')[0]:'調教師';const rs=racesFor(h).filter(r=>r.debut).map(r=>`${r.name}（${r.course} ${r.surf==='ダ'?'ダート':'芝'}${r.dist}m）`);
  return{p:tr,from:who(tr),title:`${h.name}、デビューへ`,body:`${tn}です。\n\n${h.name}、ゲート試験に受かりました。追い切りの動きも上々です。${h.temper==='気難しい'?'気の強さは相変わらずですが、走りに向かえば集中します。':''}\n\n${rs.length?`今月のメイクデビューを狙います。\n${rs.slice(0,3).join('\n')}\n`:''}\n${h.dist>=2000?'距離は長いほうがいい馬です。デビューは1800〜2000mがいいでしょう。':'まずは素直に走れる距離から使います。'}\n\n騎手はどうしますか。若い日向くんが「ぜひ乗りたい」と言ってきています。\n\n三國「…いよいよですね。${S.part===1?'お父様がご覧になったら、なんとおっしゃるか':'ここまで、長かったですね'}」`,
   ch:['「日向くんに任せよう」','「騎手は、厩舎に任せる」']};},
  f:(d,i)=>{const h=HZ(d.hid);if(!h)return '';h.debutTalked=1;if(i===0){h.mainJ='hinata';trust('hinata',6);}trust(h.trainer,3);
    return `${i===0?'日向「…ありがとうございます！ 絶対に、いい競馬をします」\n\n':''}厩舎タブで「レース」を選び、メイクデビュー戦に出走させよう。`;}};
storyTriggers=(o=>function(first){const r=o.apply(this,arguments);try{const h=S.horses.find(x=>x.first&&x.owner==='me'&&x.status==='現役'&&x.starts===0&&!x.debutTalked);
  if(h&&racesFor(h).some(r=>r.debut)&&!S.inbox.some(e=>e.type==='debutTalk'))pushEv('debutTalk',{hid:h.id});}catch(e){}return r;})(storyTriggers);
/* the paper, the month after a debut */
EV.debutNews={r:d=>({p:'mikuni',from:'競馬新聞',title:d.first?`【新馬戦】${d.name}、${d.pos===1?'デビュー勝ち':d.pos<=3?`デビュー戦${d.pos}着と好走`:`デビュー戦は${d.pos}着`}`:`新馬戦の記事に、${d.name}が載った`,
  body:`${d.y}年${d.m}月　${d.race}（${d.course}）\n\n${d.pos===1?`${d.no}番${d.name}（${d.jname}騎手）が、${d.pop}番人気に応えて${d.pop<=3?'快勝':'波乱の'}デビュー勝ち。${d.style==='追込'||d.style==='差し'?'後方から鋭く伸び、':'好位から抜け出し、'}${d.margin?`2着に${d.margin}差をつけた。`:'ゴール前で差し切った。'}`:`${d.no}番${d.name}（${d.jname}騎手）は${d.pos}着。${d.pos<=3?'最後までしぶとく脚を使い、次につながる内容。':d.pos<=8?'まだ若さを見せたが、素質の片りんはのぞかせた。':'道中から置かれ、ほろ苦いデビュー戦となった。'}`}\n\n${d.jname.split(' ')[0]}騎手「${d.pos===1?'まだ子どもっぽいところがあるのに、これだけ走る。先が楽しみです':'走りはいいものを持っています。使って良くなるはず'}」\n${d.tname}調教師「${d.pos===1?'ここは通過点。大事に育てます':'一度使って、変わってくると思います'}」${d.first?`\n\n――\n中原牧場で生まれた芦毛は、セリで誰にも手を挙げられなかった馬だ。${d.owner}オーナーは、子どもの頃に父と見た暮れの中山を、いまも覚えているという。`:''}`,
  ch:[d.first?'記事を切り抜いておく':'読んだ']}),
  f:(d,i)=>{if(d.first){S.flags.debutClip=1;try{const h=HZ(d.hid);if(h)h.bond=clamp((h.bond||0)+4,0,100);}catch(e){}return '切り抜いた記事を、手帳にはさんだ。';}return '';}};
applyRace=(o=>function(RC){const deb=(RC&&RC.order||[]).filter(f=>f.mine&&f.h&&f.h.starts===0);const r=o.apply(this,arguments);try{deb.forEach(f=>{const h=f.h;
  pushEv('debutNews',{hid:h.id,first:!!h.first,name:h.name,no:f.no,pos:f.pos,pop:f.pop,jname:f.jname||'',tname:P(h.trainer)?P(h.trainer).n.split(' ')[0]:'',style:f.used||f.style,margin:(RC.order[1]&&f.pos===1)?RC.order[1].margin:'',race:RC.race.name,course:RC.race.course,y:Y(S.t),m:M(S.t),owner:S.part===1?S.parent.name:(S.child&&S.child.name)||''});});}catch(e){}return r;})(applyRace);
