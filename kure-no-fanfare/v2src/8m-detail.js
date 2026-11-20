/* =========================================================
   細部: スマホのメール・電話のバリエーション、騎乗停止の代役、
   調教師からの重賞・有馬記念の提案
   ========================================================= */
const vpick=(d,k,arr)=>{d[k]=d[k]??Math.floor(R()*arr.length);return arr[d[k]%arr.length];};
const anyH=()=>typeof anyHorse==='function'?anyHorse():racing();

/* ---------------- メール ---------------- */
Object.assign(MAILS,{
  trNote:{w:()=>anyH().some(h=>h.trainer)?1.4:0,mk:d=>{const h=d.hid&&HZ(d.hid)?HZ(d.hid):pick(anyH().filter(h=>h.trainer));if(!h)return null;d.hid=h.id;const tr=h.trainer,n=h.name;
    const L=tr==='togawa'?[`${n}、今朝は馬房の前で寝転んで日向ぼっこしとった。…図太い。いいことだ。`,`${n}の飼い葉、残さず食うようになった。体が一回り大きくなる。`,`${n}、併せ馬で相手をにらんで離れなかった。負けず嫌いだ。`]
      :tr==='hayase'?[`${n}、今日は厩務員さんのポケットのにんじんを見つけて離れませんでした（笑）`,`${n}の毛ヅヤ、見てください！ ピカピカです！`,`${n}、坂路の帰りに隣の子と競争しようとするんです。やる気満々です！`]
      :tr==='shibahara'?[`${n}、砂の坂路で二本目も時計が落ちなかった。スタミナはある。`,`${n}は蹄が固い。砂でも芝でも、脚元の心配は少ない。`,`${n}、ゲート練習は一発合格だ。`]
      :tr==='kitami'?[`${n}、予定どおりのメニューを消化しています。体重${(h.bw||470)}kg、良好です。`,`${n}は想定より半月早く仕上がりそうです。次走は前倒しも検討できます。`,`${n}、カイバ食いが安定しました。数字にも表れています。`]
      :[`${n}は元気です。`,`${n}、順調に乗り込んでいます。`,`${n}の様子をお知らせします。今週も変わりありません。`];
    return {from:tr,subj:vpick(d,'s',[`${n}の近況`,`${n}のこと`,`今週の${n}`,`厩舎より`]),body:vpick(d,'v',L),hid:h.id,r:[['「ありがとうございます」',()=>{trust(tr,2);return '返信を送った。';}],['「会いに行きます」',()=>{h.bond=Math.min(100,h.bond+3);trust(tr,1);return `週末、${n}の顔を見に行った。`;}]]};}},
  jkNote:{w:()=>anyH().some(h=>h.mainJ&&h.mainJ!=='stable')?1:0,mk:d=>{const h=d.hid&&HZ(d.hid)?HZ(d.hid):pick(anyH().filter(h=>h.mainJ&&h.mainJ!=='stable'));if(!h)return null;d.hid=h.id;const j=h.mainJ,n=h.name;
    return {from:j,subj:vpick(d,'s',[`${n}の件`,'次のレースのこと','乗り味のご報告']),body:vpick(d,'v',[`${n}の追い切りに乗せてもらいました。前より首の使い方がよくなっています。`,`${n}、次は${h.style==='差し'||h.style==='追込'?'もう少し後ろから':'前目で'}運びたいと考えています。ご意見あればください。`,`${n}は、乗るたびに良くなっています。楽しみにしていてください。`,`${n}とのコンビ、続けさせてもらえるとうれしいです。`]),hid:h.id,
      r:[['「頼りにしている」',()=>{trust(j,4);return `${pname(j)}から「はい！」と返信が来た。`;}],['「任せる」',()=>{trust(j,2);return '既読がついた。';}]]};}},
  farmLetter:{w:()=>P('nakahara')&&P('nakahara').met?.8:0,mk:d=>({from:S.part===2&&S.br.farm==='support'?'mio':'nakahara',subj:vpick(d,'s',['牧場から','日高は今','近況']),
    body:vpick(d,'v',[M(S.t)<=3?'こっちはまだ雪だ。放牧地の馬たちは、雪の中を走り回っとる。寒さに強い馬は、競馬でも強い。':M(S.t)<=6?'放牧地の草が伸びてきた。子馬たちが、母馬のまわりで跳ねとる。この季節が一番好きだ。':M(S.t)<=9?'夏の日高は、朝晩が涼しい。馬にはいい季節だ。夜は虫の声がうるさいくらいだ。':'紅葉が始まった。離乳の季節で、牧場はちょっと寂しい。',
      '新しい牧柵を張った。古いのは、あんたの最初の馬が子どもの頃にかじった跡がある。捨てられんな。','近所の牧場が、また一つ閉じた。…うちは、まだ続けるつもりだ。','あんたの馬の記事、新聞から切り抜いて事務所に貼っとる。'])})},
  mikuniTip:{w:()=>.9,mk:d=>({from:'mikuni',subj:vpick(d,'s',['ご参考まで','三國です','ひとつご報告']),body:vpick(d,'v',[
      '来月は開催が変わります。直線の長いコースが増えるので、差し・追込の馬にはチャンスです。','セリの相場が少し上がっています。良い1歳馬は、早めに目をつけておきましょう。',
      '騎手の皆さんへのお中元・お歳暮、私のほうで手配しておきました。','厩舎の預託料、今月分の請求書が届いています。確認しておきますね。','最近、馬主席の顔ぶれが変わってきました。若いオーナーさんが増えています。',
      '今日、事務所に花が届きました。差出人は書いてありませんでした。…どなたでしょうね。'])})},
  owners:{w:()=>(P('saotome')&&P('saotome').met)||(P('otaka')&&P('otaka').met)?.6:0,mk:d=>{const who=P('saotome')&&P('saotome').met&&(!P('otaka')||!P('otaka').met||R()<.5)?'saotome':'otaka';d.who=d.who||who;
    return {from:d.who,subj:d.who==='saotome'?vpick(d,'s',['分析レポート','先週の数字']):vpick(d,'s',['北辰より','いい酒が入った']),
      body:d.who==='saotome'?vpick(d,'v',['先週のレース、上がり3ハロンの分布が面白い形でした。スローの瞬発力勝負が増えています。','あなたの馬の過去走を分析しました。距離を200m延ばすと、数字上は伸びしろがあります。','面白い騎手を見つけました。勝率は低いが、人気薄での複勝率が異常に高い。'])
        :vpick(d,'v',['今年の当歳は出来がいい。砂の子が多い。','うちの若い衆が、あんたの馬のファンだと言っとる。','中原の親父が、たまには顔を出せと言っとったぞ。'])};}},
  season:{w:()=>[1,8,12].includes(M(S.t))?2:0,mk:d=>{const m=M(S.t);return {from:m===12?'kujo':'mikuni',subj:m===1?'新年のご挨拶':m===8?'暑中お見舞い':'歳末のご挨拶',
    body:m===1?`明けましておめでとうございます。今年もよろしくお願いいたします。\n\n今年こそ、暮れの中山で。`:m===8?'暑い日が続きます。馬も人も、夏バテには気をつけましょう。\n\n北海道の牧場には、涼しい風が吹いているそうです。':`${ownerName()}殿\n\n本年も、良い勝負をさせてもらった。来年も手加減はせんぞ。\n\n九条`};}},
  fan2:{w:()=>anyH().some(h=>h.wins>0)?.8:0,mk:d=>{const h=d.hid&&HZ(d.hid)?HZ(d.hid):pick(anyH().filter(h=>h.wins>0));if(!h)return null;d.hid=h.id;
    return {from:'fan',fromName:vpick(d,'n',['競馬場の常連より','元騎手の父を持つ者です','小学5年生','北海道のファン']),subj:`${h.name}へ`,body:vpick(d,'v',[`パドックで${h.name}を見たとき、ほかの馬と目が違うと思いました。これからも応援します。`,`${h.name}のぬいぐるみを自分で作りました。写真を送ります。`,`${h.name}の単勝馬券、ずっと財布に入れています。`,`父が昔乗っていた馬に、${h.name}の走り方がそっくりなんです。`]),hid:h.id,r:[['お礼を書く',()=>{h.fans+=200;return '返事を出した。';}],['読んで胸にしまう',()=>'大事に保存した。']]};}},
});
/* don't repeat the same kind of mail in a row */
(function(){const recent=k=>{try{return PH().mails.slice(0,6).filter(m=>m.type===k).length;}catch(e){return 0;}};Object.entries(MAILS).forEach(([k,v])=>{const w=v.w;v.w=()=>{const x=w();return x>0?x*Math.pow(.35,recent(k)):0;};});})();

/* ---------------- 電話 ---------------- */
Object.assign(CALLS,{
  jkAsk:{w:()=>anyH().some(h=>h.status==='現役'&&!h.mainJ)?1:0,setup:()=>{const h=pick(anyH().filter(h=>h.status==='現役'&&!h.mainJ));const js=jockeysAvail().filter(j=>j!=='stable');if(!h||!js.length)return null;return {who:pick(js),hid:h.id};},
    open:d=>`${V(d.who,'greet',{i:1})} 突然すみません。${HZ(d.hid).name}、まだ主戦が決まっていないと聞きました。…乗せてもらえませんか。`,
    ch:[['「お願いします」',d=>{const h=HZ(d.hid);h.mainJ=d.who;trust(d.who,8);return `${h.name}の主戦が${pname(d.who)}に決まった。`;}],['「考えさせてください」',d=>{trust(d.who,1);return '「いつでも連絡ください」';}]],miss:d=>`${pname(d.who)}から着信があった。`},
  trCamp:{w:()=>[6,7].includes(M(S.t))&&anyH().some(h=>h.status==='現役')?1.2:0,setup:()=>{const h=pick(anyH().filter(h=>h.status==='現役'));return {who:h.trainer,hid:h.id};},
    open:d=>`「${HZ(d.hid).name}のことで相談だ。夏は北海道で過ごさせるか、こっちで乗り込むか」`,
    ch:[['「北海道で涼ませる」',d=>{const h=HZ(d.hid);h.fat=Math.max(0,h.fat-25);h.cond=Math.min(5,h.cond+1);return `${h.name}は函館に移った。涼しい風で、疲れが抜けたらしい。`;}],['「厩舎で鍛える」',d=>{const h=HZ(d.hid);STATS.forEach(k=>h.st[k]=Math.min(h.cap[k],h.st[k]+.6));h.fat=Math.min(100,h.fat+10);return `${h.name}は暑さの中で乗り込んだ。少したくましくなった。`;}]],miss:d=>{trust(d.who,-1);return '調教師から着信があった。';}},
  mikuniLate:{w:()=>.6,setup:()=>({who:'mikuni',night:true}),open:()=>'「遅くにすみません。…少しだけ、お話しいいですか。今日、昔の上司から連絡がありまして」',
    ch:[['「聞くよ」',()=>{trust('mikuni',8);return '三國は、前の会社を辞めた理由を初めて話した。「…ここに来てよかったです」最後にそう言って、電話は切れた。';}],['「明日にしよう」',()=>{trust('mikuni',-1);return '「そうですね。失礼しました」';}]],miss:()=>'三國から着信があった。留守電はなかった。'},
  saotomeCall:{w:()=>P('saotome')&&P('saotome').met?.6:0,setup:()=>({who:'saotome'}),open:()=>'「早乙女です。来週のレース、あなたの馬の勝率を計算してみました。…聞きたいですか」',
    ch:[['「聞かせてください」',()=>{trust('saotome',3);const b=bestRacer();return b?`「${b.name}、${Math.round(8+R()*25)}%。…数字なんて、外れるためにあるんですけどね」`:'「…馬がいないのでは計算できませんね」';}],['「数字は見ない主義です」',()=>{trust('saotome',2);return '「ふふ。それもまた、一つの戦略です」';}]],miss:()=>'早乙女から着信があった。'},
  otakaCall:{w:()=>P('otaka')&&P('otaka').met?.6:0,setup:()=>({who:'otaka'}),open:()=>'「おう、大鷹だ。今、牧場で一杯やっとる。…あんたの声が聞きたくなってな」',
    ch:[['「付き合います」',()=>{trust('otaka',6);S.month.met=true;return '電話越しに、一時間ほど昔の名馬の話を聞いた。';}],['「また今度」',()=>{trust('otaka',1);return '「おう、またな」';}]],miss:()=>'大鷹から着信があった。'},
  tvShow:{w:()=>S.fame>25?.5:0,setup:()=>({who:'unknown',name:'テレビ局 制作部'}),open:()=>'「週末の競馬番組で、オーナーインタビューをお願いできませんか。5分ほどです」',
    ch:[['「出ます」',()=>{S.fame+=2;anyH().forEach(h=>h.fans+=600);return '番組で勝負服の話をした。放送後、厩舎に応援の手紙が増えた。';}],['「遠慮します」',()=>'「また機会があれば」']],miss:()=>'テレビ局から着信があった。'},
});
(function(){const last=k=>(S.flags.callT||{})[k];Object.entries(CALLS).forEach(([k,v])=>{const w=v.w;v.w=()=>{const x=w();if(!x)return 0;const l=last(k);return l!=null&&S.t-l<4?x*.2:x;};});})();
maybeCall=(o=>function(){const r=o.apply(this,arguments);try{if(CALL&&S){S.flags.callT=S.flags.callT||{};S.flags.callT[CALL.type]=S.t;}}catch(e){}return r;})(maybeCall);

/* ---------------- 騎乗停止: choose the substitute ---------------- */
EV.ban={r:d=>{const h=d.hid&&HZ(d.hid);if(!d.subs){d.subs=[];if(h){const race=null;for(const j of [TR(h.trainer)?.jk,...jockeysAvail().filter(x=>x!=='stable'&&x!==d.jid).sort((a,b)=>JK(b).sk-JK(a).sk)].filter((x,i,a)=>x&&x!==d.jid&&a.indexOf(x)===i)){if(d.subs.length>=3)break;if(JK(j)&&!(JK(j).ban>S.t)&&P(j).trust+10>=JK(j).need)d.subs.push(j);}}}
  return {p:d.jid,from:'三國 透',title:`${P(d.jid).n}騎手、騎乗停止`,body:`${P(d.jid).n}騎手が、先週のレースで斜行して、2か月の騎乗停止処分を受けました。${h?`\n\n${h.name}の代わりの騎手を決めましょう。停止が明けたら、${P(d.jid).n.split(' ')[0]}騎手に戻すこともできます。`:''}`,
    ch:[...d.subs.map(j=>`${P(j).n}に頼む（${typeof jTier==='function'?jTier(j):''}${JK(j).tag?'・'+JK(j).tag:''}）`),'厩舎に任せる','励ましの連絡を入れる']};},
  f:(d,i)=>{JK(d.jid).ban=S.t+2;const h=d.hid&&HZ(d.hid),subs=d.subs||[];
    if(i<subs.length&&h){const j=subs[i];h.subJ={j,until:S.t+2,back:d.jid};trust(j,4);Object.entries(S.month.orders||{}).forEach(([k,o])=>{if(+k===h.id&&o.type==='race'&&o.j===d.jid)o.j=j;});return `${h.name}は、${P(j).n}騎手が代わりに乗ることになった。${V(j,'acceptMain',{h:h.name})}`;}
    if(i===subs.length){if(h)h.subJ={j:'stable',until:S.t+2,back:d.jid};return '厩舎所属の騎手が代わりに乗ることになった。';}
    trust(d.jid,6);return `${P(d.jid).n}から返事が来た。${V(d.jid,'acceptMain',{h:'あの馬'})}`;}};
buildField=(o=>function(race,ents){(ents||[]).forEach(e=>{const s=e.h&&e.h.subJ;if(s&&s.until>S.t&&e.j===s.back){e.j=s.j;}});return o.apply(this,arguments);})(buildField);
beginMonth=(o=>function(){const r=o.apply(this,arguments);try{racing().forEach(h=>{const s=h.subJ;if(s&&S.t>=s.until){delete h.subJ;if(h.mainJ===s.back||!h.mainJ)log(`${P(s.back)?P(s.back).n:''}騎手の騎乗停止が明けた。${h.name}の主戦に戻る`);}});}catch(e){}return r;})(beginMonth);

/* ---------------- 調教師からの重賞・有馬記念の提案 ---------------- */
function trainerSuggest(){if(!S||S.part==null)return;
  for(const h of racing().filter(h=>h.status==='現役'&&h.trainer&&h.fat<55)){
    const o=S.month.orders[h.id];if(o&&o.type==='race'&&o.race&&o.race.g)continue;
    if(S.inbox.some(e=>(e.type==='g1consult')&&e.data.hid===h.id))continue;
    const tru=P(h.trainer).trust,rs=racesFor(h).filter(r=>r.g&&entryStatus(h,r).st!=='不可');
    const arima=rs.find(r=>r.key==='有馬記念');
    if(arima&&S.flags.arimaSkipY!==Y(S.t)){pushEv('g1consult',{hid:h.id,key:arima.key,arima:1});continue;}
    const sc=rs.map(r=>({r,s:ability(h,r.dist,r.surf)+randn()*Math.max(.5,(100-tru)*.05)-r.mean+(r.grade==='G1'?1.5:r.grade==='G2'?.8:.5)})).sort((a,b)=>b.s-a.s)[0];
    if(sc&&sc.s>-3.5&&(h.lastSug==null||S.t-h.lastSug>=2)){h.lastSug=S.t;pushEv('g1consult',{hid:h.id,key:sc.r.key});}}}
beginMonth=(o=>function(){const r=o.apply(this,arguments);try{trainerSuggest();}catch(e){}return r;})(beginMonth);
{const r0=EV.g1consult.r;EV.g1consult.r=d=>{const v=r0(d);if(!v)return v;const h=HZ(d.hid);
  if(d.arima)v.body=`${h.name}、有馬記念に出られます。\n\n${V(TV(h.trainer),'consult',{h:h.name,r:'有馬記念（中山芝2500m）',c:COND[h.cond-1]})}\n\n暮れの中山です。${ownerName()}さん、行きましょう。`;
  else{const race=racesFor(h).find(r=>r.key===d.key);if(race&&race.grade!=='G1')v.title=`${h.name}を${race.name}（${race.grade}）へ`;}
  return v;};}

/* ================= 故障: no sudden vanishing =================
   a career-ending injury only comes after warning signs (a fracture before, or the trainer's warning about the legs that you
   ran through); otherwise it is a fracture with time off. And when a career does end, there is a proper farewell and a choice */
injuryRoll=(o=>function(h,mult){const r=o.apply(this,arguments);if(r==='競走能力喪失'&&!(h.injHist>0||h.riskRun)){h.status='休養';h.rest=9+Math.floor(R()*3);h.injHist=(h.injHist||0)+1;return '骨折';}
  if(r==='骨折'||r==='軽い屈腱炎')h.injHist=(h.injHist||0)+1;return r;})(injuryRoll);
{const f0=EV.legWorry.f;EV.legWorry.f=(d,i)=>{const r=f0(d,i);const h=HZ(d.hid);if(h&&i!==0)h.riskRun=1;return r;};}
EV.injury.r=(o=>function(d){const v=o.apply(this,arguments);const h=HZ(d.hid);if(!v||!h||d.kind!=='競走能力喪失')return v;
  const best=h.gw&&h.gw.length?`重賞${h.gw.length}勝`:h.wins?`${h.wins}勝`:'';
  v.body+=`\n\n${h.name}は、これで競走生活を終えることになります。通算${h.starts}戦${h.wins}勝${best&&h.wins?`（${best}）`:''}。\n\n三國「…最後に、どうしてあげましょうか」`;
  v.ch=[h.sex==='牝'?'繁殖牝馬として牧場に帰す':h.gw&&h.gw.length?'種牡馬にする':'乗馬として第二の馬生へ','功労馬として中原牧場で余生を過ごさせる（毎月10万円）', '引退式をしてから送り出す'];return v;})(EV.injury.r);
EV.injury.f=(o=>function(d,i){const h=HZ(d.hid);if(!h||d.kind!=='競走能力喪失')return o.apply(this,arguments);h.mainJ=null;
  if(i===1){h.status='功労馬';log(`${h.name}が功労馬として中原牧場へ`);trust('nakahara',4);return `${h.name}は中原牧場に帰った。\n\n中原「おかえり。…ゆっくりしていけ」\n\n（牧場タブで、いつでも会いに行ける）`;}
  let t=retireHorse(h);if(i===2){h.fans+=3000;S.fame+=1;t=`最終レースのあと、${h.name}の引退式が行われた。冷たい風の中、スタンドに残った大勢のファンが名前を呼んだ。\n\n`+t;}
  return t;})(EV.injury.f);
monthlyCost=(o=>function(){return o.apply(this,arguments)+mine().filter(h=>h.status==='功労馬').length*10;})(monthlyCost);
/* 功労馬 on the farm tab */
vFarm=(o=>function(){const html=o.apply(this,arguments);const old=mine().filter(h=>h.status==='功労馬');if(!old.length)return html;
  return html+`<section class="sec"><h2>功労馬<small>中原牧場で余生を過ごす馬たち</small></h2>${old.map(h=>`<article class="panel horse farm"><div class="hhead"><button class="portrait" data-act="touch" data-hid="${h.id}" aria-label="${esc(h.name)}に会いに行く">${horseSVG(h,56)}</button><div style="min-width:0;flex:1"><h3>${esc(h.name)}</h3><div class="meta">${h.sex}${ageOf(h)}・${h.coat}　通算${h.starts}戦${h.wins}勝${h.gw.length?'　'+esc(h.gw.join('・')):''}</div></div></div><div class="cardfoot solo"><button class="btn pri2" data-act="touch" data-hid="${h.id}">会いに行く</button></div></article>`).join('')}</section>`;})(vFarm);
/* race sound, steadier:
   - the hoof and crowd sounds are made once and kept (making them at every start held up the screen for a moment)
   - on iPhone the sound can be cut off ("interrupted") when the commentary voice starts or another app plays; it is brought back whenever that happens */
(function(){
  const BUF={ac:null};
  const bufs=ac=>{if(BUF.ac===ac)return BUF;const sr=ac.sampleRate;
    const mkThud=(f0,f1,len,knock)=>{const n=Math.floor(sr*len),b=ac.createBuffer(1,n,sr),d=b.getChannelData(0);let ph=0,lp=0;
      for(let i=0;i<n;i++){const t=i/sr,e=Math.exp(-t/(len*.28));const f=f1+(f0-f1)*Math.exp(-t/.025);ph+=2*Math.PI*f/sr;lp+=((Math.random()*2-1)-lp)*.05;d[i]=Math.sin(ph)*e+lp*knock*Math.exp(-t/.008);}return b;};
    const nb=ac.createBuffer(1,sr*4,sr),nd=nb.getChannelData(0);let br=0;for(let i=0;i<nd.length;i++){br=(br+.04*(Math.random()*2-1))/1.04;nd[i]=br*4;}
    BUF.ac=ac;BUF.th=[mkThud(120,48,.16,1.2),mkThud(105,44,.18,1),mkThud(140,52,.2,1.4)];BUF.nb=nb;return BUF;};
  sndStart=function(){
    if(!SND.ac||!SND.on||SND.nodes)return;const ac=SND.ac,B=bufs(ac);
    const master=ac.createGain();master.gain.value=.7;master.connect(ac.destination);
    const comp=ac.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=4;comp.connect(master);
    const hoofBus=ac.createGain();hoofBus.gain.value=0;const hlp=ac.createBiquadFilter();hlp.type='lowpass';hlp.frequency.value=380;hoofBus.connect(hlp);hlp.connect(comp);
    const cs=ac.createBufferSource();cs.buffer=B.nb;cs.loop=true;const clp=ac.createBiquadFilter();clp.type='lowpass';clp.frequency.value=480;clp.Q.value=.3;
    const cg=ac.createGain();cg.gain.value=0;cs.connect(clp);clp.connect(cg);cg.connect(master);cs.start();
    SND.nodes={cs,cg,clp,hoofBus,th:B.th,master,next:ac.currentTime+.1};};
  // make them ahead, while nothing is moving (shortly after the game opens)
  setTimeout(()=>{try{if(SND.ac)bufs(SND.ac);}catch(e){}},2500);
  // bring the sound back whenever it has been cut off
  const wake=()=>{try{[SND.ac,AUD.ac].forEach(ac=>{if(ac&&ac.state!=='running'&&ac.state!=='closed'){const p=ac.resume();if(p&&p.catch)p.catch(()=>{});}});}catch(e){}};
  // only on a touch: bringing the sound back on its own during a race could cut off the commentary voice on iPhone
  ['touchend','click'].forEach(ev=>document.addEventListener(ev,()=>{if(window.speechSynthesis&&speechSynthesis.speaking)return;wake();},{passive:true,capture:true}));
})();
